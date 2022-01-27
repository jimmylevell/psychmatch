import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Grid,
  Paper
} from '@material-ui/core';
import { compose } from 'recompose';

import LoadingBar from '../components/loadingBar';
import ErrorSnackbar from '../components/errorSnackbar';
import InfoSnackbar from '../components/infoSnackbar';

const API = process.env.REACT_APP_BACKEND_URL;
const styles = theme => ({
  title: {
    marginBottom: theme.spacing(1)
  }
});

class DocumentViewer extends Component {
  constructor() {
    super();

    this.state = {
      documentId: null,
      document: null,
      
      success: null,          // flag to trigger success info
      loading: true,          // flag to trigger loading
      error: null,            // flag to trigger error messages
    };
  }

  componentDidMount = () => {
    const documentId = this.props.match.params.id;

    // wait till state is fully set, then load usecases
    this.setState({
      documentId: documentId,
    }, this.getDocument)
  }

  async fetch(method, endpoint, body) {
    try {
      this.setState({
        loading: true
      })

      let response = await fetch(`${ API }/api${ endpoint }`, {
        method,
        body: JSON.stringify(body),
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

      response = await response.json();
      return response.documents
    } catch (error) {
      console.error(error);
      this.setState({ error });
    }
  }

  async getDocument() {
    this.setState({
      document: (await this.fetch('get', '/documents/' + this.state.documentId)) || []
    })
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>    
        <Typography className={ classes.title } variant="h4">Document View</Typography>
        
        {this.state.document !== null ? (
          // document present
          <div>
            <Typography variant="h5" className={ classes.title }> { this.state.document._id } </Typography>

            <Grid container spacing={ 3 }>
              <Grid item xs={ 6 }>
                <Paper className={ classes.paper }> { this.state.document.content_cz } </Paper>
              </Grid>
              <Grid item xs={ 6 }>
                <Paper className={ classes.paper }> { this.state.document.content_en } </Paper>
              </Grid>

              <Grid item xs={ 6 }>
                <Paper className={ classes.paper }> { this.state.document.content_en } </Paper>
              </Grid>
              <Grid item xs={ 6 }>
                <Paper className={ classes.paper }> { this.state.document.content_en } </Paper>
              </Grid>
            </Grid>
          </div>  
        ) : (
          // no document could be found
          !this.state.loading && (
            <Typography variant="subtitle1">No document with given ID could be found</Typography>
          )
        )}

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
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(DocumentViewer);