import React, {Component} from "react"
import PropTypes from 'prop-types'
import Tooltip from './Tooltip'
import "./LineChart.css"
class LineChart extends Component {
  constructor(props) {
    super(props)
    this.stopHover = this.stopHover.bind(this)
  }
  stopHover() {

    this.props.setXPos(null)
    this.props.setActive(null)
  }
  makeLabels() {
    const {labelDims, svgHeight, svgWidth} = this.props
    return (
      <g>
        <text transform={`translate(-${labelDims.width}, -${labelDims.height})`}>
          $2,877.39
        </text>
        <text transform={`translate(-${labelDims.width}, ${svgHeight + labelDims.height})`}>
          $1,938.94
        </text>
        <text transform={`translate(${svgWidth}, ${svgHeight + labelDims.height})`}>
          October 20
        </text>
        <text transform={`translate(${labelDims.width}, ${svgHeight + labelDims.height})`}>
          September 20
        </text>
      </g>
    )
  }
  makeActiveCircle() {
    const {data, activePoint} = this.props
    const point = data[activePoint]
    const {color, pointRadius} = this.props

    return (
      <circle
        className="linechart_point"
        style={{stroke: color}}
        r={pointRadius}
        cx={this.getSvgX(point.x)}
        cy={this.getSvgY(point.y)}
      />
    )
  }
  handleMouseMove(e) {
    this.findClosestPoint()
    this.getCoords(e)
  }
  makeAxis() {
    const x = this.getX(), y = this.getY()

    return this.props.xPos ? (
      <g className="linechart_axis">
        <line
          x1={this.getSvgX(x.min)} y1={this.getSvgY(y.min)}
          x2={this.getSvgX(x.min)} y2={this.getSvgY(y.max)} />
        <line
          x1={this.getSvgX(x.min)} y1={this.getSvgY(y.min)}
          x2={this.getSvgX(x.max)} y2={this.getSvgY(y.min)} />
      </g>
    )
    : null

  }
  makeHoverLine() {
    const y = this.getY()
    const x = this.props.xPos
    return (
      <line style={{stroke:"#000", strokeWidth: "2px"}}
        x1={x} y1={this.getSvgY(y.min)}
        x2={x} y2={this.getSvgY(y.max)}
      />
    )
  }
  makePath() {
    const {data, color} = this.props
    let pathD = "M " + this.getSvgX(data[0].x) + " " + this.getSvgY(data[0].y) + " "

    pathD += data.map((point, i) => {
      return "L " + this.getSvgX(point.x) + " " + this.getSvgY(point.y)
    })
    return (
      <path className="linechart_path" d={pathD} style={{stroke:color}} />
    )
  }
  makeArea() {

    const {data, color} = this.props
    let pathD = "M " + this.getSvgX(data[0].x) + " " + this.getSvgY(data[0].y) + " "

    pathD += data.map((point, i) => {
      return "L " + this.getSvgX(point.x) + " " + this.getSvgY(point.y)
    })

    const x = this.getX()
    const y = this.getY()

    pathD += "L " + this.getSvgX(x.max) + " " + this.getSvgY(y.min) + " " + "L " + this.getSvgX(x.min) + " " + this.getSvgY(y.min)
    return (
      <path className="linechart_area" d={pathD} style={{stroke:color}} />
    )
  }

  getCoords(e) {
    const {svgWidth} = this.props
    const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();
    const adjustment = (svgLocation.width - svgWidth) / 2; //takes padding into consideration
    const relativeLoc = e.clientX - svgLocation.left - adjustment

    console.log(relativeLoc)
    if (relativeLoc < 0 || relativeLoc > 700) {
      this.stopHover()
    } else {
      this.props.setXPos(relativeLoc)
    }
  }
  findClosestPoint() {
    const {data, xPos, svgWidth} = this.props
    const comparePoint = xPos / svgWidth * this.getX().max

    let currentClosest = data[0]
    let closestIndex = 0

    data.forEach((point, i) => {
      if (Math.abs(currentClosest.x - comparePoint) > Math.abs(point.x - comparePoint)) {
        currentClosest = point
        closestIndex = i
      }
    })
    this.props.setActive(closestIndex)
  }
  getSvgX(x) {
    const {svgWidth} = this.props;
    return (x / this.getX().max * svgWidth);
  }
  getSvgY(y) {
    const {svgHeight} = this.props;
    return svgHeight - (y / this.getY().max * svgHeight);
  }
  // GET MAX & MIN X
  getX() {
    const {data} = this.props;
    return {
        min: data[0].x,
        max: data[data.length -1].x,
      };
  }
  // GET MAX & MIN Y
  getY() {
    const {data} = this.props;
    return {
      min: data.reduce((min, p) => p.y < min ? p.y : min, data[0].y),
      max: data.reduce((max, p) => p.y > max ? p.y : max, data[0].y),
    }
  }
  render() {
    const {svgWidth, svgHeight} = this.props
    return (
      <div id="graph-container">
        {this.props.xPos ? <Tooltip xPos={this.props.xPos} point={{date: 'July 24 17', price: 5687}} /> : null}
        <svg
          className="linechart"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          onMouseMove={(e) => this.handleMouseMove(e)}
          onMouseLeave={this.stopHover}
        >
          {this.makePath()}
          {this.makeArea()}
          {this.makeAxis()}
          {this.makeLabels()}
          {this.props.xPos ? this.makeHoverLine() : null}
          {this.props.activePoint ? this.makeActiveCircle() : null}
        </svg>
      </div>
    );
  }
}

LineChart.propTypes = {
  activePoint: PropTypes.number,
  color: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  labelDims: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  pointRadius: PropTypes.number,
  setActive: PropTypes.func.isRequired,
  setXPos: PropTypes.func.isRequired,
  svgHeight: PropTypes.number,
  svgWidth: PropTypes.number,
  xPos: PropTypes.number,

}

LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  svgHeight: 300,
  svgWidth: 700,
  pointRadius: 5,
  labelDims: {height: 10, width: 40},
}
export default LineChart;
