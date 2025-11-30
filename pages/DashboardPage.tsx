
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Painel de Controle</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400">
        Esta é uma aplicação CRUD simples para demonstrar a interação entre um backend em Node.js e um banco relacional em postgre.
      </p>
      <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <p>
          Utilize a barra de navegação à esquerda para explorar as diferentes seções:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li><strong>Produtos:</strong> Crie, liste, atualize o estoque e delete produtos.</li>
          <li><strong>Fornecedores:</strong> Crie, liste e delete fornecedores.</li>
          <li><strong>Clientes:</strong> Crie, liste e atualize o telefone clientes.</li>
          <li><strong>Vendas:</strong> Registre novas vendas associadas a clientes e produtos.</li>
          <li><strong>Relatórios:</strong> Gere diversos relatórios com base nos dados do sistema.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
