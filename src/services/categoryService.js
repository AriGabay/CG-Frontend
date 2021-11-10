import { httpService } from './http.service';
const endpoint = 'category/';
async function getCategories(query = { include: false }) {
  try {
    console.log('query :', query);
    console.log('🚀 ~ file: categoryService.js ~ line 7 ~ getCategories ~ endpoint', endpoint);
    const res = await httpService.get(endpoint, query);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function addCategory(category) {
  await httpService.post(endpoint, category);
}

async function removeCategory(id) {
  await httpService.delete(endpoint, id);
}
async function getCategoryById(id, include) {
  try {
    const res = await httpService.get(endpoint, { id, include });
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function updateCategory(category) {
  try {
    const res = await httpService.put(endpoint, category.id, category);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}

export const categoryService = {
  getCategories,
  addCategory,
  removeCategory,
  getCategoryById,
  updateCategory
};
