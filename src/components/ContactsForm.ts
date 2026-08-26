import { cloneTemplate } from "../utils/utils";
import { Form } from "./Form";
import { IBuyer } from "../types";

export class ContactsForm extends Form<Partial<IBuyer>> {
    private onChangeCallback: (data: Partial<IBuyer>) => void;
    private onSubmitCallback: () => void;
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(template: HTMLTemplateElement, onChange: (data: Partial<IBuyer>) => void, onSubmit: () => void) {
        super(cloneTemplate(template) as HTMLFormElement);
        this.onChangeCallback = onChange;
        this.onSubmitCallback = onSubmit;
        
        this.emailInput = this.inputs['email'];
        this.phoneInput = this.inputs['phone'];
        
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => {
                this.onChangeCallback({ email: this.emailInput?.value });
            });
        }
        
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', () => {
                this.onChangeCallback({ phone: this.phoneInput?.value });
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
            if (data.email !== undefined && this.emailInput) {
                this.emailInput.value = data.email;
            }
            if (data.phone !== undefined && this.phoneInput) {
                this.phoneInput.value = data.phone;
            }
        }
        return this.container;
    }
    
}
