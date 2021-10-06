import './Category.scss';
import React from 'react';
import Controls from '../../../cmps/Controls/Controls';
import { useForm } from '../../../hooks/useForm';
import { categoryService } from '../../../services/categoryService';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(() => ({
  flexTag: {
    marginTop: '15px!important',
    marginRight: '15px!important',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column!important'
  },
  marginTop: {
    marginTop: '10px!important'
  }
}));

const val = {
  displayName: '',
  imgUrl: '',
  description: '',
  removeCategory: ''
};
export const Category = () => {
  const classes = useStyles();
  const [categories, setCategories] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const { values, handleInputChange } = useForm(val, false);

  useEffect(() => {
    categoryService.getCategories({ include: false }).then((res) => {
      setCategories(res);
    });
  }, []);
  const removeCategory = () => {
    categoryService.removeCategory(values.removeCategory);
  };
  const addCategory = () => {
    const data = {
      displayName: values.displayName,
      imgUrl: values.imgUrl,
      description: values.description
    };
    categoryService.addCategory(data).then(() => {
      console.log('add category!');
    });
  };
  const getCategoryById = ({ target }) => {
    categoryService.getCategoryById(target.value, false).then((res) => {
      setCategoryToEdit(res[0]);
    });
  };
  const editCategory = ({ target }) => {
    const { name, value } = target;
    const newCategory = { ...categoryToEdit, [name]: value };
    setCategoryToEdit(newCategory);
  };
  const updateCategory = () => {
    categoryService
      .updateCategory(categoryToEdit)
      .then(() => console.log(`complete edit: ${categoryToEdit.displayName}`));
  };
  return (
    <Grid className={classes.flexTag}>
      <Grid className={classes.flexTag}>
        <Typography variant="h5">הוספה</Typography>
        <Controls.Input
          label="שם הקטגוריה להוספה"
          name="displayName"
          value={values.displayName}
          onChange={handleInputChange}
        ></Controls.Input>
        <Controls.Input
          label="שם התמונה"
          name="imgUrl"
          value={values.imgUrl}
          onChange={handleInputChange}
        ></Controls.Input>
        <Controls.Input
          label="תיאור הקטגוריה בקצרה"
          name="description"
          value={values.description}
          onChange={handleInputChange}
        ></Controls.Input>
        <Controls.Button
          className={classes.marginTop}
          text="הוסף קטגוריה"
          onClick={() => addCategory()}
        ></Controls.Button>
      </Grid>
      <Grid className={classes.flexTag}>
        <Typography variant="h5">מחיקה</Typography>
        {categories && (
          <Controls.Select
            label="קטגוריה למחיקה"
            name="removeCategory"
            value={values.removeCategory}
            options={categories}
            onChange={handleInputChange}
          />
        )}
        <Controls.Button
          className={classes.marginTop}
          text="מחק קטגוריה"
          onClick={() => removeCategory()}
        ></Controls.Button>
      </Grid>
      <Typography variant="h5">עריכה</Typography>
      {categories && (
        <Controls.Select
          label="קטגוריה לעריכה"
          name="editCategory"
          value={''}
          options={categories}
          onChange={(event) => getCategoryById(event)}
        />
      )}
      {categoryToEdit && (
        <Grid className={classes.flexTag}>
          <Controls.Input
            label="שם הקטגוריה לעריכה"
            name="displayName"
            value={categoryToEdit.displayName}
            onChange={(event) => editCategory(event)}
          ></Controls.Input>
          <Controls.Input
            label="שם התמונה"
            name="imgUrl"
            value={categoryToEdit.imgUrl}
            onChange={(event) => editCategory(event)}
          ></Controls.Input>
          <Controls.Input
            label="תיאור הקטגוריה בקצרה"
            name="description"
            value={categoryToEdit.description}
            onChange={(event) => editCategory(event)}
          ></Controls.Input>
          <Controls.Button
            className={classes.marginTop}
            text="עדכן מוצר"
            onClick={() => updateCategory()}
          ></Controls.Button>
        </Grid>
      )}
    </Grid>
  );
};
