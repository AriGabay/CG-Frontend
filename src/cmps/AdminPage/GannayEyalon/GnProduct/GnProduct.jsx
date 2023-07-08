import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Controls from '../../../Controls/Controls';
import React, { useEffect, useState } from 'react';
import { useForm } from '../../../../hooks/useForm';
import { gnProductService } from '../../../../services/gnProductService';
import { gnCategoryService } from '../../../../services/gnCategoryService';
import { makeStyles } from '@mui/styles';
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
  productName: '',
  categoryId: '',
  imgUrl: '',
  autoAdd: '',
  productToRemove: '',
  description: '',
  productToEdit: '',
  photos: {},
};
export const GnProduct = ({ eventBus }) => {
  const classes = useStyles();
  const [categories, setCategories] = useState();
  const [products, setProducts] = useState();
  const [productToEdit, setProductToEdit] = useState();

  const { values, handleInputChange, setValues } = useForm(val, false);
  useEffect(() => {
    gnCategoryService.getGnCategoriesDropDown().then((category) => {
      setCategories(category);
    });
    gnProductService.getAllGnProducts().then((res) => {
      setProducts(res);
    });
  }, []);
  const addProduct = () => {
    const { productName, categoryId, imgUrl, description, autoAdd, photos } =
      values;
    const productData = {
      productName,
      categoryId,
      imgUrl,
      description,
      autoAdd,
      photos,
    };
    gnProductService.addGnProduct(productData).then(() => {
      eventBus.dispatch('success', { message: 'מוצר נוסף בהצלחה' });
    });
  };
  const removeProduct = () => {
    gnProductService.removeGnProduct(values.productToRemove).then(() => {
      eventBus.dispatch('success', { message: 'מוצר  נמחק בהצלחה' });
    });
  };
  const getProductById = ({ target }) => {
    gnProductService.getGnProductById(target.value).then((res) => {
      if (typeof res[0].photos === 'object') {
        setProductToEdit({ ...res[0], photos: { ...res[0].photos } });
        return;
      }
      setProductToEdit({ ...res[0], photos: JSON.parse(res[0].photos) });
    });
  };
  const editProduct = ({ target }) => {
    let { name, value } = target;
    const newProduct = { ...productToEdit, [name]: value };
    setProductToEdit(newProduct);
  };
  const updateProduct = () => {
    gnProductService.updateGnProduct(productToEdit).then(() => {
      eventBus.dispatch('success', { message: 'מוצר  עודכן בהצלחה' });
    });
  };
  const handelCahngeImageGallery = ({ target }) => {
    let { name, value } = target;
    if (name === 'imgUrl') {
      setValues((prev) => ({ ...prev, imgUrl: value }));
      name = 0;
    }
    setValues((prev) => ({
      ...prev,
      photos: { ...prev.photos, [name]: value },
    }));
  };
  const editPhotosGallery = ({ target }) => {
    let { name, value } = target;
    if (name === 'imgUrl') {
      name = 0;
    }
    let newPhotos = {};
    if (!value.length) {
      Object.keys(productToEdit.photos).forEach((key) => {
        if (key !== name) {
          newPhotos[key] = productToEdit.photos[key];
        }
      });
    } else {
      newPhotos = { ...productToEdit.photos, [name]: value };
    }
    setProductToEdit({ ...productToEdit, photos: { ...newPhotos } });
  };
  return (
    <Grid>
      <h1>אתר גני איילון !!!!!</h1>
      <Grid className={classes.gridTag}>
        <Typography variant="h5">הוספה</Typography>
        <Controls.Input
          className={classes.marginTop}
          label="שם המוצר"
          value={values.productName}
          onChange={handleInputChange}
          name="productName"
        />
        <Controls.Input
          label="שם התמונה בענן"
          className={classes.marginTop}
          value={values.imgUrl}
          onChange={(event) => handelCahngeImageGallery(event)}
          name="imgUrl"
        />
        <h5>הוספה אוטומטית :</h5>
        <h5>1 - מוסיף אוטומטי</h5>
        <h5>0 - לא מוסיף אוטומטי</h5>
        <Controls.Input
          label="הוספה אוטומטית"
          className={classes.marginTop}
          value={values.autoAdd}
          onChange={handleInputChange}
          name="autoAdd"
        />
        <h5>תמונות גלריה</h5>
        <Controls.Input
          label="הוספה תמונה"
          className={classes.marginTop}
          value={values.photos[1]}
          onChange={(event) => handelCahngeImageGallery(event)}
          name="1"
        />
        <Controls.Input
          label="הוספה תמונה"
          className={classes.marginTop}
          value={values.photos[2]}
          onChange={(event) => handelCahngeImageGallery(event)}
          name="2"
        />
        <Controls.Input
          label="הוספה תמונה"
          className={classes.marginTop}
          value={values.photos[3]}
          onChange={(event) => handelCahngeImageGallery(event)}
          name="3"
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
            value={values.productToEdit.productName}
            options={products}
            onChange={(event) => getProductById(event)}
          />
        )}
        {productToEdit && (
          <Grid className={classes.gridTag}>
            <Typography variant="h5">{productToEdit.productName}</Typography>
            <Controls.Input
              className={classes.marginTop}
              label="שם המוצר"
              value={productToEdit.productName}
              onChange={(event) => editProduct(event)}
              name="productName"
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
            <Controls.Input
              label="שם התמונה בענן"
              className={classes.marginTop}
              value={productToEdit.imgUrl}
              onChange={(event) => editProduct(event)}
              name="imgUrl"
            />
            <h5>הוספה אוטומטית :</h5>
            <h5>1 / true - מוסיף אוטומטי</h5>
            <h5>0 / false - לא מוסיף אוטומטי</h5>
            <Controls.Input
              label="הוספה אוטומטית"
              className={classes.marginTop}
              value={productToEdit.autoAdd}
              onChange={(event) => editProduct(event)}
              name="autoAdd"
            />
            <h5>תמונות גלריה</h5>
            <Controls.Input
              label="עריכה תמונה"
              className={classes.marginTop}
              value={productToEdit?.photos[1]}
              onChange={(event) => editPhotosGallery(event)}
              name="1"
            />
            <Controls.Input
              label="עריכה תמונה"
              className={classes.marginTop}
              value={productToEdit?.photos[2]}
              onChange={(event) => editPhotosGallery(event)}
              name="2"
            />
            <Controls.Input
              label="עריכה תמונה"
              className={classes.marginTop}
              value={productToEdit?.photos[3]}
              onChange={(event) => editPhotosGallery(event)}
              name="3"
            />
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
