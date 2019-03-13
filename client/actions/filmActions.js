export const getFilms = (filmData) =>{
  return ({
    type: 'GET_FILMS',
    payload: filmData,
  })
}
export const loadFilms = (filmData) => {
  return (dispatch, getState) => {
    dispatch(getFilms(filmData))
  }
}

