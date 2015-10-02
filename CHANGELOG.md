## 0.4.8
* Added nx.Command to client-side API

## 0.4.7
* Exposed collection transform for external use

## 0.4.6

### Major

* Implemented nx.LiveTransform
* Removed nx.Cell.set

## 0.4.5
* Made binding locking more flexible

## 0.4.4
* Restored constructor chaining to allow CoffeeScript inheritance

## 0.4.3

### Major
* Add `nx.Command` to nexus-node API

## 0.4.2

### Major
* Fix `nxt.Collection` reset behavior

## 0.4.1

### Major
* Introduce and use nxt-independent `nx.Command` for collection commands
* Fix command transformation by `nxt.Collection`

## 0.4.0

### Epic
* Command Cell Model (fixes major un-rendering issues)
* All renderers are now stateless
* `nx.Cell` bindings are lazy by default (with their syncing counterparts)
* Refactored `nx.Collection` to be controlled by an external command source
* All modules are now CommonJS-compliant

### Major
* `nxt.ValueBinding`
* Cell unbinding
* Fixed renderer lifecycle when unrendering
* `nx.Collection.length`
* Simplified `nxt.Class` and fix `nxt.ClassRenderer`
* Implemented inline style rendering with nxt.Style ([@R1ZZU](https://github.com/R1ZZU))
* Merging binding
* `nx.Collection.swap`
* `nxt.Event` can now update cells with event data

### Minor
* `nx.RestCollection` passes item data directly to item constructor (unwrapped)
* `nxt.Binding` now supports bidirectional binding (only god knows what for)
* `nxt.AttrRenderer` now correctly handles the `value` attribute
* `nx.Collection.removeAll` reimplemented with `reset`
* Fixed and optimized `nxt.ContentRenderer.insertBefore`
* Removed `nx.Cell.onsync`

### Misc
* Build with webpack, eslint and jscs
