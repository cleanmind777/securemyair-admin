/** @format */

import React from 'react';
import CircularProgress from './CircularProgress';

const ProgressContainer = ({ columns, loading, data }) => {
  return (
    <>
      {columns
        .filter(row => {
          if (
            row.id === 'AQI' ||
            row.id === 'time' ||
            row.id === 'date' ||
            row.id === 'Out_Radon_Spare'
          ) {
            return false;
          } else {
            return true;
          }
        })
        .map(item => {
          return (
            <CircularProgress
              key={item.id}
              color={loading ? '#000000' : `#${data[item.id]['color']}`}
              value={loading ? 0 : data[item.id]['value']}
              lable={loading ? 'Loading..' : item.label}
              unit={item.unit}
            />
          );
        })}
    </>
  );
};

export default ProgressContainer;
