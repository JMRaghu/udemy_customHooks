import React, {useState,useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from'./IngredientList'
import ErrorModel from '../UI/ErrorModal'

const  Ingredients = () =>{
  const [userIngredients, setuserIngredients] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState();

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
  //we are calling this useeffect in search componect so get ridding of this extra render cycle

  useEffect (()=>console.log('Rendering arguments',userIngredients) ,[userIngredients] )
  //the useEffect will run when there is a change in [userIngredients]
    
  const addIngredientsHandler = (ingredientsFromIngredientsForm) =>{
    setIsLoading(true);
    fetch('https://ingredients-bd209.firebaseio.com/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredientsFromIngredientsForm),
      headers:{'Content-Type':'application/json'}
      //fetch always has promises
    }).then(response =>{
      setIsLoading(false);
      return response.json() //will be converted to js object
      }).then(responseData =>{ //responseData will be obj  ect now
        setuserIngredients(prevIngredients=>[
          ...prevIngredients,
          {id:responseData.name,...ingredientsFromIngredientsForm}
          //firebase has name instead of id
          ])
      })
  }
  //Parent component gets loaded because first time when we load data we call 'onFilterIngredients'
  //which calls 'getFilterIngredients' in that we are calling 'setuserIngredients' which changes the state
  //again rerenders component which means that it is creating 'getFilterIngredients'function bcoz entire components reruns
  //science it is javascript function still 'getFilterIngredients' reruns for 2nd time so receives new value
  // useCallback??
//to avoid the above rerender useCallback wrap the function, so it caches the function
//it is not recreated or run again
  const getFilterIngredients =
  useCallback((filterData) =>{
    console.log('filterdata'+filterData)
    setuserIngredients(filterData);
  },[])

  const removeIngredients = ingredientsIDFromIngredientsForm =>{
    setIsLoading(true);
    fetch(`https://ingredients-bd209.firebaseio.com/ingredients/${ingredientsIDFromIngredientsForm}.json`,{
      method:'DELETE',
      //fetch always has promises
    }).then(response =>{
      setIsLoading(false);
    setuserIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientsIDFromIngredientsForm)
    )
    }).catch(error =>{
      setError(error.message)
      //setIsLoading(false);
    })
  }
  const onClickErrorOkay = () =>{
    setError(null);
    setIsLoading(false);
  }
  return (
      <div className="App">
        {error && <ErrorModel onClose={onClickErrorOkay}>{error}</ErrorModel>}
      <IngredientForm onAddIngredients={addIngredientsHandler} loading={isLoading} />

      <section>
        <Search onFilterIngredients={getFilterIngredients} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredients} />
      </section>
    </div>
  );
}

export default Ingredients;
