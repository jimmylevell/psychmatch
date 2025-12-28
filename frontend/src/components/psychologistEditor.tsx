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
  Box,
  createTheme
} from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { MuiChipsInput } from 'mui-chips-input'

import InfoSnackbar from './infoSnackbar';
import { Psychologist } from '../service';

const theme = createTheme();

interface PsychologistEditorProps {
  classes?: any;
  psychologist: Psychologist | null;
  editorMode: string;
  onClose: () => void;
  onSave: (
    id: string | null,
    name: string,
    website: string,
    keywords_cz: string[],
    keywords_en: string[],
    translate_keywords: boolean,
    proposed_keywords: string[],
    image?: string
  ) => void;
}

interface SuccessState {
  success: string;
}

const PsychologistEditor: React.FC<PsychologistEditorProps> = (props) => {
  const { classes, psychologist, editorMode, onClose } = props;

  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [keywords_cz, setKeywordsCz] = useState<string[]>([]);
  const [keywords_en, setKeywordsEn] = useState<string[]>([]);
  const [translate_keywords] = useState(false);
  const [proposed_keywords, setProposedKeywords] = useState<string[]>([]);
  const [image, setImage] = useState<string | undefined>(undefined);

  const TITLE = id ? "Editing " + name : "Add a new Psychologist";

  const [success, setSuccess] = useState<SuccessState | null>(null);

  useEffect(() => {
    if (psychologist) {
      if (editorMode === "copy") {
        setId(null);
        setName(psychologist.name + " (copy)");
      }
      else {
        setId(psychologist._id);
        setName(psychologist.name);
      }

      setWebsite(psychologist.website);
      setKeywordsCz(psychologist.keywords_cz);
      setKeywordsEn(psychologist.keywords_en);
      setProposedKeywords(psychologist.proposed_keywords || []);
      setImage(psychologist.image);
    } else {
      // Reset state for new psychologist
      setId(null);
      setName("");
      setWebsite("");
      setKeywordsCz([]);
      setKeywordsEn([]);
      setProposedKeywords([]);
      setImage(undefined);
    }
  }, [psychologist, editorMode]);

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();

    const { onSave } = props

    // execute parent function in psychologistManager
    onSave(id, name, website, keywords_cz, keywords_en, translate_keywords, proposed_keywords, image)
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target
    const name = target.name
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value

    switch (name) {
      case 'name':
        setName(value as string)
        break
      case 'website':
        setWebsite(value as string)
        break
      case 'keywords_cz':
        setKeywordsCz(value as any)
        break
      case 'keywords_en':
        setKeywordsEn(value as any)
        break
      default:
        break
    }
  }

  const handleAddKeyword = (keyword: string, language: string) => {
    if (language === "CZ") {
      setKeywordsCz([...keywords_cz, keyword])
    } else if (language === "EN") {
      setKeywordsEn([...keywords_en, keyword])
    } else {
      console.error("Unknown language: " + language)
    }
  }

  const handleDeleteKeyword = (keyword: string, index: number, language: string) => {
    if (language === "CZ") {
      let keywords = [...keywords_cz]
      keywords.splice(index, 1)

      setKeywordsCz(keywords)
    } else if (language === "EN") {
      let keywords = [...keywords_en]
      keywords.splice(index, 1)

      setKeywordsEn(keywords)
    } else {
      console.error("Unknown language: " + language)
    }
  }

  const handleProposedKeywords = (index: number, keyword: string) => () => {
    let updated_proposed_keywords = proposed_keywords.filter(key => key !== keyword)
    let updated_keywords_en = [...keywords_en, keyword]

    setProposedKeywords(updated_proposed_keywords)
    setKeywordsEn(updated_keywords_en)
    setSuccess({ success: "Keyword '" + keyword + "' added to Keywords EN" })
  }

  const handleImageChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      sx={{
        display: 'flex',
        outline: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClose={() => onClose()}
      open
    >
      <Card sx={{
        width: '100%',
        maxWidth: 800,
        maxHeight: "100%",
        overflowY: 'scroll',
        height: '80vh',
      }}>
        <CardHeader title={TITLE} />

        <form onSubmit={handleSubmit}>
          <CardContent sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
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
              sx={{
                marginTop: theme.spacing(2)
              }}
              key="inputPsychologistWebsite"
              placeholder="Psychologist Website"
              label="Psychologist Website"
              value={website}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />

            <Box sx={{
              marginTop: theme.spacing(2),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing(2)
            }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {image && (
                <Box
                  component="img"
                  src={image}
                  alt="Psychologist"
                  sx={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: 1
                  }}
                />
              )}
            </Box>

            <MuiChipsInput
              sx={{
                marginTop: theme.spacing(2)
              }}
              label="Keywords CZ"
              value={keywords_cz}
              onAdd={(chip) => handleAddKeyword(chip, "CZ")}
              onDelete={(chip, index) => handleDeleteKeyword(chip, index, "CZ")}
            />

            <MuiChipsInput
              sx={{
                marginTop: theme.spacing(2)
              }}
              label="Keywords EN"
              value={keywords_en}
              onAdd={(chip) => handleAddKeyword(chip, "EN")}
              onDelete={(chip, index) => handleDeleteKeyword(chip, index, "EN")}
            />

            <Typography variant="body2" color="textSecondary" sx={{
              marginTop: theme.spacing(2)
            }}>Proposed Keywords</Typography>
            <div className={classes?.proposed_keywords}>
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
              sx={{
                marginTop: theme.spacing(2)
              }}
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

export default PsychologistEditor;
