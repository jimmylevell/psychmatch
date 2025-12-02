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
import FeedbackIcon from '@mui/icons-material/Feedback';
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

import { ModelService } from '../service';

const NUMBER_OF_MATCHES = 8; // number of matches to show

const theme = createTheme();

function PsychologistCard(props) {
  const [id, setId] = useState(null);
  const [psychologist, setPsychologist] = useState(null);
  const [match_score, setMatchScore] = useState(0.0);
  const [document_keywords, setDocumentKeywords] = useState([]);
  const [most_important_matches, setMostImportantMatches] = useState([]);

  const service = ModelService.getInstance();

  const loadData = () => {
    let most_important_matches_data = []

    if (props.most_important_matches) {
      most_important_matches_data = props.most_important_matches.sort((a, b) => (b.score - a.score)).slice(0, NUMBER_OF_MATCHES)
    }

    setId(props.id)
    setMatchScore(props.match_score)
    setDocumentKeywords(props.keywords)
    setMostImportantMatches(most_important_matches_data)
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match_score, props.keywords, props.most_important_matches, props.id]);

  useEffect(() => {
    if (id) {
      console.log(id)
      service.getPsychologist(id).then(psychologist => {
        setPsychologist(psychologist);
      })
    }
  }, [id, service]);

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
                <Avatar sx={{
                  width: theme.spacing(7),
                  height: theme.spacing(5),
                }} variant="rounded" aria-label="score">
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
                      <TableCell sx={{
                        fontWeight: "bold"
                      }} >Document</TableCell>
                      <TableCell sx={{
                        fontWeight: "bold"
                      }} >Psychologist</TableCell>
                      <TableCell sx={{
                        fontWeight: "bold"
                      }} >Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {most_important_matches && (
                      most_important_matches.map(match => (
                        <TableRow sx={{
                          textDecoration: "none",
                          "&:hover": {
                            background: "#d6effb"
                          },
                        }}>
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

export default PsychologistCard;
