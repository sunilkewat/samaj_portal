import React, { useState, useEffect } from 'react';
import { Container, Box, Snackbar } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { TenantProvider, useTenant } from './context/TenantContext';
import Navbar from './components/common/Navbar';
import HeroBanner from './components/common/HeroBanner';
import Footer from './components/common/Footer';
import AuthDialog from './components/auth/AuthDialog';
import FeedView from './views/FeedView';
import ChatView from './views/ChatView';
import DirectoryView from './views/DirectoryView';
import MatrimonialView from './views/MatrimonialView';
import BloodBankView from './views/BloodBankView';
import EventsView from './views/EventsView';
import { checkApiHealth, fetchFeed, togglePostLike } from './services/api';

function AppContent() {
  const { tenant, tenantData, activeSlug } = useTenant();
  const [activeTab, setActiveTab] = useState(0);
  const [directChatTarget, setDirectChatTarget] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [notification, setNotification] = useState(null);

  // Social Feed state - initialized and synchronized with active Samaj tenant data
  const [posts, setPosts] = useState(tenantData.posts);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);

  // When active Samaj changes, instantly load that Samaj's posts and data
  useEffect(() => {
    if (tenantData && tenantData.posts) {
      setPosts(tenantData.posts);
    }
  }, [activeSlug]);

  // Load feed from API (if online)
  const loadPostsFromApi = async () => {
    setIsLoadingFeed(true);
    try {
      const response = await fetchFeed(1, 20);
      if (response && response.data && response.data.posts && response.data.posts.length > 0) {
        const apiPosts = response.data.posts.map((p) => ({
          id: p.id,
          author: p.author?.profile
            ? `${p.author.profile.firstName || ''} ${p.author.profile.lastName || ''}`.trim()
            : 'स्वजातीय सदस्य',
          authorGotra: p.author?.profile?.samajGotra || tenant.gotras[0] || 'कश्यप',
          authorCity: p.author?.profile?.city || '',
          authorPhoto: p.author?.profile?.profilePhoto || null,
          role: p.isPinned ? 'विशेष सूचना' : 'सदस्य पोस्ट',
          time: new Date(p.createdAt).toLocaleDateString('hi-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
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

  // Handle like toggle
  const handleToggleLike = async (postId) => {
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
      // Ignored gracefully
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      {/* Modular Header */}
      <Navbar apiStatus={apiStatus} />

      {/* Hero & Navigation Tabs */}
      <HeroBanner activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Dynamic Tab Views Scoped to Active Samaj */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {activeTab === 0 && (
          <FeedView
            posts={posts}
            isLoading={isLoadingFeed}
            onToggleLike={handleToggleLike}
            onPostCreated={handlePostCreated}
            onNotification={setNotification}
          />
        )}

        {activeTab === 1 && (
          <ChatView
            key={`chat-${activeSlug}`}
            onNotification={setNotification}
            directChatTarget={directChatTarget}
            onClearDirectChatTarget={() => setDirectChatTarget(null)}
          />
        )}

        {activeTab === 2 && (
          <DirectoryView
            key={`dir-${activeSlug}`}
            members={tenantData.members || []}
            onStartDirectChat={(member) => {
              setDirectChatTarget(member);
              setActiveTab(1);
            }}
          />
        )}

        {activeTab === 3 && (
          <MatrimonialView
            key={`matri-${activeSlug}`}
            profiles={tenantData.matrimonial || []}
            onNotification={setNotification}
          />
        )}

        {activeTab === 4 && (
          <BloodBankView
            key={`blood-${activeSlug}`}
            donors={tenantData.members || []}
          />
        )}

        {activeTab === 5 && (
          <EventsView
            key={`events-${activeSlug}`}
            events={tenantData.events || []}
            onNotification={setNotification}
          />
        )}
      </Container>

      {/* Modular Footer */}
      <Footer />

      {/* Global Auth Modal */}
      <AuthDialog onNotification={setNotification} />

      {/* Notification Toast */}
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

export default function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TenantProvider>
  );
}
