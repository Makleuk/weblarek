import { IBuyer, TPayment, TBuyerErrors } from '../types/index'

export class BuyerModel {
  private _payment: TPayment = '';
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  setPayment(payment: TPayment): void {
    this._payment = payment;
  }

  setAddress(address: string): void {
    this._address = address;
  }

  setEmail(email: string): void {
    this._email = email;
  }

  setPhone(phone: string): void {
    this._phone = phone;
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
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this._payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this._address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this._email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this._phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}