import Brain from '../classes/Brain';
import Vector from '../classes/Vector';

import * as _ from 'lodash';


class Dot {
  constructor(width, height, goal) {
    this.width = width;
    this.height = height;
    this.goal = goal;

    this.brain = new Brain(1000);
    this.acc = new Vector();
    this.fitness = 0;
    this.pos = new Vector(width / 2, height / 2);
    this.vel = new Vector();
    this.dead = false;
    this.reachedGoal = false;
    this.isBest = false;
  }

  move() {
    if (this.brain.directions.length > this.brain.step) {
      this.acc = this.brain.directions[this.brain.step];
      this.brain.step++;
    } else {
      this.dead = true;
    }

    // apply the acceleration and move the dot
    this.vel = this.vel.add(this.acc);
      // vel.limit(5); not too fast
    this.pos = this.pos.add(this.vel);
  }

  update() {
    if (!this.dead && !this.reachedGoal) {
      this.move();
      // if near edges of window then kill
      if (this.pos.x< 2|| this.pos.y<2 || this.pos.x>this.width-2 || this.pos.y>this.height -2) {
        this.dead = true;
      } else if (Vector.distance(this.pos.x, this.pos.y, this.goal.x, this.goal.y) < 5) {
        this.reachedGoal = true;
      }
      // } else if (pos.x< 600 && pos.y < 310 && pos.x > 0 && pos.y > 300) {//if hit obstacle
      //   dead = true;
      // }
    }
  }

  //calculates the fitness
  calculateFitness() {
    if (this.reachedGoal) {
      this.fitness = 1/16 + 10000/(this.brain.step * this.brain.step);
    } else {
      const distanceToGoal = Vector.distance(this.pos.x, this.pos.y, this.goal.x, this.goal.y);
      this.fitness = 1/(distanceToGoal * distanceToGoal);
    }
  }

  //clone it
  getChild() {
    let child = new Dot(this.width, this.height, this.goal);
    child.brain = this.brain.clone();
    return child;
  }
}

export default Dot;