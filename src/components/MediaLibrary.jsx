import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Tooltip,
  Fade,
  TextField,
  InputAdornment,
  Divider,
  Stack,
  Badge,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  AddPhotoAlternate,
  Delete,
  PlayArrow,
  Image as ImageIcon,
  VideoLibrary,
  CloudUpload,
  Search,
  Timer,
  Edit,
  Check,
  Close,
  DragIndicator,
  MoreVert,
  FilterList,
  Add
} from '@mui/icons-material';
import axios from 'axios';

const MediaLibrary = ({ onMediaSelect, selectedMedia, onClose, onDurationChange, onAddToTimeline, onAppendToAll, onApplyDurationToAll, onMediaDeleted }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingDuration, setEditingDuration] = useState({ id: null, value: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [buttonLoading, setButtonLoading] = useState({ addToTimeline: null, appendToAll: null, applyDuration: null });
  const token = localStorage.getItem("authToken");

  // Chunked upload function for large files
  const uploadFileInChunks = async (file, onProgress) => {
    const CHUNK_SIZE = 1024 * 512; // 512KB chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('fileId', fileId);
        formData.append('chunkIndex', chunkIndex);
        formData.append('totalChunks', totalChunks);
        formData.append('fileName', file.name);
        formData.append('fileSize', file.size);
        formData.append('to_library', '1');
        
        const response = await axios.post('upload_chunk.php', formData, {
          headers: { Authorization: token },
          onUploadProgress: (progressEvent) => {
            const chunkProgress = (chunkIndex / totalChunks) * 100;
            const currentChunkProgress = (progressEvent.loaded / progressEvent.total) * (100 / totalChunks);
            const totalProgress = Math.round(chunkProgress + currentChunkProgress);
            onProgress(totalProgress);
          }
        });
        
        if (response.data.success === false) {
          throw new Error(response.data.error || 'Chunk upload failed');
        }
      }
      
      // Finalize upload
      const finalizeResponse = await axios.post('upload_chunk.php', new FormData(), {
        headers: { Authorization: token },
        params: {
          action: 'finalize',
          fileId: fileId,
          fileName: file.name,
          fileSize: file.size,
          to_library: '1'
        }
      });
      
      if (finalizeResponse.data.success === true) {
        return {
          res: 'true',
          id: finalizeResponse.data.id,
          name: finalizeResponse.data.name,
          path: finalizeResponse.data.path,
          type: finalizeResponse.data.type,
          size: finalizeResponse.data.size,
          time: finalizeResponse.data.time || 30
        };
      } else {
        throw new Error(finalizeResponse.data.error || 'Finalization failed');
      }
    } catch (error) {
      console.error('Chunked upload failed:', error);
      throw error;
    }
  };

  // Fetch media library
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await axios.get('media_library.php?list=1', {
        headers: { Authorization: token }
      });
      if (res.data?.items) {
        setMedia(res.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    if ((isImage && file.size > 2 * 1024 * 1024) || (isVideo && file.size > 50 * 1024 * 1024)) {
      alert(isImage ? 'Image too large (max 2MB)' : 'Video too large (max 50MB)');
      return;
    }

    setSelectedFile(file);
    setSelectedFilePreview(URL.createObjectURL(file));
  };


  // Upload to library with progress
  const uploadToLibrary = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    
    try {
      let res;
      
      // Use chunked upload for files larger than 1MB
      if (selectedFile.size > 1024 * 1024) {
        res = await uploadFileInChunks(selectedFile, (progress) => {
          setUploadProgress(progress);
        });
      } else {
        // Use regular upload for smaller files
        const form = new FormData();
        form.append('action', 'upload');
        form.append('fileToUpload', selectedFile);

        res = await axios.post('media_library.php', form, {
          headers: { Authorization: token },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        res = res.data;
      }

      if (res.res === 'true') {
        const newMedia = {
          id: res.id,
          path: res.path,
          type: res.type,
          name: res.name,
          time: res.time || 30,
          size: res.size
        };
        setMedia(prev => [newMedia, ...prev]);
        setSelectedFile(null);
        setSelectedFilePreview(null);
        setUploadProgress(0);
        document.getElementById('media-upload').value = '';
      } else {
        alert(res.res || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete from library
  const deleteFromLibrary = async (item) => {
    try {
      const form = new FormData();
      form.append('action', 'delete');
      form.append('id', String(item.id));
      
      const res = await axios.post('media_library.php', form, {
        headers: { Authorization: token }
      });
      
      if (res.data?.res === 'true') {
        setMedia(prev => prev.filter(m => m.id !== item.id));
        setDeleteDialog({ open: false, item: null });
        if (onMediaDeleted) onMediaDeleted(item.id);
      } else {
        alert('Delete failed: ' + (res.data?.res || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed');
    }
  };

  // Update duration
  const updateDuration = async (id, duration) => {
    try {
      const form = new FormData();
      form.append('action', 'update');
      form.append('id', String(id));
      form.append('duration', String(duration));
      
      const res = await axios.post('media_library.php', form, {
        headers: { Authorization: token }
      });
      
      if (res.data?.res === 'true') {
        setMedia(prev => prev.map(m => m.id === id ? { ...m, time: duration } : m));
        setEditingDuration({ id: null, value: '' });
        if (onDurationChange) {
          onDurationChange(id, duration);
        }
      } else {
        alert('Update failed: ' + (res.data?.res || 'Unknown error'));
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed');
    }
  };

  // Select media for timeline
  const selectMedia = (item) => {
    if (onMediaSelect) {
      onMediaSelect(item);
    }
  };

  // Filter media
  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search / Filter / Upload Row (simplified header) */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 220 }}
          />
          <ToggleButtonGroup
            value={filterType}
            exclusive
            onChange={(e, newFilter) => setFilterType(newFilter)}
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="image">Images</ToggleButton>
            <ToggleButton value="video">Videos</ToggleButton>
          </ToggleButtonGroup>

          {/* Upload control moved here */}
          <input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => document.getElementById('media-upload').click()}
            disabled={uploading}
            sx={{
              background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
              '&:hover': { 
                background: 'linear-gradient(145deg, #2563eb, #1d4ed8)' 
              },
              '&:disabled': {
                background: 'linear-gradient(145deg, #94a3b8, #64748b)',
                color: 'rgba(255, 255, 255, 0.6)'
              }
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Box>

      {/* Upload Preview */}
      {selectedFilePreview && (
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 80, height: 60, borderRadius: 1, overflow: 'hidden' }}>
              {selectedFile.type.startsWith('video/') ? (
                <video src={selectedFilePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={selectedFilePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(selectedFile.size)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={uploadToLibrary}
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                sx={{
                  background: 'linear-gradient(145deg, #10b981, #059669)',
                  '&:hover': { background: 'linear-gradient(145deg, #059669, #047857)' }
                }}
              >
                {uploading ? 'Uploading...' : 'Add to Library'}
              </Button>
              {!uploading && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedFile(null);
                    setSelectedFilePreview(null);
                    setUploadProgress(0);
                    document.getElementById('media-upload').value = '';
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
          {uploading && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {uploadProgress}% uploaded
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Media Grid */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredMedia.map((item, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={item.id}>
                <Fade in={true} timeout={300 + index * 50}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: selectedMedia?.id === item.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => selectMedia(item)}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/library-item', JSON.stringify(item));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                  >
                    <CardMedia
                      sx={{
                        height: 120,
                        position: 'relative',
                        backgroundColor: '#f8fafc'
                      }}
                    >
                      {item.type === 'video' ? (
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                          <video
                            src={`${axios.defaults.baseURL}img/${item.path}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              borderRadius: '50%',
                              p: 0.5
                            }}
                          >
                            <PlayArrow sx={{ color: 'white', fontSize: '2rem' }} />
                          </Box>
                        </Box>
                      ) : (
                        <img
                          src={`${axios.defaults.baseURL}img/${item.path}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          alt={item.name}
                        />
                      )}
                      {/* Type indicator */}
                      <Chip
                        label={item.type}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: item.type === 'video' ? '#ef4444' : '#3b82f6',
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      />

                      {/* Selected overlay actions moved into image area */}
                      {selectedMedia?.id === item.id && (
                        <Box sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          right: 8,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          borderRadius: 2,
                          padding: 1
                        }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button
                              size="small"
                              variant="contained"
                              disabled={buttonLoading.addToTimeline === item.id}
                              sx={{ 
                                backgroundColor: '#10b981', 
                                '&:hover': { backgroundColor: '#059669' },
                                '&:disabled': { backgroundColor: '#6b7280' },
                                flex: 1,
                                fontSize: '0.7rem',
                                minWidth: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5
                              }}
                              onClick={async (e) => { 
                                e.stopPropagation(); 
                                if (onAddToTimeline) {
                                  setButtonLoading(prev => ({ ...prev, addToTimeline: item.id }));
                                  try {
                                    await onAddToTimeline(item);
                                  } finally {
                                    setButtonLoading(prev => ({ ...prev, addToTimeline: null }));
                                  }
                                }
                              }}
                            >
                              {buttonLoading.addToTimeline === item.id ? (
                                <CircularProgress size={12} color="inherit" />
                              ) : (
                                <>
                                  <Add fontSize="small" />
                                  This
                                </>
                              )}
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              disabled={buttonLoading.appendToAll === item.id}
                              sx={{ 
                                backgroundColor: '#3b82f6', 
                                '&:hover': { backgroundColor: '#2563eb' },
                                '&:disabled': { backgroundColor: '#6b7280' },
                                flex: 1,
                                fontSize: '0.7rem',
                                minWidth: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5
                              }}
                              onClick={async (e) => { 
                                e.stopPropagation(); 
                                if (onAppendToAll) {
                                  setButtonLoading(prev => ({ ...prev, appendToAll: item.id }));
                                  try {
                                    await onAppendToAll(item);
                                  } finally {
                                    setButtonLoading(prev => ({ ...prev, appendToAll: null }));
                                  }
                                }
                              }}
                            >
                              {buttonLoading.appendToAll === item.id ? (
                                <CircularProgress size={12} color="inherit" />
                              ) : (
                                <>
                                  <VideoLibrary fontSize="small" />
                                  All
                                </>
                              )}
                            </Button>
                          </Box>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={buttonLoading.applyDuration === item.id}
                            sx={{ 
                              backgroundColor: '#f59e0b', 
                              '&:hover': { backgroundColor: '#d97706' },
                              '&:disabled': { backgroundColor: '#6b7280' },
                              fontSize: '0.7rem',
                              minWidth: 'auto',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5
                            }}
                            onClick={async (e) => { 
                              e.stopPropagation(); 
                              if (onApplyDurationToAll) {
                                setButtonLoading(prev => ({ ...prev, applyDuration: item.id }));
                                try {
                                  await onApplyDurationToAll(item);
                                } finally {
                                  setButtonLoading(prev => ({ ...prev, applyDuration: null }));
                                }
                              }
                            }}
                          >
                            {buttonLoading.applyDuration === item.id ? (
                              <CircularProgress size={12} color="inherit" />
                            ) : (
                              <>
                                <Timer fontSize="small" />
                                All
                              </>
                            )}
                          </Button>
                        </Box>
                      )}
                    </CardMedia>
                    
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 0.5
                        }}
                        title={item.name}
                      >
                        {item.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(item.size)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit duration">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDuration({ id: item.id, value: item.time.toString() });
                              }}
                              sx={{ color: '#64748b' }}
                            >
                              <Timer fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteDialog({ open: true, item });
                              }}
                              sx={{ color: '#ef4444' }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Duration display/editing */}
                      {editingDuration.id === item.id ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TextField
                            size="small"
                            value={editingDuration.value}
                            onChange={(e) => setEditingDuration({ ...editingDuration, value: e.target.value })}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateDuration(item.id, parseInt(editingDuration.value) || 30);
                              }
                            }}
                            sx={{ width: 60 }}
                            inputProps={{ style: { fontSize: '0.75rem', padding: '4px 8px' } }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => updateDuration(item.id, parseInt(editingDuration.value) || 30)}
                            sx={{ color: '#10b981' }}
                          >
                            <Check fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setEditingDuration({ id: null, value: '' })}
                            sx={{ color: '#ef4444' }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          {item.time}s
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {filteredMedia.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <VideoLibrary sx={{ fontSize: '4rem', color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm || filterType !== 'all' ? 'No media found' : 'No media in library'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filters' : 'Upload images or videos to get started'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null })}>
        <DialogTitle>Delete Media</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.item?.name}" from the library?
            This will remove it from all timelines.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteFromLibrary(deleteDialog.item)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MediaLibrary;