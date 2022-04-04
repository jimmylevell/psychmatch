import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  withStyles,
} from '@material-ui/core';
import { compose } from 'recompose';
import FeedbackIcon from '@material-ui/icons/Feedback';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { AuthenticatedTemplate, } from "@azure/msal-react";

import Help from './help'

const styles = theme => ({
  header: {
    backgroundColor: "#82B282",
  },
  text: {
    fontSize: '4.5em',
    color: '#f50057',
  },
  headerButton: {
    position: 'fixed',
    top: theme.spacing(-0.5),
    right: theme.spacing(),
    color: '#f50057',
    [theme.breakpoints.down('xs')]: {
      top: theme.spacing(-1),
      right: theme.spacing(0),
    }
  },
  link: {
    fontSize: '1.5em',
    color: 'white',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textDecoration: 'none'
  },
  displayName: {
    marginRight: theme.spacing(10)
  },
  helpIcon: {
    fontSize: '4.5em',
    color: 'white',
  }
})

class AppHeader extends Component {
  constructor() {
    super()

    this.state = {
      showHelp: false
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange() {
    this.setState({
      showHelp: !this.state.showHelp
    })
  }

  render() {
    const { classes } = this.props;
    
    
    return (
      <AppBar position="static" className={ classes.header }>
        <Toolbar className={ classes.toolBar }>
          <AuthenticatedTemplate>
            <Button color="inherit" component={ Link } to="/">
              <FeedbackIcon/>
              <Typography variant="h6" color="inherit">
                Psychmatch 
              </Typography>
            </Button>

            {/* link collection */}
            <Box display='flex' flexGrow={ 1 }>
                {/* whatever is on the left side */}
              <Link className={ classes.link } to="/upload">Upload</Link>
              <Link className={ classes.link } to="/documents">Documents</Link>
              <Link className={ classes.link } to="/psychologists">Psychologists</Link>
            </Box>
          </AuthenticatedTemplate>
        </Toolbar>       

        <Button 
          onClick={ this.handleChange }
          className={ classes.headerButton }
        >
          <HelpOutlineIcon 
            color="secondary"
            aria-label="add"
            className={ classes.helpIcon }
          />
        </Button>
        <Help handleChange={ this.handleChange } showModal={ this.state.showHelp }/>
      </AppBar>
    )
  }
}

export default compose(
  withStyles(styles),
)(AppHeader);