import React, { Component } from 'react';
import Dot from './classes/Dot';
import Canvas from './components/Canvas';
import './App.css';

const WIDTH = 400;
const HEIGHT = 400;
const GOAL = { x: 50, y: 180 };
const OBSTACLE = [
  [80, 150],
  [150, 150],
  [150, 300],
  [80, 300],
];

class App extends Component {
  state = {
    generation: 0,
    finished: false,
    populationSize: 100,
    dotPositions: [],
    minStep: 1000,
    renderAll: true,
  }
  dots = [];

  componentDidMount() {
    let dotPositions = [];
    for (let i = 0; i < this.state.populationSize; i++) {
      this.dots[i] = new Dot(WIDTH, HEIGHT, GOAL);
      dotPositions[i] = this.dots[i].pos;
    }
    this.setState({ dots: this.dots });
  }

  calculateFitness() {
    for (let i = 0; i< this.dots.length; i++) {
      this.dots[i].calculateFitness();
    }
  }

  allDotsDead() {
    for (let i = 0; i< this.dots.length; i++) {
      if (!this.dots[i].dead && !this.dots[i].reachedGoal) {
        return false;
      }
    }

    return true;
  }

  calculateFitnessSum() {
    this.fitnessSum = 0;
    for (let i = 0; i< this.dots.length; i++) {
      this.fitnessSum += this.dots[i].fitness;
    }
  }

  //-------------------------------------------------------------------------------------------------------------------------------------

  //chooses dot from the population to return randomly(considering fitness)

  //this function works by randomly choosing a value between 0 and the sum of all the fitnesses
  //then go through all the dots and add their fitness to a running sum and if that sum is greater than the random value generated that dot is chosen
  //since dots with a higher fitness function add more to the running sum then they have a higher chance of being chosen
  selectParent() {
    const rand = Math.random() * this.fitnessSum;
    let runningSum = 0;

    for (let i = 0; i< this.dots.length; i++) {
      runningSum += this.dots[i].fitness;
      if (runningSum > rand) {
        return this.dots[i];
      }
    }
  }

  //mutates all the brains of the babies
  mutateChildren() {
    for (let i = 1; i< this.dots.length; i++) {
      this.dots[i].brain.mutate();
    }
  }

  //finds the dot with the highest fitness and sets it as the best dot
  setBestDot() {
    let max = 0;
    let maxIndex = 0;
    for (let i = 0; i < this.dots.length; i++) {
      if (this.dots[i].fitness > max) {
        max = this.dots[i].fitness;
        maxIndex = i;
      }
    }

    this.bestDot = maxIndex;

    //if this dot reached the goal then reset the minimum number of steps it takes to get to the goal
    if (this.dots[this.bestDot].reachedGoal) {
      this.setState({
        minStep: this.dots[this.bestDot].brain.step,
      })
    }
  }

  nextGeneration = () => {
    let newDots = [];

    this.setBestDot();
    this.calculateFitnessSum();

    //the champion lives on
    newDots[0] = this.dots[this.bestDot].getChild();
    newDots[0].isBest = true;
    for (let i = 1; i< this.state.populationSize; i++) {
      const parent = this.selectParent();
      newDots[i] = parent.getChild();
    }
    this.dots = newDots.slice();
    // mutate
    this.mutateChildren();
    // calculate new pos
    let dotPositions = [];
    for (let i = 0; i < this.state.populationSize; i++) {
      dotPositions[i] = this.dots[i].pos;
    }

    this.setState((state) => ({
      generation: state.generation + 1,
      dotPositions,
    }), () => this.startAnimation());
  }

  startAnimation = () => {
    this.animation = setInterval(() => {
      if (this.allDotsDead()) {
        clearInterval(this.animation);
        this.calculateFitness();
        this.nextGeneration();
      }

      return this.move();
    }, 100);
  }

  pauseAnimation = () => {
    clearInterval(this.animation);
  }

  componentWillUnmount(){
    clearInterval(this.animation);
  }

  move = () => {
    let dotPositions = [];
    for (let i = 0; i < this.state.populationSize; i++) {
      if (this.dots[i].brain.step > this.state.minStep) {
        this.dots[i].dead = true;
      } else {
        this.dots[i].update();
        dotPositions[i] = this.dots[i].pos;
      }
      this.dots[i].update();
      dotPositions[i] = this.dots[i].pos;
    }
    this.setState({ dots: this.dots });
  }

  showBest = () => {
    this.setState((state) => ({
      renderAll: !state.renderAll,
    }));
  }

  render() {
    return (
      <div className="App">
        <Canvas
          width={WIDTH}
          height={HEIGHT}
          dots={this.state.dots || []}
          goal={GOAL}
          obstacles={[OBSTACLE]}
          renderAll={this.state.renderAll}
        />
        <button type="button" onClick={this.startAnimation}>start</button>
        <button type="button" onClick={this.pauseAnimation}>pause</button>
        <span>{this.state.generation}</span>
        <button type="button" onClick={this.nextGeneration}>new generation</button>
        <button type="button" onClick={this.showBest}>toggle population</button>
      </div>
    );
  }
}

export default App;
