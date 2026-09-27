import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export default function AuthDialog({ onNotification }) {
  const { authModalOpen, closeAuth, authMode, setAuthMode, login, register, isAuthLoading } = useAuth();
  const { tenant, tenantData } = useTenant();

  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [password, setPassword] = useState('Admin@123456');
  const [fullName, setFullName] = useState('सुनील केवट');
  const [gotra, setGotra] = useState(tenant?.gotras?.[0] || 'कश्यप');
  const [city, setCity] = useState('Indore');
  const [authError, setAuthError] = useState('');

  const handleSubmit = async () => {
    setAuthError('');
    try {
      if (authMode === 'login') {
        const res = await login(mobileNumber, password);
        if (res && res.success) {
          if (onNotification) onNotification(`स्वागत है, ${res.user.name}! आप सफलतापूर्वक लॉगिन हो गए हैं। 🎉`);
        }
      } else {
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || 'सदस्य';
        const lastName = nameParts.slice(1).join(' ') || 'केवट';
        const res = await register({
          mobileNumber,
          password,
          firstName,
          lastName,
          gender: 'OTHER',
          city: city || 'Indore',
          state: 'MP',
          samajGotra: gotra || 'कश्यप',
        });
        if (res && res.success) {
          if (onNotification) onNotification(`सफलतापूर्वक पंजीकरण हो गया! स्वागत है, ${res.user.name}। 🎉`);
        }
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || err.message || 'लॉगिन विफल रहा, कृपया विवरण जांचें।');
    }
  };

  const handleQuickLogin = async (mobile, pass, name) => {
    setMobileNumber(mobile);
    setPassword(pass);
    setAuthError('');
    try {
      const res = await login(mobile, pass);
      if (res && res.success) {
        if (onNotification) onNotification(`स्वागत है, ${res.user.name}! आप सफलतापूर्वक लॉगिन हो गए हैं। 🚀`);
      }
    } catch (e) {
      setAuthError('त्वरित लॉगिन में समस्या आई: ' + (e.response?.data?.message || e.message));
    }
  };

  return (
    <Dialog open={authModalOpen} onClose={closeAuth} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {authMode === 'login' ? `🔐 ${tenant.shortName} लॉगिन` : `✨ ${tenant.shortName} • नया पंजीकरण`}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField
          fullWidth
          label="मोबाइल नंबर (Mobile Number)"
          placeholder="9876543210"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <TextField
          fullWidth
          label="पासवर्ड (Password)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {authMode === 'register' && (
          <>
            <TextField
              fullWidth
              label="पूरा नाम (Full Name)"
              placeholder={`उदा. सुनील ${tenant.shortName.replace(' समाज', '')}`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              fullWidth
              select
              label="गोत्र (Gotra) - समाज अनुसार"
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
            >
              {(tenant?.gotras || ['कश्यप']).map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="शहर (City)"
              placeholder="उदा. इंदौर"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </>
        )}

        {authError && (
          <Alert severity="error" sx={{ py: 0.5, fontSize: '0.85rem' }}>
            {authError}
          </Alert>
        )}

        {/* Quick Demo Profiles Scoped to Active Samaj */}
        <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
            ⚡ {tenant.shortName} • त्वरित लॉगिन प्रोफाइल:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {(tenantData?.testUsers || []).map((u, idx) => (
              <Button
                key={u.mobile}
                size="small"
                variant="outlined"
                onClick={() => handleQuickLogin(u.mobile, u.pass || 'Admin@123456', u.name.split(' (')[0])}
                sx={{
                  fontSize: '0.75rem',
                  py: 0.5,
                  fontWeight: 700,
                  borderColor: idx === 0 ? tenant.primaryColor : '#cbd5e1',
                  color: idx === 0 ? tenant.primaryColor : '#334155',
                }}
              >
                👤 {u.name}
              </Button>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button
          size="small"
          onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          disabled={isAuthLoading}
        >
          {authMode === 'login' ? 'नया खाता बनाएं?' : 'पहले से खाता है? लॉगिन करें'}
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={closeAuth} disabled={isAuthLoading}>
            रद्द
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isAuthLoading}
            startIcon={isAuthLoading && <CircularProgress size={16} color="inherit" />}
            sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' }, fontWeight: 700 }}
          >
            {authMode === 'login' ? 'लॉगिन करें' : 'पंजीकरण पूर्ण करें'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
