import { httpService } from './http.service';
const endpoint = 'order/';
const getOrders = async (query = { include: false }) => {
  try {
    const res = await httpService.get(endpoint, query);
    return res;
  } catch (error) {
    console.error('error', error);
  }
};
const getOrdersByDates = async (dates) => {
  try {
    const res = await httpService.get(endpoint + 'getOrdersByDate', dates);
    return res;
  } catch (error) {
    console.error('error', error);
  }
};

export const ordersService = {
  getOrders,
  getOrdersByDates
};
