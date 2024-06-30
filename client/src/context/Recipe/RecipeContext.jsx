import { createContext, useReducer } from "react";

export const RecipeContext = createContext()

export const recipeReducer = (state, action) => {
    switch (action.type) {
        case 'SET_RECIPES':
            return {recipes : action.payload}
        case 'CREATE_RECIPE':
            return {recipes : [action.payload, ...state.recipes]}
        case 'DELETE_RECIPE':
            return {recipes: state.recipes.filter((recipe) => recipe._id !== action.payload._id)}
        case 'UPDATE_RECIPE':
            return {
                recipes: state.recipes.map((recipe) =>
                recipe._id === action.payload._id ? action.payload : recipe
                ),
            };
        default:
            return state
    }
}

export const RecipeContextProvider = ({children}) => {

    const [state,dispatch] = useReducer(recipeReducer,{
         recipes : null
        })

    
    // console.log('Recipe state', state)

    return (
        <RecipeContext.Provider value={{...state,dispatch}}>
            {children}
        </RecipeContext.Provider>
    )
}