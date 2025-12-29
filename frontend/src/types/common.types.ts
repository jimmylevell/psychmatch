export interface Match {
  document_keyword: string;
  psychologist_keyword: string;
  score: number;
}

export interface MatchedPsychologist {
  psychologist: string;
  score: number;
  most_important_matches: Match[];
}

export interface ErrorState {
  message: string;
}

export interface SuccessState {
  success: string;
}
