import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Grid,
  CardContent,
  Card,
  Button
} from '@material-ui/core';
import { compose } from 'recompose';
import RefreshIcon from '@material-ui/icons/Refresh';

import { ModelService } from '../service';

import LoadingBar from '../components/loadingBar';
import ErrorSnackbar from '../components/errorSnackbar';
import InfoSnackbar from '../components/infoSnackbar';
import PsychologistCard from '../components/psychologistCard';

const styles = theme => ({
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

class DocumentViewer extends Component {
  constructor() {
    super();

    this.state = {
      documentId: null,
      document: null,

      service: null,
      
      success: null,          // flag to trigger success info
      loading: true,          // flag to trigger loading
      error: null,            // flag to trigger error messages
    };

    this.handleReexecution = this.handleReexecution.bind(this);
    this.addKeywordsToPsychologist = this.addKeywordsToPsychologist.bind(this)
  }

  componentDidMount = () => {
    const documentId = this.props.match.params.id;

    // wait till state is fully set, then load document
    this.setState({
      service: ModelService.getInstance(this.props.token),
      documentId: documentId,
    }, this.getDocument)
  }

  async getDocument() {
    let document = null;

    try {
      this.setState({ loading: true })
      document = await this.state.service.getDocument(this.state.documentId) || []
    }
    catch(error) {
      this.setState({
        error: { message: "Error getting document. Response from backend: " + error },
        loading: false
      })
    }

    this.setState({
      document: document,
      loading: false
    })
  }

  async handleReexecution() {
    if (window.confirm(`Are you sure you would like to reprocess the following document? All previous matches will be lost.`)) {
      try {
        this.setState({ loading: true })

        await this.state.service.reexecuteDocument(this.state.documentId);
      }
      catch(error) {
        this.setState({
          error: { message: "Error reprocessing the document. Response from backend: " + error },
          loading: false
        })
      }

      if(!this.state.error) {
        this.setState({
          success: "Reprocessing of the document completed successfully",
          loading: false
        }, this.getDocument)
      }
    }
  }

  addKeywordsToPsychologist(id, keywords) {
    try {
      this.state.service.addKeywordsToPsychologist(id, keywords)
      .then(() => {
        this.setState({
          success: "Successfully added the keywords to the psychologist"
        })
      })
    }
    catch(error) {
      this.setState({
        error: { message: "Error adding keywords to the psychologist. Response from backend: " + error },
      })
    }
  }

  render() {
    const { classes, token } = this.props
    const addKeywordsToPsychologist = this.addKeywordsToPsychologist
    const document = this.state.document

    return (
      <Fragment>        
        {document !== null ? (
          // document present
          <div>
            <Typography className={ classes.title } variant="h4">Document View
              <Button 
                size="small" 
                color="primary" 
                onClick={ this.handleReexecution }
                className={ classes.buttons }
              >
                <RefreshIcon/>Re-Execute Match Making
              </Button>
            </Typography>

            <Grid container spacing={ 2 }>
              <Grid item xs={ 6 }>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Czech Content</Typography>
                    <Typography component="p"> { this.state.document.content_cz }</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={ 6 }>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">English Content</Typography>
                    <Typography component="p"> { this.state.document.content_en }</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={ 6 }>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">Czech Keywords</Typography>
                    <Typography component="p"> { this.state.document.keywords_cz.join(", ") }</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={ 6 }>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">English Keywords</Typography>
                    <Typography component="p"> { this.state.document.keywords_en.join(", ") }</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Typography className={ classes.subtitle } variant="h5">Document View</Typography>
              <Grid container className={ classes.table } spacing={ 2 }>                
                {this.state.document.matched_psychologists && (
                  this.state.document.matched_psychologists.sort((a, b) => b.score - a.score).map(function(match) {
                    return <PsychologistCard 
                              key={ match.psychologist } 
                              id={ match.psychologist } 
                              match_score={ match.score }
                              most_important_matches={ match.most_important_matches }
                              keywords={ document.keywords_en }
                              token={ token }
                              addKeywordsToPsychologist={ addKeywordsToPsychologist }
                            />
                  })
                )}
              </Grid>
            </Grid>
          </div>  
        ) : (
          // no document could be found
          !this.state.loading && (
            <Fragment>
              <Typography className={ classes.title } variant="h4">Document View</Typography>
              <Typography variant="subtitle1">No document with given ID could be found</Typography>
            </Fragment>
          )
        )}

        { /* Flag based display of error snackbar */ }
        {this.state.error && (
          <ErrorSnackbar
            onClose={ () => this.setState({ error: null }) }
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
            onClose={ () => this.setState({ success: null }) }
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