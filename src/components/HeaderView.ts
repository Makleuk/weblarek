import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

export class HeaderView extends Component<unknown> {
    protected counter: HTMLElement;
    protected basketBtn: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this.basketBtn = ensureElement<HTMLButtonElement>('.header__basket', container);
        
        this.basketBtn.addEventListener('click', () => events.emit('basket:click'));
    }

    setCounter(count: number): void {
        this.counter.textContent = String(count);
        this.counter.style.display = count > 0 ? 'flex' : 'none';
    }

    render(): HTMLElement {
        return this.container;
    }
}
