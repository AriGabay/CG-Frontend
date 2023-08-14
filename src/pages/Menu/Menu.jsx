import React, { useCallback, useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { CategoryCard } from '../../cmps/CategoryCard';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import BackButton from '../../cmps/Controls/BackButton';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';
import BasicModal from '../../cmps/BasicModal/BasicModal';
import { useSelector, useDispatch } from 'react-redux';
import { isMenuEnableService } from '../../services/isMenuEnableService';

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
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export const Menu = ({ menuType }) => {
  const dispatch = useDispatch();
  const { flexCenter, gridMenu } = useStyles();
  const { categories } = useSelector((state) => state);
  const [titlePage, setTitlePage] = useState(null);
  const [menuEnables, setMenuEnables] = useState({});

  const checkMenuEnables = useCallback(async () => {
    const menus = await isMenuEnableService.getAllMenuEnables();
    menus.forEach((menu) => {
      const menuType = menu.menuType;
      setMenuEnables((prev) => ({ ...prev, [menuType]: menu.enable }));
    });
  }, []);

  useEffect(() => {
    checkMenuEnables();
  }, []);

  const getCategoriesMenuCallBack = useCallback(async () => {
    if (!categories.length) {
      try {
        const categoriesMenu = await categoryService.getCategoriesMenu({
          include: false,
        });
        if (categoriesMenu && categoriesMenu.length) {
          dispatch({ type: 'SET_CATEGORIES', payload: categoriesMenu });
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    switch (menuType) {
      case 'weekend':
        setTitlePage('תפריט סוף שבוע');
        break;
      case 'tishray':
        setTitlePage('תפריט חגי תשרי');
        break;
      case 'pesach':
        setTitlePage('תפריט פסח');
        break;
      default:
        setTitlePage('');
        break;
    }
    dispatch({
      type: 'SET_MENU_TYPE',
      payload: menuType.length ? menuType : '',
    });
  }, []);
  useEffect(() => getCategoriesMenuCallBack(), [menuType]);
  return (
    <Grid className="menu">
      <Helmet>
        <title>קייטרינג גבאי - תפריט</title>
        <meta name="menu-list" content="menu list" />
      </Helmet>
      <Grid className={flexCenter}>
        {titlePage && (
          <Typography
            aria-label={titlePage}
            fontSize={'4rem'}
            variant="h1"
            gutterBottom
          >
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
      <Grid className={gridMenu}>
        {categories && categories.length ? (
          categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))
        ) : (
          <CircularProgress></CircularProgress>
        )}
      </Grid>
      {menuEnables['message_home_page'] && (
        <BasicModal
          contnentLineOne={`האתר סגור להזמנות חדשות, עקב עבודת תחזוקה באתר.
              `}
          contnentLineTow={' '}
          lockScreen={true}
          type="pesach"
          withCloseBtn={
            menuEnables['withCloseBtn'] ? menuEnables['withCloseBtn'] : false
          }
        />
      )}
      <Grid mt={2} mb={2} container className={flexCenter}>
        <BackButton text="חזור" to="/" classProp={'center'}></BackButton>
      </Grid>
    </Grid>
  );
};
