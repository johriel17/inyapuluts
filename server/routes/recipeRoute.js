import  express  from "express"
import { getRecipes, getRecipe, createRecipe, getMyRecipes, saveRecipe, getSavedRecipes, likeRecipe } from "../controllers/recipeController.js"
import { protect, adminOnly } from '../middlewares/authMiddleware.js'
const router = express.Router()


router.use(protect)
// router.use(adminOnly)

router.get('/', getRecipes)

router.get('/my-recipes/:user', getMyRecipes)

router.get('/like-recipe/:recipeId', likeRecipe)

router.get('/save-recipe/:recipeId', saveRecipe)

router.get('/saved-recipes', getSavedRecipes)

router.get('/:id', getRecipe)

router.post('/', createRecipe)

// router.put('/:id', updateUser)

// router.delete('/:id', deleteUser)

export default router