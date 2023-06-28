import * as React from 'react';
import { Box, Modal, Typography } from '@material-ui/core';
import { ImageCloud } from '../ImageCloud/ImageCloud';
import { makeStyles } from '@material-ui/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const useStyles = makeStyles(() => ({
  imageModal: {
    maxHeight: '100px',
    maxWidth: '100px',
  },
}));

export default function BasicModal({
  contnentLineOne,
  contnentLineTow,
  lockScreen = false,
  type,
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
        <Box sx={style}>
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
        </Box>
      </Modal>
    </div>
  ) : null;
}
