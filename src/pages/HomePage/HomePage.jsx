import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import './HomePage.scss';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useViewport from '../../hooks/useViewport';
import BackButton from '../../cmps/Controls/BackButton';

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
    backgroundColor: 'whitesmoke',
    '@media (max-width: 550px)': {
      fontSize: '1em !important'
    }
  },
  GridMenuButton: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '50% !important',
    '@media (max-width: 730px)': {
      width: '90% !important'
    }
  }
}));

export const HomePage = () => {
  const imageSize = useViewport({ width: 1024, height: 800 }, { width: 400, height: 300 });
  const classes = useStyles();

  return (
    <Grid mt={2} className={classes.root}>
      <Grid className={classes.imageContainer}>
        <Typography
          classes={{ root: classes.fixLineHeight }}
          className={classes.textImageHomePage}
          variant="h5"
          gutterBottom
        >
          יום שישי קייטרינג גבאי פתוח החל מהשעה 7:00-14:30
        </Typography>
        <Grid className={classes.GridMenuButton}>
          <BackButton classProp="menuButton" to="/menu/weekend" text="לתפריט סוף שבוע"></BackButton>
          <BackButton classProp="menuButton" to="/menu/pesach" text="לתפריט פסח"></BackButton>
          <BackButton classProp="menuButton" to="/menu/tishray" text="לתפריט חגי תשרי"></BackButton>
        </Grid>
        <ImageCloud
          ClassName={classes.imgHomePage}
          imageId="old_logo_rssqwk"
          maxWidth={imageSize.width}
          maxHeight={imageSize.height}
        />
      </Grid>
    </Grid>
  );
};
