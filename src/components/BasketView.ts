import { ensureElement, cloneTemplate } from "../utils/utils";
import { Component } from "./base/Component";

export class BasketView extends Component<unknown> {
    protected list: HTMLElement;
    protected totalElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, onCheckout: () => void) {
        super(cloneTemplate(template));
        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__actions .button', this.container);
        
        this.button.addEventListener('click', onCheckout);
        this.button.disabled = true;
    }

    updateView(items: HTMLElement[], total: number): void {
        this.list.replaceChildren(...items);
        this.totalElement.textContent = `${total} синапсов`;
        this.button.disabled = items.length === 0;
    }
}
