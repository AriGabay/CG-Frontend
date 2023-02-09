import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};
export function useForm(initialFValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    if (e?.stopPropagation) {
      e.stopPropagation();
    }
    let { name, value } = e.target;
    if (
      isNumber(value) &&
      name !== 'mobile' &&
      name !== 'idPersonal' &&
      name !== 'mobileTow'
    ) {
      value = Number(value);
    }
    if (name === 'autoAdd' && isNumber(value)) {
      value = Number(value);
    } else if (
      name === 'autoAdd' &&
      (value === 'false' ||
        value === 'true' ||
        value === false ||
        value === true)
    ) {
      if (value === true || value === 'true') value = 1;
      else if (value === false || value === 'false') value = 0;
    }
    setValues({
      ...values,
      [name]: value,
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
    resetForm,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      width: '80%',
      margin: theme.spacing(1),
    },
  },
}));

export function Form(props) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    <form className={classes.root} autoComplete="off" {...other}>
      {children}
    </form>
  );
}
