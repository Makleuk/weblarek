import { cloneTemplate } from "../utils/utils";
import { Form } from "./Form";
import { IBuyer } from "../types";

export class OrderForm extends Form<Partial<IBuyer>> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;
    private onChangeCallback: (data: Partial<IBuyer>) => void;
    private onSubmitCallback: () => void;

    constructor(template: HTMLTemplateElement, onChange: (data: Partial<IBuyer>) => void, onSubmit: () => void) {
        super(cloneTemplate(template) as HTMLFormElement);
        this.onChangeCallback = onChange;
        this.onSubmitCallback = onSubmit;
        this.paymentButtons = this.container.querySelectorAll('.order__buttons button');
        this.addressInput = this.inputs['address'];
        
        this.paymentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.onChangeCallback({ payment: btn.name as IBuyer['payment'] });
            });
        });
        
        if (this.addressInput) {
            this.addressInput.addEventListener('input', () => {
                this.onChangeCallback({ address: this.addressInput?.value });
            });
        }
    }
    
    protected onSubmit(): void {
        this.onSubmitCallback();
    }
    
    set errors(errors: Record<string, string>) {
        super.errors = errors;
    }

    render(data?: Partial<IBuyer>): HTMLElement {
        if (data) {
            if (data.address !== undefined && this.addressInput) {
                this.addressInput.value = data.address;
            }
            
            this.paymentButtons.forEach(btn => {
                btn.classList.toggle('button_alt-active', btn.name === data.payment);
            });
        }
        return this.container;
    }
    
}
