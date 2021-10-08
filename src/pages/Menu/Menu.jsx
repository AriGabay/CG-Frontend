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
  console.time('all component menu component');
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    console.time('get Categories : ');
    categoryService.getCategories({ include: false }).then((categor) => {
      console.timeEnd('get Categories : ');
      setCategories(categor);
    });
  }, []);

  const render = (
    <Grid className="menu">
      {console.time('the render menu component')}
      <Grid display="flex" alignItems="center" justifyContent="center">
        {history.location.pathname.includes('weekend') ? (
          <Typography variant="h2" gutterBottom>
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
      {console.timeEnd('the render menu component')}
    </Grid>
  );
  console.timeEnd('all component menu component');
  return render;
};
