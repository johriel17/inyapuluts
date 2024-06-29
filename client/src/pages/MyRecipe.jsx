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
import CustomPagination from '../components/CustomPagination';

//context hooks
import { useRecipeContext } from '../hooks/Recipe/useRecipeContext';

const MyRecipe = () => {

  const {recipes, dispatch} = useRecipeContext()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const api = ApiClient()

  const fetchRecipes = async (page) => {

    try{
      setIsLoading(true)
      const res = await api.get(`/recipes/my-recipes?page=${page}&limit=5`)
      dispatch({type : 'SET_RECIPES', payload : res.data.recipes})
      setIsLoading(false)
      setTotalPages(res.data.totalPages)
    }catch(error){
      console.log(error)
      setIsLoading(false)
    }

  }

  useEffect(() => {

    fetchRecipes(currentPage)

  }, [currentPage])

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteRecipe = (recipe) => {
    dispatch({ type: 'DELETE_RECIPE', payload: recipe });
  };
  
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
                  liked={recipe.Liked}
                  likes={recipe.likes}
                  onDelete={handleDeleteRecipe}
                />
              ))
            ) : (
              <NoRecipe />
            )
          )}

          {!isLoading && recipes && recipes.length > 0 && (
              <CustomPagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                handlePageChange={handlePageChange} 
              />
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