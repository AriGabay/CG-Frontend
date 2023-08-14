import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '../Controls/Button';
import { cartService } from '../../services/cartService';
import { eventBus } from '../../services/event-bus';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const useStyles = makeStyles(() => ({
  paper: {
    top: '80px!important',
    height: '80%',
    width: '25%',
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
  containerText: {
    display: 'flex !important',
    justifyContent: 'flex-start !important',
    alignItems: 'center !important',
    textAlign: 'right !important',
    flexDirection: 'column',
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
      onClose={handleClose}
    >
      <IconButton edge="start" onClick={handleClose}>
        <CloseOutlined />
      </IconButton>
      {cartComp && cartComp.length ? (
        cartComp.map((order) => {
          if (!order.product) return null;

          return (
            <MenuItem
              role="presentation"
              key={order._id}
              classes={{ root: classes.containerText }}
            >
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
                text="הסר"
                tabIndex={0}
                aria-label="הסר מהעגלה"
                onClick={() => removeFromCart(order._id)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    removeFromCart(order._id).then(() => handleClose());
                  }
                }}
              />
            </MenuItem>
          );
        })
      ) : (
        <Grid container mr={2}>
          <Typography>אין מוצרים בעגלה</Typography>
        </Grid>
      )}

      {cartComp && cartComp.length ? (
        <Button
          style={{ marginRight: '1rem' }}
          text="להזמנה"
          aria-label="להזמנה"
          onClick={checkOutOrder}
        />
      ) : null}
    </Menu>
  );
};
