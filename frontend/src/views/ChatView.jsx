import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  TextField,
  Button,
  IconButton,
  Chip,
  Divider,
  Paper,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  Forum as ChatIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Lock as LockIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
  PictureAsPdf as PdfIcon,
  PersonAdd as AddMemberIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import {
  fetchGroups,
  fetchGroupMessages,
  sendGroupMessage,
  createGroup,
  addGroupMember,
} from '../services/api';
import { INITIAL_GROUPS, INITIAL_MESSAGES, INITIAL_MEMBERS } from '../data/mockData';

export default function ChatView({ onNotification }) {
  const { currentUser, isLoggedIn, openAuth } = useAuth();

  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState('group-1');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [groupSearch, setGroupSearch] = useState('');

  // Media file attachment state in chat
  const [selectedChatMedia, setSelectedChatMedia] = useState(null);
  const mediaFileInputRef = useRef(null);

  // Group creation dialog state
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Add Member dialog state
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [addedMembersState, setAddedMembersState] = useState({});

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeGroupId]);

  // Load groups from backend API (falls back to INITIAL_GROUPS)
  useEffect(() => {
    fetchGroups()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          const apiGroups = res.data.map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            membersCount: g._count?.members || 1,
            icon: '💬',
            isMember: g.isMember,
          }));
          setGroups(apiGroups);
          if (!activeGroupId && apiGroups[0]) {
            setActiveGroupId(apiGroups[0].id);
          }
        }
      })
      .catch((err) => {
        console.warn('Groups API using mock data:', err.message);
      });
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    try {
      const serverUrl = 'https://samaj-portal-api.onrender.com';
      const socket = io(`${serverUrl}/chat`, {
        transports: ['websocket', 'polling'],
        reconnection: true,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        if (activeGroupId) {
          socket.emit('join_group', { groupId: activeGroupId });
        }
      });

      socket.on('new_message', (payload) => {
        if (payload && payload.groupId) {
          setMessages((prev) => {
            const groupMsgs = prev[payload.groupId] || [];
            if (groupMsgs.some((m) => m.id === payload.id)) {
              return prev;
            }
            return {
              ...prev,
              [payload.groupId]: [
                ...groupMsgs,
                {
                  id: payload.id || `msg-${Date.now()}`,
                  senderId: payload.senderId,
                  senderName: payload.senderName || 'स्वजातीय सदस्य',
                  senderGotra: payload.senderGotra || 'कश्यप',
                  text: payload.messageText || payload.text,
                  mediaUrl: payload.mediaUrl || null,
                  mediaType: payload.mediaType || null,
                  mediaName: payload.mediaName || null,
                  time:
                    payload.time ||
                    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  isMe: currentUser && payload.senderId === currentUser.id,
                },
              ],
            };
          });
        }
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    } catch (e) {
      console.warn('Socket.IO connection skipped:', e.message);
    }
  }, [currentUser]);

  // Handle Switching Groups
  const handleSelectGroup = (groupId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('leave_group', { groupId: activeGroupId });
      socketRef.current.emit('join_group', { groupId });
    }
    setActiveGroupId(groupId);

    fetchGroupMessages(groupId)
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          const apiMsgs = res.data.map((m) => ({
            id: m.id,
            senderId: m.senderId,
            senderName: m.sender?.profile
              ? `${m.sender.profile.firstName} ${m.sender.profile.lastName}`
              : 'सदस्य',
            senderGotra: m.sender?.profile?.samajGotra || 'कश्यप',
            text: m.messageText,
            mediaUrl: m.mediaUrl,
            mediaType: m.mediaType,
            time: new Date(m.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            isMe: currentUser && m.senderId === currentUser.id,
          }));
          setMessages((prev) => ({ ...prev, [groupId]: apiMsgs }));
        }
      })
      .catch((e) => {
        // Fallback to local
      });
  };

  // Handle File Attachment Selection
  const handleMediaSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedChatMedia(e.target.files[0]);
    }
  };

  const handleRemoveMedia = () => {
    setSelectedChatMedia(null);
    if (mediaFileInputRef.current) {
      mediaFileInputRef.current.value = '';
    }
  };

  // Handle Send Message (With optional media file attachment)
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageInput.trim() && !selectedChatMedia) return;

    if (!isLoggedIn) {
      openAuth('login');
      if (onNotification) onNotification('संदेश भेजने के लिए कृपया पहले लॉगिन करें! 🔐');
      return;
    }

    const textToSend = messageInput.trim();
    let mediaUrl = null;
    let mediaType = null;
    let mediaName = null;

    if (selectedChatMedia) {
      mediaUrl = URL.createObjectURL(selectedChatMedia);
      mediaName = selectedChatMedia.name;
      if (selectedChatMedia.type.startsWith('video/')) mediaType = 'VIDEO';
      else if (selectedChatMedia.type === 'application/pdf') mediaType = 'DOCUMENT';
      else mediaType = 'IMAGE';
    }

    const newMsgObj = {
      id: `local-msg-${Date.now()}`,
      groupId: activeGroupId,
      senderId: currentUser.id,
      senderName: currentUser.name || 'सुनील केवट',
      senderGotra: currentUser.gotra || 'कश्यप',
      text: textToSend,
      mediaUrl,
      mediaType,
      mediaName,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    // Optimistically update message list
    setMessages((prev) => ({
      ...prev,
      [activeGroupId]: [...(prev[activeGroupId] || []), newMsgObj],
    }));

    const fileToUpload = selectedChatMedia;
    setMessageInput('');
    setSelectedChatMedia(null);
    if (mediaFileInputRef.current) mediaFileInputRef.current.value = '';

    // Emit via WebSocket
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send_message', newMsgObj);
    }

    // Persist via REST API (Multipart form if media attached)
    try {
      if (fileToUpload) {
        const formData = new FormData();
        if (textToSend) formData.append('messageText', textToSend);
        formData.append('media', fileToUpload);
        await sendGroupMessage(activeGroupId, formData);
      } else {
        await sendGroupMessage(activeGroupId, { messageText: textToSend });
      }
    } catch (err) {
      console.warn('Message send API error:', err.message);
    }
  };

  // Handle Add Member to Current Active Group
  const handleAddMember = async (member) => {
    setAddedMembersState((prev) => ({ ...prev, [member.id]: true }));

    // Increment member count in state
    setGroups((prev) =>
      prev.map((g) => (g.id === activeGroupId ? { ...g, membersCount: g.membersCount + 1 } : g))
    );

    // Add a system welcome message into the chat
    const systemMsg = {
      id: `system-${Date.now()}`,
      groupId: activeGroupId,
      senderId: 'system',
      senderName: 'सिस्टम सूचना',
      senderGotra: 'समाज',
      text: `👋 ${currentUser?.name || 'सदस्य'} ने ${member.name} को इस समूह में जोड़ा। हार्दिक स्वागत! 💐`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isMe: false,
    };

    setMessages((prev) => ({
      ...prev,
      [activeGroupId]: [...(prev[activeGroupId] || []), systemMsg],
    }));

    if (onNotification) {
      onNotification(`${member.name} को '${activeGroup.name}' में सफलतापूर्वक जोड़ा गया! 🎉`);
    }

    try {
      await addGroupMember(activeGroupId, member.id);
    } catch (e) {
      // Ignored
    }
  };

  // Handle Create New Group Submit
  const handleCreateGroupSubmit = async () => {
    if (!newGroupName.trim()) return;

    if (!isLoggedIn) {
      openAuth('login');
      return;
    }

    const newGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || 'समाज चर्चा समूह',
      membersCount: 1,
      icon: '🏛️',
      isMember: true,
    };

    setGroups((prev) => [newGroup, ...prev]);
    setActiveGroupId(newGroup.id);
    setCreateGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
    if (onNotification) onNotification(`'${newGroup.name}' समूह सफलतापूर्वक बनाया गया! 🎉`);

    try {
      await createGroup({ name: newGroupName.trim(), description: newGroupDesc.trim() });
    } catch (e) {
      // Handled
    }
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const activeMessages = (activeGroup && messages[activeGroup.id]) || [];

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const filteredDirectoryMembers = INITIAL_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.gotra.includes(memberSearch) ||
      m.city.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <Box>
      {/* Title Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            💬 समाज चौपाल व ग्रुप चर्चा (Community Chat)
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            स्वजातीय बंधुओं के साथ लाइव चर्चा, विचार-विमर्श, फोटो/वीडियो व मीडिया साझा करने का सीधा मंच
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            if (!isLoggedIn) {
              openAuth('login');
              if (onNotification) onNotification('नया ग्रुप बनाने के लिए कृपया पहले लॉगिन करें! 🔐');
              return;
            }
            setCreateGroupModal(true);
          }}
          sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' }, fontWeight: 700 }}
        >
          नया चर्चा समूह बनाएं (New Group)
        </Button>
      </Box>

      {/* Main Chat Layout Container */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          height: { xs: 'auto', md: '660px' },
        }}
      >
        {/* LEFT COLUMN: Groups List */}
        <Box
          sx={{
            width: { xs: '100%', md: '340px' },
            borderRight: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Group Search Bar */}
          <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="ग्रुप खोजें (Search Groups)..."
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Groups List Items */}
          <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
            {filteredGroups.map((grp) => {
              const isSelected = grp.id === activeGroupId;
              return (
                <ListItem key={grp.id} disablePadding>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleSelectGroup(grp.id)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderLeft: isSelected ? '4px solid #ea580c' : '4px solid transparent',
                      bgcolor: isSelected ? 'rgba(234, 88, 12, 0.08) !important' : 'inherit',
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: isSelected ? '#ea580c' : '#f1f5f9',
                          color: isSelected ? '#fff' : '#0f172a',
                          fontWeight: 800,
                        }}
                      >
                        {grp.icon || '💬'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                          {grp.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3 }}>
                          👥 {grp.membersCount} सदस्य • सक्रिय
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* RIGHT COLUMN: Active Chat Room Window */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', height: { xs: '540px', md: '100%' } }}>
          {/* Chat Room Header */}
          {activeGroup && (
            <Box
              sx={{
                p: 2,
                bgcolor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#ea580c', fontWeight: 700 }}>
                  {activeGroup.icon || '💬'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    {activeGroup.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    👥 {activeGroup.membersCount} सदस्य • {activeGroup.description}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="🟢 लाइव सक्रिय"
                  size="small"
                  sx={{ bgcolor: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', fontWeight: 700 }}
                />

                {/* ADD MEMBER BUTTON IN CHAT HEADER */}
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<AddMemberIcon />}
                  onClick={() => {
                    if (!isLoggedIn) {
                      openAuth('login');
                      if (onNotification) onNotification('सदस्य जोड़ने के लिए कृपया पहले लॉगिन करें! 🔐');
                      return;
                    }
                    setAddMemberModal(true);
                  }}
                  sx={{ fontWeight: 700, borderColor: '#ea580c', color: '#ea580c' }}
                >
                  + सदस्य जोड़ें (Add Member)
                </Button>
              </Box>
            </Box>
          )}

          {/* Messages Scroll Area */}
          <Box sx={{ flex: 1, p: 2.5, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {activeMessages.length === 0 ? (
              <Box sx={{ textAlign: 'center', my: 'auto', color: '#94a3b8' }}>
                <ChatIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2">इस समूह में अभी कोई संदेश नहीं है। पहला संदेश या फोटो भेजें!</Typography>
              </Box>
            ) : (
              activeMessages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: { xs: '88%', sm: '75%' },
                    alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  {/* Sender Header info (for incoming messages) */}
                  {!msg.isMe && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3, px: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        {msg.senderName}
                      </Typography>
                      {msg.senderGotra && (
                        <Chip
                          label={`गोत्र: ${msg.senderGotra}`}
                          size="small"
                          sx={{ fontSize: '0.65rem', height: 16, bgcolor: '#ffedd5', color: '#c2410c', fontWeight: 700 }}
                        />
                      )}
                    </Box>
                  )}

                  {/* Message Bubble */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: msg.isMe ? '#ea580c' : '#ffffff',
                      color: msg.isMe ? '#ffffff' : '#1e293b',
                      border: msg.isMe ? 'none' : '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Media in Chat Message */}
                    {msg.mediaUrl && (
                      <Box sx={{ mb: msg.text ? 1 : 0 }}>
                        {msg.mediaType === 'IMAGE' && (
                          <Box
                            component="img"
                            src={msg.mediaUrl}
                            alt="Chat image"
                            sx={{
                              width: '100%',
                              maxHeight: 240,
                              objectFit: 'cover',
                              borderRadius: 2,
                              display: 'block',
                            }}
                          />
                        )}
                        {msg.mediaType === 'VIDEO' && (
                          <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#000' }}>
                            <video
                              controls
                              src={msg.mediaUrl}
                              style={{ width: '100%', maxHeight: 240, display: 'block' }}
                            />
                          </Box>
                        )}
                        {msg.mediaType === 'DOCUMENT' && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              borderRadius: 1.5,
                              bgcolor: msg.isMe ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                            }}
                          >
                            <PdfIcon sx={{ color: msg.isMe ? '#fff' : '#ef4444' }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {msg.mediaName || 'दस्तावेज (PDF)'}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Text Message */}
                    {msg.text && (
                      <Typography variant="body2" sx={{ lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        mt: 0.5,
                        fontSize: '0.68rem',
                        color: msg.isMe ? 'rgba(255,255,255,0.85)' : '#94a3b8',
                      }}
                    >
                      {msg.time}
                    </Typography>
                  </Paper>
                </Box>
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Bottom Chat Input Form with Media Attachment */}
          <Box sx={{ p: 2, bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            {/* Hidden File Input for Media Upload in Chat */}
            <input
              type="file"
              ref={mediaFileInputRef}
              style={{ display: 'none' }}
              accept="image/*,video/*,application/pdf"
              onChange={handleMediaSelect}
            />

            {/* Attached Media Preview Chip */}
            {selectedChatMedia && (
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={
                    selectedChatMedia.type.startsWith('video/') ? (
                      <VideoIcon />
                    ) : selectedChatMedia.type === 'application/pdf' ? (
                      <PdfIcon />
                    ) : (
                      <ImageIcon />
                    )
                  }
                  label={`${selectedChatMedia.name} (${(selectedChatMedia.size / 1024).toFixed(0)} KB)`}
                  onDelete={handleRemoveMedia}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            )}

            {isLoggedIn ? (
              <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {/* Media Attachment Action Buttons */}
                <Tooltip title="फोटो या वीडियो संलग्न करें">
                  <IconButton
                    color="primary"
                    onClick={() => mediaFileInputRef.current?.click()}
                    sx={{ color: '#ea580c' }}
                  >
                    <ImageIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="दस्तावेज या PDF जोड़ें">
                  <IconButton
                    onClick={() => mediaFileInputRef.current?.click()}
                    sx={{ color: '#64748b' }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                </Tooltip>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="अपना संदेश लिखें (Type your message)..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  sx={{
                    bgcolor: '#ea580c',
                    '&:hover': { bgcolor: '#c2410c' },
                    px: 3,
                    py: 1,
                    fontWeight: 700,
                  }}
                >
                  भेजें
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#fff7ed',
                  border: '1px solid #fed7aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon sx={{ color: '#ea580c' }} />
                  <Typography variant="body2" sx={{ color: '#9a3412', fontWeight: 600 }}>
                    चर्चा में संदेश या मीडिया भेजने के लिए कृपया पहले लॉगिन करें।
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => openAuth('login')}
                  sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' }, fontWeight: 700 }}
                >
                  लॉगिन करें
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Card>

      {/* ============================================================== */}
      {/* ADD MEMBER TO GROUP DIALOG MODAL                               */}
      {/* ============================================================== */}
      <Dialog open={addMemberModal} onClose={() => setAddMemberModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>👥 समूह में नया सदस्य जोड़ें: {activeGroup?.name}</span>
          <IconButton onClick={() => setAddMemberModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            size="small"
            placeholder="नाम, गोत्र या शहर से सदस्य खोजें..."
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>
            समाज डायरेक्टरी से सदस्य चुनें:
          </Typography>

          <List sx={{ maxHeight: 340, overflowY: 'auto', p: 0 }}>
            {filteredDirectoryMembers.map((mem) => {
              const isAlreadyAdded = Boolean(addedMembersState[mem.id]);
              return (
                <ListItem
                  key={mem.id}
                  secondaryAction={
                    <Button
                      size="small"
                      variant={isAlreadyAdded ? 'outlined' : 'contained'}
                      color={isAlreadyAdded ? 'success' : 'primary'}
                      startIcon={isAlreadyAdded ? <CheckIcon /> : <AddIcon />}
                      onClick={() => handleAddMember(mem)}
                      disabled={isAlreadyAdded}
                      sx={{
                        bgcolor: isAlreadyAdded ? 'transparent' : '#ea580c',
                        '&:hover': { bgcolor: isAlreadyAdded ? 'transparent' : '#c2410c' },
                        fontWeight: 700,
                      }}
                    >
                      {isAlreadyAdded ? 'जुड़ गए' : '+ जोड़ें'}
                    </Button>
                  }
                  sx={{ borderBottom: '1px solid #f1f5f9', py: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1e293b', fontWeight: 700 }}>{mem.name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {mem.name}
                        </Typography>
                        <Chip
                          label={`गोत्र: ${mem.gotra}`}
                          size="small"
                          sx={{ fontSize: '0.68rem', height: 18, bgcolor: '#ffedd5', color: '#c2410c' }}
                        />
                      </Box>
                    }
                    secondary={`${mem.city}, ${mem.state} • ${mem.occupation}`}
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddMemberModal(false)} variant="contained">
            पूर्ण (Done)
          </Button>
        </DialogActions>
      </Dialog>

      {/* CREATE NEW DISCUSSION GROUP DIALOG */}
      <Dialog open={createGroupModal} onClose={() => setCreateGroupModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>नया समाज चर्चा समूह बनाएं</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            fullWidth
            label="समूह का नाम (Group Name)"
            placeholder="उदा. महेश्वर समाज मंडल या युवा खेल मंच"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="समूह का उद्देश्य / विवरण (Description)"
            placeholder="समूह के नियम व चर्चा का विषय..."
            value={newGroupDesc}
            onChange={(e) => setNewGroupDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateGroupModal(false)}>रद्द करें</Button>
          <Button
            variant="contained"
            onClick={handleCreateGroupSubmit}
            sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' }, fontWeight: 700 }}
          >
            समूह बनाएं
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
