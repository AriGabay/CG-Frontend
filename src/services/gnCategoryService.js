import { httpService } from './http.service';
const endpoint = 'gannay-eylon/category/';
async function getGnCategories(query = { include: false }) {
  try {
    return await httpService.get(endpoint, query);
  } catch (error) {
    console.error('error', error);
  }
}
async function getGnCategoriesDropDown() {
  try {
    const resDropDown = await httpService.get(endpoint, {});
    return resDropDown;
  } catch (error) {
    console.error('error', error);
  }
}

async function getGnCategoriesMenu(query = { include: false }) {
  try {
    return await httpService.get(endpoint + 'menu', query);
  } catch (error) {
    console.error('error', error);
  }
}

async function addGnCategory(category) {
  await httpService.post(endpoint, category);
}

async function removeGnCategory(id) {
  await httpService.delete(endpoint, id);
}
async function getGnCategoryById(id) {
  try {
    const res = await httpService.get(endpoint, { id });
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function updateGnCategory(category) {
  try {
    const res = await httpService.put(endpoint, category.id, category);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}

export const gnCategoryService = {
  getGnCategories,
  addGnCategory,
  removeGnCategory,
  getGnCategoryById,
  updateGnCategory,
  getGnCategoriesMenu,
  getGnCategoriesDropDown,
};
