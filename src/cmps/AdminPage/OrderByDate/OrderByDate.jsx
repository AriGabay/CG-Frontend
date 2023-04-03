import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import DatePickerComp from '@material-ui/lab/DatePicker';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { ordersService } from '../../../services/ordersService';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/styles';

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
    orders.forEach((order) => setSum((prev) => prev + order.totalPrice));
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
  return (
    <Grid>
      <Grid>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePickerComp
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
      <h1>סכום כללי : {sum} ש״ח</h1>
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
    </Grid>
  );
};
