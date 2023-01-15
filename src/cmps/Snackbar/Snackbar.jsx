import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/core/Alert';
import { eventBus } from '../../services/event-bus';
import { useEffect, useState } from 'react';

export default function SimpleSnackbar() {
  const [msg, setMsg] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      handleClose(null, 'clickaway');
    }, 3000);
  };

  const handleClose = (__, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    eventBus.on('addProductToCart', (data) => {
      setMsg(data.message);
      handleOpen();
    });
    eventBus.on('success', (data) => {
      setMsg(data.message);
      handleOpen();
    });
    eventBus.on('removeProductToCart', (data) => {
      setMsg(data.message);
      handleOpen();
    });
    eventBus.on('checkOutOrder', (data) => {
      setMsg(data.message);
      handleOpen();
    });
    eventBus.on('addProduct', (data) => {
      setMsg(data.message);
      handleOpen();
    });
    eventBus.on('updateProduct', (data) => {
      setMsg(data.message);
      handleOpen();
    });
    return () => {
      eventBus.remove('addProductToCart', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
      });
      eventBus.remove('addProduct', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
      });
      eventBus.remove('updateProduct', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
      });
      eventBus.remove('checkOutOrder', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
      });
      eventBus.remove('removeProductToCart');
      setMsg(null);
      handleClose(null, 'clickaway');
    };
  }, []);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={1500}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="success">
        {msg}
      </Alert>
    </Snackbar>
  );
}
