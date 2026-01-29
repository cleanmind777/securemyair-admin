/** @format */
import { Typography, Box, Card, Avatar, Chip } from '@mui/material';
import { Sensors as SensorsIcon, Air, Thermostat, Visibility } from '@mui/icons-material';
import IndoorSensors from './IndoorSensors';
import OutdoorSensors from './OutdoorSensors';
import InspectionDate from './InspectionDate';

function Sensors() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
      {/* Beautiful Header */}
      <Card
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(16,185,129,0.12) 100%)',
          border: '1px solid rgba(34,197,94,0.15)',
          borderRadius: 2,
          p: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ 
            width: 36, 
            height: 36,
            background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
            boxShadow: '0 4px 12px rgba(34,197,94,0.3)'
          }}>
            <SensorsIcon sx={{ fontSize: '1.2rem', color: 'white' }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: 'rgba(30,41,59,0.95)', 
              fontSize: '1.1rem',
              letterSpacing: '0.02em'
            }}>
              Environmental Sensors
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(34,197,94,0.8)', 
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              Air quality monitoring
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip
              icon={<Air sx={{ fontSize: '0.7rem' }} />}
              label="AQI"
              size="small"
              sx={{
                backgroundColor: 'rgba(59,130,246,0.15)',
                color: 'rgba(59,130,246,0.9)',
                borderColor: 'rgba(59,130,246,0.3)',
                fontWeight: 600,
                fontSize: '0.65rem',
                height: '22px'
              }}
              variant="outlined"
            />
            <Chip
              icon={<Thermostat sx={{ fontSize: '0.7rem' }} />}
              label="TEMP"
              size="small"
              sx={{
                backgroundColor: 'rgba(251,146,60,0.15)',
                color: 'rgba(251,146,60,0.9)',
                borderColor: 'rgba(251,146,60,0.3)',
                fontWeight: 600,
                fontSize: '0.65rem',
                height: '22px'
              }}
              variant="outlined"
            />
          </Box>
        </Box>
      </Card>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <IndoorSensors />
        <OutdoorSensors />
        <InspectionDate />
      </Box>
    </Box>
  );
}
export default Sensors;
