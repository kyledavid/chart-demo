import React, { Component } from 'react';
import moment from 'moment'
import './App.css';
import LineChart from './LineChart'
import InfoBox from './InfoBox'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      xPos: null,
      activePoint: null,
      data: [],
      realData: [],
      fetchingData: true,
    }
    this.setXPos = this.setXPos.bind(this)
    this.setActive = this.setActive.bind(this)
  }

  componentDidMount() {
      const getData = () => {
        const url = 'https://api.coindesk.com/v1/bpi/historical/close.json'

        fetch(url).then( r => r.json())
          .then((bitcoinData) => {
            const sortedData = []
            let count = 0
            for (let date in bitcoinData.bpi) {
              sortedData.push({
                d: moment(date).format('MMM DD'),
                fd: moment(date).format('MMMM DD YYYY'),
                p: bitcoinData.bpi[date].toLocaleString('us-EN', {style: 'currency', currency: 'USD'}),
                x: count,
                y: bitcoinData.bpi[date]
              })
              count ++
            }
            console.log(sortedData)
            this.setState({
              realData: sortedData,
              fetchingData: false,
            })
          })
          .catch((e) => {
            console.log(e)
          })
      }
      getData()
  }

  setActive(activePoint) {
    this.setState({
      activePoint: activePoint,
    })
  }
  setXPos(x) {
    this.setState({
      xPos: x,
    })
  }

  createFakeData(){
    // This function creates data that doesn't look entirely random
    const data = []
    for (let x = 0; x <= 240; x++) {
      const random = Math.random();
      const temp = data.length > 0 ? data[data.length-1].y : 50;
      const y = random >= .45 ? temp + Math.floor(random * 20) : temp - Math.floor(random * 20);
      data.push({x,y})
    }
    return data;
  }
  componentWillMount() {
    this.setState({
      data: this.createFakeData(),
    })
  }
  render() {
    return !this.state.fetchingData ? (
      <div className="App">
        {/*<div className="header">react svg line chart [part 1]</div>*/}
        <InfoBox
          data={this.state.realData}
        />
        <LineChart
          data={this.state.realData}
          setXPos={this.setXPos}
          xPos={this.state.xPos}
          activePoint={this.state.activePoint}
          setActive={this.setActive}
        />
      </div>
    )
    : <div className="App"></div>
  }
}
export default App;
