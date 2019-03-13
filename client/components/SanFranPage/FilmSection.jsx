import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
const FilmSection = ({ ...props }) => {
  let { section, heading,  onClickItem } = props
  let added = []
  return (
    <div >
      <ListGroup>
        {
          Object.values(section).map(value => {
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
              <div style={{ fontSize: '12px' }}>
                {
                  (!skip) ?
                    <ListGroupItem onClick={(e) => onClickItem(e)} val={value.Locations} section={heading}>
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
  section: PropTypes.object.isRequired,
  onClickItem: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return ({
    section: ownProps.section || {},
    heading: ownProps.heading,
    myMap: ownProps.myMap,
    geo: ownProps.geo,
    setFilmInfo: ownProps.setFilmInfo,
    filmInfo: ownProps.filmInfo
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClickItem: (e) => {
    let values = Object.values(e.target.attributes)
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
      ownProps.setFilmInfo(`Found Coordinates Found for Address ${values[0].nodeValue}!!!!`)
      ownProps.myMap.addFeature(newGeo)
    } else {
      ownProps.setFilmInfo(`No Coordinates Found for Address ${values[0].nodeValue}`)
    }
  }
})
const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmSection)

export { connected as FilmSection };