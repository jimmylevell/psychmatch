import React, { useEffect, useState, useCallback } from 'react';
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
  Box,
  createTheme
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

import { ModelService, Match, Psychologist } from '../service';

const NUMBER_OF_MATCHES = 8; // number of matches to show

const theme = createTheme();

interface PsychologistCardProps {
  id: string;
  match_score: number;
  keywords: string[];
  most_important_matches: Match[];
  addKeywordsToPsychologist: (id: string, keywords: string[]) => void;
}

const PsychologistCard: React.FC<PsychologistCardProps> = (props) => {
  const [id, setId] = useState<string | null>(null);
  const [psychologist, setPsychologist] = useState<Psychologist | null>(null);
  const [match_score, setMatchScore] = useState<number>(0.0);
  const [document_keywords, setDocumentKeywords] = useState<string[]>([]);
  const [most_important_matches, setMostImportantMatches] = useState<Match[]>([]);

  const service = ModelService.getInstance();

  const loadData = useCallback(() => {
    let most_important_matches_data: Match[] = []

    if (props.most_important_matches) {
      most_important_matches_data = props.most_important_matches.sort((a, b) => (b.score - a.score)).slice(0, NUMBER_OF_MATCHES)
    }

    setId(props.id)
    setMatchScore(props.match_score)
    setDocumentKeywords(props.keywords)
    setMostImportantMatches(most_important_matches_data)
  }, [props.id, props.match_score, props.keywords, props.most_important_matches]);

  useEffect(() => {
    loadData()
  }, [loadData]);

  useEffect(() => {
    if (id) {
      console.log(id)
      service.getPsychologist(id).then(psychologist => {
        setPsychologist(psychologist);
      })
    }
  }, [id, service]);

  const addKeywordsToPsychologist = () => {
    if (id && window.confirm(`Are you sure you want to recommend the document keywords to this psychologist?`)) {
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
                psychologist.image ? (
                  <Box
                    component="img"
                    src={psychologist.image}
                    alt={psychologist.name}
                    sx={{
                      width: theme.spacing(7),
                      height: theme.spacing(7),
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                ) : (
                  <Avatar sx={{
                    width: theme.spacing(7),
                    height: theme.spacing(5),
                  }} variant="rounded" aria-label="score">
                    {parseFloat(match_score.toString()).toFixed(2)}
                  </Avatar>
                )
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
                      most_important_matches.map((match, index) => (
                        <TableRow key={index} sx={{
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
              <Button size="small" href={`${psychologist.website}`} target="_blank" rel="noopener noreferrer"><LanguageIcon />Website</Button>
              <Button size="small" onClick={() => addKeywordsToPsychologist()} color="primary" ><FeedbackIcon />Recommend Keywords</Button>
            </CardActions>
          </Card>
        )
      }
    </Grid>
  )
}

export default PsychologistCard;
