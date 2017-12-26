var uiSelector = function(options)
{
	var $process = function()
	{
		this.init = function()
		{
			// Get element selector
			if (typeof(options) == 'string') {
				_engine.elParent = document.querySelector(options);
			} else if (typeof(options) == 'object' && options.el != undefined) {
				if (typeof(options.el) == 'string') {
					_engine.elParent = document.querySelector(options.el);
				} else if (typeof(options.el) == 'object') {
					_engine.elParent = options.el;
				} else {
					_engine.elParent = options;
				}
			} else {
				_engine.elParent = document.body;
			}

			_engine.el = document.createElement('div');
			_engine.el.id = 'uiSelector';
			_engine.el.className = 'ui-selector';
			_engine.el.setAttribute('hidden', true);
			_engine.elParent.appendChild(_engine.el);

			// Event mouse in el parent
			_engine.elParent.addEventListener('mousedown', $mouseDown);
			_engine.elParent.addEventListener('mousemove', $mouseMove);
			_engine.elParent.addEventListener('mouseup', $mouseUp);
			document.addEventListener('keydown', $keyDown);
			document.addEventListener('keyup', $keyUp);
		
			delete _engine.this.init;
			return {on: _engine.this.on};
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
				_engine.pos.x.x = e.clientX;
				_engine.pos.x.y = e.clientY;
				_engine.this.calculPosition();
				_engine.el.removeAttribute('hidden');
			}
			_engine.this.getElements();
			_engine.this.eventClick(e.target);
			return true;
		}
		
		var $mouseMove = function(e)
		{
			_engine.pos.y.x = e.clientX;
			_engine.pos.y.y = e.clientY;
			_engine.this.calculPosition();
			_engine.this.detectElements();
			return true;
		}
		
		var $mouseUp = function(e)
		{
			_engine.mouseDown = false;
			_engine.el.setAttribute('hidden', true);
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
		}

		this.getElements = function()
		{
			var elements = Array.prototype.slice.call(document.getElementsByClassName('ui-element'));
			elements = elements.concat(Array.prototype.slice.call(document.querySelectorAll('*[ui-element]')));
			_engine.elements = elements;
		}

		this.detectElements = function()
		{
			if (_engine.el.hidden == undefined || _engine.el.hidden === true) {
				return ;
			}
			
			for (var index in _engine.elements) {
				var positions = _engine.elements[index].getBoundingClientRect();
				if ($isInSelector(positions) == true) {
					if (_engine.elements[index].className.indexOf('ui-selected') == -1) {
						_engine.elements[index].classList.add('ui-selected');
						$execCallback('selected', _engine.elements[index]);
					}
				} else {
					if (_engine.elements[index].className.indexOf('ui-selected') != -1) {
						_engine.elements[index].classList.remove('ui-selected');
						$execCallback('deselect', _engine.elements[index]);
					}
				}
			}
		}

		this.eventClick = function(target)
		{
			if (_engine.keys.ctrl == false && _engine.keys.shift == false) {
				for (var index in _engine.elements) {
					if (_engine.elements[index].className.indexOf('ui-selected') != -1) {
						_engine.elements[index].classList.remove('ui-selected');
						$execCallback('deselect', _engine.elements[index]);
					}
				}
			}

			if (target.className.indexOf('ui-element') != -1 || target.getAttribute('ui-element') != null) {
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

		var $execCallback = function(type, data)
		{
			for (var index in _engine.callback[type]) {
				if (typeof(_engine.callback[type][index]) != 'function') {
					continue ;
				}
				_engine.callback[type][index](data);
			}
		}

		var _engine = {
			this: this,
			elParent: null,
			el: null,
			elements: [],
			lastTarget: null,
			mouseDown: false,
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
			},
		}
	}

	var process = new $process;
	return process.init();
}

try { module.exports = uiSelector; } catch (e) {}
