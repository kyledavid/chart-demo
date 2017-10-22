import React, { Component } from 'react';
import './App.css';
import LineChart from './LineChart'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      xPos: null,
      activePoint: null,
      data: [],
    }
    this.setXPos = this.setXPos.bind(this)
    this.setActive = this.setActive.bind(this)
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
    return (
      <div className="App">
        <div className="header">react svg line chart [part 1]</div>
        <LineChart
          data={this.state.data}
          setXPos={this.setXPos}
          xPos={this.state.xPos}
          activePoint={this.state.activePoint}
          setActive={this.setActive}
        />
      </div>
    );
  }
}
export default App;
