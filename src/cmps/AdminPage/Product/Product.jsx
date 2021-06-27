import './Product.scss';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Controls from '../../Controls/Controls';
import { useEffect, useState } from 'react';
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
    flexDirection: 'column',
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
};
export const Product = () => {
  const classes = useStyles();
  const [prices, setPrices] = useState();
  const [categories, setCategories] = useState();
  const [products, setProducts] = useState();

  const { values, handleInputChange } = useForm(val, false);
  useEffect(() => {
    pricesService.getPrices(false).then((prices) => setPrices(prices));
    categoryService.getCategories(false).then((category) => {
      setCategories(category);
    });
    productService.getProducts(false).then((res) => {
      setProducts(res);
    });
  }, []);
  const addProduct = () => {
    console.log('values:', values);
    const { displayName, categoryId, inStock, imgUrl, priceId, description } = values;
    const data = {
      displayName,
      categoryId,
      inStock,
      imgUrl,
      priceId,
      description,
    };
    console.log('data:', data);
    productService.addProduct(data).then((res) => {
      console.log('add product');
    });
  };
  const removeProduct = () => {
    productService.removeProduct(values.productToRemove).then((res) => {
      console.log('remove product');
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
          label="מלאי"
          className={classes.marginTop}
          name="inStock"
          value={values.inStock}
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
        <Controls.Button className={classes.marginTop} text="הוסף מוצר" onClick={() => addProduct()}></Controls.Button>
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
    </Grid>
  );
};
