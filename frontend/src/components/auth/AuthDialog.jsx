import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function AuthDialog({ onNotification }) {
  const { authModalOpen, closeAuth, authMode, setAuthMode, login, isAuthLoading } = useAuth();

  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [password, setPassword] = useState('Admin@123456');
  const [fullName, setFullName] = useState('सुनील केवट');
  const [gotra, setGotra] = useState('कश्यप');
  const [city, setCity] = useState('Indore');

  const handleSubmit = async () => {
    const fallbackUser = {
      id: 'af0e2307-527b-4ff2-827b-3767f68fb979',
      mobileNumber,
      name: authMode === 'register' ? fullName : 'सुनील केवट (Sunil Kewat)',
      gotra,
      city,
    };

    const res = await login(mobileNumber, password, fallbackUser);
    if (res && res.success) {
      if (onNotification) {
        onNotification(`स्वागत है, ${res.user.name}! आप सफलतापूर्वक लॉगिन हो गए हैं। 🎉`);
      }
    }
  };

  return (
    <Dialog open={authModalOpen} onClose={closeAuth} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {authMode === 'login' ? 'समाज पोर्टल लॉगिन' : 'नया सदस्य पंजीकरण'}
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
              placeholder="उदा. सुनील केवट"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              fullWidth
              label="गोत्र (Gotra)"
              placeholder="उदा. कश्यप"
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
            />
            <TextField
              fullWidth
              label="शहर (City)"
              placeholder="उदा. इंदौर"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </>
        )}

        {/* Quick Demo Hint */}
        <Alert severity="info" sx={{ py: 0.5, fontSize: '0.82rem' }}>
          💡 <strong>त्वरित डेमो:</strong> मोबाइल <code>9876543210</code> एवं पासवर्ड <code>Admin@123456</code> या सीधे 'लॉगिन करें' दबाएं।
        </Alert>
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
