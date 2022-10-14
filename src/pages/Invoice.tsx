import React, { useEffect, useState } from 'react';
import { Client, InvoiceInfo } from '../models/Invoices';
import axios from 'axios';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

export function Invoice() {

  const { id: invoiceId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isValidating, isSubmitted },
    control
  } = useForm<InvoiceInfo>({
    mode: 'onChange'
  });

  const {
    fields, remove, append
  } = useFieldArray({
    name: 'items',
    control
  });

  const [invoice, setInvoice] = useState<InvoiceInfo | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const total = watch('items')?.reduce((tot, item) => tot + item?.price!, 0) || 0;

  // Quando cambia "invoice", resetta il form con quella corrente
  useEffect(() => {
    if (invoice) {
      reset(invoice);
    }
  }, [invoice])

  useEffect(() => {
    setInvoice(null);

    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      axios.get<InvoiceInfo>('http://localhost:3001/invoices/' + invoiceId, { signal }),
      axios.get<Client[]>('http://localhost:3001/clients', { signal })
    ]).then(([invoice, clients]) => {
      setInvoice(invoice.data);
      setClients(clients.data);
    });

    return () => {
      controller.abort();
    }
  }, [invoiceId])

  const onSubmit = (data: any) => {
    console.log(data)
    axios.put('http://localhost:3001/invoices/' + invoiceId, data).then(() => {
      navigate('/invoices/' + invoiceId + '?update=true');
    })
  }

  const deleteInvoice = () => {
    axios.delete('http://localhost:3001/invoices/' + invoiceId).then(() => {
      navigate('/invoices?delete=' + invoiceId);
    })
  }

  return !invoice ? <p>Loading...</p> : (
      <form onSubmit={handleSubmit(onSubmit)} className={isSubmitted ? 'was-validated' : ''}>
        <h3 className="mt-3">Invoice</h3>
        <input
            type="text" placeholder="Title" className="form-control w-100"
            {...register('title', { required: true, minLength: 3 })}
        />
        {errors.title?.type === 'required' && "Title is required."}
        {errors.title?.type === 'minLength' && "Title should be min 3 chars."}
        <select
          className="form-select mt-2"
          {...register('clientId', {
            required: true
          })}
        >
          <option value="">Select a client</option>
          {clients.map(({ id, name }) => <option key={id} value={id}>
            {name}
          </option>)}
        </select>
        {errors.clientId?.type === 'required' && "Client is required."}

        <h5 className="mt-3">Items</h5>
        <button
            type="button"
            className="btn btn-success btn-sm mb-2"
            onClick={() => append({
              id: Math.random(),
              text: '',
              price: 0
            })}
        >Add</button>
        {
          fields.map((field, i) => (
              <div className="mb-1 input-group" key={field.id}>
                <input
                    type="text" placeholder="Item"
                    className="form-control"
                    {...register(`items.${i}.text`, { required: true })}
                />
                <input
                    type="number" placeholder="Price"
                    className="form-control"
                    {...register(`items.${i}.price`, { valueAsNumber: true })}
                />
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => remove(i)}
                >Remove</button>
              </div>
          ))
        }
        <h6 className="mt-3">Total: €{total}</h6>
        <button type="submit" className="btn btn-primary m-2 d-inline-block" disabled={!isValid || isValidating}>Save</button>
        <button type="button" className="btn btn-danger m-2 d-inline-block" onClick={deleteInvoice}>Delete</button>
      </form>
  )
}
