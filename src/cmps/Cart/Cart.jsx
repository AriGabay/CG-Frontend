import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container/Container';
import Grid from '@mui/material/Grid';
import Button from '../Controls/Button';
import { cartService } from '../../services/cartService';
import { eventBus } from '../../services/event-bus';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const useStyles = makeStyles(() => ({
  cartRoot: {
    position: 'fixed',
    top: '0!important',
    bottom: '0',
    right: '0',
    left: '0!important',
    width: '100vw',
    height: '100vh',
  },
  zIndex: {
    zIndex: 520,
  },
  paper: {
    top: '80px!important',
    height: '80%',
    width: '20%',
    '@media (max-width: 700px)': {
      position: 'fixed',
      top: '0!important',
      bottom: '0',
      right: '0',
      left: '0!important',
      minWidth: '100% !important',
      minHeight: '100% !important',
      maxHeight: '16px',
    },
  },
  MenuItem: {
    height: 'auto',
    width: 'auto',
  },
  rtl: {
    textAlign: 'right',
  },
  containerText: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'right',
  },
  textCartProduct: {
    display: 'block',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    lineHeight: '1.8em',
    whiteSpace: 'pre-wrap',
  },
}));

export const Cart = ({
  cart,
  anchorEl,
  setAnchorEl,
  setCart,
  setIsOpenMenu,
}) => {
  const matches = useMediaQuery('(min-width:700px)');
  const classes = useStyles(matches);
  const history = useHistory();
  const [cartComp, setCartComp] = useState();
  useEffect(() => {
    setCartComp(cart);
  }, [cart]);
  const shekel = '₪';
  const handleClose = () => {
    setAnchorEl(null);
  };
  const checkOutOrder = () => {
    setAnchorEl(null);
    setIsOpenMenu(false);
    history.push('/checkout');
  };
  const removeFromCart = async (id) => {
    cartService.removeProductFromCart(id).then((newCart) => {
      setCart(newCart);
      eventBus.dispatch('removeProductToCart', { message: 'הוסר מהעגלה' });
    });
  };
  const sizeText = (order) => {
    if (order.product.Price.priceType === 'unit') {
      return `${order.sizeToOrder} יחידות`;
    } else if (order.product.Price.priceType === 'box') {
      return `קופסה של ${order.sizeToOrder} גרם`;
    } else if (order.product.Price.priceType === 'weight') {
      return `${order.sizeToOrder} גרם`;
    }
  };
  return (
    <Menu
      classes={{ paper: classes.paper }}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={() => handleClose()}
    >
      <IconButton edge="start"></IconButton>
      <IconButton onClick={() => handleClose()}>
        <CloseOutlined />
      </IconButton>
      {cartComp && cartComp.length ? (
        cartComp.map((order) => {
          if (!order.product) return;
          return (
            <MenuItem className={classes.MenuItem} key={order._id}>
              <Container classes={{ root: classes.containerText }}>
                <Typography className={classes.textCartProduct}>
                  מוצר: {order.product.displayName}
                </Typography>
                <Typography className={classes.textCartProduct}>
                  כמות: {sizeText(order)}
                </Typography>
                <Typography className={classes.textCartProduct}>
                  מחיר: {order.priceToShow}
                  {shekel}
                </Typography>
                <Button
                  text="x"
                  onClick={() => removeFromCart(order._id)}
                ></Button>
              </Container>
            </MenuItem>
          );
        })
      ) : (
        <Grid container mr={2}>
          <Typography>אין מוצרים בעגלה</Typography>
        </Grid>
      )}

      {cartComp && cartComp.length ? (
        <Grid mr={2} mb={1}>
          <Container>
            <Button text="להזמנה" onClick={() => checkOutOrder()} />
          </Container>
        </Grid>
      ) : null}
    </Menu>
  );
};
