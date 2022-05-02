import React, { Component } from 'react';
import {
  TextField,
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import ClearIcon from '@material-ui/icons/Clear';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input'

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
    marginTop: theme.spacing(1)
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
    };
  }

  componentDidMount() {
    const { psychologist } = this.props

    if(psychologist) {
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
    const { id, name, website, keywords_cz, keywords_en, translate_keywords } = this.state;

    // execute parent function in psychologistManager
    onSave(id, name, website, keywords_cz, keywords_en, translate_keywords)
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
    } else {
      this.setState({
        keywords_en: [...this.state.keywords_en, keyword]
      })
    } 
  }

  handleDeleteKeyword(keyword, index, language) {
    if (language === "CZ") {
      let keywords = this.state.keywords_cz
      keywords.splice(index, 1)

      this.setState({
        keywords_cz: keywords
      })
    } else {
      let keywords = this.state.keywords_en
      keywords.splice(index, 1)

      this.setState({
        keywords_en: keywords
      })
    }
  }
  
  render() {
    const { classes, history } = this.props;

    return (
      <Modal
        className={ classes.modal }
        onClose={ () => history.goBack() }
        open
      >
        <Card className={ classes.modalCard }>
          <form onSubmit={ this.handleSubmit }>
            <CardContent className={ classes.modalCardContent }>
              <TextField
                required 
                type="text"
                name="name"
                className={ classes.input }
                key="inputPsychologistName"
                placeholder="Psychologist Name"
                label="Psychologist Name"
                value={ this.state.name }
                onChange={ this.handleChange }
                variant="outlined"
                size="small"
                autoFocus 
              />

            <TextField
                required 
                type="text"
                name="website"
                className={ classes.input }
                key="inputPsychologistWebsite"
                placeholder="Psychologist Website"
                label="Psychologist Website"
                value={ this.state.website }
                onChange={ this.handleChange }
                variant="outlined"
                size="small"
                autoFocus 
              />

            <ChipInput
              label="Keywords CZ"
              value={ this.state.keywords_cz}
              onAdd={ (chip) => this.handleAddKeyword(chip, "CZ") }
              onDelete={ (chip, index) => this.handleDeleteKeyword(chip, index, "CZ") }
            />

            <ChipInput
              label="Keywords EN"
              value={ this.state.keywords_en }
              onAdd={ (chip) => this.handleAddKeyword(chip, "EN") }
              onDelete={ (chip, index) => this.handleDeleteKeyword(chip, index, "EN") }
            />

            <ChipInput
              label="Proposed Keywords"
              value={ this.state.proposed_keywords }
            />

            <FormControlLabel
              className={ classes.input }
              control={
                <Checkbox
                  id="translate_keywords"
                  name="translate_keywords"
                  value={ this.state.translate_keywords }
                  onChange={ this.handleChange }
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              }
              label="Translate Keywords into other Language"
            />

            </CardContent>
            <CardActions>
              <Button size="small" color="primary" type="submit"><SaveAltIcon/>Save</Button>
              <Button size="small" onClick={ () => history.goBack() }><ClearIcon/>Cancel</Button>
            </CardActions>
          </form>
        </Card>
    </Modal>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(PsychologistEditor);