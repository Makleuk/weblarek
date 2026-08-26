import { cloneTemplate, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

export class SuccessMessage extends Component<unknown> {
    protected description: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, events: IEvents) {
        super(cloneTemplate(template));
        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        
        this.closeButton.addEventListener('click', () => events.emit('success:close'));
    }

    setTotal(value: number): void {
        this.description.textContent = `Списано ${value} синапсов`;
    }

    render(): HTMLElement {
        return this.container;
    }
}
