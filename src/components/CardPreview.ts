import { cloneTemplate, ensureElement } from "../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../utils/constants";
import { IProduct } from "../types";

export class CardPreview extends Card {
    protected image: HTMLImageElement;
    protected category: HTMLElement;
    protected description: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, onAction: () => void) {
        super(cloneTemplate(template));
        this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.category = ensureElement<HTMLElement>('.card__category', this.container);
        this.description = ensureElement<HTMLElement>('.card__text', this.container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);
        
        this.button.addEventListener('click', onAction);
    }

    setImage(src: string, alt: string): void {
        this.image.src = CDN_URL + src;
        this.image.alt = alt;
    }

    setCategory(value: string): void {
        this.category.textContent = value;
        this.category.className = 'card__category ' + (categoryMap[value] || '');
    }

    setDescription(value: string): void {
        this.description.textContent = value;
    }

    setButtonText(value: string): void {
        this.button.textContent = value;
    }
    
    setButtonState(disabled: boolean): void {
        this.button.disabled = disabled;
    }

    render(data: IProduct & { buttonText?: string }): HTMLElement {
        if (data.image && data.title) this.setImage(data.image, data.title);
        if (data.category) this.setCategory(data.category);
        this.setDescription(data.description);
        
        if (data.price === null) {
            this.setButtonState(true);
            this.setButtonText('Недоступно');
        } else {
            this.setButtonState(false);
            this.setButtonText(data.buttonText || 'В корзину');
        }
        
        return super.render(data);
    }
}
