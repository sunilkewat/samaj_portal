import React from 'react';
import { Box, Card, Typography, Button } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';

export default function MediaViewer({ media = [] }) {
  if (!media || media.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      {media.map((med, idx) => {
        // Video Player
        if (med.mediaType === 'VIDEO') {
          return (
            <Box
              key={idx}
              sx={{
                mb: 1.5,
                borderRadius: 2.5,
                overflow: 'hidden',
                bgcolor: '#000',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <video
                controls
                style={{ width: '100%', maxHeight: 440, display: 'block', outline: 'none' }}
                src={med.fileUrl}
              >
                आपका ब्राउज़र वीडियो सपोर्ट नहीं करता।
              </video>
            </Box>
          );
        }

        // PDF Document Card
        if (med.mediaType === 'DOCUMENT') {
          return (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                p: 1.5,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#f8fafc',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PdfIcon sx={{ color: '#ef4444', fontSize: 32 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {med.name || 'संलग्न समाज दस्तावेज / PDF'}
                  </Typography>
                  {med.fileSize && (
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {(med.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  )}
                </Box>
              </Box>
              <Button
                size="small"
                variant="outlined"
                href={med.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                डाउनलोड / देखें
              </Button>
            </Card>
          );
        }

        // Default Image
        return (
          <Box
            key={idx}
            component="img"
            src={med.fileUrl}
            alt="Post media"
            sx={{
              width: '100%',
              maxHeight: 480,
              objectFit: 'cover',
              borderRadius: 2.5,
              mb: 1,
              display: 'block',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            }}
          />
        );
      })}
    </Box>
  );
}
