import './CategoryCard.scss';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { ImageCloud } from '../ImageCloud/ImageCloud';
import { useHistory } from 'react-router-dom';
import getCostumeTheme from '../../hooks/getCostumeTheme';
const costumeTheme = getCostumeTheme();

export const CategoryCard = ({ category, index }) => {
  const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    moreProductBtn: {
      color: costumeTheme.palette.primary.contrastText,
    },
  });
  let history = useHistory();
  const handleClick = () => {
    history.push(`/products/${category.id}`);
  };
  const classes = useStyles();
  return (
    <Card key={index} className={`${classes.root} category-card`} onClick={() => handleClick()}>
      <CardActionArea>
        <ImageCloud imageId={category.imgUrl} maxWidth={350} maxHeight={250}></ImageCloud>
        <CardContent>
          <Box component="div" display="flex" alignItems="center" justifyContent="center">
            <Typography className={classes.moreProductBtn} gutterBottom variant="h5" component="h2">
              {category.displayName}
            </Typography>
          </Box>
          <Box component="div" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="body2" color="textSecondary" component="p">
              {category.description}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box display="flex" alignItems="center" justifyContent="center">
        <CardActions>
          <Button
            classes={{ root: classes.moreProductBtn, label: classes.moreProductBtn }}
            size="small"
            color="primary"
          >
            עוד מוצרים
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};
