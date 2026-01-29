/** @format */

import { TableBody } from '@mui/material';
import React from 'react';
import RowFile from '../RowFile';
import RowText from '../RowText';

const FifthPage = () => {
  return (
    <TableBody>
      <RowFile
        name='certificationApplication'
        lable='SecureMyAir to Issue Certification Application'
      />
      <RowText name='certificationApproveBy' lable='Certification Approved By' />
      <RowText name='warrantyAgreeDate' lable='1 Year Warranty Agreement Termination Date' />
      <RowFile name='agreementCertification' lable='Agreement To Maintain And Keep Certification' />
    </TableBody>
  );
};

export default FifthPage;
