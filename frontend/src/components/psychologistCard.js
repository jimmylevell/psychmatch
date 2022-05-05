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
  Paper,
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableCell,
  TableRow
} from '@material-ui/core';
import FeedbackIcon from '@material-ui/icons/Feedback';
import LanguageIcon from '@material-ui/icons/Language';
import EditIcon from '@material-ui/icons/Edit';
import { orderBy, take } from 'lodash';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import { ModelService } from '../service';

const NUMBER_OF_MATCHES = 5; // number of matches to show

const styles = theme => ({
  tableHeader: {
    fontWeight: "bold"
  },
  tableRow: {
    textDecoration: "none",
    "&:hover": {
      background: "#d6effb"
    },
  }
})

class PsychologistCard extends Component {
  constructor() {
    super()

    this.state = {
      id: null,
      psychologist: null,
      match_score: 0.0,
      document_keywords: [],
      most_important_matches: [],

      service: null,
    }
  }

  componentDidMount() {
    this.setState({
      id: this.props.id,
      match_score: this.props.match_score,
      document_keywords: this.props.keywords,
      most_important_matches: this.props.most_important_matches.sort((a, b) => (b.score - a.score)).slice(0, NUMBER_OF_MATCHES),

      service: ModelService.getInstance(this.props.token),
    }, () => {
      this.state.service.getPsychologist(this.state.id).then(psychologist => {
        this.setState({
          psychologist: psychologist
        })
      })
    })
  }

  componentDidUpdate() {
    if(this.state.match_score !== this.props.match_score) {
      this.setState({
        match_score: this.props.match_score,
        document_keywords: this.props.keywords,
        most_important_matches: this.props.most_important_matches.sort((a, b) => (b.score - a.score)).slice(0, NUMBER_OF_MATCHES),
      })
    }
  }

  addKeywordsToPsychologist() {
    if (window.confirm(`Are you sure you want to recommend the document keywords to this psychologist?`)) {
      this.props.addKeywordsToPsychologist(this.state.id, this.state.document_keywords)
    }
  }

  render() {
    const { classes } = this.props;
    
    return (
      <Grid item xs={ 3 }>
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
              <Typography variant="body2" color="textSecondary" component="p">Best Matches </Typography>
              <TableContainer component={ Paper }>
                <Table className={ classes.table } aria-label="data table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={ classes.tableHeader }>Document</TableCell>
                      <TableCell className={ classes.tableHeader }>Psychologist</TableCell>
                      <TableCell className={ classes.tableHeader }>Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.most_important_matches.map(match => (
                      <TableRow className={ classes.tableRow }>
                        <TableCell> { match.document_keyword } </TableCell>
                        <TableCell> { match.psychologist_keyword } </TableCell>
                        <TableCell> { match.score } </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>              
            </CardContent>
            <CardActions>
              <Button size="small" component={ Link } to={ `/psychologists/${ this.state.id }/edit`} ><EditIcon/>Edit</Button>
              <Button size="small" href={ `${ this.state.psychologist.website }`} ><LanguageIcon/>External Website</Button>
              <Button onClick={ () => this.addKeywordsToPsychologist() } size="small" color="primary" ><FeedbackIcon/>Add Keywords</Button>
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