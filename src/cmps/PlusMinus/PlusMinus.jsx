import './PlusMinus.scss';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles({
  buttons: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column !important',
    marginRight: '10px'
  }
});

export const PlusMinus = ({ type, size, input, updateOrder }) => {
  const classes = useStyles();
  const minus = () => {
    if (input - size.SizePrices[0].size < 0 || input - size.SizePrices[0].size === 0) return;
    if (type === 'weight') {
      const weight = Number(input) - Number(size.SizePrices[0].size);
      updateOrder(weight);
      //   handleState(weight);
      //   setPriceToShow(size.SizePrices[0].amount * (weight / 100).toFixed(2));
    } else if (type === 'unit') {
      const unit = Number(input) - Number(size.SizePrices[0].size);
      updateOrder(unit);
      //   handleState(weight);
      //   setPriceToShow(size.SizePrices[0].amount * (weight / 100).toFixed(2));
    }
  };
  const plus = () => {
    if (type === 'weight') {
      const weight = Number(input) + Number(size.SizePrices[0].size);
      updateOrder(weight);

      //   handleState(weight);
      //   setPriceToShow(size.SizePrices[0].amount * (weight / 100).toFixed(2));
    } else if (type === 'unit') {
      const unit = Number(input) + Number(size.SizePrices[0].size);
      updateOrder(unit);
    }
  };
  return (
    <Grid className={classes.buttons}>
      <AddIcon onClick={() => plus()}></AddIcon>
      <RemoveIcon onClick={() => minus()}></RemoveIcon>
    </Grid>
  );
};
