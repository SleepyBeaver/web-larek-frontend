import { IItem, IClickAction } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
    render(Data: IItem): HTMLElement;
}

export class Card implements ICard {
    protected _cardElement: HTMLElement;
    protected _categoryElement: HTMLElement;
    protected _titleElement: HTMLElement;
    protected _imageElement: HTMLImageElement;
    protected _priceElement: HTMLElement;
    protected _categoryColors = <Record<string, string>>{
        "дополнительное": "additional",
        "софт-скил": "soft",
        "кнопка": "button",
        "хард-скил": "hard",
        "другое": "other",
    };

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IClickAction) {
        this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
        this._categoryElement = this._cardElement.querySelector('.card__category');
        this._titleElement = this._cardElement.querySelector('.card__title');
        this._imageElement = this._cardElement.querySelector('.card__image');
        this._priceElement = this._cardElement.querySelector('.card__price');

        if (actions?.onClick) {
        this._cardElement.addEventListener('click', actions.onClick);
        }
    }

    protected setElementText(element: HTMLElement, value: unknown): void {
        if (element) {
        element.textContent = String(value);
        }
    }

    set category(value: string) {
        this.setElementText(this._categoryElement, value);
        this._categoryElement.className = `card__category card__category_${this._categoryColors[value]}`;
    }

    protected formatPrice(value: number | null): string {
        if (value === null) {
            return 'Бесценно';
        }
        return `${value} синапсов`;
    }

    render(Data: IItem): HTMLElement {
        //console.log('Данные для рендеринга:', Data);
        this._categoryElement.textContent = Data.category;
        this.category = Data.category;
        this._titleElement.textContent = Data.title;
        this._imageElement.src = Data.imageUrl;
        this._imageElement.alt = this._titleElement.textContent;
        this._priceElement.textContent = this.formatPrice(Data.price);
        return this._cardElement;
    }
}
