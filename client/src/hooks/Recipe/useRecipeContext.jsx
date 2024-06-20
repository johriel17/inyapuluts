import { RecipeContext } from "../../context/Recipe/RecipeContext";

import { useContext } from "react";

export const useRecipeContext = () => {
    const context = useContext(RecipeContext)

    if(!context){
        throw Error('useRecipeContext must be used inside an useRecipeContext Provider')
    }

    return context
}