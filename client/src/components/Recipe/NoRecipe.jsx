import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'


const NoRecipe = () => {
  return (
    <Box display='flex' alignItems='center' justifyContent='center' p={2}>
        <Card sx={{ marginX: '20px', boxShadow: 5, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CardContent>
                <Typography variant="h5" color="text.primary">
                        No Recipe
                </Typography>
            </CardContent>
        </Card>
    </Box>
  )
}

export default NoRecipe