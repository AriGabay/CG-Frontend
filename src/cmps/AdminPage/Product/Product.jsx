import './Product.scss';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Controls from '../../Controls/Controls';
import { useEffect, useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { pricesService } from '../../../services/pricesService';
import { sizePriceService } from '../../../services/sizePriceService';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { makeStyles } from '@material-ui/core/styles';
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
};
export const Product = (props) => {
  const classes = useStyles();
  const [prices, setPrices] = useState();
  const [sizePrices, setSizePrices] = useState();
  const [categories, setCategories] = useState();
  const [products, setProducts] = useState();

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(val, false);
  useEffect(() => {
    pricesService.getPrices().then((res) => setPrices(res));
    categoryService.getCategories().then((res) => {
      setCategories(res);
    });
    sizePriceService.getSizePrices().then((data) => {
      var arr = [];
      data.map((sizePrice) => {
        const newObj = { ...sizePrice, displayName: 'מחיר:  ' + sizePrice.amount + ' ' + 'כמות: ' + sizePrice.size };
        arr.push(newObj);
      });
      setSizePrices(arr);
    });
    productService.getProducts(false).then((res) => {
      setProducts(res);
    });
  }, []);
  const addProduct = () => {
    const { displayName, categoryId, inStock, imgUrl, priceId } = values;
    const data = {
      displayName,
      categoryId,
      inStock,
      imgUrl,
      priceId,
    };
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

// export const SizePrice = (props) => {
//   const addSizePrice = () => {

//   return (
//     <Grid>
//       <Grid display="flex" mt={2} justifyContent="center" alignItems="flex-start" flexDirection="column">
//         <Controls.Input label="כמות" value={values.size} onChange={handleInputChange} name="size"></Controls.Input>
//         {prices && (
//           <Controls.Select
//             label="שיוך מחיר למחירון"
//             name="priceForSizePrice"
//             value={values.priceForSizePrice}
//             options={prices}
//             onChange={handleInputChange}
//           />
//         )}
//         <Controls.Button text="הוסף מחיר" onClick={() => addSizePrice()}></Controls.Button>
//       </Grid>
//       <Grid display="flex" mt={2} justifyContent="center" alignItems="flex-start" flexDirection="column">
//         {sizePrices && (
//           <Controls.Select
//             label="מחיר למחיקה"
//             name="removeSizePrice"
//             value={values.removeSizePrice}
//             options={sizePrices}
//             onChange={handleInputChange}
//           />
//         )}
//       </Grid>
//     </Grid>
//   );
// };
