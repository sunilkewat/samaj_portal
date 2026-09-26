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
