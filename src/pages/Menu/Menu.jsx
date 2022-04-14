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
import { makeStyles } from '@material-ui/styles';
import { Helmet } from 'react-helmet';
import BasicModal from '../../cmps/BasicModal/BasicModal';

const useStyles = makeStyles({
  gridMenu: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: 'auto',
    gap: '40px 40px',
    gridTemplateAreas: '. . .',
    '& > *': {
      margin: '0 auto'
    },
    '@media (max-width: 1000px)': {
      gridTemplateColumns: '1fr 1fr'
    },
    '@media (max-width: 800px)': {
      gridTemplateColumns: '1fr'
    }
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
      marginBottom: '35px'
    }
  },
});
export const Menu = ({ menuType }) => {
  const classes = useStyles();
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const pathName = history.location.pathname;
  const isEnableMenu = (process.env.REACT_APP_IS_ENABLE_MENU === 'true') 

  console.log('isEnableMenu',isEnableMenu);
  useEffect(() => {
    categoryService.getCategories({ include: false }).then((categor) => {
      if (categor && categor.length) {
        setCategories(categor);
      }
    });
  }, []);
  const getMenuType=()=>{
    if(history.location.pathname){
      if(history.location.pathname.includes('weekend'))return 'סוף שבוע'
      else if (history.location.pathname.includes('tishray')) return 'תשרי'
      else if (history.location.pathname.includes('pesach')) return 'פסח'
      else return ''
    }
  }
  return isEnableMenu? (
    <Grid className="menu">
      <Helmet>
        <title>Catering Gabay - Menu</title>
        <meta name="menu-list" content="menu list" />
        </Helmet>
      <Grid display="flex" alignItems="center" justifyContent="center">
        {history.location.pathname &&<Typography variant="h3" gutterBottom>
          תפריט {getMenuType()}
        </Typography>}
      </Grid>
      {pathName&&pathName.includes('pesach')?
       <BasicModal />:null
      }
      <Grid className={classes.gridMenu}>
        {categories && categories.length ? (
          categories.map((category, index) => {
            return <CategoryCard key={index} category={category} menuType={menuType} />;
          })
        ) : (
          <CircularProgress></CircularProgress>
        )}
      </Grid>
      <Grid mt={2} mb={2} container display="flex" justifyContent="center" alignContent="center">
        <BackButton text="חזור" to="/" classProp={'center'}></BackButton>
      </Grid>
    </Grid>
  ): (
    <Grid className={classes.progressScreen}>
      <CircularProgress />
      <Typography>האתר סגור זמנית - נשוב בקרוב</Typography>
      <BackButton to={() => '/'} text="חזור"></BackButton>
    </Grid>
  );
};
