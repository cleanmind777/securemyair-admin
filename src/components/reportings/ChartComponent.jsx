/** @format */

import { createTheme, useMediaQuery } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';
let theme = createTheme();

const ChartComponent = ({ data, tab }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const options = {
    chart: {
      id: tab.id,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
    },
    tooltip: {
      x: {
        format: 'MMM dd, yyyy HH:MM',
      },
    },
    title: {
      text: `${tab.label} Trends`,
      align: isMobile ? 'left' : 'center',
    },

    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      title: {
        text: 'Date Time',
      },
    },
    yaxis: {
      type: 'numeric',
      title: {
        text: tab.lable,
      },
      forceNiceScale: true,
    },
  };
  const series = [
    // { name: tab.lable, data: { x: data.map(item => item.time), y: data.map(item => item.value) } },
    { name: tab.label, data },
  ];
  return <Chart options={options} series={series} type='line' />;
};

export default ChartComponent;
