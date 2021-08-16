import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
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
    // opacity: 0.75,
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
  textImageHomePage: {
    textAlign: 'center',
    minWidth: 'auto',
    maxHeight: 'auto',
    color: 'black',
    display: 'block',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    overflow: 'hidden',
    lineHeight: '1.8em',
    border: '8px solid #937446',
    borderRadius: '2em',
    padding: '1em',
    backgroundColor: 'whitesmoke'
  }
}));

export const HomePage = () => {
  const imageSize = useViewport({ width: 1024, height: 800 }, { width: 400, height: 300 });
  const classes = useStyles();

  return (
    <Grid mt={2} className={classes.root}>
      <Grid className={classes.imageContainer}>
        <Typography className={classes.textImageHomePage} variant="h5" gutterBottom>
          יום שישי קייטרינג גבאי פתוח החל מהשעה 7:00-14:30
        </Typography>
        <BackButton to="/menu" text="לתפריט"></BackButton>
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
