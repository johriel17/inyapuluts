import { Paper } from '@mui/material'
import React from 'react'

const NotFound = () => {
  return (
    <Paper sx={{ display: 'flex', justifyContent: 'center'}} elevation={3} >
        <h3>This page could not be found</h3>
    </Paper>

  )
}

export default NotFound