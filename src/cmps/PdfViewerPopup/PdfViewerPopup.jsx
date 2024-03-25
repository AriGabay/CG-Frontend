import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import getCustomTheme from '../../hooks/getCustomTheme';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import pdfFile from './Menu_Peacha_2024.pdf';

const customTheme = getCustomTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: customTheme.palette.primary.light + '!important',
  },
  label: {
    textTransform: 'none',
    '&:hover': {
      transform: 'scale(1.1) !important',
    },
  },
  NavLink: {
    textDecoration: 'none',
    marginBottom: theme.spacing(1),
    '&:hover': {
      transform: 'scale(1.1) !important',
    },
  },
  menuButton: {
    width: '100px',
    color: 'black' + '!important',
    backgroundColor: '#93764ce3' + '!important',
    '&:hover': {
      transform: 'scale(1.1) !important',
    },
  },
  center: {
    display: 'flex !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    margin: '0 auto !important',
  },
  blackFont: {
    color: 'black !important',
  },
}));

export const PdfViewerPopup = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        size={'large'}
        className={classes.menuButton}
        aria-label={'show more'}
        onClick={handleClickOpen}
      >
        צפה בתפריט פסח
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="pdf-dialog-title"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          aria-label={`תפריט פסח 2024,
          שימו לב שבאפשרותכם להוריד את התפריט בכפתור ההורדה בצד ימין למעלה`}
          id="pdf-dialog-title"
        >
          {`תפריט פסח 2024,
          שימו לב שבאפשרותכם להוריד את התפריט בכפתור ההורדה בצד ימין למעלה`}
        </DialogTitle>

        <DialogContent>
          {pdfFile && (
            <iframe
              src={`${pdfFile}#pagemode=none`}
              width="100%"
              height="500px"
              title="Menu_Peacha_2024.pdf"
              aria-label="תפריט פסח 2024 קובץ pdf"
            ></iframe>
          )}
        </DialogContent>
        <DialogActions>
          <Button aria-label="Close Pdf" onClick={handleClose}>
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
