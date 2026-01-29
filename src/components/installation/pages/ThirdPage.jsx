/** @format */

import { TableBody } from '@mui/material';
import React from 'react';
import RowFileC from '../RowFileC';
import RowFileS from '../RowFileS';
import RowText from '../RowText';

const ThirdPage = () => {
  return (
    <TableBody>
      <RowText name='companyName' lable='Name of the Company' />
      <RowText name='projectManager' lable='Project Manager' />
      <RowFileC name='ackDesign' lable='Acknowledgement of Design and Criteria Per Job' />
      <RowFileS
        sName='roughFauStatus'
        name='roughFau'
        lable='Rough FAU set up- Pictures (Convert the pictures in signle PDF file and then attacth)'
      />
      <RowFileS sName='roughDuctStatus' name='roughDuct' lable='Rough Ductwork Design' />
      <RowFileS
        sName='roughWiringStatus'
        name='roughWiring'
        lable='Rough Wiring Pictures (Convert the pictures in signle PDF file and then attacth)'
      />
      <RowFileS
        sName='roughTVStatus'
        name='roughTV'
        lable='Rough TV Mount Locations Showing Wiring as well'
      />
      <RowFileC name='outdoorSensorLoc' lable='All Indoor Sensor Locations Written in Software' />
      <RowFileC name='outdoorSensorLoc' lable='All Outdoor Sensor Locations Written in Software' />
      <RowFileC name='contract' lable='Contract Agreement Signed' />
    </TableBody>
  );
};

export default ThirdPage;
