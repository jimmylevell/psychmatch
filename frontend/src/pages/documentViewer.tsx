import React, { Fragment, useState, useEffect, useCallback } from 'react';
import {
  Typography,
  CardContent,
  Card,
  Button,
  createTheme,
  Box
} from '@mui/material';
import { useParams } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';

import { ModelService, Document } from '../service';

import LoadingBar from '../components/loadingBar';
import ErrorSnackbar from '../components/errorSnackbar';
import InfoSnackbar from '../components/infoSnackbar';
import PsychologistCard from '../components/psychologistCard';

const theme = createTheme();

const DocumentViewer: React.FC = () => {
  const params = useParams();

  const [documentId, setDocumentId] = useState<string | null>(null);
  const [document, setDocument] = useState<Document | null>(null);

  const service = ModelService.getInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [success, setSuccess] = useState<{ message: string } | null>(null);

  const getDocument = useCallback(async (id: string) => {
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
  }, [service]);

  useEffect(() => {
    if (ModelService.token && params.id) {
      setDocumentId(params.id)
      getDocument(params.id)
    }
  }, [params.id, getDocument]);

  const handleReexecution = async () => {
    if (!documentId) return;

    if (window.confirm(`Are you sure you would like to reprocess the following document? All previous matches will be lost.`)) {
      try {
        setLoading(true)

        await service.reexecuteDocument(documentId);
      }
      catch (error) {
        setError({ message: "Error reprocessing document. Response from backend: " + error })
        setLoading(false)
      }

      if (!error && documentId) {
        setSuccess({ message: "Document reprocessed successfully." })
        setLoading(false)
        getDocument(documentId)
      }
    }
  }

  const addKeywordsToPsychologist = (id: string, keywords: string[]) => {
    try {
      service.addKeywordsToPsychologist(id, keywords)
        .then(() => {

          setSuccess({ message: "Successfully added the keywords to the psychologist" })
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
          <Typography sx={{
            marginBottom: theme.spacing(1)
          }} variant="h4">Document View
            <Button
              size="small"
              color="primary"
              onClick={handleReexecution}
              sx={{ margin: theme.spacing(1) }}
            >
              <RefreshIcon />Re-Execute Match Making
            </Button>
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Czech Content</Typography>
                  <Typography component="p"> {document.content_cz}</Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">English Content</Typography>
                  <Typography component="p"> {document.content_en}</Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Czech Keywords</Typography>
                  <Typography component="p"> {document.keywords_cz.join(", ")}</Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 300 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">English Keywords</Typography>
                  <Typography component="p"> {document.keywords_en.join(", ")}</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Typography sx={{
            marginLeft: theme.spacing(1.5),
          }} variant="h5">Matched Psychologists</Typography>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            marginTop: theme.spacing(0.5),
            marginLeft: theme.spacing(0.2),
          }}>
            {document.matched_psychologists && (
              document.matched_psychologists.sort((a, b) => b.score - a.score).map(function (match) {
                return <PsychologistCard
                  key={match.psychologist}
                  id={match.psychologist}
                  match_score={match.score}
                  most_important_matches={match.most_important_matches}
                  keywords={document.keywords_en}
                  addKeywordsToPsychologist={addKeywordsToPsychologist}
                />
              })
            )}
          </Box>
        </div>
      ) : (
        // no document could be found
        !loading && (
          <Fragment>
            <Typography sx={{
              marginBottom: theme.spacing(1)
            }} variant="h4">Document View</Typography>
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
          message={success.message}
        />
      )}
    </Fragment>
  );
}

export default DocumentViewer;
