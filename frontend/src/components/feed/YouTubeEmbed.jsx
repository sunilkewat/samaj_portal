import React from 'react';
import { Box, Alert, Button } from '@mui/material';
import { YouTube as YouTubeIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { getYouTubeEmbedUrl } from '../../utils/youtube.util';

export default function YouTubeEmbed({ youtubeUrl, title = 'YouTube Video' }) {
  if (!youtubeUrl) return null;

  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  if (!embedUrl) {
    return (
      <Alert
        severity="info"
        icon={<YouTubeIcon color="error" />}
        action={
          <Button
            color="inherit"
            size="small"
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
          >
            खोलें
          </Button>
        }
        sx={{ mb: 2, borderRadius: 2 }}
      >
        YouTube वीडियो लिंक: {youtubeUrl}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        mb: 2,
        position: 'relative',
        paddingBottom: '56.25%', // 16:9 aspect ratio
        height: 0,
        overflow: 'hidden',
        borderRadius: 2.5,
        bgcolor: '#000',
        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
      }}
    >
      <iframe
        src={embedUrl}
        title={title}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Box>
  );
}
