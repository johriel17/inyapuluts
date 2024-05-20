import  express  from "express"
import { getUsers, getUser, createUser, updateUser, deleteUser, login } from "../controllers/userController.js"
// import { protect, adminOnly } from '../middleware/authMiddleware.js'
const router = express.Router()


router.post('/login', login)

// router.use(protect)
// router.use(adminOnly)

router.get('/', getUsers)

router.get('/:id', getUser)

router.post('/', createUser)

router.put('/:id', updateUser)

router.delete('/:id', deleteUser)

export default router