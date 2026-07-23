import { storageService } from './async-storage.service';
import { httpService } from './http.service';
const KEY = 'cart';
const endPoint = 'cart/';
async function addToCart(product) {
  try {
    delete product.product.updatedAt;
    delete product.product.createdAt;
    delete product.product.Price.createdAt;
    delete product.product.Price.updatedAt;
    delete product.product.Category.createdAt;
    delete product.product.Category.updatedAt;
    delete product.product.Category.imgUrl;
    return await storageService.post(KEY, product);
  } catch (error) {
    console.error('error', error);
  }
}
async function getCart() {
  try {
    const cart = await storageService.query(KEY);
    return cart;
  } catch (error) {
    console.error('error', error);
  }
}
async function checkOutOrder(cart) {
  try {
    const totalCart = await httpService.post(endPoint, cart);
    return totalCart;
  } catch (error) {
    console.log('error:', error);
  }
}
async function checkOutTotal(userDetails) {
  try {
    const cart = await getCart();
    const res = await httpService.post(`${endPoint}sendOrder`, {
      userDetails,
      cart,
    });
    await storageService.clearAll();
    return { ok: true, message: res };
  } catch (error) {
    console.log('error:', error);
    const status = error?.response?.status;
    const message = error?.response?.data;
    // 502 = ההזמנה נשמרה בשרת אך המייל נכשל. יש לרוקן את העגלה כדי שהלקוח
    // לא ישלח שוב ותיווצר הזמנה כפולה - ההודעה מפנה אותו לטלפון של העסק.
    if (status === 502) {
      await storageService.clearAll();
    }
    return {
      ok: false,
      message:
        typeof message === 'string' && message
          ? message
          : 'שליחת ההזמנה נכשלה. נא ליצור קשר טלפוני עם קייטרינג גבאי בטלפון 04-6734949.',
    };
  }
}
async function removeProductFromCart(id) {
  try {
    return await storageService.remove(KEY, id);
  } catch (error) {
    console.log('error:', error);
  }
}
async function updateOrder(order, products) {
  try {
    return await httpService.put(endPoint, order.id, {
      order: order,
      products: products,
    });
  } catch (error) {
    console.log('error:', error);
  }
}
export const cartService = {
  addToCart,
  getCart,
  checkOutOrder,
  checkOutTotal,
  removeProductFromCart,
  updateOrder,
};
