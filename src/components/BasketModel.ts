import { IProduct } from "../types";
import { IEvents } from "./base/Events";

export class BasketModel {
    private _items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        if (!this.contains(product.id)) {
            this._items.push(product);
            this.events.emit('basket:changed', { 
                items: this._items, 
                total: this.getTotal() 
            });
        }
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
        this.events.emit('basket:changed', { 
            items: this._items, 
            total: this.getTotal() 
        });
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed', { 
            items: this._items, 
            total: 0 
        });
    }

    getTotal(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price ?? 0);
        }, 0);
    }

    getCount(): number {
        return this._items.length;
    }

    contains(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}