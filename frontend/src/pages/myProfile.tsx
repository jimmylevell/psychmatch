import React, { Fragment, useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Paper,
  Box,
  Button,
  createTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { ModelService, Psychologist, User } from '../service';
import PsychologistEditor from '../components/psychologistEditor';
import ErrorSnackbar from '../components/errorSnackbar';
import LoadingBar from '../components/loadingBar';
import InfoSnackbar from '../components/infoSnackbar';

const theme = createTheme();

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<Psychologist | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const service = ModelService.getInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string} | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getCurrentUser = useCallback(() => {
    service.getCurrentUser()
      .then(user => {
        setCurrentUser(user);
      })
      .catch(err => {
        console.error('Error fetching current user:', err);
      });
  }, [service]);

  const getProfile = useCallback(() => {
    service.getMyProfile()
      .then(profile => {
        setProfile(profile);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setError({ message: "Could not load your profile. Make sure your email is associated with a psychologist profile." });
      });
  }, [service]);

  useEffect(() => {
    if (ModelService.token) {
      getCurrentUser();
      getProfile();
    }
  }, [getCurrentUser, getProfile]);

  const onSaveProfile = async (id, name, email, website, keywords_cz, keywords_en, translate_keywords, proposed_keywords, image) => {
    var postData = {
      name: name,
      email: email,
      website: website,
      keywords_cz: keywords_cz,
      keywords_en: keywords_en,
      translate_keywords: translate_keywords,
      proposed_keywords: proposed_keywords,
      image: image
    };

    try {
      setLoading(true);
      await service.updateMyProfile(postData);
      setSuccess("Profile updated successfully!");
    }
    catch (error) {
      setError({ message: "Error saving profile. Response from backend: " + error });
      setLoading(false);
    }

    setLoading(false);
    getProfile();
    setEditorOpen(false);
  };

  return (
    <Fragment>
      <Typography variant="h4">My Profile</Typography>

      {currentUser && (
        <Box sx={{ marginTop: theme.spacing(2) }}>
          <Typography variant="body1">Email: {currentUser.email}</Typography>
          <Typography variant="body1">Role: {currentUser.role || 'No role assigned'}</Typography>
        </Box>
      )}

      {profile ? (
        <Paper elevation={1} sx={{ padding: theme.spacing(2), marginTop: theme.spacing(2) }}>
          <Typography variant="h6">{profile.name}</Typography>
          <Typography variant="body2">Website: {profile.website}</Typography>
          <Typography variant="body2">Email: {profile.email}</Typography>
          <Typography variant="body2">Keywords CZ: {profile.keywords_cz.join(', ')}</Typography>
          <Typography variant="body2">Keywords EN: {profile.keywords_en.join(', ')}</Typography>
          
          {profile.image && (
            <Box
              component="img"
              src={profile.image}
              alt="Profile"
              sx={{
                maxWidth: '200px',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: 1,
                marginTop: theme.spacing(2)
              }}
            />
          )}

          <Box sx={{ marginTop: theme.spacing(2) }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => setEditorOpen(true)}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>
      ) : (
        !loading && !error && (
          <Typography variant="subtitle1" sx={{ marginTop: theme.spacing(2) }}>
            No profile found. Contact an administrator to create a profile for you.
          </Typography>
        )
      )}

      {editorOpen && profile && (
        <PsychologistEditor
          psychologist={profile}
          editorMode="edit"
          errorMessage={error}
          onSave={onSaveProfile}
          onClose={() => setEditorOpen(false)}
        />
      )}

      {loading && <LoadingBar />}

      {error && (
        <ErrorSnackbar
          onClose={() => setError(null)}
          message={error.message}
        />
      )}

      {success && (
        <InfoSnackbar
          onClose={() => setSuccess(null)}
          message={success}
        />
      )}
    </Fragment>
  );
};

export default MyProfile;
