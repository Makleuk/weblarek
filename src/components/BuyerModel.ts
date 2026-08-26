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

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.address !== undefined) this._address = data.address;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
        this.events.emit('buyer:changed', this.getData());
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
        console.log('BuyerModel setEmail:', email);
        this._email = email;
        this.events.emit('buyer:changed', this.getData());
    }

    setPhone(phone: string): void {
        console.log('BuyerModel setPhone:', phone);
        this._phone = phone;
        this.events.emit('buyer:changed', this.getData());
    }
    
    // УДАЛИТЬ updateOrderData и updateContactsData - они не нужны
    // Вместо них используем setData или отдельные сеттеры
    
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
    
    // УДАЛИТЬ validateOrder() и validateContacts()
    // Оставить только один универсальный validate()
    validate(): FormErrors {
        const errors: FormErrors = {};
        
        // Валидация первой формы
        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this._address.trim()) {
            errors.address = 'Введите адрес доставки';
        }
        
        // Валидация второй формы
        console.log('validate called with:', { email: this._email, phone: this._phone });
        if (!this._email || !this._email.trim()) {
            errors.email = 'Введите email';
            console.log('Email validation failed');
        }
        if (!this._phone || !this._phone.trim()) {
            errors.phone = 'Введите номер телефона';
            console.log('Phone validation failed');
        }
        
        console.log('validate result:', errors);
        return errors;
    }
}
