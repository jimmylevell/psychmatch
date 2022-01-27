import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Button,
  TextField
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { compose } from 'recompose';

import LoadingBar from '../components/loadingBar';
import ErrorSnackbar from '../components/errorSnackbar';
import InfoSnackbar from '../components/infoSnackbar'

const API = process.env.REACT_APP_BACKEND_URL;

const styles = theme => ({
  contentInput: {
    width: "90%",
    margin: theme.spacing(1),
    fontSize: "1.2em"
  },
  button: {
    margin: theme.spacing(1),
  }
});

class DocumentUploadComponent extends Component {
  constructor() {
    super();

    this.state = {      
        document: '',

        loading: true,                   // flag for displaying loading bar
        success: null,                   // flag for displaying success messages
        error: null,                     // flag for displaying error messages
      };

      this.handleChange = this.handleChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: false
    })
  }

  async fetch(method, endpoint, body) {
    try {
      this.setState({
        loading: true,
      })

      const response = await fetch(`${ API }/api${ endpoint }`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });

      this.setState({
        loading: false
      })

      if(response.ok === false) {
        console.error(response)
        this.setState({
          error: { message: "Error when talking with API. Error message: " + response.statusText}
        })

        return response
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      this.setState({ 
        error: error 
      });
    }
  }

  handleChange = (evt) => {
    const target = evt.target
    const name = target.name
    let value = target.value

    this.setState({
      [name]: value
    })
  }

  async onSubmit(evt) {
      evt.preventDefault()
      
      var postData = {
        document: this.state.document
      }

      await this.fetch('post', "/documents", postData)

      this.setState({
        document: '',
      })

      if(this.state.error === null) {
        this.setState({
          success: "Document uploaded successfully"
        })
      }
  }  

  render() {
    const { classes } = this.props;
    
    return (
      <Fragment>
        <Typography variant="h4">Document Upload</Typography>
        <form encType="multipart/form-data" onSubmit={ this.onSubmit }>
          
          <TextField
            type="text"
            name="document"
            label="Document Content"
            value={ this.state.document }
            onChange={ this.handleChange }
            variant="outlined"
            fullWidth={ true }
            className={ classes.contentInput }
            multiline
            rows={ 20 }
          />

          <Button
            color="primary" 
            variant="outlined"
            className={ classes.button }
            disabled={ !this.state.document } 
            type="submit"
          >
            <AddIcon/>Upload
          </Button>
        </form>

        { /* Flag based display of error snackbar */ }
        {this.state.error && (
        <ErrorSnackbar
          onClose={() => this.setState({ error: null })}
          message={ this.state.error.message }
        />
        )}

        { /* Flag based display of loadingbar */ }
        {this.state.loading && (
          <LoadingBar/>
        )}

        { /* Flag based display of info snackbar */ }
        {this.state.success && (
          <InfoSnackbar
            onClose={() => this.setState({ success: null })}
            message={ this.state.success }
          />
        )}
      </Fragment>
    )
  }
}

export default compose(
    withRouter,
    withStyles(styles),
  )(DocumentUploadComponent);