import React from 'react';
import { Card, Box, Chip, Typography, Button } from '@mui/material';

export default function EventCard({ event, onRsvp }) {
  return (
    <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Chip label={event.category || 'वार्षिक उत्सव'} color="primary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {event.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            📅 {event.date} • 📍 {event.venue}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: '#334155', maxWidth: 800 }}>
            {event.description}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => onRsvp(event.id)}
            sx={{ fontWeight: 700, px: 3 }}
          >
            उपस्थिति दर्ज करें (Going)
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
