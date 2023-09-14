import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../../cmps/Controls/BackButton';
import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';
import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { PriceForUnit } from '../../cmps/PriceForUnit/PriceForUnit';
import { PriceForBox } from '../../cmps/PriceForBox/PriceForBox';
import { PriceForWeight } from '../../cmps/PriceForWeight/PriceForWeight';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SvgIcon from '@mui/material/SvgIcon';
import { eventBus } from '../../services/event-bus';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

const useStyles = makeStyles({
  addToCartBtn: {
    background:
      'linear-gradient(90deg, hsla(36, 50%, 30%, 1) 0%, hsla(36, 35%, 56%, 0.8) 90%)',
    borderRadius: 3,
    color: 'white!important',
    height: 48,
    padding: 30,
    paddingTop: 0,
    paddingBottom: 0,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  Grid: {
    display: 'flex',
    flexDirection: 'row',
    direction: 'row',
    justify: 'space-evenly',
    alignItems: 'center',
    paddingRight: 30,
    paddingLeft: 30,
  },
  imgContainer: {
    maxWidth: '300px',
  },
  textOverDescription: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 600,
  },
  hoverEffect: {
    '&:hover': {
      transform: 'scale(1.05)',
      width: 'min-content',
      height: 'min-content',
    },
  },
});

export const ProductPreview = () => {
  const isMobile = useMediaQuery('(max-width:960px)');
  const product = useSelector((state) => _.cloneDeep(state.product));
  const dispatch = useDispatch();
  const [productOrder, setProductOrder] = useState({
    sizeToOrder: null,
    product: null,
    priceToShow: null,
  });
  const { productId } = useParams();
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    if (!Object.keys(product).length || productId !== product.id) {
      productService
        .getProductById(productId)
        .then((res) => {
          dispatch({ type: 'SET_PRODUCT', payload: res });
        })
        .catch((error) => console.log(error));
    }
  }, [productId]);
  const addToCart = () => {
    if (
      !productOrder ||
      productOrder?.sizeToOrder === null ||
      productOrder?.sizeToOrder === undefined ||
      productOrder?.sizeToOrder === '' ||
      productOrder?.sizeToOrder === 0 ||
      !productOrder?.sizeToOrder
    ) {
      eventBus.dispatch('error', { message: 'לא נבחרה כמות' });
      return;
    }
    cartService.addToCart(productOrder).then(() => {
      eventBus.dispatch('addProductToCart', { message: 'נוסף לעגלה' });
    });
  };

  return Object.keys(product).length ? (
    <Fragment>
      <Helmet>
        <title>קייטרינג גבאי - מוצר</title>
        <meta name="products-preview" content="products preview" />
        <meta name="robots" content="all" />
      </Helmet>
      <Grid className={classes.Grid} container>
        <Grid item mt={2} lg={6} md={6} sm={12}>
          <Typography
            aria-label={product.displayName}
            fontSize={'4rem'}
            variant="h1"
          >
            {product.displayName}
          </Typography>
          <Grid ml={2} mt={2} className={classes.imgContainer}>
            <ImageCloud
              imageId={product.imgUrl}
              style={{ borderRadius: '20px' }}
              alt={`תמונה של מוצר ${
                product.displayName?.length ? product.displayName : product.id
              }`}
            />
          </Grid>
          {product.isMenuPesach === true && (
            <Box
              component="div"
              display="flex"
              alignItems="center"
              justifyContent="start"
            >
              {!!product.kitniyot === true ? (
                <Typography
                  className={classes.productDescription}
                  style={{ fontWeight: 'bold' }}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  מכיל קיטניות
                </Typography>
              ) : (
                <Typography
                  className={classes.productDescription}
                  style={{ fontWeight: 'bold' }}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  ללא חשש קיטניות
                </Typography>
              )}
            </Box>
          )}
          {isMobile && product.description.length > 0 && (
            <Grid item mt={2} lg={3} md={3} sm={12}>
              <Typography fontSize={'2.5rem'} aria-label="תיאור" variant="h2">
                תיאור:
              </Typography>
              <Typography className={classes.textOver} mt={2} mb={2}>
                {product.description}
              </Typography>
            </Grid>
          )}
          <Grid>
            {product.Price.priceType === 'unit' ? (
              <PriceForUnit
                productOrderProps={productOrder}
                setProductOrder={setProductOrder}
              />
            ) : null}
            {product.Price.priceType === 'box' ? (
              <PriceForBox
                product={product}
                setProductOrder={setProductOrder}
              />
            ) : null}
            {product.Price.priceType === 'weight' ? (
              <PriceForWeight
                product={product}
                setProductOrder={setProductOrder}
              />
            ) : null}
          </Grid>
          {!!product.isMenuPesach ?? (
            <Box
              component="div"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {!!product.kitniyot === true ? (
                <Typography
                  className={classes.productDescription}
                  style={{ fontWeight: 'bold' }}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  מכיל קיטניות
                </Typography>
              ) : (
                <Typography
                  className={classes.productDescription}
                  style={{ fontWeight: 'bold' }}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  ללא חשש קיטניות
                </Typography>
              )}
            </Box>
          )}
          <Grid>
            <Button
              variant="contained"
              disableElevation
              className={classes.addToCartBtn}
              onClick={() => addToCart()}
            >
              הוסף לעגלת הקניות
              <SvgIcon component={ShoppingCartOutlinedIcon}></SvgIcon>
            </Button>
          </Grid>
          <Grid mt={2} mb={2} className={classes.hoverEffect}>
            <BackButton
              to={history.location.state ? history.location.state : '/'}
              text="חזור"
            ></BackButton>
          </Grid>
        </Grid>
        {isMobile === false && product.description.length > 0 && (
          <Grid item mt={2} lg={3} md={3} sm={12}>
            <Typography aria-label="תיאור" fontSize={'2.5rem'} variant="h2">
              תיאור:
            </Typography>
            <Typography mt={2} mb={2} className={classes.textOver}>
              {product.description}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Fragment>
  ) : (
    <Box
      height={500}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Box>
  );
};
