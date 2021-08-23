import './About.scss';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import GoogleMaps from '../../cmps/GoogleMaps/GoogleMaps';
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column !important',
    padding: '10px'
  },
  gridMap: {
    marginTop: '10px',
    width: '100%',
    height: '100%'
  }
}));

export const About = () => {
  const classes = useStyles();
  return (
    <Grid classes={{ root: classes.root }}>
      <Grid classes={{ root: classes.root }}>
        <Typography variant="h2">אודות</Typography>
        <Typography variant="h5">קייטרינג גבאי פועל כבר יותר מעשור. אוכל בתוצרת ביתית משובח ועשיר בטעמים.</Typography>
      </Grid>
      <Grid className={`${classes.gridMap} ${classes.root}`}>
        <GoogleMaps></GoogleMaps>
      </Grid>
    </Grid>
  );
};
