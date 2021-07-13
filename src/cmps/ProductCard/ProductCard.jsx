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

export const ProductCard = ({ product }) => {
  let history = useHistory();
  const useStyles = makeStyles({
    root: {
      maxWidth: 345,
      marginBottom: 20,
      '@media (max-width: 700px)': {
        maxWidth: 250,
      },
    },
    label: {
      color: customTheme.palette.primary.contrastText + '!important',
    },
  });
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
              {product.description}
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
