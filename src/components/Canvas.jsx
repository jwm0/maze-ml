import React from 'react';

class Canvas extends React.Component {
  state = {
    polygon: [],
  }

  componentDidMount() {
    // INFO: Event listeners for drawing new polygons
    const canvas = document.getElementById('canvas');
    let clicked = false;
    let isMoving = false;

    canvas.addEventListener('click', (e) => {
      clicked = true;
      isMoving = false;
      this.setState(state => ({
        polygon: [...state.polygon, [e.clientX, e.clientY]],
      }));
    });

    canvas.addEventListener('mousemove', (e) => {
      if (clicked) {
        this.setState((state) => {
          let polygon = state.polygon;
          polygon[isMoving ? polygon.length - 1 : polygon.length] = [e.clientX, e.clientY];
          isMoving = true;
          return {
            polygon,
          }
        });
      }
    });

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
          this.props.newObstacle(this.state.polygon);
          clicked = false;
          this.setState({
            polygon: [],
          });
          break;
        case 'Backspace':
          this.setState({
            polygon: [],
          });
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('click');
    window.removeEventListener('mousemove');
    window.removeEventListener('keydown');
  }

  getPathFromArray = (path) => {
    let points = '';
    path.forEach((pos) => {
      points += pos.join(',') + ' ';
    });

    return points;
  }
  render() {
    const { width, height, dots, goal, obstacles } = this.props;

    return (
      <svg
        id="canvas"
        width={width}
        height={height}
      >
        <circle cx={goal.x} cy={goal.y} r="5" fill="red"/>
        {/* Drawing custom polygon */}
        <polygon
          points={this.getPathFromArray(this.state.polygon)}
          style={{
            fill: 'red',
            stroke: '#000',
            strokeWidth: 1,
          }}
        />
        {obstacles.map((obstacle, i) => {
          const points = this.getPathFromArray(obstacle);

          return (
            <polygon
              key={i}
              points={points}
              style={{
                fill: 'lime',
                stroke: '#000',
                strokeWidth: 1,
              }}
            />
          )
        })}
        {
          this.props.renderAll ?
          dots.map((dot, i) => {
            const isBest = dot.isBest;
            return <circle key={i} cx={dot.pos.x} cy={dot.pos.y} r="5" fill={isBest ? 'green' : 'blue'}/>
          }) :
          <circle cx={dots[0].pos.x} cy={dots[0].pos.y} r="5" fill="green"/>
        }
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    )
  }
}

export default Canvas;
