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
    return await httpService.post(`${endPoint}sendOrder`, { userDetails, cart });
  } catch (error) {
    console.log('error:', error);
  }
}
async function removeProductFromCart(id) {
  try {
    return await storageService.remove(KEY, id);
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
};
