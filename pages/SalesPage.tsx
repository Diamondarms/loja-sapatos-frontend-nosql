
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getSales, createSale, getCustomers, getProducts, getMethods, getItemSales } from '../services/api';
import { SaleModel, CustomerModel, ProductModel, ItemSalePayload, MethodModel, SalePayload, ItemSaleModel } from '../types';
import { Modal, LoadingSpinner } from '../components/common';

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<SaleModel[]>([]);
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [methods, setMethods] = useState<MethodModel[]>([]);
  const [itemSales, setItemSales] = useState<ItemSaleModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newSale, setNewSale] = useState<{ customer_id: string; payment_method_id: string; items: ItemSalePayload[] }>({
    customer_id: '',
    payment_method_id: '',
    items: [],
  });
  const [currentItem, setCurrentItem] = useState<{ product_id: string; quantity: string }>({ product_id: '', quantity: '1' });

  const fetchSales = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getSales();
      setSales(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar vendas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
    getCustomers().then(setCustomers);
    getProducts().then(setProducts);
    getMethods().then(setMethods);
    getItemSales().then(setItemSales);
  }, [fetchSales]);
  
  const salesWithDetails = useMemo(() => {
    return sales.map(sale => {
      const itemsForSale = itemSales.filter(item => item.sale_id === sale.sale_id);
      
      let total = 0;
      const purchasedItems = itemsForSale.map(currentItem => {
        const product = products.find(p => p.product_id === currentItem.product_id);
        if (product) {
          total += product.sale_price * currentItem.quantity;
          return `${product.name} (x${currentItem.quantity})`;
        }
        return `Produto desconhecido (ID: ${currentItem.product_id}) (x${currentItem.quantity})`;
      });

      return { ...sale, total, purchasedItems };
    });
  }, [sales, itemSales, products]);

  const handleAddItem = () => {
    if (!currentItem.product_id || parseInt(currentItem.quantity) <= 0) {
      alert('Selecione um produto e uma quantidade válida.');
      return;
    }
    const product = products.find(p => p.product_id === currentItem.product_id);
    if (!product || product.stock < parseInt(currentItem.quantity)) {
        alert('Estoque insuficiente para este produto.');
        return;
    }

    setNewSale(prev => ({
      ...prev,
      items: [...prev.items, { product_id: currentItem.product_id, quantity: parseInt(currentItem.quantity) }],
    }));
    setCurrentItem({ product_id: '', quantity: '1' });
  };
  
  const handleRemoveItem = (indexToRemove: number) => {
      setNewSale(prev => ({
          ...prev,
          items: prev.items.filter((_, index) => index !== indexToRemove)
      }));
  };
  
  const getProductName = (id: string) => products.find(p => p.product_id === id)?.name || 'Desconhecido';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const missingFields = [];
    if (!newSale.customer_id) missingFields.push("Cliente");
    if (newSale.items.length === 0) missingFields.push("Itens de Venda");
    if (!newSale.payment_method_id) missingFields.push("Método de Pagamento");

    if (missingFields.length > 0) {
      let msg = `Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}.`;
      
      // Validação inteligente para UX: usuário selecionou produto mas não clicou no botão +
      if (newSale.items.length === 0 && currentItem.product_id) {
          msg += "\n\nATENÇÃO: Você selecionou um produto mas não clicou no botão '+' para adicioná-lo à lista de itens.";
      }
      
      alert(msg);
      return;
    }

    const salePayload: SalePayload = {
        saleData: {
            customer_id: newSale.customer_id
        },
        items: newSale.items,
        payment_method_id: newSale.payment_method_id
    }

    try {
      await createSale(salePayload);
      setIsModalOpen(false);
      fetchSales();
      getProducts().then(setProducts); // Re-fetch products to update stock info
      getItemSales().then(setItemSales); // Re-fetch items
      setNewSale({ customer_id: '', payment_method_id: '', items: [] });
    } catch (err) {
      alert('Falha ao criar venda.');
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendas</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Nova Venda
        </button>
      </div>

      {isLoading ? <LoadingSpinner /> : error ? <p className="text-red-500">{error}</p> : (
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
              <tr>
                <th className="p-4">ID Venda</th>
                <th className="p-4">Data</th>
                <th className="p-4">Nome Cliente</th>
                <th className="p-4">Itens Comprados</th>
                <th className="p-4">Preço Total</th>
              </tr>
            </thead>
            <tbody>
              {salesWithDetails.map(sale => {
                  const customer = customers.find(c => c.customer_id === sale.customer_id);
                  return (
                    <tr key={sale.sale_id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-4">{sale.sale_id}</td>
                      <td className="p-4">{new Date(sale.sale_date).toLocaleString('pt-BR')}</td>
                      <td className="p-4">{customer ? customer.name : 'Desconhecido'}</td>
                      <td className="p-4">
                        <ul className="list-disc list-inside">
                          {sale.purchasedItems.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 font-medium">R$ {sale.total.toFixed(2).replace('.', ',')}</td>
                    </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal title="Registrar Nova Venda" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente</label>
            <select value={newSale.customer_id} onChange={e => setNewSale(p => ({ ...p, customer_id: e.target.value }))} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700">
                <option value="">Selecione o Cliente</option>
                {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name}</option>)}
            </select>
          </div>

          <div className="p-4 border rounded border-slate-300 dark:border-slate-600">
            <h3 className="font-semibold mb-2">Itens da Venda</h3>
            <div className="flex gap-2 items-center mb-2">
              <select value={currentItem.product_id} onChange={e => setCurrentItem(p => ({ ...p, product_id: e.target.value }))} className="flex-grow p-2 border rounded bg-slate-200 dark:bg-slate-700">
                <option value="">Selecione um Produto</option>
                {products.map(p => <option key={p.product_id} value={p.product_id}>{p.name} (Estoque: {p.stock})</option>)}
              </select>
              <input type="number" min="1" value={currentItem.quantity} onChange={e => setCurrentItem(p => ({ ...p, quantity: e.target.value }))} className="w-20 p-2 border rounded bg-slate-200 dark:bg-slate-700" />
              <button type="button" onClick={handleAddItem} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded" title="Adicionar item à lista">+</button>
            </div>
            
            {newSale.items.length === 0 ? (
                <p className="text-slate-500 italic text-sm p-2 text-center bg-slate-100 dark:bg-slate-900 rounded">Nenhum item adicionado à venda.</p>
            ) : (
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                {newSale.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center bg-slate-200 dark:bg-slate-700 p-2 rounded">
                    <span>{getProductName(item.product_id)}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Qtd: {item.quantity}</span>
                        <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 text-sm font-bold px-2">&times;</button>
                    </div>
                    </li>
                ))}
                </ul>
            )}
          </div>
          
           <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Método de Pagamento</label>
            <select value={newSale.payment_method_id} onChange={e => setNewSale(p => ({ ...p, payment_method_id: e.target.value }))} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700">
                <option value="">Selecione o Método de Pagamento</option>
                {methods.map(m => <option key={m.method_id} value={m.method_id}>{m.name}</option>)}
            </select>
           </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Finalizar Venda</button>
        </form>
      </Modal>
    </div>
  );
};

export default SalesPage;
