import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import YouTubeEmbed from './YouTubeEmbed';
import MediaViewer from './MediaViewer';
import { useAuth } from '../../context/AuthContext';

export default function PostCard({ post, onToggleLike, onNotification }) {
  const { isLoggedIn, openAuth } = useAuth();

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      openAuth('login');
      if (onNotification) onNotification('कृपया लाइक करने के लिए पहले लॉगिन करें! 🔐');
      return;
    }
    onToggleLike(post.id);
  };

  const handleShareClick = () => {
    const shareText = `${post.content || ''}\n\nसमाज पोर्टल: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: 'समाज पोर्टल संदेश', text: shareText, url: window.location.href });
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.08)' },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Post Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              src={post.authorPhoto || undefined}
              sx={{ bgcolor: '#ea580c', fontWeight: 700, width: 46, height: 46 }}
            >
              {post.author ? post.author[0] : 'के'}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {post.author}
                </Typography>
                {post.authorGotra && (
                  <Chip
                    label={`गोत्र: ${post.authorGotra}`}
                    size="small"
                    sx={{ bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700, fontSize: '0.72rem', height: 20 }}
                  />
                )}
                {post.authorCity && (
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    • {post.authorCity}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.3 }}>
                {post.role} • {post.time}
              </Typography>
            </Box>
          </Box>

          {post.isPinned && (
            <Chip label="📌 पिन किया गया" color="warning" size="small" sx={{ fontWeight: 700 }} />
          )}
        </Box>

        {/* Post Content */}
        {post.content && (
          <Typography
            variant="body1"
            sx={{
              color: '#1e293b',
              lineHeight: 1.7,
              mb: 2,
              fontSize: '1rem',
              whiteSpace: 'pre-line',
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* YouTube Video Player (Responsive 16:9) */}
        {post.youtubeUrl && <YouTubeEmbed youtubeUrl={post.youtubeUrl} title={post.content} />}

        {/* Media Attachments (Images, Videos, PDF) */}
        {post.media && post.media.length > 0 && <MediaViewer media={post.media} />}

        <Divider sx={{ my: 1.5 }} />

        {/* Post Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="medium"
              startIcon={<FavoriteIcon sx={{ color: post.isLiked ? '#ef4444' : '#94a3b8' }} />}
              onClick={handleLikeClick}
              sx={{
                color: post.isLiked ? '#ef4444' : '#475569',
                fontWeight: 700,
                bgcolor: post.isLiked ? '#fee2e2' : 'transparent',
                '&:hover': { bgcolor: post.isLiked ? '#fecaca' : '#f1f5f9' },
              }}
            >
              {post.likes} पसंद (Likes)
            </Button>

            <Button
              size="medium"
              startIcon={<CommentIcon />}
              sx={{ color: '#475569', fontWeight: 600 }}
              onClick={() => onNotification && onNotification(`इस पोस्ट पर ${post.comments} प्रतिक्रियाएं हैं।`)}
            >
              {post.comments} टिप्पणियाँ
            </Button>
          </Box>

          <Button
            size="medium"
            startIcon={<ShareIcon />}
            onClick={handleShareClick}
            sx={{ color: '#16a34a', fontWeight: 700 }}
          >
            WhatsApp शेयर
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
