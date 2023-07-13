import * as React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { ImageCloud } from '../ImageCloud/ImageCloud';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  imageModal: {
    maxHeight: '100px',
    maxWidth: '100px',
  },
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    background: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: '85%',
    },
  },
}));

export default function BasicModal({
  contnentLineOne,
  contnentLineTow,
  lockScreen = false,
  type,
  withCloseBtn = false,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    if (lockScreen) {
      return;
    }
    setOpen(false);
  };

  return contnentLineOne.length && contnentLineTow.length ? (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modalBox}>
          <Typography
            textAlign="center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            לקוחות יקרים!
          </Typography>
          <Typography
            textAlign="center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {contnentLineOne}
          </Typography>
          <Typography
            textAlign="center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {contnentLineTow}
          </Typography>
          <Typography
            textAlign="center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            קייטרינג גבאי.
          </Typography>
          {type === 'tishray' && (
            <ImageCloud
              imageId="appleInHoney_ytdzir"
              ClassName={classes.imageModal}
              alt="תמונה של תפוח בדבש"
            />
          )}
          {withCloseBtn && (
            <Button
              aria-label="close modal message"
              onClick={() => setOpen(false)}
              style={{ fontWeight: 700, fontSize: '20px' }}
            >
              סגור
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  ) : null;
}
