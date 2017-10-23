import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import './InfoBox.css'

class InfoBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPrice: null,
      monthChangeD: null,
      monthChangeP: null,
      updatedAt: null,
    }
  }
  componentDidMount() {
    this.getData = () => {
      const {data} = this.props
      const url = 'https://api.coindesk.com/v1/bpi/currentprice.json'
      console.log("fetched")
      fetch(url).then(r => r.json())
        .then((bitcoinData) => {
          const price = bitcoinData.bpi.USD.rate_float
          const change = price - data[0].y
          const changeP = (price - data[0].y) / data[0].y * 100

          this.setState({
            currentPrice: bitcoinData.bpi.USD.rate_float,
            monthChangeD: change.toLocaleString('us-EN', {style: 'currency', currency: 'USD' }),
            monthChangeP: changeP.toFixed(2) + '%',
            updatedAt: bitcoinData.time.updated
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }
    this.getData()
    this.refresh = setInterval(() => this.getData(), 90000)
  }
  componentWillUnmount() {
    clearInterval(this.refresh)
  }
  render() {
    return this.state.updatedAt ? (
      <section id="info-box">
        <div className="ib-column">
          <span className="ib-main">${this.state.currentPrice.toFixed(2)}</span>
          <span className="ib-caption">{'Updated' + moment(this.state.updatedAt).fromNow()}</span>
        </div>
        <div className="ib-column">
          <span className="ib-main">{this.state.monthChangeD}</span>
          <span className="ib-caption">Change Since Last Month (USD)</span>
        </div>
        <div className="ib-column">
          <span className="ib-main">{this.state.monthChangeP}</span>
          <span className="ib-caption">Change Since Last Month (%)</span>
        </div>
      </section>
    )
    : <div></div>
  }
}

export default InfoBox

InfoBox.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    d: PropTypes.string.isRequired,
    p: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  })).isRequired
}
