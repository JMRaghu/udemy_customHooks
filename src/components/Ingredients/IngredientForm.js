import React, {useState} from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator'
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  const [enteredInputName, setInputName] = useState('');
  const [enterInputAmountstate, setInputAmount] = useState(''); 

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredients({title:enteredInputName,amount:enterInputAmountstate})
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title"
            value = {enteredInputName}
            onChange = {(event)=>{
              setInputName(event.target.value)
            }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" 
            value = {enterInputAmountstate}
            onChange = {(event)=>{
              setInputAmount(event.target.value)
            }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading ? <LoadingIndicator/>:null}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
