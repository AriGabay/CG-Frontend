import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { ImageCloud } from '../ImageCloud/ImageCloud';
import { useHistory } from 'react-router-dom';
import getCustomTheme from '../../hooks/getCustomTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
