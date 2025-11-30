
// Cliente
export interface CustomerModel {
    customer_id: string;
    name: string;
    cpf: string;
    phone: string | null;
    cep: string;
}

// Fornecedor
export interface SupplierModel {
    supplier_id: string;
    name: string;
    cnpj: string;
    phone: string | null;
}

// Categoria
export interface CategoryModel {
    category_id: string;
    name: string;
}

// Produto
export interface ProductModel {
    product_id: string;
    name: string;
    category_id: string;
    size: string;
    stock: number;
    sale_price: number;
    purchase_price: number;
    supplier_id: string;
}

// Venda
export interface SaleModel {
    sale_id: string;
    sale_date: string;
    customer_id: string;
}

// ItemVenda
export interface ItemSaleModel {
    item_sale_id: string;
    sale_id: string;
    product_id: string;
    quantity: number;
}

// Metodo
export interface MethodModel {
    method_id: string;
    name: string;
}

// Pagamento
export interface PaymentModel {
    payment_id: string;
    method_id: string;
    sale_id: string;
}

// Payloads
export interface ItemSalePayload {
    product_id: string;
    quantity: number;
}

export interface SalePayload {
    saleData: Omit<SaleModel, 'sale_id' | 'sale_date'>;
    items: ItemSalePayload[];
    payment_method_id: string;
}