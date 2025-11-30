
import React, { useState, useEffect, useCallback } from 'react';
import { getSuppliers, createSupplier, deleteSupplier } from '../services/api';
import { SupplierModel } from '../types';
import { Modal, LoadingSpinner } from '../components/common';

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', cnpj: '', phone: '' });

  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getSuppliers();
      data.sort((a, b) => a.supplier_id.localeCompare(b.supplier_id));
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar fornecedores.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!newSupplier.name || !newSupplier.cnpj) {
        alert("Nome e CNPJ são obrigatórios.");
        return;
    }
    if (newSupplier.cnpj.length !== 14) {
        alert("CNPJ deve ter 14 dígitos.");
        return;
    }
    try {
      await createSupplier({ ...newSupplier, phone: newSupplier.phone || null });
      setIsModalOpen(false);
      fetchSuppliers();
      setNewSupplier({ name: '', cnpj: '', phone: '' });
    } catch (err) {
      alert('Falha ao criar fornecedor.');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este fornecedor?')) {
      try {
        await deleteSupplier(id);
        fetchSuppliers();
      } catch (err) {
        alert('Falha ao deletar fornecedor.');
        console.error(err);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Adicionar Fornecedor
        </button>
      </div>

      {isLoading ? <LoadingSpinner /> : error ? <p className="text-red-500">{error}</p> : (
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Nome</th>
                <th className="p-4">CNPJ</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier.supplier_id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4">{supplier.supplier_id}</td>
                  <td className="p-4">{supplier.name}</td>
                  <td className="p-4">{supplier.cnpj}</td>
                  <td className="p-4">{supplier.phone || 'N/A'}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(supplier.supplier_id)} className="text-red-600 hover:text-red-800">Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title="Adicionar Novo Fornecedor" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Nome" value={newSupplier.name} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <input type="text" name="cnpj" placeholder="CNPJ (14 dígitos)" value={newSupplier.cnpj} onChange={handleInputChange} required maxLength={14} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <input type="text" name="phone" placeholder="Telefone (Opcional)" value={newSupplier.phone} onChange={handleInputChange} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Salvar</button>
        </form>
      </Modal>
    </div>
  );
};

export default SuppliersPage;