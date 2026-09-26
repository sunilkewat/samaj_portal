import React from 'react';
import { Box, Card, Typography, Button, Alert } from '@mui/material';
import { Refresh as RefreshIcon, RestartAlt as ResetIcon } from '@mui/icons-material';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f8fafc',
            p: 3,
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: '100%',
              p: 4,
              borderRadius: 4,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <Typography variant="h2" sx={{ mb: 1 }}>🏛️</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              समाज पोर्टल लोड करने में समस्या आई
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              पुराने कैशे या अमान्य डेटा के कारण यह समस्या हो सकती है। नीचे दिए गए बटन से डेटा रीसेट करके पुनः लोड करें।
            </Typography>

            {this.state.error && (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left', borderRadius: 2 }}>
                <strong>त्रुटि विवरण:</strong> {this.state.error?.toString()}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ResetIcon />}
                onClick={this.handleResetAndReload}
                sx={{
                  bgcolor: '#ea580c',
                  '&:hover': { bgcolor: '#c2410c' },
                  fontWeight: 700,
                  px: 3,
                }}
              >
                कैशे रीसेट व पुनः लोड (Reset & Reload)
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
                sx={{ fontWeight: 600 }}
              >
                सामान्य रीलोड (Reload)
              </Button>
            </Box>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}
