import { Container, Typography, Box } from '@mui/material'
import React from 'react'

const Home = () => {
  return (
    <Container maxWidth='xl' sx={{marginX : '100px'}}>
      <Box>
        <Typography color='success' variant='h2'>
          Hello World!
        </Typography>
      </Box>
    </Container>
  )
}

export default Home