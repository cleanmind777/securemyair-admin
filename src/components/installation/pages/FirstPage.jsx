/** @format */

import { TableBody } from '@mui/material';
import React from 'react';
import RowFile from '../RowFile';
import RowText from '../RowText';

const FirstPage = () => {
  return (
    <TableBody>
      <RowFile name='outEnvReport' lable='Outdoor Environmental Report' />
      <RowFile name='inEnvReport' lable='Indoor Environmental Report' />
      <RowFile name='engrDesign' lable='Blue Print and Engineering Design' />
      <RowFile name='outAirAssessment' lable='Outdoor Air Flow Directional Assessment' />
      <RowFile
        name='layoutCleanAir'
        lable='Layout of Clean to Less Clean Air within Confined Space'
      />
      <RowText name='acType' lable='Type of AC Systems' />
      <RowText name='model' lable='Model Number' />
      <RowText name='units' lable='Number of Units' />
    </TableBody>
  );
};

export default FirstPage;
