import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import {
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
const FilmSection = ({ ...props }) => {
  let { section, heading, myMap, onClickItem, geo,  } = props
  let added = []
  return (
    <div >
      <ListGroup>
        {
          Object.values(section).map((value, i) => {
            let skip = false
            let title = value.Title
            let date = value.ReleaseYear
            let star = value.Actor1
            title.trim()
            if (added.includes(title)) {
              skip = true
            } else {
              added.push(title)
              skip = false
            }
            return (
              <div id={`${i}-d`} style={{ fontSize: '12px' }} key={`${i}-dk`}>
                {
                  (!skip) ?
                    <ListGroupItem onClick={(e) => onClickItem(e)} val={value.Locations} section={heading} key={`${i}-lg`}>
                      {`${title}: year (${date}), starring ${star}`}
                    </ListGroupItem>
                    : null
                }
              </div>
            )
          })
        }
      </ListGroup>
    </div>
  )
}
FilmSection.propTypes = {
  onClickItem: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return ({
    section: ownProps.section || [],
    heading: ownProps.heading,
    myMap: ownProps.myMap,
    geo: ownProps.geo,
    setFilmInfo: ownProps.setFilmInfo,
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClickItem: (e) => {
    let values = Object.values(e.target.attributes)
    console.log('clicked', values[0].ownerElement.innerHTML, values[0].nodeValue)
    //we need to find out if this Movie Title has a coresponding coordinate in the geo
    let newGeo = {
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
    let added = false
    let patt = new RegExp('(.*): year \\((.*)\\), starring (.*)')
    let parts = patt.exec(values[0].ownerElement.innerHTML)
    let film = []
    film = ownProps.section.filter((f) => f.Title == parts[1] && 
    f.ReleaseYear == parseInt(parts[2]) && 
    f.Actor1 == parts[3] )
    ownProps.geo.features.forEach(feature => {
      let place = feature.properties.place
      let i = place.indexOf(',')
      if (i >= 0) {
        place = place.slice(0, i)
      }
      let val = values[0].nodeValue.toLowerCase()

      val.trim()
      place.trim()
      place = place.toLowerCase()
      let foundIndex = val.search(place)
      if (foundIndex >= 0) {
        added = true
        let newFeature = {
          geometry: {
            coordinates: [...feature.geometry.coordinates],
            type: "Point"
          },
          properties: {
            place: feature.properties.place
          },
          type: "Feature"
        }
        newGeo.features.push(newFeature)
      }
    })
    if (added) {
      film[0].found = true
      ownProps.myMap.addFeature(newGeo)
    } else {
      film[0].found = false
    }
    ownProps.setFilmInfo(film[0])
  }
})
const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmSection)

export { connected as FilmSection };