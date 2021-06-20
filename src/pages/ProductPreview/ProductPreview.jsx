import './ProductPreview.scss';
import { useEffect, useState } from 'react';
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
import makeStyles from '@material-ui/core/styles/makeStyles';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import SvgIcon from '@material-ui/core/SvgIcon';
import { eventBus } from '../../services/event-bus';

const useStyles = makeStyles({
  addToCartBtn: {
    background: 'linear-gradient(315deg, rgba(236,223,188,1) 0%, rgba(47,72,99,1) 100%)',
    borderRadius: 3,
    color: 'white',
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
});

export const ProductPreview = () => {
  const [product, setProduct] = useState();
  const [productOrder, setProductOrder] = useState({ sizeToOrder: null, product: null, priceToShow: null });
  const { productId } = useParams();
  const classes = useStyles();
  useEffect(() => {
    productService.getProducts({ id: productId, include: true }).then((res) => {
      console.log('res:', res[0]);
      setProduct(res[0]);
    });
  }, [productId]);
  const addToCart = () => {
    console.log('product.sizeToOrder:');
    if (
      product.sizeToOrder === null &&
      product.sizeToOrder === undefined &&
      product.sizeToOrder === '' &&
      product.sizeToOrder === 0 &&
      !product.sizeToOrder
    )
      return;
    cartService.addToCart(productOrder).then(() => {
      eventBus.dispatch('addProductToCart', { message: 'נוסף לעגלה' });
    });
  };

  return product ? (
    <Grid className={classes.Grid} container>
      <Grid item mt={2} lg={6} md={6} sm={12}>
        <Typography variant="h3">{product.displayName}</Typography>
        <Grid ml={2} mt={2} className={classes.imgContainer}>
          <ImageCloud imageId={product.imgUrl} />
        </Grid>
        <Grid>
          {product.Price.priceType === 'unit' ? (
            <PriceForUnit productProps={product} productOrderProps={productOrder} setProductOrder={setProductOrder} />
          ) : null}
          {product.Price.priceType === 'box' ? (
            <PriceForBox product={product} productOrder={productOrder} setProductOrder={setProductOrder} />
          ) : null}
          {product.Price.priceType === 'weight' ? (
            <PriceForWeight product={product} productOrder={productOrder} setProductOrder={setProductOrder} />
          ) : null}
        </Grid>
        <Grid>
          <Button variant="contained" disableElevation className={classes.addToCartBtn} onClick={() => addToCart()}>
            הוסף לעגלה <SvgIcon component={ShoppingCartOutlinedIcon}></SvgIcon>
          </Button>
        </Grid>
        <Grid mt={2}>
          <BackButton to={`/products/${product.Category.id}`} text="חזור"></BackButton>
        </Grid>
      </Grid>
      <Grid item mt={2} lg={3} md={3} sm={12}>
        <Typography variant="h5">תיאור:</Typography>
        <Typography mt={2} mb={2}>
          {product.description}
        </Typography>
      </Grid>
    </Grid>
  ) : (
    <Box height={500} display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
};
