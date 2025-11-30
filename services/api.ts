
import { CustomerModel, ProductModel, SalePayload, SupplierModel, CategoryModel, MethodModel, SaleModel, ItemSaleModel } from '../types';

const API_BASE_URL = 'http://localhost:3333';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  const text = await response.text();
  // Se o corpo da resposta estiver vazio, retorne nulo como um valor de sucesso convencional.
  // Isso evita erros de análise de JSON em solicitações bem-sucedidas sem conteúdo (por exemplo, 204 No Content).
  return text ? JSON.parse(text) : (null as any);
}

// Products
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getProducts = (): Promise<ProductModel[]> => fetch(`${API_BASE_URL}/Products`).then(response => handleResponse<ProductModel[]>(response));
export const createProduct = (product: Omit<ProductModel, 'product_id'>) => 
  fetch(`${API_BASE_URL}/Products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  }).then(handleResponse);
export const updateProductStock = (id: string, quantity: number) =>
  fetch(`${API_BASE_URL}/Products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  }).then(handleResponse);
export const deleteProduct = (id: string) => 
  fetch(`${API_BASE_URL}/Products/${id}`, { method: 'DELETE' }).then(handleResponse);

// Suppliers
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getSuppliers = (): Promise<SupplierModel[]> => fetch(`${API_BASE_URL}/Suppliers`).then(response => handleResponse<SupplierModel[]>(response));
export const createSupplier = (supplier: Omit<SupplierModel, 'supplier_id'>) =>
  fetch(`${API_BASE_URL}/Suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  }).then(handleResponse);
export const deleteSupplier = (id: string) =>
  fetch(`${API_BASE_URL}/Suppliers/${id}`, { method: 'DELETE' }).then(handleResponse);

// Customers
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getCustomers = (): Promise<CustomerModel[]> => fetch(`${API_BASE_URL}/Customers`).then(response => handleResponse<CustomerModel[]>(response));
export const createCustomer = (customer: Omit<CustomerModel, 'customer_id'>) =>
  fetch(`${API_BASE_URL}/Customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  }).then(handleResponse);
export const updateCustomerPhone = (id: string, new_phone: string) =>
  fetch(`${API_BASE_URL}/Customers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_phone }),
  }).then(handleResponse);
export const deleteCustomer = (id: string) =>
  fetch(`${API_BASE_URL}/Customers/${id}`, { method: 'DELETE' }).then(handleResponse);

// Sales
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getSales = (): Promise<SaleModel[]> => fetch(`${API_BASE_URL}/Sales`).then(response => handleResponse<SaleModel[]>(response));
export const createSale = (saleData: SalePayload) =>
  fetch(`${API_BASE_URL}/Sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saleData),
  }).then(handleResponse);

// ItemSales
export const getItemSales = (): Promise<ItemSaleModel[]> => fetch(`${API_BASE_URL}/ItemSales`).then(response => handleResponse<ItemSaleModel[]>(response));

// Categories & Methods
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getCategories = (): Promise<CategoryModel[]> => fetch(`${API_BASE_URL}/Categories`).then(response => handleResponse<CategoryModel[]>(response));
export const createCategory = (category: Omit<CategoryModel, 'category_id'>) => 
  fetch(`${API_BASE_URL}/Categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  }).then(handleResponse);
export const deleteCategory = (id: string) => 
  fetch(`${API_BASE_URL}/Categories/${id}`, { method: 'DELETE' }).then(handleResponse);

// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getMethods = (): Promise<MethodModel[]> => fetch(`${API_BASE_URL}/Methods`).then(response => handleResponse<MethodModel[]>(response));
export const createMethod = (method: Omit<MethodModel, 'method_id'>) => 
  fetch(`${API_BASE_URL}/Methods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(method),
  }).then(handleResponse);
export const deleteMethod = (id: string) => 
  fetch(`${API_BASE_URL}/Methods/${id}`, { method: 'DELETE' }).then(handleResponse);

// Reports
export const getReport = (url: string) => fetch(`${API_BASE_URL}${url}`).then(handleResponse);