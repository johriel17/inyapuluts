import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      instructions: {
        type: String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      liquor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liquor',
        required: true,
      },

},
{
    timestamps: true

})

const Recipe = mongoose.model('Recipe', recipeSchema)

export default Recipe
