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
import { useHistory } from 'react-router-dom';
import { getDay, setHours, setMinutes } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

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
  const history = useHistory();
  const { flexCenter, gridMenu } = useStyles();
  const { categories } = useSelector((state) => state);
  const [titlePage, setTitlePage] = useState(null);
  const [menuEnables, setMenuEnables] = useState({});

  const checkMenuEnables = useCallback(async () => {
    let isEnable = false;
    const menus = await isMenuEnableService.getAllMenuEnables();
    const location = window.location.href;
    await Promise.all(
      menus.map(async (menu) => {
        const menuType = menu.menuType;
        if (location.includes(menuType)) {
          console.log(location, menuType);
          isEnable = true;
        }
        setMenuEnables((prev) => ({ ...prev, [menuType]: menu.enable }));
      })
    );
    if (isEnable !== true) {
      history.push('/notEnable');
    }
  }, []);

  useEffect(() => {
    checkMenuEnables();
  }, []);
  const isThursdayAndTime = () => {
    const now = new Date();
    const timeZone = 'Asia/Jerusalem';
    const nowInIsrael = utcToZonedTime(now, timeZone);
    const day = getDay(nowInIsrael);

    if (day === 4 && isTimeAfter(nowInIsrael, 19, 0)) {
      return true;
    }

    if (day >= 5) {
      return true;
    }

    if (day === 0 && isTimeBefore(nowInIsrael, 5, 0)) {
      return true;
    }

    return false;
  };

  const isTimeAfter = (date, hours, minutes) => {
    const targetTime = setMinutes(setHours(date, hours), minutes);
    return date >= targetTime;
  };

  const isTimeBefore = (date, hours, minutes) => {
    const targetTime = setMinutes(setHours(date, hours), minutes);
    return date < targetTime;
  };

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
        <meta name="robots" content="all" />
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
          withCloseBtn={true}
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
      {isThursdayAndTime() && (
        <BasicModal
          contnentLineOne={`האתר סגור להזמנות חדשות, עד יום שבת בשעה 8:00.`}
          contnentLineTow={`הקייטרינג פתוח בימי שישי מהשעה 7:00 עד 14:00.
              מספר טלפון לפרטים 04-6734949
              `}
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
