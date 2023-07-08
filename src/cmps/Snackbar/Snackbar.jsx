import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { eventBus } from '../../services/event-bus';
import { useEffect, useState } from 'react';

export default function SimpleSnackbar() {
  const [msg, setMsg] = useState(null);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');

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
      setSeverity('success');
      handleOpen();
    });
    eventBus.on('success', (data) => {
      setMsg(data.message);
      setSeverity('success');
      handleOpen();
    });
    eventBus.on('removeProductToCart', (data) => {
      setMsg(data.message);
      setSeverity('success');
      handleOpen();
    });
    eventBus.on('checkOutOrder', (data) => {
      setMsg(data.message);
      setSeverity('success');
      handleOpen();
    });
    eventBus.on('addProduct', (data) => {
      setMsg(data.message);
      setSeverity('success');
      handleOpen();
    });
    eventBus.on('updateProduct', (data) => {
      setMsg(data.message);
      setSeverity('success');
      handleOpen();
    });
    eventBus.on('orderUntilTen', (data) => {
      setMsg(data.message);
      setSeverity('error');
      handleOpen();
    });
    return () => {
      eventBus.remove('addProductToCart', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
        setSeverity('success');
      });
      eventBus.remove('addProduct', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
        setSeverity('success');
      });
      eventBus.remove('updateProduct', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
        setSeverity('success');
      });
      eventBus.remove('checkOutOrder', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
        setSeverity('success');
      });
      eventBus.remove('removeProductToCart', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
        setSeverity('success');
      });
      eventBus.remove('orderUntilTen', () => {
        setMsg(null);
        handleClose(null, 'clickaway');
        setSeverity('error');
      });
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
      <Alert onClose={handleClose} severity={severity}>
        {msg}
      </Alert>
    </Snackbar>
  );
}
