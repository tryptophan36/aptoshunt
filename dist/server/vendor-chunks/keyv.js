"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/keyv";
exports.ids = ["vendor-chunks/keyv"];
exports.modules = {

/***/ "(ssr)/./node_modules/keyv/src/index.js":
/*!****************************************!*\
  !*** ./node_modules/keyv/src/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst EventEmitter = __webpack_require__(/*! events */ \"events\");\nconst JSONB = __webpack_require__(/*! json-buffer */ \"(ssr)/./node_modules/json-buffer/index.js\");\n\nconst loadStore = options => {\n\tconst adapters = {\n\t\tredis: '@keyv/redis',\n\t\trediss: '@keyv/redis',\n\t\tmongodb: '@keyv/mongo',\n\t\tmongo: '@keyv/mongo',\n\t\tsqlite: '@keyv/sqlite',\n\t\tpostgresql: '@keyv/postgres',\n\t\tpostgres: '@keyv/postgres',\n\t\tmysql: '@keyv/mysql',\n\t\tetcd: '@keyv/etcd',\n\t\toffline: '@keyv/offline',\n\t\ttiered: '@keyv/tiered',\n\t};\n\tif (options.adapter || options.uri) {\n\t\tconst adapter = options.adapter || /^[^:+]*/.exec(options.uri)[0];\n\t\treturn new (__webpack_require__(\"(ssr)/./node_modules/keyv/src sync recursive\")(adapters[adapter]))(options);\n\t}\n\n\treturn new Map();\n};\n\nconst iterableAdapters = [\n\t'sqlite',\n\t'postgres',\n\t'mysql',\n\t'mongo',\n\t'redis',\n\t'tiered',\n];\n\nclass Keyv extends EventEmitter {\n\tconstructor(uri, {emitErrors = true, ...options} = {}) {\n\t\tsuper();\n\t\tthis.opts = {\n\t\t\tnamespace: 'keyv',\n\t\t\tserialize: JSONB.stringify,\n\t\t\tdeserialize: JSONB.parse,\n\t\t\t...((typeof uri === 'string') ? {uri} : uri),\n\t\t\t...options,\n\t\t};\n\n\t\tif (!this.opts.store) {\n\t\t\tconst adapterOptions = {...this.opts};\n\t\t\tthis.opts.store = loadStore(adapterOptions);\n\t\t}\n\n\t\tif (this.opts.compression) {\n\t\t\tconst compression = this.opts.compression;\n\t\t\tthis.opts.serialize = compression.serialize.bind(compression);\n\t\t\tthis.opts.deserialize = compression.deserialize.bind(compression);\n\t\t}\n\n\t\tif (typeof this.opts.store.on === 'function' && emitErrors) {\n\t\t\tthis.opts.store.on('error', error => this.emit('error', error));\n\t\t}\n\n\t\tthis.opts.store.namespace = this.opts.namespace;\n\n\t\tconst generateIterator = iterator => async function * () {\n\t\t\tfor await (const [key, raw] of typeof iterator === 'function'\n\t\t\t\t? iterator(this.opts.store.namespace)\n\t\t\t\t: iterator) {\n\t\t\t\tconst data = await this.opts.deserialize(raw);\n\t\t\t\tif (this.opts.store.namespace && !key.includes(this.opts.store.namespace)) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tif (typeof data.expires === 'number' && Date.now() > data.expires) {\n\t\t\t\t\tthis.delete(key);\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tyield [this._getKeyUnprefix(key), data.value];\n\t\t\t}\n\t\t};\n\n\t\t// Attach iterators\n\t\tif (typeof this.opts.store[Symbol.iterator] === 'function' && this.opts.store instanceof Map) {\n\t\t\tthis.iterator = generateIterator(this.opts.store);\n\t\t} else if (typeof this.opts.store.iterator === 'function' && this.opts.store.opts\n\t\t\t&& this._checkIterableAdaptar()) {\n\t\t\tthis.iterator = generateIterator(this.opts.store.iterator.bind(this.opts.store));\n\t\t}\n\t}\n\n\t_checkIterableAdaptar() {\n\t\treturn iterableAdapters.includes(this.opts.store.opts.dialect)\n\t\t\t|| iterableAdapters.findIndex(element => this.opts.store.opts.url.includes(element)) >= 0;\n\t}\n\n\t_getKeyPrefix(key) {\n\t\treturn `${this.opts.namespace}:${key}`;\n\t}\n\n\t_getKeyPrefixArray(keys) {\n\t\treturn keys.map(key => `${this.opts.namespace}:${key}`);\n\t}\n\n\t_getKeyUnprefix(key) {\n\t\treturn key\n\t\t\t.split(':')\n\t\t\t.splice(1)\n\t\t\t.join(':');\n\t}\n\n\tget(key, options) {\n\t\tconst {store} = this.opts;\n\t\tconst isArray = Array.isArray(key);\n\t\tconst keyPrefixed = isArray ? this._getKeyPrefixArray(key) : this._getKeyPrefix(key);\n\t\tif (isArray && store.getMany === undefined) {\n\t\t\tconst promises = [];\n\t\t\tfor (const key of keyPrefixed) {\n\t\t\t\tpromises.push(Promise.resolve()\n\t\t\t\t\t.then(() => store.get(key))\n\t\t\t\t\t.then(data => (typeof data === 'string') ? this.opts.deserialize(data) : (this.opts.compression ? this.opts.deserialize(data) : data))\n\t\t\t\t\t.then(data => {\n\t\t\t\t\t\tif (data === undefined || data === null) {\n\t\t\t\t\t\t\treturn undefined;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (typeof data.expires === 'number' && Date.now() > data.expires) {\n\t\t\t\t\t\t\treturn this.delete(key).then(() => undefined);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn (options && options.raw) ? data : data.value;\n\t\t\t\t\t}),\n\t\t\t\t);\n\t\t\t}\n\n\t\t\treturn Promise.allSettled(promises)\n\t\t\t\t.then(values => {\n\t\t\t\t\tconst data = [];\n\t\t\t\t\tfor (const value of values) {\n\t\t\t\t\t\tdata.push(value.value);\n\t\t\t\t\t}\n\n\t\t\t\t\treturn data;\n\t\t\t\t});\n\t\t}\n\n\t\treturn Promise.resolve()\n\t\t\t.then(() => isArray ? store.getMany(keyPrefixed) : store.get(keyPrefixed))\n\t\t\t.then(data => (typeof data === 'string') ? this.opts.deserialize(data) : (this.opts.compression ? this.opts.deserialize(data) : data))\n\t\t\t.then(data => {\n\t\t\t\tif (data === undefined || data === null) {\n\t\t\t\t\treturn undefined;\n\t\t\t\t}\n\n\t\t\t\tif (isArray) {\n\t\t\t\t\treturn data.map((row, index) => {\n\t\t\t\t\t\tif ((typeof row === 'string')) {\n\t\t\t\t\t\t\trow = this.opts.deserialize(row);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (row === undefined || row === null) {\n\t\t\t\t\t\t\treturn undefined;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (typeof row.expires === 'number' && Date.now() > row.expires) {\n\t\t\t\t\t\t\tthis.delete(key[index]).then(() => undefined);\n\t\t\t\t\t\t\treturn undefined;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn (options && options.raw) ? row : row.value;\n\t\t\t\t\t});\n\t\t\t\t}\n\n\t\t\t\tif (typeof data.expires === 'number' && Date.now() > data.expires) {\n\t\t\t\t\treturn this.delete(key).then(() => undefined);\n\t\t\t\t}\n\n\t\t\t\treturn (options && options.raw) ? data : data.value;\n\t\t\t});\n\t}\n\n\tset(key, value, ttl) {\n\t\tconst keyPrefixed = this._getKeyPrefix(key);\n\t\tif (typeof ttl === 'undefined') {\n\t\t\tttl = this.opts.ttl;\n\t\t}\n\n\t\tif (ttl === 0) {\n\t\t\tttl = undefined;\n\t\t}\n\n\t\tconst {store} = this.opts;\n\n\t\treturn Promise.resolve()\n\t\t\t.then(() => {\n\t\t\t\tconst expires = (typeof ttl === 'number') ? (Date.now() + ttl) : null;\n\t\t\t\tif (typeof value === 'symbol') {\n\t\t\t\t\tthis.emit('error', 'symbol cannot be serialized');\n\t\t\t\t}\n\n\t\t\t\tvalue = {value, expires};\n\t\t\t\treturn this.opts.serialize(value);\n\t\t\t})\n\t\t\t.then(value => store.set(keyPrefixed, value, ttl))\n\t\t\t.then(() => true);\n\t}\n\n\tdelete(key) {\n\t\tconst {store} = this.opts;\n\t\tif (Array.isArray(key)) {\n\t\t\tconst keyPrefixed = this._getKeyPrefixArray(key);\n\t\t\tif (store.deleteMany === undefined) {\n\t\t\t\tconst promises = [];\n\t\t\t\tfor (const key of keyPrefixed) {\n\t\t\t\t\tpromises.push(store.delete(key));\n\t\t\t\t}\n\n\t\t\t\treturn Promise.allSettled(promises)\n\t\t\t\t\t.then(values => values.every(x => x.value === true));\n\t\t\t}\n\n\t\t\treturn Promise.resolve()\n\t\t\t\t.then(() => store.deleteMany(keyPrefixed));\n\t\t}\n\n\t\tconst keyPrefixed = this._getKeyPrefix(key);\n\t\treturn Promise.resolve()\n\t\t\t.then(() => store.delete(keyPrefixed));\n\t}\n\n\tclear() {\n\t\tconst {store} = this.opts;\n\t\treturn Promise.resolve()\n\t\t\t.then(() => store.clear());\n\t}\n\n\thas(key) {\n\t\tconst keyPrefixed = this._getKeyPrefix(key);\n\t\tconst {store} = this.opts;\n\t\treturn Promise.resolve()\n\t\t\t.then(async () => {\n\t\t\t\tif (typeof store.has === 'function') {\n\t\t\t\t\treturn store.has(keyPrefixed);\n\t\t\t\t}\n\n\t\t\t\tconst value = await store.get(keyPrefixed);\n\t\t\t\treturn value !== undefined;\n\t\t\t});\n\t}\n\n\tdisconnect() {\n\t\tconst {store} = this.opts;\n\t\tif (typeof store.disconnect === 'function') {\n\t\t\treturn store.disconnect();\n\t\t}\n\t}\n}\n\nmodule.exports = Keyv;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMva2V5di9zcmMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIscUJBQXFCLG1CQUFPLENBQUMsc0JBQVE7QUFDckMsY0FBYyxtQkFBTyxDQUFDLDhEQUFhOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsb0VBQVEsaUJBQWlCLENBQUM7QUFDeEM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLCtCQUErQixJQUFJO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsS0FBSztBQUN6QztBQUNBOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWSxvQkFBb0IsR0FBRyxJQUFJO0FBQ3ZDOztBQUVBO0FBQ0EsNEJBQTRCLG9CQUFvQixHQUFHLElBQUk7QUFDdkQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUyxPQUFPO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFNBQVMsT0FBTzs7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWE7QUFDYjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTLE9BQU87QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVMsT0FBTztBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsT0FBTztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQSxTQUFTLE9BQU87QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL25leHRqcy1ib2lsZXJwbGF0ZS10ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9rZXl2L3NyYy9pbmRleC5qcz8xMzNmIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5jb25zdCBKU09OQiA9IHJlcXVpcmUoJ2pzb24tYnVmZmVyJyk7XG5cbmNvbnN0IGxvYWRTdG9yZSA9IG9wdGlvbnMgPT4ge1xuXHRjb25zdCBhZGFwdGVycyA9IHtcblx0XHRyZWRpczogJ0BrZXl2L3JlZGlzJyxcblx0XHRyZWRpc3M6ICdAa2V5di9yZWRpcycsXG5cdFx0bW9uZ29kYjogJ0BrZXl2L21vbmdvJyxcblx0XHRtb25nbzogJ0BrZXl2L21vbmdvJyxcblx0XHRzcWxpdGU6ICdAa2V5di9zcWxpdGUnLFxuXHRcdHBvc3RncmVzcWw6ICdAa2V5di9wb3N0Z3JlcycsXG5cdFx0cG9zdGdyZXM6ICdAa2V5di9wb3N0Z3JlcycsXG5cdFx0bXlzcWw6ICdAa2V5di9teXNxbCcsXG5cdFx0ZXRjZDogJ0BrZXl2L2V0Y2QnLFxuXHRcdG9mZmxpbmU6ICdAa2V5di9vZmZsaW5lJyxcblx0XHR0aWVyZWQ6ICdAa2V5di90aWVyZWQnLFxuXHR9O1xuXHRpZiAob3B0aW9ucy5hZGFwdGVyIHx8IG9wdGlvbnMudXJpKSB7XG5cdFx0Y29uc3QgYWRhcHRlciA9IG9wdGlvbnMuYWRhcHRlciB8fCAvXlteOitdKi8uZXhlYyhvcHRpb25zLnVyaSlbMF07XG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZShhZGFwdGVyc1thZGFwdGVyXSkpKG9wdGlvbnMpO1xuXHR9XG5cblx0cmV0dXJuIG5ldyBNYXAoKTtcbn07XG5cbmNvbnN0IGl0ZXJhYmxlQWRhcHRlcnMgPSBbXG5cdCdzcWxpdGUnLFxuXHQncG9zdGdyZXMnLFxuXHQnbXlzcWwnLFxuXHQnbW9uZ28nLFxuXHQncmVkaXMnLFxuXHQndGllcmVkJyxcbl07XG5cbmNsYXNzIEtleXYgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXHRjb25zdHJ1Y3Rvcih1cmksIHtlbWl0RXJyb3JzID0gdHJ1ZSwgLi4ub3B0aW9uc30gPSB7fSkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5vcHRzID0ge1xuXHRcdFx0bmFtZXNwYWNlOiAna2V5dicsXG5cdFx0XHRzZXJpYWxpemU6IEpTT05CLnN0cmluZ2lmeSxcblx0XHRcdGRlc2VyaWFsaXplOiBKU09OQi5wYXJzZSxcblx0XHRcdC4uLigodHlwZW9mIHVyaSA9PT0gJ3N0cmluZycpID8ge3VyaX0gOiB1cmkpLFxuXHRcdFx0Li4ub3B0aW9ucyxcblx0XHR9O1xuXG5cdFx0aWYgKCF0aGlzLm9wdHMuc3RvcmUpIHtcblx0XHRcdGNvbnN0IGFkYXB0ZXJPcHRpb25zID0gey4uLnRoaXMub3B0c307XG5cdFx0XHR0aGlzLm9wdHMuc3RvcmUgPSBsb2FkU3RvcmUoYWRhcHRlck9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm9wdHMuY29tcHJlc3Npb24pIHtcblx0XHRcdGNvbnN0IGNvbXByZXNzaW9uID0gdGhpcy5vcHRzLmNvbXByZXNzaW9uO1xuXHRcdFx0dGhpcy5vcHRzLnNlcmlhbGl6ZSA9IGNvbXByZXNzaW9uLnNlcmlhbGl6ZS5iaW5kKGNvbXByZXNzaW9uKTtcblx0XHRcdHRoaXMub3B0cy5kZXNlcmlhbGl6ZSA9IGNvbXByZXNzaW9uLmRlc2VyaWFsaXplLmJpbmQoY29tcHJlc3Npb24pO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgdGhpcy5vcHRzLnN0b3JlLm9uID09PSAnZnVuY3Rpb24nICYmIGVtaXRFcnJvcnMpIHtcblx0XHRcdHRoaXMub3B0cy5zdG9yZS5vbignZXJyb3InLCBlcnJvciA9PiB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpKTtcblx0XHR9XG5cblx0XHR0aGlzLm9wdHMuc3RvcmUubmFtZXNwYWNlID0gdGhpcy5vcHRzLm5hbWVzcGFjZTtcblxuXHRcdGNvbnN0IGdlbmVyYXRlSXRlcmF0b3IgPSBpdGVyYXRvciA9PiBhc3luYyBmdW5jdGlvbiAqICgpIHtcblx0XHRcdGZvciBhd2FpdCAoY29uc3QgW2tleSwgcmF3XSBvZiB0eXBlb2YgaXRlcmF0b3IgPT09ICdmdW5jdGlvbidcblx0XHRcdFx0PyBpdGVyYXRvcih0aGlzLm9wdHMuc3RvcmUubmFtZXNwYWNlKVxuXHRcdFx0XHQ6IGl0ZXJhdG9yKSB7XG5cdFx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLm9wdHMuZGVzZXJpYWxpemUocmF3KTtcblx0XHRcdFx0aWYgKHRoaXMub3B0cy5zdG9yZS5uYW1lc3BhY2UgJiYgIWtleS5pbmNsdWRlcyh0aGlzLm9wdHMuc3RvcmUubmFtZXNwYWNlKSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhLmV4cGlyZXMgPT09ICdudW1iZXInICYmIERhdGUubm93KCkgPiBkYXRhLmV4cGlyZXMpIHtcblx0XHRcdFx0XHR0aGlzLmRlbGV0ZShrZXkpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0eWllbGQgW3RoaXMuX2dldEtleVVucHJlZml4KGtleSksIGRhdGEudmFsdWVdO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBBdHRhY2ggaXRlcmF0b3JzXG5cdFx0aWYgKHR5cGVvZiB0aGlzLm9wdHMuc3RvcmVbU3ltYm9sLml0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLm9wdHMuc3RvcmUgaW5zdGFuY2VvZiBNYXApIHtcblx0XHRcdHRoaXMuaXRlcmF0b3IgPSBnZW5lcmF0ZUl0ZXJhdG9yKHRoaXMub3B0cy5zdG9yZSk7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgdGhpcy5vcHRzLnN0b3JlLml0ZXJhdG9yID09PSAnZnVuY3Rpb24nICYmIHRoaXMub3B0cy5zdG9yZS5vcHRzXG5cdFx0XHQmJiB0aGlzLl9jaGVja0l0ZXJhYmxlQWRhcHRhcigpKSB7XG5cdFx0XHR0aGlzLml0ZXJhdG9yID0gZ2VuZXJhdGVJdGVyYXRvcih0aGlzLm9wdHMuc3RvcmUuaXRlcmF0b3IuYmluZCh0aGlzLm9wdHMuc3RvcmUpKTtcblx0XHR9XG5cdH1cblxuXHRfY2hlY2tJdGVyYWJsZUFkYXB0YXIoKSB7XG5cdFx0cmV0dXJuIGl0ZXJhYmxlQWRhcHRlcnMuaW5jbHVkZXModGhpcy5vcHRzLnN0b3JlLm9wdHMuZGlhbGVjdClcblx0XHRcdHx8IGl0ZXJhYmxlQWRhcHRlcnMuZmluZEluZGV4KGVsZW1lbnQgPT4gdGhpcy5vcHRzLnN0b3JlLm9wdHMudXJsLmluY2x1ZGVzKGVsZW1lbnQpKSA+PSAwO1xuXHR9XG5cblx0X2dldEtleVByZWZpeChrZXkpIHtcblx0XHRyZXR1cm4gYCR7dGhpcy5vcHRzLm5hbWVzcGFjZX06JHtrZXl9YDtcblx0fVxuXG5cdF9nZXRLZXlQcmVmaXhBcnJheShrZXlzKSB7XG5cdFx0cmV0dXJuIGtleXMubWFwKGtleSA9PiBgJHt0aGlzLm9wdHMubmFtZXNwYWNlfToke2tleX1gKTtcblx0fVxuXG5cdF9nZXRLZXlVbnByZWZpeChrZXkpIHtcblx0XHRyZXR1cm4ga2V5XG5cdFx0XHQuc3BsaXQoJzonKVxuXHRcdFx0LnNwbGljZSgxKVxuXHRcdFx0LmpvaW4oJzonKTtcblx0fVxuXG5cdGdldChrZXksIG9wdGlvbnMpIHtcblx0XHRjb25zdCB7c3RvcmV9ID0gdGhpcy5vcHRzO1xuXHRcdGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGtleSk7XG5cdFx0Y29uc3Qga2V5UHJlZml4ZWQgPSBpc0FycmF5ID8gdGhpcy5fZ2V0S2V5UHJlZml4QXJyYXkoa2V5KSA6IHRoaXMuX2dldEtleVByZWZpeChrZXkpO1xuXHRcdGlmIChpc0FycmF5ICYmIHN0b3JlLmdldE1hbnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29uc3QgcHJvbWlzZXMgPSBbXTtcblx0XHRcdGZvciAoY29uc3Qga2V5IG9mIGtleVByZWZpeGVkKSB7XG5cdFx0XHRcdHByb21pc2VzLnB1c2goUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdFx0XHQudGhlbigoKSA9PiBzdG9yZS5nZXQoa2V5KSlcblx0XHRcdFx0XHQudGhlbihkYXRhID0+ICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpID8gdGhpcy5vcHRzLmRlc2VyaWFsaXplKGRhdGEpIDogKHRoaXMub3B0cy5jb21wcmVzc2lvbiA/IHRoaXMub3B0cy5kZXNlcmlhbGl6ZShkYXRhKSA6IGRhdGEpKVxuXHRcdFx0XHRcdC50aGVuKGRhdGEgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGRhdGEgPT09IHVuZGVmaW5lZCB8fCBkYXRhID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgZGF0YS5leHBpcmVzID09PSAnbnVtYmVyJyAmJiBEYXRlLm5vdygpID4gZGF0YS5leHBpcmVzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLmRlbGV0ZShrZXkpLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIChvcHRpb25zICYmIG9wdGlvbnMucmF3KSA/IGRhdGEgOiBkYXRhLnZhbHVlO1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGxTZXR0bGVkKHByb21pc2VzKVxuXHRcdFx0XHQudGhlbih2YWx1ZXMgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSBbXTtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuXHRcdFx0XHRcdFx0ZGF0YS5wdXNoKHZhbHVlLnZhbHVlKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbigoKSA9PiBpc0FycmF5ID8gc3RvcmUuZ2V0TWFueShrZXlQcmVmaXhlZCkgOiBzdG9yZS5nZXQoa2V5UHJlZml4ZWQpKVxuXHRcdFx0LnRoZW4oZGF0YSA9PiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSA/IHRoaXMub3B0cy5kZXNlcmlhbGl6ZShkYXRhKSA6ICh0aGlzLm9wdHMuY29tcHJlc3Npb24gPyB0aGlzLm9wdHMuZGVzZXJpYWxpemUoZGF0YSkgOiBkYXRhKSlcblx0XHRcdC50aGVuKGRhdGEgPT4ge1xuXHRcdFx0XHRpZiAoZGF0YSA9PT0gdW5kZWZpbmVkIHx8IGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGlzQXJyYXkpIHtcblx0XHRcdFx0XHRyZXR1cm4gZGF0YS5tYXAoKHJvdywgaW5kZXgpID0+IHtcblx0XHRcdFx0XHRcdGlmICgodHlwZW9mIHJvdyA9PT0gJ3N0cmluZycpKSB7XG5cdFx0XHRcdFx0XHRcdHJvdyA9IHRoaXMub3B0cy5kZXNlcmlhbGl6ZShyb3cpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAocm93ID09PSB1bmRlZmluZWQgfHwgcm93ID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygcm93LmV4cGlyZXMgPT09ICdudW1iZXInICYmIERhdGUubm93KCkgPiByb3cuZXhwaXJlcykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmRlbGV0ZShrZXlbaW5kZXhdKS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiAob3B0aW9ucyAmJiBvcHRpb25zLnJhdykgPyByb3cgOiByb3cudmFsdWU7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodHlwZW9mIGRhdGEuZXhwaXJlcyA9PT0gJ251bWJlcicgJiYgRGF0ZS5ub3coKSA+IGRhdGEuZXhwaXJlcykge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmRlbGV0ZShrZXkpLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAob3B0aW9ucyAmJiBvcHRpb25zLnJhdykgPyBkYXRhIDogZGF0YS52YWx1ZTtcblx0XHRcdH0pO1xuXHR9XG5cblx0c2V0KGtleSwgdmFsdWUsIHR0bCkge1xuXHRcdGNvbnN0IGtleVByZWZpeGVkID0gdGhpcy5fZ2V0S2V5UHJlZml4KGtleSk7XG5cdFx0aWYgKHR5cGVvZiB0dGwgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR0dGwgPSB0aGlzLm9wdHMudHRsO1xuXHRcdH1cblxuXHRcdGlmICh0dGwgPT09IDApIHtcblx0XHRcdHR0bCA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRjb25zdCB7c3RvcmV9ID0gdGhpcy5vcHRzO1xuXG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGV4cGlyZXMgPSAodHlwZW9mIHR0bCA9PT0gJ251bWJlcicpID8gKERhdGUubm93KCkgKyB0dGwpIDogbnVsbDtcblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpIHtcblx0XHRcdFx0XHR0aGlzLmVtaXQoJ2Vycm9yJywgJ3N5bWJvbCBjYW5ub3QgYmUgc2VyaWFsaXplZCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFsdWUgPSB7dmFsdWUsIGV4cGlyZXN9O1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5vcHRzLnNlcmlhbGl6ZSh2YWx1ZSk7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4odmFsdWUgPT4gc3RvcmUuc2V0KGtleVByZWZpeGVkLCB2YWx1ZSwgdHRsKSlcblx0XHRcdC50aGVuKCgpID0+IHRydWUpO1xuXHR9XG5cblx0ZGVsZXRlKGtleSkge1xuXHRcdGNvbnN0IHtzdG9yZX0gPSB0aGlzLm9wdHM7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuXHRcdFx0Y29uc3Qga2V5UHJlZml4ZWQgPSB0aGlzLl9nZXRLZXlQcmVmaXhBcnJheShrZXkpO1xuXHRcdFx0aWYgKHN0b3JlLmRlbGV0ZU1hbnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRjb25zdCBwcm9taXNlcyA9IFtdO1xuXHRcdFx0XHRmb3IgKGNvbnN0IGtleSBvZiBrZXlQcmVmaXhlZCkge1xuXHRcdFx0XHRcdHByb21pc2VzLnB1c2goc3RvcmUuZGVsZXRlKGtleSkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsU2V0dGxlZChwcm9taXNlcylcblx0XHRcdFx0XHQudGhlbih2YWx1ZXMgPT4gdmFsdWVzLmV2ZXJ5KHggPT4geC52YWx1ZSA9PT0gdHJ1ZSkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdFx0LnRoZW4oKCkgPT4gc3RvcmUuZGVsZXRlTWFueShrZXlQcmVmaXhlZCkpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGtleVByZWZpeGVkID0gdGhpcy5fZ2V0S2V5UHJlZml4KGtleSk7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbigoKSA9PiBzdG9yZS5kZWxldGUoa2V5UHJlZml4ZWQpKTtcblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdGNvbnN0IHtzdG9yZX0gPSB0aGlzLm9wdHM7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbigoKSA9PiBzdG9yZS5jbGVhcigpKTtcblx0fVxuXG5cdGhhcyhrZXkpIHtcblx0XHRjb25zdCBrZXlQcmVmaXhlZCA9IHRoaXMuX2dldEtleVByZWZpeChrZXkpO1xuXHRcdGNvbnN0IHtzdG9yZX0gPSB0aGlzLm9wdHM7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbihhc3luYyAoKSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2Ygc3RvcmUuaGFzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHN0b3JlLmhhcyhrZXlQcmVmaXhlZCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IGF3YWl0IHN0b3JlLmdldChrZXlQcmVmaXhlZCk7XG5cdFx0XHRcdHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuXHRcdFx0fSk7XG5cdH1cblxuXHRkaXNjb25uZWN0KCkge1xuXHRcdGNvbnN0IHtzdG9yZX0gPSB0aGlzLm9wdHM7XG5cdFx0aWYgKHR5cGVvZiBzdG9yZS5kaXNjb25uZWN0ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRyZXR1cm4gc3RvcmUuZGlzY29ubmVjdCgpO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEtleXY7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/keyv/src/index.js\n");

/***/ })

};
;