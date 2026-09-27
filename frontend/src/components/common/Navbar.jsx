import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import SamajSwitcher from './SamajSwitcher';

export default function Navbar({ apiStatus }) {
  const { currentUser, openAuth, logout } = useAuth();
  const { tenant } = useTenant();

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#0f172a', borderBottom: `3px solid ${tenant.primaryColor}` }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 0.5 }}>
          {/* Logo & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" component="span" sx={{ fontSize: '2rem' }}>
              {tenant.ishtadevIcon}
            </Typography>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>
                {tenant.shortName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#fdba74', fontWeight: 500, letterSpacing: 0.5 }}>
                {tenant.englishName} • {tenant.tagline}
              </Typography>
            </Box>
          </Box>

          {/* Right Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Multi-Tenant Samaj Switcher (Demo / White-label Selector) */}
            <SamajSwitcher />

            <Chip
              label={apiStatus === 'online' ? 'Cloud API Live 🟢' : 'Connecting API...'}
              size="small"
              sx={{
                bgcolor: apiStatus === 'online' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 88, 12, 0.15)',
                color: apiStatus === 'online' ? '#4ade80' : '#fdba74',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.1)',
                display: { xs: 'none', md: 'inline-flex' },
              }}
            />

            {currentUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: '#ea580c', color: '#fff', fontWeight: 700 }}>
                      {currentUser?.name ? currentUser.name[0] : 'U'}
                    </Avatar>
                  }
                  label={currentUser?.name || 'सदस्य'}
                  variant="outlined"
                  sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontWeight: 600 }}
                />
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<LogoutIcon />}
                  onClick={logout}
                  sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#cbd5e1' }}
                >
                  लॉगआउट
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<LoginIcon />}
                  onClick={() => openAuth('login')}
                  sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                >
                  लॉगिन
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<RegisterIcon />}
                  onClick={() => openAuth('register')}
                >
                  पंजीकरण
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
