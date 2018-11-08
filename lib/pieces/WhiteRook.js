'use strict';

var React = require('react');
var piecePositionHoc = require('../piecePositionHoc');

function WhiteRook(props) {
  return React.createElement(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 45 45', width: props.size, height: '100%' },
    React.createElement(
      'g',
      {
        fill: '#fff',
        fillRule: 'evenodd',
        stroke: '#000',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round' },
      React.createElement('path', {
        d: 'M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5',
        strokeLinecap: 'butt'
      }),
      React.createElement('path', { d: 'M34 14l-3 3H14l-3-3' }),
      React.createElement('path', { d: 'M31 17v12.5H14V17', strokeLinecap: 'butt', strokeLinejoin: 'miter' }),
      React.createElement('path', { d: 'M31 29.5l1.5 2.5h-20l1.5-2.5' }),
      React.createElement('path', { d: 'M11 14h23', fill: 'none', strokeLinejoin: 'miter' })
    )
  );
}

module.exports = piecePositionHoc(WhiteRook);