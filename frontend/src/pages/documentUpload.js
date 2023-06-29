import React, { useState, useEffect, Fragment } from 'react';
import {
  Typography,
  Button,
  TextField,
  createTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { ModelService } from '../service';

import LoadingBar from '../components/loadingBar';
import ErrorSnackbar from '../components/errorSnackbar';
import InfoSnackbar from '../components/infoSnackbar'

const theme = createTheme();

function DocumentUploadComponent(props) {
  const [document, setDocument] = useState('');

  const [service, setService] = useState(ModelService.getInstance());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setService(ModelService.getInstance(props.token))
  }, [props.token]);

  const handleChange = (evt) => {
    setDocument(evt.target.value);
  }

  const onSubmit = async (evt) => {
    evt.preventDefault()

    setLoading(true)

    var postData = {
      document: document
    }

    try {
      await service.newDocument(postData)
    }
    catch (error) {
      setError({ message: "Error uploading document. Response from backend: " + error })
    }

    setLoading(false)
    setDocument('')

    if (error === null) {
      setSuccess("Document uploaded successfully")
    }
  }

  return (
    <Fragment>
      <Typography variant="h4">Document Upload</Typography>
      <form encType="multipart/form-data" onSubmit={onSubmit}>
        <TextField
          type="text"
          name="document"
          label="Document Content"
          value={document}
          onChange={handleChange}
          variant="outlined"
          fullWidth={true}
          sx={{
            width: "90%",
            margin: theme.spacing(1),
            fontSize: "1.2em"
          }}
          multiline
          minRows={20}
        />

        <Button
          color="primary"
          variant="outlined"
          sx={{ margin: theme.spacing(1), }}
          disabled={!document}
          type="submit"
        >
          <AddIcon />Upload
        </Button>
      </form>

      { /* Flag based display of error snackbar */}
      {error && (
        <ErrorSnackbar
          onClose={() => setError(null)}
          message={error.message}
        />
      )}

      { /* Flag based display of loadingbar */}
      {loading && (
        <LoadingBar />
      )}

      { /* Flag based display of info snackbar */}
      {success && (
        <InfoSnackbar
          onClose={() => setSuccess(null)}
          message={success}
        />
      )}
    </Fragment>
  )
}

export default DocumentUploadComponent;
