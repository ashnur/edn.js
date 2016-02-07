(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EOL = exports.List = exports.UUID = exports.read = exports.write = exports.replaceSymbols = exports.edn = undefined;

var _type = require('@jkroso/type');

var _type2 = _interopRequireDefault(_type);

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _write = require('./write');

var _write2 = _interopRequireDefault(_write);

var _read = require('./read');

var _read2 = _interopRequireDefault(_read);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/////
// Tagged template handler
//
var edn = exports.edn = function edn(strs) {
  for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    data[_key - 1] = arguments[_key];
  }

  var ids = data.map(function () {
    return Symbol.for(':' + new _uuid2.default().toString());
  });
  var edn = strs.reduce(function (a, b, i) {
    return a + (0, _write2.default)(ids[i - 1]) + b;
  });
  var env = {};
  ids.forEach(function (id, i) {
    return env[id] = data[i];
  });
  return replaceSymbols((0, _read2.default)(edn), env);
};

var replaceSymbols = exports.replaceSymbols = function replaceSymbols(data, env) {
  if (Array.isArray(data)) return data.map(function (x) {
    return replaceSymbols(x, env);
  });
  if (data instanceof Map) {
    var map = new Map();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2);

        var key = _step$value[0];
        var value = _step$value[1];

        map.set(replaceSymbols(key, env), replaceSymbols(value, env));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return map;
  }
  if (data instanceof Set) {
    var set = new Set();
    data.forEach(function (val) {
      return set.add(replaceSymbols(val, env));
    });
    return set;
  }
  if (data instanceof _list2.default) return replaceInList(data, env);
  if ((0, _type2.default)(data) == 'symbol' && data in env) return env[data];
  return data;
};

var replaceInList = function replaceInList(list, env) {
  if (list === _list.EOL) return list;
  list.value = replaceSymbols(list.value, env);
  replaceInList(list.tail, env);
  return list;
};

exports.write = _write2.default;
exports.read = _read2.default;
exports.UUID = _uuid2.default;
exports.List = _list2.default;
exports.EOL = _list.EOL;

},{"./list":2,"./read":4,"./uuid":5,"./write":6,"@jkroso/type":3}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EOL = undefined;

var _write = require('./write');

var _write2 = _interopRequireDefault(_write);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var List = function () {
  function List(head, tail) {
    _classCallCheck(this, List);

    this.value = head;
    this.tail = tail || EOL;
  }

  _createClass(List, [{
    key: Symbol.iterator,
    value: function value() {
      return new ListIterator(this);
    }
  }, {
    key: 'toEDN',
    value: function toEDN() {
      var arr = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var value = _step.value;
          arr.push((0, _write2.default)(value));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return '(' + arr.join(' ') + ')';
    }
  }], [{
    key: 'from',
    value: function from(array) {
      var i = array.length;
      var list = EOL;
      while (i--) {
        list = new List(array[i], list);
      }
      return list;
    }
  }]);

  return List;
}();

exports.default = List;

var ListIterator = function () {
  function ListIterator(list) {
    _classCallCheck(this, ListIterator);

    this.list = list;
  }

  _createClass(ListIterator, [{
    key: 'next',
    value: function next() {
      var list = this.list;
      if (list !== EOL) this.list = list.tail;
      return list;
    }
  }]);

  return ListIterator;
}();

// the end of list marker

var EOL = exports.EOL = Object.create(List.prototype);

Object.defineProperty(EOL, 'value', {
  get: function get() {
    throw new Error("Can't get the head of the empty List");
  },

  enumerable: false
});
Object.defineProperty(EOL, 'tail', {
  get: function get() {
    throw new Error("Can't get the tail of the empty List");
  },

  enumerable: false
});
EOL.done = true;

},{"./write":6}],3:[function(require,module,exports){
var toString = {}.toString
var DomNode = typeof window != 'undefined'
  ? window.Node
  : Function // could be any function

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = exports = function type(x){
  var type = typeof x
  if (type != 'object') return type
  type = types[toString.call(x)]
  if (type == 'object') {
    // in case they have been polyfilled
    if (x instanceof Map) return 'map'
    if (x instanceof Set) return 'set'
    return 'object'
  }
  if (type) return type
  if (x instanceof DomNode) switch (x.nodeType) {
    case 1:  return 'element'
    case 3:  return 'text-node'
    case 9:  return 'document'
    case 11: return 'document-fragment'
    default: return 'dom-node'
  }
}

var types = exports.types = {
  '[object Function]': 'function',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object Set]': 'set',
  '[object String]': 'string',
  '[object Null]': 'null',
  '[object Undefined]': 'undefined',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
  '[object Object]': 'object',
  '[object Map]': 'map',
  '[object Text]': 'text-node',
  '[object Uint8Array]': 'bit-array',
  '[object Uint16Array]': 'bit-array',
  '[object Uint32Array]': 'bit-array',
  '[object Uint8ClampedArray]': 'bit-array',
  '[object Error]': 'error',
  '[object FormData]': 'form-data',
  '[object File]': 'file',
  '[object Blob]': 'blob'
}

},{}],4:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
  function Parser(str, filename) {
    _classCallCheck(this, Parser);

    this.filename = filename;
    this.source = str;
    this.index = 0;
  }

  _createClass(Parser, [{
    key: 'nextForm',
    value: function nextForm() {
      switch (this.current) {
        case '"':
          return this.string();
        case '[':
          return this.toClosing(']');
        case '(':
          return _list2.default.from(this.toClosing(')'));
        case '{':
          return new Map(pairs(this.toClosing('}')));
        case ':':
          return Symbol.for(this.bufferChars());
        case '#':
          return this.tagged();
        case '\\':
          return this.char();
        case '}':
        case ']':
        case ')':
          throw this.error('unexpected closing "' + this.source[this.index++] + '"');
        case undefined:
          throw new SyntaxError('unexpected end of input');
        default:
          return this.primitive(this.bufferChars());
      }
    }
  }, {
    key: 'error',
    value: function error(msg) {
      var lines = this.source.split(/\n/g);
      var count = this.index;
      var lineno = 0;
      while (lines[lineno].length < count) {
        count -= lines[lineno++].length + 1;
      }
      return new SyntaxError(msg + ' (' + (lineno + 1) + ':' + count + ')');
    }
  }, {
    key: 'char',
    value: function char() {
      return this.source[++this.index];
    }
  }, {
    key: 'toClosing',
    value: function toClosing(brace) {
      this.index++;
      var out = [];
      while (true) {
        // skip whitespace
        switch (this.current) {
          case '\n':
          case '\r':
          case '\t':
          case ',':
          case ' ':
            this.index++;continue;
        }
        if (this.current == brace) break;
        out.push(this.nextForm());
      }
      this.index++;
      return out;
    }
  }, {
    key: 'string',
    value: function string() {
      var c;
      var str = [];
      while ((c = this.char()) != '"') {
        if (c == '\\') switch (c = this.char()) {
          case 'b':
            c = '\b';break;
          case 'f':
            c = '\f';break;
          case 'n':
            c = '\n';break;
          case 'r':
            c = '\r';break;
          case 't':
            c = '\t';break;
          case 'v':
            c = '\v';break;
          case 'x':
            throw new Error('TODO: support hex literals');
        }
        str.push(c);
      }
      this.index++;
      return str.join('');
    }
  }, {
    key: 'bufferChars',
    value: function bufferChars() {
      var buf = this.current;
      while (isChar(this.char())) {
        buf += this.current;
      }return buf;
    }
  }, {
    key: 'primitive',
    value: function primitive(str) {
      if (str == 'true') return true;
      if (str == 'false') return false;
      if (str == 'nil') return null;
      var n = parseFloat(str, 10);
      if (isNaN(n)) return Symbol.for(str);
      if (n == str) return n;
      throw this.error('invalid symbol "' + str + '"');
    }
  }, {
    key: 'tagged',
    value: function tagged() {
      if (this.char() == '{') return new Set(this.toClosing('}'));
      var tag = this.bufferChars();
      var fn = parse[tag];
      if (!fn) throw this.error('unknown tag type "' + tag + '"');
      this.index++; // skip space
      return fn(this.nextForm());
    }
  }, {
    key: 'current',
    get: function get() {
      return this.source[this.index];
    }
  }, {
    key: 'next',
    get: function get() {
      return this.source[this.index + 1];
    }
  }]);

  return Parser;
}();

var pairs = function pairs(arr) {
  var half = arr.length / 2;
  var out = Array(half);
  var i = 0;
  var j = 0;
  while (i < half) {
    out[i++] = [arr[j++], arr[j++]];
  }
  return out;
};

var charRegex = /[^\s,}\])]/;
var isChar = function isChar(c) {
  return c != null && charRegex.test(c);
};

var parse = function parse(str, filename) {
  return new Parser(str, filename).nextForm();
};
parse['inst'] = function (str) {
  return new Date(str);
};
parse['uuid'] = function (str) {
  return new _uuid2.default(str);
};
parse['js/Array'] = function (array) {
  return array;
};
parse['js/Object'] = function (map) {
  var object = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = map.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var key = _step$value[0];
      var value = _step$value[1];

      object[key] = value;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return object;
};

exports.default = parse;

},{"./list":2,"./uuid":5}],5:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UUID = function () {
  function UUID(str) {
    _classCallCheck(this, UUID);

    this.data = new Uint8Array(16);
    if (str) this.parse(str);else this.randomize();
  }

  _createClass(UUID, [{
    key: 'parse',
    value: function parse(str) {
      if (str.length == 32) {
        parseChunk(str, 0, 32, this.data, 0);
      } else {
        parseChunk(str, 0, 8, this.data, 0);
        parseChunk(str, 9, 13, this.data, 4);
        parseChunk(str, 14, 18, this.data, 6);
        parseChunk(str, 19, 23, this.data, 8);
        parseChunk(str, 24, 36, this.data, 10);
      }
    }
  }, {
    key: 'randomize',
    value: function randomize() {
      for (var i = 0; i < 16; i++) {
        this.data[i] = Math.floor(Math.random() * 256);
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var buf = Array(32);
      encodeChunk(this.data, 0, 16, buf, 0);
      return buf.join('');
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var buf = Array(36);
      encodeChunk(this.data, 0, 4, buf, 0);
      buf[8] = '-';
      encodeChunk(this.data, 4, 6, buf, 9);
      buf[13] = '-';
      encodeChunk(this.data, 6, 8, buf, 14);
      buf[18] = '-';
      encodeChunk(this.data, 8, 10, buf, 19);
      buf[23] = '-';
      encodeChunk(this.data, 10, 16, buf, 24);
      return buf.join('');
    }
  }, {
    key: 'toEDN',
    value: function toEDN() {
      return '#uuid "' + this.toJSON() + '"';
    }
  }]);

  return UUID;
}();

exports.default = UUID;

var pad = function pad(str) {
  return str.length < 2 ? '0' + str : str;
};

var encodeChunk = function encodeChunk(bytes, begin, end, str, pos) {
  while (begin < end) {
    var _pad = pad(bytes[begin++].toString(16));

    var _pad2 = _slicedToArray(_pad, 2);

    var a = _pad2[0];
    var b = _pad2[1];

    str[pos++] = a;
    str[pos++] = b;
  }
};

var parseChunk = function parseChunk(str, begin, end, bytes, pos) {
  for (; begin < end; begin += 2) {
    bytes[pos++] = parseInt(str.substr(begin, 2), 16);
  }
};

},{}],6:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _type = require('@jkroso/type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var write = function write(data) {
  switch ((0, _type2.default)(data)) {
    case 'null':
      return 'nil';
    case 'boolean':
      return data ? 'true' : 'false';
    case 'number':
      return data.toString();
    case 'string':
      return JSON.stringify(data);
    case 'date':
      return '#inst "' + data.toJSON() + '"';
    case 'array':
      return '#js/Array [' + data.map(write).join(' ') + ']';
    case 'symbol':
      return data.toString().slice(7, -1);
    case 'map':
      return mapEDN(data);
    case 'set':
      return setEDN(data);
    case 'object':
      if (data.toEDN) return data.toEDN();
      return objectEDN(data.toJSON ? data.toJSON() : data);
    default:
      throw new Error('can\'t convert a ' + data.constructor.name + ' to EDN');
  }
};

var objectEDN = function objectEDN(object) {
  return '#js/Object {' + Object.keys(object).reduce(function (arr, key) {
    arr.push(JSON.stringify(key), write(object[key]));
    return arr;
  }, []).join(' ') + '}';
};

var mapEDN = function mapEDN(map) {
  var arr = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = map.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var key = _step$value[0];
      var value = _step$value[1];

      arr.push(write(key), write(value));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return '{' + arr.join(' ') + '}';
};

var setEDN = function setEDN(set) {
  var arr = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = set.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var value = _step2.value;
      arr.push(write(value));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return '#{' + arr.join(' ') + '}';
};

exports.default = write;

},{"@jkroso/type":3}]},{},[1]);
