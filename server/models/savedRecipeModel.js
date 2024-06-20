import mongoose from "mongoose";

const savedRecipeSchema = mongoose.Schema({
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
  }, { timestamps: true });
  
const SavedRecipe = mongoose.model('SavedRecipe', savedRecipeSchema)

export default SavedRecipe