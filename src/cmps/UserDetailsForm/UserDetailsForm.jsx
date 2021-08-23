import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Controls from '../Controls/Controls';
import { useForm, Form } from '../../hooks/useForm';
import './UserDetailsForm.scss';
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
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { termsTxt } from '../../text/terms.js';

const initialFValues = {
  id: 0,
  fullName: '',
  email: '',
  mobile: '',
  city: '',
  idPersonal: '',
  pickup: '',
  street: '',
  hireDate: new Date()
};

const pickupItems = [
  { id: '7:30', title: '7:30' },
  { id: '8:00', title: '8:00' },
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
  { id: '14:15', title: '14:15' }
];
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);
export const UserDetailsForm = ({ totalPrice, tax, unTax, checkOutTotal, cart }) => {
  const shekel = '₪';
  const [terms, setTerms] = useState(false);
  const [open, setOpen] = useState(false);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('fullName' in fieldValues) temp.fullName = fieldValues.fullName ? '' : 'This field is required.';
    if ('email' in fieldValues)
      temp.email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(fieldValues.email)
        ? ''
        : 'Email is not valid.';
    if ('mobile' in fieldValues) temp.mobile = fieldValues.mobile.length > 9 ? '' : 'Minimum 10 numbers required.';
    if ('pickup' in fieldValues) temp.pickup = fieldValues.pickup.length ? '' : '.select time to pickup';
    if ('idPersonal' in fieldValues)
      temp.idPersonal =
        fieldValues.idPersonal.length >= 9 && fieldValues.idPersonal.length <= 9 ? '' : 'must be 9 numbers required.';
    if ('city' in fieldValues) temp.city = fieldValues.city.length ? '' : 'This  field is required.';
    if ('street' in fieldValues) temp.street = fieldValues.street.length ? '' : 'This  field is required.';
    console.log('terms:', terms);
    if (terms === false) return;
    setErrors({
      ...temp
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === '');
  };
  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(initialFValues, true, validate);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      checkOutTotal(values).then((msg) => eventBus.dispatch('checkOutOrder', { message: msg }));
      resetForm();
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
          name="fullName"
          label="שם מלא"
          value={values.fullName}
          onChange={handleInputChange}
          error={errors.fullName}
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
          <Typography mb={2} mt={2} borderBottom={'1px solid black'} borderTop={'1px solid black'}>
            אם לא נבחר תאריך ההזמנה תבוצע ליום שישי של אותו השבוע
          </Typography>
        </Grid>
        <Grid>
          <Controls.DatePicker
            required={true}
            name="hireDate"
            label="תאריך איסוף"
            value={values.hireDate}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid display="flex" justifyContent="flex-start" alignContent="center">
          <Grid display="flex" justifyContent="flex-start" alignContent="center">
            <Checkbox name="terms" required={true} label="" value={terms} onChange={() => setTerms(!terms)}></Checkbox>
            <Button onClick={handleClickOpen}>
              <Typography textAlign="center">לתקנון</Typography>
            </Button>
          </Grid>
          <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              תקנון
            </DialogTitle>
            <DialogContent dividers>{termsTxt && <Typography gutterBottom>{termsTxt}</Typography>}</DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color="primary">
                חזרה
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid mt={2} mb={2}>
          <Typography>
            לפני מע"מ: {unTax}
            {shekel}
          </Typography>
          <Typography>
            מע"מ: {tax}
            {shekel}
          </Typography>
          <Typography>
            מחיר כולל : {totalPrice}
            {shekel}
          </Typography>
        </Grid>
        <Grid mb={2}>
          <Controls.Button type="submit" text="להזמנה" onClick={(event) => handleSubmit(event)} />
        </Grid>
        <Grid mb={2}>
          <BackButton text="חזור" to="/"></BackButton>
        </Grid>
      </Grid>
    </Form>
  );
};
