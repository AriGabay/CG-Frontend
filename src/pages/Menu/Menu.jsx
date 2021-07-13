import './Menu.scss';
import React from 'react';
import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { CategoryCard } from '../../cmps/CategoryCard';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import BackButton from '../../cmps/Controls/BackButton';
export const Menu = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    categoryService.getCategories({ include: false }).then((categor) => {
      setCategories(categor);
    });
  }, []);

  return (
    <Box className="menu">
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h2" gutterBottom>
          Menu
        </Typography>
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
            return <CategoryCard key={index} category={category} />;
          })}
      </Box>
      <Grid mt={2} mb={2} container display="flex" justifyContent="center" alignContent="center">
        <BackButton text="חזור" to="/"></BackButton>
      </Grid>
    </Box>
  );
};
