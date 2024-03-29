import React, { useCallback, useState } from 'react';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import { NavLink } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { cartService } from '../../services/cartService';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Cart } from '../Cart';
import getCustomTheme from '../../hooks/getCustomTheme';
import { ShakeRotate } from 'reshake';
import SearchInput from '../SearchInput/SearchInput';

const customTheme = getCustomTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  ColorNavLink: {
    color: 'black',
    textDecoration: 'none',
    fontWeight: '600 !important',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  Navlink: {
    textDecoration: 'none',
    marginLeft: 5,
    marginRight: 5,
  },
  CenterToolBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    Width: '90%',
  },
  CenterToolBarr: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBar: {
    '@media (max-width: 700px)': {
      transition: 'top 600ms cubic-bezier(0.17, 0.04, 0.03, 0.94)',
      alignItems: 'flex-start',
      flexDirection: 'column',
      position: 'fixed !important',
      backgroundColor: customTheme.palette.primary.main,
      right: '0',
      left: '0',
      top: '0',
      bottom: '0',
      marginLeft: '0',
      zIndex: 10000,
    },
  },
  colorWhite: {
    color: 'white',
    paddingRight: theme.spacing(1),
  },
  Header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'inherit',
  },

  LogoContainer: {
    width: '10%',
  },
  Width90: {
    width: '90%',
  },
  paper: {
    backgroundColor: `${customTheme.palette.primary.main}!important`,
  },
  exitButtom: {
    display: 'none',
    '@media (max-width: 700px)': {
      position: 'relative',
      display: 'unset',
      margin: '0 auto',
      padding: '10px',
      borderRadius: '8rem',
      with: '100%',
      height: '100%',
      cursor: 'pointer',
      backgroundColor: 'white',
      zIndex: 100000,
    },
  },
  startIcon: {
    marginRight: '0px',
  },
  ButtonCart: {
    paddingRight: '0px !important',
    '@media (max-width: 700px)': {
      paddingTop: '0px !important',
    },
  },
  cancelHover: {
    '&:hover': {
      backgroundColor: 'unset !important',
      textDecoration: 'unset',
    },
    '&:focus': {
      // outline: 'none',
      background: 'transparent !important',
      outline: 'none !important',
      backgroundColor: 'transparent !important',
      boxShadow: 'none !important',
      borderRadius: '0 !important',
    },
  },
  customRipple: {
    '& .MuiTouchRipple-root span': {
      border: '1px solid black',
      backgroundColor: 'transparent !important',
      height: 'unset !important',
      right: '0 !important',
      left: '0 !important',
      top: '0 !important',
      bottom: '0 !important',
      animationTimingFunction: 'unset !important',
      animationName: 'unset !important',
      opacity: 'unset !important',
    },
    '& .MuiTouchRipple-child': {
      borderRadius: 'unset !important',
    },
  },
}));

const style = {
  flexDirection: 'row',
  justifyContent: 'center',
};
export const AppHeader = () => {
  const matches = useMediaQuery('(min-width:700px)');
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [, setIsOpenMenu] = useState(false);
  const [checked, setChecked] = useState(false);
  const [cart, setCart] = useState();

  const getProductCart = useCallback(async () => {
    const cartData = await cartService.getCart();
    setCart(cartData);
  }, [setCart]);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    getProductCart();
    setChecked(false);
  };

  return (
    <AppBar
      position="static"
      style={style}
      color="default"
      className={classes.Header}
      classes={{ root: classes.paper }}
    >
      <Grid className={classes.Width90}>
        {!matches ? (
          <Grid
            className={classes.Header}
            style={{ justifyContent: 'flex-start' }}
          >
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => handleChange()}
            >
              <MenuIcon />
            </IconButton>
            <Button
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-label="עגלת קניות"
              onClick={(event) => handleClick(event)}
              sx={{ color: 'black' }}
              color="secondary"
              style={{ color: 'black', background: 'transparent' }}
              startIcon={
                <ShoppingCartOutlinedIcon
                  style={{ color: 'black', background: 'transparent' }}
                />
              }
            >
              <Typography style={{ paddingRight: '10px', fontWeight: 600 }}>
                עגלת קניות
              </Typography>
            </Button>
            {anchorEl && (
              <Cart
                cart={cart}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                setCart={setCart}
                setIsOpenMenu={setIsOpenMenu}
              ></Cart>
            )}
            {!matches && <SearchInput />}
          </Grid>
        ) : null}
        {(matches || checked) && (
          <Grid className={classes.CenterToolBarr}>
            <Typography
              className={classes.exitButtom}
              onClick={() => setChecked(false)}
            >
              X
            </Typography>
            <Toolbar
              classes={{ root: classes.toolBar }}
              className={classes.CenterToolBar}
            >
              <NavLink
                onClick={() => setChecked(false)}
                className={classes.Navlink}
                to="/"
              >
                <Typography aria-label="בית" className={classes.ColorNavLink}>
                  בית
                </Typography>
              </NavLink>
              <NavLink
                onClick={() => setChecked(false)}
                className={classes.Navlink}
                to="/about"
              >
                <Typography aria-label="אודות" className={classes.ColorNavLink}>
                  אודות
                </Typography>
              </NavLink>

              <NavLink
                onClick={() => setChecked(false)}
                className={classes.Navlink}
                to="/contact"
              >
                <Typography
                  aria-label="צור קשר"
                  className={classes.ColorNavLink}
                >
                  צור קשר
                </Typography>
              </NavLink>
              <NavLink
                onClick={() => setChecked(false)}
                className={classes.Navlink}
                to="/AccessibilityAnnouncement"
              >
                <Typography
                  aria-label="הצהרת נגישות"
                  className={classes.ColorNavLink}
                >
                  הצהרת נגישות
                </Typography>
              </NavLink>
              <Button
                tabIndex={0}
                aria-label="עגלת קניות"
                aria-haspopup="true"
                role="button"
                onClick={(event) => handleClick(event)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleClick(event);
                  }
                }}
                sx={{ color: 'black' }}
                color="secondary"
                className={classes.customRipple}
                startIcon={
                  <ShakeRotate
                    style={{ fontSize: '0px', marginLeft: '8px' }}
                    active={true}
                    trigger=":hover, :focus"
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ShoppingCartOutlinedIcon style={{ marginLeft: '5px' }} />
                      <Typography className={classes.ColorNavLink}>
                        עגלת קניות
                      </Typography>
                    </span>
                  </ShakeRotate>
                }
              ></Button>
              {matches && <SearchInput />}
              {anchorEl && (
                <Cart
                  cart={cart}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  setCart={setCart}
                  setIsOpenMenu={setIsOpenMenu}
                ></Cart>
              )}
            </Toolbar>
          </Grid>
        )}
      </Grid>
    </AppBar>
  );
};
