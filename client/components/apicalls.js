import {API_PATH} from './constants'
/**
 * Using GraphQL 
 * 
 * @param {string} query the query
 */
export const apolloGet = async (query) =>{
  let result = await window.fetch(`${API_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query: query })
  }).catch(reason => {
    console.log(reason)
    return reason
  })
  let jsResult = await result.json().catch(reason => {
    console.log('json',reason)
    return reason
  })
  if (jsResult.errors){
    console.log('errors getting', jsResult.errors)
    return jsResult.errors
  }
  return jsResult
}

//this is a temporary function, uses to initially create the geoJSON.json file
export const sendToFile = async (ob) =>{
  let pay = JSON.stringify(ob)
  let result = await window.fetch(`${API_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: pay
  }).catch(reason => {
    console.log(reason)
    return reason
  })
  let jsResult = await result.json().catch(reason => {
    console.log('json',reason)
    return reason
  })
  if (jsResult.errors){
    console.log('errors getting', jsResult.errors)
    return jsResult.errors
  }
  return jsResult
}

