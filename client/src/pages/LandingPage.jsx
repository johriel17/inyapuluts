
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react'
import ApiClient from '../components/Api';
import Link from '@mui/material/Link'
import { Link as RouterLink} from 'react-router-dom';
//components
import RecipeDetails from '../components/Recipe/RecipeDetails';
import RecipeDetailsSkeleton from '../components/Recipe/RecipeDetailsSkeleton';
import NoRecipe from '../components/Recipe/NoRecipe'

//context hooks
import { useRecipeContext } from '../hooks/Recipe/useRecipeContext';
const LandingPage = () => {

  const {recipes, dispatch} = useRecipeContext()
  const [isLoading, setIsLoading] = useState(false)

  const api = ApiClient()

  const fetchSampleRecipe = async () => {

    try{
      setIsLoading(true)
      const res = await api.get(`/recipes/sample-recipes`)
      dispatch({type : 'SET_RECIPES', payload : res.data})
      setIsLoading(false)
    }catch(error){
      console.log(error)
      setIsLoading(false)
    }

  }

  useEffect(() => {

    fetchSampleRecipe()

  }, [])

  return (
      <Container maxWidth='xl'>
        <Box sx={{paddingX: {xs: '15px', md: '75px'}, marginY : '5px'}}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>

            {isLoading ? (
              <RecipeDetailsSkeleton />
            ) : (
              recipes && recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <RecipeDetails
                    key={recipe._id}
                    recipe={recipe}
                    page='landing'
                  />
                ))
              ) : (
                <NoRecipe />
              )
            )}
      
            <Box display='flex' justifyContent='end'>
                <Link size='large' component={RouterLink} variant='body2' to='/login'>{'See more Recipes'}</Link>
            </Box>
          </Grid>
        </Grid>
        </Box>
      </Container>
  )
}

export default LandingPage