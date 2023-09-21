import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FormControl,
  InputBase,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { makeStyles, styled } from '@mui/styles';
import { productService } from '../../services/productService';
import { isMenuEnableService } from '../../services/isMenuEnableService';
import Button from '../Controls/Button';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const useStyles = makeStyles(() => ({
  paperMenu: {
    height: '80%',
    width: '20%',
    '@media (max-width: 1500px)': {
      position: 'fixed',
      right: '0',
      left: '0 !important',
      minWidth: '50% !important',
      minHeight: '100% !important',
      maxHeight: '16px',
      margin: '0 auto',
    },
  },
  ulStyle: {
    listStyleType: 'none',
    margin: 15,
    padding: 15,
    height: '100%',
  },
  liRow: {
    border: '1px solid #937446',
    padding: '10px 10px',
    margin: '0px auto',
    maxWidth: '50%',
    textAlign: 'center',
    cursor: 'pointer',
    width: '100%',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  formClass: {
    marginRight: '5rem',
    borderColor: 'transparent !important',
    width: '50%',
  },
  containerSerachInput: {
    marginRight: '5px',
    '@media (max-width: 700px)': {
      marginRight: '15px',
      width: '60%',
    },
  },
  selectDropDownMenuSerach: {
    fontWeight: 700,
  },
}));
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.between(0, 700)]: {
    width: '90%',
    marginLeft: theme.spacing(1),
  },
}));

const SearchIconWrapper = styled('div')(() => ({
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  textAlign: 'center',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    marginRight: '1.5rem',
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.between(0, 700)]: { padding: 0 },
  },
  [theme.breakpoints.between(0, 700)]: { width: '100px' },
}));

export default function SearchInput() {
  const [menuEnables, setMenuEnables] = useState({});
  const [isMenuEnablesLoaded, setIsMenuEnablesLoaded] = useState(false);
  const [menuTypeSerch, setMenuTypeSerch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();
  let history = useHistory();

  const isMounted = useRef(true);
  const inputEl = useRef(null);

  const checkMenuEnables = useCallback(async () => {
    const menus = await isMenuEnableService
      .getAllMenuEnables()
      .catch((error) => console.log('error', error));
    if (!menus || !menus.length) return;
    menus.forEach((menu) => {
      const menuType = menu.menuType;
      setMenuEnables((prev) => ({ ...prev, [menuType]: menu.enable }));
    });
    setIsMenuEnablesLoaded(true);
  }, []);

  useEffect(() => {
    checkMenuEnables();
    return () => {
      isMounted.current = false;
      setMenuEnables({});
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, []);

  useEffect(() => {
    if (menuEnables['weekend']) {
      setMenuTypeSerch('isMenuWeekend');
    } else if (menuEnables['pesach']) {
      setMenuTypeSerch('isMenuPesach');
    } else if (menuEnables['tishray']) {
      setMenuTypeSerch('isMenuTishray');
    }
    return () => {
      setMenuTypeSerch('');
    };
  }, [menuEnables]);

  const serachProduct = (value) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(async () => {
        const products = await productService.serachProductBy({
          value,
          menuTypeSerch,
        });

        if (isMounted.current && products && products.length) {
          setSearchResults([...products]);
          setAnchorEl(inputEl.current);
        }
      }, 1500)
    );
  };

  return (
    <div className={classes.containerSerachInput}>
      <Search
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          style={{
            fontWeight: 700,
            color: 'black',
            width: '50%',
          }}
          placeholder="חיפוש..."
          inputProps={{ 'aria-label': 'חיפוש' }}
          onChange={({ target }) => serachProduct(target?.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              serachProduct(e.target?.value);
            }
          }}
          aria-controls={open ? 'serach-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={() => setAnchorEl(null)}
          ref={inputEl}
        />

        {!!Object.keys(menuEnables).length && (
          <FormControl variant="standard" className={classes.formClass}>
            <InputLabel
              style={{
                paddingTop: '10px',
                border: 0,
                fontWeight: 700,
                color: 'black',
              }}
              id="label-drop-down-menu-serach"
            >
              בחר תפריט
            </InputLabel>
            <Select
              labelId="label-drop-down-menu-serach"
              className={classes.selectDropDownMenuSerach}
              id="select-drop-down-menu-serach"
              onChange={({ target }) => {
                setMenuTypeSerch(target?.value ? target.value : null);
              }}
              defaultValue={menuTypeSerch}
              value={menuTypeSerch && menuTypeSerch.length ? menuTypeSerch : ''}
            >
              {isMenuEnablesLoaded && menuEnables['weekend'] && (
                <MenuItem
                  className={classes.menuItemDropDown}
                  value={'isMenuWeekend'}
                  aria-label="סוף שבוע"
                >
                  סוף שבוע
                </MenuItem>
              )}
              {isMenuEnablesLoaded && menuEnables['pesach'] && (
                <MenuItem aria-label="פסח" value={'isMenuPesach'}>
                  פסח
                </MenuItem>
              )}
              {isMenuEnablesLoaded && menuEnables['tishray'] && (
                <MenuItem aria-label="חגי תשרי" value={'isMenuTishray'}>
                  חגי תשרי
                </MenuItem>
              )}
            </Select>
          </FormControl>
        )}
      </Search>
      {!!searchResults.length && (
        <Menu
          classes={{ paper: classes.paperMenu }}
          hideBackdrop={true}
          id="serach-drop-down"
          anchorEl={anchorEl}
          open={open}
          MenuListProps={{
            'aria-labelledby': 'serach-drop-down',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          style={{
            position: 'absolute',
            top: '4.1rem',
            left: '14.7rem',
            width: '100%',
          }}
          slotProps={{
            paper: {
              style: {
                width: '100%',
                height: '100%',
              },
              onMouseLeave: () => setAnchorEl(null),
            },
          }}
        >
          <div
            style={{
              width: 'auto',
              height: 'auto',
              position: 'initial',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Button
              text="X"
              aria-label="כפתור סגירה"
              style={{ margin: '10px 10px 0 0' }}
              onClick={() => setAnchorEl(null)}
            />
            <ul className={classes.ulStyle} style={{ width: '100%' }}>
              {searchResults.map((productSerach) => (
                <div
                  role="button"
                  aria-label={productSerach.displayName}
                  key={productSerach.id}
                  onClick={() => {
                    history.push(`/product/${productSerach.id}`);
                    setAnchorEl(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      history.push(`/product/${productSerach.id}`);
                      setAnchorEl(null);
                    }
                  }}
                  tabIndex={0}
                  className={classes.liRow}
                >
                  {productSerach.displayName}
                </div>
              ))}
            </ul>
          </div>
        </Menu>
      )}
    </div>
  );
}
