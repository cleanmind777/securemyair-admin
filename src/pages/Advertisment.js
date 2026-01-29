/** @format */
import { Box, Button, Paper, Stack, TextField, Typography, Card, LinearProgress, Fade, CircularProgress, Grid, IconButton, Chip, Avatar, Tooltip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import Customers from '../components/Customers.jsx';
import MediaLibrary from '../components/MediaLibrary.jsx';
import Timeline from '../components/Timeline.jsx';
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
      form.append('action', 'create');
      form.append('cid', customerID);
      form.append('api', machineID);
      form.append('order', String(timelineItems.length));
      form.append('time', String(parseInt(adTimeRef.current?.value || '10')));
      form.append('media_id', String(media.id));
      
      const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
      
      if (res.data.error === 'Expired token') {
        localStorage.clear();
        setCustomerID(null);
        navigate('/login');
        return;
      }
      
      if (res.data.res === 'true') {
        const fileUrl = axios.defaults.baseURL + 'img/' + media.path;
        const newItem = {
          id: res.data.id || Date.now(),
          media_id: media.id,
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

  // Handle media selection from library (preview only)
  const handleMediaSelect = (media) => {
    setSelectedLibraryMedia(media);
    const fileUrl = axios.defaults.baseURL + 'img/' + media.path;
    setAdImg(fileUrl);
    setSelectedTimelineItem(null);
    setAdTime(media.time || 10);
  };

  const removeTimelineItem = async (id) => {
    try {
      const form = new FormData();
      form.append('action', 'delete');
      form.append('id', String(id));
      const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
      
      if (res.data?.res === 'true') {
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
      } else {
        setDialog({ msg: res.data.res || 'Failed to delete item', title: 'Error', status: true });
      }
    } catch (e) {
      console.error('Delete failed:', e);
      setDialog({ msg: 'Failed to delete item: ' + e.message, title: 'Error', status: true });
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
      form.append('action', 'update');
      form.append('id', String(id));
      form.append('ad_time', String(newDuration));
      const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
      
      if (res.data?.res === 'true') {
        setTimelineItems(prev => prev.map(item => 
          item.id === id ? { ...item, duration: newDuration } : item
        ));
        
        if (selectedTimelineItem && selectedTimelineItem.id === id) {
          setSelectedTimelineItem(prev => ({ ...prev, duration: newDuration }));
          setAdTime(newDuration);
        }
      } else {
        setDialog({ msg: res.data.res || 'Failed to update duration', title: 'Error', status: true });
      }
    } catch (error) {
      console.error('Failed to update duration:', error);
      setDialog({ msg: 'Failed to update duration: ' + error.message, title: 'Error', status: true });
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
      const updates = items.map(item => ({ id: item.id, ads_order: item.position }));
      const form = new FormData();
      form.append('action', 'bulk_update');
      form.append('updates', JSON.stringify(updates));
      const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
      
      if (res.data?.res !== 'true') {
        console.error('Failed to update positions:', res.data.res);
      }
    } catch (error) {
      console.error('Failed to update positions:', error);
    }
  };

  // Fetch timeline items when machine changes
  useEffect(() => {
    const fetchTimelineItems = async () => {
      if (!machineID) return;
      
      try {
        const res = await axios.get(`advertisment.php?list=1&api=${machineID}${customerID ? `&cid=${customerID}` : ''}`, {
          headers: { Authorization: token }
        });
        
        const serverItems = Array.isArray(res.data?.items) ? res.data.items : [];
        
        if (serverItems && Array.isArray(serverItems)) {
          const items = serverItems.map(item => {
            const path = item.path;
            const fileUrl = axios.defaults.baseURL + 'img/' + path;
            const type = item.type || (/\.(mp4|webm|ogg)$/i.test(path) ? 'video' : 'image');
            return {
              id: item.id,
              media_id: item.media_id,
              image: fileUrl,
              imageForCSS: `url("${fileUrl}")`,
              duration: item.time,
              position: item.order,
              name: path.split('/').pop(),
              type,
              uploaded: true
            };
          });
          
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
    <Box>
      {/* Modern Header */}
        <Paper
          elevation={0}
          sx={{
          mb: 2,
          p: 2,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          {/* Left: Title & Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <LibraryBooks sx={{ color: 'white', fontSize: '1.2rem' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
            color: '#1e293b',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Advertisement Studio
          </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                Manage media library and timeline
          </Typography>
            </Box>
          </Box>

          {/* Center: Stats */}
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {timelineItems.length}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                Timeline Items
              </Typography>
            </Box>
            <Box sx={{ 
              width: '1px', 
              height: '30px', 
              backgroundColor: 'rgba(99, 102, 241, 0.2)' 
            }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {timelineItems.reduce((total, item) => total + item.duration, 0)}s
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                Total Duration
              </Typography>
            </Box>
            <Box sx={{ 
              width: '1px', 
              height: '30px', 
              backgroundColor: 'rgba(99, 102, 241, 0.2)' 
            }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {selectedTimelineItem ? '1' : '0'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                Selected
              </Typography>
            </Box>
          </Box>

          {/* Right: Actions */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                <CircularProgress size={16} sx={{ color: '#6366f1' }} />
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Loading...
                </Typography>
            </Box>
          )}
            <Chip
              label={machineID ? `Machine: ${machineID}` : 'No Machine Selected'}
              color={machineID ? 'primary' : 'default'}
              size="small"
              sx={{ 
                fontWeight: 500,
                '&.MuiChip-colorPrimary': {
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: 'white'
                }
              }}
            />
          </Box>
        </Box>
        </Paper>

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
            border: '1px solid rgba(226,232,240,0.7)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          }}>
          <Customers onSelectionChange={(loading) => setIsLoading(loading)} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={10}  container spacing={1}>
        <Grid item xs={12} md={12} container spacing={1}>
          {/* Preview Column */}
          <Grid item xs={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                    height: { xs: 'auto', sm: '60vh' },
                display: 'flex',
                flexDirection: 'column',
                    overflow: 'hidden',
                    padding: 0,
                      borderRadius: '1vh',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(226,232,240,0.7)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  }}>
              
              {/* Current Advertisement Display - tall/narrow preview */}
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid rgba(226,232,240,0.3)', 
                // backgroundColor: 'rgba(248,250,252,0.35)',
                flexShrink: 0
              }}>
                    <Typography sx={{ 
                      fontWeight: 600, 
                  fontSize: '1.05rem',
                  color: '#334155',
                    mb: 2, 
                  textAlign: 'center'
                }}>
                  Preview
                </Typography>
                
                <Box sx={{
                  height: '50vh',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '2px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8fafc'
                    }}>
                      {adImg ? (
                    (selectedTimelineItem?.type === 'video' || selectedLibraryMedia?.type === 'video') ? (
                      <video
                        src={adImg}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'fill',
                          objectPosition: 'center'
                        }}
                        controls
                        autoPlay
                        loop
                        // muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={adImg}
                        alt="Current Advertisement"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'fill',
                          objectPosition: 'center'
                        }}
                      />
                    )
                  ) : (
                    <Box sx={{ 
                      textAlign: 'center', 
                      color: '#64748b',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      <ImageIcon sx={{ fontSize: '3rem', mb: 1 }} />
                      <Typography>No advertisement selected</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                </Paper>
          </Grid>

          {/* Media Library Column */}
          <Grid item xs={6} md={9}>
            <Paper
              elevation={0}
              sx={{
                height: { xs: 'auto', sm: '60vh' },
              display: 'flex',
              flexDirection: 'column',
                overflow: 'hidden',
                padding: 0,
                borderRadius: '1vh',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(226,232,240,0.7)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              }}>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(226,232,240,0.3)', backgroundColor: 'rgba(248,250,252,0.35)' }}>
                <Typography sx={{
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Media Library
              </Typography>
            </Box>
              <MediaLibrary
                onMediaSelect={handleMediaSelect}
                selectedMedia={selectedLibraryMedia}
                onClose={() => {}}
                onDurationChange={(id, duration) => {
                  // if (selectedTimelineItem && selectedTimelineItem.id === id) {
                  //   setSelectedTimelineItem(prev => ({ ...prev, duration }));
                  //   setAdTime(duration);
                  // }
                }}
                onAddToTimeline={async (item) => {
                  if (!machineID) { setDialog({ status: true, title: 'Warning', msg: 'Select a machine first' }); return; }
                  const form = new FormData();
                  form.append('action', 'create');
                  form.append('cid', customerID);
                  form.append('api', machineID);
                  form.append('order', String(timelineItems.length));
                  form.append('time', String(item.time || 30));
                  form.append('media_id', String(item.id));
                  const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                  if (res.data?.res === 'true') {
                    const fileUrl = axios.defaults.baseURL + 'img/' + item.path;
                    const newItem = { id: res.data.id, media_id: item.id, image: fileUrl, imageForCSS: `url("${fileUrl}")`, duration: item.time || 30, position: timelineItems.length, name: item.name, type: item.type, uploaded: true };
                    const updated = [...timelineItems, newItem];
                    setTimelineItems(updated);
                    setSelectedTimelineItem(newItem);
                    setAdImg(fileUrl);
                  } else {
                    setDialog({ msg: res.data.res || 'Failed to add to timeline', title: 'Error', status: true });
                  }
                }}
                onAppendToAll={async (item) => {
                  if (!machineID) { 
                    setDialog({ status: true, title: 'Warning', msg: 'Select a machine first' }); 
                    return; 
                  }
                  
                  const form = new FormData();
                  form.append('action', 'assign_media_to_all');
                  form.append('media_id', String(item.id));
                  form.append('time', String(item.time || 30));
                  const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                  if (res.data?.res === 'true') {
                    // Also add to current timeline
                    const timelineForm = new FormData();
                    timelineForm.append('action', 'create');
                    timelineForm.append('cid', customerID);
                    timelineForm.append('api', machineID);
                    timelineForm.append('order', String(timelineItems.length));
                    timelineForm.append('time', String(item.time || 30));
                    timelineForm.append('media_id', String(item.id));
                    
                    const timelineRes = await axios.post('advertisment.php', timelineForm, { headers: { Authorization: token } });
                    if (timelineRes.data?.res === 'true') {
                      const fileUrl = axios.defaults.baseURL + 'img/' + item.path;
                      const newItem = { 
                        id: timelineRes.data.id, 
                        media_id: item.id, 
                        image: fileUrl, 
                        imageForCSS: `url("${fileUrl}")`, 
                        duration: item.time || 30, 
                        position: timelineItems.length, 
                        name: item.name, 
                        type: item.type, 
                        uploaded: true 
                      };
                      const updated = [...timelineItems, newItem];
                      setTimelineItems(updated);
                      setSelectedTimelineItem(newItem);
                      setAdImg(fileUrl);
                    }
                    
                    setDialog({ 
                      status: true, 
                      title: 'Success', 
                      msg: `Assigned to ${res.data.added_count || 0} machines across all clients and added to current timeline` 
                    });
                  } else {
                    setDialog({ msg: res.data.res || 'Failed to assign to all machines', title: 'Error', status: true });
                  }
                }}
                onApplyDurationToAll={async (item) => {
                  const form = new FormData();
                  form.append('action', 'update_media_duration');
                  form.append('media_id', String(item.id));
                  form.append('time', String(item.time || 30));
                  const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                  if (res.data?.res === 'true') {
                    // Update local timeline items that reference this media
                    setTimelineItems(prev => prev.map(ti => 
                      ti.media_id === item.id ? { ...ti, duration: item.time || 30 } : ti
                    ));
                    // Update selected item if it matches
                    if (selectedTimelineItem && selectedTimelineItem.media_id === item.id) {
                      setSelectedTimelineItem(prev => ({ ...prev, duration: item.time || 30 }));
                      setAdTime(item.time || 30);
                    }
                    setDialog({ 
                      status: true, 
                      title: 'Success', 
                      msg: `Updated ${res.data.updated_count || 0} ads with new duration` 
                    });
                  } else {
                    setDialog({ 
                      status: true, 
                      title: 'Error', 
                      msg: res.data.res || 'Failed to update duration' 
                    });
                  }
                }}
                onMediaDeleted={(deletedMediaId) => {
                  setTimelineItems(prev => prev.filter(ti => ti.media_id !== deletedMediaId));
                  if (selectedTimelineItem && selectedTimelineItem.media_id === deletedMediaId) {
                    setSelectedTimelineItem(null);
                    setAdImg(null);
                  }
                    }}
                  />
                </Paper>
          </Grid>
        </Grid>
        {/* Timeline Row - full width under preview and library */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '1vh',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(226,232,240,0.7)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '1.05rem', color: '#334155' }}>Timeline</Typography>
              <Typography variant="body2" color="text.secondary">Drag items to reorder or drop from library</Typography>
            </Box>
            {timelineItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
                <DragIndicator sx={{ fontSize: '3rem', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>No items in timeline</Typography>
                <Typography variant="body2">Drag from library or click Add to Timeline</Typography>
              </Box>
            ) : (
              <Timeline
                items={timelineItems}
                onSelect={selectTimelineItem}
                onRemove={removeTimelineItem}
                onReorder={(newItems) => {
                  setTimelineItems(newItems);
                  updateItemPositions(newItems);
                }}
                selectedId={selectedTimelineItem?.id}
                onDropFromLibrary={async (libItem) => {
                  if (!machineID) { setDialog({ status: true, title: 'Warning', msg: 'Select a machine first' }); return; }
                  const form = new FormData();
                  form.append('action', 'create');
                  form.append('cid', customerID);
                  form.append('api', machineID);
                  form.append('order', String(timelineItems.length));
                  form.append('time', String(libItem.time || 30));
                  form.append('media_id', String(libItem.id));
                  const res = await axios.post('advertisment.php', form, { headers: { Authorization: token } });
                  if (res.data?.res === 'true') {
                    const fileUrl = axios.defaults.baseURL + 'img/' + libItem.path;
                    const newItem = { id: res.data.id, media_id: libItem.id, image: fileUrl, imageForCSS: `url("${fileUrl}")`, duration: libItem.time || 30, position: timelineItems.length, name: libItem.name, type: libItem.type, uploaded: true };
                    const updated = [...timelineItems, newItem];
                    setTimelineItems(updated);
                    setSelectedTimelineItem(newItem);
                    setAdImg(fileUrl);
                  } else {
                    setDialog({ msg: res.data.res || 'Failed to add to timeline', title: 'Error', status: true });
                  }
                }}
                onEditDuration={updateTimelineDuration}
              />
            )}
        </Paper>
        </Grid>
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
    </Box>
  );
}

export default AdvertismentPage;
