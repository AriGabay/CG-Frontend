import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from '@material-ui/core';

export default function Checkbox(props) {
  const { name, label, value, onChange, ...other } = props;

  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value,
    },
  });

  return (
    <FormControl {...other}>
      {!label && (
        <label
          style={{
            fontWeight: 600,
            margin: 0,
            padding: 0,
            color: 'black',
          }}
          htmlFor="id-label-checkbox"
        >
          {'תקנון'}
        </label>
      )}
      <FormControlLabel
        control={
          <MuiCheckbox
            id="id-label-checkbox"
            name={name}
            color="primary"
            defaultChecked={value}
            onChange={(e) =>
              onChange(convertToDefEventPara(name, e.target.checked))
            }
          />
        }
        label={label ? label : false}
      />
    </FormControl>
  );
}
