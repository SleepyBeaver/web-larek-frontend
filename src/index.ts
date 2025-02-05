import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Data } from './components/models/data';
import { Card } from './components/interface/card';
import { ensureElement } from './utils/utils';
import { ApiModel } from './components/models/api';
import { IItem } from './types';
import { CardPreview } from './components/interface/cardPreview';
import { Modal } from './components/interface/modal';
import { Basket } from './components/interface/basket';
import { BasketModel } from './components/models/basket';
import { BasketItem } from './components/interface/basketItem';

const cardCatalog = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreview = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasket = document.querySelector('#card-basket') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new Data(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel();


events.on('productCards:receive', () => {
  dataModel.productList.forEach(item => {
    const card = new Card(cardCatalog, events, { onClick: () => events.emit('card:select', item) });
    const renderedCard = card.render(item);
    ensureElement<HTMLElement>('.gallery').append(renderedCard);
  });
});

events.on('card:select', (item: IItem) => { 
  dataModel.previewProduct(item) 
});

events.on('modalCard:open', (item: IItem) => {
  const Preview = new CardPreview(cardPreview, events)
  modal.content = Preview.render(item);
  modal.render();
});

events.on('card:addBasket', () => {
  basketModel.addProductToBasket(dataModel.selectedProduct);
  basket.updateHeaderCartCounter(basketModel.getProductCount());
  modal.close();
});

events.on('basket:open', () => {
  basket.updateTotalPrice(basketModel.getTotalPrice());
  let i = 0;
  basket.basketItems = basketModel.productsInBasket.map((item) => {
    const basketItem = new BasketItem(cardBasket, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
  modal.content = basket.render();
  modal.render();
});

events.on('basket:basketItemRemove', (item: IItem) => {
  basketModel.removeProductFromBasket(item);
  basket.updateTotalPrice(basketModel.getTotalPrice());
  basket.updateHeaderCartCounter(basketModel.getProductCount());
  let i = 0;
  basket.basketItems = basketModel.productsInBasket.map((item) => {
    const basketItem = new BasketItem(cardBasket, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
});

events.on('modal:open', () => {
  modal.isLocked = true;
});

events.on('modal:close', () => {
  modal.isLocked = false;
});

apiModel.fetchProductList()
  .then(function (data: IItem[]) {
    //console.log('Полученные данные:', data);
    dataModel.productList = data;
    events.emit('productCards:receive');
  })
  .catch(error => console.log(error))

