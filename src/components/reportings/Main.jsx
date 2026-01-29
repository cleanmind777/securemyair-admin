/** @format */

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material';
import { Reports, Trends, Values } from './index';
let theme = createTheme({ typography: { fontSize: 15, button: { textTransform: 'none' } } });
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
const InColumns = [
  { id: 'date', label: 'Date', minWidth: 50, numeric: true },
  { id: 'time', label: 'Time', minWidth: 50, numeric: true },
  { id: 'AQI', label: 'AQI', minWidth: 50, numeric: true, unit: '%' },
  { id: 'In_Temperature', label: 'Temperature', minWidth: 50, numeric: true, unit: '°F' },
  { id: 'In_Humidity', label: 'Humidity', minWidth: 50, numeric: true, unit: '' },
  { id: 'In_CO2', label: 'CO2', minWidth: 50, numeric: true, unit: '' },
  { id: 'In_VOC', label: 'VOC', minWidth: 50, numeric: true, unit: '' },
  { id: 'In_CO', label: 'CO', minWidth: 50, numeric: true, unit: '' },
  { id: 'In_PM_2.5', label: 'PM 2.5', minWidth: 50, numeric: true, unit: '' },
  { id: 'In_PM_10', label: 'PM 1.0', minWidth: 50, numeric: true, unit: '' },
];
const OutColumns = [
  { id: 'date', label: 'Date', minWidth: 50, numeric: true },
  { id: 'time', label: 'Time', minWidth: 50, numeric: true },
  { id: 'Out_Temperature', label: 'Temperature', minWidth: 50, numeric: true, unit: '°F' },
  { id: 'Out_Humidity', label: 'Humidity', minWidth: 50, numeric: true, unit: '' },
  { id: 'Out_O3', label: 'O3', minWidth: 50, numeric: true, unit: '' },
  { id: 'Out_SO2', label: 'SO2', minWidth: 50, numeric: true, unit: '' },
  { id: 'Out_CO', label: 'CO', minWidth: 50, numeric: true, unit: '' },
  { id: 'Out_CO2', label: 'CO2', minWidth: 50, numeric: true, unit: '' },
  { id: 'Out_NO2', label: 'NO2', minWidth: 50, numeric: true, unit: '' },
  { id: 'Out_PM_2_5', label: 'PM 2.5', minWidth: 50, numeric: true, unit: '' },
  { id: 'Out_PM_10', label: 'PM 1.0', minWidth: 50, numeric: true, unit: '' },
  { id: 'Out_Radon_Spare', label: 'Radon', minWidth: 50, numeric: true },
];
export default function Main() {
  const [value, setValue] = React.useState(() => {
    const memoTab = +localStorage.getItem('admin_reportings_tab');
    if (memoTab) {
      return memoTab;
    } else {
      localStorage.setItem('admin_reportings_tab', 0);
      return 0;
    }
  });

  const handleChange = (event, newValue) => {
    localStorage.setItem('admin_reportings_tab', newValue);
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label='Display Values' />
            <Tab label='Reports' />
            <Tab label='Trends' />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Values InColumns={InColumns} OutColumns={OutColumns} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Reports InColumns={InColumns} OutColumns={OutColumns} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Trends InColumns={InColumns} OutColumns={OutColumns} />
        </TabPanel>
      </Box>
    </ThemeProvider> 
  );
}
