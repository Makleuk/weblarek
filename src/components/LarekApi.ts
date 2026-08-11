import { IApi, IOrder, IOrderResult, IProductsResponse } from '../types';

export class LarekApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProducts(): Promise<IProductsResponse> {
    return this._api.get('/product');
  }

  async createOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post('/order', order);
  }
}