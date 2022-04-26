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
  table: {
    marginTop: theme.spacing(2),
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

      psychologists: [ 
        { psychologist_id: '1', name: 'test', website: 'https://google.com', matched_keywords: ['test'], matched_score: 10 },
        { psychologist_id: '2', name: 'test 1', matched_keywords: ['test'], matched_score: 10 },
        { psychologist_id: '3', name: 'test 2', matched_keywords: ['test'], matched_score: 10 },
        { psychologist_id: '4', name: 'test 3', matched_keywords: ['test'], matched_score: 10 },
       ],

      service: null,
      
      success: null,          // flag to trigger success info
      loading: true,          // flag to trigger loading
      error: null,            // flag to trigger error messages
    };

    this.handleReexecution = this.handleReexecution.bind(this);
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
      document = await this.state.service.getDocument(this.state.documentId) || []
    }
    catch {
      this.setState({
        error: { message: "Error getting document" }
      })
    }

    this.setState({
      document: document,
      loading: false
    })
  }

  async handleReexecution() {
    if (window.confirm(`Are you sure you reexecute the match making process for the given document?`)) {
      try {
        await this.state.service.reexecuteDocument(this.state.documentId);
      }
      catch {
        this.setState({
          error: { message: "Error getting documents" }
        })
      }

      if(!this.state.error) {
        this.setState({
          success: "Document rexecuted completed successfully"
        }, this.getDocument)
      }
    }
  }

  render() {
    const { classes } = this.props

    return (
      <Fragment>    
        <Typography className={ classes.title } variant="h4">Document View</Typography>
        
        {this.state.document !== null ? (
          // document present
          <div>
            <Typography variant="h5" className={ classes.title }> { this.state.document._id } 
            
            <Button 
              size="small" 
              color="primary" 
              onClick={ this.handleReexecution }
              className={ classes.buttons }
            >
              <RefreshIcon/>Update annotations
            </Button>
            </Typography>

            <Grid container spacing={ 3 }>
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

              <Grid container className={ classes.table } spacing={ 3 }>
                {this.state.psychologists && (
                  this.state.psychologists.map(function(psychologist) {
                    return <PsychologistCard key={ psychologist._id } psychologist={ psychologist } />
                  })
                )}
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