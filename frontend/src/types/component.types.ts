import { Psychologist } from './psychologist.types';
import { Match } from './common.types';
import { IMsalContext } from "@azure/msal-react";

export interface PsychologistEditorProps {
  classes?: any;
  psychologist: Psychologist | null;
  editorMode: string;
  readOnlyEmail?: boolean;
  onClose: () => void;
  onSave: (
    id: string | null,
    name: string,
    email: string,
    website: string,
    keywords_cz: string[],
    keywords_en: string[],
    translate_keywords: boolean,
    proposed_keywords: string[],
    image?: string
  ) => void;
}

export interface PsychologistCardProps {
  id: string;
  match_score: number;
  keywords: string[];
  most_important_matches: Match[];
  addKeywordsToPsychologist: (id: string, keywords: string[]) => void;
}

export interface ErrorSnackbarProps {
  id?: string;
  message: string;
  onClose: () => void;
}

export interface InfoSnackbarProps {
  id?: string;
  message: string;
  onClose: () => void;
}

export interface HelpProps {
  showModal: boolean;
  handleChange: () => void;
}

export interface LoginProps {
  msalContext: IMsalContext;
  tokenUpdated: (token: string | null) => void;
}


