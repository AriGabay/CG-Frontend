import { httpService } from './http.service';
const endpoint = 'sizePrice/';
async function getSizePrices() {
  try {
    const res = await httpService.get(endpoint, { include: true });
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function addSizePrice(data) {
  try {
    const res = await httpService.post(endpoint, data);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function removeSizePrice(id) {
  try {
    const res = await httpService.delete(endpoint, id);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function getSizePriceById(id, include) {
  try {
    const res = await httpService.get(endpoint, { id, include });
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function updateSizePrice(sizePrice) {
  try {
    const res = await httpService.put(endpoint, sizePrice.id, sizePrice);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
export const sizePriceService = {
  getSizePrices,
  addSizePrice,
  removeSizePrice,
  getSizePriceById,
  updateSizePrice,
};
