import Recipe from '../models/recipeModel.js'
import Ingredient from "../models/ingredientModel.js";
import RecipeIngredient from '../models/recipeIngredientModel.js';
import Liquor from '../models/liquorModel.js'
import SavedRecipe from '../models/savedRecipeModel.js';
import LikedRecipe from '../models/likedRecipeModel.js';
import User from '../models/userModel.js'

export const getRecipes = async (req, res) => {
  try {
    const user = req.user;

    // Get pagination parameters from query string, defaulting to page 1 and 10 items per page
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch total count of recipes for pagination
    const totalRecipes = await Recipe.countDocuments({});

    // Fetch recipes for the current page
    const recipes = await Recipe.find({})
      .populate('user')
      .populate('liquor')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Fetch saved and liked recipes for the user
    const savedRecipes = await SavedRecipe.find({ user: user._id }).populate('recipe');
    const likedRecipes = await LikedRecipe.find({ user: user._id }).populate('recipe');

    // Create a set of saved and liked recipe IDs for easy lookup
    const savedRecipeIds = new Set(savedRecipes.map(savedRecipe => savedRecipe.recipe._id.toString()));
    const likedRecipeIds = new Set(likedRecipes.map(likedRecipe => likedRecipe.recipe._id.toString()));

    // Combine data and add the 'Saved' and 'Liked' boolean properties
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

    // Return paginated data along with total count
    return res.status(200).json({
      totalRecipes,
      currentPage: page,
      totalPages: Math.ceil(totalRecipes / limit),
      recipes: combinedRecipes
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};


export const getMyRecipes = async (req, res) => {
  try {

    // const {user} = req.params
    const user = req.user

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    const totalRecipes = await Recipe.countDocuments({ user })

    const myRecipes = await Recipe.find({user: user})
    .populate('user')
    .sort({ createdAt : -1})
    .skip(skip)
    .limit(limit)

    const likedRecipes = await LikedRecipe.find({ user }).populate('recipe')

    const likedRecipeIds = new Set(likedRecipes.map(likedRecipe => likedRecipe.recipe._id.toString()))

    const recipes = await Promise.all(myRecipes.map(async (myRecipe) => {
      const recipe = myRecipe.toObject()

      const likesCount = await LikedRecipe.countDocuments({ recipe : myRecipe._id})

      return {
        ...recipe,
        likes: likesCount,
        Liked: likedRecipeIds.has(myRecipe._id.toString())
      }
    }))
  
    return res.status(200).json({
      totalRecipes,
      currentPage : page,
      totalPages : Math.ceil(totalRecipes / limit),
      recipes
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }

};

export const getSavedRecipes = async (req, res) => {
  try {

    const user = req.user

    // const savedRecipes = await SavedRecipe.find({ user: user._id }).populate('recipe').sort({ createdAt: -1 });

    // const recipes = await Promise.all(savedRecipes.map(async (savedRecipe) => {
    //   const recipe = savedRecipe.recipe.toObject();
    //   recipe.Saved = true;
    //   recipe.user = await User.findOne({ _id: recipe.user });
    //   return recipe;
    // }));

    const totalSavedRecipes = await SavedRecipe.countDocuments({ user: user._id });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const savedRecipes = await SavedRecipe.find({ user: user._id })
    .populate('recipe')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

    const likedRecipes = await LikedRecipe.find({ user: user._id }).populate('recipe');
    
    const likedRecipeIds = new Set(likedRecipes.map(likedRecipe => likedRecipe.recipe._id.toString()));

    const recipes = await Promise.all(savedRecipes.map(async (savedRecipe) => {
      const recipe = savedRecipe.recipe.toObject();

      const likesCount = await LikedRecipe.countDocuments({ recipe: recipe._id });

      return {
        ...recipe,
        likes: likesCount,
        Saved: true,
        Liked: likedRecipeIds.has(recipe._id.toString()),
        user: await User.findOne({ _id: recipe.user })
      };
    }));

  
    return res.status(200).json({
      totalSavedRecipes,
      currentPage : page,
      totalPages : Math.ceil(totalSavedRecipes / limit),
      recipes
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }

};

export const getRecipe = async (req,res) => {
    try{
        const { id } = req.params

        const user = req.user

        const recipe = await Recipe.findById(id).populate('liquor').populate('user').exec();
        const ingredients = await RecipeIngredient.find({ recipe: id }).populate('ingredient').exec();

        const likesCount = await LikedRecipe.countDocuments({ recipe: id });

        const likedByUser = await LikedRecipe.exists({ recipe: id, user});
        const savedByUser = await SavedRecipe.exists({ recipe: id, user})

        return res.status(200).json({
          recipe : {
            ...recipe.toObject(),
            likes : likesCount,
            Liked : !!likedByUser,
            Saved : !!savedByUser
          },
          ingredients
        })

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

      const exists = await SavedRecipe.exists({ recipe: recipeId, user})

      if(exists){
        return res.status(200).json({ message: 'Failed! Recipe already saved'})
        
      }else{

        const savedRecipe = new SavedRecipe({
          recipe : recipeId,
          user : user._id
        })
    
        savedRecipe.save()
        return res.status(200).json({message : 'Recipe successfully saved'})

      }

    }catch(error){
      console.log(error)
      res.status(500).json({ error: 'Server error'})
    }

  }

  export const likeRecipe = async(req,res) => {

    try{

      const { recipeId } = req.params
      const user = req.user

      const exists = await LikedRecipe.exists({ recipe: recipeId, user})
      
      if(exists) {

        return res.status(200).json({ message: 'Failed! Recipe already liked'})

      }else{

        const likedRecipe = new LikedRecipe({
          recipe : recipeId,
          user : user._id
        })
    
        likedRecipe.save()
  
        return res.status(200).json({message : 'Recipe successfully liked'})

      }
      
    }catch(error){
      console.log(error)
      res.status(500).json({ error: 'Server error'})
    }

  }

  export const getTopRecipes = async (req, res) => {
    try {
      // Aggregate the most liked recipes

      const { filter } = req.params

      if(filter === 'most-liked'){
        var Model = LikedRecipe;
      }else if(filter === 'most-saved'){
        var Model = SavedRecipe
      }
      

      const topRecipes = await Model.aggregate([
        {
          $group: {
            _id: '$recipe',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: 'recipes',
            localField: '_id',
            foreignField: '_id',
            as: 'recipeDetails',
          },
        },
        {
          $unwind: '$recipeDetails',
        },
        {
          $lookup: {
            from: 'liquors', // Name of the referenced collection
            localField: 'recipeDetails.liquor', // Field in 'Recipe' collection referencing 'Liquor'
            foreignField: '_id',
            as: 'liquorDetails',
          },
        },
        {
          $unwind: '$liquorDetails',
        },
        {
          $project: {
            _id: 0,
            recipeId: '$_id',
            count: 1,
            recipeDetails: {
              _id: 1,
              name: 1,
              // Include other fields from 'Recipe' collection as needed
            },
            liquorDetails: {
              _id: '$liquorDetails._id',
              name: '$liquorDetails.name',
              // Include other fields from 'Liquor' collection as needed
            },
          },
        },
      ]);
  
      res.status(200).json(topRecipes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };