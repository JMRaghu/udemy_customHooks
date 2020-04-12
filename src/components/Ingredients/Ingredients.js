//useCallBack is used to save function ,that doesn't change so that no new function is generated
//useMemo is used to save a value which is saved so the value isn't recreated
//useEffect runs after every render cycle
import React, {useReducer,useState,useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from'./IngredientList'
import ErrorModel from '../UI/ErrorModal'
import useHttp from '../CustomHooks/http'


/* useReducer concept */
const ingredientReducer = (currentIngredients,action) =>{
  switch(action.type){
    case 'SET':
      return action.filterIngredients
    case 'ADD':
      return [...currentIngredients,action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing=>ing.id !== action.id)
    default:
       throw new Error('Should not get there');
  }
}

const  Ingredients = () =>{
  const [userIngredients,dispatch]=useReducer(ingredientReducer,[]);
  const{
    isLoadingProperty,
    errorProperty,
    dataProperty,
    sendRequestFunctionData,
    extraProperty,
    reqIdentfier,
    clearProperty
  }=useHttp();
  //responseDataKey updates the state will retriger the component the uses our hook torebuild itself
  //our Ingredients will rebuild itself when 'sendrequest' is done 
  //thanks to the logic we have in our customhook/http bcoz 'dispatchHttp' which is coming from 'HttpReducer'updates the state,
  //this rebuilds the component which is used, of couser used in hooks and used in 'Ingrdients'Component
  //therefor component rebuilds

  
  useEffect (()=>{
    console.log('Rendering arguments dataProperty',dataProperty);
  if(!isLoadingProperty && !errorProperty && reqIdentfier === 'REMOVE_INGREDIENT'){
    dispatch({type:'DELETE',id:extraProperty});//were do we get id??so solution is add new property oin customhooks
  }
  else if(!isLoadingProperty && !errorProperty && reqIdentfier === 'ADD_INGREDIENT'){
    dispatch({
      type:'ADD',
      ingredient: {id:dataProperty.name,...extraProperty}
    })
  }
  },[dataProperty,extraProperty,isLoadingProperty,errorProperty,reqIdentfier]);
  //the useEffect will run when there is a change in [userIngredients]
    
  const addIngredientsHandler = useCallback((ingredientsFromIngredientsForm) =>{
    console.log('1st beefor to hook')
    sendRequestFunctionData('https://ingredients-bd209.firebaseio.com/ingredients.json',
    'POST',
    JSON.stringify(ingredientsFromIngredientsForm),
    ingredientsFromIngredientsForm,
    'ADD_INGREDIENT'
    //no extraProperty
    )
  } ,[sendRequestFunctionData])//[] check if there is any dependies which is coming from outside method


  //Parent component gets loaded because first time when we load data we call 'onFilterIngredients'
  //which calls 'getFilterIngredients' in that we are calling 'setuserIngredients' which changes the state
  //again rerenders component which means that it is creating 'getFilterIngredients'function bcoz entire components reruns
  //science it is javascript function still 'getFilterIngredients' reruns for 2nd time so receives new value
  // useCallback??
//to avoid the above rerender useCallback wrap the function, so it caches the function
//it is not recreated or run again
  const getFilterIngredients =
  useCallback((filterData) =>{
    console.log('filterdata'+JSON.stringify(filterData))
    //setuserIngredients(filterData);
    dispatch({type:'SET', filterIngredients:filterData});
  },[])

  const removeIngredients = useCallback(
    ingredientsIDFromIngredientsForm =>{
      sendRequestFunctionData(`https://ingredients-bd209.firebaseio.com/ingredients/${ingredientsIDFromIngredientsForm}.json`,
    'DELETE',
    null,
    ingredientsIDFromIngredientsForm,
    'REMOVE_INGREDIENT'
      )
    
  },[sendRequestFunctionData])//sendRequestFunctionData is dependencies of useCallback bcoz we are
  //returning from useHttp [check hooks comment]
  const onClickErrorOkay = useCallback(() =>{
   clearProperty()
  },[])

  // use memo here or in ingredients list
  const ingredientListNew = useMemo(() =>{
    return(
    <IngredientList
      ingredients={userIngredients}
      onRemoveItem={removeIngredients}
    />)
  },[userIngredients,removeIngredients]);

  return (
      <div className="App">
        {errorProperty && <ErrorModel onClose={onClickErrorOkay}>{errorProperty}</ErrorModel>}
      <IngredientForm onAddIngredients={addIngredientsHandler} loading={isLoadingProperty} />

      <section>
        <Search onFilterIngredients={getFilterIngredients} />
      
        {ingredientListNew}
      </section>
    </div>
  );
}

export default Ingredients;
