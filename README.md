# UI Selector Javascript
Select items on your page with your mouse, click and keys event or with drag and drop.

## Install

``` bash
npm install --save ui-selector

``` 
``` bash
bower install --save https://github.com/dobobaie/ui-selector.git

``` 

## Demos
* [Classic](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/unlimit-area.html)
* [Drag & drop](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/index.html)
* [With area](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/limit-area.html)
* [Without keys](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/disable-keys.html)
* [Without mouse](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/disable-mouse.html)
* [With list](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/list-elements.html)
* [Only ui-element](https://htmlpreview.github.io/?https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/only-ui-element.html)

![demo](https://raw.githubusercontent.com/dobobaie/ui-selector/master/examples/demo.gif)

## Usage
Add `ui-element` as class on your items and call `uiSelector` function to selector or drag & drop your item.

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
			#square
			{
				height: 100%;
			}
			div.ui-element, div[ui-element]
			{
				background: #DDD;
				border: 1px solid #AAA;
			}
		</style>
		<link rel="stylesheet" type="text/css" href="../dist/uiSelector.css">
	</head>
	<body>
		
		<div id="square">
			<div class="ui-element" style="width: 200px; height: 200px; float: left; margin: 35px;">
				<div style="background: blue;margin: 50px auto;width: 100px;height: 70px;color: #FFF;font-size: 2em;text-align: center;padding-top: 30px;">1</div>
			</div>
			<div class="ui-element" style="width: 200px; height: 200px; float: left; margin: 35px;">
				<div style="background: blue;margin: 50px auto;width: 100px;height: 70px;color: #FFF;font-size: 2em;text-align: center;padding-top: 30px;">2</div>
			</div>
			<div class="ui-element" style="width: 200px; height: 200px; float: left; margin: 35px;">
				<div style="background: blue;margin: 50px auto;width: 100px;height: 70px;color: #FFF;font-size: 2em;text-align: center;padding-top: 30px;">3</div>
			</div>
			<div class="ui-element" style="width: 200px; height: 200px; float: left; margin: 35px;">
				<div style="background: blue;margin: 50px auto;width: 100px;height: 70px;color: #FFF;font-size: 2em;text-align: center;padding-top: 30px;">4</div>
			</div>
			<div class="ui-element" style="width: 200px; height: 200px; float: left; margin: 35px;">
				<div style="background: blue;margin: 50px auto;width: 100px;height: 70px;color: #FFF;font-size: 2em;text-align: center;padding-top: 30px;">5</div>
			</div>
			<div class="ui-element" style="width: 200px; height: 200px; float: left; margin: 35px;">
				<div style="background: blue;margin: 50px auto;width: 100px;height: 70px;color: #FFF;font-size: 2em;text-align: center;padding-top: 30px;">6</div>
			</div>
			<div style="clear: both"></div>
			<div id="test" style="min-width: 300px;min-height: 300px;background: yellow;"></div>
		</div>
		
		<script src="https://hammerjs.github.io/dist/hammer.min.js"></script>
		<script type="text/javascript" src="../dist/uiSelector.js"></script>
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
				onlyElement: false, // only ui-element can be select
				draggable: ['#square', '#test'],
			}).on('selected', (target) => {
				console.log('selected', target);
			}).on('deselect', (target) => {
				console.log('deselect', target);
			}).on('drag', (target) => {
				console.log('drag', target);
			}).on('dragcancelled', (target) => {
				console.log('dragcancelled', target);
			}).on('dragover', (target, total) => {
				console.log('dragover', target, total);
			}).on('drop', (target) => {
				console.log('drop', target);
			});
		</script>
	</body>
</html>

``` 

## Works
Use our mouse to select items ! You can use click event to select an item or CTRL and SHIFT keys to add items.
