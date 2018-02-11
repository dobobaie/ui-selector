if (typeof(require) === 'function') {
	require('hammerjs');
}

var uiSelector = function(options)
{
	var $process = function()
	{
		this.init = function()
		{
			// Get element selector
			_engine.elParent = $getElement(options);

			//
			options.mouse = (typeof(options.mouse) === 'boolean' ? options.mouse : true);

			_engine.el = document.createElement('div');
			_engine.el.id = 'uiSelector';
			_engine.el.className = 'ui-selector';
			_engine.el.setAttribute('hidden', true);
			_engine.elParent.appendChild(_engine.el);

			// Event mouse in el parent
			_engine.hammer = new Hammer(_engine.elParent);
			_engine.hammer.get('pinch').set({enable: true});
			_engine.hammer.get('pan').set({threshold:5, direction: Hammer.DIRECTION_ALL});

			_engine.hammer.on('panstart', $mouseDown);
			_engine.elParent.addEventListener('mousemove', $mouseMove);
			_engine.hammer.on('panend', $mouseUp);
			_engine.hammer.on('tap', $click);
			
			document.addEventListener('keydown', $keyDown);
			document.addEventListener('keyup', $keyUp);
		
			delete _engine.this.init;
			return {on: _engine.this.on};
		}

		var $getElement = function(options)
		{
			if (typeof(options) == 'string') {
				return document.querySelector(options);
			} else if (typeof(options) == 'object' && options.el != undefined) {
				if (typeof(options.el) == 'string') {
					return document.querySelector(options.el);
				} else if (typeof(options.el) == 'object') {
					return options.el;
				} else {
					return options;
				}
			}
			return document.body;
		}

		var $getElements = function(options)
		{
			if (typeof(options) == 'string') {
				return document.querySelectorAll(options);
			} else if (typeof(options) == 'object' && options.el != undefined) {
				if (typeof(options.el) == 'string') {
					return document.querySelectorAll(options.el);
				} else if (typeof(options.el) == 'object') {
					return (Array.isArray(options.el) ? options.el : [options.el]);
				} else {
					return (Array.isArray(options) ? options : [options]);
				}
			}
			return [document.body];
		}

		this.on = function(type, callback)
		{
			switch (type)
			{
				case 'selected':
					_engine.callback.selected.push(callback);
				break;
				case 'deselect':
					_engine.callback.deselect.push(callback);
				break;
				case 'drag':
					_engine.callback.drag.push(callback);
				break;
				case 'dragcancelled':
					_engine.callback.dragcancelled.push(callback);
				break;
				case 'dragover':
					_engine.callback.dragover.push(callback);
				break;
				case 'drop':
					_engine.callback.drop.push(callback);
				break;

			}
			return {on: _engine.this.on};
		}

		var $mouseDown = function(e)
		{
			if (_engine.mouseDown == true) {
				return ;
			}

			_engine.mouseDown = true;
			if (_engine.keys.shift == false && _engine.keys.ctrl == false) {
				_engine.pos.x.x = (e.clientX === undefined ? e.center.x : e.clientX);
				_engine.pos.x.y = (e.clientY === undefined ? e.center.y : e.clientY);
				_engine.this.calculPosition();

				var element = $findElement($getPath(e.target));
				if (options.draggable === undefined || element.length === 0) {
					_engine.el.removeAttribute('hidden');
				}
			}

			_engine.this.getElements();
			
			var elements = Array.prototype.slice.call(document.getElementsByClassName('ui-selected'));
			if (options.draggable === undefined || elements.length === 0) {
				_engine.this.eventClick(e);
			}

			var dragmesh = document.getElementById('ui-dragmesh');
			if (options.draggable !== undefined && elements.length !== 0 && dragmesh === null) {
				_engine.this.dragObjects(elements);
			}
			return true;
		}
		
		var $mouseMove = function(e)
		{
			if (_engine.mouseDown == false) {
				return ;
			}

			_engine.pos.y.x = e.clientX;
			_engine.pos.y.y = e.clientY;
			_engine.this.calculPosition();

			var dragmesh = document.getElementById('ui-dragmesh');
			if (dragmesh === null) {
				_engine.el.removeAttribute('hidden');
				_engine.this.detectElements();
			} else {
				_engine.el.setAttribute('hidden', true);
			}
			
			if (dragmesh !== null) {
				dragmesh.style.top = _engine.pos.y.y + 'px';
				dragmesh.style.left = _engine.pos.y.x + 'px';
				_engine.this.detectDragOver(e);
			}
			return true;
		}
		
		var $mouseUp = function(e)
		{
			var dragmesh = document.getElementById('ui-dragmesh');
			if (dragmesh !== null) {
				var elements = Array.prototype.slice.call(dragmesh.childNodes);
				elements.map(function(elem) {
					var copyId = elem.getAttribute('ui-id-draggable');
					elem.remove();
					var findElem = _engine.elParent.querySelector('*[ui-id-draggable="' + copyId + '"]');
					findElem.removeAttribute('ui-id-draggable');
					if (_engine.drag.isOver === false) {
						$execCallback('dragcancelled', findElem);
					}
				});
				dragmesh.remove();
			}

			var overElement = document.getElementById('ui-dragover');
			if (overElement !== null) {
				if (_engine.drag.isOver === true) {
					var selectedElements = Array.prototype.slice.call(document.querySelectorAll('.ui-selected'));
					selectedElements.map(function(elem) {
						overElement.parentNode.insertBefore(elem, overElement);
						$execCallback('drop', elem);
					});
				}
				overElement.remove();
			}

			_engine.mouseDown = false;
			_engine.el.setAttribute('hidden', true);
			return true;
		}

		var $click = function(e)
		{
			_engine.pos.x.x = e.clientX;
			_engine.pos.x.y = e.clientY;
			_engine.pos.y.x = e.clientX;
			_engine.pos.y.y = e.clientY;
			_engine.this.calculPosition();
			_engine.this.getElements();
			_engine.this.eventClick(e);
			return true;
		}

		var $keyDown = function(e)
		{
			var configKey = (typeof(options) == 'object' && typeof(options.keys) == 'object');
			_engine.keys.ctrl = (configKey == true && options.keys.ctrl === false ? false : e.ctrlKey);
			_engine.keys.shift = (configKey == true && options.keys.shift === false ? false : e.shiftKey);
			return true;
		}

		var $keyUp = function(e)
		{
			_engine.keys.ctrl = false;
			_engine.keys.shift = false;
			return true;
		}

		this.detectDragOver = function(e)
		{
			// Get current over
			var dragOverElement = document.getElementById('ui-dragover');
			if (dragOverElement !== null) {
				dragOverElement.remove();
			}

			//
			var dragmesh = document.getElementById('ui-dragmesh');
			if (dragmesh === null) {
				_engine.drag.isOver = false;
				return ;
			}

			// Get areas who element can be drop
			var areas = (Array.isArray(options.draggable) === true ? options.draggable : [options.draggable]);
			var element = areas.filter(function(element) {
				return Array.prototype.slice.call($getElements(element)).filter(function(element) {
					return element === e.target;	
				}).shift();
			});
			if (element.length === 0) {
				_engine.drag.isOver = false;
				return ;
			}

			// Check the area of drop
			var elements = Array.prototype.slice.call(e.target.childNodes);
			var lastLeftRect = {
				left: e.clientX,
				top: e.clientY,
			};
			var lastLeftElem = null;
			var lastElem = null;
			var lastRect = null;
			elements.map(function(element) {
				if (element.getBoundingClientRect === undefined || element.className.indexOf('ui-element') === -1 || element.className.indexOf('ui-selected') !== -1) {
					return ;
				}

				var rect = element.getBoundingClientRect();
				
				if (lastLeftElem === null && rect.left < lastLeftRect.left && rect.top <= e.clientY && rect.bottom >= e.clientY) {
					lastLeftElem = element;
					lastLeftRect =  rect;
					return ;
				}
			
				if (rect.left > lastLeftRect.left && rect.left < e.clientX && rect.top <= e.clientY && rect.bottom >= e.clientY) {
					lastLeftElem = element;
					lastLeftRect =  rect;
				}

				lastElem = element;
				lastRect = rect;
			});

			// After all elements
			if (lastLeftElem === null && lastElem !== null && lastRect.bottom < e.clientY) {
				lastLeftElem = lastElem;
				lastLeftRect = lastRect;
			}

			// If element can not be drop
			if (lastLeftElem !== null && lastLeftElem.parentNode === null) {
				_engine.drag.isOver = false;
				return ;
			}
			_engine.drag.isOver = true;

			// If element can be drop
			var overElement = dragmesh.childNodes[0].cloneNode(true);
			overElement.id = 'ui-dragover';
			overElement.classList.remove('ui-selected');
			if (lastLeftElem === null) {
				e.target.insertBefore(overElement, e.target.childNodes[0]);
			} else {
				lastLeftElem.parentNode.insertBefore(overElement, lastLeftElem.nextSibling);
			}
			$execCallback('dragover', overElement, dragmesh.childNodes.length);
		}

		var $isInDrag = function()
		{
			var dragmesh = document.getElementById('ui-dragmesh');
			if (dragmesh === null) {
				return false;
			}

			var areas = (Array.isArray(options.draggable) === true ? options.draggable : [options.draggable]);
			var element = areas.filter(function(element) {
				return Array.prototype.slice.call($getElements(element)).filter(function(element) {
					return element === e.target;	
				}).shift();
			});
			return element;
		}

		this.dragObjects = function(elements)
		{
			var dragmesh = document.createElement('div');
			dragmesh.id = 'ui-dragmesh';
			dragmesh.style.position = 'absolute';
			dragmesh.style.top = _engine.pos.y.y + 'px';
			dragmesh.style.left = _engine.pos.y.x + 'px';
			dragmesh.style.opacity = 0.4;
			elements.map(function(elem, index) {
				var date = new Date();
				elem.setAttribute('ui-id-draggable', date.getTime() + '-' + index);
				var elemCloned = elem.cloneNode(true);
				dragmesh.appendChild(elemCloned);
				$execCallback('drag', elemCloned);
			});
			document.body.appendChild(dragmesh);
		}

		this.calculPosition = function()
		{
			_engine.pos.left = Math.min(_engine.pos.x.x, _engine.pos.y.x);
			_engine.pos.top = Math.min(_engine.pos.x.y, _engine.pos.y.y);
			_engine.pos.right = Math.max(_engine.pos.x.x, _engine.pos.y.x);
			_engine.pos.bottom = Math.max(_engine.pos.x.y, _engine.pos.y.y);
			_engine.pos.width = _engine.pos.right - _engine.pos.left;
			_engine.pos.height = _engine.pos.bottom - _engine.pos.top;
			_engine.el.style.left = _engine.pos.left + 'px';
			_engine.el.style.top = _engine.pos.top + 'px';
			_engine.el.style.width = (_engine.pos.right - _engine.pos.left) + 'px';
			_engine.el.style.height = (_engine.pos.bottom - _engine.pos.top) + 'px';
			return _engine.pos;
		}

		this.getElements = function()
		{
			_engine.elements = Array.prototype.slice.call(document.getElementsByClassName('ui-element'));
			return _engine.elements;
		}

		this.detectElements = function(callEvent)
		{
			callEvent = (typeof(callEvent) !== 'boolean' || callEvent === true ? true : false);
			if (callEvent === false && (_engine.el.hidden == undefined || _engine.el.hidden === true)) {
				return null;
			}
			
			var elements = [];
			for (var index in _engine.elements) {
				var positions = _engine.elements[index].getBoundingClientRect();
				if ($isInSelector(positions) == true) {
					if (_engine.elements[index].className.indexOf('ui-selected') == -1) {
						elements.push(_engine.elements[index]);
						if (callEvent === true) {
							_engine.elements[index].classList.add('ui-selected');
							$execCallback('selected', _engine.elements[index]);
						}
					}
				} else {
					if (_engine.elements[index].className.indexOf('ui-selected') != -1) {
						if (callEvent === true) {
							_engine.elements[index].classList.remove('ui-selected');
							$execCallback('deselect', _engine.elements[index]);
						}
					}
				}
			}
			return elements;
		}

		var $getPath = function(el)
		{
			var path = [];
			while (el)
			{
				path.push(el);
				if (el.tagName === 'HTML') {
					path.push(document);
					path.push(window);
					return path;
				}
				el = el.parentElement;
			}
			return path;
		}

		var $findElement = function(arr)
		{
			return arr.filter(function(elem) {
				return elem.className !== undefined && elem.className.indexOf('ui-element') !== -1;
			});
		}

		this.eventClick = function(e)
		{
			var target = null;
			var nodes = $getPath(e.target);
			for (var i = 0; nodes[i] != undefined; i++) {
				if (i == 1 && typeof(options) == 'object' && options.onlyElement === true) {
					break ;
				}
				if (nodes[i].className == undefined) {
					continue ;
				}
				if (nodes[i].className.indexOf('ui-element') !== -1) {
					target = nodes[i];
					break ;
				}
			}

			if (_engine.keys.ctrl == false && _engine.keys.shift == false) {
				for (var index in _engine.elements) {
					if (_engine.elements[index].className.indexOf('ui-selected') != -1) {
						_engine.elements[index].classList.remove('ui-selected');
						$execCallback('deselect', _engine.elements[index]);
					}
				}
			}

			if (target == null) {
				return ;
			}

			if (target.className.indexOf('ui-selected') != -1) {
				target.classList.remove('ui-selected');
				$execCallback('deselect', target);
			} else {
				target.classList.add('ui-selected');
				$execCallback('selected', target);
			}
			if (_engine.keys.shift == true) {
				$shiftSelector(target);
			}
			_engine.lastTarget = target;
		}

		var $shiftSelector = function(target)
		{
			var elem = _engine.lastTarget;
			while ((elem = elem.previousSibling) != null) {
				if (elem === target) {
					break;
				}
			}

			var isTarget = (elem == null ? false : true);
			elem = (elem == null ? _engine.lastTarget : elem);
			while ((elem = elem.nextSibling) != null) {
				if (elem.style == undefined) {
					continue ;
				}
				if (elem.className.indexOf('ui-selected') == -1) {
					elem.classList.add('ui-selected');
					$execCallback('selected', elem);
				}
				if (elem === (isTarget == true ? _engine.lastTarget : target)) {
					break ;
				}
			}
		}

		var $isInSelector = function(positions)
		{
			if (_engine.pos.top <= positions.bottom && _engine.pos.bottom >= positions.top &&
				_engine.pos.left <= positions.right && _engine.pos.right >= positions.left) {
				return true;
			}
			return false;
		}

		var $execCallback = function(type, data, otherData)
		{
			for (var index in _engine.callback[type]) {
				if (typeof(_engine.callback[type][index]) != 'function') {
					continue ;
				}
				_engine.callback[type][index](data, otherData);
			}
		}

		var _engine = {
			this: this,
			hammer: null,
			elParent: null,
			el: null,
			elements: [],
			lastTarget: null,
			mouseDown: false,
			drag: {
				isOver: false,
			},
			keys: {
				ctrl: false,
				shift: false,
			},
			pos: {
				width: 0,
				height: 0,
				left: 0,
				top: 0,
				right: 0,
				bottom: 0,
				x: {
					x: 0,
					y: 0,
				},
				y: {
					y: 0,
					x: 0,
				},
			},
			callback: {
				selected: [],
				deselect: [],
				drag: [],
				dragcancelled: [],
				dragover: [],
				drop: [],
			},
		}
	}

	var process = new $process;
	return process.init();
}

try { module.exports = uiSelector; } catch (e) {}
