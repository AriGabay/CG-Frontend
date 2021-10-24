import './ProductsList.scss';
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductCard } from '../../cmps/ProductCard';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import BackButton from '../../cmps/Controls/BackButton';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  marginRight0: {
    marginRight: '0!important',
    marginBottom: '10px!important'
  },
  marginCenter: {
    '@media (max-width: 700px)': {
      margin: '0 auto !important'
    }
  },
  progressScreen: {
    minWidth: '100vw',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column !important',
    '& > *': {
      marginBottom: '35px'
    }
  }
});
export const ProductsList = () => {
  console.time('all component product list component');
  const classes = useStyles();
  const history = useHistory();
  const [products, setProducts] = useState();
  const [categoryName, setCategoryName] = useState();
  const { categoryId } = useParams();
  const pathName = history.location.pathname;
  useEffect(() => {
    console.time('getProduct');
    productService
      .getProducts({ categoryId, include: true, pathName })
      .then((res) => {
        if (res && res.length) {
          console.timeEnd('getProduct');
          setProducts(res);
          setCategoryName(res[0].Category.displayName);
        } else {
          setCategoryName(' ');
        }
      })
      .catch((error) => {
        console.log('error :', error);
      });
  }, [categoryId, pathName]);
  const backButton = () => {
    if (history.location.pathname.includes('weekend')) {
      return '/menu/weekend';
    } else if (history.location.pathname.includes('pesach')) {
      return '/menu/pesach';
    } else if (history.location.pathname.includes('tishray')) return '/menu/tishray';
  };
  const render = categoryName ? (
    <div>
      {console.time('start render')}
      {categoryName && (
        <Grid p={1} display="flex" justifyContent="flex-start" m={2} width={100} alignItems="center">
          <Typography variant="h3">{categoryName}</Typography>
        </Grid>
      )}
      {products && products.length ? (
        <Grid container>
          {products.map((product) => {
            return (
              <Grid className={classes.marginCenter} item key={product.id}>
                <Container>
                  <ProductCard product={product} />
                </Container>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Container>
          <Typography variant="h5"> אין מוצרים קימיים תחת קטגוריה זו</Typography>
        </Container>
      )}
      <Grid mr={0} mt={2}>
        <Container>
          <BackButton to={() => backButton()} text="חזור"></BackButton>
        </Container>
      </Grid>
      {console.timeEnd('start render')}
    </div>
  ) : (
    <Grid className={classes.progressScreen}>
      <CircularProgress />
      <BackButton to={() => backButton()} text="חזור"></BackButton>
    </Grid>
  );
  console.timeEnd('all component product list component');
  return render;
};
