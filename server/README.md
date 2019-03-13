# Films Locations in San Francisco API server

This api server uses the downloaded csv file from [Film Locations in San Francisco](https://data.sfgov.org/Culture-and-Recreation/Film-Locations-in-San-Francisco/yitu-d5am)

## Start the server
From the server folder, run the commands:

``` 
npm i
node index.js 
```
> Once installed you can double click on the provided ```api.bat``` file.
>> Once both client and server are installed, you can double click the start.bat to start both up

This will run the server locally on port 65432

## Open in Chrome
If you have Chrome, type in the following url:
```
http://localhost:65432/graphql
```
This should open the GraphQL Playground and allow you to query the api

## Some Sample Queries
```
// some example queries
{
  film(Title: "180"){
    ReleaseYear
    Director
    Distributor
  }
  location(Location: "Chinatown"){
    Location
    Movies{
      Title
      ReleaseYear
    }
  }
  
  funfacts{
    Movies{
      Title
      FunFacts
    }
  }
}
```
