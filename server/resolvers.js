const {  
  getFilms,
  getFilm,
} = require('./server')
/**
 * Convert the Array into a Film Object
 * 
 * @param {array} ar 
 */
const getFilmFromArray = (ar) =>{
  let i = 0
  return {
    Title: ar[i++],
    ReleaseYear: ar[i++],
    Locations: ar[i++],
    FunFacts: ar[i++],
    ProductionCompany: ar[i++],
    Distributor: ar[i++],
    Director: ar[i++],
    Writer: ar[i++],
    Actor1: ar[i++],
    Actor2: ar[i++],
    Actor3: ar[i++],
  }
}
module.exports = {
  Query: {
    film: async (root, args) => {
      if (args.Title){
        let f = await getFilm(args.Title)
        let film = getFilmFromArray(f)
        return {
          ...film
        }
      }
      return {
        Title: "Not Found!"
      }
    },
    getAllFilms: async (root, args) => {
      let films = await getFilms('Film_Locations_in_San_Francisco')
      let a = []
      films.data.forEach(film =>{
        a.push(getFilmFromArray(film))
      })
      return a
    },
    location: async(root, args) =>{
      if (!args.Location){
        return {
          Location: "Not Found!"
        }
      }
      let films = await getFilms('Film_Locations_in_San_Francisco')
      let returns = []

      films.data.forEach(film =>{
        if (film[2] && film[2].toLowerCase() === args.Location.toLowerCase()){
          returns.push(getFilmFromArray(film))
        }
      })
      return {
        Location: args.Location,
        Movies: returns
      }
    },
    funfacts: async (root, args) =>{
      let films = await getFilms('Film_Locations_in_San_Francisco')
      let onesWithFacts = []
      films.data.forEach(film =>{
        if (film[3]){
          onesWithFacts.push(getFilmFromArray(film))
        }
      })
      return {
        Movies: onesWithFacts
      }
    },
    getLocations: async (root, args) =>{
      let films = await getFilms('Film_Locations_in_San_Francisco')
      let locations = []
      films.data.forEach(film =>{
        if (!locations.includes(film[2])){
          locations.push(film[2])
        }
      })
      console.log(locations)
      return {
        AllLocations: locations
      }

    },
  },
};
