import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Modal,
  Button,
  Checkbox,
  FormControlLabel,
  Chip,
  createTheme
} from '@mui/material';
import { withStyles } from '@mui/styles';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { MuiChipsInput } from 'mui-chips-input'

import InfoSnackbar from './infoSnackbar';

const theme = createTheme();

const styles = () => ({
  modal: {
    display: 'flex',
    outline: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 800,
    maxHeight: "100%",
    overflowY: 'scroll',
    height: '80vh',
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  input: {
    marginTop: theme.spacing(2)
  },
  proposed_keywords: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  }
});

function PsychologistEditor(props) {
  const { classes, psychologist, editorMode, onClose } = props;

  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [keywords_cz, setKeywordsCz] = useState([]);
  const [keywords_en, setKeywordsEn] = useState([]);
  const [translate_keywords, setTranslateKeywords] = useState(false);
  const [proposed_keywords, setProposedKeywords] = useState([]);

  const TITLE = id ? "Editing " + name : "Add a new Psychologist";

  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (psychologist) {
      if (editorMode === "copy") {
        setId(null);
        setName(psychologist.name + " (copy)");
      }
      else {
        setId(psychologist.id);
        setName(psychologist.name);
      }

      setWebsite(psychologist.website);
      setKeywordsCz(psychologist.keywords_cz);
      setKeywordsEn(psychologist.keywords_en);
      setProposedKeywords(psychologist.proposed_keywords);
    }
  }, [psychologist]);

  const handleSubmit = evt => {
    evt.preventDefault();

    const { onSave } = props

    // execute parent function in psychologistManager
    onSave(id, name, website, keywords_cz, keywords_en, translate_keywords, proposed_keywords)
  };

  const handleChange = (evt) => {
    const target = evt.target
    const name = target.name
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value

    switch (name) {
      case 'name':
        setName(value)
        break
      case 'website':
        setWebsite(value)
        break
      case 'keywords_cz':
        setKeywordsCz(value)
        break
      case 'keywords_en':
        setKeywordsEn(value)
        break
      default:
        break
    }
  }

  const handleAddKeyword = (keyword, language) => {
    if (language === "CZ") {
      setKeywordsCz([...keywords_cz, keyword])
    } else if (language === "EN") {
      setKeywordsEn([...keywords_en, keyword])
    } else {
      console.error("Unknown language: " + language)
    }
  }

  const handleDeleteKeyword = (keyword, index, language) => {
    if (language === "CZ") {
      let keywords = keywords_cz
      keywords.splice(index, 1)

      setKeywordsCz(keywords)
    } else if (language === "EN") {
      let keywords = keywords_en
      keywords.splice(index, 1)

      setKeywordsEn(keywords)
    } else {
      console.error("Unknown language: " + language)
    }
  }

  const handleProposedKeywords = (index, keyword) => () => {
    let proposed_keywords = proposed_keywords
    proposed_keywords = proposed_keywords.filter(key => key !== keyword)

    let keywords_en = keywords_en
    keywords_en = [...keywords_en, keyword]

    setProposedKeywords(proposed_keywords)
    setKeywordsEn(keywords_en)
    setSuccess({ success: "Keyword '" + keyword + "' added to Keywords EN" })
  }

  return (
    <Modal
      className={classes.modal}
      onClose={() => onClose()}
      open
    >
      <Card className={classes.modalCard}>
        <CardHeader title={TITLE} />

        <form onSubmit={handleSubmit}>
          <CardContent className={classes.modalCardContent}>
            <TextField
              required
              type="text"
              name="name"
              key="inputPsychologistName"
              placeholder="Psychologist Name"
              label="Psychologist Name"
              value={name}
              onChange={handleChange}
              variant="outlined"
              size="small"
              autoFocus
            />

            <TextField
              required
              type="url"
              name="website"
              className={classes.input}
              key="inputPsychologistWebsite"
              placeholder="Psychologist Website"
              label="Psychologist Website"
              value={website}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />

            <MuiChipsInput
              className={classes.input}
              label="Keywords CZ"
              value={keywords_cz}
              onAdd={(chip) => handleAddKeyword(chip, "CZ")}
              onDelete={(chip, index) => handleDeleteKeyword(chip, index, "CZ")}
            />

            <MuiChipsInput
              className={classes.input}
              label="Keywords EN"
              value={keywords_en}
              onAdd={(chip) => handleAddKeyword(chip, "EN")}
              onDelete={(chip, index) => handleDeleteKeyword(chip, index, "EN")}
            />

            <Typography variant="body2" color="textSecondary" className={classes.input}>Proposed Keywords</Typography>
            <div className={classes.proposed_keywords}>
              {proposed_keywords.sort().map((element) => {
                let index = proposed_keywords.indexOf(element)
                return (
                  <Chip
                    key={index}
                    deleteIcon={<AddIcon />}
                    onDelete={handleProposedKeywords(index, element)}
                    icon={<SpellcheckIcon />}
                    label={element}
                  />
                )
              })}
            </div>

            <FormControlLabel
              className={classes.input}
              control={
                <Checkbox
                  id="translate_keywords"
                  name="translate_keywords"
                  value={translate_keywords}
                  onChange={handleChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              }
              label="Translate Keywords into other Language"
            />
          </CardContent>

          <CardActions>
            <Button size="small" color="primary" type="submit"><SaveAltIcon />Save</Button>
            <Button size="small"><ClearIcon />Cancel</Button>
          </CardActions>
        </form>
        { /* Flag based display of info snackbar */}
        {success && (
          <InfoSnackbar
            onClose={() => setSuccess({ success: null })}
            message={success}
          />
        )}
      </Card>
    </Modal>
  )
}

export default withStyles(styles)(PsychologistEditor);
