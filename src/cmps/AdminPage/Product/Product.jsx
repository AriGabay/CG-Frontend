import './Product.scss';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Controls from '../../Controls/Controls';
import React, { useEffect, useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { pricesService } from '../../../services/pricesService';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(() => ({
  gridTag: {
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
  categoryId: '',
  inStock: true,
  imgUrl: '',
  priceId: '',
  productToRemove: '',
  description: '',
  productToEdit: '',
  kitniyot: false,
  typeMenu: [],
  tishray: false,
};
export const Product = ({ eventBus }) => {
  const classes = useStyles();
  const [prices, setPrices] = useState();
  const [categories, setCategories] = useState();
  const [products, setProducts] = useState();
  const [productToEdit, setProductToEdit] = useState();
  const [isMenuPesach, setIsMenuPesach] = useState(false);
  const [isMenuTishray, setIsMenuTishray] = useState(false);
  const [isMenuWeekend, setIsMenuWeekend] = useState(false);

  const { values, handleInputChange } = useForm(val, false);
  useEffect(() => {
    pricesService.getPrices(false).then((prices) => setPrices(prices));
    categoryService.getCategoriesDropDown().then((category) => {
      setCategories(category);
    });
    productService.getAllProducts({ include: false }).then((res) => {
      setProducts(res);
    });
  }, []);
  const addProduct = () => {
    const {
      displayName,
      categoryId,
      inStock,
      imgUrl,
      priceId,
      description,
      kitniyot,
    } = values;
    const productData = {
      displayName,
      categoryId,
      inStock,
      imgUrl,
      priceId,
      description,
      kitniyot,
      isMenuPesach,
      isMenuWeekend,
      isMenuTishray,
    };
    if (isMenuPesach === true) productData.isMenuPesach = true;
    if (isMenuWeekend === true) productData.isMenuWeekend = true;
    if (isMenuTishray === true) productData.isMenuTishray = true;
    productService.addProduct(productData).then((res) => {
      eventBus.dispatch('addProduct', {
        message: `${res.displayName} נוסף בהצלחה`,
      });
    });
  };
  const removeProduct = () => {
    productService.removeProduct(values.productToRemove).then(() => {
      console.log('remove product');
    });
  };
  const getProductById = ({ target }) => {
    productService.getProductById(target.value, false).then((res) => {
      setProductToEdit(res);
    });
  };
  const editProduct = ({ target }) => {
    const { name, value } = target;
    const newProduct = { ...productToEdit, [name]: value };
    setProductToEdit(newProduct);
  };
  const updateProduct = () => {
    productService.updateProduct(productToEdit).then((res) => {
      eventBus.dispatch('updateProduct', { message: res.data });
    });
  };

  return (
    <Grid>
      <Grid className={classes.gridTag}>
        <Typography variant="h5">הוספה</Typography>
        <Controls.Input
          className={classes.marginTop}
          label="שם המוצר"
          value={values.displayName}
          onChange={handleInputChange}
          name="displayName"
        />
        {categories && (
          <Controls.Select
            className={classes.marginTop}
            label="קטגוריה"
            name="categoryId"
            value={values.categoryId}
            options={categories}
            onChange={handleInputChange}
          />
        )}
        <Controls.Checkbox
          label="תפריט פסח"
          className={classes.marginTop}
          name="pesach"
          value={isMenuPesach}
          onChange={() => setIsMenuPesach(!isMenuPesach)}
        ></Controls.Checkbox>
        <Controls.Checkbox
          label="תפריט סוף שבוע"
          className={classes.marginTop}
          name="weekend"
          value={isMenuWeekend}
          onChange={() => setIsMenuWeekend(!isMenuWeekend)}
        ></Controls.Checkbox>
        <Controls.Checkbox
          label="תפריט חגי תשרי"
          className={classes.marginTop}
          name="tishray"
          value={isMenuTishray}
          onChange={() => setIsMenuTishray(!isMenuTishray)}
        ></Controls.Checkbox>
        <Controls.Checkbox
          label="מלאי"
          className={classes.marginTop}
          name="inStock"
          value={values.inStock}
          onChange={handleInputChange}
        ></Controls.Checkbox>
        <Controls.Checkbox
          label="מכיל קיטניות"
          className={classes.marginTop}
          name="kitniyot"
          value={values.kitniyot}
          onChange={handleInputChange}
        ></Controls.Checkbox>
        <Controls.Input
          label="שם התמונה בענן"
          className={classes.marginTop}
          value={values.imgUrl}
          onChange={handleInputChange}
          name="imgUrl"
        />
        {prices && (
          <Controls.Select
            className={classes.marginTop}
            label="מחירון"
            name="priceId"
            value={values.priceId}
            options={prices}
            onChange={handleInputChange}
          />
        )}
        <TextareaAutosize
          className={classes.marginTop}
          placeholder="נא להכניס תיאור מוצר"
          name="description"
          value={values.description}
          onChange={handleInputChange}
        />
        <Controls.Button
          className={classes.marginTop}
          text="הוסף מוצר"
          onClick={() => addProduct()}
        ></Controls.Button>
      </Grid>
      <Grid className={classes.gridTag}>
        <Typography variant="h5">מחיקה</Typography>
        {products && (
          <Controls.Select
            label="מוצר למחיקה"
            name="productToRemove"
            value={values.productToRemove}
            options={products}
            onChange={handleInputChange}
          />
        )}
        <Controls.Button
          className={classes.marginTop}
          text="מחק מוצר"
          onClick={() => removeProduct()}
        ></Controls.Button>
      </Grid>
      <Grid className={classes.gridTag}>
        <Typography variant="h5">עריכה</Typography>
        {products && products.length && (
          <Controls.Select
            label="מוצר לעריכה"
            name="productToEdit"
            value={values.productToEdit.displayName}
            options={products}
            onChange={(event) => getProductById(event)}
          />
        )}
        {productToEdit && (
          <Grid className={classes.gridTag}>
            <Typography variant="h5">{productToEdit.displayName}</Typography>
            <Controls.Input
              className={classes.marginTop}
              label="שם המוצר"
              value={productToEdit.displayName}
              onChange={(event) => editProduct(event)}
              name="displayName"
            />
            {categories && (
              <Controls.Select
                className={classes.marginTop}
                label="קטגוריה"
                name="categoryId"
                value={productToEdit.categoryId}
                options={categories}
                onChange={(event) => editProduct(event)}
              />
            )}
            <Controls.Checkbox
              label="תפריט פסח"
              className={classes.marginTop}
              name="isMenuPesach"
              value={productToEdit.isMenuPesach}
              onChange={(event) => editProduct(event)}
            ></Controls.Checkbox>
            <Controls.Checkbox
              label="תפריט ראש השנה"
              className={classes.marginTop}
              name="isMenuTishray"
              value={productToEdit.isMenuTishray}
              onChange={(event) => editProduct(event)}
            ></Controls.Checkbox>
            <Controls.Checkbox
              label="תפריט סוף שבוע"
              className={classes.marginTop}
              name="isMenuWeekend"
              value={productToEdit.isMenuWeekend}
              onChange={(event) => editProduct(event)}
            ></Controls.Checkbox>
            <Controls.Checkbox
              label="מלאי"
              className={classes.marginTop}
              name="inStock"
              value={productToEdit.inStock}
              onChange={(event) => editProduct(event)}
            ></Controls.Checkbox>
            <Controls.Input
              label="שם התמונה בענן"
              className={classes.marginTop}
              value={productToEdit.imgUrl}
              onChange={(event) => editProduct(event)}
              name="imgUrl"
            />
            {prices && (
              <Controls.Select
                className={classes.marginTop}
                label="מחירון"
                name="priceId"
                value={productToEdit.priceId}
                options={prices}
                onChange={(event) => editProduct(event)}
              />
            )}
            <TextareaAutosize
              className={classes.marginTop}
              placeholder="נא להכניס תיאור מוצר"
              name="description"
              value={productToEdit.description}
              onChange={(event) => editProduct(event)}
            />
            <Controls.Button
              className={classes.marginTop}
              text="עדכן מוצר"
              onClick={() => updateProduct()}
            ></Controls.Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
