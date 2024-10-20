export interface APIProduct {
    id: number;
    name: string;
    price: number;
    stock: number;
    sale: number | null;
    image: string;
  }
  
  export interface SelectedProduct extends APIProduct {
    quantity: number;
  }
  
  export interface OrderProduct {
    product_id: number;
    name: string;
    quantity: number;
    subtotal: number;
  }
  
  export interface Order {
    order_id: number;
    client_id: number;
    total: number;
    products: OrderProduct[];
  }

  export interface RechargeResponse {
    message: string;
    qr_filename: string;
  }
  