import './ProductCard.scss';
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
import getCustomTheme from '../../hooks/getCustomTheme';
const customTheme = getCustomTheme();
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    marginBottom: 20,
  },
  label: {
    color: customTheme.palette.primary.contrastText + '!important',
  },
});

export const ProductCard = ({ product }) => {
  let history = useHistory();
  const classes = useStyles();
  const handleClick = () => {
    history.push(`/product/${product.id}`);
  };
  return (
    <Card className={`${classes.root} product-card`} onClick={() => handleClick()}>
      <CardActionArea>
        <ImageCloud imageId={product.imgUrl} maxWidth={350} maxHeight={250}></ImageCloud>
        <CardContent>
          <Box component="div" display="flex" alignItems="center" justifyContent="center">
            <Typography gutterBottom variant="h5" component="h2">
              {product.displayName}
            </Typography>
          </Box>
          <Box component="div" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="body2" color="textSecondary" component="p">
              {/* {product.description} */}
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam, commodi vel similique eius perferendis,
              mollitia accusantium explicabo nihil officia, id veniam. Ut architecto eligendi cupiditate! Deleniti quia
              porro animi accusamus.
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box display="flex" alignItems="center" justifyContent="center">
        <CardActions>
          <Button className={classes.label} size="small" color="primary">
            הוסף לסל
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};
