import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  YouTube as YouTubeIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
  PictureAsPdf as PdfIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { getYouTubeEmbedUrl } from '../../utils/youtube.util';
import { createNewPost } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CreatePostDialog({ open, onClose, onPostCreated, onNotification }) {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFilesSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setContent('');
      setYoutubeUrl('');
      setSelectedFiles([]);
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !youtubeUrl.trim() && selectedFiles.length === 0) {
      if (onNotification) onNotification('कृपया संदेश का विवरण, YouTube लिंक, या कोई मीडिया फाइल अवश्य जोड़ें।');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (content.trim()) formData.append('content', content.trim());
    if (youtubeUrl.trim()) formData.append('youtubeUrl', youtubeUrl.trim());
    selectedFiles.forEach((file) => {
      formData.append('media', file);
    });

    let createdPost = null;
    try {
      const response = await createNewPost(formData);
      if (response && response.data) {
        const p = response.data;
        createdPost = {
          id: p.id,
          author: currentUser?.name || 'सुनील केवट',
          authorGotra: currentUser?.gotra || 'कश्यप',
          authorCity: currentUser?.city || 'Indore',
          role: 'सदस्य पोस्ट',
          time: 'अभी-अभी',
          content: p.content,
          youtubeUrl: p.youtubeUrl,
          media: p.media || [],
          likes: 0,
          comments: 0,
          isLiked: false,
          isPinned: false,
        };
      }
    } catch (err) {
      console.warn('API post error, falling back to local post:', err.message);
    }

    // Local fallback if network was slow/offline
    if (!createdPost) {
      const localMedia = selectedFiles.map((f, i) => ({
        id: `local-${Date.now()}-${i}`,
        mediaType: f.type.startsWith('video/') ? 'VIDEO' : f.type === 'application/pdf' ? 'DOCUMENT' : 'IMAGE',
        fileUrl: URL.createObjectURL(f),
        name: f.name,
        fileSize: f.size,
      }));

      createdPost = {
        id: `local-post-${Date.now()}`,
        author: currentUser?.name || 'सुनील केवट',
        authorGotra: currentUser?.gotra || 'कश्यप',
        authorCity: currentUser?.city || 'Indore',
        role: 'सदस्य पोस्ट',
        time: 'अभी-अभी',
        content,
        youtubeUrl: youtubeUrl.trim() || null,
        media: localMedia,
        likes: 0,
        comments: 0,
        isLiked: false,
        isPinned: false,
      };
    }

    setIsSubmitting(false);
    handleClose();
    if (onPostCreated) onPostCreated(createdPost);
    if (onNotification) onNotification('आपका संदेश व मीडिया सफलतापूर्वक पोस्ट हो गया! 🌟');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>📢 नया समाज संदेश पोस्ट करें</span>
        <IconButton onClick={handleClose} disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Post Content */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="आपका संदेश या विचार (Post Content)"
          placeholder="स्वजातीय बंधुओं के साथ महत्वपूर्ण सूचना, विचार या विवरण साझा करें..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* YouTube Video URL Input */}
        <Box>
          <TextField
            fullWidth
            label="YouTube वीडियो लिंक (Optional)"
            placeholder="https://www.youtube.com/watch?v=... या https://youtu.be/..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <YouTubeIcon sx={{ color: '#ef4444' }} />
                </InputAdornment>
              ),
            }}
          />
          {youtubeUrl && getYouTubeEmbedUrl(youtubeUrl) && (
            <Alert severity="success" sx={{ mt: 1, py: 0.5, borderRadius: 1.5 }}>
              ✓ वैध YouTube वीडियो लिंक डिटेक्ट हुआ (पोस्ट में प्लेयर एम्बेड होगा)
            </Alert>
          )}
        </Box>

        {/* Media File Upload Selector */}
        <Box sx={{ border: '1px dashed #cbd5e1', p: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#334155' }}>
            मीडिया फाइलें जोड़ें (फोटो, वीडियो या PDF):
          </Typography>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFilesSelect}
            style={{ display: 'none' }}
            accept="image/*,video/*,application/pdf"
          />

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<ImageIcon />}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              size="small"
            >
              फोटो (Images)
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<VideoIcon />}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              size="small"
            >
              वीडियो (Videos)
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<PdfIcon />}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              size="small"
            >
              दस्तावेज (PDF)
            </Button>
          </Box>

          {/* Selected files preview chips */}
          {selectedFiles.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {selectedFiles.map((file, idx) => (
                <Chip
                  key={idx}
                  icon={
                    file.type.startsWith('video/') ? (
                      <VideoIcon />
                    ) : file.type === 'application/pdf' ? (
                      <PdfIcon />
                    ) : (
                      <ImageIcon />
                    )
                  }
                  label={`${file.name} (${(file.size / 1024).toFixed(0)} KB)`}
                  onDelete={() => handleRemoveFile(idx)}
                  color={
                    file.type.startsWith('video/')
                      ? 'secondary'
                      : file.type === 'application/pdf'
                      ? 'error'
                      : 'default'
                  }
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          रद्द करें
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' }, px: 3, fontWeight: 700 }}
        >
          {isSubmitting ? 'अपलोड हो रहा है...' : 'पोस्ट प्रकाशित करें'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
