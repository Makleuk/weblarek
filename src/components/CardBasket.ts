import { cloneTemplate, ensureElement } from "../utils/utils";
import { Card } from "./Card";
import { IProduct } from "../types";

export class CardBasket extends Card {
    protected index: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, onDelete: () => void) {
        super(cloneTemplate(template));
        this.index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        this.deleteButton.addEventListener('click', onDelete);
    }

    setIndex(value: number): void {
        this.index.textContent = String(value);
    }

    render(data: IProduct & { index: number }): HTMLElement {
        this.setIndex(data.index);
        return super.render(data);
    }
}
