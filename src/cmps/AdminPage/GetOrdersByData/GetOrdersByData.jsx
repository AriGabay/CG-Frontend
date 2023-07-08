import React from 'react';
import { useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePickerComp from '@mui/lab/DatePicker';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';
import { ordersService } from '../../../services/ordersService';
import { makeStyles } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
}));
export const GetOrdersByData = () => {
  const [startDay, setStartDay] = useState(new Date());
  const [endDay, setEndDay] = useState(new Date());
  const [orders, setOrders] = useState();
  const [totalProducts, setTotalProducts] = useState(null);
  const classes = useStyles();
  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };
  const searchOrder = async () => {
    try {
      if (!endDay && !startDay) return;
      const dates = {
        start: startDay,
        end: endDay,
      };
      const totalOrders = await ordersService.getOrdersByDates(dates);
      setOrders(totalOrders.orders);
      setTotalProducts(totalOrders.totalProducts);
    } catch (error) {
      console.log('error:', error);
    }
  };
  const displayDate = (dateObj) => {
    const month = dateObj.getMonth();
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return day + '.' + month + '.' + year;
  };
  return (
    <Grid>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Typography>תאריך התחלתי</Typography>
        <DatePickerComp
          views={['year', 'month', 'day']}
          variant="inline"
          inputVariant="outlined"
          label="תאריך התחלתי"
          name="startDay"
          value={startDay}
          required={true}
          renderInput={(params) => <TextField {...params} />}
          onChange={(date) => {
            setStartDay(date);
          }}
        />
        <Typography>תאריך סופי</Typography>
        <DatePickerComp
          views={['year', 'month', 'day']}
          variant="inline"
          inputVariant="outlined"
          label="תאריך סופי"
          name="endDay"
          value={endDay}
          required={true}
          renderInput={(params) => <TextField {...params} />}
          onChange={(date) => {
            setEndDay(date);
          }}
        />
      </LocalizationProvider>
      <Button onClick={() => searchOrder()}>חיפוש</Button>
      <Grid className={classes.heading}>
        {orders &&
          orders.map((totalOrder, index) => {
            return (
              <Accordion key={index}>
                <AccordionSummary
                  classes={{ root: classes.paper }}
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>מספר הזמנה : {totalOrder.id}</Typography>
                  <Typography>
                    שם פרטי : {totalOrder.order.firstName}
                  </Typography>
                  <Typography>
                    שם משפחה : {totalOrder.order.lastName}
                  </Typography>
                  <Typography>מחיר : {totalOrder.order.totalPrice}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>מספר הזמנה : {totalOrder.id}</Typography>
                  <Typography>
                    שם פרטי : {totalOrder.order.firstName}
                  </Typography>
                  <Typography>
                    שם משפחה : {totalOrder.order.lastName}
                  </Typography>
                  <Typography>מחיר : {totalOrder.order.totalPrice}</Typography>
                  <Typography>עיר : {totalOrder.order.city}</Typography>
                  <Typography>
                    תעודת זהות : {totalOrder.order.idPersonal}
                  </Typography>
                  <Typography>נייד : {totalOrder.order.mobile}</Typography>
                  <Typography>
                    נייד נוסף : {totalOrder.order.mobileTow}
                  </Typography>
                  <Typography>שעת איסוף : {totalOrder.order.pickup}</Typography>
                  <Typography>
                    תאריך איסוף : {formatDate(totalOrder.order.pickUpDate)}
                  </Typography>
                  <Typography>
                    תאריך ביצוע ההזמנה : {formatDate(totalOrder.order.time)}
                  </Typography>
                  <hr />
                  {totalOrder.order.products &&
                    totalOrder.order.products.length &&
                    totalOrder.order.products.map((product, index) => {
                      return (
                        <Grid key={index}>
                          <Typography>
                            שם המוצר : {product.displayName}
                          </Typography>
                          <Typography>כמות : {product.sizeToOrder}</Typography>
                          <Typography>מחיר : {product.pricePerSize}</Typography>
                          <br />
                        </Grid>
                      );
                    })}
                </AccordionDetails>
              </Accordion>
            );
          })}
        <Grid>
          <Typography
            mt={2}
            mb={2}
            variant="h5"
          >{`סיכום מוצרים לתקופת זמן ${displayDate(startDay)} - ${displayDate(
            endDay
          )}`}</Typography>
          {totalProducts &&
            Object.values(totalProducts).length &&
            Object.values(totalProducts).map((product) => {
              return (
                <Grid key={product.id}>
                  <Typography>{product.displayName}</Typography>
                  <Typography>{product.sizeToOrder}</Typography>
                  <Typography>{product.Price.priceType}</Typography>
                  <hr />
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
};
