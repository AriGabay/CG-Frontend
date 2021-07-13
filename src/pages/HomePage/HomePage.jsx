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
    height: '100%',
  },
  imageContainer: {
    opacity: 0.75,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column !important',
  },

  textImageHomePage: {
    textAlign: 'center',
    width: '50%',
    height: 'auto',
    color: 'black',
    display: 'block',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    overflow: 'hidden',
    lineHeight: '1.8em',
    border: '8px solid #937446',
    borderRadius: '2em',
    padding: '1em',
    backgroundColor: 'whitesmoke',
  },
}));

export const HomePage = () => {
  const imageSize = useViewport({ width: 800, height: 500 }, { width: 400, height: 200 });
  const classes = useStyles();

  return (
    <Grid mt={2} className={classes.root}>
      <Grid className={classes.imageContainer}>
        <Typography className={classes.textImageHomePage} variant="h5" gutterBottom>
          יום שישי קייטרינג גבאי פתוח החל מהשעה 7:00-14:30
        </Typography>
        <BackButton to="/menu" text="לתפריט"></BackButton>
        <ImageCloud imageId="clean_logo_pid6mc" maxWidth={imageSize.width} maxHeight={imageSize.height} />
      </Grid>
    </Grid>
  );
};
