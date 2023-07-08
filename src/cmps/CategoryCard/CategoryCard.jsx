import React from 'react';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { ImageCloud } from '../ImageCloud/ImageCloud';
import { useHistory } from 'react-router-dom';
import getCustomTheme from '../../hooks/getCustomTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
const customTheme = getCustomTheme();

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    borderRadius: '20px !important',
  },
  moreProductBtn: {
    color: customTheme.palette.primary.contrastText,
  },
  maxWidth: {
    maxWidth: '100%',
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export const CategoryCard = ({ category }) => {
  const { menuType } = useSelector((state) => state);
  const dispatch = useDispatch();
  const matches = useMediaQuery('(min-width:700px)');
  const classes = useStyles();
  let history = useHistory();
  const handleClick = () => {
    dispatch({ type: 'SET_CATEGORY', payload: { ...category } });
    dispatch({ type: 'SET_PAGE', payload: 1 });
    history.push(`/products/${category.id}/${menuType}`);
  };
  return (
    <Card
      key={category.id}
      className={classes.root}
      onClick={() => handleClick()}
    >
      <CardActionArea>
        <ImageCloud
          imageId={category.imgUrl}
          maxWidth={matches ? 350 : 250}
          maxHeight={matches ? 250 : 150}
          alt={`תמונה של קטגוריה ${
            category.displayName ? category.displayName : category.id
          }`}
        ></ImageCloud>
        <CardContent>
          <div className={classes.flexCenter}>
            <Typography
              classes={{ label: classes.moreProductBtn }}
              gutterBottom
              variant="h5"
              component="h2"
            >
              {category.displayName}
            </Typography>
          </div>
          <div className={classes.flexCenter}>
            <Typography
              classes={{ root: classes.maxWidth }}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {category.description}
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
      <div className={classes.flexCenter}>
        <CardActions>
          <Button
            classes={{
              root: classes.moreProductBtn,
              label: classes.moreProductBtn,
            }}
            size="small"
            color="primary"
          >
            עוד מוצרים
          </Button>
        </CardActions>
      </div>
    </Card>
  );
};
