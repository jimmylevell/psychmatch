import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Fab,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  createTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Create as CreateIcon,
  Add as AddIcon,
  FileCopy as FileCopyIcon
} from '@mui/icons-material';
import moment from 'moment';
import { orderBy, filter } from 'lodash';

import { ModelService, Psychologist } from '../service';

import PsychologistEditor from '../components/psychologistEditor';
import ErrorSnackbar from '../components/errorSnackbar';
import LoadingBar from '../components/loadingBar'
import InfoSnackbar from '../components/infoSnackbar'

const theme = createTheme();

const PsychologistManager: React.FC = () => {
  const [query, setQuery] = useState("");
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState<Psychologist[]>([]);

  const [psychologist, setPsychologist] = useState<Psychologist | null>(null);
  const [editorMode, setEditorMode] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const service = ModelService.getInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string} | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getPsychologists = useCallback(() => {
    service.getPsychologists()
      .then(psychologists => {
        setPsychologists(psychologists || [])
      })
  }, [service]);

  useEffect(() => {
    if (ModelService.token) {
      getPsychologists();
    }
  }, [getPsychologists]);

  useEffect(() => {
    setFilteredPsychologists(filter(psychologists, function (obj) {
      if (obj.name) {
        return obj.name.toUpperCase().includes(query.toUpperCase());
      } else {
        return false;
      }
    }))
  }, [psychologists, query]);

  const onSavePsychologist = async (id, name, website, keywords_cz, keywords_en, translate_keywords, proposed_keywords, image) => {
    var postData = {
      name: name,
      website: website,
      keywords_cz: keywords_cz,
      keywords_en: keywords_en,
      translate_keywords: translate_keywords,
      proposed_keywords: proposed_keywords,
      image: image
    }

    try {
      setLoading(true)

      if (id) {
        await service.updatePsychologist(id, postData);
      } else {
        await service.newPsychologist(postData);
      }
    }
    catch (error) {
      setError({ message: "Error saving documents. Response from backend: " + error })
      setLoading(false)
    }

    setLoading(false)
    getPsychologists();
    setEditorOpen(false);

    if (error === null) {
      props.history.goBack();
    }
  }

  const deletePsychologist = async (psychologist) => {
    if (window.confirm(`Are you sure you want to delete "${psychologist.name}"`)) {
      try {
        await service.deletePsychologist(psychologist._id)
      }
      catch (error) {
        setError({ message: "Error deleting psychologist. Response from backend: " + error })
      }
    }

    if (error === null) {
      setSuccess("Psychologist successfully deleted")
    }

    getPsychologists();
  }

  const handleSearchChange = evt => {
    setQuery(evt.target.value);
  };

  const handleEditorOpen = (psychologist, mode) => {
    setPsychologist(psychologist);
    setEditorMode(mode);
    setEditorOpen(true);
  };

  return (
    <Fragment>
      <TextField
        type="text"
        key="inputQuery"
        placeholder="Search"
        label="Search"
        sx={{
          width: "100%",
        }}
        value={query}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
        autoFocus
      />

      <Typography variant="h4">Psychologists</Typography>

      { /* psychologists area */}
      {psychologists.length > 0 ? (
        // psychologist available
        <Paper elevation={1}>
          <List>
            {orderBy(filteredPsychologists, ['updatedAt', 'name'], ['desc', 'asc']).map(psychologist => (
              <ListItem key={psychologist._id}>
                <ListItemText
                  primary={psychologist.name}
                  secondary={psychologist.updatedAt && `Updated ${moment(psychologist.updatedAt).fromNow()}`}
                />

                <ListItemSecondaryAction>
                  <IconButton component={Link} onClick={() => handleEditorOpen(psychologist, "copy")} color="inherit">
                    <FileCopyIcon />
                  </IconButton>
                  <IconButton component={Link} onClick={() => handleEditorOpen(psychologist, "edit")} color="inherit">
                    <CreateIcon />
                  </IconButton>
                  <IconButton onClick={() => deletePsychologist(psychologist)} color="inherit">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>


      ) : (
        // no psychologists available
        !loading && (
          <Typography variant="subtitle1">So far no psychologists have been created, start adding your first psychologist now!</Typography>
        )
      )}

      <Fragment>
        <Fab
          color="secondary"
          aria-label="add"
          sx={{
            position: 'absolute',
            bottom: theme.spacing(3),
            right: theme.spacing(3),
            [theme.breakpoints.down('xs')]: {
              bottom: theme.spacing(2),
              right: theme.spacing(2),
            }
          }}
          component={Link}
          onClick={() => { handleEditorOpen(null, 'create') }}
        >
          <AddIcon />
        </Fab>
      </Fragment>

      { /* Use Case Editor */}
      {editorOpen && (
        <PsychologistEditor
          psychologist={psychologist}
          editorMode={editorMode}
          errorMessage={error}
          onSave={onSavePsychologist}
          onClose={() => { setEditorOpen(false) }}
        />
      )}

      { /* Flag based display of loadingbar */}
      {loading && (
        <LoadingBar />
      )}

      { /* Flag based display of error snackbar */}
      {error && (
        <ErrorSnackbar
          onClose={() => setError(null)}
          message={error.message}
        />
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

export default PsychologistManager;
