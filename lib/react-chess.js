'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var Draggable = require('react-draggable');
var resizeAware = require('react-resize-aware');
var defaultLineup = require('./defaultLineup');
var pieceComponents = require('./pieces');
var decode = require('./decode');

var ResizeAware = resizeAware.default || resizeAware;
var getDefaultLineup = function getDefaultLineup() {
  return defaultLineup.slice();
};
var noop = function noop() {
  /* intentional noop */
};

var square = 100 / 8;
var squareSize = square + '%';

var squareStyles = {
  width: squareSize,
  paddingBottom: squareSize,
  float: 'left',
  position: 'relative',
  pointerEvents: 'none'
};

var labelStyles = { fontSize: 'calc(7px + .5vw)', position: 'absolute', userSelect: 'none' };
var yLabelStyles = Object.assign({ top: '5%', left: '5%' }, labelStyles);
var xLabelStyles = Object.assign({ bottom: '5%', right: '5%' }, labelStyles);

var Chess = function (_React$Component) {
  _inherits(Chess, _React$Component);

  function Chess() {
    var _ref;

    _classCallCheck(this, Chess);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = Chess.__proto__ || Object.getPrototypeOf(Chess)).call.apply(_ref, [this].concat(args)));

    _this.els = {};
    _this.state = {};
    _this.setBoardRef = function (el) {
      return _this.els.board = el;
    };
    _this.handleDragStart = _this.handleDragStart.bind(_this);
    _this.handleDragStop = _this.handleDragStop.bind(_this);
    _this.handleDrag = _this.handleDrag.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);
    return _this;
  }

  _createClass(Chess, [{
    key: 'getSquareColor',
    value: function getSquareColor(x, y) {
      var _props = this.props,
          lightSquareColor = _props.lightSquareColor,
          darkSquareColor = _props.darkSquareColor;

      var odd = x % 2;

      if (y % 2) {
        return odd ? lightSquareColor : darkSquareColor;
      }

      return odd ? darkSquareColor : lightSquareColor;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var boardSize = this.els.board.clientWidth;
      var tileSize = boardSize / 8;
      this.setState({ boardSize: boardSize, tileSize: tileSize });
    }
  }, {
    key: 'handleResize',
    value: function handleResize(size) {
      var tileSize = size.width / 8;
      this.setState({ boardSize: size.width, tileSize: tileSize });
    }
  }, {
    key: 'coordsToPosition',
    value: function coordsToPosition(coords) {
      var x = Math.round(coords.x / this.state.tileSize);
      var y = Math.round(coords.y / this.state.tileSize);
      return {
        x: x,
        y: y,
        pos: '' + String.fromCharCode(decode.charCodeOffset + x) + (8 - y)
      };
    }
  }, {
    key: 'handleDrag',
    value: function handleDrag(evt, drag) {
      if (!this.props.highlightTarget) {
        return;
      }

      var targetTile = this.state.targetTile;

      var _coordsToPosition = this.coordsToPosition({
        x: drag.node.offsetLeft + drag.x,
        y: drag.node.offsetTop + drag.y
      }),
          x = _coordsToPosition.x,
          y = _coordsToPosition.y;

      if (!targetTile || targetTile.x !== x || targetTile.y !== y) {
        this.setState({ targetTile: { x: x, y: y } });
      }
    }
  }, {
    key: 'handleDragStart',
    value: function handleDragStart(evt, drag) {
      evt.preventDefault();

      if (!this.props.allowMoves) {
        return false;
      }

      var node = drag.node;
      var dragFrom = this.coordsToPosition({ x: node.offsetLeft, y: node.offsetTop });
      var draggingPiece = this.findPieceAtPosition(dragFrom.pos);
      if (this.props.onDragStart(draggingPiece, dragFrom.pos) === false) {
        return false;
      }

      this.setState({ dragFrom: dragFrom, draggingPiece: draggingPiece });
      return evt;
    }
  }, {
    key: 'handleDragStop',
    value: function handleDragStop(evt, drag) {
      var node = drag.node;
      var _state = this.state,
          dragFrom = _state.dragFrom,
          draggingPiece = _state.draggingPiece;

      var dragTo = this.coordsToPosition({ x: node.offsetLeft + drag.x, y: node.offsetTop + drag.y });

      this.setState({ dragFrom: null, targetTile: null, draggingPiece: null });

      if (dragFrom.pos !== dragTo.pos) {
        this.props.onMovePiece(draggingPiece, dragFrom.pos, dragTo.pos);
      }

      return true;
    }
  }, {
    key: 'findPieceAtPosition',
    value: function findPieceAtPosition(pos) {
      for (var i = 0; i < this.props.pieces.length; i++) {
        var piece = this.props.pieces[i];
        if (piece.indexOf(pos) === 2) {
          return { notation: piece, name: piece.slice(0, 1), index: i, position: pos };
        }
      }

      return null;
    }
  }, {
    key: 'renderLabelText',
    value: function renderLabelText(x, y) {
      var isLeftColumn = x === 0;
      var isBottomRow = y === 7;

      if (!this.props.drawLabels || !isLeftColumn && !isBottomRow) {
        return null;
      }

      if (isLeftColumn && isBottomRow) {
        return [React.createElement(
          'span',
          { key: 'blx', style: xLabelStyles },
          'a'
        ), React.createElement(
          'span',
          { key: 'bly', style: yLabelStyles },
          '1'
        )];
      }

      var label = isLeftColumn ? 8 - y : String.fromCharCode(decode.charCodeOffset + x);
      return React.createElement(
        'span',
        { style: isLeftColumn ? yLabelStyles : xLabelStyles },
        label
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state2 = this.state,
          targetTile = _state2.targetTile,
          draggingPiece = _state2.draggingPiece,
          boardSize = _state2.boardSize;


      var tiles = [];
      for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
          var isTarget = targetTile && targetTile.x === x && targetTile.y === y;
          var background = this.getSquareColor(x, y);
          var boxShadow = isTarget ? 'inset 0px 0px 0px 0.4vmin yellow' : undefined;
          var styles = Object.assign({ background: background, boxShadow: boxShadow }, squareStyles);

          tiles.push(React.createElement(
            'div',
            { key: 'rect-' + x + '-' + y, style: styles },
            this.renderLabelText(x, y)
          ));
        }
      }

      var pieces = this.props.pieces.map(function (decl, i) {
        var isMoving = draggingPiece && i === draggingPiece.index;

        var _decode$fromPieceDecl = decode.fromPieceDecl(decl),
            x = _decode$fromPieceDecl.x,
            y = _decode$fromPieceDecl.y,
            piece = _decode$fromPieceDecl.piece;

        var Piece = pieceComponents[piece];
        return React.createElement(
          Draggable,
          {
            bounds: 'parent',
            position: { x: 0, y: 0 },
            onStart: _this2.handleDragStart,
            onDrag: _this2.handleDrag,
            onStop: _this2.handleDragStop,
            key: piece + '-' + x + '-' + y },
          React.createElement(Piece, { isMoving: isMoving, x: x, y: y })
        );
      });

      var children = tiles.concat(pieces);
      var boardStyles = { position: 'relative', overflow: 'hidden', width: '100%', height: boardSize };

      return React.createElement(
        ResizeAware,
        {
          ref: this.setBoardRef,
          onlyEvent: true,
          onResize: this.handleResize,
          style: boardStyles },
        children
      );
    }
  }]);

  return Chess;
}(React.Component);

Chess.propTypes = {
  allowMoves: PropTypes.bool,
  highlightTarget: PropTypes.bool,
  drawLabels: PropTypes.bool,
  lightSquareColor: PropTypes.string,
  darkSquareColor: PropTypes.string,
  onMovePiece: PropTypes.func,
  onDragStart: PropTypes.func,
  pieces: PropTypes.arrayOf(PropTypes.string)
};

Chess.defaultProps = {
  allowMoves: true,
  highlightTarget: true,
  drawLabels: true,
  onMovePiece: noop,
  onDragStart: noop,
  lightSquareColor: '#f0d9b5',
  darkSquareColor: '#b58863',
  pieces: getDefaultLineup()
};

Chess.getDefaultLineup = getDefaultLineup;

module.exports = Chess;