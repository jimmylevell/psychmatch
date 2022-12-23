import React, { Fragment, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Typography,
  createTheme
} from '@mui/material';
import { withStyles } from '@mui/styles';
import ClearIcon from '@mui/icons-material/Clear';

const theme = createTheme();

const styles = () => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 700,
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(5),
  },
  text: {
    marginTop: theme.spacing(2)
  }
});

function Help(props) {
  const { classes } = props;
  const APP_VERSION = process.env.REACT_APP_VERSION
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal !== props.showModal) {
      setShowModal(props.showModal);
    }
  }, [props.showModal, showModal]);

  const handleChange = () => {
    let parentHandler = props.handleChange
    setShowModal(!showModal);
    parentHandler()
  }

  return (
    <Fragment>
      {showModal && (
        <Modal
          className={classes.modal}
          onClose={handleChange}
          open
        >
          <Card className={`${classes.modalCard} ${classes.marginTop}`}>
            <CardContent className={classes.modalCardContent}>
              <Typography variant="h6">About the app</Typography>
              <Typography className={classes.text}>Keyword-based match making of first client contact emails with possible psychologist and psychotherapist.</Typography>
              <Typography className={classes.text}>App version: {APP_VERSION}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleChange}><ClearIcon />Close</Button>
            </CardActions>
          </Card>
        </Modal>
      )}

    </Fragment>
  )
}

export default withStyles(styles)(Help);
