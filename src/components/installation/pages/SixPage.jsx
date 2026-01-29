/** @format */

import { TableBody } from '@mui/material';
import InsRowText from '../InsRowText';

const SixPage = () => {
  return (
    <TableBody>
      <InsRowText lable='Finishing date scheduled' name='finishDate' />
      <InsRowText
        lable='Hardware in possession model numbers uploaded'
        name='hardwareModelUploaded'
      />
      <InsRowText lable='Startup crew selected' name='crewSelected' />
      <InsRowText lable='Air balancing teste and results uploaded' name='balanceResultUploaded' />
      <InsRowText lable='Was installation according to design' name='installAccordingDesign' />
      <InsRowText lable='Corrections list itemized' name='list_itemized' />
      <InsRowText
        lable='Corrections list verified by time stamped uploaded pictures'
        name='	listVerified'
      />
    </TableBody>
  );
};

export default SixPage;
