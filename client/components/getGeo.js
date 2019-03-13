export const getGeoJSON = (data) => {
  let films = [...data.data.getAllFilms]
  return new Promise((resolve, reject) => {
    let prs = []
    let done = []
    let total = 0
    let dups = 0
    films.forEach((film, i) => {
      if (i > 50) return //for testing
      total++
      if (film.Locations && film.Locations.length) {
        if (done.includes(film.Locations)) {
          dups++
          return
        }
        prs.push(getLonLat(film.Locations))
      }
    })
    Promise.all(prs).then(results => {
      return resolve(results)
    }).catch(reason => {
      console.log(reason)
      Promise.reject(reason)
    })
  })
}
const getLonLat = async (address) => {
  let patt = new RegExp('[(](.*)[)]')
  let newAddy = patt.exec(address)
  if (newAddy && newAddy[1]) {
    address = newAddy[1]
  }
  address = address.replace('"', '')
  address += ', San Francisco'
  let result = await window.fetch(`http://open.mapquestapi.com/geocoding/v1/address?key=KEYG&location=${address}`)
    .catch(reason => {
      console.log(reason)
      return reason
    })
  let jsResult = await result.json().catch(reason => {
    console.log('json', reason)
    return reason
  })
  if (jsResult.errors) {
    console.log('errors getting', jsResult.errors)
    return jsResult.errors
  }
  return jsResult
}

export const createGeoJSONfile = (data, filmData) => {
  let newGJObject = {
    type: "FeatureCollection",
    metadata: {
      generated: Date.now(),
      url: "localhost",
      title: "Film Locations in San Francisco",
      status: 200,
      api: "1.0.0",
      count: 0
    },
    features: []
  }
  data.forEach(section => {
    section.results.forEach(loc => {
      let found = false
      loc.locations.forEach(area => {
        if (found) return
        if (area.adminArea5 === 'San Francisco') {//take first one that matches
          found = true
          newGJObject.features.push({
            type: "Feature",
            properties: {
              place: loc.providedLocation.location,
            },
            geometry: {
              type: "Point",
              coordinates: [
                area.latLng.lng,
                area.latLng.lat,
                0
              ]
            }
          })
        }
      })
    })
  })
  newGJObject.metadata.count = newGJObject.features.length
  return newGJObject
}
//get geojson
export const getGeoJsonFile = async () => {
  return new Promise((resolve, reject) => {
    window.fetch(`http://localhost:65432/geo`)
      .then(pr => {
        pr.json()
          .then(js => {
            if (js.errors) {
              return reject(js.errors)
            }
            return resolve(js)
          }).catch(reason => {
            console.log(reason)
            return reject(reason)
          })
      }).catch(reason => {
        console.log(reason)
        return reject(reason)
      })
  })
}
