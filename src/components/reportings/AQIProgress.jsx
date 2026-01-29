/** @format */

import { Box } from '@mui/material';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
const AQIProgress = ({ color, value, lable, unit }) => {
  var series = [+value];
  const options = {
    chart: {
      id: 'Radial-bar',
    },
    plotOptions: {
      radialBar: {
        // startAngle: -135,
        startAngle: -150,
        endAngle: 150,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: '#fff',
          strokeWidth: '100%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888', // lable color
            fontSize: '15px',
          },
          value: {
            formatter: function (val) {
              return val + unit;
            },
            color: '#111', // value color
            fontSize: '30px',
            show: true,
          },
        },
      },
    },
    fill: {
      colors: [color],
      type: 'solid',
    },
    stroke: {
      lineCap: 'round',
    },
    labels: [lable],
  };
  return <ReactApexChart series={series} type='radialBar' options={options} width='420' />;
};

export default AQIProgress;
