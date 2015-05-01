##nexus
[![Code Climate](https://codeclimate.com/github/DaQuirm/nexus.png)](https://codeclimate.com/github/DaQuirm/nexus)

An MVVM-based client application framework

### Installation

```
$ bower i nexus#0.4.0-alpha.0
```

### Example

```coffeescript
class TemperatureModel
	constructor: ->
		@celsius = new nx.Cell value:-20

	measure: ->
		@celsius.value = Math.round(Math.random()*50 - 25)

class TemperatureViewModel extends TemperatureModel
	constructor: ->
		super
		@fahrenheit = new nx.Cell
		@fahrenheit['<-'] @celsius, (celsius) -> celsius * 1.8 + 32

AppView = (context) ->
	nxt.Element 'main',
		nxt.Element 'div',
			nxt.Binding context.celsius, (celsius) ->
				nxt.Text "#{celsius}℃"
		nxt.Element 'div',
			nxt.Binding context.fahrenheit, (fahrenheit) ->
				nxt.Text "#{fahrenheit}°F"
		nxt.Element 'button',
			nxt.Text 'Measure!'
			nxt.Event 'click', ->
				do context.measure

window.addEventListener 'load', ->
	window.model = new TemperatureViewModel
	document.body.appendChild AppView(model).data.node
```
