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
  
  export interface Order {
    id: number;
    products: string[];
    total: number;
    status: string;
  }
  