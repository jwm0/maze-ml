import React from 'react';

class Canvas extends React.PureComponent {
  render() {
    const { width, height, dots, goal } = this.props;

    return (
      <svg width={width} height={height}>
        <circle cx={goal.x} cy={goal.y} r="5" fill="red"/>
        {dots.map((dot, i) => {
          const isBest = i === 0;
          return (<circle key={i} cx={dot.x} cy={dot.y} r="5" fill={isBest ? 'green' : 'blue'}/>)
        }
        )}
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
