import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './Tooltip.css'

class Tooltip extends Component {
  render() {
    const {xPos} = this.props
    const {date, price} = this.props.point
    console.log(this.props)
    return (
      <div className="tooltip" style={{left: xPos, transform: 'translate(-100%, 5px)'}}>
        <div className="tool-bg">
        </div>
        <span className="tool-date">{date}</span>
        <span className="tool-price">{price}</span>
      </div>
    )
  }
}

Tooltip.propTypes = {
  point: PropTypes.shape({
    date: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }),
  xPos: PropTypes.number.isRequired,
}

export default Tooltip
