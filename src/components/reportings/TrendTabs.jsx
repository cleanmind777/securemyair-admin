/** @format */

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, useMediaQuery } from '@mui/material';
import ChartComponent from './ChartComponent';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
// const tabs = [
//   { lable: 'AQI', id: 'AQI' },
//   { lable: 'In Temperature', id: 'In_Temperature' },
//   { lable: 'In Humidity', id: 'In_Humidity' },
//   { lable: 'In CO2', id: 'In_CO2' },
//   { lable: 'In VOC', id: 'In_VOC' },
//   { lable: 'In PM 2.5', id: 'In_PM_2.5' },
//   { lable: 'In PM 10', id: 'In_PM_10' },
//   { lable: 'In CO', id: 'In_CO' },
//   { lable: 'Out Temperature', id: 'Out_Temperature' },
//   { lable: 'Out Humidity', id: 'Out_Humidity' },
//   { lable: 'Out O3', id: 'Out_O3' },
//   { lable: 'Out SO2', id: 'Out_SO2' },
//   { lable: 'Out CO', id: 'Out_CO' },
//   { lable: 'Out CO2', id: 'Out_CO2' },
//   { lable: 'Out NO2', id: 'Out_NO2' },
//   { lable: 'Out PM 2.5', id: 'Out_PM_2.5' },
//   { lable: 'Out PM 10', id: 'Out_PM_10' },
//   { lable: 'Out Radon Spare', id: 'Out_Radon_Spare' },
// ];
let theme = createTheme();
export default function TrendTabs({ data, columns: tabs }) {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = React.useState(0);
  React.useEffect(() => setValue(0), [tabs]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        height: 740,
        flexDirection: { xs: 'column', sm: 'row' },
      }}>
      <Tabs
        orientation={isMobile ? 'horizontal' : 'vertical'}
        variant='scrollable'
        scrollButtons
        allowScrollButtonsMobile
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: 'divider' }}>
        {tabs
          .filter(tab => {
            if (tab.id === 'date' || tab.id === 'time') {
              return false;
            } else return true;
          })
          .map(tab => (
            <Tab key={tab.id} sx={{ textTransform: 'none' }} label={tab.label} />
          ))}
      </Tabs>
      {tabs
        .filter(tab => {
          if (tab.id === 'date' || tab.id === 'time') {
            return false;
          } else return true;
        })
        .map((tab, index) => (
          <TabPanel key={tab.id} value={value} index={index} className='tabPanel'>
            <ChartComponent
              data={data.map(item => {
                const rawDate = new Date(item.timeStamp);
                const date = new Date(
                  Date.UTC(
                    rawDate.getFullYear(),
                    rawDate.getMonth(),
                    rawDate.getDate(),
                    rawDate.getHours(),
                    rawDate.getMinutes(),
                    rawDate.getSeconds(),
                    0
                  )
                );
                return {
                  x: date.getTime(),
                  y: +item[tab.id],
                };
              })}
              tab={tab}
            />
          </TabPanel>
        ))}
    </Box>
  );
}
