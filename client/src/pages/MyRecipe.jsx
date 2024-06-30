import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState, useRef} from 'react';
import ApiClient from '../components/Api';

// components
import RecipeDetails from '../components/Recipe/RecipeDetails';
import RecipeDetailsSkeleton from '../components/Recipe/RecipeDetailsSkeleton';
import RecipeForm from '../components/Recipe/RecipeForm';
import NoRecipe from '../components/Recipe/NoRecipe';
import CustomPagination from '../components/CustomPagination';

// context hooks
import { useRecipeContext } from '../hooks/Recipe/useRecipeContext';

const MyRecipe = () => {
  const { recipes, dispatch } = useRecipeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const formRef = useRef(null);

  const api = ApiClient();

  const fetchRecipes = async (page) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/recipes/my-recipes?page=${page}&limit=5`);
      dispatch({ type: 'SET_RECIPES', payload: res.data.recipes });
      setIsLoading(false);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    fetchRecipes(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteRecipe = (recipe) => {
    dispatch({ type: 'DELETE_RECIPE', payload: recipe });
  };

  const handleEditRecipe = (recipe) => {
    // setRecipeToEdit(recipe);
    setRecipeToEdit({
      ...recipe,
      liquor : recipe.liquor.name
    })
  };

  useEffect(() => {
    if (recipeToEdit && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [recipeToEdit]);

  const handleFormSubmit = () => {
    setRecipeToEdit(null);
  };

  const handleEditCancel = () => {
    setRecipeToEdit(null);
  };

  return (
    <Container maxWidth='xl'>
      <Box sx={{ paddingX: { xs: '15px', md: '75px' }, marginY: '5px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
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
                    onEdit={handleEditRecipe}
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
          <Grid item xs={12} md={4} ref={formRef}>
              <RecipeForm
                recipeToEdit={recipeToEdit}
                onFormSubmit={handleFormSubmit}
                onEditCancel={handleEditCancel}
              />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MyRecipe;
