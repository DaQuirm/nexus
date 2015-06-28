##nexus
[![Code Climate](https://codeclimate.com/github/DaQuirm/nexus.png)](https://codeclimate.com/github/DaQuirm/nexus)

An MVVM-based client application framework

### Installation

Bower
```
$ bower i nexus
```

Node.js
```
$ npm i nexus-node
```


### Example

```coffeescript
# Temperature is “measured” and displayed in two scales

# Raw business domain model
class TemperatureModel
	constructor: ->
		# nx.Cell is a “spreadsheet cell”
		@celsius = new nx.Cell value:-20

	measure: ->
		@celsius.value = Math.round(Math.random()*50 - 25)

# ViewModel describes data transformation for representation in views
class TemperatureViewModel extends TemperatureModel
	constructor: ->
		super
		@fahrenheit = new nx.Cell
		# Cell-oriented data flow
		@fahrenheit['<-'] @celsius, (celsius) -> celsius * 1.8 + 32

# Views are plain functions nested arbitrarily and written pseudo-declaratively
AppView = (context) ->
	nxt.Element 'main',
		nxt.Element 'div',
			# Pin-point rendering will only change this part when 
			# bound data is modified
			nxt.Binding context.celsius, (celsius) ->
				nxt.Text "#{celsius}℃"
		nxt.Element 'div',
			nxt.Binding context.fahrenheit, (fahrenheit) ->
				nxt.Text "#{fahrenheit}°F"
		nxt.Element 'button',
			nxt.Text 'Measure!'
			# event-as-a-cell feature is coming :3
			nxt.Event 'click', ->
				# model methods (commands) initiate data flow
				do context.measure

window.addEventListener 'load', ->
	window.model = new TemperatureViewModel
	# Attach the view to the DOM (can be any existing node)
	document.body.appendChild AppView(model).data.node
```
