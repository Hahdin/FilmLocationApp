export const getFilms = (filmData) =>{
  console.log('in action')
  return ({
    type: 'GET_FILMS',
    payload: filmData,
  })
}
export const loadFilms = (filmData) => {
  console.log('in thunk')

  return (dispatch, getState) => {

    dispatch(getFilms(filmData))
  }
}

