import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { isMenuEnableService } from '../../services/isMenuEnableService';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import './HomePage.scss';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useViewport from '../../hooks/useViewport';
import BackButton from '../../cmps/Controls/BackButton';
import {Helmet} from 'react-helmet';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%'
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column !important'
  },
  imgHomePage: {
    opacity: 0.9,
    with: '20px !important'
  },
  fixLineHeight: {
    lineHeight: '0 !important'
  },
  textImageHomePage: {
    textAlign: 'center',
    minWidth: 'auto',
    minHeight: 'auto',
    color: 'black',
    display: 'block',
    overflowWrap: 'break-word',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    overflow: 'hidden',
    border: '4px solid #937446',
    borderRadius: '2em',
    padding: '1em',
    fontSize: '20px',
    backgroundColor: 'whitesmoke',
    '@media (max-width: 400px)': {
      fontSize: '15px !important'
    },
    '@media (max-width: 290px)': {
      fontSize: '10px !important'
    }
  },
  GridMenuButton: {

    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '5px',
    marginRight: '5px',
    justifyContent: 'space-around',
    maxWidth: '500px',



    // display: 'flex',
        // comment for pesach
    // justifyContent: 'space-between',
    // width: '50% !important',
    // justifyContent: 'space-around',
    // width: '20% !important',
    // alignItems: 'center',
    // marginRight: '5px',
    // marginLeft: '5px',
    // '@media (max-width: 650px)': {
    //   width: '75% !important'
    // },
    // '@media (max-width: 450px)': {
    //   width: '85% !important'
    // },
    // '@media (max-width: 380px)': {
    //   width: '95% !important'
    // }
    // '@media (max-width: 1100px)': {
    //   width: '25% !important'
    // },
    // '@media (max-width: 880px)': {
    //   width: '45% !important'
    // },
    // '@media (max-width: 510px)': {
    //   width: '60% !important'
    // }
    
  }
}));

export const HomePage = () => {
  const imageSize = useViewport({ width: 1024, height: 800 }, { width: 400, height: 300 });
  const classes = useStyles();
  const [menuEnables,setMenuEnables]=useState({});

  const checkMenuEnables=async()=>{
    const res = await isMenuEnableService.getAllMenuEnables();
    res.forEach(menu =>{
      const key = menu.menuType;
      const buildData = {...menuEnables};
      buildData[key]=menu.enable;
      setMenuEnables((prev)=>({...prev,...buildData}));
    });
  };
  useEffect(()=>{
    checkMenuEnables();
  },[]);

  return (
    <Grid mt={2} className={classes.root}>
      <Helmet>
        <title>Catering Gabay - Home Page</title>
        <meta name="home-page" content="menu and logo" />
        </Helmet>
      <Grid className={classes.imageContainer}>
        <Typography
          classes={{ root: classes.fixLineHeight }}
          className={classes.textImageHomePage}
          // variant="h6"
          gutterBottom
        >
          יום שישי פתוחים החל מהשעה 7:00-14:30
        </Typography>
        <Grid className={classes.GridMenuButton}>
          {menuEnables['weekend']&&<BackButton classProp="menuButton" to="/menu/weekend" text="לתפריט סוף שבוע" />}
          {menuEnables['pesach']&&<BackButton classProp="menuButton" to="/menu/pesach" text="לתפריט פסח" />}
          {menuEnables['tishray']&&<BackButton classProp="menuButton" to="/menu/tishray" text="לתפריט חגי תשרי" />}
        </Grid>
        <Grid mb={6}>
          <ImageCloud
            ClassName={classes.imgHomePage}
            imageId="old_logo_rssqwk"
            maxWidth={imageSize.width}
            maxHeight={imageSize.height}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
