import React,{useState,useEffect,useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../CustomHooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  const {onFilterIngredients} = props
  const[useEnteredText,useSetEnteredText] =  useState('')
  const inputRef = useRef();
  const {isLoadingProperty,errorProperty,dataProperty,sendRequestFunctionData,clearProperty} = useHttp()

  useEffect(() => {
      const timer = setTimeout(()=>{
        if(useEnteredText === inputRef.current.value){
          const query =
            useEnteredText.length === 0
                ? ''
                : `?orderBy="title"&equalTo="${useEnteredText}"`;
            sendRequestFunctionData('https://ingredients-bd209.firebaseio.com/ingredients.json'+query,
            'GET')
        }
      },500)
      //return should always be a function unmount kind of things
      //clean up all unwanted items many times and make app faster
      return () =>{
        clearTimeout(timer)
      }
  }, [useEnteredText,sendRequestFunctionData]);

//Response is in useEffect
  useEffect(()=>{
    if(!isLoadingProperty && !errorProperty && dataProperty){
      const loadIngredients=[];
              for(const key in dataProperty){
                loadIngredients.push({
                  id:key,
                  title:dataProperty[key].title,
                  amount:dataProperty[key].amount
                })
              }
              onFilterIngredients(loadIngredients)
    }
  },[isLoadingProperty,errorProperty,dataProperty,onFilterIngredients]);

  return (
    <section className="search">
      {errorProperty && <ErrorModal onClose={clearProperty}>{errorProperty}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoadingProperty && <span>Loading...</span>}
          <input type="text" ref={inputRef} value={useEnteredText} onChange={(event)=>{
            useSetEnteredText(event.target.value)
          }} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
