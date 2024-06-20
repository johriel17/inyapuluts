import mongoose from "mongoose";

const recipeIngredientSchema = mongoose.Schema({
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    
  }, { timestamps: true });
  
const RecipeIngredient = mongoose.model('RecipeIngredient', recipeIngredientSchema)

export default RecipeIngredient