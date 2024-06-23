import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react'
import ApiClient from '../components/Api';

//components
import RecipeDetails from '../components/Recipe/RecipeDetails';
import RecipeDetailsSkeleton from '../components/Recipe/RecipeDetailsSkeleton';
import RecipeForm from '../components/Recipe/RecipeForm';
import NoRecipe from '../components/Recipe/NoRecipe';

//context hooks
import { useRecipeContext } from '../hooks/Recipe/useRecipeContext';
import { useAuthContext } from '../hooks/useAuthContext';
const MyRecipe = () => {

  const {recipes, dispatch} = useRecipeContext()
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const api = ApiClient()
  useEffect(() => {

    const fetchRecipes = async () => {

      try{
        setIsLoading(true)
        const res = await api.get(`/recipes/my-recipes/${user._id}`)
        dispatch({type : 'SET_RECIPES', payload : res.data})
        setIsLoading(false)
      }catch(error){
        console.log(error)
        setIsLoading(false)
      }

    }

    fetchRecipes()

  }, [])

  
  return (
    <Container maxWidth='xl'>
      <Box sx={{paddingX: {xs: '15px', md: '75px'}, marginY : '5px'}}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>

          {/* {recipes && recipes.map((recipe)=>(
            <RecipeDetails key={recipe._id} recipe={recipe} page='myRecipe' saved={false}/>
          ))}

          {recipes && recipes.length === 0  && (
            <NoRecipe/>
          )} */}

          {isLoading ? (
            <RecipeDetailsSkeleton />
          ) : (
            recipes && recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeDetails
                  key={recipe._id}
                  recipe={recipe}
                  page='myRecipe'
                  saved={recipe.Saved}
                  liked={recipe.Liked}
                  likes={recipe.likes}
                />
              ))
            ) : (
              <NoRecipe />
            )
          )}

        </Grid>
        <Grid item xs={12} md={4}>


            <RecipeForm />

          
        </Grid>
      </Grid>
      </Box>
    </Container>
  )
}

export default MyRecipe