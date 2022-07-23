import { httpService } from './http.service';
const endpoint = 'product/';
async function getProducts(query) {
  try {
    const res = await httpService.get(endpoint, query);
    return res;
  } catch (error) {
    throw new Error(error);
    // console.error('error', error);
  }
}
async function getProductById(id) {
  try {
    const res = await httpService.get(endpoint, { id: id });
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function getProductsByMenu(query) {
  try {
    const res = await httpService.get(endpoint + 'byMenu', query);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function addProduct(data) {
  try {
    const res = await httpService.post(endpoint, data);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function removeProduct(id) {
  try {
    const res = await httpService.delete(endpoint, id);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function updateProduct(product) {
  try {
    const res = await httpService.put(endpoint, product.id, product);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function getAllProducts(query) {
  try {
    const res = await httpService.get(endpoint + 'all', query);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
export const productService = {
  getProducts,
  addProduct,
  removeProduct,
  getProductById,
  updateProduct,
  getAllProducts,
  getProductsByMenu
};
