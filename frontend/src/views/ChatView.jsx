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
  Alert,
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
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  Star as OwnerIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import {
  fetchGroups,
  fetchGroupMessages,
  sendGroupMessage,
  createGroup,
  addGroupMember,
  fetchGroupMembers,
  updateMemberRole,
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
  const [newMemberRoleToAssign, setNewMemberRoleToAssign] = useState('MEMBER'); // 'MEMBER' | 'ADMIN'

  // Group Members & Multiple Admins modal state
  const [groupMembersModal, setGroupMembersModal] = useState(false);
  const [groupMembersList, setGroupMembersList] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const chatContainerRef = useRef(null);
  const prevMessagesCountRef = useRef(0);
  const socketRef = useRef(null);

  // Scroll ONLY the chat box internally, NEVER scroll the browser window
  const scrollToBottom = (force = false) => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (force || isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Scroll chat on group change
  useEffect(() => {
    scrollToBottom(true);
  }, [activeGroupId]);

  const loadMessagesForGroup = async (groupId) => {
    if (!groupId || !isLoggedIn) return;
    try {
      const res = await fetchGroupMessages(groupId);
      if (res && res.data) {
        const apiMsgs = res.data.map((m) => ({
          id: m.id,
          groupId,
          senderId: m.senderId,
          senderName: m.sender?.profile
            ? `${m.sender.profile.firstName || ''} ${m.sender.profile.lastName || ''}`.trim()
            : 'सदस्य',
          senderGotra: m.sender?.profile?.samajGotra || 'कश्यप',
          text: m.messageText,
          mediaUrl: m.mediaUrl,
          mediaType: m.mediaType,
          time: new Date(m.createdAt).toLocaleTimeString('hi-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isMe: currentUser && m.senderId === currentUser.id,
        }));
        setMessages((prev) => ({ ...prev, [groupId]: apiMsgs }));
      }
    } catch (e) {
      // Keep existing local messages
    }
  };

  // Load all members and multiple admins of a group
  const loadGroupMembers = async (groupId) => {
    if (!groupId || !isLoggedIn) return;
    setIsLoadingMembers(true);
    try {
      const res = await fetchGroupMembers(groupId);
      if (res && res.data) {
        setGroupMembersList(res.data);
      }
    } catch (e) {
      console.warn('Fetch group members error:', e.message);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Refresh groups to keep roles in sync
  const refreshGroups = () => {
    if (!isLoggedIn) return;
    fetchGroups()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          const apiGroups = res.data.map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            membersCount: g._count?.members || 1,
            icon: g.name.includes('युवा') ? '💼' : g.name.includes('शिक्षा') ? '🎓' : '🌟',
            isMember: g.isMember,
            isAdmin: g.isAdmin,
            myRole: g.myRole,
          }));
          setGroups(apiGroups);
        }
      })
      .catch(() => {});
  };

  // Load groups from backend API
  useEffect(() => {
    if (!isLoggedIn) return;
    fetchGroups()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          const apiGroups = res.data.map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            membersCount: g._count?.members || 1,
            icon: g.name.includes('युवा') ? '💼' : g.name.includes('शिक्षा') ? '🎓' : '🌟',
            isMember: g.isMember,
            isAdmin: g.isAdmin,
            myRole: g.myRole,
          }));
          setGroups(apiGroups);
          setActiveGroupId((prev) => {
            const hasPrev = apiGroups.some((g) => g.id === prev);
            const targetId = hasPrev ? prev : apiGroups[0].id;
            loadMessagesForGroup(targetId);
            return targetId;
          });
        }
      })
      .catch((err) => {
        console.warn('Groups API using mock data:', err.message);
      });
  }, [isLoggedIn]);

  // Sync messages continuously every 2.5s or when active group / user changes
  useEffect(() => {
    if (!activeGroupId || !isLoggedIn) return;
    loadMessagesForGroup(activeGroupId);
    const interval = setInterval(() => {
      loadMessagesForGroup(activeGroupId);
    }, 2500);
    return () => clearInterval(interval);
  }, [activeGroupId, currentUser, isLoggedIn]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!isLoggedIn) return;
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
          loadMessagesForGroup(payload.groupId);
        }
      });

      socket.on('member_added', (payload) => {
        if (payload && payload.groupId) {
          loadMessagesForGroup(payload.groupId);
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
  }, [currentUser, activeGroupId, isLoggedIn]);

  // Handle Switching Groups
  const handleSelectGroup = (groupId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('leave_group', { groupId: activeGroupId });
      socketRef.current.emit('join_group', { groupId });
    }
    setActiveGroupId(groupId);
    loadMessagesForGroup(groupId);
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

    const activeGroup = (groups || []).find((g) => g.id === activeGroupId) || groups[0];
    const targetGroupId = activeGroup ? activeGroup.id : activeGroupId;

    const newMsgObj = {
      id: `local-msg-${Date.now()}`,
      groupId: targetGroupId,
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
      [targetGroupId]: [...(prev[targetGroupId] || []), newMsgObj],
    }));

    setTimeout(() => scrollToBottom(true), 50);

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
        await sendGroupMessage(targetGroupId, formData);
      } else {
        await sendGroupMessage(targetGroupId, { messageText: textToSend });
      }
      loadMessagesForGroup(targetGroupId);
    } catch (err) {
      console.warn('Message send API error:', err.message);
      if (onNotification) {
        onNotification('संदेश भेजने में समस्या: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Handle Add Member to Current Active Group (Admin only!)
  const handleAddMember = async (member, assignedRole = newMemberRoleToAssign) => {
    const activeGroup = (groups || []).find((g) => g.id === activeGroupId) || groups[0];
    const targetGroupId = activeGroup ? activeGroup.id : activeGroupId;

    if (!isCurrentUserAdmin) {
      if (onNotification) onNotification('केवल ग्रुप एडमिन ही इस समूह में नए सदस्य जोड़ सकते हैं! 🔐');
      return;
    }

    setAddedMembersState((prev) => ({ ...prev, [member.id]: true }));

    // Increment member count in state
    setGroups((prev) =>
      prev.map((g) => (g.id === targetGroupId ? { ...g, membersCount: g.membersCount + 1 } : g))
    );

    const isAddingAdmin = assignedRole === 'ADMIN';
    const roleLabel = isAddingAdmin ? 'ग्रुप एडमिन (Admin)' : 'सामान्य सदस्य';

    // Add a system welcome message into the chat
    const systemMsg = {
      id: `system-${Date.now()}`,
      groupId: targetGroupId,
      senderId: 'system',
      senderName: 'सिस्टम सूचना',
      senderGotra: 'समाज',
      text: isAddingAdmin
        ? `👑 ${currentUser?.name || 'एडमिन'} ने ${member.name} को इस समूह में नया ग्रुप एडमिन (Admin) बनाया! 🛡️💐`
        : `👋 ${currentUser?.name || 'एडमिन'} ने ${member.name} को इस समूह में जोड़ा। हार्दिक स्वागत! 💐`,
      time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
      isMe: false,
    };

    setMessages((prev) => ({
      ...prev,
      [targetGroupId]: [...(prev[targetGroupId] || []), systemMsg],
    }));

    if (onNotification) {
      onNotification(`${member.name} को '${roleLabel}' के रूप में सफलतापूर्वक जोड़ा गया! 🎉`);
    }

    // Persist to server
    try {
      await addGroupMember(targetGroupId, member.id, assignedRole);
      sendGroupMessage(targetGroupId, { messageText: systemMsg.text })
        .then(() => loadMessagesForGroup(targetGroupId))
        .catch(() => {});
      loadGroupMembers(targetGroupId);
    } catch (e) {
      console.warn('Add member API error:', e.message);
      if (onNotification) onNotification('सदस्य जोड़ने में त्रुटि: ' + (e.response?.data?.message || e.message));
    }
  };

  // Promote/Demote group member (Multiple admins management)
  const handleUpdateMemberRole = async (targetUserId, newRole) => {
    const activeGroup = (groups || []).find((g) => g.id === activeGroupId) || groups[0];
    const targetGroupId = activeGroup ? activeGroup.id : activeGroupId;

    try {
      await updateMemberRole(targetGroupId, targetUserId, newRole);
      const roleName = newRole === 'ADMIN' ? 'ग्रुप एडमिन (Admin)' : 'सामान्य सदस्य (Member)';
      if (onNotification) {
        onNotification(`भूमिका बदलकर '${roleName}' कर दी गई! 🛡️`);
      }
      loadGroupMembers(targetGroupId);
      refreshGroups();
    } catch (e) {
      if (onNotification) {
        onNotification('भूमिका बदलने में समस्या: ' + (e.response?.data?.message || e.message));
      }
    }
  };

  // Handle Create New Group Submit
  const handleCreateGroupSubmit = async () => {
    if (!newGroupName.trim()) return;

    if (!isLoggedIn) {
      openAuth('login');
      return;
    }

    const tempId = `group-${Date.now()}`;
    const newGroup = {
      id: tempId,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || 'समाज चर्चा समूह',
      membersCount: 1,
      icon: '🏛️',
      isMember: true,
      isAdmin: true,
      myRole: 'OWNER',
    };

    setGroups((prev) => [newGroup, ...prev]);
    setActiveGroupId(tempId);
    setCreateGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
    if (onNotification) onNotification(`'${newGroup.name}' समूह सफलतापूर्वक बनाया गया! 🎉`);

    try {
      const res = await createGroup({ name: newGroupName.trim(), description: newGroupDesc.trim() });
      if (res && res.data) {
        const serverGroup = {
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
          membersCount: 1,
          icon: '🏛️',
          isMember: true,
          isAdmin: true,
          myRole: 'OWNER',
        };
        setGroups((prev) => [serverGroup, ...prev.filter((g) => g.id !== tempId)]);
        setActiveGroupId(serverGroup.id);
        loadMessagesForGroup(serverGroup.id);
      }
    } catch (e) {
      console.warn('Group creation server error:', e.message);
    }
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const targetGroupId = activeGroup ? activeGroup.id : activeGroupId;
  const isCurrentUserAdmin = Boolean(
    activeGroup?.isAdmin ||
    activeGroup?.myRole === 'OWNER' ||
    activeGroup?.myRole === 'ADMIN' ||
    currentUser?.mobileNumber === '9876543210' // Sunil Kewat
  );

  // Load group members whenever active group changes
  useEffect(() => {
    if (targetGroupId && isLoggedIn) {
      loadGroupMembers(targetGroupId);
    }
  }, [targetGroupId, isLoggedIn]);

  const activeMessages = (activeGroup && messages[activeGroup.id]) || [];

  // Scroll chat box down ONLY if new messages arrive AND user is already viewing the bottom
  useEffect(() => {
    const currentCount = activeMessages.length;
    if (currentCount > prevMessagesCountRef.current) {
      scrollToBottom(false);
    }
    prevMessagesCountRef.current = currentCount;
  }, [activeMessages.length]);

  const filteredGroups = (groups || []).filter((g) =>
    (g?.name || '').toLowerCase().includes((groupSearch || '').toLowerCase())
  );

  const filteredDirectoryMembers = (INITIAL_MEMBERS || []).filter(
    (m) =>
      (m?.name || '').toLowerCase().includes((memberSearch || '').toLowerCase()) ||
      (m?.gotra || '').includes(memberSearch || '') ||
      (m?.city || '').toLowerCase().includes((memberSearch || '').toLowerCase())
  );

  // If user is not logged in, show beautiful locked screen ensuring chat privacy
  if (!isLoggedIn) {
    return (
      <Box sx={{ py: { xs: 2, md: 3 } }}>
        {/* Title Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
            💬 समाज चौपाल व ग्रुप चर्चा (Community Chat)
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            स्वजातीय बंधुओं के साथ लाइव चर्चा, विचार-विमर्श, फोटो/वीडियो व मीडिया साझा करने का सीधा मंच
          </Typography>
        </Box>

        {/* Security / Login Lock Card */}
        <Card
          sx={{
            maxWidth: 680,
            mx: 'auto',
            borderRadius: 4,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
            border: '1px solid #fed7aa',
            background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
            p: { xs: 3, sm: 5 },
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#ffedd5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
              boxShadow: '0 8px 20px rgba(234, 88, 12, 0.18)',
            }}
          >
            <LockIcon sx={{ fontSize: 44, color: '#ea580c' }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#9a3412', mb: 1.5 }}>
            समाज चौपाल केवल पंजीकृत सदस्यों के लिए सुरक्षित है
          </Typography>

          <Typography variant="body1" sx={{ color: '#475569', mb: 3.5, lineHeight: 1.7, maxWidth: 540, mx: 'auto' }}>
            स्वजातीय बंधुओं की आपसी बातचीत, परिवारिक संदेश व विभिन्न प्रकोष्ठों (युवा, शिक्षा, महिला) के ग्रुप्स की गोपनीयता बनाए रखने हेतु चैट केवल <strong>लॉगिन किए हुए सदस्यों</strong> के लिए ही उपलब्ध है।
          </Typography>

          {/* Feature Highlights Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              gap: 2,
              mb: 4,
              textAlign: 'left',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: '#ffffff',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <ShieldIcon sx={{ color: '#16a34a', fontSize: 24, mt: 0.2 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  100% सुरक्षित
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  केवल समाज बंधुओं के लिए निजी संवाद
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: '#ffffff',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <GroupIcon sx={{ color: '#0284c7', fontSize: 24, mt: 0.2 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  प्रकोष्ठ ग्रुप्स
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  शिक्षा, युवा व सामाजिक समूह
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: '#ffffff',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <ChatIcon sx={{ color: '#ea580c', fontSize: 24, mt: 0.2 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  लाइव चर्चा
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  फ़ोटो, वीडियो व ऑडियो शेयरिंग
                </Typography>
              </Box>
            </Paper>
          </Box>

          <Divider sx={{ mb: 3.5 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => openAuth('login')}
              sx={{
                bgcolor: '#ea580c',
                '&:hover': { bgcolor: '#c2410c' },
                fontWeight: 700,
                px: 4,
                py: 1.3,
                borderRadius: 2.5,
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
              }}
            >
              🔐 लॉगिन करें (Login Now)
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => openAuth('register')}
              sx={{
                color: '#ea580c',
                borderColor: '#ea580c',
                '&:hover': { borderColor: '#c2410c', bgcolor: '#fff7ed' },
                fontWeight: 700,
                px: 3.5,
                py: 1.3,
                borderRadius: 2.5,
                fontSize: '1rem',
              }}
            >
              ✨ नया पंजीकरण (Register)
            </Button>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 2.5, color: '#94a3b8' }}>
            यदि आपका खाता पहले से नहीं है, तो मात्र 1 मिनट में निःशुल्क पंजीकरण कर सकते हैं।
          </Typography>
        </Card>
      </Box>
    );
  }

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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {isCurrentUserAdmin ? (
                  <Chip
                    icon={<AdminIcon sx={{ fontSize: '15px !important', color: '#b45309 !important' }} />}
                    label="🛡️ ग्रुप एडमिन"
                    size="small"
                    sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 800, border: '1px solid #fde68a' }}
                  />
                ) : (
                  <Chip
                    label="👤 सदस्य"
                    size="small"
                    sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600 }}
                  />
                )}

                {/* VIEW GROUP MEMBERS & MULTIPLE ADMINS BUTTON */}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PeopleIcon />}
                  onClick={() => {
                    loadGroupMembers(targetGroupId);
                    setGroupMembersModal(true);
                  }}
                  sx={{ fontWeight: 700, borderColor: '#cbd5e1', color: '#334155' }}
                >
                  सदस्य व एडमिन ({activeGroup.membersCount || 2})
                </Button>

                {/* ADD MEMBER BUTTON IN CHAT HEADER (ADMIN ONLY) */}
                <Tooltip title={!isCurrentUserAdmin ? 'केवल ग्रुप एडमिन ही सदस्य जोड़ सकते हैं' : ''}>
                  <span>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddMemberIcon />}
                      disabled={!isCurrentUserAdmin}
                      onClick={() => {
                        if (!isLoggedIn) {
                          openAuth('login');
                          if (onNotification) onNotification('सदस्य जोड़ने के लिए कृपया पहले लॉगिन करें! 🔐');
                          return;
                        }
                        if (!isCurrentUserAdmin) {
                          if (onNotification) onNotification('केवल ग्रुप एडमिन ही इस समूह में नए सदस्य जोड़ सकते हैं! 🔐');
                          return;
                        }
                        setAddMemberModal(true);
                      }}
                      sx={{
                        fontWeight: 700,
                        bgcolor: isCurrentUserAdmin ? '#ea580c' : '#cbd5e1',
                        '&:hover': { bgcolor: isCurrentUserAdmin ? '#c2410c' : '#cbd5e1' },
                      }}
                    >
                      + सदस्य जोड़ें (Add Member)
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          )}

          {/* Messages Scroll Area */}
          <Box
            ref={chatContainerRef}
            sx={{ flex: 1, p: 2.5, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}
          >
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
          {/* Role selector for added member */}
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              bgcolor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                जोड़ने पर भूमिका (Assign Role):
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {newMemberRoleToAssign === 'ADMIN' ? '🛡️ नया सदस्य ग्रुप एडमिन (Admin) बनेगा' : '👤 सामान्य सदस्य के रूप में जुड़ेगा'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                clickable
                onClick={() => setNewMemberRoleToAssign('MEMBER')}
                label="👤 सामान्य सदस्य"
                color={newMemberRoleToAssign === 'MEMBER' ? 'primary' : 'default'}
                variant={newMemberRoleToAssign === 'MEMBER' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 700 }}
              />
              <Chip
                clickable
                onClick={() => setNewMemberRoleToAssign('ADMIN')}
                label="🛡️ ग्रुप एडमिन (Admin)"
                color={newMemberRoleToAssign === 'ADMIN' ? 'warning' : 'default'}
                variant={newMemberRoleToAssign === 'ADMIN' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 700 }}
              />
            </Box>
          </Box>

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

          <List sx={{ maxHeight: 320, overflowY: 'auto', p: 0 }}>
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
                      onClick={() => handleAddMember(mem, newMemberRoleToAssign)}
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

      {/* ============================================================== */}
      {/* GROUP MEMBERS & MULTIPLE ADMINS LIST MODAL                     */}
      {/* ============================================================== */}
      <Dialog
        open={groupMembersModal}
        onClose={() => setGroupMembersModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ color: '#ea580c' }} />
            <span>समूह सदस्य व एडमिन सूची ({activeGroup?.name})</span>
          </Box>
          <IconButton onClick={() => setGroupMembersModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            <strong>मल्टीपल एडमिन सुविधा:</strong> इस समूह में एक से अधिक एडमिन (Multiple Admins) हो सकते हैं। सभी एडमिन नए सदस्यों को जोड़ने और ग्रुप प्रबंधन का पूर्ण अधिकार रखते हैं।
          </Alert>

          {isLoadingMembers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                सदस्य सूची लोड हो रही है...
              </Typography>
            </Box>
          ) : groupMembersList.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center', color: '#64748b' }}>
              <Typography variant="body2">
                इस समूह में वर्तमान में सदस्य सक्रिय हैं।
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {groupMembersList.map((m) => {
                const isOwner = m.role === 'OWNER';
                const isAdmin = m.role === 'ADMIN' || isOwner;
                return (
                  <ListItem
                    key={m.id}
                    sx={{
                      py: 1.5,
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: isOwner ? '#7c3aed' : isAdmin ? '#ea580c' : '#1e293b', fontWeight: 700 }}>
                        {m.name ? m.name[0] : 'U'}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {m.name}
                          </Typography>
                          {isOwner && (
                            <Chip
                              icon={<OwnerIcon sx={{ fontSize: '13px !important', color: '#fff !important' }} />}
                              label="👑 मुख्य संस्थापक"
                              size="small"
                              sx={{ bgcolor: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: '0.68rem', height: 20 }}
                            />
                          )}
                          {!isOwner && isAdmin && (
                            <Chip
                              icon={<AdminIcon sx={{ fontSize: '13px !important', color: '#b45309 !important' }} />}
                              label="🛡️ ग्रुप एडमिन"
                              size="small"
                              sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 700, fontSize: '0.68rem', height: 20, border: '1px solid #fde68a' }}
                            />
                          )}
                          {!isAdmin && (
                            <Chip
                              label="👤 सदस्य"
                              size="small"
                              sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '0.68rem', height: 20 }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          गोत्र: {m.gotra || 'केवट'} {m.city ? `• ${m.city}` : ''}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Role Promotion/Demotion button - accessible to current admins */}
                    {isCurrentUserAdmin && !isOwner && m.userId !== currentUser?.id && (
                      <Box>
                        {isAdmin ? (
                          <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            onClick={() => handleUpdateMemberRole(m.userId, 'MEMBER')}
                            sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                          >
                            एडमिन हटाएं
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            color="warning"
                            startIcon={<ShieldIcon />}
                            onClick={() => handleUpdateMemberRole(m.userId, 'ADMIN')}
                            sx={{ fontSize: '0.75rem', fontWeight: 700, bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}
                          >
                            🛡️ एडमिन बनाएं
                          </Button>
                        )}
                      </Box>
                    )}
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setGroupMembersModal(false)} variant="contained">
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
