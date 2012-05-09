// -*- tab-width: 4; use-tabs: 1; coding: utf-8 -*-
var events = require('events');

exports.ValueTree = ValueTree;

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
	basename: function(name) {
		return name.match(/[^\/]+$/)[0];
	},
	dirname: function(name) {
		return name.replace(/\/[^\/]+$/, "");
	},
	join: function() {
		var items;
		if (arguments.length == 1 && typeof arguments[0] != "string") {
			items = arguments[0];
		} else {
			items = arguments;
		}
		var rv = items[0];
		for (var i in items) {
			if (i == 0) continue;
			rv += '/' + items[i];
		}
		return rv;
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
			this.emit("set", name, value);
		}
	},
	del: function(name) {
		var node = this._item(name);
		if (node) {
			var parent = this._item(this.dirname(name));
			delete parent.kids[this.basename(name)];
			this.emit("del", name);
		}
	},
});