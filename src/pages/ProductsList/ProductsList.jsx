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
import makeStyles from '@material-ui/core/styles/makeStyles';
const useStyles = makeStyles({
  marginRight0: {
    marginRight: '0!important',
    marginBottom: '10px!important',
  },
});
export const ProductsList = () => {
  const classes = useStyles();
  const [products, setProducts] = useState();
  const [category, setCategory] = useState();
  const { categoryId } = useParams();

  useEffect(() => {
    productService.getProducts({ categoryId, include: true }).then((res) => {
      setProducts(res);
    });
    // צריך לשנות את ה include ל  false
    categoryService.getCategories({ id: categoryId, include: true }).then((res) => setCategory(res[0]));
  }, [categoryId]);
  return category ? (
    <div>
      <Box p={1} display="flex" justifyContent="flex-start" m={2} width={100} alignItems="center">
        {<Typography variant="h3">{category.displayName}</Typography>}
      </Box>
      <Grid container>
        {products &&
          products.map((product) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={product.id}>
                <Container>
                  <ProductCard product={product} />
                </Container>
              </Grid>
            );
          })}
        <Container>{!products && <Typography variant="h5"> אין מוצרים קימיים תחת קטגוריה זו</Typography>}</Container>
      </Grid>
      <Grid container mr={0} mt={2}>
        <Container className={classes.marginRight0}>
          <BackButton to="/menu" text="חזור"></BackButton>
        </Container>
      </Grid>
    </div>
  ) : (
    <CircularProgress />
  );
};
