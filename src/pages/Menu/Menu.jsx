import './Menu.scss';
import React from 'react';
import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { CategoryCard } from '../../cmps/CategoryCard';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import BackButton from '../../cmps/Controls/BackButton';
import { useHistory } from 'react-router-dom';
export const Menu = ({ menuType }) => {
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    console.time('get Categories : ');
    categoryService.getCategories({ include: false }).then((categor) => {
      console.timeEnd('get Categories : ');
      setCategories(categor);
    });
  }, []);

  return (
    <Box className="menu">
      <Box display="flex" alignItems="center" justifyContent="center">
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
      </Box>
      <Box
        className="category-container"
        display="flex"
        alignItems="center"
        flexDirection="row"
        justifyContent="center"
        flexWrap="wrap"
      >
        {categories &&
          categories.map((category, index) => {
            return <CategoryCard key={index} category={category} menuType={menuType} />;
          })}
      </Box>
      <Grid mt={2} mb={2} container display="flex" justifyContent="center" alignContent="center">
        <BackButton text="חזור" to="/"></BackButton>
      </Grid>
    </Box>
  );
};
