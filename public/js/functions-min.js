'use strict';
!function(window, doc, exportName, undefined) {
  /**
   * @param {!Function} fn
   * @param {?} timeout
   * @param {?} context
   * @return {?}
   */
  function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
  }
  /**
   * @param {!Object} arg
   * @param {string} fn
   * @param {!Object} context
   * @return {?}
   */
  function invokeArrayArg(arg, fn, context) {
    return Array.isArray(arg) ? (each(arg, context[fn], context), true) : false;
  }
  /**
   * @param {!Object} array
   * @param {!Function} fn
   * @param {!Object} context
   * @return {undefined}
   */
  function each(array, fn, context) {
    var i;
    if (array) {
      if (array.forEach) {
        array.forEach(fn, context);
      } else {
        if (array.length !== undefined) {
          /** @type {number} */
          i = 0;
          for (; i < array.length;) {
            fn.call(context, array[i], i, array);
            i++;
          }
        } else {
          for (i in array) {
            if (array.hasOwnProperty(i)) {
              fn.call(context, array[i], i, array);
            }
          }
        }
      }
    }
  }
  /**
   * @param {!Function} callback
   * @param {string} fn
   * @param {string} deprecationWarning
   * @return {?}
   */
  function deprecate(callback, fn, deprecationWarning) {
    /** @type {string} */
    var s = "DEPRECATED METHOD: " + fn + "\n" + deprecationWarning + " AT \n";
    return function() {
      /** @type {!Error} */
      var e = new Error("get-stack-trace");
      /** @type {string} */
      var outputElDetails = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace";
      /** @type {function(this:Console, ...*): undefined} */
      var logger = window.console && (window.console.warn || window.console.log);
      return logger && logger.call(window.console, s, outputElDetails), callback.apply(this, arguments);
    };
  }
  /**
   * @param {!Function} child
   * @param {!Function} base
   * @param {?} prototype
   * @return {undefined}
   */
  function inherit(child, base, prototype) {
    var baseP = base.prototype;
    var childP;
    /** @type {!Object} */
    childP = child.prototype = Object.create(baseP);
    /** @type {!Function} */
    childP.constructor = child;
    childP._super = baseP;
    if (prototype) {
      assign(childP, prototype);
    }
  }
  /**
   * @param {!Function} fn
   * @param {?} context
   * @return {?}
   */
  function bindFn(fn, context) {
    return function boundFn() {
      return fn.apply(context, arguments);
    };
  }
  /**
   * @param {!Function} val
   * @param {?} args
   * @return {?}
   */
  function boolOrFn(val, args) {
    return typeof val == string ? val.apply(args ? args[0] || undefined : undefined, args) : val;
  }
  /**
   * @param {?} val1
   * @param {string} val2
   * @return {?}
   */
  function ifUndefined(val1, val2) {
    return val1 === undefined ? val2 : val1;
  }
  /**
   * @param {!Object} task
   * @param {!Function} obj
   * @param {?} fn
   * @return {undefined}
   */
  function addEventListeners(task, obj, fn) {
    each($(obj), function(e) {
      task.addEventListener(e, fn, false);
    });
  }
  /**
   * @param {!Element} target
   * @param {string} events
   * @param {?} callback
   * @return {undefined}
   */
  function removeEventListeners(target, events, callback) {
    each($(events), function(type) {
      target.removeEventListener(type, callback, false);
    });
  }
  /**
   * @param {!Node} parent
   * @param {!Node} node
   * @return {?}
   */
  function hasParent(parent, node) {
    for (; parent;) {
      if (parent == node) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  /**
   * @param {string} str
   * @param {string} find
   * @return {?}
   */
  function inStr(str, find) {
    return str.indexOf(find) > -1;
  }
  /**
   * @param {string} id
   * @return {?}
   */
  function $(id) {
    return id.trim().split(/\s+/g);
  }
  /**
   * @param {!Array} src
   * @param {?} find
   * @param {string} findByKey
   * @return {?}
   */
  function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
      return src.indexOf(find);
    }
    /** @type {number} */
    var i = 0;
    for (; i < src.length;) {
      if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
        return i;
      }
      i++;
    }
    return -1;
  }
  /**
   * @param {?} elemntList
   * @return {?}
   */
  function toArray(elemntList) {
    return Array.prototype.slice.call(elemntList, 0);
  }
  /**
   * @param {!NodeList} array
   * @param {string} key
   * @param {boolean} next
   * @return {?}
   */
  function build(array, key, next) {
    /** @type {!Array} */
    var result = [];
    /** @type {!Array} */
    var values = [];
    /** @type {number} */
    var i = 0;
    for (; i < array.length;) {
      var val = key ? array[i][key] : array[i];
      if (inArray(values, val) < 0) {
        result.push(array[i]);
      }
      values[i] = val;
      i++;
    }
    return next && (result = key ? result.sort(function userToGroup(group, user) {
      return group[key] > user[key];
    }) : result.sort()), result;
  }
  /**
   * @param {!Object} elem
   * @param {string} property
   * @return {?}
   */
  function prefixed(elem, property) {
    var prefix;
    var prop;
    var id = property[0].toUpperCase() + property.slice(1);
    /** @type {number} */
    var i = 0;
    for (; i < VENDOR_PREFIXES.length;) {
      if (prefix = VENDOR_PREFIXES[i], prop = prefix ? prefix + id : property, prop in elem) {
        return prop;
      }
      i++;
    }
    return undefined;
  }
  /**
   * @return {?}
   */
  function uniqueId() {
    return Et++;
  }
  /**
   * @param {!Node} element
   * @return {?}
   */
  function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return doc.defaultView || doc.parentWindow || window;
  }
  /**
   * @param {?} manager
   * @param {!Function} callback
   * @return {undefined}
   */
  function Input(manager, callback) {
    var shortcut = this;
    this.manager = manager;
    /** @type {!Function} */
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;
    /**
     * @param {!Object} ev
     * @return {undefined}
     */
    this.domHandler = function(ev) {
      if (boolOrFn(manager.options.enable, [manager])) {
        shortcut.handler(ev);
      }
    };
    this.init();
  }
  /**
   * @param {!Object} manager
   * @return {?}
   */
  function createInputInstance(manager) {
    var _minsnap;
    var snap = manager.options.inputClass;
    return new (_minsnap = snap ? snap : rawDataIsArray ? PointerEventInput : rawDataIsList ? TouchInput : IS_TOUCH_ENABLED ? TouchMouseInput : MouseInput)(manager, inputHandler);
  }
  /**
   * @param {?} manager
   * @param {string} eventType
   * @param {!Object} input
   * @return {undefined}
   */
  function inputHandler(manager, eventType, input) {
    var maxNrStages = input.pointers.length;
    var nrStages = input.changedPointers.length;
    /** @type {(boolean|number)} */
    var r = eventType & INPUT_START && maxNrStages - nrStages === 0;
    /** @type {(boolean|number)} */
    var o = eventType & (INPUT_END | INPUT_CANCEL) && maxNrStages - nrStages === 0;
    /** @type {boolean} */
    input.isFirst = !!r;
    /** @type {boolean} */
    input.isFinal = !!o;
    if (r) {
      manager.session = {};
    }
    /** @type {string} */
    input.eventType = eventType;
    computeInputData(manager, input);
    manager.emit("hammer.input", input);
    manager.recognize(input);
    /** @type {!Object} */
    manager.session.prevInput = input;
  }
  /**
   * @param {!Object} manager
   * @param {!Object} input
   * @return {undefined}
   */
  function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;
    if (!session.firstInput) {
      session.firstInput = simpleCloneInputData(input);
    }
    if (pointersLength > 1 && !session.firstMultiple) {
      session.firstMultiple = simpleCloneInputData(input);
    } else {
      if (1 === pointersLength) {
        /** @type {boolean} */
        session.firstMultiple = false;
      }
    }
    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
    var center = input.center = getCenter(pointers);
    /** @type {number} */
    input.timeStamp = now();
    /** @type {number} */
    input.deltaTime = input.timeStamp - firstInput.timeStamp;
    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);
    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);
    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
    input.maxPointers = session.prevInput ? input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers : input.pointers.length;
    computeIntervalInputData(session, input);
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
      target = input.srcEvent.target;
    }
    input.target = target;
  }
  /**
   * @param {?} session
   * @param {!Object} input
   * @return {undefined}
   */
  function computeDeltaXY(session, input) {
    var c = input.center;
    var b = session.offsetDelta || {};
    var xhair = session.prevDelta || {};
    var prevInput = session.prevInput || {};
    if (!(input.eventType !== INPUT_START && prevInput.eventType !== INPUT_END)) {
      xhair = session.prevDelta = {
        x : prevInput.deltaX || 0,
        y : prevInput.deltaY || 0
      };
      b = session.offsetDelta = {
        x : c.x,
        y : c.y
      };
    }
    input.deltaX = xhair.x + (c.x - b.x);
    input.deltaY = xhair.y + (c.y - b.y);
  }
  /**
   * @param {!Object} session
   * @param {!Object} input
   * @return {undefined}
   */
  function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input;
    /** @type {number} */
    var deltaTime = input.timeStamp - last.timeStamp;
    var velocity;
    var velocityX;
    var velocityY;
    var direction;
    if (input.eventType != INPUT_CANCEL && (deltaTime > CAL_INTERVAL || last.velocity === undefined)) {
      /** @type {number} */
      var deltaX = input.deltaX - last.deltaX;
      /** @type {number} */
      var deltaY = input.deltaY - last.deltaY;
      var v = getVelocity(deltaTime, deltaX, deltaY);
      velocityX = v.x;
      velocityY = v.y;
      velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
      direction = getDirection(deltaX, deltaY);
      /** @type {!Object} */
      session.lastInterval = input;
    } else {
      velocity = last.velocity;
      velocityX = last.velocityX;
      velocityY = last.velocityY;
      direction = last.direction;
    }
    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
  }
  /**
   * @param {!Object} input
   * @return {?}
   */
  function simpleCloneInputData(input) {
    /** @type {!Array} */
    var pointers = [];
    /** @type {number} */
    var i = 0;
    for (; i < input.pointers.length;) {
      pointers[i] = {
        clientX : round(input.pointers[i].clientX),
        clientY : round(input.pointers[i].clientY)
      };
      i++;
    }
    return {
      timeStamp : now(),
      pointers : pointers,
      center : getCenter(pointers),
      deltaX : input.deltaX,
      deltaY : input.deltaY
    };
  }
  /**
   * @param {!Array} pointers
   * @return {?}
   */
  function getCenter(pointers) {
    var pointersLength = pointers.length;
    if (1 === pointersLength) {
      return {
        x : round(pointers[0].clientX),
        y : round(pointers[0].clientY)
      };
    }
    /** @type {number} */
    var x = 0;
    /** @type {number} */
    var y = 0;
    /** @type {number} */
    var i = 0;
    for (; pointersLength > i;) {
      x = x + pointers[i].clientX;
      y = y + pointers[i].clientY;
      i++;
    }
    return {
      x : round(x / pointersLength),
      y : round(y / pointersLength)
    };
  }
  /**
   * @param {number} deltaTime
   * @param {number} x
   * @param {number} y
   * @return {?}
   */
  function getVelocity(deltaTime, x, y) {
    return {
      x : x / deltaTime || 0,
      y : y / deltaTime || 0
    };
  }
  /**
   * @param {number} x
   * @param {number} y
   * @return {?}
   */
  function getDirection(x, y) {
    return x === y ? DIRECTION_NONE : abs(x) >= abs(y) ? 0 > x ? left : right : 0 > y ? DIRECTION_UP : DIRECTION_DOWN;
  }
  /**
   * @param {?} p1
   * @param {?} p2
   * @param {!Array} props
   * @return {?}
   */
  function getDistance(p1, p2, props) {
    if (!props) {
      /** @type {!Array} */
      props = PROPS_XY;
    }
    /** @type {number} */
    var lightI = p2[props[0]] - p1[props[0]];
    /** @type {number} */
    var lightJ = p2[props[1]] - p1[props[1]];
    return Math.sqrt(lightI * lightI + lightJ * lightJ);
  }
  /**
   * @param {?} p1
   * @param {?} p2
   * @param {!Array} props
   * @return {?}
   */
  function getAngle(p1, p2, props) {
    if (!props) {
      /** @type {!Array} */
      props = PROPS_XY;
    }
    /** @type {number} */
    var mouseStartXFromCentre = p2[props[0]] - p1[props[0]];
    /** @type {number} */
    var trueAnomalyY = p2[props[1]] - p1[props[1]];
    return 180 * Math.atan2(trueAnomalyY, mouseStartXFromCentre) / Math.PI;
  }
  /**
   * @param {!Object} start
   * @param {!Object} end
   * @return {?}
   */
  function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
  }
  /**
   * @param {!Object} start
   * @param {!Object} end
   * @return {?}
   */
  function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
  }
  /**
   * @return {undefined}
   */
  function MouseInput() {
    /** @type {string} */
    this.evEl = MOUSE_ELEMENT_EVENTS;
    /** @type {string} */
    this.evWin = POINTER_WINDOW_EVENTS;
    /** @type {boolean} */
    this.pressed = false;
    Input.apply(this, arguments);
  }
  /**
   * @return {undefined}
   */
  function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;
    Input.apply(this, arguments);
    /** @type {!Array} */
    this.store = this.manager.session.pointerEvents = [];
  }
  /**
   * @return {undefined}
   */
  function SingleTouchInput() {
    /** @type {string} */
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    /** @type {string} */
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    /** @type {boolean} */
    this.started = false;
    Input.apply(this, arguments);
  }
  /**
   * @param {!Event} e
   * @param {number} type
   * @return {?}
   */
  function f(e, type) {
    var result = toArray(e.touches);
    var i = toArray(e.changedTouches);
    return type & (INPUT_END | INPUT_CANCEL) && (result = build(result.concat(i), "identifier", true)), [result, i];
  }
  /**
   * @return {undefined}
   */
  function TouchInput() {
    /** @type {string} */
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};
    Input.apply(this, arguments);
  }
  /**
   * @param {!Event} e
   * @param {number} type
   * @return {?}
   */
  function getTouches(e, type) {
    var allTouches = toArray(e.touches);
    var targetIds = this.targetIds;
    if (type & (INPUT_START | INPUT_MOVE) && 1 === allTouches.length) {
      return targetIds[allTouches[0].identifier] = true, [allTouches, allTouches];
    }
    var i;
    var columns;
    var args = toArray(e.changedTouches);
    /** @type {!Array} */
    var path = [];
    var target = this.target;
    if (columns = allTouches.filter(function(touch) {
      return hasParent(touch.target, target);
    }), type === INPUT_START) {
      /** @type {number} */
      i = 0;
      for (; i < columns.length;) {
        /** @type {boolean} */
        targetIds[columns[i].identifier] = true;
        i++;
      }
    }
    /** @type {number} */
    i = 0;
    for (; i < args.length;) {
      if (targetIds[args[i].identifier]) {
        path.push(args[i]);
      }
      if (type & (INPUT_END | INPUT_CANCEL)) {
        delete targetIds[args[i].identifier];
      }
      i++;
    }
    return path.length ? [build(columns.concat(path), "identifier", true), path] : void 0;
  }
  /**
   * @return {undefined}
   */
  function TouchMouseInput() {
    Input.apply(this, arguments);
    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);
    /** @type {null} */
    this.primaryTouch = null;
    /** @type {!Array} */
    this.lastTouches = [];
  }
  /**
   * @param {number} eventType
   * @param {!Object} eventData
   * @return {undefined}
   */
  function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
      this.primaryTouch = eventData.changedPointers[0].identifier;
      setLastTouch.call(this, eventData);
    } else {
      if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
      }
    }
  }
  /**
   * @param {!Object} eventData
   * @return {undefined}
   */
  function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];
    if (touch.identifier === this.primaryTouch) {
      var lastTouch = {
        x : touch.clientX,
        y : touch.clientY
      };
      this.lastTouches.push(lastTouch);
      var lts = this.lastTouches;
      /**
       * @return {undefined}
       */
      var removeLastTouch = function() {
        var i = lts.indexOf(lastTouch);
        if (i > -1) {
          lts.splice(i, 1);
        }
      };
      setTimeout(removeLastTouch, ngiScroll_timeout);
    }
  }
  /**
   * @param {!Object} eventData
   * @return {?}
   */
  function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX;
    var y = eventData.srcEvent.clientY;
    /** @type {number} */
    var i = 0;
    for (; i < this.lastTouches.length; i++) {
      var t = this.lastTouches[i];
      /** @type {number} */
      var r = Math.abs(x - t.x);
      /** @type {number} */
      var b = Math.abs(y - t.y);
      if (g >= r && g >= b) {
        return true;
      }
    }
    return false;
  }
  /**
   * @param {?} manager
   * @param {undefined} value
   * @return {undefined}
   */
  function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
  }
  /**
   * @param {string} actions
   * @return {?}
   */
  function cleanTouchActions(actions) {
    if (inStr(actions, TOUCH_ACTION_NONE)) {
      return TOUCH_ACTION_NONE;
    }
    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
    return hasPanX && hasPanY ? TOUCH_ACTION_NONE : hasPanX || hasPanY ? hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y : inStr(actions, TOUCH_ACTION_MANIPULATION) ? TOUCH_ACTION_MANIPULATION : peg$c206;
  }
  /**
   * @return {?}
   */
  function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
      return false;
    }
    var touchMap = {};
    /** @type {(function(this:CSSInterface, string, string=): boolean|null)} */
    var cssSupports = window.CSS && window.CSS.supports;
    return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(val) {
      /** @type {boolean} */
      touchMap[val] = cssSupports ? window.CSS.supports("touch-action", val) : true;
    }), touchMap;
  }
  /**
   * @param {number} options
   * @return {undefined}
   */
  function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});
    this.id = uniqueId();
    /** @type {null} */
    this.manager = null;
    this.options.enable = ifUndefined(this.options.enable, true);
    /** @type {number} */
    this.state = STATE_POSSIBLE;
    this.simultaneous = {};
    /** @type {!Array} */
    this.requireFail = [];
  }
  /**
   * @param {number} state
   * @return {?}
   */
  function stateStr(state) {
    return state & STATE_CANCELLED ? "cancel" : state & STATE_ENDED ? "end" : state & STATE_CHANGED ? "move" : state & STATE_BEGAN ? "start" : "";
  }
  /**
   * @param {number} direction
   * @return {?}
   */
  function directionStr(direction) {
    return direction == DIRECTION_DOWN ? "down" : direction == DIRECTION_UP ? "up" : direction == left ? "left" : direction == right ? "right" : "";
  }
  /**
   * @param {?} otherRecognizer
   * @param {!Window} recognizer
   * @return {?}
   */
  function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    return manager ? manager.get(otherRecognizer) : otherRecognizer;
  }
  /**
   * @return {undefined}
   */
  function AttrRecognizer() {
    Recognizer.apply(this, arguments);
  }
  /**
   * @return {undefined}
   */
  function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);
    /** @type {null} */
    this.pX = null;
    /** @type {null} */
    this.pY = null;
  }
  /**
   * @return {undefined}
   */
  function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
  }
  /**
   * @return {undefined}
   */
  function PressRecognizer() {
    Recognizer.apply(this, arguments);
    /** @type {null} */
    this._timer = null;
    /** @type {null} */
    this._input = null;
  }
  /**
   * @return {undefined}
   */
  function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
  }
  /**
   * @return {undefined}
   */
  function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
  }
  /**
   * @return {undefined}
   */
  function TapRecognizer() {
    Recognizer.apply(this, arguments);
    /** @type {boolean} */
    this.pTime = false;
    /** @type {boolean} */
    this.pCenter = false;
    /** @type {null} */
    this._timer = null;
    /** @type {null} */
    this._input = null;
    /** @type {number} */
    this.count = 0;
  }
  /**
   * @param {string} element
   * @param {!Object} options
   * @return {?}
   */
  function Hammer(element, options) {
    return options = options || {}, options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset), new Manager(element, options);
  }
  /**
   * @param {!HTMLElement} element
   * @param {number} options
   * @return {undefined}
   */
  function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});
    this.options.inputTarget = this.options.inputTarget || element;
    this.handlers = {};
    this.session = {};
    /** @type {!Array} */
    this.recognizers = [];
    this.oldCssProps = {};
    /** @type {!HTMLElement} */
    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);
    toggleCssProps(this, true);
    each(this.options.recognizers, function(item) {
      var recognizer = this.add(new item[0](item[1]));
      if (item[2]) {
        recognizer.recognizeWith(item[2]);
      }
      if (item[3]) {
        recognizer.requireFailure(item[3]);
      }
    }, this);
  }
  /**
   * @param {!Object} manager
   * @param {boolean} add
   * @return {undefined}
   */
  function toggleCssProps(manager, add) {
    var element = manager.element;
    if (element.style) {
      var prop;
      each(manager.options.cssProps, function(cond, name) {
        prop = prefixed(element.style, name);
        if (add) {
          manager.oldCssProps[prop] = element.style[prop];
          /** @type {!Object} */
          element.style[prop] = cond;
        } else {
          element.style[prop] = manager.oldCssProps[prop] || "";
        }
      });
      if (!add) {
        manager.oldCssProps = {};
      }
    }
  }
  /**
   * @param {string} type
   * @param {!Object} data
   * @return {undefined}
   */
  function trigger(type, data) {
    /** @type {(Event|null)} */
    var event = doc.createEvent("Event");
    event.initEvent(type, true, true);
    /** @type {!Object} */
    event.gesture = data;
    data.target.dispatchEvent(event);
  }
  /** @type {!Array} */
  var VENDOR_PREFIXES = ["", "webkit", "Moz", "MS", "ms", "o"];
  /** @type {!Element} */
  var TEST_ELEMENT = doc.createElement("div");
  /** @type {string} */
  var string = "function";
  /** @type {function(?): number} */
  var round = Math.round;
  /** @type {function(?): number} */
  var abs = Math.abs;
  /** @type {function(): number} */
  var now = Date.now;
  var assign;
  /** @type {!Function} */
  assign = "function" != typeof Object.assign ? function defineObservableProperties(target) {
    if (target === undefined || null === target) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    /** @type {!Object} */
    var obj = Object(target);
    /** @type {number} */
    var i = 1;
    for (; i < arguments.length; i++) {
      var val = arguments[i];
      if (val !== undefined && null !== val) {
        var i;
        for (i in val) {
          if (val.hasOwnProperty(i)) {
            obj[i] = val[i];
          }
        }
      }
    }
    return obj;
  } : Object.assign;
  var extend = deprecate(function seekObject(data, items, key) {
    /** @type {!Array<string>} */
    var rows = Object.keys(items);
    /** @type {number} */
    var i = 0;
    for (; i < rows.length;) {
      if (!key || key && data[rows[i]] === undefined) {
        data[rows[i]] = items[rows[i]];
      }
      i++;
    }
    return data;
  }, "extend", "Use `assign`.");
  var merge = deprecate(function userToGroup(group, user) {
    return extend(group, user, true);
  }, "merge", "Use `assign`.");
  /** @type {number} */
  var Et = 1;
  /** @type {!RegExp} */
  var FIREFOX_LINUX = /mobile|tablet|ip(ad|hone|od)|android/i;
  /** @type {boolean} */
  var IS_TOUCH_ENABLED = "ontouchstart" in window;
  /** @type {boolean} */
  var rawDataIsArray = prefixed(window, "PointerEvent") !== undefined;
  /** @type {boolean} */
  var rawDataIsList = IS_TOUCH_ENABLED && FIREFOX_LINUX.test(navigator.userAgent);
  /** @type {string} */
  var INPUT_TYPE_TOUCH = "touch";
  /** @type {string} */
  var INPUT_TYPE_PEN = "pen";
  /** @type {string} */
  var INPUT_TYPE_MOUSE = "mouse";
  /** @type {string} */
  var INPUT_TYPE_KINECT = "kinect";
  /** @type {number} */
  var CAL_INTERVAL = 25;
  /** @type {number} */
  var INPUT_START = 1;
  /** @type {number} */
  var INPUT_MOVE = 2;
  /** @type {number} */
  var INPUT_END = 4;
  /** @type {number} */
  var INPUT_CANCEL = 8;
  /** @type {number} */
  var DIRECTION_NONE = 1;
  /** @type {number} */
  var left = 2;
  /** @type {number} */
  var right = 4;
  /** @type {number} */
  var DIRECTION_UP = 8;
  /** @type {number} */
  var DIRECTION_DOWN = 16;
  /** @type {number} */
  var DIRECTION_HORIZONTAL = left | right;
  /** @type {number} */
  var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
  /** @type {number} */
  var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
  /** @type {!Array} */
  var PROPS_XY = ["x", "y"];
  /** @type {!Array} */
  var PROPS_CLIENT_XY = ["clientX", "clientY"];
  Input.prototype = {
    handler : function() {
    },
    init : function() {
      if (this.evEl) {
        addEventListeners(this.element, this.evEl, this.domHandler);
      }
      if (this.evTarget) {
        addEventListeners(this.target, this.evTarget, this.domHandler);
      }
      if (this.evWin) {
        addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
      }
    },
    destroy : function() {
      if (this.evEl) {
        removeEventListeners(this.element, this.evEl, this.domHandler);
      }
      if (this.evTarget) {
        removeEventListeners(this.target, this.evTarget, this.domHandler);
      }
      if (this.evWin) {
        removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
      }
    }
  };
  var MOUSE_INPUT_MAP = {
    mousedown : INPUT_START,
    mousemove : INPUT_MOVE,
    mouseup : INPUT_END
  };
  /** @type {string} */
  var MOUSE_ELEMENT_EVENTS = "mousedown";
  /** @type {string} */
  var POINTER_WINDOW_EVENTS = "mousemove mouseup";
  inherit(MouseInput, Input, {
    handler : function MEhandler(ev) {
      var eventType = MOUSE_INPUT_MAP[ev.type];
      if (eventType & INPUT_START && 0 === ev.button) {
        /** @type {boolean} */
        this.pressed = true;
      }
      if (eventType & INPUT_MOVE && 1 !== ev.which) {
        /** @type {number} */
        eventType = INPUT_END;
      }
      if (this.pressed) {
        if (eventType & INPUT_END) {
          /** @type {boolean} */
          this.pressed = false;
        }
        this.callback(this.manager, eventType, {
          pointers : [ev],
          changedPointers : [ev],
          pointerType : INPUT_TYPE_MOUSE,
          srcEvent : ev
        });
      }
    }
  });
  var POINTER_INPUT_MAP = {
    pointerdown : INPUT_START,
    pointermove : INPUT_MOVE,
    pointerup : INPUT_END,
    pointercancel : INPUT_CANCEL,
    pointerout : INPUT_CANCEL
  };
  var IE10_POINTER_TYPE_ENUM = {
    2 : INPUT_TYPE_TOUCH,
    3 : INPUT_TYPE_PEN,
    4 : INPUT_TYPE_MOUSE,
    5 : INPUT_TYPE_KINECT
  };
  /** @type {string} */
  var POINTER_ELEMENT_EVENTS = "pointerdown";
  /** @type {string} */
  var MOUSE_WINDOW_EVENTS = "pointermove pointerup pointercancel";
  if (window.MSPointerEvent && !window.PointerEvent) {
    /** @type {string} */
    POINTER_ELEMENT_EVENTS = "MSPointerDown";
    /** @type {string} */
    MOUSE_WINDOW_EVENTS = "MSPointerMove MSPointerUp MSPointerCancel";
  }
  inherit(PointerEventInput, Input, {
    handler : function PEhandler(ev) {
      var store = this.store;
      /** @type {boolean} */
      var i = false;
      var eventTypeNormalized = ev.type.toLowerCase().replace("ms", "");
      var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
      var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
      /** @type {boolean} */
      var isTouch = pointerType == INPUT_TYPE_TOUCH;
      var storeIndex = inArray(store, ev.pointerId, "pointerId");
      if (eventType & INPUT_START && (0 === ev.button || isTouch)) {
        if (0 > storeIndex) {
          store.push(ev);
          /** @type {number} */
          storeIndex = store.length - 1;
        }
      } else {
        if (eventType & (INPUT_END | INPUT_CANCEL)) {
          /** @type {boolean} */
          i = true;
        }
      }
      if (!(0 > storeIndex)) {
        /** @type {!Object} */
        store[storeIndex] = ev;
        this.callback(this.manager, eventType, {
          pointers : store,
          changedPointers : [ev],
          pointerType : pointerType,
          srcEvent : ev
        });
        if (i) {
          store.splice(storeIndex, 1);
        }
      }
    }
  });
  var map = {
    touchstart : INPUT_START,
    touchmove : INPUT_MOVE,
    touchend : INPUT_END,
    touchcancel : INPUT_CANCEL
  };
  /** @type {string} */
  var SINGLE_TOUCH_TARGET_EVENTS = "touchstart";
  /** @type {string} */
  var SINGLE_TOUCH_WINDOW_EVENTS = "touchstart touchmove touchend touchcancel";
  inherit(SingleTouchInput, Input, {
    handler : function TEhandler(event) {
      var type = map[event.type];
      if (type === INPUT_START && (this.started = true), this.started) {
        var touches = f.call(this, event, type);
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
          /** @type {boolean} */
          this.started = false;
        }
        this.callback(this.manager, type, {
          pointers : touches[0],
          changedPointers : touches[1],
          pointerType : INPUT_TYPE_TOUCH,
          srcEvent : event
        });
      }
    }
  });
  var SINGLE_TOUCH_INPUT_MAP = {
    touchstart : INPUT_START,
    touchmove : INPUT_MOVE,
    touchend : INPUT_END,
    touchcancel : INPUT_CANCEL
  };
  /** @type {string} */
  var TOUCH_TARGET_EVENTS = "touchstart touchmove touchend touchcancel";
  inherit(TouchInput, Input, {
    handler : function evhan_input_mouse_click(ev) {
      var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
      var touches = getTouches.call(this, ev, type);
      if (touches) {
        this.callback(this.manager, type, {
          pointers : touches[0],
          changedPointers : touches[1],
          pointerType : INPUT_TYPE_TOUCH,
          srcEvent : ev
        });
      }
    }
  });
  /** @type {number} */
  var ngiScroll_timeout = 2500;
  /** @type {number} */
  var g = 25;
  inherit(TouchMouseInput, Input, {
    handler : function TMEhandler(manager, inputEvent, inputData) {
      /** @type {boolean} */
      var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH;
      /** @type {boolean} */
      var isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;
      if (!(isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents)) {
        if (isTouch) {
          recordTouches.call(this, inputEvent, inputData);
        } else {
          if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
          }
        }
        this.callback(manager, inputEvent, inputData);
      }
    },
    destroy : function componentWillUnmount() {
      this.touch.destroy();
      this.mouse.destroy();
    }
  });
  var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, "touchAction");
  /** @type {boolean} */
  var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;
  /** @type {string} */
  var TOUCH_ACTION_COMPUTE = "compute";
  /** @type {string} */
  var peg$c206 = "auto";
  /** @type {string} */
  var TOUCH_ACTION_MANIPULATION = "manipulation";
  /** @type {string} */
  var TOUCH_ACTION_NONE = "none";
  /** @type {string} */
  var TOUCH_ACTION_PAN_X = "pan-x";
  /** @type {string} */
  var TOUCH_ACTION_PAN_Y = "pan-y";
  var TOUCH_ACTION_MAP = getTouchActionProps();
  TouchAction.prototype = {
    set : function(value) {
      if (value == TOUCH_ACTION_COMPUTE) {
        value = this.compute();
      }
      if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
        /** @type {string} */
        this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
      }
      this.actions = value.toLowerCase().trim();
    },
    update : function() {
      this.set(this.manager.options.touchAction);
    },
    compute : function() {
      /** @type {!Array} */
      var sortedFolderIds = [];
      return each(this.manager.recognizers, function(recognizer) {
        if (boolOrFn(recognizer.options.enable, [recognizer])) {
          sortedFolderIds = sortedFolderIds.concat(recognizer.getTouchAction());
        }
      }), cleanTouchActions(sortedFolderIds.join(" "));
    },
    preventDefaults : function(input) {
      var srcEvent = input.srcEvent;
      var direction = input.offsetDirection;
      if (this.manager.session.prevented) {
        return void srcEvent.preventDefault();
      }
      var actions = this.actions;
      var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
      var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
      var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];
      if (hasNone) {
        /** @type {boolean} */
        var a = 1 === input.pointers.length;
        /** @type {boolean} */
        var b = input.distance < 2;
        /** @type {boolean} */
        var div = input.deltaTime < 250;
        if (a && b && div) {
          return;
        }
      }
      return hasPanX && hasPanY ? void 0 : hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL ? this.preventSrc(srcEvent) : void 0;
    },
    preventSrc : function(srcEvent) {
      /** @type {boolean} */
      this.manager.session.prevented = true;
      srcEvent.preventDefault();
    }
  };
  /** @type {number} */
  var STATE_POSSIBLE = 1;
  /** @type {number} */
  var STATE_BEGAN = 2;
  /** @type {number} */
  var STATE_CHANGED = 4;
  /** @type {number} */
  var STATE_ENDED = 8;
  /** @type {number} */
  var STATE_RECOGNIZED = STATE_ENDED;
  /** @type {number} */
  var STATE_CANCELLED = 16;
  /** @type {number} */
  var STATE_FAILED = 32;
  Recognizer.prototype = {
    defaults : {},
    set : function(t) {
      return assign(this.options, t), this.manager && this.manager.touchAction.update(), this;
    },
    recognizeWith : function(otherRecognizer) {
      if (invokeArrayArg(otherRecognizer, "recognizeWith", this)) {
        return this;
      }
      var simultaneous = this.simultaneous;
      return otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this), simultaneous[otherRecognizer.id] || (simultaneous[otherRecognizer.id] = otherRecognizer, otherRecognizer.recognizeWith(this)), this;
    },
    dropRecognizeWith : function(otherRecognizer) {
      return invokeArrayArg(otherRecognizer, "dropRecognizeWith", this) ? this : (otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this), delete this.simultaneous[otherRecognizer.id], this);
    },
    requireFailure : function(otherRecognizer) {
      if (invokeArrayArg(otherRecognizer, "requireFailure", this)) {
        return this;
      }
      var requireFail = this.requireFail;
      return otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this), -1 === inArray(requireFail, otherRecognizer) && (requireFail.push(otherRecognizer), otherRecognizer.requireFailure(this)), this;
    },
    dropRequireFailure : function(otherRecognizer) {
      if (invokeArrayArg(otherRecognizer, "dropRequireFailure", this)) {
        return this;
      }
      otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
      var index = inArray(this.requireFail, otherRecognizer);
      return index > -1 && this.requireFail.splice(index, 1), this;
    },
    hasRequireFailures : function() {
      return this.requireFail.length > 0;
    },
    canRecognizeWith : function(otherRecognizer) {
      return !!this.simultaneous[otherRecognizer.id];
    },
    emit : function(input) {
      /**
       * @param {undefined} name
       * @return {undefined}
       */
      function emit(name) {
        that.manager.emit(name, input);
      }
      var that = this;
      var state = this.state;
      if (STATE_ENDED > state) {
        emit(that.options.event + stateStr(state));
      }
      emit(that.options.event);
      if (input.additionalEvent) {
        emit(input.additionalEvent);
      }
      if (state >= STATE_ENDED) {
        emit(that.options.event + stateStr(state));
      }
    },
    tryEmit : function(input) {
      return this.canEmit() ? this.emit(input) : void(this.state = STATE_FAILED);
    },
    canEmit : function() {
      /** @type {number} */
      var i = 0;
      for (; i < this.requireFail.length;) {
        if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
          return false;
        }
        i++;
      }
      return true;
    },
    recognize : function(inputData) {
      var inputDataClone = assign({}, inputData);
      return boolOrFn(this.options.enable, [this, inputDataClone]) ? (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED) && (this.state = STATE_POSSIBLE), this.state = this.process(inputDataClone), void(this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED) && this.tryEmit(inputDataClone))) : (this.reset(), void(this.state = STATE_FAILED));
    },
    process : function(input) {
    },
    getTouchAction : function() {
    },
    reset : function() {
    }
  };
  inherit(AttrRecognizer, Recognizer, {
    defaults : {
      pointers : 1
    },
    attrTest : function(input) {
      var optionPointers = this.options.pointers;
      return 0 === optionPointers || input.pointers.length === optionPointers;
    },
    process : function(input) {
      var state = this.state;
      var eventType = input.eventType;
      /** @type {number} */
      var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
      var isValid = this.attrTest(input);
      return isRecognized && (eventType & INPUT_CANCEL || !isValid) ? state | STATE_CANCELLED : isRecognized || isValid ? eventType & INPUT_END ? state | STATE_ENDED : state & STATE_BEGAN ? state | STATE_CHANGED : STATE_BEGAN : STATE_FAILED;
    }
  });
  inherit(PanRecognizer, AttrRecognizer, {
    defaults : {
      event : "pan",
      threshold : 10,
      pointers : 1,
      direction : DIRECTION_ALL
    },
    getTouchAction : function() {
      var direction = this.options.direction;
      /** @type {!Array} */
      var actions = [];
      return direction & DIRECTION_HORIZONTAL && actions.push(TOUCH_ACTION_PAN_Y), direction & DIRECTION_VERTICAL && actions.push(TOUCH_ACTION_PAN_X), actions;
    },
    directionTest : function(input) {
      var options = this.options;
      /** @type {boolean} */
      var hasMoved = true;
      var distance = input.distance;
      var direction = input.direction;
      var x = input.deltaX;
      var y = input.deltaY;
      return direction & options.direction || (options.direction & DIRECTION_HORIZONTAL ? (direction = 0 === x ? DIRECTION_NONE : 0 > x ? left : right, hasMoved = x != this.pX, distance = Math.abs(input.deltaX)) : (direction = 0 === y ? DIRECTION_NONE : 0 > y ? DIRECTION_UP : DIRECTION_DOWN, hasMoved = y != this.pY, distance = Math.abs(input.deltaY))), input.direction = direction, hasMoved && distance > options.threshold && direction & options.direction;
    },
    attrTest : function(input) {
      return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
    },
    emit : function(input) {
      this.pX = input.deltaX;
      this.pY = input.deltaY;
      var direction = directionStr(input.direction);
      if (direction) {
        input.additionalEvent = this.options.event + direction;
      }
      this._super.emit.call(this, input);
    }
  });
  inherit(PinchRecognizer, AttrRecognizer, {
    defaults : {
      event : "pinch",
      threshold : 0,
      pointers : 2
    },
    getTouchAction : function() {
      return [TOUCH_ACTION_NONE];
    },
    attrTest : function(input) {
      return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },
    emit : function(input) {
      if (1 !== input.scale) {
        /** @type {string} */
        var inOut = input.scale < 1 ? "in" : "out";
        /** @type {string} */
        input.additionalEvent = this.options.event + inOut;
      }
      this._super.emit.call(this, input);
    }
  });
  inherit(PressRecognizer, Recognizer, {
    defaults : {
      event : "press",
      pointers : 1,
      time : 251,
      threshold : 9
    },
    getTouchAction : function() {
      return [peg$c206];
    },
    process : function(input) {
      var options = this.options;
      /** @type {boolean} */
      var m = input.pointers.length === options.pointers;
      /** @type {boolean} */
      var n = input.distance < options.threshold;
      /** @type {boolean} */
      var r = input.deltaTime > options.time;
      if (this._input = input, !n || !m || input.eventType & (INPUT_END | INPUT_CANCEL) && !r) {
        this.reset();
      } else {
        if (input.eventType & INPUT_START) {
          this.reset();
          this._timer = setTimeoutContext(function() {
            /** @type {number} */
            this.state = STATE_RECOGNIZED;
            this.tryEmit();
          }, options.time, this);
        } else {
          if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
          }
        }
      }
      return STATE_FAILED;
    },
    reset : function() {
      clearTimeout(this._timer);
    },
    emit : function(input) {
      if (this.state === STATE_RECOGNIZED) {
        if (input && input.eventType & INPUT_END) {
          this.manager.emit(this.options.event + "up", input);
        } else {
          /** @type {number} */
          this._input.timeStamp = now();
          this.manager.emit(this.options.event, this._input);
        }
      }
    }
  });
  inherit(RotateRecognizer, AttrRecognizer, {
    defaults : {
      event : "rotate",
      threshold : 0,
      pointers : 2
    },
    getTouchAction : function() {
      return [TOUCH_ACTION_NONE];
    },
    attrTest : function(input) {
      return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
  });
  inherit(SwipeRecognizer, AttrRecognizer, {
    defaults : {
      event : "swipe",
      threshold : 10,
      velocity : .3,
      direction : DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
      pointers : 1
    },
    getTouchAction : function() {
      return PanRecognizer.prototype.getTouchAction.call(this);
    },
    attrTest : function(input) {
      var direction = this.options.direction;
      var velocity;
      return direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL) ? velocity = input.overallVelocity : direction & DIRECTION_HORIZONTAL ? velocity = input.overallVelocityX : direction & DIRECTION_VERTICAL && (velocity = input.overallVelocityY), this._super.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers == this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },
    emit : function(input) {
      var direction = directionStr(input.offsetDirection);
      if (direction) {
        this.manager.emit(this.options.event + direction, input);
      }
      this.manager.emit(this.options.event, input);
    }
  });
  inherit(TapRecognizer, Recognizer, {
    defaults : {
      event : "tap",
      pointers : 1,
      taps : 1,
      interval : 300,
      time : 250,
      threshold : 9,
      posThreshold : 10
    },
    getTouchAction : function() {
      return [TOUCH_ACTION_MANIPULATION];
    },
    process : function(input) {
      var options = this.options;
      /** @type {boolean} */
      var duration = input.pointers.length === options.pointers;
      /** @type {boolean} */
      var select = input.distance < options.threshold;
      /** @type {boolean} */
      var value = input.deltaTime < options.time;
      if (this.reset(), input.eventType & INPUT_START && 0 === this.count) {
        return this.failTimeout();
      }
      if (select && value && duration) {
        if (input.eventType != INPUT_END) {
          return this.failTimeout();
        }
        /** @type {boolean} */
        var reverseValue = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
        /** @type {boolean} */
        var reverseIsSingle = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
        this.pTime = input.timeStamp;
        this.pCenter = input.center;
        if (reverseIsSingle && reverseValue) {
          this.count += 1;
        } else {
          /** @type {number} */
          this.count = 1;
        }
        /** @type {!Object} */
        this._input = input;
        /** @type {number} */
        var tapCount = this.count % options.taps;
        if (0 === tapCount) {
          return this.hasRequireFailures() ? (this._timer = setTimeoutContext(function() {
            /** @type {number} */
            this.state = STATE_RECOGNIZED;
            this.tryEmit();
          }, options.interval, this), STATE_BEGAN) : STATE_RECOGNIZED;
        }
      }
      return STATE_FAILED;
    },
    failTimeout : function() {
      return this._timer = setTimeoutContext(function() {
        /** @type {number} */
        this.state = STATE_FAILED;
      }, this.options.interval, this), STATE_FAILED;
    },
    reset : function() {
      clearTimeout(this._timer);
    },
    emit : function() {
      if (this.state == STATE_RECOGNIZED) {
        this._input.tapCount = this.count;
        this.manager.emit(this.options.event, this._input);
      }
    }
  });
  /** @type {string} */
  Hammer.VERSION = "2.0.8";
  Hammer.defaults = {
    domEvents : false,
    touchAction : TOUCH_ACTION_COMPUTE,
    enable : true,
    inputTarget : null,
    inputClass : null,
    preset : [[RotateRecognizer, {
      enable : false
    }], [PinchRecognizer, {
      enable : false
    }, ["rotate"]], [SwipeRecognizer, {
      direction : DIRECTION_HORIZONTAL
    }], [PanRecognizer, {
      direction : DIRECTION_HORIZONTAL
    }, ["swipe"]], [TapRecognizer], [TapRecognizer, {
      event : "doubletap",
      taps : 2
    }, ["tap"]], [PressRecognizer]],
    cssProps : {
      userSelect : "none",
      touchSelect : "none",
      touchCallout : "none",
      contentZooming : "none",
      userDrag : "none",
      tapHighlightColor : "rgba(0,0,0,0)"
    }
  };
  /** @type {number} */
  var STOP = 1;
  /** @type {number} */
  var FORCED_STOP = 2;
  Manager.prototype = {
    set : function(options) {
      return assign(this.options, options), options.touchAction && this.touchAction.update(), options.inputTarget && (this.input.destroy(), this.input.target = options.inputTarget, this.input.init()), this;
    },
    stop : function(force) {
      /** @type {number} */
      this.session.stopped = force ? FORCED_STOP : STOP;
    },
    recognize : function(inputData) {
      var session = this.session;
      if (!session.stopped) {
        this.touchAction.preventDefaults(inputData);
        var recognizer;
        var recognizers = this.recognizers;
        var curRecognizer = session.curRecognizer;
        if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
          /** @type {null} */
          curRecognizer = session.curRecognizer = null;
        }
        /** @type {number} */
        var i = 0;
        for (; i < recognizers.length;) {
          recognizer = recognizers[i];
          if (session.stopped === FORCED_STOP || curRecognizer && recognizer != curRecognizer && !recognizer.canRecognizeWith(curRecognizer)) {
            recognizer.reset();
          } else {
            recognizer.recognize(inputData);
          }
          if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
            curRecognizer = session.curRecognizer = recognizer;
          }
          i++;
        }
      }
    },
    get : function(recognizer) {
      if (recognizer instanceof Recognizer) {
        return recognizer;
      }
      var recognizers = this.recognizers;
      /** @type {number} */
      var i = 0;
      for (; i < recognizers.length; i++) {
        if (recognizers[i].options.event == recognizer) {
          return recognizers[i];
        }
      }
      return null;
    },
    add : function(recognizer) {
      if (invokeArrayArg(recognizer, "add", this)) {
        return this;
      }
      var existing = this.get(recognizer.options.event);
      return existing && this.remove(existing), this.recognizers.push(recognizer), recognizer.manager = this, this.touchAction.update(), recognizer;
    },
    remove : function(recognizer) {
      if (invokeArrayArg(recognizer, "remove", this)) {
        return this;
      }
      if (recognizer = this.get(recognizer)) {
        var recognizers = this.recognizers;
        var index = inArray(recognizers, recognizer);
        if (-1 !== index) {
          recognizers.splice(index, 1);
          this.touchAction.update();
        }
      }
      return this;
    },
    on : function(b, e) {
      if (b !== undefined && e !== undefined) {
        var handlers = this.handlers;
        return each($(b), function(name) {
          handlers[name] = handlers[name] || [];
          handlers[name].push(e);
        }), this;
      }
    },
    off : function(selector, name) {
      if (selector !== undefined) {
        var handlers = this.handlers;
        return each($(selector), function(event) {
          if (name) {
            if (handlers[event]) {
              handlers[event].splice(inArray(handlers[event], name), 1);
            }
          } else {
            delete handlers[event];
          }
        }), this;
      }
    },
    emit : function(type, data) {
      if (this.options.domEvents) {
        trigger(type, data);
      }
      var urls = this.handlers[type] && this.handlers[type].slice();
      if (urls && urls.length) {
        /** @type {string} */
        data.type = type;
        /**
         * @return {undefined}
         */
        data.preventDefault = function() {
          data.srcEvent.preventDefault();
        };
        /** @type {number} */
        var i = 0;
        for (; i < urls.length;) {
          urls[i](data);
          i++;
        }
      }
    },
    destroy : function() {
      if (this.element) {
        toggleCssProps(this, false);
      }
      this.handlers = {};
      this.session = {};
      this.input.destroy();
      /** @type {null} */
      this.element = null;
    }
  };
  assign(Hammer, {
    INPUT_START : INPUT_START,
    INPUT_MOVE : INPUT_MOVE,
    INPUT_END : INPUT_END,
    INPUT_CANCEL : INPUT_CANCEL,
    STATE_POSSIBLE : STATE_POSSIBLE,
    STATE_BEGAN : STATE_BEGAN,
    STATE_CHANGED : STATE_CHANGED,
    STATE_ENDED : STATE_ENDED,
    STATE_RECOGNIZED : STATE_RECOGNIZED,
    STATE_CANCELLED : STATE_CANCELLED,
    STATE_FAILED : STATE_FAILED,
    DIRECTION_NONE : DIRECTION_NONE,
    DIRECTION_LEFT : left,
    DIRECTION_RIGHT : right,
    DIRECTION_UP : DIRECTION_UP,
    DIRECTION_DOWN : DIRECTION_DOWN,
    DIRECTION_HORIZONTAL : DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL : DIRECTION_VERTICAL,
    DIRECTION_ALL : DIRECTION_ALL,
    Manager : Manager,
    Input : Input,
    TouchAction : TouchAction,
    TouchInput : TouchInput,
    MouseInput : MouseInput,
    PointerEventInput : PointerEventInput,
    TouchMouseInput : TouchMouseInput,
    SingleTouchInput : SingleTouchInput,
    Recognizer : Recognizer,
    AttrRecognizer : AttrRecognizer,
    Tap : TapRecognizer,
    Pan : PanRecognizer,
    Swipe : SwipeRecognizer,
    Pinch : PinchRecognizer,
    Rotate : RotateRecognizer,
    Press : PressRecognizer,
    on : addEventListeners,
    off : removeEventListeners,
    each : each,
    merge : merge,
    extend : extend,
    assign : assign,
    inherit : inherit,
    bindFn : bindFn,
    prefixed : prefixed
  });
  /** @type {(Window|{})} */
  var freeGlobal = "undefined" != typeof window ? window : "undefined" != typeof self ? self : {};
  /** @type {function(string, !Object): ?} */
  freeGlobal.Hammer = Hammer;
  if ("function" == typeof define && define.amd) {
    define(function() {
      return Hammer;
    });
  } else {
    if ("undefined" != typeof module && module.exports) {
      /** @type {function(string, !Object): ?} */
      module.exports = Hammer;
    } else {
      /** @type {function(string, !Object): ?} */
      window[exportName] = Hammer;
    }
  }
}(window, document, "Hammer"), $(document).ready(function() {
  /**
   * @param {number} v
   * @return {undefined}
   */
  function touchEnd(v) {
    var _allTh = $(".side-nav").find(".is-active");
    var e = $(".side-nav").children().index(_allTh);
    /** @type {number} */
    var n = $(".side-nav").children().length - 1;
    /** @type {number} */
    var s = 0;
    if ("swipeup" === v.type || 40 === v.keyCode || v > 0) {
      if (e !== n) {
        s = e + 1;
        next(s);
        i(e, s, n);
      } else {
        next(s);
        i(e, s, n);
      }
    } else {
      if ("swipedown" === v.type || 38 === v.keyCode || 0 > v) {
        if (0 !== e) {
          /** @type {number} */
          s = e - 1;
          next(s);
          i(e, s, n);
        } else {
          /** @type {number} */
          s = n;
          next(s);
          i(e, s, n);
        }
      }
    }
  }
  /**
   * @param {number} i
   * @return {undefined}
   */
  function next(i) {
    $(".side-nav, .outer-nav").children().removeClass("is-active");
    $(".side-nav").children().eq(i).addClass("is-active");
    $(".outer-nav").children().eq(i).addClass("is-active");
  }
  /**
   * @param {number} b
   * @param {number} i
   * @param {number} a
   * @return {undefined}
   */
  function i(b, i, a) {
    $(".main-content").children().removeClass("section--is-active");
    $(".main-content").children().eq(i).addClass("section--is-active");
    $(".main-content .section").children().removeClass("section--next section--prev");
    if (b === a && 0 === i || 0 === b && i === a) {
      $(".main-content .section").children().removeClass("section--next section--prev");
    } else {
      if (i > b) {
        $(".main-content").children().eq(b).children().addClass("section--next");
      } else {
        $(".main-content").children().eq(b).children().addClass("section--prev");
      }
    }
    if (0 !== i && i !== a) {
      $(".header--cta").addClass("is-active");
    } else {
      $(".header--cta").removeClass("is-active");
    }
  }
  /**
   * @return {undefined}
   */
  function newSnippetControls() {
    $(".header--nav-toggle").click(function() {
      $(".perspective").addClass("perspective--modalview");
      setTimeout(function() {
        $(".perspective").addClass("effect-rotate-left--animate");
      }, 25);
      $(".outer-nav, .outer-nav li, .outer-nav--return").addClass("is-vis");
    });
    $(".outer-nav--return, .outer-nav li").click(function() {
      $(".perspective").removeClass("effect-rotate-left--animate");
      setTimeout(function() {
        $(".perspective").removeClass("perspective--modalview");
      }, 400);
      $(".outer-nav, .outer-nav li, .outer-nav--return").removeClass("is-vis");
    });
  }
  /**
   * @return {undefined}
   */
  function createDateTimePicker() {
    $(".slider--prev, .slider--next").click(function() {
      var khover = $(this);
      var _allTh = $(".slider").find(".slider--item-left");
      var sy1 = $(".slider").children().index(_allTh);
      var $newEl = $(".slider").find(".slider--item-center");
      var index = $(".slider").children().index($newEl);
      var app = $(".slider").find(".slider--item-right");
      var o = $(".slider").children().index(app);
      var height = $(".slider").children().length;
      var $music = $(".slider--item-left");
      var $optionsMenu = $(".slider--item-center");
      var $copyFrom = $(".slider--item-right");
      var $allPanels = $(".slider--item");
      $(".slider").animate({
        opacity : 0
      }, 400);
      setTimeout(function() {
        if (khover.hasClass("slider--next")) {
          if (height - 1 > sy1 && height - 1 > index && height - 1 > o) {
            $music.removeClass("slider--item-left").next().addClass("slider--item-left");
            $optionsMenu.removeClass("slider--item-center").next().addClass("slider--item-center");
            $copyFrom.removeClass("slider--item-right").next().addClass("slider--item-right");
          } else {
            if (sy1 === height - 1) {
              $allPanels.removeClass("slider--item-left").first().addClass("slider--item-left");
              $optionsMenu.removeClass("slider--item-center").next().addClass("slider--item-center");
              $copyFrom.removeClass("slider--item-right").next().addClass("slider--item-right");
            } else {
              if (index === height - 1) {
                $music.removeClass("slider--item-left").next().addClass("slider--item-left");
                $allPanels.removeClass("slider--item-center").first().addClass("slider--item-center");
                $copyFrom.removeClass("slider--item-right").next().addClass("slider--item-right");
              } else {
                $music.removeClass("slider--item-left").next().addClass("slider--item-left");
                $optionsMenu.removeClass("slider--item-center").next().addClass("slider--item-center");
                $allPanels.removeClass("slider--item-right").first().addClass("slider--item-right");
              }
            }
          }
        } else {
          if (0 !== sy1 && 0 !== index && 0 !== o) {
            $music.removeClass("slider--item-left").prev().addClass("slider--item-left");
            $optionsMenu.removeClass("slider--item-center").prev().addClass("slider--item-center");
            $copyFrom.removeClass("slider--item-right").prev().addClass("slider--item-right");
          } else {
            if (0 === sy1) {
              $allPanels.removeClass("slider--item-left").last().addClass("slider--item-left");
              $optionsMenu.removeClass("slider--item-center").prev().addClass("slider--item-center");
              $copyFrom.removeClass("slider--item-right").prev().addClass("slider--item-right");
            } else {
              if (0 === index) {
                $music.removeClass("slider--item-left").prev().addClass("slider--item-left");
                $allPanels.removeClass("slider--item-center").last().addClass("slider--item-center");
                $copyFrom.removeClass("slider--item-right").prev().addClass("slider--item-right");
              } else {
                $music.removeClass("slider--item-left").prev().addClass("slider--item-left");
                $optionsMenu.removeClass("slider--item-center").prev().addClass("slider--item-center");
                $allPanels.removeClass("slider--item-right").last().addClass("slider--item-right");
              }
            }
          }
        }
      }, 400);
      $(".slider").animate({
        opacity : 1
      }, 400);
    });
  }
  /**
   * @return {undefined}
   */
  function init() {
    $(".work-request--information input").focusout(function() {
      var newPwd2 = $(this).val();
      if ("" === newPwd2) {
        $(this).removeClass("has-value");
      } else {
        $(this).addClass("has-value");
      }
      window.scrollTo(0, 0);
    });
  }
  /** @type {boolean} */
  var o = true;
  /** @type {null} */
  var _takingTooLongTimeout = null;
  $(this).on("mousewheel DOMMouseScroll", function(event) {
    if (!$(".outer-nav").hasClass("is-vis")) {
      event.preventDefault();
      /** @type {number} */
      var b = event.originalEvent.wheelDelta ? -event.originalEvent.wheelDelta : 20 * event.originalEvent.detail;
      if (b > 50 && o) {
        /** @type {boolean} */
        o = false;
        clearTimeout(_takingTooLongTimeout);
        /** @type {number} */
        _takingTooLongTimeout = setTimeout(function() {
          /** @type {boolean} */
          o = true;
        }, 800);
        touchEnd(1);
      } else {
        if (-50 > b && o) {
          /** @type {boolean} */
          o = false;
          clearTimeout(_takingTooLongTimeout);
          /** @type {number} */
          _takingTooLongTimeout = setTimeout(function() {
            /** @type {boolean} */
            o = true;
          }, 800);
          touchEnd(-1);
        }
      }
    }
  });
  $(".side-nav li, .outer-nav li").click(function() {
    if (!$(this).hasClass("is-active")) {
      var t = $(this);
      var _allTh = t.parent().find(".is-active");
      var expected = t.parent().children().index(_allTh);
      var n = t.parent().children().index(t);
      /** @type {number} */
      var b = $(this).parent().children().length - 1;
      next(n);
      i(expected, n, b);
    }
  });
  /** @type {(Element|null)} */
  var container = document.getElementById("viewport");
  var controller = new Hammer(container);
  controller.get("swipe").set({
    direction : Hammer.DIRECTION_VERTICAL
  });
  controller.on("swipeup swipedown", function(event) {
    touchEnd(event);
  });
  $(document).keyup(function(event) {
    if (!$(".outer-nav").hasClass("is-vis")) {
      event.preventDefault();
      touchEnd(event);
    }
  });
  newSnippetControls();
  createDateTimePicker();
  init();
});
