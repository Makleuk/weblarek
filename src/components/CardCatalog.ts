import { cloneTemplate, ensureElement } from "../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../utils/constants";
import { IProduct } from "../types";

export class CardCatalog extends Card {
    protected image: HTMLImageElement;
    protected category: HTMLElement;

    constructor(template: HTMLTemplateElement, onSelect: () => void) {
        super(cloneTemplate(template));
        this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.category = ensureElement<HTMLElement>('.card__category', this.container);
        
        this.container.addEventListener('click', onSelect);
    }

    setImage(src: string, alt: string): void {
        this.image.src = CDN_URL + src;
        this.image.alt = alt;
    }

    setCategory(value: string): void {
        this.category.textContent = value;
        this.category.className = 'card__category ' + (categoryMap[value] || '');
    }

    render(data: IProduct): HTMLElement {
        if (data.image && data.title) this.setImage(data.image, data.title);
        if (data.category) this.setCategory(data.category);
        return super.render(data);
    }
}