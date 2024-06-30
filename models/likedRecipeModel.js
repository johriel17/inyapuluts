import mongoose from "mongoose";

const likedRecipeSchema = mongoose.Schema({
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
  
const LikedRecipe = mongoose.model('LikedRecipe', likedRecipeSchema)

export default LikedRecipe