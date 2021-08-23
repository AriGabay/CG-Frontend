import './CategoryCard.scss';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
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
const customTheme = getCustomTheme();

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  moreProductBtn: {
    color: customTheme.palette.primary.contrastText
  }
});
export const CategoryCard = ({ category, index, menuType }) => {
  const matches = useMediaQuery('(min-width:700px)');
  let history = useHistory();
  const handleClick = () => {
    history.push(`/products/${category.id}/${menuType}`);
  };
  const classes = useStyles({ menuType });
  return (
    <Card key={index} className={`${classes.root} category-card`} onClick={() => handleClick()}>
      <CardActionArea>
        <ImageCloud
          imageId={category.imgUrl}
          maxWidth={matches ? 350 : 250}
          maxHeight={matches ? 250 : 150}
        ></ImageCloud>
        <CardContent>
          <Box component="div" display="flex" alignItems="center" justifyContent="center">
            <Typography classes={{ label: classes.moreProductBtn }} gutterBottom variant="h5" component="h2">
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
