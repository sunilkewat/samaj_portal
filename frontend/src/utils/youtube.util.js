/**
 * Extract YouTube embed URL from various YouTube formats
 * Supports: watch?v=, youtu.be/, shorts/, embed/, etc.
 */
export const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
  } catch (e) {
    return null;
  }
};

/**
 * Extract first YouTube link found inside arbitrary text content
 */
export const extractYouTubeUrlFromText = (text) => {
  if (!text || typeof text !== 'string') return null;
  try {
    const regExp = /(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/\s]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)[^\s"\']+)/i;
    const match = text.match(regExp);
    return match ? match[0] : null;
  } catch (e) {
    return null;
  }
};
