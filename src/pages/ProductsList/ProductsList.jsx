import './ProductsList.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { ProductCard } from '../../cmps/ProductCard';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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
  }
});
export const ProductsList = ({ productsType }) => {
  const classes = useStyles();
  const history = useHistory();
  const [products, setProducts] = useState();
  const [category, setCategory] = useState();
  const { categoryId } = useParams();
  const pathName = history.location.pathname;

  useEffect(() => {
    productService.getProducts({ categoryId, include: false, pathName }).then((res) => {
      setProducts(res);
    });
    categoryService.getCategories({ id: categoryId, include: false }).then((res) => {
      setCategory(res[0]);
    });
  }, [categoryId, pathName]);
  const backButton = () => {
    if (history.location.pathname.includes('weekend')) {
      return '/menu/weekend';
    } else if (history.location.pathname.includes('pesach')) {
      return '/menu/pesach';
    } else if (history.location.pathname.includes('tishray')) return '/menu/tishray';
  };
  return category ? (
    <div>
      <Box p={1} display="flex" justifyContent="flex-start" m={2} width={100} alignItems="center">
        {<Typography variant="h3">{category.displayName}</Typography>}
      </Box>
      <Grid container>
        {products &&
          products.map((product) => {
            return (
              <Grid className={classes.marginCenter} item key={product.id}>
                <Container>
                  <ProductCard product={product} />
                </Container>
              </Grid>
            );
          })}
        <Container>{!products && <Typography variant="h5"> אין מוצרים קימיים תחת קטגוריה זו</Typography>}</Container>
      </Grid>
      <Grid mr={0} mt={2}>
        <Container>
          {/* <BackButton to="/menu" text="חזור"></BackButton> */}
          <BackButton to={() => backButton()} text="חזור"></BackButton>
        </Container>
      </Grid>
    </div>
  ) : (
    <CircularProgress />
  );
};
