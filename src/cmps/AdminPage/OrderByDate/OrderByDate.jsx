import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { ordersService } from '../../../services/ordersService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreOutlined';
import { makeStyles } from '@mui/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import he from 'date-fns/locale/he';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  paper: {
    minHeight: '100px',
    display: 'flex !important',
    justifyContent: 'space-between !important',
    alignItems: 'center !important',
    width: '100% !important',
  },
  typography: {
    marginLeft: '15px !important',
  },
}));
export const OrderByDate = () => {
  const classes = useStyles();
  const [date, setDate] = useState(new Date());
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [totalProducts, setTotalProducts] = useState({});
  const [sum, setSum] = useState(0);
  const padDig = (dig) => {
    if (dig.toString().length >= 2) return dig;
    return dig.toString().padStart(2, '0');
  };
  const getOrders = async () => {
    setTotalProducts({});
    setOrders([]);
    setSum(0);
    const { totalProducts, orders } = await ordersService.getOrdersByDate(date);
    if (
      !totalProducts ||
      !orders ||
      !Object.keys(totalProducts).length ||
      !orders.length
    ) {
      setTotalProducts({});
      setOrders([]);
      setSum(0);
      return;
    }
    setTotalProducts({ ...totalProducts });
    setOrders([...orders]);
    exportOrdersWithSummary();
    orders.forEach((order) => {
      setSum((prev) => {
        return prev + order.totalPrice;
      });
    });
  };
  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };
  const trans = (word) => {
    if (word.includes('box')) return word.replace('box', 'קופסה');
    if (word.includes('unit')) return word.replace('unit', 'יחידות');
    if (word.includes('weight')) return word.replace('weight', 'גרם');
  };

  // const exportOrdersToExcel = () => {
  //   if (!orders || !orders.length) return;
  
  //   const allOrders = [];
  
  //   orders.forEach((order) => {
  //     const baseInfo = {
  //       'מספר הזמנה': order.id,
  //       'שם פרטי': order.firstName,
  //       'שם משפחה': order.lastName,
  //       'ת.ז': order.idPersonal,
  //       'עיר': order.city,
  //       'נייד': order.mobile,
  //       'נייד נוסף': order.mobileTow,
  //       'שעת איסוף': order.pickup,
  //       'תאריך איסוף': order.pickUpDate,
  //       'תאריך ביצוע ההזמנה': formatDate(order.time),
  //       'סכום כולל': order.totalPrice,
  //     };
  
  //     if (order.products && order.products.length) {
  //       order.products.forEach((product) => {
  //         allOrders.push({
  //           ...baseInfo,
  //           'שם מוצר': product.displayName,
  //           'כמות': product.sizeToOrder,
  //           'יחידת מידה': trans(product.Price.priceType),
  //           'מחיר ליחידה': product.pricePerSize,
  //         });
  //       });
  //     } else {
  //       allOrders.push(baseInfo);
  //     }
  //   });
  
  //   const worksheet = XLSX.utils.json_to_sheet(allOrders);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'הזמנות');
  
  //   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //   saveAs(blob, `ריכוז-הזמנות-${new Date().toLocaleDateString('he-IL')}.xlsx`);
  // };
  
  const exportOrdersWithSummary = () => {
    if (!orders || !orders.length) return;
  
    const allOrders = [];
    const productSummaryMap = {};
  
    orders.forEach((order) => {
      if (order.products && order.products.length) {
        order.products.forEach((product) => {
          // טבלת ההזמנות
          allOrders.push({
            'מספר הזמנה': order.id,
            'שם פרטי': order.firstName,
            'שם משפחה': order.lastName,
            'תעודת זהות': order.idPersonal,
            'עיר': order.city,
            'נייד': order.mobile,
            'נייד נוסף': order.mobileTow,
            'שעת איסוף': order.pickup,
            'תאריך איסוף': order.pickUpDate,
            'תאריך ביצוע ההזמנה': formatDate(order.time),
            'כמות ללקוח': order.totalPrice,
            'שם מוצר': product.displayName,
            'כמות': product.sizeToOrder,
            'יחידת מידה': trans(product.Price.priceType),
          });
  
          // ריכוז
          const key = `${product.displayName} - ${trans(product.Price.priceType)}`;
          productSummaryMap[key] =
            (productSummaryMap[key] || 0) + Number(product.sizeToOrder);
        });
      }
    });
  
    // טבלת ריכוז
    const productSummary = Object.entries(productSummaryMap).map(
      ([productNameWithUnit, totalQty]) => {
        return {
          'שם מוצר + יחידת מידה': productNameWithUnit,
          'כמות כוללת': totalQty,
        };
      }
    );
  
    // יצירת גיליון אחד עם שני טבלאות — השנייה תתחיל משורה 2 אחרי סוף הראשונה + רווח
    const worksheet = XLSX.utils.json_to_sheet(allOrders);
  
    // הכנסת טבלת הריכוז בעמודה U
    XLSX.utils.sheet_add_json(worksheet, productSummary, {
      origin: 'U1', // עמודה U, שורה 1
      skipHeader: false,
    });
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'הזמנות + ריכוז');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `הזמנות_וריכוז_${new Date().toLocaleDateString('he-IL')}.xlsx`);
  };

  return (
    <Grid>
      <Grid>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
          <DatePickerMui
            views={['year', 'month', 'day']}
            variant="inline"
            inputVariant="outlined"
            label="תאריך"
            name="date"
            value={datePickerValue}
            required={true}
            renderInput={(params) => <TextField {...params} />}
            onChange={(date) => {
              setDate(
                `${padDig(date.getDate())}/${padDig(
                  date.getMonth() < 12 ? date.getMonth() + 1 : date.getMonth()
                )}/${date.getFullYear()}`
              );
              setDatePickerValue(date);
            }}
          />
        </LocalizationProvider>
        <Button onClick={() => getOrders()}>חיפוש</Button>
      </Grid>
      {orders &&
        orders.map((order, index) => {
          return (
            <Accordion key={index}>
              <AccordionSummary
                classes={{ root: classes.paper }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography classes={{ root: classes.typography }}>
                  מספר הזמנה : {order.id}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  שם פרטי : {order.firstName}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  שם משפחה : {order.lastName}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  מחיר : {order.totalPrice}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography classes={{ root: classes.typography }}>
                  מספר הזמנה : {order.id}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  שם פרטי : {order.firstName}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  שם משפחה : {order.lastName}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  מחיר : {order.totalPrice}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  עיר : {order.city}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  תעודת זהות : {order.idPersonal}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  נייד : {order.mobile}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  נייד נוסף : {order.mobileTow}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  שעת איסוף : {order.pickup}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  תאריך איסוף : {order.pickUpDate}
                </Typography>
                <Typography classes={{ root: classes.typography }}>
                  תאריך ביצוע ההזמנה : {formatDate(order.time)}
                </Typography>
                <hr />
                {order.products &&
                  order.products.length &&
                  order.products.map((product, index) => {
                    return (
                      <Grid key={index}>
                        <Typography classes={{ root: classes.typography }}>
                          שם המוצר : {product.displayName}
                        </Typography>
                        <Typography classes={{ root: classes.typography }}>
                          כמות : {product.sizeToOrder}{' '}
                          {trans(product.Price.priceType)}
                        </Typography>
                        <Typography classes={{ root: classes.typography }}>
                          מחיר : {product.pricePerSize} ש״ח
                        </Typography>
                        <br />
                      </Grid>
                    );
                  })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      {<h1 style={{ display: 'none' }}>סכום כללי : {sum} ש״ח</h1>}
      {totalProducts &&
        !!Object.values(totalProducts).length &&
        Object.values(totalProducts).map((product) => {
          return (
            <Grid key={product.id}>
              <Typography>{product.displayName}</Typography>
              <Typography>
                {product.total.split('\n').map((i, index) => {
                  return (
                    i &&
                    i.length && (
                      <p key={index}>
                        {index + 1} :{' '}
                        <span style={{ fontWeight: 700 }}>{trans(i)}</span>
                      </p>
                    )
                  );
                })}
              </Typography>
              <hr />
            </Grid>
          );
        })}
        <Button
  onClick={exportOrdersWithSummary}
  variant="contained"
  color="secondary"
  style={{ marginRight: 10 }}
>
  הורד ריכוז הזמנות
</Button>

    </Grid>
  );
};
