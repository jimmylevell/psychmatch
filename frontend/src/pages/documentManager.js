import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Paper,
  TextField,
  IconButton,
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableCell,
  TableRow
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import { orderBy, filter } from 'lodash';
import { compose } from 'recompose';

import LoadingBar from '../components/loadingBar';
import InfoSnackbar from '../components/infoSnackbar';
import ErrorSnackbar from '../components/errorSnackbar';

const MAX_LENGTH_OF_CONTENT_PREVIEW = 100
const API = process.env.REACT_APP_BACKEND_URL;
const styles = theme => ({
  documentsView: {
    whiteSpace: "inherit",
    marginTop: theme.spacing(2)
  },
  searchInput: {
    marginBottom: theme.spacing(2),
    width: "100%"
  },
  tableHeader: {
    fontWeight: "bold"
  },
  tableRow: {
    textDecoration: "none",
    "&:hover": {
      background: "#d6effb"
    },
  }
});

class DocumentManager extends Component {
  constructor() {
    super();

    this.state = {
      query: "",
      documents: "",

      loading: true,
      success: null,
      error: null,
    };
  }

  componentDidMount() {
    this.getDocuments();
  }

  async fetch(method, endpoint, body) {
    try {
      this.setState({
        loading: true
      })

      let response = await fetch(`${ API }/api${ endpoint }`, {
        method,
        body: body,
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

      this.setState({ 
        error: { message: "Couldn't talk with api. API error: " + error}
       });
    }
  }

  async getDocuments() {
    let documents = await this.fetch('get', '/documents')

    this.setState({ 
      loading: false, 
      documents: documents || [] 
    });
  }

  async deleteDocument(evt, document) {
    evt.preventDefault()

    if (window.confirm(`Are you sure you want to delete the document`)) {
      await this.fetch('delete', `/documents/${ document._id }`);

      if(!this.state.error) {
        this.setState({
          success: "Document deleted successfully"
        })
      }

      this.getDocuments();
    }
  }

  shareDocumentLink(evt, document, navigator) {
    evt.preventDefault()
    let url = window.location.origin + "/documents/" + document._id
    navigator.clipboard.writeText(url)

    this.setState({
      success: "Copied link to document to clipboard: " + url
    })
  }

  handleSearchChange = evt => {
    this.setState({ 
      query: evt.target.value 
    });
  };

  render() {
    const { classes } = this.props;

    // providing filtering of documents using query
    let that = this
    let documents = filter(this.state.documents, function(obj) {
      return obj.content_cz.toUpperCase().includes(that.state.query.toUpperCase());
    })
    
    return (
      <Fragment>
        { /* query input */ }
        <TextField
          type="text"
          key="inputQuery"
          placeholder="Search"
          label="Search"
          className={ classes.searchInput }
          value={ this.state.query }
          onChange={ this.handleSearchChange }
          variant="outlined"
          size="small"
          autoFocus 
        />

        <Typography variant="h4">Documents</Typography>
        
        {this.state.documents.length > 0 ? (
          // documents available
          <Paper elevation={ 1 } className={ classes.documentsView }>
            <TableContainer component={ Paper }>
              <Table className={ classes.table } aria-label="data table">
                <TableHead>
                  <TableRow>
                    <TableCell className={ classes.tableHeader }>Matched Psychologists</TableCell>
                    <TableCell className={ classes.tableHeader }>Extracted Keywords</TableCell>
                    <TableCell className={ classes.tableHeader }>Content</TableCell>
                    <TableCell className={ classes.tableHeader }>Updated At</TableCell>
                    <TableCell className={ classes.tableHeader }>Share</TableCell>
                    <TableCell className={ classes.tableHeader }>Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderBy(documents, ['updatedAt'], ['desc']).map(document => (
                    <TableRow key={ document._id } className={ classes.tableRow } component={ Link } to={ `/documents/${ document._id }/` }>
                      <TableCell component="th" scope="row">{ document.matched_psychologist.join(", ") }</TableCell>
                      <TableCell component="th" scope="row">{ document.keywords_en.join(", ") }</TableCell>
                      { /* Only show substring of content if it is to large */ }
                      <TableCell>
                        { document.content_en.length > MAX_LENGTH_OF_CONTENT_PREVIEW ? (
                          <div>
                              {`${ document.content_en.substring(0, MAX_LENGTH_OF_CONTENT_PREVIEW) }...` }
                          </div>
                          ) : (
                          <div>
                              { document.content_en }
                          </div>
                          ) 
                        }
                      </TableCell>
                      <TableCell>{ document.updatedAt }</TableCell>
                      <TableCell onClick={(evt) => this.shareDocumentLink(evt, document, navigator)} color="inherit">
                        <IconButton >
                          <ShareIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell onClick={(evt) => this.deleteDocument(evt, document)} color="inherit">
                        <IconButton >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Paper>
        ) : (
          // no documents available
          !this.state.loading && (
            <Typography variant="subtitle1">So far no documents have been uploaded, start uploading your first document now</Typography>
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
)(DocumentManager);