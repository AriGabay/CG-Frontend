import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '../Controls/Button';
import { cartService } from '../../services/cartService';
import { eventBus } from '../../services/event-bus';
import { makeStyles } from '@mui/styles';
import { colors, fonts, radii } from '../../styles/designTokens';

/**
 * On a phone the cart fills the screen, so it is laid out as a sheet: a pinned
 * header, a scrolling list, and a pinned footer carrying the total and the call
 * to action. Header and footer stick rather than sitting in a wrapper, because
 * MUI renders these children straight into its MenuList <ul> and an extra <div>
 * there would be invalid markup.
 */
const useStyles = makeStyles(() => ({
  paper: {
    top: '80px!important',
    height: '80%',
    width: '25%',
    minWidth: 320,
    borderRadius: radii.lg,
    // MUI v5 injects its emotion styles after this JSS sheet, so a plain
    // declaration here loses to .MuiPopover-paper on equal specificity. Only
    // !important reaches the element — hence the shouting on every box
    // property that has to beat a MUI default.
    '@media (max-width: 700px)': {
      position: 'fixed!important',
      top: '0!important',
      bottom: '0!important',
      right: '0!important',
      left: '0!important',
      width: '100%!important',
      minWidth: '100%!important',
      maxWidth: '100%!important',
      height: '100%!important',
      maxHeight: '100%!important',
      borderRadius: '0!important',
    },
  },
  list: {
    padding: '0!important',
    // Fill the sheet so the footer can be pushed to the bottom edge instead of
    // floating directly under a short list.
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '12px 16px',
    background: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '14px 16px',
    borderBottom: `1px solid ${colors.border}`,
    whiteSpace: 'normal',
  },
  itemMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  itemName: {
    fontWeight: 700,
    fontSize: 15,
    color: colors.text,
    // Long dish names must wrap instead of stretching the row, which is what
    // pushed the buttons out of alignment before.
    overflowWrap: 'anywhere',
  },
  itemSize: {
    fontSize: 13,
    color: colors.textMuted,
  },
  itemSide: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  itemPrice: {
    fontWeight: 700,
    fontSize: 15,
    color: colors.text,
  },
  empty: {
    padding: '32px 16px',
    textAlign: 'center',
    color: colors.textMuted,
  },
  footer: {
    // `auto` rather than sticky: the list is a flex column, so this drops the
    // footer to the bottom edge whether the cart holds one item or twenty.
    marginTop: 'auto',
    position: 'sticky',
    bottom: 0,
    zIndex: 2,
    display: 'block',
    padding: '14px 16px',
    background: colors.surface,
    borderTop: `1px solid ${colors.border}`,
  },
  totalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 15,
    color: colors.textSoft,
  },
  totalValue: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.greenInk,
  },
}));

export const Cart = ({
  cart,
  anchorEl,
  setAnchorEl,
  setCart,
  setIsOpenMenu,
}) => {
  const classes = useStyles();
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

  const items = (cartComp || []).filter((order) => order.product);
  const total = items.reduce(
    (sum, order) => sum + Number(order.priceToShow || 0),
    0
  );

  return (
    <Menu
      classes={{ paper: classes.paper, list: classes.list }}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <li role="presentation" className={classes.header}>
        <span className={classes.title}>העגלה</span>
        <IconButton aria-label="סגירת העגלה" onClick={handleClose} size="small">
          <CloseOutlined />
        </IconButton>
      </li>

      {items.length ? (
        items.map((order) => (
          <MenuItem
            role="presentation"
            disableRipple
            key={order._id}
            classes={{ root: classes.item }}
          >
            <span className={classes.itemMain}>
              <span className={classes.itemName}>
                {order.product.displayName}
              </span>
              <span className={classes.itemSize}>{sizeText(order)}</span>
            </span>
            <span className={classes.itemSide}>
              <span className={classes.itemPrice}>
                {order.priceToShow}
                {shekel}
              </span>
              <Button
                text="הסר"
                size="small"
                variant="text"
                tabIndex={0}
                aria-label={`הסרת ${order.product.displayName} מהעגלה`}
                onClick={() => removeFromCart(order._id)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    removeFromCart(order._id).then(() => handleClose());
                  }
                }}
              />
            </span>
          </MenuItem>
        ))
      ) : (
        <li role="presentation" className={classes.empty}>
          אין מוצרים בעגלה
        </li>
      )}

      {items.length ? (
        <li role="presentation" className={classes.footer}>
          <span className={classes.totalRow}>
            <span className={classes.totalLabel}>סה״כ</span>
            <span className={classes.totalValue}>
              {total}
              {shekel}
            </span>
          </span>
          <Button fullWidth text="להזמנה" aria-label="מעבר להזמנה" onClick={checkOutOrder} />
        </li>
      ) : null}
    </Menu>
  );
};
