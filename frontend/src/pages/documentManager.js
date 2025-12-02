import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Paper,
  TextField,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  createTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import { orderBy, filter } from 'lodash';

import { ModelService } from '../service';

import LoadingBar from '../components/loadingBar';
import InfoSnackbar from '../components/infoSnackbar';
import ErrorSnackbar from '../components/errorSnackbar';

const MAX_LENGTH_OF_CONTENT_PREVIEW = 500
const MAX_NUMBER_OF_KEYWORDS = 50

const theme = createTheme();

function DocumentManager(props) {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const service = ModelService.getInstance();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const getDocuments = async () => {
    try {
      let data = (await service.getDocuments()).documents
      setDocuments(data);
      setFilteredDocuments(data)
    }
    catch (error) {
      setError({ message: "Error getting documents. Response from backend" + error })
    }

    setLoading(false);
  }

  useEffect(() => {
    if (ModelService.token) {
      getDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteDocument = async (evt, document) => {
    evt.preventDefault()
    if (window.confirm(`Are you sure you want to delete this document`)) {
      try {
        await service.deleteDocument(document._id)
      }
      catch (error) {
        setError({
          message: "Error deleting document. Response from backend: " + error
        })
      }

      if (!error) {
        setSuccess("Document deleted successfully")
      }

      getDocuments();
    }
  }

  const shareDocumentLink = (evt, document, navigator) => {
    evt.preventDefault()

    let url = window.location.origin + "/documents/" + document._id
    navigator.clipboard.writeText(url)

    setSuccess("Copied document link " + url + " to clipboard successfully")
  }

  const handleSearchChange = evt => {
    setQuery(evt.target.value);

    setFilteredDocuments(filter(documents, function (obj) {
      return (obj.content_cz.toUpperCase().includes(query.toUpperCase())) ||
        (obj.content_en.toUpperCase().includes(query.toUpperCase()))
    }))
  };

  return (
    <Fragment>
      { /* query input */}
      <TextField
        type="text"
        key="inputQuery"
        placeholder="Search"
        label="Search Content"
        sx={{
          marginBottom: theme.spacing(2),
          width: "100%"
        }}
        value={query}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
        autoFocus
      />

      <Typography variant="h4">Documents</Typography>

      {documents.length > 0 ? (
        // documents available
        <Paper elevation={1} sx={{
          whiteSpace: "inherit",
          marginTop: theme.spacing(2)
        }}>
          <TableContainer component={Paper}>
            <Table aria-label="data table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Content CZ</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Keywords CZ</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Keywords EN</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Updated At</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Share</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderBy(filteredDocuments, ['updatedAt'], ['desc']).map(document => (
                  <TableRow key={document._id} sx={{
                    textDecoration: "none",
                    "&:hover": {
                      background: "#d6effb"
                    },
                  }} component={Link} to={`/documents/${document._id}/`}>
                    { /* Only show substring of content if it is to large */}
                    <TableCell>
                      {document.content_cz.length > MAX_LENGTH_OF_CONTENT_PREVIEW ? (
                        document.content_cz.substring(0, MAX_LENGTH_OF_CONTENT_PREVIEW) + "..."
                      ) : (
                        document.content_cz
                      )
                      }
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {document.keywords_cz.length > MAX_NUMBER_OF_KEYWORDS ? (
                        document.keywords_cz.slice(0, MAX_NUMBER_OF_KEYWORDS).join(", ") + ", ..."
                      ) : (
                        document.keywords_cz.join(", ")
                      )
                      }
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {document.keywords_en.length > MAX_NUMBER_OF_KEYWORDS ? (
                        document.keywords_en.slice(0, MAX_NUMBER_OF_KEYWORDS).join(", ") + ", ..."
                      ) : (
                        document.keywords_en.join(", ")
                      )
                      }
                    </TableCell>
                    <TableCell>{document.updatedAt}</TableCell>
                    <TableCell onClick={(evt) => shareDocumentLink(evt, document, navigator)} color="inherit">
                      <IconButton >
                        <ShareIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell onClick={(evt) => deleteDocument(evt, document)} color="inherit">
                      <IconButton >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        // no documents available
        !loading && (
          <Typography variant="subtitle1">So far no documents have been uploaded, start uploading your first document now!</Typography>
        )
      )}

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
  );
}

export default DocumentManager;
