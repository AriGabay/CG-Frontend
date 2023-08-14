import React from 'react';
import { ImageCloud } from '../ImageCloud/ImageCloud';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    marginBottom: 20,
    borderRadius: '20px !important',
    '@media (max-width: 700px)': {
      maxWidth: '270px !important',
      margin: '0 auto',
      marginBottom: 20,
    },
  },
  productDescription: {
    width: '100%',
    textAlign: 'center',
    height: 'auto',
  },
  overEffect: {
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
});
export const ProductCard = ({ product }) => {
  let history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const handleClick = () => {
    if (product && Object.keys(product).length) {
      dispatch({ type: 'SET_PRODUCT', payload: _.cloneDeep(product) });
      history.push({
        pathname: `/product/${product.id}`,
        state: history.location.pathname,
      });
    }
  };
  return (
    <Card className={classes.root} onClick={() => handleClick()}>
      <CardActionArea>
        <ImageCloud
          imageId={product.imgUrl}
          maxWidth={350}
          maxHeight={250}
          alt={`תמונה של מוצר ${
            product.displayName ? product.displayName : product.id
          }`}
        ></ImageCloud>
        <CardContent>
          <Box
            component="div"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              aria-label={product.displayName}
              gutterBottom
              variant="h5"
              component="h2"
            >
              {product.displayName}
            </Typography>
          </Box>
          <Box
            component="div"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              aria-label={product.description}
              className={classes.productDescription}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {product.description}
            </Typography>
          </Box>
          {history.location.pathname.includes('pesach') ?? (
            <Box
              component="div"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {product.kitniyot === true ? (
                <Typography
                  className={classes.productDescription}
                  style={{ fontWeight: 'bold' }}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  aria-label={'מכיל קיטניות'}
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
                  aria-label={'ללא חשש קיטניות'}
                >
                  ללא חשש קיטניות
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
      <Box
        className={classes.overEffect}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CardActions>
          <Button
            style={{ color: 'black' }}
            aria-label="הוסף לסל"
            size="small"
            color="primary"
          >
            הוסף לסל
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};
