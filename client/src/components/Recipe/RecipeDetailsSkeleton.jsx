import React from 'react'

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Skeleton from '@mui/material/Skeleton';
import Box from'@mui/material/Box'


const RecipeDetailsSkeleton = () => {
    return (
        <Box display='flex' alignItems='center' p={2}>
            <Card sx={{ marginX: '20px', boxShadow: 5, width: '100%' }}>
            <CardHeader
                avatar={
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
                }
                action={null}
                title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
                subheader={<Skeleton animation="wave" height={10} width="40%" />}
            />
            <Box display="flex" justifyContent="center">
                <Skeleton sx={{ height: 194, width: '50%', borderRadius: 5 }} animation="wave" variant="rectangular" />
            </Box>
            <CardContent>
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
            </CardContent>
            <CardActions disableSpacing>
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
                <Skeleton animation="wave" height={10} width="20px" />
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
            </CardActions>
            </Card>
        </Box>
      );
}

export default RecipeDetailsSkeleton