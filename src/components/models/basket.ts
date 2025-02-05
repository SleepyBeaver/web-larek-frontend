import { IItem } from "../../types";

export interface IBasket {
    productsInBasket: IItem[];
    getProductCount: () => number;
    getTotalPrice: () => number;
    addProductToBasket(product: IItem): void;
    removeProductFromBasket(product: IItem): void;
    clearCart(): void;
}

export class BasketModel implements IBasket {
    protected _productsInCart: IItem[];

    constructor() {
        this._productsInCart = [];
    }

    set productsInBasket(products: IItem[]) {
        this._productsInCart = products;
    }

    get productsInBasket() {
        return this._productsInCart;
    }

    getProductCount() {
        return this.productsInBasket.length;
    }

    getTotalPrice() {
        return this.productsInBasket.reduce((total, product) => total + (product.price || 0), 0);
    }

    addProductToBasket(product: IItem) {
        this._productsInCart.push(product);
    }

    removeProductFromBasket(product: IItem) {
        const index = this._productsInCart.indexOf(product);
        if (index >= 0) {
        this._productsInCart.splice(index, 1);
        }
    }

    clearCart() {
        this.productsInBasket = [];
    }
}
