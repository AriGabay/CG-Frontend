import './ProductCard.scss';
import React from 'react';
import { ImageCloud } from '../ImageCloud/ImageCloud';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    marginBottom: 20,
    '@media (max-width: 700px)': {
      maxWidth: '270px !important',
      margin: '0 auto',
      marginBottom: 20
    }
  },
  productDescription: {
    width: '100%',
    textAlign: 'center',
    height: 'auto'
  }
});
export const ProductCard = ({ product }) => {
  let history = useHistory();
  const classes = useStyles();
  const handleClick = () => {
    history.push({
      pathname: `/product/${product.id}`,
      state: history.location.pathname
    });
  };
  return (
    <Card className={classes.root} onClick={() => handleClick()}>
      <CardActionArea>
        <ImageCloud imageId={product.imgUrl} maxWidth={350} maxHeight={250}></ImageCloud>
        <CardContent>
          <Box component="div" display="flex" alignItems="center" justifyContent="center">
            <Typography gutterBottom variant="h5" component="h2">
              {product.displayName}
            </Typography>
          </Box>
          <Box component="div" display="flex" alignItems="center" justifyContent="center">
            <Typography className={classes.productDescription} variant="body2" color="textSecondary" component="p">
              {product.description}
            </Typography>
          </Box>
          {history.location.pathname.includes('pesach') ? (
            <Box component="div" display="flex" alignItems="center" justifyContent="center">
              {product.kitniyot === true ? (
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
                <Typography>לא מכיל קיטניות</Typography>
              )}
            </Box>
          ) : (
            <Typography></Typography>
          )}
        </CardContent>
      </CardActionArea>
      <Box display="flex" alignItems="center" justifyContent="center">
        <CardActions>
          <Button size="small" color="primary">
            הוסף לסל
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};
