/** @format */

import React from 'react';

const SenserContainer = ({ val, lable, ht }) => {
  return (
    <div style={{ width: 'calc(100%/8)', display: 'flex', flexDirection: 'column' }}>
      <div className='sensorContainer'>
        <span className='senserContainerVal'>{ht ? ht.toFixed(1) : 0}%</span>
        <strong
          style={{
            height: `${ht}%`,
            background: '#3aa5dd',
            width: '100%',
            display: 'block',
            position: 'absolute',
            bottom: 0,
            fontSize: '1.4vh',
          }}></strong>
      </div>
      <p style={{ fontSize: '2vh' }}>
        {lable}
        <br />
        {val}
      </p>
    </div>
  );
};

export default SenserContainer;
