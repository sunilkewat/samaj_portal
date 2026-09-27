export const INITIAL_MEMBERS = [
  { id: '1', name: 'सुनील केवट (Sunil Kewat)', gotra: 'कश्यप', city: 'Indore', state: 'MP', occupation: 'Software Engineer', bloodGroup: 'O+', verified: true, phone: '+91 98765 43210' },
  { id: '2', name: 'राजेश केवट (Rajesh Kewat)', gotra: 'भारद्वाज', city: 'Bhopal', state: 'MP', occupation: 'Business Owner', bloodGroup: 'B+', verified: true, phone: '+91 98222 11223' },
  { id: '3', name: 'विकास केवट (Vikas Kewat)', gotra: 'शांडिल्य', city: 'Jabalpur', state: 'MP', occupation: 'Govt. Teacher', bloodGroup: 'A+', verified: true, phone: '+91 97555 44332' },
  { id: '4', name: 'दीपक केवट (Deepak Kewat)', gotra: 'कश्यप', city: 'Mumbai', state: 'MH', occupation: 'Chartered Accountant', bloodGroup: 'AB+', verified: false, phone: '+91 91234 56789' },
  { id: '5', name: 'अमित केवट (Amit Kewat)', gotra: 'वशिष्ठ', city: 'Delhi', state: 'DL', occupation: 'Civil Engineer', bloodGroup: 'O-', verified: true, phone: '+91 94000 88776' },
];

export const INITIAL_MATRIMONIAL = [
  { id: 'm1', name: 'डॉ. अंजलि केवट', gender: 'Female', age: 26, height: "5'4\"", education: 'MBBS, MD', occupation: 'Resident Doctor', city: 'Indore, MP', gotra: 'भारद्वाज', photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&auto=format&fit=crop&q=60' },
  { id: 'm2', name: 'इंजी. राहुल केवट', gender: 'Male', age: 28, height: "5'10\"", education: 'B.Tech (CS)', occupation: 'Senior Tech Lead, MNC', city: 'Pune / Indore', gotra: 'कश्यप', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60' },
  { id: 'm3', name: 'पूजा केवट', gender: 'Female', age: 24, height: "5'2\"", education: 'M.Com, B.Ed', occupation: 'School Lecturer', city: 'Bhopal, MP', gotra: 'शांडिल्य', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60' },
];

export const INITIAL_POSTS = [
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

export const INITIAL_EVENTS = [
  {
    id: 'ev-1',
    category: 'वार्षिक उत्सव',
    title: 'महाकुंभ व युवक-युवती परिचय सम्मेलन 2026',
    date: '15 नवंबर 2026',
    venue: 'श्री गुजराती समाज परिसर, इंदौर (म.प्र.)',
    description: 'इस महाआयोजन में देश भर से स्वजातीय बंधु सादर आमंत्रित हैं। परिचय स्मारिका का विमोचन व सामूहिक स्नेह भोज।',
  },
];

export const INITIAL_GROUPS = [
  {
    id: 'group-1',
    name: '🌟 मुख्य समाज चौपाल (General Discussion)',
    description: 'समस्त समाज बंधुओं की खुली चर्चा, सामान्य विचार विमर्श एवं सामाजिक सुझाव मंच।',
    membersCount: 1420,
    icon: '🏛️',
    isMember: true,
  },
  {
    id: 'group-2',
    name: '💼 युवा प्रकोष्ठ व रोजगार मंच (Youth & Career)',
    description: 'करियर मार्गदर्शन, सरकारी व प्राइवेट जॉब अलर्ट, स्किल ट्रेनिंग और स्टार्टअप चर्चा।',
    membersCount: 680,
    icon: '💼',
    isMember: true,
  },
  {
    id: 'group-3',
    name: '🎓 शिक्षा व छात्रवृत्ति मंच (Education Wing)',
    description: 'मेधावी छात्र-छात्राओं के लिए प्रतियोगी परीक्षाएं, छात्रवृत्ति व कोचिंग मार्गदर्शन।',
    membersCount: 430,
    icon: '📚',
    isMember: false,
  },
  {
    id: 'group-4',
    name: '🩸 स्वास्थ्य व रक्तदान सेवा (Emergency Seva)',
    description: 'इमरजेंसी रक्त आवश्यकता, चिकित्सा सहायता और सामाजिक स्वास्थ्य परामर्श।',
    membersCount: 950,
    icon: '🩸',
    isMember: true,
  },
];

export const INITIAL_MESSAGES = {
  'group-1': [
    {
      id: 'm-1',
      senderId: 'user-admin',
      senderName: 'राजेश केवट (कार्यकारिणी सदस्य)',
      senderGotra: 'भारद्वाज',
      text: 'सादर जय समाज! आगामी 15 नवंबर के वार्षिक सम्मेलन की तैयारियां जोरों पर हैं।',
      time: '10:30 AM',
      isMe: false,
    },
    {
      id: 'm-2',
      senderId: 'user-2',
      senderName: 'विकास केवट',
      senderGotra: 'शांडिल्य',
      text: 'जय समाज! क्या इस बार भी मेधावी छात्रों को छात्रवृत्ति प्रमाण पत्र दिए जाएंगे?',
      time: '10:45 AM',
      isMe: false,
    },
    {
      id: 'm-3',
      senderId: 'af0e2307-527b-4ff2-827b-3767f68fb979',
      senderName: 'सुनील केवट (Sunil Kewat)',
      senderGotra: 'कश्यप',
      text: 'हाँ बिल्कुल, 85% से अधिक अंक पाने वाले सभी छात्र-छात्राओं का मंच पर विशेष सम्मान होगा।',
      time: '11:02 AM',
      isMe: true,
    },
  ],
  'group-2': [
    {
      id: 'm-201',
      senderId: 'user-young-1',
      senderName: 'अमित केवट (सिविल इंजीनियर)',
      senderGotra: 'वशिष्ठ',
      text: 'इंदौर व भोपाल में सिविल और आईटी फ्रेशर्स के लिए कुछ नौकरियां खुली हैं, जरूरतमंद युवा संपर्क करें।',
      time: 'कल 4:15 PM',
      isMe: false,
    },
  ],
};

export const INITIAL_DIRECT_CHATS = [
  {
    id: 'dm-sapna-batham',
    targetUserId: 'sapna-batham',
    name: 'सपना बाथम (Sapna Batham)',
    gotra: 'कश्यप',
    city: 'Indore',
    avatar: 'S',
    avatarColor: '#ec4899',
    online: true,
    lastSeen: 'सक्रिय (Online)',
    lastMessage: 'जय समाज सुनील भैया! मुझे शिक्षा प्रकोष्ठ के छात्रवृत्ति फॉर्म की जानकारी चाहिए थी।',
    lastMessageTime: '02:45 AM',
    unreadCount: 1,
  },
  {
    id: 'dm-rajesh-kewat',
    targetUserId: '2',
    name: 'राजेश केवट (Rajesh Kewat)',
    gotra: 'भारद्वाज',
    city: 'Bhopal',
    avatar: 'R',
    avatarColor: '#0284c7',
    online: false,
    lastSeen: '10 मिनट पहले',
    lastMessage: 'सुनील जी, आगामी समाज कार्यकारिणी बैठक का एजेंडा फाइनल हो गया है।',
    lastMessageTime: 'कल 08:30 PM',
    unreadCount: 0,
  },
  {
    id: 'dm-vikas-kewat',
    targetUserId: '3',
    name: 'विकास केवट (Vikas Kewat)',
    gotra: 'शांडिल्य',
    city: 'Jabalpur',
    avatar: 'V',
    avatarColor: '#16a34a',
    online: true,
    lastSeen: 'सक्रिय (Online)',
    lastMessage: 'छात्रवृत्ति आवेदन की अंतिम तिथि कब तक है?',
    lastMessageTime: '11:15 AM',
    unreadCount: 0,
  },
];

export const INITIAL_DIRECT_MESSAGES = {
  'dm-sapna-batham': [
    {
      id: 'dm-msg-1',
      senderId: 'sapna-batham',
      senderName: 'सपना बाथम',
      senderGotra: 'कश्यप',
      text: 'जय समाज सुनील भैया! सादर प्रणाम 🙏',
      time: '02:40 AM',
      isMe: false,
    },
    {
      id: 'dm-msg-2',
      senderId: 'af0e2307-527b-4ff2-827b-3767f68fb979',
      senderName: 'सुनील केवट',
      senderGotra: 'कश्यप',
      text: 'जय समाज सपना जी! सब कुशल मंगल? बताइये किस प्रकार सहयोग कर सकते हैं।',
      time: '02:42 AM',
      isMe: true,
    },
    {
      id: 'dm-msg-3',
      senderId: 'sapna-batham',
      senderName: 'सपना बाथम',
      senderGotra: 'कश्यप',
      text: 'भैया, मुझे शिक्षा प्रकोष्ठ के छात्रवृत्ति फॉर्म की जानकारी चाहिए थी, कृपया मार्गदर्शन दें।',
      time: '02:45 AM',
      isMe: false,
    },
  ],
  'dm-rajesh-kewat': [
    {
      id: 'dm-msg-r1',
      senderId: '2',
      senderName: 'राजेश केवट',
      senderGotra: 'भारद्वाज',
      text: 'सुनील जी, आगामी समाज कार्यकारिणी बैठक का एजेंडा फाइनल हो गया है।',
      time: '08:30 PM',
      isMe: false,
    },
  ],
  'dm-vikas-kewat': [
    {
      id: 'dm-msg-v1',
      senderId: '3',
      senderName: 'विकास केवट',
      senderGotra: 'शांडिल्य',
      text: 'छात्रवृत्ति आवेदन की अंतिम तिथि कब तक है?',
      time: '11:15 AM',
      isMe: false,
    },
  ],
};

// ============================================================================
// COMPLETE MULTI-TENANT ISOLATED DATASETS (Kewat, Patidar, Rajput, Yadav)
// ============================================================================
export const MULTI_TENANT_DATA = {
  kewat: {
    members: INITIAL_MEMBERS,
    matrimonial: INITIAL_MATRIMONIAL,
    posts: INITIAL_POSTS,
    groups: INITIAL_GROUPS,
    messages: INITIAL_MESSAGES,
    directChats: INITIAL_DIRECT_CHATS,
    directMessages: INITIAL_DIRECT_MESSAGES,
    events: INITIAL_EVENTS,
    testUsers: [
      { name: 'सुनील केवट (व्यवस्थापक / Admin)', mobile: '9876543210', pass: 'Admin@123456', role: 'ADMIN', gotra: 'कश्यप' },
      { name: 'राजेश केवट (वरिष्ठ सदस्य)', mobile: '9822211223', pass: 'Member@123', role: 'MEMBER', gotra: 'भारद्वाज' },
    ],
  },
  patidar: {
    members: [
      { id: 'pat-1', name: 'हार्दिक पटेल (Hardik Patel)', gotra: 'लेवा', city: 'Ahmedabad', state: 'GJ', occupation: 'Industrialist', bloodGroup: 'B+', verified: true, phone: '+91 98250 11223' },
      { id: 'pat-2', name: 'रमेश भाई पाटीदार (Ramesh Patidar)', gotra: 'कड़वा', city: 'Ujjain', state: 'MP', occupation: 'Agro Exports', bloodGroup: 'O+', verified: true, phone: '+91 94250 22334' },
      { id: 'pat-3', name: 'डॉ. अंकिता पटेल (Dr. Ankita Patel)', gotra: 'धनोतिया', city: 'Indore', state: 'MP', occupation: 'Pediatrician', bloodGroup: 'A+', verified: true, phone: '+91 98930 33445' },
      { id: 'pat-4', name: 'जिग्नेश पटेल (Jignesh Patel)', gotra: 'चावड़ा', city: 'Surat', state: 'GJ', occupation: 'Software Architect', bloodGroup: 'O-', verified: true, phone: '+91 99090 44556' },
      { id: 'pat-5', name: 'महेन्द्र पाटीदार (Mahendra Patidar)', gotra: 'राठौड़', city: 'Dhar', state: 'MP', occupation: 'Educationist', bloodGroup: 'AB+', verified: true, phone: '+91 97520 55667' },
    ],
    matrimonial: [
      { id: 'pat-m1', name: 'चि. मयंक पटेल', gender: 'Male', age: 28, height: "5'11\"", education: 'M.S. Data Science, USA', occupation: 'Cloud Architect', city: 'Ahmedabad / Pune', gotra: 'लेवा', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60' },
      { id: 'pat-m2', name: 'सौ. कां. पूजा पाटीदार', gender: 'Female', age: 25, height: "5'4\"", education: 'Chartered Accountant (CA)', occupation: 'Finance Lead, MNC', city: 'Indore, MP', gotra: 'कड़वा', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60' },
      { id: 'pat-m3', name: 'चि. भाविन पटेल', gender: 'Male', age: 29, height: "5'9\"", education: 'B.E. Mechanical, MBA', occupation: 'Family Business Owner', city: 'Surat, GJ', gotra: 'धनोतिया', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60' },
    ],
    posts: [
      {
        id: 'pat-p1',
        author: 'पाटीदार समाज केंद्रीय ट्रस्ट',
        authorGotra: 'माँ उमिया धाम',
        authorCity: 'Ujjain / Unjha',
        role: 'Official Notice',
        time: '3 घंटे पहले',
        content: '🚩 जय उमिया माँ! पाटीदार समाज के 25वें राष्ट्रीय महासम्मेलन व शिक्षा गौरव सम्मान 2026 की घोषणा। मेधावी छात्र-छात्राओं को समाज छात्रवृत्ति प्रदान की जाएगी।',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        media: [],
        likes: 184,
        comments: 32,
        isLiked: false,
        isPinned: true,
      },
      {
        id: 'pat-p2',
        author: 'रमेश भाई पाटीदार',
        authorGotra: 'कड़वा',
        authorCity: 'Ujjain',
        role: 'संरक्षक, कृषि प्रकोष्ठ',
        time: 'कल शाम',
        content: '🌱 उन्नत जैविक खेती व कृषि निर्यात पर पाटीदार कृषक संगोष्ठी आगामी रविवार को उमिया पाटीदार धर्मशाला में आयोजित की जाएगी। सभी स्वजातीय बंधु सादर आमंत्रित हैं।',
        youtubeUrl: null,
        media: [
          {
            id: 'pat-med-1',
            mediaType: 'IMAGE',
            fileUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=60',
          },
        ],
        likes: 92,
        comments: 18,
        isLiked: false,
        isPinned: false,
      },
    ],
    groups: [
      { id: 'pat-grp-1', name: '🏛️ पाटीदार मुख्य कार्यकारिणी मंच', description: 'समाज के वरिष्ठ प्रबुद्धजन व पदाधिकारी परिचर्चा', membersCount: 154, icon: '🏛️', isMember: true, isAdmin: true, myRole: 'OWNER' },
      { id: 'pat-grp-2', name: '🌟 पाटीदार युवा उद्यमी संगठन', description: 'व्यवसाय, स्टार्टअप और युवा स्वरोजगार मंच', membersCount: 98, icon: '💼', isMember: true, isAdmin: false, myRole: 'MEMBER' },
      { id: 'pat-grp-3', name: '📚 उमिया शिक्षा व करियर प्रकोष्ठ', description: 'सिविल सर्विसेज, उच्च शिक्षा व छात्रवृत्ति मार्गदर्शन', membersCount: 240, icon: '🎓', isMember: true, isAdmin: false, myRole: 'MEMBER' },
    ],
    messages: {
      'pat-grp-1': [
        { id: 'pat-m-1', text: 'जय उमिया माँ! आगामी पाटीदार समाज सम्मेलन 2026 की तैयारी बैठक आज शाम 7 बजे है।', senderName: 'हार्दिक पटेल', senderGotra: 'लेवा', time: '10:00 AM', isMe: true },
        { id: 'pat-m-2', text: 'उज्जैन व इंदौर कार्यकारिणी के सभी सदस्य समय पर उपस्थित रहेंगे।', senderName: 'रमेश भाई पाटीदार', senderGotra: 'कड़वा', time: '10:15 AM', isMe: false },
      ],
      'pat-grp-2': [
        { id: 'pat-m-3', text: 'युवा स्टार्टअप एक्सपो का नया ब्रोशर तैयार हो गया है!', senderName: 'जिग्नेश पटेल', senderGotra: 'चावड़ा', time: '11:00 AM', isMe: false },
      ],
      'pat-grp-3': [
        { id: 'pat-m-4', text: 'UPSC और GPSC की निःशुल्क कोचिंग कक्षाएं अगले माह से शुरू हो रही हैं।', senderName: 'डॉ. अंकिता पटेल', senderGotra: 'धनोतिया', time: '09:30 AM', isMe: false },
      ],
    },
    directChats: [
      { id: 'dm-pat-ramesh', targetUserId: 'pat-2', name: 'रमेश भाई पाटीदार', gotra: 'कड़वा', city: 'Ujjain', phone: '+91 94250 22334', isOnline: true, unreadCount: 1 },
      { id: 'dm-pat-ankita', targetUserId: 'pat-3', name: 'डॉ. अंकिता पटेल', gotra: 'धनोतिया', city: 'Indore', phone: '+91 98930 33445', isOnline: true, unreadCount: 0 },
    ],
    directMessages: {
      'dm-pat-ramesh': [
        { id: 'dm-msg-p1', text: 'जय उमिया माँ रमेश भाई, धर्मशाला निर्माण का कार्य सुचारु रूप से चल रहा है।', senderName: 'हार्दिक पटेल', time: '08:30 AM', isMe: true },
        { id: 'dm-msg-p2', text: 'हाँ हार्दिक जी, अगले सप्ताह ट्रस्ट की समीक्षा बैठक रखी गई है।', senderName: 'रमेश भाई पाटीदार', time: '08:45 AM', isMe: false },
      ],
      'dm-pat-ankita': [
        { id: 'dm-msg-p3', text: 'नमस्ते डॉक्टर साहिबा, आगामी स्वास्थ्य शिविर में समाज के डॉक्टरों का दल तैयार है।', senderName: 'हार्दिक पटेल', time: '10:00 AM', isMe: true },
        { id: 'dm-msg-p4', text: 'जी बिल्कुल, 10 विशेषज्ञ डॉक्टरों की टीम सेवा देगी।', senderName: 'डॉ. अंकिता पटेल', time: '10:10 AM', isMe: false },
      ],
    },
    events: [
      { id: 'pat-ev-1', title: 'माँ उमिया पाटीदार पाटोत्सव व स्नेह मिलन', date: '2026-11-20', location: 'उमिया धाम, इंदौर रोड, उज्जैन', time: '10:00 AM', attendees: 850, category: 'सांस्कृतिक' },
      { id: 'pat-ev-2', title: 'अखिल भारतीय पाटीदार युवक-युवती परिचय सम्मेलन', date: '2026-12-14', location: 'पाटीदार ऑडिटोरियम, अहमदाबाद', time: '09:00 AM', attendees: 1200, category: 'वैवाहिक' },
    ],
    testUsers: [
      { name: 'हार्दिक पटेल (व्यवस्थापक / Admin)', mobile: '9825011223', pass: 'Admin@123456', role: 'ADMIN', gotra: 'लेवा' },
      { name: 'रमेश भाई पाटीदार (संरक्षक सदस्य)', mobile: '9425022334', pass: 'Member@123', role: 'MEMBER', gotra: 'कड़वा' },
    ],
  },
  rajput: {
    members: [
      { id: 'raj-1', name: 'कुँवर विक्रम सिंह राठौड़ (Vikram Singh Rathore)', gotra: 'राठौड़', city: 'Jaipur', state: 'RJ', occupation: 'Real Estate Developer', bloodGroup: 'O+', verified: true, phone: '+91 94140 11223' },
      { id: 'raj-2', name: 'भानुप्रताप सिंह चौहान (Bhanu Pratap Singh)', gotra: 'चौहान', city: 'Bhopal', state: 'MP', occupation: 'Advocate, High Court', bloodGroup: 'B+', verified: true, phone: '+91 98270 22334' },
      { id: 'raj-3', name: 'मेजर रणवीर सिंह सिसौदिया (Ranveer Singh)', gotra: 'सिसौदिया', city: 'Udaipur', state: 'RJ', occupation: 'Retired Indian Army', bloodGroup: 'A+', verified: true, phone: '+91 94145 33445' },
      { id: 'raj-4', name: 'डॉ. दिव्या राठौड़ (Dr. Divya Rathore)', gotra: 'राठौड़', city: 'Indore', state: 'MP', occupation: 'Surgeon', bloodGroup: 'AB+', verified: true, phone: '+91 98260 44556' },
      { id: 'raj-5', name: 'हर्षवर्धन सिंह परमार (Harshvardhan Parmar)', gotra: 'परमार', city: 'Gwalior', state: 'MP', occupation: 'Automobile Business', bloodGroup: 'O-', verified: true, phone: '+91 97520 55667' },
    ],
    matrimonial: [
      { id: 'raj-m1', name: 'कुँवर जयराज सिंह चौहान', gender: 'Male', age: 29, height: "6'1\"", education: 'B.Tech, MBA (IIM)', occupation: 'Investment Banker', city: 'Jaipur / Mumbai', gotra: 'चौहान', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60' },
      { id: 'raj-m2', name: 'बाईसा शिवांगी सिसौदिया', gender: 'Female', age: 26, height: "5'6\"", education: 'M.Sc Biotechnology', occupation: 'Research Scientist', city: 'Udaipur / Delhi', gotra: 'सिसौदिया', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60' },
      { id: 'raj-m3', name: 'कुँवर दिग्विजय सिंह तोमर', gender: 'Male', age: 28, height: "5'11\"", education: 'LLB, LLM', occupation: 'Advocate & Legal Advisor', city: 'Bhopal, MP', gotra: 'तोमर', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60' },
    ],
    posts: [
      {
        id: 'raj-p1',
        author: 'राजपूत महासभा केंद्रीय समिति',
        authorGotra: 'क्षत्रिय परिषद',
        authorCity: 'Jaipur',
        role: 'Official Notice',
        time: '4 घंटे पहले',
        content: '⚔️ जय महाराणा! आगामी शौर्य दिवस एवं क्षत्रिय प्रतिभा अलंकरण समारोह 2026 की तैयारियाँ शुरू। वीर शिरोमणि महाराणा प्रताप की स्मृति में विशाल व्याख्यानमाला होगी।',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        media: [],
        likes: 245,
        comments: 42,
        isLiked: false,
        isPinned: true,
      },
      {
        id: 'raj-p2',
        author: 'मेजर रणवीर सिंह सिसौदिया',
        authorGotra: 'सिसौदिया',
        authorCity: 'Udaipur',
        role: 'मार्गदर्शक, रक्षा प्रकोष्ठ',
        time: 'कल',
        content: '🛡️ समाज के युवाओं के लिए एनडीए (NDA) एवं सीडीएस (CDS) सैन्य प्रशिक्षण कार्यशाला का आयोजन। रक्षा सेवाओं में समाज की अग्रणी भूमिका सुनिश्चित करना हमारा लक्ष्य है।',
        youtubeUrl: null,
        media: [
          {
            id: 'raj-med-1',
            mediaType: 'IMAGE',
            fileUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=60',
          },
        ],
        likes: 138,
        comments: 29,
        isLiked: false,
        isPinned: false,
      },
    ],
    groups: [
      { id: 'raj-grp-1', name: '🏛️ क्षत्रिय राजपूत मुख्य सभा', description: 'केंद्रीय कार्यकारिणी व वरिष्ठ पदाधिकारियों का आधिकारिक मंच', membersCount: 210, icon: '⚔️', isMember: true, isAdmin: true, myRole: 'OWNER' },
      { id: 'raj-grp-2', name: '🚩 महाराणा युवा शौर्य वाहिनी', description: 'युवा सशक्तिकरण, सामाजिक सेवा एवं खेलकूद प्रकोष्ठ', membersCount: 180, icon: '🚩', isMember: true, isAdmin: false, myRole: 'MEMBER' },
      { id: 'raj-grp-3', name: '📚 राजपूत शिक्षा व प्रशासनिक सेवा मंच', description: 'आईएएस, आईपीएस एवं राज्य लोक सेवा परीक्षा मार्गदर्शन', membersCount: 310, icon: '🎓', isMember: true, isAdmin: false, myRole: 'MEMBER' },
    ],
    messages: {
      'raj-grp-1': [
        { id: 'raj-m-1', text: 'जय राजपूताना! समाज छात्रावास निर्माण हेतु भूमि पूजन की तिथि तय हो गई है।', senderName: 'कुँवर विक्रम सिंह', senderGotra: 'राठौड़', time: '09:00 AM', isMe: true },
        { id: 'raj-m-2', text: 'बधाई हो विक्रम सिंह जी! समाज के सभी संभागों से सहयोग मिल रहा है।', senderName: 'भानुप्रताप सिंह', senderGotra: 'चौहान', time: '09:20 AM', isMe: false },
      ],
      'raj-grp-2': [
        { id: 'raj-m-3', text: 'शौर्य दिवस रक्तदान शिविर में 150 यूनिट रक्त एकत्र करने का लक्ष्य है।', senderName: 'हर्षवर्धन सिंह', senderGotra: 'परमार', time: '11:15 AM', isMe: false },
      ],
      'raj-grp-3': [
        { id: 'raj-m-4', text: 'सिविल सर्विसेज में चयनित समाज के 5 अधिकारियों का सम्मान समारोह रविवार को है।', senderName: 'मेजर रणवीर सिंह', senderGotra: 'सिसौदिया', time: '02:00 PM', isMe: false },
      ],
    },
    directChats: [
      { id: 'dm-raj-bhanu', targetUserId: 'raj-2', name: 'भानुप्रताप सिंह चौहान', gotra: 'चौहान', city: 'Bhopal', phone: '+91 98270 22334', isOnline: true, unreadCount: 0 },
      { id: 'dm-raj-divya', targetUserId: 'raj-4', name: 'डॉ. दिव्या राठौड़', gotra: 'राठौड़', city: 'Indore', phone: '+91 98260 44556', isOnline: true, unreadCount: 1 },
    ],
    directMessages: {
      'dm-raj-bhanu': [
        { id: 'dm-msg-r1', text: 'जय माता जी की हुकुम! ट्रस्ट पंजीकरण के दस्तावेज तैयार हो गए हैं।', senderName: 'कुँवर विक्रम सिंह', time: '09:30 AM', isMe: true },
        { id: 'dm-msg-r2', text: 'जी हुकुम, मैंने समीक्षा कर ली है, कल अंतिम मुहर लग जाएगी।', senderName: 'भानुप्रताप सिंह', time: '09:40 AM', isMe: false },
      ],
      'dm-raj-divya': [
        { id: 'dm-msg-r3', text: 'डॉक्टर साहिबा, आगामी मेडिकल कैम्प की व्यवस्था कैसी चल रही है?', senderName: 'कुँवर विक्रम सिंह', time: '11:00 AM', isMe: true },
        { id: 'dm-msg-r4', text: 'हुकुम सभी तैयारियां पूरी हैं, दवाइयों का प्रबंध भी हो चुका है।', senderName: 'डॉ. दिव्या राठौड़', time: '11:15 AM', isMe: false },
      ],
    },
    events: [
      { id: 'raj-ev-1', title: 'अखिल भारतीय क्षत्रिय राजपूत परिचय महासम्मेलन', date: '2026-11-25', location: 'राजपूत सभा भवन, जयपुर', time: '09:30 AM', attendees: 1500, category: 'वैवाहिक' },
      { id: 'raj-ev-2', title: 'महाराणा प्रताप शौर्य अलंकरण एवं खेल महोत्सव', date: '2026-12-10', location: 'महाराणा स्टेडियम, भोपाल', time: '08:00 AM', attendees: 900, category: 'सांस्कृतिक' },
    ],
    testUsers: [
      { name: 'कुँवर विक्रम सिंह (व्यवस्थापक / Admin)', mobile: '9414011223', pass: 'Admin@123456', role: 'ADMIN', gotra: 'राठौड़' },
      { name: 'भानुप्रताप सिंह (मार्गदर्शक सदस्य)', mobile: '9827022334', pass: 'Member@123', role: 'MEMBER', gotra: 'चौहान' },
    ],
  },
  yadav: {
    members: [
      { id: 'yad-1', name: 'अखिलेश यादव (Akhilesh Yadav)', gotra: 'यदुवंशी', city: 'Mathura', state: 'UP', occupation: 'Agro Business', bloodGroup: 'O+', verified: true, phone: '+91 98110 11223' },
      { id: 'yad-2', name: 'डॉ. पूजा यादव (Dr. Pooja Yadav)', gotra: 'भारद्वाज', city: 'Delhi', state: 'DL', occupation: 'Assistant Professor, DU', bloodGroup: 'B+', verified: true, phone: '+91 98112 22334' },
      { id: 'yad-3', name: 'धर्मेन्द्र यादव (Dharmendra Yadav)', gotra: 'अहीर', city: 'Gwalior', state: 'MP', occupation: 'Police Inspector', bloodGroup: 'A+', verified: true, phone: '+91 94250 33445' },
    ],
    matrimonial: [
      { id: 'yad-m1', name: 'चि. राहुल यादव', gender: 'Male', age: 27, height: "5'10\"", education: 'B.Tech, M.Tech (IIT)', occupation: 'Software Lead', city: 'Delhi / Bangalore', gotra: 'यदुवंशी', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60' },
      { id: 'yad-m2', name: 'सौ. नेहा यादव', gender: 'Female', age: 25, height: "5'4\"", education: 'MBA (HR)', occupation: 'HR Manager, MNC', city: 'Gurugram / Noida', gotra: 'अहीर', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60' },
    ],
    posts: [
      {
        id: 'yad-p1',
        author: 'यादव समाज केंद्रीय महासंघ',
        authorGotra: 'यदुवंशी परिषद',
        authorCity: 'Mathura',
        role: 'Official Notice',
        time: '5 घंटे पहले',
        content: '🦚 जय श्री कृष्ण! यादव समाज का राष्ट्रीय प्रतिभा सम्मान समारोह आगामी माह में आयोजित किया जाएगा। समाज के होनहार विद्यार्थियों का उत्साहवर्धन होगा।',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        media: [],
        likes: 195,
        comments: 31,
        isLiked: false,
        isPinned: true,
      },
    ],
    groups: [
      { id: 'yad-grp-1', name: '🏛️ यादव समाज केंद्रीय समिति', description: 'अखिल भारतीय पदाधिकारी व वरिष्ठ मंच', membersCount: 175, icon: '🦚', isMember: true, isAdmin: true, myRole: 'OWNER' },
      { id: 'yad-grp-2', name: '🌟 यादव युवा शक्ति मंच', description: 'युवा विकास व खेलकूद', membersCount: 120, icon: '💪', isMember: true, isAdmin: false, myRole: 'MEMBER' },
    ],
    messages: {
      'yad-grp-1': [
        { id: 'yad-m-1', text: 'जय श्री कृष्ण! श्रीकृष्ण जन्माष्टमी महोत्सव की तैयारी समिति गठित की गई है।', senderName: 'अखिलेश यादव', senderGotra: 'यदुवंशी', time: '10:00 AM', isMe: true },
      ],
    },
    directChats: [
      { id: 'dm-yad-pooja', targetUserId: 'yad-2', name: 'डॉ. पूजा यादव', gotra: 'भारद्वाज', city: 'Delhi', phone: '+91 98112 22334', isOnline: true, unreadCount: 0 },
    ],
    directMessages: {
      'dm-yad-pooja': [
        { id: 'dm-msg-y1', text: 'जय श्री कृष्ण दीदी, शिक्षा मार्गदर्शन शिविर की रूपरेखा तय हो गई है।', senderName: 'अखिलेश यादव', time: '09:00 AM', isMe: true },
      ],
    },
    events: [
      { id: 'yad-ev-1', title: 'श्रीकृष्ण जन्मोत्सव एवं विशाल यादव महाकुंभ', date: '2026-11-28', location: 'श्रीकृष्ण जन्मभूमि परिसर, मथुरा', time: '10:00 AM', attendees: 2000, category: 'सांस्कृतिक' },
    ],
    testUsers: [
      { name: 'अखिलेश यादव (व्यवस्थापक / Admin)', mobile: '9811011223', pass: 'Admin@123456', role: 'ADMIN', gotra: 'यदुवंशी' },
      { name: 'डॉ. पूजा यादव (सदस्य)', mobile: '9811222334', pass: 'Member@123', role: 'MEMBER', gotra: 'भारद्वाज' },
    ],
  },
};

