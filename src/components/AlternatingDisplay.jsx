/** @format */

import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Fade, Typography, CircularProgress, Button } from '@mui/material';
import { MachineContext } from '../MachineContext';
import { CustomerContext } from '../CustomerContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AlternatingDisplay = ({ 
  children, 
  hvacDisplayDuration = 10, 
  isEnabled = true,
  onHvacDurationChange,
  showSettings = false 
}) => {
  const [currentView, setCurrentView] = useState('hvac'); // 'hvac' or 'ad'
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentHvacDuration, setCurrentHvacDuration] = useState(hvacDisplayDuration);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionEffect, setTransitionEffect] = useState('diagonal');
  const switchTimeoutRef = useRef(null);
  const transitionHideRef = useRef(null);
  const nextSwitchAtRef = useRef(null);
  const guardIntervalRef = useRef(null);
  
  const { machineID } = useContext(MachineContext);
  const { customerID } = useContext(CustomerContext);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Fetch ads for the current machine
  useEffect(() => {
    const fetchAds = async () => {
      if (!machineID) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await axios.get(`advertisment.php?list=1&api=${machineID}${customerID ? `&cid=${customerID}` : ''}`, {
          headers: { Authorization: token }
        });
        
        if (res.data?.error === "Expired token") {
          localStorage.clear();
          navigate("/login");
          return;
        }
        
        const serverItems = Array.isArray(res.data?.items) ? res.data.items : [];
        
        if (serverItems && Array.isArray(serverItems)) {
          const mappedAds = serverItems
            .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order
            .map(item => ({
              id: item.id,
              image: axios.defaults.baseURL + 'img/' + item.path,
              duration: item.time || 30, // Default 30 seconds if no time specified
              name: item.path?.split('/')?.pop() || 'ad',
              type: item.type || 'image',
              media_id: item.media_id
            }));
          
          setAds(mappedAds);
          setCurrentAdIndex(0);
        }
      } catch (error) {
        console.error('Failed to fetch ads:', error);
        setError('Failed to load advertisements');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [machineID, customerID, token, navigate]);

  // Timing system for alternating display using rescheduled timeout (prevents overlap/flicker)
  useEffect(() => {
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }

    if (!isEnabled || !isPlaying || ads.length === 0) return;

    const delay = currentView === 'hvac' 
      ? currentHvacDuration * 1000 
      : (ads[(currentAdIndex + ads.length) % ads.length]?.duration || 30) * 1000;

    const scheduleAt = Date.now() + delay;
    nextSwitchAtRef.current = scheduleAt;

    switchTimeoutRef.current = setTimeout(() => {
      if (currentView === 'hvac') {
        const effects = ['diagonal', 'particles', 'mosaic', 'zoom'];
        setTransitionEffect(effects[Math.floor(Math.random() * effects.length)]);
        setShowTransition(true);
        if (transitionHideRef.current) clearTimeout(transitionHideRef.current);
        transitionHideRef.current = setTimeout(() => setShowTransition(false), 1000);
        // Advance to next ad BEFORE showing Ad
        setCurrentAdIndex(prev => ((prev + 1 + ads.length) % ads.length));
        setCurrentView('ad');
      } else {
        // Finished showing current Ad; return to HVAC without changing index
        setCurrentView('hvac');
      }
      nextSwitchAtRef.current = null;
    }, delay);

    return () => {
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
        switchTimeoutRef.current = null;
      }
    };
  }, [currentView, currentAdIndex, currentHvacDuration, isEnabled, isPlaying, ads.length]);

  // Guard interval to ensure switching even if timeouts are cleared unexpectedly
  useEffect(() => {
    if (guardIntervalRef.current) {
      clearInterval(guardIntervalRef.current);
      guardIntervalRef.current = null;
    }
    guardIntervalRef.current = setInterval(() => {
      if (!isEnabled || !isPlaying || ads.length === 0) return;
      const nextAt = nextSwitchAtRef.current;
      if (nextAt && Date.now() >= nextAt - 50) {
        if (currentView === 'hvac') {
          // Mirror HVAC→Ad logic: advance index then show Ad
          setCurrentAdIndex(prev => ((prev + 1 + ads.length) % ads.length));
          setCurrentView('ad');
        } else {
          // Ad→HVAC
          setCurrentView('hvac');
        }
        nextSwitchAtRef.current = null;
      }
    }, 500);
    return () => {
      if (guardIntervalRef.current) {
        clearInterval(guardIntervalRef.current);
        guardIntervalRef.current = null;
      }
    };
  }, [isEnabled, isPlaying, ads.length, currentView]);

  // Reset to HVAC when ads change
  useEffect(() => {
    if (ads.length > 0) {
      setCurrentView('hvac');
      setCurrentAdIndex(-1);
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
        switchTimeoutRef.current = null;
      }
    }
  }, [ads]);

  // Handle duration change
  const handleHvacDurationChange = (duration) => {
    setCurrentHvacDuration(duration);
    if (onHvacDurationChange) {
      onHvacDurationChange(duration);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        minHeight: '400px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        minHeight: '400px',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Typography color="text.secondary">
          Showing HVAC data only
        </Typography>
      </Box>
    );
  }

  if (ads.length === 0 || !isEnabled) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      flex: 1,
      overflow: 'hidden' // prevent any child overflow pushing layout
    }}>
      {/* Settings Controls */}
      {showSettings && (
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 10,
          display: 'flex',
          gap: 1
        }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsPlaying(!isPlaying)}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </Box>
      )}

      {/* HVAC Display (absolute layer) */}
      <Fade in={currentView === 'hvac'} timeout={1000}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: currentView === 'hvac' ? 2 : 1,
          overflow: 'hidden'
        }}>
          {children}
        </Box>
      </Fade>

      {/* Ad Display (absolute layer) */}
      <Fade in={currentView === 'ad'} timeout={1000}>
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: currentView === 'ad' ? 2 : 1,
          backgroundColor: '#000',
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          {ads[(currentAdIndex + ads.length) % ads.length] && (
            <>
              {ads[(currentAdIndex + ads.length) % ads.length].type === 'video' ? (
                <video
                  src={ads[(currentAdIndex + ads.length) % ads.length].image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />
              ) : (
                <img
                  src={ads[(currentAdIndex + ads.length) % ads.length].image}
                  alt={ads[(currentAdIndex + ads.length) % ads.length].name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />
              )}

              {/* Transition overlay */}
              {showTransition && (
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  zIndex: 3,
                  ...(transitionEffect === 'diagonal' && {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))',
                    transform: 'translateX(-120%) skewX(-15deg)',
                    animation: 'diagWipe 900ms ease forwards'
                  }),
                  ...(transitionEffect === 'particles' && {
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 2px, transparent 3px)',
                    backgroundSize: '18px 18px',
                    opacity: 0,
                    transform: 'scale(0.95)',
                    animation: 'particleIn 900ms ease forwards'
                  }),
                  ...(transitionEffect === 'mosaic' && {
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '24px 24px, 24px 24px',
                    filter: 'blur(6px)',
                    opacity: 0.4,
                    animation: 'mosaicReveal 950ms ease forwards'
                  }),
                  ...(transitionEffect === 'zoom' && {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    transform: 'scale(1.08)',
                    opacity: 0,
                    animation: 'zoomFade 850ms ease forwards'
                  })
                }} />
              )}

              {/* Ad info overlay */}
              <Box sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: 1,
                fontSize: '0.75rem'
              }}>
                {ads[(currentAdIndex + ads.length) % ads.length].name} ({ads[(currentAdIndex + ads.length) % ads.length].duration}s)
              </Box>

              {/* Debug info overlay */}
              <Box sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: 1,
                fontSize: '0.7rem'
              }}>
                Ad {((currentAdIndex + ads.length) % ads.length) + 1} of {ads.length} | {isPlaying ? 'Playing' : 'Paused'}
              </Box>

              {/* Animation keyframes */}
              <style>{`
                @keyframes diagWipe {
                  0% { transform: translateX(-120%) skewX(-15deg); opacity: 0.6; }
                  60% { opacity: 0.9; }
                  100% { transform: translateX(140%) skewX(-15deg); opacity: 0; }
                }
                @keyframes particleIn {
                  0% { opacity: 0; transform: scale(0.95); }
                  60% { opacity: 1; }
                  100% { opacity: 0; transform: scale(1.02); }
                }
                @keyframes mosaicReveal {
                  0% { filter: blur(10px); opacity: 0.7; }
                  70% { filter: blur(4px); opacity: 0.5; }
                  100% { filter: blur(0px); opacity: 0; }
                }
                @keyframes zoomFade {
                  0% { opacity: 0; transform: scale(1.08); }
                  60% { opacity: 1; }
                  100% { opacity: 0; transform: scale(1.0); }
                }
              `}</style>
            </>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default AlternatingDisplay;
