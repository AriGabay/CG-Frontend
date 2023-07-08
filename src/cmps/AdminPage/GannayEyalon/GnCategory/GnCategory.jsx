import React from 'react';
import Input from '../../../Controls/Input';
import Select from '../../../Controls/Select';
import Button from '../../../Controls/Button';
import { useForm } from '../../../../hooks/useForm';
import { gnCategoryService } from '../../../../services/gnCategoryService';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { makeStyles } from '@mui/styles';
const useStyles = makeStyles(() => ({
  flexTag: {
    marginTop: '15px!important',
    marginRight: '15px!important',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column!important',
  },
  marginTop: {
    marginTop: '10px!important',
  },
}));

const val = {
  displayName: '',
  imgUrl: '',
  description: '',
  removeCategory: '',
};
export const GnCategory = ({ eventBus }) => {
  const classes = useStyles();
  const [categories, setCategories] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const { values, handleInputChange } = useForm(val, false);

  useEffect(() => {
    gnCategoryService.getGnCategoriesDropDown().then((res) => {
      setCategories(res);
    });
  }, []);
  const removeCategory = () => {
    gnCategoryService
      .removeGnCategory(values.removeCategory)
      .then(() =>
        eventBus.dispatch('success', { message: 'קטגוריה נמחקה בהצלחה' })
      );
  };
  const addCategory = () => {
    gnCategoryService
      .addGnCategory({ displayName: values.displayName })
      .then(() => {
        eventBus.dispatch('success', { message: 'קטגוריה נוספה בהצלחה' });
      });
  };
  const getCategoryById = ({ target }) => {
    gnCategoryService.getGnCategoryById(target.value).then((res) => {
      setCategoryToEdit(res[0]);
    });
  };
  const editCategory = ({ target }) => {
    const { name, value } = target;
    const newCategory = { ...categoryToEdit, [name]: value };
    setCategoryToEdit(newCategory);
  };
  const updateCategory = () => {
    gnCategoryService
      .updateGnCategory(categoryToEdit)
      .then(() =>
        eventBus.dispatch('success', { message: 'קטגוריה עודכנה בהצלחה' })
      );
  };
  return (
    <Grid className={classes.flexTag}>
      <h1>אתר גני איילון !!!!!</h1>
      <Grid className={classes.flexTag}>
        <Typography variant="h5">הוספה</Typography>
        <Input
          label="שם הקטגוריה להוספה"
          name="displayName"
          value={values.displayName}
          onChange={handleInputChange}
        ></Input>
        <Button
          className={classes.marginTop}
          text="הוסף קטגוריה"
          onClick={() => addCategory()}
        ></Button>
      </Grid>
      <Grid className={classes.flexTag}>
        <Typography variant="h5">מחיקה</Typography>
        {categories && (
          <Select
            label="קטגוריה למחיקה"
            name="removeCategory"
            value={values.removeCategory}
            options={categories}
            onChange={handleInputChange}
          />
        )}
        <Button
          className={classes.marginTop}
          text="מחק קטגוריה"
          onClick={() => removeCategory()}
        ></Button>
      </Grid>
      <Typography variant="h5">עריכה</Typography>
      {categories && (
        <Select
          label="קטגוריה לעריכה"
          name="editCategory"
          value={''}
          options={categories}
          onChange={(event) => getCategoryById(event)}
        />
      )}
      {categoryToEdit && (
        <Grid className={classes.flexTag}>
          <Input
            label="שם הקטגוריה לעריכה"
            name="displayName"
            value={categoryToEdit.displayName}
            onChange={(event) => editCategory(event)}
          ></Input>
          <Button
            className={classes.marginTop}
            text="עדכן מוצר"
            onClick={() => updateCategory()}
          ></Button>
        </Grid>
      )}
    </Grid>
  );
};
