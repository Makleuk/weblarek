import { Component } from "./base/Component";

export class Gallery extends Component<unknown> {
    constructor(container: HTMLElement) {
        super(container);
    }

    setItems(items: HTMLElement[]): void {
        this.container.replaceChildren(...items);
    }

    clear(): void {
        this.container.replaceChildren();
    }
}