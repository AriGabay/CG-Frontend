import { httpService } from './http.service';
const endpoint = 'order/';
const getOrders = async (query = { include: false }) => {
  try {
    return await httpService.get(endpoint, query);
  } catch (error) {
    console.error('error', error);
  }
};
const getOrdersByDates = async (dates) => {
  try {
    return await httpService.get(endpoint + 'getOrdersByDate', dates);
  } catch (error) {
    console.error('error', error);
  }
};
const getOrdersByDate = async (date) => {
  try {
    return await httpService.get(endpoint + 'getOrderSpasificDate', {
      date,
    });
  } catch (error) {
    console.error('error', error);
  }
};

export const ordersService = {
  getOrders,
  getOrdersByDates,
  getOrdersByDate,
};
