import React, { Component } from 'react';
import {
  Typography,
  withStyles,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Avatar,
  CardActions,
  Button,
} from '@material-ui/core';
import FeedbackIcon from '@material-ui/icons/Feedback';
import LanguageIcon from '@material-ui/icons/Language';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import { ModelService } from '../service';

const styles = theme => ({
})

class PsychologistCard extends Component {
  constructor() {
    super()

    this.state = {
      id: null,
      psychologist: null,
      match_score: 0.0,
      document_keywords: [],

      service: null,
    }
  }

  componentDidMount() {
    this.setState({
      id: this.props.id,
      match_score: this.props.match_score,
      document_keywords: this.props.keywords,

      service: ModelService.getInstance(this.props.token),
    }, () => {
      this.state.service.getPsychologist(this.state.id).then(psychologist => {
        this.setState({
          psychologist: psychologist
        })
      })
    })
  }

  addKeywordsToPsychologist() {
    if (window.confirm(`Are you sure you want to recommend the document keywords to this psychologist?`)) {
      this.props.addKeywordsToPsychologist(this.state.id, this.state.document_keywords)
    }
  }

  render() {
    const { classes } = this.props;
    
    return (
      <Grid item xs={ 2 }>
        { this.state.psychologist && (
          <Card>
            <CardHeader
              avatar={
                <Avatar aria-label="score">
                  { parseFloat(this.state.match_score).toFixed(2) }
                </Avatar>
              }
              title={ this.state.psychologist.name }
            />
            <CardContent>
              
            </CardContent>
            <CardActions>
              <Button size="small" component={ Link } to={ `/psychologists/${ this.state.id }/edit`} ><EditIcon/>Edit</Button>
              <Button size="small" href={ `${ this.state.psychologist.website }`} ><LanguageIcon/>External Website</Button>
              <Button onClick={ () => this.addKeywordsToPsychologist() } size="small" color="primary" ><FeedbackIcon/>Save</Button>
            </CardActions>
          </Card>
        )}
      </Grid>
    )
  }
}

export default compose(
  withStyles(styles),
)(PsychologistCard);