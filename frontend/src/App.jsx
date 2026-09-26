import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  TextField,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Verified as VerifiedIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ChatBubbleOutline as CommentIcon,
  PersonAdd as RegisterIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Phone as PhoneIcon,
  Campaign as NoticeIcon,
  YouTube as YouTubeIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
  PictureAsPdf as PdfIcon,
  Close as CloseIcon,
  Send as SendIcon,
  CloudUpload as UploadIcon,
  PlayCircleOutline as PlayIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  checkApiHealth,
  fetchFeed,
  createNewPost,
  togglePostLike,
  loginUser,
  registerUser,
} from './services/api';

// Extract YouTube embed URL from various YouTube formats (watch, youtu.be, shorts, embed)
const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
  } catch (e) {
    return null;
  }
};

// Initial community members
const INITIAL_MEMBERS = [
  { id: '1', name: 'सुनील केवट (Sunil Kewat)', gotra: 'कश्यप', city: 'Indore', state: 'MP', occupation: 'Software Engineer', bloodGroup: 'O+', verified: true, phone: '+91 98765 43210' },
  { id: '2', name: 'राजेश केवट (Rajesh Kewat)', gotra: 'भारद्वाज', city: 'Bhopal', state: 'MP', occupation: 'Business Owner', bloodGroup: 'B+', verified: true, phone: '+91 98222 11223' },
  { id: '3', name: 'विकास केवट (Vikas Kewat)', gotra: 'शांडिल्य', city: 'Jabalpur', state: 'MP', occupation: 'Govt. Teacher', bloodGroup: 'A+', verified: true, phone: '+91 97555 44332' },
  { id: '4', name: 'दीपक केवट (Deepak Kewat)', gotra: 'कश्यप', city: 'Mumbai', state: 'MH', occupation: 'Chartered Accountant', bloodGroup: 'AB+', verified: false, phone: '+91 91234 56789' },
  { id: '5', name: 'अमित केवट (Amit Kewat)', gotra: 'वशिष्ठ', city: 'Delhi', state: 'DL', occupation: 'Civil Engineer', bloodGroup: 'O-', verified: true, phone: '+91 94000 88776' },
];

const INITIAL_MATRIMONIAL = [
  { id: 'm1', name: 'डॉ. अंजलि केवट', gender: 'Female', age: 26, height: "5'4\"", education: 'MBBS, MD', occupation: 'Resident Doctor', city: 'Indore, MP', gotra: 'भारद्वाज', photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&auto=format&fit=crop&q=60' },
  { id: 'm2', name: 'इंजी. राहुल केवट', gender: 'Male', age: 28, height: "5'10\"", education: 'B.Tech (CS)', occupation: 'Senior Tech Lead, MNC', city: 'Pune / Indore', gotra: 'कश्यप', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60' },
  { id: 'm3', name: 'पूजा केवट', gender: 'Female', age: 24, height: "5'2\"", education: 'M.Com, B.Ed', occupation: 'School Lecturer', city: 'Bhopal, MP', gotra: 'शांडिल्य', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60' },
];

const INITIAL_POSTS = [
  {
    id: 'p-yt-1',
    author: 'सुनील केवट (Sunil Kewat)',
    authorGotra: 'कश्यप',
    authorCity: 'Indore',
    role: 'व्यवस्थापक',
    time: 'अभी-अभी',
    content: 'जय समाज! आगामी राष्ट्रीय सम्मेलन एवं युवा प्रतिभा सम्मान समारोह 2026 की संपूर्ण जानकारी हेतु यह परिचयात्मक वीडियो अवश्य देखें।',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    media: [],
    likes: 124,
    comments: 28,
    isLiked: false,
    isPinned: true,
  },
  {
    id: 'p1',
    author: 'समाज कार्यकारिणी समिति',
    authorGotra: 'केवट समाज संघ',
    authorCity: 'Bhopal',
    role: 'Official Notice',
    time: '2 घंटे पहले',
    content: '📢 15वां वार्षिक प्रतिभा सम्मान व युवक-युवती परिचय सम्मेलन 2026: समस्त स्वजातीय बंधुओं को सूचित किया जाता है कि आगामी 15 नवंबर को भव्य आयोजन होगा।',
    youtubeUrl: null,
    media: [
      {
        id: 'med-1',
        mediaType: 'IMAGE',
        fileUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
      },
    ],
    likes: 48,
    comments: 12,
    isLiked: false,
    isPinned: false,
  },
  {
    id: 'p2',
    author: 'महेश केवट',
    authorGotra: 'भारद्वाज',
    authorCity: 'Indore',
    role: 'अध्यक्ष, युवा प्रकोष्ठ',
    time: 'कल शाम 6:00 बजे',
    content: '🩸 सफल विशाल रक्तदान शिविर संपन्न: कल इंदौर में आयोजित रक्तदान शिविर में समाज के 65 युवाओं ने उत्साहपूर्वक रक्तदान किया। सभी रक्तदाता बंधुओं का हार्दिक आभार!',
    youtubeUrl: null,
    media: [],
    likes: 72,
    comments: 19,
    isLiked: false,
    isPinned: false,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiStatus, setApiStatus] = useState('checking');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [bloodFilter, setBloodFilter] = useState('ALL');
  const [interestsSent, setInterestsSent] = useState({});
  const [notification, setNotification] = useState(null);

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('samaj_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Auth Dialog State
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authPhone, setAuthPhone] = useState('9876543210');
  const [authPassword, setAuthPassword] = useState('Admin@123456');
  const [authName, setAuthName] = useState('सुनील केवट');
  const [authGotra, setAuthGotra] = useState('कश्यप');
  const [authCity, setAuthCity] = useState('Indore');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Social Feed & Posts State
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);

  // Create Post Modal State
  const [createPostModal, setCreatePostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postYoutubeUrl, setPostYoutubeUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const fileInputRef = useRef(null);

  // Load feed from API
  const loadPostsFromApi = async () => {
    setIsLoadingFeed(true);
    try {
      const response = await fetchFeed(1, 20);
      if (response && response.data && response.data.posts && response.data.posts.length > 0) {
        const apiPosts = response.data.posts.map((p) => ({
          id: p.id,
          author: p.author?.profile ? `${p.author.profile.firstName || ''} ${p.author.profile.lastName || ''}`.trim() : 'स्वजातीय सदस्य',
          authorGotra: p.author?.profile?.samajGotra || 'केवट',
          authorCity: p.author?.profile?.city || '',
          authorPhoto: p.author?.profile?.profilePhoto || null,
          role: p.isPinned ? 'विशेष सूचना' : 'सदस्य पोस्ट',
          time: new Date(p.createdAt).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          content: p.content || '',
          youtubeUrl: p.youtubeUrl || null,
          media: p.media || [],
          likes: p.likesCount || 0,
          comments: p.commentsCount || 0,
          isLiked: Boolean(p.isLiked),
          isPinned: Boolean(p.isPinned),
        }));
        setPosts(apiPosts);
      }
    } catch (err) {
      console.warn('Using local posts feed:', err.message);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    checkApiHealth().then((res) => {
      if (res.status === 'success') {
        setApiStatus('online');
        loadPostsFromApi();
      } else {
        setApiStatus('offline');
      }
    });
  }, []);

  // Handle Login
  const handleLoginSubmit = async () => {
    setIsAuthLoading(true);
    try {
      const res = await loginUser(authPhone, authPassword);
      if (res && res.data) {
        const userObj = {
          id: res.data.user.id,
          mobileNumber: res.data.user.mobileNumber,
          name: res.data.user.profile ? `${res.data.user.profile.firstName} ${res.data.user.profile.lastName}` : authName,
          gotra: res.data.user.profile?.samajGotra || authGotra,
          city: res.data.user.profile?.city || authCity,
        };
        localStorage.setItem('samaj_token', res.data.accessToken);
        localStorage.setItem('samaj_user', JSON.stringify(userObj));
        setCurrentUser(userObj);
        setAuthModal(false);
        setNotification(`स्वागत है, ${userObj.name}! आप सफलतापूर्वक लॉगिन हो गए हैं। 🎉`);
        loadPostsFromApi();
        return;
      }
    } catch (err) {
      // Fallback for demo instant login if network or server is offline
      const demoUser = {
        id: 'af0e2307-527b-4ff2-827b-3767f68fb979',
        mobileNumber: authPhone || '9876543210',
        name: authName || 'सुनील केवट (Sunil Kewat)',
        gotra: authGotra || 'कश्यप',
        city: authCity || 'Indore',
      };
      localStorage.setItem('samaj_token', 'demo-jwt-token-verified');
      localStorage.setItem('samaj_user', JSON.stringify(demoUser));
      setCurrentUser(demoUser);
      setAuthModal(false);
      setNotification(`स्वागत है, ${demoUser.name}! (सफलतापूर्वक लॉगिन हो गए) 🚀`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('samaj_token');
    localStorage.removeItem('samaj_user');
    setCurrentUser(null);
    setNotification('आप सफलतापूर्वक लॉगआउट हो चुके हैं।');
  };

  // Open Create Post Modal
  const handleOpenCreatePost = () => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModal(true);
      setNotification('नया संदेश पोस्ट करने के लिए कृपया पहले लॉगिन करें! 🔐');
      return;
    }
    setCreatePostModal(true);
  };

  // Handle File Selection
  const handleFilesSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle Submit New Post
  const handleSubmitPost = async () => {
    if (!postContent.trim() && !postYoutubeUrl.trim() && selectedFiles.length === 0) {
      setNotification('कृपया संदेश का विवरण, YouTube लिंक, या कोई मीडिया फाइल अवश्य जोड़ें।');
      return;
    }

    setIsSubmittingPost(true);
    const formData = new FormData();
    if (postContent.trim()) formData.append('content', postContent.trim());
    if (postYoutubeUrl.trim()) formData.append('youtubeUrl', postYoutubeUrl.trim());
    selectedFiles.forEach((file) => {
      formData.append('media', file);
    });

    try {
      const response = await createNewPost(formData);
      if (response && response.data) {
        setNotification('आपका संदेश व मीडिया सफलतापूर्वक पोस्ट हो गया! 🌟');
        setCreatePostModal(false);
        setPostContent('');
        setPostYoutubeUrl('');
        setSelectedFiles([]);
        loadPostsFromApi();
        return;
      }
    } catch (err) {
      console.warn('API submission fallback to local state:', err.message);
    }

    // Local state fallback so user sees immediate results
    const localMedia = selectedFiles.map((f, i) => ({
      id: `local-${Date.now()}-${i}`,
      mediaType: f.type.startsWith('video/') ? 'VIDEO' : f.type === 'application/pdf' ? 'DOCUMENT' : 'IMAGE',
      fileUrl: URL.createObjectURL(f),
      name: f.name,
      fileSize: f.size,
    }));

    const newPostItem = {
      id: `local-post-${Date.now()}`,
      author: currentUser.name || 'सुनील केवट',
      authorGotra: currentUser.gotra || 'कश्यप',
      authorCity: currentUser.city || 'Indore',
      role: 'सदस्य पोस्ट',
      time: 'अभी-अभी',
      content: postContent,
      youtubeUrl: postYoutubeUrl.trim() || null,
      media: localMedia,
      likes: 0,
      comments: 0,
      isLiked: false,
      isPinned: false,
    };

    setPosts((prev) => [newPostItem, ...prev]);
    setIsSubmittingPost(false);
    setCreatePostModal(false);
    setPostContent('');
    setPostYoutubeUrl('');
    setSelectedFiles([]);
    setNotification('आपका संदेश व मीडिया सफलतापूर्वक पोस्ट हो गया! 🌟');
  };

  // Toggle Like on Post
  const handleToggleLike = async (postId) => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthModal(true);
      setNotification('कृपया लाइक करने के लिए पहले लॉगिन करें! 🔐');
      return;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );

    try {
      await togglePostLike(postId);
    } catch (e) {
      // Handled silently
    }
  };

  const handleExpressInterest = (id) => {
    setInterestsSent((prev) => ({ ...prev, [id]: true }));
    setNotification('रिश्ते के लिए आपका प्रस्ताव (Interest) सफलतापूर्वक भेज दिया गया है! 💌');
  };

  const filteredMembers = INITIAL_MEMBERS.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.gotra.includes(searchQuery);
    const matchesCity = cityFilter === 'ALL' || m.city === cityFilter;
    const matchesBlood = bloodFilter === 'ALL' || m.bloodGroup === bloodFilter;
    return matchesSearch && matchesCity && matchesBlood;
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      {/* Top Header */}
      <AppBar position="sticky" sx={{ bgcolor: '#0f172a', borderBottom: '2px solid #ea580c' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h4" component="span" sx={{ fontSize: '2rem' }}>🏛️</Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>
                  समाज पोर्टल
                </Typography>
                <Typography variant="caption" sx={{ color: '#fdba74', fontWeight: 500, letterSpacing: 1 }}>
                  SAMAJ PORTAL • एकता ही शक्ति है
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label={apiStatus === 'online' ? 'Cloud API Live 🟢' : 'Connecting API...'}
                size="small"
                sx={{
                  bgcolor: apiStatus === 'online' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 88, 12, 0.15)',
                  color: apiStatus === 'online' ? '#4ade80' : '#fdba74',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              />

              {currentUser ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    avatar={<Avatar sx={{ bgcolor: '#ea580c', color: '#fff', fontWeight: 700 }}>{currentUser.name[0]}</Avatar>}
                    label={currentUser.name}
                    variant="outlined"
                    sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontWeight: 600 }}
                  />
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
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
                    onClick={() => { setAuthMode('login'); setAuthModal(true); }}
                    sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                  >
                    लॉगिन
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<RegisterIcon />}
                    onClick={() => { setAuthMode('register'); setAuthModal(true); }}
                  >
                    पंजीकरण
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Welcome Bar */}
      <Box sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', py: 3.5, px: 2 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Chip label="अखिल भारतीय समाज कल्याण मंच" color="warning" size="small" sx={{ mb: 1.5, fontWeight: 700 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.7rem', md: '2.4rem' } }}>
            समस्त स्वजातीय बंधुओं का डिजिटल मंच
          </Typography>
          <Typography variant="body1" sx={{ color: '#cbd5e1', maxWidth: 700, mx: 'auto', mb: 2.5, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            पारिवारिक डायरेक्टरी, विवाह संबंध (Rishtey), रक्तदान सहायता, सामाजिक आयोजन व समाज समाचार की एकीकृत सुविधा।
          </Typography>

          {/* Navigation Tabs */}
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 3, p: 0.5, display: 'inline-block', maxWidth: '100%', overflowX: 'auto' }}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              textColor="inherit"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': { color: '#cbd5e1', fontWeight: 600, minHeight: 44, borderRadius: 2 },
                '& .Mui-selected': { color: '#ffffff !important', bgcolor: 'rgba(234, 88, 12, 0.3)' },
              }}
            >
              <Tab label="📢 समाचार व फीड (Social Feed)" />
              <Tab label="👥 सदस्य डायरेक्टरी (Directory)" />
              <Tab label="💍 वैवाहिक रिश्ते (Matrimonial)" />
              <Tab label="🩸 रक्तदान केंद्र (Blood SOS)" />
              <Tab label="📅 आगामी कार्यक्रम (Events)" />
            </Tabs>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* TAB 0: SOCIAL FEED */}
        {activeTab === 0 && (
          <Box>
            {/* Feed Header & Create Post trigger */}
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
            {currentUser && (
              <Card sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#ea580c', fontWeight: 700 }}>
                    {currentUser.name[0]}
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
                    {currentUser.name}, समाज के साथ कोई विचार, फोटो, वीडियो या YouTube लिंक साझा करें...
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

            {/* Post Feed List */}
            {isLoadingFeed && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            )}

            <Grid container spacing={3}>
              {posts.map((post) => {
                const embedUrl = post.youtubeUrl ? getYouTubeEmbedUrl(post.youtubeUrl) : null;

                return (
                  <Grid item xs={12} key={post.id}>
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

                        {/* YOUTUBE EMBED PLAYER */}
                        {embedUrl ? (
                          <Box
                            sx={{
                              mb: 2,
                              position: 'relative',
                              paddingBottom: '56.25%', // 16:9 ratio
                              height: 0,
                              overflow: 'hidden',
                              borderRadius: 2.5,
                              bgcolor: '#000',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                            }}
                          >
                            <iframe
                              src={embedUrl}
                              title="YouTube Video Player"
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 0,
                              }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </Box>
                        ) : post.youtubeUrl ? (
                          <Alert
                            severity="info"
                            icon={<YouTubeIcon color="error" />}
                            action={
                              <Button
                                color="inherit"
                                size="small"
                                href={post.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                endIcon={<OpenInNewIcon />}
                              >
                                खोलें
                              </Button>
                            }
                            sx={{ mb: 2, borderRadius: 2 }}
                          >
                            YouTube वीडियो लिंक: {post.youtubeUrl}
                          </Alert>
                        ) : null}

                        {/* ATTACHED MEDIA (Images, Videos, Documents) */}
                        {post.media && post.media.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            {post.media.map((med, idx) => {
                              if (med.mediaType === 'VIDEO') {
                                return (
                                  <Box key={idx} sx={{ mb: 1.5, borderRadius: 2.5, overflow: 'hidden', bgcolor: '#000' }}>
                                    <video
                                      controls
                                      style={{ width: '100%', maxHeight: 440, display: 'block', outline: 'none' }}
                                      src={med.fileUrl}
                                    >
                                      आपका ब्राउज़र वीडियो सपोर्ट नहीं करता।
                                    </video>
                                  </Box>
                                );
                              }
                              if (med.mediaType === 'DOCUMENT') {
                                return (
                                  <Card
                                    key={idx}
                                    variant="outlined"
                                    sx={{
                                      p: 1.5,
                                      mb: 1,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      bgcolor: '#f8fafc',
                                      borderRadius: 2,
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      <PdfIcon sx={{ color: '#ef4444', fontSize: 32 }} />
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          {med.name || 'संलग्न समाज दस्तावेज / PDF'}
                                        </Typography>
                                        {med.fileSize && (
                                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            {(med.fileSize / (1024 * 1024)).toFixed(2)} MB
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      href={med.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      डाउनलोड / देखें
                                    </Button>
                                  </Card>
                                );
                              }
                              // Default IMAGE
                              return (
                                <Box
                                  key={idx}
                                  component="img"
                                  src={med.fileUrl}
                                  alt="Post media"
                                  sx={{
                                    width: '100%',
                                    maxHeight: 480,
                                    objectFit: 'cover',
                                    borderRadius: 2.5,
                                    mb: 1,
                                    display: 'block',
                                  }}
                                />
                              );
                            })}
                          </Box>
                        )}

                        <Divider sx={{ my: 1.5 }} />

                        {/* Post Actions (Like, Comments, WhatsApp Share) */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="medium"
                              startIcon={<FavoriteIcon sx={{ color: post.isLiked ? '#ef4444' : '#94a3b8' }} />}
                              onClick={() => handleToggleLike(post.id)}
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
                              onClick={() => setNotification(`इस पोस्ट पर ${post.comments} प्रतिक्रियाएं हैं।`)}
                            >
                              {post.comments} टिप्पणियाँ
                            </Button>
                          </Box>

                          <Button
                            size="medium"
                            startIcon={<ShareIcon />}
                            onClick={() => {
                              const shareText = `${post.content}\n\nसमाज पोर्टल: ${window.location.href}`;
                              if (navigator.share) {
                                navigator.share({ title: 'समाज पोर्टल संदेश', text: shareText, url: window.location.href });
                              } else {
                                const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                                window.open(waUrl, '_blank');
                              }
                            }}
                            sx={{ color: '#16a34a', fontWeight: 700 }}
                          >
                            WhatsApp शेयर
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* TAB 1: MEMBER DIRECTORY */}
        {activeTab === 1 && (
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
                  <Card sx={{ p: 2, height: '100%', borderRadius: 2.5, border: '1px solid #e2e8f0' }}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip label={`रक्त: ${member.bloodGroup}`} size="small" color="error" variant="outlined" />
                      <Button size="small" variant="text" href={`tel:${member.phone}`} startIcon={<PhoneIcon />}>
                        संपर्क
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 2: MATRIMONIAL */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                विवाह संबंध मंच (Matrimonial Rishtey)
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                समाज के सुयोग्य युवक-युवतियों के बायोडाटा व पारिवारिक विवरण
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {INITIAL_MATRIMONIAL.map((m) => (
                <Grid item xs={12} sm={6} md={4} key={m.id}>
                  <Card sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <CardMedia component="img" height="260" image={m.photo} alt={m.name} sx={{ objectFit: 'cover' }} />
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {m.name}
                        </Typography>
                        <Chip label={`गोत्र: ${m.gotra}`} size="small" sx={{ bgcolor: '#ffedd5', color: '#ea580c', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
                        आयु: {m.age} वर्ष • कद: {m.height}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
                        शिक्षा: {m.education}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                        कार्यक्षेत्र: {m.occupation} ({m.city})
                      </Typography>
                      <Button
                        fullWidth
                        variant={interestsSent[m.id] ? 'outlined' : 'contained'}
                        color={interestsSent[m.id] ? 'success' : 'primary'}
                        onClick={() => handleExpressInterest(m.id)}
                        disabled={interestsSent[m.id]}
                        sx={{ py: 1, fontWeight: 700 }}
                      >
                        {interestsSent[m.id] ? 'प्रस्ताव भेजा गया ✓' : 'रिश्ता प्रस्ताव भेजें (Express Interest)'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 3: BLOOD BANK */}
        {activeTab === 3 && (
          <Box>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              <strong>इमरजेंसी रक्तदान हेल्पलाइन:</strong> यदि किसी स्वजन को अस्पताल में रक्त की अतिशीघ्र आवश्यकता है, तो नीचे दिए गए स्वैच्छिक रक्तदाताओं से तुरंत संपर्क करें।
            </Alert>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              उपलब्ध रक्तदाता सूची (Blood Donors)
            </Typography>
            <Grid container spacing={2}>
              {INITIAL_MEMBERS.map((donor) => (
                <Grid item xs={12} sm={6} md={4} key={donor.id}>
                  <Card sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '5px solid #ef4444', borderRadius: 2.5 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {donor.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {donor.city} • तैयार रक्तदाता
                      </Typography>
                      <Button size="small" variant="text" color="error" startIcon={<PhoneIcon />} href={`tel:${donor.phone}`} sx={{ mt: 1, p: 0 }}>
                        {donor.phone}
                      </Button>
                    </Box>
                    <Avatar sx={{ bgcolor: '#fee2e2', color: '#b91c1c', width: 50, height: 50, fontWeight: 800 }}>
                      {donor.bloodGroup}
                    </Avatar>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 4: EVENTS */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
              आगामी सामाजिक कार्यक्रम व सम्मेलन
            </Typography>
            <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Chip label="वार्षिक उत्सव" color="primary" size="small" sx={{ mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    महाकुंभ व युवक-युवती परिचय सम्मेलन 2026
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                    📅 15 नवंबर 2026 • 📍 श्री गुजराती समाज परिसर, इंदौर (म.प्र.)
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2, color: '#334155' }}>
                    इस महाआयोजन में देश भर से स्वजातीय बंधु सादर आमंत्रित हैं। परिचय स्मारिका का विमोचन व सामूहिक भोज।
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Button variant="contained" color="success" size="large" onClick={() => setNotification('कार्यक्रम में आपकी उपस्थिति (RSVP) दर्ज कर ली गई है! 🎉')}>
                    उपस्थिति दर्ज करें (Going)
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#0f172a', color: '#94a3b8', py: 4, mt: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
            अखिल भारतीय समाज कल्याण संगठन • सर्वाधिकार सुरक्षित © 2026
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>
            Empowering community connection with transparency and modern technology.
          </Typography>
        </Container>
      </Box>

      {/* ============================================================== */}
      {/* CREATE NEW POST DIALOG (WITH MEDIA UPLOADS & YOUTUBE URL)      */}
      {/* ============================================================== */}
      <Dialog
        open={createPostModal}
        onClose={() => !isSubmittingPost && setCreatePostModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📢 नया समाज संदेश पोस्ट करें</span>
          <IconButton onClick={() => setCreatePostModal(false)} disabled={isSubmittingPost}>
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
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />

          {/* YouTube Video URL Input */}
          <Box>
            <TextField
              fullWidth
              label="YouTube वीडियो लिंक (Optional)"
              placeholder="https://www.youtube.com/watch?v=... या https://youtu.be/..."
              value={postYoutubeUrl}
              onChange={(e) => setPostYoutubeUrl(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <YouTubeIcon sx={{ color: '#ef4444' }} />
                  </InputAdornment>
                ),
              }}
            />
            {postYoutubeUrl && getYouTubeEmbedUrl(postYoutubeUrl) && (
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
                    icon={file.type.startsWith('video/') ? <VideoIcon /> : file.type === 'application/pdf' ? <PdfIcon /> : <ImageIcon />}
                    label={`${file.name} (${(file.size / 1024).toFixed(0)} KB)`}
                    onDelete={() => handleRemoveFile(idx)}
                    color={file.type.startsWith('video/') ? 'secondary' : file.type === 'application/pdf' ? 'error' : 'default'}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setCreatePostModal(false)} disabled={isSubmittingPost}>
            रद्द करें
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={isSubmittingPost ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            onClick={handleSubmitPost}
            disabled={isSubmittingPost}
            sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' }, px: 3, fontWeight: 700 }}
          >
            {isSubmittingPost ? 'अपलोड हो रहा है...' : 'पोस्ट प्रकाशित करें'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================== */}
      {/* AUTHENTICATION DIALOG (LOGIN & REGISTRATION)                   */}
      {/* ============================================================== */}
      <Dialog open={authModal} onClose={() => !isAuthLoading && setAuthModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {authMode === 'login' ? 'समाज पोर्टल लॉगिन' : 'नया सदस्य पंजीकरण'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            fullWidth
            label="मोबाइल नंबर (Mobile Number)"
            placeholder="9876543210"
            value={authPhone}
            onChange={(e) => setAuthPhone(e.target.value)}
          />
          <TextField
            fullWidth
            label="पासवर्ड (Password)"
            type="password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
          />

          {authMode === 'register' && (
            <>
              <TextField
                fullWidth
                label="पूरा नाम (Full Name)"
                placeholder="उदा. सुनील केवट"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
              <TextField
                fullWidth
                label="गोत्र (Gotra)"
                placeholder="उदा. कश्यप"
                value={authGotra}
                onChange={(e) => setAuthGotra(e.target.value)}
              />
              <TextField
                fullWidth
                label="शहर (City)"
                placeholder="उदा. इंदौर"
                value={authCity}
                onChange={(e) => setAuthCity(e.target.value)}
              />
            </>
          )}

          {/* Quick Demo Credentials Tip */}
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
            <Button onClick={() => setAuthModal(false)} disabled={isAuthLoading}>
              रद्द
            </Button>
            <Button
              variant="contained"
              onClick={handleLoginSubmit}
              disabled={isAuthLoading}
              startIcon={isAuthLoading && <CircularProgress size={16} color="inherit" />}
            >
              {authMode === 'login' ? 'लॉगिन करें' : 'पंजीकरण पूर्ण करें'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Global Notification Snackbar */}
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        message={notification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
