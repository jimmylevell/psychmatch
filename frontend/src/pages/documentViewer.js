import React, { Fragment, useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  CardContent,
  Card,
  Button,
  createTheme
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import RefreshIcon from '@mui/icons-material/Refresh';

import { ModelService } from '../service';

import LoadingBar from '../components/loadingBar';
import ErrorSnackbar from '../components/errorSnackbar';
import InfoSnackbar from '../components/infoSnackbar';
import PsychologistCard from '../components/psychologistCard';

const theme = createTheme();

const styles = () => ({
  title: {
    marginBottom: theme.spacing(1)
  },
  subtitle: {
    marginLeft: theme.spacing(1.5),
  },
  table: {
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(0.2),
  },
  buttons: {
    margin: theme.spacing(1)
  }
});

function DocumentViewer(props) {
  const { classes } = props;
  const params = useParams();

  const [documentId, setDocumentId] = useState(null);
  const [document, setDocument] = useState(null);

  const [service, setService] = useState(ModelService.getInstance());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (ModelService.token) {
      setDocumentId(params.id)
      getDocument(params.id)
    }
  }, [service]);

  const getDocument = async (id) => {
    let document = null;

    try {
      setLoading(true)
      document = await service.getDocument(id) || []
    }
    catch (error) {
      setError({ message: "Error getting document. Response from backend: " + error })
      setLoading(false)
    }

    setDocument(document)
    setLoading(false)
  }

  const handleReexecution = async () => {
    if (window.confirm(`Are you sure you would like to reprocess the following document? All previous matches will be lost.`)) {
      try {
        setLoading(true)

        await service.reexecuteDocument(documentId);
      }
      catch (error) {
        setError({ message: "Error reprocessing document. Response from backend: " + error })
        setLoading(false)
      }

      if (!error) {
        setSuccess({ message: "Document reprocessed successfully." })
        setLoading(false)
        getDocument()
      }
    }
  }

  const addKeywordsToPsychologist = (id, keywords) => {
    try {
      service.addKeywordsToPsychologist(id, keywords)
        .then(() => {

          setSuccess("Successfully added the keywords to the psychologist")
        })
    }
    catch (error) {
      setError({ message: "Error adding keywords to the psychologist. Response from backend: " + error })
    }
  }

  return (
    <Fragment>
      {document !== null ? (
        // document present
        <div>
          <Typography className={classes.title} variant="h4">Document View
            <Button
              size="small"
              color="primary"
              onClick={handleReexecution}
              className={classes.buttons}
            >
              <RefreshIcon />Re-Execute Match Making
            </Button>
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Czech Content</Typography>
                  <Typography component="p"> {document.content_cz}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">English Content</Typography>
                  <Typography component="p"> {document.content_en}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Czech Keywords</Typography>
                  <Typography component="p"> {document.keywords_cz.join(", ")}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">English Keywords</Typography>
                  <Typography component="p"> {document.keywords_en.join(", ")}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Typography className={classes.subtitle} variant="h5">Document View</Typography>
            <Grid container className={classes.table} spacing={2}>
              {document.matched_psychologists && (
                document.matched_psychologists.sort((a, b) => b.score - a.score).map(function (match) {
                  return <PsychologistCard
                    key={match.psychologist}
                    id={match.psychologist}
                    match_score={match.score}
                    most_important_matches={match.most_important_matches}
                    keywords={document.keywords_en}
                    token={props.token}
                    addKeywordsToPsychologist={addKeywordsToPsychologist}
                  />
                })
              )}
            </Grid>
          </Grid>
        </div>
      ) : (
        // no document could be found
        !loading && (
          <Fragment>
            <Typography className={classes.title} variant="h4">Document View</Typography>
            <Typography variant="subtitle1">No document with given ID could be found</Typography>
          </Fragment>
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

export default withStyles(styles)(DocumentViewer);
