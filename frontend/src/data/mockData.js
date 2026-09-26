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
