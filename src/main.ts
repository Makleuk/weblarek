import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { CatalogModel } from './components/CatalogModel';
import { BasketModel } from './components/BasketModel';
import { BuyerModel } from './components/BuyerModel';
import { Modal } from './components/Modal';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { CardBasket } from './components/CardBasket';
import { BasketView } from './components/BasketView';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { SuccessMessage } from './components/SuccessMessage';
import { Gallery } from './components/Gallery';
import { HeaderView } from './components/HeaderView';
import { API_URL } from './utils/constants';
import { IProduct, IOrder, IBuyer } from './types';

const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const modal = new Modal(document.querySelector('.modal')!, events);
const gallery = new Gallery(document.querySelector('.gallery')!);
const header = new HeaderView(document.querySelector('.header')!, events);

const basketView = new BasketView(
    document.querySelector('#basket')! as HTMLTemplateElement,
    () => events.emit('basket:checkout')
);

const previewCard = new CardPreview(
    document.querySelector('#card-preview')! as HTMLTemplateElement,
    () => events.emit('card:action')
);

const orderForm = new OrderForm(
    document.querySelector('#order')! as HTMLTemplateElement,
    (data) => buyerModel.updateOrderData(data),
    () => events.emit('order:submit')
);

const contactsForm = new ContactsForm(
    document.querySelector('#contacts')! as HTMLTemplateElement,
    (data) => buyerModel.updateContactsData(data),
    () => events.emit('contacts:submit')
);

const successMessage = new SuccessMessage(
    document.querySelector('#success')! as HTMLTemplateElement,
    events
);

function updateBasketView(): void {
    const items = basketModel.getItems();
    const cardElements = items.map((item, index) => {
        const card = new CardBasket(
            document.querySelector('#card-basket')! as HTMLTemplateElement,
            () => events.emit('basket:remove', { id: item.id })
        );
        return card.render({ ...item, index: index + 1 });
    });
    basketView.updateView(cardElements, basketModel.getTotal());
}

events.on('catalog:changed', (items: IProduct[]) => {
    const cardElements = items.map(product => {
        const card = new CardCatalog(
            document.querySelector('#card-catalog')! as HTMLTemplateElement,
            () => catalogModel.setSelectedProduct(product.id)
        );
        return card.render(product);
    });
    gallery.setItems(cardElements);
});

events.on('selected:changed', (product: IProduct | null) => {
    if (!product) return;
    
    const isInBasket = basketModel.contains(product.id);
    const cardElement = previewCard.render({
        ...product,
        buttonText: isInBasket ? 'Удалить из корзины' : 'В корзину'
    });
    modal.setContent(cardElement);
    modal.open();
});

events.on('basket:changed', () => {
    header.setCounter(basketModel.getCount());
    updateBasketView();
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

events.on('card:action', () => {
    const product = catalogModel.getSelectedProduct();
    if (!product) return;
    
    if (basketModel.contains(product.id)) {
        basketModel.removeItem(product.id);
    } else {
        if (product.price === null) return;
        basketModel.addItem(product);
    }
    
    const isInBasket = basketModel.contains(product.id);
    const cardElement = previewCard.render({
        ...product,
        buttonText: isInBasket ? 'Удалить из корзины' : 'В корзину'
    });
    modal.setContent(cardElement);
});

events.on('buyer:changed', (data: IBuyer) => {
    orderForm.updateForm(data, buyerModel.validateOrder());
    contactsForm.updateForm(data, buyerModel.validateContacts());
});

events.on('basket:click', () => {
    modal.setContent(basketView.render());
    modal.open();
});

events.on('basket:checkout', () => {
    buyerModel.clear();
    modal.setContent(orderForm.render());
    modal.open();
    orderForm.updateForm(buyerModel.getData(), buyerModel.validateOrder());
});

events.on('order:submit', () => {
    const errors = buyerModel.validateOrder();
    
    if (Object.keys(errors).length > 0) {
        orderForm.updateForm(buyerModel.getData(), errors);
        return;
    }
    
    modal.setContent(contactsForm.render());
    contactsForm.updateForm(buyerModel.getData(), buyerModel.validateContacts());
});

events.on('contacts:submit', () => {
    const errors = buyerModel.validateContacts();
    
    if (Object.keys(errors).length > 0) {
        contactsForm.updateForm(buyerModel.getData(), errors);
        return;
    }
    
    const buyerData = buyerModel.getData();
    const order: IOrder = {
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        items: basketModel.getItems().map(item => item.id),
        total: basketModel.getTotal()
    };
    
    larekApi.createOrder(order)
        .then((result) => {
            successMessage.setTotal(result.total);
            modal.setContent(successMessage.render());
            basketModel.clear();
            buyerModel.clear();
        })
        .catch((error) => {
            contactsForm.setFormError('Произошла ошибка при оформлении заказа');
        });
});

events.on('modal:close', () => {
    modal.close();
});

events.on('success:close', () => {
    modal.close();
});

larekApi.getProducts()
    .then((data) => {
        catalogModel.setItems(data.items);
    })
    .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error);
    });