export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
// Тип для способа оплаты
export type TPayment = 'card' | 'cash' | '';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer{
    total: number; 
    items: string[]; 
} 

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}