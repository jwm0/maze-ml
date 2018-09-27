import React, { Component } from 'react';
import inside from 'point-in-polygon';

import Dot from './classes/Dot';
import Canvas from './components/Canvas';
import './App.css';

const WIDTH = 400;
const HEIGHT = 400;
const GOAL = { x: 50, y: 180 };

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animation: false,
      generation: 0,
      mutationRate: 0.01,
      populationSize: 100,
      minStep: 1000,
      renderAll: true,
      obstacles: [],
    }
    this.dots = [];
  }

  handleNewObstacle = (obstacle) => {
    this.setState(state => ({
      obstacles: [...state.obstacles, obstacle],
      minStep: 1000,
    }));
  }

  generatePopulation = () => {
    for (let i = 0; i < this.state.populationSize; i++) {
      this.dots[i] = new Dot(WIDTH, HEIGHT, GOAL);
    }
    this.setState({
      dots: this.dots,
      generation: 0,
      minStep: 1000,
    });
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
      this.dots[i].brain.mutate(this.state.mutationRate);
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

    this.setState((state) => ({
      generation: state.generation + 1,
    }), () => this.startAnimation());
  }

  startAnimation = () => {
    this.setState({ animation: true });
    this.animation = setInterval(() => {
      if (this.allDotsDead()) {
        clearInterval(this.animation);
        this.calculateFitness();
        this.nextGeneration();
      }

      return this.move();
    }, 10);
  }

  pauseAnimation = () => {
    this.setState({ animation: false });
    clearInterval(this.animation);
  }

  componentWillUnmount(){
    clearInterval(this.animation);
  }

  move = () => {
    for (let i = 0; i < this.state.populationSize; i++) {
      if (this.dots[i].brain.step > this.state.minStep) {
        this.dots[i].dead = true;
      } else if (this.state.obstacles) {
        const coordinates = [ this.dots[i].pos.x, this.dots[i].pos.y ];

        this.state.obstacles.forEach((obstacle) => {
          if (inside(coordinates, obstacle)) {
            this.dots[i].dead = true;
            return;
          }
        });
      } else {
        this.dots[i].update();
      }
      this.dots[i].update();
    }
    this.setState({ dots: this.dots });
  }

  showBest = () => {
    this.setState((state) => ({
      renderAll: !state.renderAll,
    }));
  }

  toggleParrots = () => {
    this.setState((state) => ({
      parrotify: !state.parrotify,
    }));
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    })
  }

  render() {
    return (
      <div className="App">
        <Canvas
          width={WIDTH}
          height={HEIGHT}
          dots={this.state.dots || []}
          goal={GOAL}
          // TODO: change to state
          obstacles={this.state.obstacles}
          renderAll={this.state.renderAll}
          newObstacle={this.handleNewObstacle}
          parrotify={this.state.parrotify}
        />
        <span>Generation: {this.state.generation}</span>
        <div>
          <div>
            <button
              type="button"
              onClick={this.state.animation ? this.pauseAnimation : this.startAnimation}
            >
              start/pause
            </button>
          </div>
          <label>
            Population size:
            <input
              name="populationSize"
              type="number"
              step="10"
              value={this.state.populationSize}
              onChange={this.handleChange}
            />
          </label>
          <button type="button" onClick={this.generatePopulation}>Generate new population</button>
          <button type="button" onClick={this.showBest}>toggle population</button>
          <label>
            Learning rate:
            <input
              name="mutationRate"
              type="number"
              step="0.005"
              value={this.state.mutationRate}
              onChange={this.handleChange}
            />
          </label>
          <button type="button" onClick={this.toggleParrots}>parrotify</button>
        </div>
      </div>
    );
  }
}

export default App;
