import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductCard } from '../../cmps/ProductCard';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import BackButton from '../../cmps/Controls/BackButton';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

const useStyles = makeStyles({
  gridThreeRows: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: 'auto',
    gap: '40px 40px',
    gridTemplateAreas: '. . .',
    '@media (max-width: 1000px)': {
      gridTemplateColumns: '1fr 1fr',
    },
    '@media (max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
  marginRight0: {
    marginRight: '0!important',
    marginBottom: '10px!important',
  },
  marginCenter: {
    '@media (max-width: 700px)': {
      margin: '0 auto !important',
    },
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
      marginBottom: '35px',
    },
  },
  gridForPagination: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '4fr 0.20fr 0.2fr',
    gap: '40px 40px',
    gridTemplateAreas: '. .',
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export const ProductsList = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const { products, page } = useSelector((state) => state);
  const [categoryName, setCategoryName] = useState();
  const { categoryId } = useParams();
  const pathName = history.location.pathname;

  const getProducts = async (lastPage) => {
    productService
      .getProducts({
        categoryId,
        include: true,
        pathName,
        page: lastPage ? Number(lastPage) - 1 : Number(page) - 1,
      })
      .then((products) => {
        if (products && products.length) {
          dispatch({ type: 'SET_PRODUCTS', payload: [...products] });
          setCategoryName(products[0].Category.displayName);
        } else {
          dispatch({ type: 'SET_PRODUCTS', payload: [] });
          setCategoryName(categoryName ? categoryName : '');
        }
      })
      .catch(() => {
        dispatch({ type: 'SET_PRODUCTS', payload: [] });
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const backButton = () => {
    if (!pathName || !pathName?.length) return;
    if (pathName.includes('weekend')) {
      return '/menu/weekend';
    } else if (pathName.includes('pesach')) {
      return '/menu/pesach';
    } else if (pathName.includes('tishray')) {
      return '/menu/tishray';
    }
  };
  const onChangePage = async (__, page) => {
    if (page) {
      dispatch({ type: 'SET_PAGE', payload: page });
      await getProducts(page);
      if (products.length)
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 200);
    } else {
      dispatch({ type: 'SET_PAGE', payload: 1 });
      await getProducts(1);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 200);
    }
  };
  return categoryName ? (
    <Fragment>
      <Helmet>
        <title>קייטרינג גבאי - מוצרים</title>
        <meta name="products-list" content="products list" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Grid className={classes.flexCenter} flexDirection="column">
        {categoryName && (
          <Typography
            p={1}
            className={classes.flexCenter}
            justifyContent="flex-start"
            m={2}
            width={100}
            aria-label={categoryName}
            fontSize={'4rem'}
            variant="h1"
          >
            {categoryName}
          </Typography>
        )}
        {products && products?.length ? (
          <Grid className={classes.gridForPagination}>
            <Grid className={classes.gridThreeRows}>
              {products.map((product) => {
                return (
                  <Grid
                    flexDirection="column"
                    className={`${classes.marginCenter} ${classes.flexCenter}`}
                    key={product.id}
                  >
                    <Container>
                      <ProductCard product={{ ...product }} />
                    </Container>
                  </Grid>
                );
              })}
            </Grid>
            <Pagination
              className={classes.flexCenter}
              height={'30%'}
              onChange={onChangePage}
              defaultPage={Number(page)}
              count={10}
              page={Number(page)}
              color="primary"
              showLastButton={false}
            ></Pagination>
            <BackButton
              to={() => backButton()}
              classProp={'center'}
              text="חזור"
            ></BackButton>
          </Grid>
        ) : (
          <Grid mr={0} mt={2}>
            <Container>
              <Typography variant="h5">
                {' '}
                אין מוצרים קימיים תחת קטגוריה זו
              </Typography>
              <div className={classes.flexCenter} style={{ marginTop: 5 }}>
                <BackButton
                  to={() => backButton()}
                  text="חזור"
                  style={{ marginBottom: 0 }}
                ></BackButton>
                {page && (
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={(event) => onChangePage(event, page - 1)}
                    style={{ marginRight: 20, marginBottom: 0 }}
                  >
                    עמוד אחורה
                  </Button>
                )}
              </div>
            </Container>
          </Grid>
        )}
      </Grid>
    </Fragment>
  ) : (
    <Grid className={classes.progressScreen}>
      <CircularProgress />
      <BackButton to={() => backButton()} text="חזור"></BackButton>
    </Grid>
  );
};
