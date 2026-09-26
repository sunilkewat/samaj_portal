import React from 'react';
import { Card, Box, Avatar, Typography, Chip, Button } from '@mui/material';
import { Verified as VerifiedIcon, Phone as PhoneIcon, Chat as ChatIcon } from '@mui/icons-material';

export default function MemberCard({ member, onStartChat }) {
  return (
    <Card sx={{ p: 2, height: '100%', borderRadius: 2.5, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Avatar sx={{ bgcolor: '#1e293b', width: 48, height: 48, fontWeight: 700 }}>
          {member.name[0]}
        </Avatar>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {member.name}
            </Typography>
            {member.verified && <VerifiedIcon color="primary" sx={{ fontSize: 18 }} />}
          </Box>
          <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 600 }}>
            गोत्र: {member.gotra}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
        📍 {member.city}, {member.state}
      </Typography>
      <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
        💼 {member.occupation}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 1.5, gap: 1, flexWrap: 'wrap' }}>
        <Chip label={`रक्त: ${member.bloodGroup}`} size="small" color="error" variant="outlined" sx={{ fontWeight: 600 }} />
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onStartChat && (
            <Button
              size="small"
              variant="contained"
              startIcon={<ChatIcon sx={{ fontSize: '15px !important' }} />}
              onClick={() => onStartChat(member)}
              sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' }, fontWeight: 700, fontSize: '0.75rem', px: 1.5 }}
            >
              चैट करें
            </Button>
          )}
          <Button size="small" variant="outlined" href={`tel:${member.phone}`} startIcon={<PhoneIcon sx={{ fontSize: '15px !important' }} />} sx={{ fontSize: '0.75rem' }}>
            कॉल
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
