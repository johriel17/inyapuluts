import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Button, CardMedia, Box, Typography, Skeleton } from '@mui/material';
import ApiClient from '../Api';

const TopRecipe = () => {
  const api = ApiClient();
  const navigate = useNavigate();

  const [active, setActive] = useState('most-liked');
  const [topRecipes, setTopRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRecipes = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/recipes/top-recipes/${active}`);
        setTopRecipes(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchTopRecipes();
  }, [active]);

  const handleViewRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <Container component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '18px auto', boxShadow: 5, padding: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: 2 }} aria-label="Basic button group">
          <Button
            variant={active === 'most-liked' ? 'contained' : 'outlined'}
            onClick={() => setActive('most-liked')}
          >
            Most Liked
          </Button>
          <Button
            variant={active === 'most-saved' ? 'contained' : 'outlined'}
            onClick={() => setActive('most-saved')}
          >
            Most Saved
          </Button>
        </Box>

        {loading ? (
          [1, 2, 3, 4, 5].map((item) => (
            <Paper key={item} elevation={5} sx={{ padding: 2, marginBottom: 2 }}>
              <Box display='flex'>
                <Skeleton variant="rectangular" width={50} height={30} sx={{ alignSelf: 'center', marginRight: 2 }} />
                <Skeleton variant="rectangular" height='auto' width="25%" sx={{ marginRight: 2 }} />
                <Box display='flex' flexDirection='column' width="100%">
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Box>
              </Box>
            </Paper>
          ))
        ) : (
          topRecipes.map((recipe, index) => (
            <Paper key={recipe.recipeId} elevation={5} sx={{ padding: 2, cursor: 'pointer', marginBottom: 2 }} onClick={() => handleViewRecipe(recipe.recipeId)}>
              <Box display='flex'>
                <Box display='inherit' justifyContent='center' alignItems='center' border={1} sx={{ alignSelf: 'center', width: '30px', height: '30px', marginRight: 2 }}>
                  <Typography variant='h6'>{index + 1}</Typography>
                </Box>
                <CardMedia
                  component="img"
                  image="/sample_food.jpg"
                  alt="sample"
                  sx={{
                    width: '25%',
                    height: 'auto',
                    objectFit: 'cover',
                    marginRight: 2,
                  }}
                />
                <Box display='flex' flexDirection='column'>
                  <Typography variant='h6'>
                    {recipe.recipeDetails.name}
                  </Typography>
                  <Typography variant='body1'>
                    Best with {recipe.liquorDetails.name}
                  </Typography>
                  <Typography variant='body2'>
                    {recipe.count} {active === 'most-liked' ? 'likes' : 'saves'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
};

export default TopRecipe;
