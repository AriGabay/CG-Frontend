import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { isMenuEnableService } from '../../services/isMenuEnableService';
import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useViewport from '../../hooks/useViewport';
import BackButton from '../../cmps/Controls/BackButton';
import { Helmet } from 'react-helmet';
import BasicModal from '../../cmps/BasicModal/BasicModal';
import { getDay, setHours, setMinutes } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { PdfViewerPopup } from '../../cmps/PdfViewerPopup';

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
    color: 'black',
    border: '4px solid #937446',
    display: 'block',
    padding: ' 1em',
    overflow: ' hidden',
    fontSize: '1.3rem',
    minWidth: 'auto',
    textAlign: 'center',
    borderRadius: '2em',
    overflowWrap: 'break-word',
    textOverflow: 'ellipsis',
    backgroundColor: 'whitesmoke',
    minHeight: '5rem',
    margin: '0 5px 0.35rem 5px !important',
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
  titlePage: {
    fontSize: '70px',
    fontWeight: 600,
    backgroundImage: 'linear-gradient(to left, #936a2d, #93764ca1)',
    color: 'transparent',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
  },
}));

export const HomePage = () => {
  const [menuEnables, setMenuEnables] = useState({});
  const [isMenuEnablesLoaded, setIsMenuEnablesLoaded] = useState(false);
  const imageSize = useViewport(
    { width: 1024, height: 800 },
    { width: 400, height: 300 }
  );
  const classes = useStyles();

  const checkMenuEnables = useCallback(async () => {
    const menus = await isMenuEnableService.getAllMenuEnables();
    if (!menus || !menus.length) return;
    menus.forEach((menu) => {
      const menuType = menu.menuType;
      setMenuEnables((prev) => ({ ...prev, [menuType]: menu.enable }));
    });
    setIsMenuEnablesLoaded(true);
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

  return (
    <Grid mt={2} className={classes.root}>
      <Helmet>
        <title>קייטרינג גבאי - דף בית</title>
        <meta name="home-page" content="homePage" />
        <meta name="robots" content="all" />
      </Helmet>
      <Grid className={classes.imageContainer} tabIndex={0}>
        <Typography
          className={classes.titlePage}
          mb={3}
          aria-label="דף בית"
          fontSize={'4rem'}
          variant="h1"
        >
          דף בית
        </Typography>
        <Typography classes={{ root: classes.textImageHomePage }} variant="h7">
          יום שישי פתוחים החל מהשעה 7:00-14:00
        </Typography>
        <Grid mt={3} className={classes.GridMenuButton}>
          {isMenuEnablesLoaded && menuEnables['weekend'] && (
            <BackButton
              classProp="menuButton"
              to="/menu/weekend"
              text="לתפריט סוף שבוע"
            />
          )}
          {isMenuEnablesLoaded && menuEnables['pesach'] && (
            <PdfViewerPopup></PdfViewerPopup> // הצגת תפריט פסח
            // <BackButton
            //   classProp="menuButton"
            //   to="/menu/pesach"
            //   text="לתפריט פסח"
            // />
          )}

          {isMenuEnablesLoaded && menuEnables['tishray'] && (
            <PdfViewerPopup></PdfViewerPopup> // הצגת תפריט תשרי
            // <BackButton
            //   classProp="menuButton"
            //   to="/menu/tishray"
            //   text="לתפריט חגי תשרי"
            // />
          )}
        </Grid>
        <Grid mb={6}>
          <>
            {/* <VisuallyHidden>
              {
                'התיאור הבא מתאר את התמונה: קייטרינג גבאי בע"מ,\n”אוכל של אמא” - להתפנק ליהנות.\nבהשגחת הרבנות, כשר למהדרין טבריה.\n"גני איילון" כביש פוריה - טבריה טל. 04-6734949'
              }
            </VisuallyHidden> */}
            <ImageCloud
              ClassName={classes.imgHomePage}
              imageId="old_logo_rssqwk"
              maxWidth={imageSize.width}
              maxHeight={imageSize.height}
              alt={
                'התיאור הבא מתאר את התמונה: קייטרינג גבאי בע"מ,\n”אוכל של אמא” - להתפנק ליהנות.\nבהשגחת הרבנות, כשר למהדרין טבריה.\n"גני איילון" כביש פוריה - טבריה טל. 04-6734949'
              }
            />
          </>

          {isMenuEnablesLoaded && menuEnables['message_home_page'] && (
            <BasicModal
              contnentLineOne={`האתר סגור להזמנות חדשות, עקב המצב הבטחוני.`}
              contnentLineTow={'הקייטרינג פתוח בימי שישי מהשעה 7:00 עד 14:00'}
              lockScreen={true}
              type="pesach"
              withCloseBtn={
                menuEnables['withCloseBtn']
                  ? menuEnables['withCloseBtn']
                  : false
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
                menuEnables['withCloseBtn']
                  ? menuEnables['withCloseBtn']
                  : false
              }
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
