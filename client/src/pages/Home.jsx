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
import TopRecipe from '../components/Recipe/TopRecipe';
import RecipeDetailsSkeleton from '../components/Recipe/RecipeDetailsSkeleton';
import NoRecipe from '../components/Recipe/NoRecipe'

//context hooks
import { useRecipeContext } from '../hooks/Recipe/useRecipeContext';
const Home = () => {

  const {recipes, dispatch} = useRecipeContext()
  const [isLoading, setIsLoading] = useState(false)

  const api = ApiClient()
  useEffect(() => {

    const fetchRecipes = async () => {

      try{
        setIsLoading(true)
        const res = await api.get('/recipes')
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
              <RecipeDetails key={recipe._id} recipe={recipe} page='home' saved={recipe.Saved} liked={recipe.Liked} likes={recipe.likes}  />
            ))} */}

            {isLoading ? (
              <RecipeDetailsSkeleton />
            ) : (
              recipes && recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <RecipeDetails
                    key={recipe._id}
                    recipe={recipe}
                    page='home'
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

            {/* <Box sx={{height : '500px', backgroundColor: 'blue'}}></Box> */}
            <TopRecipe />
            
          </Grid>
        </Grid>
        </Box>
      </Container>
  )
}

export default Home