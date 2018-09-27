import Vector from './Vector';

const PI = 3.14;

class Brain {
  directions = [];
  step = 0;

  constructor(size) {
    this.randomize(size);
  };

  //sets all the vectors in directions to a random vector with length 1
  randomize(size) {
    for (let i = 0; i< size; i++) {
      const randomAngle = Math.random() * 2 * PI;
      this.directions[i] = new Vector();
      this.directions[i].setDirection(randomAngle);
    }
  }

  // returns perfect copy of instructions
  clone() {
    const clone = new Brain(this.directions.length);
    for (let i = 0; i < this.directions.length ; i++) {
      const angle = this.directions[i].getDirection();
      clone.directions[i].setDirection(angle);
    }

    return clone;
  }

  // mutates the brain by setting some of the directions to random vectors
  mutate(mutationRate = 0.01) {
    for (let i = 0; i< this.directions.length; i++) {
      const rand = Math.random();
      if (rand < mutationRate) {
        const randomAngle = Math.random() * 2 * PI;
        this.directions[i].setDirection(randomAngle);
      }
    }
  }
}

export default Brain;