import { httpService } from './http.service';
const endpoint = 'category/';
async function getCategories(query = { include: false }) {
  try {
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

export const categoryService = {
  getCategories,
  addCategory,
  removeCategory,
};
