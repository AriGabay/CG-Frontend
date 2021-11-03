import './Menu.scss';
import React from 'react';
import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { CategoryCard } from '../../cmps/CategoryCard';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import BackButton from '../../cmps/Controls/BackButton';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Menu = ({ menuType }) => {
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    categoryService.getCategories({ include: false }).then((categor) => {
      setCategories(categor);
    });
  }, []);

  return (
    <Grid className="menu">
      <Grid display="flex" alignItems="center" justifyContent="center">
        {history.location.pathname.includes('weekend') ? (
          <Typography variant="h3" gutterBottom>
            תפריט סוף שבוע
          </Typography>
        ) : null}
        {history.location.pathname.includes('tishray') ? (
          <Typography variant="h2" gutterBottom>
            תפריט חגי תשרי
          </Typography>
        ) : null}
        {history.location.pathname.includes('pesach') ? (
          <Typography variant="h2" gutterBottom>
            תפריט פסח
          </Typography>
        ) : null}
      </Grid>
      <Grid
        className="category-container"
        display="flex"
        alignItems="center"
        flexDirection="row"
        justifyContent="center"
        flexWrap="wrap"
      >
        {categories.length ? (
          categories.map((category, index) => {
            return <CategoryCard key={index} category={category} menuType={menuType} />;
          })
        ) : (
          <CircularProgress></CircularProgress>
        )}
      </Grid>
      <Grid mt={2} mb={2} container display="flex" justifyContent="center" alignContent="center">
        <BackButton text="חזור" to="/"></BackButton>
      </Grid>
    </Grid>
  );
};
