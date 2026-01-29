/** @format */

import React, { useContext, useEffect, useState } from 'react'
import { Box, Stack, Switch, Typography } from '@mui/material'
import AQIProgress from './AQIProgress'
import ProgressContainer from './ProgressContainer'
import { MachineContext } from '../../MachineContext'
import axios from 'axios'
import { CustomerContext } from '../../CustomerContext'
import { useNavigate } from 'react-router-dom'

const Values = ({ InColumns, OutColumns }) => {
  const token = localStorage.getItem('authToken')
  const { machineID } = useContext(MachineContext)
  const [res, setRes] = useState([])
  const { setCustomerID } = useContext(CustomerContext)
  const navigate = useNavigate()

  const [columns, setColumns] = useState(() => {
    const oldSwitch = localStorage.getItem('admin_reportings_switch')
    return oldSwitch === 'true' ? OutColumns : InColumns
  })
  const [loading, setLoading] = useState(() => true)
  const [switchVal, setSwitchVal] = useState(() => {
    const oldSwitch = localStorage.getItem('admin_reportings_switch')

    if (oldSwitch) {
      return oldSwitch === 'true'
    } else return false
  })
  const fetchData = async () => {
    await axios
      .get(`reportings/values.php?api=${machineID}`, {
        headers: { Authorization: token },
      })
      .then((result) => {
        console.log('askldfja;lskdfjasd;kljfasd;kljfasd;klfj')
        console.log({ result })
        if (result.data.error === 'Expired token') {
          localStorage.clear()
          setCustomerID(null)
          navigate('/login')
        }
        const newData = result.data
        if (JSON.stringify(newData) !== JSON.stringify(res)) {
          setRes(newData)
          setLoading(false)
        }
      })
      .catch((error) => console.log(error))
  }
  useEffect(() => {
    let intervalId
    fetchData()
    intervalId = setInterval(fetchData, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [res, machineID])
  const handleSwitch = (e) => {
    setSwitchVal(e.target.checked)
    setColumns(e.target.checked ? OutColumns : InColumns)
    localStorage.setItem('admin_reportings_switch', e.target.checked)
  }
  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ flexWrap: 'wrap' }} gap={1}>
        <Stack
          sx={{
            flex: 1,
            display: 'flex',
            maxWidth: '85vw',
            alignItems: 'center',
          }}
          direction={'column'}
        >
          <Stack direction='row' alignItems='center' sx={{ order: 0 }}>
            <Typography variant='body1'>Indoor</Typography>
            <Switch
              disabled={loading}
              sx={{
                '.MuiSwitch-thumb': { color: '#1976d2' },
                '.MuiSwitch-track': { backgroundColor: '#1976d2' },
              }}
              checked={switchVal}
              onChange={handleSwitch}
            />
            <Typography variant='body1'>Outdoor</Typography>
          </Stack>
          <AQIProgress
            color={loading ? '#000000' : `#${res.AQI.color}`}
            value={loading ? 0 : res.AQI.value}
            lable={loading ? 'Loading..' : 'AQI'}
            unit={'%'}
          />
        </Stack>
        <Stack direction={'row'} sx={{ diaplay: 'flex', flex: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ProgressContainer data={res} columns={columns} loading={loading} />
          </Box>
        </Stack>
      </Stack>
    </>
  )
}

export default Values
