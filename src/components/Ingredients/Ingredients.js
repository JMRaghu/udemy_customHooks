import React, {useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from'./IngredientList'

const  Ingredients = () =>{
  const [userIngredients, setuserIngredients] = useState([])

  const addIngredientsHandler = (ingredientsFromIngredientsForm) =>{
    fetch('https://ingredients-bd209.firebaseio.com/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredientsFromIngredientsForm),
      headers:{'Content-Type':'application/json'}
      //fetch always has promises
    }).then(response =>{
      return response.json() //will be converted to js object
      }).then(responseData =>{ //responseData will be object now
        setuserIngredients(prevIngredients=>[
          ...prevIngredients,
          {id:responseData.name,...ingredientsFromIngredientsForm}
          //firebase has name instead of id
          ])
      })
  }

  const removeIngredients = ingredientsIDFromIngredientsForm =>{
    setuserIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientsIDFromIngredientsForm)
    )
  }
  return (
    <div className="App">
      <IngredientForm onAddIngredients={addIngredientsHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredients} />
      </section>
    </div>
  );
}

export default Ingredients;
