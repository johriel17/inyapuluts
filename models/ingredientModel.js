import mongoose from "mongoose";

const ingredientSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
  
const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient