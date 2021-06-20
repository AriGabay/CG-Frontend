import Grid from '@material-ui/core/Grid';
import Controls from '../Controls/Controls';
import { useForm, Form } from '../../hooks/useForm';
import './UserDetailsForm.scss';
import { Typography } from '@material-ui/core';
import { eventBus } from '../../services/event-bus';
import BackButton from '../Controls/BackButton';

const initialFValues = {
  id: 0,
  fullName: '',
  email: '',
  mobile: '',
  city: '',
  idPersonal: '',
  pickup: '',
  street: '',
  hireDate: new Date(),
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
  { id: '14:15', title: '14:15' },
];

export const UserDetailsForm = ({ totalPrice, tax, unTax, checkOutTotal, cart }) => {
  const shekel = '₪';

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
    setErrors({
      ...temp,
    });

    if (fieldValues === values) return Object.values(temp).every((x) => x === '');
  };
  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(initialFValues, true, validate);
  var date = new Date();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      checkOutTotal(values).then((msg) => eventBus.dispatch('checkOutOrder', { message: msg }));
      resetForm();
    }
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
          <BackButton text="חזור" to="/menu"></BackButton>
        </Grid>
      </Grid>
    </Form>
  );
};
