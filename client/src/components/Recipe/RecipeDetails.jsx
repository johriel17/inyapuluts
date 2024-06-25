import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { Router, Link as RouterLink} from 'react-router-dom'

//date-fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { Box } from '@mui/material';

//axios
import ApiClient from '../Api';

//context
import { useAuthContext } from '../../hooks/useAuthContext';

export default function RecipeDetails({ recipe, page, saved, liked, likes }) {
  const api = ApiClient()
  const [isSaved, setIsSaved] = useState(saved)
  const [isLiked, setIsLiked] = useState(liked)

  const [likesCount, setLikesCount] = useState(likes)

  const { user } = useAuthContext()



  const handleLikeRecipe = async() => {

    if(isLiked === true){
      console.log('already liked')
      return
    }

    try{
      const res = await api.get(`/recipes/like-recipe/${recipe._id}`)
      setIsLiked(true)
      setLikesCount(prev => prev + 1)
    }catch(error){
      
      console.log(error)
    }

  }

  const handleSaveRecipe = async() => {

    if(isSaved === true){
      console.log('already saved')
      return
    }
    try{
      setIsSaved(true)
      const res = await api.get(`/recipes/save-recipe/${recipe._id}`)
    }catch(error){
      console.log(error)
    }

  }

  return (
    <Box display='flex' alignItems='center' p={2}>
      <Card sx={{ marginX: '20px', boxShadow: 5, width: '100%'}}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {recipe.user.username.toUpperCase().charAt(0)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={recipe.user.username}
          subheader={formatDistanceToNow(new Date(recipe.createdAt), {addSuffix: true})}
        />
        <Box display="flex" justifyContent="center">
          <CardMedia
            component="img"
            height="20"
            image="/sample_food.jpg"
            alt="sample"
            sx={{
              width: '50%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: 5
            }}
          />
        </Box>
        <CardContent>
          <Typography variant="h5" color="text.primary">
            {recipe.name}
          </Typography>
          <Typography variant="subtitle1" sx={{fontStyle: 'italic'}} color="text.primary">
            Best with {recipe.liquor.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recipe.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton sx={{ color: isLiked ? '#ff1744' : 'grey' }} aria-label="add to favorites" onClick={handleLikeRecipe}>
            <FavoriteIcon />
          </IconButton>
          <Typography variant='body2'>{likesCount}</Typography>
          <IconButton color='primary' component={RouterLink} to={`/recipe/${recipe._id}`}>
            <VisibilityIcon />
          </IconButton>
          {page === 'home' && user._id != recipe.user._id && (
          <IconButton color={isSaved? 'primary' : 'default'} aria-label="save recipe" onClick={handleSaveRecipe}>
            <TurnedInIcon />
          </IconButton>
          )}
        </CardActions>
      </Card>
    </Box>
    
  );
}