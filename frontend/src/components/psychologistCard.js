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
      matchedmatched_psychologist_keywords_keywords: [],
      matched_document_keywords: [],

      service: null,
    }
  }

  componentDidMount() {
    let matched_document_keywords = this.props.matched_keywords.map(keyword => {
      return keyword.document_keyword
    })

    let matched_psychologist_keywords = this.props.matched_keywords.map(keyword => {
      return keyword.psychologist_keyword
    })

    this.setState({
      id: this.props.id,
      match_score: this.props.match_score,
      matched_psychologist_keywords: [...new Set(matched_psychologist_keywords)],
      matched_document_keywords: [...new Set(matched_document_keywords)],

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
    if (window.confirm(`Are you sure you want to delete this document`)) {
      this.props.addKeywordsToPsychologist(this.state.id, this.state.matched_document_keywords)
    }
  }

  render() {
    console.log(this.state)
    const { classes } = this.props;
    
    return (
      <Grid item xs={ 2 }>
        { this.state.psychologist && (
          <Card>
            <CardHeader
              avatar={
                <Avatar aria-label="score">
                  { this.state.match_score.toFixed(2) }
                </Avatar>
              }
              title={ this.state.psychologist.name }
            />
            <CardContent>
              <Typography component="p"> Matched Psychologist Keywords: { this.state.matched_psychologist_keywords.join(", ") }</Typography>
              <Typography component="p"> Matched Document Keywords: { this.state.matched_document_keywords.join(", ") }</Typography>
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