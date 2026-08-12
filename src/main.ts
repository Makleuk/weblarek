import './scss/styles.scss';
import { Api } from './components/base/Api';
import { CatalogModel } from './components/CatalogModel';
import { BasketModel } from './components/BasketModel';
import { BuyerModel } from './components/BuyerModel';
import { LarekApi } from './components/LarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const apiInstance = new Api(API_URL);
const larekApi = new LarekApi(apiInstance);

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

catalogModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalogModel.getItems());
console.log('Количество товаров:', catalogModel.getItems().length);

const product = catalogModel.getProductById('412bcf81-7e75-4e70-bdb9-d3c73c9803b7');
console.log('Товар с id "412bcf81-7e75-4e70-bdb9-d3c73c9803b7":', product);

catalogModel.setSelectedProduct(product);
console.log('Выбранный товар:', catalogModel.getSelectedProduct());

console.log('Корзина (пустая):', basketModel.getItems());
console.log('Количество товаров:', basketModel.getCount());
console.log('Общая сумма:', basketModel.getTotal());

const item1 = catalogModel.getProductById('412bcf81-7e75-4e70-bdb9-d3c73c9803b7');
const item2 = catalogModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
const item3 = catalogModel.getProductById('b06cde61-912f-4663-9751-09956c0eed67');

if (item1) basketModel.addItem(item1);
if (item2) basketModel.addItem(item2);
if (item3) basketModel.addItem(item3);

console.log('Корзина после добавления товаров:', basketModel.getItems().map(i => i.title));
console.log('Количество товаров:', basketModel.getCount());
console.log('Общая сумма:', basketModel.getTotal());

console.log('Проверка наличия товара id "412bcf81-7e75-4e70-bdb9-d3c73c9803b7":', basketModel.contains('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'));

basketModel.removeItem('412bcf81-7e75-4e70-bdb9-d3c73c9803b7');
console.log('Корзина после удаления товара:', basketModel.getItems().map(i => i.title));
console.log('Количество товаров:', basketModel.getCount());
console.log('Общая сумма:', basketModel.getTotal());

basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

buyerModel.setPayment('card');
buyerModel.setAddress('г. Москва, ул. Ленина, д. 1');
buyerModel.setEmail('test@example.com');
buyerModel.setPhone('+7 999 123-45-67');

console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация (все поля заполнены):', buyerModel.validate());

buyerModel.setPayment('');
buyerModel.setEmail('');
console.log('Валидация (есть пустые поля):', buyerModel.validate());

buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());

larekApi.getProducts()
  .then(data => {
    console.log('Данные с сервера:', data);
    console.log('Количество товаров:', data.total);
    console.log('Массив товаров:', data.items);
    
    catalogModel.setItems(data.items);
    
    console.log('Каталог после сохранения данных с сервера:', catalogModel.getItems());
    console.log('Количество товаров в каталоге:', catalogModel.getItems().length);
    
    if (catalogModel.getItems().length > 0) {
      const firstProduct = catalogModel.getItems()[0];
      console.log('Первый товар из каталога:', firstProduct);
    }
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });