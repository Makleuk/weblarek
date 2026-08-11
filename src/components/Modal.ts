import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

export class Modal extends Component<unknown> {
    protected content: HTMLElement;
    protected closeBtn: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.content = ensureElement<HTMLElement>('.modal__content', container);
        this.closeBtn = ensureElement<HTMLButtonElement>('.modal__close', container);
        
        this.closeBtn.addEventListener('click', () => this.events.emit('modal:close'));
        container.addEventListener('click', (e: MouseEvent) => {
            if (e.target === container) this.events.emit('modal:close');
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.content.replaceChildren();
    }
    
    isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }
    
    getContent(): HTMLElement {
        return this.content;
    }

    setContent(content: HTMLElement): void {
        this.content.replaceChildren(content);
    }

    render(): HTMLElement {
        return this.container;
    }
}