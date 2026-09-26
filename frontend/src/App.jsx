import React, { useState, useEffect } from 'react';
import { Container, Box, Snackbar } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
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
import {
  INITIAL_MEMBERS,
  INITIAL_MATRIMONIAL,
  INITIAL_POSTS,
  INITIAL_EVENTS,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [directChatTarget, setDirectChatTarget] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [notification, setNotification] = useState(null);

  // Social Feed state
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);

  // Load feed from API
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
          authorGotra: p.author?.profile?.samajGotra || 'केवट',
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
    <AuthProvider>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
        {/* Modular Header */}
        <Navbar apiStatus={apiStatus} />

        {/* Hero & Navigation Tabs */}
        <HeroBanner activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Tab Views */}
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
              onNotification={setNotification}
              directChatTarget={directChatTarget}
              onClearDirectChatTarget={() => setDirectChatTarget(null)}
            />
          )}

          {activeTab === 2 && (
            <DirectoryView
              members={INITIAL_MEMBERS}
              onStartDirectChat={(member) => {
                setDirectChatTarget(member);
                setActiveTab(1);
              }}
            />
          )}

          {activeTab === 3 && (
            <MatrimonialView
              profiles={INITIAL_MATRIMONIAL}
              onNotification={setNotification}
            />
          )}

          {activeTab === 4 && <BloodBankView donors={INITIAL_MEMBERS} />}

          {activeTab === 5 && (
            <EventsView events={INITIAL_EVENTS} onNotification={setNotification} />
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
    </AuthProvider>
  );
}
