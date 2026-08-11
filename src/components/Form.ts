import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected inputs: Record<string, HTMLInputElement> = {};

    constructor(container: HTMLFormElement) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);
        
        const inputs = container.querySelectorAll<HTMLInputElement>('input');
        inputs.forEach(input => {
            this.inputs[input.name] = input;
        });
        
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            this.onSubmit();
        });
    }
    
    protected abstract onSubmit(): void;

    updateForm(data: Partial<T>, errors: Record<string, string>): void {
        
        for (const key in data) {
            if (this.inputs[key] && data[key] !== undefined) {
                const newValue = String(data[key]);
                if (this.inputs[key].value !== newValue) {
                    this.inputs[key].value = newValue;
                }
            }
        }
        
        const errorMessages = Object.values(errors).filter(msg => msg && msg !== 'form');
        this.errorsElement.textContent = errorMessages.join('; ');
        
        const isValid = Object.keys(errors).length === 0;
        this.submitButton.disabled = !isValid;
    }
    
    setFormError(error: string): void {
        this.errorsElement.textContent = error;
    }
    
    clearErrors(): void {
        this.errorsElement.textContent = '';
    }

    render(): HTMLElement {
        return this.container;
    }
}