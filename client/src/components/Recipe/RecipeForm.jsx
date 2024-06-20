import React, { useState } from 'react';
import { TextField, Button, Input, FormHelperText, Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel, Box, IconButton, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteRounded from '@mui/icons-material/DeleteRounded'
import ApiClient from '../Api';
import { useRecipeContext } from '../../hooks/Recipe/useRecipeContext';


//context
import { useAuthContext } from '../../hooks/useAuthContext';

const RecipeForm = () => {

    const api = ApiClient()
    const {user} = useAuthContext()
    const {dispatch} = useRecipeContext()

    const [formValues, setFormValues] = useState({
      name: '',
      description: '',
      instructions: '',
      liquor: '',
      ingredients: [{ name: '', quantity: '', unit: '' }],
    });
  
    const handleChange = (e, index) => {
      const { name, value } = e.target;
      const newIngredients = [...formValues.ingredients];
      newIngredients[index][name] = value;
      setFormValues({
        ...formValues,
        ingredients: newIngredients,
      });
      
    };
  
    const handleAddIngredient = () => {
      setFormValues({
        ...formValues,
        ingredients: [...formValues.ingredients, { name: '', quantity: '', unit: '' }],
      });
    };

    const handleDeleteIngredient = (index) => {
        const newIngredients = formValues.ingredients.filter((_, i) => i !== index);
        setFormValues({
          ...formValues,
          ingredients: newIngredients,
        });
    };
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      console.log('Form Values:', formValues);
      try{
        const res = await api.post('/recipes', {...formValues, user})
        dispatch({type: 'CREATE_RECIPE', payload: res.data})

        //to reset the form
        setFormValues({
            name: '',
            description: '',
            instructions: '',
            liquor : '',
            ingredients: [{ name: '', quantity: '', unit: '' }],
        })
        
        console.log(res.data)
      }catch(error){
        console.log(error)
      }
      
    };
  
    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '18px auto', boxShadow: 5, padding: 3 }}>
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          required
          autoComplete='off'
          value={formValues.name}
          onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
        />
        <TextField
          label="Description"
          variant="outlined"
          name="description"
          rows={3}
          multiline
          required
          value={formValues.description}
          onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
        />
        <TextField
          label="Instructions"
          variant="outlined"
          name="instructions"
          rows={3}
          multiline
          required
          value={formValues.instructions}
          onChange={(e) => setFormValues({ ...formValues, instructions: e.target.value })}
        />
        <TextField
          label="Best Liquor with"
          variant="outlined"
          name="liquor"
          required
          value={formValues.liquor}
          onChange={(e) => setFormValues({ ...formValues, liquor: e.target.value })}
        />
  
        {formValues.ingredients.map((ingredient, index) => (
          <Box key={index} display="flex" gap={1}>
            <TextField
              label="Ingredient"
              variant="outlined"
              name="name"
              required
              autoComplete='off'
              size="small"
              sx={{ flex: 1.4 }}
              value={ingredient.name}
              onChange={(e) => handleChange(e, index)}
            />
            <TextField
              label="Qty"
              variant="outlined"
              name="quantity"
              required
              autoComplete='off'
              type='number'
              size="small"
              sx={{ flex: 1 }}
              value={ingredient.quantity}
              onChange={(e) => handleChange(e, index)}
            />
            <TextField
              label="Unit"
              variant="outlined"
              name="unit"
              required
              autoComplete='off'
              size="small"
              sx={{ flex: 1 }}
              value={ingredient.unit}
              onChange={(e) => handleChange(e, index)}
            />
            <IconButton color="error" aria-label="delete ingredient" onClick={() => handleDeleteIngredient(index)}>
                <DeleteRounded />
            </IconButton>
          </Box>
        ))}
        
        <Box display="flex" alignItems="center">
          <IconButton color="success" aria-label="add an ingredient" onClick={handleAddIngredient}>
            <AddCircleIcon />
            <Typography variant="body2" color="textSecondary">
              Add More
            </Typography>
          </IconButton>
        </Box>
        
        <Button type="submit" variant="contained" color="primary">
          Add Recipe
        </Button>
      </Box>
    );
  };

export default RecipeForm;
