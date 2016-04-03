'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Avatar = function Avatar(_ref) {
  var mention = _ref.mention;
  var theme = _ref.theme;

  if (mention.has('avatar')) {
    return _react2.default.createElement('img', { src: mention.get('avatar'), className: theme.get('autocompleteEntryAvatar') });
  }

  return null;
};

exports.default = Avatar;