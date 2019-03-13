import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
const FilmSection = ({ ...props }) => {
  let { section, heading, myMap, onClickItem, geo } = props
  let added = []
  return (
    <div >
      <ListGroup>
        {
          Object.values(section).map(value => {
            let skip = false
            let title = value.Title
            title.trim()
            if (added.includes(title)){
              skip = true
            } else{
              added.push(title)
              skip = false
            }
            return (
              <div style={{ fontSize: '12px' }}>
                {
                  (!skip) ?
                    <ListGroupItem onClick={(e) => onClickItem(e)} val={value.Locations} section={heading}>
                      {`${title}`}
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
    geo: ownProps.geo
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClickItem: (e) => {
    let values = Object.values(e.target.attributes)
    console.log('clicked', values[0].ownerElement.innerHTML)
    ownProps.myMap.addFeature(null)
    // let ret = false
    // values.forEach(v => {
    //   if (v.name === 'section' && v.nodeValue !== 'Curve Information')
    //     ret = true
    // })
    // if (ret)
    //   return
    // let val = Object.values(e.target.attributes).filter(a => a.name === 'val')
    // if (val.length === 0)
    //   return
    // dispatch(chartCurve(val[0].nodeValue))
  }
})
const connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmSection)

export { connected as FilmSection };