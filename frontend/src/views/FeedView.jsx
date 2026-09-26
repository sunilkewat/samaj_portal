import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Campaign as NoticeIcon,
  YouTube as YouTubeIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import PostCard from '../components/feed/PostCard';
import CreatePostDialog from '../components/feed/CreatePostDialog';
import { useAuth } from '../context/AuthContext';

export default function FeedView({
  posts,
  isLoading,
  onToggleLike,
  onPostCreated,
  onNotification,
}) {
  const { currentUser, isLoggedIn, openAuth } = useAuth();
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const handleOpenCreatePost = () => {
    if (!isLoggedIn) {
      openAuth('login');
      if (onNotification) onNotification('नया संदेश पोस्ट करने के लिए कृपया पहले लॉगिन करें! 🔐');
      return;
    }
    setCreatePostOpen(true);
  };

  return (
    <Box>
      {/* Feed Header & Action */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            समाज समाचार व सामाजिक फीड
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            स्वजातीय बंधुओं के विचार, मीडिया, वीडियो व महत्वपूर्ण सूचनाएं
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<NoticeIcon />}
          onClick={handleOpenCreatePost}
          sx={{
            bgcolor: '#ea580c',
            '&:hover': { bgcolor: '#c2410c' },
            px: 3,
            py: 1.2,
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(234,88,12,0.3)',
          }}
        >
          नया संदेश पोस्ट करें (Create Post)
        </Button>
      </Box>

      {/* Quick Share Box (For Logged in User) */}
      {isLoggedIn && currentUser && (
        <Card sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#ea580c', fontWeight: 700 }}>
              {currentUser?.name ? currentUser.name[0] : 'U'}
            </Avatar>
            <Box
              onClick={handleOpenCreatePost}
              sx={{
                flex: 1,
                bgcolor: '#f1f5f9',
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                color: '#64748b',
                '&:hover': { bgcolor: '#e2e8f0' },
                transition: 'all 0.2s',
              }}
            >
              {currentUser?.name || 'सदस्य'}, समाज के साथ कोई विचार, फोटो, वीडियो या YouTube लिंक साझा करें...
            </Box>
            <Button
              variant="text"
              color="error"
              startIcon={<YouTubeIcon />}
              onClick={handleOpenCreatePost}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              YouTube
            </Button>
            <Button
              variant="text"
              color="primary"
              startIcon={<ImageIcon />}
              onClick={handleOpenCreatePost}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              मीडिया
            </Button>
          </Box>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Posts Grid */}
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <PostCard
              post={post}
              onToggleLike={onToggleLike}
              onNotification={onNotification}
            />
          </Grid>
        ))}
      </Grid>

      {/* Create Post Dialog Component */}
      <CreatePostDialog
        open={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        onPostCreated={onPostCreated}
        onNotification={onNotification}
      />
    </Box>
  );
}
