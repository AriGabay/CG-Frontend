import './AppHeader.scss';
import React, { useCallback, useState, useEffect } from 'react';
import { ImageCloud } from '../ImageCloud/ImageCloud';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import { cartService } from '../../services/cartService';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Cart } from '../Cart';

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
    marginLeft: '10%',
  },
  toolBar: {
    '@media (max-width: 700px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
      position: 'fixed!important',
      backgroundColor: '#2f4863',
      top: '10%',
      right: '0',
      height: '40%',
      zIndex: 2,
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
    backgroundColor: '#2f4863!important',
  },
}));

const style = {
  flexDirection: 'row',
  justifyContent: 'space-between',
};
export const AppHeader = () => {
  const matches = useMediaQuery('(min-width:700px)');
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [cart, setCart] = useState();

  const getProductCart = useCallback(async () => {
    const data = await cartService.getCart();
    setCart(data);
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    getProductCart();
  };
  const openMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  return (
    <AppBar
      position="static"
      style={style}
      color="default"
      className={classes.Header}
      classes={{ root: classes.paper }}
    >
      <Box className={classes.LogoContainer} p={0} mt={1} mr={1}>
        <ImageCloud imageId="clean_logo_pid6mc" maxHeight={70} />
      </Box>
      <Box className={classes.Width90}>
        {!matches ? (
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => openMenu()}
          >
            <MenuIcon />
          </IconButton>
        ) : null}
        {(matches || isOpenMenu) && (
          <Toolbar classes={{ root: classes.toolBar }} className={classes.CenterToolBar}>
            <NavLink className={classes.Navlink} to="/">
              <Typography className={classes.ColorNavLink}>בית</Typography>
            </NavLink>
            <NavLink className={classes.Navlink} to="/menu">
              <Typography className={classes.ColorNavLink}>תפריט</Typography>
            </NavLink>
            <NavLink className={classes.Navlink} to="/">
              <Typography className={classes.ColorNavLink}>אודות</Typography>
            </NavLink>
            <NavLink className={classes.Navlink} to="/">
              <Typography className={classes.ColorNavLink}>צור קשר</Typography>
            </NavLink>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={(event) => handleClick(event)}
              sx={{ color: 'white' }}
              startIcon={<ShoppingCartOutlinedIcon color="white" />}
            >
              <Typography className={classes.colorWhite}>עגלת קניות</Typography>
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
        )}
      </Box>
    </AppBar>
  );
};
