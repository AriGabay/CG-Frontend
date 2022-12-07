import React, { useState } from 'react';
import { useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { CategoryCard } from '../../cmps/CategoryCard';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import BackButton from '../../cmps/Controls/BackButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import { Helmet } from 'react-helmet';
import BasicModal from '../../cmps/BasicModal/BasicModal';
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles({
  gridMenu: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: 'auto',
    gap: '40px 40px',
    gridTemplateAreas: '. . .',
    '& > *': {
      margin: '0 auto',
    },
    '@media (max-width: 1000px)': {
      gridTemplateColumns: '1fr 1fr',
    },
    '@media (max-width: 800px)': {
      gridTemplateColumns: '1fr',
    },
  },
  progressScreen: {
    minWidth: '100vw',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column !important',
    '& > *': {
      marginBottom: '35px',
    },
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export const Menu = ({ menuType }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { categories } = useSelector((state) => state);
  const [titlePage, setTitlePage] = useState(null);

  useEffect(() => {
    if (!categories.length) {
      categoryService
        .getCategoriesMenu({ include: false })
        .then((categoriesMenu) => {
          if (categoriesMenu && categoriesMenu.length) {
            dispatch({ type: 'SET_CATEGORIES', payload: categoriesMenu });
          }
        });
    }
    if (menuType) {
      if (menuType === 'weekend') {
        setTitlePage('תפריט סוף שבוע');
      } else if (menuType === 'tishray') {
        setTitlePage('תפריט חגי תשרי');
      } else if (menuType === 'pesach') {
        setTitlePage('תפריט פסח');
      } else {
        setTitlePage('');
      }
      dispatch({ type: 'SET_MENU_TYPE', payload: menuType });
    }
  }, []);
  return (
    <Grid className="menu">
      <Helmet>
        <title>Catering Gabay - Menu</title>
        <meta name="menu-list" content="menu list" />
      </Helmet>
      <Grid className={classes.flexCenter}>
        {titlePage && (
          <Typography variant="h3" gutterBottom>
            {titlePage}
          </Typography>
        )}
      </Grid>
      {menuType === 'pesach' ? (
        <BasicModal
          contnentLineOne={'הזמנות לחג הפסח מתבצעות בכפולות של חמש מנות.'}
          contnentLineTow={'שיהיה חג שמח וכשר'}
          type="pesach"
        />
      ) : null}
      <Grid className={classes.gridMenu}>
        {categories && categories.length ? (
          categories.map((category, index) => {
            return (
              <CategoryCard
                key={index}
                category={category}
                menuType={menuType}
              />
            );
          })
        ) : (
          <CircularProgress></CircularProgress>
        )}
      </Grid>
      <Grid mt={2} mb={2} container className={classes.flexCenter}>
        <BackButton text="חזור" to="/" classProp={'center'}></BackButton>
      </Grid>
    </Grid>
  );
};
