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
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

const styles = theme => ({
})

class PsychologistCard extends Component {
  constructor() {
    super()

    this.state = {
      psychologist: null
    }
  }

  componentDidMount() {
      this.setState({
        psychologist: this.props.psychologist
      })
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
                  { this.state.psychologist.matched_score }
                </Avatar>
              }
              title={ this.state.psychologist.name }
            />
            <CardContent>
              <Typography component="p"> Matched Keywords: { this.state.psychologist.matched_keywords.join(", ") }</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={ Link } to={ `/psychologists/${ this.state.psychologist._id }/`} >Edit</Button>
              <Button size="small" component={ Link } to={ `${ this.state.psychologist.website }`} >External Website</Button>
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