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
import Pagination from '@material-ui/core/Pagination';

const useStyles = makeStyles({
  gridThreeRows: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: 'auto',
    gap: '40px 40px',
    gridTemplateAreas: '. . .',
    '@media (max-width: 1000px)': {
      gridTemplateColumns: '1fr 1fr'
    },
    '@media (max-width: 700px)': {
      gridTemplateColumns: '1fr'
    }
  },
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
  },
  gridForPagination: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '4fr 0.20fr 0.2fr',
    gap: '40px 40px',
    gridTemplateAreas: '. .'
  },
  paginationCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%'
  }
});
export const ProductsList = () => {
  const classes = useStyles();
  const history = useHistory();
  const [products, setProducts] = useState();
  const [categoryName, setCategoryName] = useState();
  const [page, setPage] = useState(1);
  const { categoryId } = useParams();
  const pathName = history.location.pathname;
  useEffect(() => {
    productService
      .getProducts({ categoryId, include: true, pathName, page: Number(page) - 1 })
      .then((res) => {
        if (res && res.length) {
          setProducts(res);
          setCategoryName(res[0].Category.displayName);
        } else {
          setCategoryName(' ');
        }
      })
      .catch((error) => {
        console.log('error :', error);
      });
  }, [categoryId, pathName, page]);
  const backButton = () => {
    if (history.location.pathname.includes('weekend')) {
      return '/menu/weekend';
    } else if (history.location.pathname.includes('pesach')) {
      return '/menu/pesach';
    } else if (history.location.pathname.includes('tishray')) return '/menu/tishray';
  };
  const onChangePage = (e, page) => {
    if (page) {
      setPage(page);
      window.scrollTo(0, 0);
    } else {
      setPage(1);
      window.scrollTo(0, 0);
    }
  };
  return categoryName ? (
    <Grid display="flex" alignItems="center" flexDirection="column" justify="center">
      {categoryName && (
        <Grid p={1} display="flex" justifyContent="flex-start" m={2} width={100} alignItems="center">
          <Typography variant="h3">{categoryName}</Typography>
        </Grid>
      )}
      {products && products.length ? (
        <Grid className={classes.gridForPagination}>
          <Grid className={classes.gridThreeRows}>
            {products.map((product) => {
              return (
                <Grid
                  display="flex"
                  alignItems="center"
                  flexDirection="column"
                  justify="center"
                  className={classes.marginCenter}
                  key={product.id}
                >
                  <Container>
                    <ProductCard product={product} />
                  </Container>
                </Grid>
              );
            })}
          </Grid>
          <Pagination
            className={classes.paginationCenter}
            onChange={onChangePage}
            defaultPage={1}
            count={10}
            page={Number(page)}
            color="primary"
            showLastButton={false}
          ></Pagination>
          <BackButton to={() => backButton()} classProp={'center'} text="חזור"></BackButton>
        </Grid>
      ) : (
        <Grid mr={0} mt={2}>
          <Container>
            <Typography variant="h5"> אין מוצרים קימיים תחת קטגוריה זו</Typography>
            <BackButton to={() => backButton()} text="חזור"></BackButton>
          </Container>
        </Grid>
      )}
    </Grid>
  ) : (
    <Grid className={classes.progressScreen}>
      <CircularProgress />
      <BackButton to={() => backButton()} text="חזור"></BackButton>
    </Grid>
  );
};
