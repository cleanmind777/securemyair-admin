/** @format */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Divider
} from '@mui/material';
import { Settings, PlayArrow, Pause } from '@mui/icons-material';

const DisplaySettings = ({ 
  hvacDuration, 
  onHvacDurationChange, 
  isEnabled, 
  onEnabledChange,
  isPlaying,
  onPlayPause
}) => {
  const [open, setOpen] = useState(false);
  const [tempHvacDuration, setTempHvacDuration] = useState(hvacDuration);

  const handleSave = () => {
    onHvacDurationChange(tempHvacDuration);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempHvacDuration(hvacDuration);
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={isPlaying ? <Pause /> : <PlayArrow />}
          onClick={onPlayPause}
          sx={{ minWidth: 'auto' }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<Settings />}
          onClick={() => setOpen(true)}
          sx={{ minWidth: 'auto' }}
        >
          Settings
        </Button>
      </Box>

      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Display Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isEnabled}
                  onChange={(e) => onEnabledChange(e.target.checked)}
                />
              }
              label="Enable alternating display"
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              When enabled, the dashboard will alternate between HVAC data and advertisements
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              HVAC Display Duration
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              How long to show HVAC data before switching to ads (seconds)
            </Typography>

            <Box sx={{ px: 2 }}>
              <Slider
                value={tempHvacDuration}
                onChange={(e, value) => setTempHvacDuration(value)}
                min={5}
                max={60}
                step={5}
                marks={[
                  { value: 5, label: '5s' },
                  { value: 15, label: '15s' },
                  { value: 30, label: '30s' },
                  { value: 45, label: '45s' },
                  { value: 60, label: '60s' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}s`}
              />
            </Box>

            <TextField
              fullWidth
              label="Custom Duration (seconds)"
              type="number"
              value={tempHvacDuration}
              onChange={(e) => setTempHvacDuration(parseInt(e.target.value) || 10)}
              inputProps={{ min: 5, max: 300 }}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DisplaySettings;
