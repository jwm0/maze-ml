import React from 'react';

class Canvas extends React.PureComponent {
  render() {
    const { width, height, dots, goal, obstacles } = this.props;

    return (
      <svg width={width} height={height}>
        <circle cx={goal.x} cy={goal.y} r="5" fill="red"/>
        {obstacles.map((obstacle, i) => {
          let points = '';
          obstacle.forEach((pos) => {
            points += pos.join(',') + ' ';
          })
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
