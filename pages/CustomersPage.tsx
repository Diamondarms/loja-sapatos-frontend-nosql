
import React, { useState, useEffect, useCallback } from 'react';
import { getCustomers, createCustomer, deleteCustomer, updateCustomerPhone } from '../services/api';
import { CustomerModel } from '../types';
import { Modal, LoadingSpinner } from '../components/common';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', cpf: '', phone: '', cep: '' });
  const [editingCustomer, setEditingCustomer] = useState<{ id: string, phone: string }>({ id: '', phone: '' });

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      data.sort((a, b) => a.customer_id.localeCompare(b.customer_id));
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar clientes.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!newCustomer.name || !newCustomer.cpf || !newCustomer.cep) {
        alert("Nome, CPF e CEP são obrigatórios.");
        return;
    }
    if (newCustomer.cpf.length !== 11) {
        alert("CPF deve ter 11 dígitos.");
        return;
    }
    try {
      await createCustomer({ ...newCustomer, phone: newCustomer.phone || null });
      setIsModalOpen(false);
      fetchCustomers();
      setNewCustomer({ name: '', cpf: '', phone: '', cep: '' });
    } catch (err) {
      alert('Falha ao criar cliente.');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        alert('Falha ao deletar cliente.');
        console.error(err);
      }
    }
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await updateCustomerPhone(editingCustomer.id, editingCustomer.phone);
        setIsEditModalOpen(false);
        fetchCustomers();
    } catch(err) {
        alert('Falha ao atualizar telefone.');
        console.error(err);
    }
  };
  
  const openEditModal = (customer: CustomerModel) => {
    setEditingCustomer({id: customer.customer_id, phone: customer.phone || ''});
    setIsEditModalOpen(true);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Adicionar Cliente
        </button>
      </div>

      {isLoading ? <LoadingSpinner /> : error ? <p className="text-red-500">{error}</p> : (
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Nome</th>
                <th className="p-4">CPF</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">CEP</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.customer_id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4">{customer.customer_id}</td>
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4">{customer.cpf}</td>
                  <td className="p-4">{customer.phone || 'N/A'}</td>
                  <td className="p-4">{customer.cep}</td>
                  <td className="p-4 space-x-2">
                    <button onClick={() => openEditModal(customer)} className="text-yellow-600 hover:text-yellow-800">Editar Telefone</button>
                    <button onClick={() => handleDelete(customer.customer_id)} className="text-red-600 hover:text-red-800">Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title="Adicionar Novo Cliente" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Nome" value={newCustomer.name} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <input type="text" name="cpf" placeholder="CPF (11 dígitos)" value={newCustomer.cpf} onChange={handleInputChange} required maxLength={11} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <input type="text" name="cep" placeholder="CEP" value={newCustomer.cep} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <input type="text" name="phone" placeholder="Telefone (Opcional)" value={newCustomer.phone} onChange={handleInputChange} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Salvar</button>
        </form>
      </Modal>

      <Modal title="Editar Telefone" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
            <label>Novo Telefone</label>
            <input type="text" value={editingCustomer.phone} onChange={(e) => setEditingCustomer(prev => ({...prev, phone: e.target.value}))} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700"/>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Atualizar</button>
        </form>
      </Modal>
    </div>
  );
};

export default CustomersPage;