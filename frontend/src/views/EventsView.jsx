import React from 'react';
import { Box, Typography } from '@mui/material';
import EventCard from '../components/events/EventCard';

export default function EventsView({ events = [], onNotification }) {
  const handleRsvp = (id) => {
    if (onNotification) {
      onNotification('कार्यक्रम में आपकी उपस्थिति (RSVP) दर्ज कर ली गई है! 🎉');
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        आगामी सामाजिक कार्यक्रम व सम्मेलन
      </Typography>

      {events.map((event) => (
        <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
      ))}
    </Box>
  );
}
