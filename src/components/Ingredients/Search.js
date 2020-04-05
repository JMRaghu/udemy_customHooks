import React,{useState,useEffect,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onFilterIngredients} = props
  const[useEnteredText,useSetEnteredText] =  useState('')
  const inputRef = useRef();

  useEffect(() => {
      const timer = setTimeout(()=>{
        if(useEnteredText === inputRef.current.value){
          const query =
            useEnteredText.length === 0
                ? ''
                : `?orderBy="title"&equalTo="${useEnteredText}"`;
            fetch('https://ingredients-bd209.firebaseio.com/ingredients.json'+query)
            .then(response=>response.json())
            .then(responseData=>{
              console.log('-----',responseData)
              const loadIngredients=[];
              for(const key in responseData){
                loadIngredients.push({
                  id:key,
                  title:responseData[key].title,
                  amount:responseData[key].amount
                })
              }
              onFilterIngredients(loadIngredients)
            })
        }
      },500)
      //return should always be a function unmount kind of things
      //clean up all unwanted items many times and make app faster
      return () =>{
        clearTimeout(timer)
      }
  }, [useEnteredText,onFilterIngredients,inputRef])
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" ref={inputRef} value={useEnteredText} onChange={(event)=>{
            useSetEnteredText(event.target.value)
          }} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
