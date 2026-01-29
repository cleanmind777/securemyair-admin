/** @format */

import { TableBody } from '@mui/material';
import React from 'react';
import RowFileCS from '../RowFileCS';

const SecondPage = () => {
  return (
    <TableBody>
      <RowFileCS name='bpApproveFau' lable='Blue Print with Approved FAU Locations' />
      <RowFileCS
        name='bpApproveSupply'
        lable='Blue Print with Approved Supply and Return Locations'
      />
      <RowFileCS name='bpIndoor' lable='Blue Print with All Indoor Sensor Approved Location' />
      <RowFileCS name='bpOutdoor' lable='Blue Print with All Outdoor Sensor Approved Location' />
      <RowFileCS name='bpExhaust' lable='Blue Print with All Exhaust Locations Stated' />
      <RowFileCS name='bpFresh' lable='Blue Print with All Fresh Air Locations Entries Stated' />
      <RowFileCS name='bpPlc' lable='Blue Print with PLC Locations' />
      <RowFileCS name='bpDash' lable='Blue Print with All Dash Screen Locations' />
      <RowFileCS
        name='bpHvac'
        lable='Blue Print to Verify that all HVAC Unit have Fresh Air Canceled'
      />
    </TableBody>
  );
};

export default SecondPage;
