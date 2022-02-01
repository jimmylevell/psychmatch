import React, { Component, Fragment } from 'react';
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Modal,
  Button,
  Typography
} from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 700,
  },
  modalCardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(5),
  },
  text: {
    marginTop: theme.spacing(2)
  }
});

class Help extends Component {
  constructor() {
    super()

    this.state = {
      showModal: false
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidUpdate() {
    if(this.state.showModal !== this.props.showModal) {
      this.setState({ showModal: this.props.showModal})
    }
  }
  
  handleChange() {
    let parentHandler= this.props.handleChange
    this.setState({
      showModal: !this.state.showModal
    }, parentHandler)
  }

  render() {
    const { classes } = this.props
    const APP_VERSION = process.env.REACT_APP_VERSION

    return (
      <Fragment>
      {this.state.showModal && (
        <Modal
          className={ classes.modal }
          onClose={ this.handleChange }
          open
        >
          <Card className={`${ classes.modalCard } ${ classes.marginTop }`}>
              <CardContent className={ classes.modalCardContent }>
                <Typography variant="h6">About the app</Typography>
                <Typography className={ classes.text }>Keyword-based match making of first client contact emails with possible psychologist and psychotherapist.</Typography>
                <Typography className={ classes.text }>App version: { APP_VERSION }</Typography>
              </CardContent>          
              <CardActions>
                <Button size="small" onClick={ this.handleChange }><ClearIcon/>Close</Button>
              </CardActions>
          </Card>
        </Modal>
      )}

      </Fragment>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(Help);