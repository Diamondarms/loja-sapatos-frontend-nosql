
import React, { useState, useEffect } from 'react';
import { getReport, getSuppliers, getProducts, getCustomers } from '../services/api';
import { SupplierModel, ProductModel, CustomerModel } from '../types';
import { Card } from '../components/common';

const ReportsPage: React.FC = () => {
    const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [customers, setCustomers] = useState<CustomerModel[]>([]);

    const [profitPeriod, setProfitPeriod] = useState({ begin_date: '', final_date: '' });
    const [profitPeriodResult, setProfitPeriodResult] = useState<any>(null);
    const [profitPeriodLoading, setProfitPeriodLoading] = useState(false);

    const [profitSupplier, setProfitSupplier] = useState({ begin_date: '', final_date: '', supplier_id: '' });
    const [profitSupplierResult, setProfitSupplierResult] = useState<any>(null);
    const [profitSupplierLoading, setProfitSupplierLoading] = useState(false);

    const [profitProduct, setProfitProduct] = useState({ id: '' });
    const [profitProductResult, setProfitProductResult] = useState<any>(null);
    const [profitProductLoading, setProfitProductLoading] = useState(false);

    const [mostUsedMethodResult, setMostUsedMethodResult] = useState<any>(null);
    const [mostUsedMethodLoading, setMostUsedMethodLoading] = useState(false);
    
    const [mostPurchasesCustomerResult, setMostPurchasesCustomerResult] = useState<any>(null);
    const [mostPurchasesCustomerLoading, setMostPurchasesCustomerLoading] = useState(false);

    const [productsByCustomer, setProductsByCustomer] = useState({ id: '' });
    const [productsByCustomerResult, setProductsByCustomerResult] = useState<any>(null);
    const [productsByCustomerLoading, setProductsByCustomerLoading] = useState(false);

    const [customersByProduct, setCustomersByProduct] = useState({ id: '' });
    const [customersByProductResult, setCustomersByProductResult] = useState<any>(null);
    const [customersByProductLoading, setCustomersByProductLoading] = useState(false);

    useEffect(() => {
        getSuppliers().then(setSuppliers);
        getProducts().then(setProducts);
        getCustomers().then(setCustomers);
    }, []);

    const generateReport = async (url: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setResult: React.Dispatch<React.SetStateAction<any>>) => {
        setLoading(true);
        setResult(null);
        try {
            const data = await getReport(url);
            setResult(data);
        } catch (error) {
            console.error("Failed to generate report", error);
            setResult({ error: "Falha ao gerar relatório." });
        } finally {
            setLoading(false);
        }
    };

    const handleCustomersByProductReport = async () => {
        if (!customersByProduct.id) {
            alert("Por favor, selecione um produto.");
            return;
        }
        setCustomersByProductLoading(true);
        setCustomersByProductResult(null);
        try {
            const [customersData, profitData] = await Promise.all([
                getReport(`/Reports/product-customers/${customersByProduct.id}`),
                getReport(`/Reports/profit/product/${customersByProduct.id}`)
            ]);
    
            if (Array.isArray(customersData)) {
                const totalProfit = (Array.isArray(profitData) && profitData[0]?.total_profit) 
                    ? profitData[0].total_profit 
                    // FIX: Cast profitData to any to resolve TypeScript error on unknown type.
                    : ((profitData as any)?.profit || "0.00");

                const productName = customersData.length > 0 
                    ? customersData[0].product_name 
                    : products.find(p => p.product_id === customersByProduct.id)?.name || 'Produto desconhecido';

                setCustomersByProductResult({
                    product_name: productName,
                    customers: customersData,
                    total_profit: totalProfit
                });
            } else {
                 setCustomersByProductResult({ customers: [] });
            }
        } catch (error) {
            console.error("Failed to generate report", error);
            setCustomersByProductResult({ error: "Falha ao gerar relatório." });
        } finally {
            setCustomersByProductLoading(false);
        }
    };
    
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Relatórios</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <Card title="Lucro por Período">
                    <input type="date" value={profitPeriod.begin_date} onChange={e => setProfitPeriod({...profitPeriod, begin_date: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2"/>
                    <input type="date" value={profitPeriod.final_date} onChange={e => setProfitPeriod({...profitPeriod, final_date: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2"/>
                    <button onClick={() => generateReport(`/Reports/profit/period?begin_date=${profitPeriod.begin_date}&final_date=${profitPeriod.final_date}`, setProfitPeriodLoading, setProfitPeriodResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    {profitPeriodLoading && <p className="text-blue-500 mt-4">Gerando...</p>}
                    {profitPeriodResult && <pre className="mt-4 bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">{JSON.stringify(profitPeriodResult, null, 2)}</pre>}
                </Card>

                <Card title="Lucro por Fornecedor">
                    <input type="date" value={profitSupplier.begin_date} onChange={e => setProfitSupplier({...profitSupplier, begin_date: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2"/>
                    <input type="date" value={profitSupplier.final_date} onChange={e => setProfitSupplier({...profitSupplier, final_date: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2"/>
                    <select value={profitSupplier.supplier_id} onChange={e => setProfitSupplier({...profitSupplier, supplier_id: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2">
                        <option value="">Selecione Fornecedor</option>
                        {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>)}
                    </select>
                    <button onClick={() => generateReport(`/Reports/profit/supplier?begin_date=${profitSupplier.begin_date}&final_date=${profitSupplier.final_date}&supplier_id=${profitSupplier.supplier_id}`, setProfitSupplierLoading, setProfitSupplierResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    {profitSupplierLoading && <p className="text-blue-500 mt-4">Gerando...</p>}
                    {profitSupplierResult && <pre className="mt-4 bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">{JSON.stringify(profitSupplierResult, null, 2)}</pre>}
                </Card>

                <Card title="Lucro por Produto">
                    <select value={profitProduct.id} onChange={e => setProfitProduct({id: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2">
                        <option value="">Selecione Produto</option>
                        {products.map(p => <option key={p.product_id} value={p.product_id}>{p.name}</option>)}
                    </select>
                    <button onClick={() => generateReport(`/Reports/profit/product/${profitProduct.id}`, setProfitProductLoading, setProfitProductResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    {profitProductLoading && <p className="text-blue-500 mt-4">Gerando...</p>}
                    {profitProductResult && (
                         <div className="mt-4 text-sm bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                            {profitProductResult.error ? (
                                <p className="text-red-500">{profitProductResult.error}</p>
                            ) : (
                                <p className="font-semibold">
                                    Lucro Total: 
                                    <span className="font-bold text-green-500"> R$ {
                                        Number(
                                            (Array.isArray(profitProductResult) && profitProductResult[0]?.total_profit) 
                                            ? profitProductResult[0].total_profit 
                                            : (profitProductResult.profit || 0)
                                        ).toFixed(2).replace('.', ',')
                                    }</span>
                                </p>
                            )}
                        </div>
                    )}
                </Card>

                <Card title="Método de Pagamento Mais Usado">
                    <button onClick={() => generateReport('/Reports/method/most-used', setMostUsedMethodLoading, setMostUsedMethodResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    {mostUsedMethodLoading && <p className="text-blue-500 mt-4">Gerando...</p>}
                    {mostUsedMethodResult && (
                        <div className="mt-4 text-sm bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                            {mostUsedMethodResult.method_name ? (
                                <div>
                                    <p><strong>Método:</strong> {mostUsedMethodResult.method_name}</p>
                                    <p><strong>Vezes Usado:</strong> {mostUsedMethodResult.method_count}</p>
                                </div>
                            ) : (
                                <p>Nenhum resultado encontrado.</p>
                            )}
                        </div>
                    )}
                </Card>
                
                <Card title="Cliente com Mais Compras">
                    <button onClick={() => generateReport('/Reports/customer/most-purchases', setMostPurchasesCustomerLoading, setMostPurchasesCustomerResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    {mostPurchasesCustomerLoading && <p className="text-blue-500 mt-4">Gerando...</p>}
                    {mostPurchasesCustomerResult && (
                        <div className="mt-4 text-sm bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                            {Array.isArray(mostPurchasesCustomerResult) && mostPurchasesCustomerResult.length > 0 ? (
                                <div>
                                    <p><strong>Cliente:</strong> {mostPurchasesCustomerResult[0].customer_name}</p>
                                    <p><strong>Total de Compras:</strong> {mostPurchasesCustomerResult[0].customer_purchase_count}</p>
                                </div>
                            ) : (
                                <p>Nenhum resultado encontrado.</p>
                            )}
                        </div>
                    )}
                </Card>

                 <Card title="Produtos Comprados por Cliente">
                    <select value={productsByCustomer.id} onChange={e => setProductsByCustomer({id: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2">
                        <option value="">Selecione Cliente</option>
                        {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name}</option>)}
                    </select>
                    <button onClick={() => generateReport(`/Reports/customer-products/${productsByCustomer.id}`, setProductsByCustomerLoading, setProductsByCustomerResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    {productsByCustomerLoading && <p className="text-blue-500 mt-4">Gerando...</p>}
                    {productsByCustomerResult && (
                        <div className="mt-4 text-sm bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                            {productsByCustomerResult.error && <p className="text-red-500">{productsByCustomerResult.error}</p>}
                            {Array.isArray(productsByCustomerResult) && productsByCustomerResult.length > 0 ? (
                                <div>
                                    <h4 className="font-semibold text-base">{productsByCustomerResult[0].customer_name}</h4>
                                    <p className="font-semibold mt-3 mb-1">Produtos Comprados:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {productsByCustomerResult.map((item: any, index: number) => (
                                            <li key={index}>{item.product_name}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : !productsByCustomerResult.error && (
                                <p>Nenhum produto encontrado para este cliente.</p>
                            )}
                        </div>
                    )}
                </Card>

                <Card title="Clientes que Compraram Produto">
                    <select value={customersByProduct.id} onChange={e => setCustomersByProduct({id: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2">
                        <option value="">Selecione Produto</option>
                        {products.map(p => <option key={p.product_id} value={p.product_id}>{p.name}</option>)}
                    </select>
                    <button onClick={handleCustomersByProductReport} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    {customersByProductLoading && <p className="text-blue-500 mt-4">Gerando...</p>}
                    {customersByProductResult && (
                        <div className="mt-4 text-sm bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                            {customersByProductResult.error ? (
                                <p className="text-red-500">{customersByProductResult.error}</p>
                            ) : customersByProductResult.product_name ? (
                                <div>
                                    <h4 className="font-semibold text-base">{customersByProductResult.product_name}</h4>
                                    {customersByProductResult.customers?.length > 0 ? (
                                        <>
                                            <p className="font-semibold mt-3 mb-1">Clientes:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                {customersByProductResult.customers.map((item: any, index: number) => (
                                                    <li key={index}>{item.customer_name}</li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <p className="mt-3">Nenhum cliente comprou este produto.</p>
                                    )}
                                    <p className="font-semibold mt-3">
                                        Lucro Total Gerado: 
                                        <span className="font-bold text-green-500"> R$ {Number(customersByProductResult.total_profit || 0).toFixed(2).replace('.', ',')}</span>
                                    </p>
                                </div>
                            ) : (
                                <p>Nenhum resultado encontrado.</p>
                            )}
                        </div>
                    )}
                </Card>

            </div>
        </div>
    );
};

export default ReportsPage;