/** @format */

import { Box, Button, CircularProgress, Typography, Card, Avatar, Chip, Grid, LinearProgress } from '@mui/material';
import { Dashboard as DashboardIcon, Analytics, Speed, Air, Thermostat, DeviceThermostat, Opacity, Co2, Grain, VisibilityOff, Security, CloudQueue, FilterDrama } from '@mui/icons-material';
import React, { useContext, useEffect, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import Logo from '../assests/logo.png';
import { MachineContext } from '../MachineContext';
import axios from 'axios';
import { CustomerContext } from '../CustomerContext';
import { useNavigate } from 'react-router-dom';
import AlternatingDisplay from './AlternatingDisplay';

function CDashboard() {
  const [res, setRes] = useState({});
  const [display, setDisplay] = useState('flex');
  const { machineID } = useContext(MachineContext);
  const token = localStorage.getItem("authToken");
  const { setCustomerID } = useContext(CustomerContext);
  const navigate = useNavigate();


  useEffect(() => {
    let intervalId; 
    const fetchData = async () => {
      await axios
        .get("dashboard.php", {
          params: { api: machineID },
          headers: { Authorization: token },
        })
        .then((result) => {
          if (result.data.error === "Expired token") {
            localStorage.clear();
            setCustomerID(null);
            navigate("/login");
          }
          const newData = result.data;
          if (JSON.stringify(newData) !== JSON.stringify(res)) {
            setRes(newData);
            setDisplay(newData.humHdnStatus ? "flex" : "none");
          }
        })
        .catch((error) => console.log(error));
    };
    fetchData();
    intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [machineID, res]);

  const circleStyle = {
    width: '2.7vh',
    height: '2.7vh',
  };

  // Determine overall air quality condition
  const getAQICondition = () => {
    const aqiValue = parseFloat(res.aqi) || 0;
    const letter = res.letter || 'F';
    
    // Check if any sensor is in bad condition
    const sensors = [res.humidity, res.co, res.co2, res.voc, res.pm25, res.pm10];
    const hasBadSensor = sensors.some(sensor => {
      if (!sensor) return false;
      const value = parseFloat(sensor.value) || 0;
      return value >= parseFloat(sensor.level_2) || 0; // Fair or worse
    });

    const isCritical = letter === 'F' || letter === 'D' || hasBadSensor;
    const isPoor = letter === 'C' || aqiValue > 50;
    
    return {
      isCritical,
      isPoor,
      isGood: !isCritical && !isPoor,
      color: isCritical ? '#dc2626' : isPoor ? '#f59e0b' : '#22c55e'
    };
  };

  const aqiCondition = getAQICondition();

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 1.5,
      height: '100%',
      minHeight: 'calc(100vh - 100px)'
    }}>
      {/* Elegant Enhanced Header */}
      <Card
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(147,51,234,0.18) 30%, rgba(236,72,153,0.12) 70%, rgba(34,197,94,0.08) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 3,
          p: 1.5,
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
            animation: 'elegantShimmer 4s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, rgba(59,130,246,0.5), rgba(147,51,234,0.7), rgba(236,72,153,0.5), rgba(34,197,94,0.3))',
            borderRadius: '3px 3px 0 0'
          },
          '@keyframes elegantShimmer': {
            '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
            '100%': { transform: 'translateX(200%) skewX(-15deg)' }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ 
            width: 32, 
            height: 32,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            boxShadow: '0 6px 20px rgba(59,130,246,0.4)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            <DashboardIcon sx={{ fontSize: '1rem', color: 'white' }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: 'rgba(15,23,42,0.95)', 
              fontSize: '1rem',
              letterSpacing: '0.02em',
              background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Air Quality Dashboard
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(59,130,246,0.8)', 
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              Live environmental monitoring
      </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Chip
              icon={<Analytics sx={{ fontSize: '0.6rem' }} />}
              label="LIVE"
              size="small"
              sx={{
                backgroundColor: 'rgba(34,197,94,0.15)',
                color: 'rgba(34,197,94,0.9)',
                borderColor: 'rgba(34,197,94,0.3)',
                fontWeight: 600,
                fontSize: '0.6rem',
                height: '20px',
                '& .MuiChip-icon': {
                  animation: 'pulse 2s infinite'
                },
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 }
                }
              }}
              variant="outlined"
            />
            <Chip
              label={res.letter || "---"}
              size="small"
              sx={{
                backgroundColor: res.letter === 'A' ? 'rgba(34,197,94,0.15)' : 
                                 res.letter === 'B' ? 'rgba(59,130,246,0.15)' : 
                                 res.letter === 'C' ? 'rgba(251,146,60,0.15)' : 
                                 res.letter === 'D' ? 'rgba(239,68,68,0.15)' : 
                                 'rgba(148,163,184,0.15)',
                color: res.letter === 'A' ? 'rgba(34,197,94,0.9)' : 
                       res.letter === 'B' ? 'rgba(59,130,246,0.9)' : 
                       res.letter === 'C' ? 'rgba(251,146,60,0.9)' : 
                       res.letter === 'D' ? 'rgba(239,68,68,0.9)' : 
                       'rgba(100,116,139,0.8)',
                fontWeight: 700,
                fontSize: '0.6rem',
                height: '20px'
              }}
              variant="outlined"
            />
          </Box>
        </Box>
      </Card>
      
      {/* Stunning Main Dashboard Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AlternatingDisplay 
          hvacDisplayDuration={10}
          isEnabled={true}
          showSettings={true}
        >
        <Card
        elevation={0}
        sx={{
          flex: 1,
          height: '100%',
          minHeight: 'calc(100vh - 200px)',
          background: 'linear-gradient(145deg, #000000 0%, #0a0a0a 30%, #1a1a1a 70%, #0a0a0a 100%)',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          border: `2px solid ${aqiCondition.color}30`,
          boxShadow: `0 20px 60px ${aqiCondition.color}15, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
          backdropFilter: 'blur(25px)',
          animation: aqiCondition.isCritical ? 'criticalPulse 3s infinite' : 
                     aqiCondition.isPoor ? 'warningPulse 4s infinite' : 'none',

          '&::after': aqiCondition.isCritical ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, ${aqiCondition.color}10, transparent, ${aqiCondition.color}10)`,
            pointerEvents: 'none',
            animation: 'sparkleBackground 2.5s infinite',
            zIndex: 0
          } : {},
          '@keyframes criticalPulse': {
            '0%, 100%': { 
              borderColor: `${aqiCondition.color}40`,
              boxShadow: `0 0 20px ${aqiCondition.color}20`
            },
            '50%': { 
              borderColor: `${aqiCondition.color}80`,
              boxShadow: `0 0 40px ${aqiCondition.color}40, 0 0 60px ${aqiCondition.color}20`
            }
          },
          '@keyframes warningPulse': {
            '0%, 100%': { 
              borderColor: `${aqiCondition.color}40`,
              boxShadow: `0 0 15px ${aqiCondition.color}20`
            },
            '50%': { 
              borderColor: `${aqiCondition.color}60`,
              boxShadow: `0 0 25px ${aqiCondition.color}30`
            }
          },
          '@keyframes backgroundPulse': {
            '0%, 100%': { opacity: 0.8 },
            '50%': { opacity: 1 }
          },
          '@keyframes sparkleBackground': {
            '0%': { opacity: 0.3, transform: 'rotate(0deg)' },
            '50%': { opacity: 0.6, transform: 'rotate(180deg)' },
            '100%': { opacity: 0.3, transform: 'rotate(360deg)' }
          }
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, minHeight: 'calc(100vh - 200px)' }}>
          {/* Elegant Brand Section */}
          <Box sx={{ 
            my: 'auto',
            p: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
            }
          }}>
            {/* Stunning Brand Row */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}>
              {/* Enhanced Brand Logo with Leading Text */}
              <Box sx={{ 
            display: 'flex',
              alignItems: 'center',
                gap: 2.5
              }}>
                                 <Box sx={{
                   position: 'relative',
                   '&::before': {
                     content: '""',
                     position: 'absolute',
                     top: '-15px',
                     left: '-15px',
                     right: '-15px',
                     bottom: '-15px',
                     background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.3) 30%, rgba(147,51,234,0.2) 60%, transparent 80%)',
                     borderRadius: '50%',
                     animation: 'logoGlow 3s ease-in-out infinite',
                     filter: 'blur(8px)',
                     zIndex: 0
                   },
                   '&::after': {
                     content: '""',
                     position: 'absolute',
                     top: '-8px',
                     left: '-8px',
                     right: '-8px',
                     bottom: '-8px',
                     background: 'conic-gradient(from 0deg, rgba(168,85,247,0.6), rgba(59,130,246,0.4), rgba(147,51,234,0.5), rgba(168,85,247,0.6))',
                     borderRadius: '50%',
                     animation: 'logoRotate 8s linear infinite',
                     opacity: 0.7,
                     zIndex: 1
                   },
                   '@keyframes logoGlow': {
                     '0%, 100%': { 
                       opacity: 0.7,
                       transform: 'scale(0.95)',
                       filter: 'blur(8px)'
                     },
                     '50%': { 
                       opacity: 1,
                       transform: 'scale(1.1)',
                       filter: 'blur(12px)'
                     }
                   },
                   '@keyframes logoRotate': {
                     '0%': { transform: 'rotate(0deg)' },
                     '100%': { transform: 'rotate(360deg)' }
                   }
                 }}>
                   <img 
                     src="/logo.png" 
                     alt="SecureMyAir Brand" 
                     style={{ 
                       width: '110px', 
                       height: '110px',
                       opacity: 0.98,
                       filter: `
                         drop-shadow(0 12px 32px rgba(0,0,0,0.5))
                         drop-shadow(0 6px 16px rgba(0,0,0,0.4))
                         drop-shadow(0 0 24px rgba(168,85,247,0.6))
                         drop-shadow(0 0 48px rgba(59,130,246,0.4))
                         contrast(1.1)
                         saturate(1.2)
                         brightness(1.05)
                       `,
                       borderRadius: '50%',
                       position: 'relative',
                       zIndex: 2,
                       transform: 'perspective(200px) rotateX(5deg) rotateY(-3deg)',
                       transformStyle: 'preserve-3d',
                       border: '2px solid rgba(255,255,255,0.2)',
                       boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
                     }} 
                   />
                </Box>
                <Box>
                  <Typography
              sx={{
                      background: 'linear-gradient(145deg, #00ff00 0%, #32ff32 12%, #65ff65 25%, #98ff98 37%, #cbffcb 50%, #ffffff 62%, #cbffcb 75%, #98ff98 87%, #00ff00 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '2rem',
                      fontWeight: 900,
                      letterSpacing: '0.02em',
                      mb: 0.5,
                      textShadow: `
                        0 1px 0 rgba(228, 236, 224, 0.9),
                        0 2px 0 rgba(90, 57, 57, 0.7),
                        0 3px 0 rgba(0,0,0,0.5),
                        0 4px 0 rgba(0,0,0,0.3),
                        0 6px 0 rgba(0,0,0,0.1),
                        0 8px 16px rgba(0,0,0,0.4),
                        0 0 20px rgba(0,255,0,0.9),
                        0 0 40px rgba(0,255,255,0.7),
                        0 0 60px rgba(255,255,0,0.5),
                        0 0 80px rgba(255,255,255,0.3)
                      `,
                      transform: 'perspective(300px) rotateX(10deg) rotateY(-2deg)',
                      transformStyle: 'preserve-3d',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                    }}
                  >
                    SecureMyAir
                  </Typography>
      <Typography
              sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: 'linear-gradient(135deg, #00ffff 0%, #00ff80 12%, #80ff00 25%, #ffff00 37%, #ff8000 50%, #ff0080 62%, #8000ff 75%, #0080ff 87%, #00ffff 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: `
                        0 1px 0 rgba(121, 109, 109, 0.8),
                        0 2px 0 rgba(0,0,0,0.6),
                        0 3px 0 rgba(0,0,0,0.4),
                        0 4px 6px rgba(0,0,0,0.3),
                        0 0 15px rgba(0,255,255,0.8),
                        0 0 25px rgba(0,255,0,0.6),
                        0 0 35px rgba(255,255,0,0.5),
                        0 0 45px rgba(255,0,255,0.4),
                        0 0 55px rgba(255,255,255,0.3)
                      `,
                      transform: 'perspective(200px) rotateX(8deg)',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  >
                    SECURING INDOOR AIR QUALITY
      </Typography>
                  
                </Box>
              </Box>

              {/* Inspection Date */}
              
            </Box>
          </Box>
          

          {/* Elegant Main Controls and Sensors Container */}
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)',
            borderRadius: 5,
            p: 2,
            mb: 2,
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              borderRadius: '5px 5px 0 0'
            }
          }}>
            {/* System Controls Row with AQI and Temperature */}
            <Grid container spacing={1} sx={{ mb: 2 }}>
                          {/* AQI at the beginning - Dynamic Colors */}
              <Grid item xs={2}>
                <Box sx={{
                  background: res.aqi >= 80 ? 'rgba(34,197,94,0.15)' : 
                             res.aqi >= 60 ? 'rgba(251,146,60,0.15)' : 
                             res.aqi >= 40 ? 'rgba(239,68,68,0.15)' : 
                             'rgba(220,38,38,0.2)',
                  borderRadius: 2,
                  p: 0.8,
                  textAlign: 'center',
                  border: res.aqi >= 80 ? '1px solid rgba(34,197,94,0.4)' : 
                         res.aqi >= 60 ? '1px solid rgba(251,146,60,0.4)' : 
                         res.aqi >= 40 ? '1px solid rgba(239,68,68,0.4)' : 
                         '1px solid rgba(220,38,38,0.5)',
                  minHeight: '50px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: res.aqi >= 80 ? '0 0 8px rgba(34,197,94,0.3)' : 
                            res.aqi >= 60 ? '0 0 8px rgba(251,146,60,0.3)' : 
                            res.aqi >= 40 ? '0 0 8px rgba(239,68,68,0.3)' : 
                            '0 0 12px rgba(220,38,38,0.4)',
                  animation: res.aqi < 40 ? 'criticalPulse 2s ease-in-out infinite' : 
                            res.aqi < 60 ? 'warningPulse 3s ease-in-out infinite' : 'none'
                }}>
                  <Typography sx={{ 
                    color: res.aqi >= 80 ? '#22c55e' : 
                           res.aqi >= 60 ? '#fb923c' : 
                           res.aqi >= 40 ? '#ef4444' : 
                           '#dc2626', 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    mb: 0.3 
                  }}>
                    AQI
                  </Typography>
                  <Typography sx={{ 
                    color: 'white', 
                    fontSize: '0.85rem', 
                    fontWeight: 700,
                    textShadow: res.aqi < 40 ? '0 0 8px rgba(220,38,38,0.8)' : 
                               res.aqi < 60 ? '0 0 6px rgba(239,68,68,0.6)' : 
                               '0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {res.aqi || 0}%
                  </Typography>
                </Box>
              </Grid>
            
            <Grid item xs={2}>
              <Box sx={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                p: 0.8,
                textAlign: 'center',
                border: '1px solid rgba(34,197,94,0.3)',
                minHeight: '50px',
          display: 'flex',
          flexDirection: 'column',
                justifyContent: 'center'
              }}>
                                <Typography sx={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 700, mb: 0.3 }}>
              FAN
            </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.3 }}>
                  <CircleIcon sx={{ fontSize: '0.6rem', color: res.fan1 > 0 ? '#22c55e' : '#64748b' }} />
                  <CircleIcon sx={{ fontSize: '0.6rem', color: res.fan2 > 0 ? '#22c55e' : '#64748b' }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={2}>
              <Box sx={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                p: 0.8,
                textAlign: 'center',
                border: '1px solid rgba(168,85,247,0.3)',
                minHeight: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                                <Typography sx={{ color: '#a855f7', fontSize: '0.7rem', fontWeight: 700, mb: 0.3 }}>
                  UVC
            </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.3 }}>
                  <CircleIcon sx={{ fontSize: '0.6rem', color: res.uvc1 > 0 ? '#a855f7' : '#64748b' }} />
                  <CircleIcon sx={{ fontSize: '0.6rem', color: res.uvc2 > 0 ? '#a855f7' : '#64748b' }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={2}>
              <Box sx={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                p: 0.8,
                textAlign: 'center',
                border: '1px solid rgba(251,146,60,0.3)',
                minHeight: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                                <Typography sx={{ color: '#fb923c', fontSize: '0.7rem', fontWeight: 700, mb: 0.3 }}>
              OSA
            </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.3 }}>
                  <CircleIcon sx={{ fontSize: '0.6rem', color: res.osa1 > 0 ? '#fb923c' : '#64748b' }} />
                  <CircleIcon sx={{ fontSize: '0.6rem', color: res.osa2 > 0 ? '#fb923c' : '#64748b' }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={2}>
              <Box sx={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 2,
                p: 0.8,
                textAlign: 'center',
                border: '1px solid rgba(239,68,68,0.3)',
                minHeight: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                                <Typography sx={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, mb: 0.3 }}>
              C/H
            </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.3 }}>
                  <CircleIcon sx={{ fontSize: '0.6rem', color: res.ch1 > 0 ? '#3b82f6' : '#64748b' }} />
                  <CircleIcon sx={{ fontSize: '0.6rem', color: res.ch2 > 0 ? '#ef4444' : '#64748b' }} />
                </Box>
              </Box>
            </Grid>
            
            {/* Temperature at the end - Dynamic Colors */}
            <Grid item xs={2}>
              <Box sx={{
                background: res.temp >= 75 ? 'rgba(239,68,68,0.15)' : 
                           res.temp >= 70 ? 'rgba(251,146,60,0.15)' : 
                           res.temp >= 65 ? 'rgba(34,197,94,0.15)' : 
                           res.temp >= 60 ? 'rgba(251,146,60,0.15)' : 
                           'rgba(14,165,233,0.15)',
                borderRadius: 2,
                p: 0.8,
                textAlign: 'center',
                border: res.temp >= 75 ? '1px solid rgba(239,68,68,0.4)' : 
                       res.temp >= 70 ? '1px solid rgba(251,146,60,0.4)' : 
                       res.temp >= 65 ? '1px solid rgba(34,197,94,0.4)' : 
                       res.temp >= 60 ? '1px solid rgba(251,146,60,0.4)' : 
                       '1px solid rgba(14,165,233,0.4)',
                minHeight: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: res.temp >= 75 ? '0 0 8px rgba(239,68,68,0.3)' : 
                          res.temp >= 70 ? '0 0 8px rgba(251,146,60,0.3)' : 
                          res.temp >= 65 ? '0 0 8px rgba(34,197,94,0.3)' : 
                          res.temp >= 60 ? '0 0 8px rgba(251,146,60,0.3)' : 
                          '0 0 8px rgba(14,165,233,0.3)',
                animation: res.temp >= 78 ? 'criticalPulse 2s ease-in-out infinite' : 
                          res.temp <= 55 ? 'warningPulse 3s ease-in-out infinite' : 'none'
              }}>
                <Typography sx={{ 
                  color: res.temp >= 75 ? '#ef4444' : 
                         res.temp >= 70 ? '#fb923c' : 
                         res.temp >= 65 ? '#22c55e' : 
                         res.temp >= 60 ? '#fb923c' : 
                         '#0ea5e9', 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  mb: 0.3 
                }}>
                  TEMP
                </Typography>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: '0.85rem', 
                  fontWeight: 700,
                  textShadow: res.temp >= 78 ? '0 0 8px rgba(239,68,68,0.8)' : 
                             res.temp <= 55 ? '0 0 6px rgba(14,165,233,0.6)' : 
                             '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {res.temp || '--'}°F
                </Typography>
              </Box>
            </Grid>
          </Grid>



            {/* Environmental Sensors - Level-Based Colors */}
            <Grid container spacing={1}>
              {[
                { 
                  icon: <Opacity />, 
                  label: 'Humidity', 
                  value: res.humidity?.value || '--', 
                  unit: '%', 
                  data: res.humidity,
                  baseColor: '#06b6d4' 
                },
                { 
                  icon: <Co2 />, 
                  label: 'CO₂', 
                  value: res.co2?.value || '--', 
                  unit: 'ppm', 
                  data: res.co2,
                  baseColor: '#84cc16' 
                },
                { 
                  icon: <Air />, 
                  label: 'VOC', 
                  value: res.voc?.value || '--', 
                  unit: 'ppb', 
                  data: res.voc,
                  baseColor: '#8b5cf6' 
                },
                { 
                  icon: <Grain />, 
                  label: 'PM2.5', 
                  value: res.pm25?.value || '--', 
                  unit: 'μg/m³', 
                  data: res.pm25,
                  baseColor: '#ec4899' 
                },
                { 
                  icon: <Grain />, 
                  label: 'PM10', 
                  value: res.pm10?.value || '--', 
                  unit: 'μg/m³', 
                  data: res.pm10,
                  baseColor: '#ef4444' 
                }
              ].map((sensor, index) => {
                // Determine condition level and color
                const getValue = (val) => parseFloat(val) || 0;
                const sensorValue = getValue(sensor.value);
                const data = sensor.data;
                
                let conditionLevel = 0;
                let conditionColor = '#22c55e'; // Green - Good
                let isGoodCondition = true;
                
                if (data) {
                  if (sensorValue >= getValue(data.level_4)) {
                    conditionLevel = 4;
                    conditionColor = '#dc2626'; // Red - Critical
                    isGoodCondition = false;
                  } else if (sensorValue >= getValue(data.level_3)) {
                    conditionLevel = 3;
                    conditionColor = '#ea580c'; // Orange Red - Poor
                    isGoodCondition = false;
                  } else if (sensorValue >= getValue(data.level_2)) {
                    conditionLevel = 2;
                    conditionColor = '#f59e0b'; // Orange - Fair
                    isGoodCondition = false;
                  } else if (sensorValue >= getValue(data.level_1)) {
                    conditionLevel = 1;
                    conditionColor = '#eab308'; // Yellow - Moderate
                    isGoodCondition = false;
                  } else {
                    conditionLevel = 0;
                    conditionColor = '#22c55e'; // Green - Good
                    isGoodCondition = true;
                  }
                }

                return (
                  <Grid item xs={12/5} key={index}>
                    <Box sx={{
                      background: `linear-gradient(145deg, ${conditionColor}15 0%, ${conditionColor}08 100%)`,
                      borderRadius: 3,
                      p: 0.8,
                      textAlign: 'center',
                      border: `2px solid ${conditionColor}${isGoodCondition ? '40' : '80'}`,
                      backdropFilter: 'blur(15px)',
                      position: 'relative',
                      boxShadow: `0 0 ${isGoodCondition ? '8px' : '16px'} ${conditionColor}${isGoodCondition ? '25' : '40'}`,
                      animation: !isGoodCondition ? 'sparkle 2s infinite' : 'none',
                      transition: 'all 0.3s ease',
                      minHeight: '65px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 'inherit',
                        background: !isGoodCondition ? 
                          `linear-gradient(45deg, transparent 30%, ${conditionColor}10 50%, transparent 70%)` : 
                          'none',
                        animation: !isGoodCondition ? 'shimmer 3s infinite' : 'none',
                        pointerEvents: 'none'
                      },
                      '@keyframes sparkle': {
                        '0%, 100%': { 
                          boxShadow: `0 0 8px ${conditionColor}25`,
                          transform: 'scale(1)' 
                        },
                        '50%': { 
                          boxShadow: `0 0 20px ${conditionColor}50, 0 0 30px ${conditionColor}30`,
                          transform: 'scale(1.02)' 
                        }
                      },
                      '@keyframes shimmer': {
                        '0%': { backgroundPosition: '-200% 0' },
                        '100%': { backgroundPosition: '200% 0' }
                      }
                    }}>
                      <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
                        justifyContent: 'center',
                        mb: 0.5,
                        color: conditionColor,
                        fontSize: '1.2rem'
                      }}>
                        {sensor.icon}
              </Box>
                      <Typography sx={{ 
                        color: conditionColor, 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        mb: 0.3,
                        letterSpacing: '0.05em',
                        opacity: 0.9
                      }}>
                        {sensor.label}
            </Typography>
                      <Typography sx={{ 
                        color: 'white', 
                        fontSize: '0.85rem', 
                        fontWeight: 700, 
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)' 
                      }}>
                        {sensor.value}
            </Typography>
                      <Typography sx={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        fontSize: '0.65rem', 
                        fontWeight: 500,
                        mt: 0.1
                      }}>
                        {sensor.unit}
            </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

                                                            {/* Stunning Grade Display */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Box sx={{
                background: `linear-gradient(135deg, ${aqiCondition.color}18 0%, ${aqiCondition.color}10 50%, ${aqiCondition.color}05 100%)`,
                borderRadius: 4,
                p: 3,
                textAlign: 'center',
                border: `2px solid ${aqiCondition.color}35`,
                boxShadow: `0 20px 60px ${aqiCondition.color}20, 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
                backdropFilter: 'blur(25px)',
                                position: 'relative',
                animation: aqiCondition.isCritical ? 'criticalGlow 2s infinite' : 
                           aqiCondition.isPoor ? 'warningGlow 3s infinite' : 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden',
              '&::after': {
                content: '"🛡️"',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '12rem',
                opacity: 0.05,
                zIndex: 0,
                pointerEvents: 'none',
                filter: 'blur(2px) hue-rotate(20deg) saturate(1.8) contrast(1.2)',
                animation: 'shieldGuard 8s ease-in-out infinite',
                background: `
                  radial-gradient(circle at 30% 30%, rgba(34,197,94,0.15) 0%, transparent 40%),
                  radial-gradient(circle at 70% 70%, rgba(59,130,246,0.12) 0%, transparent 40%),
                  radial-gradient(circle at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 60%),
                  conic-gradient(from 0deg, transparent 0deg, rgba(34,197,94,0.05) 60deg, transparent 120deg, rgba(59,130,246,0.05) 180deg, transparent 240deg, rgba(168,85,247,0.05) 300deg, transparent 360deg)
                `,
                borderRadius: '50%',
                width: '14rem',
                height: '14rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&::before': {
                  content: '"⬡"',
                  position: 'absolute',
                  fontSize: '4rem',
                  opacity: 0.03,
                  color: 'rgba(59,130,246,0.4)',
                  animation: 'hexagonSpin 12s linear infinite reverse',
                  filter: 'blur(1px)'
                }
              },
              '@keyframes shieldGuard': {
                '0%, 100%': { 
                  transform: 'translate(-50%, -50%) scale(1) rotate(0deg)',
                  opacity: 0.04,
                  filter: 'blur(2px) hue-rotate(20deg) saturate(1.5)'
                },
                '25%': { 
                  transform: 'translate(-50%, -48%) scale(1.02) rotate(1deg)',
                  opacity: 0.06,
                  filter: 'blur(1px) hue-rotate(40deg) saturate(1.8)'
                },
                '50%': { 
                  transform: 'translate(-50%, -45%) scale(1.05) rotate(0deg)',
                  opacity: 0.08,
                  filter: 'blur(3px) hue-rotate(60deg) saturate(2.0)'
                },
                '75%': { 
                  transform: 'translate(-50%, -48%) scale(1.02) rotate(-1deg)',
                  opacity: 0.06,
                  filter: 'blur(1px) hue-rotate(40deg) saturate(1.8)'
                }
              },
              '@keyframes hexagonSpin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${aqiCondition.color}60, transparent)`,
                  borderRadius: '4px 4px 0 0'
                },
                '@keyframes criticalGlow': {
                  '0%, 100%': { 
                    boxShadow: `0 4px 16px ${aqiCondition.color}20`,
                    transform: 'scale(1)'
                  },
                  '50%': { 
                    boxShadow: `0 8px 32px ${aqiCondition.color}40, 0 0 60px ${aqiCondition.color}20`,
                    transform: 'scale(1.01)'
                  }
                },
                '@keyframes warningGlow': {
                  '0%, 100%': { 
                    boxShadow: `0 4px 16px ${aqiCondition.color}20`
                  },
                  '50%': { 
                    boxShadow: `0 6px 24px ${aqiCondition.color}30`
                  }
                }
              }}>
                <Box sx={{ 
              display: 'flex',
                              flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
                }}>
                                    {/* Grade Letter - Sharp & Dimensional - Centered */}
                  <Typography
                    sx={{
                      fontSize: '8rem',
                      fontWeight: 900,
                      background: aqiCondition.condition === 'good' ? 'linear-gradient(145deg, #00ff00 0%, #32ff32 15%, #65ff65 30%, #98ff98 45%, #cbffcb 60%, #ffffff 75%, #cbffcb 90%, #00ff00 100%)' :
                                  aqiCondition.condition === 'moderate' ? 'linear-gradient(145deg, #00ffff 0%, #32ffff 15%, #65ffff 30%, #98ffff 45%, #cbffff 60%, #ffffff 75%, #cbffff 90%, #00ffff 100%)' :
                                  aqiCondition.condition === 'poor' ? 'linear-gradient(145deg, #ffff00 0%, #ffff32 15%, #ffff65 30%, #ffff98 45%, #ffffcb 60%, #ffffff 75%, #ffffcb 90%, #ffff00 100%)' :
                                  aqiCondition.condition === 'unhealthy' ? 'linear-gradient(145deg, #ff6600 0%, #ff7732 15%, #ff8865 30%, #ff9998 45%, #ffaacb 60%, #ffffff 75%, #ffaacb 90%, #ff6600 100%)' :
                                  aqiCondition.condition === 'critical' ? 'linear-gradient(145deg, #ff0066 0%, #ff3288 15%, #ff65aa 30%, #ff98cc 45%, #ffcbee 60%, #ffffff 75%, #ffcbee 90%, #ff0066 100%)' :
                                  'linear-gradient(145deg, #00ff00 0%, #32ff32 15%, #65ff65 30%, #98ff98 45%, #cbffcb 60%, #ffffff 75%, #cbffcb 90%, #00ff00 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 0.8,
                      textAlign: 'center',
                      filter: `drop-shadow(0 0 30px ${aqiCondition.color}50) drop-shadow(0 8px 16px rgba(0,0,0,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.6))`,
                      animation: res.letter === 'F' ? 'dramaticPulse 2.5s infinite' : 
                      res.letter === 'D' ? 'warningPulse 3s infinite' : 
                      res.letter === 'C' ? 'warningPulse 4s infinite' : 'none',
                      textShadow: res.letter === 'A' ? `
                        0 2px 0 rgba(0,255,0,0.9),
                        0 4px 0 rgba(50,255,50,0.7),
                        0 6px 0 rgba(101,255,101,0.5),
                        0 8px 0 rgba(152,255,152,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(0,255,0,0.9),
                        0 0 80px rgba(50,255,50,0.7),
                        0 0 120px rgba(101,255,101,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      ` : res.letter === 'B' ? `
                        0 2px 0 rgba(0,255,255,0.9),
                        0 4px 0 rgba(50,255,255,0.7),
                        0 6px 0 rgba(101,255,255,0.5),
                        0 8px 0 rgba(152,255,255,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(0,255,255,0.9),
                        0 0 80px rgba(50,255,255,0.7),
                        0 0 120px rgba(101,255,255,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      ` : res.letter === 'C' ? `
                        0 2px 0 rgba(255,255,0,0.9),
                        0 4px 0 rgba(255,255,50,0.7),
                        0 6px 0 rgba(255,255,101,0.5),
                        0 8px 0 rgba(255,255,152,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(255,255,0,0.9),
                        0 0 80px rgba(255,255,50,0.7),
                        0 0 120px rgba(255,255,101,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      ` : res.letter === 'D' ? `
                        0 2px 0 rgba(255,102,0,0.9),
                        0 4px 0 rgba(255,119,50,0.7),
                        0 6px 0 rgba(255,136,101,0.5),
                        0 8px 0 rgba(255,153,152,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(255,102,0,0.9),
                        0 0 80px rgba(255,119,50,0.7),
                        0 0 120px rgba(255,136,101,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      ` : `
                        0 2px 0 rgba(255,0,102,0.9),
                        0 4px 0 rgba(255,50,136,0.7),
                        0 6px 0 rgba(255,101,170,0.5),
                        0 8px 0 rgba(255,152,204,0.3),
                        0 12px 0 rgba(0,0,0,0.1),
                        0 16px 30px rgba(0,0,0,0.4),
                        0 0 40px rgba(255,0,102,0.9),
                        0 0 80px rgba(255,50,136,0.7),
                        0 0 120px rgba(255,101,170,0.5),
                        0 0 160px rgba(255,255,255,0.3)
                      `,
                      position: 'relative',
                      transform: 'perspective(500px) rotateX(15deg) rotateY(-5deg)',
                      transformStyle: 'preserve-3d',
                      '@keyframes dramaticPulse': {
                        '0%, 100%': { 
                          opacity: 1,
                          transform: 'scale(1)',
                          filter: `drop-shadow(0 0 30px ${aqiCondition.color}50) drop-shadow(0 8px 16px rgba(0,0,0,0.3))`
                        },
                        '50%': { 
                          opacity: 0.8,
                          transform: 'scale(1.05)',
                          filter: `drop-shadow(0 0 50px ${aqiCondition.color}70) drop-shadow(0 12px 24px rgba(0,0,0,0.4))`
                        }
                      },
                      '@keyframes warningPulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.85 }
                      }
                    }}
                  >
                    {res.letter || 'F'}
            </Typography>

                                                      {/* Air Quality Status - Centered Below Grade */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Typography
                      sx={{
                        color: res.letter === 'A' ? '#22c55e' :
                               res.letter === 'B' ? '#3b82f6' :
                               res.letter === 'C' ? '#f59e0b' :
                               res.letter === 'D' ? '#ef4444' :
                               res.letter === 'F' ? '#dc2626' :
                               '#64748b',
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        textShadow: `0 4px 8px rgba(0,0,0,0.4), 0 0 20px ${aqiCondition.color}30`,
                        animation: res.letter === 'F' ? 'criticalTextPulse 2s infinite' : 
                                   res.letter === 'D' ? 'warningTextPulse 3s infinite' : 'none',
                        lineHeight: 1.3,
                        background: `linear-gradient(135deg, ${aqiCondition.color} 0%, ${aqiCondition.color}CC 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: `drop-shadow(0 0 10px ${aqiCondition.color}40)`,
                        '@keyframes criticalTextPulse': {
                          '0%, 100%': { 
                            opacity: 1,
                            transform: 'scale(1)',
                            textShadow: `0 4px 8px rgba(0,0,0,0.4), 0 0 20px ${aqiCondition.color}30`
                          },
                          '50%': { 
                            opacity: 0.9,
                            transform: 'scale(1.02)',
                            textShadow: `0 6px 12px rgba(0,0,0,0.5), 0 0 30px ${aqiCondition.color}50`
                          }
                        },
                        '@keyframes warningTextPulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.9 }
                        }
                      }}
                    >
                      {res.letter === 'A' ? 'HEALTHY AIR QUALITY' :
                       res.letter === 'B' ? 'SAFE AIR QUALITY' :
                       res.letter === 'C' ? ' FAIR AIR QUALITY' :
                       res.letter === 'D' ? ' POOR AIR QUALITY' :
                       res.letter === 'F' ? 'CRITICAL AIR QUALITY' :
                       '📊 MONITORING AIR QUALITY'}
                    </Typography>
                    

                    {/* Next Inspection */}
                    {res.date && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        mt: 1
                      }}>
                        <Box sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
                          boxShadow: '0 0 8px rgba(168,85,247,0.6)',
                          animation: 'inspectionPulse 3s infinite'
                        }} />
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            letterSpacing: '0.02em'
                          }}
                        >
                          Next Inspection: {new Date(res.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: '2-digit'
                          })}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>



          {/* System Status Indicators */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {[
              // { label: 'UVC', status: res.uvc1 > 0 || res.uvc2 > 0 },
              // { label: 'Fan', status: res.fan1 > 0 || res.fan2 > 0 },
              // { label: 'Sensors', status: true },
              // { label: 'AI', status: true }
            ].map((system, index) => (
              <Grid item xs={3} key={index}>
                <Box sx={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  p: 1,
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
              alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5
            }}>
            <CircleIcon
              sx={{
                      fontSize: '0.5rem', 
                      color: system.status ? '#22c55e' : '#64748b' 
                    }} 
                  />
                  <Typography sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '0.6rem', 
                    fontWeight: 600 
                  }}>
                    {system.label}
            </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Location Header - TV Screen Ready */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 1,
            p: 1.5,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(15px)'
          }}>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 900,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                mb: 0.5,
                letterSpacing: '0.05em',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {res.customer || 'SecureMyAir Location'}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                mb: 1,
                letterSpacing: '0.03em'
              }}
            >
              {res.machine || 'Main Area'} • Live Air Quality Monitor
            </Typography>
            
            {/* <Typography
                    variant="body2"
              sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      letterSpacing: '0.03em'
                    }}
                  >
                    SECURING INDOOR AIR QUALITY • REAL-TIME MONITORING
            </Typography> */}
          </Box>

                    

          {/* Enhanced Animations */}
          <style>
            {`
              @keyframes inspectionPulse {
                0%, 100% { opacity: 0.8, transform: scale(1); }
                50% { opacity: 1, transform: scale(1.1); }
              }
              @keyframes livePulse {
                0%, 100% { opacity: 0.9, transform: scale(1); }
                50% { opacity: 1, transform: scale(1.15); }
              }
            `}
          </style>

        </Box>
      </Card>
      </AlternatingDisplay>
      </Box>
    </Box>
  );
}

export default CDashboard;
