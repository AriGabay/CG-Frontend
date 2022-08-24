import { httpService } from './http.service';
const endpoint = 'isMenuEnable/';

async function getAllMenuEnables() {
  try {
    const res = await httpService.get(endpoint+'getAllMenuEnables');
    return res;
  } catch (error) {
    console.error('error', error);
    throw new Error(error);
  }
}

async function setMenuEnable(data) {
  try {
    const res = await httpService.post(endpoint,data);
    return res;
  } catch (error) {
    console.error('error', error);
    throw new Error(error);
  }
}
async function getAllMenus() {
  try {
    const res = await httpService.get(endpoint+'getAllMenus');
    return res;
  } catch (error) {
    console.error('error', error);
    throw new Error(error);
  }
}

export const isMenuEnableService = {
  getAllMenuEnables,
  setMenuEnable,
  getAllMenus
};
