/** @format */
import { Box, Button, Fab, Paper, Stack, TextField, Typography, Card, LinearProgress, Fade, CircularProgress, Grid, IconButton, Chip, Avatar, Tooltip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import Customers from '../components/Customers.jsx';
import MediaLibrary from '../components/MediaLibrary.jsx';
import { useContext, useRef, useState, useEffect } from 'react';
import MyDialog from '../dialogs/MyDialog';
import { AddPhotoAlternate, CloudUpload, Timer, Image as ImageIcon, Add, Delete, DragIndicator, PlayArrow, Pause, CheckCircle, LibraryBooks } from '@mui/icons-material';
import { MachineContext } from '../MachineContext';
import { CustomerContext } from '../CustomerContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdvertismentPage() {
  const [validateMsg, setValidateMsg] = useState('');
  const adTimeRef = useRef();
  const [dialog, setDialog] = useState({ status: false, msg: '', title: '' });
  const { machineID } = useContext(MachineContext);
  const { customerID, setCustomerID } = useContext(CustomerContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [adImg, setAdImg] = useState();
  const [imgUpdate, setImgUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [selectedLibraryMedia, setSelectedLibraryMedia] = useState(null);
  function validateImg() {
    var fileInput = document.getElementById('img');
    if (!fileInput.files[0]) return;
    
    var fileSize = fileInput.files[0].size;
    var fileType = fileInput.files[0].type;
    var file = fileInput.files[0];
    var objectUrl = URL.createObjectURL(file);
    // Allow images (jpeg/png) and videos (mp4/webm)
    const isImage = fileType === 'image/jpeg' || fileType === 'image/png';
    const isVideo = fileType === 'video/mp4' || fileType === 'video/webm';
    if (!isImage && !isVideo) {
      alert('Please upload JPG/PNG image or MP4/WEBM video.');
      fileInput.value = '';
      setSelectedFile(null);
      setSelectedFilePreview(null);
      return;
    }
    // Size checks: image <= 2MB, video <= 50MB
    if ((isImage && fileSize > 2 * 1024 * 1024) || (isVideo && fileSize > 50 * 1024 * 1024)) {
      alert(isImage ? 'Please upload an image smaller than 2MB.' : 'Please upload a video smaller than 50MB.');
      fileInput.value = '';
      setSelectedFile(null);
      setSelectedFilePreview(null);
      return;
    }
    if (isImage) {
      var image = new Image();
      image.src = objectUrl;
      image.onload = function () {
        var width = this.width;
        var height = this.height;
        setSelectedFile(file);
        setSelectedFilePreview(objectUrl);
        if (width !== height) {
          setValidateMsg('Warning! Please upload a square image next time for better result in Client View.');
          return true;
        }
        if (width < 1024 || height < 1024) {
          setValidateMsg('Warning! Please upload an image greater than 1024x1024 next time for better result.');
          return true;
        } else {
          setValidateMsg('');
          return true;
        }
      };
    } else {
      // Video: no dimension checks
      setSelectedFile(file);
      setSelectedFilePreview(objectUrl);
      setValidateMsg('');
    }
  }

  // Chunked upload function for large files
  const uploadFileInChunks = async (file, cid, api, order, time) => {
    const chunkSize = 500 * 1024; // 500KB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    let finalResult = null;
    
    for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
      const start = chunkNumber * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      const form = new FormData();
      form.append('action', 'upload_chunk');
      form.append('chunk', chunk);
      form.append('chunk_number', chunkNumber);
      form.append('total_chunks', totalChunks);
      form.append('file_name', file.name);
      form.append('file_id', fileId);
      form.append('cid', cid);
      if (api) form.append('api', api);
      form.append('order', order);
      form.append('time', time);
      
      try {
        const res = await axios.post('upload_chunk.php', form, { 
          headers: { Authorization: token },
          timeout: 30000 // 30 second timeout per chunk
        });
        
        if (!res.data.success) {
          throw new Error(res.data.res || 'Chunk upload failed');
        }
        
        // Update progress
        const progress = Math.round(((chunkNumber + 1) / totalChunks) * 100);
        console.log(`Upload progress: ${progress}%`);
        
        // Store the final result from the last chunk (when file is complete)
        if (chunkNumber === totalChunks - 1 && res.data.res === 'true') {
          finalResult = res.data;
        }
        
      } catch (error) {
        console.error(`Chunk ${chunkNumber} failed:`, error);
        throw error;
      }
    }
    
    // Return the final result from the last chunk
    if (finalResult) {
      return finalResult;
    } else {
      throw new Error('Upload completed but no final result received');
    }
  };

  // Add media from library to timeline
  const addTimelineItem = async (libraryMedia) => {
    if (!libraryMedia && !selectedLibraryMedia) {
      alert('Please select media from library first');
      return;
    }
    
    const media = libraryMedia || selectedLibraryMedia;
    if (!media) return;

    try {
      setUploadLoading(true);
      
      const form = new FormData();
      form.append('action', 'upload');
      form.append('fileToUpload', new File([], media.name)); // Dummy file for API compatibility
      form.append('cid', customerID);
      if (machineID) form.append('api', machineID);
      form.append('order', String(timelineItems.length));
      form.append('time', String(parseInt(adTimeRef.current?.value || '10')));
      form.append('library_path', media.path); // Pass library path
      
      const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
      
      if (res.data.error === 'Expired token') {
        localStorage.clear();
        setCustomerID(null);
        navigate('/login');
        return;
      }
      
      if (res.data.res === 'true') {
        const fileUrl = axios.defaults.baseURL + 'client/' + media.path;
        const newItem = {
          id: res.data.id || Date.now(),
          image: fileUrl,
          imageForCSS: `url("${fileUrl}")`,
          duration: parseInt(adTimeRef.current?.value || '10'),
          position: timelineItems.length,
          name: media.name,
          type: media.type,
          uploaded: true
        };
        const updated = [...timelineItems, newItem];
        setTimelineItems(updated);
        setSelectedTimelineItem(newItem);
        setAdImg(fileUrl);
        setSelectedLibraryMedia(null);
      } else {
        setDialog({ msg: res.data.res || 'Add to timeline failed', title: 'FAILURE', status: true });
      }
    } catch (e) {
      console.error(e);
      setDialog({ msg: 'Add to timeline failed: ' + e.message, title: 'FAILURE', status: true });
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle media selection from library
  const handleMediaSelect = (media) => {
    setSelectedLibraryMedia(media);
    setMediaLibraryOpen(false);
    addTimelineItem(media);
  };

  const removeTimelineItem = (id) => {
    const updatedItems = timelineItems
      .filter(item => item.id !== id)
      .map((item, index) => ({ ...item, position: index }));
    
    setTimelineItems(updatedItems);
    
    if (selectedTimelineItem?.id === id) {
      const nextItem = updatedItems[0];
      setSelectedTimelineItem(nextItem || null);
      setAdImg(nextItem?.image || null);
      if (nextItem && adTimeRef.current) {
        adTimeRef.current.value = nextItem.duration;
      }
    }
  };

  const selectTimelineItem = (item) => {
    setSelectedTimelineItem(item);
    setAdImg(item.image);
    if (adTimeRef.current) {
      adTimeRef.current.value = item.duration;
    }
  };

  const updateTimelineDuration = async () => {
    if (!selectedTimelineItem || !adTimeRef.current) return;
    
    const newDuration = parseInt(adTimeRef.current.value || '10');
    const updatedItems = timelineItems.map(item => 
      item.id === selectedTimelineItem.id 
        ? { ...item, duration: newDuration }
        : item
    );
    
    setTimelineItems(updatedItems);
    setSelectedTimelineItem({ ...selectedTimelineItem, duration: newDuration });
    try {
      const form = new FormData();
      form.append('action', 'update_time');
      form.append('id', String(selectedTimelineItem.id));
      form.append('time', String(newDuration));
      await axios.post('advertisment.php', form, { headers: { Authorization: token } });
    } catch (e) {
      console.error('Failed to update time', e);
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = timelineItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = timelineItems.findIndex(item => item.id === targetItem.id);
    
    const newItems = [...timelineItems];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    
    // Update positions and make API call
    const updatedItems = newItems.map((item, index) => ({ ...item, position: index }));
    setTimelineItems(updatedItems);
    setDraggedItem(null);
    
    // API call to update positions
    updateItemPositions(updatedItems);
  };

  const updateItemPositions = async (items) => {
    try {
      const positionData = items.map(item => ({ id: item.id, position: item.position }));
      const form = new FormData();
      form.append('action', 'update_positions');
      form.append('positions', JSON.stringify(positionData));
      await axios.post('advertisment.php', form, { headers: { Authorization: token } });
    } catch (error) {
      console.error('Error updating positions:', error);
    }
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get(`advertisment.php?cid=${customerID}&api=${machineID}&list=1`,
       { cancelToken: source.token,headers:{Authorization:token} })
      .then(res => {
        if (res.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        const items = Array.isArray(res.data.items) ? res.data.items : [];
        const mapped = items.map((it) => {
          const fullPath = axios.defaults.baseURL + 'client/' + it.path;
          return {
            id: it.id,
            image: fullPath,
            imageForCSS: `url("${fullPath}")`, // Properly quoted for CSS background-image
            duration: it.time,
            position: it.order,
            name: it.path?.split('/')?.pop() || 'media',
            type: it.type || 'image'
          };
        });
        setTimelineItems(mapped);
        if (mapped.length > 0) {
          setSelectedTimelineItem(mapped[0]);
          setAdImg(mapped[0].image);
          if (adTimeRef.current) adTimeRef.current.value = mapped[0].duration;
        } else {
          setSelectedTimelineItem(null);
          setAdImg(null);
        }
      })
      .catch(err => console.log(err));
    return () => {
      source.cancel();
    };
  }, [machineID, imgUpdate]);
  const imgRef = useRef(null);

  const imgForSingleMachine = async () => {
    if (imgRef.current.files[0]) {
      setUploadLoading(true);
      let fd = new FormData();
      fd.append('fileToUpload', imgRef.current.files[0]);
      fd.append('cid', customerID);
      fd.append('api', machineID);
      await axios
        .post('advertisment.php', fd,{headers: { Authorization: token }})
        .then(result => {
          if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
          const res = result.data.res;
          res === 'true'
            ? setDialog({
                msg: `Image is uploaded successfully for only selected machine.<br> ${validateMsg}`,
                title: validateMsg === '' ? 'SUCCESS' : 'WARNING',
                status: true,
              })
            : setDialog({
                msg: res,
                title: 'FAILURE',
                status: true,
              });
        })
        .catch(err => console.log(err));
      setImgUpdate(pre => !pre);
      imgRef.current.value = null;
      setUploadLoading(false);
    }
  };
  const imgForAllMachine = async () => {
    if (imgRef.current.files[0]) {
      setUploadLoading(true);
      let fd = new FormData();
      fd.append('fileToUpload', imgRef.current.files[0]);
      fd.append('cid', customerID);
      await axios
        .post('advertisment.php', fd,{headers: { Authorization: token }})
        .then(result => {
          if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
          const res = result.data.res;
          res === 'true'
            ? setDialog({
                msg: `Image is uploaded successfully for all machines.<br> ${validateMsg}`,
                title: validateMsg === '' ? 'SUCCESS' : 'WARNING',
                status: true,
              })
            : setDialog({
                msg: res,
                title: 'FAILURE',
                status: true,
              });
        })
        .catch(err => console.log(err));
      setImgUpdate(pre => !pre);
      imgRef.current.value = null;
      setUploadLoading(false);
    }
  };
  const timeForSingleMachine = async () => {
    let fd = new FormData();
    fd.append('time', adTimeRef.current.value);
    fd.append('api', machineID);
    await axios
      .post('advertisment.php', fd,{headers: { Authorization: token }})
      .then(result => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        const res = result.data.res;
        res === 'true'
          ? setDialog({
              msg: 'Time is Updated for only Selected Machine.',
              title: 'SUCCESS',
              status: true,
            })
          : setDialog({
              msg: res,
              title: 'FAILURE',
              status: true,
            });
      })
      .catch(err => console.log(err));
  };
  const timeForAllMachine = async () => {
    let fd = new FormData();
    fd.append('time', adTimeRef.current.value);
    fd.append('cid', customerID);
    await axios
      .post('advertisment.php', fd,{headers: { Authorization: token }})
      .then(result => {
        if (result.data.error === "Expired token") {
          localStorage.clear();
          setCustomerID(null);
          navigate("/login");
        }
        const res = result.data.res;
        res === 'true'
          ? setDialog({
              msg: 'Time is Updated for all Machines.',
              title: 'SUCCESS',
              status: true,
            })
          : setDialog({
              msg: res,
              title: 'FAILURE',
              status: true,
            });
      })
      .catch(err => console.log(err));
  };
  return (
    <Grid container spacing={1} sx={{ p: 1 }}>
      {/* Elegant Enhanced Header */}
      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            borderRadius: '1vh',
            p: 2,
            mb: 1,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.8), rgba(236,72,153,0.8), transparent)',
              borderRadius: '1vh 1vh 0 0'
            }
          }}>
          <Typography variant='h4' sx={{
            fontWeight: 800,
            color: '#1e293b',
            textAlign: 'center',
            mb: 0.5,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            🎨 ADVERTISEMENT MANAGER
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={async () => {
                if (!window.confirm('Delete ALL ads for ALL machines for this customer? This cannot be undone.')) return;
                const form = new FormData();
                form.append('action', 'delete_all_ads');
                form.append('cid', customerID);
                await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                setTimelineItems([]);
                setSelectedTimelineItem(null);
                setAdImg(null);
                setDialog({ status: true, title: 'SUCCESS', msg: 'All ads deleted for this customer.' });
              }}
              sx={{ mt: 1 }}
            >
              Delete All Ads
            </Button>
          </Box>
          <Typography sx={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            Upload & Manage Digital Signage Content
          </Typography>
          
          {/* Loading Bar */}
          {(isLoading || uploadLoading) && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress sx={{
                backgroundColor: 'rgba(168,85,247,0.2)',
                borderRadius: 1,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)',
                  borderRadius: 1
                }
              }} />
            </Box>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={2}>
        <Paper
          elevation={0}
          sx={{
            height: { xs: 'auto', sm: '85vh' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            padding: 0,
            borderRadius: '1vh',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
          <Customers onSelectionChange={(loading) => setIsLoading(loading)} />
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper
          elevation={0}
          sx={{
            height: { xs: 'auto', sm: '85vh' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            p: 2,
                  borderRadius: '1vh',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          }}>
          {/* Two Column Layout + Timeline */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Top Row - Two Columns */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
              {/* Left Column - Upload Image + Advertising Time */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {/* Upload Image Section */}
                <Paper sx={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(226,232,240,0.8)',
                  borderRadius: 2,
                  p: 2,
                  flex: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ImageIcon sx={{ color: '#3b82f6', mr: 1.5, fontSize: '1.2rem' }} />
                    <Typography sx={{ 
                      fontWeight: 600, 
                      fontSize: '1rem',
                      color: '#1e293b'
                    }}>
                      Upload Image
                    </Typography>
                  </Box>
                  
                  <Typography sx={{ 
                    color: '#64748b', 
                    mb: 2, 
                    fontSize: '0.85rem' 
                  }}>
                    Requirements: JPG/PNG, max 2MB, 1024×1024px
                    </Typography>

                  <Box sx={{ mb: 2 }}>
                      <input
                        required
                        accept='image/*,video/*'
                        ref={imgRef}
                        id='img'
                        type='file'
                      style={{ display: 'none' }}
                        onChange={validateImg}
                      />
                    <label htmlFor='img' style={{ cursor: 'pointer', width: '100%', display: 'block' }}>
                      <Box sx={{
                        border: selectedFilePreview 
                          ? '2px solid #10b981'
                          : '2px dashed #cbd5e1',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: selectedFilePreview ? '#f0fdf4' : '#f8fafc',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: selectedFilePreview ? '#059669' : '#3b82f6',
                          backgroundColor: selectedFilePreview ? '#ecfdf5' : '#f1f5f9'
                        }
                      }}>
                        {selectedFilePreview ? (
                          <Box>
                            <Box sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 2,
                              overflow: 'hidden',
                              margin: '0 auto 12px',
                              border: '2px solid #10b981'
                            }}>
                              <img 
                                src={selectedFilePreview} 
                                alt="Selected" 
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </Box>
                            <Typography sx={{ 
                              color: '#059669', 
                              fontSize: '0.9rem', 
                              fontWeight: 600,
                              mb: 0.5
                            }}>
                              ✓ Image Selected
                            </Typography>
                            <Typography sx={{ 
                              color: '#64748b', 
                              fontSize: '0.8rem'
                            }}>
                              {selectedFile?.name}
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <AddPhotoAlternate sx={{ 
                              color: '#94a3b8', 
                              fontSize: '2.5rem',
                              mb: 1
                            }} />
                            <Typography sx={{ 
                              color: '#475569', 
                              fontSize: '0.9rem',
                              fontWeight: 500
                            }}>
                              Click to select image
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      </label>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    type='submit'
                    variant='contained'
                      disabled={uploadLoading || !selectedFile || !selectedTimelineItem}
                    onClick={async () => {
                      if (!selectedTimelineItem || !selectedFile) return;
                      setUploadLoading(true);
                      try {
                        const form = new FormData();
                        form.append('action', 'replace_media');
                        form.append('id', String(selectedTimelineItem.id));
                        form.append('fileToUpload', selectedFile);
                        const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                        if (res.data.error === 'Expired token') {
                          localStorage.clear(); setCustomerID(null); navigate('/login'); return;
                        }
                        if (res.data.res === 'true') {
                          const fileUrl = axios.defaults.baseURL + 'client/' + res.data.path;
                          const updated = timelineItems.map(it => it.id === selectedTimelineItem.id ? { 
                            ...it, 
                            image: fileUrl, 
                            imageForCSS: `url("${fileUrl}")`,
                            name: selectedFile.name, 
                            type: ['mp4','webm'].some(ext => selectedFile.name.toLowerCase().endsWith(ext)) ? 'video' : 'image' 
                          } : it);
                          setTimelineItems(updated);
                          setSelectedTimelineItem(prev => prev ? { ...prev, image: fileUrl, name: selectedFile.name } : prev);
                          setAdImg(fileUrl);
                        } else {
                          setDialog({ msg: res.data.res || 'Replace failed', title: 'FAILURE', status: true });
                        }
                      } catch (e) { console.error(e); setDialog({ msg: 'Replace failed', title: 'FAILURE', status: true }); }
                      setUploadLoading(false);
                    }}
                      startIcon={uploadLoading ? <CircularProgress size={16} /> : <CloudUpload />}
                      sx={{ 
                        flex: 1,
                        backgroundColor: '#3b82f6',
                        '&:hover': { backgroundColor: '#2563eb' },
                        textTransform: 'none',
                        fontSize: '0.85rem'
                      }}>
                      {uploadLoading ? 'Uploading...' : 'Replace Selected'}
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                      disabled={uploadLoading || !selectedFile}
                    onClick={async () => {
                      if (!selectedFile) return;
                      setUploadLoading(true);
                      try {
                        const form = new FormData();
                        form.append('action', 'upload_to_all_machines');
                        form.append('fileToUpload', selectedFile);
                        form.append('cid', customerID);
                        form.append('time', String(parseInt(adTimeRef.current?.value || '10')));
                        const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                        if (res.data.error === 'Expired token') { localStorage.clear(); setCustomerID(null); navigate('/login'); return; }
                        if (res.data.res === 'true') {
                          setDialog({ status: true, title: 'SUCCESS', msg: `Appended to ${res.data.count} machine timelines.` });
                        } else {
                          setDialog({ status: true, title: 'FAILURE', msg: res.data.res || 'Append failed' });
                        }
                      } catch (e) { console.error(e); setDialog({ status: true, title: 'FAILURE', msg: 'Append failed' }); }
                      setUploadLoading(false);
                    }}
                      startIcon={uploadLoading ? <CircularProgress size={16} /> : <CloudUpload />}
                      sx={{ 
                        flex: 1,
                        backgroundColor: '#10b981',
                        '&:hover': { backgroundColor: '#059669' },
                        textTransform: 'none',
                        fontSize: '0.85rem'
                      }}>
                      {uploadLoading ? 'Uploading...' : 'Append To All'}
                  </Button>
                  </Box>
                </Paper>
                                                {/* Advertising Time Section */}
                <Paper sx={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(226,232,240,0.8)',
                  borderRadius: 2,
                  p: 2,
                  flex: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Timer sx={{ color: '#f59e0b', mr: 1.5, fontSize: '1.2rem' }} />
                    <Typography sx={{ 
                      fontWeight: 600, 
                      fontSize: '1rem',
                      color: '#1e293b'
                    }}>
                      Advertising Time
                </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      required
                      label='Duration (seconds)'
                      InputLabelProps={{ 
                        shrink: true,
                        sx: { color: '#64748b' }
                      }}
                      inputRef={adTimeRef}
                      type='number'
                      size='small'
                      fullWidth
                      onChange={updateTimelineDuration}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#1e293b',
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '& fieldset': { borderColor: 'rgba(226,232,240,0.8)' },
                          '&:hover fieldset': { borderColor: '#f59e0b' },
                          '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                   <Button
                     type='submit'
                     variant='contained'
                       disabled={uploadLoading || !adTimeRef.current?.value || !selectedTimelineItem}
                       onClick={updateTimelineDuration}
                       startIcon={<Timer />}
                       sx={{ 
                         flex: 1,
                         backgroundColor: '#f59e0b',
                         '&:hover': { backgroundColor: '#d97706' },
                         textTransform: 'none',
                         fontSize: '0.85rem'
                       }}>
                       Selected Ad
                   </Button>
                   <Button
                     type='submit'
                     variant='contained'
                       disabled={uploadLoading || !adTimeRef.current?.value}
                     onClick={async () => {
                       const form = new FormData();
                       form.append('action', 'update_machine_times');
                       form.append('api', machineID);
                       form.append('time', adTimeRef.current.value);
                       await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                       setDialog({ status: true, title: 'SUCCESS', msg: 'Updated all ads for this machine.' });
                     }}
                       startIcon={<Timer />}
                       sx={{ 
                         flex: 1,
                         backgroundColor: '#10b981',
                         '&:hover': { backgroundColor: '#059669' },
                         textTransform: 'none',
                         fontSize: '0.85rem'
                       }}>
                       Machine Ads
                   </Button>
                   <Button
                     type='submit'
                     variant='contained'
                       disabled={uploadLoading || !adTimeRef.current?.value}
                     onClick={async () => {
                       const form = new FormData();
                       form.append('action', 'update_all_times');
                       form.append('cid', customerID);
                       form.append('time', adTimeRef.current.value);
                       await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                       setDialog({ status: true, title: 'SUCCESS', msg: 'Updated all ads for all machines.' });
                     }}
                     startIcon={<Timer />}
                     sx={{ 
                       flex: 1,
                       backgroundColor: '#6366f1',
                       '&:hover': { backgroundColor: '#4f46e5' },
                       textTransform: 'none',
                       fontSize: '0.85rem'
                     }}>
                     All Machines
                   </Button>
                   </Box>
                </Paper>
              </Box>
              {/* Right Column - Current Advertisement */}
              <Box sx={{ flex: 1 }}>
                <Paper sx={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
                  border: '1px solid rgba(226,232,240,0.5)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: '500px', // Fixed height to prevent timeline pushing
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <Box sx={{ 
                    p: 2, 
                    borderBottom: '1px solid rgba(226,232,240,0.3)', 
                    backgroundColor: 'rgba(248,250,252,0.5)',
                    flexShrink: 0 // Prevent header from shrinking
                  }}>
                    <Typography sx={{ 
                      color: '#1e293b', 
                      fontWeight: 700, 
                      fontSize: '1.1rem',
                      textAlign: 'center'
                    }}>
                      📸 Current Advertisement
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center',
                    overflow: 'hidden' // Prevent content overflow
                  }}>
                    <Box sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid rgba(226,232,240,0.5)',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {adImg ? (
                        selectedTimelineItem?.type === 'video' ? (
                          <video src={adImg} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} controls />
                        ) : (
                          <Fade in={true} timeout={800}>
                            <img 
                              alt='Current Advertisement' 
                              src={adImg}
                              style={{ 
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block'
                              }}
                            />
                          </Fade>
                        )
                      ) : (
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748b',
                          textAlign: 'center'
                        }}>
                          <ImageIcon sx={{ fontSize: '4rem', mb: 2, opacity: 0.4, color: '#94a3b8' }} />
                          <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, color: '#475569' }}>
                            No Image Selected
                          </Typography>
                          <Typography sx={{ fontSize: '0.9rem', mt: 1, color: '#64748b' }}>
                            Select from timeline or upload new
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>

            {/* Timeline Component - Full Width Bottom */}
            <Box sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(226,232,240,0.3)',
              borderRadius: 2,
              p: 2,
              mt: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography sx={{
              color: '#1e293b',
              fontWeight: 700,
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              🎬 Advertisement Timeline
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={async () => {
                  if (!window.confirm('Delete all ads for this machine timeline?')) return;
                  const form = new FormData();
                  form.append('action', 'delete_machine_ads');
                  form.append('api', machineID);
                  await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                  setTimelineItems([]);
                  setSelectedTimelineItem(null);
                  setAdImg(null);
                }}
              >
                Clear Machine Timeline
              </Button>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Select media from the library to add to timeline
            </Typography>
            </Box>
          </Box>

          {timelineItems.length === 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              border: '2px dashed #cbd5e1',
              borderRadius: 2,
              color: '#64748b',
              textAlign: 'center',
              backgroundColor: 'rgba(248,250,252,0.5)'
            }}>
              <Timer sx={{ fontSize: '3rem', mb: 1, opacity: 0.4 }} />
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, mb: 1 }}>
                No advertisements in timeline
              </Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>
                Select an image and click "Add to Timeline" to start
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f5f9',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cbd5e1',
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: '#94a3b8',
                },
              },
            }}>
              {timelineItems.map((item, index) => (
                <Paper
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item)}
                  onClick={() => selectTimelineItem(item)}
                  sx={{
                    minWidth: '180px',
                    height: '140px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    border: selectedTimelineItem?.id === item.id 
                      ? '3px solid #10b981' 
                      : '2px solid transparent',
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: `linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%), ${item.imageForCSS}`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                      border: selectedTimelineItem?.id === item.id 
                        ? '3px solid #10b981' 
                        : '2px solid #3b82f6',
                    }
                  }}
                >
                  {/* Drag Handle */}
                  <Box sx={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    background: 'rgba(0,0,0,0.7)',
                    borderRadius: 1,
                    p: 0.5,
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' }
                  }}>
                    <DragIndicator sx={{ color: 'white', fontSize: '1rem' }} />
                  </Box>

                  {/* Delete Button */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTimelineItem(item.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(239,68,68,0.9)',
                      color: 'white',
                      width: 28,
                      height: 28,
                      '&:hover': {
                        background: 'rgba(239,68,68,1)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <Delete sx={{ fontSize: '1rem' }} />
                  </IconButton>

                  {/* Content */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    p: 1.5,
                    color: 'white'
                  }}>
                    <Typography sx={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      mb: 0.5,
                overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timer sx={{ fontSize: '0.9rem' }} />
                      <Typography sx={{ fontSize: '0.8rem' }}>
                        {item.duration}s
                      </Typography>
                      {selectedTimelineItem?.id === item.id && (
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            ml: 'auto',
                            height: '18px',
                            fontSize: '0.7rem',
                            backgroundColor: '#10b981',
                            color: 'white'
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Position Indicator */}
                  <Chip
                    label={`#${index + 1}`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(59,130,246,0.9)',
                      color: 'white',
                      fontSize: '0.7rem',
                      height: '20px'
                    }}
                  />
                </Paper>
              ))}
            </Box>
          )}

          {timelineItems.length > 0 && (
            <Box sx={{
              mt: 3,
              p: 2,
              backgroundColor: 'rgba(59,130,246,0.05)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 2
            }}>
              <Typography sx={{
                color: '#1e293b',
                fontSize: '0.9rem',
                fontWeight: 600,
                mb: 1
              }}>
                💡 Timeline Tips:
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: '#64748b', fontSize: '0.8rem' }}>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Drag items to reorder the advertisement sequence
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Click an item to preview and edit its duration
                </Typography>
                <Typography component="li" sx={{ mb: 0.5 }}>
                  Use the duration field above to adjust timing for selected item
                </Typography>
                <Typography component="li">
                  Delete unwanted items using the red × button
                </Typography>
              </Box>
            </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {dialog.status && (
          <MyDialog
            title={dialog.title}
            des={dialog.msg}
            actions={[
              { onClick: () => setDialog({ status: false }), color: 'primary', text: 'OK' },
            ]}
          />
        )}

      </Grid>

      {/* Media Library Column */}
      <Grid item xs={12} md={6}>
        <Paper
          elevation={0}
          sx={{
            height: { xs: 'auto', sm: '85vh' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: 0,
            borderRadius: '1vh',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
          <MediaLibrary
            onMediaSelect={handleMediaSelect}
            selectedMedia={selectedLibraryMedia}
            onClose={() => setMediaLibraryOpen(false)}
            onDurationChange={(id, duration) => {
              // Update timeline if this media is currently selected
              if (selectedTimelineItem && selectedTimelineItem.id === id) {
                setSelectedTimelineItem(prev => ({ ...prev, duration }));
                setAdTime(duration);
              }
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AdvertismentPage;
