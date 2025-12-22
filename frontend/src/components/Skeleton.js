import React from 'react';

function Skeleton({ width = 64, height = 20, style = {}, className = '' }) {
  const baseStyle = {
    display: 'inline-block',
    background: '#f0f0f0',
    borderRadius: 6,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return <div className={className} style={baseStyle} aria-hidden="true" />;
}

export default Skeleton;
