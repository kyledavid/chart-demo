import React, {Component} from 'react'
import PropTypes from 'prop-types'

class InfoBox extends Component {
  componentDidMount() {
    this.getData = () => {
      const {data} = this.props
      const url = 'https://api.coindesk.com/v1/bpi/currentprice.json'

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
    return (
      <div></div>
    )
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
