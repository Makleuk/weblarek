import { IProduct } from '../types/index';
import { IEvents } from './base/Events';

export class CatalogModel {
    private _items: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(products: IProduct[]): void {
        this._items = products;
        this.events.emit('catalog:changed', this._items);
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getProductById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }
    
    setSelectedProduct(id: string | null): void {
        if (id === null) {
            this._selectedProduct = null;
        } else {
            this._selectedProduct = this.getProductById(id) || null;
        }
        this.events.emit('selected:changed', this._selectedProduct);
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}