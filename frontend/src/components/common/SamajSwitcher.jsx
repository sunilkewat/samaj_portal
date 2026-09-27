import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
} from '@mui/material';
import {
  SwapHoriz as SwitchIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useTenant } from '../../context/TenantContext';

export default function SamajSwitcher() {
  const { tenant, activeSlug, switchTenant, allTenants } = useTenant();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (slug) => {
    switchTenant(slug);
    handleClose();
  };

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Button
        size="small"
        onClick={handleClick}
        startIcon={<span style={{ fontSize: '1.1rem' }}>{tenant.ishtadevIcon}</span>}
        endIcon={<SwitchIcon sx={{ fontSize: '16px !important', opacity: 0.8 }} />}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.12)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.78rem',
          px: 1.5,
          py: 0.6,
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.25)',
          textTransform: 'none',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            borderColor: '#ffffff',
          },
        }}
      >
        <Box sx={{ textAlign: 'left', mr: 0.5 }}>
          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.62rem', color: '#fed7aa', lineHeight: 1 }}>
            सक्रिय समाज (SaaS Tenant)
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1.1 }}>
            {tenant.shortName}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 260,
            borderRadius: 3,
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.18)',
            border: '1px solid #e2e8f0',
            p: 1,
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid #f1f5f9', mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
            🏛️ समाज पोर्टल SaaS डेमो चयन
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            किसी भी समाज पर क्लिक करके 1-सेकंड में पोर्टल बदलें
          </Typography>
        </Box>

        {allTenants.map((t) => {
          const isSelected = t.slug === activeSlug;
          return (
            <MenuItem
              key={t.slug}
              onClick={() => handleSelect(t.slug)}
              sx={{
                borderRadius: 2,
                my: 0.5,
                px: 1.5,
                py: 1,
                bgcolor: isSelected ? 'rgba(234, 88, 12, 0.08)' : 'transparent',
                borderLeft: isSelected ? `4px solid ${t.primaryColor}` : '4px solid transparent',
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, fontSize: '1.3rem' }}>
                {t.ishtadevIcon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      {t.shortName}
                    </Typography>
                    {isSelected && <CheckIcon sx={{ fontSize: 18, color: t.primaryColor }} />}
                  </Box>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    आराध्य: {t.ishtadev}
                  </Typography>
                }
              />
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
