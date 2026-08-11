import { IBuyer, TPayment, FormErrors } from '../types/index';
import { IEvents } from './base/Events';

export class BuyerModel {
    private _payment: TPayment = '';
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setPayment(payment: TPayment): void {
        this._payment = payment;
        this.events.emit('buyer:changed', this.getData());
    }

    setAddress(address: string): void {
        this._address = address;
        this.events.emit('buyer:changed', this.getData());
    }

    setEmail(email: string): void {
        console.log('BuyerModel setEmail:', email); // Для отладки
        this._email = email;
        this.events.emit('buyer:changed', this.getData());
    }

    setPhone(phone: string): void {
        console.log('BuyerModel setPhone:', phone); // Для отладки
        this._phone = phone;
        this.events.emit('buyer:changed', this.getData());
    }
    
    updateOrderData(data: { payment?: TPayment; address?: string }): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        this.events.emit('buyer:changed', this.getData());
    }
    
    updateContactsData(data: { email?: string; phone?: string }): void {
        console.log('updateContactsData BEFORE:', { email: this._email, phone: this._phone });
        console.log('updateContactsData DATA:', data);
        
        if (data.email !== undefined) {
            this._email = data.email;
            console.log('Email updated to:', this._email);
        }
        if (data.phone !== undefined) {
            this._phone = data.phone;
            console.log('Phone updated to:', this._phone);
        }
        
        console.log('updateContactsData AFTER:', { email: this._email, phone: this._phone });
        this.events.emit('buyer:changed', this.getData());
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone,
        };
    }

    clear(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
        this.events.emit('buyer:changed', this.getData());
    }
    
    validateOrder(): FormErrors {
        const errors: FormErrors = {};
        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this._address.trim()) {
            errors.address = 'Введите адрес доставки';
        }
        return errors;
    }
    
    validateContacts(): FormErrors {
        console.log('validateContacts called with:', { email: this._email, phone: this._phone });
        const errors: FormErrors = {};
        if (!this._email || !this._email.trim()) {
            errors.email = 'Введите email';
            console.log('Email validation failed');
        }
        if (!this._phone || !this._phone.trim()) {
            errors.phone = 'Введите номер телефона';
            console.log('Phone validation failed');
        }
        console.log('validateContacts result:', errors);
        return errors;
    }
    
    validate(): FormErrors {
        return {
            ...this.validateOrder(),
            ...this.validateContacts()
        };
    }
}