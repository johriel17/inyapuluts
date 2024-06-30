import  express  from "express"
import { getRecipes, getRecipe, createRecipe, getMyRecipes, saveRecipe, getSavedRecipes, likeRecipe, getTopRecipes, editRecipe, deleteRecipe } from "../controllers/recipeController.js"
import { protect, adminOnly } from '../middlewares/authMiddleware.js'
const router = express.Router()


router.use(protect)
// router.use(adminOnly)

router.get('/', getRecipes)

router.get('/my-recipes', getMyRecipes)

router.get('/like-recipe/:recipeId', likeRecipe)

router.get('/save-recipe/:recipeId', saveRecipe)

router.get('/saved-recipes', getSavedRecipes)

router.get('/top-recipes/:filter', getTopRecipes)

router.get('/:id', getRecipe)

router.post('/', createRecipe)

router.put('/:recipeId', editRecipe)

router.delete('/:recipeId', deleteRecipe)

export default router