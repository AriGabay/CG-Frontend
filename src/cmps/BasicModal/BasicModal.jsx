import * as React from 'react';
import { Box, Modal, Typography } from '@material-ui/core';


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
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography textAlign='center' id="modal-modal-title" variant="h6" component="h2">
          לקוחות יקרים!
          </Typography>
          <Typography textAlign='center' id="modal-modal-title" variant="h6" component="h2">
מכירת חג הפסח מתבצעת בכפולות של חמש מנות.
          </Typography>
          <Typography textAlign='center' id="modal-modal-title" variant="h6" component="h2">
שיהיה חג שמח וכשר 
          </Typography>
          <Typography textAlign='center' id="modal-modal-title" variant="h6" component="h2">
מקייטרינג גבאי.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}