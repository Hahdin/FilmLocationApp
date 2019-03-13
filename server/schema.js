const { gql } = require('apollo-server-express')
//Title,Release Year,Locations,Fun Facts,Production Company,Distributor,Director,Writer,Actor 1,Actor 2,Actor 3
module.exports = 
  gql`
  type Query {
    getAllFilms: [Film]
    film(Title: String!): Film
    location(Location: String!): Location
    funfacts: FunFacts
    getLocations: LocationList
  }
  type Film {
    Title: String!
    ReleaseYear:      Int
    Locations: String
    FunFacts: String
    ProductionCompany: String
    Distributor:  String
    Director: String
    Writer: String
    Actor1: String
    Actor2: String
    Actor3: String
  }
  type LocationList {
    AllLocations: [String]
  }
  type Location {
    Location: String
    Movies: [Film]
  }
  type FunFacts {
    Movies: [Film]
  }
   `;

