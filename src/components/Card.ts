import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IProduct } from "../types";

export abstract class Card extends Component<IProduct> {
    protected title: HTMLElement;
    protected price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.title = ensureElement<HTMLElement>('.card__title', container);
        this.price = ensureElement<HTMLElement>('.card__price', container);
    }

    setTitle(value: string): void {
        this.title.textContent = value;
    }

    setPrice(value: number | null): void {
        this.price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }

    render(data: Partial<IProduct>): HTMLElement {
        if (data.title) this.setTitle(data.title);
        if (data.price !== undefined) this.setPrice(data.price);
        return this.container;
    }
}