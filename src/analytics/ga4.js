import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase.config";

/** @typedef {{item_id?: string,item_name?: string,item_brand?: string,item_category?: string,item_variant?: string,price?: number,quantity?: number,index?: number,item_list_id?: string,item_list_name?: string}} GA4Item */

/** @param {{item_list_id?: string,item_list_name?: string,items: GA4Item[]}} params */
export function faViewItemList(params) {
  if (!analytics) return;
  logEvent(analytics, "view_item_list", params);
}

/** @param {{item_list_id?: string,item_list_name?: string,items: GA4Item[]}} params */
export function faSelectItem(params) {
  if (!analytics) return;
  logEvent(analytics, "select_item", params);
}

/** @param {{currency: string,value: number,items: GA4Item[]}} params */
export function faViewItem(params) {
  if (!analytics) return;
  logEvent(analytics, "view_item", params);
}
