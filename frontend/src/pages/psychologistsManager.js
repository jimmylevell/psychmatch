import React, { Component, Fragment } from 'react';
import { withRouter, Route, Redirect, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Fab,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField
} from '@material-ui/core';
import { Delete as DeleteIcon, Create as CreateIcon, Add as AddIcon } from '@material-ui/icons';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import moment from 'moment';
import { orderBy, filter } from 'lodash';
import { compose } from 'recompose';

import PsychologistEditor from '../components/psychologistEditor';
import ErrorSnackbar from '../components/errorSnackbar';
import LoadingBar from '../components/loadingBar'
import InfoSnackbar from '../components/infoSnackbar'

const API = process.env.REACT_APP_BACKEND_URL;

const styles = theme => ({
  psychologistsDiv: {
    marginTop: theme.spacing(2),
    outline: 0,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    }
  },
  serachDiv: {
    marginBottom: theme.spacing(1)
  },
  searchInput: {
    width: "100%",
  }
});

class PsychologistManager extends Component {
  constructor() {
    super();

    this.state = {
      query: "",
      psychologists: [],

      success: null,
      loading: false,
      error: null,
    };
  }

  componentDidMount() {    
    this.getPsychologists();
  }

  async fetch(method, endpoint, body) {
    this.setState({loading: true})

    try {
      const response = await fetch(`${ API }/api${ endpoint }`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });

      this.setState({ loading: false })

      if(response.ok && (response.status === 201 || response.status === 200)) {
        return await response.json();
      } else {
        console.error(response.status)
        this.setState({
          error: { message: "Error when communicating with backend: " + response.statusText }
        })
      }
    } catch (error) {
      console.error(error);

      this.setState({ 
        error: error,
        loading: false 
      });
    }
  }

  getPsychologists() {
    this.fetch('get', '/psychologists')
      .then(psychologists => {
        this.setState({
            psychologists: psychologists.psychologists || [] 
        })
    })   
  }

  onSavePsychologist  = async (id, name, website, keywords_cz, keywords_en) => {
    var postData = {
      name: name,
      website: website,
      keywords_cz: keywords_cz,
      keywords_en: keywords_en
    }

    if (id) {
      await this.fetch('put', `/psychologists/${ id }`, postData);
    } else {
      await this.fetch('post', '/psychologists', postData);
    }

    this.getPsychologists();

    if(this.state.error === null) {
      this.props.history.goBack();      
    }
  }

  async deletePsychologist(psychologist) {
    if (window.confirm(`Are you sure you want to delete "${ psychologist.name }"`)) {
      await this.fetch('delete', `/psychologists/${ psychologist._id }`);

      if(this.state.error === null) {
        this.setState({
          success: "Psychologist successfully deleted"
        })
      }

      this.getPsychologists();
    }
  }

  handleSearchChange = evt => {
    this.setState({ 
      query: evt.target.value 
    });
  };

  renderPsychologistEditor = ({ match }) => {
    let id = match.params.id
    let psychologist = this.state.psychologists.find( ({ _id}) => _id === id )

    if ((!psychologist && match.path.includes("copy")) || (!psychologist && id !== 'new')) {
      return <Redirect to="/psychologists" />
    }

    // reset psychologist id if copying psychologist
    // create new object
    if(match.path.includes("copy")) {
      psychologist = Object.create(psychologist)
      psychologist._id = null
      psychologist.name = psychologist.name + " (Copy)"
    }

    return (
      <PsychologistEditor 
        psychologist={ psychologist } 
        errorMessage={ this.state.error } 
        onSave={ this.onSavePsychologist } 
      />
    )
  };

  render() {
    const { classes } = this.props;
    const that = this
    let psychologists = filter(this.state.psychologists, function(obj) {
      if(obj.name) {
        return obj.name.toUpperCase().includes(that.state.query.toUpperCase());
      } else {
        return false;
      }
    })

    return (
      <Fragment>
        <Typography variant="h4">Psychologists</Typography>

        { /* psychologists area */ }
        { this.state.psychologists.length > 0 ? (
          // psychologist available
          <Paper elevation={ 1 } className={ classes.psychologistsDiv }>
            <div className={ classes.serachDiv }>
              <TextField
                required 
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
            </div>

            <List>
              {orderBy(psychologists, ['updatedAt', 'name'], ['desc', 'asc']).map(psychologist => (
                <ListItem key={ psychologist._id }>
                  <ListItemText
                    primary={ psychologist.name }
                    secondary={ psychologist.updatedAt && `Updated ${ moment(psychologist.updatedAt).fromNow() }` }
                  />
                    <ListItemSecondaryAction>
                      <IconButton component={ Link } to={ `/psychologists/${ psychologist._id }/copy` } color="inherit">
                        <FileCopyIcon />
                      </IconButton>
                      <IconButton component={ Link } to={ `/psychologists/${ psychologist._id }/edit` } color="inherit">
                        <CreateIcon />
                      </IconButton>
                      <IconButton onClick={ () => this.deletePsychologist(psychologist) } color="inherit">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
              ))}

              { /* must be placed here so that the state is correctly loaded */}
              <Route exact path="/psychologists/:id/edit" render={ this.renderPsychologistEditor } />
              <Route exact path="/psychologists/:id/copy" render={ this.renderPsychologistEditor } />
            </List>
          </Paper>

          
        ) : (
          // no psychologists available
          !this.state.loading && (
            <Typography variant="subtitle1">So far no psychologists have been created</Typography>
          )
        )}
        
        <Fragment>
            <Fab
                color="secondary"
                aria-label="add"
                className={ classes.fab }
                component={ Link }
                to="/psychologists/new"
            >
                <AddIcon />
            </Fab>
            
            <Route exact path="/psychologists/:id" render={ this.renderPsychologistEditor } />
        </Fragment>
        
        { /* Flag based display of loadingbar */ }
        { this.state.loading && (
          <LoadingBar/>
        )}    
        
        { /* Flag based display of error snackbar */ }
        { this.state.error && (
          <ErrorSnackbar
            onClose={ () => this.setState({ error: null }) }
            message={ this.state.error.message }
          />
        )}

        { /* Flag based display of info snackbar */ }
        { this.state.success && (
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
)(PsychologistManager);