import React, { useState, useEffect, Fragment } from 'react';
import {
  Typography,
  Button,
  TextField,
  createTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { ModelService } from '../service';
import { ErrorState } from '../types';

import LoadingBar from '../components/loadingBar';
import ErrorSnackbar from '../components/errorSnackbar';
import InfoSnackbar from '../components/infoSnackbar'

const theme = createTheme();

const DocumentUploadComponent: React.FC = () => {
  const [document, setDocument] = useState('');

  const [service, setService] = useState(ModelService.getInstance());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setService(ModelService.getInstance())
  }, []);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setDocument(evt.target.value);
  }

  const onSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault()

    setLoading(true)

    var postData = {
      content_cz: document
    }

    try {
      await service.newDocument(postData)
      setSuccess("Document uploaded successfully")
      setDocument('')
    }
    catch (error) {
      setError({ message: "Error uploading document. Response from backend: " + error })
    }

    setLoading(false)
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
