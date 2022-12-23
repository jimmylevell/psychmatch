import React, { useEffect, useState } from 'react';
import {
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
  TableRow,
  createTheme
} from '@mui/material';
import { withStyles } from '@mui/styles';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

import { ModelService } from '../service';

const NUMBER_OF_MATCHES = 8; // number of matches to show

const theme = createTheme();

const styles = () => ({
  tableHeader: {
    fontWeight: "bold"
  },
  tableRow: {
    textDecoration: "none",
    "&:hover": {
      background: "#d6effb"
    },
  },
  largeAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(5),
  },
})

function PsychologistCard(props) {
  const { classes } = props

  const [id, setId] = useState(null);
  const [psychologist, setPsychologist] = useState(null);
  const [match_score, setMatchScore] = useState(0.0);
  const [document_keywords, setDocumentKeywords] = useState([]);
  const [most_important_matches, setMostImportantMatches] = useState([]);

  const [service, setService] = useState(ModelService.getInstance());

  useEffect(() => {
    loadData()
  }, [props.match_score, props.keywords]);

  useEffect(() => {
    console.log(id)
    service.getPsychologist(id).then(psychologist => {
      setPsychologist(psychologist);
    })

  }, [id]);

  const loadData = () => {
    let most_important_matches = []

    if (props.most_important_matches) {
      most_important_matches = props.most_important_matches.sort((a, b) => (b.score - a.score)).slice(0, NUMBER_OF_MATCHES)
    }

    setId(props.id)
    setMatchScore(props.match_score)
    setDocumentKeywords(props.keywords)
    setMostImportantMatches(most_important_matches)
  }

  const addKeywordsToPsychologist = () => {
    if (window.confirm(`Are you sure you want to recommend the document keywords to this psychologist?`)) {
      props.addKeywordsToPsychologist(id, document_keywords)
    }
  }

  return (
    <Grid item xs={3} >
      {
        psychologist && (
          <Card>
            <CardHeader
              avatar={
                <Avatar className={classes.largeAvatar} variant="rounded" aria-label="score">
                  {parseFloat(match_score).toFixed(2)}
                </Avatar>
              }
              title={psychologist.name}
            />

            <CardContent>
              <TableContainer component={Paper}>
                <Table aria-label="data table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHeader}>Document</TableCell>
                      <TableCell className={classes.tableHeader}>Psychologist</TableCell>
                      <TableCell className={classes.tableHeader}>Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {most_important_matches && (
                      most_important_matches.map(match => (
                        <TableRow className={classes.tableRow}>
                          <TableCell> {match.document_keyword} </TableCell>
                          <TableCell> {match.psychologist_keyword} </TableCell>
                          <TableCell> {match.score} </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

            <CardActions>
              <Button size="small" component={Link} to={`/psychologists/${id}/edit`} ><EditIcon />Edit</Button>
              <Button size="small" href={`${psychologist.website}`} ><LanguageIcon />Website</Button>
              <Button size="small" onClick={() => addKeywordsToPsychologist()} color="primary" ><FeedbackIcon />Recommend Keywords</Button>
            </CardActions>
          </Card>
        )
      }
    </Grid>
  )
}

export default withStyles(styles)(PsychologistCard);
