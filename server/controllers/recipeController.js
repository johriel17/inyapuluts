import Recipe from '../models/recipeModel.js'
import Ingredient from "../models/ingredientModel.js";
import RecipeIngredient from '../models/recipeIngredientModel.js';
import Liquor from '../models/liquorModel.js'
import SavedRecipe from '../models/savedRecipeModel.js';
import LikedRecipe from '../models/likedRecipeModel.js';
import User from '../models/userModel.js'

export const getRecipes = async (req, res) => {
    try {

      const user = req.user

    // Fetch all recipes and populate the user field
    const recipes = await Recipe.find({})
    .populate('user')
    .sort({createdAt : -1})

    // Fetch saved recipes for the user and populate the recipe field
    const savedRecipes = await SavedRecipe.find({ user: user._id }).populate('recipe');
    const likedRecipes = await LikedRecipe.find({ user: user._id }).populate('recipe');

    // Create a set of saved recipe IDs for easy lookup
    const savedRecipeIds = new Set(savedRecipes.map(savedRecipe => savedRecipe.recipe._id.toString()));
    const likedRecipeIds = new Set(likedRecipes.map(likedRecipe => likedRecipe.recipe._id.toString()));

    // Combine data and add the 'Saved' boolean property
    const combinedRecipes = await Promise.all(recipes.map(async (recipe) => {
      const plainRecipe = recipe.toObject();
  
      // Query number of likes for this recipe
      const likesCount = await LikedRecipe.countDocuments({ recipe: recipe._id });
  
      return {
          ...plainRecipe,
          likes: likesCount,
          Saved: savedRecipeIds.has(recipe._id.toString()),
          Liked: likedRecipeIds.has(recipe._id.toString())
      };
    }));

    return res.status(200).json(combinedRecipes);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
};

export const getMyRecipes = async (req, res) => {
  try {

    const {user} = req.params

    const recipes = await Recipe.find({user: user}).populate('user')
  
    return res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }

};

export const getSavedRecipes = async (req, res) => {
  try {

    const user = req.user

    const savedRecipes = await SavedRecipe.find({ user: user._id }).populate('recipe').sort({ createdAt: -1 });

    const recipes = await Promise.all(savedRecipes.map(async (savedRecipe) => {
      const recipe = savedRecipe.recipe.toObject();
      recipe.Saved = true;
      recipe.user = await User.findOne({ _id: recipe.user });
      return recipe;
    }));

  
    return res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }

};

export const getRecipe = async (req,res) => {
    try{
        const { id } = req.params

        const recipe = await Recipe.findById(id).exec();
        const ingredients = await RecipeIngredient.find({ recipe: id }).populate('ingredient').exec();

        return res.status(200).json({recipe, ingredients})

    }catch(error){
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

export const createRecipe = async (req, res) => {
    try {
      const { name, description, instructions, user, liquor,  ingredients } = req.body;
      const errors = {};
  
      if (!name) {
        errors.name = 'name is required';
      }
      if (!description) {
        errors.name = 'description is required';
      }
      if (!instructions) {
        errors.name = 'instructions are required';
      }

      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        errors.ingredients = 'At least one ingredient is required';
      }
      if (!user) {
        errors.user = 'user is required';
      }

      if (!liquor) {
        errors.liquor = 'liquor is required';
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }


      const liquorData = await Liquor.findOne({ name : liquor }).select('_id')

      let liquorId;
      if (!liquorData) {
        const newLiquor = new Liquor({ name : liquor });
        await newLiquor.save();
        liquorId = newLiquor._id;
      } else {
        liquorId = liquorData._id;
      }

      const recipe = new Recipe({
        name,
        description,
        instructions,
        user,
        liquor : liquorId,
      });
      
  
      await recipe.save();

      const recipeIngredients = await Promise.all(ingredients.map(async ({ name, quantity, unit }) => {
        let ingredient = await Ingredient.findOne({ name });
  
        if (!ingredient) {
          ingredient = new Ingredient({ name });
          await ingredient.save();
        }
  
        return new RecipeIngredient({
          recipe: recipe._id,
          ingredient: ingredient._id,
          quantity,
          unit,
        });
      }));
  
  
      await RecipeIngredient.insertMany(recipeIngredients);

      const response = await Recipe.findById(recipe._id).populate('user');

      return res.status(201).json( response );
      
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };

  export const saveRecipe = async(req,res) => {

    try{

      const { recipeId } = req.params
      const user = req.user
      
      const savedRecipe = new SavedRecipe({
        recipe : recipeId,
        user : user._id
      })
  
      savedRecipe.save()

      return res.status(200).json({message : 'Recipe successfully saved'})

    }catch(error){
      console.log(error)
      res.status(500).json({ error: 'Server error'})
    }

  }

  export const likeRecipe = async(req,res) => {

    try{

      const { recipeId } = req.params
      const user = req.user
      
      const likedRecipe = new LikedRecipe({
        recipe : recipeId,
        user : user._id
      })
  
      likedRecipe.save()

      return res.status(200).json({message : 'Recipe successfully liked'})

    }catch(error){
      console.log(error)
      res.status(500).json({ error: 'Server error'})
    }

  }