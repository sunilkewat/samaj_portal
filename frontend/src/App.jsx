import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Verified as VerifiedIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ChatBubbleOutline as CommentIcon,
  VolunteerActivism as DonateIcon,
  Event as EventIcon,
  Bloodtype as BloodIcon,
  FavoriteBorder as CandleIcon,
  PersonAdd as RegisterIcon,
  Login as LoginIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as EducationIcon,
  Work as WorkIcon,
  CheckCircle as SuccessIcon,
  Campaign as NoticeIcon,
} from '@mui/icons-material';
import { checkApiHealth } from './services/api';

// Sample community data
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
    id: 'p1',
    author: 'समाज कार्यकारिणी समिति',
    role: 'Official Notice',
    time: '2 घंटे पहले',
    title: '📢 15वां वार्षिक प्रतिभा सम्मान व युवक-युवती परिचय सम्मेलन 2026',
    content: 'समस्त स्वजातीय बंधुओं को सूचित किया जाता है कि आगामी 15 नवंबर 2026 को भव्य समाज सम्मेलन आयोजित किया जा रहा है। 10वीं व 12वीं में 85% से अधिक अंक प्राप्त करने वाले मेधावी छात्र-छात्राओं का सम्मान किया जाएगा।',
    likes: 48,
    comments: 12,
  },
  {
    id: 'p2',
    author: 'महेश केवट (अध्यक्ष, युवा प्रकोष्ठ)',
    role: 'Community Post',
    time: 'कल शाम 6:00 बजे',
    title: '🩸 सफल विशाल रक्तदान शिविर संपन्न',
    content: 'कल इंदौर में आयोजित रक्तदान शिविर में समाज के 65 युवाओं ने उत्साहपूर्वक रक्तदान किया। सभी रक्तदाता बंधुओं का हार्दिक आभार एवं साधुवाद!',
    likes: 72,
    comments: 19,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiStatus, setApiStatus] = useState('checking');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [bloodFilter, setBloodFilter] = useState('ALL');
  const [candles, setCandles] = useState({ mem1: 142, mem2: 89 });
  const [likedPosts, setLikedPosts] = useState({});
  const [interestsSent, setInterestsSent] = useState({});
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    checkApiHealth().then((res) => {
      if (res.status === 'success') {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    });
  }, []);

  const handleLightCandle = (id) => {
    setCandles((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setNotification('श्रद्धांजलि अर्पित की गई (दीपक प्रज्ज्वलित हुआ) 🙏');
  };

  const handleToggleLike = (id) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <AppBar position="sticky" sx={{ bgcolor: '#0f172a', borderBottom: '2px solid #ea580c' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={apiStatus === 'online' ? 'Cloud API Live 🟢' : 'Connecting API...'}
                size="small"
                sx={{
                  bgcolor: apiStatus === 'online' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 88, 12, 0.15)',
                  color: apiStatus === 'online' ? '#4ade80' : '#fdba74',
                  fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LoginIcon />}
                onClick={() => { setAuthMode('login'); setAuthModal(true); }}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
              >
                लॉगिन
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RegisterIcon />}
                onClick={() => { setAuthMode('register'); setAuthModal(true); }}
              >
                सदस्यता पंजीकरण
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Welcome Bar */}
      <Box sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', py: 4, px: 2 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Chip label="अखिल भारतीय समाज कल्याण मंच" color="warning" size="small" sx={{ mb: 1.5, fontWeight: 700 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            समस्त स्वजातीय बंधुओं का डिजिटल मंच
          </Typography>
          <Typography variant="body1" sx={{ color: '#cbd5e1', maxWidth: 700, mx: 'auto', mb: 3 }}>
            पारिवारिक डायरेक्टरी, विवाह संबंध (Rishtey), रक्तदान सहायता, सामाजिक आयोजन व शोक समाचार की एकीकृत सुविधा।
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
                '& .MuiTab-root': { color: '#cbd5e1', fontWeight: 600, minHeight: 48, borderRadius: 2 },
                '& .Mui-selected': { color: '#ffffff !important', bgcolor: 'rgba(234, 88, 12, 0.3)' },
              }}
            >
              <Tab label="📢 समाचार व फीड" />
              <Tab label="👥 सदस्य डायरेक्टरी" />
              <Tab label="💍 वैवाहिक रिश्ते (Matrimonial)" />
              <Tab label="🩸 रक्तदान केंद्र (Blood SOS)" />
              <Tab label="🕯️ श्रद्धांजलि (Memorial)" />
              <Tab label="📅 आगामी कार्यक्रम" />
            </Tabs>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* TAB 0: SOCIAL FEED */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                समाज समाचार व घोषणाएं
              </Typography>
              <Button variant="outlined" color="primary" startIcon={<NoticeIcon />}>
                नया संदेश पोस्ट करें
              </Button>
            </Box>

            <Grid container spacing={3}>
              {INITIAL_POSTS.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <Card sx={{ p: 1 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#ea580c', fontWeight: 700 }}>
                          {post.author[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {post.author}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {post.role} • {post.time}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                        {post.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7, mb: 2 }}>
                        {post.content}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, borderTop: '1px solid #f1f5f9', pt: 1.5 }}>
                        <Button
                          size="small"
                          startIcon={<FavoriteIcon sx={{ color: likedPosts[post.id] ? '#ef4444' : '#94a3b8' }} />}
                          onClick={() => handleToggleLike(post.id)}
                          sx={{ color: likedPosts[post.id] ? '#ef4444' : '#64748b' }}
                        >
                          {post.likes + (likedPosts[post.id] ? 1 : 0)} Likes
                        </Button>
                        <Button size="small" startIcon={<CommentIcon />} sx={{ color: '#64748b' }}>
                          {post.comments} Comments
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ShareIcon />}
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({ title: post.title, text: post.content, url: window.location.href });
                            } else {
                              setNotification('Link copied to clipboard! 📋');
                            }
                          }}
                          sx={{ color: '#64748b' }}
                        >
                          WhatsApp Share
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 1: MEMBER DIRECTORY */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
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
                    label="ब्लड ग्रुप (Blood)"
                    value={bloodFilter}
                    onChange={(e) => setBloodFilter(e.target.value)}
                  >
                    <MenuItem value="ALL">सभी ब्लड ग्रुप (All)</MenuItem>
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2.5}>
              {filteredMembers.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: '#1e293b', width: 44, height: 44, fontWeight: 700 }}>
                            {member.name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                              {member.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 600 }}>
                              गोत्र: {member.gotra}
                            </Typography>
                          </Box>
                        </Box>
                        {member.verified && (
                          <Chip icon={<VerifiedIcon sx={{ fontSize: 16 }} />} label="सत्यापित" color="success" size="small" />
                        )}
                      </Box>

                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.8, color: '#475569', fontSize: '0.9rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WorkIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                          <span>{member.occupation}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                          <span>{member.city}, {member.state}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BloodIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                          <span>रक्त समूह: <strong>{member.bloodGroup}</strong></span>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2.5, pt: 1.5, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="small" variant="outlined" startIcon={<PhoneIcon />} href={`tel:${member.phone}`}>
                          कॉल करें
                        </Button>
                        <Button size="small" variant="text" color="primary">
                          पूरा परिवार देखें
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* TAB 2: MATRIMONIAL */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  समाज वैवाहिक मंच (Matrimonial)
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  योग्य युवक-युवतियों के बायोडाटा और रिश्ते की तलाश
                </Typography>
              </div>
              <Button variant="contained" color="primary">
                + बायोडाटा अपलोड करें
              </Button>
            </Box>

            <Grid container spacing={3}>
              {INITIAL_MATRIMONIAL.map((m) => (
                <Grid item xs={12} md={4} key={m.id}>
                  <Card sx={{ height: '100%', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={m.photo}
                      alt={m.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {m.name}
                        </Typography>
                        <Chip label={`${m.age} वर्ष • ${m.height}`} size="small" color="secondary" />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, my: 1.5, fontSize: '0.9rem', color: '#334155' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EducationIcon sx={{ fontSize: 18, color: '#ea580c' }} />
                          <span>{m.education}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WorkIcon sx={{ fontSize: 18, color: '#ea580c' }} />
                          <span>{m.occupation}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ fontSize: 18, color: '#ea580c' }} />
                          <span>{m.city} (गोत्र: {m.gotra})</span>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          fullWidth
                          variant={interestsSent[m.id] ? 'outlined' : 'contained'}
                          color={interestsSent[m.id] ? 'success' : 'primary'}
                          onClick={() => handleExpressInterest(m.id)}
                          disabled={interestsSent[m.id]}
                        >
                          {interestsSent[m.id] ? 'प्रस्ताव भेजा गया ✓' : 'रिश्ता प्रस्ताव भेजें'}
                        </Button>
                      </Box>
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
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              उपलब्ध रक्तदाता सूची (Blood Donors)
            </Typography>
            <Grid container spacing={2}>
              {INITIAL_MEMBERS.map((donor) => (
                <Grid item xs={12} sm={6} md={4} key={donor.id}>
                  <Card sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '5px solid #ef4444' }}>
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

        {/* TAB 4: MEMORIAL */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              श्रद्धांजलि व पुण्य स्मरण (Memorial)
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              परम शांति प्राप्त हमारे पूज्य स्वजनों के प्रति विनम्र श्रद्धांजलि
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, borderTop: '4px solid #334155' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                      variant="rounded"
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=60"
                      sx={{ width: 100, height: 110 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        स्व. श्री रामप्रसाद जी केवट
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                        स्वर्गवास: 12 मार्च 2026 • आयु 78 वर्ष (इंदौर)
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#334155', mb: 2 }}>
                        "आपका सरल स्वभाव, समाज के प्रति निष्ठा और मार्गदर्शन सदैव हमारे दिलों में जीवित रहेगा।"
                      </Typography>
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<CandleIcon />}
                        onClick={() => handleLightCandle('mem1')}
                      >
                        दीपक जलाएं ({candles.mem1} अर्पित)
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, borderTop: '4px solid #334155' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                      variant="rounded"
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60"
                      sx={{ width: 100, height: 110 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        स्व. श्री बाबूलाल जी केवट
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                        स्वर्गवास: 04 जनवरी 2026 • आयु 69 वर्ष (भोपाल)
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#334155', mb: 2 }}>
                        "प्रभु उनकी पुण्य आत्मा को मोक्ष और परिवार को संबल प्रदान करें।"
                      </Typography>
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<CandleIcon />}
                        onClick={() => handleLightCandle('mem2')}
                      >
                        दीपक जलाएं ({candles.mem2} अर्पित)
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* TAB 5: EVENTS */}
        {activeTab === 5 && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              आगामी सामाजिक कार्यक्रम व सम्मेलन
            </Typography>
            <Card sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Chip label="वार्षिक उत्सव" color="primary" size="small" sx={{ mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
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
            Empowering community connection with transparency and technology.
          </Typography>
        </Container>
      </Box>

      {/* Login / Register Dialog */}
      <Dialog open={authModal} onClose={() => setAuthModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {authMode === 'login' ? 'समाज पोर्टल लॉगिन' : 'नया सदस्य पंजीकरण'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField fullWidth label="मोबाइल नंबर (Mobile Number)" placeholder="9876543210" />
          <TextField fullWidth label="पासवर्ड (Password)" type="password" />
          {authMode === 'register' && (
            <>
              <TextField fullWidth label="पूरा नाम (Full Name)" placeholder="उदा. सुनील केवट" />
              <TextField fullWidth label="गोत्र (Gotra)" placeholder="उदा. कश्यप" />
              <TextField fullWidth label="शहर (City)" placeholder="उदा. इंदौर" />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAuthModal(false)}>रद्द करें</Button>
          <Button variant="contained" onClick={() => { setAuthModal(false); setNotification('सफलतापूर्वक लॉगिन हो गया! 🚀'); }}>
            {authMode === 'login' ? 'लॉगिन करें' : 'पंजीकरण पूर्ण करें'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Notification Snackbar */}
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        message={notification}
      />
    </Box>
  );
}
