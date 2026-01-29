/** @format */
import { Box, Button, Paper, Stack, TextField, Typography, Card, LinearProgress, Fade, CircularProgress, Grid, IconButton, Chip, Avatar, Tooltip, Dialog, DialogTitle, DialogContent } from '@mui/material';
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
  const { machineID, setMachineID } = useContext(MachineContext);
  const { customerID, setCustomerID } = useContext(CustomerContext);
  const [adImg, setAdImg] = useState(null);
  const [adTime, setAdTime] = useState(10);
  const [imgUpdate, setImgUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [timelineItems, setTimelineItems] = useState([]);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedLibraryMedia, setSelectedLibraryMedia] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Timeline functionality
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
    addTimelineItem(media);
  };

  const removeTimelineItem = (id) => {
    const updatedItems = timelineItems
      .filter(item => item.id !== id)
      .map((item, index) => ({ ...item, position: index }));

    setTimelineItems(updatedItems);
    
    // If we removed the selected item, select the first remaining item or clear selection
    if (selectedTimelineItem && selectedTimelineItem.id === id) {
      if (updatedItems.length > 0) {
        setSelectedTimelineItem(updatedItems[0]);
        setAdImg(updatedItems[0].image);
        setAdTime(updatedItems[0].duration);
      } else {
        setSelectedTimelineItem(null);
        setAdImg(null);
        setAdTime(10);
      }
    }
  };

  const selectTimelineItem = (item) => {
    setSelectedTimelineItem(item);
    setAdImg(item.image);
    setAdTime(item.duration);
  };

  const updateTimelineDuration = async (id, newDuration) => {
    try {
      const form = new FormData();
      form.append('action', 'update_time');
      form.append('id', String(id));
      form.append('time', String(newDuration));
      await axios.post('advertisment.php', form, { headers: { Authorization: token } });
      
      setTimelineItems(prev => prev.map(item => 
        item.id === id ? { ...item, duration: newDuration } : item
      ));
      
      if (selectedTimelineItem && selectedTimelineItem.id === id) {
        setSelectedTimelineItem(prev => ({ ...prev, duration: newDuration }));
        setAdTime(newDuration);
      }
    } catch (error) {
      console.error('Failed to update duration:', error);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = timelineItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = timelineItems.findIndex(item => item.id === targetItem.id);
    
    const newItems = [...timelineItems];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);
    
    const updatedItems = newItems.map((item, index) => ({ ...item, position: index }));
    setTimelineItems(updatedItems);
    
    updateItemPositions(updatedItems);
    setDraggedItem(null);
  };

  const updateItemPositions = async (items) => {
    try {
      const positions = items.map(item => ({ id: item.id, order: item.position }));
      const form = new FormData();
      form.append('action', 'update_positions');
      form.append('positions', JSON.stringify(positions));
      await axios.post('advertisment.php', form, { headers: { Authorization: token } });
    } catch (error) {
      console.error('Failed to update positions:', error);
    }
  };

  // Fetch timeline items when machine changes
  useEffect(() => {
    const fetchTimelineItems = async () => {
      if (!machineID || !customerID) return;
      
      try {
        const res = await axios.get(`advertisment.php?list=1&cid=${customerID}&api=${machineID}`, {
          headers: { Authorization: token }
        });
        
        if (res.data && Array.isArray(res.data)) {
          const items = res.data.map(item => ({
            id: item.id,
            image: axios.defaults.baseURL + 'client/' + item.path,
            imageForCSS: `url("${axios.defaults.baseURL}client/${item.path}")`,
            duration: item.time,
            position: item.order,
            name: item.path.split('/').pop(),
            type: item.type,
            uploaded: true
          }));
          
          setTimelineItems(items);
          if (items.length > 0) {
            setSelectedTimelineItem(items[0]);
            setAdImg(items[0].image);
            setAdTime(items[0].duration);
          } else {
            setSelectedTimelineItem(null);
            setAdImg(null);
            setAdTime(10);
          }
        }
      } catch (error) {
        console.error('Failed to fetch timeline items:', error);
      }
    };

    fetchTimelineItems();
  }, [machineID, customerID, token]);

  return (
    <Grid container spacing={2}>
      {/* Customers Column */}
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
      
      {/* Current Advertisement & Timeline Column */}
      <Grid item xs={12} md={4}>
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
          
          {/* Current Advertisement Display */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid rgba(226,232,240,0.3)', 
            backgroundColor: 'rgba(248,250,252,0.5)',
            flexShrink: 0
          }}>
            <Typography sx={{ 
              fontWeight: 600, 
              fontSize: '1.1rem',
              color: '#1e293b',
              mb: 2,
              textAlign: 'center'
            }}>
              Current Advertisement
            </Typography>
            
            <Box sx={{
              height: 200,
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: '#f8fafc',
              border: '2px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {adImg ? (
                selectedTimelineItem?.type === 'video' ? (
                  <video
                    src={adImg}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    controls
                    autoPlay
                    loop
                  />
                ) : (
                  <img
                    src={adImg}
                    alt="Current Advertisement"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )
              ) : (
                <Box sx={{ textAlign: 'center', color: '#64748b' }}>
                  <ImageIcon sx={{ fontSize: '3rem', mb: 1 }} />
                  <Typography>No advertisement selected</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Timeline Section */}
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ 
                fontWeight: 600, 
                fontSize: '1rem',
                color: '#1e293b'
              }}>
                Timeline
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Select media from library to add to timeline
              </Typography>
            </Box>

            {timelineItems.length === 0 ? (
              <Box sx={{
                textAlign: 'center',
                py: 4,
                color: '#64748b'
              }}>
                <DragIndicator sx={{ fontSize: '3rem', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  No items in timeline
                </Typography>
                <Typography variant="body2">
                  Select media from the library to add to this machine's timeline
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                {timelineItems.map((item, index) => (
                  <Card
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item)}
                    onClick={() => selectTimelineItem(item)}
                    sx={{
                      cursor: 'pointer',
                      border: selectedTimelineItem?.id === item.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}>
                      <DragIndicator sx={{ color: '#94a3b8', mr: 1, cursor: 'grab' }} />
                      
                      <Box sx={{
                        width: 60,
                        height: 40,
                        borderRadius: 1,
                        overflow: 'hidden',
                        mr: 2,
                        backgroundColor: '#f8fafc'
                      }}>
                        {item.type === 'video' ? (
                          <video
                            src={item.image}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={item.type} 
                            size="small" 
                            color={item.type === 'video' ? 'error' : 'primary'}
                            sx={{ fontSize: '0.7rem' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {item.duration}s
                          </Typography>
                        </Box>
                      </Box>
                      
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTimelineItem(item.id);
                        }}
                        sx={{ color: '#ef4444' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Paper>
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
            onClose={() => {}}
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
  );
}

export default AdvertismentPage;
