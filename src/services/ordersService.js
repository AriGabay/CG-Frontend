import axios from 'axios';
import { httpService } from './http.service';
const endpoint = 'order/';
const BASE_URL = process.env.REACT_APP_API_HOST;
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

/**
 * How many orders exist for a pickup date ('dd/MM/yyyy'), or null if we could
 * not find out. Used to warn the admin before closing a date.
 *
 * Deliberately not on httpService: a failed read there navigates the browser to
 * /404, which would throw an admin out of the screen mid-edit over a check that
 * is only advisory. getOrdersByDate is no good either — it swallows its error
 * and returns undefined, which reads as "no orders" exactly when we know least.
 * The timeout guards against the endpoint's error path, which never replies.
 */
const countOrdersForDate = async (date) => {
  try {
    const res = await axios.get(`${BASE_URL}${endpoint}getOrderSpasificDate`, {
      params: { date },
      timeout: 15000,
    });
    return Array.isArray(res?.data?.orders) ? res.data.orders.length : 0;
  } catch (error) {
    console.error('order count for date failed', error);
    return null;
  }
};

export const ordersService = {
  getOrders,
  getOrdersByDates,
  getOrdersByDate,
  countOrdersForDate,
};
