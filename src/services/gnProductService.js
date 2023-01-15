import { httpService } from './http.service';
const endpoint = 'gannay-eylon/product/';
async function getGnProducts(query) {
  try {
    const res = await httpService.get(endpoint, query);
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
async function getGnProductById(id) {
  try {
    const res = await httpService.get(endpoint, { id: id });
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function getGnProductsByMenu(query) {
  try {
    const res = await httpService.get(endpoint + 'byMenu', query);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function addGnProduct(data) {
  try {
    const res = await httpService.post(endpoint, data);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function removeGnProduct(id) {
  try {
    const res = await httpService.delete(endpoint, id);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function updateGnProduct(product) {
  try {
    const res = await httpService.put(endpoint, product.id, product);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function getAllGnProducts(query) {
  try {
    const res = await httpService.get(endpoint, query);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
export const gnProductService = {
  getGnProducts,
  addGnProduct,
  removeGnProduct,
  getGnProductById,
  updateGnProduct,
  getAllGnProducts,
  getGnProductsByMenu,
};
