//useCallBack is used to save function ,that doesn't change so that no new function is generated
//useMemo is used to save a value which is saved so the value isn't recreated
import React, {useReducer,useState,useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from'./IngredientList'
import ErrorModel from '../UI/ErrorModal'

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
const httpReducer = (currhttp,action)=>{
    switch(action.type){
      case 'SEND':
        return {isLoading:true,error:null}
      case 'RESPONSE':
        return {...currhttp , isLoading:false}
      case 'ERROR':
        return {isLoading:false,error:action.errorMessage}
      case 'CLEAR':
        return{...currhttp,error:null}
      default:throw new Error('Should not get there')
    }

}
const  Ingredients = () =>{
  //const [userIngredients, setuserIngredients] = useState([]);
  //const [isLoading,setIsLoading] = useState(false);
  //const [error,setError] = useState();
  const [userIngredients,dispatch]=useReducer(ingredientReducer,[])
  const [httpData,dispatchHttp]=useReducer(httpReducer,{isLoading:false,error:null})
 /*  useEffect(()=>{
    fetch('https://ingredients-bd209.firebaseio.com/ingredients.json')
    .then(response =>response.json())
    .then(responseData =>{
      const loadIngredients = [];
      for(const key in responseData){
      loadIngredients.push({
        id : key,
        title:responseData[key].title,
        amount:responseData[key].amount
      });
    }
    setuserIngredients(loadIngredients);//update the state
    })
  },[]);//[] specify dependencies acts like componentDidMount(called only once) */
  //filter will get inital/current value 
  //we are calling this useeffect in search componect so get rid of this extra render cycle

  useEffect (()=>console.log('Rendering arguments',userIngredients) ,[userIngredients] )
  //the useEffect will run when there is a change in [userIngredients]
    
  const addIngredientsHandler = useCallback((ingredientsFromIngredientsForm) =>{
    //setIsLoading(true);//useState
    dispatchHttp({type:'SEND'});
    fetch('https://ingredients-bd209.firebaseio.com/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredientsFromIngredientsForm),
      headers:{'Content-Type':'application/json'}
      //fetch always has promises
    }).then(response =>{
      //setIsLoading(false);//useState
      dispatchHttp({type:'RESPONSE'});
      return response.json() //will be converted to js object
      }).then(responseData =>{ //responseData will be obj  ect now
        /* setuserIngredients(prevIngredients=>[
          ...prevIngredients,
          {id:responseData.name,...ingredientsFromIngredientsForm}
          //firebase has name instead of id
          ]) */
          dispatch({type:'ADD',ingredient: {id:responseData.name,...ingredientsFromIngredientsForm}})
      })
  },[])//[] check if there is any dependies which is coming from outside method
//so no dependies but 'dispatchHttp'is a dependent but react take vares of that internally

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

  const removeIngredients = useCallback(ingredientsIDFromIngredientsForm =>{
   // setIsLoading(true);//useState
    dispatchHttp({type:'SEND'});
    fetch(`https://ingredients-bd209.firebaseio.com/ingredients/${ingredientsIDFromIngredientsForm}.json`,{
      method:'DELETE',
      //fetch always has promises
    }).then(response =>{
      //setIsLoading(false);
      dispatchHttp({type:'RESPONSE'})
  /*   setuserIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientsIDFromIngredientsForm)
    ) */
    dispatch({type:'DELETE',id:ingredientsIDFromIngredientsForm})
    }).catch(error =>{
      //setError(error.message); // useState
      //setIsLoading(false); // useState
      dispatchHttp({type:'ERROR',errorMessage:error.message});
    })
  },[])//again no dependies
  const onClickErrorOkay = useCallback(() =>{
    //setError(null);//useState
    //setIsLoading(false);//useState
    dispatchHttp({type:'CLEAR'})
  })

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
        {httpData.error && <ErrorModel onClose={onClickErrorOkay}>{httpData.error}</ErrorModel>}
      <IngredientForm onAddIngredients={addIngredientsHandler} loading={httpData.isLoading} />

      <section>
        <Search onFilterIngredients={getFilterIngredients} />
      
        {ingredientListNew}
      </section>
    </div>
  );
}

export default Ingredients;
