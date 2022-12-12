import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Controls from '../Controls/Controls';
import { useForm, Form } from '../../hooks/useForm';
import { Typography } from '@material-ui/core';
import { eventBus } from '../../services/event-bus';
import BackButton from '../Controls/BackButton';
import Checkbox from '../../cmps/Controls/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/styles/withStyles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { termsTxt } from '../../text/terms.js';
import { useHistory } from 'react-router-dom';
import format from 'date-fns/format';

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
  pickUpDate: new Date(),
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
    if (terms === false) return;
    if ('pickUpDate' in fieldValues)
      temp.pickUpDate = fieldValues.pickUpDate.length ? '' : requiredInputStr;
    setErrors({
      ...temp,
    });
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
          required={true}
        />
        <Controls.Input
          name="lastName"
          label="שם משפחה"
          value={values.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          required={true}
        />
        <Controls.Input
          label="Email"
          name="email"
          value={values.email}
          onChange={handleInputChange}
          error={errors.email}
          required={true}
        />
        <Controls.Input
          label="פלאפון"
          name="mobile"
          value={values.mobile}
          onChange={handleInputChange}
          error={errors.mobile}
          required={true}
        />
        <Controls.Input
          label="פלאפון נוסף"
          name="mobileTow"
          value={values.mobileTow}
          onChange={handleInputChange}
          error={errors.mobileTow}
          required={true}
        />
        <Controls.Input
          label="עיר מגורים"
          required={true}
          name="city"
          value={values.city}
          error={errors.city}
          onChange={handleInputChange}
        />
        <Controls.Input
          label="רחוב"
          required={true}
          error={errors.street}
          name="street"
          value={values.street}
          onChange={handleInputChange}
        />
        <Controls.Input
          label="מספר ת.ז"
          required={true}
          error={errors.idPersonal}
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
              name="terms"
              required={true}
              label=""
              value={terms}
              onChange={() => setTerms(!terms)}
            ></Checkbox>
            <Button onClick={handleClickOpen}>
              <Typography textAlign="center">תקנון</Typography>
            </Button>
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
              <Button autoFocus onClick={handleClose} color="primary">
                חזרה
              </Button>
            </DialogActions>
          </Dialog>
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
            onClick={(event) => handleSubmit(event)}
          />
        </Grid>
        <Grid mb={2}>
          <BackButton text="חזור" to="/"></BackButton>
        </Grid>
      </Grid>
    </Form>
  );
};
