import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Data } from './components/models/data';
import { Card } from './components/interface/card';
import { ensureElement } from './utils/utils';
import { ApiModel } from './components/models/api';
import { IItem } from './types';

const cardCatalog = document.querySelector('#card-catalog') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new Data(events);

events.on('productCards:receive', () => {
    dataModel.productList.forEach(item => {
        const card = new Card(cardCatalog, events, { onClick: () => events.emit('card:select', item) });
        const renderedCard = card.render(item);
        ensureElement<HTMLElement>('.gallery').append(renderedCard);
    });
});

apiModel.fetchProductList()
  .then(function (data: IItem[]) {
    //console.log('Полученные данные:', data);
    dataModel.productList = data;
    events.emit('productCards:receive');
  })
  .catch(error => console.log(error))

