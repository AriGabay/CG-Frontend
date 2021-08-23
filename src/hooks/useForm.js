import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};
export function useForm(initialFValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    var { name, value } = e.target;
    if (isNumber(value) && name !== 'mobile' && name !== 'idPersonal') {
      value = Number(value);
    }
    setValues({
      ...values,
      [name]: value
    });
    if (validateOnChange) validate({ [name]: value });
  };

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      width: '80%',
      margin: theme.spacing(1)
    }
  }
}));

export function Form(props) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    <form className={classes.root} autoComplete="off" {...other}>
      {props.children}
    </form>
  );
}
