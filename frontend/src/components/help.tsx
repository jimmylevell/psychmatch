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
import ClearIcon from '@mui/icons-material/Clear';

import { HelpProps } from '../types';

const theme = createTheme();

const Help: React.FC<HelpProps> = (props) => {
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
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClose={handleChange}
          open
        >
          <Card sx={{
            width: '90%',
            maxWidth: 700,
            marginTop: theme.spacing(5),
          }} >
            <CardContent sx={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Typography variant="h6">About the app</Typography>
              <Typography sx={{
                marginTop: theme.spacing(2)
              }}>Keyword-based match making of first client contact emails with possible psychologist and psychotherapist.</Typography>
              <Typography sx={{
                marginTop: theme.spacing(2)
              }}>App version: {APP_VERSION}</Typography>
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

export default Help;
