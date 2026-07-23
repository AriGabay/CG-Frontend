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
import { makeStyles } from '@mui/styles';
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
import { colors, fonts, radii, shadows } from '../../styles/designTokens';
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
  // { id: '13:30', title: '13:30' },
  // { id: '14:00', title: '14:00' },
  // { id: '14:15', title: '14:15' },
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

// Redesign styling only — the field set, names and validation below are
// untouched because the backend turns them straight into the order PDF.
const useFormStyles = makeStyles({
  fields: {
    // Beat both the `Form` wrapper (80% width) and Input's `withStyle` (50%).
    '& .MuiFormControl-root.MuiFormControl-root': {
      width: '100% !important',
      margin: '0 !important',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: radii.sm,
      background: colors.surfaceAlt,
      fontSize: 15,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.borderInput,
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.green,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.greenDeep,
      borderWidth: 2,
    },
    '& .MuiInputLabel-root': {
      color: `${colors.textSoft} !important`,
      fontSize: 14,
    },
    '& .MuiFormHelperText-root': {
      marginInlineStart: 2,
      fontSize: 13,
    },
    '& .Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: `${colors.danger} !important`,
    },
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: 400,
    color: colors.text,
    margin: '26px 0 12px',
    '&:first-child': { marginTop: 0 },
  },
  // `.gb-form2` drops to a single column at 640px. An inline `span 2` there
  // would still ask for a second track, so the grid grows an implicit column
  // and the full-width fields end up narrower than the half-width ones.
  span2: {
    gridColumn: 'span 2',
    '@media (max-width: 640px)': {
      gridColumn: 'auto',
    },
  },
  pickupBlock: {
    background: colors.surfaceAlt,
    border: `1px solid ${colors.borderInput}`,
    borderRadius: radii.md,
    padding: '14px 16px',
    marginBottom: 16,
    '& .MuiFormControl-root': {
      width: '100% !important',
      margin: '0 !important',
    },
    '& .MuiFormLabel-root': {
      color: `${colors.textSoft} !important`,
      fontSize: 14,
    },
    '& .MuiFormControlLabel-label': { fontSize: 14 },
  },
  dateNote: {
    fontSize: 13.5,
    // textMuted is only rated against #FFFFFF (5.17) and the page bg #F5F1EA
    // (4.60). On the greenPale panel it drops to 4.05:1 — an AA failure at
    // 13.5px. greenInk is 4.63:1 on the same panel.
    color: colors.greenInk,
    background: colors.greenPale,
    borderRadius: radii.sm,
    padding: '10px 14px',
    lineHeight: 1.6,
    margin: '0 0 14px',
  },
  termsRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 18,
    '& .MuiFormControl-root': {
      width: 'auto !important',
      margin: '0 !important',
    },
    // 2.5.8 target size: the 24px tick keeps its size, only the padding grows
    // from 9 to 10 so the hit box goes 42x42 -> 44x44. The checkbox is the
    // first item in the row, so the extra pixel cannot reach another control.
    '& .MuiCheckbox-root': {
      padding: 10,
    },
    '& .MuiCheckbox-root.Mui-focusVisible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: -3,
    },
  },
  termsLink: {
    color: `${colors.greenLink} !important`,
    fontWeight: 700,
    textDecoration: 'underline',
    minWidth: 'auto !important',
    // The inline `padding: 0` on this button collapsed it to a 24.5px line
    // box. minHeight restores a 44px hit area without moving the text: the
    // row is already ~44px tall because of the checkbox next to it.
    minHeight: '44px !important',
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: 2,
    },
  },
  submitWrap: {
    marginTop: 22,
  },
  submitBtn: {
    width: '100% !important',
    background: `${colors.green} !important`,
    color: `${colors.surface} !important`,
    borderRadius: `${radii.md} !important`,
    padding: '16px !important',
    fontWeight: '800 !important',
    fontSize: '19px !important',
    boxShadow: `${shadows.btnGreen} !important`,
    margin: '0 !important',
    '&:hover': {
      background: `${colors.greenDeep} !important`,
      transform: 'none !important',
    },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: 3,
    },
  },
  backWrap: {
    marginTop: 16,
    marginBottom: 8,
    // MuiButton size="large" is 42.25px tall (8px padding + 15px/1.75 text).
    // 1.75px of extra box takes it to the 44px floor; the label does not move.
    '& .MuiButton-root': {
      minHeight: 44,
    },
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

export const UserDetailsForm = ({ checkOutTotal }) => {
  const history = useHistory();
  const [terms, setTerms] = useState(false);
  const [open, setOpen] = useState(false);
  const requiredInputStr = 'שדה חובה';
  const classes = useFormStyles();

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    const date = new Date();
    if (date.getHours() >= 10 && isFriday(date) && isToday(date)) {
      eventBus.dispatch('orderUntilTen', {
        message: ' לא נתן לבצע הזמנה,הזמנות יתקבלו עד השעה 10 בבוקר יום שישי',
      });
      return false;
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
      checkOutTotal(values).then((res) =>
        // נשאר 'checkOutOrder' גם בכישלון - זה האירוע שמרענן את מונה העגלה
        // ב-AppHeader. הכישלון מסומן דרך severity כדי שיוצג באדום ולא בירוק.
        eventBus.dispatch('checkOutOrder', {
          message: res?.message,
          severity: res?.ok ? 'success' : 'error',
        })
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
      <h3 className={classes.sectionTitle}>פרטים אישיים</h3>
      <div className={`${classes.fields} gb-form2`}>
        <div>
          <Controls.Input
            name="firstName"
            label="שם פרטי"
            value={values.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            withStyle={true}
            required={true}
          />
        </div>
        <div>
          <Controls.Input
            name="lastName"
            label="שם משפחה"
            value={values.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            withStyle={true}
            required={true}
          />
        </div>
        <div className={classes.span2}>
          <Controls.Input
            label="Email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
            error={errors.email}
            withStyle={true}
            required={true}
          />
        </div>
        <div>
          <Controls.Input
            label="פלאפון"
            name="mobile"
            value={values.mobile}
            onChange={handleInputChange}
            error={errors.mobile}
            withStyle={true}
            required={true}
          />
        </div>
        <div>
          <Controls.Input
            label="פלאפון נוסף"
            name="mobileTow"
            value={values.mobileTow}
            onChange={handleInputChange}
            error={errors.mobileTow}
            withStyle={true}
            required={true}
          />
        </div>
        <div>
          <Controls.Input
            label="עיר מגורים"
            required={true}
            name="city"
            value={values.city}
            error={errors.city}
            withStyle={true}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Controls.Input
            label="רחוב"
            required={true}
            error={errors.street}
            withStyle={true}
            name="street"
            value={values.street}
            onChange={handleInputChange}
          />
        </div>
        <div className={classes.span2}>
          <Controls.Input
            label="מספר ת.ז"
            required={true}
            error={errors.idPersonal}
            withStyle={true}
            name="idPersonal"
            value={values.idPersonal}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h3 className={classes.sectionTitle}>מועד איסוף</h3>
      <div className={classes.pickupBlock}>
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
      </div>
      <p className={classes.dateNote}>
        אם לא נבחר תאריך ההזמנה תבוצע ליום שישי של אותו השבוע
      </p>
      <div className={classes.fields}>
        <Controls.DatePicker
          required={true}
          name="pickUpDate"
          label="תאריך איסוף"
          value={new Date(values.pickUpDate)}
          onChange={handleInputChange}
          error={errors}
          setError={setErrors}
        />
      </div>

      <div className={classes.termsRow}>
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
        {terms === false && <FormHelperText>{requiredInputStr}</FormHelperText>}
        <Button
          className={classes.termsLink}
          style={{
            margin: 0,
            padding: 0,
            width: 'auto',
            flexDirection: 'row-reverse',
          }}
          onClick={handleClickOpen}
        >
          קריאת התקנון
        </Button>
      </div>

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

      <Grid className={classes.submitWrap}>
        <Controls.Button
          type="submit"
          text="שליחת הזמנה ←"
          className={classes.submitBtn}
          onClick={(event) => handleSubmit(event)}
        />
      </Grid>
      <div className={classes.backWrap}>
        <BackButton text="חזור" to="/"></BackButton>
      </div>
    </Form>
  );
};
