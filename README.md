# UI Selector Javascript
Select items on your page with your mouse, click and keys event.

## Install

``` bash
npm install --save ui-selector

``` 
``` bash
bower install --save https://github.com/dobobaie/ui-selector.git

``` 

## Demos
* [Classic](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/unlimit-area.html)
* [With area](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/limit-area.html)
* [Without keys](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/disable-keys.html)
* [With list](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/list-elements.html)
* [Only ui-element](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/only-ui-element.html)

![demo](https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/demo.gif)

## Usage
Add `ui-element` as class or attribute on your items and call `uiSelector` function.

```
<!DOCTYPE html>
	<html>
	<head>
		<title></title>
		<style>
			html, body
			{
				padding: 0;
				height: 100%;
			}
		</style>
		<link rel="stylesheet" type="text/css" href="uiSelector.css">
	</head>
	<body>
		
		<div id="square">
			<div class="ui-element"></div>
			<div class="ui-element"></div>
			<div class="ui-element"></div>
			<div ui-element></div>
			<div ui-element></div>
			<div ui-element></div>
		</div>

		<script type="text/javascript" src="uiSelector.js"></script>
		<script>
			// uiSelector() // create instance in body
			// uiSelector('#square') // create instance in #square element 
			// uiSelector(document.getElementById('square')) // create instance in #square element 
			// uiSelector({el: document.getElementById('square')}) // create instance in #square element 
			uiSelector({
				el: '#square',
				keys: { // optional
					ctrl: true, // default true
					shift: true, // default true
				},
				onlyElement: false, // defualt false | only ui-element can be select
			}).on('selected', (target) => {
				console.log('selected', target);
			}).on('deselect', (target) => {
				console.log('deselect', target);
			});
		</script>
	</body>
</html>

``` 

## Works
Use our mouse to select items ! You can use click event to select an item or CTRL and SHIFT keys to add items.
