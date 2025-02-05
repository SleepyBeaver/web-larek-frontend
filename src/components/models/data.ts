import { IItem } from "../../types";
import { IEvents } from "../base/events";

export interface IData {
    productList: IItem[];
    selectedProduct: IItem;
    previewProduct(product: IItem): void;
}

export class Data implements IData {
    private _products: IItem[];
    selectedProduct: IItem;

    constructor(private eventManager: IEvents) {
      this._products = [];
    }

    set productList(products: IItem[]) {
      this._products = products;
      this.eventManager.emit('products:updated');
    }

    get productList() {
      return this._products;
    }

    previewProduct(product: IItem) {
      this.selectedProduct = product;
      this.eventManager.emit('productPreview:open', product);
  }
}
