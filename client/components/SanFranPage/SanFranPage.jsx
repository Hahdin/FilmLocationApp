'use_strict'
import {
  Grid,
  Col,
  Row,
  Tabs,
  Tab,
} from "react-bootstrap";
import { map as _map } from '../../objects/SanFranMap'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getFilms, loadFilms } from '../../actions'
import { apolloGet, sendToFile } from '../apicalls'
import { getGeoJSON, createGeoJSONfile, getGeoJsonFile } from '../getGeo'
import { FilmSection } from './FilmSection'

const SanFranPage = ({ ...props }) => {
  const [thisMap, setMap] = useState(null)
  const [filmInfo, setFilmInfo] = useState('')
  const [geoJson, setGeoJson] = useState(null)
  const a_SetMap = async (geo) => {
    try {
      let map = await getMapObject().catch(reason => {
        console.log(reason)
      })
      map.myMap = map.getMapObject()
      setMap(map)
      setGeoJson(geo)
    } catch (e) { Promise.reject(e) }
  }
  useEffect(() => {
    getFilmsFromServer(`{
      getAllFilms{
        Title
        ReleaseYear
        Locations
        FunFacts
        ProductionCompany
        Distributor
        Director
        Writer
        Actor1
        Actor2
        Actor3
      }
    }`).then(result => {
      props.fetchFilms(result)
      //Do this to use existing geoJson
      getGeoJsonFile().then(result => {
        a_SetMap(result).catch(reason => {
          console.log(reason)
        })
        console.log(result)
      }).catch(reason => {
        console.log(reason)
      })
      //Do this to create geoJSON
      // getGeoJSON(result).then(promise =>{
      //   let gj = createGeoJSONfile(promise, result)
      //   sendToFile(gj)
      // }).catch(reason =>{
      //   console.log(reason)
      // })
    }).catch(reason => {
      console.log(reason)
    })
    return () => {
    }
  }, [])
  const getMapObject = async () => {
    try {
      return await _map.create()
    }
    catch (e) { Promise.reject(e) }
  }
  console.log(props.films)
  if (props.films.length === 0) {
    return (<div></div>)
  }
  return (<div>
    <Grid fluid>
      <Row className="show-grid">
        <Col xs={4} md={4}>
          <div style={{ backgroundColor: 'white' }}>
            <Tabs defaultActiveKey={1}>
              <Tab eventKey={1} title={'Films'}>
                <FilmSection
                  section={props.films}
                  heading={'Films'}
                  myMap={thisMap}
                  geo={geoJson}
                  setFilmInfo={setFilmInfo}
                  filmInfo={filmInfo}
                />
              </Tab>
            </Tabs>
          </div>
        </Col>
        <Col xs={8} md={8} style={{ position: 'sticky', top: '100px' }}>
          <div style={{ position: 'relative', top: '-30px', color: 'white', background: 'black' }}>{filmInfo}</div>
          <div className="map" id="map"></div>
        </Col>
      </Row>
    </Grid>
  </div>);
}

SanFranPage.propTypes = {
  fetchFilms: PropTypes.func.isRequired
}

const getFilmsFromServer = async (query) => {
  let result = {}
  try {
    let apFetch = await apolloGet(query).catch(reason => {
      return reason
    })
    result = {
      data: apFetch.data
    }
    return result
  }
  catch (err) {
    console.log(err)
    return err
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('in state')
  return ({
    films: state.filmReducer.films
  })
}
const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchFilms: (filmData) => {
    dispatch(loadFilms(filmData))
  }
})
const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(SanFranPage)
export { connected as SanFranPage }
