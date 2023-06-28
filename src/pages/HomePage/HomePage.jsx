import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { isMenuEnableService } from '../../services/isMenuEnableService';
import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useViewport from '../../hooks/useViewport';
import BackButton from '../../cmps/Controls/BackButton';
import { Helmet } from 'react-helmet';
import BasicModal from '../../cmps/BasicModal/BasicModal';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column !important',
  },
  imgHomePage: {
    opacity: 0.9,
    with: '20px !important',
  },
  fixLineHeight: {
    lineHeight: '0 !important',
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
      fontSize: '15px !important',
    },
    '@media (max-width: 290px)': {
      fontSize: '10px !important',
    },
  },
  GridMenuButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '5px',
    marginRight: '5px',
    justifyContent: 'space-around',
    maxWidth: '500px',
  },
}));

export const HomePage = () => {
  const [menuEnables, setMenuEnables] = useState({});
  const imageSize = useViewport(
    { width: 1024, height: 800 },
    { width: 400, height: 300 }
  );
  const classes = useStyles();

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

  return (
    <Grid mt={2} className={classes.root}>
      <Helmet>
        <title>קייטרינג גבאי - דף בית</title>
        <meta name="home-page" content="menu and logo" />
      </Helmet>
      <Grid className={classes.imageContainer}>
        <Typography
          classes={{ root: classes.fixLineHeight }}
          className={classes.textImageHomePage}
          gutterBottom
        >
          יום שישי פתוחים החל מהשעה 7:00-14:30
        </Typography>
        <Grid className={classes.GridMenuButton}>
          {menuEnables['weekend'] && (
            <BackButton
              classProp="menuButton"
              to="/menu/weekend"
              text="לתפריט סוף שבוע"
            />
          )}
          {menuEnables['pesach'] && (
            <BackButton
              classProp="menuButton"
              to="/menu/pesach"
              text="לתפריט פסח"
            />
          )}
          {menuEnables['tishray'] && (
            <BackButton
              classProp="menuButton"
              to="/menu/tishray"
              text="לתפריט חגי תשרי"
            />
          )}
        </Grid>
        <Grid mb={6}>
          <ImageCloud
            ClassName={classes.imgHomePage}
            imageId="old_logo_rssqwk"
            maxWidth={imageSize.width}
            maxHeight={imageSize.height}
            alt={'לוגו קיטריינג גבאי'}
          />
          {/* {menuEnables['message_home_page'] || */}
          {true && (
            <BasicModal
              contnentLineOne={`האתר סגור להזמנות חדשות, עקב עבודת תחזוקה באתר,
              `}
              contnentLineTow={' '}
              lockScreen={true}
              type="pesach"
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
