import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord'
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';

import ApiClient from '../components/Api';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const Recipe = () => {

    const {id} = useParams()
    const api = ApiClient()

    const [recipe, setRecipe] = useState(null)
    const [ingredients, setIngredients] = useState([])

    useEffect(()=>{

        const fetchRecipe = async() => {
            try{
                const res = await api.get(`/recipes/${id}`)
                setRecipe(res.data.recipe)
                setIngredients(res.data.ingredients)
                console.log(res.data.ingredients)
            }catch(error){
                console.log(error)
            }
        }

        fetchRecipe()

    }, [])


  return (
    <Container maxWidth='xl'>
    {/* <Box sx={{paddingX: {xs: '15px', md: '75px'}, marginY : '5px'}}>
        <Typography variant='h2'>
            {recipe && recipe.name}
        </Typography>

        {ingredients.length > 0 && ingredients.map((ingredient) => (
            <Box key={ingredient._id}>
                <Typography variant='body2'>
                    {ingredient.ingredient.name}
                </Typography>
                <Typography variant='body2'>
                    {ingredient.unit}
                </Typography>
                <Typography variant='body2'>
                    {ingredient.quantity}
                </Typography>
            </Box>

        ))}
    </Box> */}
    <Box display='flex' alignItems='center' p={2}>
      <Card sx={{ marginX: '20px', boxShadow: 5, width: '100%'}}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              shiish
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="woooow"
          subheader={recipe && formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
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
            <Box p={2}>

            <Typography variant="h5" color="text.primary">
                {recipe && recipe.name}
            </Typography>
            <Typography variant="subtitle1" color="text.primary">
                Description:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{marginBottom: 1}}>
                {recipe && recipe.description}
            </Typography>
            <Typography variant="subtitle1" color="text.primary">
                Instructions:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{marginBottom: 1}}>
                {recipe && recipe.instructions}
            </Typography>
            <Typography variant="subtitle1" color="text.primary">
                Ingredients:
            </Typography>
            <List>
            {ingredients.length > 0 &&
                ingredients.map((ingredient) => (
                <ListItem key={ingredient._id}>
                    <FiberManualRecord sx={{ fontSize: 'small', marginRight: 1 }} />
                    <Typography variant="body2">
                    {ingredient.ingredient.name} - {ingredient.quantity} {ingredient.unit}
                    </Typography>
                </ListItem>
                ))}
            </List>

            </Box>
          
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  </Container>
  )
}

export default Recipe