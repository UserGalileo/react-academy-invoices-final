import { useEffect, useState } from "react"
import { InvoiceInfo } from "../models/Invoices";
import axios from 'axios';
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';

export function Invoices() {
  const [invoiceList, setInvoiceList] = useState<InvoiceInfo[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const deleteId = searchParams.get('delete');
  const toBeUpdated = searchParams.get('update');

  useEffect(() => {
    fetchInvoices();
  }, [])

  useEffect(() => {
    if (deleteId) {
      const newInvoiceList = invoiceList.filter(i => i.id !== +deleteId);
      setInvoiceList(newInvoiceList);
      setSearchParams({});
    }
  }, [deleteId]);

  useEffect(() => {
    const needsUpdate = toBeUpdated === 'true';
    if (needsUpdate) {
      fetchInvoices();
      setSearchParams({});
    }
  }, [toBeUpdated])

  const fetchInvoices = () => {
    axios.get<InvoiceInfo[]>('http://localhost:3001/invoices').then(res => {
      setInvoiceList(res.data);
    })
  }

  const newInvoice = () => {
    axios.post<InvoiceInfo>('http://localhost:3001/invoices', {
      title: 'New invoice',
      clientId: '',
      items: []
    }).then(res => {
      setInvoiceList([...invoiceList, res.data]);
      navigate('/invoices/' + res.data.id);
    })
  }

  return <div>
    <b>Invoices</b>
    <ul className="list-group">
      {
        invoiceList.map(invoice => (
          <NavLink
            key={invoice.id}
            to={'/invoices/' + invoice.id}
            className={({ isActive }) => "list-group-item " + (isActive ? 'active' : '')}
          >{invoice.title}</NavLink>
        ))
      }
    </ul>
    <button type="button" className="btn btn-success btn-sm mt-2" onClick={newInvoice}>Add</button>
    <Outlet />
  </div>
}
