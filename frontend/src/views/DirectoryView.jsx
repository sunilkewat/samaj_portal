import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import MemberCard from '../components/directory/MemberCard';

export default function DirectoryView({ members = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [bloodFilter, setBloodFilter] = useState('ALL');

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.gotra && m.gotra.includes(searchQuery));
    const matchesCity = cityFilter === 'ALL' || m.city === cityFilter;
    const matchesBlood = bloodFilter === 'ALL' || m.bloodGroup === bloodFilter;
    return matchesSearch && matchesCity && matchesBlood;
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
          समाज सदस्य निर्देशिका (Directory)
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="नाम या गोत्र से खोजें (Search by Name or Gotra)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              label="शहर (City)"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <MenuItem value="ALL">सभी शहर (All Cities)</MenuItem>
              <MenuItem value="Indore">Indore</MenuItem>
              <MenuItem value="Bhopal">Bhopal</MenuItem>
              <MenuItem value="Jabalpur">Jabalpur</MenuItem>
              <MenuItem value="Mumbai">Mumbai</MenuItem>
              <MenuItem value="Delhi">Delhi</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              select
              fullWidth
              label="रक्त समूह (Blood Group)"
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
            >
              <MenuItem value="ALL">सभी ग्रुप (All)</MenuItem>
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        {filteredMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <MemberCard member={member} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
