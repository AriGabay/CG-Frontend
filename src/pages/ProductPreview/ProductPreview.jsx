import './ProductPreview.scss';
import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../../cmps/Controls/BackButton';
import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';
import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { PriceForUnit } from '../../cmps/PriceForUnit/PriceForUnit';
import { PriceForBox } from '../../cmps/PriceForBox/PriceForBox';
import { PriceForWeight } from '../../cmps/PriceForWeight/PriceForWeight';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import SvgIcon from '@material-ui/core/SvgIcon';
import { eventBus } from '../../services/event-bus';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';

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
  textOver: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export const ProductPreview = () => {
  const isMobile = useMediaQuery('(max-width:960px)');
  const product = useSelector((state) => {
    return state.product;
  });
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
  }, []);
  const addToCart = () => {
    if (
      productOrder === undefined ||
      productOrder?.sizeToOrder === null ||
      productOrder?.sizeToOrder === undefined ||
      productOrder?.sizeToOrder === '' ||
      productOrder?.sizeToOrder === 0 ||
      !productOrder?.sizeToOrder
    )
      return;
    cartService.addToCart(productOrder).then(() => {
      eventBus.dispatch('addProductToCart', { message: 'נוסף לעגלה' });
    });
  };

  return Object.keys(product).length ? (
    <Fragment>
      <Helmet>
        <title>Catering Gabay - Products Preview</title>
        <mete name="products-preview" content="products preview" />
      </Helmet>
      <Grid className={classes.Grid} container>
        <Grid item mt={2} lg={6} md={6} sm={12}>
          <Typography variant="h3">{product.displayName}</Typography>
          <Grid ml={2} mt={2} className={classes.imgContainer}>
            <ImageCloud
              imageId={product.imgUrl}
              style={{ borderRadius: '20px' }}
            />
          </Grid>
          {isMobile && product.description.length > 0 && (
            <Grid item mt={2} lg={3} md={3} sm={12}>
              <Typography variant="h5">תיאור:</Typography>
              <Typography className={classes.textOver} mt={2} mb={2}>
                {product.description}
              </Typography>
            </Grid>
          )}
          <Grid>
            {product.Price.priceType === 'unit' ? (
              <PriceForUnit
                productProps={product}
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
          <Grid>
            <Button
              variant="contained"
              disableElevation
              className={classes.addToCartBtn}
              onClick={() => addToCart()}
            >
              הוסף לעגלה{' '}
              <SvgIcon component={ShoppingCartOutlinedIcon}></SvgIcon>
            </Button>
          </Grid>
          <Grid mt={2} mb={2}>
            <BackButton
              to={history.location.state ? history.location.state : '/'}
              text="חזור"
            ></BackButton>
          </Grid>
        </Grid>
        {isMobile === false && product.description.length > 0 && (
          <Grid item mt={2} lg={3} md={3} sm={12}>
            <Typography variant="h5">תיאור:</Typography>
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
