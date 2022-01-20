var initFormsLookup = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global_1 = // eslint-disable-next-line no-undef
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func
	Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;
	var objectPropertyIsEnumerable = {
	  f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string

	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};
	var objectGetOwnPropertyDescriptor = {
	  f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  }

	  return it;
	};

	var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty

	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	var objectDefineProperty = {
	  f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  }

	  return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});
	var sharedStore = store;

	var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;
	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	  (module.exports = function (key, value) {
	    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	  })('versions', []).push({
	    version: '3.6.5',
	    mode:  'global',
	    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	  });
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;

	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };

	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;

	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };

	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	  var getInternalState = internalState.get;
	  var enforceInternalState = internalState.enforce;
	  var TEMPLATE = String(String).split('String');
	  (module.exports = function (O, key, value, options) {
	    var unsafe = options ? !!options.unsafe : false;
	    var simple = options ? !!options.enumerable : false;
	    var noTargetGet = options ? !!options.noTargetGet : false;

	    if (typeof value == 'function') {
	      if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	    }

	    if (O === global_1) {
	      if (simple) O[key] = value;else setGlobal(key, value);
	      return;
	    } else if (!unsafe) {
	      delete O[key];
	    } else if (!noTargetGet && O[key]) {
	      simple = true;
	    }

	    if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	  })(Function.prototype, 'toString', function toString() {
	    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	  });
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger

	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength

	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
	  f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;
	var objectGetOwnPropertySymbols = {
	  f: f$4
	};

	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';
	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/

	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    } // extend global


	    redefine(target, key, sourceProperty, options);
	  }
	};

	// https://tc39.github.io/ecma262/#sec-isarray

	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// https://tc39.github.io/ecma262/#sec-toobject

	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol // eslint-disable-next-line no-undef
	&& !Symbol.sham // eslint-disable-next-line no-undef
	&& typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  }

	  return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate = function (originalArray, length) {
	  var C;

	  if (isArray(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  }

	  return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$1] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded'; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
	}, {
	  concat: function concat(arg) {
	    // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  }

	  return it;
	};

	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;

	  switch (length) {
	    case 0:
	      return function () {
	        return fn.call(that);
	      };

	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };

	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };

	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }

	  return function ()
	  /* ...args */
	  {
	    return fn.apply(that, arguments);
	  };
	};

	var push = [].push; // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation

	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;

	    for (; length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);

	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	            case 3:
	              return true;
	            // some

	            case 5:
	              return value;
	            // find

	            case 6:
	              return index;
	            // findIndex

	            case 2:
	              push.call(target, value);
	            // filter
	          } else if (IS_EVERY) return false; // every
	      }
	    }

	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) {
	  throw it;
	};

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;
	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = {
	      length: -1
	    };
	    if (ACCESSORS) defineProperty(O, 1, {
	      enumerable: true,
	      get: thrower
	    });else O[1] = 1;
	    method.call(O, argument0, argument1);
	  });
	};

	var $filter = arrayIteration.filter;
	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter'); // Edge 14- issue

	var USES_TO_LENGTH = arrayMethodUsesToLength('filter'); // `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH
	}, {
	  filter: function filter(callbackfn
	  /* , thisArg */
	  ) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $map = arrayIteration.map;
	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map'); // FF49- issue

	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('map'); // `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$1
	}, {
	  map: function map(callbackfn
	  /* , thisArg */
	  ) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('slice', {
	  ACCESSORS: true,
	  0: 0,
	  1: 2
	});
	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max; // `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$2
	}, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length); // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible

	    var Constructor, result, n;

	    if (isArray(O)) {
	      Constructor = O.constructor; // cross-realm fallback

	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }

	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }

	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));

	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);

	    result.length = n;
	    return result;
	  }
	});

	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags


	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	// so we use an intermediate function.


	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});
	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});
	var regexpStickyHelpers = {
	  UNSUPPORTED_Y: UNSUPPORTED_Y,
	  BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.

	var nativeReplace = String.prototype.replace;
	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	}();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET; // nonparticipating capturing group, copied from es5-shim's String#split patch.

	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');

	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex); // Support anchored sticky behavior.

	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      } // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.


	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }

	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }

	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({
	  target: 'RegExp',
	  proto: true,
	  forced: /./.exec !== regexpExec
	}, {
	  exec: regexpExec
	});

	var SPECIES$3 = wellKnownSymbol('species');
	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;

	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  };

	  return ''.replace(re, '$<a>') !== '7';
	}); // IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0

	var REPLACE_KEEPS_$0 = function () {
	  return 'a'.replace(/./, '$0') === '$0';
	}();

	var REPLACE = wellKnownSymbol('replace'); // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string

	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }

	  return false;
	}(); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper


	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);
	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {}; // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.

	      re.constructor = {};

	      re.constructor[SPECIES$3] = function () {
	        return re;
	      };

	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE) || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: nativeRegExpMethod.call(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: nativeMethod.call(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];
	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	    ? function (string, arg) {
	      return regexMethod.call(string, this, arg);
	    } // 21.2.5.6 RegExp.prototype[@@match](string)
	    // 21.2.5.9 RegExp.prototype[@@search](string)
	    : function (string) {
	      return regexMethod.call(string, this);
	    });
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	// `SameValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-samevalue
	var sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// https://tc39.github.io/ecma262/#sec-regexpexec

	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;

	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);

	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }

	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
	  return [// `String.prototype.search` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.search
	  function search(regexp) {
	    var O = requireObjectCoercible(this);
	    var searcher = regexp == undefined ? undefined : regexp[SEARCH];
	    return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	  }, // `RegExp.prototype[@@search]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
	  function (regexp) {
	    var res = maybeCallNative(nativeSearch, regexp, this);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    var previousLastIndex = rx.lastIndex;
	    if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
	    var result = regexpExecAbstract(rx, S);
	    if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	    return result === null ? -1 : result.index;
	  }];
	});

	var MATCH = wellKnownSymbol('match'); // `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp

	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var SPECIES$4 = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor

	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var createMethod$2 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var charAt = stringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex

	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	var arrayPush = [].push;
	var min$2 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

	var SUPPORTS_Y = !fails(function () {
	  return !RegExp(MAX_UINT32, 'y');
	}); // @@split logic

	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'.split(/(b)*/)[1] == 'c' || 'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

	      if (!isRegexp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }

	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;

	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }

	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));

	      return output.length > lim ? output.slice(0, lim) : output;
	    }; // Chakra, V8

	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [// `String.prototype.split` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = requireObjectCoercible(this);
	    var splitter = separator == undefined ? undefined : separator[SPLIT];
	    return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (regexp, limit) {
	    var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    var C = speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = SUPPORTS_Y ? q : 0;
	      var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	      var e;

	      if (z === null || (e = min$2(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
	        q = advanceStringIndex(S, q, unicodeMatching);
	      } else {
	        A.push(S.slice(p, q));
	        if (A.length === lim) return A;

	        for (var i = 1; i <= z.length - 1; i++) {
	          A.push(z[i]);
	          if (A.length === lim) return A;
	        }

	        q = p = e;
	      }
	    }

	    A.push(S.slice(p));
	    return A;
	  }];
	}, !SUPPORTS_Y);

	function _taggedTemplateLiteral(strings, raw) {
	  if (!raw) {
	    raw = strings.slice(0);
	  }

	  return Object.freeze(Object.defineProperties(strings, {
	    raw: {
	      value: Object.freeze(raw)
	    }
	  }));
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	//     Underscore.js 1.10.2
	//     https://underscorejs.org
	//     (c) 2009-2020 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	// Baseline setup
	// --------------
	// Establish the root object, `window` (`self`) in the browser, `global`
	// on the server, or `this` in some virtual machines. We use `self`
	// instead of `window` for `WebWorker` support.
	var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || Function('return this')() || {}; // Save bytes in the minified (but not gzipped) version:

	var ArrayProto = Array.prototype,
	    ObjProto = Object.prototype;
	var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null; // Create quick reference variables for speed access to core prototypes.

	var push$1 = ArrayProto.push,
	    slice = ArrayProto.slice,
	    toString$1 = ObjProto.toString,
	    hasOwnProperty$1 = ObjProto.hasOwnProperty; // All **ECMAScript 5** native function implementations that we hope to use
	// are declared here.

	var nativeIsArray = Array.isArray,
	    nativeKeys = Object.keys,
	    nativeCreate = Object.create; // Create references to these builtin functions because we override them.

	var _isNaN = root.isNaN,
	    _isFinite = root.isFinite; // Naked function reference for surrogate-prototype-swapping.

	var Ctor = function () {}; // The Underscore object. All exported functions below are added to it in the
	// modules/index-all.js using the mixin function.


	function _(obj) {
	  if (obj instanceof _) return obj;
	  if (!(this instanceof _)) return new _(obj);
	  this._wrapped = obj;
	} // Current version.

	var VERSION = _.VERSION = '1.10.2'; // Internal function that returns an efficient (for current engines) version
	// of the passed-in callback, to be repeatedly applied in other Underscore
	// functions.

	function optimizeCb(func, context, argCount) {
	  if (context === void 0) return func;

	  switch (argCount == null ? 3 : argCount) {
	    case 1:
	      return function (value) {
	        return func.call(context, value);
	      };
	    // The 2-argument case is omitted because we’re not using it.

	    case 3:
	      return function (value, index, collection) {
	        return func.call(context, value, index, collection);
	      };

	    case 4:
	      return function (accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	  }

	  return function () {
	    return func.apply(context, arguments);
	  };
	} // An internal function to generate callbacks that can be applied to each
	// element in a collection, returning the desired result — either `identity`,
	// an arbitrary callback, a property matcher, or a property accessor.


	function baseIteratee(value, context, argCount) {
	  if (value == null) return identity;
	  if (isFunction(value)) return optimizeCb(value, context, argCount);
	  if (isObject$1(value) && !isArray$1(value)) return matcher(value);
	  return property(value);
	} // External wrapper for our callback generator. Users may customize
	// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
	// This abstraction hides the internal-only argCount argument.


	_.iteratee = iteratee;
	function iteratee(value, context) {
	  return baseIteratee(value, context, Infinity);
	} // The function we actually call internally. It invokes _.iteratee if
	// overridden, otherwise baseIteratee.

	function cb(value, context, argCount) {
	  if (_.iteratee !== iteratee) return _.iteratee(value, context);
	  return baseIteratee(value, context, argCount);
	} // Some functions take a variable number of arguments, or a few expected
	// arguments at the beginning and then a variable number of values to operate
	// on. This helper accumulates all remaining arguments past the function’s
	// argument length (or an explicit `startIndex`), into an array that becomes
	// the last argument. Similar to ES6’s "rest parameter".


	function restArguments(func, startIndex) {
	  startIndex = startIndex == null ? func.length - 1 : +startIndex;
	  return function () {
	    var length = Math.max(arguments.length - startIndex, 0),
	        rest = Array(length),
	        index = 0;

	    for (; index < length; index++) {
	      rest[index] = arguments[index + startIndex];
	    }

	    switch (startIndex) {
	      case 0:
	        return func.call(this, rest);

	      case 1:
	        return func.call(this, arguments[0], rest);

	      case 2:
	        return func.call(this, arguments[0], arguments[1], rest);
	    }

	    var args = Array(startIndex + 1);

	    for (index = 0; index < startIndex; index++) {
	      args[index] = arguments[index];
	    }

	    args[startIndex] = rest;
	    return func.apply(this, args);
	  };
	} // An internal function for creating a new object that inherits from another.

	function baseCreate(prototype) {
	  if (!isObject$1(prototype)) return {};
	  if (nativeCreate) return nativeCreate(prototype);
	  Ctor.prototype = prototype;
	  var result = new Ctor();
	  Ctor.prototype = null;
	  return result;
	}

	function shallowProperty(key) {
	  return function (obj) {
	    return obj == null ? void 0 : obj[key];
	  };
	}

	function _has(obj, path) {
	  return obj != null && hasOwnProperty$1.call(obj, path);
	}

	function deepGet(obj, path) {
	  var length = path.length;

	  for (var i = 0; i < length; i++) {
	    if (obj == null) return void 0;
	    obj = obj[path[i]];
	  }

	  return length ? obj : void 0;
	} // Helper for collection methods to determine whether a collection
	// should be iterated as an array or as an object.
	// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094


	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	var getLength = shallowProperty('length');

	function isArrayLike(collection) {
	  var length = getLength(collection);
	  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	} // Collection Functions
	// --------------------
	// The cornerstone, an `each` implementation, aka `forEach`.
	// Handles raw objects in addition to array-likes. Treats all
	// sparse array-likes as if they were dense.


	function each(obj, iteratee, context) {
	  iteratee = optimizeCb(iteratee, context);
	  var i, length;

	  if (isArrayLike(obj)) {
	    for (i = 0, length = obj.length; i < length; i++) {
	      iteratee(obj[i], i, obj);
	    }
	  } else {
	    var _keys = keys$1(obj);

	    for (i = 0, length = _keys.length; i < length; i++) {
	      iteratee(obj[_keys[i]], _keys[i], obj);
	    }
	  }

	  return obj;
	}

	function map(obj, iteratee, context) {
	  iteratee = cb(iteratee, context);

	  var _keys = !isArrayLike(obj) && keys$1(obj),
	      length = (_keys || obj).length,
	      results = Array(length);

	  for (var index = 0; index < length; index++) {
	    var currentKey = _keys ? _keys[index] : index;
	    results[index] = iteratee(obj[currentKey], currentKey, obj);
	  }

	  return results;
	}

	function createReduce(dir) {
	  // Wrap code that reassigns argument variables in a separate function than
	  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
	  var reducer = function (obj, iteratee, memo, initial) {
	    var _keys = !isArrayLike(obj) && keys$1(obj),
	        length = (_keys || obj).length,
	        index = dir > 0 ? 0 : length - 1;

	    if (!initial) {
	      memo = obj[_keys ? _keys[index] : index];
	      index += dir;
	    }

	    for (; index >= 0 && index < length; index += dir) {
	      var currentKey = _keys ? _keys[index] : index;
	      memo = iteratee(memo, obj[currentKey], currentKey, obj);
	    }

	    return memo;
	  };

	  return function (obj, iteratee, memo, context) {
	    var initial = arguments.length >= 3;
	    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
	  };
	} // **Reduce** builds up a single result from a list of values, aka `inject`,
	// or `foldl`.


	var reduce = createReduce(1);

	var reduceRight = createReduce(-1);

	function find(obj, predicate, context) {
	  var keyFinder = isArrayLike(obj) ? findIndex : findKey;
	  var key = keyFinder(obj, predicate, context);
	  if (key !== void 0 && key !== -1) return obj[key];
	}

	function filter(obj, predicate, context) {
	  var results = [];
	  predicate = cb(predicate, context);
	  each(obj, function (value, index, list) {
	    if (predicate(value, index, list)) results.push(value);
	  });
	  return results;
	}

	function reject(obj, predicate, context) {
	  return filter(obj, negate(cb(predicate)), context);
	} // Determine whether all of the elements match a truth test.

	function every(obj, predicate, context) {
	  predicate = cb(predicate, context);

	  var _keys = !isArrayLike(obj) && keys$1(obj),
	      length = (_keys || obj).length;

	  for (var index = 0; index < length; index++) {
	    var currentKey = _keys ? _keys[index] : index;
	    if (!predicate(obj[currentKey], currentKey, obj)) return false;
	  }

	  return true;
	}

	function some(obj, predicate, context) {
	  predicate = cb(predicate, context);

	  var _keys = !isArrayLike(obj) && keys$1(obj),
	      length = (_keys || obj).length;

	  for (var index = 0; index < length; index++) {
	    var currentKey = _keys ? _keys[index] : index;
	    if (predicate(obj[currentKey], currentKey, obj)) return true;
	  }

	  return false;
	}

	function contains(obj, item, fromIndex, guard) {
	  if (!isArrayLike(obj)) obj = values(obj);
	  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	  return indexOf$1(obj, item, fromIndex) >= 0;
	}

	var invoke = restArguments(function (obj, path, args) {
	  var contextPath, func;

	  if (isFunction(path)) {
	    func = path;
	  } else if (isArray$1(path)) {
	    contextPath = path.slice(0, -1);
	    path = path[path.length - 1];
	  }

	  return map(obj, function (context) {
	    var method = func;

	    if (!method) {
	      if (contextPath && contextPath.length) {
	        context = deepGet(context, contextPath);
	      }

	      if (context == null) return void 0;
	      method = context[path];
	    }

	    return method == null ? method : method.apply(context, args);
	  });
	}); // Convenience version of a common use case of `map`: fetching a property.

	function pluck(obj, key) {
	  return map(obj, property(key));
	} // Convenience version of a common use case of `filter`: selecting only objects
	// containing specific `key:value` pairs.

	function where(obj, attrs) {
	  return filter(obj, matcher(attrs));
	} // Convenience version of a common use case of `find`: getting the first object
	// containing specific `key:value` pairs.

	function findWhere(obj, attrs) {
	  return find(obj, matcher(attrs));
	} // Return the maximum element (or element-based computation).

	function max$2(obj, iteratee, context) {
	  var result = -Infinity,
	      lastComputed = -Infinity,
	      value,
	      computed;

	  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	    obj = isArrayLike(obj) ? obj : values(obj);

	    for (var i = 0, length = obj.length; i < length; i++) {
	      value = obj[i];

	      if (value != null && value > result) {
	        result = value;
	      }
	    }
	  } else {
	    iteratee = cb(iteratee, context);
	    each(obj, function (v, index, list) {
	      computed = iteratee(v, index, list);

	      if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	        result = v;
	        lastComputed = computed;
	      }
	    });
	  }

	  return result;
	} // Return the minimum element (or element-based computation).

	function min$3(obj, iteratee, context) {
	  var result = Infinity,
	      lastComputed = Infinity,
	      value,
	      computed;

	  if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
	    obj = isArrayLike(obj) ? obj : values(obj);

	    for (var i = 0, length = obj.length; i < length; i++) {
	      value = obj[i];

	      if (value != null && value < result) {
	        result = value;
	      }
	    }
	  } else {
	    iteratee = cb(iteratee, context);
	    each(obj, function (v, index, list) {
	      computed = iteratee(v, index, list);

	      if (computed < lastComputed || computed === Infinity && result === Infinity) {
	        result = v;
	        lastComputed = computed;
	      }
	    });
	  }

	  return result;
	} // Shuffle a collection.

	function shuffle(obj) {
	  return sample(obj, Infinity);
	} // Sample **n** random values from a collection using the modern version of the
	// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	// If **n** is not specified, returns a single random element.
	// The internal `guard` argument allows it to work with `map`.

	function sample(obj, n, guard) {
	  if (n == null || guard) {
	    if (!isArrayLike(obj)) obj = values(obj);
	    return obj[random(obj.length - 1)];
	  }

	  var sample = isArrayLike(obj) ? clone(obj) : values(obj);
	  var length = getLength(sample);
	  n = Math.max(Math.min(n, length), 0);
	  var last = length - 1;

	  for (var index = 0; index < n; index++) {
	    var rand = random(index, last);
	    var temp = sample[index];
	    sample[index] = sample[rand];
	    sample[rand] = temp;
	  }

	  return sample.slice(0, n);
	} // Sort the object's values by a criterion produced by an iteratee.

	function sortBy(obj, iteratee, context) {
	  var index = 0;
	  iteratee = cb(iteratee, context);
	  return pluck(map(obj, function (value, key, list) {
	    return {
	      value: value,
	      index: index++,
	      criteria: iteratee(value, key, list)
	    };
	  }).sort(function (left, right) {
	    var a = left.criteria;
	    var b = right.criteria;

	    if (a !== b) {
	      if (a > b || a === void 0) return 1;
	      if (a < b || b === void 0) return -1;
	    }

	    return left.index - right.index;
	  }), 'value');
	} // An internal function used for aggregate "group by" operations.

	function group(behavior, partition) {
	  return function (obj, iteratee, context) {
	    var result = partition ? [[], []] : {};
	    iteratee = cb(iteratee, context);
	    each(obj, function (value, index) {
	      var key = iteratee(value, index, obj);
	      behavior(result, value, key);
	    });
	    return result;
	  };
	} // Groups the object's values by a criterion. Pass either a string attribute
	// to group by, or a function that returns the criterion.


	var groupBy = group(function (result, value, key) {
	  if (_has(result, key)) result[key].push(value);else result[key] = [value];
	}); // Indexes the object's values by a criterion, similar to `groupBy`, but for
	// when you know that your index values will be unique.

	var indexBy = group(function (result, value, key) {
	  result[key] = value;
	}); // Counts instances of an object that group by a certain criterion. Pass
	// either a string attribute to count by, or a function that returns the
	// criterion.

	var countBy = group(function (result, value, key) {
	  if (_has(result, key)) result[key]++;else result[key] = 1;
	});
	var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g; // Safely create a real, live array from anything iterable.

	function toArray(obj) {
	  if (!obj) return [];
	  if (isArray$1(obj)) return slice.call(obj);

	  if (isString(obj)) {
	    // Keep surrogate pair characters together
	    return obj.match(reStrSymbol);
	  }

	  if (isArrayLike(obj)) return map(obj, identity);
	  return values(obj);
	} // Return the number of elements in an object.

	function size(obj) {
	  if (obj == null) return 0;
	  return isArrayLike(obj) ? obj.length : keys$1(obj).length;
	} // Split a collection into two arrays: one whose elements all satisfy the given
	// predicate, and one whose elements all do not satisfy the predicate.

	var partition = group(function (result, value, pass) {
	  result[pass ? 0 : 1].push(value);
	}, true); // Array Functions
	// ---------------
	// Get the first element of an array. Passing **n** will return the first N
	// values in the array. The **guard** check allows it to work with `map`.

	function first(array, n, guard) {
	  if (array == null || array.length < 1) return n == null ? void 0 : [];
	  if (n == null || guard) return array[0];
	  return initial(array, array.length - n);
	}
	// the arguments object. Passing **n** will return all the values in
	// the array, excluding the last N.

	function initial(array, n, guard) {
	  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	} // Get the last element of an array. Passing **n** will return the last N
	// values in the array.

	function last(array, n, guard) {
	  if (array == null || array.length < 1) return n == null ? void 0 : [];
	  if (n == null || guard) return array[array.length - 1];
	  return rest(array, Math.max(0, array.length - n));
	} // Returns everything but the first entry of the array. Especially useful on
	// the arguments object. Passing an **n** will return the rest N values in the
	// array.

	function rest(array, n, guard) {
	  return slice.call(array, n == null || guard ? 1 : n);
	}

	function compact(array) {
	  return filter(array, Boolean);
	} // Internal implementation of a recursive `flatten` function.

	function _flatten(input, shallow, strict, output) {
	  output = output || [];
	  var idx = output.length;

	  for (var i = 0, length = getLength(input); i < length; i++) {
	    var value = input[i];

	    if (isArrayLike(value) && (isArray$1(value) || isArguments(value))) {
	      // Flatten current level of array or arguments object.
	      if (shallow) {
	        var j = 0,
	            len = value.length;

	        while (j < len) output[idx++] = value[j++];
	      } else {
	        _flatten(value, shallow, strict, output);

	        idx = output.length;
	      }
	    } else if (!strict) {
	      output[idx++] = value;
	    }
	  }

	  return output;
	} // Flatten out an array, either recursively (by default), or just one level.


	function flatten(array, shallow) {
	  return _flatten(array, shallow, false);
	} // Return a version of the array that does not contain the specified value(s).

	var without = restArguments(function (array, otherArrays) {
	  return difference(array, otherArrays);
	}); // Produce a duplicate-free version of the array. If the array has already
	// been sorted, you have the option of using a faster algorithm.
	// The faster algorithm will not work with an iteratee if the iteratee
	// is not a one-to-one function, so providing an iteratee will disable
	// the faster algorithm.

	function uniq(array, isSorted, iteratee, context) {
	  if (!isBoolean(isSorted)) {
	    context = iteratee;
	    iteratee = isSorted;
	    isSorted = false;
	  }

	  if (iteratee != null) iteratee = cb(iteratee, context);
	  var result = [];
	  var seen = [];

	  for (var i = 0, length = getLength(array); i < length; i++) {
	    var value = array[i],
	        computed = iteratee ? iteratee(value, i, array) : value;

	    if (isSorted && !iteratee) {
	      if (!i || seen !== computed) result.push(value);
	      seen = computed;
	    } else if (iteratee) {
	      if (!contains(seen, computed)) {
	        seen.push(computed);
	        result.push(value);
	      }
	    } else if (!contains(result, value)) {
	      result.push(value);
	    }
	  }

	  return result;
	}
	// the passed-in arrays.

	var union = restArguments(function (arrays) {
	  return uniq(_flatten(arrays, true, true));
	}); // Produce an array that contains every item shared between all the
	// passed-in arrays.

	function intersection(array) {
	  var result = [];
	  var argsLength = arguments.length;

	  for (var i = 0, length = getLength(array); i < length; i++) {
	    var item = array[i];
	    if (contains(result, item)) continue;
	    var j;

	    for (j = 1; j < argsLength; j++) {
	      if (!contains(arguments[j], item)) break;
	    }

	    if (j === argsLength) result.push(item);
	  }

	  return result;
	} // Take the difference between one array and a number of other arrays.
	// Only the elements present in just the first array will remain.

	var difference = restArguments(function (array, rest) {
	  rest = _flatten(rest, true, true);
	  return filter(array, function (value) {
	    return !contains(rest, value);
	  });
	}); // Complement of zip. Unzip accepts an array of arrays and groups
	// each array's elements on shared indices.

	function unzip(array) {
	  var length = array && max$2(array, getLength).length || 0;
	  var result = Array(length);

	  for (var index = 0; index < length; index++) {
	    result[index] = pluck(array, index);
	  }

	  return result;
	} // Zip together multiple lists into a single array -- elements that share
	// an index go together.

	var zip = restArguments(unzip); // Converts lists into objects. Pass either a single array of `[key, value]`
	// pairs, or two parallel arrays of the same length -- one of keys, and one of
	// the corresponding values. Passing by pairs is the reverse of pairs.

	function object(list, values) {
	  var result = {};

	  for (var i = 0, length = getLength(list); i < length; i++) {
	    if (values) {
	      result[list[i]] = values[i];
	    } else {
	      result[list[i][0]] = list[i][1];
	    }
	  }

	  return result;
	} // Generator function to create the findIndex and findLastIndex functions.

	function createPredicateIndexFinder(dir) {
	  return function (array, predicate, context) {
	    predicate = cb(predicate, context);
	    var length = getLength(array);
	    var index = dir > 0 ? 0 : length - 1;

	    for (; index >= 0 && index < length; index += dir) {
	      if (predicate(array[index], index, array)) return index;
	    }

	    return -1;
	  };
	} // Returns the first index on an array-like that passes a predicate test.


	var findIndex = createPredicateIndexFinder(1);
	var findLastIndex = createPredicateIndexFinder(-1); // Use a comparator function to figure out the smallest index at which
	// an object should be inserted so as to maintain order. Uses binary search.

	function sortedIndex(array, obj, iteratee, context) {
	  iteratee = cb(iteratee, context, 1);
	  var value = iteratee(obj);
	  var low = 0,
	      high = getLength(array);

	  while (low < high) {
	    var mid = Math.floor((low + high) / 2);
	    if (iteratee(array[mid]) < value) low = mid + 1;else high = mid;
	  }

	  return low;
	} // Generator function to create the indexOf and lastIndexOf functions.

	function createIndexFinder(dir, predicateFind, sortedIndex) {
	  return function (array, item, idx) {
	    var i = 0,
	        length = getLength(array);

	    if (typeof idx == 'number') {
	      if (dir > 0) {
	        i = idx >= 0 ? idx : Math.max(idx + length, i);
	      } else {
	        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	      }
	    } else if (sortedIndex && idx && length) {
	      idx = sortedIndex(array, item);
	      return array[idx] === item ? idx : -1;
	    }

	    if (item !== item) {
	      idx = predicateFind(slice.call(array, i, length), isNaN$1);
	      return idx >= 0 ? idx + i : -1;
	    }

	    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	      if (array[idx] === item) return idx;
	    }

	    return -1;
	  };
	} // Return the position of the first occurrence of an item in an array,
	// or -1 if the item is not included in the array.
	// If the array is large and already in sort order, pass `true`
	// for **isSorted** to use binary search.


	var indexOf$1 = createIndexFinder(1, findIndex, sortedIndex);
	var lastIndexOf = createIndexFinder(-1, findLastIndex); // Generate an integer Array containing an arithmetic progression. A port of
	// the native Python `range()` function. See
	// [the Python documentation](https://docs.python.org/library/functions.html#range).

	function range(start, stop, step) {
	  if (stop == null) {
	    stop = start || 0;
	    start = 0;
	  }

	  if (!step) {
	    step = stop < start ? -1 : 1;
	  }

	  var length = Math.max(Math.ceil((stop - start) / step), 0);
	  var range = Array(length);

	  for (var idx = 0; idx < length; idx++, start += step) {
	    range[idx] = start;
	  }

	  return range;
	} // Chunk a single array into multiple arrays, each containing `count` or fewer
	// items.

	function chunk(array, count) {
	  if (count == null || count < 1) return [];
	  var result = [];
	  var i = 0,
	      length = array.length;

	  while (i < length) {
	    result.push(slice.call(array, i, i += count));
	  }

	  return result;
	} // Function (ahem) Functions
	// ------------------
	// Determines whether to execute a function as a constructor
	// or a normal function with the provided arguments.

	function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
	  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	  var self = baseCreate(sourceFunc.prototype);
	  var result = sourceFunc.apply(self, args);
	  if (isObject$1(result)) return result;
	  return self;
	} // Create a function bound to a given object (assigning `this`, and arguments,
	// optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	// available.


	var bind = restArguments(function (func, context, args) {
	  if (!isFunction(func)) throw new TypeError('Bind must be called on a function');
	  var bound = restArguments(function (callArgs) {
	    return executeBound(func, bound, context, this, args.concat(callArgs));
	  });
	  return bound;
	}); // Partially apply a function by creating a version that has had some of its
	// arguments pre-filled, without changing its dynamic `this` context. _ acts
	// as a placeholder by default, allowing any combination of arguments to be
	// pre-filled. Set `partial.placeholder` for a custom placeholder argument.

	var partial = restArguments(function (func, boundArgs) {
	  var placeholder = partial.placeholder;

	  var bound = function () {
	    var position = 0,
	        length = boundArgs.length;
	    var args = Array(length);

	    for (var i = 0; i < length; i++) {
	      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
	    }

	    while (position < arguments.length) args.push(arguments[position++]);

	    return executeBound(func, bound, this, this, args);
	  };

	  return bound;
	});
	partial.placeholder = _; // Bind a number of an object's methods to that object. Remaining arguments
	// are the method names to be bound. Useful for ensuring that all callbacks
	// defined on an object belong to it.

	var bindAll = restArguments(function (obj, _keys) {
	  _keys = _flatten(_keys, false, false);
	  var index = _keys.length;
	  if (index < 1) throw new Error('bindAll must be passed function names');

	  while (index--) {
	    var key = _keys[index];
	    obj[key] = bind(obj[key], obj);
	  }
	}); // Memoize an expensive function by storing its results.

	function memoize(func, hasher) {
	  var memoize = function (key) {
	    var cache = memoize.cache;
	    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	    if (!_has(cache, address)) cache[address] = func.apply(this, arguments);
	    return cache[address];
	  };

	  memoize.cache = {};
	  return memoize;
	} // Delays a function for the given number of milliseconds, and then calls
	// it with the arguments supplied.

	var delay = restArguments(function (func, wait, args) {
	  return setTimeout(function () {
	    return func.apply(null, args);
	  }, wait);
	}); // Defers a function, scheduling it to run after the current call stack has
	// cleared.

	var defer = partial(delay, _, 1); // Returns a function, that, when invoked, will only be triggered at most once
	// during a given window of time. Normally, the throttled function will run
	// as much as it can, without ever going more than once per `wait` duration;
	// but if you'd like to disable the execution on the leading edge, pass
	// `{leading: false}`. To disable execution on the trailing edge, ditto.

	function throttle(func, wait, options) {
	  var timeout, context, args, result;
	  var previous = 0;
	  if (!options) options = {};

	  var later = function () {
	    previous = options.leading === false ? 0 : now();
	    timeout = null;
	    result = func.apply(context, args);
	    if (!timeout) context = args = null;
	  };

	  var throttled = function () {
	    var _now = now();

	    if (!previous && options.leading === false) previous = _now;
	    var remaining = wait - (_now - previous);
	    context = this;
	    args = arguments;

	    if (remaining <= 0 || remaining > wait) {
	      if (timeout) {
	        clearTimeout(timeout);
	        timeout = null;
	      }

	      previous = _now;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    } else if (!timeout && options.trailing !== false) {
	      timeout = setTimeout(later, remaining);
	    }

	    return result;
	  };

	  throttled.cancel = function () {
	    clearTimeout(timeout);
	    previous = 0;
	    timeout = context = args = null;
	  };

	  return throttled;
	} // Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.

	function debounce(func, wait, immediate) {
	  var timeout, result;

	  var later = function (context, args) {
	    timeout = null;
	    if (args) result = func.apply(context, args);
	  };

	  var debounced = restArguments(function (args) {
	    if (timeout) clearTimeout(timeout);

	    if (immediate) {
	      var callNow = !timeout;
	      timeout = setTimeout(later, wait);
	      if (callNow) result = func.apply(this, args);
	    } else {
	      timeout = delay(later, wait, this, args);
	    }

	    return result;
	  });

	  debounced.cancel = function () {
	    clearTimeout(timeout);
	    timeout = null;
	  };

	  return debounced;
	} // Returns the first function passed as an argument to the second,
	// allowing you to adjust arguments, run code before and after, and
	// conditionally execute the original function.

	function wrap(func, wrapper) {
	  return partial(wrapper, func);
	} // Returns a negated version of the passed-in predicate.

	function negate(predicate) {
	  return function () {
	    return !predicate.apply(this, arguments);
	  };
	} // Returns a function that is the composition of a list of functions, each
	// consuming the return value of the function that follows.

	function compose() {
	  var args = arguments;
	  var start = args.length - 1;
	  return function () {
	    var i = start;
	    var result = args[start].apply(this, arguments);

	    while (i--) result = args[i].call(this, result);

	    return result;
	  };
	} // Returns a function that will only be executed on and after the Nth call.

	function after(times, func) {
	  return function () {
	    if (--times < 1) {
	      return func.apply(this, arguments);
	    }
	  };
	} // Returns a function that will only be executed up to (but not including) the Nth call.

	function before(times, func) {
	  var memo;
	  return function () {
	    if (--times > 0) {
	      memo = func.apply(this, arguments);
	    }

	    if (times <= 1) func = null;
	    return memo;
	  };
	} // Returns a function that will be executed at most one time, no matter how
	// often you call it. Useful for lazy initialization.

	var once = partial(before, 2); // Object Functions
	// ----------------
	// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.

	var hasEnumBug = !{
	  toString: null
	}.propertyIsEnumerable('toString');
	var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	function collectNonEnumProps(obj, _keys) {
	  var nonEnumIdx = nonEnumerableProps.length;
	  var constructor = obj.constructor;
	  var proto = isFunction(constructor) && constructor.prototype || ObjProto; // Constructor is a special case.

	  var prop = 'constructor';
	  if (_has(obj, prop) && !contains(_keys, prop)) _keys.push(prop);

	  while (nonEnumIdx--) {
	    prop = nonEnumerableProps[nonEnumIdx];

	    if (prop in obj && obj[prop] !== proto[prop] && !contains(_keys, prop)) {
	      _keys.push(prop);
	    }
	  }
	} // Retrieve the names of an object's own properties.
	// Delegates to **ECMAScript 5**'s native `Object.keys`.


	function keys$1(obj) {
	  if (!isObject$1(obj)) return [];
	  if (nativeKeys) return nativeKeys(obj);
	  var _keys = [];

	  for (var key in obj) if (_has(obj, key)) _keys.push(key); // Ahem, IE < 9.


	  if (hasEnumBug) collectNonEnumProps(obj, _keys);
	  return _keys;
	} // Retrieve all the property names of an object.

	function allKeys(obj) {
	  if (!isObject$1(obj)) return [];
	  var _keys = [];

	  for (var key in obj) _keys.push(key); // Ahem, IE < 9.


	  if (hasEnumBug) collectNonEnumProps(obj, _keys);
	  return _keys;
	} // Retrieve the values of an object's properties.

	function values(obj) {
	  var _keys = keys$1(obj);

	  var length = _keys.length;
	  var values = Array(length);

	  for (var i = 0; i < length; i++) {
	    values[i] = obj[_keys[i]];
	  }

	  return values;
	} // Returns the results of applying the iteratee to each element of the object.
	// In contrast to map it returns an object.

	function mapObject(obj, iteratee, context) {
	  iteratee = cb(iteratee, context);

	  var _keys = keys$1(obj),
	      length = _keys.length,
	      results = {};

	  for (var index = 0; index < length; index++) {
	    var currentKey = _keys[index];
	    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	  }

	  return results;
	} // Convert an object into a list of `[key, value]` pairs.
	// The opposite of object.

	function pairs(obj) {
	  var _keys = keys$1(obj);

	  var length = _keys.length;
	  var pairs = Array(length);

	  for (var i = 0; i < length; i++) {
	    pairs[i] = [_keys[i], obj[_keys[i]]];
	  }

	  return pairs;
	} // Invert the keys and values of an object. The values must be serializable.

	function invert(obj) {
	  var result = {};

	  var _keys = keys$1(obj);

	  for (var i = 0, length = _keys.length; i < length; i++) {
	    result[obj[_keys[i]]] = _keys[i];
	  }

	  return result;
	} // Return a sorted list of the function names available on the object.

	function functions(obj) {
	  var names = [];

	  for (var key in obj) {
	    if (isFunction(obj[key])) names.push(key);
	  }

	  return names.sort();
	}

	function createAssigner(keysFunc, defaults) {
	  return function (obj) {
	    var length = arguments.length;
	    if (defaults) obj = Object(obj);
	    if (length < 2 || obj == null) return obj;

	    for (var index = 1; index < length; index++) {
	      var source = arguments[index],
	          _keys = keysFunc(source),
	          l = _keys.length;

	      for (var i = 0; i < l; i++) {
	        var key = _keys[i];
	        if (!defaults || obj[key] === void 0) obj[key] = source[key];
	      }
	    }

	    return obj;
	  };
	} // Extend a given object with all the properties in passed-in object(s).


	var extend = createAssigner(allKeys); // Assigns a given object with all the own properties in the passed-in object(s).
	// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

	var extendOwn = createAssigner(keys$1);

	function findKey(obj, predicate, context) {
	  predicate = cb(predicate, context);

	  var _keys = keys$1(obj),
	      key;

	  for (var i = 0, length = _keys.length; i < length; i++) {
	    key = _keys[i];
	    if (predicate(obj[key], key, obj)) return key;
	  }
	} // Internal pick helper function to determine if `obj` has key `key`.

	function keyInObj(value, key, obj) {
	  return key in obj;
	} // Return a copy of the object only containing the whitelisted properties.


	var pick = restArguments(function (obj, _keys) {
	  var result = {},
	      iteratee = _keys[0];
	  if (obj == null) return result;

	  if (isFunction(iteratee)) {
	    if (_keys.length > 1) iteratee = optimizeCb(iteratee, _keys[1]);
	    _keys = allKeys(obj);
	  } else {
	    iteratee = keyInObj;
	    _keys = _flatten(_keys, false, false);
	    obj = Object(obj);
	  }

	  for (var i = 0, length = _keys.length; i < length; i++) {
	    var key = _keys[i];
	    var value = obj[key];
	    if (iteratee(value, key, obj)) result[key] = value;
	  }

	  return result;
	}); // Return a copy of the object without the blacklisted properties.

	var omit = restArguments(function (obj, _keys) {
	  var iteratee = _keys[0],
	      context;

	  if (isFunction(iteratee)) {
	    iteratee = negate(iteratee);
	    if (_keys.length > 1) context = _keys[1];
	  } else {
	    _keys = map(_flatten(_keys, false, false), String);

	    iteratee = function (value, key) {
	      return !contains(_keys, key);
	    };
	  }

	  return pick(obj, iteratee, context);
	}); // Fill in a given object with default properties.

	var defaults = createAssigner(allKeys, true); // Creates an object that inherits from the given prototype object.
	// If additional properties are provided then they will be added to the
	// created object.

	function create(prototype, props) {
	  var result = baseCreate(prototype);
	  if (props) extendOwn(result, props);
	  return result;
	} // Create a (shallow-cloned) duplicate of an object.

	function clone(obj) {
	  if (!isObject$1(obj)) return obj;
	  return isArray$1(obj) ? obj.slice() : extend({}, obj);
	} // Invokes interceptor with the obj, and then returns obj.
	// The primary purpose of this method is to "tap into" a method chain, in
	// order to perform operations on intermediate results within the chain.

	function tap(obj, interceptor) {
	  interceptor(obj);
	  return obj;
	} // Returns whether an object has a given set of `key:value` pairs.

	function isMatch(object, attrs) {
	  var _keys = keys$1(attrs),
	      length = _keys.length;

	  if (object == null) return !length;
	  var obj = Object(object);

	  for (var i = 0; i < length; i++) {
	    var key = _keys[i];
	    if (attrs[key] !== obj[key] || !(key in obj)) return false;
	  }

	  return true;
	} // Internal recursive comparison function for `isEqual`.

	function eq(a, b, aStack, bStack) {
	  // Identical objects are equal. `0 === -0`, but they aren't identical.
	  // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
	  if (a === b) return a !== 0 || 1 / a === 1 / b; // `null` or `undefined` only equal to itself (strict comparison).

	  if (a == null || b == null) return false; // `NaN`s are equivalent, but non-reflexive.

	  if (a !== a) return b !== b; // Exhaust primitive checks

	  var type = typeof a;
	  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
	  return deepEq(a, b, aStack, bStack);
	} // Internal recursive comparison function for `isEqual`.


	function deepEq(a, b, aStack, bStack) {
	  // Unwrap any wrapped objects.
	  if (a instanceof _) a = a._wrapped;
	  if (b instanceof _) b = b._wrapped; // Compare `[[Class]]` names.

	  var className = toString$1.call(a);
	  if (className !== toString$1.call(b)) return false;

	  switch (className) {
	    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	    case '[object RegExp]': // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')

	    case '[object String]':
	      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	      // equivalent to `new String("5")`.
	      return '' + a === '' + b;

	    case '[object Number]':
	      // `NaN`s are equivalent, but non-reflexive.
	      // Object(NaN) is equivalent to NaN.
	      if (+a !== +a) return +b !== +b; // An `egal` comparison is performed for other numeric values.

	      return +a === 0 ? 1 / +a === 1 / b : +a === +b;

	    case '[object Date]':
	    case '[object Boolean]':
	      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	      // millisecond representations. Note that invalid dates with millisecond representations
	      // of `NaN` are not equivalent.
	      return +a === +b;

	    case '[object Symbol]':
	      return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
	  }

	  var areArrays = className === '[object Array]';

	  if (!areArrays) {
	    if (typeof a != 'object' || typeof b != 'object') return false; // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	    // from different frames are.

	    var aCtor = a.constructor,
	        bCtor = b.constructor;

	    if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
	      return false;
	    }
	  } // Assume equality for cyclic structures. The algorithm for detecting cyclic
	  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	  // Initializing stack of traversed objects.
	  // It's done here since we only need them for objects and arrays comparison.


	  aStack = aStack || [];
	  bStack = bStack || [];
	  var length = aStack.length;

	  while (length--) {
	    // Linear search. Performance is inversely proportional to the number of
	    // unique nested structures.
	    if (aStack[length] === a) return bStack[length] === b;
	  } // Add the first object to the stack of traversed objects.


	  aStack.push(a);
	  bStack.push(b); // Recursively compare objects and arrays.

	  if (areArrays) {
	    // Compare array lengths to determine if a deep comparison is necessary.
	    length = a.length;
	    if (length !== b.length) return false; // Deep compare the contents, ignoring non-numeric properties.

	    while (length--) {
	      if (!eq(a[length], b[length], aStack, bStack)) return false;
	    }
	  } else {
	    // Deep compare objects.
	    var _keys = keys$1(a),
	        key;

	    length = _keys.length; // Ensure that both objects contain the same number of properties before comparing deep equality.

	    if (keys$1(b).length !== length) return false;

	    while (length--) {
	      // Deep compare each member
	      key = _keys[length];
	      if (!(_has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	    }
	  } // Remove the first object from the stack of traversed objects.


	  aStack.pop();
	  bStack.pop();
	  return true;
	} // Perform a deep comparison to check if two objects are equal.


	function isEqual(a, b) {
	  return eq(a, b);
	} // Is a given array, string, or object empty?
	// An "empty" object has no enumerable own-properties.

	function isEmpty(obj) {
	  if (obj == null) return true;
	  if (isArrayLike(obj) && (isArray$1(obj) || isString(obj) || isArguments(obj))) return obj.length === 0;
	  return keys$1(obj).length === 0;
	} // Is a given value a DOM element?

	function isElement(obj) {
	  return !!(obj && obj.nodeType === 1);
	} // Internal function for creating a toString-based type tester.

	function tagTester(name) {
	  return function (obj) {
	    return toString$1.call(obj) === '[object ' + name + ']';
	  };
	} // Is a given value an array?
	// Delegates to ECMA5's native Array.isArray


	var isArray$1 = nativeIsArray || tagTester('Array'); // Is a given variable an object?

	function isObject$1(obj) {
	  var type = typeof obj;
	  return type === 'function' || type === 'object' && !!obj;
	} // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.

	var isArguments = tagTester('Arguments');
	var isFunction = tagTester('Function');
	var isString = tagTester('String');
	var isNumber = tagTester('Number');
	var isDate = tagTester('Date');
	var isRegExp = tagTester('RegExp');
	var isError = tagTester('Error');
	var isSymbol = tagTester('Symbol');
	var isMap = tagTester('Map');
	var isWeakMap = tagTester('WeakMap');
	var isSet = tagTester('Set');
	var isWeakSet = tagTester('WeakSet'); // Define a fallback version of the method in browsers (ahem, IE < 9), where
	// there isn't any inspectable "Arguments" type.

	(function () {
	  if (!isArguments(arguments)) {
	    isArguments = function (obj) {
	      return _has(obj, 'callee');
	    };
	  }
	})(); // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	// IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).


	var nodelist = root.document && root.document.childNodes;

	if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
	  isFunction = function (obj) {
	    return typeof obj == 'function' || false;
	  };
	} // Is a given object a finite number?


	function isFinite(obj) {
	  return !isSymbol(obj) && _isFinite(obj) && !_isNaN(parseFloat(obj));
	} // Is the given value `NaN`?

	function isNaN$1(obj) {
	  return isNumber(obj) && _isNaN(obj);
	} // Is a given value a boolean?

	function isBoolean(obj) {
	  return obj === true || obj === false || toString$1.call(obj) === '[object Boolean]';
	} // Is a given value equal to null?

	function isNull(obj) {
	  return obj === null;
	} // Is a given variable undefined?

	function isUndefined(obj) {
	  return obj === void 0;
	} // Shortcut function for checking if an object has a given property directly
	// on itself (in other words, not on a prototype).

	function has$2(obj, path) {
	  if (!isArray$1(path)) {
	    return _has(obj, path);
	  }

	  var length = path.length;

	  for (var i = 0; i < length; i++) {
	    var key = path[i];

	    if (obj == null || !hasOwnProperty$1.call(obj, key)) {
	      return false;
	    }

	    obj = obj[key];
	  }

	  return !!length;
	} // Utility Functions
	// -----------------
	// Keep the identity function around for default iteratees.

	function identity(value) {
	  return value;
	} // Predicate-generating functions. Often useful outside of Underscore.

	function constant(value) {
	  return function () {
	    return value;
	  };
	}
	function noop() {} // Creates a function that, when passed an object, will traverse that object’s
	// properties down the given `path`, specified as an array of keys or indexes.

	function property(path) {
	  if (!isArray$1(path)) {
	    return shallowProperty(path);
	  }

	  return function (obj) {
	    return deepGet(obj, path);
	  };
	} // Generates a function for a given object that returns a given property.

	function propertyOf(obj) {
	  if (obj == null) {
	    return function () {};
	  }

	  return function (path) {
	    return !isArray$1(path) ? obj[path] : deepGet(obj, path);
	  };
	} // Returns a predicate for checking whether an object has a given set of
	// `key:value` pairs.

	function matcher(attrs) {
	  attrs = extendOwn({}, attrs);
	  return function (obj) {
	    return isMatch(obj, attrs);
	  };
	}

	function times(n, iteratee, context) {
	  var accum = Array(Math.max(0, n));
	  iteratee = optimizeCb(iteratee, context, 1);

	  for (var i = 0; i < n; i++) accum[i] = iteratee(i);

	  return accum;
	} // Return a random integer between min and max (inclusive).

	function random(min, max) {
	  if (max == null) {
	    max = min;
	    min = 0;
	  }

	  return min + Math.floor(Math.random() * (max - min + 1));
	} // A (possibly faster) way to get the current timestamp as an integer.

	var now = Date.now || function () {
	  return new Date().getTime();
	}; // List of HTML entities for escaping.

	var escapeMap = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#x27;',
	  '`': '&#x60;'
	};
	var unescapeMap = invert(escapeMap); // Functions for escaping and unescaping strings to/from HTML interpolation.

	function createEscaper(map) {
	  var escaper = function (match) {
	    return map[match];
	  }; // Regexes for identifying a key that needs to be escaped.


	  var source = '(?:' + keys$1(map).join('|') + ')';
	  var testRegexp = RegExp(source);
	  var replaceRegexp = RegExp(source, 'g');
	  return function (string) {
	    string = string == null ? '' : '' + string;
	    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	  };
	}

	var escape = createEscaper(escapeMap);
	var unescape = createEscaper(unescapeMap); // Traverses the children of `obj` along `path`. If a child is a function, it
	// is invoked with its parent as context. Returns the value of the final
	// child, or `fallback` if any child is undefined.

	function result(obj, path, fallback) {
	  if (!isArray$1(path)) path = [path];
	  var length = path.length;

	  if (!length) {
	    return isFunction(fallback) ? fallback.call(obj) : fallback;
	  }

	  for (var i = 0; i < length; i++) {
	    var prop = obj == null ? void 0 : obj[path[i]];

	    if (prop === void 0) {
	      prop = fallback;
	      i = length; // Ensure we don't continue iterating.
	    }

	    obj = isFunction(prop) ? prop.call(obj) : prop;
	  }

	  return obj;
	} // Generate a unique integer id (unique within the entire client session).
	// Useful for temporary DOM ids.

	var idCounter = 0;
	function uniqueId(prefix) {
	  var id = ++idCounter + '';
	  return prefix ? prefix + id : id;
	} // By default, Underscore uses ERB-style template delimiters, change the
	// following template settings to use alternative delimiters.

	var templateSettings = _.templateSettings = {
	  evaluate: /<%([\s\S]+?)%>/g,
	  interpolate: /<%=([\s\S]+?)%>/g,
	  escape: /<%-([\s\S]+?)%>/g
	}; // When customizing `templateSettings`, if you don't want to define an
	// interpolation, evaluation or escaping regex, we need one that is
	// guaranteed not to match.

	var noMatch = /(.)^/; // Certain characters need to be escaped so that they can be put into a
	// string literal.

	var escapes = {
	  "'": "'",
	  '\\': '\\',
	  '\r': 'r',
	  '\n': 'n',
	  '\u2028': 'u2028',
	  '\u2029': 'u2029'
	};
	var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

	var escapeChar = function (match) {
	  return '\\' + escapes[match];
	}; // JavaScript micro-templating, similar to John Resig's implementation.
	// Underscore templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.
	// NB: `oldSettings` only exists for backwards compatibility.


	function template(text, settings, oldSettings) {
	  if (!settings && oldSettings) settings = oldSettings;
	  settings = defaults({}, settings, _.templateSettings); // Combine delimiters into one regular expression via alternation.

	  var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g'); // Compile the template source, escaping string literals appropriately.

	  var index = 0;
	  var source = "__p+='";
	  text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
	    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
	    index = offset + match.length;

	    if (escape) {
	      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	    } else if (interpolate) {
	      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	    } else if (evaluate) {
	      source += "';\n" + evaluate + "\n__p+='";
	    } // Adobe VMs need the match returned to produce the correct offset.


	    return match;
	  });
	  source += "';\n"; // If a variable is not specified, place data values in local scope.

	  if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
	  var render;

	  try {
	    render = new Function(settings.variable || 'obj', '_', source);
	  } catch (e) {
	    e.source = source;
	    throw e;
	  }

	  var template = function (data) {
	    return render.call(this, data, _);
	  }; // Provide the compiled source as a convenience for precompilation.


	  var argument = settings.variable || 'obj';
	  template.source = 'function(' + argument + '){\n' + source + '}';
	  return template;
	} // Add a "chain" function. Start chaining a wrapped Underscore object.

	function chain(obj) {
	  var instance = _(obj);

	  instance._chain = true;
	  return instance;
	} // OOP
	// ---------------
	// If Underscore is called as a function, it returns a wrapped object that
	// can be used OO-style. This wrapper holds altered versions of all the
	// underscore functions. Wrapped objects may be chained.
	// Helper function to continue chaining intermediate results.

	function chainResult(instance, obj) {
	  return instance._chain ? _(obj).chain() : obj;
	} // Add your own custom functions to the Underscore object.


	function mixin(obj) {
	  each(functions(obj), function (name) {
	    var func = _[name] = obj[name];

	    _.prototype[name] = function () {
	      var args = [this._wrapped];
	      push$1.apply(args, arguments);
	      return chainResult(this, func.apply(_, args));
	    };
	  });
	  return _;
	} // Add all mutator Array functions to the wrapper.

	each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
	  var method = ArrayProto[name];

	  _.prototype[name] = function () {
	    var obj = this._wrapped;
	    method.apply(obj, arguments);
	    if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	    return chainResult(this, obj);
	  };
	}); // Add all accessor Array functions to the wrapper.

	each(['concat', 'join', 'slice'], function (name) {
	  var method = ArrayProto[name];

	  _.prototype[name] = function () {
	    return chainResult(this, method.apply(this._wrapped, arguments));
	  };
	}); // Extracts the result from a wrapped and chained object.

	_.prototype.value = function () {
	  return this._wrapped;
	}; // Provide unwrapping proxy for some methods used in engine operations
	// such as arithmetic and JSON stringification.


	_.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	_.prototype.toString = function () {
	  return String(this._wrapped);
	};

	var allExports = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _,
		VERSION: VERSION,
		iteratee: iteratee,
		restArguments: restArguments,
		each: each,
		forEach: each,
		map: map,
		collect: map,
		reduce: reduce,
		foldl: reduce,
		inject: reduce,
		reduceRight: reduceRight,
		foldr: reduceRight,
		find: find,
		detect: find,
		filter: filter,
		select: filter,
		reject: reject,
		every: every,
		all: every,
		some: some,
		any: some,
		contains: contains,
		includes: contains,
		include: contains,
		invoke: invoke,
		pluck: pluck,
		where: where,
		findWhere: findWhere,
		max: max$2,
		min: min$3,
		shuffle: shuffle,
		sample: sample,
		sortBy: sortBy,
		groupBy: groupBy,
		indexBy: indexBy,
		countBy: countBy,
		toArray: toArray,
		size: size,
		partition: partition,
		first: first,
		head: first,
		take: first,
		initial: initial,
		last: last,
		rest: rest,
		tail: rest,
		drop: rest,
		compact: compact,
		flatten: flatten,
		without: without,
		uniq: uniq,
		unique: uniq,
		union: union,
		intersection: intersection,
		difference: difference,
		unzip: unzip,
		zip: zip,
		object: object,
		findIndex: findIndex,
		findLastIndex: findLastIndex,
		sortedIndex: sortedIndex,
		indexOf: indexOf$1,
		lastIndexOf: lastIndexOf,
		range: range,
		chunk: chunk,
		bind: bind,
		partial: partial,
		bindAll: bindAll,
		memoize: memoize,
		delay: delay,
		defer: defer,
		throttle: throttle,
		debounce: debounce,
		wrap: wrap,
		negate: negate,
		compose: compose,
		after: after,
		before: before,
		once: once,
		keys: keys$1,
		allKeys: allKeys,
		values: values,
		mapObject: mapObject,
		pairs: pairs,
		invert: invert,
		functions: functions,
		methods: functions,
		extend: extend,
		extendOwn: extendOwn,
		assign: extendOwn,
		findKey: findKey,
		pick: pick,
		omit: omit,
		defaults: defaults,
		create: create,
		clone: clone,
		tap: tap,
		isMatch: isMatch,
		isEqual: isEqual,
		isEmpty: isEmpty,
		isElement: isElement,
		isArray: isArray$1,
		isObject: isObject$1,
		get isArguments () { return isArguments; },
		get isFunction () { return isFunction; },
		isString: isString,
		isNumber: isNumber,
		isDate: isDate,
		isRegExp: isRegExp,
		isError: isError,
		isSymbol: isSymbol,
		isMap: isMap,
		isWeakMap: isWeakMap,
		isSet: isSet,
		isWeakSet: isWeakSet,
		isFinite: isFinite,
		isNaN: isNaN$1,
		isBoolean: isBoolean,
		isNull: isNull,
		isUndefined: isUndefined,
		has: has$2,
		identity: identity,
		constant: constant,
		noop: noop,
		property: property,
		propertyOf: propertyOf,
		matcher: matcher,
		matches: matcher,
		times: times,
		random: random,
		now: now,
		escape: escape,
		unescape: unescape,
		result: result,
		uniqueId: uniqueId,
		templateSettings: templateSettings,
		template: template,
		chain: chain,
		mixin: mixin
	});

	var _$1 = mixin(allExports); // Legacy Node.js API


	_$1._ = _$1; // Export the Underscore API.

	var hyperscriptAttributeToProperty = attributeToProperty;
	var transform = {
	  'class': 'className',
	  'for': 'htmlFor',
	  'http-equiv': 'httpEquiv'
	};

	function attributeToProperty(h) {
	  return function (tagName, attrs, children) {
	    for (var attr in attrs) {
	      if (attr in transform) {
	        attrs[transform[attr]] = attrs[attr];
	        delete attrs[attr];
	      }
	    }

	    return h(tagName, attrs, children);
	  };
	}

	var VAR = 0,
	    TEXT = 1,
	    OPEN = 2,
	    CLOSE = 3,
	    ATTR = 4;
	var ATTR_KEY = 5,
	    ATTR_KEY_W = 6;
	var ATTR_VALUE_W = 7,
	    ATTR_VALUE = 8;
	var ATTR_VALUE_SQ = 9,
	    ATTR_VALUE_DQ = 10;
	var ATTR_EQ = 11,
	    ATTR_BREAK = 12;
	var COMMENT = 13;

	var hyperx = function (h, opts) {
	  if (!opts) opts = {};

	  var concat = opts.concat || function (a, b) {
	    return String(a) + String(b);
	  };

	  if (opts.attrToProp !== false) {
	    h = hyperscriptAttributeToProperty(h);
	  }

	  return function (strings) {
	    var state = TEXT,
	        reg = '';
	    var arglen = arguments.length;
	    var parts = [];

	    for (var i = 0; i < strings.length; i++) {
	      if (i < arglen - 1) {
	        var arg = arguments[i + 1];
	        var p = parse(strings[i]);
	        var xstate = state;
	        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE;
	        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE;
	        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE;
	        if (xstate === ATTR) xstate = ATTR_KEY;

	        if (xstate === OPEN) {
	          if (reg === '/') {
	            p.push([OPEN, '/', arg]);
	            reg = '';
	          } else {
	            p.push([OPEN, arg]);
	          }
	        } else if (xstate === COMMENT && opts.comments) {
	          reg += String(arg);
	        } else if (xstate !== COMMENT) {
	          p.push([VAR, xstate, arg]);
	        }

	        parts.push.apply(parts, p);
	      } else parts.push.apply(parts, parse(strings[i]));
	    }

	    var tree = [null, {}, []];
	    var stack = [[tree, -1]];

	    for (var i = 0; i < parts.length; i++) {
	      var cur = stack[stack.length - 1][0];
	      var p = parts[i],
	          s = p[0];

	      if (s === OPEN && /^\//.test(p[1])) {
	        var ix = stack[stack.length - 1][1];

	        if (stack.length > 1) {
	          stack.pop();
	          stack[stack.length - 1][0][2][ix] = h(cur[0], cur[1], cur[2].length ? cur[2] : undefined);
	        }
	      } else if (s === OPEN) {
	        var c = [p[1], {}, []];
	        cur[2].push(c);
	        stack.push([c, cur[2].length - 1]);
	      } else if (s === ATTR_KEY || s === VAR && p[1] === ATTR_KEY) {
	        var key = '';
	        var copyKey;

	        for (; i < parts.length; i++) {
	          if (parts[i][0] === ATTR_KEY) {
	            key = concat(key, parts[i][1]);
	          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
	            if (typeof parts[i][2] === 'object' && !key) {
	              for (copyKey in parts[i][2]) {
	                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
	                  cur[1][copyKey] = parts[i][2][copyKey];
	                }
	              }
	            } else {
	              key = concat(key, parts[i][2]);
	            }
	          } else break;
	        }

	        if (parts[i][0] === ATTR_EQ) i++;
	        var j = i;

	        for (; i < parts.length; i++) {
	          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
	            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1]);else parts[i][1] === "" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
	          } else if (parts[i][0] === VAR && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
	            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2]);else parts[i][2] === "" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
	          } else {
	            if (key.length && !cur[1][key] && i === j && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
	              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
	              // empty string is falsy, not well behaved value in browser
	              cur[1][key] = key.toLowerCase();
	            }

	            if (parts[i][0] === CLOSE) {
	              i--;
	            }

	            break;
	          }
	        }
	      } else if (s === ATTR_KEY) {
	        cur[1][p[1]] = true;
	      } else if (s === VAR && p[1] === ATTR_KEY) {
	        cur[1][p[2]] = true;
	      } else if (s === CLOSE) {
	        if (selfClosing(cur[0]) && stack.length) {
	          var ix = stack[stack.length - 1][1];
	          stack.pop();
	          stack[stack.length - 1][0][2][ix] = h(cur[0], cur[1], cur[2].length ? cur[2] : undefined);
	        }
	      } else if (s === VAR && p[1] === TEXT) {
	        if (p[2] === undefined || p[2] === null) p[2] = '';else if (!p[2]) p[2] = concat('', p[2]);

	        if (Array.isArray(p[2][0])) {
	          cur[2].push.apply(cur[2], p[2]);
	        } else {
	          cur[2].push(p[2]);
	        }
	      } else if (s === TEXT) {
	        cur[2].push(p[1]);
	      } else if (s === ATTR_EQ || s === ATTR_BREAK) ; else {
	        throw new Error('unhandled: ' + s);
	      }
	    }

	    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
	      tree[2].shift();
	    }

	    if (tree[2].length > 2 || tree[2].length === 2 && /\S/.test(tree[2][1])) {
	      if (opts.createFragment) return opts.createFragment(tree[2]);
	      throw new Error('multiple root elements must be wrapped in an enclosing tag');
	    }

	    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string' && Array.isArray(tree[2][0][2])) {
	      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2]);
	    }

	    return tree[2][0];

	    function parse(str) {
	      var res = [];
	      if (state === ATTR_VALUE_W) state = ATTR;

	      for (var i = 0; i < str.length; i++) {
	        var c = str.charAt(i);

	        if (state === TEXT && c === '<') {
	          if (reg.length) res.push([TEXT, reg]);
	          reg = '';
	          state = OPEN;
	        } else if (c === '>' && !quot(state) && state !== COMMENT) {
	          if (state === OPEN && reg.length) {
	            res.push([OPEN, reg]);
	          } else if (state === ATTR_KEY) {
	            res.push([ATTR_KEY, reg]);
	          } else if (state === ATTR_VALUE && reg.length) {
	            res.push([ATTR_VALUE, reg]);
	          }

	          res.push([CLOSE]);
	          reg = '';
	          state = TEXT;
	        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
	          if (opts.comments) {
	            res.push([ATTR_VALUE, reg.substr(0, reg.length - 1)]);
	          }

	          reg = '';
	          state = TEXT;
	        } else if (state === OPEN && /^!--$/.test(reg)) {
	          if (opts.comments) {
	            res.push([OPEN, reg], [ATTR_KEY, 'comment'], [ATTR_EQ]);
	          }

	          reg = c;
	          state = COMMENT;
	        } else if (state === TEXT || state === COMMENT) {
	          reg += c;
	        } else if (state === OPEN && c === '/' && reg.length) ; else if (state === OPEN && /\s/.test(c)) {
	          if (reg.length) {
	            res.push([OPEN, reg]);
	          }

	          reg = '';
	          state = ATTR;
	        } else if (state === OPEN) {
	          reg += c;
	        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
	          state = ATTR_KEY;
	          reg = c;
	        } else if (state === ATTR && /\s/.test(c)) {
	          if (reg.length) res.push([ATTR_KEY, reg]);
	          res.push([ATTR_BREAK]);
	        } else if (state === ATTR_KEY && /\s/.test(c)) {
	          res.push([ATTR_KEY, reg]);
	          reg = '';
	          state = ATTR_KEY_W;
	        } else if (state === ATTR_KEY && c === '=') {
	          res.push([ATTR_KEY, reg], [ATTR_EQ]);
	          reg = '';
	          state = ATTR_VALUE_W;
	        } else if (state === ATTR_KEY) {
	          reg += c;
	        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
	          res.push([ATTR_EQ]);
	          state = ATTR_VALUE_W;
	        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
	          res.push([ATTR_BREAK]);

	          if (/[\w-]/.test(c)) {
	            reg += c;
	            state = ATTR_KEY;
	          } else state = ATTR;
	        } else if (state === ATTR_VALUE_W && c === '"') {
	          state = ATTR_VALUE_DQ;
	        } else if (state === ATTR_VALUE_W && c === "'") {
	          state = ATTR_VALUE_SQ;
	        } else if (state === ATTR_VALUE_DQ && c === '"') {
	          res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
	          reg = '';
	          state = ATTR;
	        } else if (state === ATTR_VALUE_SQ && c === "'") {
	          res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
	          reg = '';
	          state = ATTR;
	        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
	          state = ATTR_VALUE;
	          i--;
	        } else if (state === ATTR_VALUE && /\s/.test(c)) {
	          res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
	          reg = '';
	          state = ATTR;
	        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ) {
	          reg += c;
	        }
	      }

	      if (state === TEXT && reg.length) {
	        res.push([TEXT, reg]);
	        reg = '';
	      } else if (state === ATTR_VALUE && reg.length) {
	        res.push([ATTR_VALUE, reg]);
	        reg = '';
	      } else if (state === ATTR_VALUE_DQ && reg.length) {
	        res.push([ATTR_VALUE, reg]);
	        reg = '';
	      } else if (state === ATTR_VALUE_SQ && reg.length) {
	        res.push([ATTR_VALUE, reg]);
	        reg = '';
	      } else if (state === ATTR_KEY) {
	        res.push([ATTR_KEY, reg]);
	        reg = '';
	      }

	      return res;
	    }
	  };

	  function strfn(x) {
	    if (typeof x === 'function') return x;else if (typeof x === 'string') return x;else if (x && typeof x === 'object') return x;else if (x === null || x === undefined) return x;else return concat('', x);
	  }
	};

	function quot(state) {
	  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ;
	}

	var closeRE = RegExp('^(' + ['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', '!--', // SVG TAGS
	'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath', 'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view', 'vkern'].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$');

	function selfClosing(tag) {
	  return closeRE.test(tag);
	}

	var trailingNewlineRegex = /\n[\s]+$/;
	var leadingNewlineRegex = /^\n[\s]+/;
	var trailingSpaceRegex = /[\s]+$/;
	var leadingSpaceRegex = /^[\s]+/;
	var multiSpaceRegex = /[\n\s]+/g;
	var TEXT_TAGS = ['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'];
	var VERBATIM_TAGS = ['code', 'pre', 'textarea'];

	var appendChild = function appendChild(el, childs) {
	  if (!Array.isArray(childs)) return;
	  var nodeName = el.nodeName.toLowerCase();
	  var hadText = false;
	  var value, leader;

	  for (var i = 0, len = childs.length; i < len; i++) {
	    var node = childs[i];

	    if (Array.isArray(node)) {
	      appendChild(el, node);
	      continue;
	    }

	    if (typeof node === 'number' || typeof node === 'boolean' || typeof node === 'function' || node instanceof Date || node instanceof RegExp) {
	      node = node.toString();
	    }

	    var lastChild = el.childNodes[el.childNodes.length - 1]; // Iterate over text nodes

	    if (typeof node === 'string') {
	      hadText = true; // If we already had text, append to the existing text

	      if (lastChild && lastChild.nodeName === '#text') {
	        lastChild.nodeValue += node; // We didn't have a text node yet, create one
	      } else {
	        node = el.ownerDocument.createTextNode(node);
	        el.appendChild(node);
	        lastChild = node;
	      } // If this is the last of the child nodes, make sure we close it out
	      // right


	      if (i === len - 1) {
	        hadText = false; // Trim the child text nodes if the current node isn't a
	        // node where whitespace matters.

	        if (TEXT_TAGS.indexOf(nodeName) === -1 && VERBATIM_TAGS.indexOf(nodeName) === -1) {
	          value = lastChild.nodeValue.replace(leadingNewlineRegex, '').replace(trailingSpaceRegex, '').replace(trailingNewlineRegex, '').replace(multiSpaceRegex, ' ');

	          if (value === '') {
	            el.removeChild(lastChild);
	          } else {
	            lastChild.nodeValue = value;
	          }
	        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
	          // The very first node in the list should not have leading
	          // whitespace. Sibling text nodes should have whitespace if there
	          // was any.
	          leader = i === 0 ? '' : ' ';
	          value = lastChild.nodeValue.replace(leadingNewlineRegex, leader).replace(leadingSpaceRegex, ' ').replace(trailingSpaceRegex, '').replace(trailingNewlineRegex, '').replace(multiSpaceRegex, ' ');
	          lastChild.nodeValue = value;
	        }
	      } // Iterate over DOM nodes

	    } else if (node && node.nodeType) {
	      // If the last node was a text node, make sure it is properly closed out
	      if (hadText) {
	        hadText = false; // Trim the child text nodes if the current node isn't a
	        // text node or a code node

	        if (TEXT_TAGS.indexOf(nodeName) === -1 && VERBATIM_TAGS.indexOf(nodeName) === -1) {
	          value = lastChild.nodeValue.replace(leadingNewlineRegex, '').replace(trailingNewlineRegex, ' ').replace(multiSpaceRegex, ' '); // Remove empty text nodes, append otherwise

	          if (value === '') {
	            el.removeChild(lastChild);
	          } else {
	            lastChild.nodeValue = value;
	          } // Trim the child nodes but preserve the appropriate whitespace

	        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
	          value = lastChild.nodeValue.replace(leadingSpaceRegex, ' ').replace(leadingNewlineRegex, '').replace(trailingNewlineRegex, ' ').replace(multiSpaceRegex, ' ');
	          lastChild.nodeValue = value;
	        }
	      } // Store the last nodename


	      var _nodeName = node.nodeName;
	      if (_nodeName) nodeName = _nodeName.toLowerCase(); // Append the node to the DOM

	      el.appendChild(node);
	    }
	  }
	};

	var svgTags = ['svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use', 'view', 'vkern'];

	var boolProps = ['async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'defaultchecked', 'defer', 'disabled', 'formnovalidate', 'hidden', 'ismap', 'loop', 'multiple', 'muted', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'selected'];

	var directProps = ['indeterminate'];

	var SVGNS = 'http://www.w3.org/2000/svg';
	var XLINKNS = 'http://www.w3.org/1999/xlink';
	var COMMENT_TAG = '!--';

	var dom = function (document) {
	  function nanoHtmlCreateElement(tag, props, children) {
	    var el; // If an svg tag, it needs a namespace

	    if (svgTags.indexOf(tag) !== -1) {
	      props.namespace = SVGNS;
	    } // If we are using a namespace


	    var ns = false;

	    if (props.namespace) {
	      ns = props.namespace;
	      delete props.namespace;
	    } // If we are extending a builtin element


	    var isCustomElement = false;

	    if (props.is) {
	      isCustomElement = props.is;
	      delete props.is;
	    } // Create the element


	    if (ns) {
	      if (isCustomElement) {
	        el = document.createElementNS(ns, tag, {
	          is: isCustomElement
	        });
	      } else {
	        el = document.createElementNS(ns, tag);
	      }
	    } else if (tag === COMMENT_TAG) {
	      return document.createComment(props.comment);
	    } else if (isCustomElement) {
	      el = document.createElement(tag, {
	        is: isCustomElement
	      });
	    } else {
	      el = document.createElement(tag);
	    } // Create the properties


	    for (var p in props) {
	      if (props.hasOwnProperty(p)) {
	        var key = p.toLowerCase();
	        var val = props[p]; // Normalize className

	        if (key === 'classname') {
	          key = 'class';
	          p = 'class';
	        } // The for attribute gets transformed to htmlFor, but we just set as for


	        if (p === 'htmlFor') {
	          p = 'for';
	        } // If a property is boolean, set itself to the key


	        if (boolProps.indexOf(key) !== -1) {
	          if (String(val) === 'true') val = key;else if (String(val) === 'false') continue;
	        } // If a property prefers being set directly vs setAttribute


	        if (key.slice(0, 2) === 'on' || directProps.indexOf(key) !== -1) {
	          el[p] = val;
	        } else {
	          if (ns) {
	            if (p === 'xlink:href') {
	              el.setAttributeNS(XLINKNS, p, val);
	            } else if (/^xmlns($|:)/i.test(p)) ; else {
	              el.setAttributeNS(null, p, val);
	            }
	          } else {
	            el.setAttribute(p, val);
	          }
	        }
	      }
	    }

	    appendChild(el, children);
	    return el;
	  }

	  function createFragment(nodes) {
	    var fragment = document.createDocumentFragment();

	    for (var i = 0; i < nodes.length; i++) {
	      if (nodes[i] == null) continue;

	      if (Array.isArray(nodes[i])) {
	        fragment.appendChild(createFragment(nodes[i]));
	      } else {
	        if (typeof nodes[i] === 'string') nodes[i] = document.createTextNode(nodes[i]);
	        fragment.appendChild(nodes[i]);
	      }
	    }

	    return fragment;
	  }

	  var exports = hyperx(nanoHtmlCreateElement, {
	    comments: true,
	    createFragment: createFragment
	  });
	  exports.default = exports;
	  exports.createComment = nanoHtmlCreateElement;
	  return exports;
	};

	var browser = dom(document);

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var $forEach = arrayIteration.forEach;
	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('forEach'); // `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach

	var arrayForEach = !STRICT_METHOD || !USES_TO_LENGTH$3 ? function forEach(callbackfn
	/* , thisArg */
	) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach


	_export({
	  target: 'Array',
	  proto: true,
	  forced: [].forEach != arrayForEach
	}, {
	  forEach: arrayForEach
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype; // some Chrome versions have non-configurable methods on DOMTokenList

	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	// Copied from https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
	(function (arr) {
	  arr.forEach(function (item) {
	    if (item.hasOwnProperty('remove')) {
	      return;
	    }

	    Object.defineProperty(item, 'remove', {
	      configurable: true,
	      enumerable: true,
	      writable: true,
	      value: function remove() {
	        if (this.parentNode === null) {
	          return;
	        }

	        this.parentNode.removeChild(this);
	      }
	    });
	  });
	})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

	var categories = [{
	  "id": "adoption",
	  "title": "Adoption",
	  "url": "https://www.courts.ca.gov/selfhelp-adoption.htm",
	  "formsUrl": "https://www.courts.ca.gov/1219.htm",
	  "query": "adoption"
	}, {
	  "id": "appeals",
	  "title": "Appeals",
	  "url": "https://www.courts.ca.gov/selfhelp-appeals.htm",
	  "formsUrl": "https://www.courts.ca.gov/8545.htm",
	  "query": "appeals"
	}, {
	  "id": "custody",
	  "title": "Child Custody and Visitation",
	  "url": "https://www.courts.ca.gov/selfhelp-custody.htm",
	  "formsUrl": "https://www.courts.ca.gov/1192.htm",
	  "query": "custody"
	}, {
	  "id": "child-support",
	  "title": "Child Support",
	  "url": "https://www.courts.ca.gov/selfhelp-support.htm",
	  "formsUrl": "https://www.courts.ca.gov/1199.htm",
	  "query": "child support"
	}, {
	  "id": "civil",
	  "title": "Civil",
	  "url": "https://www.courts.ca.gov/1061.htm",
	  "query": "civil"
	}, {
	  "id": "civil-harassment",
	  "title": "Civil Harassment",
	  "url": "https://www.courts.ca.gov/1044.htm",
	  "formsUrl": "https://www.courts.ca.gov/1281.htm",
	  "query": "civil harassment"
	}, {
	  "id": "cleaning-criminal-record",
	  "title": "Cleaning Criminal Record",
	  "url": "https://www.courts.ca.gov/1070.htm",
	  "formsUrl": "https://www.courts.ca.gov/1330.htm",
	  "query": "cleaning criminal record"
	}, {
	  "id": "conservatorship",
	  "title": "Conservatorship",
	  "url": "https://www.courts.ca.gov/selfhelp-conservatorship.htm",
	  "formsUrl": "https://www.courts.ca.gov/1302.htm",
	  "query": "conservatorship"
	}, {
	  "id": "criminal",
	  "title": "Criminal",
	  "url": "https://www.courts.ca.gov/selfhelp-criminallaw.htm",
	  "query": "criminal",
	  "hidden": true
	}, {
	  "id": "debt-collection",
	  "title": "Debt Collection",
	  "url": "https://www.courts.ca.gov/selfhelp-problemswithmoney.htm",
	  "query": "debt collection",
	  "hidden": true
	}, {
	  "id": "discovery-and-subpoenas",
	  "title": "Discovery and Subpoenas",
	  "url": "https://www.courts.ca.gov/1093.htm",
	  "query": "discovery and subpoenas"
	}, {
	  "id": "divorce",
	  "title": "Divorce",
	  "url": "https://www.courts.ca.gov/selfhelp-divorce.htm",
	  "formsUrl": "https://www.courts.ca.gov/8218.htm",
	  "query": "divorce"
	}, {
	  "id": "domestic-violence",
	  "title": "Domestic Violence",
	  "url": "https://www.courts.ca.gov/selfhelp-domesticviolence.htm",
	  "formsUrl": "https://www.courts.ca.gov/1271.htm",
	  "query": "domestic violence"
	}, {
	  "id": "elder-abuse",
	  "title": "Elder Abuse",
	  "url": "https://www.courts.ca.gov/1058.htm",
	  "formsUrl": "https://www.courts.ca.gov/1298.htm",
	  "query": "elder abuse"
	}, {
	  "id": "electronic-filing-and-service",
	  "title": "Electronic Filing",
	  "query": "electronic filing",
	  "hidden": true
	}, {
	  "id": "enforcement-of-judgment",
	  "title": "Enforcement of Judgment",
	  "url": "https://www.courts.ca.gov/1014.htm",
	  "query": "enforcement of judgment"
	}, {
	  "id": "eviction",
	  "title": "Eviction",
	  "url": "https://www.courts.ca.gov/selfhelp-eviction.htm",
	  "query": "eviction"
	}, {
	  "id": "fee-waivers",
	  "title": "Fee Waivers",
	  "url": "https://www.courts.ca.gov/selfhelp-feewaiver.htm",
	  "query": "fee waivers"
	}, {
	  "id": "gender-change",
	  "title": "Gender Change",
	  "url": "https://www.courts.ca.gov/genderchange.htm",
	  "formsUrl": "https://www.courts.ca.gov/11183.htm",
	  "query": "gender change"
	}, {
	  "id": "guardianship",
	  "title": "Guardianship",
	  "url": "https://www.courts.ca.gov/selfhelp-guardianship.htm",
	  "formsUrl": "https://www.courts.ca.gov/1214.htm",
	  "query": "guardianship"
	}, {
	  "id": "gun-violence-prevention",
	  "title": "Gun Violence Prevention",
	  "url": "https://www.courts.ca.gov/33961.htm",
	  "formsUrl": "https://www.courts.ca.gov/33683.htm",
	  "query": "gun violence prevention",
	  "hidden": true
	}, {
	  "id": "juvenile",
	  "title": "Juvenile",
	  "url": "https://www.courts.ca.gov/selfhelp-delinquency.htm",
	  "formsUrl": "https://www.courts.ca.gov/1217.htm",
	  "query": "juvenile"
	}, {
	  "id": "language-access",
	  "title": "Language Access",
	  "url": "https://www.courts.ca.gov/selfhelp-interpreter.htm",
	  "query": "language access"
	}, {
	  "id": "name-change",
	  "title": "Name Change",
	  "url": "https://www.courts.ca.gov/selfhelp-namechange.htm",
	  "formsUrl": "https://www.courts.ca.gov/1053.htm",
	  "query": "name change"
	}, {
	  "id": "parentage",
	  "title": "Parentage",
	  "url": "https://www.courts.ca.gov/selfhelp-parentage.htm",
	  "formsUrl": "https://www.courts.ca.gov/1203.htm",
	  "query": "parentage"
	}, {
	  "id": "probate",
	  "title": "Probate",
	  "url": "https://www.courts.ca.gov/8865.htm",
	  "query": "probate"
	}, {
	  "id": "proof-of-service",
	  "title": "Proof of Service",
	  "url": "https://www.courts.ca.gov/selfhelp-serving.htm",
	  "query": "proof of service"
	}, {
	  "id": "remote-appearance",
	  "title": "Remote Appearance",
	  "query": "remote appearance"
	}, {
	  "id": "small-claims",
	  "title": "Small Claims",
	  "url": "https://www.courts.ca.gov/selfhelp-smallclaims.htm",
	  "formsUrl": "https://www.courts.ca.gov/1017.htm",
	  "query": "small claims"
	}, {
	  "id": "traffic",
	  "title": "Traffic",
	  "url": "https://www.courts.ca.gov/selfhelp-traffic.htm",
	  "formsUrl": "https://www.courts.ca.gov/1056.htm",
	  "query": "traffic"
	}, {
	  "id": "fl-motions-and-attachments",
	  "title": "Family Law - Motions and Attachments",
	  "query": "Family Law - Motions and Attachments",
	  "hidden": true
	}, {
	  "id": "fl-enforcement",
	  "title": "Family Law - Enforcement",
	  "query": "Family Law - Enforcement",
	  "hidden": true
	}, {
	  "id": "fl-interstate-actions",
	  "title": "Family Law - Interstate Actions",
	  "query": "Family Law - Interstate Actions",
	  "hidden": true
	}, {
	  "id": "fl-governmental-child-support",
	  "title": "Family Law - Governmental Child Support",
	  "query": "Family Law - Governmental Child Support",
	  "hidden": true
	}, {
	  "id": "fl-summary-dissolution",
	  "title": "Family Law - Summary Dissolutions",
	  "url": "https://www.courts.ca.gov/selfhelp-summarydissolution.htm",
	  "query": "Family Law - Summary Dissolutions",
	  "hidden": true
	}, {
	  "id": "fl-miscellaneous",
	  "title": "Family Law - Miscellaneous",
	  "query": "Family Law - Miscellaneous",
	  "hidden": true
	}];

	var allFormsPageUrl = '/allformslist.html';
	var legacyDropdownLookupUrl = '';
	var requiredNote = 'Forms marked with the asterisk ("*") are adopted for mandatory use by all courts.';
	var formsAPIUrl = function formsAPIUrl(query) {
	  return "http://jcc.lndo.site/json/jcc-forms?query=".concat(query);
	};

	var previousRequest;

	var _executeQuery = function _executeQuery(query, callback) {
	  var url = formsAPIUrl(query);
	  var newRequest = new XMLHttpRequest();

	  newRequest.onload = function () {
	    var response;

	    try {
	      response = JSON.parse(newRequest.response);
	    } catch (e) {
	      console.error(e);
	      console.error("Could not parse response:", newRequest.response);
	    }

	    callback({
	      query: query,
	      response: response
	    });
	  };

	  newRequest.onerror = function () {
	    console.error('An error occured while fetching forms.');
	  };

	  newRequest.open("GET", url);
	  previousRequest = newRequest;
	  newRequest.send();
	};

	var _fetchForms = function _fetchForms(query, callback, onBeforeQuery) {
	  // Abort previous request--we're about to send a new one
	  if (previousRequest) previousRequest.abort();

	  if (query.length < 2) {
	    callback({
	      query: query,
	      response: null
	    });
	    return;
	  }

	  if (onBeforeQuery) onBeforeQuery();

	  _executeQuery(query, function (_ref) {
	    var query = _ref.query,
	        response = _ref.response;

	    // Push num results to google tag manager data layer
	    if (window.dataLayer && window.dataLayer.push) {
	      window.dataLayer.push({
	        'event': 'searchResults',
	        'numSearchResults': response.length
	      });
	    }

	    callback({
	      query: query,
	      response: response
	    });
	  });
	}; // Wait 200ms after someone is finished typing before trying to hit the API again


	var fetchForms = _$1.debounce(_fetchForms, 200);

	// These functions enable/disable the page body from scrolling
	// when the mobile search overlay is present
	var bodyInitialStyle;
	var freezeBody = function freezeBody() {
	  if (typeof bodyInitialStyle === 'undefined') {
	    bodyInitialStyle = document.body.style.overflow;
	  }

	  document.body.style.overflow = 'hidden';
	};
	var unfreezeBody = function unfreezeBody() {
	  if (typeof bodyInitialStyle === 'undefined') {
	    bodyInitialStyle = document.body.style.overflow;
	  }

	  document.body.style.overflow = bodyInitialStyle;
	};

	function _templateObject3() {
	  var data = _taggedTemplateLiteral(["\n    <div>\n      <div class=\"jcc-forms-filter__category-results\">\n        <div class=\"jcc-forms-filter__category-result-column\">\n          ", "\n        </div>\n        <div class=\"jcc-forms-filter__category-result-column\">\n          ", "\n          ", "\n        </div>\n      </div>\n    </div>\n  "]);

	  _templateObject3 = function _templateObject3() {
	    return data;
	  };

	  return data;
	}

	function _templateObject2() {
	  var data = _taggedTemplateLiteral(["\n    <div class=\"jcc-forms-filter__category-result\">\n      <a href=\"?query=", "\" onclick=", ">", "</a>\n    </div>\n  "]);

	  _templateObject2 = function _templateObject2() {
	    return data;
	  };

	  return data;
	}

	function _templateObject() {
	  var data = _taggedTemplateLiteral(["\n    <div class=\"jcc-forms-filter__category-result\">\n      <a href=\"", "\">Browse all categories</a>\n    </div>\n  "]);

	  _templateObject = function _templateObject() {
	    return data;
	  };

	  return data;
	}
	var CategoryLinks = function CategoryLinks(actions) {
	  var sortedCategories = categories.filter(function (c) {
	    return !c.hidden;
	  }).sort(function (a, b) {
	    return a.title < b.title ? -1 : 1;
	  });
	  var numCategories = sortedCategories.length;

	  {
	    numCategories = sortedCategories.length + 1;
	  }

	  var legacyDropdownLookupLink = browser(_templateObject(), legacyDropdownLookupUrl);

	  var FirstColumn = function FirstColumn() {
	    var firstHalf = sortedCategories.slice(0, Math.ceil(numCategories / 2));
	    return firstHalf.map(CategoryLink);
	  };

	  var SecondColumn = function SecondColumn() {
	    var secondHalf = sortedCategories.slice(Math.ceil(numCategories / 2));
	    return secondHalf.map(CategoryLink);
	  };

	  var CategoryLink = function CategoryLink(category) {
	    return browser(_templateObject2(), category.query, function (e) {
	      return actions.onCategoryClick(e, category);
	    }, category.title);
	  };

	  return browser(_templateObject3(), FirstColumn(), SecondColumn(),  legacyDropdownLookupLink );
	};

	// https://tc39.github.io/ecma262/#sec-object.keys

	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// https://tc39.github.io/ecma262/#sec-object.defineproperties

	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);

	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () {
	  /* empty */
	};

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	}; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak

	  return temp;
	}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	}; // Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug


	var activeXDocument;

	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) {
	    /* ignore */
	  }

	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;

	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];

	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true; // `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create

	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();

	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype; // Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	} // add a key to Array.prototype[@@unscopables]


	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var $find = arrayIteration.find;
	var FIND = 'find';
	var SKIPS_HOLES = true;
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength(FIND); // Shouldn't skip holes

	if (FIND in []) Array(1)[FIND](function () {
	  SKIPS_HOLES = false;
	}); // `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find

	_export({
	  target: 'Array',
	  proto: true,
	  forced: SKIPS_HOLES || !USES_TO_LENGTH$4
	}, {
	  find: function find(callbackfn
	  /* , that = undefined */
	  ) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	}); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables(FIND);

	var iterators = {};

	var correctPrototypeGetter = !fails(function () {
	  function F() {
	    /* empty */
	  }

	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype; // `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof

	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];

	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  }

	  return O instanceof Object ? ObjectPrototype : null;
	};

	var ITERATOR = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () {
	  return this;
	}; // `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object


	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys(); // Safari 8 has buggy iterators w/o `next`

	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

	if ( !has(IteratorPrototype, ITERATOR)) {
	  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var defineProperty$1 = objectDefineProperty.f;
	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$1(it, TO_STRING_TAG, {
	      configurable: true,
	      value: TAG
	    });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

	var returnThis$1 = function () {
	  return this;
	};

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, {
	    next: createPropertyDescriptor(1, next)
	  });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  }

	  return it;
	};

	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.

	/* eslint-disable no-proto */

	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;

	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) {
	    /* empty */
	  }

	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$1 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () {
	  return this;
	};

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];

	    switch (KIND) {
	      case KEYS:
	        return function keys() {
	          return new IteratorConstructor(this, KIND);
	        };

	      case VALUES:
	        return function values() {
	          return new IteratorConstructor(this, KIND);
	        };

	      case ENTRIES:
	        return function entries() {
	          return new IteratorConstructor(this, KIND);
	        };
	    }

	    return function () {
	      return new IteratorConstructor(this);
	    };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$1] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY; // fix native

	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));

	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
	        }
	      } // Set @@toStringTag to native iterators


	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  } // fix Array#{values, @@iterator}.name in V8 / FF


	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;

	    defaultIterator = function values() {
	      return nativeIterator.call(this);
	    };
	  } // define iterator


	  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
	  }

	  iterators[NAME] = defaultIterator; // export additional methods

	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({
	      target: NAME,
	      proto: true,
	      forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME
	    }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(ARRAY_ITERATOR); // `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator

	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated),
	    // target
	    index: 0,
	    // next index
	    kind: kind // kind

	  }); // `%ArrayIteratorPrototype%.next` method
	  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;

	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return {
	      value: undefined,
	      done: true
	    };
	  }

	  if (kind == 'keys') return {
	    value: index,
	    done: false
	  };
	  if (kind == 'values') return {
	    value: target[index],
	    done: false
	  };
	  return {
	    value: [index, target[index]],
	    done: false
	  };
	}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject

	iterators.Arguments = iterators.Array; // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var propertyIsEnumerable = objectPropertyIsEnumerable.f; // `Object.{ entries, values }` methods implementation

	var createMethod$3 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;

	    while (length > i) {
	      key = keys[i++];

	      if (!descriptors || propertyIsEnumerable.call(O, key)) {
	        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }

	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.github.io/ecma262/#sec-object.entries
	  entries: createMethod$3(true),
	  // `Object.values` method
	  // https://tc39.github.io/ecma262/#sec-object.values
	  values: createMethod$3(false)
	};

	var $entries = objectToArray.entries; // `Object.entries` method
	// https://tc39.github.io/ecma262/#sec-object.entries

	_export({
	  target: 'Object',
	  stat: true
	}, {
	  entries: function entries(O) {
	    return $entries(O);
	  }
	});

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype; // check on default Array iterator

	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$2] === it);
	};

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test = {};
	test[TO_STRING_TAG$1] = 'z';
	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag'); // ES3 wrong here

	var CORRECT_ARGUMENTS = classofRaw(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {
	    /* empty */
	  }
	}; // getting tag from ES6+ `Object.prototype.toString`


	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$3] || it['@@iterator'] || iterators[classof(it)];
	};

	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var iterate_1 = createCommonjsModule(function (module) {
	  var Result = function (stopped, result) {
	    this.stopped = stopped;
	    this.result = result;
	  };

	  var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
	    var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
	    var iterator, iterFn, index, length, result, next, step;

	    if (IS_ITERATOR) {
	      iterator = iterable;
	    } else {
	      iterFn = getIteratorMethod(iterable);
	      if (typeof iterFn != 'function') throw TypeError('Target is not iterable'); // optimisation for array iterators

	      if (isArrayIteratorMethod(iterFn)) {
	        for (index = 0, length = toLength(iterable.length); length > index; index++) {
	          result = AS_ENTRIES ? boundFunction(anObject(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
	          if (result && result instanceof Result) return result;
	        }

	        return new Result(false);
	      }

	      iterator = iterFn.call(iterable);
	    }

	    next = iterator.next;

	    while (!(step = next.call(iterator)).done) {
	      result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
	      if (typeof result == 'object' && result && result instanceof Result) return result;
	    }

	    return new Result(false);
	  };

	  iterate.stop = function (result) {
	    return new Result(true, result);
	  };
	});

	// https://github.com/tc39/proposal-object-from-entries

	_export({
	  target: 'Object',
	  stat: true
	}, {
	  fromEntries: function fromEntries(iterable) {
	    var obj = {};
	    iterate_1(iterable, function (k, v) {
	      createProperty(obj, k, v);
	    }, undefined, true);
	    return obj;
	  }
	});

	var FAILS_ON_PRIMITIVES = fails(function () {
	  objectKeys(1);
	}); // `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys

	_export({
	  target: 'Object',
	  stat: true,
	  forced: FAILS_ON_PRIMITIVES
	}, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	function _templateObject4() {
	  var data = _taggedTemplateLiteral(["<li>See <a href=\"", "\">", " forms packets</a></li>"]);

	  _templateObject4 = function _templateObject4() {
	    return data;
	  };

	  return data;
	}

	function _templateObject3$1() {
	  var data = _taggedTemplateLiteral(["\n          <div class=\"usa-alert usa-alert--info usa-alert--slim\">\n            <div class=\"usa-alert__body\">\n              <p class=\"usa-alert__heading jcc-forms-filter__alert-heading\">Looking for info about ", "?</p>\n              <ul class=\"usa-alert__text\">\n                <li>Read the <a href=\"", "\">", " self-help guide</a></li>\n                ", "\n              </ul>\n            </div>\n          </div>"]);

	  _templateObject3$1 = function _templateObject3() {
	    return data;
	  };

	  return data;
	}

	function _templateObject2$1() {
	  var data = _taggedTemplateLiteral(["<li>See <a href=\"", "\">", " forms packets</a></li>"]);

	  _templateObject2$1 = function _templateObject2() {
	    return data;
	  };

	  return data;
	}

	function _templateObject$1() {
	  var data = _taggedTemplateLiteral(["\n      <div class=\"usa-alert usa-alert--info usa-alert--slim\">\n        <div class=\"usa-alert__body\">\n          <p class=\"usa-alert__heading jcc-forms-filter__alert-heading\">Looking for info about ", "?</p>\n          <ul class=\"usa-alert__text\">\n            <li>Read the <a href=\"", "\">", " self-help guide</a></li>\n            ", "\n          </ul>\n        </div>\n      </div>"]);

	  _templateObject$1 = function _templateObject() {
	    return data;
	  };

	  return data;
	}
	var CategoryAlert = function CategoryAlert(actions, _ref) {
	  var query = _ref.query,
	      response = _ref.response;
	  var category = categories.find(function (category) {
	    return category.query.toLowerCase() === query.toLowerCase();
	  });

	  if (category && category.url) {
	    return browser(_templateObject$1(), category.title.toLowerCase(), category.url, category.title, category.formsUrl ? browser(_templateObject2$1(), category.formsUrl, category.title) : '');
	  } else {
	    var categoryLookup = Object.fromEntries(response.map(function (cat) {
	      return [cat.form_category, cat.form_category];
	    }));

	    if (!Object.keys(categoryLookup).length == 0) {
	      var categoriesList = [];

	      var _loop = function _loop() {
	        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
	            key = _Object$entries$_i[0],
	            value = _Object$entries$_i[1];

	        if (!(typeof value === 'undefined')) {
	          var temp_category = categories.find(function (element) {
	            return element.query.toLowerCase() === value.toLowerCase();
	          });

	          if (temp_category && temp_category.url) {
	            categoriesList.push(temp_category);
	          }
	        }
	      };

	      for (var _i = 0, _Object$entries = Object.entries(categoryLookup); _i < _Object$entries.length; _i++) {
	        _loop();
	      }

	      if (categoriesList.length == 1) {
	        return browser(_templateObject3$1(), categoriesList[0].title.toLowerCase(), categoriesList[0].url, categoriesList[0].title, categoriesList[0].formsUrl ? browser(_templateObject4(), categoriesList[0].formsUrl, categoriesList[0].title) : '');
	      } else {
	        return '';
	      }
	    } else {
	      return '';
	    }
	  }
	};

	var languages = {
	  "arabic": "اَلْعَرَبِيَّةُ",
	  "cambodian": "ភាសាខ្មែរ",
	  "chinese_traditional": "漢語",
	  "chinese": "汉语",
	  "farsi": "فارسی",
	  "hmong": "Hmong",
	  "korean": "한국어",
	  "punjabi": "ਪੰਜਾਬੀ",
	  "russian": "русский язык",
	  "spanish": "español",
	  "tagalog": "Tagalog",
	  "vietnamese": "Tiếng Việt"
	};

	function _templateObject6() {
	  var data = _taggedTemplateLiteral(["\n      ", "\n      <div class=\"jcc-forms-filter__form-results\">\n        ", "\n      </div>\n    "]);

	  _templateObject6 = function _templateObject6() {
	    return data;
	  };

	  return data;
	}

	function _templateObject5() {
	  var data = _taggedTemplateLiteral(["\n      ", "\n      <div class=\"jcc-forms-filter__form-results\">\n        ", "\n        <div class=\"jcc-forms-filter__more-results-button-container\">\n          <button class=\"usa-button usa-button--big\" onclick=", ">\n            Show ", " more results\n          </button>\n        </div>\n      </div>\n    "]);

	  _templateObject5 = function _templateObject5() {
	    return data;
	  };

	  return data;
	}

	function _templateObject4$1() {
	  var data = _taggedTemplateLiteral(["<div class=\"jcc-forms-filter__results-header\">Found ", " forms matching \"", "\".<br>", "</div>"]);

	  _templateObject4$1 = function _templateObject4() {
	    return data;
	  };

	  return data;
	}

	function _templateObject3$2() {
	  var data = _taggedTemplateLiteral(["\n      <div class=\"jcc-forms-filter__form-result\">\n        <div class=\"jcc-forms-filter__form-result-content\">\n          <a class=\"jcc-forms-filter__form-number-and-title\" href=\"", "\" target=\"_blank\">\n            <div class=\"form-number\">", "", "</div>\n            <div class=\"form-title\">", "</div>\n            <div class=\"form-languages\">", "</div>\n          </a>\n          <div class=\"jcc-forms-filter__form-result-buttons\">\n            <a class=\"usa-button usa-button--outline jcc-forms-filter__form-guide-button\"\n               href=\"", "\"\n             aria-label=\"See form info for ", " ", "\">See form info</a>\n            <a class=\"usa-button usa-button--outline jcc-forms-filter__download-form-button\"\n               href=\"", "\"\n               aria-label=\"View PDF form for ", " ", "\">View PDF</a>\n          </div>\n        </div>\n      </div>\n    "]);

	  _templateObject3$2 = function _templateObject3() {
	    return data;
	  };

	  return data;
	}

	function _templateObject2$2() {
	  var data = _taggedTemplateLiteral(["<span class=\"radius-pill form-tag\" data-language=\"", "\" aria-label=\"", "\">", "</span>"]);

	  _templateObject2$2 = function _templateObject2() {
	    return data;
	  };

	  return data;
	}

	function _templateObject$2() {
	  var data = _taggedTemplateLiteral(["<i class=\"jcc-icon jcc-icon-sm translate\" aria-label=\"", " is also available in:\"></i>"]);

	  _templateObject$2 = function _templateObject() {
	    return data;
	  };

	  return data;
	}
	var FormResults = function FormResults(actions, _ref) {
	  var query = _ref.query,
	      response = _ref.response,
	      showMoreForms = _ref.showMoreForms;

	  var FormResult = function FormResult(form) {
	    var formInfoUrl = form.alias;
	    var formMandatory = form.field_mandatory == 'True' ? ' *' : '';
	    var formLanguages = Array();

	    if (form.other_languages) {
	      var formLanguagesIcon = browser(_templateObject$2(), form.title);
	      formLanguages.push(formLanguagesIcon);

	      for (var key in form.other_languages) {
	        var language = key;

	        if (languages[key.toLowerCase()] !== undefined) {
	          language = languages[key.toLowerCase()];
	        }

	        var pill = browser(_templateObject2$2(), key, key, language);
	        formLanguages.push(pill);
	      }
	    }

	    return browser(_templateObject3$2(), formInfoUrl, form.id, formMandatory, form.title, formLanguages, formInfoUrl, form.id, form.title, form.url, form.id, form.title);
	  };

	  var ResultsHeader = function ResultsHeader() {
	    return browser(_templateObject4$1(), response.length, query, requiredNote);
	  };

	  var maxResultsOnFirstLoad = 40;

	  if (response.length > maxResultsOnFirstLoad && !showMoreForms) {
	    return browser(_templateObject5(), ResultsHeader(), response.slice(0, maxResultsOnFirstLoad).map(FormResult), function () {
	      return actions.onShowMoreFormsClick();
	    }, response.length - maxResultsOnFirstLoad);
	  } else if (response.length > 0) {
	    return browser(_templateObject6(), ResultsHeader(), response.map(FormResult));
	  } else {
	    return ResultsHeader();
	  }
	};

	function _templateObject3$3() {
	  var data = _taggedTemplateLiteral(["  \n      ", "\n      <div class=\"usa-alert usa-alert--warning usa-alert--slim\">\n          <div class=\"usa-alert__body\">\n              <p class=\"usa-alert__text\">\n                  <strong>Don't fill forms in your browser!</strong>  Use Adobe Acrobat. <a href=\"https://selfhelp.courts.ca.gov/pdf-working-court-forms-1\" target=\"_blank\">See instructions</a>.\n              </p>\n          </div>\n      </div>\n      <div class=\"jcc-forms-filter__results-container\">\n        ", "\n      </div>"]);

	  _templateObject3$3 = function _templateObject3() {
	    return data;
	  };

	  return data;
	}

	function _templateObject2$3() {
	  var data = _taggedTemplateLiteral(["\n      <div class=\"jcc-forms-filter__results-container\">\n        ", "\n      </div>"]);

	  _templateObject2$3 = function _templateObject2() {
	    return data;
	  };

	  return data;
	}

	function _templateObject$3() {
	  var data = _taggedTemplateLiteral(["\n      <div class=\"jcc-forms-filter__results-container\">\n        <div class=\"jcc-forms-filter__loading\">Loading...</div>\n      </div>"]);

	  _templateObject$3 = function _templateObject() {
	    return data;
	  };

	  return data;
	}
	var SearchResults = function SearchResults(actions, _ref) {
	  var query = _ref.query,
	      response = _ref.response,
	      loading = _ref.loading,
	      showMoreForms = _ref.showMoreForms;

	  if (loading) {
	    return browser(_templateObject$3());
	  }

	  if (!response) {
	    return browser(_templateObject2$3(), CategoryLinks(actions));
	  } else {
	    return browser(_templateObject3$3(), CategoryAlert(actions, {
	      query: query,
	      response: response
	    }), FormResults(actions, {
	      query: query,
	      response: response,
	      showMoreForms: showMoreForms
	    }));
	  }
	};

	var legacyFilterMap = [{
	  "key": "AD",
	  "title": "Adoption",
	  "categoryId": "adoption"
	}, {
	  "key": "ADR",
	  "title": "Alternative Dispute Resolution",
	  "prefix": "ADR"
	}, {
	  "key": "APP",
	  "title": "Appellate",
	  "categoryId": "appeals"
	}, {
	  "key": "AT",
	  "title": "Attachment",
	  "prefix": "AT"
	}, {
	  "key": "BMD",
	  "title": "Birth, Marriage, Death",
	  "prefix": "BMD"
	}, {
	  "key": "CLETS",
	  "title": "CLETS",
	  "prefix": "CLETS"
	}, {
	  "key": "CM",
	  "title": "Case Management",
	  "prefix": "CM"
	}, {
	  "key": "CIV",
	  "title": "Civil",
	  "categoryId": "civil"
	}, {
	  "key": "CH",
	  "title": "Civil Harassment Prevention",
	  "categoryId": "civil-harassment"
	}, {
	  "key": "CD",
	  "title": "Claim and Delivery",
	  "prefix": "CD"
	}, {
	  "key": "REC",
	  "title": "Court Records",
	  "prefix": "REC"
	}, {
	  "key": "CR",
	  "title": "Criminal",
	  "categoryId": "criminal"
	}, {
	  "key": "DAL",
	  "title": "Disability Access Litigation",
	  "prefix": "DAL"
	}, {
	  "key": "DSC",
	  "title": "Discovery",
	  "prefix": "DISC"
	}, {
	  "key": "DV",
	  "title": "Domestic Violence Prevention - English",
	  "categoryId": "domestic-violence"
	}, {
	  "key": "DVC",
	  "title": "Domestic Violence Prevention - Chinese",
	  "categoryId": "domestic-violence"
	}, {
	  "key": "DVK",
	  "title": "Domestic Violence Prevention - Korean",
	  "categoryId": "domestic-violence"
	}, {
	  "key": "DVS",
	  "title": "Domestic Violence Prevention - Spanish",
	  "categoryId": "domestic-violence"
	}, {
	  "key": "DVV",
	  "title": "Domestic Violence Prevention - Vietnamese",
	  "categoryId": "domestic-violence"
	}, {
	  "key": "DVO",
	  "title": "Domestic Violence Prevention - Other Languages",
	  "categoryId": "domestic-violence"
	}, {
	  "key": "EA",
	  "title": "Elder or Dependent Adult Abuse Prevention",
	  "categoryId": "elder-abuse"
	}, {
	  "key": "EFS",
	  "title": "Electronic Filing and Service",
	  "prefix": "EFS"
	}, {
	  "key": "EM",
	  "title": "Emancipation of Minor",
	  "prefix": "EM"
	}, {
	  "key": "EPO",
	  "title": "Emergency Protective Order",
	  "prefix": "EPO"
	}, {
	  "key": "EJ",
	  "title": "Enforcement of Judgment",
	  "prefix": "EJ"
	}, {
	  "key": "EJT",
	  "title": "Expedited Jury Trial",
	  "prefix": "EJT"
	}, {
	  "key": "DI",
	  "title": "Family Law - Dissolution, Legal Separation and Annulment FL-100 - 199",
	  "categoryId": "divorce"
	}, {
	  "key": "PA",
	  "title": "Family Law - Parentage Actions FL-200 - 299",
	  "categoryId": "parentage"
	}, {
	  "key": "MO",
	  "title": "Family Law - Motions and Attachments FL-300 - 399",
	  "categoryId": "fl-motions-and-attachments"
	}, {
	  "key": "EN",
	  "title": "Family Law - Enforcement FL-400 - 499",
	  "categoryId": "fl-enforcement"
	}, {
	  "key": "IA",
	  "title": "Family Law - Interstate Actions FL-500 - 599",
	  "categoryId": "fl-interstate-actions"
	}, {
	  "key": "GO",
	  "title": "Family Law - Governmental Child Support FL-600 - 699",
	  "categoryId": "fl-governmental-child-support"
	}, {
	  "key": "SD",
	  "title": "Family Law - Summary Dissolutions FL-800 - 899",
	  "categoryId": "fl-summary-dissolutions"
	}, {
	  "key": "FLM",
	  "title": "Family Law - Miscellaneous FL-900 - 999",
	  "categoryId": "fl-miscellaneous"
	}, {
	  "key": "FW",
	  "title": "Fee Waiver",
	  "prefix": "FW"
	}, {
	  "key": "GC",
	  "title": "Guardianships and Conservatorships",
	  "prefix": "GC"
	}, {
	  "key": "GVP",
	  "title": "Gun Violence Prevention",
	  "categoryId": "gun-violence-prevention"
	}, {
	  "key": "HC",
	  "title": "Habeas Corpus",
	  "prefix": "HC"
	}, {
	  "key": "ID",
	  "title": "Ignition Interlock Device",
	  "prefix": "ID"
	}, {
	  "key": "ICW",
	  "title": "Indian Child Welfare Act",
	  "prefix": "ICWA"
	}, {
	  "key": "IN",
	  "title": "Interpreter",
	  "prefix": "INT"
	}, {
	  "key": "JV",
	  "title": "Juvenile",
	  "categoryId": "juvenile"
	}, {
	  "key": "JUD",
	  "title": "Judgment",
	  "prefix": "JUD"
	}, {
	  "key": "JURY",
	  "title": "Jury Selection",
	  "prefix": "JURY"
	}, {
	  "key": "LA",
	  "title": "Language Access",
	  "prefix": "LA"
	}, {
	  "key": "MD",
	  "title": "Menacing Dog",
	  "prefix": "MD"
	}, {
	  "key": "MIL",
	  "title": "Military Service",
	  "query": "military"
	}, {
	  "key": "MC",
	  "title": "Miscellaneous",
	  "prefix": "MC"
	}, {
	  "key": "NC",
	  "title": "Name Changes",
	  "prefix": "NC"
	}, {
	  "key": "NTA",
	  "title": "Notice to Appear and Related Forms",
	  "prefix": "TR"
	}, {
	  "key": "PLG",
	  "title": "Pleading - General",
	  "prefix": "PLD"
	}, {
	  "key": "CO",
	  "title": "Pleading - Contract",
	  "prefix": "PLD"
	}, {
	  "key": "PL",
	  "title": "Pleading - Personal Injury, Property Damage, Wrongful Death",
	  "prefix": "PLD"
	}, {
	  "key": "UD",
	  "title": "Pleading - Unlawful Detainer",
	  "prefix": "UD"
	}, {
	  "key": "DE",
	  "title": "Probate - Decedents Estates",
	  "prefix": "DE"
	}, {
	  "key": "POS",
	  "title": "Proof of Service",
	  "categoryId": "proof-of-service"
	}, {
	  "key": "RC",
	  "title": "Receiverships",
	  "prefix": "RC"
	}, {
	  "key": "SVP",
	  "title": "School Violence Prevention",
	  "prefix": "SV"
	}, {
	  "key": "SC",
	  "title": "Small Claims",
	  "categoryId": "small-claims"
	}, {
	  "key": "SUB",
	  "title": "Subpoena",
	  "prefix": "SUBP"
	}, {
	  "key": "SUM",
	  "title": "Summons",
	  "prefix": "SUM"
	}, {
	  "key": "TR",
	  "title": "Traffic Infractions",
	  "categoryId": "traffic"
	}, {
	  "key": "TH",
	  "title": "Transitional Housing Misconduct",
	  "prefix": "TH"
	}, {
	  "key": "TC",
	  "title": "Translated forms - Chinese" // not currently supporting this filter

	}, {
	  "key": "TK",
	  "title": "Translated forms - Korean" // not currently supporting this filter

	}, {
	  "key": "TS",
	  "title": "Translated forms - Spanish" // not currently supporting this filter

	}, {
	  "key": "TV",
	  "title": "Translated forms - Vietnamese" // not currently supporting this filter

	}, {
	  "key": "TO",
	  "title": "Translated forms - Other" // not currently supporting this filter

	}, {
	  "key": "UD",
	  "title": "Unlawful Detainer (Landlord/Tenant)",
	  "prefix": "UD"
	}, {
	  "key": "VL",
	  "title": "Vexatious Litigants",
	  "prefix": "VL"
	}, {
	  "key": "WG",
	  "title": "Wage Garnishment",
	  "prefix": "WG"
	}, {
	  "key": "WV",
	  "title": "Workplace Violence Prevention",
	  "prefix": "WV"
	}];
	var getQueryForLegacyFilter = function getQueryForLegacyFilter(filter) {
	  var legacyFilterConfig = legacyFilterMap.find(function (config) {
	    return config.key === filter;
	  });

	  if (legacyFilterConfig) {
	    if (legacyFilterConfig.categoryId) {
	      // This will match a JCC Form Category taxonomy term
	      var matchingCategory = categories.find(function (c) {
	        return c.id === legacyFilterConfig.categoryId;
	      });
	      if (!matchingCategory) return '';
	      return matchingCategory.query;
	    } else {
	      // This will match a JCC Form Prefix taxonomy term
	      return legacyFilterConfig.title;
	    }
	  } else {
	    return '';
	  }
	};

	var accessibleAutocomplete_min = createCommonjsModule(function (module, exports) {
	  (function webpackUniversalModuleDefinition(e, t) {
	     module.exports = t() ;
	  })(window, function () {
	    return function (n) {
	      var r = {};

	      function o(e) {
	        if (r[e]) return r[e].exports;
	        var t = r[e] = {
	          i: e,
	          l: !1,
	          exports: {}
	        };
	        return n[e].call(t.exports, t, t.exports, o), t.l = !0, t.exports;
	      }

	      return o.m = n, o.c = r, o.d = function (e, t, n) {
	        o.o(e, t) || Object.defineProperty(e, t, {
	          enumerable: !0,
	          get: n
	        });
	      }, o.r = function (e) {
	        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
	          value: "Module"
	        }), Object.defineProperty(e, "__esModule", {
	          value: !0
	        });
	      }, o.t = function (t, e) {
	        if (1 & e && (t = o(t)), 8 & e) return t;
	        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
	        var n = Object.create(null);
	        if (o.r(n), Object.defineProperty(n, "default", {
	          enumerable: !0,
	          value: t
	        }), 2 & e && "string" != typeof t) for (var r in t) o.d(n, r, function (e) {
	          return t[e];
	        }.bind(null, r));
	        return n;
	      }, o.n = function (e) {
	        var t = e && e.__esModule ? function () {
	          return e["default"];
	        } : function () {
	          return e;
	        };
	        return o.d(t, "a", t), t;
	      }, o.o = function (e, t) {
	        return Object.prototype.hasOwnProperty.call(e, t);
	      }, o.p = "/", o(o.s = 37);
	    }([function (e, t, n) {
	      var m = n(1),
	          v = n(6),
	          y = n(7),
	          g = n(16),
	          _ = n(18),
	          b = "prototype",
	          w = function (e, t, n) {
	        var r,
	            o,
	            i,
	            u,
	            a = e & w.F,
	            s = e & w.G,
	            l = e & w.S,
	            c = e & w.P,
	            p = e & w.B,
	            f = s ? m : l ? m[t] || (m[t] = {}) : (m[t] || {})[b],
	            d = s ? v : v[t] || (v[t] = {}),
	            h = d[b] || (d[b] = {});

	        for (r in s && (n = t), n) i = ((o = !a && f && f[r] !== undefined) ? f : n)[r], u = p && o ? _(i, m) : c && "function" == typeof i ? _(Function.call, i) : i, f && g(f, r, i, e & w.U), d[r] != i && y(d, r, u), c && h[r] != i && (h[r] = i);
	      };

	      m.core = v, w.F = 1, w.G = 2, w.S = 4, w.P = 8, w.B = 16, w.W = 32, w.U = 64, w.R = 128, e.exports = w;
	    }, function (e, t) {
	      var n = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
	      "number" == typeof __g && (__g = n);
	    }, function (e, t) {
	      e.exports = function (e) {
	        return "object" == typeof e ? null !== e : "function" == typeof e;
	      };
	    }, function (e, t, n) {
	      e.exports = !n(4)(function () {
	        return 7 != Object.defineProperty({}, "a", {
	          get: function () {
	            return 7;
	          }
	        }).a;
	      });
	    }, function (e, t) {
	      e.exports = function (e) {
	        try {
	          return !!e();
	        } catch (t) {
	          return !0;
	        }
	      };
	    }, function (e, t, n) {

	      n.r(t), n.d(t, "h", function () {
	        return r;
	      }), n.d(t, "createElement", function () {
	        return r;
	      }), n.d(t, "cloneElement", function () {
	        return i;
	      }), n.d(t, "Component", function () {
	        return g;
	      }), n.d(t, "render", function () {
	        return _;
	      }), n.d(t, "rerender", function () {
	        return f;
	      }), n.d(t, "options", function () {
	        return E;
	      });

	      var s = function s() {},
	          E = {},
	          l = [],
	          c = [];

	      function r(e, t) {
	        var n,
	            r,
	            o,
	            i,
	            u = c;

	        for (i = arguments.length; 2 < i--;) l.push(arguments[i]);

	        for (t && null != t.children && (l.length || l.push(t.children), delete t.children); l.length;) if ((r = l.pop()) && r.pop !== undefined) for (i = r.length; i--;) l.push(r[i]);else "boolean" == typeof r && (r = null), (o = "function" != typeof e) && (null == r ? r = "" : "number" == typeof r ? r = String(r) : "string" != typeof r && (o = !1)), o && n ? u[u.length - 1] += r : u === c ? u = [r] : u.push(r), n = o;

	        var a = new s();
	        return a.nodeName = e, a.children = u, a.attributes = null == t ? undefined : t, a.key = null == t ? undefined : t.key, E.vnode !== undefined && E.vnode(a), a;
	      }

	      function M(e, t) {
	        for (var n in t) e[n] = t[n];

	        return e;
	      }

	      var o = "function" == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

	      function i(e, t) {
	        return r(e.nodeName, M(M({}, e.attributes), t), 2 < arguments.length ? [].slice.call(arguments, 2) : e.children);
	      }

	      var p = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,
	          u = [];

	      function a(e) {
	        !e._dirty && (e._dirty = !0) && 1 == u.push(e) && (E.debounceRendering || o)(f);
	      }

	      function f() {
	        var e,
	            t = u;

	        for (u = []; e = t.pop();) e._dirty && V(e);
	      }

	      function N(e, t) {
	        return e.normalizedNodeName === t || e.nodeName.toLowerCase() === t.toLowerCase();
	      }

	      function I(e) {
	        var t = M({}, e.attributes);
	        t.children = e.children;
	        var n = e.nodeName.defaultProps;
	        if (n !== undefined) for (var r in n) t[r] === undefined && (t[r] = n[r]);
	        return t;
	      }

	      function k(e) {
	        var t = e.parentNode;
	        t && t.removeChild(e);
	      }

	      function v(e, t, n, r, o) {
	        if ("className" === t && (t = "class"), "key" === t) ;else if ("ref" === t) n && n(null), r && r(e);else if ("class" !== t || o) {
	          if ("style" === t) {
	            if (r && "string" != typeof r && "string" != typeof n || (e.style.cssText = r || ""), r && "object" == typeof r) {
	              if ("string" != typeof n) for (var i in n) i in r || (e.style[i] = "");

	              for (var i in r) e.style[i] = "number" == typeof r[i] && !1 === p.test(i) ? r[i] + "px" : r[i];
	            }
	          } else if ("dangerouslySetInnerHTML" === t) r && (e.innerHTML = r.__html || "");else if ("o" == t[0] && "n" == t[1]) {
	            var u = t !== (t = t.replace(/Capture$/, ""));
	            t = t.toLowerCase().substring(2), r ? n || e.addEventListener(t, d, u) : e.removeEventListener(t, d, u), (e._listeners || (e._listeners = {}))[t] = r;
	          } else if ("list" !== t && "type" !== t && !o && t in e) {
	            try {
	              e[t] = null == r ? "" : r;
	            } catch (s) {}

	            null != r && !1 !== r || "spellcheck" == t || e.removeAttribute(t);
	          } else {
	            var a = o && t !== (t = t.replace(/^xlink:?/, ""));
	            null == r || !1 === r ? a ? e.removeAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase()) : e.removeAttribute(t) : "function" != typeof r && (a ? e.setAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase(), r) : e.setAttribute(t, r));
	          }
	        } else e.className = r || "";
	      }

	      function d(e) {
	        return this._listeners[e.type](E.event && E.event(e) || e);
	      }

	      var A = [],
	          P = 0,
	          j = !1,
	          L = !1;

	      function T() {
	        for (var e; e = A.pop();) E.afterMount && E.afterMount(e), e.componentDidMount && e.componentDidMount();
	      }

	      function B(e, t, n, r, o, i) {
	        P++ || (j = null != o && o.ownerSVGElement !== undefined, L = null != e && !("__preactattr_" in e));
	        var u = D(e, t, n, r, i);
	        return o && u.parentNode !== o && o.appendChild(u), --P || (L = !1, i || T()), u;
	      }

	      function D(e, t, n, r, o) {
	        var i = e,
	            u = j;
	        if (null != t && "boolean" != typeof t || (t = ""), "string" == typeof t || "number" == typeof t) return e && e.splitText !== undefined && e.parentNode && (!e._component || o) ? e.nodeValue != t && (e.nodeValue = t) : (i = document.createTextNode(t), e && (e.parentNode && e.parentNode.replaceChild(i, e), F(e, !0))), i["__preactattr_"] = !0, i;
	        var a = t.nodeName;
	        if ("function" == typeof a) return function d(e, t, n, r) {
	          var o = e && e._component,
	              i = o,
	              u = e,
	              a = o && e._componentConstructor === t.nodeName,
	              s = a,
	              l = I(t);

	          for (; o && !s && (o = o._parentComponent);) s = o.constructor === t.nodeName;

	          o && s && (!r || o._component) ? (U(o, l, 3, n, r), e = o.base) : (i && !a && (q(i), e = u = null), o = R(t.nodeName, l, n), e && !o.nextBase && (o.nextBase = e, u = null), U(o, l, 1, n, r), e = o.base, u && e !== u && (u._component = null, F(u, !1)));
	          return e;
	        }(e, t, n, r);

	        if (j = "svg" === a || "foreignObject" !== a && j, a = String(a), (!e || !N(e, a)) && (i = function h(e, t) {
	          var n = t ? document.createElementNS("http://www.w3.org/2000/svg", e) : document.createElement(e);
	          return n.normalizedNodeName = e, n;
	        }(a, j), e)) {
	          for (; e.firstChild;) i.appendChild(e.firstChild);

	          e.parentNode && e.parentNode.replaceChild(i, e), F(e, !0);
	        }

	        var s = i.firstChild,
	            l = i["__preactattr_"],
	            c = t.children;

	        if (null == l) {
	          l = i["__preactattr_"] = {};

	          for (var p = i.attributes, f = p.length; f--;) l[p[f].name] = p[f].value;
	        }

	        return !L && c && 1 === c.length && "string" == typeof c[0] && null != s && s.splitText !== undefined && null == s.nextSibling ? s.nodeValue != c[0] && (s.nodeValue = c[0]) : (c && c.length || null != s) && function S(e, t, n, r, o) {
	          var i,
	              u,
	              a,
	              s,
	              l,
	              c = e.childNodes,
	              p = [],
	              f = {},
	              d = 0,
	              h = 0,
	              m = c.length,
	              v = 0,
	              y = t ? t.length : 0;
	          if (0 !== m) for (var g = 0; g < m; g++) {
	            var _ = c[g],
	                b = _["__preactattr_"],
	                w = y && b ? _._component ? _._component.__key : b.key : null;
	            null != w ? (d++, f[w] = _) : (b || (_.splitText !== undefined ? !o || _.nodeValue.trim() : o)) && (p[v++] = _);
	          }
	          if (0 !== y) for (var g = 0; g < y; g++) {
	            s = t[g], l = null;
	            var w = s.key;
	            if (null != w) d && f[w] !== undefined && (l = f[w], f[w] = undefined, d--);else if (h < v) for (i = h; i < v; i++) if (p[i] !== undefined && (x = u = p[i], C = o, "string" == typeof (O = s) || "number" == typeof O ? x.splitText !== undefined : "string" == typeof O.nodeName ? !x._componentConstructor && N(x, O.nodeName) : C || x._componentConstructor === O.nodeName)) {
	              l = u, p[i] = undefined, i === v - 1 && v--, i === h && h++;
	              break;
	            }
	            l = D(l, s, n, r), a = c[g], l && l !== e && l !== a && (null == a ? e.appendChild(l) : l === a.nextSibling ? k(a) : e.insertBefore(l, a));
	          }
	          var x, O, C;
	          if (d) for (var g in f) f[g] !== undefined && F(f[g], !1);

	          for (; h <= v;) (l = p[v--]) !== undefined && F(l, !1);
	        }(i, c, n, r, L || null != l.dangerouslySetInnerHTML), function m(e, t, n) {
	          var r;

	          for (r in n) t && null != t[r] || null == n[r] || v(e, r, n[r], n[r] = undefined, j);

	          for (r in t) "children" === r || "innerHTML" === r || r in n && t[r] === ("value" === r || "checked" === r ? e[r] : n[r]) || v(e, r, n[r], n[r] = t[r], j);
	        }(i, t.attributes, l), j = u, i;
	      }

	      function F(e, t) {
	        var n = e._component;
	        n ? q(n) : (null != e["__preactattr_"] && e["__preactattr_"].ref && e["__preactattr_"].ref(null), !1 !== t && null != e["__preactattr_"] || k(e), h(e));
	      }

	      function h(e) {
	        for (e = e.lastChild; e;) {
	          var t = e.previousSibling;
	          F(e, !0), e = t;
	        }
	      }

	      var m = [];

	      function R(e, t, n) {
	        var r,
	            o = m.length;

	        for (e.prototype && e.prototype.render ? (r = new e(t, n), g.call(r, t, n)) : ((r = new g(t, n)).constructor = e, r.render = y); o--;) if (m[o].constructor === e) return r.nextBase = m[o].nextBase, m.splice(o, 1), r;

	        return r;
	      }

	      function y(e, t, n) {
	        return this.constructor(e, n);
	      }

	      function U(e, t, n, r, o) {
	        e._disable || (e._disable = !0, e.__ref = t.ref, e.__key = t.key, delete t.ref, delete t.key, "undefined" == typeof e.constructor.getDerivedStateFromProps && (!e.base || o ? e.componentWillMount && e.componentWillMount() : e.componentWillReceiveProps && e.componentWillReceiveProps(t, r)), r && r !== e.context && (e.prevContext || (e.prevContext = e.context), e.context = r), e.prevProps || (e.prevProps = e.props), e.props = t, e._disable = !1, 0 !== n && (1 !== n && !1 === E.syncComponentUpdates && e.base ? a(e) : V(e, 1, o)), e.__ref && e.__ref(e));
	      }

	      function V(e, t, n, r) {
	        if (!e._disable) {
	          var o,
	              i,
	              u,
	              a = e.props,
	              s = e.state,
	              l = e.context,
	              c = e.prevProps || a,
	              p = e.prevState || s,
	              f = e.prevContext || l,
	              d = e.base,
	              h = e.nextBase,
	              m = d || h,
	              v = e._component,
	              y = !1,
	              g = f;

	          if (e.constructor.getDerivedStateFromProps && (s = M(M({}, s), e.constructor.getDerivedStateFromProps(a, s)), e.state = s), d && (e.props = c, e.state = p, e.context = f, 2 !== t && e.shouldComponentUpdate && !1 === e.shouldComponentUpdate(a, s, l) ? y = !0 : e.componentWillUpdate && e.componentWillUpdate(a, s, l), e.props = a, e.state = s, e.context = l), e.prevProps = e.prevState = e.prevContext = e.nextBase = null, e._dirty = !1, !y) {
	            o = e.render(a, s, l), e.getChildContext && (l = M(M({}, l), e.getChildContext())), d && e.getSnapshotBeforeUpdate && (g = e.getSnapshotBeforeUpdate(c, p));

	            var _,
	                b,
	                w = o && o.nodeName;

	            if ("function" == typeof w) {
	              var x = I(o);
	              (i = v) && i.constructor === w && x.key == i.__key ? U(i, x, 1, l, !1) : (_ = i, e._component = i = R(w, x, l), i.nextBase = i.nextBase || h, i._parentComponent = e, U(i, x, 0, l, !1), V(i, 1, n, !0)), b = i.base;
	            } else u = m, (_ = v) && (u = e._component = null), (m || 1 === t) && (u && (u._component = null), b = function B(t, n, r, o, i, u) {
	              P++ || (j = null != i && i.ownerSVGElement !== undefined, L = null != t && !("__preactattr_" in t));
	              var a = D(t, n, r, o, u);
	              return i && a.parentNode !== i && i.appendChild(a), --P || (L = !1, u || T()), a;
	            }(u, o, l, n || !d, m && m.parentNode, !0));

	            if (m && b !== m && i !== v) {
	              var O = m.parentNode;
	              O && b !== O && (O.replaceChild(b, m), _ || (m._component = null, F(m, !1)));
	            }

	            if (_ && q(_), (e.base = b) && !r) {
	              for (var C = e, S = e; S = S._parentComponent;) (C = S).base = b;

	              b._component = C, b._componentConstructor = C.constructor;
	            }
	          }

	          for (!d || n ? A.unshift(e) : y || (e.componentDidUpdate && e.componentDidUpdate(c, p, g), E.afterUpdate && E.afterUpdate(e)); e._renderCallbacks.length;) e._renderCallbacks.pop().call(e);

	          P || r || T();
	        }
	      }

	      function q(e) {
	        E.beforeUnmount && E.beforeUnmount(e);
	        var t = e.base;
	        e._disable = !0, e.componentWillUnmount && e.componentWillUnmount(), e.base = null;
	        var n = e._component;
	        n ? q(n) : t && (t["__preactattr_"] && t["__preactattr_"].ref && t["__preactattr_"].ref(null), k(e.nextBase = t), m.push(e), h(t)), e.__ref && e.__ref(null);
	      }

	      function g(e, t) {
	        this._dirty = !0, this.context = t, this.props = e, this.state = this.state || {}, this._renderCallbacks = [];
	      }

	      function _(e, t, n) {
	        return B(n, e, {}, !1, t, !1);
	      }

	      M(g.prototype, {
	        setState: function (e, t) {
	          this.prevState || (this.prevState = this.state), this.state = M(M({}, this.state), "function" == typeof e ? e(this.state, this.props) : e), t && this._renderCallbacks.push(t), a(this);
	        },
	        forceUpdate: function (e) {
	          e && this._renderCallbacks.push(e), V(this, 2);
	        },
	        render: function _() {}
	      });
	      var b = {
	        h: r,
	        createElement: r,
	        cloneElement: i,
	        Component: g,
	        render: _,
	        rerender: f,
	        options: E
	      };
	      t["default"] = b;
	    }, function (e, t) {
	      var n = e.exports = {
	        version: "2.5.7"
	      };
	      "number" == typeof __e && (__e = n);
	    }, function (e, t, n) {
	      var r = n(8),
	          o = n(40);
	      e.exports = n(3) ? function (e, t, n) {
	        return r.f(e, t, o(1, n));
	      } : function (e, t, n) {
	        return e[t] = n, e;
	      };
	    }, function (e, t, n) {
	      var o = n(9),
	          i = n(38),
	          u = n(39),
	          a = Object.defineProperty;
	      t.f = n(3) ? Object.defineProperty : function (e, t, n) {
	        if (o(e), t = u(t, !0), o(n), i) try {
	          return a(e, t, n);
	        } catch (r) {}
	        if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
	        return "value" in n && (e[t] = n.value), e;
	      };
	    }, function (e, t, n) {
	      var r = n(2);

	      e.exports = function (e) {
	        if (!r(e)) throw TypeError(e + " is not an object!");
	        return e;
	      };
	    }, function (e, t) {
	      var n = 0,
	          r = Math.random();

	      e.exports = function (e) {
	        return "Symbol(".concat(e === undefined ? "" : e, ")_", (++n + r).toString(36));
	      };
	    }, function (e, t, n) {
	      var r = n(22);
	      e.exports = Object("z").propertyIsEnumerable(0) ? Object : function (e) {
	        return "String" == r(e) ? e.split("") : Object(e);
	      };
	    }, function (e, t) {
	      e.exports = function (e) {
	        if (e == undefined) throw TypeError("Can't call method on  " + e);
	        return e;
	      };
	    }, function (e, t, n) {

	      var r = n(4);

	      e.exports = function (e, t) {
	        return !!e && r(function () {
	          t ? e.call(null, function () {}, 1) : e.call(null);
	        });
	      };
	    }, function (e, t, n) {
	      var r = n(0);
	      r(r.S + r.F, "Object", {
	        assign: n(41)
	      });
	    }, function (e, t, n) {
	      var r = n(2),
	          o = n(1).document,
	          i = r(o) && r(o.createElement);

	      e.exports = function (e) {
	        return i ? o.createElement(e) : {};
	      };
	    }, function (e, t, n) {
	      var i = n(1),
	          u = n(7),
	          a = n(17),
	          s = n(10)("src"),
	          r = "toString",
	          o = Function[r],
	          l = ("" + o).split(r);
	      n(6).inspectSource = function (e) {
	        return o.call(e);
	      }, (e.exports = function (e, t, n, r) {
	        var o = "function" == typeof n;
	        o && (a(n, "name") || u(n, "name", t)), e[t] !== n && (o && (a(n, s) || u(n, s, e[t] ? "" + e[t] : l.join(String(t)))), e === i ? e[t] = n : r ? e[t] ? e[t] = n : u(e, t, n) : (delete e[t], u(e, t, n)));
	      })(Function.prototype, r, function () {
	        return "function" == typeof this && this[s] || o.call(this);
	      });
	    }, function (e, t) {
	      var n = {}.hasOwnProperty;

	      e.exports = function (e, t) {
	        return n.call(e, t);
	      };
	    }, function (e, t, n) {
	      var i = n(19);

	      e.exports = function (r, o, e) {
	        if (i(r), o === undefined) return r;

	        switch (e) {
	          case 1:
	            return function (e) {
	              return r.call(o, e);
	            };

	          case 2:
	            return function (e, t) {
	              return r.call(o, e, t);
	            };

	          case 3:
	            return function (e, t, n) {
	              return r.call(o, e, t, n);
	            };
	        }

	        return function () {
	          return r.apply(o, arguments);
	        };
	      };
	    }, function (e, t) {
	      e.exports = function (e) {
	        if ("function" != typeof e) throw TypeError(e + " is not a function!");
	        return e;
	      };
	    }, function (e, t, n) {
	      var r = n(42),
	          o = n(28);

	      e.exports = Object.keys || function (e) {
	        return r(e, o);
	      };
	    }, function (e, t, n) {
	      var r = n(11),
	          o = n(12);

	      e.exports = function (e) {
	        return r(o(e));
	      };
	    }, function (e, t) {
	      var n = {}.toString;

	      e.exports = function (e) {
	        return n.call(e).slice(8, -1);
	      };
	    }, function (e, t, n) {
	      var s = n(21),
	          l = n(24),
	          c = n(43);

	      e.exports = function (a) {
	        return function (e, t, n) {
	          var r,
	              o = s(e),
	              i = l(o.length),
	              u = c(n, i);

	          if (a && t != t) {
	            for (; u < i;) if ((r = o[u++]) != r) return !0;
	          } else for (; u < i; u++) if ((a || u in o) && o[u] === t) return a || u || 0;

	          return !a && -1;
	        };
	      };
	    }, function (e, t, n) {
	      var r = n(25),
	          o = Math.min;

	      e.exports = function (e) {
	        return 0 < e ? o(r(e), 9007199254740991) : 0;
	      };
	    }, function (e, t) {
	      var n = Math.ceil,
	          r = Math.floor;

	      e.exports = function (e) {
	        return isNaN(e = +e) ? 0 : (0 < e ? r : n)(e);
	      };
	    }, function (e, t, n) {
	      var r = n(27)("keys"),
	          o = n(10);

	      e.exports = function (e) {
	        return r[e] || (r[e] = o(e));
	      };
	    }, function (e, t, n) {
	      var r = n(6),
	          o = n(1),
	          i = "__core-js_shared__",
	          u = o[i] || (o[i] = {});
	      (e.exports = function (e, t) {
	        return u[e] || (u[e] = t !== undefined ? t : {});
	      })("versions", []).push({
	        version: r.version,
	        mode: n(44) ? "pure" : "global",
	        copyright: "© 2018 Denis Pushkarev (zloirock.ru)"
	      });
	    }, function (e, t) {
	      e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
	    }, function (e, t, n) {
	      var r = n(12);

	      e.exports = function (e) {
	        return Object(r(e));
	      };
	    }, function (e, t, n) {
	      var r = n(8).f,
	          o = Function.prototype,
	          i = /^\s*function ([^ (]*)/;
	      "name" in o || n(3) && r(o, "name", {
	        configurable: !0,
	        get: function () {
	          try {
	            return ("" + this).match(i)[1];
	          } catch (e) {
	            return "";
	          }
	        }
	      });
	    }, function (e, t, n) {

	      var r = n(0),
	          o = n(32)(1);
	      r(r.P + r.F * !n(13)([].map, !0), "Array", {
	        map: function (e) {
	          return o(this, e, arguments[1]);
	        }
	      });
	    }, function (e, t, n) {
	      var _ = n(18),
	          b = n(11),
	          w = n(29),
	          x = n(24),
	          r = n(47);

	      e.exports = function (p, e) {
	        var f = 1 == p,
	            d = 2 == p,
	            h = 3 == p,
	            m = 4 == p,
	            v = 6 == p,
	            y = 5 == p || v,
	            g = e || r;
	        return function (e, t, n) {
	          for (var r, o, i = w(e), u = b(i), a = _(t, n, 3), s = x(u.length), l = 0, c = f ? g(e, s) : d ? g(e, 0) : undefined; l < s; l++) if ((y || l in u) && (o = a(r = u[l], l, i), p)) if (f) c[l] = o;else if (o) switch (p) {
	            case 3:
	              return !0;

	            case 5:
	              return r;

	            case 6:
	              return l;

	            case 2:
	              c.push(r);
	          } else if (m) return !1;

	          return v ? -1 : h || m ? m : c;
	        };
	      };
	    }, function (e, t, n) {
	      var r = n(22);

	      e.exports = Array.isArray || function (e) {
	        return "Array" == r(e);
	      };
	    }, function (e, t, n) {
	      var r = n(27)("wks"),
	          o = n(10),
	          i = n(1).Symbol,
	          u = "function" == typeof i;
	      (e.exports = function (e) {
	        return r[e] || (r[e] = u && i[e] || (u ? i : o)("Symbol." + e));
	      }).store = r;
	    }, function (e, t, n) {

	      var r = n(0),
	          o = n(23)(!1),
	          i = [].indexOf,
	          u = !!i && 1 / [1].indexOf(1, -0) < 0;
	      r(r.P + r.F * (u || !n(13)(i)), "Array", {
	        indexOf: function (e) {
	          return u ? i.apply(this, arguments) || 0 : o(this, e, arguments[1]);
	        }
	      });
	    }, function (e, t, n) {
	      var r = n(0);
	      r(r.S, "Object", {
	        create: n(52)
	      });
	    }, function (e, t, n) {

	      t.__esModule = !0, t["default"] = void 0, n(14), n(30), n(31), n(35), n(49), n(50);

	      var r = n(5),
	          o = function s(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }(n(51));

	      function i(e) {
	        if (!e.element) throw new Error("element is not defined");
	        if (!e.id) throw new Error("id is not defined");
	        if (!e.source) throw new Error("source is not defined");
	        Array.isArray(e.source) && (e.source = u(e.source)), (0, r.render)((0, r.createElement)(o["default"], e), e.element);
	      }

	      var u = function u(n) {
	        return function (t, e) {
	          e(n.filter(function (e) {
	            return -1 !== e.toLowerCase().indexOf(t.toLowerCase());
	          }));
	        };
	      };

	      i.enhanceSelectElement = function (n) {
	        if (!n.selectElement) throw new Error("selectElement is not defined");

	        if (!n.source) {
	          var e = [].filter.call(n.selectElement.options, function (e) {
	            return e.value || n.preserveNullOptions;
	          });
	          n.source = e.map(function (e) {
	            return e.textContent || e.innerText;
	          });
	        }

	        if (n.onConfirm = n.onConfirm || function (t) {
	          var e = [].filter.call(n.selectElement.options, function (e) {
	            return (e.textContent || e.innerText) === t;
	          })[0];
	          e && (e.selected = !0);
	        }, n.selectElement.value || n.defaultValue === undefined) {
	          var t = n.selectElement.options[n.selectElement.options.selectedIndex];
	          n.defaultValue = t.textContent || t.innerText;
	        }

	        n.name === undefined && (n.name = ""), n.id === undefined && (n.selectElement.id === undefined ? n.id = "" : n.id = n.selectElement.id), n.autoselect === undefined && (n.autoselect = !0);
	        var r = document.createElement("div");
	        n.selectElement.parentNode.insertBefore(r, n.selectElement), i(Object.assign({}, n, {
	          element: r
	        })), n.selectElement.style.display = "none", n.selectElement.id = n.selectElement.id + "-select";
	      };

	      var a = i;
	      t["default"] = a;
	    }, function (e, t, n) {
	      e.exports = !n(3) && !n(4)(function () {
	        return 7 != Object.defineProperty(n(15)("div"), "a", {
	          get: function () {
	            return 7;
	          }
	        }).a;
	      });
	    }, function (e, t, n) {
	      var o = n(2);

	      e.exports = function (e, t) {
	        if (!o(e)) return e;
	        var n, r;
	        if (t && "function" == typeof (n = e.toString) && !o(r = n.call(e))) return r;
	        if ("function" == typeof (n = e.valueOf) && !o(r = n.call(e))) return r;
	        if (!t && "function" == typeof (n = e.toString) && !o(r = n.call(e))) return r;
	        throw TypeError("Can't convert object to primitive value");
	      };
	    }, function (e, t) {
	      e.exports = function (e, t) {
	        return {
	          enumerable: !(1 & e),
	          configurable: !(2 & e),
	          writable: !(4 & e),
	          value: t
	        };
	      };
	    }, function (e, t, n) {

	      var f = n(20),
	          d = n(45),
	          h = n(46),
	          m = n(29),
	          v = n(11),
	          o = Object.assign;
	      e.exports = !o || n(4)(function () {
	        var e = {},
	            t = {},
	            n = Symbol(),
	            r = "abcdefghijklmnopqrst";
	        return e[n] = 7, r.split("").forEach(function (e) {
	          t[e] = e;
	        }), 7 != o({}, e)[n] || Object.keys(o({}, t)).join("") != r;
	      }) ? function (e, t) {
	        for (var n = m(e), r = arguments.length, o = 1, i = d.f, u = h.f; o < r;) for (var a, s = v(arguments[o++]), l = i ? f(s).concat(i(s)) : f(s), c = l.length, p = 0; p < c;) u.call(s, a = l[p++]) && (n[a] = s[a]);

	        return n;
	      } : o;
	    }, function (e, t, n) {
	      var u = n(17),
	          a = n(21),
	          s = n(23)(!1),
	          l = n(26)("IE_PROTO");

	      e.exports = function (e, t) {
	        var n,
	            r = a(e),
	            o = 0,
	            i = [];

	        for (n in r) n != l && u(r, n) && i.push(n);

	        for (; t.length > o;) u(r, n = t[o++]) && (~s(i, n) || i.push(n));

	        return i;
	      };
	    }, function (e, t, n) {
	      var r = n(25),
	          o = Math.max,
	          i = Math.min;

	      e.exports = function (e, t) {
	        return (e = r(e)) < 0 ? o(e + t, 0) : i(e, t);
	      };
	    }, function (e, t) {
	      e.exports = !1;
	    }, function (e, t) {
	      t.f = Object.getOwnPropertySymbols;
	    }, function (e, t) {
	      t.f = {}.propertyIsEnumerable;
	    }, function (e, t, n) {
	      var r = n(48);

	      e.exports = function (e, t) {
	        return new (r(e))(t);
	      };
	    }, function (e, t, n) {
	      var r = n(2),
	          o = n(33),
	          i = n(34)("species");

	      e.exports = function (e) {
	        var t;
	        return o(e) && ("function" != typeof (t = e.constructor) || t !== Array && !o(t.prototype) || (t = undefined), r(t) && null === (t = t[i]) && (t = undefined)), t === undefined ? Array : t;
	      };
	    }, function (e, t, n) {

	      var r = n(0),
	          o = n(32)(2);
	      r(r.P + r.F * !n(13)([].filter, !0), "Array", {
	        filter: function (e) {
	          return o(this, e, arguments[1]);
	        }
	      });
	    }, function (e, t, n) {
	      var r = n(0);
	      r(r.S, "Array", {
	        isArray: n(33)
	      });
	    }, function (e, t, n) {

	      t.__esModule = !0, t["default"] = void 0, n(14), n(36), n(30), n(31), n(35), n(55), n(58);
	      var $ = n(5),
	          J = o(n(60)),
	          r = o(n(61));

	      function o(e) {
	        return e && e.__esModule ? e : {
	          "default": e
	        };
	      }

	      function X() {
	        return (X = Object.assign || function (e) {
	          for (var t = 1; t < arguments.length; t++) {
	            var n = arguments[t];

	            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
	          }

	          return e;
	        }).apply(this, arguments);
	      }

	      function i(e) {
	        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	        return e;
	      }

	      var u = {
	        13: "enter",
	        27: "escape",
	        32: "space",
	        38: "up",
	        40: "down"
	      };

	      function Y() {
	        return "undefined" != typeof navigator && !(!navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || !navigator.userAgent.match(/AppleWebKit/g));
	      }

	      var a = function (n) {
	        function e(e) {
	          var t;
	          return (t = n.call(this, e) || this).elementReferences = {}, t.state = {
	            focused: null,
	            hovered: null,
	            menuOpen: !1,
	            options: e.defaultValue ? [e.defaultValue] : [],
	            query: e.defaultValue,
	            validChoiceMade: !1,
	            selected: null,
	            ariaHint: !0
	          }, t.handleComponentBlur = t.handleComponentBlur.bind(i(i(t))), t.handleKeyDown = t.handleKeyDown.bind(i(i(t))), t.handleUpArrow = t.handleUpArrow.bind(i(i(t))), t.handleDownArrow = t.handleDownArrow.bind(i(i(t))), t.handleEnter = t.handleEnter.bind(i(i(t))), t.handlePrintableKey = t.handlePrintableKey.bind(i(i(t))), t.handleListMouseLeave = t.handleListMouseLeave.bind(i(i(t))), t.handleOptionBlur = t.handleOptionBlur.bind(i(i(t))), t.handleOptionClick = t.handleOptionClick.bind(i(i(t))), t.handleOptionFocus = t.handleOptionFocus.bind(i(i(t))), t.handleOptionMouseDown = t.handleOptionMouseDown.bind(i(i(t))), t.handleOptionMouseEnter = t.handleOptionMouseEnter.bind(i(i(t))), t.handleInputBlur = t.handleInputBlur.bind(i(i(t))), t.handleInputChange = t.handleInputChange.bind(i(i(t))), t.handleInputFocus = t.handleInputFocus.bind(i(i(t))), t.pollInputElement = t.pollInputElement.bind(i(i(t))), t.getDirectInputChanges = t.getDirectInputChanges.bind(i(i(t))), t;
	        }

	        (function r(e, t) {
	          e.prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t;
	        })(e, n);

	        var t = e.prototype;
	        return t.isQueryAnOption = function (e, t) {
	          var n = this;
	          return -1 !== t.map(function (e) {
	            return n.templateInputValue(e).toLowerCase();
	          }).indexOf(e.toLowerCase());
	        }, t.componentDidMount = function () {
	          this.pollInputElement();
	        }, t.componentWillUnmount = function () {
	          clearTimeout(this.$pollInput);
	        }, t.pollInputElement = function () {
	          var e = this;
	          this.getDirectInputChanges(), this.$pollInput = setTimeout(function () {
	            e.pollInputElement();
	          }, 100);
	        }, t.getDirectInputChanges = function () {
	          var e = this.elementReferences[-1];
	          e && e.value !== this.state.query && this.handleInputChange({
	            target: {
	              value: e.value
	            }
	          });
	        }, t.componentDidUpdate = function (e, t) {
	          var n = this.state.focused,
	              r = null === n,
	              o = t.focused !== n;
	          o && !r && this.elementReferences[n].focus();
	          var i = -1 === n,
	              u = o && null === t.focused;

	          if (i && u) {
	            var a = this.elementReferences[n];
	            a.setSelectionRange(0, a.value.length);
	          }
	        }, t.hasAutoselect = function () {
	          return !Y() && this.props.autoselect;
	        }, t.templateInputValue = function (e) {
	          var t = this.props.templates && this.props.templates.inputValue;
	          return t ? t(e) : e;
	        }, t.templateSuggestion = function (e) {
	          var t = this.props.templates && this.props.templates.suggestion;
	          return t ? t(e) : e;
	        }, t.handleComponentBlur = function (e) {
	          var t,
	              n = this.state,
	              r = n.options,
	              o = n.query,
	              i = n.selected;
	          this.props.confirmOnBlur ? (t = e.query || o, this.props.onConfirm(r[i])) : t = o, this.setState({
	            focused: null,
	            menuOpen: e.menuOpen || !1,
	            query: t,
	            selected: null,
	            validChoiceMade: this.isQueryAnOption(t, r)
	          });
	        }, t.handleListMouseLeave = function (e) {
	          this.setState({
	            hovered: null
	          });
	        }, t.handleOptionBlur = function (e, t) {
	          var n = this.state,
	              r = n.focused,
	              o = n.menuOpen,
	              i = n.options,
	              u = n.selected,
	              a = null === e.relatedTarget,
	              s = e.relatedTarget === this.elementReferences[-1],
	              l = r !== t && -1 !== r;

	          if (!l && a || !(l || s)) {
	            var c = o && Y();
	            this.handleComponentBlur({
	              menuOpen: c,
	              query: this.templateInputValue(i[u])
	            });
	          }
	        }, t.handleInputBlur = function (e) {
	          var t = this.state,
	              n = t.focused,
	              r = t.menuOpen,
	              o = t.options,
	              i = t.query,
	              u = t.selected;

	          if (!(-1 !== n)) {
	            var a = r && Y(),
	                s = Y() ? i : this.templateInputValue(o[u]);
	            this.handleComponentBlur({
	              menuOpen: a,
	              query: s
	            });
	          }
	        }, t.handleInputChange = function (e) {
	          var n = this,
	              t = this.props,
	              r = t.minLength,
	              o = t.source,
	              i = t.showAllValues,
	              u = this.hasAutoselect(),
	              a = e.target.value,
	              s = 0 === a.length,
	              l = this.state.query.length !== a.length,
	              c = a.length >= r;
	          this.setState({
	            query: a,
	            ariaHint: s
	          }), i || !s && l && c ? o(a, function (e) {
	            var t = 0 < e.length;
	            n.setState({
	              menuOpen: t,
	              options: e,
	              selected: u && t ? 0 : -1,
	              validChoiceMade: !1
	            });
	          }) : !s && c || this.setState({
	            menuOpen: !1,
	            options: []
	          });
	        }, t.handleInputClick = function (e) {
	          this.handleInputChange(e);
	        }, t.handleInputFocus = function (e) {
	          var t = this.state,
	              n = t.query,
	              r = t.validChoiceMade,
	              o = t.options,
	              i = this.props.minLength,
	              u = !r && n.length >= i && 0 < o.length;
	          u ? this.setState(function (e) {
	            var t = e.menuOpen;
	            return {
	              focused: -1,
	              menuOpen: u || t,
	              selected: -1
	            };
	          }) : this.setState({
	            focused: -1
	          });
	        }, t.handleOptionFocus = function (e) {
	          this.setState({
	            focused: e,
	            hovered: null,
	            selected: e
	          });
	        }, t.handleOptionMouseEnter = function (e, t) {
	          Y() || this.setState({
	            hovered: t
	          });
	        }, t.handleOptionClick = function (e, t) {
	          var n = this.state.options[t],
	              r = this.templateInputValue(n);
	          this.props.onConfirm(n), this.setState({
	            focused: -1,
	            hovered: null,
	            menuOpen: !1,
	            query: r,
	            selected: -1,
	            validChoiceMade: !0
	          }), this.forceUpdate();
	        }, t.handleOptionMouseDown = function (e) {
	          e.preventDefault();
	        }, t.handleUpArrow = function (e) {
	          e.preventDefault();
	          var t = this.state,
	              n = t.menuOpen,
	              r = t.selected;
	          -1 !== r && n && this.handleOptionFocus(r - 1);
	        }, t.handleDownArrow = function (e) {
	          var t = this;
	          if (e.preventDefault(), this.props.showAllValues && !1 === this.state.menuOpen) e.preventDefault(), this.props.source("", function (e) {
	            t.setState({
	              menuOpen: !0,
	              options: e,
	              selected: 0,
	              focused: 0,
	              hovered: null
	            });
	          });else if (!0 === this.state.menuOpen) {
	            var n = this.state,
	                r = n.menuOpen,
	                o = n.options,
	                i = n.selected;
	            i !== o.length - 1 && r && this.handleOptionFocus(i + 1);
	          }
	        }, t.handleSpace = function (e) {
	          var t = this;
	          this.props.showAllValues && !1 === this.state.menuOpen && "" === this.state.query && (e.preventDefault(), this.props.source("", function (e) {
	            t.setState({
	              menuOpen: !0,
	              options: e
	            });
	          })), -1 !== this.state.focused && (e.preventDefault(), this.handleOptionClick(e, this.state.focused));
	        }, t.handleEnter = function (e) {
	          this.state.menuOpen && (e.preventDefault(), 0 <= this.state.selected && this.handleOptionClick(e, this.state.selected));
	        }, t.handlePrintableKey = function (e) {
	          var t = this.elementReferences[-1];
	          e.target === t || t.focus();
	        }, t.handleKeyDown = function (e) {
	          switch (u[e.keyCode]) {
	            case "up":
	              this.handleUpArrow(e);
	              break;

	            case "down":
	              this.handleDownArrow(e);
	              break;

	            case "space":
	              this.handleSpace(e);
	              break;

	            case "enter":
	              this.handleEnter(e);
	              break;

	            case "escape":
	              this.handleComponentBlur({
	                query: this.state.query
	              });
	              break;

	            default:
	              (function t(e) {
	                return 47 < e && e < 58 || 32 === e || 8 === e || 64 < e && e < 91 || 95 < e && e < 112 || 185 < e && e < 193 || 218 < e && e < 223;
	              })(e.keyCode) && this.handlePrintableKey(e);
	          }
	        }, t.render = function () {
	          var e,
	              i = this,
	              t = this.props,
	              n = t.cssNamespace,
	              r = t.displayMenu,
	              u = t.id,
	              o = t.minLength,
	              a = t.name,
	              s = t.placeholder,
	              l = t.required,
	              c = t.showAllValues,
	              p = t.tNoResults,
	              f = t.tStatusQueryTooShort,
	              d = t.tStatusNoResults,
	              h = t.tStatusSelectedOption,
	              m = t.tStatusResults,
	              v = t.tAssistiveHint,
	              y = t.dropdownArrow,
	              g = this.state,
	              _ = g.focused,
	              b = g.hovered,
	              w = g.menuOpen,
	              x = g.options,
	              O = g.query,
	              C = g.selected,
	              S = g.ariaHint,
	              E = g.validChoiceMade,
	              M = this.hasAutoselect(),
	              N = -1 === _,
	              I = 0 === x.length,
	              k = 0 !== O.length,
	              A = O.length >= o,
	              P = this.props.showNoOptionsFound && N && I && k && A,
	              j = n + "__wrapper",
	              L = n + "__input",
	              T = null !== _ ? " " + L + "--focused" : "",
	              B = this.props.showAllValues ? " " + L + "--show-all-values" : " " + L + "--default",
	              D = n + "__dropdown-arrow-down",
	              F = -1 !== _ && null !== _,
	              R = n + "__menu",
	              U = R + "--" + r,
	              V = R + "--" + (w || P ? "visible" : "hidden"),
	              q = n + "__option",
	              W = n + "__hint",
	              H = this.templateInputValue(x[C]),
	              K = H && 0 === H.toLowerCase().indexOf(O.toLowerCase()) && M ? O + H.substr(O.length) : "",
	              Q = u + "__assistiveHint",
	              z = S ? {
	            "aria-describedby": Q
	          } : null;
	          return c && "string" == typeof (e = y({
	            className: D
	          })) && (e = (0, $.createElement)("div", {
	            className: n + "__dropdown-arrow-down-wrapper",
	            dangerouslySetInnerHTML: {
	              __html: e
	            }
	          })), (0, $.createElement)("div", {
	            className: j,
	            onKeyDown: this.handleKeyDown
	          }, (0, $.createElement)(J["default"], {
	            id: u,
	            length: x.length,
	            queryLength: O.length,
	            minQueryLength: o,
	            selectedOption: this.templateInputValue(x[C]),
	            selectedOptionIndex: C,
	            validChoiceMade: E,
	            isInFocus: null !== this.state.focused,
	            tQueryTooShort: f,
	            tNoResults: d,
	            tSelectedOption: h,
	            tResults: m
	          }), K && (0, $.createElement)("span", null, (0, $.createElement)("input", {
	            className: W,
	            readonly: !0,
	            tabIndex: "-1",
	            value: K
	          })), (0, $.createElement)("input", X({
	            "aria-expanded": w ? "true" : "false",
	            "aria-activedescendant": !!F && u + "__option--" + _,
	            "aria-owns": u + "__listbox",
	            "aria-autocomplete": this.hasAutoselect() ? "both" : "list"
	          }, z, {
	            autoComplete: "off",
	            className: "" + L + T + B,
	            id: u,
	            onClick: function (e) {
	              return i.handleInputClick(e);
	            },
	            onBlur: this.handleInputBlur
	          }, function G(e) {
	            return {
	              onInput: e
	            };
	          }(this.handleInputChange), {
	            onFocus: this.handleInputFocus,
	            name: a,
	            placeholder: s,
	            ref: function (e) {
	              i.elementReferences[-1] = e;
	            },
	            type: "text",
	            role: "combobox",
	            required: l,
	            value: O
	          })), e, (0, $.createElement)("ul", {
	            className: R + " " + U + " " + V,
	            onMouseLeave: function (e) {
	              return i.handleListMouseLeave(e);
	            },
	            id: u + "__listbox",
	            role: "listbox"
	          }, x.map(function (e, t) {
	            var n = (-1 === _ ? C === t : _ === t) && null === b ? " " + q + "--focused" : "",
	                r = t % 2 ? " " + q + "--odd" : "",
	                o = Y() ? "<span id=" + u + "__option-suffix--" + t + ' style="border:0;clip:rect(0 0 0 0);height:1px;marginBottom:-1px;marginRight:-1px;overflow:hidden;padding:0;position:absolute;whiteSpace:nowrap;width:1px"> ' + (t + 1) + " of " + x.length + "</span>" : "";
	            return (0, $.createElement)("li", {
	              "aria-selected": _ === t ? "true" : "false",
	              className: "" + q + n + r,
	              dangerouslySetInnerHTML: {
	                __html: i.templateSuggestion(e) + o
	              },
	              id: u + "__option--" + t,
	              key: t,
	              onBlur: function (e) {
	                return i.handleOptionBlur(e, t);
	              },
	              onClick: function (e) {
	                return i.handleOptionClick(e, t);
	              },
	              onMouseDown: i.handleOptionMouseDown,
	              onMouseEnter: function (e) {
	                return i.handleOptionMouseEnter(e, t);
	              },
	              ref: function (e) {
	                i.elementReferences[t] = e;
	              },
	              role: "option",
	              tabIndex: "-1",
	              "aria-posinset": t + 1,
	              "aria-setsize": x.length
	            });
	          }), P && (0, $.createElement)("li", {
	            className: q + " " + q + "--no-results"
	          }, p())), (0, $.createElement)("span", {
	            id: Q,
	            style: {
	              display: "none"
	            }
	          }, v()));
	        }, e;
	      }($.Component);

	      (t["default"] = a).defaultProps = {
	        autoselect: !1,
	        cssNamespace: "autocomplete",
	        defaultValue: "",
	        displayMenu: "inline",
	        minLength: 0,
	        name: "input-autocomplete",
	        placeholder: "",
	        onConfirm: function () {},
	        confirmOnBlur: !0,
	        showNoOptionsFound: !0,
	        showAllValues: !1,
	        required: !1,
	        tNoResults: function () {
	          return "No results found";
	        },
	        tAssistiveHint: function () {
	          return "When autocomplete results are available use up and down arrows to review and enter to select.  Touch device users, explore by touch or with swipe gestures.";
	        },
	        dropdownArrow: r["default"]
	      };
	    }, function (e, t, r) {
	      var o = r(9),
	          i = r(53),
	          u = r(28),
	          a = r(26)("IE_PROTO"),
	          s = function () {},
	          l = "prototype",
	          c = function () {
	        var e,
	            t = r(15)("iframe"),
	            n = u.length;

	        for (t.style.display = "none", r(54).appendChild(t), t.src = "javascript:", (e = t.contentWindow.document).open(), e.write("<script>document.F=Object<\/script>"), e.close(), c = e.F; n--;) delete c[l][u[n]];

	        return c();
	      };

	      e.exports = Object.create || function (e, t) {
	        var n;
	        return null !== e ? (s[l] = o(e), n = new s(), s[l] = null, n[a] = e) : n = c(), t === undefined ? n : i(n, t);
	      };
	    }, function (e, t, n) {
	      var u = n(8),
	          a = n(9),
	          s = n(20);
	      e.exports = n(3) ? Object.defineProperties : function (e, t) {
	        a(e);

	        for (var n, r = s(t), o = r.length, i = 0; i < o;) u.f(e, n = r[i++], t[n]);

	        return e;
	      };
	    }, function (e, t, n) {
	      var r = n(1).document;
	      e.exports = r && r.documentElement;
	    }, function (e, t, n) {
	      var r = n(0);
	      r(r.P, "Function", {
	        bind: n(56)
	      });
	    }, function (e, t, n) {

	      var i = n(19),
	          u = n(2),
	          a = n(57),
	          s = [].slice,
	          l = {};

	      e.exports = Function.bind || function (t) {
	        var n = i(this),
	            r = s.call(arguments, 1),
	            o = function () {
	          var e = r.concat(s.call(arguments));
	          return this instanceof o ? function (e, t, n) {
	            if (!(t in l)) {
	              for (var r = [], o = 0; o < t; o++) r[o] = "a[" + o + "]";

	              l[t] = Function("F,a", "return new F(" + r.join(",") + ")");
	            }

	            return l[t](e, n);
	          }(n, e.length, e) : a(n, e, t);
	        };

	        return u(n.prototype) && (o.prototype = n.prototype), o;
	      };
	    }, function (e, t) {
	      e.exports = function (e, t, n) {
	        var r = n === undefined;

	        switch (t.length) {
	          case 0:
	            return r ? e() : e.call(n);

	          case 1:
	            return r ? e(t[0]) : e.call(n, t[0]);

	          case 2:
	            return r ? e(t[0], t[1]) : e.call(n, t[0], t[1]);

	          case 3:
	            return r ? e(t[0], t[1], t[2]) : e.call(n, t[0], t[1], t[2]);

	          case 4:
	            return r ? e(t[0], t[1], t[2], t[3]) : e.call(n, t[0], t[1], t[2], t[3]);
	        }

	        return e.apply(n, t);
	      };
	    }, function (e, t, n) {
	      n(59)("match", 1, function (r, o, e) {
	        return [function (e) {

	          var t = r(this),
	              n = e == undefined ? undefined : e[o];
	          return n !== undefined ? n.call(e, t) : new RegExp(e)[o](String(t));
	        }, e];
	      });
	    }, function (e, t, n) {

	      var a = n(7),
	          s = n(16),
	          l = n(4),
	          c = n(12),
	          p = n(34);

	      e.exports = function (t, e, n) {
	        var r = p(t),
	            o = n(c, r, ""[t]),
	            i = o[0],
	            u = o[1];
	        l(function () {
	          var e = {};
	          return e[r] = function () {
	            return 7;
	          }, 7 != ""[t](e);
	        }) && (s(String.prototype, t, i), a(RegExp.prototype, r, 2 == e ? function (e, t) {
	          return u.call(e, this, t);
	        } : function (e) {
	          return u.call(e, this);
	        }));
	      };
	    }, function (e, t, n) {

	      t.__esModule = !0, t["default"] = void 0, n(36);

	      var _ = n(5);

	      var r = function r(o, i, u) {
	        var a;
	        return function () {
	          var e = this,
	              t = arguments,
	              n = function n() {
	            a = null, u || o.apply(e, t);
	          },
	              r = u && !a;

	          clearTimeout(a), a = setTimeout(n, i), r && o.apply(e, t);
	        };
	      },
	          o = function (o) {
	        function e() {
	          for (var e, t = arguments.length, n = new Array(t), r = 0; r < t; r++) n[r] = arguments[r];

	          return (e = o.call.apply(o, [this].concat(n)) || this).state = {
	            bump: !1,
	            debounced: !1
	          }, e;
	        }

	        (function n(e, t) {
	          e.prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t;
	        })(e, o);

	        var t = e.prototype;
	        return t.componentWillMount = function () {
	          var e = this;
	          this.debounceStatusUpdate = r(function () {
	            if (!e.state.debounced) {
	              var t = !e.props.isInFocus || e.props.validChoiceMade;
	              e.setState(function (e) {
	                return {
	                  bump: !e.bump,
	                  debounced: !0,
	                  silenced: t
	                };
	              });
	            }
	          }, 1400);
	        }, t.componentWillReceiveProps = function (e) {
	          e.queryLength;
	          this.setState({
	            debounced: !1
	          });
	        }, t.render = function () {
	          var e = this.props,
	              t = e.id,
	              n = e.length,
	              r = e.queryLength,
	              o = e.minQueryLength,
	              i = e.selectedOption,
	              u = e.selectedOptionIndex,
	              a = e.tQueryTooShort,
	              s = e.tNoResults,
	              l = e.tSelectedOption,
	              c = e.tResults,
	              p = this.state,
	              f = p.bump,
	              d = p.debounced,
	              h = p.silenced,
	              m = r < o,
	              v = 0 === n,
	              y = i ? l(i, n, u) : "",
	              g = null;
	          return g = m ? a(o) : v ? s() : c(n, y), this.debounceStatusUpdate(), (0, _.createElement)("div", {
	            style: {
	              border: "0",
	              clip: "rect(0 0 0 0)",
	              height: "1px",
	              marginBottom: "-1px",
	              marginRight: "-1px",
	              overflow: "hidden",
	              padding: "0",
	              position: "absolute",
	              whiteSpace: "nowrap",
	              width: "1px"
	            }
	          }, (0, _.createElement)("div", {
	            id: t + "__status--A",
	            role: "status",
	            "aria-atomic": "true",
	            "aria-live": "polite"
	          }, !h && d && f ? g : ""), (0, _.createElement)("div", {
	            id: t + "__status--B",
	            role: "status",
	            "aria-atomic": "true",
	            "aria-live": "polite"
	          }, h || !d || f ? "" : g));
	        }, e;
	      }(_.Component);

	      (t["default"] = o).defaultProps = {
	        tQueryTooShort: function (e) {
	          return "Type in " + e + " or more characters for results";
	        },
	        tNoResults: function () {
	          return "No search results";
	        },
	        tSelectedOption: function (e, t, n) {
	          return e + " " + (n + 1) + " of " + t + " is highlighted";
	        },
	        tResults: function (e, t) {
	          return e + " " + (1 === e ? "result" : "results") + " " + (1 === e ? "is" : "are") + " available. " + t;
	        }
	      };
	    }, function (e, t, n) {

	      t.__esModule = !0, t["default"] = void 0;

	      var r = n(5),
	          o = function i(e) {
	        var t = e.className;
	        return (0, r.createElement)("svg", {
	          version: "1.1",
	          xmlns: "http://www.w3.org/2000/svg",
	          className: t,
	          focusable: "false"
	        }, (0, r.createElement)("g", {
	          stroke: "none",
	          fill: "none",
	          "fill-rule": "evenodd"
	        }, (0, r.createElement)("polygon", {
	          fill: "#000000",
	          points: "0 0 22 0 11 17"
	        })));
	      };

	      t["default"] = o;
	    }])["default"];
	  });
	});
	var accessibleAutocomplete = /*@__PURE__*/unwrapExports(accessibleAutocomplete_min);

	function _templateObject2$4() {
	  var data = _taggedTemplateLiteral(["\n    ", "\n    <div class=\"jcc-forms-filter__input-container jcc-forms-filter__input-container--desktop\">\n      <h1>Find Your Court Forms</h1>\n      <label for=\"jcc-forms-filter__input\" class=\"jcc-forms-filter__input-label\">Search for any topic or form number, or <a class=\"text-white\" href=\"", "\">view all forms</a></label>\n<!--      <input type=\"text\"-->\n<!--             id=\"jcc-forms-filter__input\"-->\n<!--             placeholder=\"E.g. divorce, name change, fl-100, restraining order\"-->\n<!--             class=\"usa-input jcc-forms-filter__input\"-->\n<!--             name=\"input-type-text\"-->\n<!--             autocomplete=\"off\">-->\n      <div id=\"suggestions\"></div>\n    </div>\n    <div class=\"jcc-forms-filter__search-results\" aria-live=\"polite\"></div>\n    <div class=\"jcc-forms-filter__mobile-container\">\n      <div class=\"jcc-forms-filter__input-container\">\n        <input type=\"text\"\n               id=\"jcc-forms-filter__mobile-input\"\n               placeholder=\"E.g. divorce, name change, fl-100, restraining order\"\n               class=\"usa-input jcc-forms-filter__mobile-input\"\n               name=\"input-type-text\"\n               autocomplete=\"off\">\n      </div>\n      <div class=\"jcc-forms-filter__mobile-search-results\" aria-live=\"polite\"></div>\n    </div>\n  "]);

	  _templateObject2$4 = function _templateObject2() {
	    return data;
	  };

	  return data;
	}

	function _templateObject$4() {
	  var data = _taggedTemplateLiteral(["\n        <div class=\"usa-alert usa-alert--info usa-alert--slim usa-alert--no-icon\" style=\"margin-bottom: 0px\">\n          <div class=\"usa-alert__body\">\n            <p class=\"usa-alert__text\">We're testing a new way to help you find forms. <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.surveymonkey.com/r/2WZTJ59\" onclick=", ">Share feedback</a>. Or use <a href=\"", "\">the old search</a>.</p>\n          </div>\n        </div>"]);

	  _templateObject$4 = function _templateObject() {
	    return data;
	  };

	  return data;
	}
	// Mobile helpers
	//

	function isMobile() {
	  return window.innerWidth < 700;
	}

	function mobileContainerVisible() {
	  return history.state && history.state.mobileContainerVisible;
	}

	function enterMobileView() {
	  history.pushState({
	    mobileContainerVisible: true
	  }, '');
	} //
	// Main entry point
	//

	function initFormsLookup(containerEl) {
	  console.log('forms lookup init');

	  var PilotFeedbackAlert = function PilotFeedbackAlert() {
	    {
	      return browser(_templateObject$4(), function (e) {
	        return showSurveyMonkeyForm(e);
	      }, legacyDropdownLookupUrl);
	    }
	  }; // Add the forms lookup DOM elements to the page


	  containerEl.appendChild(browser(_templateObject2$4(), PilotFeedbackAlert(), allFormsPageUrl)); //
	  // Init autocomplete
	  //
	  // use JS array

	  var suggestions = ['Civil', 'Civil Harassment', 'Gender Change', 'Name Change'];
	  accessibleAutocomplete({
	    // container element
	    element: document.querySelector('#suggestions'),
	    // input id
	    id: 'jcc-forms-filter__input',
	    name: 'input-type-text',
	    // data source
	    source: suggestions,
	    displayMenu: 'overlay',
	    minLength: 2
	  }); //
	  // Register event listeners
	  //

	  var searchInput = document.querySelector("#jcc-forms-filter__input");
	  searchInput.addEventListener("input", function (e) {
	    // IE11 fix to prevent input event from firing when searchInput gains/loses focus
	    if (document.activeElement !== searchInput) {
	      return;
	    }

	    doQuery({
	      query: searchInput.value
	    });
	  });

	  if (isMobile()) {
	    searchInput.addEventListener("mouseup", function (e) {
	      e.preventDefault();
	      enterMobileView();
	      rerender();
	    });
	  }

	  var mobileSearchInput = document.querySelector("#jcc-forms-filter__mobile-input");
	  mobileSearchInput.addEventListener("input", function () {
	    return doQuery({
	      query: mobileSearchInput.value
	    });
	  }); //
	  // The main render functions
	  //

	  var lastRender = {};

	  var rerender = function rerender() {
	    return render(lastRender);
	  };

	  var render = function render() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    lastRender = state; // Render desktop

	    var desktopResultsContainer = document.querySelector(".jcc-forms-filter__search-results");
	    renderSearchResults(desktopResultsContainer); // Render mobile

	    if (mobileContainerVisible()) {
	      showMobileView();
	      var mobileResultsContainer = document.querySelector(".jcc-forms-filter__mobile-search-results");
	      renderSearchResults(mobileResultsContainer);
	    } else {
	      hideMobileView();
	    }

	    function renderSearchResults(container) {
	      container.innerHTML = '';
	      container.appendChild(SearchResults(actions, state));
	    }

	    function showMobileView() {
	      var mobileContainer = document.querySelector(".jcc-forms-filter__mobile-container");
	      mobileContainer.style.display = 'block';
	      mobileSearchInput.focus();
	      freezeBody();
	    }

	    function hideMobileView() {
	      var mobileContainer = document.querySelector(".jcc-forms-filter__mobile-container");
	      mobileContainer.style.display = 'none';
	      unfreezeBody();
	    }
	  }; //
	  // Button behaviors
	  //


	  var actions = {
	    onCategoryClick: function onCategoryClick(e, category) {
	      e.preventDefault();
	      searchInput.value = category.query;
	      mobileSearchInput.value = category.query;
	      searchInput.focus(); // Enter mobile mode if we are not already there

	      if (!mobileContainerVisible() && isMobile()) {
	        enterMobileView();
	      }

	      doQuery({
	        query: category.query,
	        pushState: true
	      });
	    },
	    onShowMoreFormsClick: function onShowMoreFormsClick() {
	      render({
	        query: lastRender.query,
	        response: lastRender.response,
	        showMoreForms: true
	      });
	    }
	  }; //
	  // The forms API query function
	  //

	  function doQuery(_ref) {
	    var query = _ref.query,
	        _ref$pushState = _ref.pushState,
	        pushState = _ref$pushState === void 0 ? false : _ref$pushState;
	    // Update query string
	    var newUrl = "".concat(window.location.pathname, "?query=").concat(query);

	    if (pushState) {
	      history.pushState(history.state, '', newUrl);
	    } else {
	      history.replaceState(history.state, '', newUrl);
	    } // Fetch and re-render


	    fetchForms(query, render, function () {
	      return render({
	        loading: true
	      });
	    });
	  } //
	  // updateStateFromQueryString handles ?filter and ?query URL params
	  // on page load
	  //


	  function updateStateFromQueryString() {
	    var parseQueryString = function parseQueryString(queryString) {
	      var pairs = queryString.slice(1).split('&').map(function (pair) {
	        return pair.split('=');
	      });
	      var queryDict = {};

	      for (var i = 0; i < pairs.length; i++) {
	        queryDict[pairs[i][0]] = pairs[i][1];
	      }

	      return queryDict;
	    };

	    var query = '';

	    if (window.location.search) {
	      var queryDict = parseQueryString(window.location.search);

	      if (queryDict.query) {
	        query = decodeURI(queryDict.query);
	      } else if (queryDict.filter) {
	        // This is where we support legacy URLs like https://www.courts.ca.gov/forms.htm?filter=DV
	        query = getQueryForLegacyFilter(queryDict.filter);
	      }
	    }

	    searchInput.value = query;
	    mobileSearchInput.value = query;
	    fetchForms(query, render, function () {
	      return render({
	        loading: true
	      });
	    });
	  } // Initial render. Subsequent renders occur when the user types in the input,
	  // or clicks on a category button.


	  render();
	  updateStateFromQueryString(); // Handle case when someone uses the browser back button

	  window.addEventListener("popstate", function () {
	    return updateStateFromQueryString();
	  }); // Focus the search input to draw attention to it

	  searchInput.focus();
	}

	return initFormsLookup;

}());
