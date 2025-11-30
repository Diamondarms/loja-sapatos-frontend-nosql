
import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory, getMethods, createMethod, deleteMethod } from '../services/api';
import { CategoryModel, MethodModel } from '../types';
import { LoadingSpinner } from '../components/common';

const SettingsPage: React.FC = () => {
    // State for Categories
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    
    // State for Methods
    const [methods, setMethods] = useState<MethodModel[]>([]);
    const [newMethodName, setNewMethodName] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [cats, mets] = await Promise.all([getCategories(), getMethods()]);
            setCategories(cats.sort((a,b) => a.category_id.localeCompare(b.category_id)));
            setMethods(mets.sort((a,b) => a.method_id.localeCompare(b.method_id)));
        } catch (e) {
            console.error(e);
            alert("Erro ao carregar configurações");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newCategoryName) return;
        try {
            await createCategory({ name: newCategoryName });
            setNewCategoryName('');
            fetchData();
        } catch(e) { alert("Erro ao criar categoria"); }
    };

    const handleDeleteCategory = async (id: string) => {
        if(!confirm("Tem certeza que deseja deletar esta categoria?")) return;
        try {
            await deleteCategory(id);
            fetchData();
        } catch(e) { alert("Erro ao deletar categoria"); }
    };

    const handleAddMethod = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newMethodName) return;
        try {
            await createMethod({ name: newMethodName });
            setNewMethodName('');
            fetchData();
        } catch(e) { alert("Erro ao criar método"); }
    };

    const handleDeleteMethod = async (id: string) => {
        if(!confirm("Tem certeza que deseja deletar este método?")) return;
        try {
            await deleteMethod(id);
            fetchData();
        } catch(e) { alert("Erro ao deletar método"); }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="p-8">
             <h1 className="text-3xl font-bold mb-6">Configurações</h1>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Categories Section */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Categorias</h2>
                    <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            placeholder="Nova Categoria" 
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            className="flex-1 p-2 border rounded bg-slate-200 dark:bg-slate-700"
                            required
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold">Adicionar</button>
                    </form>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-200 dark:bg-slate-700 uppercase">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Nome</th>
                                    <th className="p-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(c => (
                                    <tr key={c.category_id} className="border-b dark:border-slate-700">
                                        <td className="p-3">{c.category_id}</td>
                                        <td className="p-3">{c.name}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => handleDeleteCategory(c.category_id)} className="text-red-600 hover:text-red-800">Deletar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Methods Section */}
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Métodos de Pagamento</h2>
                     <form onSubmit={handleAddMethod} className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            placeholder="Novo Método" 
                            value={newMethodName}
                            onChange={e => setNewMethodName(e.target.value)}
                            className="flex-1 p-2 border rounded bg-slate-200 dark:bg-slate-700"
                            required
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold">Adicionar</button>
                    </form>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-200 dark:bg-slate-700 uppercase">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Nome</th>
                                    <th className="p-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {methods.map(m => (
                                    <tr key={m.method_id} className="border-b dark:border-slate-700">
                                        <td className="p-3">{m.method_id}</td>
                                        <td className="p-3">{m.name}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => handleDeleteMethod(m.method_id)} className="text-red-600 hover:text-red-800">Deletar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default SettingsPage;