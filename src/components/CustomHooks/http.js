import {useReducer,useCallback} from 'react';
const initialState = {
    isLoading:false,
    error:null,
    data:null, // to store the response
    extra:null,
    identifier:null
}

  const httpReducer = (currhttp,action)=>{
    switch(action.type){
      case 'SEND':
        return {
            isLoading:true,
            error:null,
            data:null,
            extra:null,
            identifier:action.identifier
        }//wile sending data will be null
      case 'RESPONSE':
        return {
            ...currhttp,
             isLoading:false,
             data:action.responseData,
             extra:action.extra
            }//storing data
      case 'ERROR':
        return {
            isLoading:false,
            error:action.errorMessage
        }
      case 'CLEAR':
        return initialState

      default:throw new Error('Should not get there')
    }

}
//usehttp doesnt send the request, it just sets up the logic for sending the request
//sets up state(line 20 to 23) and function(sendRequest) so need to return function at line 44
const useHttp = () =>{
    const [httpData,dispatchHttp]=useReducer(httpReducer,initialState);
    //for unnessary rerenders we need to useuseCallBack in this function
    //if i am not wrapping sendRequest from useCallBack, function will actually change,
    //when ever the component when ever Ingredints changes,so therefore sendRequestFunction will change
    const clear = () => dispatchHttp({type:"CLEAR"},[])
    console.log("2nd executes sendRequestFunction")
    const sendRequest = useCallback((
        urlfromIngreidentjs,
        methodfromIngreidentjs,
        bodyfromIngreidentjs,
        extrafromIngredients,
        identifierfromIngreidents
        ) =>{
        console.log("3rd goesinside with data")
        dispatchHttp({type:'SEND',identifier:identifierfromIngreidents})
        fetch(
            urlfromIngreidentjs,
            {
                method:methodfromIngreidentjs,
                body:bodyfromIngreidentjs,
                headers:{
                    'Content-Type':'application/json'
                }//headers not required for GET method
                
    }).then(response =>{
        return response.json()
    }).then(responseData=>{
        console.log("4th OnceResponse is there stores in responseData")
        dispatchHttp({type:'RESPONSE',responseData:responseData,extra:extrafromIngredients})//responseDataKey updates the state will retriger the component the uses our hook torebuild itself
    }).catch(error =>{
      dispatchHttp({type:'ERROR',errorMessage:error.message});
    });
    },[]);//[] no external dependices
//here is where we connect this customhook to our component by returning object or array
return {
    isLoadingProperty:httpData.isLoading,
    errorProperty:httpData.error,
    dataProperty:httpData.data,
    sendRequestFunctionData:sendRequest,
    extraProperty:httpData.extra,
    reqIdentfier:httpData.identifier,
    clearProperty:clear
};
}
export default useHttp 