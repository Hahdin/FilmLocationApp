const cors = require('cors')
const fs = require('fs')
const express  = require('express')
const apollo = require('apollo-server-express')
const app = express()
const schema = require('./schema')
const resolvers = require('./resolvers')
const bodyParser = require('body-parser')
app.use(cors())
app.use(bodyParser.json())

//temporary to create geojson
app.post('/upload', (req, res) => {
  let body = req.body
  fs.writeFile('geolocations.json', JSON.stringify(req.body),(err) =>{
    console.log(err)
  })
  return res.status(333).send('hi there')

})
app.get('/geo', (req, res) => {
  fs.readFile('locations.json', (error, data) =>{
    if (error){
      return res.status(500).send(error)
    }
    return res.status(200).send(data)
  })

})

const server = new apollo.ApolloServer({
  typeDefs: schema,
  resolvers,
});
server.applyMiddleware({ app, path: '/graphql' })
const port = 65432
app.listen({ port: port }, () => {
  console.log(`Apollo Server on http://localhost:${port}/graphql`)
})

