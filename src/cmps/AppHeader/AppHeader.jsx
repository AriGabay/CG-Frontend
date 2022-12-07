import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import { cartService } from '../../services/cartService';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Cart } from '../Cart';
import getCustomTheme from '../../hooks/getCustomTheme';
import './AppHeader.scss';
import { ShakeRotate } from 'reshake';

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
    color: 'white',
    textDecoration: 'none',
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
      zIndex: 2,
      marginLeft: '0',
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
      zIndex: 200,
      margin: '0 auto',
      padding: '10px',
      borderRadius: '8rem',
      with: '100%',
      height: '100%',
      cursor: 'pointer',
      backgroundColor: 'white',
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
          <Grid>
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
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={(event) => handleClick(event)}
              sx={{ color: 'black' }}
              color="secondary"
              startIcon={
                <ShoppingCartOutlinedIcon
                  color="black"
                  className={classes.animation}
                />
              }
            >
              <Typography style={{ paddingRight: '10px' }}>
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
                <Typography className={classes.ColorNavLink}>בית</Typography>
              </NavLink>
              <NavLink
                onClick={() => setChecked(false)}
                className={classes.Navlink}
                to="/about"
              >
                <Typography className={classes.ColorNavLink}>אודות</Typography>
              </NavLink>
              <NavLink
                onClick={() => setChecked(false)}
                className={classes.Navlink}
                to="/contact"
              >
                <Typography className={classes.ColorNavLink}>
                  צור קשר
                </Typography>
              </NavLink>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={(event) => handleClick(event)}
                sx={{ color: 'white' }}
                color="secondary"
                classes={{ root: classes.ButtonCart }}
                startIcon={
                  <ShakeRotate style={{ fontSize: '0px' }} active={true}>
                    <ShoppingCartOutlinedIcon
                      classes={{ root: classes.startIcon }}
                      color="white"
                    />
                  </ShakeRotate>
                }
              >
                <Typography className={classes.colorWhite}>
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
            </Toolbar>
          </Grid>
        )}
      </Grid>
    </AppBar>
  );
};
