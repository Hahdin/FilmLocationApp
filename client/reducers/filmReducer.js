const initialState = {
  films: []
}
export const filmReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_FILMS': {

      return {
        ...state,
        films: state.films.concat(action.payload.data.getAllFilms)
      }
    }
    default: {
      return state
    }
  }
}
