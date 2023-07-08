import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Controls from '../Controls/Controls';
import { useForm, Form } from '../../hooks/useForm';
import { Typography } from '@mui/material';
import { eventBus } from '../../services/event-bus';
import BackButton from '../Controls/BackButton';
import Checkbox from '../../cmps/Controls/Checkbox';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import { termsTxt } from '../../text/terms.js';
import { useHistory } from 'react-router-dom';
import format from 'date-fns/format';
import { isFriday } from 'date-fns';
import isToday from 'date-fns/isToday';
import { nextFriday } from 'date-fns';
const initialDate = new Date();
const initialFValues = {
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  mobileTow: '',
  city: '',
  idPersonal: '',
  pickup: '',
  street: '',
  pickUpDate: isFriday(initialDate) ? initialDate : nextFriday(initialDate),
};

const pickupItems = [
  { id: '8:30', title: '8:30' },
  { id: '9:00', title: '9:00' },
  { id: '9:30', title: '9:30' },
  { id: '10:00', title: '10:00' },
  { id: '10:30', title: '10:30' },
  { id: '11:00', title: '11:00' },
  { id: '11:30', title: '11:30' },
  { id: '12:00', title: '12:00' },
  { id: '12:30', title: '12:30' },
  { id: '13:00', title: '13:00' },
  { id: '13:30', title: '13:30' },
  { id: '14:00', title: '14:00' },
  { id: '14:15', title: '14:15' },
];

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export const UserDetailsForm = ({ totalPrice, tax, unTax, checkOutTotal }) => {
  const history = useHistory();
  const [terms, setTerms] = useState(false);
  const [open, setOpen] = useState(false);
  const requiredInputStr = 'שדה חובה';

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    const date = new Date();
    if (date.getHours() >= 10 && isFriday(date) && isToday(date)) {
      eventBus.dispatch('orderUntilTen', {
        message: ' לא נתן לבצע הזמנה,הזמנות יתקבלו עד השעה 10 בבוקר יום שישי',
      });
      return false;
    }
    if (!fieldValues['firstName']?.length) {
      temp.firstName = requiredInputStr;
    }
    if ('firstName' in fieldValues)
      temp.firstName = fieldValues.firstName ? '' : requiredInputStr;
    if ('lastName' in fieldValues)
      temp.lastName = fieldValues.lastName ? '' : requiredInputStr;
    if ('email' in fieldValues)
      temp.email =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          fieldValues.email
        )
          ? ''
          : 'כתובת מייל לא חוקית';
    if ('mobile' in fieldValues)
      temp.mobile = fieldValues.mobile.length > 9 ? '' : 'מספר פלאפון לא תקין';
    if ('mobileTow' in fieldValues)
      temp.mobileTow =
        fieldValues.mobileTow.length > 9 ? '' : 'מספר פלאפון לא תקין';
    if ('pickup' in fieldValues)
      temp.pickup = fieldValues.pickup.length ? '' : 'נא לבחור שעת אסיפה';
    if ('idPersonal' in fieldValues)
      temp.idPersonal =
        fieldValues.idPersonal.length >= 9 && fieldValues.idPersonal.length <= 9
          ? ''
          : 'תעודת זהות לא חוקית';
    if ('city' in fieldValues)
      temp.city = fieldValues.city.length ? '' : requiredInputStr;
    if ('street' in fieldValues)
      temp.street = fieldValues.street.length ? '' : requiredInputStr;
    setErrors({
      ...temp,
    });
    if (terms === false) return;
    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '');
  };

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialFValues,
    true,
    validate
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      values.pickUpDate = format(new Date(values.pickUpDate), 'dd/MM/yyyy');
      checkOutTotal(values).then((msg) =>
        eventBus.dispatch('checkOutOrder', { message: msg })
      );
      resetForm();
      history.push('/');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Form>
      <Grid item xs={12}>
        <Controls.Input
          name="firstName"
          label="שם פרטי"
          value={values.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
          withStyle={true}
          required={true}
        />
        <Controls.Input
          name="lastName"
          label="שם משפחה"
          value={values.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          withStyle={true}
          required={true}
        />
        <Controls.Input
          label="Email"
          name="email"
          value={values.email}
          onChange={handleInputChange}
          error={errors.email}
          withStyle={true}
          required={true}
        />
        <Controls.Input
          label="פלאפון"
          name="mobile"
          value={values.mobile}
          onChange={handleInputChange}
          error={errors.mobile}
          withStyle={true}
          required={true}
        />
        <Controls.Input
          label="פלאפון נוסף"
          name="mobileTow"
          value={values.mobileTow}
          onChange={handleInputChange}
          error={errors.mobileTow}
          withStyle={true}
          required={true}
        />
        <Controls.Input
          label="עיר מגורים"
          required={true}
          name="city"
          value={values.city}
          error={errors.city}
          withStyle={true}
          onChange={handleInputChange}
        />
        <Controls.Input
          label="רחוב"
          required={true}
          error={errors.street}
          withStyle={true}
          name="street"
          value={values.street}
          onChange={handleInputChange}
        />
        <Controls.Input
          label="מספר ת.ז"
          required={true}
          error={errors.idPersonal}
          withStyle={true}
          name="idPersonal"
          value={values.idPersonal}
          onChange={handleInputChange}
        />
        <Grid item xs={12} mb={2} mt={2}>
          <Controls.RadioGroup
            name="pickup"
            label="שעת איסוף"
            value={values.pickup}
            onChange={handleInputChange}
            items={pickupItems}
            required={true}
            error={errors.pickup}
            withStyle={true}
          />
        </Grid>
        <Grid>
          <Typography
            mb={2}
            mt={2}
            borderBottom={'1px solid black'}
            borderTop={'1px solid black'}
          >
            אם לא נבחר תאריך ההזמנה תבוצע ליום שישי של אותו השבוע
          </Typography>
        </Grid>
        <Grid>
          <Controls.DatePicker
            required={true}
            name="pickUpDate"
            label="תאריך איסוף"
            value={new Date(values.pickUpDate)}
            onChange={handleInputChange}
            error={errors.pickUpDate}
          />
        </Grid>
        <Grid display="flex" justifyContent="flex-start" alignContent="center">
          <Grid
            display="flex"
            justifyContent="flex-start"
            alignContent="center"
          >
            <Checkbox
              style={{
                margin: 0,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row-reverse',
              }}
              id="id-label-terms"
              name="terms"
              required={true}
              value={terms}
              onChange={() => setTerms(!terms)}
            ></Checkbox>

            {terms === false && (
              <FormHelperText>{requiredInputStr}</FormHelperText>
            )}
          </Grid>
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              תקנון
            </DialogTitle>
            <DialogContent dividers>
              {termsTxt && <Typography gutterBottom>{termsTxt}</Typography>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                חזרה
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            style={{
              margin: 0,
              padding: 0,
              width: 'auto',
              flexDirection: 'row-reverse',
              color: 'black',
            }}
            onClick={handleClickOpen}
          >
            קריאת התקנון
          </Button>
        </Grid>
        <Grid mt={2} mb={2}>
          <Typography>לפני מע&apos;מ: {unTax} ₪</Typography>
          <Typography>מע&apos;מ: {tax} ₪</Typography>
          <Typography>מחיר משוער : {totalPrice} ₪</Typography>
        </Grid>
        <Grid mb={2}>
          <Controls.Button
            type="submit"
            text="להזמנה"
            style={{ color: 'black' }}
            onClick={(event) => handleSubmit(event)}
          />
        </Grid>
        <Grid mb={2}>
          <BackButton classProp="blackFont" text="חזור" to="/"></BackButton>
        </Grid>
      </Grid>
    </Form>
  );
};
