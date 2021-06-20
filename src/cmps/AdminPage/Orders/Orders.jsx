import './Orders.scss';
import { useEffect, useState } from 'react';
import { ordersService } from '../../../services/ordersService';
import Grid from '@material-ui/core/Grid';
import { DataGrid } from '@material-ui/data-grid';

export const Orders = (props) => {
  const [orders, setOrders] = useState();
  const [productLength, setProductLength] = useState();
  useEffect(() => {
    ordersService.getOrders(true).then((res) => {
      console.log('res:', res);
      setOrders(res);
    });
  }, []);

  const rows = () => {
    var arr = [];
    orders.map((order) => {
      // setProductLength(order.order.products.length);
      arr.push({
        id: order.id,
        fullName: order.order.fullName,
        totalPrice: order.order.totalPrice,
        date: order.order.time,
        products: productsStr(order.order.products),
      });
    });

    return arr;
  };
  const productsStr = (products) => {
    return products.map((product) => {
      return `${product.displayName} כמות : ${product.sizeToOrder} מחיר כולל: ${product.pricePerSize}`;
    });
  };
  const columns = [
    { field: 'id', headerName: 'מספר הזמנה', type: 'number', width: 150 },
    { field: 'fullName', headerName: 'שם מלא', width: 150 },
    { field: 'totalPrice', headerName: 'סכום', type: 'number', width: 125 },
    { field: 'date', headerName: 'תאריך ביצוע ההזמנה', width: 210 },
    { field: 'products', headerName: 'מוצרים', width: 'auto' },
    // {
    //   field: 'age',
    //   headerName: 'Age',
    //   type: 'number',
    //   width: 110,
    // },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params) =>
    //     `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''}`,
    // },
  ];

  // const rows = [
  //   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  //   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  //   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  //   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  //   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  //   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  //   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  //   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  // ];

  return (
    <Grid>
      {orders && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows()} rowHeight={50} columns={columns} pageSize={100} checkboxSelection />
        </div>
      )}
    </Grid>
  );
};
