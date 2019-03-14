'use_strict'
import {
  Grid,
  Col,
  Row,
  TabContainer,
  Tabs,
  Tab,
} from "react-bootstrap";
import { map as _map } from '../../objects/SanFranMap'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadFilms } from '../../actions'
import { apolloGet } from '../apicalls'
import { getGeoJsonFile } from '../getGeo'
import { FilmSection } from './FilmSection'

const SanFranPage = ({ ...props }) => {
  const [thisMap, setMap] = useState(null)
  const [filmInfo, setFilmInfo] = useState({})
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
  if (props.films.length === 0) {
    return (<div></div>)
  }
  
  let style = {
    position: 'relative', 
    top: '-30px',
    width: '50vw', 
    color:  filmInfo.found ? 'black' : 'white', 
    background: filmInfo.found ? 'white' : 'black',
    boxShadow: '2px 2px 2px black',
    border: filmInfo.found ? 'thick solid black' : 'thick solid white',
    borderStyle: 'double',
    padding: '10px',
}

  return (<div>
    <Grid fluid>
      <Row className="show-grid">
        <Col xs={4} md={4}>
          <div style={{ backgroundColor: 'white' }}>
            <TabContainer id='tab1'>
              <Tabs defaultActiveKey={1}>
                <Tab eventKey={1} title={'Films'} >
                  <FilmSection
                    section={props.films}
                    heading={'Films'}
                    myMap={thisMap}
                    geo={geoJson}
                    setFilmInfo={setFilmInfo}
                  />
                </Tab>
              </Tabs>
            </TabContainer>
          </div>
        </Col>
        <Col xs={8} md={8} style={{ position: 'sticky', top: '100px' }}>
          <div style={{ position: 'relative', top: '-30px', width: '50vw', height: '40vh'}} id="map"></div>
          <div style={style}>
            <p>{(filmInfo.Title) && `Title: ${filmInfo.Title}`}</p>
            <p>{(filmInfo.ReleaseYear) && `Released: ${filmInfo.ReleaseYear}`}</p>
            <p>{(filmInfo.Locations) && `Locations: ${filmInfo.Locations}`}</p>
            <p>{(filmInfo.FunFacts) && `Fun Facts: ${filmInfo.FunFacts}`}</p>
            <p>{(filmInfo.ProductionCompany) && `Production Company: ${filmInfo.ProductionCompany}`}</p>
            <p>{(filmInfo.Distributor) && `Distributor: ${filmInfo.Distributor}`}</p>
            <p>{(filmInfo.Director) && `Director: ${filmInfo.Director}`}</p>
            <p>{(filmInfo.Writer) && `Writer: ${filmInfo.Writer}`}</p>
            <p>{(filmInfo.Actor1) && `Actor 1: ${filmInfo.Actor1}`}</p>
            <p>{(filmInfo.Actor2) && `Actor 2: ${filmInfo.Actor2}`}</p>
            <p>{(filmInfo.Actor3) && `Actor 3: ${filmInfo.Actor3}`}</p>
            </div>
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
