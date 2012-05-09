// -*- tab-width: 4; use-tabs: 1; coding: utf-8 -*-

var events = require('events');

module.exports = ValueTree;

function ValueItem(name, value) {
	this.name = name;
	this.value = value;
	this.kids = {};
}

ValueItem.prototype = {
	name: null,
	value: null,
	kids: null
};

function ValueTree() {
	events.EventEmitter.call(this);
	this.root = ValueItem();
}

ValueTree.super_ = events.EventEmitter;
ValueTree.prototype = Object.create(events.EventEmitter.prototype, 
{
	constructor : {
		value: ValueTree,
		enumerable: false
	},
	_item: function(name) {
		var bits = name.split('/');
		var cur = this.root;
		for (var i in bits) {
			cur = cur.kids[bits[i]];
		}
		return cur;
	},
	get: function(name) {
		return this._item(name).value;
	},
	ls: function(name, callback) {
		this._item(name).kids.forEach(function(name) {
			callback(name);
			});
	},
	walk: function(name, callback) {
		function _walk(cur, callback) {
			callback(cur.name, cur.value);
			for (var k in cur.kids) {
				_walk(cur.kids[k], callback);
			}
		}
		_walk(this._item(name), callback);
	},
	set: function(name, value) {
		var node = this._item(name);
		if (node.value != value) {
			node.value = value;
			//TODO: Raise event
		}
	},
	del: function(name) {
		var node = this._item(name);
		if (node) {
			//TODO: Delete
			//TODO: Raise event
		}
	},
});