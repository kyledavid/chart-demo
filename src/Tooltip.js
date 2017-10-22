import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './Tooltip.css'

class Tooltip extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {xPos} = this.props
    const {date, price} = this.props.point
    console.log(this.props.xPos)
    return (
      <div className="tooltip" style={{left: xPos}}>
        <div className="tool-bg">
        </div>
        <span className="tool-date">{date}</span>
        <span className="tool-price">${price}</span>
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
