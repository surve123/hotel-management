import api from './api';

export const mediaService = {
  // Upload photo/video to Cloudinary via backend
  upload: async (file, folder = 'arnavee_hospitality') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

export default mediaService;
