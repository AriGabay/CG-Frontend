import './Orders.scss';
import React, { useEffect, useState } from 'react';
import { ordersService } from '../../../services/ordersService';
import Grid from '@material-ui/core/Grid';
import { DataGrid } from '@material-ui/data-grid';

export const Orders = () => {
  const [orders, setOrders] = useState();
  useEffect(() => {
    ordersService.getOrders(true).then((res) => {
      setOrders(res);
    });
  }, []);

  const rows = () => {
    const arr = [];
    orders.forEach((order) => {
      arr.push({
        id: order.id,
        fullName: `${order.order.firstName} ${order.order.lastName}`,
        totalPrice: order.order.totalPrice,
        date: order.order.time,
        products: productsStr(order.order.products)
      });
    });

    return arr;
  };
  const productsStr = (products) => {
    if (products) {
      return products.map((product) => {
        return `${product.displayName} כמות : ${product.sizeToOrder} מחיר כולל: ${product.pricePerSize}`;
      });
    }
  };
  const columns = [
    { field: 'id', headerName: 'מספר הזמנה', type: 'number', width: 150 },
    { field: 'fullName', headerName: 'שם מלא', width: 150 },
    { field: 'totalPrice', headerName: 'סכום', type: 'number', width: 125 },
    { field: 'date', headerName: 'תאריך ביצוע ההזמנה', width: 210 },
    { field: 'products', headerName: 'מוצרים', width: 'auto' }
  ];

  return (
    <Grid>
      {orders && orders.length && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid onCell rows={rows()} rowHeight={50} columns={columns} pageSize={100} checkboxSelection />
        </div>
      )}
    </Grid>
  );
};
