'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Mention = function Mention(props) {
  var entityKey = props.entityKey;
  var theme = props.theme;

  var _Entity$get$getData = _draftJs.Entity.get(entityKey).getData();

  var mention = _Entity$get$getData.mention;


  if (mention.has('link')) {
    return _react2.default.createElement(
      'a',
      {
        href: mention.get('link'),
        className: theme.get('mention'),
        spellCheck: false
      },
      props.children
    );
  }

  return _react2.default.createElement(
    'span',
    {
      className: theme.get('mention'),
      spellCheck: false
    },
    props.children
  );
};

exports.default = Mention;