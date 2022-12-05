import React, { Component } from 'react';
import {
  Typography,
  TextField,
  withStyles,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Modal,
  Button,
  Checkbox,
  FormControlLabel,
  Chip
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input'

import InfoSnackbar from './infoSnackbar';

const styles = theme => ({
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

class PsychologistEditor extends Component {
  constructor() {
    super();

    this.state = {
      id: "",
      name: "",
      website: "",
      keywords_cz: [],
      keywords_en: [],
      translate_keywords: false,
      proposed_keywords: [],

      success: null,
    };
  }

  componentDidMount() {
    const { psychologist } = this.props

    if (psychologist) {
      // only change state of psychologist passed
      this.setState({
        id: psychologist._id,
        name: psychologist.name,
        website: psychologist.website,
        keywords_cz: psychologist.keywords_cz,
        keywords_en: psychologist.keywords_en,
        proposed_keywords: psychologist.proposed_keywords,
      })
    }
  }

  handleSubmit = evt => {
    evt.preventDefault();

    const { onSave } = this.props
    const { id, name, website, keywords_cz, keywords_en, translate_keywords, proposed_keywords } = this.state;

    // execute parent function in psychologistManager
    onSave(id, name, website, keywords_cz, keywords_en, translate_keywords, proposed_keywords)
  };

  handleChange = (evt) => {
    const target = evt.target
    const name = target.name
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value

    this.setState({
      [name]: value
    })
  }

  handleAddKeyword(keyword, language) {
    if (language === "CZ") {
      this.setState({
        keywords_cz: [...this.state.keywords_cz, keyword]
      })
    } else if (language === "EN") {
      this.setState({
        keywords_en: [...this.state.keywords_en, keyword]
      })
    } else {
      console.error("Unknown language: " + language)
    }
  }

  handleDeleteKeyword(keyword, index, language) {
    if (language === "CZ") {
      let keywords = this.state.keywords_cz
      keywords.splice(index, 1)

      this.setState({
        keywords_cz: keywords
      })
    } else if (language === "EN") {
      let keywords = this.state.keywords_en
      keywords.splice(index, 1)

      this.setState({
        keywords_en: keywords
      })
    } else {
      console.error("Unknown language: " + language)
    }
  }

  handleProposedKeywords = (index, keyword) => () => {
    let proposed_keywords = this.state.proposed_keywords
    proposed_keywords = proposed_keywords.filter(key => key !== keyword)

    let keywords_en = this.state.keywords_en
    keywords_en = [...keywords_en, keyword]

    this.setState({
      proposed_keywords: proposed_keywords,
      keywords_en: keywords_en,
      success: "Keyword '" + keyword + "' added to Keywords EN"
    })
  }


  render() {
    const { classes, history } = this.props;
    const TITLE = this.state.id ? "Editing " + this.state.name : "Add a new Psychologist";

    return (
      <Modal
        className={classes.modal}
        onClose={() => history.goBack()}
        open
      >
        <Card className={classes.modalCard}>
          <CardHeader title={TITLE} />

          <form onSubmit={this.handleSubmit}>
            <CardContent className={classes.modalCardContent}>
              <TextField
                required
                type="text"
                name="name"
                key="inputPsychologistName"
                placeholder="Psychologist Name"
                label="Psychologist Name"
                value={this.state.name}
                onChange={this.handleChange}
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
                value={this.state.website}
                onChange={this.handleChange}
                variant="outlined"
                size="small"
              />

              <ChipInput
                className={classes.input}
                label="Keywords CZ"
                value={this.state.keywords_cz}
                onAdd={(chip) => this.handleAddKeyword(chip, "CZ")}
                onDelete={(chip, index) => this.handleDeleteKeyword(chip, index, "CZ")}
              />

              <ChipInput
                className={classes.input}
                label="Keywords EN"
                value={this.state.keywords_en}
                onAdd={(chip) => this.handleAddKeyword(chip, "EN")}
                onDelete={(chip, index) => this.handleDeleteKeyword(chip, index, "EN")}
              />

              <Typography variant="body2" color="textSecondary" className={classes.input}>Proposed Keywords</Typography>
              <div className={classes.proposed_keywords}>
                {this.state.proposed_keywords.sort().map((element) => {
                  let index = this.state.proposed_keywords.indexOf(element)
                  return (
                    <Chip
                      key={index}
                      deleteIcon={<AddIcon />}
                      onDelete={this.handleProposedKeywords(index, element)}
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
                    value={this.state.translate_keywords}
                    onChange={this.handleChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                }
                label="Translate Keywords into other Language"
              />
            </CardContent>

            <CardActions>
              <Button size="small" color="primary" type="submit"><SaveAltIcon />Save</Button>
              <Button size="small" onClick={() => history.goBack()}><ClearIcon />Cancel</Button>
            </CardActions>
          </form>
          { /* Flag based display of info snackbar */}
          {this.state.success && (
            <InfoSnackbar
              onClose={() => this.setState({ success: null })}
              message={this.state.success}
            />
          )}
        </Card>
      </Modal>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(PsychologistEditor);
