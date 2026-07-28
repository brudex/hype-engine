//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
};
//#endregion
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function n(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var r = {}, i = [], a = () => {}, o = () => !1, s = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), c = (e) => e.startsWith("onUpdate:"), l = Object.assign, u = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, d = Object.prototype.hasOwnProperty, f = (e, t) => d.call(e, t), p = Array.isArray, m = (e) => C(e) === "[object Map]", h = (e) => C(e) === "[object Set]", g = (e) => C(e) === "[object Date]", _ = (e) => typeof e == "function", v = (e) => typeof e == "string", y = (e) => typeof e == "symbol", b = (e) => typeof e == "object" && !!e, x = (e) => (b(e) || _(e)) && _(e.then) && _(e.catch), S = Object.prototype.toString, C = (e) => S.call(e), w = (e) => C(e).slice(8, -1), T = (e) => C(e) === "[object Object]", E = (e) => v(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, D = /* @__PURE__ */ n(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), O = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, k = /-\w/g, A = O((e) => e.replace(k, (e) => e.slice(1).toUpperCase())), j = /\B([A-Z])/g, M = O((e) => e.replace(j, "-$1").toLowerCase()), ee = O((e) => e.charAt(0).toUpperCase() + e.slice(1)), N = O((e) => e ? `on${ee(e)}` : ""), P = (e, t) => !Object.is(e, t), te = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ne = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, F = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, re, ie = () => re ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function I(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = v(r) ? ce(r) : I(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (v(e) || b(e)) return e;
}
var ae = /;(?![^(]*\))/g, oe = /:([^]+)/, se = /\/\*[^]*?\*\//g;
function ce(e) {
	let t = {};
	return e.replace(se, "").split(ae).forEach((e) => {
		if (e) {
			let n = e.split(oe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function le(e) {
	let t = "";
	if (v(e)) t = e;
	else if (p(e)) for (let n = 0; n < e.length; n++) {
		let r = le(e[n]);
		r && (t += r + " ");
	}
	else if (b(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ue = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", de = /* @__PURE__ */ n(ue);
ue + "";
function fe(e) {
	return !!e || e === "";
}
function pe(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = me(e[r], t[r]);
	return n;
}
function me(e, t) {
	if (e === t) return !0;
	let n = g(e), r = g(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = y(e), r = y(t), n || r) return e === t;
	if (n = p(e), r = p(t), n || r) return n && r ? pe(e, t) : !1;
	if (n = b(e), r = b(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !me(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function he(e, t) {
	return e.findIndex((e) => me(e, t));
}
var ge = (e) => !!(e && e.__v_isRef === !0), L = (e) => v(e) ? e : e == null ? "" : p(e) || b(e) && (e.toString === S || !_(e.toString)) ? ge(e) ? L(e.value) : JSON.stringify(e, _e, 2) : String(e), _e = (e, t) => ge(t) ? _e(e, t.value) : m(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ve(t, r) + " =>"] = n, e), {}) } : h(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ve(e)) } : y(t) ? ve(t) : b(t) && !p(t) && !T(t) ? String(t) : t, ve = (e, t = "") => y(e) ? `Symbol(${e.description ?? t})` : e, ye, be = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && ye && (ye.active ? (this.parent = ye, this.index = (ye.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = ye;
			try {
				return ye = this, e();
			} finally {
				ye = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = ye, ye = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (ye === this) ye = this.prevScope;
			else {
				let e = ye;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function xe(e) {
	return new be(e);
}
function Se() {
	return ye;
}
function Ce(e, t = !1) {
	ye && ye.cleanups.push(e);
}
var we, Te = /* @__PURE__ */ new WeakSet(), Ee = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ye && (ye.active ? ye.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Te.has(this) && (Te.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ae(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ue(this), Ne(this);
		let e = we, t = ze;
		we = this, ze = !0;
		try {
			return this.fn();
		} finally {
			Pe(this), we = e, ze = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Le(e);
			this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Te.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Fe(this) && this.run();
	}
	get dirty() {
		return Fe(this);
	}
}, De = 0, Oe, ke;
function Ae(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = ke, ke = e;
		return;
	}
	e.next = Oe, Oe = e;
}
function je() {
	De++;
}
function Me() {
	if (--De > 0) return;
	if (ke) {
		let e = ke;
		for (ke = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Oe;) {
		let t = Oe;
		for (Oe = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Ne(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Le(r), Re(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Fe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ie(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ie(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === We) || (e.globalVersion = We, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Fe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = we, r = ze;
	we = e, ze = !0;
	try {
		Ne(e);
		let n = e.fn(e._value);
		(t.version === 0 || P(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		we = n, ze = r, Pe(e), e.flags &= -3;
	}
}
function Le(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Le(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Re(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ze = !0, Be = [];
function Ve() {
	Be.push(ze), ze = !1;
}
function He() {
	let e = Be.pop();
	ze = e === void 0 || e;
}
function Ue(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = we;
		we = void 0;
		try {
			t();
		} finally {
			we = e;
		}
	}
}
var We = 0, Ge = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ke = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!we || !ze || we === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== we) t = this.activeLink = new Ge(we, this), we.deps ? (t.prevDep = we.depsTail, we.depsTail.nextDep = t, we.depsTail = t) : we.deps = we.depsTail = t, qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = we.depsTail, t.nextDep = void 0, we.depsTail.nextDep = t, we.depsTail = t, we.deps === t && (we.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, We++, this.notify(e);
	}
	notify(e) {
		je();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Me();
		}
	}
};
function qe(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) qe(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Je = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ Symbol(""), Xe = /* @__PURE__ */ Symbol(""), Ze = /* @__PURE__ */ Symbol("");
function Qe(e, t, n) {
	if (ze && we) {
		let t = Je.get(e);
		t || Je.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ke()), r.map = t, r.key = n), r.track();
	}
}
function $e(e, t, n, r, i, a) {
	let o = Je.get(e);
	if (!o) {
		We++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (je(), t === "clear") o.forEach(s);
	else {
		let i = p(e), a = i && E(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ze || !y(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ze)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ye)), m(e) && s(o.get(Xe)));
				break;
			case "delete":
				i || (s(o.get(Ye)), m(e) && s(o.get(Xe)));
				break;
			case "set":
				m(e) && s(o.get(Ye));
				break;
		}
	}
	Me();
}
function et(e, t) {
	let n = Je.get(e);
	return n && n.get(t);
}
function tt(e) {
	let t = /* @__PURE__ */ R(e);
	return t === e ? t : (Qe(t, "iterate", Ze), /* @__PURE__ */ Bt(e) ? t : t.map(Ut));
}
function nt(e) {
	return Qe(e = /* @__PURE__ */ R(e), "iterate", Ze), e;
}
function rt(e, t) {
	return /* @__PURE__ */ zt(e) ? Wt(/* @__PURE__ */ Rt(e) ? Ut(t) : t) : Ut(t);
}
var it = {
	__proto__: null,
	[Symbol.iterator]() {
		return at(this, Symbol.iterator, (e) => rt(this, e));
	},
	concat(...e) {
		return tt(this).concat(...e.map((e) => p(e) ? tt(e) : e));
	},
	entries() {
		return at(this, "entries", (e) => (e[1] = rt(this, e[1]), e));
	},
	every(e, t) {
		return st(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return st(this, "filter", e, t, (e) => e.map((e) => rt(this, e)), arguments);
	},
	find(e, t) {
		return st(this, "find", e, t, (e) => rt(this, e), arguments);
	},
	findIndex(e, t) {
		return st(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return st(this, "findLast", e, t, (e) => rt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return st(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return st(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return lt(this, "includes", e);
	},
	indexOf(...e) {
		return lt(this, "indexOf", e);
	},
	join(e) {
		return tt(this).join(e);
	},
	lastIndexOf(...e) {
		return lt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return st(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return ut(this, "pop");
	},
	push(...e) {
		return ut(this, "push", e);
	},
	reduce(e, ...t) {
		return ct(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ct(this, "reduceRight", e, t);
	},
	shift() {
		return ut(this, "shift");
	},
	some(e, t) {
		return st(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ut(this, "splice", e);
	},
	toReversed() {
		return tt(this).toReversed();
	},
	toSorted(e) {
		return tt(this).toSorted(e);
	},
	toSpliced(...e) {
		return tt(this).toSpliced(...e);
	},
	unshift(...e) {
		return ut(this, "unshift", e);
	},
	values() {
		return at(this, "values", (e) => rt(this, e));
	}
};
function at(e, t, n) {
	let r = nt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Bt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var ot = Array.prototype;
function st(e, t, n, r, i, a) {
	let o = nt(e), s = o !== e && !/* @__PURE__ */ Bt(e), c = o[t];
	if (c !== ot[t]) {
		let t = c.apply(e, a);
		return s ? Ut(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, rt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ct(e, t, n, r) {
	let i = nt(e), a = i !== e && !/* @__PURE__ */ Bt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = rt(e, t)), n.call(this, t, rt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? rt(e, c) : c;
}
function lt(e, t, n) {
	let r = /* @__PURE__ */ R(e);
	Qe(r, "iterate", Ze);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Vt(n[0]) ? (n[0] = /* @__PURE__ */ R(n[0]), r[t](...n)) : i;
}
function ut(e, t, n = []) {
	Ve(), je();
	let r = (/* @__PURE__ */ R(e))[t].apply(e, n);
	return Me(), He(), r;
}
var dt = /* @__PURE__ */ n("__proto__,__v_isRef,__isVue"), ft = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(y));
function pt(e) {
	y(e) || (e = String(e));
	let t = /* @__PURE__ */ R(this);
	return Qe(t, "has", e), t.hasOwnProperty(e);
}
var mt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Mt : jt : i ? At : kt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = p(e);
		if (!r) {
			let e;
			if (a && (e = it[t])) return e;
			if (t === "hasOwnProperty") return pt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Gt(e) ? e : n);
		if ((y(t) ? ft.has(t) : dt(t)) || (r || Qe(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Gt(o)) {
			let e = a && E(t) ? o : o.value;
			return r && b(e) ? /* @__PURE__ */ It(e) : e;
		}
		return b(o) ? r ? /* @__PURE__ */ It(o) : /* @__PURE__ */ Pt(o) : o;
	}
}, ht = class extends mt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = p(e) && E(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ zt(i);
			if (!/* @__PURE__ */ Bt(n) && !/* @__PURE__ */ zt(n) && (i = /* @__PURE__ */ R(i), n = /* @__PURE__ */ R(n)), !a && /* @__PURE__ */ Gt(i) && !/* @__PURE__ */ Gt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : f(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Gt(e) ? e : r);
		return e === /* @__PURE__ */ R(r) && s && (o ? P(n, i) && $e(e, "set", t, n, i) : $e(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = f(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && $e(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!y(t) || !ft.has(t)) && Qe(e, "has", t), n;
	}
	ownKeys(e) {
		return Qe(e, "iterate", p(e) ? "length" : Ye), Reflect.ownKeys(e);
	}
}, gt = class extends mt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, _t = /* @__PURE__ */ new ht(), vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new ht(!0), bt = (e) => e, xt = (e) => Reflect.getPrototypeOf(e);
function St(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ R(i), o = m(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, u = i[e](...r), d = n ? bt : t ? Wt : Ut;
		return !t && Qe(a, "iterate", c ? Xe : Ye), l(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function Ct(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function wt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ R(r), a = /* @__PURE__ */ R(n);
			e || (P(n, a) && Qe(i, "get", n), Qe(i, "get", a));
			let { has: o } = xt(i), s = t ? bt : e ? Wt : Ut;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Qe(/* @__PURE__ */ R(t), "iterate", Ye), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ R(n), i = /* @__PURE__ */ R(t);
			return e || (P(t, i) && Qe(r, "has", t), Qe(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ R(a), s = t ? bt : e ? Wt : Ut;
			return !e && Qe(o, "iterate", Ye), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return l(n, e ? {
		add: Ct("add"),
		set: Ct("set"),
		delete: Ct("delete"),
		clear: Ct("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ R(this), r = xt(n), i = /* @__PURE__ */ R(e), a = !t && !/* @__PURE__ */ Bt(e) && !/* @__PURE__ */ zt(e) ? i : e;
			return r.has.call(n, a) || P(e, a) && r.has.call(n, e) || P(i, a) && r.has.call(n, i) || (n.add(a), $e(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Bt(n) && !/* @__PURE__ */ zt(n) && (n = /* @__PURE__ */ R(n));
			let r = /* @__PURE__ */ R(this), { has: i, get: a } = xt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ R(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? P(n, s) && $e(r, "set", e, n, s) : $e(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ R(this), { has: n, get: r } = xt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ R(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && $e(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ R(this), t = e.size !== 0, n = e.clear();
			return t && $e(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = St(r, e, t);
	}), n;
}
function Tt(e, t) {
	let n = wt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(f(n, r) && r in t ? n : t, r, i);
}
var Et = { get: /* @__PURE__ */ Tt(!1, !1) }, Dt = { get: /* @__PURE__ */ Tt(!1, !0) }, Ot = { get: /* @__PURE__ */ Tt(!0, !1) }, kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap();
function Nt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return /* @__PURE__ */ zt(e) ? e : Lt(e, !1, _t, Et, kt);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return Lt(e, !1, yt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Lt(e, !0, vt, Ot, jt);
}
function Lt(e, t, n, r, i) {
	if (!b(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Nt(w(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return /* @__PURE__ */ zt(e) ? /* @__PURE__ */ Rt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ R(t) : e;
}
function Ht(e) {
	return !f(e, "__v_skip") && Object.isExtensible(e) && ne(e, "__v_skip", !0), e;
}
var Ut = (e) => b(e) ? /* @__PURE__ */ Pt(e) : e, Wt = (e) => b(e) ? /* @__PURE__ */ It(e) : e;
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	return qt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return qt(e, !0);
}
function qt(e, t) {
	return /* @__PURE__ */ Gt(e) ? e : new Jt(e, t);
}
var Jt = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ R(e), this._value = t ? e : Ut(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Bt(e) || /* @__PURE__ */ zt(e);
		e = n ? e : /* @__PURE__ */ R(e), P(e, t) && (this._rawValue = e, this._value = n ? e : Ut(e), this.dep.trigger());
	}
};
function B(e) {
	return /* @__PURE__ */ Gt(e) ? e.value : e;
}
function V(e) {
	return _(e) ? e() : B(e);
}
var Yt = {
	get: (e, t, n) => t === "__v_raw" ? e : B(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Gt(i) && !/* @__PURE__ */ Gt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Xt(e) {
	return /* @__PURE__ */ Rt(e) ? e : new Proxy(e, Yt);
}
var Zt = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new Ke(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function Qt(e) {
	return new Zt(e);
}
// @__NO_SIDE_EFFECTS__
function $t(e) {
	let t = p(e) ? Array(e.length) : {};
	for (let n in e) t[n] = rn(e, n);
	return t;
}
var en = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = y(t) ? t : String(t), this._raw = /* @__PURE__ */ R(e);
		let r = !0, i = e;
		if (!p(e) || y(this._key) || !E(this._key)) do
			r = !/* @__PURE__ */ Vt(i) || /* @__PURE__ */ Bt(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = B(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ Gt(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ Gt(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return et(this._raw, this._key);
	}
}, tn = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function nn(e, t, n) {
	return /* @__PURE__ */ Gt(e) ? e : _(e) ? new tn(e) : b(e) && arguments.length > 1 ? rn(e, t, n) : /* @__PURE__ */ z(e);
}
function rn(e, t, n) {
	return new en(e, t, n);
}
var an = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && we !== this) return Ae(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ie(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function on(e, t, n = !1) {
	let r, i;
	return _(e) ? r = e : (r = e.get, i = e.set), new an(r, i, n);
}
var sn = {}, cn = /* @__PURE__ */ new WeakMap(), ln = void 0;
function un(e, t = !1, n = ln) {
	if (n) {
		let t = cn.get(n);
		t || cn.set(n, t = []), t.push(e);
	}
}
function dn(e, t, n = r) {
	let { immediate: i, deep: o, once: s, scheduler: c, augmentJob: l, call: d } = n, f = (e) => o ? e : /* @__PURE__ */ Bt(e) || o === !1 || o === 0 ? fn(e, 1) : fn(e), m, h, g, v, y = !1, b = !1;
	if (/* @__PURE__ */ Gt(e) ? (h = () => e.value, y = /* @__PURE__ */ Bt(e)) : /* @__PURE__ */ Rt(e) ? (h = () => f(e), y = !0) : p(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Rt(e) || /* @__PURE__ */ Bt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ Gt(e)) return e.value;
		if (/* @__PURE__ */ Rt(e)) return f(e);
		if (_(e)) return d ? d(e, 2) : e();
	})) : h = _(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (g) {
			Ve();
			try {
				g();
			} finally {
				He();
			}
		}
		let t = ln;
		ln = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			ln = t;
		}
	} : a, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => fn(e(), t);
	}
	let x = Se(), S = () => {
		m.stop(), x && x.active && u(x.effects, m);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(sn) : sn, w = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) if (t) {
			let n = m.run();
			if (e || o || y || (b ? n.some((e, t) => P(e, C[t])) : P(n, C))) {
				g && g();
				let e = ln;
				ln = m;
				try {
					let e = [
						n,
						C === sn ? void 0 : b && C[0] === sn ? [] : C,
						v
					];
					C = n, d ? d(t, 3, e) : t(...e);
				} finally {
					ln = e;
				}
			}
		} else m.run();
	};
	return l && l(w), m = new Ee(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => un(e, !1, m), g = m.onStop = () => {
		let e = cn.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			cn.delete(m);
		}
	}, t ? i ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function fn(e, t = Infinity, n) {
	if (t <= 0 || !b(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Gt(e)) fn(e.value, t, n);
	else if (p(e)) for (let r = 0; r < e.length; r++) fn(e[r], t, n);
	else if (h(e) || m(e)) e.forEach((e) => {
		fn(e, t, n);
	});
	else if (T(e)) {
		for (let r in e) fn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && fn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function pn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		hn(e, t, n);
	}
}
function mn(e, t, n, r) {
	if (_(e)) {
		let i = pn(e, t, n, r);
		return i && x(i) && i.catch((e) => {
			hn(e, t, n);
		}), i;
	}
	if (p(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(mn(e[a], t, n, r));
		return i;
	}
}
function hn(e, t, n, i = !0) {
	let a = t ? t.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = t && t.appContext.config || r;
	if (t) {
		let r = t.parent, i = t.proxy, a = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, a) === !1) return;
			}
			r = r.parent;
		}
		if (o) {
			Ve(), pn(o, null, 10, [
				e,
				i,
				a
			]), He();
			return;
		}
	}
	gn(e, n, a, i, s);
}
function gn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var _n = [], vn = -1, yn = [], bn = null, xn = 0, Sn = /* @__PURE__ */ Promise.resolve(), Cn = null;
function wn(e) {
	let t = Cn || Sn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Tn(e) {
	let t = vn + 1, n = _n.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = _n[r], a = jn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function En(e) {
	if (!(e.flags & 1)) {
		let t = jn(e), n = _n[_n.length - 1];
		!n || !(e.flags & 2) && t >= jn(n) ? _n.push(e) : _n.splice(Tn(t), 0, e), e.flags |= 1, Dn();
	}
}
function Dn() {
	Cn ||= Sn.then(Mn);
}
function On(e) {
	p(e) ? yn.push(...e) : bn && e.id === -1 ? bn.splice(xn + 1, 0, e) : e.flags & 1 || (yn.push(e), e.flags |= 1), Dn();
}
function kn(e, t, n = vn + 1) {
	for (; n < _n.length; n++) {
		let t = _n[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			_n.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function An(e) {
	if (yn.length) {
		let e = [...new Set(yn)].sort((e, t) => jn(e) - jn(t));
		if (yn.length = 0, bn) {
			bn.push(...e);
			return;
		}
		for (bn = e, xn = 0; xn < bn.length; xn++) {
			let e = bn[xn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		bn = null, xn = 0;
	}
}
var jn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Mn(e) {
	try {
		for (vn = 0; vn < _n.length; vn++) {
			let e = _n[vn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), pn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; vn < _n.length; vn++) {
			let e = _n[vn];
			e && (e.flags &= -2);
		}
		vn = -1, _n.length = 0, An(e), Cn = null, (_n.length || yn.length) && Mn(e);
	}
}
var Nn = null, Pn = null;
function Fn(e) {
	let t = Nn;
	return Nn = e, Pn = e && e.type.__scopeId || null, t;
}
function In(e, t = Nn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && $i(-1);
		let i = Fn(t), a = Yi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Yi.length; e > a; e--) Zi();
			Fn(i), r._d && $i(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function H(e, t) {
	if (Nn === null) return e;
	let n = Ia(Nn), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = r] = t[e];
		a && (_(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && fn(o), i.push({
			dir: a,
			instance: n,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function Ln(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ve(), mn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
function Rn(e, t) {
	if (ba) {
		let n = ba.provides, r = ba.parent && ba.parent.provides;
		r === n && (n = ba.provides = Object.create(r)), n[e] = t;
	}
}
function zn(e, t, n = !1) {
	let r = xa();
	if (r || ni) {
		let i = ni ? ni._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && _(t) ? t.call(r && r.proxy) : t;
	}
}
function Bn() {
	return !!(xa() || ni);
}
var Vn = /* @__PURE__ */ Symbol.for("v-scx"), Hn = () => zn(Vn);
function U(e, t, n) {
	return Un(e, t, n);
}
function Un(e, t, n = r) {
	let { immediate: i, deep: o, flush: s, once: c } = n, u = l({}, n), d = t && i || !t && s !== "post", f;
	if (Da) {
		if (s === "sync") {
			let e = Hn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = a, e.resume = a, e.pause = a, e;
		}
	}
	let p = ba;
	u.call = (e, t, n) => mn(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		Ni(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : En(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = dn(e, t, u);
	return Da && (f ? f.push(h) : d && h()), h;
}
function Wn(e, t, n) {
	let r = this.proxy, i = v(e) ? e.includes(".") ? Gn(r, e) : () => r[e] : e.bind(r, r), a;
	_(t) ? a = t : (a = t.handler, n = t);
	let o = wa(this), s = Un(i, a.bind(r), n);
	return o(), s;
}
function Gn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Kn = /* @__PURE__ */ Symbol("_vte"), qn = (e) => e.__isTeleport, Jn = /* @__PURE__ */ Symbol("_leaveCb");
function Yn(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, Yn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Xn(e, t) {
	return _(e) ? /* @__PURE__ */ l({ name: e.name }, t, { setup: e }) : e;
}
function Zn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Qn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var $n = /* @__PURE__ */ new WeakMap();
function er(e, t, n, i, a = !1) {
	if (p(e)) {
		e.forEach((e, r) => er(e, t && (p(t) ? t[r] : t), n, i, a));
		return;
	}
	if (nr(i) && !a) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && er(e, t, n, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? Ia(i.component) : i.el, c = a ? null : s, { i: l, r: d } = e, m = t && t.r, h = l.refs === r ? l.refs = {} : l.refs, g = l.setupState, y = /* @__PURE__ */ R(g), b = g === r ? o : (e) => !Qn(h, e) && f(y, e), x = (e, t) => !(t && Qn(h, t));
	if (m != null && m !== d) {
		if (tr(t), v(m)) h[m] = null, b(m) && (g[m] = null);
		else if (/* @__PURE__ */ Gt(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (_(d)) pn(d, l, 12, [c, h]);
	else {
		let t = v(d), r = /* @__PURE__ */ Gt(d);
		if (t || r) {
			let i = () => {
				if (e.f) {
					let n = t ? b(d) ? g[d] : h[d] : x(d) || !e.k ? d.value : h[e.k];
					if (a) p(n) && u(n, s);
					else if (p(n)) n.includes(s) || n.push(s);
					else if (t) h[d] = [s], b(d) && (g[d] = h[d]);
					else {
						let t = [s];
						x(d, e.k) && (d.value = t), e.k && (h[e.k] = t);
					}
				} else t ? (h[d] = c, b(d) && (g[d] = c)) : r && (x(d, e.k) && (d.value = c), e.k && (h[e.k] = c));
			};
			if (c) {
				let t = () => {
					i(), $n.delete(e);
				};
				t.id = -1, $n.set(e, t), Ni(t, n);
			} else tr(e), i();
		}
	}
}
function tr(e) {
	let t = $n.get(e);
	t && (t.flags |= 8, $n.delete(e));
}
ie().requestIdleCallback, ie().cancelIdleCallback;
var nr = (e) => !!e.type.__asyncLoader, rr = (e) => e.type.__isKeepAlive;
function ir(e, t) {
	or(e, "a", t);
}
function ar(e, t) {
	or(e, "da", t);
}
function or(e, t, n = ba) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (cr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) rr(e.parent.vnode) && sr(r, t, n, e), e = e.parent;
	}
}
function sr(e, t, n, r) {
	let i = cr(t, e, r, !0);
	hr(() => {
		u(r[t], i);
	}, n);
}
function cr(e, t, n = ba, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ve();
			let i = wa(n), a = mn(t, n, e, r);
			return i(), He(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var lr = (e) => (t, n = ba) => {
	(!Da || e === "sp") && cr(e, (...e) => t(...e), n);
}, ur = lr("bm"), dr = lr("m"), fr = lr("bu"), pr = lr("u"), mr = lr("bum"), hr = lr("um"), gr = lr("sp"), _r = lr("rtg"), vr = lr("rtc");
function yr(e, t = ba) {
	cr("ec", e, t);
}
var br = "components";
function xr(e, t) {
	return wr(br, e, !0, t) || e;
}
var Sr = /* @__PURE__ */ Symbol.for("v-ndc");
function Cr(e) {
	return v(e) ? wr(br, e, !1) || e : e || Sr;
}
function wr(e, t, n = !0, r = !1) {
	let i = Nn || ba;
	if (i) {
		let n = i.type;
		if (e === br) {
			let e = La(n, !1);
			if (e && (e === t || e === A(t) || e === ee(A(t)))) return n;
		}
		let a = Tr(i[e] || n[e], t) || Tr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Tr(e, t) {
	return e && (e[t] || e[A(t)] || e[ee(A(t))]);
}
function Er(e, t, n, r) {
	let i, a = n && n[r], o = p(e);
	if (o || v(e)) {
		let n = o && /* @__PURE__ */ Rt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Bt(e), s = /* @__PURE__ */ zt(e), e = nt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Wt(Ut(e[n])) : Ut(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (b(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
	else {
		let n = Object.keys(e);
		i = Array(n.length);
		for (let r = 0, o = n.length; r < o; r++) {
			let o = n[r];
			i[r] = t(e[o], o, r, a && a[r]);
		}
	}
	else i = [];
	return n && (n[r] = i), i;
}
function Dr(e, t, n = {}, r, i, a) {
	if (Nn.ce || Nn.parent && nr(Nn.parent) && Nn.parent.ce) {
		let e = a != null && n.key == null ? l({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), G(), ta(W, null, [J("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Yi.length;
	G();
	let c;
	try {
		let i = o && Or(o(n)), s = n.key || a || i && i.key;
		c = ta(W, { key: (s && !y(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Yi.length; e > s; e--) Zi();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Or(e) {
	return e.some((e) => !na(e) || !(e.type === qi || e.type === W && !Or(e.children))) ? e : null;
}
var kr = (e) => e ? Ea(e) ? Ia(e) : kr(e.parent) : null, Ar = /* @__PURE__ */ l(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => kr(e.parent),
	$root: (e) => kr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Ur(e),
	$forceUpdate: (e) => e.f ||= () => {
		En(e.update);
	},
	$nextTick: (e) => e.n ||= wn.bind(e.proxy),
	$watch: (e) => Wn.bind(e)
}), jr = (e, t) => e !== r && !e.__isScriptSetup && f(e, t), Mr = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (t[0] !== "$") {
			let e = s[t];
			if (e !== void 0) switch (e) {
				case 1: return i[t];
				case 2: return a[t];
				case 4: return n[t];
				case 3: return o[t];
			}
			else if (jr(i, t)) return s[t] = 1, i[t];
			else if (a !== r && f(a, t)) return s[t] = 2, a[t];
			else if (f(o, t)) return s[t] = 3, o[t];
			else if (n !== r && f(n, t)) return s[t] = 4, n[t];
			else Rr && (s[t] = 0);
		}
		let u = Ar[t], d, p;
		if (u) return t === "$attrs" && Qe(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== r && f(n, t)) return s[t] = 4, n[t];
		if (p = l.config.globalProperties, f(p, t)) return p[t];
	},
	set({ _: e }, t, n) {
		let { data: i, setupState: a, ctx: o } = e;
		return jr(a, t) ? (a[t] = n, !0) : i !== r && f(i, t) ? (i[t] = n, !0) : f(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(n[c] || e !== r && c[0] !== "$" && f(e, c) || jr(t, c) || f(o, c) || f(i, c) || f(Ar, c) || f(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? f(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Nr() {
	return Fr("useSlots").slots;
}
function Pr() {
	return Fr("useAttrs").attrs;
}
function Fr(e) {
	let t = xa();
	return t.setupContext ||= Fa(t);
}
function Ir(e) {
	return p(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Lr(e, t) {
	let n = {};
	for (let r in e) t.includes(r) || Object.defineProperty(n, r, {
		enumerable: !0,
		get: () => e[r]
	});
	return n;
}
var Rr = !0;
function zr(e) {
	let t = Ur(e), n = e.proxy, r = e.ctx;
	Rr = !1, t.beforeCreate && Vr(t.beforeCreate, e, "bc");
	let { data: i, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: m, beforeUpdate: h, updated: g, activated: v, deactivated: y, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: k, expose: A, inheritAttrs: j, components: M, directives: ee, filters: N } = t;
	if (u && Br(u, r, null), s) for (let e in s) {
		let t = s[e];
		_(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		b(t) && (e.data = /* @__PURE__ */ Pt(t));
	}
	if (Rr = !0, o) for (let e in o) {
		let t = o[e], i = Y({
			get: _(t) ? t.bind(n, n) : _(t.get) ? t.get.bind(n, n) : a,
			set: !_(t) && _(t.set) ? t.set.bind(n) : a
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (c) for (let e in c) Hr(c[e], r, n, e);
	if (l) {
		let e = _(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Rn(t, e[t]);
		});
	}
	d && Vr(d, e, "c");
	function P(e, t) {
		p(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (P(ur, f), P(dr, m), P(fr, h), P(pr, g), P(ir, v), P(ar, y), P(yr, O), P(vr, E), P(_r, D), P(mr, S), P(hr, w), P(gr, k), p(A)) if (A.length) {
		let t = e.exposed ||= {};
		A.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	T && e.render === a && (e.render = T), j != null && (e.inheritAttrs = j), M && (e.components = M), ee && (e.directives = ee), k && Zn(e);
}
function Br(e, t, n = a) {
	p(e) && (e = Jr(e));
	for (let n in e) {
		let r = e[n], i;
		i = b(r) ? "default" in r ? zn(r.from || n, r.default, !0) : zn(r.from || n) : zn(r), /* @__PURE__ */ Gt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Vr(e, t, n) {
	mn(p(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Hr(e, t, n, r) {
	let i = r.includes(".") ? Gn(n, r) : () => n[r];
	if (v(e)) {
		let n = t[e];
		_(n) && U(i, n);
	} else if (_(e)) U(i, e.bind(n));
	else if (b(e)) if (p(e)) e.forEach((e) => Hr(e, t, n, r));
	else {
		let r = _(e.handler) ? e.handler.bind(n) : t[e.handler];
		_(r) && U(i, r, e);
	}
}
function Ur(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Wr(c, e, o, !0)), Wr(c, t, o)), b(t) && a.set(t, c), c;
}
function Wr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Wr(e, a, n, !0), i && i.forEach((t) => Wr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Gr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Gr = {
	data: Kr,
	props: Zr,
	emits: Zr,
	methods: Xr,
	computed: Xr,
	beforeCreate: Yr,
	created: Yr,
	beforeMount: Yr,
	mounted: Yr,
	beforeUpdate: Yr,
	updated: Yr,
	beforeDestroy: Yr,
	beforeUnmount: Yr,
	destroyed: Yr,
	unmounted: Yr,
	activated: Yr,
	deactivated: Yr,
	errorCaptured: Yr,
	serverPrefetch: Yr,
	components: Xr,
	directives: Xr,
	watch: Qr,
	provide: Kr,
	inject: qr
};
function Kr(e, t) {
	return t ? e ? function() {
		return l(_(e) ? e.call(this, this) : e, _(t) ? t.call(this, this) : t);
	} : t : e;
}
function qr(e, t) {
	return Xr(Jr(e), Jr(t));
}
function Jr(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Yr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Xr(e, t) {
	return e ? l(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Zr(e, t) {
	return e ? p(e) && p(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : l(/* @__PURE__ */ Object.create(null), Ir(e), Ir(t ?? {})) : t;
}
function Qr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = l(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Yr(e[r], t[r]);
	return n;
}
function $r() {
	return {
		app: null,
		config: {
			isNativeTag: o,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var ei = 0;
function ti(e, t) {
	return function(n, r = null) {
		_(n) || (n = l({}, n)), r != null && !b(r) && (r = null);
		let i = $r(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: ei++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Va,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && _(e.install) ? (a.add(e), e.install(c, ...t)) : _(e) && (a.add(e), e(c, ...t))), c;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), c;
			},
			component(e, t) {
				return t ? (i.components[e] = t, c) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, c) : i.directives[e];
			},
			mount(a, o, l) {
				if (!s) {
					let u = c._ceVNode || J(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ia(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (mn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ni;
				ni = c;
				try {
					return e();
				} finally {
					ni = t;
				}
			}
		};
		return c;
	};
}
var ni = null, ri = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${A(t)}Modifiers`] || e[`${M(t)}Modifiers`];
function ii(e, t, ...n) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || r, a = n, o = t.startsWith("update:"), s = o && ri(i, t.slice(7));
	s && (s.trim && (a = n.map((e) => v(e) ? e.trim() : e)), s.number && (a = n.map(F)));
	let c, l = i[c = N(t)] || i[c = N(A(t))];
	!l && o && (l = i[c = N(M(t))]), l && mn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, mn(u, e, 6, a);
	}
}
var ai = /* @__PURE__ */ new WeakMap();
function oi(e, t, n = !1) {
	let r = n ? ai : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!_(e)) {
		let r = (e) => {
			let n = oi(e, t, !0);
			n && (s = !0, l(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (b(e) && r.set(e, null), null) : (p(a) ? a.forEach((e) => o[e] = null) : l(o, a), b(e) && r.set(e, o), o);
}
function si(e, t) {
	return !e || !s(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), f(e, t[0].toLowerCase() + t.slice(1)) || f(e, M(t)) || f(e, t));
}
function ci(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Fn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = fa(u.call(t, e, d, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = fa(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: l
			}) : e(f, null)), y = t.props ? s : li(s);
		}
	} catch (t) {
		Yi.length = 0, hn(t, e, 1), v = J(qi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(c) && (y = ui(y, a)), b = ca(b, y, !1, !0));
	}
	return n.dirs && (b = ca(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Yn(b, n.transition), v = b, Fn(_), v;
}
var li = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || s(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, ui = (e, t) => {
	let n = {};
	for (let r in e) (!c(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function di(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? fi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (pi(o, r, n) && !si(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || fi(r, o, l) : !!o;
	return !1;
}
function fi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (pi(t, e, a) && !si(n, a)) return !0;
	}
	return !1;
}
function pi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && b(r) && b(i) ? !me(r, i) : r !== i;
}
function mi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var hi = {}, gi = () => Object.create(hi), _i = (e) => Object.getPrototypeOf(e) === hi;
function vi(e, t, n, r = !1) {
	let i = {}, a = gi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), bi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ Ft(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function yi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ R(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (si(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) if (f(a, o)) u !== a[o] && (a[o] = u, l = !0);
				else {
					let t = A(o);
					i[t] = xi(c, s, t, u, e, !1);
				}
				else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		bi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !f(t, a) && ((r = M(a)) === a || !f(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = xi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !f(t, e)) && (delete a[e], l = !0);
	}
	l && $e(e.attrs, "set", "");
}
function bi(e, t, n, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let r in t) {
		if (D(r)) continue;
		let l = t[r], u;
		a && f(a, u = A(r)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : si(e.emitsOptions, r) || (!(r in i) || l !== i[r]) && (i[r] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ R(n), i = c || r;
		for (let r = 0; r < o.length; r++) {
			let s = o[r];
			n[s] = xi(a, t, s, i[s], e, !f(i, s));
		}
	}
	return s;
}
function xi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = f(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && _(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = wa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === M(n)) && (r = !0));
	}
	return r;
}
var Si = /* @__PURE__ */ new WeakMap();
function Ci(e, t, n = !1) {
	let a = n ? Si : t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, c = {}, u = [], d = !1;
	if (!_(e)) {
		let r = (e) => {
			d = !0;
			let [n, r] = Ci(e, t, !0);
			l(c, n), r && u.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!s && !d) return b(e) && a.set(e, i), i;
	if (p(s)) for (let e = 0; e < s.length; e++) {
		let t = A(s[e]);
		wi(t) && (c[t] = r);
	}
	else if (s) for (let e in s) {
		let t = A(e);
		if (wi(t)) {
			let n = s[e], r = c[t] = p(n) || _(n) ? { type: n } : l({}, n), i = r.type, a = !1, o = !0;
			if (p(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = _(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				} else n === "String" && (o = !1);
			}
			else a = _(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || f(r, "default")) && u.push(t);
		}
	}
	let m = [c, u];
	return b(e) && a.set(e, m), m;
}
function wi(e) {
	return e[0] !== "$" && !D(e);
}
var Ti = (e) => e === "_" || e === "_ctx" || e === "$stable", Ei = (e) => p(e) ? e.map(fa) : [fa(e)], Di = (e, t, n) => {
	if (t._n) return t;
	let r = In((...e) => Ei(t(...e)), n);
	return r._c = !1, r;
}, Oi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ti(n)) continue;
		let i = e[n];
		if (_(i)) t[n] = Di(n, i, r);
		else if (i != null) {
			let e = Ei(i);
			t[n] = () => e;
		}
	}
}, ki = (e, t) => {
	let n = Ei(t);
	e.slots.default = () => n;
}, Ai = (e, t, n) => {
	for (let r in t) (n || !Ti(r)) && (e[r] = t[r]);
}, ji = (e, t, n) => {
	let r = e.slots = gi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ai(r, t, n), n && ne(r, "_", e, !0)) : Oi(t, r);
	} else t && ki(e, t);
}, Mi = (e, t, n) => {
	let { vnode: i, slots: a } = e, o = !0, s = r;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? o = !1 : Ai(a, t, n) : (o = !t.$stable, Oi(t, a)), s = t;
	} else t && (ki(e, t), s = { default: 1 });
	if (o) for (let e in a) !Ti(e) && s[e] == null && delete a[e];
}, Ni = Gi;
function Pi(e) {
	return Fi(e);
}
function Fi(e, t) {
	let n = ie();
	n.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = a, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ra(e, t) && (r = fe(e), se(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Ki:
				y(e, t, n, r);
				break;
			case qi:
				b(e, t, n, r);
				break;
			case Ji:
				e ?? x(t, n, r, o);
				break;
			case W:
				M(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? ee(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, he);
		}
		u != null && i ? er(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && er(e.ref, null, a, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), k(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, Ii(e, a), s, u), _ && Ln(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !D(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && ga(f, r, e);
		}
		_ && Ln(e, null, r, "beforeMount");
		let v = Ri(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && Ni(() => {
			try {
				f && ga(f, r, e), v && g.enter(d), _ && Ln(e, null, r, "mounted");
			} finally {}
		}, i);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Wi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? pa(e[l]) : fa(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, k = (e, t, n, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || r, h = t.props || r, g;
		if (n && Li(n, !1), (g = h.onVnodeBeforeUpdate) && ga(g, n, t, e), f && Ln(t, e, n, "beforeUpdate"), n && Li(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? A(e.dynamicChildren, d, l, n, i, Ii(t, a), o) : s || re(e, t, l, null, n, i, Ii(t, a), o, !1), u > 0) {
			if (u & 16) j(l, m, h, n, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], i = m[r], o = h[r];
					(o !== i || r === "value") && c(l, r, i, o, a, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && j(l, m, h, n, a);
		((g = h.onVnodeUpdated) || f) && Ni(() => {
			g && ga(g, n, t, e), f && Ln(t, e, n, "updated");
		}, i);
	}, A = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === W || !ra(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, j = (e, t, n, i, a) => {
		if (t !== n) {
			if (t !== r) for (let r in t) !D(r) && !(r in n) && c(e, r, t[r], null, a, i);
			for (let r in n) {
				if (D(r)) continue;
				let o = n[r], s = t[r];
				o !== s && r !== "value" && c(e, r, s, o, a, i);
			}
			"value" in n && c(e, "value", t.value, n.value, a);
		}
	}, M = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (A(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && zi(e, t, !0)) : re(e, t, n, f, i, a, s, c, l);
	}, ee = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : N(t, n, r, i, a, o, c) : P(e, t, c);
	}, N = (e, t, n, r, i, a, o) => {
		let s = e.component = ya(e, r, i);
		if (rr(e) && (s.ctx.renderer = he), Oa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ne, o), !e.el) {
				let r = s.subTree = J(qi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ne(s, e, t, n, i, a, o);
	}, P = (e, t, n) => {
		let r = t.component = e.component;
		if (di(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			F(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ne = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Vi(e);
					if (n) {
						t && (t.el = c.el, F(e, t, o)), n.asyncDep.then(() => {
							Ni(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Li(e, !1), t ? (t.el = c.el, F(e, t, o)) : t = c, n && te(n), (d = t.props && t.props.onVnodeBeforeUpdate) && ga(d, s, t, c), Li(e, !0);
				let f = ci(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), fe(p), e, i, a), t.el = f.el, u === null && mi(e, f.el), r && Ni(r, i), (d = t.props && t.props.onVnodeUpdated) && Ni(() => ga(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = nr(t);
				if (Li(e, !1), l && te(l), !m && (o = c && c.onVnodeBeforeMount) && ga(o, d, t), Li(e, !0), s && L) {
					let t = () => {
						e.subTree = ci(e), L(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = ci(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Ni(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Ni(() => ga(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && nr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Ni(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ee(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => En(u), Li(e, !0), l();
	}, F = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, yi(e, t.props, r, n), Mi(e, t.children, n), Ve(), kn(e), He();
	}, re = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ae(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				I(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && de(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ae(l, d, n, r, i, a, o, s, c) : de(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, I = (e, t, n, r, a, o, s, c, l) => {
		e ||= i, t ||= i;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let r = t[p] = l ? pa(t[p]) : fa(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? de(e, a, o, !0, !1, f) : O(t, n, r, a, o, s, c, l, f);
	}, ae = (e, t, n, r, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? pa(t[u]) : fa(t[u]);
			if (ra(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? pa(t[p]) : fa(t[p]);
			if (ra(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, i = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? pa(t[u]) : fa(t[u]), n, i, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) se(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? pa(t[u]) : fa(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					se(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && ra(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? se(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? Bi(C) : i;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, i = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ui(f) : r;
				C[u] === 0 ? v(null, i, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? oe(i, n, p, 2) : _--);
			}
		}
	}, oe = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			oe(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, he);
			return;
		}
		if (c === W) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) oe(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Ji) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[Jn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), Ni(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[Jn];
				a._isLeaving && a[Jn](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, se = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Ve(), er(s, null, n, e, !0), He()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !nr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ga(_, t, e), u & 6) ue(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Ln(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, he, r) : l && !l.hasOnce && (a !== W || d > 0 && d & 64) ? de(l, t, n, !1, !0) : (a === W && d & 384 || !i && u & 16) && de(c, t, n), r && ce(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Ni(() => {
			_ && ga(_, t, e), h && Ln(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ce = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === W) {
			le(n, r);
			return;
		}
		if (t === Ji) {
			C(e);
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, le = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ue = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Hi(c), Hi(l), r && te(r), i.stop(), a && (a.flags |= 8, se(o, e, t, n)), s && Ni(s, t), Ni(() => {
			e.isUnmounted = !0;
		}, t);
	}, de = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) se(e[o], t, n, r, i);
	}, fe = (e) => {
		if (e.shapeFlag & 6) return fe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Kn];
		return n ? h(n) : t;
	}, pe = !1, me = (e, t, n) => {
		let r;
		e == null ? t._vnode && (se(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, pe ||= (pe = !0, kn(r), An(), !1);
	}, he = {
		p: v,
		um: se,
		m: oe,
		r: ce,
		mt: N,
		mc: O,
		pc: re,
		pbc: A,
		n: fe,
		o: e
	}, ge, L;
	return t && ([ge, L] = t(he)), {
		render: me,
		hydrate: ge,
		createApp: ti(me, ge)
	};
}
function Ii({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Li({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ri(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function zi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (p(r) && p(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = pa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && zi(t, a)), a.type === Ki && (a.patchFlag === -1 && (a = i[e] = pa(a)), a.el = t.el), a.type === qi && !a.el && (a.el = t.el);
	}
}
function Bi(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function Vi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Vi(t);
}
function Hi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ui(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ui(t.subTree) : null;
}
var Wi = (e) => e.__isSuspense;
function Gi(e, t) {
	t && t.pendingBranch ? p(e) ? t.effects.push(...e) : t.effects.push(e) : On(e);
}
var W = /* @__PURE__ */ Symbol.for("v-fgt"), Ki = /* @__PURE__ */ Symbol.for("v-txt"), qi = /* @__PURE__ */ Symbol.for("v-cmt"), Ji = /* @__PURE__ */ Symbol.for("v-stc"), Yi = [], Xi = null;
function G(e = !1) {
	Yi.push(Xi = e ? null : []);
}
function Zi() {
	Yi.pop(), Xi = Yi[Yi.length - 1] || null;
}
var Qi = 1;
function $i(e, t = !1) {
	Qi += e, e < 0 && Xi && t && (Xi.hasOnce = !0);
}
function ea(e) {
	return e.dynamicChildren = Qi > 0 ? Xi || i : null, Zi(), Qi > 0 && Xi && Xi.push(e), e;
}
function K(e, t, n, r, i, a) {
	return ea(q(e, t, n, r, i, a, !0));
}
function ta(e, t, n, r, i) {
	return ea(J(e, t, n, r, i, !0));
}
function na(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ra(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ia = ({ key: e }) => e ?? null, aa = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : v(e) || /* @__PURE__ */ Gt(e) || _(e) ? {
	i: Nn,
	r: e,
	k: t,
	f: !!n
} : e);
function q(e, t = null, n = null, r = 0, i = null, a = e === W ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ia(t),
		ref: t && aa(t),
		scopeId: Pn,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Nn
	};
	return s ? (ma(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= v(n) ? 8 : 16), Qi > 0 && !o && Xi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Xi.push(c), c;
}
var J = oa;
function oa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Sr) && (e = qi), na(e)) {
		let r = ca(e, t, !0);
		return n && ma(r, n), Qi > 0 && !a && Xi && (r.shapeFlag & 6 ? Xi[Xi.indexOf(e)] = r : Xi.push(r)), r.patchFlag = -2, r;
	}
	if (Ra(e) && (e = e.__vccOpts), t) {
		t = sa(t);
		let { class: e, style: n } = t;
		e && !v(e) && (t.class = le(e)), b(n) && (/* @__PURE__ */ Vt(n) && !p(n) && (n = l({}, n)), t.style = I(n));
	}
	let o = v(e) ? 1 : Wi(e) ? 128 : qn(e) ? 64 : b(e) ? 4 : _(e) ? 2 : 0;
	return q(e, t, n, r, i, o, a, !0);
}
function sa(e) {
	return e ? /* @__PURE__ */ Vt(e) || _i(e) ? l({}, e) : e : null;
}
function ca(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ha(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ia(l),
		ref: t && t.ref ? n && a ? p(a) ? a.concat(aa(t)) : [a, aa(t)] : aa(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== W ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && ca(e.ssContent),
		ssFallback: e.ssFallback && ca(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && Yn(u, c.clone(u)), u;
}
function la(e = " ", t = 0) {
	return J(Ki, null, e, t);
}
function ua(e, t) {
	let n = J(Ji, null, e);
	return n.staticCount = t, n;
}
function da(e = "", t = !1) {
	return t ? (G(), ta(qi, null, e)) : J(qi, null, e);
}
function fa(e) {
	return e == null || typeof e == "boolean" ? J(qi) : p(e) ? J(W, null, e.slice()) : na(e) ? pa(e) : J(Ki, null, String(e));
}
function pa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ca(e);
}
function ma(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (p(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), ma(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !_i(t) ? t._ctx = Nn : r === 3 && Nn && (Nn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (_(t)) {
		if (r & 65) {
			ma(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Nn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [la(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ha(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = le([t.class, r.class]));
		else if (e === "style") t.style = I([t.style, r.style]);
		else if (s(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(p(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !c(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ga(e, t, n, r = null) {
	mn(e, t, 7, [n, r]);
}
var _a = $r(), va = 0;
function ya(e, t, n) {
	let i = e.type, a = (t ? t.appContext : e.appContext) || _a, o = {
		uid: va++,
		vnode: e,
		type: i,
		parent: t,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new be(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(a.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Ci(i, a),
		emitsOptions: oi(i, a),
		emit: null,
		emitted: null,
		propsDefaults: r,
		inheritAttrs: i.inheritAttrs,
		ctx: r,
		data: r,
		props: r,
		attrs: r,
		slots: r,
		refs: r,
		setupState: r,
		setupContext: null,
		suspense: n,
		suspenseId: n ? n.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = ii.bind(null, o), e.ce && e.ce(o), o;
}
var ba = null, xa = () => ba || Nn, Sa, Ca;
{
	let e = ie(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Sa = t("__VUE_INSTANCE_SETTERS__", (e) => ba = e), Ca = t("__VUE_SSR_SETTERS__", (e) => Da = e);
}
var wa = (e) => {
	let t = ba;
	return Sa(e), e.scope.on(), () => {
		e.scope.off(), Sa(t);
	};
}, Ta = () => {
	ba && ba.scope.off(), Sa(null);
};
function Ea(e) {
	return e.vnode.shapeFlag & 4;
}
var Da = !1;
function Oa(e, t = !1, n = !1) {
	t && Ca(t);
	let { props: r, children: i } = e.vnode, a = Ea(e);
	vi(e, r, a, t), ji(e, i, n || t);
	let o = a ? ka(e, t) : void 0;
	return t && Ca(!1), o;
}
function ka(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Mr);
	let { setup: r } = n;
	if (r) {
		Ve();
		let n = e.setupContext = r.length > 1 ? Fa(e) : null, i = wa(e), a = pn(r, e, 0, [e.props, n]), o = x(a);
		if (He(), i(), (o || e.sp) && !nr(e) && Zn(e), o) {
			if (a.then(Ta, Ta), t) return a.then((n) => {
				Aa(e, n, t);
			}).catch((t) => {
				hn(t, e, 0);
			});
			e.asyncDep = a;
		} else Aa(e, a, t);
	} else Na(e, t);
}
function Aa(e, t, n) {
	_(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : b(t) && (e.setupState = Xt(t)), Na(e, n);
}
var ja, Ma;
function Na(e, t, n) {
	let r = e.type;
	if (!e.render) {
		if (!t && ja && !r.render) {
			let t = r.template || Ur(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: o } = r;
				r.render = ja(t, l(l({
					isCustomElement: n,
					delimiters: a
				}, i), o));
			}
		}
		e.render = r.render || a, Ma && Ma(e);
	}
	{
		let t = wa(e);
		Ve();
		try {
			zr(e);
		} finally {
			He(), t();
		}
	}
}
var Pa = { get(e, t) {
	return Qe(e, "get", ""), e[t];
} };
function Fa(e) {
	return {
		attrs: new Proxy(e.attrs, Pa),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ia(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Xt(Ht(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Ar) return Ar[n](e);
		},
		has(e, t) {
			return t in e || t in Ar;
		}
	}) : e.proxy;
}
function La(e, t = !0) {
	return _(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ra(e) {
	return _(e) && "__vccOpts" in e;
}
var Y = (e, t) => /* @__PURE__ */ on(e, t, Da);
function za(e, t, n) {
	try {
		$i(-1);
		let r = arguments.length;
		return r === 2 ? b(t) && !p(t) ? na(t) ? J(e, null, [t]) : J(e, t) : J(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && na(n) && (n = [n]), J(e, t, n));
	} finally {
		$i(1);
	}
}
function Ba(e, t) {
	let n = e.memo;
	if (n.length != t.length) return !1;
	for (let e = 0; e < n.length; e++) if (P(n[e], t[e])) return !1;
	return Qi > 0 && Xi && Xi.push(e), !0;
}
var Va = "3.5.40", Ha = void 0, Ua = typeof window < "u" && window.trustedTypes;
if (Ua) try {
	Ha = /* @__PURE__ */ Ua.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Wa = Ha ? (e) => Ha.createHTML(e) : (e) => e, Ga = "http://www.w3.org/2000/svg", Ka = "http://www.w3.org/1998/Math/MathML", qa = typeof document < "u" ? document : null, Ja = qa && /* @__PURE__ */ qa.createElement("template"), Ya = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? qa.createElementNS(Ga, e) : t === "mathml" ? qa.createElementNS(Ka, e) : n ? qa.createElement(e, { is: n }) : qa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => qa.createTextNode(e),
	createComment: (e) => qa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => qa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			Ja.innerHTML = Wa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ja.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Xa = /* @__PURE__ */ Symbol("_vtc");
function Za(e, t, n) {
	let r = e[Xa];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Qa = /* @__PURE__ */ Symbol("_vod"), $a = /* @__PURE__ */ Symbol("_vsh"), eo = /* @__PURE__ */ Symbol(""), to = /(?:^|;)\s*display\s*:/;
function no(e, t, n) {
	let r = e.style, i = v(n), a = !1;
	if (n && !i) {
		if (t) if (v(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? io(r, t, "");
		}
		else for (let e in t) n[e] ?? io(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? io(r, i, "") : co(e, i, !v(t) && t ? t[i] : void 0, o) || io(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[eo];
			e && (n += ";" + e), r.cssText = n, a = to.test(n);
		}
	} else t && e.removeAttribute("style");
	Qa in e && (e[Qa] = a ? r.display : "", e[$a] && (r.display = "none"));
}
var ro = /\s*!important$/;
function io(e, t, n) {
	if (p(n)) n.forEach((n) => io(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = so(e, t);
		ro.test(n) ? e.setProperty(M(r), n.replace(ro, ""), "important") : e[r] = n;
	}
}
var ao = [
	"Webkit",
	"Moz",
	"ms"
], oo = {};
function so(e, t) {
	let n = oo[t];
	if (n) return n;
	let r = A(t);
	if (r !== "filter" && r in e) return oo[t] = r;
	r = ee(r);
	for (let n = 0; n < ao.length; n++) {
		let i = ao[n] + r;
		if (i in e) return oo[t] = i;
	}
	return t;
}
function co(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && v(r) && n === r;
}
var lo = "http://www.w3.org/1999/xlink";
function uo(e, t, n, r, i, a = de(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(lo, t.slice(6, t.length)) : e.setAttributeNS(lo, t, n) : n == null || a && !fe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : y(n) ? String(n) : n);
}
function fo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Wa(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = fe(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function po(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function mo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var ho = /* @__PURE__ */ Symbol("_vei");
function go(e, t, n, r, i = null) {
	let a = e[ho] || (e[ho] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = yo(t);
		r ? po(e, n, a[t] = Co(r, i), s) : o && (mo(e, n, o, s), a[t] = void 0);
	}
}
var _o = /(Once|Passive|Capture)$/, vo = /^on:?(?:Once|Passive|Capture)$/;
function yo(e) {
	let t, n;
	for (; (n = e.match(_o)) && !vo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : M(e.slice(2)), t];
}
var bo = 0, xo = /* @__PURE__ */ Promise.resolve(), So = () => bo ||= (xo.then(() => bo = 0), Date.now());
function Co(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (p(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && mn(e, t, 5, a);
			}
		} else mn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = So(), n;
}
var wo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, To = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Za(e, r, o) : t === "style" ? no(e, n, r) : s(t) ? c(t) || go(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Eo(e, t, r, o)) ? (fo(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && uo(e, t, r, o, a, t !== "value")) : e._isVueCE && (Do(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(r))) ? fo(e, A(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), uo(e, t, r, o));
};
function Eo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && wo(t) && _(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return wo(t) && v(n) ? !1 : t in e;
}
function Do(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = A(t);
	return Array.isArray(n) ? n.some((e) => A(e) === r) : Object.keys(n).some((e) => A(e) === r);
}
var Oo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return p(t) ? (e) => te(t, e) : t;
};
function ko(e) {
	e.target.composing = !0;
}
function Ao(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var jo = /* @__PURE__ */ Symbol("_assign");
function Mo(e, t, n) {
	return t && (e = e.trim()), n && (e = F(e)), e;
}
var No = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[jo] = Oo(i);
		let a = r || i.props && i.props.type === "number";
		po(e, t ? "change" : "input", (t) => {
			t.target.composing || e[jo](Mo(e.value, n, a));
		}), (n || a) && po(e, "change", () => {
			e.value = Mo(e.value, n, a);
		}), t || (po(e, "compositionstart", ko), po(e, "compositionend", Ao), po(e, "change", Ao));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[jo] = Oo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? F(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Po = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, po(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? F(Io(e)) : Io(e));
			e[jo](e.multiple ? h(e._modelValue) ? new Set(t) : t : t[0]), e._assigning = !0, wn(() => {
				e._assigning = !1;
			});
		}), e[jo] = Oo(r);
	},
	mounted(e, { value: t }) {
		Fo(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[jo] = Oo(n);
	},
	updated(e, { value: t }) {
		e._assigning || Fo(e, t);
	}
};
function Fo(e, t) {
	let n = e.multiple, r = p(t);
	if (!(n && !r && !h(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Io(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = he(t, o) > -1;
			} else a.selected = t.has(o);
			else if (me(Io(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Io(e) {
	return "_value" in e ? e._value : e.value;
}
var Lo = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Ro = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, t) => Lo.some((n) => e[`${n}Key`] && !t.includes(n))
}, zo = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Ro[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Bo = /* @__PURE__ */ l({ patchProp: To }, Ya), Vo;
function Ho() {
	return Vo ||= Pi(Bo);
}
var Uo = ((...e) => {
	let t = Ho().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Go(e);
		if (!r) return;
		let i = t._component;
		!_(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Wo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Wo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Go(e) {
	return v(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/pinia/dist/pinia.mjs
var Ko, qo = (e) => Ko = e, Jo = Symbol();
function Yo(e) {
	return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var Xo;
(function(e) {
	e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(Xo ||= {});
var Zo = typeof window < "u", Qo = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : typeof globalThis == "object" ? globalThis : { HTMLElement: null };
function $o(e, { autoBom: t = !1 } = {}) {
	return t && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["﻿", e], { type: e.type }) : e;
}
function es(e, t, n) {
	let r = new XMLHttpRequest();
	r.open("GET", e), r.responseType = "blob", r.onload = function() {
		as(r.response, t, n);
	}, r.onerror = function() {
		console.error("could not download file");
	}, r.send();
}
function ts(e) {
	let t = new XMLHttpRequest();
	t.open("HEAD", e, !1);
	try {
		t.send();
	} catch {}
	return t.status >= 200 && t.status <= 299;
}
function ns(e) {
	try {
		e.dispatchEvent(new MouseEvent("click"));
	} catch {
		let t = document.createEvent("MouseEvents");
		t.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), e.dispatchEvent(t);
	}
}
var rs = typeof navigator == "object" ? navigator : { userAgent: "" }, is = /Macintosh/.test(rs.userAgent) && /AppleWebKit/.test(rs.userAgent) && !/Safari/.test(rs.userAgent), as = Zo ? typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype && !is ? os : "msSaveOrOpenBlob" in rs ? ss : cs : () => {};
function os(e, t = "download", n) {
	let r = document.createElement("a");
	r.download = t, r.rel = "noopener", typeof e == "string" ? (r.href = e, r.origin === location.origin ? ns(r) : ts(r.href) ? es(e, t, n) : (r.target = "_blank", ns(r))) : (r.href = URL.createObjectURL(e), setTimeout(function() {
		URL.revokeObjectURL(r.href);
	}, 4e4), setTimeout(function() {
		ns(r);
	}, 0));
}
function ss(e, t = "download", n) {
	if (typeof e == "string") if (ts(e)) es(e, t, n);
	else {
		let t = document.createElement("a");
		t.href = e, t.target = "_blank", setTimeout(function() {
			ns(t);
		});
	}
	else navigator.msSaveOrOpenBlob($o(e, n), t);
}
function cs(e, t, n, r) {
	if (r ||= open("", "_blank"), r && (r.document.title = r.document.body.innerText = "downloading..."), typeof e == "string") return es(e, t, n);
	let i = e.type === "application/octet-stream", a = /constructor/i.test(String(Qo.HTMLElement)) || "safari" in Qo, o = /CriOS\/[\d]+/.test(navigator.userAgent);
	if ((o || i && a || is) && typeof FileReader < "u") {
		let t = new FileReader();
		t.onloadend = function() {
			let e = t.result;
			if (typeof e != "string") throw r = null, Error("Wrong reader.result type");
			e = o ? e : e.replace(/^data:[^;]*;/, "data:attachment/file;"), r ? r.location.href = e : location.assign(e), r = null;
		}, t.readAsDataURL(e);
	} else {
		let t = URL.createObjectURL(e);
		r ? r.location.assign(t) : location.href = t, r = null, setTimeout(function() {
			URL.revokeObjectURL(t);
		}, 4e4);
	}
}
var { assign: ls } = Object;
function us() {
	let e = xe(!0), t = e.run(() => /* @__PURE__ */ z({})), n = [], r = [], i = Ht({
		install(e) {
			qo(i), i._a = e, e.provide(Jo, i), e.config.globalProperties.$pinia = i, r.forEach((e) => n.push(e)), r = [];
		},
		use(e) {
			return this._a ? n.push(e) : r.push(e), this;
		},
		_p: n,
		_a: null,
		_e: e,
		_s: /* @__PURE__ */ new Map(),
		state: t
	});
	return i;
}
var ds = () => {};
function fs(e, t, n, r = ds) {
	e.push(t);
	let i = () => {
		let n = e.indexOf(t);
		n > -1 && (e.splice(n, 1), r());
	};
	return !n && Se() && Ce(i), i;
}
function ps(e, ...t) {
	e.slice().forEach((e) => {
		e(...t);
	});
}
var ms = (e) => e(), hs = Symbol(), gs = Symbol();
function _s(e, t) {
	e instanceof Map && t instanceof Map ? t.forEach((t, n) => e.set(n, t)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
	for (let n in t) {
		if (!t.hasOwnProperty(n)) continue;
		let r = t[n], i = e[n];
		Yo(i) && Yo(r) && e.hasOwnProperty(n) && !/* @__PURE__ */ Gt(r) && !/* @__PURE__ */ Rt(r) ? e[n] = _s(i, r) : e[n] = r;
	}
	return e;
}
var vs = Symbol();
function ys(e) {
	return !Yo(e) || !e.hasOwnProperty(vs);
}
var { assign: bs } = Object;
function xs(e) {
	return !!(/* @__PURE__ */ Gt(e) && e.effect);
}
function Ss(e, t, n, r) {
	let { state: i, actions: a, getters: o } = t, s = n.state.value[e], c;
	function l() {
		return s || (n.state.value[e] = i ? i() : {}), bs(/* @__PURE__ */ $t(n.state.value[e]), a, Object.keys(o || {}).reduce((t, r) => (t[r] = Ht(Y(() => {
			qo(n);
			let t = n._s.get(e);
			return o[r].call(t, t);
		})), t), {}));
	}
	return c = Cs(e, l, t, n, r, !0), c;
}
function Cs(e, t, n = {}, r, i, a) {
	let o, s = bs({ actions: {} }, n), c = { deep: !0 }, l, u, d = [], f = [], p = r.state.value[e];
	!a && !p && (r.state.value[e] = {});
	let m;
	function h(t) {
		let n;
		l = u = !1, typeof t == "function" ? (t(r.state.value[e]), n = {
			type: Xo.patchFunction,
			storeId: e,
			events: void 0
		}) : (_s(r.state.value[e], t), n = {
			type: Xo.patchObject,
			payload: t,
			storeId: e,
			events: void 0
		});
		let i = m = Symbol();
		wn().then(() => {
			m === i && (l = !0);
		}), u = !0, ps(d, n, r.state.value[e]);
	}
	let g = a ? function() {
		let { state: e } = n, t = e ? e() : {};
		this.$patch((e) => {
			bs(e, t);
		});
	} : ds;
	function _() {
		o.stop(), d = [], f = [], r._s.delete(e);
	}
	let v = (t, n = "") => {
		if (hs in t) return t[gs] = n, t;
		let i = function() {
			qo(r);
			let n = Array.from(arguments), a = [], o = [];
			function s(e) {
				a.push(e);
			}
			function c(e) {
				o.push(e);
			}
			ps(f, {
				args: n,
				name: i[gs],
				store: y,
				after: s,
				onError: c
			});
			let l;
			try {
				l = t.apply(this && this.$id === e ? this : y, n);
			} catch (e) {
				throw ps(o, e), e;
			}
			return l instanceof Promise ? l.then((e) => (ps(a, e), e)).catch((e) => (ps(o, e), Promise.reject(e))) : (ps(a, l), l);
		};
		return i[hs] = !0, i[gs] = n, i;
	}, y = /* @__PURE__ */ Pt({
		_p: r,
		$id: e,
		$onAction: fs.bind(null, f),
		$patch: h,
		$reset: g,
		$subscribe(t, n = {}) {
			let i = fs(d, t, n.detached, () => a()), a = o.run(() => U(() => r.state.value[e], (r) => {
				(n.flush === "sync" ? u : l) && t({
					storeId: e,
					type: Xo.direct,
					events: void 0
				}, r);
			}, bs({}, c, n)));
			return i;
		},
		$dispose: _
	});
	r._s.set(e, y);
	let b = (r._a && r._a.runWithContext || ms)(() => r._e.run(() => (o = xe()).run(() => t({ action: v }))));
	for (let t in b) {
		let n = b[t];
		/* @__PURE__ */ Gt(n) && !xs(n) || /* @__PURE__ */ Rt(n) ? a || (p && ys(n) && (/* @__PURE__ */ Gt(n) ? n.value = p[t] : _s(n, p[t])), r.state.value[e][t] = n) : typeof n == "function" && (b[t] = v(n, t), s.actions[t] = n);
	}
	return bs(y, b), bs(/* @__PURE__ */ R(y), b), Object.defineProperty(y, "$state", {
		get: () => r.state.value[e],
		set: (e) => {
			h((t) => {
				bs(t, e);
			});
		}
	}), r._p.forEach((e) => {
		bs(y, o.run(() => e({
			store: y,
			app: r._a,
			pinia: r,
			options: s
		})));
	}), p && a && n.hydrate && n.hydrate(y.$state, p), l = !0, u = !0, y;
}
function ws(e, t, n) {
	let r, i, a = typeof t == "function";
	typeof e == "string" ? (r = e, i = a ? n : t) : (i = e, r = e.id);
	function o(e, n) {
		let o = Bn();
		return e ||= o ? zn(Jo, null) : null, e && qo(e), e = Ko, e._s.has(r) || (a ? Cs(r, t, i, e) : Ss(r, i, e)), e._s.get(r);
	}
	return o.$id = r, o;
}
//#endregion
//#region node_modules/@vue-flow/core/dist/vue-flow-core.mjs
function Ts(e) {
	return Se() ? (Ce(e), !0) : !1;
}
function Es(e) {
	return typeof e == "function" ? e() : B(e);
}
var Ds = typeof window < "u" && typeof document < "u", Os = (e) => e !== void 0, ks = Object.prototype.toString, As = (e) => ks.call(e) === "[object Object]", js = () => {};
function Ms(e, t) {
	function n(...n) {
		return new Promise((r, i) => {
			Promise.resolve(e(() => t.apply(this, n), {
				fn: t,
				thisArg: this,
				args: n
			})).then(r).catch(i);
		});
	}
	return n;
}
var Ns = (e) => e();
function Ps(e = Ns) {
	let t = /* @__PURE__ */ z(!0);
	function n() {
		t.value = !1;
	}
	function r() {
		t.value = !0;
	}
	return {
		isActive: /* @__PURE__ */ It(t),
		pause: n,
		resume: r,
		eventFilter: (...n) => {
			t.value && e(...n);
		}
	};
}
function Fs(e, t = !1, n = "Timeout") {
	return new Promise((r, i) => {
		setTimeout(t ? () => i(n) : r, e);
	});
}
function Is(e, t, n = {}) {
	let { eventFilter: r = Ns, ...i } = n;
	return U(e, Ms(r, t), i);
}
function Ls(e, t, n = {}) {
	let { eventFilter: r, ...i } = n, { eventFilter: a, pause: o, resume: s, isActive: c } = Ps(r);
	return {
		stop: Is(e, t, {
			...i,
			eventFilter: a
		}),
		pause: o,
		resume: s,
		isActive: c
	};
}
function Rs(e, t = {}) {
	if (!/* @__PURE__ */ Gt(e)) return /* @__PURE__ */ $t(e);
	let n = Array.isArray(e.value) ? Array.from({ length: e.value.length }) : {};
	for (let r in e.value) n[r] = Qt(() => ({
		get() {
			return e.value[r];
		},
		set(n) {
			if (Es(t.replaceRef) ?? !0) if (Array.isArray(e.value)) {
				let t = [...e.value];
				t[r] = n, e.value = t;
			} else {
				let t = {
					...e.value,
					[r]: n
				};
				Object.setPrototypeOf(t, Object.getPrototypeOf(e.value)), e.value = t;
			}
			else e.value[r] = n;
		}
	}));
	return n;
}
function zs(e, t = !1) {
	function n(n, { flush: r = "sync", deep: i = !1, timeout: a, throwOnTimeout: o } = {}) {
		let s = null, c = [new Promise((a) => {
			s = U(e, (e) => {
				n(e) !== t && (s?.(), a(e));
			}, {
				flush: r,
				deep: i,
				immediate: !0
			});
		})];
		return a != null && c.push(Fs(a, o).then(() => Es(e)).finally(() => s?.())), Promise.race(c);
	}
	function r(r, i) {
		if (!/* @__PURE__ */ Gt(r)) return n((e) => e === r, i);
		let { flush: a = "sync", deep: o = !1, timeout: s, throwOnTimeout: c } = i ?? {}, l = null, u = [new Promise((n) => {
			l = U([e, r], ([e, r]) => {
				t !== (e === r) && (l?.(), n(e));
			}, {
				flush: a,
				deep: o,
				immediate: !0
			});
		})];
		return s != null && u.push(Fs(s, c).then(() => Es(e)).finally(() => (l?.(), Es(e)))), Promise.race(u);
	}
	function i(e) {
		return n((e) => !!e, e);
	}
	function a(e) {
		return r(null, e);
	}
	function o(e) {
		return r(void 0, e);
	}
	function s(e) {
		return n(Number.isNaN, e);
	}
	function c(e, t) {
		return n((t) => {
			let n = Array.from(t);
			return n.includes(e) || n.includes(Es(e));
		}, t);
	}
	function l(e) {
		return u(1, e);
	}
	function u(e = 1, t) {
		let r = -1;
		return n(() => (r += 1, r >= e), t);
	}
	return Array.isArray(Es(e)) ? {
		toMatch: n,
		toContains: c,
		changed: l,
		changedTimes: u,
		get not() {
			return zs(e, !t);
		}
	} : {
		toMatch: n,
		toBe: r,
		toBeTruthy: i,
		toBeNull: a,
		toBeNaN: s,
		toBeUndefined: o,
		changed: l,
		changedTimes: u,
		get not() {
			return zs(e, !t);
		}
	};
}
function Bs(e) {
	return zs(e);
}
function Vs(e) {
	let t = Es(e);
	return t?.$el ?? t;
}
var Hs = Ds ? window : void 0;
function Us(...e) {
	let t, n, r, i;
	if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([n, r, i] = e, t = Hs) : [t, n, r, i] = e, !t) return js;
	Array.isArray(n) || (n = [n]), Array.isArray(r) || (r = [r]);
	let a = [], o = () => {
		a.forEach((e) => e()), a.length = 0;
	}, s = (e, t, n, r) => (e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r)), c = U(() => [Vs(t), Es(i)], ([e, t]) => {
		if (o(), !e) return;
		let i = As(t) ? { ...t } : t;
		a.push(...n.flatMap((t) => r.map((n) => s(e, t, n, i))));
	}, {
		immediate: !0,
		flush: "post"
	}), l = () => {
		c(), o();
	};
	return Ts(l), l;
}
function Ws(e) {
	return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function Gs(...e) {
	let t, n, r = {};
	e.length === 3 ? (t = e[0], n = e[1], r = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], r = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
	let { target: i = Hs, eventName: a = "keydown", passive: o = !1, dedupe: s = !1 } = r, c = Ws(t);
	return Us(i, a, (e) => {
		e.repeat && Es(s) || c(e) && n(e);
	}, o);
}
function Ks(e) {
	return JSON.parse(JSON.stringify(e));
}
function qs(e, t, n, r = {}) {
	let { clone: i = !1, passive: a = !1, eventName: o, deep: s = !1, defaultValue: c, shouldEmit: l } = r, u = xa(), d = n || u?.emit || (u?.$emit)?.bind(u) || (u?.proxy?.$emit)?.bind(u?.proxy), f = o;
	t ||= "modelValue", f ||= `update:${t.toString()}`;
	let p = (e) => i ? typeof i == "function" ? i(e) : Ks(e) : e, m = () => Os(e[t]) ? p(e[t]) : c, h = (e) => {
		l ? l(e) && d(f, e) : d(f, e);
	};
	if (a) {
		let n = /* @__PURE__ */ z(m()), r = !1;
		return U(() => e[t], (e) => {
			r || (r = !0, n.value = p(e), wn(() => r = !1));
		}), U(n, (n) => {
			!r && (n !== e[t] || s) && h(n);
		}, { deep: s }), n;
	} else return Y({
		get() {
			return m();
		},
		set(e) {
			h(e);
		}
	});
}
var Js = { value: () => {} };
function Ys() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new Xs(n);
}
function Xs(e) {
	this._ = e;
}
function Zs(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
Xs.prototype = Ys.prototype = {
	constructor: Xs,
	on: function(e, t) {
		var n = this._, r = Zs(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = Qs(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++a < o;) if (i = (e = r[a]).type) n[i] = $s(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = $s(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new Xs(e);
	},
	call: function(e, t) {
		if ((i = arguments.length - 2) > 0) for (var n = Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
	},
	apply: function(e, t, n) {
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
	}
};
function Qs(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function $s(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = Js, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var ec = "http://www.w3.org/1999/xhtml", tc = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: ec,
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
function nc(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), tc.hasOwnProperty(t) ? {
		space: tc[t],
		local: e
	} : e;
}
function rc(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === ec && t.documentElement.namespaceURI === ec ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function ic(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function ac(e) {
	var t = nc(e);
	return (t.local ? ic : rc)(t);
}
function oc() {}
function sc(e) {
	return e == null ? oc : function() {
		return this.querySelector(e);
	};
}
function cc(e) {
	typeof e != "function" && (e = sc(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new Xl(r, this._parents);
}
function lc(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function uc() {
	return [];
}
function dc(e) {
	return e == null ? uc : function() {
		return this.querySelectorAll(e);
	};
}
function fc(e) {
	return function() {
		return lc(e.apply(this, arguments));
	};
}
function pc(e) {
	e = typeof e == "function" ? fc(e) : dc(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new Xl(r, i);
}
function mc(e) {
	return function() {
		return this.matches(e);
	};
}
function hc(e) {
	return function(t) {
		return t.matches(e);
	};
}
var gc = Array.prototype.find;
function _c(e) {
	return function() {
		return gc.call(this.children, e);
	};
}
function vc() {
	return this.firstElementChild;
}
function yc(e) {
	return this.select(e == null ? vc : _c(typeof e == "function" ? e : hc(e)));
}
var bc = Array.prototype.filter;
function xc() {
	return Array.from(this.children);
}
function Sc(e) {
	return function() {
		return bc.call(this.children, e);
	};
}
function Cc(e) {
	return this.selectAll(e == null ? xc : Sc(typeof e == "function" ? e : hc(e)));
}
function wc(e) {
	typeof e != "function" && (e = mc(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new Xl(r, this._parents);
}
function Tc(e) {
	return Array(e.length);
}
function Ec() {
	return new Xl(this._enter || this._groups.map(Tc), this._parents);
}
function Dc(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Dc.prototype = {
	constructor: Dc,
	appendChild: function(e) {
		return this._parent.insertBefore(e, this._next);
	},
	insertBefore: function(e, t) {
		return this._parent.insertBefore(e, t);
	},
	querySelector: function(e) {
		return this._parent.querySelector(e);
	},
	querySelectorAll: function(e) {
		return this._parent.querySelectorAll(e);
	}
};
function Oc(e) {
	return function() {
		return e;
	};
}
function kc(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new Dc(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function Ac(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new Dc(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function jc(e) {
	return e.__data__;
}
function Mc(e, t) {
	if (!arguments.length) return Array.from(this, jc);
	var n = t ? Ac : kc, r = this._parents, i = this._groups;
	typeof e != "function" && (e = Oc(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = Nc(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new Xl(o, r), o._enter = s, o._exit = c, o;
}
function Nc(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Pc() {
	return new Xl(this._exit || this._groups.map(Tc), this._parents);
}
function Fc(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
function Ic(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new Xl(s, this._parents);
}
function Lc() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
function Rc(e) {
	e ||= zc;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new Xl(i, this._parents).order();
}
function zc(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Bc() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
function Vc() {
	return Array.from(this);
}
function Hc() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
function Uc() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
function Wc() {
	return !this.node();
}
function Gc(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
function Kc(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function qc(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Jc(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Yc(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Xc(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function Zc(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Qc(e, t) {
	var n = nc(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? qc : Kc : typeof t == "function" ? n.local ? Zc : Xc : n.local ? Yc : Jc)(n, t));
}
function $c(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function el(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function tl(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function nl(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function rl(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? el : typeof t == "function" ? nl : tl)(e, t, n ?? "")) : il(this.node(), e);
}
function il(e, t) {
	return e.style.getPropertyValue(t) || $c(e).getComputedStyle(e, null).getPropertyValue(t);
}
function al(e) {
	return function() {
		delete this[e];
	};
}
function ol(e, t) {
	return function() {
		this[e] = t;
	};
}
function sl(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function cl(e, t) {
	return arguments.length > 1 ? this.each((t == null ? al : typeof t == "function" ? sl : ol)(e, t)) : this.node()[e];
}
function ll(e) {
	return e.trim().split(/^|\s+/);
}
function ul(e) {
	return e.classList || new dl(e);
}
function dl(e) {
	this._node = e, this._names = ll(e.getAttribute("class") || "");
}
dl.prototype = {
	add: function(e) {
		this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
	},
	remove: function(e) {
		var t = this._names.indexOf(e);
		t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
	},
	contains: function(e) {
		return this._names.indexOf(e) >= 0;
	}
};
function fl(e, t) {
	for (var n = ul(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function pl(e, t) {
	for (var n = ul(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function ml(e) {
	return function() {
		fl(this, e);
	};
}
function hl(e) {
	return function() {
		pl(this, e);
	};
}
function gl(e, t) {
	return function() {
		(t.apply(this, arguments) ? fl : pl)(this, e);
	};
}
function _l(e, t) {
	var n = ll(e + "");
	if (arguments.length < 2) {
		for (var r = ul(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? gl : t ? ml : hl)(n, t));
}
function vl() {
	this.textContent = "";
}
function yl(e) {
	return function() {
		this.textContent = e;
	};
}
function bl(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function xl(e) {
	return arguments.length ? this.each(e == null ? vl : (typeof e == "function" ? bl : yl)(e)) : this.node().textContent;
}
function Sl() {
	this.innerHTML = "";
}
function Cl(e) {
	return function() {
		this.innerHTML = e;
	};
}
function wl(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function Tl(e) {
	return arguments.length ? this.each(e == null ? Sl : (typeof e == "function" ? wl : Cl)(e)) : this.node().innerHTML;
}
function El() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function Dl() {
	return this.each(El);
}
function Ol() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function kl() {
	return this.each(Ol);
}
function Al(e) {
	var t = typeof e == "function" ? e : ac(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
function jl() {
	return null;
}
function Ml(e, t) {
	var n = typeof e == "function" ? e : ac(e), r = t == null ? jl : typeof t == "function" ? t : sc(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
function Nl() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function Pl() {
	return this.each(Nl);
}
function Fl() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Il() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ll(e) {
	return this.select(e ? Il : Fl);
}
function Rl(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function zl(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function Bl(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function Vl(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function Hl(e, t, n) {
	return function() {
		var r = this.__on, i, a = zl(t);
		if (r) {
			for (var o = 0, s = r.length; o < s; ++o) if ((i = r[o]).type === e.type && i.name === e.name) {
				this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
				return;
			}
		}
		this.addEventListener(e.type, a, n), i = {
			type: e.type,
			name: e.name,
			value: t,
			listener: a,
			options: n
		}, r ? r.push(i) : this.__on = [i];
	};
}
function Ul(e, t, n) {
	var r = Bl(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? Hl : Vl, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
function Wl(e, t, n) {
	var r = $c(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Gl(e, t) {
	return function() {
		return Wl(this, e, t);
	};
}
function Kl(e, t) {
	return function() {
		return Wl(this, e, t.apply(this, arguments));
	};
}
function ql(e, t) {
	return this.each((typeof t == "function" ? Kl : Gl)(e, t));
}
function* Jl() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
var Yl = [null];
function Xl(e, t) {
	this._groups = e, this._parents = t;
}
function Zl() {
	return new Xl([[document.documentElement]], Yl);
}
function Ql() {
	return this;
}
Xl.prototype = Zl.prototype = {
	constructor: Xl,
	select: cc,
	selectAll: pc,
	selectChild: yc,
	selectChildren: Cc,
	filter: wc,
	data: Mc,
	enter: Ec,
	exit: Pc,
	join: Fc,
	merge: Ic,
	selection: Ql,
	order: Lc,
	sort: Rc,
	call: Bc,
	nodes: Vc,
	node: Hc,
	size: Uc,
	empty: Wc,
	each: Gc,
	attr: Qc,
	style: rl,
	property: cl,
	classed: _l,
	text: xl,
	html: Tl,
	raise: Dl,
	lower: kl,
	append: Al,
	insert: Ml,
	remove: Pl,
	clone: Ll,
	datum: Rl,
	on: Ul,
	dispatch: ql,
	[Symbol.iterator]: Jl
};
function $l(e) {
	return typeof e == "string" ? new Xl([[document.querySelector(e)]], [document.documentElement]) : new Xl([[e]], Yl);
}
function eu(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
function tu(e, t) {
	if (e = eu(e), t === void 0 && (t = e.currentTarget), t) {
		var n = t.ownerSVGElement || t;
		if (n.createSVGPoint) {
			var r = n.createSVGPoint();
			return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
		}
		if (t.getBoundingClientRect) {
			var i = t.getBoundingClientRect();
			return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
		}
	}
	return [e.pageX, e.pageY];
}
var nu = { passive: !1 }, ru = {
	capture: !0,
	passive: !1
};
function iu(e) {
	e.stopImmediatePropagation();
}
function au(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
function ou(e) {
	var t = e.document.documentElement, n = $l(e).on("dragstart.drag", au, ru);
	"onselectstart" in t ? n.on("selectstart.drag", au, ru) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function su(e, t) {
	var n = e.document.documentElement, r = $l(e).on("dragstart.drag", null);
	t && (r.on("click.drag", au, ru), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
var cu = (e) => () => e;
function lu(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
	Object.defineProperties(this, {
		type: {
			value: e,
			enumerable: !0,
			configurable: !0
		},
		sourceEvent: {
			value: t,
			enumerable: !0,
			configurable: !0
		},
		subject: {
			value: n,
			enumerable: !0,
			configurable: !0
		},
		target: {
			value: r,
			enumerable: !0,
			configurable: !0
		},
		identifier: {
			value: i,
			enumerable: !0,
			configurable: !0
		},
		active: {
			value: a,
			enumerable: !0,
			configurable: !0
		},
		x: {
			value: o,
			enumerable: !0,
			configurable: !0
		},
		y: {
			value: s,
			enumerable: !0,
			configurable: !0
		},
		dx: {
			value: c,
			enumerable: !0,
			configurable: !0
		},
		dy: {
			value: l,
			enumerable: !0,
			configurable: !0
		},
		_: { value: u }
	});
}
lu.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
function uu(e) {
	return !e.ctrlKey && !e.button;
}
function du() {
	return this.parentNode;
}
function fu(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function pu() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function mu() {
	var e = uu, t = du, n = fu, r = pu, i = {}, a = Ys("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, nu).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!(u || !e.call(this, n, r))) {
			var i = y(this, t.call(this, n, r), n, r, "mouse");
			i && ($l(n.view).on("mousemove.drag", m, ru).on("mouseup.drag", h, ru), ou(n.view), iu(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (au(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		$l(e.view).on("mousemove.drag mouseup.drag", null), su(e.view, l), au(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) {
			var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s, c;
			for (s = 0; s < o; ++s) (c = y(this, a, n, r, i[s].identifier, i[s])) && (iu(n), c("start", n, i[s]));
		}
	}
	function _(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (r = 0; r < n; ++r) (a = i[t[r].identifier]) && (au(e), a("drag", e, t[r]));
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (iu(e), a("end", e, t[r]));
	}
	function y(e, t, r, s, c, l) {
		var u = a.copy(), d = tu(l || r, t), p, m, h;
		if ((h = n.call(e, new lu("beforestart", {
			sourceEvent: r,
			target: f,
			identifier: c,
			active: o,
			x: d[0],
			y: d[1],
			dx: 0,
			dy: 0,
			dispatch: u
		}), s)) != null) return p = h.x - d[0] || 0, m = h.y - d[1] || 0, function n(r, a, l) {
			var g = d, _;
			switch (r) {
				case "start":
					i[c] = n, _ = o++;
					break;
				case "end": delete i[c], --o;
				case "drag":
					d = tu(l || a, t), _ = o;
					break;
			}
			u.call(r, e, new lu(r, {
				sourceEvent: a,
				subject: h,
				target: f,
				identifier: c,
				active: _,
				x: d[0] + p,
				y: d[1] + m,
				dx: d[0] - g[0],
				dy: d[1] - g[1],
				dispatch: u
			}), s);
		};
	}
	return f.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : cu(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : cu(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : cu(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : cu(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
function hu(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function gu(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
function _u() {}
var vu = .7, yu = 1 / vu, bu = "\\s*([+-]?\\d+)\\s*", xu = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Su = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Cu = /^#([0-9a-f]{3,8})$/, wu = RegExp(`^rgb\\(${bu},${bu},${bu}\\)$`), Tu = RegExp(`^rgb\\(${Su},${Su},${Su}\\)$`), Eu = RegExp(`^rgba\\(${bu},${bu},${bu},${xu}\\)$`), Du = RegExp(`^rgba\\(${Su},${Su},${Su},${xu}\\)$`), Ou = RegExp(`^hsl\\(${xu},${Su},${Su}\\)$`), ku = RegExp(`^hsla\\(${xu},${Su},${Su},${xu}\\)$`), Au = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
hu(_u, Fu, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: ju,
	formatHex: ju,
	formatHex8: Mu,
	formatHsl: Nu,
	formatRgb: Pu,
	toString: Pu
});
function ju() {
	return this.rgb().formatHex();
}
function Mu() {
	return this.rgb().formatHex8();
}
function Nu() {
	return Ju(this).formatHsl();
}
function Pu() {
	return this.rgb().formatRgb();
}
function Fu(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = Cu.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Iu(t) : n === 3 ? new Bu(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Lu(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Lu(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = wu.exec(e)) ? new Bu(t[1], t[2], t[3], 1) : (t = Tu.exec(e)) ? new Bu(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Eu.exec(e)) ? Lu(t[1], t[2], t[3], t[4]) : (t = Du.exec(e)) ? Lu(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Ou.exec(e)) ? qu(t[1], t[2] / 100, t[3] / 100, 1) : (t = ku.exec(e)) ? qu(t[1], t[2] / 100, t[3] / 100, t[4]) : Au.hasOwnProperty(e) ? Iu(Au[e]) : e === "transparent" ? new Bu(NaN, NaN, NaN, 0) : null;
}
function Iu(e) {
	return new Bu(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Lu(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new Bu(e, t, n, r);
}
function Ru(e) {
	return e instanceof _u || (e = Fu(e)), e ? (e = e.rgb(), new Bu(e.r, e.g, e.b, e.opacity)) : new Bu();
}
function zu(e, t, n, r) {
	return arguments.length === 1 ? Ru(e) : new Bu(e, t, n, r ?? 1);
}
function Bu(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
hu(Bu, zu, gu(_u, {
	brighter(e) {
		return e = e == null ? yu : yu ** +e, new Bu(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? vu : vu ** +e, new Bu(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new Bu(Gu(this.r), Gu(this.g), Gu(this.b), Wu(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: Vu,
	formatHex: Vu,
	formatHex8: Hu,
	formatRgb: Uu,
	toString: Uu
}));
function Vu() {
	return `#${Ku(this.r)}${Ku(this.g)}${Ku(this.b)}`;
}
function Hu() {
	return `#${Ku(this.r)}${Ku(this.g)}${Ku(this.b)}${Ku((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Uu() {
	let e = Wu(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${Gu(this.r)}, ${Gu(this.g)}, ${Gu(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Wu(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Gu(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ku(e) {
	return e = Gu(e), (e < 16 ? "0" : "") + e.toString(16);
}
function qu(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Xu(e, t, n, r);
}
function Ju(e) {
	if (e instanceof Xu) return new Xu(e.h, e.s, e.l, e.opacity);
	if (e instanceof _u || (e = Fu(e)), !e) return new Xu();
	if (e instanceof Xu) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new Xu(o, s, c, e.opacity);
}
function Yu(e, t, n, r) {
	return arguments.length === 1 ? Ju(e) : new Xu(e, t, n, r ?? 1);
}
function Xu(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
hu(Xu, Yu, gu(_u, {
	brighter(e) {
		return e = e == null ? yu : yu ** +e, new Xu(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? vu : vu ** +e, new Xu(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new Bu($u(e >= 240 ? e - 240 : e + 120, i, r), $u(e, i, r), $u(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new Xu(Zu(this.h), Qu(this.s), Qu(this.l), Wu(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Wu(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${Zu(this.h)}, ${Qu(this.s) * 100}%, ${Qu(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function Zu(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Qu(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function $u(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
var ed = (e) => () => e;
function td(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function nd(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function rd(e) {
	return (e = +e) == 1 ? id : function(t, n) {
		return n - t ? nd(t, n, e) : ed(isNaN(t) ? n : t);
	};
}
function id(e, t) {
	var n = t - e;
	return n ? td(e, n) : ed(isNaN(e) ? t : e);
}
var ad = function e(t) {
	var n = rd(t);
	function r(e, t) {
		var r = n((e = zu(e)).r, (t = zu(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = id(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
}(1);
function od(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function sd(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function cd(e, t) {
	var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o;
	for (o = 0; o < r; ++o) i[o] = _d(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
function ld(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
function ud(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
function dd(e, t) {
	var n = {}, r = {}, i;
	for (i in (typeof e != "object" || !e) && (e = {}), (typeof t != "object" || !t) && (t = {}), t) i in e ? n[i] = _d(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
var fd = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, pd = new RegExp(fd.source, "g");
function md(e) {
	return function() {
		return e;
	};
}
function hd(e) {
	return function(t) {
		return e(t) + "";
	};
}
function gd(e, t) {
	var n = fd.lastIndex = pd.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = fd.exec(e)) && (i = pd.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: ud(r, i)
	})), n = pd.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? hd(c[0].x) : md(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
function _d(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? ed(t) : (n === "number" ? ud : n === "string" ? (r = Fu(t)) ? (t = r, ad) : gd : t instanceof Fu ? ad : t instanceof Date ? ld : sd(t) ? od : Array.isArray(t) ? cd : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? dd : ud)(e, t);
}
var vd = 180 / Math.PI, yd = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function bd(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * vd,
		skewX: Math.atan(c) * vd,
		scaleX: o,
		scaleY: s
	};
}
var xd;
function Sd(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? yd : bd(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Cd(e) {
	return e == null || (xd ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), xd.setAttribute("transform", e), !(e = xd.transform.baseVal.consolidate())) ? yd : (e = e.matrix, bd(e.a, e.b, e.c, e.d, e.e, e.f));
}
function wd(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: ud(e, i)
			}, {
				i: c - 2,
				x: ud(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: ud(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: ud(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: ud(e, n)
			}, {
				i: s - 2,
				x: ud(t, r)
			});
		} else (n !== 1 || r !== 1) && a.push(i(a) + "scale(" + n + "," + r + ")");
	}
	return function(t, n) {
		var r = [], i = [];
		return t = e(t), n = e(n), a(t.translateX, t.translateY, n.translateX, n.translateY, r, i), o(t.rotate, n.rotate, r, i), s(t.skewX, n.skewX, r, i), c(t.scaleX, t.scaleY, n.scaleX, n.scaleY, r, i), t = n = null, function(e) {
			for (var t = -1, n = i.length, a; ++t < n;) r[(a = i[t]).i] = a.x(e);
			return r.join("");
		};
	};
}
var Td = wd(Sd, "px, ", "px)", "deg)"), Ed = wd(Cd, ", ", ")", ")"), Dd = 1e-12;
function Od(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function kd(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Ad(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var jd = function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < Dd) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = Od(y), c = s / (n * g) * (i * Ad(t * r + y) - kd(y));
				return [
					a + c * d,
					o + c * f,
					s * i / Od(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
}(Math.SQRT2, 2, 4), Md = 0, Nd = 0, Pd = 0, Fd = 1e3, Id, Ld, Rd = 0, zd = 0, Bd = 0, Vd = typeof performance == "object" && performance.now ? performance : Date, Hd = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function Ud() {
	return zd ||= (Hd(Wd), Vd.now() + Bd);
}
function Wd() {
	zd = 0;
}
function Gd() {
	this._call = this._time = this._next = null;
}
Gd.prototype = Kd.prototype = {
	constructor: Gd,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? Ud() : +n) + (t == null ? 0 : +t), !this._next && Ld !== this && (Ld ? Ld._next = this : Id = this, Ld = this), this._call = e, this._time = n, Zd();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, Zd());
	}
};
function Kd(e, t, n) {
	var r = new Gd();
	return r.restart(e, t, n), r;
}
function qd() {
	Ud(), ++Md;
	for (var e = Id, t; e;) (t = zd - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--Md;
}
function Jd() {
	zd = (Rd = Vd.now()) + Bd, Md = Nd = 0;
	try {
		qd();
	} finally {
		Md = 0, Xd(), zd = 0;
	}
}
function Yd() {
	var e = Vd.now(), t = e - Rd;
	t > Fd && (Bd -= t, Rd = e);
}
function Xd() {
	for (var e, t = Id, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Id = n);
	Ld = e, Zd(r);
}
function Zd(e) {
	Md || (Nd &&= clearTimeout(Nd), e - zd > 24 ? (e < Infinity && (Nd = setTimeout(Jd, e - Vd.now() - Bd)), Pd &&= clearInterval(Pd)) : (Pd ||= (Rd = Vd.now(), setInterval(Yd, Fd)), Md = 1, Hd(Jd)));
}
function Qd(e, t, n) {
	var r = new Gd();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
var $d = Ys("start", "end", "cancel", "interrupt"), ef = [], tf = 0, nf = 1, rf = 2, af = 3, of = 4, sf = 5, cf = 6;
function lf(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	pf(e, n, {
		name: t,
		index: r,
		group: i,
		on: $d,
		tween: ef,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: tf
	});
}
function uf(e, t) {
	var n = ff(e, t);
	if (n.state > tf) throw Error("too late; already scheduled");
	return n;
}
function df(e, t) {
	var n = ff(e, t);
	if (n.state > af) throw Error("too late; already running");
	return n;
}
function ff(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function pf(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = Kd(a, 0, n.time);
	function a(e) {
		n.state = nf, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== nf) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === af) return Qd(o);
			f.state === of ? (f.state = cf, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = cf, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Qd(function() {
			n.state === af && (n.state = of, n.timer.restart(s, n.delay, n.time), s(a));
		}), n.state = rf, n.on.call("start", e, e.__data__, n.index, n.group), n.state === rf) {
			for (n.state = af, i = Array(d = n.tween.length), l = 0, u = -1; l < d; ++l) (f = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (i[++u] = f);
			i.length = u + 1;
		}
	}
	function s(t) {
		for (var r = t < n.duration ? n.ease.call(null, t / n.duration) : (n.timer.restart(c), n.state = sf, 1), a = -1, o = i.length; ++a < o;) i[a].call(e, r);
		n.state === sf && (n.on.call("end", e, e.__data__, n.index, n.group), c());
	}
	function c() {
		for (var i in n.state = cf, n.timer.stop(), delete r[t], r) return;
		delete e.__transition;
	}
}
function mf(e, t) {
	var n = e.__transition, r, i, a = !0, o;
	if (n) {
		for (o in t = t == null ? null : t + "", n) {
			if ((r = n[o]).name !== t) {
				a = !1;
				continue;
			}
			i = r.state > rf && r.state < sf, r.state = cf, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[o];
		}
		a && delete e.__transition;
	}
}
function hf(e) {
	return this.each(function() {
		mf(this, e);
	});
}
function gf(e, t) {
	var n, r;
	return function() {
		var i = df(this, e), a = i.tween;
		if (a !== n) {
			r = n = a;
			for (var o = 0, s = r.length; o < s; ++o) if (r[o].name === t) {
				r = r.slice(), r.splice(o, 1);
				break;
			}
		}
		i.tween = r;
	};
}
function _f(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = df(this, e), o = a.tween;
		if (o !== r) {
			i = (r = o).slice();
			for (var s = {
				name: t,
				value: n
			}, c = 0, l = i.length; c < l; ++c) if (i[c].name === t) {
				i[c] = s;
				break;
			}
			c === l && i.push(s);
		}
		a.tween = i;
	};
}
function vf(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = ff(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? gf : _f)(n, e, t));
}
function yf(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = df(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return ff(e, r).value[t];
	};
}
function bf(e, t) {
	var n;
	return (typeof t == "number" ? ud : t instanceof Fu ? ad : (n = Fu(t)) ? (t = n, ad) : gd)(e, t);
}
function xf(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Sf(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Cf(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function wf(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Tf(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Ef(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function Df(e, t) {
	var n = nc(e), r = n === "transform" ? Ed : bf;
	return this.attrTween(e, typeof t == "function" ? (n.local ? Ef : Tf)(n, r, yf(this, "attr." + e, t)) : t == null ? (n.local ? Sf : xf)(n) : (n.local ? wf : Cf)(n, r, t));
}
function Of(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function kf(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function Af(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && kf(e, i)), n;
	}
	return i._value = t, i;
}
function jf(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && Of(e, i)), n;
	}
	return i._value = t, i;
}
function Mf(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = nc(e);
	return this.tween(n, (r.local ? Af : jf)(r, t));
}
function Nf(e, t) {
	return function() {
		uf(this, e).delay = +t.apply(this, arguments);
	};
}
function Pf(e, t) {
	return t = +t, function() {
		uf(this, e).delay = t;
	};
}
function Ff(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? Nf : Pf)(t, e)) : ff(this.node(), t).delay;
}
function If(e, t) {
	return function() {
		df(this, e).duration = +t.apply(this, arguments);
	};
}
function Lf(e, t) {
	return t = +t, function() {
		df(this, e).duration = t;
	};
}
function Rf(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? If : Lf)(t, e)) : ff(this.node(), t).duration;
}
function zf(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		df(this, e).ease = t;
	};
}
function Bf(e) {
	var t = this._id;
	return arguments.length ? this.each(zf(t, e)) : ff(this.node(), t).ease;
}
function Vf(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		df(this, e).ease = n;
	};
}
function Hf(e) {
	if (typeof e != "function") throw Error();
	return this.each(Vf(this._id, e));
}
function Uf(e) {
	typeof e != "function" && (e = mc(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new vp(r, this._parents, this._name, this._id);
}
function Wf(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new vp(o, this._parents, this._name, this._id);
}
function Gf(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function Kf(e, t, n) {
	var r, i, a = Gf(t) ? uf : df;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function qf(e, t) {
	var n = this._id;
	return arguments.length < 2 ? ff(this.node(), n).on.on(e) : this.each(Kf(n, e, t));
}
function Jf(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function Yf() {
	return this.on("end.remove", Jf(this._id));
}
function Xf(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = sc(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, lf(l[f], t, n, f, l, ff(u, n)));
	return new vp(a, this._parents, t, n);
}
function Zf(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = dc(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = ff(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && lf(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new vp(a, o, t, n);
}
var Qf = Zl.prototype.constructor;
function $f() {
	return new Qf(this._groups, this._parents);
}
function ep(e, t) {
	var n, r, i;
	return function() {
		var a = il(this, e), o = (this.style.removeProperty(e), il(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function tp(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function np(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = il(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function rp(e, t, n) {
	var r, i, a;
	return function() {
		var o = il(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), il(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function ip(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = df(this, e), l = c.on, u = c.value[a] == null ? s ||= tp(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function ap(e, t, n) {
	var r = (e += "") == "transform" ? Td : bf;
	return t == null ? this.styleTween(e, ep(e, r)).on("end.style." + e, tp(e)) : typeof t == "function" ? this.styleTween(e, rp(e, r, yf(this, "style." + e, t))).each(ip(this._id, e)) : this.styleTween(e, np(e, r, t), n).on("end.style." + e, null);
}
function op(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function sp(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && op(e, a, n)), r;
	}
	return a._value = t, a;
}
function cp(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, sp(e, t, n ?? ""));
}
function lp(e) {
	return function() {
		this.textContent = e;
	};
}
function up(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function dp(e) {
	return this.tween("text", typeof e == "function" ? up(yf(this, "text", e)) : lp(e == null ? "" : e + ""));
}
function fp(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function pp(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && fp(r)), t;
	}
	return r._value = e, r;
}
function mp(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, pp(e));
}
function hp() {
	for (var e = this._name, t = this._id, n = yp(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = ff(c, t);
		lf(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new vp(r, this._parents, e, n);
}
function gp() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = df(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
var _p = 0;
function vp(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function yp() {
	return ++_p;
}
var bp = Zl.prototype;
vp.prototype = {
	constructor: vp,
	select: Xf,
	selectAll: Zf,
	selectChild: bp.selectChild,
	selectChildren: bp.selectChildren,
	filter: Uf,
	merge: Wf,
	selection: $f,
	transition: hp,
	call: bp.call,
	nodes: bp.nodes,
	node: bp.node,
	size: bp.size,
	empty: bp.empty,
	each: bp.each,
	on: qf,
	attr: Df,
	attrTween: Mf,
	style: ap,
	styleTween: cp,
	text: dp,
	textTween: mp,
	remove: Yf,
	tween: vf,
	delay: Ff,
	duration: Rf,
	ease: Bf,
	easeVarying: Hf,
	end: gp,
	[Symbol.iterator]: bp[Symbol.iterator]
};
function xp(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Sp = {
	time: null,
	delay: 0,
	duration: 250,
	ease: xp
};
function Cp(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function wp(e) {
	var t, n;
	e instanceof vp ? (t = e._id, e = e._name) : (t = yp(), (n = Sp).time = Ud(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && lf(c, e, t, l, o, n || Cp(c, t));
	return new vp(r, this._parents, e, t);
}
Zl.prototype.interrupt = hf, Zl.prototype.transition = wp;
var Tp = (e) => () => e;
function Ep(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
	Object.defineProperties(this, {
		type: {
			value: e,
			enumerable: !0,
			configurable: !0
		},
		sourceEvent: {
			value: t,
			enumerable: !0,
			configurable: !0
		},
		target: {
			value: n,
			enumerable: !0,
			configurable: !0
		},
		transform: {
			value: r,
			enumerable: !0,
			configurable: !0
		},
		_: { value: i }
	});
}
function Dp(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
Dp.prototype = {
	constructor: Dp,
	scale: function(e) {
		return e === 1 ? this : new Dp(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new Dp(this.k, this.x + this.k * e, this.y + this.k * t);
	},
	apply: function(e) {
		return [e[0] * this.k + this.x, e[1] * this.k + this.y];
	},
	applyX: function(e) {
		return e * this.k + this.x;
	},
	applyY: function(e) {
		return e * this.k + this.y;
	},
	invert: function(e) {
		return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
	},
	invertX: function(e) {
		return (e - this.x) / this.k;
	},
	invertY: function(e) {
		return (e - this.y) / this.k;
	},
	rescaleX: function(e) {
		return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
	},
	rescaleY: function(e) {
		return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
	},
	toString: function() {
		return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	}
};
var Op = new Dp(1, 0, 0);
Dp.prototype;
function kp(e) {
	e.stopImmediatePropagation();
}
function Ap(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
function jp(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Mp() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Np() {
	return this.__zoom || Op;
}
function Pp(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function Fp() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ip(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function Lp() {
	var e = jp, t = Mp, n = Ip, r = Pp, i = Fp, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = jd, l = Ys("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
	function _(e) {
		e.property("__zoom", Np).on("wheel.zoom", w, { passive: !1 }).on("mousedown.zoom", T).on("dblclick.zoom", E).filter(i).on("touchstart.zoom", D).on("touchmove.zoom", O).on("touchend.zoom touchcancel.zoom", k).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	_.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", Np), e === i ? i.interrupt().each(function() {
			S(this, arguments).event(r).start().zoom(null, typeof t == "function" ? t.apply(this, arguments) : t).end();
		}) : x(e, t, n, r);
	}, _.scaleBy = function(e, t, n, r) {
		_.scaleTo(e, function() {
			return this.__zoom.k * (typeof t == "function" ? t.apply(this, arguments) : t);
		}, n, r);
	}, _.scaleTo = function(e, r, i, a) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), a = this.__zoom, s = i == null ? b(e) : typeof i == "function" ? i.apply(this, arguments) : i, c = a.invert(s), l = typeof r == "function" ? r.apply(this, arguments) : r;
			return n(y(v(a, l), s, c), e, o);
		}, i, a);
	}, _.translateBy = function(e, r, i, a) {
		_.transform(e, function() {
			return n(this.__zoom.translate(typeof r == "function" ? r.apply(this, arguments) : r, typeof i == "function" ? i.apply(this, arguments) : i), t.apply(this, arguments), o);
		}, null, a);
	}, _.translateTo = function(e, r, i, a, s) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), s = this.__zoom, c = a == null ? b(e) : typeof a == "function" ? a.apply(this, arguments) : a;
			return n(Op.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function v(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new Dp(t, e.x, e.y);
	}
	function y(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new Dp(e.k, r, i);
	}
	function b(e) {
		return [(+e[0][0] + +e[1][0]) / 2, (+e[0][1] + +e[1][1]) / 2];
	}
	function x(e, n, r, i) {
		e.on("start.zoom", function() {
			S(this, arguments).event(i).start();
		}).on("interrupt.zoom end.zoom", function() {
			S(this, arguments).event(i).end();
		}).tween("zoom", function() {
			var e = this, a = arguments, o = S(e, a).event(i), s = t.apply(e, a), l = r == null ? b(s) : typeof r == "function" ? r.apply(e, a) : r, u = Math.max(s[1][0] - s[0][0], s[1][1] - s[0][1]), d = e.__zoom, f = typeof n == "function" ? n.apply(e, a) : n, p = c(d.invert(l).concat(u / d.k), f.invert(l).concat(u / f.k));
			return function(e) {
				if (e === 1) e = f;
				else {
					var t = p(e), n = u / t[2];
					e = new Dp(n, l[0] - t[0] * n, l[1] - t[1] * n);
				}
				o.zoom(null, e);
			};
		});
	}
	function S(e, t, n) {
		return !n && e.__zooming || new C(e, t);
	}
	function C(e, n) {
		this.that = e, this.args = n, this.active = 0, this.sourceEvent = null, this.extent = t.apply(e, n), this.taps = 0;
	}
	C.prototype = {
		event: function(e) {
			return e && (this.sourceEvent = e), this;
		},
		start: function() {
			return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
		},
		zoom: function(e, t) {
			return this.mouse && e !== "mouse" && (this.mouse[1] = t.invert(this.mouse[0])), this.touch0 && e !== "touch" && (this.touch0[1] = t.invert(this.touch0[0])), this.touch1 && e !== "touch" && (this.touch1[1] = t.invert(this.touch1[0])), this.that.__zoom = t, this.emit("zoom"), this;
		},
		end: function() {
			return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
		},
		emit: function(e) {
			var t = $l(this.that).datum();
			l.call(e, this.that, new Ep(e, {
				sourceEvent: this.sourceEvent,
				target: _,
				type: e,
				transform: this.that.__zoom,
				dispatch: l
			}), t);
		}
	};
	function w(t, ...i) {
		if (!e.apply(this, arguments)) return;
		var s = S(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = tu(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], mf(this), s.start();
		Ap(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(y(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function T(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = S(this, r, !0).event(t), s = $l(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = tu(t, i), l = t.clientX, u = t.clientY;
		ou(t.view), kp(t), a.mouse = [c, this.__zoom.invert(c)], mf(this), a.start();
		function d(e) {
			if (Ap(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(y(a.that.__zoom, a.mouse[0] = tu(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), su(e.view, a.moved), Ap(e), a.event(e).end();
		}
	}
	function E(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = tu(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(y(v(a, u), c, l), t.apply(this, i), o);
			Ap(r), s > 0 ? $l(this).transition().duration(s).call(x, d, c, r) : $l(this).call(_.transform, d, c, r);
		}
	}
	function D(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = S(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (kp(t), s = 0; s < i; ++s) c = r[s], l = tu(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), mf(this), a.start());
		}
	}
	function O(e, ...t) {
		if (this.__zooming) {
			var r = S(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (Ap(e), s = 0; s < a; ++s) c = i[s], l = tu(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
			if (c = r.that.__zoom, r.touch1) {
				var d = r.touch0[0], f = r.touch0[1], p = r.touch1[0], m = r.touch1[1], h = (h = p[0] - d[0]) * h + (h = p[1] - d[1]) * h, g = (g = m[0] - f[0]) * g + (g = m[1] - f[1]) * g;
				c = v(c, Math.sqrt(h / g)), l = [(d[0] + p[0]) / 2, (d[1] + p[1]) / 2], u = [(f[0] + m[0]) / 2, (f[1] + m[1]) / 2];
			} else if (r.touch0) l = r.touch0[0], u = r.touch0[1];
			else return;
			r.zoom("touch", n(y(c, l, u), r.extent, o));
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var n = S(this, t).event(e), r = e.changedTouches, i = r.length, a, o;
			for (kp(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = tu(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < g)) {
				var s = $l(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return _.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : Tp(+e), _) : r;
	}, _.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : Tp(!!t), _) : e;
	}, _.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : Tp(!!e), _) : i;
	}, _.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : Tp([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), _) : t;
	}, _.scaleExtent = function(e) {
		return arguments.length ? (a[0] = +e[0], a[1] = +e[1], _) : [a[0], a[1]];
	}, _.translateExtent = function(e) {
		return arguments.length ? (o[0][0] = +e[0][0], o[1][0] = +e[1][0], o[0][1] = +e[0][1], o[1][1] = +e[1][1], _) : [[o[0][0], o[0][1]], [o[1][0], o[1][1]]];
	}, _.constrain = function(e) {
		return arguments.length ? (n = e, _) : n;
	}, _.duration = function(e) {
		return arguments.length ? (s = +e, _) : s;
	}, _.interpolate = function(e) {
		return arguments.length ? (c = e, _) : c;
	}, _.on = function() {
		var e = l.on.apply(l, arguments);
		return e === l ? _ : e;
	}, _.clickDistance = function(e) {
		return arguments.length ? (h = (e = +e) * e, _) : Math.sqrt(h);
	}, _.tapDistance = function(e) {
		return arguments.length ? (g = +e, _) : g;
	}, _;
}
var X = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(X || {}), Rp = /* @__PURE__ */ ((e) => (e.Partial = "partial", e.Full = "full", e))(Rp || {}), zp = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(zp || {}), Bp = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(Bp || {}), Vp = /* @__PURE__ */ ((e) => (e.Arrow = "arrow", e.ArrowClosed = "arrowclosed", e))(Vp || {}), Hp = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(Hp || {}), Up = [
	"INPUT",
	"SELECT",
	"TEXTAREA"
], Wp = typeof document < "u" ? document : null;
function Gp(e) {
	let t = e.composedPath?.call(e)?.[0] || e.target, n = typeof t?.hasAttribute == "function" && t.hasAttribute("contenteditable"), r = typeof t?.closest == "function" ? t.closest(".nokey") : null;
	return Up.includes(t?.nodeName) || n || !!r;
}
function Kp(e) {
	return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
}
function qp(e, t, n, r) {
	let i = t.replace("+", "\n").replace("\n\n", "\n+").split("\n").map((e) => e.trim().toLowerCase());
	if (i.length === 1) return e.toLowerCase() === t.toLowerCase();
	r || n.add(e.toLowerCase());
	let a = i.every((e, t) => n.has(e) && Array.from(n.values())[t] === i[t]);
	return r && n.delete(e.toLowerCase()), a;
}
function Jp(e, t) {
	return (n) => {
		if (!n.code && !n.key) return !1;
		let r = Yp(n.code, e);
		return Array.isArray(e) ? e.some((e) => qp(n[r], e, t, n.type === "keyup")) : qp(n[r], e, t, n.type === "keyup");
	};
}
function Yp(e, t) {
	return t.includes(e) ? "code" : "key";
}
function Xp(e, t) {
	let n = Y(() => V(t?.target) ?? Wp), r = /* @__PURE__ */ Kt(V(e) === !0), i = !1, a = /* @__PURE__ */ new Set(), o = c(V(e));
	U(() => V(e), (e, t) => {
		typeof t == "boolean" && typeof e != "boolean" && s(), o = c(e);
	}, { immediate: !0 }), Us(["blur", "contextmenu"], s), Gs((...e) => o(...e), (e) => {
		let n = V(t?.actInsideInputWithModifier) ?? !0, a = V(t?.preventDefault) ?? !1;
		if (i = Kp(e), (!i || i && !n) && Gp(e)) return;
		let o = e.composedPath?.call(e)?.[0] || e.target, s = o?.nodeName === "BUTTON" || o?.nodeName === "A";
		!a && (i || !s) && e.preventDefault(), r.value = !0;
	}, {
		eventName: "keydown",
		target: n
	}), Gs((...e) => o(...e), (e) => {
		let n = V(t?.actInsideInputWithModifier) ?? !0;
		if (r.value) {
			if ((!i || i && !n) && Gp(e)) return;
			i = !1, r.value = !1;
		}
	}, {
		eventName: "keyup",
		target: n
	});
	function s() {
		i = !1, a.clear(), r.value = V(e) === !0;
	}
	function c(e) {
		return e === null ? (s(), () => !1) : typeof e == "boolean" ? (s(), r.value = e, () => !1) : Array.isArray(e) || typeof e == "string" ? Jp(e, a) : e;
	}
	return r;
}
var Zp = "vue-flow__node-desc", Qp = "vue-flow__edge-desc", $p = "vue-flow__aria-live", em = [
	"Enter",
	" ",
	"Escape"
], tm = {
	ArrowUp: {
		x: 0,
		y: -1
	},
	ArrowDown: {
		x: 0,
		y: 1
	},
	ArrowLeft: {
		x: -1,
		y: 0
	},
	ArrowRight: {
		x: 1,
		y: 0
	}
};
function nm(e) {
	return {
		...e.computedPosition || {
			x: 0,
			y: 0
		},
		width: e.dimensions.width || 0,
		height: e.dimensions.height || 0
	};
}
function rm(e, t) {
	let n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), r = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
	return Math.ceil(n * r);
}
function im(e) {
	return {
		width: e.offsetWidth,
		height: e.offsetHeight
	};
}
function am(e, t = 0, n = 1) {
	return Math.min(Math.max(e, t), n);
}
function om(e, t) {
	return {
		x: am(e.x, t[0][0], t[1][0]),
		y: am(e.y, t[0][1], t[1][1])
	};
}
function sm(e) {
	let t = e.getRootNode();
	return "elementFromPoint" in t ? t : window.document;
}
function cm(e) {
	return e && typeof e == "object" && "id" in e && "source" in e && "target" in e;
}
function lm(e) {
	return e && typeof e == "object" && "id" in e && "position" in e && !cm(e);
}
function um(e) {
	return lm(e) && "computedPosition" in e;
}
function dm(e) {
	return !Number.isNaN(e) && Number.isFinite(e);
}
function fm(e) {
	return dm(e.width) && dm(e.height) && dm(e.x) && dm(e.y);
}
function pm(e, t, n) {
	let r = {
		id: e.id.toString(),
		type: e.type ?? "default",
		dimensions: Ht({
			width: 0,
			height: 0
		}),
		computedPosition: Ht({
			z: 0,
			...e.position
		}),
		handleBounds: {
			source: [],
			target: []
		},
		draggable: void 0,
		selectable: void 0,
		connectable: void 0,
		focusable: void 0,
		selected: !1,
		dragging: !1,
		resizing: !1,
		initialized: !1,
		isParent: !1,
		position: {
			x: 0,
			y: 0
		},
		data: Mh(e.data) ? e.data : {},
		events: Ht(Mh(e.events) ? e.events : {})
	};
	return Object.assign(t ?? r, e, {
		id: e.id.toString(),
		parentNode: n
	});
}
function mm(e, t, n) {
	let r = {
		id: e.id.toString(),
		type: e.type ?? t?.type ?? "default",
		source: e.source.toString(),
		target: e.target.toString(),
		sourceHandle: e.sourceHandle?.toString(),
		targetHandle: e.targetHandle?.toString(),
		updatable: e.updatable ?? n?.updatable,
		selectable: e.selectable ?? n?.selectable,
		focusable: e.focusable ?? n?.focusable,
		data: Mh(e.data) ? e.data : {},
		events: Ht(Mh(e.events) ? e.events : {}),
		label: e.label ?? "",
		interactionWidth: e.interactionWidth ?? n?.interactionWidth,
		...n ?? {}
	};
	return Object.assign(t ?? r, e, { id: e.id.toString() });
}
function hm(e, t, n, r) {
	let i = typeof e == "string" ? e : e.id, a = /* @__PURE__ */ new Set(), o = r === "source" ? "target" : "source";
	for (let e of n) e[o] === i && a.add(e[r]);
	return t.filter((e) => a.has(e.id));
}
function gm(...e) {
	if (e.length === 3) {
		let [t, n, r] = e;
		return hm(t, n, r, "target");
	}
	let [t, n] = e, r = typeof t == "string" ? t : t.id;
	return n.filter((e) => cm(e) && e.source === r).map((e) => n.find((t) => lm(t) && t.id === e.target));
}
function _m(...e) {
	if (e.length === 3) {
		let [t, n, r] = e;
		return hm(t, n, r, "source");
	}
	let [t, n] = e, r = typeof t == "string" ? t : t.id;
	return n.filter((e) => cm(e) && e.target === r).map((e) => n.find((t) => lm(t) && t.id === e.source));
}
function vm({ source: e, sourceHandle: t, target: n, targetHandle: r }) {
	return `vueflow__edge-${e}${t ?? ""}-${n}${r ?? ""}`;
}
function ym(e, t) {
	return t.some((t) => cm(t) && t.source === e.source && t.target === e.target && (t.sourceHandle === e.sourceHandle || !t.sourceHandle && !e.sourceHandle) && (t.targetHandle === e.targetHandle || !t.targetHandle && !e.targetHandle));
}
function bm(e, t, n) {
	if (!e.source || !e.target) return Oh("Can't create edge. An edge needs a source and a target."), t;
	let r;
	return r = cm(e) ? { ...e } : {
		...e,
		id: vm(e)
	}, r = mm(r, void 0, n), ym(r, t) || t.push(r), t;
}
function xm({ x: e, y: t }, { x: n, y: r, zoom: i }) {
	return {
		x: e * i + n,
		y: t * i + r
	};
}
function Sm({ x: e, y: t }, { x: n, y: r, zoom: i }, a = !1, o = [1, 1]) {
	let s = {
		x: (e - n) / i,
		y: (t - r) / i
	};
	return a ? hh(s, o) : s;
}
function Cm(e, t) {
	return {
		x: Math.min(e.x, t.x),
		y: Math.min(e.y, t.y),
		x2: Math.max(e.x2, t.x2),
		y2: Math.max(e.y2, t.y2)
	};
}
function wm({ x: e, y: t, width: n, height: r }) {
	return {
		x: e,
		y: t,
		x2: e + n,
		y2: t + r
	};
}
function Tm({ x: e, y: t, x2: n, y2: r }) {
	return {
		x: e,
		y: t,
		width: n - e,
		height: r - t
	};
}
function Em(e) {
	let t = {
		x: Infinity,
		y: Infinity,
		x2: -Infinity,
		y2: -Infinity
	};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		t = Cm(t, wm({
			...r.computedPosition,
			...r.dimensions
		}));
	}
	return Tm(t);
}
function Dm(e, t, n = {
	x: 0,
	y: 0,
	zoom: 1
}, r = !1, i = !1) {
	let a = {
		...Sm(t, n),
		width: t.width / n.zoom,
		height: t.height / n.zoom
	}, o = [];
	for (let t of e) {
		let { dimensions: e, selectable: n = !0, hidden: s = !1 } = t, c = e.width ?? t.width ?? null, l = e.height ?? t.height ?? null;
		if (i && !n || s) continue;
		let u = rm(a, nm(t)), d = c === null || l === null, f = r && u > 0, p = (c ?? 0) * (l ?? 0);
		(d || f || u >= p || t.dragging) && o.push(t);
	}
	return o;
}
function Om(e, t) {
	let n = /* @__PURE__ */ new Set();
	if (typeof e == "string") n.add(e);
	else if (e.length >= 1) for (let t of e) n.add(t.id);
	return t.filter((e) => n.has(e.source) || n.has(e.target));
}
function km(e, t) {
	if (typeof e == "number") return Math.floor((t - t / (1 + e)) * .5);
	if (typeof e == "string" && e.endsWith("px")) {
		let t = Number.parseFloat(e);
		if (!Number.isNaN(t)) return Math.floor(t);
	}
	if (typeof e == "string" && e.endsWith("%")) {
		let n = Number.parseFloat(e);
		if (!Number.isNaN(n)) return Math.floor(t * n * .01);
	}
	return Oh(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Am(e, t, n) {
	if (typeof e == "string" || typeof e == "number") {
		let r = km(e, n), i = km(e, t);
		return {
			top: r,
			right: i,
			bottom: r,
			left: i,
			x: i * 2,
			y: r * 2
		};
	}
	if (typeof e == "object") {
		let r = km(e.top ?? e.y ?? 0, n), i = km(e.bottom ?? e.y ?? 0, n), a = km(e.left ?? e.x ?? 0, t), o = km(e.right ?? e.x ?? 0, t);
		return {
			top: r,
			right: o,
			bottom: i,
			left: a,
			x: a + o,
			y: r + i
		};
	}
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		x: 0,
		y: 0
	};
}
function jm(e, t, n, r, i, a) {
	let { x: o, y: s } = xm(e, {
		x: t,
		y: n,
		zoom: r
	}), { x: c, y: l } = xm({
		x: e.x + e.width,
		y: e.y + e.height
	}, {
		x: t,
		y: n,
		zoom: r
	}), u = i - c, d = a - l;
	return {
		left: Math.floor(o),
		top: Math.floor(s),
		right: Math.floor(u),
		bottom: Math.floor(d)
	};
}
function Mm(e, t, n, r, i, a = .1) {
	let o = Am(a, t, n), s = (t - o.x) / e.width, c = (n - o.y) / e.height, l = am(Math.min(s, c), r, i), u = e.x + e.width / 2, d = e.y + e.height / 2, f = t / 2 - u * l, p = n / 2 - d * l, m = jm(e, f, p, l, t, n), h = {
		left: Math.min(m.left - o.left, 0),
		top: Math.min(m.top - o.top, 0),
		right: Math.min(m.right - o.right, 0),
		bottom: Math.min(m.bottom - o.bottom, 0)
	};
	return {
		x: f - h.left + h.right,
		y: p - h.top + h.bottom,
		zoom: l
	};
}
function Nm(e, t) {
	return {
		x: t.x + e.x,
		y: t.y + e.y,
		z: (e.z > t.z ? e.z : t.z) + 1
	};
}
function Pm(e, t) {
	if (!e.parentNode) return !1;
	let n = t.get(e.parentNode);
	return n ? n.selected ? !0 : Pm(n, t) : !1;
}
function Fm(e, t) {
	return e === void 0 ? "" : typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((t) => `${t}=${e[t]}`).join("&")}`;
}
function Im(e) {
	let t = e.ctrlKey && ph() ? 10 : 1;
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * t;
}
function Lm(e, t, n) {
	return e < t ? am(Math.abs(e - t), 1, t) / t : e > n ? -am(Math.abs(e - n), 1, t) / t : 0;
}
function Rm(e, t, n = 15, r = 40) {
	return [Lm(e.x, r, t.width - r) * n, Lm(e.y, r, t.height - r) * n];
}
function zm(e, t) {
	if (t) {
		let n = e.position.x + e.dimensions.width - t.dimensions.width, r = e.position.y + e.dimensions.height - t.dimensions.height;
		if (n > 0 || r > 0 || e.position.x < 0 || e.position.y < 0) {
			let i = {};
			if (typeof t.style == "function" ? i = { ...t.style(t) } : t.style && (i = { ...t.style }), i.width = i.width ?? `${t.dimensions.width}px`, i.height = i.height ?? `${t.dimensions.height}px`, n > 0) if (typeof i.width == "string") {
				let e = Number(i.width.replace("px", ""));
				i.width = `${e + n}px`;
			} else i.width += n;
			if (r > 0) if (typeof i.height == "string") {
				let e = Number(i.height.replace("px", ""));
				i.height = `${e + r}px`;
			} else i.height += r;
			if (e.position.x < 0) {
				let n = Math.abs(e.position.x);
				if (t.position.x = t.position.x - n, typeof i.width == "string") {
					let e = Number(i.width.replace("px", ""));
					i.width = `${e + n}px`;
				} else i.width += n;
				e.position.x = 0;
			}
			if (e.position.y < 0) {
				let n = Math.abs(e.position.y);
				if (t.position.y = t.position.y - n, typeof i.height == "string") {
					let e = Number(i.height.replace("px", ""));
					i.height = `${e + n}px`;
				} else i.height += n;
				e.position.y = 0;
			}
			t.dimensions.width = Number(i.width.toString().replace("px", "")), t.dimensions.height = Number(i.height.toString().replace("px", "")), typeof t.style == "function" ? t.style = (e) => {
				let n = t.style;
				return {
					...n(e),
					...i
				};
			} : t.style = {
				...t.style,
				...i
			};
		}
	}
}
function Bm(e, t) {
	let n = e.filter((e) => e.type === "add" || e.type === "remove");
	for (let e of n) if (e.type === "add") t.findIndex((t) => t.id === e.item.id) === -1 && t.push(e.item);
	else if (e.type === "remove") {
		let n = t.findIndex((t) => t.id === e.id);
		n !== -1 && t.splice(n, 1);
	}
	let r = t.map((e) => e.id);
	for (let n of t) for (let i of e) if (i.id === n.id) switch (i.type) {
		case "select":
			n.selected = i.selected;
			break;
		case "position":
			if (um(n) && (i.position !== void 0 && (n.position = i.position), i.dragging !== void 0 && (n.dragging = i.dragging), n.expandParent && n.parentNode)) {
				let e = t[r.indexOf(n.parentNode)];
				e && um(e) && zm(n, e);
			}
			break;
		case "dimensions":
			if (um(n) && (i.dimensions !== void 0 && (n.dimensions = i.dimensions), i.updateStyle !== void 0 && i.updateStyle && (n.style = {
				...n.style || {},
				width: `${i.dimensions?.width}px`,
				height: `${i.dimensions?.height}px`
			}), i.resizing !== void 0 && (n.resizing = i.resizing), n.expandParent && n.parentNode)) {
				let e = t[r.indexOf(n.parentNode)];
				e && um(e) && (e.dimensions.width && e.dimensions.height ? zm(n, e) : wn(() => {
					zm(n, e);
				}));
			}
			break;
	}
	return t;
}
function Vm(e, t) {
	return Bm(e, t);
}
function Hm(e, t) {
	return Bm(e, t);
}
function Um(e, t) {
	return {
		id: e,
		type: "select",
		selected: t
	};
}
function Wm(e) {
	return {
		item: e,
		type: "add"
	};
}
function Gm(e) {
	return {
		id: e,
		type: "remove"
	};
}
function Km(e, t, n, r, i) {
	return {
		id: e,
		source: t,
		target: n,
		sourceHandle: r || null,
		targetHandle: i || null,
		type: "remove"
	};
}
function qm(e, t = /* @__PURE__ */ new Set(), n = !1) {
	let r = [];
	for (let [i, a] of e) {
		let e = t.has(i);
		!(a.selected === void 0 && !e) && a.selected !== e && (n && (a.selected = e), r.push(Um(a.id, e)));
	}
	return r;
}
var Jm = () => {};
function Z(e) {
	let t = /* @__PURE__ */ new Set(), n = Jm, r = () => !1, i = () => t.size > 0 || r(), a = (e) => {
		n = e;
	}, o = () => {
		n = Jm;
	}, s = (e) => {
		r = e;
	}, c = () => {
		r = () => !1;
	}, l = (e) => {
		t.delete(e);
	};
	return {
		on: (e) => {
			t.add(e);
			let n = () => l(e);
			return Ts(n), { off: n };
		},
		off: l,
		trigger: (r) => {
			let a = [n];
			return i() ? a.push(...t) : e && a.push(e), Promise.allSettled(a.map((e) => e(r)));
		},
		hasListeners: i,
		listeners: t,
		setEmitter: a,
		removeEmitter: o,
		setHasEmitListeners: s,
		removeHasEmitListeners: c
	};
}
function Ym(e, t, n) {
	let r = e;
	do {
		if (r && r.matches(t)) return !0;
		if (r === n) return !1;
		r = r.parentElement;
	} while (r);
	return !1;
}
function Xm(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let [a, o] of e) (o.selected || o.id === r) && (!o.parentNode || !Pm(o, e)) && (o.draggable || t && o.draggable === void 0) && e.get(a) && i.set(a, {
		id: o.id,
		position: o.position || {
			x: 0,
			y: 0
		},
		distance: {
			x: n.x - o.computedPosition?.x || 0,
			y: n.y - o.computedPosition?.y || 0
		},
		from: {
			x: o.computedPosition.x,
			y: o.computedPosition.y
		},
		extent: o.extent,
		parentNode: o.parentNode,
		dimensions: { ...o.dimensions },
		expandParent: o.expandParent
	});
	return Array.from(i.values());
}
function Zm({ id: e, dragItems: t, findNode: n }) {
	let r = [];
	for (let e of t) {
		let t = n(e.id);
		t && r.push(t);
	}
	return [e ? r.find((t) => t.id === e) : r[0], r];
}
function Qm(e) {
	if (Array.isArray(e)) switch (e.length) {
		case 1: return [
			e[0],
			e[0],
			e[0],
			e[0]
		];
		case 2: return [
			e[0],
			e[1],
			e[0],
			e[1]
		];
		case 3: return [
			e[0],
			e[1],
			e[2],
			e[1]
		];
		case 4: return e;
		default: return [
			0,
			0,
			0,
			0
		];
	}
	return [
		e,
		e,
		e,
		e
	];
}
function $m(e, t, n) {
	let [r, i, a, o] = typeof e == "string" ? [
		0,
		0,
		0,
		0
	] : Qm(e.padding);
	return n && n.computedPosition.x !== void 0 && n.computedPosition.y !== void 0 && n.dimensions.width !== void 0 && n.dimensions.height !== void 0 ? [[n.computedPosition.x + o, n.computedPosition.y + r], [n.computedPosition.x + n.dimensions.width - i, n.computedPosition.y + n.dimensions.height - a]] : !1;
}
function eh(e, t, n, r) {
	let i = e.extent || n;
	if ((i === "parent" || !Array.isArray(i) && i?.range === "parent") && !e.expandParent) if (e.parentNode && r && e.dimensions.width && e.dimensions.height) {
		let t = $m(i, e, r);
		t && (i = t);
	} else t(new lh(sh.NODE_EXTENT_INVALID, e.id)), i = n;
	else if (Array.isArray(i)) {
		let e = r?.computedPosition.x || 0, t = r?.computedPosition.y || 0;
		i = [[i[0][0] + e, i[0][1] + t], [i[1][0] + e, i[1][1] + t]];
	} else if (i !== "parent" && i?.range && Array.isArray(i.range)) {
		let [e, t, n, a] = Qm(i.padding), o = r?.computedPosition.x || 0, s = r?.computedPosition.y || 0;
		i = [[i.range[0][0] + o + a, i.range[0][1] + s + e], [i.range[1][0] + o - t, i.range[1][1] + s - n]];
	}
	return i === "parent" ? [[-Infinity, -Infinity], [Infinity, Infinity]] : i;
}
function th({ width: e, height: t }, n) {
	return [n[0], [n[1][0] - (e || 0), n[1][1] - (t || 0)]];
}
function nh(e, t, n, r, i) {
	let a = om(t, th(e.dimensions, eh(e, n, r, i)));
	return {
		position: {
			x: a.x - (i?.computedPosition.x || 0),
			y: a.y - (i?.computedPosition.y || 0)
		},
		computedPosition: a
	};
}
function rh(e, t, n = X.Left, r = !1) {
	let i = (t?.x ?? 0) + e.computedPosition.x, a = (t?.y ?? 0) + e.computedPosition.y, { width: o, height: s } = t ?? mh(e);
	if (r) return {
		x: i + o / 2,
		y: a + s / 2
	};
	switch (t?.position ?? n) {
		case X.Top: return {
			x: i + o / 2,
			y: a
		};
		case X.Right: return {
			x: i + o,
			y: a + s / 2
		};
		case X.Bottom: return {
			x: i + o / 2,
			y: a + s
		};
		case X.Left: return {
			x: i,
			y: a + s / 2
		};
	}
}
function ih(e, t) {
	return e && (t ? e.find((e) => e.id === t) : e[0]) || null;
}
function ah({ sourcePos: e, targetPos: t, sourceWidth: n, sourceHeight: r, targetWidth: i, targetHeight: a, width: o, height: s, viewport: c }) {
	let l = {
		x: Math.min(e.x, t.x),
		y: Math.min(e.y, t.y),
		x2: Math.max(e.x + n, t.x + i),
		y2: Math.max(e.y + r, t.y + a)
	};
	l.x === l.x2 && (l.x2 += 1), l.y === l.y2 && (l.y2 += 1);
	let u = wm({
		x: (0 - c.x) / c.zoom,
		y: (0 - c.y) / c.zoom,
		width: o / c.zoom,
		height: s / c.zoom
	}), d = Math.max(0, Math.min(u.x2, l.x2) - Math.max(u.x, l.x)), f = Math.max(0, Math.min(u.y2, l.y2) - Math.max(u.y, l.y));
	return Math.ceil(d * f) > 0;
}
function oh(e, t, n = !1) {
	let r = typeof e.zIndex == "number", i = r ? e.zIndex : 0, a = t(e.source), o = t(e.target);
	return !a || !o ? 0 : (n && (i = r ? e.zIndex : Math.max(a.computedPosition.z || 0, o.computedPosition.z || 0)), i);
}
var sh = /* @__PURE__ */ ((e) => (e.MISSING_STYLES = "MISSING_STYLES", e.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e.NODE_INVALID = "NODE_INVALID", e.NODE_NOT_FOUND = "NODE_NOT_FOUND", e.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e.EDGE_INVALID = "EDGE_INVALID", e.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e.EDGE_ORPHANED = "EDGE_ORPHANED", e.USEVUEFLOW_OPTIONS = "USEVUEFLOW_OPTIONS", e))(sh || {}), ch = {
	MISSING_STYLES: () => "It seems that you haven't loaded the necessary styles. Please import '@vue-flow/core/dist/style.css' to ensure that the graph is rendered correctly",
	MISSING_VIEWPORT_DIMENSIONS: () => "The Vue Flow parent container needs a width and a height to render the graph",
	NODE_INVALID: (e) => `Node is invalid
Node: ${e}`,
	NODE_NOT_FOUND: (e) => `Node not found
Node: ${e}`,
	NODE_MISSING_PARENT: (e, t) => `Node is missing a parent
Node: ${e}
Parent: ${t}`,
	NODE_TYPE_MISSING: (e) => `Node type is missing
Type: ${e}`,
	NODE_EXTENT_INVALID: (e) => `Only child nodes can use a parent extent
Node: ${e}`,
	EDGE_INVALID: (e) => `An edge needs a source and a target
Edge: ${e}`,
	EDGE_SOURCE_MISSING: (e, t) => `Edge source is missing
Edge: ${e} 
Source: ${t}`,
	EDGE_TARGET_MISSING: (e, t) => `Edge target is missing
Edge: ${e} 
Target: ${t}`,
	EDGE_TYPE_MISSING: (e) => `Edge type is missing
Type: ${e}`,
	EDGE_SOURCE_TARGET_SAME: (e, t, n) => `Edge source and target are the same
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
	EDGE_SOURCE_TARGET_MISSING: (e, t, n) => `Edge source or target is missing
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
	EDGE_ORPHANED: (e) => `Edge was orphaned (suddenly missing source or target) and has been removed
Edge: ${e}`,
	EDGE_NOT_FOUND: (e) => `Edge not found
Edge: ${e}`,
	USEVUEFLOW_OPTIONS: () => "The options parameter is deprecated and will be removed in the next major version. Please use the id parameter instead"
}, lh = class extends Error {
	constructor(e, ...t) {
		super(ch[e]?.call(ch, ...t)), this.name = "VueFlowError", this.code = e, this.args = t;
	}
};
function uh(e) {
	return "clientX" in e;
}
function dh(e) {
	return "sourceEvent" in e;
}
function fh(e, t) {
	let n = uh(e), r, i;
	return n ? (r = e.clientX, i = e.clientY) : "touches" in e && e.touches.length > 0 ? (r = e.touches[0].clientX, i = e.touches[0].clientY) : "changedTouches" in e && e.changedTouches.length > 0 ? (r = e.changedTouches[0].clientX, i = e.changedTouches[0].clientY) : (r = 0, i = 0), {
		x: r - (t?.left ?? 0),
		y: i - (t?.top ?? 0)
	};
}
var ph = () => typeof navigator < "u" && (navigator == null ? void 0 : navigator.userAgent)?.indexOf("Mac") >= 0;
function mh(e) {
	return {
		width: e.dimensions?.width ?? e.width ?? 0,
		height: e.dimensions?.height ?? e.height ?? 0
	};
}
function hh(e, t = [1, 1]) {
	return {
		x: t[0] * Math.round(e.x / t[0]),
		y: t[1] * Math.round(e.y / t[1])
	};
}
var gh = () => !0;
function _h(e) {
	e?.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function vh(e, t, n) {
	let r = [], i = {
		x: e.x - n,
		y: e.y - n,
		width: n * 2,
		height: n * 2
	};
	for (let e of t.values()) rm(i, nm(e)) > 0 && r.push(e);
	return r;
}
var yh = 250;
function bh(e, t, n, r) {
	let i = [], a = Infinity, o = vh(e, n, t + yh);
	for (let n of o) {
		let o = [...n.handleBounds?.source ?? [], ...n.handleBounds?.target ?? []];
		for (let s of o) {
			if (r.nodeId === s.nodeId && r.type === s.type && r.id === s.id) continue;
			let { x: o, y: c } = rh(n, s, s.position, !0), l = Math.sqrt((o - e.x) ** 2 + (c - e.y) ** 2);
			l > t || (l < a ? (i = [{
				...s,
				x: o,
				y: c
			}], a = l) : l === a && i.push({
				...s,
				x: o,
				y: c
			}));
		}
	}
	if (!i.length) return null;
	if (i.length > 1) {
		let e = r.type === "source" ? "target" : "source";
		return i.find((t) => t.type === e) ?? i[0];
	}
	return i[0];
}
function xh(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: i, fromType: a, doc: o, lib: s, flowId: c, isValidConnection: l = gh }, u, d, f, p) {
	let m = a === "target", h = t ? o.querySelector(`.${s}-flow__handle[data-id="${c}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: g, y: _ } = fh(e), v = o.elementFromPoint(g, _), y = v?.classList.contains(`${s}-flow__handle`) ? v : h, b = {
		handleDomNode: y,
		isValid: !1,
		connection: null,
		toHandle: null
	};
	if (y) {
		let e = Sh(void 0, y), t = y.getAttribute("data-nodeid"), a = y.getAttribute("data-handleid"), o = y.classList.contains("connectable"), s = y.classList.contains("connectableend");
		if (!t || !e) return b;
		let c = {
			source: m ? t : r,
			sourceHandle: m ? a : i,
			target: m ? r : t,
			targetHandle: m ? i : a
		};
		b.connection = c, b.isValid = o && s && (n === Bp.Strict ? m && e === "source" || !m && e === "target" : t !== r || a !== i) && l(c, {
			nodes: d,
			edges: u,
			sourceNode: f(c.source),
			targetNode: f(c.target)
		}), b.toHandle = Th(t, e, a, p, n, !0);
	}
	return b;
}
function Sh(e, t) {
	return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Ch(e, t) {
	let n = null;
	return t ? n = "valid" : e && !t && (n = "invalid"), n;
}
function wh(e, t) {
	let n = null;
	return t ? n = !0 : e && !t && (n = !1), n;
}
function Th(e, t, n, r, i, a = !1) {
	let o = r.get(e);
	if (!o) return null;
	let s = i === Bp.Strict ? o.handleBounds?.[t] : [...o.handleBounds?.source ?? [], ...o.handleBounds?.target ?? []], c = (n ? s?.find((e) => e.id === n) : s?.[0]) ?? null;
	return c && a ? {
		...c,
		...rh(o, c, c.position, !0)
	} : c;
}
var Eh = {
	[X.Left]: X.Right,
	[X.Right]: X.Left,
	[X.Top]: X.Bottom,
	[X.Bottom]: X.Top
}, Dh = ["production", "prod"];
function Oh(e, ...t) {
	kh() && console.warn(`[Vue Flow]: ${e}`, ...t);
}
function kh() {
	return !Dh.includes("production");
}
function Ah(e, t, n, r, i) {
	let a = t.querySelectorAll(`.vue-flow__handle.${e}`);
	return a?.length ? Array.from(a).map((t) => {
		let a = t.getBoundingClientRect();
		return {
			id: t.getAttribute("data-handleid"),
			type: e,
			nodeId: i,
			position: t.getAttribute("data-handlepos"),
			x: (a.left - n.left) / r,
			y: (a.top - n.top) / r,
			...im(t)
		};
	}) : null;
}
function jh(e, t, n, r, i, a = !1, o) {
	i.value = !1, e.selected ? (a || e.selected && t) && (r([e]), wn(() => {
		o.blur();
	})) : n([e]);
}
function Mh(e) {
	return B(e) !== void 0;
}
function Nh(e, t, n, r) {
	if (!e || !e.source || !e.target) return n(new lh(sh.EDGE_INVALID, e?.id ?? "[ID UNKNOWN]")), !1;
	let i;
	return i = cm(e) ? e : {
		...e,
		id: vm(e)
	}, i = mm(i, void 0, r), !ym(i, t) && i;
}
function Ph(e, t, n, r, i) {
	if (!t.source || !t.target) return i(new lh(sh.EDGE_INVALID, e.id)), !1;
	if (!n) return i(new lh(sh.EDGE_NOT_FOUND, e.id)), !1;
	let { id: a, ...o } = e;
	return {
		...o,
		id: r ? vm(t) : a,
		source: t.source,
		target: t.target,
		sourceHandle: t.sourceHandle,
		targetHandle: t.targetHandle
	};
}
function Fh(e, t, n) {
	let r = {}, i = [];
	for (let a = 0; a < e.length; ++a) {
		let o = e[a];
		if (!lm(o)) {
			n(new lh(sh.NODE_INVALID, o?.id));
			continue;
		}
		let s = pm(o, t(o.id), o.parentNode);
		o.parentNode && (r[o.parentNode] = !0), i[a] = s;
	}
	for (let e of i) {
		let a = t(e.parentNode) || i.find((t) => t.id === e.parentNode);
		e.parentNode && !a && n(new lh(sh.NODE_MISSING_PARENT, e.id, e.parentNode)), (e.parentNode || r[e.id]) && (r[e.id] && (e.isParent = !0), a && (a.isParent = !0));
	}
	return i;
}
function Ih(e, t, n, r, i, a) {
	let o = i, s = r.get(o) || /* @__PURE__ */ new Map();
	r.set(o, s.set(n, t)), o = `${i}-${e}`;
	let c = r.get(o) || /* @__PURE__ */ new Map();
	if (r.set(o, c.set(n, t)), a) {
		o = `${i}-${e}-${a}`;
		let s = r.get(o) || /* @__PURE__ */ new Map();
		r.set(o, s.set(n, t));
	}
}
function Lh(e, t, n) {
	e.clear();
	for (let t of n) {
		let { source: n, target: r, sourceHandle: i = null, targetHandle: a = null } = t, o = {
			edgeId: t.id,
			source: n,
			target: r,
			sourceHandle: i,
			targetHandle: a
		}, s = `${n}-${i}--${r}-${a}`;
		Ih("source", o, `${r}-${a}--${n}-${i}`, e, n, i), Ih("target", o, s, e, r, a);
	}
}
function Rh(e, t) {
	if (e.size !== t.size) return !1;
	for (let n of e) if (!t.has(n)) return !1;
	return !0;
}
function zh(e, t, n, r, i, a, o, s) {
	let c = [];
	for (let l of e) {
		let e = cm(l) ? l : Nh(l, s, i, a);
		if (!e) continue;
		let u = n(e.source), d = n(e.target);
		if (!u || !d) {
			i(new lh(sh.EDGE_SOURCE_TARGET_MISSING, e.id, e.source, e.target));
			continue;
		}
		if (!u) {
			i(new lh(sh.EDGE_SOURCE_MISSING, e.id, e.source));
			continue;
		}
		if (!d) {
			i(new lh(sh.EDGE_TARGET_MISSING, e.id, e.target));
			continue;
		}
		if (t && !t(e, {
			edges: s,
			nodes: o,
			sourceNode: u,
			targetNode: d
		})) {
			i(new lh(sh.EDGE_INVALID, e.id));
			continue;
		}
		let f = r(e.id);
		c.push({
			...mm(e, f, a),
			sourceNode: u,
			targetNode: d
		});
	}
	return c;
}
var Bh = Symbol("vueFlow"), Vh = Symbol("nodeId"), Hh = Symbol("nodeRef"), Uh = Symbol("edgeId"), Wh = Symbol("edgeRef"), Gh = Symbol("slots");
function Kh(e) {
	let { vueFlowRef: t, snapToGrid: n, snapGrid: r, noDragClassName: i, nodeLookup: a, nodeExtent: o, nodeDragThreshold: s, viewport: c, autoPanOnNodeDrag: l, autoPanSpeed: u, nodesDraggable: d, panBy: f, findNode: p, multiSelectionActive: m, nodesSelectionActive: h, selectNodesOnDrag: g, removeSelectedElements: _, addSelectedNodes: v, updateNodePositions: y, emits: b } = e_(), { onStart: x, onDrag: S, onStop: C, onClick: w, el: T, disabled: E, id: D, selectable: O, dragHandle: k } = e, A = /* @__PURE__ */ Kt(!1), j = [], M, ee = null, N = {
		x: void 0,
		y: void 0
	}, P = {
		x: 0,
		y: 0
	}, te = null, ne = !1, F = !1, re = 0, ie = !1, I = Yh(), ae = ({ x: e, y: t }) => {
		N = {
			x: e,
			y: t
		};
		let i = !1;
		if (j = j.map((a) => {
			let s = {
				x: e - a.distance.x,
				y: t - a.distance.y
			}, { computedPosition: c } = nh(a, n.value ? hh(s, r.value) : s, b.error, o.value, a.parentNode ? p(a.parentNode) : void 0);
			return i = i || a.position.x !== c.x || a.position.y !== c.y, a.position = c, a;
		}), F ||= i, i && (y(j, !0, !0), A.value = !0, te)) {
			let [e, t] = Zm({
				id: D,
				dragItems: j,
				findNode: p
			});
			S({
				event: te,
				node: e,
				nodes: t
			});
		}
	}, oe = () => {
		if (!ee) return;
		let [e, t] = Rm(P, ee, u.value);
		if (e !== 0 || t !== 0) {
			let n = {
				x: (N.x ?? 0) - e / c.value.zoom,
				y: (N.y ?? 0) - t / c.value.zoom
			};
			f({
				x: e,
				y: t
			}) && ae(n);
		}
		re = requestAnimationFrame(oe);
	}, se = (e, t) => {
		ne = !0;
		let n = p(D);
		!g.value && !m.value && n && (n.selected || _()), n && V(O) && g.value && jh(n, m.value, v, _, h, !1, t);
		let r = I(e.sourceEvent);
		if (N = r, j = Xm(a.value, d.value, r, D), j.length) {
			let [t, n] = Zm({
				id: D,
				dragItems: j,
				findNode: p
			});
			x({
				event: e.sourceEvent,
				node: t,
				nodes: n
			});
		}
	}, ce = (e, n) => {
		e.sourceEvent.type === "touchmove" && e.sourceEvent.touches.length > 1 || (F = !1, s.value === 0 && se(e, n), N = I(e.sourceEvent), ee = t.value?.getBoundingClientRect() || null, P = fh(e.sourceEvent, ee));
	}, le = (e, t) => {
		let n = I(e.sourceEvent);
		if (!ie && ne && l.value && (ie = !0, oe()), !ne) {
			let r = n.xSnapped - (N.x ?? 0), i = n.ySnapped - (N.y ?? 0);
			Math.sqrt(r * r + i * i) > s.value && se(e, t);
		}
		(N.x !== n.xSnapped || N.y !== n.ySnapped) && j.length && ne && (te = e.sourceEvent, P = fh(e.sourceEvent, ee), ae(n));
	}, ue = (e) => {
		let t = !1;
		if (!ne && !A.value && !m.value) {
			let n = e.sourceEvent, r = I(n), i = r.xSnapped - (N.x ?? 0), a = r.ySnapped - (N.y ?? 0), o = Math.sqrt(i * i + a * a);
			o !== 0 && o <= s.value && (w?.(n), t = !0);
		}
		if (j.length && !t) {
			F &&= (y(j, !1, !1), !1);
			let [t, n] = Zm({
				id: D,
				dragItems: j,
				findNode: p
			});
			C({
				event: e.sourceEvent,
				node: t,
				nodes: n
			});
		}
		j = [], A.value = !1, ie = !1, ne = !1, N = {
			x: void 0,
			y: void 0
		}, cancelAnimationFrame(re);
	};
	return U([() => V(E), T], ([e, t], n, r) => {
		if (t) {
			let n = $l(t);
			e || (M = mu().on("start", (e) => ce(e, t)).on("drag", (e) => le(e, t)).on("end", (e) => ue(e)).filter((e) => {
				let n = e.target, r = V(k);
				return !e.button && (!i.value || !Ym(n, `.${i.value}`, t) && (!r || Ym(n, r, t)));
			}), n.call(M)), r(() => {
				n.on(".drag", null), M && (M.on("start", null), M.on("drag", null), M.on("end", null));
			});
		}
	}), A;
}
function qh() {
	return {
		doubleClick: Z(),
		click: Z(),
		mouseEnter: Z(),
		mouseMove: Z(),
		mouseLeave: Z(),
		contextMenu: Z(),
		updateStart: Z(),
		update: Z(),
		updateEnd: Z()
	};
}
function Jh(e, t) {
	let n = qh();
	return n.doubleClick.on((n) => {
		var r, i;
		t.edgeDoubleClick(n), (i = (r = e.events)?.doubleClick) == null || i.call(r, n);
	}), n.click.on((n) => {
		var r, i;
		t.edgeClick(n), (i = (r = e.events)?.click) == null || i.call(r, n);
	}), n.mouseEnter.on((n) => {
		var r, i;
		t.edgeMouseEnter(n), (i = (r = e.events)?.mouseEnter) == null || i.call(r, n);
	}), n.mouseMove.on((n) => {
		var r, i;
		t.edgeMouseMove(n), (i = (r = e.events)?.mouseMove) == null || i.call(r, n);
	}), n.mouseLeave.on((n) => {
		var r, i;
		t.edgeMouseLeave(n), (i = (r = e.events)?.mouseLeave) == null || i.call(r, n);
	}), n.contextMenu.on((n) => {
		var r, i;
		t.edgeContextMenu(n), (i = (r = e.events)?.contextMenu) == null || i.call(r, n);
	}), n.updateStart.on((n) => {
		var r, i;
		t.edgeUpdateStart(n), (i = (r = e.events)?.updateStart) == null || i.call(r, n);
	}), n.update.on((n) => {
		var r, i;
		t.edgeUpdate(n), (i = (r = e.events)?.update) == null || i.call(r, n);
	}), n.updateEnd.on((n) => {
		var r, i;
		t.edgeUpdateEnd(n), (i = (r = e.events)?.updateEnd) == null || i.call(r, n);
	}), Object.entries(n).reduce((e, [t, n]) => (e.emit[t] = n.trigger, e.on[t] = n.on, e), {
		emit: {},
		on: {}
	});
}
function Yh() {
	let { viewport: e, snapGrid: t, snapToGrid: n, vueFlowRef: r } = e_();
	return (i) => {
		let a = r.value?.getBoundingClientRect() ?? {
			left: 0,
			top: 0
		}, { x: o, y: s } = fh(dh(i) ? i.sourceEvent : i, a), c = Sm({
			x: o,
			y: s
		}, e.value), { x: l, y: u } = n.value ? hh(c, t.value) : c;
		return {
			xSnapped: l,
			ySnapped: u,
			...c
		};
	};
}
function Xh() {
	return !0;
}
function Zh({ handleId: e, nodeId: t, type: n, isValidConnection: r, edgeUpdaterType: i, onEdgeUpdate: a, onEdgeUpdateEnd: o }) {
	let { id: s, vueFlowRef: c, connectionMode: l, connectionRadius: u, connectOnClick: d, connectionClickStartHandle: f, nodesConnectable: p, autoPanOnConnect: m, autoPanSpeed: h, findNode: g, panBy: _, startConnection: v, updateConnection: y, endConnection: b, emits: x, viewport: S, edges: C, nodes: w, isValidConnection: T, nodeLookup: E } = e_(), D = null, O = !1, k = null;
	function A(d) {
		let f = V(n) === "target", p = uh(d), A = sm(d.target), j = d.currentTarget;
		if (j && (p && d.button === 0 || !p)) {
			let n = function(n) {
				ae = fh(n, re), N = bh(Sm(ae, S.value, !1, [1, 1]), u.value, E.value, ce), oe ||= (se(), !0);
				let r = xh(n, {
					handle: N,
					connectionMode: l.value,
					fromNodeId: V(t),
					fromHandleId: V(e),
					fromType: f ? "target" : "source",
					isValidConnection: ee,
					doc: A,
					lib: "vue",
					flowId: s,
					nodeLookup: E.value
				}, C.value, w.value, g, E.value);
				k = r.handleDomNode, D = r.connection, O = wh(!!N, r.isValid);
				let i = {
					...de,
					isValid: O,
					to: r.toHandle && O ? xm({
						x: r.toHandle.x,
						y: r.toHandle.y
					}, S.value) : ae,
					toHandle: r.toHandle,
					toPosition: O && r.toHandle ? r.toHandle.position : Eh[ce.position],
					toNode: r.toHandle ? E.value.get(r.toHandle.nodeId) : null
				};
				if (O && N && de?.toHandle && i.toHandle && de.toHandle.type === i.toHandle.type && de.toHandle.nodeId === i.toHandle.nodeId && de.toHandle.id === i.toHandle.id && de.to.x === i.to.x && de.to.y === i.to.y) return;
				let a = N ?? r.toHandle;
				if (y(a && O ? xm({
					x: a.x,
					y: a.y
				}, S.value) : ae, a, Ch(!!a, O)), de = i, !N && !O && !k) return _h(I);
				D && D.source !== D.target && k && (_h(I), I = k, k.classList.add("connecting", "vue-flow__handle-connecting"), k.classList.toggle("valid", !!O), k.classList.toggle("vue-flow__handle-valid", !!O));
			}, p = function(e) {
				"touches" in e && e.touches.length > 0 || ((N || k) && D && O && (a ? a(e, D) : x.connect(D)), x.connectEnd(e), i && o?.(e), _h(I), cancelAnimationFrame(P), b(e), oe = !1, O = !1, D = null, k = null, A.removeEventListener("mousemove", n), A.removeEventListener("mouseup", p), A.removeEventListener("touchmove", n), A.removeEventListener("touchend", p));
			}, M = g(V(t)), ee = V(r) || T.value || Xh;
			!ee && M && (ee = (f ? M.isValidSourcePos : M.isValidTargetPos) || Xh);
			let N, P = 0, { x: te, y: ne } = fh(d), F = Sh(V(i), j), re = c.value?.getBoundingClientRect();
			if (!re || !F) return;
			let ie = Th(V(t), F, V(e), E.value, l.value);
			if (!ie) return;
			let I, ae = fh(d, re), oe = !1, se = () => {
				if (!m.value) return;
				let [e, t] = Rm(ae, re, h.value);
				_({
					x: e,
					y: t
				}), P = requestAnimationFrame(se);
			}, ce = {
				...ie,
				nodeId: V(t),
				type: F,
				position: ie.position
			}, le = E.value.get(V(t)), ue = {
				inProgress: !0,
				isValid: null,
				from: rh(le, ce, X.Left, !0),
				fromHandle: ce,
				fromPosition: ce.position,
				fromNode: le,
				to: ae,
				toHandle: null,
				toPosition: Eh[ce.position],
				toNode: null
			};
			v({
				nodeId: V(t),
				id: V(e),
				type: F,
				position: j?.getAttribute("data-handlepos") || X.Top,
				...ae
			}, {
				x: te - re.left,
				y: ne - re.top
			}), x.connectStart({
				event: d,
				nodeId: V(t),
				handleId: V(e),
				handleType: F
			});
			let de = ue;
			A.addEventListener("mousemove", n), A.addEventListener("mouseup", p), A.addEventListener("touchmove", n), A.addEventListener("touchend", p);
		}
	}
	function j(i) {
		if (!d.value) return;
		let a = V(n) === "target";
		if (!f.value) {
			x.clickConnectStart({
				event: i,
				nodeId: V(t),
				handleId: V(e)
			}), v({
				nodeId: V(t),
				type: V(n),
				id: V(e),
				position: X.Top,
				...fh(i)
			}, void 0, !0);
			return;
		}
		let o = V(r) || T.value || Xh, c = g(V(t));
		if (!o && c && (o = (a ? c.isValidSourcePos : c.isValidTargetPos) || Xh), c && (c.connectable === void 0 ? p.value : c.connectable) === !1) return;
		let u = sm(i.target), m = xh(i, {
			handle: {
				nodeId: V(t),
				id: V(e),
				type: V(n),
				position: X.Top,
				...fh(i)
			},
			connectionMode: l.value,
			fromNodeId: f.value.nodeId,
			fromHandleId: f.value.id ?? null,
			fromType: f.value.type,
			isValidConnection: o,
			doc: u,
			lib: "vue",
			flowId: s,
			nodeLookup: E.value
		}, C.value, w.value, g, E.value), h = m.connection?.source === m.connection?.target;
		m.isValid && m.connection && !h && x.connect(m.connection), x.clickConnectEnd(i), b(i, !0);
	}
	return {
		handlePointerDown: A,
		handleClick: j
	};
}
function Qh() {
	return zn(Vh, "");
}
function $h(e) {
	let t = e ?? Qh() ?? "", n = zn(Hh, /* @__PURE__ */ z(null)), { findNode: r, edges: i, emits: a } = e_(), o = r(t);
	return o || a.error(new lh(sh.NODE_NOT_FOUND, t)), {
		id: t,
		nodeEl: n,
		node: o,
		parentNode: Y(() => r(o.parentNode)),
		connectedEdges: Y(() => Om([o], i.value))
	};
}
function eg() {
	return {
		doubleClick: Z(),
		click: Z(),
		mouseEnter: Z(),
		mouseMove: Z(),
		mouseLeave: Z(),
		contextMenu: Z(),
		dragStart: Z(),
		drag: Z(),
		dragStop: Z()
	};
}
function tg(e, t) {
	let n = eg();
	return n.doubleClick.on((n) => {
		var r, i;
		t.nodeDoubleClick(n), (i = (r = e.events)?.doubleClick) == null || i.call(r, n);
	}), n.click.on((n) => {
		var r, i;
		t.nodeClick(n), (i = (r = e.events)?.click) == null || i.call(r, n);
	}), n.mouseEnter.on((n) => {
		var r, i;
		t.nodeMouseEnter(n), (i = (r = e.events)?.mouseEnter) == null || i.call(r, n);
	}), n.mouseMove.on((n) => {
		var r, i;
		t.nodeMouseMove(n), (i = (r = e.events)?.mouseMove) == null || i.call(r, n);
	}), n.mouseLeave.on((n) => {
		var r, i;
		t.nodeMouseLeave(n), (i = (r = e.events)?.mouseLeave) == null || i.call(r, n);
	}), n.contextMenu.on((n) => {
		var r, i;
		t.nodeContextMenu(n), (i = (r = e.events)?.contextMenu) == null || i.call(r, n);
	}), n.dragStart.on((n) => {
		var r, i;
		t.nodeDragStart(n), (i = (r = e.events)?.dragStart) == null || i.call(r, n);
	}), n.drag.on((n) => {
		var r, i;
		t.nodeDrag(n), (i = (r = e.events)?.drag) == null || i.call(r, n);
	}), n.dragStop.on((n) => {
		var r, i;
		t.nodeDragStop(n), (i = (r = e.events)?.dragStop) == null || i.call(r, n);
	}), Object.entries(n).reduce((e, [t, n]) => (e.emit[t] = n.trigger, e.on[t] = n.on, e), {
		emit: {},
		on: {}
	});
}
function ng() {
	let { getSelectedNodes: e, nodeExtent: t, updateNodePositions: n, findNode: r, snapGrid: i, snapToGrid: a, nodesDraggable: o, emits: s } = e_();
	return (c, l = !1) => {
		let u = a.value ? i.value[0] : 5, d = a.value ? i.value[1] : 5, f = l ? 4 : 1, p = c.x * u * f, m = c.y * d * f, h = [];
		for (let n of e.value) if (n.draggable || o && n.draggable === void 0) {
			let { position: e } = nh(n, {
				x: n.computedPosition.x + p,
				y: n.computedPosition.y + m
			}, s.error, t.value, n.parentNode ? r(n.parentNode) : void 0);
			h.push({
				id: n.id,
				position: e,
				from: n.position,
				distance: {
					x: c.x,
					y: c.y
				},
				dimensions: n.dimensions
			});
		}
		n(h, !0, !1);
	};
}
var rg = .1, ig = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
function ag() {
	return Oh("Viewport not initialized yet."), Promise.resolve(!1);
}
var og = {
	zoomIn: ag,
	zoomOut: ag,
	zoomTo: ag,
	fitView: ag,
	setCenter: ag,
	fitBounds: ag,
	project: (e) => e,
	screenToFlowCoordinate: (e) => e,
	flowToScreenCoordinate: (e) => e,
	setViewport: ag,
	setTransform: ag,
	getViewport: () => ({
		x: 0,
		y: 0,
		zoom: 1
	}),
	getTransform: () => ({
		x: 0,
		y: 0,
		zoom: 1
	}),
	viewportInitialized: !1
};
function sg(e) {
	function t(t, n) {
		return new Promise((r) => {
			e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(n?.interpolate === "linear" ? _d : jd).scaleBy(cg(e.d3Selection, n?.duration, n?.ease, () => {
				r(!0);
			}), t) : r(!1);
		});
	}
	function n(t, n, r, i) {
		return new Promise((a) => {
			var o;
			let { x: s, y: c } = om({
				x: -t,
				y: -n
			}, e.translateExtent), l = Op.translate(-s, -c).scale(r);
			e.d3Selection && e.d3Zoom ? (o = e.d3Zoom) == null || o.interpolate(i?.interpolate === "linear" ? _d : jd).transform(cg(e.d3Selection, i?.duration, i?.ease, () => {
				a(!0);
			}), l) : a(!1);
		});
	}
	return Y(() => e.d3Zoom && e.d3Selection && e.dimensions.width && e.dimensions.height ? {
		viewportInitialized: !0,
		zoomIn: (e) => t(1.2, e),
		zoomOut: (e) => t(1 / 1.2, e),
		zoomTo: (t, n) => new Promise((r) => {
			e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(n?.interpolate === "linear" ? _d : jd).scaleTo(cg(e.d3Selection, n?.duration, n?.ease, () => {
				r(!0);
			}), t) : r(!1);
		}),
		setViewport: (e, t) => n(e.x, e.y, e.zoom, t),
		setTransform: (e, t) => n(e.x, e.y, e.zoom, t),
		getViewport: () => ({
			x: e.viewport.x,
			y: e.viewport.y,
			zoom: e.viewport.zoom
		}),
		getTransform: () => ({
			x: e.viewport.x,
			y: e.viewport.y,
			zoom: e.viewport.zoom
		}),
		fitView: (t = {
			padding: rg,
			includeHiddenNodes: !1,
			duration: 0
		}) => {
			let r = [];
			for (let n of e.nodes) n.dimensions.width && n.dimensions.height && (t?.includeHiddenNodes || !n.hidden) && (!t.nodes?.length || t.nodes?.length && t.nodes.includes(n.id)) && r.push(n);
			if (!r.length) return Promise.resolve(!1);
			let { x: i, y: a, zoom: o } = Mm(Em(r), e.dimensions.width, e.dimensions.height, t.minZoom ?? e.minZoom, t.maxZoom ?? e.maxZoom, t.padding ?? rg);
			return n(i, a, o, t);
		},
		setCenter: (t, r, i) => {
			let a = i?.zoom === void 0 ? e.maxZoom : i.zoom;
			return n(e.dimensions.width / 2 - t * a, e.dimensions.height / 2 - r * a, a, i);
		},
		fitBounds: (t, r = { padding: rg }) => {
			let { x: i, y: a, zoom: o } = Mm(t, e.dimensions.width, e.dimensions.height, e.minZoom, e.maxZoom, r.padding ?? rg);
			return n(i, a, o, r);
		},
		project: (t) => Sm(t, e.viewport, e.snapToGrid, e.snapGrid),
		screenToFlowCoordinate: (t) => {
			if (e.vueFlowRef) {
				let { x: n, y: r } = e.vueFlowRef.getBoundingClientRect();
				return Sm({
					x: t.x - n,
					y: t.y - r
				}, e.viewport, e.snapToGrid, e.snapGrid);
			}
			return {
				x: 0,
				y: 0
			};
		},
		flowToScreenCoordinate: (t) => {
			if (e.vueFlowRef) {
				let { x: n, y: r } = e.vueFlowRef.getBoundingClientRect();
				return xm({
					x: t.x + n,
					y: t.y + r
				}, e.viewport);
			}
			return {
				x: 0,
				y: 0
			};
		}
	} : og);
}
function cg(e, t = 0, n = ig, r = () => {}) {
	let i = typeof t == "number" && t > 0;
	return i || r(), i ? e.transition().duration(t).ease(n).on("end", r) : e;
}
function lg(e, t, n) {
	let r = xe(!0);
	return r.run(() => {
		r.run(() => {
			let t, r, i = !!(n.nodes.value.length || n.edges.value.length);
			t = Ls([e.modelValue, () => e.modelValue?.value?.length], ([e]) => {
				e && Array.isArray(e) && (r?.pause(), n.setElements(e), !r && !i && e.length ? i = !0 : r?.resume());
			}), r = Ls([
				n.nodes,
				n.edges,
				() => n.edges.value.length,
				() => n.nodes.value.length
			], ([n, r]) => {
				e.modelValue?.value && Array.isArray(e.modelValue.value) && (t?.pause(), e.modelValue.value = [...n, ...r], wn(() => {
					t?.resume();
				}));
			}, { immediate: i }), Ce(() => {
				t?.stop(), r?.stop();
			});
		}), r.run(() => {
			let t, r, i = !!n.nodes.value.length;
			t = Ls([e.nodes, () => e.nodes?.value?.length], ([e]) => {
				e && Array.isArray(e) && (r?.pause(), n.setNodes(e), !r && !i && e.length ? i = !0 : r?.resume());
			}), r = Ls([n.nodes, () => n.nodes.value.length], ([n]) => {
				e.nodes?.value && Array.isArray(e.nodes.value) && (t?.pause(), e.nodes.value = [...n], wn(() => {
					t?.resume();
				}));
			}, { immediate: i }), Ce(() => {
				t?.stop(), r?.stop();
			});
		}), r.run(() => {
			let t, r, i = !!n.edges.value.length;
			t = Ls([e.edges, () => e.edges?.value?.length], ([e]) => {
				e && Array.isArray(e) && (r?.pause(), n.setEdges(e), !r && !i && e.length ? i = !0 : r?.resume());
			}), r = Ls([n.edges, () => n.edges.value.length], ([n]) => {
				e.edges?.value && Array.isArray(e.edges.value) && (t?.pause(), e.edges.value = [...n], wn(() => {
					t?.resume();
				}));
			}, { immediate: i }), Ce(() => {
				t?.stop(), r?.stop();
			});
		}), r.run(() => {
			U(() => t.minZoom, () => {
				t.minZoom && Mh(t.minZoom) && n.setMinZoom(t.minZoom);
			}, { immediate: !0 });
		}), r.run(() => {
			U(() => t.maxZoom, () => {
				t.maxZoom && Mh(t.maxZoom) && n.setMaxZoom(t.maxZoom);
			}, { immediate: !0 });
		}), r.run(() => {
			U(() => t.translateExtent, () => {
				t.translateExtent && Mh(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
			}, { immediate: !0 });
		}), r.run(() => {
			U(() => t.nodeExtent, () => {
				t.nodeExtent && Mh(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
			}, { immediate: !0 });
		}), r.run(() => {
			U(() => t.applyDefault, () => {
				Mh(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
			}, { immediate: !0 });
		}), r.run(() => {
			let e = async (e) => {
				let r = e;
				typeof t.autoConnect == "function" && (r = await t.autoConnect(e)), r !== !1 && n.addEdges([r]);
			};
			U(() => t.autoConnect, () => {
				Mh(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
			}, { immediate: !0 }), U(n.autoConnect, (t, r, i) => {
				t ? n.onConnect(e) : n.hooks.value.connect.off(e), i(() => {
					n.hooks.value.connect.off(e);
				});
			}, { immediate: !0 });
		}), (() => {
			let e = [
				"id",
				"modelValue",
				"translateExtent",
				"nodeExtent",
				"edges",
				"nodes",
				"maxZoom",
				"minZoom",
				"applyDefault",
				"autoConnect"
			];
			for (let i of Object.keys(t)) {
				let a = i;
				if (!e.includes(a)) {
					let e = /* @__PURE__ */ nn(() => t[a]), i = n[a];
					/* @__PURE__ */ Gt(i) && r.run(() => {
						U(e, (e) => {
							Mh(e) && (i.value = e);
						}, { immediate: !0 });
					});
				}
			}
		})();
	}), () => r.stop();
}
function ug() {
	return {
		edgesChange: Z(),
		nodesChange: Z(),
		nodeDoubleClick: Z(),
		nodeClick: Z(),
		nodeMouseEnter: Z(),
		nodeMouseMove: Z(),
		nodeMouseLeave: Z(),
		nodeContextMenu: Z(),
		nodeDragStart: Z(),
		nodeDrag: Z(),
		nodeDragStop: Z(),
		nodesInitialized: Z(),
		miniMapNodeClick: Z(),
		miniMapNodeDoubleClick: Z(),
		miniMapNodeMouseEnter: Z(),
		miniMapNodeMouseMove: Z(),
		miniMapNodeMouseLeave: Z(),
		connect: Z(),
		connectStart: Z(),
		connectEnd: Z(),
		clickConnectStart: Z(),
		clickConnectEnd: Z(),
		paneReady: Z(),
		init: Z(),
		move: Z(),
		moveStart: Z(),
		moveEnd: Z(),
		selectionDragStart: Z(),
		selectionDrag: Z(),
		selectionDragStop: Z(),
		selectionContextMenu: Z(),
		selectionStart: Z(),
		selectionEnd: Z(),
		viewportChangeStart: Z(),
		viewportChange: Z(),
		viewportChangeEnd: Z(),
		paneScroll: Z(),
		paneClick: Z(),
		paneContextMenu: Z(),
		paneMouseEnter: Z(),
		paneMouseMove: Z(),
		paneMouseLeave: Z(),
		edgeContextMenu: Z(),
		edgeMouseEnter: Z(),
		edgeMouseMove: Z(),
		edgeMouseLeave: Z(),
		edgeDoubleClick: Z(),
		edgeClick: Z(),
		edgeUpdateStart: Z(),
		edgeUpdate: Z(),
		edgeUpdateEnd: Z(),
		updateNodeInternals: Z(),
		error: Z((e) => Oh(e.message))
	};
}
function dg(e, t) {
	let n = xa();
	ur(() => {
		for (let [n, i] of Object.entries(t.value)) i.setEmitter((t) => {
			e(n, t);
		}), Ts(i.removeEmitter), i.setHasEmitListeners(() => r(n)), Ts(i.removeHasEmitListeners);
	});
	function r(e) {
		let t = fg(e);
		return !!n?.vnode.props?.[t];
	}
}
function fg(e) {
	let [t, ...n] = e.split(":");
	return `on${t.replace(/(?:^|-)(\w)/g, (e, t) => t.toUpperCase())}${n.length ? `:${n.join(":")}` : ""}`;
}
function pg() {
	return {
		vueFlowRef: null,
		viewportRef: null,
		nodes: [],
		edges: [],
		connectionLookup: /* @__PURE__ */ new Map(),
		nodeTypes: {},
		edgeTypes: {},
		initialized: !1,
		dimensions: {
			width: 0,
			height: 0
		},
		viewport: {
			x: 0,
			y: 0,
			zoom: 1
		},
		d3Zoom: null,
		d3Selection: null,
		d3ZoomHandler: null,
		minZoom: .5,
		maxZoom: 2,
		translateExtent: [[-Infinity, -Infinity], [Infinity, Infinity]],
		nodeExtent: [[-Infinity, -Infinity], [Infinity, Infinity]],
		selectionMode: Rp.Full,
		paneDragging: !1,
		preventScrolling: !0,
		zoomOnScroll: !0,
		zoomOnPinch: !0,
		zoomOnDoubleClick: !0,
		panOnScroll: !1,
		panOnScrollSpeed: .5,
		panOnScrollMode: Hp.Free,
		paneClickDistance: 0,
		panOnDrag: !0,
		edgeUpdaterRadius: 10,
		onlyRenderVisibleElements: !1,
		defaultViewport: {
			x: 0,
			y: 0,
			zoom: 1
		},
		nodesSelectionActive: !1,
		userSelectionActive: !1,
		userSelectionRect: null,
		defaultMarkerColor: "#b1b1b7",
		connectionLineStyle: {},
		connectionLineType: null,
		connectionLineOptions: {
			type: zp.Bezier,
			style: {}
		},
		connectionMode: Bp.Loose,
		connectionStartHandle: null,
		connectionEndHandle: null,
		connectionClickStartHandle: null,
		connectionPosition: {
			x: NaN,
			y: NaN
		},
		connectionRadius: 20,
		connectOnClick: !0,
		connectionStatus: null,
		isValidConnection: null,
		snapGrid: [15, 15],
		snapToGrid: !1,
		edgesUpdatable: !1,
		edgesFocusable: !0,
		nodesFocusable: !0,
		nodesConnectable: !0,
		nodesDraggable: !0,
		nodeDragThreshold: 1,
		elementsSelectable: !0,
		selectNodesOnDrag: !0,
		multiSelectionActive: !1,
		selectionKeyCode: "Shift",
		multiSelectionKeyCode: ph() ? "Meta" : "Control",
		zoomActivationKeyCode: ph() ? "Meta" : "Control",
		deleteKeyCode: "Backspace",
		panActivationKeyCode: "Space",
		hooks: ug(),
		applyDefault: !0,
		autoConnect: !1,
		fitViewOnInit: !1,
		fitViewOnInitDone: !1,
		noDragClassName: "nodrag",
		noWheelClassName: "nowheel",
		noPanClassName: "nopan",
		defaultEdgeOptions: void 0,
		elevateEdgesOnSelect: !1,
		elevateNodesOnSelect: !0,
		autoPanOnNodeDrag: !0,
		autoPanOnConnect: !0,
		autoPanSpeed: 15,
		disableKeyboardA11y: !1,
		ariaLiveMessage: ""
	};
}
var mg = [
	"id",
	"vueFlowRef",
	"viewportRef",
	"initialized",
	"modelValue",
	"nodes",
	"edges",
	"maxZoom",
	"minZoom",
	"translateExtent",
	"hooks",
	"defaultEdgeOptions"
];
function hg(e, t, n) {
	let r = sg(e), i = (t) => {
		let n = t ?? [];
		e.hooks.updateNodeInternals.trigger(n);
	}, a = (t) => _m(t, e.nodes, e.edges), o = (t) => gm(t, e.nodes, e.edges), s = (t) => Om(t, e.edges), c = ({ id: t, type: n, nodeId: r }) => {
		let i = t ? `-${n}-${t}` : `-${n}`;
		return Array.from(e.connectionLookup.get(`${r}${i}`)?.values() ?? []);
	}, l = (e) => {
		if (e) return t.value.get(e);
	}, u = (e) => {
		if (e) return n.value.get(e);
	}, d = (t, n, r) => {
		let i = [];
		for (let e of t) {
			let t = {
				id: e.id,
				type: "position",
				dragging: r,
				from: e.from
			};
			if (n && (t.position = e.position, e.parentNode)) {
				let n = l(e.parentNode);
				t.position = {
					x: t.position.x - (n?.computedPosition?.x ?? 0),
					y: t.position.y - (n?.computedPosition?.y ?? 0)
				};
			}
			i.push(t);
		}
		i?.length && e.hooks.nodesChange.trigger(i);
	}, f = (t) => {
		if (!e.vueFlowRef) return;
		let n = e.vueFlowRef.querySelector(".vue-flow__transformationpane");
		if (!n) return;
		let i = window.getComputedStyle(n), { m22: a } = new window.DOMMatrixReadOnly(i.transform), o = [];
		for (let e of t) {
			let t = e, n = l(t.id);
			if (n) {
				let e = im(t.nodeElement);
				if (e.width && e.height && (n.dimensions.width !== e.width || n.dimensions.height !== e.height || t.forceUpdate)) {
					let r = t.nodeElement.getBoundingClientRect();
					n.dimensions = e, n.handleBounds.source = Ah("source", t.nodeElement, r, a, n.id), n.handleBounds.target = Ah("target", t.nodeElement, r, a, n.id), o.push({
						id: n.id,
						type: "dimensions",
						dimensions: e
					});
				}
			}
		}
		!e.fitViewOnInitDone && e.fitViewOnInit && r.value.fitView().then(() => {
			e.fitViewOnInitDone = !0;
		}), o.length && e.hooks.nodesChange.trigger(o);
	}, p = (r, i) => {
		let a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
		for (let e of r) lm(e) ? a.add(e.id) : cm(e) && o.add(e.id);
		let s = qm(t.value, a, !0), c = qm(n.value, o);
		if (e.multiSelectionActive) {
			for (let e of a) s.push(Um(e, i));
			for (let e of o) c.push(Um(e, i));
		}
		s.length && e.hooks.nodesChange.trigger(s), c.length && e.hooks.edgesChange.trigger(c);
	}, m = (r) => {
		if (e.multiSelectionActive) {
			let t = r.map((e) => Um(e.id, !0));
			e.hooks.nodesChange.trigger(t);
			return;
		}
		e.hooks.nodesChange.trigger(qm(t.value, new Set(r.map((e) => e.id)), !0)), e.hooks.edgesChange.trigger(qm(n.value));
	}, h = (r) => {
		if (e.multiSelectionActive) {
			let t = r.map((e) => Um(e.id, !0));
			e.hooks.edgesChange.trigger(t);
			return;
		}
		e.hooks.edgesChange.trigger(qm(n.value, new Set(r.map((e) => e.id)))), e.hooks.nodesChange.trigger(qm(t.value, /* @__PURE__ */ new Set(), !0));
	}, g = (e) => {
		p(e, !0);
	}, _ = (t) => {
		let n = (t || e.nodes).map((e) => (e.selected = !1, Um(e.id, !1)));
		e.hooks.nodesChange.trigger(n);
	}, v = (t) => {
		let n = (t || e.edges).map((e) => (e.selected = !1, Um(e.id, !1)));
		e.hooks.edgesChange.trigger(n);
	}, y = (t) => {
		if (!t || !t.length) return p([], !1);
		let n = t.reduce((e, t) => {
			let n = Um(t.id, !1);
			return lm(t) ? e.nodes.push(n) : e.edges.push(n), e;
		}, {
			nodes: [],
			edges: []
		});
		n.nodes.length && e.hooks.nodesChange.trigger(n.nodes), n.edges.length && e.hooks.edgesChange.trigger(n.edges);
	}, b = (t) => {
		var n;
		(n = e.d3Zoom) == null || n.scaleExtent([t, e.maxZoom]), e.minZoom = t;
	}, x = (t) => {
		var n;
		(n = e.d3Zoom) == null || n.scaleExtent([e.minZoom, t]), e.maxZoom = t;
	}, S = (t) => {
		var n;
		(n = e.d3Zoom) == null || n.translateExtent(t), e.translateExtent = t;
	}, C = (t) => {
		e.nodeExtent = t, i();
	}, w = (t) => {
		var n;
		(n = e.d3Zoom) == null || n.clickDistance(t);
	}, T = (t) => {
		e.nodesDraggable = t, e.nodesConnectable = t, e.elementsSelectable = t;
	}, E = (t) => {
		let n = t instanceof Function ? t(e.nodes) : t;
		!e.initialized && !n.length || (e.nodes = Fh(n, l, e.hooks.error.trigger));
	}, D = (t) => {
		let r = t instanceof Function ? t(e.edges) : t;
		if (!e.initialized && !r.length) return;
		let i = zh(r, e.isValidConnection, l, u, e.hooks.error.trigger, e.defaultEdgeOptions, e.nodes, e.edges);
		Lh(e.connectionLookup, n.value, i), e.edges = i;
	}, O = (t) => {
		let n = t instanceof Function ? t([...e.nodes, ...e.edges]) : t;
		!e.initialized && !n.length || (E(n.filter(lm)), D(n.filter(cm)));
	}, k = (t) => {
		let n = t instanceof Function ? t(e.nodes) : t;
		n = Array.isArray(n) ? n : [n];
		let r = Fh(n, l, e.hooks.error.trigger), i = [];
		for (let e of r) i.push(Wm(e));
		i.length && e.hooks.nodesChange.trigger(i);
	}, A = (t) => {
		let n = t instanceof Function ? t(e.edges) : t;
		n = Array.isArray(n) ? n : [n];
		let r = zh(n, e.isValidConnection, l, u, e.hooks.error.trigger, e.defaultEdgeOptions, e.nodes, e.edges), i = [];
		for (let e of r) i.push(Wm(e));
		i.length && e.hooks.edgesChange.trigger(i);
	}, j = (t, n = !0, r = !1) => {
		let i = t instanceof Function ? t(e.nodes) : t, a = Array.isArray(i) ? i : [i], o = [], c = [];
		function u(e) {
			let t = s(e);
			for (let e of t) (!Mh(e.deletable) || e.deletable) && c.push(Km(e.id, e.source, e.target, e.sourceHandle, e.targetHandle));
		}
		function d(t) {
			let r = [];
			for (let n of e.nodes) n.parentNode === t && r.push(n);
			if (r.length) {
				for (let e of r) o.push(Gm(e.id));
				n && u(r);
				for (let e of r) d(e.id);
			}
		}
		for (let e of a) {
			let t = typeof e == "string" ? l(e) : e;
			t && (Mh(t.deletable) && !t.deletable || (o.push(Gm(t.id)), n && u([t]), r && d(t.id)));
		}
		c.length && e.hooks.edgesChange.trigger(c), o.length && e.hooks.nodesChange.trigger(o);
	}, M = (t) => {
		let n = t instanceof Function ? t(e.edges) : t, r = Array.isArray(n) ? n : [n], i = [];
		for (let e of r) {
			let t = typeof e == "string" ? u(e) : e;
			t && (Mh(t.deletable) && !t.deletable || i.push(Km(typeof e == "string" ? e : e.id, t.source, t.target, t.sourceHandle, t.targetHandle)));
		}
		e.hooks.edgesChange.trigger(i);
	}, ee = (t, r, i = !0) => {
		let a = u(t.id);
		if (!a) return !1;
		let o = e.edges.indexOf(a), s = Ph(t, r, a, i, e.hooks.error.trigger);
		if (s) {
			let [t] = zh([s], e.isValidConnection, l, u, e.hooks.error.trigger, e.defaultEdgeOptions, e.nodes, e.edges);
			return e.edges = e.edges.map((e, n) => n === o ? t : e), Lh(e.connectionLookup, n.value, [t]), t;
		}
		return !1;
	}, N = (e, t, n = { replace: !1 }) => {
		let r = u(e);
		if (!r) return;
		let i = typeof t == "function" ? t(r) : t;
		r.data = n.replace ? i : {
			...r.data,
			...i
		};
	}, P = (t) => Bm(t, e.nodes), te = (t) => {
		let r = Bm(t, e.edges);
		return Lh(e.connectionLookup, n.value, r), r;
	}, ne = (t, n, r = { replace: !1 }) => {
		let i = l(t);
		if (!i) return;
		let a = typeof n == "function" ? n(i) : n;
		r.replace ? e.nodes.splice(e.nodes.indexOf(i), 1, a) : Object.assign(i, a);
	}, F = (e, t, n = { replace: !1 }) => {
		let r = l(e);
		if (!r) return;
		let i = typeof t == "function" ? t(r) : t;
		r.data = n.replace ? i : {
			...r.data,
			...i
		};
	}, re = (t, n, r = !1) => {
		r ? e.connectionClickStartHandle = t : e.connectionStartHandle = t, e.connectionEndHandle = null, e.connectionStatus = null, n && (e.connectionPosition = n);
	}, ie = (t, n = null, r = null) => {
		e.connectionStartHandle && (e.connectionPosition = t, e.connectionEndHandle = n, e.connectionStatus = r);
	}, I = (t, n) => {
		e.connectionPosition = {
			x: NaN,
			y: NaN
		}, e.connectionEndHandle = null, e.connectionStatus = null, n ? e.connectionClickStartHandle = null : e.connectionStartHandle = null;
	}, ae = (e) => {
		let t = fm(e), n = t ? null : um(e) ? e : l(e.id);
		return !t && !n ? [
			null,
			null,
			t
		] : [
			t ? e : nm(n),
			n,
			t
		];
	}, oe = (t, n = !0, r = e.nodes) => {
		let [i, a, o] = ae(t);
		if (!i) return [];
		let s = [];
		for (let t of r || e.nodes) {
			if (!o && (t.id === a.id || !t.computedPosition)) continue;
			let e = nm(t), r = rm(e, i);
			(n && r > 0 || r >= e.width * e.height || r >= Number(i.width) * Number(i.height)) && s.push(t);
		}
		return s;
	}, se = (e, t, n = !0) => {
		let [r] = ae(e);
		if (!r) return !1;
		let i = rm(r, t);
		return n && i > 0 || i >= Number(r.width) * Number(r.height);
	}, ce = (t) => {
		let { viewport: n, dimensions: r, d3Zoom: i, d3Selection: a, translateExtent: o } = e;
		if (!i || !a || !t.x && !t.y) return !1;
		let s = Op.translate(n.x + t.x, n.y + t.y).scale(n.zoom), c = [[0, 0], [r.width, r.height]], l = i.constrain()(s, c, o), u = e.viewport.x !== l.x || e.viewport.y !== l.y || e.viewport.zoom !== l.k;
		return i.transform(a, l), u;
	}, le = (t) => {
		let n = t instanceof Function ? t(e) : t, r = [
			"d3Zoom",
			"d3Selection",
			"d3ZoomHandler",
			"viewportRef",
			"vueFlowRef",
			"dimensions",
			"hooks"
		];
		Mh(n.defaultEdgeOptions) && (e.defaultEdgeOptions = n.defaultEdgeOptions);
		let i = n.modelValue || n.nodes || n.edges ? [] : void 0;
		i && (n.modelValue && i.push(...n.modelValue), n.nodes && i.push(...n.nodes), n.edges && i.push(...n.edges), O(i));
		let a = () => {
			Mh(n.maxZoom) && x(n.maxZoom), Mh(n.minZoom) && b(n.minZoom), Mh(n.translateExtent) && S(n.translateExtent);
		};
		for (let t of Object.keys(n)) {
			let i = t, a = n[i];
			![...mg, ...r].includes(i) && Mh(a) && (e[i] = a);
		}
		Bs(() => e.d3Zoom).not.toBeNull().then(a), e.initialized ||= !0;
	};
	return {
		updateNodePositions: d,
		updateNodeDimensions: f,
		setElements: O,
		setNodes: E,
		setEdges: D,
		addNodes: k,
		addEdges: A,
		removeNodes: j,
		removeEdges: M,
		findNode: l,
		findEdge: u,
		updateEdge: ee,
		updateEdgeData: N,
		updateNode: ne,
		updateNodeData: F,
		applyEdgeChanges: te,
		applyNodeChanges: P,
		addSelectedElements: g,
		addSelectedNodes: m,
		addSelectedEdges: h,
		setMinZoom: b,
		setMaxZoom: x,
		setTranslateExtent: S,
		setNodeExtent: C,
		setPaneClickDistance: w,
		removeSelectedElements: y,
		removeSelectedNodes: _,
		removeSelectedEdges: v,
		startConnection: re,
		updateConnection: ie,
		endConnection: I,
		setInteractive: T,
		setState: le,
		getIntersectingNodes: oe,
		getIncomers: a,
		getOutgoers: o,
		getConnectedEdges: s,
		getHandleConnections: c,
		isNodeIntersecting: se,
		panBy: ce,
		fitView: (e) => r.value.fitView(e),
		zoomIn: (e) => r.value.zoomIn(e),
		zoomOut: (e) => r.value.zoomOut(e),
		zoomTo: (e, t) => r.value.zoomTo(e, t),
		setViewport: (e, t) => r.value.setViewport(e, t),
		setTransform: (e, t) => r.value.setTransform(e, t),
		getViewport: () => r.value.getViewport(),
		getTransform: () => r.value.getTransform(),
		setCenter: (e, t, n) => r.value.setCenter(e, t, n),
		fitBounds: (e, t) => r.value.fitBounds(e, t),
		project: (e) => r.value.project(e),
		screenToFlowCoordinate: (e) => r.value.screenToFlowCoordinate(e),
		flowToScreenCoordinate: (e) => r.value.flowToScreenCoordinate(e),
		toObject: () => {
			let t = [], n = [];
			for (let n of e.nodes) {
				let { computedPosition: e, handleBounds: r, selected: i, dimensions: a, isParent: o, resizing: s, dragging: c, events: l, ...u } = n;
				t.push(u);
			}
			for (let t of e.edges) {
				let { selected: e, sourceNode: r, targetNode: i, events: a, ...o } = t;
				n.push(o);
			}
			return JSON.parse(JSON.stringify({
				nodes: t,
				edges: n,
				position: [e.viewport.x, e.viewport.y],
				zoom: e.viewport.zoom,
				viewport: e.viewport
			}));
		},
		fromObject: (t) => new Promise((n) => {
			let { nodes: i, edges: a, position: o, zoom: s, viewport: c } = t;
			i && E(i), a && D(a);
			let [l, u] = c?.x && c?.y ? [c.x, c.y] : o ?? [null, null];
			if (l && u) {
				let t = c?.zoom || s || e.viewport.zoom;
				return Bs(() => r.value.viewportInitialized).toBe(!0).then(() => {
					r.value.setViewport({
						x: l,
						y: u,
						zoom: t
					}).then(() => {
						n(!0);
					});
				});
			} else n(!0);
		}),
		updateNodeInternals: i,
		viewportHelper: r,
		$reset: () => {
			let t = pg();
			if (e.edges = [], e.nodes = [], e.d3Zoom && e.d3Selection) {
				let n = Op.translate(t.defaultViewport.x ?? 0, t.defaultViewport.y ?? 0).scale(am(t.defaultViewport.zoom ?? 1, t.minZoom, t.maxZoom)), r = e.viewportRef.getBoundingClientRect(), i = [[0, 0], [r.width, r.height]], a = e.d3Zoom.constrain()(n, i, t.translateExtent);
				e.d3Zoom.transform(e.d3Selection, a);
			}
			le(t);
		},
		$destroy: () => {}
	};
}
var gg = [
	"data-id",
	"data-handleid",
	"data-nodeid",
	"data-handlepos"
], _g = /* @__PURE__ */ Xn({
	name: "Handle",
	compatConfig: { MODE: 3 },
	props: {
		id: { default: null },
		type: {},
		position: { default: () => X.Top },
		isValidConnection: { type: Function },
		connectable: {
			type: [
				Boolean,
				Number,
				String,
				Function
			],
			default: void 0
		},
		connectableStart: {
			type: Boolean,
			default: !0
		},
		connectableEnd: {
			type: Boolean,
			default: !0
		}
	},
	setup(e, { expose: t }) {
		let n = Lr(e, [
			"position",
			"connectable",
			"connectableStart",
			"connectableEnd",
			"id"
		]), r = /* @__PURE__ */ nn(() => n.type ?? "source"), i = /* @__PURE__ */ nn(() => n.isValidConnection ?? null), { id: a, connectionStartHandle: o, connectionClickStartHandle: s, connectionEndHandle: c, vueFlowRef: l, nodesConnectable: u, noDragClassName: d, noPanClassName: f } = e_(), { id: p, node: m, nodeEl: h, connectedEdges: g } = $h(), _ = /* @__PURE__ */ z(), v = /* @__PURE__ */ nn(() => e.connectableStart === void 0 || e.connectableStart), y = /* @__PURE__ */ nn(() => e.connectableEnd === void 0 || e.connectableEnd), b = /* @__PURE__ */ nn(() => o.value?.nodeId === p && o.value?.id === e.id && o.value?.type === r.value || c.value?.nodeId === p && c.value?.id === e.id && c.value?.type === r.value), x = /* @__PURE__ */ nn(() => s.value?.nodeId === p && s.value?.id === e.id && s.value?.type === r.value), { handlePointerDown: S, handleClick: C } = Zh({
			nodeId: p,
			handleId: e.id,
			isValidConnection: i,
			type: r
		}), w = Y(() => typeof e.connectable == "string" && e.connectable === "single" ? !g.value.some((t) => {
			let n = t[`${r.value}Handle`];
			return t[r.value] === p ? !n || n === e.id : !1;
		}) : typeof e.connectable == "number" ? g.value.filter((t) => {
			let n = t[`${r.value}Handle`];
			return t[r.value] === p ? !n || n === e.id : !1;
		}).length < e.connectable : typeof e.connectable == "function" ? e.connectable(m, g.value) : Mh(e.connectable) ? e.connectable : u.value);
		dr(() => {
			if (!m.dimensions.width || !m.dimensions.height) return;
			let t = m.handleBounds[r.value]?.find((t) => t.id === e.id);
			if (!l.value || t) return;
			let n = l.value.querySelector(".vue-flow__transformationpane");
			if (!h.value || !_.value || !n || !e.id) return;
			let i = h.value.getBoundingClientRect(), a = _.value.getBoundingClientRect(), o = window.getComputedStyle(n), { m22: s } = new window.DOMMatrixReadOnly(o.transform), c = {
				id: e.id,
				position: e.position,
				x: (a.left - i.left) / s,
				y: (a.top - i.top) / s,
				type: r.value,
				nodeId: p,
				...im(_.value)
			};
			m.handleBounds[r.value] = [...m.handleBounds[r.value] ?? [], c];
		});
		function T(e) {
			let t = uh(e);
			w.value && v.value && (t && e.button === 0 || !t) && S(e);
		}
		function E(e) {
			!p || !s.value && !v.value || w.value && C(e);
		}
		return t({
			handleClick: C,
			handlePointerDown: S,
			onClick: E,
			onPointerDown: T
		}), (t, n) => (G(), K("div", {
			ref_key: "handle",
			ref: _,
			"data-id": `${B(a)}-${B(p)}-${e.id}-${r.value}`,
			"data-handleid": e.id,
			"data-nodeid": B(p),
			"data-handlepos": t.position,
			class: le(["vue-flow__handle", [
				`vue-flow__handle-${t.position}`,
				`vue-flow__handle-${e.id}`,
				B(d),
				B(f),
				r.value,
				{
					connectable: w.value,
					connecting: x.value,
					connectablestart: v.value,
					connectableend: y.value,
					connectionindicator: w.value && (v.value && !b.value || y.value && b.value)
				}
			]]),
			onMousedown: T,
			onTouchstartPassive: T,
			onClick: E
		}, [Dr(t.$slots, "default", { id: t.id })], 42, gg));
	}
}), vg = function({ sourcePosition: e = X.Bottom, targetPosition: t = X.Top, label: n, connectable: r = !0, isValidTargetPos: i, isValidSourcePos: a, data: o }) {
	let s = o.label ?? n;
	return [
		za(_g, {
			type: "target",
			position: t,
			connectable: r,
			isValidConnection: i
		}),
		typeof s != "string" && s ? za(s) : za(W, [s]),
		za(_g, {
			type: "source",
			position: e,
			connectable: r,
			isValidConnection: a
		})
	];
};
vg.props = [
	"sourcePosition",
	"targetPosition",
	"label",
	"isValidTargetPos",
	"isValidSourcePos",
	"connectable",
	"data"
], vg.inheritAttrs = !1, vg.compatConfig = { MODE: 3 };
var yg = vg, bg = function({ targetPosition: e = X.Top, label: t, connectable: n = !0, isValidTargetPos: r, data: i }) {
	let a = i.label ?? t;
	return [za(_g, {
		type: "target",
		position: e,
		connectable: n,
		isValidConnection: r
	}), typeof a != "string" && a ? za(a) : za(W, [a])];
};
bg.props = [
	"targetPosition",
	"label",
	"isValidTargetPos",
	"connectable",
	"data"
], bg.inheritAttrs = !1, bg.compatConfig = { MODE: 3 };
var xg = bg, Sg = function({ sourcePosition: e = X.Bottom, label: t, connectable: n = !0, isValidSourcePos: r, data: i }) {
	let a = i.label ?? t;
	return [typeof a != "string" && a ? za(a) : za(W, [a]), za(_g, {
		type: "source",
		position: e,
		connectable: n,
		isValidConnection: r
	})];
};
Sg.props = [
	"sourcePosition",
	"label",
	"isValidSourcePos",
	"connectable",
	"data"
], Sg.inheritAttrs = !1, Sg.compatConfig = { MODE: 3 };
var Cg = Sg, wg = ["transform"], Tg = [
	"width",
	"height",
	"x",
	"y",
	"rx",
	"ry"
], Eg = ["y"], Dg = /* @__PURE__ */ Xn({
	name: "EdgeText",
	compatConfig: { MODE: 3 },
	props: {
		x: {},
		y: {},
		label: {},
		labelStyle: { default: () => ({}) },
		labelShowBg: {
			type: Boolean,
			default: !0
		},
		labelBgStyle: { default: () => ({}) },
		labelBgPadding: { default: () => [2, 4] },
		labelBgBorderRadius: { default: 2 }
	},
	setup(e) {
		let t = /* @__PURE__ */ z({
			x: 0,
			y: 0,
			width: 0,
			height: 0
		}), n = /* @__PURE__ */ z(null), r = Y(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
		dr(i), U([
			() => e.x,
			() => e.y,
			n,
			() => e.label
		], i);
		function i() {
			if (!n.value) return;
			let e = n.value.getBBox();
			(e.width !== t.value.width || e.height !== t.value.height) && (t.value = e);
		}
		return (e, i) => (G(), K("g", {
			transform: r.value,
			class: "vue-flow__edge-textwrapper"
		}, [e.labelShowBg ? (G(), K("rect", {
			key: 0,
			class: "vue-flow__edge-textbg",
			width: `${t.value.width + 2 * e.labelBgPadding[0]}px`,
			height: `${t.value.height + 2 * e.labelBgPadding[1]}px`,
			x: -e.labelBgPadding[0],
			y: -e.labelBgPadding[1],
			style: I(e.labelBgStyle),
			rx: e.labelBgBorderRadius,
			ry: e.labelBgBorderRadius
		}, null, 12, Tg)) : da("", !0), q("text", ha(e.$attrs, {
			ref_key: "el",
			ref: n,
			class: "vue-flow__edge-text",
			y: t.value.height / 2,
			dy: "0.3em",
			style: e.labelStyle
		}), [Dr(e.$slots, "default", {}, () => [typeof e.label == "string" ? (G(), K(W, { key: 1 }, [la(L(e.label), 1)], 64)) : (G(), ta(Cr(e.label), { key: 0 }))])], 16, Eg)], 8, wg));
	}
}), Og = [
	"id",
	"d",
	"marker-end",
	"marker-start"
], kg = ["d", "stroke-width"], Ag = /* @__PURE__ */ Xn({
	name: "BaseEdge",
	inheritAttrs: !1,
	compatConfig: { MODE: 3 },
	props: {
		id: {},
		labelX: {},
		labelY: {},
		path: {},
		label: {},
		markerStart: {},
		markerEnd: {},
		interactionWidth: { default: 20 },
		labelStyle: {},
		labelShowBg: { type: Boolean },
		labelBgStyle: {},
		labelBgPadding: {},
		labelBgBorderRadius: {}
	},
	setup(e, { expose: t }) {
		let n = /* @__PURE__ */ z(null), r = /* @__PURE__ */ z(null), i = /* @__PURE__ */ z(null), a = Pr();
		return t({
			pathEl: n,
			interactionEl: r,
			labelEl: i
		}), (e, t) => (G(), K(W, null, [
			q("path", ha(B(a), {
				id: e.id,
				ref_key: "pathEl",
				ref: n,
				d: e.path,
				class: "vue-flow__edge-path",
				"marker-end": e.markerEnd,
				"marker-start": e.markerStart
			}), null, 16, Og),
			e.interactionWidth ? (G(), K("path", {
				key: 0,
				ref_key: "interactionEl",
				ref: r,
				fill: "none",
				d: e.path,
				"stroke-width": e.interactionWidth,
				"stroke-opacity": 0,
				class: "vue-flow__edge-interaction"
			}, null, 8, kg)) : da("", !0),
			e.label && e.labelX && e.labelY ? (G(), ta(Dg, {
				key: 1,
				ref_key: "labelEl",
				ref: i,
				x: e.labelX,
				y: e.labelY,
				label: e.label,
				"label-show-bg": e.labelShowBg,
				"label-bg-style": e.labelBgStyle,
				"label-bg-padding": e.labelBgPadding,
				"label-bg-border-radius": e.labelBgBorderRadius,
				"label-style": e.labelStyle
			}, null, 8, [
				"x",
				"y",
				"label",
				"label-show-bg",
				"label-bg-style",
				"label-bg-padding",
				"label-bg-border-radius",
				"label-style"
			])) : da("", !0)
		], 64));
	}
});
function jg({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
	let i = Math.abs(n - e) / 2, a = n < e ? n + i : n - i, o = Math.abs(r - t) / 2;
	return [
		a,
		r < t ? r + o : r - o,
		i,
		o
	];
}
function Mg({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: i, sourceControlY: a, targetControlX: o, targetControlY: s }) {
	let c = e * .125 + i * .375 + o * .375 + n * .125, l = t * .125 + a * .375 + s * .375 + r * .125;
	return [
		c,
		l,
		Math.abs(c - e),
		Math.abs(l - t)
	];
}
function Ng(e, t) {
	return e >= 0 ? .5 * e : t * 25 * Math.sqrt(-e);
}
function Pg({ pos: e, x1: t, y1: n, x2: r, y2: i, c: a }) {
	let o, s;
	switch (e) {
		case X.Left:
			o = t - Ng(t - r, a), s = n;
			break;
		case X.Right:
			o = t + Ng(r - t, a), s = n;
			break;
		case X.Top:
			o = t, s = n - Ng(n - i, a);
			break;
		case X.Bottom:
			o = t, s = n + Ng(i - n, a);
			break;
	}
	return [o, s];
}
function Fg(e) {
	let { sourceX: t, sourceY: n, sourcePosition: r = X.Bottom, targetX: i, targetY: a, targetPosition: o = X.Top, curvature: s = .25 } = e, [c, l] = Pg({
		pos: r,
		x1: t,
		y1: n,
		x2: i,
		y2: a,
		c: s
	}), [u, d] = Pg({
		pos: o,
		x1: i,
		y1: a,
		x2: t,
		y2: n,
		c: s
	}), [f, p, m, h] = Mg({
		sourceX: t,
		sourceY: n,
		targetX: i,
		targetY: a,
		sourceControlX: c,
		sourceControlY: l,
		targetControlX: u,
		targetControlY: d
	});
	return [
		`M${t},${n} C${c},${l} ${u},${d} ${i},${a}`,
		f,
		p,
		m,
		h
	];
}
function Ig({ pos: e, x1: t, y1: n, x2: r, y2: i }) {
	let a, o;
	switch (e) {
		case X.Left:
		case X.Right:
			a = .5 * (t + r), o = n;
			break;
		case X.Top:
		case X.Bottom:
			a = t, o = .5 * (n + i);
			break;
	}
	return [a, o];
}
function Lg(e) {
	let { sourceX: t, sourceY: n, sourcePosition: r = X.Bottom, targetX: i, targetY: a, targetPosition: o = X.Top } = e, [s, c] = Ig({
		pos: r,
		x1: t,
		y1: n,
		x2: i,
		y2: a
	}), [l, u] = Ig({
		pos: o,
		x1: i,
		y1: a,
		x2: t,
		y2: n
	}), [d, f, p, m] = Mg({
		sourceX: t,
		sourceY: n,
		targetX: i,
		targetY: a,
		sourceControlX: s,
		sourceControlY: c,
		targetControlX: l,
		targetControlY: u
	});
	return [
		`M${t},${n} C${s},${c} ${l},${u} ${i},${a}`,
		d,
		f,
		p,
		m
	];
}
var Rg = {
	[X.Left]: {
		x: -1,
		y: 0
	},
	[X.Right]: {
		x: 1,
		y: 0
	},
	[X.Top]: {
		x: 0,
		y: -1
	},
	[X.Bottom]: {
		x: 0,
		y: 1
	}
};
function zg({ source: e, sourcePosition: t = X.Bottom, target: n }) {
	return t === X.Left || t === X.Right ? e.x < n.x ? {
		x: 1,
		y: 0
	} : {
		x: -1,
		y: 0
	} : e.y < n.y ? {
		x: 0,
		y: 1
	} : {
		x: 0,
		y: -1
	};
}
function Bg(e, t) {
	return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function Vg({ source: e, sourcePosition: t = X.Bottom, target: n, targetPosition: r = X.Top, center: i, offset: a }) {
	let o = Rg[t], s = Rg[r], c = {
		x: e.x + o.x * a,
		y: e.y + o.y * a
	}, l = {
		x: n.x + s.x * a,
		y: n.y + s.y * a
	}, u = zg({
		source: c,
		sourcePosition: t,
		target: l
	}), d = u.x === 0 ? "y" : "x", f = u[d], p, m, h, g = {
		x: 0,
		y: 0
	}, _ = {
		x: 0,
		y: 0
	}, [v, y, b, x] = jg({
		sourceX: e.x,
		sourceY: e.y,
		targetX: n.x,
		targetY: n.y
	});
	if (o[d] * s[d] === -1) {
		m = i.x ?? v, h = i.y ?? y;
		let e = [{
			x: m,
			y: c.y
		}, {
			x: m,
			y: l.y
		}], t = [{
			x: c.x,
			y: h
		}, {
			x: l.x,
			y: h
		}];
		p = o[d] === f ? d === "x" ? e : t : d === "x" ? t : e;
	} else {
		let i = [{
			x: c.x,
			y: l.y
		}], u = [{
			x: l.x,
			y: c.y
		}];
		if (p = d === "x" ? o.x === f ? u : i : o.y === f ? i : u, t === r) {
			let t = Math.abs(e[d] - n[d]);
			if (t <= a) {
				let r = Math.min(a - 1, a - t);
				o[d] === f ? g[d] = (c[d] > e[d] ? -1 : 1) * r : _[d] = (l[d] > n[d] ? -1 : 1) * r;
			}
		}
		if (t !== r) {
			let e = d === "x" ? "y" : "x", t = o[d] === s[e], n = c[e] > l[e], r = c[e] < l[e];
			(o[d] === 1 && (!t && n || t && r) || o[d] !== 1 && (!t && r || t && n)) && (p = d === "x" ? i : u);
		}
		let v = {
			x: c.x + g.x,
			y: c.y + g.y
		}, y = {
			x: l.x + _.x,
			y: l.y + _.y
		};
		Math.max(Math.abs(v.x - p[0].x), Math.abs(y.x - p[0].x)) >= Math.max(Math.abs(v.y - p[0].y), Math.abs(y.y - p[0].y)) ? (m = (v.x + y.x) / 2, h = p[0].y) : (m = p[0].x, h = (v.y + y.y) / 2);
	}
	return [
		[
			e,
			{
				x: c.x + g.x,
				y: c.y + g.y
			},
			...p,
			{
				x: l.x + _.x,
				y: l.y + _.y
			},
			n
		],
		m,
		h,
		b,
		x
	];
}
function Hg(e, t, n, r) {
	let i = Math.min(Bg(e, t) / 2, Bg(t, n) / 2, r), { x: a, y: o } = t;
	if (e.x === a && a === n.x || e.y === o && o === n.y) return `L${a} ${o}`;
	if (e.y === o) {
		let t = e.x < n.x ? -1 : 1, r = e.y < n.y ? 1 : -1;
		return `L ${a + i * t},${o}Q ${a},${o} ${a},${o + i * r}`;
	}
	let s = e.x < n.x ? 1 : -1;
	return `L ${a},${o + i * (e.y < n.y ? -1 : 1)}Q ${a},${o} ${a + i * s},${o}`;
}
function Ug(e) {
	let { sourceX: t, sourceY: n, sourcePosition: r = X.Bottom, targetX: i, targetY: a, targetPosition: o = X.Top, borderRadius: s = 5, centerX: c, centerY: l, offset: u = 20 } = e, [d, f, p, m, h] = Vg({
		source: {
			x: t,
			y: n
		},
		sourcePosition: r,
		target: {
			x: i,
			y: a
		},
		targetPosition: o,
		center: {
			x: c,
			y: l
		},
		offset: u
	});
	return [
		d.reduce((e, t, n) => {
			let r;
			return r = n > 0 && n < d.length - 1 ? Hg(d[n - 1], t, d[n + 1], s) : `${n === 0 ? "M" : "L"}${t.x} ${t.y}`, e += r, e;
		}, ""),
		f,
		p,
		m,
		h
	];
}
function Wg(e) {
	let { sourceX: t, sourceY: n, targetX: r, targetY: i } = e, [a, o, s, c] = jg({
		sourceX: t,
		sourceY: n,
		targetX: r,
		targetY: i
	});
	return [
		`M ${t},${n}L ${r},${i}`,
		a,
		o,
		s,
		c
	];
}
var Gg = /* @__PURE__ */ Xn({
	name: "StraightEdge",
	props: [
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"markerEnd",
		"markerStart",
		"interactionWidth"
	],
	compatConfig: { MODE: 3 },
	setup(e, { attrs: t }) {
		return () => {
			let [n, r, i] = Wg(e);
			return za(Ag, {
				path: n,
				labelX: r,
				labelY: i,
				...t,
				...e
			});
		};
	}
}), Kg = /* @__PURE__ */ Xn({
	name: "SmoothStepEdge",
	props: [
		"sourcePosition",
		"targetPosition",
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"borderRadius",
		"markerEnd",
		"markerStart",
		"interactionWidth",
		"offset"
	],
	compatConfig: { MODE: 3 },
	setup(e, { attrs: t }) {
		return () => {
			let [n, r, i] = Ug({
				...e,
				sourcePosition: e.sourcePosition ?? X.Bottom,
				targetPosition: e.targetPosition ?? X.Top
			});
			return za(Ag, {
				path: n,
				labelX: r,
				labelY: i,
				...t,
				...e
			});
		};
	}
}), qg = /* @__PURE__ */ Xn({
	name: "StepEdge",
	props: [
		"sourcePosition",
		"targetPosition",
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"markerEnd",
		"markerStart",
		"interactionWidth"
	],
	setup(e, { attrs: t }) {
		return () => za(Kg, {
			...e,
			...t,
			borderRadius: 0
		});
	}
}), Jg = /* @__PURE__ */ Xn({
	name: "BezierEdge",
	props: [
		"sourcePosition",
		"targetPosition",
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"curvature",
		"markerEnd",
		"markerStart",
		"interactionWidth"
	],
	compatConfig: { MODE: 3 },
	setup(e, { attrs: t }) {
		return () => {
			let [n, r, i] = Fg({
				...e,
				sourcePosition: e.sourcePosition ?? X.Bottom,
				targetPosition: e.targetPosition ?? X.Top
			});
			return za(Ag, {
				path: n,
				labelX: r,
				labelY: i,
				...t,
				...e
			});
		};
	}
}), Yg = /* @__PURE__ */ Xn({
	name: "SimpleBezierEdge",
	props: [
		"sourcePosition",
		"targetPosition",
		"label",
		"labelStyle",
		"labelShowBg",
		"labelBgStyle",
		"labelBgPadding",
		"labelBgBorderRadius",
		"sourceY",
		"sourceX",
		"targetX",
		"targetY",
		"markerEnd",
		"markerStart",
		"interactionWidth"
	],
	compatConfig: { MODE: 3 },
	setup(e, { attrs: t }) {
		return () => {
			let [n, r, i] = Lg({
				...e,
				sourcePosition: e.sourcePosition ?? X.Bottom,
				targetPosition: e.targetPosition ?? X.Top
			});
			return za(Ag, {
				path: n,
				labelX: r,
				labelY: i,
				...t,
				...e
			});
		};
	}
}), Xg = {
	input: Cg,
	default: yg,
	output: xg
}, Zg = {
	default: Jg,
	straight: Gg,
	step: qg,
	smoothstep: Kg,
	simplebezier: Yg
};
function Qg(e, t, n) {
	let r = Y(() => (e) => t.value.get(e)), i = Y(() => (e) => n.value.get(e)), a = Y(() => {
		let t = {
			...Zg,
			...e.edgeTypes
		}, n = Object.keys(t);
		for (let r of e.edges) r.type && !n.includes(r.type) && (t[r.type] = r.type);
		return t;
	}), o = Y(() => {
		let t = {
			...Xg,
			...e.nodeTypes
		}, n = Object.keys(t);
		for (let r of e.nodes) r.type && !n.includes(r.type) && (t[r.type] = r.type);
		return t;
	}), s = Y(() => e.onlyRenderVisibleElements ? Dm(e.nodes, {
		x: 0,
		y: 0,
		width: e.dimensions.width,
		height: e.dimensions.height
	}, e.viewport, !0) : e.nodes), c = Y(() => {
		if (e.onlyRenderVisibleElements) {
			let n = [];
			for (let r of e.edges) {
				let i = t.value.get(r.source), a = t.value.get(r.target);
				ah({
					sourcePos: i.computedPosition || {
						x: 0,
						y: 0
					},
					targetPos: a.computedPosition || {
						x: 0,
						y: 0
					},
					sourceWidth: i.dimensions.width,
					sourceHeight: i.dimensions.height,
					targetWidth: a.dimensions.width,
					targetHeight: a.dimensions.height,
					width: e.dimensions.width,
					height: e.dimensions.height,
					viewport: e.viewport
				}) && n.push(r);
			}
			return n;
		}
		return e.edges;
	}), l = Y(() => [...s.value, ...c.value]), u = Y(() => {
		let t = [];
		for (let n of e.nodes) n.selected && t.push(n);
		return t;
	}), d = Y(() => {
		let t = [];
		for (let n of e.edges) n.selected && t.push(n);
		return t;
	}), f = Y(() => [...u.value, ...d.value]), p = Y(() => {
		let t = [];
		for (let n of e.nodes) n.dimensions.width && n.dimensions.height && n.handleBounds !== void 0 && t.push(n);
		return t;
	});
	return {
		getNode: r,
		getEdge: i,
		getElements: l,
		getEdgeTypes: a,
		getNodeTypes: o,
		getEdges: c,
		getNodes: s,
		getSelectedElements: f,
		getSelectedNodes: u,
		getSelectedEdges: d,
		getNodesInitialized: p,
		areNodesInitialized: Y(() => s.value.length > 0 && p.value.length === s.value.length)
	};
}
var $g = class e {
	constructor() {
		this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
	}
	static getInstance() {
		let t = xa()?.appContext.app, n = t?.config.globalProperties.$vueFlowStorage ?? e.instance;
		return e.instance = n ?? new e(), t && (t.config.globalProperties.$vueFlowStorage = e.instance), e.instance;
	}
	set(e, t) {
		return this.flows.set(e, t);
	}
	get(e) {
		return this.flows.get(e);
	}
	remove(e) {
		return this.flows.delete(e);
	}
	create(e, t) {
		let n = /* @__PURE__ */ Pt(pg()), r = {};
		for (let [e, t] of Object.entries(n.hooks)) {
			let n = `on${e.charAt(0).toUpperCase() + e.slice(1)}`;
			r[n] = t.on;
		}
		let i = {};
		for (let [e, t] of Object.entries(n.hooks)) i[e] = t.trigger;
		let a = Y(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.nodes) e.set(t.id, t);
			return e;
		}), o = Y(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.edges) e.set(t.id, t);
			return e;
		}), s = Qg(n, a, o), c = hg(n, a, o);
		c.setState({
			...n,
			...t
		});
		let l = {
			...r,
			...s,
			...c,
			...Rs(n),
			nodeLookup: a,
			edgeLookup: o,
			emits: i,
			id: e,
			vueFlowVersion: "1.48.2",
			$destroy: () => {
				this.remove(e);
			}
		};
		return this.set(e, l), l;
	}
	getId() {
		return `vue-flow-${this.currentId++}`;
	}
};
function e_(e) {
	let t = $g.getInstance(), n = Se(), r = typeof e == "object", i = r ? e : { id: e }, a = i.id, o = a ?? n?.vueFlowId, s;
	if (n) {
		let e = zn(Bh, null);
		e != null && (!o || e.id === o) && (s = e);
	}
	if (s || o && (s = t.get(o)), !s || o && s.id !== o) {
		let e = a ?? t.getId(), r = t.create(e, i);
		s = r, (n ?? xe(!0)).run(() => {
			U(r.applyDefault, (e, t, n) => {
				let i = (e) => {
					r.applyNodeChanges(e);
				}, a = (e) => {
					r.applyEdgeChanges(e);
				};
				e ? (r.onNodesChange(i), r.onEdgesChange(a)) : (r.hooks.value.nodesChange.off(i), r.hooks.value.edgesChange.off(a)), n(() => {
					r.hooks.value.nodesChange.off(i), r.hooks.value.edgesChange.off(a);
				});
			}, { immediate: !0 }), Ts(() => {
				if (s) {
					let e = t.get(s.id);
					e ? e.$destroy() : Oh(`No store instance found for id ${s.id} in storage.`);
				}
			});
		});
	} else r && s.setState(i);
	return n && (Rn(Bh, s), n.vueFlowId = s.id), r && xa()?.type.name !== "VueFlow" && s.emits.error(new lh(sh.USEVUEFLOW_OPTIONS)), s;
}
function t_(e) {
	let { emits: t, dimensions: n } = e_(), r;
	dr(() => {
		let i = () => {
			var r;
			if (!e.value || !((r = e.value).checkVisibility?.call(r) ?? !0)) return;
			let i = im(e.value);
			(i.width === 0 || i.height === 0) && t.error(new lh(sh.MISSING_VIEWPORT_DIMENSIONS)), n.value = {
				width: i.width || 500,
				height: i.height || 500
			};
		};
		i(), window.addEventListener("resize", i), e.value && (r = new ResizeObserver(() => i()), r.observe(e.value)), mr(() => {
			window.removeEventListener("resize", i), r && e.value && r.unobserve(e.value);
		});
	});
}
var n_ = /* @__PURE__ */ Xn({
	name: "UserSelection",
	compatConfig: { MODE: 3 },
	props: { userSelectionRect: {} },
	setup(e) {
		return (e, t) => (G(), K("div", {
			class: "vue-flow__selection vue-flow__container",
			style: I({
				width: `${e.userSelectionRect.width}px`,
				height: `${e.userSelectionRect.height}px`,
				transform: `translate(${e.userSelectionRect.x}px, ${e.userSelectionRect.y}px)`
			})
		}, null, 4));
	}
}), r_ = ["tabIndex"], i_ = /* @__PURE__ */ Xn({
	name: "NodesSelection",
	compatConfig: { MODE: 3 },
	setup(e) {
		let { emits: t, viewport: n, getSelectedNodes: r, noPanClassName: i, disableKeyboardA11y: a, userSelectionActive: o } = e_(), s = ng(), c = /* @__PURE__ */ z(null), l = Kh({
			el: c,
			onStart(e) {
				t.selectionDragStart(e), t.nodeDragStart(e);
			},
			onDrag(e) {
				t.selectionDrag(e), t.nodeDrag(e);
			},
			onStop(e) {
				t.selectionDragStop(e), t.nodeDragStop(e);
			}
		});
		dr(() => {
			var e;
			a.value || (e = c.value) == null || e.focus({ preventScroll: !0 });
		});
		let u = Y(() => Em(r.value)), d = Y(() => ({
			width: `${u.value.width}px`,
			height: `${u.value.height}px`,
			top: `${u.value.y}px`,
			left: `${u.value.x}px`
		}));
		function f(e) {
			t.selectionContextMenu({
				event: e,
				nodes: r.value
			});
		}
		function p(e) {
			a.value || tm[e.key] && (e.preventDefault(), s({
				x: tm[e.key].x,
				y: tm[e.key].y
			}, e.shiftKey));
		}
		return (e, t) => !B(o) && u.value.width && u.value.height ? (G(), K("div", {
			key: 0,
			class: le(["vue-flow__nodesselection vue-flow__container", B(i)]),
			style: I({ transform: `translate(${B(n).x}px,${B(n).y}px) scale(${B(n).zoom})` })
		}, [q("div", {
			ref_key: "el",
			ref: c,
			class: le([{ dragging: B(l) }, "vue-flow__nodesselection-rect"]),
			style: I(d.value),
			tabIndex: B(a) ? void 0 : -1,
			onContextmenu: f,
			onKeydown: p
		}, null, 46, r_)], 6)) : da("", !0);
	}
});
function a_(e, t) {
	return {
		x: e.clientX - t.left,
		y: e.clientY - t.top
	};
}
var o_ = /* @__PURE__ */ Xn({
	name: "Pane",
	compatConfig: { MODE: 3 },
	props: {
		isSelecting: { type: Boolean },
		selectionKeyPressed: { type: Boolean }
	},
	setup(e) {
		let { vueFlowRef: t, nodes: n, viewport: r, emits: i, userSelectionActive: a, removeSelectedElements: o, userSelectionRect: s, elementsSelectable: c, nodesSelectionActive: l, getSelectedEdges: u, getSelectedNodes: d, removeNodes: f, removeEdges: p, selectionMode: m, deleteKeyCode: h, multiSelectionKeyCode: g, multiSelectionActive: _, edgeLookup: v, nodeLookup: y, connectionLookup: b, defaultEdgeOptions: x, connectionStartHandle: S, panOnDrag: C } = e_(), w = /* @__PURE__ */ Kt(null), T = /* @__PURE__ */ Kt(/* @__PURE__ */ new Set()), E = /* @__PURE__ */ Kt(/* @__PURE__ */ new Set()), D = /* @__PURE__ */ Kt(null), O = /* @__PURE__ */ nn(() => c.value && (e.isSelecting || a.value)), k = /* @__PURE__ */ nn(() => S.value !== null), A = !1, j = !1, M = Xp(h, { actInsideInputWithModifier: !1 }), ee = Xp(g);
		U(M, (e) => {
			e && (f(d.value), p(u.value), l.value = !1);
		}), U(ee, (e) => {
			_.value = e;
		});
		function N(e, t) {
			return (n) => {
				n.target === t && e?.(n);
			};
		}
		function P(e) {
			if (A || k.value) {
				A = !1;
				return;
			}
			i.paneClick(e), o(), l.value = !1;
		}
		function te(e) {
			if (Array.isArray(C.value) && C.value?.includes(2)) {
				e.preventDefault();
				return;
			}
			i.paneContextMenu(e);
		}
		function ne(e) {
			i.paneScroll(e);
		}
		function F(n) {
			var r, a;
			if (D.value = t.value?.getBoundingClientRect() ?? null, !c.value || !e.isSelecting || n.button !== 0 || n.target !== w.value || !D.value) return;
			(a = (r = n.target)?.setPointerCapture) == null || a.call(r, n.pointerId);
			let { x: l, y: u } = a_(n, D.value);
			j = !0, A = !1, o(), s.value = {
				width: 0,
				height: 0,
				startX: l,
				startY: u,
				x: l,
				y: u
			}, i.selectionStart(n);
		}
		function re(e) {
			if (!D.value || !s.value) return;
			A = !0;
			let { x: t, y: o } = fh(e, D.value), { startX: c = 0, startY: u = 0 } = s.value, d = {
				startX: c,
				startY: u,
				x: t < c ? t : c,
				y: o < u ? o : u,
				width: Math.abs(t - c),
				height: Math.abs(o - u)
			}, f = T.value, p = E.value;
			T.value = new Set(Dm(n.value, d, r.value, m.value === Rp.Partial, !0).map((e) => e.id)), E.value = /* @__PURE__ */ new Set();
			let h = x.value?.selectable ?? !0;
			for (let e of T.value) {
				let t = b.value.get(e);
				if (t) for (let { edgeId: e } of t.values()) {
					let t = v.value.get(e);
					t && (t.selectable ?? h) && E.value.add(e);
				}
			}
			if (!Rh(f, T.value)) {
				let e = qm(y.value, T.value, !0);
				i.nodesChange(e);
			}
			if (!Rh(p, E.value)) {
				let e = qm(v.value, E.value);
				i.edgesChange(e);
			}
			s.value = d, a.value = !0, l.value = !1;
		}
		function ie(t) {
			var n;
			t.button !== 0 || !j || ((n = t.target) == null || n.releasePointerCapture(t.pointerId), !a.value && s.value && t.target === w.value && P(t), a.value = !1, s.value = null, l.value = T.value.size > 0, i.selectionEnd(t), e.selectionKeyPressed && (A = !1), j = !1);
		}
		return (e, t) => (G(), K("div", {
			ref_key: "container",
			ref: w,
			class: le(["vue-flow__pane vue-flow__container", { selection: e.isSelecting }]),
			onClick: t[0] ||= (e) => O.value ? void 0 : N(P, w.value)(e),
			onContextmenu: t[1] ||= (e) => N(te, w.value)(e),
			onWheelPassive: t[2] ||= (e) => N(ne, w.value)(e),
			onPointerenter: t[3] ||= (e) => O.value ? void 0 : B(i).paneMouseEnter(e),
			onPointerdown: t[4] ||= (e) => O.value ? F(e) : B(i).paneMouseMove(e),
			onPointermove: t[5] ||= (e) => O.value ? re(e) : B(i).paneMouseMove(e),
			onPointerup: t[6] ||= (e) => O.value ? ie(e) : void 0,
			onPointerleave: t[7] ||= (e) => B(i).paneMouseLeave(e)
		}, [
			Dr(e.$slots, "default"),
			B(a) && B(s) ? (G(), ta(n_, {
				key: 0,
				"user-selection-rect": B(s)
			}, null, 8, ["user-selection-rect"])) : da("", !0),
			B(l) && B(d).length ? (G(), ta(i_, { key: 1 })) : da("", !0)
		], 34));
	}
}), s_ = /* @__PURE__ */ Xn({
	name: "Transform",
	compatConfig: { MODE: 3 },
	setup(e) {
		let { viewport: t, fitViewOnInit: n, fitViewOnInitDone: r } = e_(), i = Y(() => n.value ? !r.value : !1), a = Y(() => `translate(${t.value.x}px,${t.value.y}px) scale(${t.value.zoom})`);
		return (e, t) => (G(), K("div", {
			class: "vue-flow__transformationpane vue-flow__container",
			style: I({
				transform: a.value,
				opacity: i.value ? 0 : void 0
			})
		}, [Dr(e.$slots, "default")], 4));
	}
}), c_ = /* @__PURE__ */ Xn({
	name: "Viewport",
	compatConfig: { MODE: 3 },
	setup(e) {
		let { minZoom: t, maxZoom: n, defaultViewport: r, translateExtent: i, zoomActivationKeyCode: a, selectionKeyCode: o, panActivationKeyCode: s, panOnScroll: c, panOnScrollMode: l, panOnScrollSpeed: u, panOnDrag: d, zoomOnDoubleClick: f, zoomOnPinch: p, zoomOnScroll: m, preventScrolling: h, noWheelClassName: g, noPanClassName: _, emits: v, connectionStartHandle: y, userSelectionActive: b, paneDragging: x, d3Zoom: S, d3Selection: C, d3ZoomHandler: w, viewport: T, viewportRef: E, paneClickDistance: D } = e_();
		t_(E);
		let O = /* @__PURE__ */ Kt(!1), k = /* @__PURE__ */ Kt(!1), A = null, j = !1, M = 0, ee = {
			x: 0,
			y: 0,
			zoom: 0
		}, N = Xp(s), P = Xp(o), te = Xp(a), ne = /* @__PURE__ */ nn(() => (!P.value || P.value && o.value === !0) && (N.value || d.value)), F = /* @__PURE__ */ nn(() => N.value || c.value), re = /* @__PURE__ */ nn(() => o.value === !0 && ne.value !== !0), ie = /* @__PURE__ */ nn(() => P.value && o.value !== !0 || b.value || re.value), I = /* @__PURE__ */ nn(() => y.value !== null);
		dr(() => {
			if (!E.value) {
				Oh("Viewport element is missing");
				return;
			}
			let e = E.value, a = e.getBoundingClientRect(), s = Lp().clickDistance(D.value).scaleExtent([t.value, n.value]).translateExtent(i.value), y = $l(e).call(s), P = y.on("wheel.zoom"), ie = Op.translate(r.value.x ?? 0, r.value.y ?? 0).scale(am(r.value.zoom ?? 1, t.value, n.value)), le = [[0, 0], [a.width, a.height]], ue = s.constrain()(ie, le, i.value);
			s.transform(y, ue), s.wheelDelta(Im), S.value = s, C.value = y, w.value = P, T.value = {
				x: ue.x,
				y: ue.y,
				zoom: ue.k
			}, s.on("start", (e) => {
				if (!e.sourceEvent) return null;
				M = e.sourceEvent.button, O.value = !0;
				let t = se(e.transform);
				e.sourceEvent?.type === "mousedown" && (x.value = !0), ee = t, v.viewportChangeStart(t), v.moveStart({
					event: e,
					flowTransform: t
				});
			}), s.on("end", (e) => {
				if (!e.sourceEvent) return null;
				if (O.value = !1, x.value = !1, ae(ne.value, M ?? 0) && !j && v.paneContextMenu(e.sourceEvent), j = !1, oe(ee, e.transform)) {
					let t = se(e.transform);
					ee = t, v.viewportChangeEnd(t), v.moveEnd({
						event: e,
						flowTransform: t
					});
				}
			}), s.filter((e) => {
				let t = te.value || m.value, n = p.value && e.ctrlKey, r = e.button, i = e.type === "wheel";
				if (r === 1 && e.type === "mousedown" && (ce(e, "vue-flow__node") || ce(e, "vue-flow__edge"))) return !0;
				if (!ne.value && !t && !F.value && !f.value && !p.value || b.value || I.value && !i || !f.value && e.type === "dblclick" || ce(e, g.value) && i || ce(e, _.value) && (!i || F.value && i && !te.value) || !p.value && e.ctrlKey && i || !t && !F.value && !n && i) return !1;
				if (!p && e.type === "touchstart" && e.touches?.length > 1) return e.preventDefault(), !1;
				if (!ne.value && (e.type === "mousedown" || e.type === "touchstart") || re.value && Array.isArray(d.value) && d.value.includes(0) && r === 0 || Array.isArray(d.value) && !d.value.includes(r) && (e.type === "mousedown" || e.type === "touchstart")) return !1;
				let a = Array.isArray(d.value) && d.value.includes(r) || o.value === !0 && Array.isArray(d.value) && !d.value.includes(0) || !r || r <= 1;
				return (!e.ctrlKey || N.value || i) && a;
			}), U([b, ne], () => {
				b.value && !O.value ? s.on("zoom", null) : b.value || s.on("zoom", (e) => {
					T.value = {
						x: e.transform.x,
						y: e.transform.y,
						zoom: e.transform.k
					};
					let t = se(e.transform);
					j = ae(ne.value, M ?? 0), v.viewportChange(t), v.move({
						event: e,
						flowTransform: t
					});
				});
			}, { immediate: !0 }), U([
				b,
				F,
				l,
				te,
				p,
				h,
				g
			], () => {
				F.value && !te.value && !b.value ? y.on("wheel.zoom", (e) => {
					if (ce(e, g.value)) return !1;
					let t = te.value || m.value, n = p.value && e.ctrlKey;
					if (!(!h.value || F.value || t || n)) return !1;
					e.preventDefault(), e.stopImmediatePropagation();
					let r = y.property("__zoom").k || 1, i = ph();
					if (!N.value && e.ctrlKey && p.value && i) {
						let t = tu(e), n = r * 2 ** Im(e);
						s.scaleTo(y, n, t, e);
						return;
					}
					let a = e.deltaMode === 1 ? 20 : 1, o = l.value === Hp.Vertical ? 0 : e.deltaX * a, c = l.value === Hp.Horizontal ? 0 : e.deltaY * a;
					!i && e.shiftKey && l.value !== Hp.Vertical && !o && c && (o = c, c = 0), s.translateBy(y, -(o / r) * u.value, -(c / r) * u.value);
					let d = se(y.property("__zoom"));
					A && clearTimeout(A), k.value ? (v.move({
						event: e,
						flowTransform: d
					}), v.viewportChange(d), A = setTimeout(() => {
						v.moveEnd({
							event: e,
							flowTransform: d
						}), v.viewportChangeEnd(d), k.value = !1;
					}, 150)) : (k.value = !0, v.moveStart({
						event: e,
						flowTransform: d
					}), v.viewportChangeStart(d));
				}, { passive: !1 }) : P !== void 0 && y.on("wheel.zoom", function(e, t) {
					let n = !h.value && e.type === "wheel" && !e.ctrlKey, r = te.value || m.value, i = p.value && e.ctrlKey;
					if (!r && !c.value && !i && e.type === "wheel" || n || ce(e, g.value)) return null;
					e.preventDefault(), P.call(this, e, t);
				}, { passive: !1 });
			}, { immediate: !0 });
		});
		function ae(e, t) {
			return t === 2 && Array.isArray(e) && e.includes(2);
		}
		function oe(e, t) {
			return e.x !== t.x && !Number.isNaN(t.x) || e.y !== t.y && !Number.isNaN(t.y) || e.zoom !== t.k && !Number.isNaN(t.k);
		}
		function se(e) {
			return {
				x: e.x,
				y: e.y,
				zoom: e.k
			};
		}
		function ce(e, t) {
			return e.target.closest(`.${t}`);
		}
		return (e, t) => (G(), K("div", {
			ref_key: "viewportRef",
			ref: E,
			class: "vue-flow__viewport vue-flow__container"
		}, [J(o_, {
			"is-selecting": ie.value,
			"selection-key-pressed": B(P),
			class: le({
				connecting: I.value,
				dragging: B(x),
				draggable: B(d) === !0 || Array.isArray(B(d)) && B(d).includes(0)
			})
		}, {
			default: In(() => [J(s_, null, {
				default: In(() => [Dr(e.$slots, "default")]),
				_: 3
			})]),
			_: 3
		}, 8, [
			"is-selecting",
			"selection-key-pressed",
			"class"
		])], 512));
	}
}), l_ = ["id"], u_ = ["id"], d_ = ["id"], f_ = /* @__PURE__ */ Xn({
	name: "A11yDescriptions",
	compatConfig: { MODE: 3 },
	setup(e) {
		let { id: t, disableKeyboardA11y: n, ariaLiveMessage: r } = e_();
		return (e, i) => (G(), K(W, null, [
			q("div", {
				id: `${B(Zp)}-${B(t)}`,
				style: { display: "none" }
			}, " Press enter or space to select a node. " + L(B(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, l_),
			q("div", {
				id: `${B(Qp)}-${B(t)}`,
				style: { display: "none" }
			}, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, u_),
			B(n) ? da("", !0) : (G(), K("div", {
				key: 0,
				id: `${B($p)}-${B(t)}`,
				"aria-live": "assertive",
				"aria-atomic": "true",
				style: {
					position: "absolute",
					width: "1px",
					height: "1px",
					margin: "-1px",
					border: "0",
					padding: "0",
					overflow: "hidden",
					clip: "rect(0px, 0px, 0px, 0px)",
					"clip-path": "inset(100%)"
				}
			}, L(B(r)), 9, d_))
		], 64));
	}
});
function p_() {
	let e = e_();
	U(() => e.viewportHelper.value.viewportInitialized, (t) => {
		t && setTimeout(() => {
			e.emits.init(e), e.emits.paneReady(e);
		}, 1);
	});
}
function m_(e, t, n) {
	return n === X.Left ? e - t : n === X.Right ? e + t : e;
}
function h_(e, t, n) {
	return n === X.Top ? e - t : n === X.Bottom ? e + t : e;
}
var g_ = function({ radius: e = 10, centerX: t = 0, centerY: n = 0, position: r = X.Top, type: i }) {
	return za("circle", {
		class: `vue-flow__edgeupdater vue-flow__edgeupdater-${i}`,
		cx: m_(t, e, r),
		cy: h_(n, e, r),
		r: e,
		stroke: "transparent",
		fill: "transparent"
	});
};
g_.props = [
	"radius",
	"centerX",
	"centerY",
	"position",
	"type"
], g_.compatConfig = { MODE: 3 };
var __ = g_, v_ = /* @__PURE__ */ Xn({
	name: "Edge",
	compatConfig: { MODE: 3 },
	props: ["id"],
	setup(e) {
		let { id: t, addSelectedEdges: n, connectionMode: r, edgeUpdaterRadius: i, emits: a, nodesSelectionActive: o, noPanClassName: s, getEdgeTypes: c, removeSelectedEdges: l, findEdge: u, findNode: d, isValidConnection: f, multiSelectionActive: p, disableKeyboardA11y: m, elementsSelectable: h, edgesUpdatable: g, edgesFocusable: _, hooks: v } = e_(), y = Y(() => u(e.id)), { emit: b, on: x } = Jh(y.value, a), S = zn(Gh), C = xa(), w = /* @__PURE__ */ z(!1), T = /* @__PURE__ */ z(!1), E = /* @__PURE__ */ z(""), D = /* @__PURE__ */ z(null), O = /* @__PURE__ */ z("source"), k = /* @__PURE__ */ z(null), A = /* @__PURE__ */ nn(() => y.value.selectable === void 0 ? h.value : y.value.selectable), j = /* @__PURE__ */ nn(() => y.value.updatable === void 0 ? g.value : y.value.updatable), M = /* @__PURE__ */ nn(() => y.value.focusable === void 0 ? _.value : y.value.focusable);
		Rn(Uh, e.id), Rn(Wh, k);
		let ee = Y(() => y.value.class instanceof Function ? y.value.class(y.value) : y.value.class), N = Y(() => y.value.style instanceof Function ? y.value.style(y.value) : y.value.style), P = Y(() => {
			let e = y.value.type || "default", t = S?.[`edge-${e}`];
			if (t) return t;
			let n = y.value.template ?? c.value[e];
			if (typeof n == "string" && C) {
				let t = Object.keys(C.appContext.components);
				t && t.includes(e) && (n = xr(e, !1));
			}
			return n && typeof n != "string" ? n : (a.error(new lh(sh.EDGE_TYPE_MISSING, n)), !1);
		}), { handlePointerDown: te } = Zh({
			nodeId: E,
			handleId: D,
			type: O,
			isValidConnection: f,
			edgeUpdaterType: O,
			onEdgeUpdate: re,
			onEdgeUpdateEnd: ie
		});
		return () => {
			let n = d(y.value.source), o = d(y.value.target), l = "pathOptions" in y.value ? y.value.pathOptions : {};
			if (!n && !o) return a.error(new lh(sh.EDGE_SOURCE_TARGET_MISSING, y.value.id, y.value.source, y.value.target)), null;
			if (!n) return a.error(new lh(sh.EDGE_SOURCE_MISSING, y.value.id, y.value.source)), null;
			if (!o) return a.error(new lh(sh.EDGE_TARGET_MISSING, y.value.id, y.value.target)), null;
			if (!y.value || y.value.hidden || n.hidden || o.hidden) return null;
			let u;
			u = r.value === Bp.Strict ? n.handleBounds.source : [...n.handleBounds.source || [], ...n.handleBounds.target || []];
			let f = ih(u, y.value.sourceHandle), p;
			p = r.value === Bp.Strict ? o.handleBounds.target : [...o.handleBounds.target || [], ...o.handleBounds.source || []];
			let m = ih(p, y.value.targetHandle), h = f?.position || X.Bottom, g = m?.position || X.Top, { x: _, y: b } = rh(n, f, h), { x: S, y: C } = rh(o, m, g);
			return y.value.sourceX = _, y.value.sourceY = b, y.value.targetX = S, y.value.targetY = C, za("g", {
				ref: k,
				key: e.id,
				"data-id": e.id,
				class: [
					"vue-flow__edge",
					`vue-flow__edge-${P.value === !1 ? "default" : y.value.type || "default"}`,
					s.value,
					ee.value,
					{
						updating: w.value,
						selected: y.value.selected,
						animated: y.value.animated,
						inactive: !A.value && !v.value.edgeClick.hasListeners()
					}
				],
				tabIndex: M.value ? 0 : void 0,
				"aria-label": y.value.ariaLabel === null ? void 0 : y.value.ariaLabel ?? `Edge from ${y.value.source} to ${y.value.target}`,
				"aria-describedby": M.value ? `${Qp}-${t}` : void 0,
				"aria-roledescription": "edge",
				role: M.value ? "group" : "img",
				...y.value.domAttributes,
				onClick: ae,
				onContextmenu: oe,
				onDblclick: se,
				onMouseenter: ce,
				onMousemove: le,
				onMouseleave: ue,
				onKeyDown: M.value ? pe : void 0
			}, [T.value ? null : za(P.value === !1 ? c.value.default : P.value, {
				id: e.id,
				sourceNode: n,
				targetNode: o,
				source: y.value.source,
				target: y.value.target,
				type: y.value.type,
				updatable: j.value,
				selected: y.value.selected,
				animated: y.value.animated,
				label: y.value.label,
				labelStyle: y.value.labelStyle,
				labelShowBg: y.value.labelShowBg,
				labelBgStyle: y.value.labelBgStyle,
				labelBgPadding: y.value.labelBgPadding,
				labelBgBorderRadius: y.value.labelBgBorderRadius,
				data: y.value.data,
				events: {
					...y.value.events,
					...x
				},
				style: N.value,
				markerStart: `url('#${Fm(y.value.markerStart, t)}')`,
				markerEnd: `url('#${Fm(y.value.markerEnd, t)}')`,
				sourcePosition: h,
				targetPosition: g,
				sourceX: _,
				sourceY: b,
				targetX: S,
				targetY: C,
				sourceHandleId: y.value.sourceHandle,
				targetHandleId: y.value.targetHandle,
				interactionWidth: y.value.interactionWidth,
				...l
			}), [j.value === "source" || j.value === !0 ? [za("g", {
				onMousedown: de,
				onMouseenter: ne,
				onMouseout: F
			}, za(__, {
				position: h,
				centerX: _,
				centerY: b,
				radius: i.value,
				type: "source",
				"data-type": "source"
			}))] : null, j.value === "target" || j.value === !0 ? [za("g", {
				onMousedown: fe,
				onMouseenter: ne,
				onMouseout: F
			}, za(__, {
				position: g,
				centerX: S,
				centerY: C,
				radius: i.value,
				type: "target",
				"data-type": "target"
			}))] : null]]);
		};
		function ne() {
			w.value = !0;
		}
		function F() {
			w.value = !1;
		}
		function re(e, t) {
			b.update({
				event: e,
				edge: y.value,
				connection: t
			});
		}
		function ie(e) {
			b.updateEnd({
				event: e,
				edge: y.value
			}), T.value = !1;
		}
		function I(e, t) {
			e.button === 0 && (T.value = !0, E.value = t ? y.value.target : y.value.source, D.value = (t ? y.value.targetHandle : y.value.sourceHandle) ?? null, O.value = t ? "target" : "source", b.updateStart({
				event: e,
				edge: y.value
			}), te(e));
		}
		function ae(e) {
			var t;
			let r = {
				event: e,
				edge: y.value
			};
			A.value && (o.value = !1, y.value.selected && p.value ? (l([y.value]), (t = k.value) == null || t.blur()) : n([y.value])), b.click(r);
		}
		function oe(e) {
			b.contextMenu({
				event: e,
				edge: y.value
			});
		}
		function se(e) {
			b.doubleClick({
				event: e,
				edge: y.value
			});
		}
		function ce(e) {
			b.mouseEnter({
				event: e,
				edge: y.value
			});
		}
		function le(e) {
			b.mouseMove({
				event: e,
				edge: y.value
			});
		}
		function ue(e) {
			b.mouseLeave({
				event: e,
				edge: y.value
			});
		}
		function de(e) {
			I(e, !0);
		}
		function fe(e) {
			I(e, !1);
		}
		function pe(t) {
			var r;
			!m.value && em.includes(t.key) && A.value && (t.key === "Escape" ? ((r = k.value) == null || r.blur(), l([u(e.id)])) : n([u(e.id)]));
		}
	}
}), y_ = /* @__PURE__ */ Xn({
	name: "ConnectionLine",
	compatConfig: { MODE: 3 },
	setup() {
		let { id: e, connectionMode: t, connectionStartHandle: n, connectionEndHandle: r, connectionPosition: i, connectionLineType: a, connectionLineStyle: o, connectionLineOptions: s, connectionStatus: c, viewport: l, findNode: u } = e_(), d = zn(Gh)?.["connection-line"], f = Y(() => u(n.value?.nodeId)), p = Y(() => u(r.value?.nodeId) ?? null), m = Y(() => ({
			x: (i.value.x - l.value.x) / l.value.zoom,
			y: (i.value.y - l.value.y) / l.value.zoom
		})), h = Y(() => s.value.markerStart ? `url(#${Fm(s.value.markerStart, e)})` : ""), g = Y(() => s.value.markerEnd ? `url(#${Fm(s.value.markerEnd, e)})` : "");
		return () => {
			if (!f.value || !n.value) return null;
			let e = n.value.id, i = n.value.type, l = f.value.handleBounds, u = l?.[i] ?? [];
			if (t.value === Bp.Loose) {
				let e = l?.[i === "source" ? "target" : "source"] ?? [];
				u = [...u, ...e];
			}
			if (!u) return null;
			let _ = (e ? u.find((t) => t.id === e) : u[0]) ?? null, v = _?.position ?? X.Top, { x: y, y: b } = rh(f.value, _, v), x = null;
			p.value && (x = t.value === Bp.Strict ? p.value.handleBounds[i === "source" ? "target" : "source"]?.find((e) => e.id === r.value?.id) || null : [...p.value.handleBounds.source ?? [], ...p.value.handleBounds.target ?? []].find((e) => e.id === r.value?.id) || null);
			let S = r.value?.position ?? (v ? Eh[v] : null);
			if (!v || !S) return null;
			let C = a.value ?? s.value.type ?? zp.Bezier, w = "", T = {
				sourceX: y,
				sourceY: b,
				sourcePosition: v,
				targetX: m.value.x,
				targetY: m.value.y,
				targetPosition: S
			};
			return C === zp.Bezier ? [w] = Fg(T) : C === zp.Step ? [w] = Ug({
				...T,
				borderRadius: 0
			}) : C === zp.SmoothStep ? [w] = Ug(T) : C === zp.SimpleBezier ? [w] = Lg(T) : w = `M${y},${b} ${m.value.x},${m.value.y}`, za("svg", { class: "vue-flow__edges vue-flow__connectionline vue-flow__container" }, za("g", { class: "vue-flow__connection" }, d ? za(d, {
				sourceX: y,
				sourceY: b,
				sourcePosition: v,
				targetX: m.value.x,
				targetY: m.value.y,
				targetPosition: S,
				sourceNode: f.value,
				sourceHandle: _,
				targetNode: p.value,
				targetHandle: x,
				markerEnd: g.value,
				markerStart: h.value,
				connectionStatus: c.value
			}) : za("path", {
				d: w,
				class: [
					s.value.class,
					c.value,
					"vue-flow__connection-path"
				],
				style: {
					...o.value,
					...s.value.style
				},
				"marker-end": g.value,
				"marker-start": h.value
			})));
		};
	}
}), b_ = [
	"id",
	"markerWidth",
	"markerHeight",
	"markerUnits",
	"orient"
], x_ = /* @__PURE__ */ Xn({
	name: "MarkerType",
	compatConfig: { MODE: 3 },
	props: {
		id: {},
		type: {},
		color: { default: "none" },
		width: { default: 12.5 },
		height: { default: 12.5 },
		markerUnits: { default: "strokeWidth" },
		orient: { default: "auto-start-reverse" },
		strokeWidth: { default: 1 }
	},
	setup(e) {
		return (e, t) => (G(), K("marker", {
			id: e.id,
			class: "vue-flow__arrowhead",
			viewBox: "-10 -10 20 20",
			refX: "0",
			refY: "0",
			markerWidth: `${e.width}`,
			markerHeight: `${e.height}`,
			markerUnits: e.markerUnits,
			orient: e.orient
		}, [e.type === B(Vp).ArrowClosed ? (G(), K("polyline", {
			key: 0,
			style: I({
				stroke: e.color,
				fill: e.color,
				strokeWidth: e.strokeWidth
			}),
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			points: "-5,-4 0,0 -5,4 -5,-4"
		}, null, 4)) : da("", !0), e.type === B(Vp).Arrow ? (G(), K("polyline", {
			key: 1,
			style: I({
				stroke: e.color,
				strokeWidth: e.strokeWidth
			}),
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			fill: "none",
			points: "-5,-4 0,0 -5,4"
		}, null, 4)) : da("", !0)], 8, b_));
	}
}), S_ = {
	class: "vue-flow__marker vue-flow__container",
	"aria-hidden": "true"
}, C_ = /* @__PURE__ */ Xn({
	name: "MarkerDefinitions",
	compatConfig: { MODE: 3 },
	setup(e) {
		let { id: t, edges: n, connectionLineOptions: r, defaultMarkerColor: i } = e_(), a = Y(() => {
			let e = /* @__PURE__ */ new Set(), a = [], o = (n) => {
				if (n) {
					let r = Fm(n, t);
					e.has(r) || (typeof n == "object" ? a.push({
						...n,
						id: r,
						color: n.color || i.value
					}) : a.push({
						id: r,
						color: i.value,
						type: n
					}), e.add(r));
				}
			};
			for (let e of [r.value.markerEnd, r.value.markerStart]) o(e);
			for (let e of n.value) for (let t of [e.markerStart, e.markerEnd]) o(t);
			return a.sort((e, t) => e.id.localeCompare(t.id));
		});
		return (e, t) => (G(), K("svg", S_, [q("defs", null, [(G(!0), K(W, null, Er(a.value, (e) => (G(), ta(x_, {
			id: e.id,
			key: e.id,
			type: e.type,
			color: e.color,
			width: e.width,
			height: e.height,
			markerUnits: e.markerUnits,
			"stroke-width": e.strokeWidth,
			orient: e.orient
		}, null, 8, [
			"id",
			"type",
			"color",
			"width",
			"height",
			"markerUnits",
			"stroke-width",
			"orient"
		]))), 128))])]));
	}
}), w_ = /* @__PURE__ */ Xn({
	name: "Edges",
	compatConfig: { MODE: 3 },
	setup(e) {
		let { findNode: t, getEdges: n, elevateEdgesOnSelect: r } = e_();
		return (e, i) => (G(), K(W, null, [
			J(C_),
			(G(!0), K(W, null, Er(B(n), (e) => (G(), K("svg", {
				key: e.id,
				class: "vue-flow__edges vue-flow__container",
				style: I({ zIndex: B(oh)(e, B(t), B(r)) })
			}, [J(B(v_), { id: e.id }, null, 8, ["id"])], 4))), 128)),
			J(B(y_))
		], 64));
	}
}), T_ = /* @__PURE__ */ Xn({
	name: "Node",
	compatConfig: { MODE: 3 },
	props: ["id", "resizeObserver"],
	setup(e) {
		let { id: t, noPanClassName: n, selectNodesOnDrag: r, nodesSelectionActive: i, multiSelectionActive: a, emits: o, removeSelectedNodes: s, addSelectedNodes: c, updateNodeDimensions: l, onUpdateNodeInternals: u, getNodeTypes: d, nodeExtent: f, elevateNodesOnSelect: p, disableKeyboardA11y: m, ariaLiveMessage: h, snapToGrid: g, snapGrid: _, nodeDragThreshold: v, nodesDraggable: y, elementsSelectable: b, nodesConnectable: x, nodesFocusable: S, hooks: C } = e_(), w = /* @__PURE__ */ z(null);
		Rn(Hh, w), Rn(Vh, e.id);
		let T = zn(Gh), E = xa(), D = ng(), { node: O, parentNode: k } = $h(e.id), { emit: A, on: j } = tg(O, o), M = /* @__PURE__ */ nn(() => O.draggable === void 0 ? y.value : O.draggable), ee = /* @__PURE__ */ nn(() => O.selectable === void 0 ? b.value : O.selectable), N = /* @__PURE__ */ nn(() => O.connectable === void 0 ? x.value : O.connectable), P = /* @__PURE__ */ nn(() => O.focusable === void 0 ? S.value : O.focusable), te = Y(() => ee.value || M.value || C.value.nodeClick.hasListeners() || C.value.nodeDoubleClick.hasListeners() || C.value.nodeMouseEnter.hasListeners() || C.value.nodeMouseMove.hasListeners() || C.value.nodeMouseLeave.hasListeners()), ne = /* @__PURE__ */ nn(() => !!O.dimensions.width && !!O.dimensions.height), F = Y(() => {
			let e = O.type || "default", t = T?.[`node-${e}`];
			if (t) return t;
			let n = O.template || d.value[e];
			if (typeof n == "string" && E) {
				let t = Object.keys(E.appContext.components);
				t && t.includes(e) && (n = xr(e, !1));
			}
			return n && typeof n != "string" ? n : (o.error(new lh(sh.NODE_TYPE_MISSING, n)), !1);
		}), re = Kh({
			id: e.id,
			el: w,
			disabled: () => !M.value,
			selectable: ee,
			dragHandle: () => O.dragHandle,
			onStart(e) {
				A.dragStart(e);
			},
			onDrag(e) {
				A.drag(e);
			},
			onStop(e) {
				A.dragStop(e);
			},
			onClick(e) {
				pe(e);
			}
		}), ie = Y(() => O.class instanceof Function ? O.class(O) : O.class), I = Y(() => {
			let e = (O.style instanceof Function ? O.style(O) : O.style) || {}, t = O.width instanceof Function ? O.width(O) : O.width, n = O.height instanceof Function ? O.height(O) : O.height;
			return !e.width && t && (e.width = typeof t == "string" ? t : `${t}px`), !e.height && n && (e.height = typeof n == "string" ? n : `${n}px`), e;
		}), ae = /* @__PURE__ */ nn(() => Number(O.zIndex ?? I.value.zIndex ?? 0));
		return u((t) => {
			(t.includes(e.id) || !t.length) && se();
		}), dr(() => {
			U(() => O.hidden, (t = !1, n, r) => {
				!t && w.value && (e.resizeObserver.observe(w.value), r(() => {
					w.value && e.resizeObserver.unobserve(w.value);
				}));
			}, {
				immediate: !0,
				flush: "post"
			});
		}), U([
			() => O.type,
			() => O.sourcePosition,
			() => O.targetPosition
		], () => {
			wn(() => {
				l([{
					id: e.id,
					nodeElement: w.value,
					forceUpdate: !0
				}]);
			});
		}), U([
			() => O.position.x,
			() => O.position.y,
			() => k.value?.computedPosition.x,
			() => k.value?.computedPosition.y,
			() => k.value?.computedPosition.z,
			ae,
			() => O.selected,
			() => O.dimensions.height,
			() => O.dimensions.width,
			() => k.value?.dimensions.height,
			() => k.value?.dimensions.width
		], ([e, t, n, r, i, a]) => {
			let o = {
				x: e,
				y: t,
				z: a + (p.value && O.selected ? 1e3 : 0)
			};
			n !== void 0 && r !== void 0 ? O.computedPosition = Nm({
				x: n,
				y: r,
				z: i
			}, o) : O.computedPosition = o;
		}, {
			flush: "post",
			immediate: !0
		}), U([() => O.extent, f], ([e, t], [n, r]) => {
			(e !== n || t !== r) && oe();
		}), O.extent === "parent" || typeof O.extent == "object" && "range" in O.extent && O.extent.range === "parent" ? Bs(() => ne).toBe(!0).then(oe) : oe(), () => O.hidden ? null : za("div", {
			ref: w,
			"data-id": O.id,
			class: [
				"vue-flow__node",
				`vue-flow__node-${F.value === !1 ? "default" : O.type || "default"}`,
				{
					[n.value]: M.value,
					dragging: re?.value,
					draggable: M.value,
					selected: O.selected,
					selectable: ee.value,
					parent: O.isParent
				},
				ie.value
			],
			style: {
				visibility: ne.value ? "visible" : "hidden",
				zIndex: O.computedPosition.z ?? ae.value,
				transform: `translate(${O.computedPosition.x}px,${O.computedPosition.y}px)`,
				pointerEvents: te.value ? "all" : "none",
				...I.value
			},
			tabIndex: P.value ? 0 : void 0,
			role: P.value ? "group" : void 0,
			"aria-describedby": m.value ? void 0 : `${Zp}-${t}`,
			"aria-label": O.ariaLabel,
			"aria-roledescription": "node",
			...O.domAttributes,
			onMouseenter: ce,
			onMousemove: le,
			onMouseleave: ue,
			onContextmenu: de,
			onClick: pe,
			onDblclick: fe,
			onKeydown: me
		}, [za(F.value === !1 ? d.value.default : F.value, {
			id: O.id,
			type: O.type,
			data: O.data,
			events: {
				...O.events,
				...j
			},
			selected: O.selected,
			resizing: O.resizing,
			dragging: re.value,
			connectable: N.value,
			position: O.computedPosition,
			dimensions: O.dimensions,
			isValidTargetPos: O.isValidTargetPos,
			isValidSourcePos: O.isValidSourcePos,
			parent: O.parentNode,
			parentNodeId: O.parentNode,
			zIndex: O.computedPosition.z ?? ae.value,
			targetPosition: O.targetPosition,
			sourcePosition: O.sourcePosition,
			label: O.label,
			dragHandle: O.dragHandle,
			onUpdateNodeInternals: se
		})]);
		function oe() {
			let e = O.computedPosition, { computedPosition: t, position: n } = nh(O, g.value ? hh(e, _.value) : e, o.error, f.value, k.value);
			(O.computedPosition.x !== t.x || O.computedPosition.y !== t.y) && (O.computedPosition = {
				...O.computedPosition,
				...t
			}), (O.position.x !== n.x || O.position.y !== n.y) && (O.position = n);
		}
		function se() {
			w.value && l([{
				id: e.id,
				nodeElement: w.value,
				forceUpdate: !0
			}]);
		}
		function ce(e) {
			re?.value || A.mouseEnter({
				event: e,
				node: O
			});
		}
		function le(e) {
			re?.value || A.mouseMove({
				event: e,
				node: O
			});
		}
		function ue(e) {
			re?.value || A.mouseLeave({
				event: e,
				node: O
			});
		}
		function de(e) {
			return A.contextMenu({
				event: e,
				node: O
			});
		}
		function fe(e) {
			return A.doubleClick({
				event: e,
				node: O
			});
		}
		function pe(e) {
			ee.value && (!r.value || !M.value || v.value > 0) && jh(O, a.value, c, s, i, !1, w.value), A.click({
				event: e,
				node: O
			});
		}
		function me(e) {
			if (!(Gp(e) || m.value)) if (em.includes(e.key) && ee.value) {
				let t = e.key === "Escape";
				jh(O, a.value, c, s, i, t, w.value);
			} else M.value && O.selected && tm[e.key] && (e.preventDefault(), h.value = `Moved selected node ${e.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~O.position.x}, y: ${~~O.position.y}`, D({
				x: tm[e.key].x,
				y: tm[e.key].y
			}, e.shiftKey));
		}
	}
});
function E_(e = { includeHiddenNodes: !1 }) {
	let { nodes: t } = e_();
	return Y(() => {
		if (t.value.length === 0) return !1;
		for (let n of t.value) if ((e.includeHiddenNodes || !n.hidden) && (n?.handleBounds === void 0 || n.dimensions.width === 0 || n.dimensions.height === 0)) return !1;
		return !0;
	});
}
var D_ = { class: "vue-flow__nodes vue-flow__container" }, O_ = /* @__PURE__ */ Xn({
	name: "Nodes",
	compatConfig: { MODE: 3 },
	setup(e) {
		let { getNodes: t, updateNodeDimensions: n, emits: r } = e_(), i = E_(), a = /* @__PURE__ */ z();
		return U(i, (e) => {
			e && wn(() => {
				r.nodesInitialized(t.value);
			});
		}, { immediate: !0 }), dr(() => {
			a.value = new ResizeObserver((e) => {
				let t = e.map((e) => ({
					id: e.target.getAttribute("data-id"),
					nodeElement: e.target,
					forceUpdate: !0
				}));
				wn(() => n(t));
			});
		}), mr(() => a.value?.disconnect()), (e, n) => (G(), K("div", D_, [a.value ? (G(!0), K(W, { key: 0 }, Er(B(t), (e, t, n, r) => {
			let i = [e.id];
			if (r && r.key === e.id && Ba(r, i)) return r;
			let o = (G(), ta(B(T_), {
				id: e.id,
				key: e.id,
				"resize-observer": a.value
			}, null, 8, ["id", "resize-observer"]));
			return o.memo = i, o;
		}, n, 0), 128)) : da("", !0)]));
	}
});
function k_() {
	let { emits: e } = e_();
	dr(() => {
		if (kh()) {
			let t = document.querySelector(".vue-flow__pane");
			t && window.getComputedStyle(t).zIndex !== "1" && e.error(new lh(sh.MISSING_STYLES));
		}
	});
}
var A_ = /* @__PURE__ */ q("div", { class: "vue-flow__edge-labels" }, null, -1), j_ = /* @__PURE__ */ Xn({
	name: "VueFlow",
	compatConfig: { MODE: 3 },
	props: {
		id: {},
		modelValue: {},
		nodes: {},
		edges: {},
		edgeTypes: {},
		nodeTypes: {},
		connectionMode: {},
		connectionLineType: {},
		connectionLineStyle: { default: void 0 },
		connectionLineOptions: { default: void 0 },
		connectionRadius: {},
		isValidConnection: {
			type: [Function, null],
			default: void 0
		},
		deleteKeyCode: { default: void 0 },
		selectionKeyCode: {
			type: [Boolean, null],
			default: void 0
		},
		multiSelectionKeyCode: { default: void 0 },
		zoomActivationKeyCode: { default: void 0 },
		panActivationKeyCode: { default: void 0 },
		snapToGrid: {
			type: Boolean,
			default: void 0
		},
		snapGrid: {},
		onlyRenderVisibleElements: {
			type: Boolean,
			default: void 0
		},
		edgesUpdatable: {
			type: [Boolean, String],
			default: void 0
		},
		nodesDraggable: {
			type: Boolean,
			default: void 0
		},
		nodesConnectable: {
			type: Boolean,
			default: void 0
		},
		nodeDragThreshold: {},
		elementsSelectable: {
			type: Boolean,
			default: void 0
		},
		selectNodesOnDrag: {
			type: Boolean,
			default: void 0
		},
		panOnDrag: {
			type: [Boolean, Array],
			default: void 0
		},
		minZoom: {},
		maxZoom: {},
		defaultViewport: {},
		translateExtent: {},
		nodeExtent: {},
		defaultMarkerColor: {},
		zoomOnScroll: {
			type: Boolean,
			default: void 0
		},
		zoomOnPinch: {
			type: Boolean,
			default: void 0
		},
		panOnScroll: {
			type: Boolean,
			default: void 0
		},
		panOnScrollSpeed: {},
		panOnScrollMode: {},
		paneClickDistance: {},
		zoomOnDoubleClick: {
			type: Boolean,
			default: void 0
		},
		preventScrolling: {
			type: Boolean,
			default: void 0
		},
		selectionMode: {},
		edgeUpdaterRadius: {},
		fitViewOnInit: {
			type: Boolean,
			default: void 0
		},
		connectOnClick: {
			type: Boolean,
			default: void 0
		},
		applyDefault: {
			type: Boolean,
			default: void 0
		},
		autoConnect: {
			type: [Boolean, Function],
			default: void 0
		},
		noDragClassName: {},
		noWheelClassName: {},
		noPanClassName: {},
		defaultEdgeOptions: {},
		elevateEdgesOnSelect: {
			type: Boolean,
			default: void 0
		},
		elevateNodesOnSelect: {
			type: Boolean,
			default: void 0
		},
		disableKeyboardA11y: {
			type: Boolean,
			default: void 0
		},
		edgesFocusable: {
			type: Boolean,
			default: void 0
		},
		nodesFocusable: {
			type: Boolean,
			default: void 0
		},
		autoPanOnConnect: {
			type: Boolean,
			default: void 0
		},
		autoPanOnNodeDrag: {
			type: Boolean,
			default: void 0
		},
		autoPanSpeed: {}
	},
	emits: /* @__PURE__ */ "nodesChange.edgesChange.nodesInitialized.paneReady.init.updateNodeInternals.error.connect.connectStart.connectEnd.clickConnectStart.clickConnectEnd.moveStart.move.moveEnd.selectionDragStart.selectionDrag.selectionDragStop.selectionContextMenu.selectionStart.selectionEnd.viewportChangeStart.viewportChange.viewportChangeEnd.paneScroll.paneClick.paneContextMenu.paneMouseEnter.paneMouseMove.paneMouseLeave.edgeUpdate.edgeContextMenu.edgeMouseEnter.edgeMouseMove.edgeMouseLeave.edgeDoubleClick.edgeClick.edgeUpdateStart.edgeUpdateEnd.nodeContextMenu.nodeMouseEnter.nodeMouseMove.nodeMouseLeave.nodeDoubleClick.nodeClick.nodeDragStart.nodeDrag.nodeDragStop.miniMapNodeClick.miniMapNodeDoubleClick.miniMapNodeMouseEnter.miniMapNodeMouseMove.miniMapNodeMouseLeave.update:modelValue.update:nodes.update:edges".split("."),
	setup(e, { expose: t, emit: n }) {
		let r = e, i = Nr(), a = qs(r, "modelValue", n), o = qs(r, "nodes", n), s = qs(r, "edges", n), c = e_(r), l = lg({
			modelValue: a,
			nodes: o,
			edges: s
		}, r, c);
		return dg(n, c.hooks), p_(), k_(), Rn(Gh, i), hr(l), t(c), (e, t) => (G(), K("div", {
			ref: B(c).vueFlowRef,
			class: "vue-flow"
		}, [
			J(c_, null, {
				default: In(() => [
					J(w_),
					A_,
					J(O_),
					Dr(e.$slots, "zoom-pane")
				]),
				_: 3
			}),
			Dr(e.$slots, "default"),
			J(f_)
		], 512));
	}
}), M_ = {
	input: {
		label: "Input",
		icon: "IN",
		description: "Provide a JSON or text payload to downstream nodes.",
		workflowType: "input",
		outputs: {
			success: { schema: {
				value: "any",
				format: "string"
			} },
			error: {}
		},
		config: {
			format: "json",
			value: "{\n  \"topic\": \"Summer Drops\",\n  \"audience\": \"founders\"\n}"
		}
	},
	http_request: {
		label: "HTTP Request",
		icon: "HTTP IN",
		description: "Receive webhook calls and pass the request payload downstream.",
		workflowType: "http_request",
		outputs: {
			success: { schema: {
				body: "any",
				headers: "object",
				query: "object"
			} },
			error: { schema: {
				message: "string",
				statusCode: "number"
			} }
		},
		config: {
			endpoint: "",
			method: "POST",
			responseFormat: "json",
			timeout: 1e4
		}
	},
	http_response: {
		label: "HTTP Response",
		icon: "HTTP OUT",
		description: "Return a status code and response body to the webhook caller.",
		workflowType: "http_response",
		outputs: {
			success: { schema: {
				statusCode: "number",
				body: "any"
			} },
			error: {}
		},
		config: {
			statusCode: "200",
			body: "{\n  \"ok\": true,\n  \"message\": \"Flow completed\"\n}"
		}
	},
	rest_api: {
		label: "REST",
		icon: "REST",
		description: "Fetch external data through the host bridge.",
		workflowType: "rest",
		outputs: {
			success: { schema: {
				topics: "array",
				items: "array"
			} },
			error: { schema: {
				message: "string",
				statusCode: "number"
			} }
		},
		config: {
			url: "https://api.example.com/trends",
			method: "GET",
			headers: "",
			body: "",
			auth: "none",
			timeout: 1e4,
			retry: 0
		}
	},
	prompt: {
		label: "AI Prompt",
		icon: "AI",
		description: "Generate social copy from upstream context.",
		workflowType: "ai_prompt",
		outputs: {
			success: { schema: {
				text: "string",
				variants: "array"
			} },
			error: {}
		},
		config: {
			model: "gpt-4o-mini",
			systemPrompt: "You are a sharp social media strategist.",
			userPrompt: "Write a concise post about {{fetch_trends.output.topics[0].name}}.",
			temperature: .7,
			maxTokens: 600,
			outputFormat: "text",
			variants: 1,
			apiKeySource: "platform"
		}
	},
	javascript: {
		label: "Javascript",
		icon: "{}",
		description: "Reshape outputs with sandboxed JavaScript.",
		workflowType: "javascript",
		outputs: {
			success: { schema: {
				caption: "string",
				hashtags: "string"
			} },
			error: {}
		},
		config: {
			code: "async function run(inputs) {\n  return inputs;\n}",
			timeout: 5e3,
			memoryLimit: 64
		}
	},
	post: {
		label: "Publish",
		icon: "POST",
		description: "Dry-run or publish through HypeEngine services.",
		workflowType: "publish",
		outputs: {
			success: {},
			error: {}
		},
		config: {
			accounts: [],
			caption: "{{format_output.output.caption}}",
			media: "",
			schedule: "now",
			firstComment: "",
			failureBehavior: "stop"
		}
	},
	condition: {
		label: "Logic",
		icon: "IF",
		description: "Branch execution from one or more comparison rules.",
		workflowType: "logic",
		outputs: {},
		config: { conditions: [{
			id: "condition_1",
			label: "Condition 1",
			dataType: "number",
			operation: "less_than",
			left: "{{write_caption.meta.tokensUsed}}",
			right: "300"
		}] }
	}
};
function N_(e, t = 1, n = {
	x: 120,
	y: 120
}) {
	let r = M_[e], i = F_(e, t);
	return {
		id: P_(),
		name: i,
		type: e,
		label: r.label,
		position: n,
		status: "idle",
		disabled: !1,
		warning: "",
		config: structuredClone(r.config)
	};
}
function P_() {
	return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
		let t = Math.floor(Math.random() * 16);
		return (e === "x" ? t : t & 3 | 8).toString(16);
	});
}
function F_(e, t) {
	let n = {
		input: "input_data",
		http_request: "http_request",
		http_response: "http_response",
		rest_api: "fetch_trends",
		prompt: "write_caption",
		javascript: "format_output",
		post: "publish_post",
		condition: "check_length"
	}[e];
	return t === 1 ? n : `${n}_${t}`;
}
//#endregion
//#region src/utils/workflowSchema.js
var I_ = Object.entries(M_).reduce((e, [t, n]) => (e[n.workflowType || t] = t, e), {});
function L_(e) {
	return e.name || e.label || M_[e.type]?.label || e.id;
}
function R_(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = L_(n);
		t.set(e, (t.get(e) || 0) + 1);
	}
	let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map();
	for (let i of e) {
		let e = L_(i), a = t.get(e) === 1 ? e : i.id;
		n.has(a) && (a = `${e}_${i.id}`), n.add(a), r.set(i.id, a);
	}
	return r;
}
function z_(e) {
	let t = R_(e.nodes);
	return {
		nodes: e.nodes.map((e) => B_(e, t)),
		connections: V_(e.nodes, e.edges, t),
		pinData: {},
		meta: {
			id: e.id,
			name: e.name,
			version: e.version || "1.0.0",
			triggerType: e.trigger || "manual"
		}
	};
}
function B_(e, t = null) {
	let n = M_[e.type] || {};
	return {
		id: e.id,
		name: t?.get(e.id) ?? L_(e),
		type: n.workflowType || e.type,
		typeVersion: H_(e.type),
		position: [e.position?.x ?? 120, e.position?.y ?? 120],
		parameters: W_(e),
		...e.disabled ? { disabled: !0 } : {},
		...e.type === "http_request" ? { webhookId: e.id } : {}
	};
}
function V_(e, t, n = null) {
	let r = new Map(e.map((e) => [e.id, e])), i = {};
	return t.forEach((e) => {
		let t = r.get(e.source), a = r.get(e.target);
		if (!t || !a) return;
		let o = n?.get(t.id) ?? L_(t), s = n?.get(a.id) ?? L_(a), c = U_(t, e.sourceHandle);
		for (i[o] || (i[o] = { main: [] }); i[o].main.length <= c;) i[o].main.push([]);
		i[o].main[c].push({
			node: s,
			type: "main",
			index: 0
		});
	}), i;
}
function H_(e) {
	return {
		input: 1,
		http_request: 1,
		http_response: 1,
		rest_api: 1,
		prompt: 1,
		javascript: 2,
		post: 1,
		condition: 3.2
	}[e] || 1;
}
function U_(e, t = "success") {
	if (e.type !== "condition") return 0;
	let n = (Array.isArray(e.config?.conditions) ? e.config.conditions : []).findIndex((e) => e.id === t);
	if (n >= 0) return n;
	let r = String(t).match(/(\d+)$/)?.[1];
	return r ? Math.max(0, Number(r) - 1) : 0;
}
function W_(e) {
	let t = tv(e.config || {});
	if (e.type === "condition") return { rules: { values: (t.conditions || []).map((e) => ({ conditions: {
		combinator: "and",
		conditions: [{
			leftValue: G_(e.left),
			rightValue: K_(e),
			operator: q_(e)
		}]
	} })) } };
	if (e.type === "javascript") {
		let { code: e, ...n } = t;
		return {
			...n,
			jsCode: e || ""
		};
	}
	return e.type === "post" ? {
		accountUuids: t.accounts || [],
		content: t.caption || "",
		media: t.media ? [t.media] : [],
		schedule: t.schedule || "now",
		firstComment: t.firstComment || "",
		failureBehavior: t.failureBehavior || "stop"
	} : e.type === "input" ? {
		inputType: t.format || "json",
		value: t.value || ""
	} : e.type === "http_request" ? {
		triggerType: "webhook",
		method: t.method || "POST",
		responseFormat: t.responseFormat || "json",
		timeout: t.timeout || 1e4
	} : e.type === "http_response" ? {
		responseCode: t.statusCode || "200",
		responseBody: t.body || ""
	} : t;
}
function G_(e) {
	return typeof e != "string" || e.startsWith("=") || e.includes("{{"), e;
}
function K_(e) {
	if (["number"].includes(e.dataType)) {
		let t = Number(e.right);
		return Number.isNaN(t) ? e.right : t;
	}
	return e.right;
}
function q_(e) {
	return {
		type: e.dataType || "string",
		operation: {
			equals: "equals",
			not_equals: "notEquals",
			greater_than: "gt",
			greater_equal: "gte",
			less_than: "lt",
			less_equal: "lte",
			contains: "contains",
			not_contains: "notContains",
			starts_with: "startsWith",
			ends_with: "endsWith",
			is_empty: "empty",
			is_not_empty: "notEmpty",
			is_true: "true",
			is_false: "false",
			has_key: "hasKey"
		}[e.operation] || e.operation || "equals"
	};
}
function J_(e) {
	let t = Array.isArray(e?.nodes) ? e.nodes.map(Y_) : [], n = e?.connections ? Z_(e.connections, t) : Array.isArray(e?.edges) ? e.edges.map(X_) : [];
	return {
		id: e?.meta?.id || e?.id || "draft-flow",
		name: e?.meta?.name || e?.name || "Untitled Flow",
		trigger: e?.meta?.triggerType || e?.trigger?.type || "manual",
		nodes: t,
		edges: n
	};
}
function Y_(e) {
	let t = I_[e.type] || e.type, n = M_[t] || {}, r = e.name || e.id;
	return {
		id: e.id,
		name: r,
		type: t,
		label: n.label || r,
		position: Array.isArray(e.position) ? {
			x: e.position[0] ?? 120,
			y: e.position[1] ?? 120
		} : e.position || {
			x: 120,
			y: 120
		},
		status: "idle",
		disabled: !!e.disabled,
		warning: "",
		selected: !1,
		config: {
			...tv(n.config || {}),
			...$_(t, e.parameters || e.config || {})
		}
	};
}
function X_(e) {
	let t = e.from || e.source, n = e.to || e.target, r = e.fromOutput || e.sourceHandle || "success";
	return {
		id: e.id || `${t}-${r}-${n}`,
		source: t,
		target: n,
		sourceHandle: r,
		animated: !1
	};
}
function Z_(e, t) {
	let n = new Map(t.flatMap((e) => [
		[e.name, e],
		[e.label, e],
		[e.id, e]
	])), r = [];
	return Object.entries(e || {}).forEach(([e, t]) => {
		let i = n.get(e);
		i && (t.main || []).forEach((e, t) => {
			(e || []).forEach((e, a) => {
				let o = n.get(e.node);
				if (!o) return;
				let s = Q_(i, t);
				r.push({
					id: `${i.id}-${s}-${o.id}-${a}`,
					source: i.id,
					target: o.id,
					sourceHandle: s,
					animated: !1
				});
			});
		});
	}), r;
}
function Q_(e, t) {
	return e.type === "condition" ? e.config?.conditions?.[t]?.id || `condition_${t + 1}` : "success";
}
function $_(e, t) {
	let n = tv(t || {});
	if (e === "condition") return Array.isArray(n.conditions) ? { conditions: n.conditions } : { conditions: (n.rules?.values || []).map((e, t) => {
		let n = e.conditions?.conditions?.[0] || {};
		return {
			id: `condition_${t + 1}`,
			label: `Condition ${t + 1}`,
			dataType: n.operator?.type || "string",
			operation: ev(n.operator?.operation),
			left: n.leftValue ?? "",
			right: n.rightValue ?? ""
		};
	}) };
	if (e === "javascript") {
		let { jsCode: e, ...t } = n;
		return {
			...t,
			code: e || n.code || ""
		};
	}
	return e === "post" ? {
		accounts: n.accountUuids || n.accounts || [],
		caption: n.content || n.caption || "",
		media: Array.isArray(n.media) ? n.media[0] || "" : n.media || "",
		schedule: n.schedule || "now",
		firstComment: n.firstComment || "",
		failureBehavior: n.failureBehavior || "stop"
	} : e === "input" ? {
		format: n.inputType || "json",
		value: n.value || ""
	} : e === "http_request" ? {
		method: n.method || "POST",
		url: n.url || "",
		headers: n.headers || "",
		body: n.body || "",
		query: n.query || {},
		responseFormat: n.responseFormat || "json",
		timeout: n.timeout || 1e4
	} : e === "http_response" ? {
		statusCode: n.responseCode || "200",
		body: n.responseBody || ""
	} : n;
}
function ev(e) {
	return {
		notEquals: "not_equals",
		gt: "greater_than",
		gte: "greater_equal",
		lt: "less_than",
		lte: "less_equal",
		notContains: "not_contains",
		startsWith: "starts_with",
		endsWith: "ends_with",
		empty: "is_empty",
		notEmpty: "is_not_empty",
		true: "is_true",
		false: "is_false",
		hasKey: "has_key"
	}[e] || e || "equals";
}
function tv(e) {
	return e == null ? e : JSON.parse(JSON.stringify(e));
}
//#endregion
//#region src/stores/flow.store.js
var nv = ws("flow", {
	state: () => ({
		id: "draft-flow",
		name: "Daily Social Pulse",
		trigger: "manual",
		scheduleCron: null,
		isActive: !0,
		nodes: [],
		edges: [],
		selectedNodeId: null,
		inspectedNodeId: null,
		zoom: 100
	}),
	getters: {
		selectedNode(e) {
			return e.nodes.find((t) => t.id === e.selectedNodeId) || null;
		},
		inspectedNode(e) {
			return e.nodes.find((t) => t.id === e.inspectedNodeId) || null;
		},
		selectedNodeIds(e) {
			let t = e.nodes.filter((e) => e.selected).map((e) => e.id);
			return !t.length && e.selectedNodeId ? [e.selectedNodeId] : t;
		},
		selectedEdgeIds(e) {
			return e.edges.filter((e) => e.selected).map((e) => e.id);
		},
		flowPayload(e) {
			return z_({
				id: e.id,
				name: e.name,
				version: "1.0.0",
				trigger: e.trigger,
				scheduleCron: e.scheduleCron,
				isActive: e.isActive,
				nodes: e.nodes,
				edges: e.edges
			});
		}
	},
	actions: {
		onNodesChange(e) {
			if (this.nodes = Hm(e, this.nodes), e.some((e) => e.type === "select")) {
				let e = this.nodes.filter((e) => e.selected);
				this.selectedNodeId = e.at(-1)?.id || null;
			}
		},
		onEdgesChange(e) {
			this.edges = Vm(e, this.edges);
		},
		onConnect(e) {
			let t = e.sourceHandle ? `-${e.sourceHandle}` : "";
			this.edges = bm({
				...e,
				id: `${e.source}${t}-${e.target}`,
				animated: !1
			}, this.edges);
		},
		removeSourceHandleEdges(e, t) {
			this.edges = this.edges.filter((n) => n.source !== e || n.sourceHandle !== t);
		},
		loadFromWorkflow(e) {
			let t = e?.definition || e;
			if (!t || typeof t != "object") return !1;
			let n = J_(t);
			return this.id = n.id, this.name = n.name, this.trigger = n.trigger, this.nodes = n.nodes, this.edges = n.edges, this.selectedNodeId = null, this.inspectedNodeId = null, !0;
		},
		selectNode(e) {
			this.selectedNodeId = e;
		},
		inspectNode(e) {
			this.selectedNodeId = e, this.inspectedNodeId = e;
		},
		closeNodeInspector() {
			this.inspectedNodeId = null;
		},
		addNode(e, t = null) {
			let n = this.nodes.filter((t) => t.type === e).length + 1, r = N_(e, n, t || {
				x: 160 + n * 40,
				y: 120 + n * 40
			});
			for (; this.nodes.some((e) => e.id === r.id);) r.id = P_();
			for (; this.nodes.some((e) => e.name === r.name);) r.name = `${r.name}_${Math.floor(Math.random() * 1e3)}`;
			this.nodes.push(r), this.selectedNodeId = r.id;
		},
		duplicateNode(e) {
			let t = this.nodes.find((t) => t.id === e);
			if (!t) return;
			let n = this.nodes.filter((e) => e.type === t.type).length + 1, r = {
				...structuredClone(t),
				id: P_(),
				name: `${t.name || t.id}_${n}`,
				position: {
					x: t.position.x + 40,
					y: t.position.y + 40
				},
				status: "idle",
				warning: ""
			};
			for (; this.nodes.some((e) => e.id === r.id);) r.id = P_();
			for (; this.nodes.some((e) => e.name === r.name);) r.name = `${t.name || t.id}_${Math.floor(Math.random() * 1e3)}`;
			this.nodes.push(r), this.selectedNodeId = r.id;
		},
		deleteNode(e) {
			this.deleteNodes([e]);
		},
		deleteSelectedNodes() {
			return this.deleteNodes(this.selectedNodeIds);
		},
		deleteSelectedElements() {
			let e = this.deleteNodes(this.selectedNodeIds), t = this.deleteEdges(this.selectedEdgeIds);
			return e || t;
		},
		deleteEdges(e) {
			let t = new Set(e.filter(Boolean));
			return t.size ? (this.edges = this.edges.filter((e) => !t.has(e.id)), !0) : !1;
		},
		deleteNodes(e) {
			let t = new Set(e.filter(Boolean));
			return t.size ? (this.nodes = this.nodes.filter((e) => !t.has(e.id)), this.edges = this.edges.filter((e) => !t.has(e.source) && !t.has(e.target)), t.has(this.inspectedNodeId) && (this.inspectedNodeId = null), t.has(this.selectedNodeId) && (this.selectedNodeId = null), !0) : !1;
		},
		toggleNodeDisabled(e) {
			let t = this.nodes.find((t) => t.id === e);
			t && (t.disabled = !t.disabled, t.status = t.disabled ? "skipped" : "idle");
		},
		tidyNodes() {
			let e = rv(this.nodes, this.edges);
			this.nodes = this.nodes.map((t, n) => ({
				...t,
				position: e.get(t.id) || {
					x: 80 + n % 4 * 300,
					y: 90 + Math.floor(n / 4) * 180
				}
			}));
		},
		updateSelectedConfig(e) {
			let t = this.selectedNode;
			t && (t.config = {
				...t.config,
				...e
			});
		},
		renameSelectedNode(e) {
			let t = this.selectedNode, n = String(e || "").trim();
			if (!t || !n || t.name === n) return;
			let r = t.name || t.id;
			t.name = n;
			let i = RegExp(`\\{\\{${iv(r)}\\.`, "g");
			this.nodes.forEach((e) => {
				Object.entries(e.config).forEach(([t, r]) => {
					typeof r == "string" && (e.config[t] = r.replace(i, `{{${n}.`));
				});
			});
		},
		setNodeStatus(e, t, n = "") {
			let r = this.nodes.find((t) => t.id === e);
			r && (r.status = t, r.warning = n);
		}
	}
});
function rv(e, t) {
	let n = new Set(e.map((e) => e.id)), r = new Map(e.map((e, t) => [e.id, t])), i = new Map(e.map((e) => [e.id, []])), a = new Map(e.map((e) => [e.id, []]));
	t.forEach((e) => {
		!n.has(e.source) || !n.has(e.target) || (i.get(e.target).push(e.source), a.get(e.source).push(e.target));
	});
	let o = new Map(e.map((e) => [e.id, i.get(e.id).length])), s = new Map(e.map((e) => [e.id, 0])), c = e.filter((e) => o.get(e.id) === 0).sort(av).map((e) => e.id), l = /* @__PURE__ */ new Set();
	for (; c.length;) {
		let e = c.shift();
		l.add(e), a.get(e).forEach((t) => {
			s.set(t, Math.max(s.get(t), s.get(e) + 1)), o.set(t, o.get(t) - 1), o.get(t) === 0 && (c.push(t), c.sort((e, t) => r.get(e) - r.get(t)));
		});
	}
	e.forEach((e) => {
		if (l.has(e.id)) return;
		let t = i.get(e.id).map((e) => s.get(e) ?? 0);
		s.set(e.id, t.length ? Math.max(...t) + 1 : 0);
	});
	let u = /* @__PURE__ */ new Map();
	e.forEach((e) => {
		let t = s.get(e.id) || 0;
		u.has(t) || u.set(t, []), u.get(t).push(e);
	});
	let d = /* @__PURE__ */ new Map();
	return [...u.entries()].sort(([e], [t]) => e - t).forEach(([t, n]) => {
		n.sort((t, n) => ov(t.id, i, e) - ov(n.id, i, e) || av(t, n));
		let r = (n.length - 1) * 180;
		n.forEach((e, n) => {
			d.set(e.id, {
				x: 80 + t * 310,
				y: 90 + n * 180 - r / 2
			});
		});
	}), d;
}
function iv(e) {
	return String(e).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function av(e, t) {
	return (e.position?.y ?? 0) - (t.position?.y ?? 0) || (e.position?.x ?? 0) - (t.position?.x ?? 0);
}
function ov(e, t, n) {
	let r = t.get(e) || [];
	if (!r.length) return 0;
	let i = new Map(n.map((e) => [e.id, e]));
	return r.reduce((e, t) => e + (i.get(t)?.position?.y ?? 0), 0) / r.length;
}
//#endregion
//#region src/stores/config.store.js
function sv(e) {
	if (typeof document > "u") return "";
	let t = document.querySelector(e)?.value;
	return typeof t == "string" ? t.trim() : "";
}
var cv = ws("config", {
	state: () => ({
		mode: "standalone",
		apiBaseUrl: "/api/flow-builder",
		userId: "",
		flowId: null,
		enabledNodes: [
			"input",
			"http_request",
			"http_response",
			"rest_api",
			"prompt",
			"javascript",
			"post",
			"condition"
		],
		theme: {}
	}),
	actions: { init(e = {}) {
		let t = sv("#x-base-url"), n = sv("#x-flow-uuid"), r = sv("#x-user-uuid");
		this.mode = e.mode || this.mode, this.apiBaseUrl = t || e.apiBaseUrl || this.apiBaseUrl, this.userId = r || e.userId || this.userId, this.flowId = n || e.flowId || this.flowId, this.enabledNodes = e.enabledNodes || this.enabledNodes, this.theme = e.theme || {};
	} }
}), lv = ws("run", {
	state: () => ({
		status: "idle",
		mode: "test",
		context: { trigger: {
			status: "success",
			output: { body: {
				productId: "demo-launch",
				platform: "x"
			} },
			meta: { triggeredAt: (/* @__PURE__ */ new Date()).toISOString() },
			error: null
		} },
		log: []
	}),
	actions: {
		start(e) {
			this.mode = e, this.status = "running", this.context = { trigger: {
				status: "success",
				output: { body: {
					productId: "demo-launch",
					platform: "x"
				} },
				meta: { triggeredAt: (/* @__PURE__ */ new Date()).toISOString() },
				error: null
			} }, this.log = [];
		},
		addLog(e) {
			this.log.unshift({
				at: (/* @__PURE__ */ new Date()).toISOString(),
				...e
			});
		},
		clear() {
			this.status = "idle", this.log = [];
		},
		setNodeOutput(e, t) {
			this.context[e] = t;
		},
		finish(e = "success") {
			this.status = e;
		}
	}
});
//#endregion
//#region node_modules/axios/lib/helpers/bind.js
function uv(e, t) {
	return function() {
		return e.apply(t, arguments);
	};
}
//#endregion
//#region node_modules/axios/lib/utils.js
var { toString: dv } = Object.prototype, { getPrototypeOf: fv } = Object, { iterator: pv, toStringTag: mv } = Symbol, hv = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), gv = (e, t) => {
	let n = e, r = [];
	for (; n != null && n !== Object.prototype;) {
		if (r.indexOf(n) !== -1) return !1;
		if (r.push(n), hv(n, t)) return !0;
		n = fv(n);
	}
	return !1;
}, _v = (e, t) => e != null && gv(e, t) ? e[t] : void 0, vv = ((e) => (t) => {
	let n = dv.call(t);
	return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(Object.create(null)), yv = (e) => (e = e.toLowerCase(), (t) => vv(t) === e), bv = (e) => (t) => typeof t === e, { isArray: xv } = Array, Sv = bv("undefined");
function Cv(e) {
	return e !== null && !Sv(e) && e.constructor !== null && !Sv(e.constructor) && Dv(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
var wv = yv("ArrayBuffer");
function Tv(e) {
	let t;
	return t = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && wv(e.buffer), t;
}
var Ev = bv("string"), Dv = bv("function"), Ov = bv("number"), kv = (e) => typeof e == "object" && !!e, Av = (e) => e === !0 || e === !1, jv = (e) => {
	if (!kv(e)) return !1;
	let t = fv(e);
	return (t === null || t === Object.prototype || fv(t) === null) && !gv(e, mv) && !gv(e, pv);
}, Mv = (e) => {
	if (!kv(e) || Cv(e)) return !1;
	try {
		return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
	} catch {
		return !1;
	}
}, Nv = yv("Date"), Pv = yv("File"), Fv = (e) => !!(e && e.uri !== void 0), Iv = (e) => e && e.getParts !== void 0, Lv = yv("Blob"), Rv = yv("FileList"), zv = (e) => kv(e) && Dv(e.pipe);
function Bv() {
	return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
}
var Vv = Bv(), Hv = Vv.FormData === void 0 ? void 0 : Vv.FormData, Uv = (e) => {
	if (!e) return !1;
	if (Hv && e instanceof Hv) return !0;
	let t = fv(e);
	if (!t || t === Object.prototype || !Dv(e.append)) return !1;
	let n = vv(e);
	return n === "formdata" || n === "object" && Dv(e.toString) && e.toString() === "[object FormData]";
}, Wv = yv("URLSearchParams"), [Gv, Kv, qv, Jv] = [
	"ReadableStream",
	"Request",
	"Response",
	"Headers"
].map(yv), Yv = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Xv(e, t, { allOwnKeys: n = !1 } = {}) {
	if (e == null) return;
	let r, i;
	if (typeof e != "object" && (e = [e]), xv(e)) for (r = 0, i = e.length; r < i; r++) t.call(null, e[r], r, e);
	else {
		if (Cv(e)) return;
		let i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), a = i.length, o;
		for (r = 0; r < a; r++) o = i[r], t.call(null, e[o], o, e);
	}
}
function Zv(e, t) {
	if (Cv(e)) return null;
	t = t.toLowerCase();
	let n = Object.keys(e), r = n.length, i;
	for (; r-- > 0;) if (i = n[r], t === i.toLowerCase()) return i;
	return null;
}
var Qv = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, $v = (e) => !Sv(e) && e !== Qv;
function ey(...e) {
	let { caseless: t, skipUndefined: n } = $v(this) && this || {}, r = {}, i = (e, i) => {
		if (i === "__proto__" || i === "constructor" || i === "prototype") return;
		let a = t && typeof i == "string" && Zv(r, i) || i, o = hv(r, a) ? r[a] : void 0;
		jv(o) && jv(e) ? r[a] = ey(o, e) : jv(e) ? r[a] = ey({}, e) : xv(e) ? r[a] = e.slice() : (!n || !Sv(e)) && (r[a] = e);
	};
	for (let t = 0, n = e.length; t < n; t++) {
		let n = e[t];
		if (!n || Cv(n) || (Xv(n, i), typeof n != "object" || xv(n))) continue;
		let r = Object.getOwnPropertySymbols(n);
		for (let e = 0; e < r.length; e++) {
			let t = r[e];
			fy.call(n, t) && i(n[t], t);
		}
	}
	return r;
}
var ty = (e, t, n, { allOwnKeys: r } = {}) => (Xv(t, (t, r) => {
	n && Dv(t) ? Object.defineProperty(e, r, {
		__proto__: null,
		value: uv(t, n),
		writable: !0,
		enumerable: !0,
		configurable: !0
	}) : Object.defineProperty(e, r, {
		__proto__: null,
		value: t,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}, { allOwnKeys: r }), e), ny = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), ry = (e, t, n, r) => {
	e.prototype = Object.create(t.prototype, r), Object.defineProperty(e.prototype, "constructor", {
		__proto__: null,
		value: e,
		writable: !0,
		enumerable: !1,
		configurable: !0
	}), Object.defineProperty(e, "super", {
		__proto__: null,
		value: t.prototype
	}), n && Object.assign(e.prototype, n);
}, iy = (e, t, n, r) => {
	let i, a, o, s = {};
	if (t ||= {}, e == null) return t;
	do {
		for (i = Object.getOwnPropertyNames(e), a = i.length; a-- > 0;) o = i[a], (!r || r(o, e, t)) && !s[o] && (t[o] = e[o], s[o] = !0);
		e = n !== !1 && fv(e);
	} while (e && (!n || n(e, t)) && e !== Object.prototype);
	return t;
}, ay = (e, t, n) => {
	e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
	let r = e.indexOf(t, n);
	return r !== -1 && r === n;
}, oy = (e) => {
	if (!e) return null;
	if (xv(e)) return e;
	let t = e.length;
	if (!Ov(t)) return null;
	let n = Array(t);
	for (; t-- > 0;) n[t] = e[t];
	return n;
}, sy = ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && fv(Uint8Array)), cy = (e, t) => {
	let n = (e && e[pv]).call(e), r;
	for (; (r = n.next()) && !r.done;) {
		let n = r.value;
		t.call(e, n[0], n[1]);
	}
}, ly = (e, t) => {
	let n, r = [];
	for (; (n = e.exec(t)) !== null;) r.push(n);
	return r;
}, uy = yv("HTMLFormElement"), dy = (e) => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(e, t, n) {
	return t.toUpperCase() + n;
}), { propertyIsEnumerable: fy } = Object.prototype, py = yv("RegExp"), my = (e, t) => {
	let n = Object.getOwnPropertyDescriptors(e), r = {};
	Xv(n, (n, i) => {
		let a;
		(a = t(n, i, e)) !== !1 && (r[i] = a || n);
	}), Object.defineProperties(e, r);
}, hy = (e) => {
	my(e, (t, n) => {
		if (Dv(e) && [
			"arguments",
			"caller",
			"callee"
		].includes(n)) return !1;
		let r = e[n];
		if (Dv(r)) {
			if (t.enumerable = !1, "writable" in t) {
				t.writable = !1;
				return;
			}
			t.set ||= () => {
				throw Error("Can not rewrite read-only method '" + n + "'");
			};
		}
	});
}, gy = (e, t) => {
	let n = {}, r = (e) => {
		e.forEach((e) => {
			n[e] = !0;
		});
	};
	return xv(e) ? r(e) : r(String(e).split(t)), n;
}, _y = () => {}, vy = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function yy(e) {
	return !!(e && Dv(e.append) && e[mv] === "FormData" && e[pv]);
}
var by = (e) => {
	let t = /* @__PURE__ */ new WeakSet(), n = (e) => {
		if (kv(e)) {
			if (t.has(e)) return;
			if (Cv(e)) return e;
			if (!("toJSON" in e)) {
				t.add(e);
				let r = xv(e) ? [] : {};
				return Xv(e, (e, t) => {
					let i = n(e);
					!Sv(i) && (r[t] = i);
				}), t.delete(e), r;
			}
		}
		return e;
	};
	return n(e);
}, xy = yv("AsyncFunction"), Sy = (e) => e && (kv(e) || Dv(e)) && Dv(e.then) && Dv(e.catch), Cy = ((e, t) => e ? setImmediate : t ? ((e, t) => (Qv.addEventListener("message", ({ source: n, data: r }) => {
	n === Qv && r === e && t.length && t.shift()();
}, !1), (n) => {
	t.push(n), Qv.postMessage(e, "*");
}))(`axios@${Math.random()}`, []) : (e) => setTimeout(e))(typeof setImmediate == "function", Dv(Qv.postMessage)), wy = typeof queueMicrotask < "u" ? queueMicrotask.bind(Qv) : typeof process < "u" && process.nextTick || Cy, Ty = (e) => e != null && Dv(e[pv]), Q = {
	isArray: xv,
	isArrayBuffer: wv,
	isBuffer: Cv,
	isFormData: Uv,
	isArrayBufferView: Tv,
	isString: Ev,
	isNumber: Ov,
	isBoolean: Av,
	isObject: kv,
	isPlainObject: jv,
	isEmptyObject: Mv,
	isReadableStream: Gv,
	isRequest: Kv,
	isResponse: qv,
	isHeaders: Jv,
	isUndefined: Sv,
	isDate: Nv,
	isFile: Pv,
	isReactNativeBlob: Fv,
	isReactNative: Iv,
	isBlob: Lv,
	isRegExp: py,
	isFunction: Dv,
	isStream: zv,
	isURLSearchParams: Wv,
	isTypedArray: sy,
	isFileList: Rv,
	forEach: Xv,
	merge: ey,
	extend: ty,
	trim: Yv,
	stripBOM: ny,
	inherits: ry,
	toFlatObject: iy,
	kindOf: vv,
	kindOfTest: yv,
	endsWith: ay,
	toArray: oy,
	forEachEntry: cy,
	matchAll: ly,
	isHTMLForm: uy,
	hasOwnProperty: hv,
	hasOwnProp: hv,
	hasOwnInPrototypeChain: gv,
	getSafeProp: _v,
	reduceDescriptors: my,
	freezeMethods: hy,
	toObjectSet: gy,
	toCamelCase: dy,
	noop: _y,
	toFiniteNumber: vy,
	findKey: Zv,
	global: Qv,
	isContextDefined: $v,
	isSpecCompliantForm: yy,
	toJSONObject: by,
	isAsyncFn: xy,
	isThenable: Sy,
	setImmediate: Cy,
	asap: wy,
	isIterable: Ty,
	isSafeIterable: (e) => e != null && gv(e, pv) && Ty(e)
}, Ey = Q.toObjectSet([
	"age",
	"authorization",
	"content-length",
	"content-type",
	"etag",
	"expires",
	"from",
	"host",
	"if-modified-since",
	"if-unmodified-since",
	"last-modified",
	"location",
	"max-forwards",
	"proxy-authorization",
	"referer",
	"retry-after",
	"user-agent"
]), Dy = (e) => {
	let t = {}, n, r, i;
	return e && e.split("\n").forEach(function(e) {
		i = e.indexOf(":"), n = e.substring(0, i).trim().toLowerCase(), r = e.substring(i + 1).trim(), !(!n || t[n] && Ey[n]) && (n === "set-cookie" ? t[n] ? t[n].push(r) : t[n] = [r] : t[n] = t[n] ? t[n] + ", " + r : r);
	}), t;
};
//#endregion
//#region node_modules/axios/lib/helpers/sanitizeHeaderValue.js
function Oy(e) {
	let t = 0, n = e.length;
	for (; t < n;) {
		let n = e.charCodeAt(t);
		if (n !== 9 && n !== 32) break;
		t += 1;
	}
	for (; n > t;) {
		let t = e.charCodeAt(n - 1);
		if (t !== 9 && t !== 32) break;
		--n;
	}
	return t === 0 && n === e.length ? e : e.slice(t, n);
}
var ky = /* @__PURE__ */ RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g"), Ay = /* @__PURE__ */ RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
function jy(e, t) {
	return Q.isArray(e) ? e.map((e) => jy(e, t)) : Oy(String(e).replace(t, ""));
}
var My = (e) => jy(e, ky), Ny = (e) => jy(e, Ay);
function Py(e) {
	let t = Object.create(null);
	return Q.forEach(e.toJSON(), (e, n) => {
		t[n] = Ny(e);
	}), t;
}
//#endregion
//#region node_modules/axios/lib/core/AxiosHeaders.js
var Fy = Symbol("internals");
function Iy(e) {
	return e && String(e).trim().toLowerCase();
}
function Ly(e) {
	return e === !1 || e == null ? e : Q.isArray(e) ? e.map(Ly) : My(String(e));
}
function Ry(e) {
	let t = Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g, r;
	for (; r = n.exec(e);) t[r[1]] = r[2];
	return t;
}
var zy = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function By(e, t, n, r, i) {
	if (Q.isFunction(r)) return r.call(this, t, n);
	if (i && (t = n), Q.isString(t)) {
		if (Q.isString(r)) return t.indexOf(r) !== -1;
		if (Q.isRegExp(r)) return r.test(t);
	}
}
function Vy(e) {
	return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, n) => t.toUpperCase() + n);
}
function Hy(e, t) {
	let n = Q.toCamelCase(" " + t);
	[
		"get",
		"set",
		"has"
	].forEach((r) => {
		Object.defineProperty(e, r + n, {
			__proto__: null,
			value: function(e, n, i) {
				return this[r].call(this, t, e, n, i);
			},
			configurable: !0
		});
	});
}
var Uy = class {
	constructor(e) {
		e && this.set(e);
	}
	set(e, t, n) {
		let r = this;
		function i(e, t, n) {
			let i = Iy(t);
			if (!i) return;
			let a = Q.findKey(r, i);
			(!a || r[a] === void 0 || n === !0 || n === void 0 && r[a] !== !1) && (r[a || t] = Ly(e));
		}
		let a = (e, t) => Q.forEach(e, (e, n) => i(e, n, t));
		if (Q.isPlainObject(e) || e instanceof this.constructor) a(e, t);
		else if (Q.isString(e) && (e = e.trim()) && !zy(e)) a(Dy(e), t);
		else if (Q.isObject(e) && Q.isSafeIterable(e)) {
			let n = Object.create(null), r, i;
			for (let t of e) {
				if (!Q.isArray(t)) throw TypeError("Object iterator must return a key-value pair");
				i = t[0], Q.hasOwnProp(n, i) ? (r = n[i], n[i] = Q.isArray(r) ? [...r, t[1]] : [r, t[1]]) : n[i] = t[1];
			}
			a(n, t);
		} else e != null && i(t, e, n);
		return this;
	}
	get(e, t) {
		if (e = Iy(e), e) {
			let n = Q.findKey(this, e);
			if (n) {
				let e = this[n];
				if (!t) return e;
				if (t === !0) return Ry(e);
				if (Q.isFunction(t)) return t.call(this, e, n);
				if (Q.isRegExp(t)) return t.exec(e);
				throw TypeError("parser must be boolean|regexp|function");
			}
		}
	}
	has(e, t) {
		if (e = Iy(e), e) {
			let n = Q.findKey(this, e);
			return !!(n && this[n] !== void 0 && (!t || By(this, this[n], n, t)));
		}
		return !1;
	}
	delete(e, t) {
		let n = this, r = !1;
		function i(e) {
			if (e = Iy(e), e) {
				let i = Q.findKey(n, e);
				i && (!t || By(n, n[i], i, t)) && (delete n[i], r = !0);
			}
		}
		return Q.isArray(e) ? e.forEach(i) : i(e), r;
	}
	clear(e) {
		let t = Object.keys(this), n = t.length, r = !1;
		for (; n--;) {
			let i = t[n];
			(!e || By(this, this[i], i, e, !0)) && (delete this[i], r = !0);
		}
		return r;
	}
	normalize(e) {
		let t = this, n = {};
		return Q.forEach(this, (r, i) => {
			let a = Q.findKey(n, i);
			if (a) {
				t[a] = Ly(r), delete t[i];
				return;
			}
			let o = e ? Vy(i) : String(i).trim();
			o !== i && delete t[i], t[o] = Ly(r), n[o] = !0;
		}), this;
	}
	concat(...e) {
		return this.constructor.concat(this, ...e);
	}
	toJSON(e) {
		let t = Object.create(null);
		return Q.forEach(this, (n, r) => {
			n != null && n !== !1 && (t[r] = e && Q.isArray(n) ? n.join(", ") : n);
		}), t;
	}
	[Symbol.iterator]() {
		return Object.entries(this.toJSON())[Symbol.iterator]();
	}
	toString() {
		return Object.entries(this.toJSON()).map(([e, t]) => e + ": " + t).join("\n");
	}
	getSetCookie() {
		return this.get("set-cookie") || [];
	}
	get [Symbol.toStringTag]() {
		return "AxiosHeaders";
	}
	static from(e) {
		return e instanceof this ? e : new this(e);
	}
	static concat(e, ...t) {
		let n = new this(e);
		return t.forEach((e) => n.set(e)), n;
	}
	static accessor(e) {
		let t = (this[Fy] = this[Fy] = { accessors: {} }).accessors, n = this.prototype;
		function r(e) {
			let r = Iy(e);
			t[r] || (Hy(n, e), t[r] = !0);
		}
		return Q.isArray(e) ? e.forEach(r) : r(e), this;
	}
};
Uy.accessor([
	"Content-Type",
	"Content-Length",
	"Accept",
	"Accept-Encoding",
	"User-Agent",
	"Authorization"
]), Q.reduceDescriptors(Uy.prototype, ({ value: e }, t) => {
	let n = t[0].toUpperCase() + t.slice(1);
	return {
		get: () => e,
		set(e) {
			this[n] = e;
		}
	};
}), Q.freezeMethods(Uy);
//#endregion
//#region node_modules/axios/lib/core/AxiosError.js
var Wy = "[REDACTED ****]";
function Gy(e) {
	if (Q.hasOwnProp(e, "toJSON")) return !0;
	let t = Object.getPrototypeOf(e);
	for (; t && t !== Object.prototype;) {
		if (Q.hasOwnProp(t, "toJSON")) return !0;
		t = Object.getPrototypeOf(t);
	}
	return !1;
}
function Ky(e, t) {
	let n = new Set(t.map((e) => String(e).toLowerCase())), r = [], i = (e) => {
		if (typeof e != "object" || !e || Q.isBuffer(e)) return e;
		if (r.indexOf(e) !== -1) return;
		e instanceof Uy && (e = e.toJSON()), r.push(e);
		let t;
		if (Q.isArray(e)) t = [], e.forEach((e, n) => {
			let r = i(e);
			Q.isUndefined(r) || (t[n] = r);
		});
		else {
			if (!Q.isPlainObject(e) && Gy(e)) return r.pop(), e;
			t = Object.create(null);
			for (let [r, a] of Object.entries(e)) {
				let e = n.has(r.toLowerCase()) ? Wy : i(a);
				Q.isUndefined(e) || (t[r] = e);
			}
		}
		return r.pop(), t;
	};
	return i(e);
}
var $ = class e extends Error {
	static from(t, n, r, i, a, o) {
		let s = new e(t.message, n || t.code, r, i, a);
		return Object.defineProperty(s, "cause", {
			__proto__: null,
			value: t,
			writable: !0,
			enumerable: !1,
			configurable: !0
		}), s.name = t.name, t.status != null && s.status == null && (s.status = t.status), o && Object.assign(s, o), s;
	}
	constructor(e, t, n, r, i) {
		super(e), Object.defineProperty(this, "message", {
			__proto__: null,
			value: e,
			enumerable: !0,
			writable: !0,
			configurable: !0
		}), this.name = "AxiosError", this.isAxiosError = !0, t && (this.code = t), n && (this.config = n), r && (this.request = r), i && (this.response = i, this.status = i.status);
	}
	toJSON() {
		let e = this.config, t = e && Q.hasOwnProp(e, "redact") ? e.redact : void 0, n = Q.isArray(t) && t.length > 0 ? Ky(e, t) : Q.toJSONObject(e);
		return {
			message: this.message,
			name: this.name,
			description: this.description,
			number: this.number,
			fileName: this.fileName,
			lineNumber: this.lineNumber,
			columnNumber: this.columnNumber,
			stack: this.stack,
			config: n,
			code: this.code,
			status: this.status
		};
	}
};
$.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE", $.ERR_BAD_OPTION = "ERR_BAD_OPTION", $.ECONNABORTED = "ECONNABORTED", $.ETIMEDOUT = "ETIMEDOUT", $.ECONNREFUSED = "ECONNREFUSED", $.ERR_NETWORK = "ERR_NETWORK", $.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS", $.ERR_DEPRECATED = "ERR_DEPRECATED", $.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE", $.ERR_BAD_REQUEST = "ERR_BAD_REQUEST", $.ERR_CANCELED = "ERR_CANCELED", $.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT", $.ERR_INVALID_URL = "ERR_INVALID_URL", $.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
function qy(e) {
	return Q.isPlainObject(e) || Q.isArray(e);
}
function Jy(e) {
	return Q.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Yy(e, t, n) {
	return e ? e.concat(t).map(function(e, t) {
		return e = Jy(e), !n && t ? "[" + e + "]" : e;
	}).join(n ? "." : "") : t;
}
function Xy(e) {
	return Q.isArray(e) && !e.some(qy);
}
var Zy = Q.toFlatObject(Q, {}, null, function(e) {
	return /^is[A-Z]/.test(e);
});
function Qy(e, t, n) {
	if (!Q.isObject(e)) throw TypeError("target must be an object");
	t ||= new FormData(), n = Q.toFlatObject(n, {
		metaTokens: !0,
		dots: !1,
		indexes: !1
	}, !1, function(e, t) {
		return !Q.isUndefined(t[e]);
	});
	let r = n.metaTokens, i = n.visitor || m, a = n.dots, o = n.indexes, s = n.Blob || typeof Blob < "u" && Blob, c = n.maxDepth === void 0 ? 100 : n.maxDepth, l = s && Q.isSpecCompliantForm(t), u = [];
	if (!Q.isFunction(i)) throw TypeError("visitor must be a function");
	function d(e) {
		if (e === null) return "";
		if (Q.isDate(e)) return e.toISOString();
		if (Q.isBoolean(e)) return e.toString();
		if (!l && Q.isBlob(e)) throw new $("Blob is not supported. Use a Buffer instead.");
		if (Q.isArrayBuffer(e) || Q.isTypedArray(e)) {
			if (l && typeof s == "function") return new s([e]);
			if (typeof Buffer < "u") return Buffer.from(e);
			throw new $("Blob is not supported. Use a Buffer instead.", $.ERR_NOT_SUPPORT);
		}
		return e;
	}
	function f(e) {
		if (e > c) throw new $("Object is too deeply nested (" + e + " levels). Max depth: " + c, $.ERR_FORM_DATA_DEPTH_EXCEEDED);
	}
	function p(e, t) {
		if (c === Infinity) return JSON.stringify(e);
		let n = [];
		return JSON.stringify(e, function(e, r) {
			if (!Q.isObject(r)) return r;
			for (; n.length && n[n.length - 1] !== this;) n.pop();
			return n.push(r), f(t + n.length - 1), r;
		});
	}
	function m(e, n, i) {
		let s = e;
		if (Q.isReactNative(t) && Q.isReactNativeBlob(e)) return t.append(Yy(i, n, a), d(e)), !1;
		if (e && !i && typeof e == "object") {
			if (Q.endsWith(n, "{}")) n = r ? n : n.slice(0, -2), e = p(e, 1);
			else if (Q.isArray(e) && Xy(e) || (Q.isFileList(e) || Q.endsWith(n, "[]")) && (s = Q.toArray(e))) return n = Jy(n), s.forEach(function(e, r) {
				!(Q.isUndefined(e) || e === null) && t.append(o === !0 ? Yy([n], r, a) : o === null ? n : n + "[]", d(e));
			}), !1;
		}
		return qy(e) ? !0 : (t.append(Yy(i, n, a), d(e)), !1);
	}
	let h = Object.assign(Zy, {
		defaultVisitor: m,
		convertValue: d,
		isVisitable: qy
	});
	function g(e, n, r = 0) {
		if (!Q.isUndefined(e)) {
			if (f(r), u.indexOf(e) !== -1) throw Error("Circular reference detected in " + n.join("."));
			u.push(e), Q.forEach(e, function(e, a) {
				(!(Q.isUndefined(e) || e === null) && i.call(t, e, Q.isString(a) ? a.trim() : a, n, h)) === !0 && g(e, n ? n.concat(a) : [a], r + 1);
			}), u.pop();
		}
	}
	if (!Q.isObject(e)) throw TypeError("data must be an object");
	return g(e), t;
}
//#endregion
//#region node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function $y(e) {
	let t = {
		"!": "%21",
		"'": "%27",
		"(": "%28",
		")": "%29",
		"~": "%7E",
		"%20": "+"
	};
	return encodeURIComponent(e).replace(/[!'()~]|%20/g, function(e) {
		return t[e];
	});
}
function eb(e, t) {
	this._pairs = [], e && Qy(e, this, t);
}
var tb = eb.prototype;
tb.append = function(e, t) {
	this._pairs.push([e, t]);
}, tb.toString = function(e) {
	let t = e ? (t) => e.call(this, t, $y) : $y;
	return this._pairs.map(function(e) {
		return t(e[0]) + "=" + t(e[1]);
	}, "").join("&");
};
//#endregion
//#region node_modules/axios/lib/helpers/buildURL.js
function nb(e) {
	return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function rb(e, t, n) {
	if (!t) return e;
	e ||= "";
	let r = Q.isFunction(n) ? { serialize: n } : n, i = Q.getSafeProp(r, "encode") || nb, a = Q.getSafeProp(r, "serialize"), o;
	if (o = a ? a(t, r) : Q.isURLSearchParams(t) ? t.toString() : new eb(t, r).toString(i), o) {
		let t = e.indexOf("#");
		t !== -1 && (e = e.slice(0, t)), e += (e.indexOf("?") === -1 ? "?" : "&") + o;
	}
	return e;
}
//#endregion
//#region node_modules/axios/lib/core/InterceptorManager.js
var ib = class {
	constructor() {
		this.handlers = [];
	}
	use(e, t, n) {
		return this.handlers.push({
			fulfilled: e,
			rejected: t,
			synchronous: n ? n.synchronous : !1,
			runWhen: n ? n.runWhen : null
		}), this.handlers.length - 1;
	}
	eject(e) {
		this.handlers[e] && (this.handlers[e] = null);
	}
	clear() {
		this.handlers &&= [];
	}
	forEach(e) {
		Q.forEach(this.handlers, function(t) {
			t !== null && e(t);
		});
	}
}, ab = {
	silentJSONParsing: !0,
	forcedJSONParsing: !0,
	clarifyTimeoutError: !1,
	legacyInterceptorReqResOrdering: !0,
	advertiseZstdAcceptEncoding: !1,
	validateStatusUndefinedResolves: !0
}, ob = {
	isBrowser: !0,
	classes: {
		URLSearchParams: typeof URLSearchParams < "u" ? URLSearchParams : eb,
		FormData: typeof FormData < "u" ? FormData : null,
		Blob: typeof Blob < "u" ? Blob : null
	},
	protocols: [
		"http",
		"https",
		"file",
		"blob",
		"url",
		"data"
	]
}, sb = /* @__PURE__ */ t({
	hasBrowserEnv: () => cb,
	hasStandardBrowserEnv: () => ub,
	hasStandardBrowserWebWorkerEnv: () => db,
	navigator: () => lb,
	origin: () => fb
}), cb = typeof window < "u" && typeof document < "u", lb = typeof navigator == "object" && navigator || void 0, ub = cb && (!lb || [
	"ReactNative",
	"NativeScript",
	"NS"
].indexOf(lb.product) < 0), db = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && typeof self.importScripts == "function", fb = cb && window.location.href || "http://localhost", pb = {
	...sb,
	...ob
};
//#endregion
//#region node_modules/axios/lib/helpers/toURLEncodedForm.js
function mb(e, t) {
	return Qy(e, new pb.classes.URLSearchParams(), {
		visitor: function(e, t, n, r) {
			return pb.isNode && Q.isBuffer(e) ? (this.append(t, e.toString("base64")), !1) : r.defaultVisitor.apply(this, arguments);
		},
		...t
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/formDataToJSON.js
var hb = 100;
function gb(e) {
	if (e > hb) throw new $("FormData field is too deeply nested (" + e + " levels). Max depth: " + hb, $.ERR_FORM_DATA_DEPTH_EXCEEDED);
}
function _b(e) {
	let t = [], n = /\w+|\[(\w*)]/g, r;
	for (; (r = n.exec(e)) !== null;) gb(t.length), t.push(r[0] === "[]" ? "" : r[1] || r[0]);
	return t;
}
function vb(e) {
	let t = {}, n = Object.keys(e), r, i = n.length, a;
	for (r = 0; r < i; r++) a = n[r], t[a] = e[a];
	return t;
}
function yb(e) {
	function t(e, n, r, i) {
		gb(i);
		let a = e[i++];
		if (a === "__proto__") return !0;
		let o = Number.isFinite(+a), s = i >= e.length;
		return a = !a && Q.isArray(r) ? r.length : a, s ? (Q.hasOwnProp(r, a) ? r[a] = Q.isArray(r[a]) ? r[a].concat(n) : [r[a], n] : r[a] = n, !o) : ((!Q.hasOwnProp(r, a) || !Q.isObject(r[a])) && (r[a] = []), t(e, n, r[a], i) && Q.isArray(r[a]) && (r[a] = vb(r[a])), !o);
	}
	if (Q.isFormData(e) && Q.isFunction(e.entries)) {
		let n = {};
		return Q.forEachEntry(e, (e, r) => {
			t(_b(e), r, n, 0);
		}), n;
	}
	return null;
}
//#endregion
//#region node_modules/axios/lib/defaults/index.js
var bb = (e, t) => e != null && Q.hasOwnProp(e, t) ? e[t] : void 0;
function xb(e, t, n) {
	if (Q.isString(e)) try {
		return (t || JSON.parse)(e), Q.trim(e);
	} catch (e) {
		if (e.name !== "SyntaxError") throw e;
	}
	return (n || JSON.stringify)(e);
}
var Sb = {
	transitional: ab,
	adapter: [
		"xhr",
		"http",
		"fetch"
	],
	transformRequest: [function(e, t) {
		let n = t.getContentType() || "", r = n.indexOf("application/json") > -1, i = Q.isObject(e);
		if (i && Q.isHTMLForm(e) && (e = new FormData(e)), Q.isFormData(e)) return r ? JSON.stringify(yb(e)) : e;
		if (Q.isArrayBuffer(e) || Q.isBuffer(e) || Q.isStream(e) || Q.isFile(e) || Q.isBlob(e) || Q.isReadableStream(e)) return e;
		if (Q.isArrayBufferView(e)) return e.buffer;
		if (Q.isURLSearchParams(e)) return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
		let a;
		if (i) {
			let t = bb(this, "formSerializer");
			if (n.indexOf("application/x-www-form-urlencoded") > -1) return mb(e, t).toString();
			if ((a = Q.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
				let n = bb(this, "env"), r = n && n.FormData;
				return Qy(a ? { "files[]": e } : e, r && new r(), t);
			}
		}
		return i || r ? (t.setContentType("application/json", !1), xb(e)) : e;
	}],
	transformResponse: [function(e) {
		let t = bb(this, "transitional") || Sb.transitional, n = t && t.forcedJSONParsing, r = bb(this, "responseType"), i = r === "json";
		if (Q.isResponse(e) || Q.isReadableStream(e)) return e;
		if (e && Q.isString(e) && (n && !r || i)) {
			let n = !(t && t.silentJSONParsing) && i;
			try {
				return JSON.parse(e, bb(this, "parseReviver"));
			} catch (e) {
				if (n) throw e.name === "SyntaxError" ? $.from(e, $.ERR_BAD_RESPONSE, this, null, bb(this, "response")) : e;
			}
		}
		return e;
	}],
	timeout: 0,
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN",
	maxContentLength: -1,
	maxBodyLength: -1,
	env: {
		FormData: pb.classes.FormData,
		Blob: pb.classes.Blob
	},
	validateStatus: function(e) {
		return e >= 200 && e < 300;
	},
	headers: { common: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": void 0
	} }
};
Q.forEach([
	"delete",
	"get",
	"head",
	"post",
	"put",
	"patch",
	"query"
], (e) => {
	Sb.headers[e] = {};
});
//#endregion
//#region node_modules/axios/lib/core/transformData.js
function Cb(e, t) {
	let n = this || Sb, r = t || n, i = Uy.from(r.headers), a = r.data;
	return Q.forEach(e, function(e) {
		a = e.call(n, a, i.normalize(), t ? t.status : void 0);
	}), i.normalize(), a;
}
//#endregion
//#region node_modules/axios/lib/cancel/isCancel.js
function wb(e) {
	return !!(e && e.__CANCEL__);
}
//#endregion
//#region node_modules/axios/lib/cancel/CanceledError.js
var Tb = class extends $ {
	constructor(e, t, n) {
		super(e ?? "canceled", $.ERR_CANCELED, t, n), this.name = "CanceledError", this.__CANCEL__ = !0;
	}
};
//#endregion
//#region node_modules/axios/lib/core/settle.js
function Eb(e, t, n) {
	let r = n.config.validateStatus;
	!n.status || !r || r(n.status) ? e(n) : t(new $("Request failed with status code " + n.status, n.status >= 400 && n.status < 500 ? $.ERR_BAD_REQUEST : $.ERR_BAD_RESPONSE, n.config, n.request, n));
}
//#endregion
//#region node_modules/axios/lib/helpers/parseProtocol.js
function Db(e) {
	let t = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e);
	return t && t[1] || "";
}
//#endregion
//#region node_modules/axios/lib/helpers/speedometer.js
function Ob(e, t) {
	e ||= 10;
	let n = Array(e), r = Array(e), i = 0, a = 0, o;
	return t = t === void 0 ? 1e3 : t, function(s) {
		let c = Date.now(), l = r[a];
		o ||= c, n[i] = s, r[i] = c;
		let u = a, d = 0;
		for (; u !== i;) d += n[u++], u %= e;
		if (i = (i + 1) % e, i === a && (a = (a + 1) % e), c - o < t) return;
		let f = l && c - l;
		return f ? Math.round(d * 1e3 / f) : void 0;
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/throttle.js
function kb(e, t) {
	let n = 0, r = 1e3 / t, i, a, o = (t, r = Date.now()) => {
		n = r, i = null, a &&= (clearTimeout(a), null), e(...t);
	};
	return [(...e) => {
		let t = Date.now(), s = t - n;
		s >= r ? o(e, t) : (i = e, a ||= setTimeout(() => {
			a = null, o(i);
		}, r - s));
	}, () => i && o(i)];
}
//#endregion
//#region node_modules/axios/lib/helpers/progressEventReducer.js
var Ab = (e, t, n = 3) => {
	let r = 0, i = Ob(50, 250);
	return kb((n) => {
		if (!n || typeof n.loaded != "number") return;
		let a = n.loaded, o = n.lengthComputable ? n.total : void 0, s = o == null ? a : Math.min(a, o), c = Math.max(0, s - r), l = i(c);
		r = Math.max(r, s), e({
			loaded: s,
			total: o,
			progress: o ? s / o : void 0,
			bytes: c,
			rate: l || void 0,
			estimated: l && o ? (o - s) / l : void 0,
			event: n,
			lengthComputable: o != null,
			[t ? "download" : "upload"]: !0
		});
	}, n);
}, jb = (e, t) => {
	let n = e != null;
	return [(r) => t[0]({
		lengthComputable: n,
		total: e,
		loaded: r
	}), t[1]];
}, Mb = (e) => (...t) => Q.asap(() => e(...t)), Nb = pb.hasStandardBrowserEnv ? ((e, t) => (n) => (n = new URL(n, pb.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(new URL(pb.origin), pb.navigator && /(msie|trident)/i.test(pb.navigator.userAgent)) : () => !0, Pb = pb.hasStandardBrowserEnv ? {
	write(e, t, n, r, i, a, o) {
		if (typeof document > "u") return;
		let s = [`${e}=${encodeURIComponent(t)}`];
		Q.isNumber(n) && s.push(`expires=${new Date(n).toUTCString()}`), Q.isString(r) && s.push(`path=${r}`), Q.isString(i) && s.push(`domain=${i}`), a === !0 && s.push("secure"), Q.isString(o) && s.push(`SameSite=${o}`), document.cookie = s.join("; ");
	},
	read(e) {
		if (typeof document > "u") return null;
		let t = document.cookie.split(";");
		for (let n = 0; n < t.length; n++) {
			let r = t[n].replace(/^\s+/, ""), i = r.indexOf("=");
			if (i !== -1 && r.slice(0, i) === e) try {
				return decodeURIComponent(r.slice(i + 1));
			} catch {
				return r.slice(i + 1);
			}
		}
		return null;
	},
	remove(e) {
		this.write(e, "", Date.now() - 864e5, "/");
	}
} : {
	write() {},
	read() {
		return null;
	},
	remove() {}
};
//#endregion
//#region node_modules/axios/lib/helpers/isAbsoluteURL.js
function Fb(e) {
	return typeof e == "string" && /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
//#endregion
//#region node_modules/axios/lib/helpers/combineURLs.js
function Ib(e, t) {
	return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
//#endregion
//#region node_modules/axios/lib/core/buildFullPath.js
var Lb = /^https?:(?!\/\/)/i, Rb = /[\t\n\r]/g;
function zb(e) {
	let t = 0;
	for (; t < e.length && e.charCodeAt(t) <= 32;) t++;
	return e.slice(t);
}
function Bb(e) {
	return zb(e).replace(Rb, "");
}
function Vb(e, t) {
	if (typeof e == "string" && Lb.test(Bb(e))) throw new $("Invalid URL: missing \"//\" after protocol", $.ERR_INVALID_URL, t);
}
function Hb(e, t, n, r) {
	Vb(t, r);
	let i = !Fb(t);
	return e && (i || n === !1) ? (Vb(e, r), Ib(e, t)) : t;
}
//#endregion
//#region node_modules/axios/lib/core/mergeConfig.js
var Ub = (e) => e instanceof Uy ? { ...e } : e;
function Wb(e, t) {
	e ||= {}, t ||= {};
	let n = Object.create(null);
	Object.defineProperty(n, "hasOwnProperty", {
		__proto__: null,
		value: Object.prototype.hasOwnProperty,
		enumerable: !1,
		writable: !0,
		configurable: !0
	});
	function r(e, t, n, r) {
		return Q.isPlainObject(e) && Q.isPlainObject(t) ? Q.merge.call({ caseless: r }, e, t) : Q.isPlainObject(t) ? Q.merge({}, t) : Q.isArray(t) ? t.slice() : t;
	}
	function i(e, t, n, i) {
		if (!Q.isUndefined(t)) return r(e, t, n, i);
		if (!Q.isUndefined(e)) return r(void 0, e, n, i);
	}
	function a(e, t) {
		if (!Q.isUndefined(t)) return r(void 0, t);
	}
	function o(e, t) {
		if (!Q.isUndefined(t)) return r(void 0, t);
		if (!Q.isUndefined(e)) return r(void 0, e);
	}
	function s(n) {
		let r = Q.hasOwnProp(t, "transitional") ? t.transitional : void 0;
		if (!Q.isUndefined(r)) if (Q.isPlainObject(r)) {
			if (Q.hasOwnProp(r, n)) return r[n];
		} else return;
		let i = Q.hasOwnProp(e, "transitional") ? e.transitional : void 0;
		if (Q.isPlainObject(i) && Q.hasOwnProp(i, n)) return i[n];
	}
	function c(n, i, a) {
		if (Q.hasOwnProp(t, a)) return r(n, i);
		if (Q.hasOwnProp(e, a)) return r(void 0, n);
	}
	let l = {
		url: a,
		method: a,
		data: a,
		baseURL: o,
		transformRequest: o,
		transformResponse: o,
		paramsSerializer: o,
		timeout: o,
		timeoutMessage: o,
		withCredentials: o,
		withXSRFToken: o,
		adapter: o,
		responseType: o,
		xsrfCookieName: o,
		xsrfHeaderName: o,
		onUploadProgress: o,
		onDownloadProgress: o,
		decompress: o,
		maxContentLength: o,
		maxBodyLength: o,
		beforeRedirect: o,
		transport: o,
		httpAgent: o,
		httpsAgent: o,
		cancelToken: o,
		socketPath: o,
		allowedSocketPaths: o,
		responseEncoding: o,
		validateStatus: c,
		headers: (e, t, n) => i(Ub(e), Ub(t), n, !0)
	};
	return Q.forEach(Object.keys({
		...e,
		...t
	}), function(r) {
		if (r === "__proto__" || r === "constructor" || r === "prototype") return;
		let a = Q.hasOwnProp(l, r) ? l[r] : i, o = a(Q.hasOwnProp(e, r) ? e[r] : void 0, Q.hasOwnProp(t, r) ? t[r] : void 0, r);
		Q.isUndefined(o) && a !== c || (n[r] = o);
	}), Q.hasOwnProp(t, "validateStatus") && Q.isUndefined(t.validateStatus) && s("validateStatusUndefinedResolves") === !1 && (Q.hasOwnProp(e, "validateStatus") ? n.validateStatus = r(void 0, e.validateStatus) : delete n.validateStatus), n;
}
//#endregion
//#region node_modules/axios/lib/helpers/resolveConfig.js
var Gb = ["content-type", "content-length"];
function Kb(e, t, n) {
	if (n !== "content-only") {
		e.set(t);
		return;
	}
	Object.entries(t || {}).forEach(([t, n]) => {
		Gb.includes(t.toLowerCase()) && e.set(t, n);
	});
}
var qb = (e) => encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi, (e, t) => String.fromCharCode(parseInt(t, 16)));
function Jb(e) {
	let t = Wb({}, e), n = (e) => Q.hasOwnProp(t, e) ? t[e] : void 0, r = n("data"), i = n("withXSRFToken"), a = n("xsrfHeaderName"), o = n("xsrfCookieName"), s = n("headers"), c = n("auth"), l = n("baseURL"), u = n("allowAbsoluteUrls"), d = n("url");
	if (t.headers = s = Uy.from(s), t.url = rb(Hb(l, d, u, t), n("params"), n("paramsSerializer")), c) {
		let t = Q.getSafeProp(c, "username") || "", n = Q.getSafeProp(c, "password") || "";
		try {
			s.set("Authorization", "Basic " + btoa(t + ":" + (n ? qb(n) : "")));
		} catch (t) {
			throw $.from(t, $.ERR_BAD_OPTION_VALUE, e);
		}
	}
	if (Q.isFormData(r) && (pb.hasStandardBrowserEnv || pb.hasStandardBrowserWebWorkerEnv || Q.isReactNative(r) ? s.setContentType(void 0) : Q.isFunction(r.getHeaders) && Kb(s, r.getHeaders(), n("formDataHeaderPolicy"))), pb.hasStandardBrowserEnv && (Q.isFunction(i) && (i = i(t)), i === !0 || i == null && Nb(t.url))) {
		let e = a && o && Pb.read(o);
		e && s.set(a, e);
	}
	return t;
}
var Yb = typeof XMLHttpRequest < "u" && function(e) {
	return new Promise(function(t, n) {
		let r = Jb(e), i = r.data, a = Uy.from(r.headers).normalize(), { responseType: o, onUploadProgress: s, onDownloadProgress: c } = r, l, u, d, f, p;
		function m() {
			f && f(), p && p(), r.cancelToken && r.cancelToken.unsubscribe(l), r.signal && r.signal.removeEventListener("abort", l);
		}
		let h = new XMLHttpRequest();
		h.open(r.method.toUpperCase(), r.url, !0), h.timeout = r.timeout;
		function g() {
			if (!h) return;
			let r = Uy.from("getAllResponseHeaders" in h && h.getAllResponseHeaders());
			Eb(function(e) {
				t(e), m();
			}, function(e) {
				n(e), m();
			}, {
				data: !o || o === "text" || o === "json" ? h.responseText : h.response,
				status: h.status,
				statusText: h.statusText,
				headers: r,
				config: e,
				request: h
			}), h = null;
		}
		"onloadend" in h ? h.onloadend = g : h.onreadystatechange = function() {
			!h || h.readyState !== 4 || h.status === 0 && !(h.responseURL && h.responseURL.startsWith("file:")) || setTimeout(g);
		}, h.onabort = function() {
			h &&= (n(new $("Request aborted", $.ECONNABORTED, e, h)), m(), null);
		}, h.onerror = function(t) {
			let r = new $(t && t.message ? t.message : "Network Error", $.ERR_NETWORK, e, h);
			r.event = t || null, n(r), m(), h = null;
		}, h.ontimeout = function() {
			let t = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded", i = r.transitional || ab;
			r.timeoutErrorMessage && (t = r.timeoutErrorMessage), n(new $(t, i.clarifyTimeoutError ? $.ETIMEDOUT : $.ECONNABORTED, e, h)), m(), h = null;
		}, i === void 0 && a.setContentType(null), "setRequestHeader" in h && Q.forEach(Py(a), function(e, t) {
			h.setRequestHeader(t, e);
		}), Q.isUndefined(r.withCredentials) || (h.withCredentials = !!r.withCredentials), o && o !== "json" && (h.responseType = r.responseType), c && ([d, p] = Ab(c, !0), h.addEventListener("progress", d)), s && h.upload && ([u, f] = Ab(s), h.upload.addEventListener("progress", u), h.upload.addEventListener("loadend", f)), (r.cancelToken || r.signal) && (l = (t) => {
			h &&= (n(!t || t.type ? new Tb(null, e, h) : t), h.abort(), m(), null);
		}, r.cancelToken && r.cancelToken.subscribe(l), r.signal && (r.signal.aborted ? l() : r.signal.addEventListener("abort", l)));
		let _ = Db(r.url);
		if (_ && !pb.protocols.includes(_)) {
			n(new $("Unsupported protocol " + _ + ":", $.ERR_BAD_REQUEST, e)), m();
			return;
		}
		h.send(i || null);
	});
}, Xb = (e, t) => {
	if (e = e ? e.filter(Boolean) : [], !t && !e.length) return;
	let n = new AbortController(), r = !1, i = function(e) {
		if (!r) {
			r = !0, o();
			let t = e instanceof Error ? e : this.reason;
			n.abort(t instanceof $ ? t : new Tb(t instanceof Error ? t.message : t));
		}
	}, a = t && setTimeout(() => {
		a = null, i(new $(`timeout of ${t}ms exceeded`, $.ETIMEDOUT));
	}, t), o = () => {
		e &&= (a && clearTimeout(a), a = null, e.forEach((e) => {
			e.unsubscribe ? e.unsubscribe(i) : e.removeEventListener("abort", i);
		}), null);
	};
	e.forEach((e) => e.addEventListener("abort", i, { once: !0 }));
	let { signal: s } = n;
	return s.unsubscribe = () => Q.asap(o), s;
}, Zb = function* (e, t) {
	let n = e.byteLength;
	if (!t || n < t) {
		yield e;
		return;
	}
	let r = 0, i;
	for (; r < n;) i = r + t, yield e.slice(r, i), r = i;
}, Qb = async function* (e, t) {
	for await (let n of $b(e)) yield* Zb(n, t);
}, $b = async function* (e) {
	if (e[Symbol.asyncIterator]) {
		yield* e;
		return;
	}
	let t = e.getReader();
	try {
		for (;;) {
			let { done: e, value: n } = await t.read();
			if (e) break;
			yield n;
		}
	} finally {
		await t.cancel();
	}
}, ex = (e, t, n, r) => {
	let i = Qb(e, t), a = 0, o, s = (e) => {
		o || (o = !0, r && r(e));
	};
	return new ReadableStream({
		async pull(e) {
			try {
				let { done: t, value: r } = await i.next();
				if (t) {
					s(), e.close();
					return;
				}
				let o = r.byteLength;
				n && n(a += o), e.enqueue(new Uint8Array(r));
			} catch (e) {
				throw s(e), e;
			}
		},
		cancel(e) {
			return s(e), i.return();
		}
	}, { highWaterMark: 2 });
}, tx = (e) => e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102, nx = (e, t, n) => t + 2 < n && tx(e.charCodeAt(t + 1)) && tx(e.charCodeAt(t + 2));
function rx(e) {
	if (!e || typeof e != "string" || !e.startsWith("data:")) return 0;
	let t = e.indexOf(",");
	if (t < 0) return 0;
	let n = e.slice(5, t), r = e.slice(t + 1);
	if (/;base64/i.test(n)) {
		let e = r.length, t = r.length;
		for (let n = 0; n < t; n++) if (r.charCodeAt(n) === 37 && n + 2 < t) {
			let t = r.charCodeAt(n + 1), i = r.charCodeAt(n + 2);
			tx(t) && tx(i) && (e -= 2, n += 2);
		}
		let n = 0, i = t - 1, a = (e) => e >= 2 && r.charCodeAt(e - 2) === 37 && r.charCodeAt(e - 1) === 51 && (r.charCodeAt(e) === 68 || r.charCodeAt(e) === 100);
		i >= 0 && (r.charCodeAt(i) === 61 ? (n++, i--) : a(i) && (n++, i -= 3)), n === 1 && i >= 0 && (r.charCodeAt(i) === 61 || a(i)) && n++;
		let o = Math.floor(e / 4) * 3 - (n || 0);
		return o > 0 ? o : 0;
	}
	let i = 0;
	for (let e = 0, t = r.length; e < t; e++) {
		let n = r.charCodeAt(e);
		if (n === 37 && nx(r, e, t)) i += 1, e += 2;
		else if (n < 128) i += 1;
		else if (n < 2048) i += 2;
		else if (n >= 55296 && n <= 56319 && e + 1 < t) {
			let t = r.charCodeAt(e + 1);
			t >= 56320 && t <= 57343 ? (i += 4, e++) : i += 3;
		} else i += 3;
	}
	return i;
}
//#endregion
//#region node_modules/axios/lib/env/data.js
var ix = "1.18.1", ax = 64 * 1024, { isFunction: ox } = Q, sx = (e) => encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi, (e, t) => String.fromCharCode(parseInt(t, 16))), cx = (e) => {
	if (!Q.isString(e)) return e;
	try {
		return decodeURIComponent(e);
	} catch {
		return e;
	}
}, lx = (e, ...t) => {
	try {
		return !!e(...t);
	} catch {
		return !1;
	}
}, ux = (e) => {
	let t = e.indexOf("://"), n = e;
	return t !== -1 && (n = n.slice(t + 3)), n.includes("@") || n.includes(":");
}, dx = (e) => {
	let t = Q.global !== void 0 && Q.global !== null ? Q.global : globalThis, { ReadableStream: n, TextEncoder: r } = t;
	e = Q.merge.call({ skipUndefined: !0 }, {
		Request: t.Request,
		Response: t.Response
	}, e);
	let { fetch: i, Request: a, Response: o } = e, s = i ? ox(i) : typeof fetch == "function", c = ox(a), l = ox(o);
	if (!s) return !1;
	let u = s && ox(n), d = s && (typeof r == "function" ? ((e) => (t) => e.encode(t))(new r()) : async (e) => new Uint8Array(await new a(e).arrayBuffer())), f = c && u && lx(() => {
		let e = !1, t = new a(pb.origin, {
			body: new n(),
			method: "POST",
			get duplex() {
				return e = !0, "half";
			}
		}), r = t.headers.has("Content-Type");
		return t.body != null && t.body.cancel(), e && !r;
	}), p = l && u && lx(() => Q.isReadableStream(new o("").body)), m = { stream: p && ((e) => e.body) };
	s && [
		"text",
		"arrayBuffer",
		"blob",
		"formData",
		"stream"
	].forEach((e) => {
		!m[e] && (m[e] = (t, n) => {
			let r = t && t[e];
			if (r) return r.call(t);
			throw new $(`Response type '${e}' is not supported`, $.ERR_NOT_SUPPORT, n);
		});
	});
	let h = async (e) => {
		if (e == null) return 0;
		if (Q.isBlob(e)) return e.size;
		if (Q.isSpecCompliantForm(e)) return (await new a(pb.origin, {
			method: "POST",
			body: e
		}).arrayBuffer()).byteLength;
		if (Q.isArrayBufferView(e) || Q.isArrayBuffer(e)) return e.byteLength;
		if (Q.isURLSearchParams(e) && (e += ""), Q.isString(e)) return (await d(e)).byteLength;
	}, g = async (e, t) => Q.toFiniteNumber(e.getContentLength()) ?? h(t);
	return async (e) => {
		let { url: t, method: n, data: s, signal: l, cancelToken: d, timeout: _, onDownloadProgress: v, onUploadProgress: y, responseType: b, headers: x, withCredentials: S = "same-origin", fetchOptions: C, maxContentLength: w, maxBodyLength: T } = Jb(e), E = Q.isNumber(w) && w > -1, D = Q.isNumber(T) && T > -1, O = (t) => Q.hasOwnProp(e, t) ? e[t] : void 0, k = i || fetch;
		b = b ? (b + "").toLowerCase() : "text";
		let A = Xb([l, d && d.toAbortSignal()], _), j = null, M = A && A.unsubscribe && (() => {
			A.unsubscribe();
		}), ee, N = null, P = () => new $("Request body larger than maxBodyLength limit", $.ERR_BAD_REQUEST, e, j);
		try {
			let i, l = O("auth");
			if (l && (i = {
				username: Q.getSafeProp(l, "username") || "",
				password: Q.getSafeProp(l, "password") || ""
			}), ux(t)) {
				let e = new URL(t, pb.origin);
				!i && (e.username || e.password) && (i = {
					username: cx(e.username),
					password: cx(e.password)
				}), (e.username || e.password) && (e.username = "", e.password = "", t = e.href);
			}
			if (i && (x.delete("authorization"), x.set("Authorization", "Basic " + btoa(sx((i.username || "") + ":" + (i.password || ""))))), E && typeof t == "string" && t.startsWith("data:") && rx(t) > w) throw new $("maxContentLength size of " + w + " exceeded", $.ERR_BAD_RESPONSE, e, j);
			if (D && n !== "get" && n !== "head") {
				let e = await h(s);
				if (typeof e == "number" && isFinite(e) && (ee = e, e > T)) throw P();
			}
			let d = D && (Q.isReadableStream(s) || Q.isStream(s)), _ = (e, t, n) => ex(e, ax, (e) => {
				if (D && e > T) throw N = P();
				t && t(e);
			}, n);
			if (f && n !== "get" && n !== "head" && (y || d)) {
				if (ee ??= await g(x, s), ee !== 0 || d) {
					let e = new a(t, {
						method: "POST",
						body: s,
						duplex: "half"
					}), n;
					if (Q.isFormData(s) && (n = e.headers.get("content-type")) && x.setContentType(n), e.body) {
						let [t, n] = y && jb(ee, Ab(Mb(y))) || [];
						s = _(e.body, t, n);
					}
				}
			} else if (d && !c && u && n !== "get" && n !== "head") s = _(s);
			else if (d && c && !f && n !== "get" && n !== "head") throw new $("Stream request bodies are not supported by the current fetch implementation", $.ERR_NOT_SUPPORT, e, j);
			Q.isString(S) || (S = S ? "include" : "omit");
			let te = c && "credentials" in a.prototype;
			if (Q.isFormData(s)) {
				let e = x.getContentType();
				e && /^multipart\/form-data/i.test(e) && !/boundary=/i.test(e) && x.delete("content-type");
			}
			x.set("User-Agent", "axios/" + ix, !1);
			let ne = {
				...C,
				signal: A,
				method: n.toUpperCase(),
				headers: Py(x.normalize()),
				body: s,
				duplex: "half",
				credentials: te ? S : void 0
			};
			j = c && new a(t, ne);
			let F = await (c ? k(j, C) : k(t, ne)), re = Uy.from(F.headers);
			if (E) {
				let t = Q.toFiniteNumber(re.getContentLength());
				if (t != null && t > w) throw new $("maxContentLength size of " + w + " exceeded", $.ERR_BAD_RESPONSE, e, j);
			}
			let ie = p && (b === "stream" || b === "response");
			if (p && F.body && (v || E || ie && M)) {
				let t = {};
				[
					"status",
					"statusText",
					"headers"
				].forEach((e) => {
					t[e] = F[e];
				});
				let n = Q.toFiniteNumber(re.getContentLength()), [r, i] = v && jb(n, Ab(Mb(v), !0)) || [], a = 0;
				F = new o(ex(F.body, ax, (t) => {
					if (E && (a = t, a > w)) throw new $("maxContentLength size of " + w + " exceeded", $.ERR_BAD_RESPONSE, e, j);
					r && r(t);
				}, () => {
					i && i(), M && M();
				}), t);
			}
			b ||= "text";
			let I = await m[Q.findKey(m, b) || "text"](F, e);
			if (E && !p && !ie) {
				let t;
				if (I != null && (typeof I.byteLength == "number" ? t = I.byteLength : typeof I.size == "number" ? t = I.size : typeof I == "string" && (t = typeof r == "function" ? new r().encode(I).byteLength : I.length)), typeof t == "number" && t > w) throw new $("maxContentLength size of " + w + " exceeded", $.ERR_BAD_RESPONSE, e, j);
			}
			return !ie && M && M(), await new Promise((t, n) => {
				Eb(t, n, {
					data: I,
					headers: Uy.from(F.headers),
					status: F.status,
					statusText: F.statusText,
					config: e,
					request: j
				});
			});
		} catch (t) {
			if (M && M(), A && A.aborted && A.reason instanceof $) {
				let n = A.reason;
				throw n.config = e, j && (n.request = j), t !== n && Object.defineProperty(n, "cause", {
					__proto__: null,
					value: t,
					writable: !0,
					enumerable: !1,
					configurable: !0
				}), n;
			}
			if (N) throw j && !N.request && (N.request = j), N;
			if (t instanceof $) throw j && !t.request && (t.request = j), t;
			if (t && t.name === "TypeError" && /Load failed|fetch/i.test(t.message)) {
				let n = new $("Network Error", $.ERR_NETWORK, e, j, t && t.response);
				throw Object.defineProperty(n, "cause", {
					__proto__: null,
					value: t.cause || t,
					writable: !0,
					enumerable: !1,
					configurable: !0
				}), n;
			}
			throw $.from(t, t && t.code, e, j, t && t.response);
		}
	};
}, fx = /* @__PURE__ */ new Map(), px = (e) => {
	let t = e && e.env || {}, { fetch: n, Request: r, Response: i } = t, a = [
		r,
		i,
		n
	], o = a.length, s, c, l = fx;
	for (; o--;) s = a[o], c = l.get(s), c === void 0 && l.set(s, c = o ? /* @__PURE__ */ new Map() : dx(t)), l = c;
	return c;
};
px();
//#endregion
//#region node_modules/axios/lib/adapters/adapters.js
var mx = {
	http: null,
	xhr: Yb,
	fetch: { get: px }
};
Q.forEach(mx, (e, t) => {
	if (e) {
		try {
			Object.defineProperty(e, "name", {
				__proto__: null,
				value: t
			});
		} catch {}
		Object.defineProperty(e, "adapterName", {
			__proto__: null,
			value: t
		});
	}
});
var hx = (e) => `- ${e}`, gx = (e) => Q.isFunction(e) || e === null || e === !1;
function _x(e, t) {
	e = Q.isArray(e) ? e : [e];
	let { length: n } = e, r, i, a = {};
	for (let o = 0; o < n; o++) {
		r = e[o];
		let n;
		if (i = r, !gx(r) && (i = mx[(n = String(r)).toLowerCase()], i === void 0)) throw new $(`Unknown adapter '${n}'`);
		if (i && (Q.isFunction(i) || (i = i.get(t)))) break;
		a[n || "#" + o] = i;
	}
	if (!i) {
		let e = Object.entries(a).map(([e, t]) => `adapter ${e} ` + (t === !1 ? "is not supported by the environment" : "is not available in the build"));
		throw new $("There is no suitable adapter to dispatch the request " + (n ? e.length > 1 ? "since :\n" + e.map(hx).join("\n") : " " + hx(e[0]) : "as no adapter specified"), $.ERR_NOT_SUPPORT);
	}
	return i;
}
var vx = {
	getAdapter: _x,
	adapters: mx
};
//#endregion
//#region node_modules/axios/lib/core/dispatchRequest.js
function yx(e) {
	if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted) throw new Tb(null, e);
}
function bx(e) {
	return yx(e), e.headers = Uy.from(e.headers), e.data = Cb.call(e, e.transformRequest), [
		"post",
		"put",
		"patch"
	].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), vx.getAdapter(e.adapter || Sb.adapter, e)(e).then(function(t) {
		yx(e), e.response = t;
		try {
			t.data = Cb.call(e, e.transformResponse, t);
		} finally {
			delete e.response;
		}
		return t.headers = Uy.from(t.headers), t;
	}, function(t) {
		if (!wb(t) && (yx(e), t && t.response)) {
			e.response = t.response;
			try {
				t.response.data = Cb.call(e, e.transformResponse, t.response);
			} finally {
				delete e.response;
			}
			t.response.headers = Uy.from(t.response.headers);
		}
		return Promise.reject(t);
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/validator.js
var xx = {};
[
	"object",
	"boolean",
	"number",
	"function",
	"string",
	"symbol"
].forEach((e, t) => {
	xx[e] = function(n) {
		return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
	};
});
var Sx = {};
xx.transitional = function(e, t, n) {
	function r(e, t) {
		return "[Axios v" + ix + "] Transitional option '" + e + "'" + t + (n ? ". " + n : "");
	}
	return (n, i, a) => {
		if (e === !1) throw new $(r(i, " has been removed" + (t ? " in " + t : "")), $.ERR_DEPRECATED);
		return t && !Sx[i] && (Sx[i] = !0, console.warn(r(i, " has been deprecated since v" + t + " and will be removed in the near future"))), !e || e(n, i, a);
	};
}, xx.spelling = function(e) {
	return (t, n) => (console.warn(`${n} is likely a misspelling of ${e}`), !0);
};
function Cx(e, t, n) {
	if (typeof e != "object" || !e) throw new $("options must be an object", $.ERR_BAD_OPTION_VALUE);
	let r = Object.keys(e), i = r.length;
	for (; i-- > 0;) {
		let a = r[i], o = Object.prototype.hasOwnProperty.call(t, a) ? t[a] : void 0;
		if (o) {
			let t = e[a], n = t === void 0 || o(t, a, e);
			if (n !== !0) throw new $("option " + a + " must be " + n, $.ERR_BAD_OPTION_VALUE);
			continue;
		}
		if (n !== !0) throw new $("Unknown option " + a, $.ERR_BAD_OPTION);
	}
}
var wx = {
	assertOptions: Cx,
	validators: xx
}, Tx = wx.validators, Ex = class {
	constructor(e) {
		this.defaults = e || {}, this.interceptors = {
			request: new ib(),
			response: new ib()
		};
	}
	async request(e, t) {
		try {
			return await this._request(e, t);
		} catch (e) {
			if (e instanceof Error) {
				let t = {};
				Error.captureStackTrace ? Error.captureStackTrace(t) : t = /* @__PURE__ */ Error();
				let n = (() => {
					if (!t.stack) return "";
					let e = t.stack.indexOf("\n");
					return e === -1 ? "" : t.stack.slice(e + 1);
				})();
				try {
					if (!e.stack) e.stack = n;
					else if (n) {
						let t = n.indexOf("\n"), r = t === -1 ? -1 : n.indexOf("\n", t + 1), i = r === -1 ? "" : n.slice(r + 1);
						String(e.stack).endsWith(i) || (e.stack += "\n" + n);
					}
				} catch {}
			}
			throw e;
		}
	}
	_request(e, t) {
		typeof e == "string" ? (t ||= {}, t.url = e) : t = e || {}, t = Wb(this.defaults, t);
		let { transitional: n, paramsSerializer: r, headers: i } = t;
		n !== void 0 && wx.assertOptions(n, {
			silentJSONParsing: Tx.transitional(Tx.boolean),
			forcedJSONParsing: Tx.transitional(Tx.boolean),
			clarifyTimeoutError: Tx.transitional(Tx.boolean),
			legacyInterceptorReqResOrdering: Tx.transitional(Tx.boolean),
			advertiseZstdAcceptEncoding: Tx.transitional(Tx.boolean),
			validateStatusUndefinedResolves: Tx.transitional(Tx.boolean)
		}, !1), r != null && (Q.isFunction(r) ? t.paramsSerializer = { serialize: r } : wx.assertOptions(r, {
			encode: Tx.function,
			serialize: Tx.function
		}, !0)), t.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls === void 0 ? t.allowAbsoluteUrls = !0 : t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls), wx.assertOptions(t, {
			baseUrl: Tx.spelling("baseURL"),
			withXsrfToken: Tx.spelling("withXSRFToken")
		}, !0), t.method = (t.method || this.defaults.method || "get").toLowerCase();
		let a = i && Q.merge(i.common, i[t.method]);
		i && Q.forEach([
			"delete",
			"get",
			"head",
			"post",
			"put",
			"patch",
			"query",
			"common"
		], (e) => {
			delete i[e];
		}), t.headers = Uy.concat(a, i);
		let o = [], s = !0;
		this.interceptors.request.forEach(function(e) {
			if (typeof e.runWhen == "function" && e.runWhen(t) === !1) return;
			s &&= e.synchronous;
			let n = t.transitional || ab;
			n && n.legacyInterceptorReqResOrdering ? o.unshift(e.fulfilled, e.rejected) : o.push(e.fulfilled, e.rejected);
		});
		let c = [];
		this.interceptors.response.forEach(function(e) {
			c.push(e.fulfilled, e.rejected);
		});
		let l, u = 0, d;
		if (!s) {
			let e = [bx.bind(this), void 0];
			for (e.unshift(...o), e.push(...c), d = e.length, l = Promise.resolve(t); u < d;) l = l.then(e[u++], e[u++]);
			return l;
		}
		d = o.length;
		let f = t;
		for (; u < d;) {
			let e = o[u++], t = o[u++];
			try {
				f = e(f);
			} catch (e) {
				t.call(this, e);
				break;
			}
		}
		try {
			l = bx.call(this, f);
		} catch (e) {
			return Promise.reject(e);
		}
		for (u = 0, d = c.length; u < d;) l = l.then(c[u++], c[u++]);
		return l;
	}
	getUri(e) {
		return e = Wb(this.defaults, e), rb(Hb(e.baseURL, e.url, e.allowAbsoluteUrls, e), e.params, e.paramsSerializer);
	}
};
Q.forEach([
	"delete",
	"get",
	"head",
	"options"
], function(e) {
	Ex.prototype[e] = function(t, n) {
		return this.request(Wb(n || {}, {
			method: e,
			url: t,
			data: n && Q.hasOwnProp(n, "data") ? n.data : void 0
		}));
	};
}), Q.forEach([
	"post",
	"put",
	"patch",
	"query"
], function(e) {
	function t(t) {
		return function(n, r, i) {
			return this.request(Wb(i || {}, {
				method: e,
				headers: t ? { "Content-Type": "multipart/form-data" } : {},
				url: n,
				data: r
			}));
		};
	}
	Ex.prototype[e] = t(), e !== "query" && (Ex.prototype[e + "Form"] = t(!0));
});
//#endregion
//#region node_modules/axios/lib/cancel/CancelToken.js
var Dx = class e {
	constructor(e) {
		if (typeof e != "function") throw TypeError("executor must be a function.");
		let t;
		this.promise = new Promise(function(e) {
			t = e;
		});
		let n = this;
		this.promise.then((e) => {
			if (!n._listeners) return;
			let t = n._listeners.length;
			for (; t-- > 0;) n._listeners[t](e);
			n._listeners = null;
		}), this.promise.then = (e) => {
			let t, r = new Promise((e) => {
				n.subscribe(e), t = e;
			}).then(e);
			return r.cancel = function() {
				n.unsubscribe(t);
			}, r;
		}, e(function(e, r, i) {
			n.reason || (n.reason = new Tb(e, r, i), t(n.reason));
		});
	}
	throwIfRequested() {
		if (this.reason) throw this.reason;
	}
	subscribe(e) {
		if (this.reason) {
			e(this.reason);
			return;
		}
		this._listeners ? this._listeners.push(e) : this._listeners = [e];
	}
	unsubscribe(e) {
		if (!this._listeners) return;
		let t = this._listeners.indexOf(e);
		t !== -1 && this._listeners.splice(t, 1);
	}
	toAbortSignal() {
		let e = new AbortController(), t = (t) => {
			e.abort(t);
		};
		return this.subscribe(t), e.signal.unsubscribe = () => this.unsubscribe(t), e.signal;
	}
	static source() {
		let t;
		return {
			token: new e(function(e) {
				t = e;
			}),
			cancel: t
		};
	}
};
//#endregion
//#region node_modules/axios/lib/helpers/spread.js
function Ox(e) {
	return function(t) {
		return e.apply(null, t);
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/isAxiosError.js
function kx(e) {
	return Q.isObject(e) && e.isAxiosError === !0;
}
//#endregion
//#region node_modules/axios/lib/helpers/HttpStatusCode.js
var Ax = {
	Continue: 100,
	SwitchingProtocols: 101,
	Processing: 102,
	EarlyHints: 103,
	Ok: 200,
	Created: 201,
	Accepted: 202,
	NonAuthoritativeInformation: 203,
	NoContent: 204,
	ResetContent: 205,
	PartialContent: 206,
	MultiStatus: 207,
	AlreadyReported: 208,
	ImUsed: 226,
	MultipleChoices: 300,
	MovedPermanently: 301,
	Found: 302,
	SeeOther: 303,
	NotModified: 304,
	UseProxy: 305,
	Unused: 306,
	TemporaryRedirect: 307,
	PermanentRedirect: 308,
	BadRequest: 400,
	Unauthorized: 401,
	PaymentRequired: 402,
	Forbidden: 403,
	NotFound: 404,
	MethodNotAllowed: 405,
	NotAcceptable: 406,
	ProxyAuthenticationRequired: 407,
	RequestTimeout: 408,
	Conflict: 409,
	Gone: 410,
	LengthRequired: 411,
	PreconditionFailed: 412,
	PayloadTooLarge: 413,
	UriTooLong: 414,
	UnsupportedMediaType: 415,
	RangeNotSatisfiable: 416,
	ExpectationFailed: 417,
	ImATeapot: 418,
	MisdirectedRequest: 421,
	UnprocessableEntity: 422,
	Locked: 423,
	FailedDependency: 424,
	TooEarly: 425,
	UpgradeRequired: 426,
	PreconditionRequired: 428,
	TooManyRequests: 429,
	RequestHeaderFieldsTooLarge: 431,
	UnavailableForLegalReasons: 451,
	InternalServerError: 500,
	NotImplemented: 501,
	BadGateway: 502,
	ServiceUnavailable: 503,
	GatewayTimeout: 504,
	HttpVersionNotSupported: 505,
	VariantAlsoNegotiates: 506,
	InsufficientStorage: 507,
	LoopDetected: 508,
	NotExtended: 510,
	NetworkAuthenticationRequired: 511,
	WebServerIsDown: 521,
	ConnectionTimedOut: 522,
	OriginIsUnreachable: 523,
	TimeoutOccurred: 524,
	SslHandshakeFailed: 525,
	InvalidSslCertificate: 526
};
Object.entries(Ax).forEach(([e, t]) => {
	Ax[t] = e;
});
//#endregion
//#region node_modules/axios/lib/axios.js
function jx(e) {
	let t = new Ex(e), n = uv(Ex.prototype.request, t);
	return Q.extend(n, Ex.prototype, t, { allOwnKeys: !0 }), Q.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(t) {
		return jx(Wb(e, t));
	}, n;
}
var Mx = jx(Sb);
Mx.Axios = Ex, Mx.CanceledError = Tb, Mx.CancelToken = Dx, Mx.isCancel = wb, Mx.VERSION = ix, Mx.toFormData = Qy, Mx.AxiosError = $, Mx.Cancel = Mx.CanceledError, Mx.all = function(e) {
	return Promise.all(e);
}, Mx.spread = Ox, Mx.isAxiosError = kx, Mx.mergeConfig = Wb, Mx.AxiosHeaders = Uy, Mx.formToJSON = (e) => yb(Q.isHTMLForm(e) ? new FormData(e) : e), Mx.getAdapter = vx.getAdapter, Mx.HttpStatusCode = Ax, Mx.default = Mx;
//#endregion
//#region src/composables/useApiBridge.js
function Nx() {
	let e = cv();
	function t(t) {
		return t || e.flowId;
	}
	function n() {
		return Mx.create({
			baseURL: e.apiBaseUrl || "/api/flow-builder",
			timeout: 15e3,
			withCredentials: !0,
			headers: e.userId ? { "x-user-id": e.userId } : {}
		});
	}
	return {
		saveFlow: (r) => {
			let i = t();
			if (!i) return Promise.reject(/* @__PURE__ */ Error("flowId is required to save (create a flow first, e.g. from the dashboard)"));
			let a = `/flows/save/${encodeURIComponent(i)}`, o = e.userId ? { "x-user-id": e.userId } : {};
			return console.groupCollapsed("[Flow Builder] Save flow request"), console.log("method", "POST"), console.log("baseURL", e.apiBaseUrl || "/api/flow-builder"), console.log("endpoint", a), console.log("flowId", i), console.log("headers", o), console.log("payload", r), console.groupEnd(), n().post(a, r);
		},
		loadFlow: (e) => n().get(`/flows/${t(e)}`),
		runFlow: (e, r) => n().post(`/flows/${t(e)}/run`, r),
		runNode: (e, t) => n().post(`/nodes/${e.replace("_", "-")}`, t)
	};
}
//#endregion
//#region src/utils/dagUtils.js
function Px(e, t) {
	let n = new Set(e.map((e) => e.id)), r = new Map(e.map((e) => [e.id, 0])), i = new Map(e.map((e) => [e.id, []]));
	t.forEach((e) => {
		!n.has(e.source) || !n.has(e.target) || (r.set(e.target, r.get(e.target) + 1), i.get(e.source).push(e.target));
	});
	let a = e.filter((e) => r.get(e.id) === 0).map((e) => e.id), o = [];
	for (; a.length;) {
		let e = a.shift();
		o.push(e), i.get(e).forEach((e) => {
			r.set(e, r.get(e) - 1), r.get(e) === 0 && a.push(e);
		});
	}
	if (o.length !== e.length) throw Error("Flow contains a cycle");
	return o.map((t) => e.find((e) => e.id === t));
}
//#endregion
//#region src/utils/contextUtils.js
function Fx(e, t) {
	return t ? t.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean).reduce((e, t) => e?.[t], e) : e;
}
function Ix(e) {
	return e == null ? e : JSON.parse(JSON.stringify(e));
}
function Lx(e) {
	return e == null ? "" : typeof e == "string" ? e : JSON.stringify(e);
}
//#endregion
//#region src/composables/useVariableResolver.js
function Rx(e, t) {
	return typeof e == "string" ? e.replace(/\{\{([^}]+)\}\}/g, (e, n) => {
		let r = Fx(t, n.trim());
		return r === void 0 ? "" : Lx(r);
	}) : e;
}
//#endregion
//#region src/stores/accounts.store.js
var zx = ws("accounts", {
	state: () => ({ accounts: [] }),
	actions: { setAccounts(e) {
		this.accounts = e;
	} }
});
//#endregion
//#region src/composables/useFlowExecutor.js
function Bx() {
	let e = nv(), t = lv(), n = zx();
	async function r(r = "test") {
		t.start(r), e.nodes.forEach((t) => e.setNodeStatus(t.id, "idle"));
		let i = "success";
		try {
			let a = Px(e.nodes, e.edges);
			for (let o of a) {
				let a = o.name || o.id, s = (/* @__PURE__ */ new Date()).toISOString(), c = performance.now();
				if (o.disabled) {
					let n = {
						status: "skipped",
						output: null,
						meta: {
							startedAt: s,
							finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
							durationMs: 0
						},
						error: null
					};
					e.setNodeStatus(o.id, "skipped"), t.setNodeOutput(a, n), t.addLog({
						nodeId: a,
						status: "skipped",
						durationMs: 0,
						output: n
					});
					continue;
				}
				e.setNodeStatus(o.id, "running");
				try {
					let i = Ix(t.context), l = await Vx(o, i, r, n.accounts), u = (/* @__PURE__ */ new Date()).toISOString(), d = Math.round(performance.now() - c), f = {
						status: "success",
						output: l.output,
						...l.selectedOutput ? { selectedOutput: l.selectedOutput } : {},
						meta: {
							startedAt: s,
							finishedAt: u,
							durationMs: d,
							...l.meta || {}
						},
						error: null
					};
					t.setNodeOutput(a, f), e.setNodeStatus(o.id, "success"), t.addLog({
						nodeId: a,
						status: "success",
						durationMs: d,
						inputContext: i,
						output: f
					});
				} catch (n) {
					let r = (/* @__PURE__ */ new Date()).toISOString(), l = Math.round(performance.now() - c), u = {
						status: "error",
						output: null,
						meta: {
							startedAt: s,
							finishedAt: r,
							durationMs: l
						},
						error: { message: n.message }
					};
					i = "failed", t.setNodeOutput(a, u), e.setNodeStatus(o.id, "error", n.message), t.addLog({
						nodeId: a,
						status: "error",
						durationMs: l,
						output: u,
						errorMessage: n.message
					});
					break;
				}
			}
		} catch (e) {
			i = "failed", t.addLog({
				nodeId: "flow",
				status: "error",
				durationMs: 0,
				errorMessage: e.message
			});
		}
		t.finish(i);
	}
	return { execute: r };
}
async function Vx(e, t, n, r) {
	let i = e.config;
	if (e.type === "input") return { output: {
		value: Hx(i.value, i.format),
		format: i.format
	} };
	if (e.type === "http_request") return {
		output: i.responseFormat === "json" ? {
			ok: !0,
			body: t.trigger?.output?.body || {},
			headers: t.trigger?.output?.headers || {},
			query: t.trigger?.output?.query || {}
		} : JSON.stringify(t.trigger?.output?.body || {}),
		meta: {
			statusCode: 200,
			headers: { "content-type": i.responseFormat === "json" ? "application/json" : "text/plain" }
		}
	};
	if (e.type === "http_response") {
		let e = Rx(String(i.statusCode || "200"), t), n = Number.parseInt(e, 10) || 200;
		return {
			output: {
				statusCode: n,
				body: Ux(Rx(i.body || "", t))
			},
			meta: {
				statusCode: n,
				responseType: "webhook"
			}
		};
	}
	if (e.type === "rest_api") {
		let e = "Summer Drops";
		return {
			output: {
				source: Rx(i.url, t),
				topics: [{
					name: e,
					score: 97
				}],
				items: [{
					title: `${e} trend report`,
					engagement: "high"
				}]
			},
			meta: {
				statusCode: 200,
				headers: { "content-type": "application/json" }
			}
		};
	}
	if (e.type === "prompt") {
		let e = `Fresh angle: ${Rx(i.userPrompt, t).replace(/\s+/g, " ").trim()} Keep it crisp, visual, and ready for every channel. #Launch #SocialOps`;
		return {
			output: {
				text: e,
				variants: Array.from({ length: Number(i.variants || 1) }, (t, n) => `${e} Variant ${n + 1}`)
			},
			meta: {
				tokensUsed: Math.max(60, Math.round(e.length / 4)),
				model: i.model
			}
		};
	}
	if (e.type === "javascript") {
		let e = performance.now(), n = t.write_caption?.output?.text || "";
		return {
			output: {
				caption: n.split("#")[0].trim() || "Draft caption ready.",
				hashtags: "#Launch #SocialOps",
				charCount: n.length
			},
			meta: { executionMs: Math.round(performance.now() - e) }
		};
	}
	if (e.type === "condition") {
		let e = Array.isArray(i.conditions) ? i.conditions.map((e) => Wx(e, t)) : [], n = e.find((e) => e.matched);
		return {
			selectedOutput: n?.id || null,
			output: n ? {
				matched: !0,
				conditionId: n.id
			} : {
				matched: !1,
				conditionId: null
			},
			meta: { matchedConditions: e }
		};
	}
	if (e.type === "post") {
		let e = Rx(i.caption, t), a = r.filter((e) => i.accounts?.includes(e.id)), o = a.length ? a : r.slice(0, 2);
		return { output: {
			published: n !== "test",
			dryRun: n === "test",
			previewUrl: null,
			results: o.map((t, r) => ({
				platform: t.platform,
				accountId: t.id,
				status: n === "test" ? "dry_run" : "published",
				url: n === "test" ? null : `https://social.example/${t.platform}/posts/${Date.now()}-${r}`,
				caption: e
			})),
			failedPlatforms: []
		} };
	}
	throw Error(`Unsupported node type: ${e.type}`);
}
function Hx(e, t) {
	return t === "json" ? Ux(e || "{}") : e || "";
}
function Ux(e) {
	if (typeof e != "string") return e;
	if (!e.trim()) return null;
	try {
		return JSON.parse(e);
	} catch {
		return e;
	}
}
function Wx(e, t) {
	let n = Gx(e.left, t, e.dataType), r = Gx(e.right, t, e.dataType), i = Kx(n, r, e);
	return {
		id: e.id,
		dataType: e.dataType,
		operation: e.operation,
		left: n,
		right: r,
		matched: i
	};
}
function Gx(e, t, n) {
	let r = Rx(e ?? "", t);
	if (n === "number") return r === "" ? null : Number(r);
	if (n === "boolean") return r === !0 || r === "true" || r === "1";
	if (n === "array" || n === "object") try {
		return typeof r == "string" ? JSON.parse(r) : r;
	} catch {
		return r;
	}
	return String(r ?? "");
}
function Kx(e, t, n) {
	let r = n.operation;
	if (r === "is_empty") return qx(e);
	if (r === "is_not_empty") return !qx(e);
	if (r === "is_true") return e === !0;
	if (r === "is_false") return e === !1;
	if (r === "equals") return e === t;
	if (r === "not_equals") return e !== t;
	if (n.dataType === "number") {
		if (Number.isNaN(e) || Number.isNaN(t)) return !1;
		if (r === "greater_than") return e > t;
		if (r === "greater_equal") return e >= t;
		if (r === "less_than") return e < t;
		if (r === "less_equal") return e <= t;
	}
	if (n.dataType === "string") {
		if (r === "contains") return e.includes(t);
		if (r === "not_contains") return !e.includes(t);
		if (r === "starts_with") return e.startsWith(t);
		if (r === "ends_with") return e.endsWith(t);
	}
	if (n.dataType === "array") {
		let n = Array.isArray(e) ? e : [];
		if (r === "contains") return n.includes(t);
	}
	return n.dataType === "object" && r === "has_key" && e && typeof e == "object" && Object.hasOwn(e, t);
}
function qx(e) {
	return e == null || e === "" ? !0 : Array.isArray(e) ? e.length === 0 : typeof e == "object" && Object.keys(e).length === 0;
}
//#endregion
//#region src/stores/toast.store.js
var Jx = 0, Yx = ws("toast", {
	state: () => ({ items: [] }),
	actions: {
		show({ title: e, message: t = "", type: n = "success", duration: r = 4200 }) {
			let i = `toast_${Date.now()}_${Jx++}`;
			return this.items.push({
				id: i,
				title: e,
				message: t,
				type: n
			}), r > 0 && window.setTimeout(() => {
				this.dismiss(i);
			}, r), i;
		},
		dismiss(e) {
			this.items = this.items.filter((t) => t.id !== e);
		}
	}
}), Xx = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, Zx = { class: "fb-toolbar" }, Qx = { class: "fb-title-block" }, $x = { class: "fb-toolbar-actions" }, eS = ["disabled"], tS = /*#__PURE__*/ Xx({
	__name: "FlowToolbar",
	setup(e) {
		let t = nv(), n = cv(), r = lv(), i = Yx(), { execute: a } = Bx(), o = Nx(), s = /* @__PURE__ */ z(!1);
		function c(e) {
			let t = e.response?.data;
			return Array.isArray(t?.errors) && t.errors.length ? t.errors.join("\n") : typeof t?.message == "string" && t.message.trim() ? t.message : typeof t?.error == "string" && t.error.trim() ? t.error : e.message || "Save failed";
		}
		async function l() {
			if (s.value) return;
			let e = performance.now();
			s.value = !0;
			try {
				let a = t.flowPayload, s = await o.saveFlow(a);
				r.addLog({
					nodeId: "flow",
					status: "success",
					durationMs: Math.round(performance.now() - e),
					output: {
						saved: !0,
						endpoint: `/flows/save/${n.flowId}`,
						response: s.data
					}
				}), i.show({
					type: "success",
					title: "Flow saved",
					message: "Your latest canvas changes were saved successfully."
				});
			} catch (t) {
				let n = c(t);
				r.addLog({
					nodeId: "flow",
					status: "error",
					durationMs: Math.round(performance.now() - e),
					errorMessage: n,
					output: t.response?.data || null
				}), i.show({
					type: "error",
					title: "Save failed",
					message: n,
					duration: 8e3
				});
			} finally {
				s.value = !1;
			}
		}
		return (e, r) => (G(), K("header", Zx, [q("div", Qx, [H(q("input", {
			"onUpdate:modelValue": r[0] ||= (e) => B(t).name = e,
			class: "fb-flow-name",
			"aria-label": "Flow name"
		}, null, 512), [[No, B(t).name]]), q("span", null, L(B(n).mode) + " · " + L(B(t).nodes.length) + " nodes · " + L(B(t).edges.length) + " edges", 1)]), q("div", $x, [
			q("button", {
				class: "fb-btn",
				type: "button",
				title: "Test run",
				onClick: r[1] ||= (e) => B(a)("test")
			}, "Test"),
			q("button", {
				class: "fb-btn fb-btn-primary",
				type: "button",
				title: "Live run",
				onClick: r[2] ||= (e) => B(a)("live")
			}, "Run"),
			q("button", {
				class: "fb-btn fb-btn-cta",
				type: "button",
				title: "Save flow",
				disabled: s.value,
				onClick: l
			}, L(s.value ? "Saving" : "Save"), 9, eS)
		])]));
	}
}, [["__scopeId", "data-v-79f6b8a6"]]), nS = { class: "fb-panel fb-library" }, rS = { class: "fb-library-search" }, iS = { class: "fb-library-list" }, aS = ["onDragstart"], oS = {
	key: 0,
	class: "fb-library-empty"
}, sS = /*#__PURE__*/ Xx({
	__name: "NodeLibrary",
	setup(e) {
		let t = cv(), n = /* @__PURE__ */ z(""), r = Y(() => t.enabledNodes.filter((e) => M_[e])), i = Y(() => {
			let e = n.value.trim().toLowerCase();
			return e ? r.value.filter((t) => {
				let n = M_[t];
				return [
					t,
					n.label,
					n.description,
					n.icon
				].some((t) => String(t).toLowerCase().includes(e));
			}) : r.value;
		});
		function a(e, t) {
			e.dataTransfer.effectAllowed = "copy", e.dataTransfer.setData("application/x-flow-node", t);
		}
		return (e, t) => (G(), K("aside", nS, [
			t[2] ||= q("div", { class: "fb-panel-header" }, [q("div", null, [q("h2", { class: "fb-panel-title" }, "Node Library"), q("small", { class: "fb-muted" }, "Add a building block")])], -1),
			q("div", rS, [t[1] ||= q("label", { for: "node-library-search" }, "Search nodes", -1), H(q("input", {
				id: "node-library-search",
				"onUpdate:modelValue": t[0] ||= (e) => n.value = e,
				class: "fb-input",
				type: "search",
				placeholder: "Search nodes",
				autocomplete: "off"
			}, null, 512), [[No, n.value]])]),
			q("div", iS, [(G(!0), K(W, null, Er(i.value, (e) => (G(), K("button", {
				key: e,
				class: "fb-library-item",
				type: "button",
				draggable: "true",
				onDragstart: (t) => a(t, e)
			}, [
				q("span", null, L(B(M_)[e].icon), 1),
				q("strong", null, L(B(M_)[e].label), 1),
				q("small", null, L(B(M_)[e].description), 1)
			], 40, aS))), 128)), i.value.length ? da("", !0) : (G(), K("p", oS, "No nodes match your search."))])
		]));
	}
}, [["__scopeId", "data-v-a18dff16"]]), cS = /* @__PURE__ */ ((e) => (e.Lines = "lines", e.Dots = "dots", e))(cS || {}), lS = function({ dimensions: e, size: t, color: n }) {
	return za("path", {
		stroke: n,
		"stroke-width": t,
		d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`
	});
}, uS = function({ radius: e, color: t }) {
	return za("circle", {
		cx: e,
		cy: e,
		r: e,
		fill: t
	});
};
cS.Lines, cS.Dots;
var dS = {
	[cS.Dots]: "#81818a",
	[cS.Lines]: "#eee"
}, fS = [
	"id",
	"x",
	"y",
	"width",
	"height",
	"patternTransform"
], pS = {
	key: 2,
	height: "100",
	width: "100"
}, mS = ["fill"], hS = [
	"x",
	"y",
	"fill"
], gS = /* @__PURE__ */ Xn({
	name: "Background",
	compatConfig: { MODE: 3 },
	props: {
		id: {},
		variant: { default: () => cS.Dots },
		gap: { default: 20 },
		size: { default: 1 },
		lineWidth: { default: 1 },
		patternColor: {},
		color: {},
		bgColor: {},
		height: { default: 100 },
		width: { default: 100 },
		x: { default: 0 },
		y: { default: 0 },
		offset: { default: 0 }
	},
	setup(e) {
		let { id: t, viewport: n } = e_(), r = Y(() => {
			let t = n.value.zoom, [r, i] = Array.isArray(e.gap) ? e.gap : [e.gap, e.gap], a = [r * t || 1, i * t || 1], o = e.size * t, [s, c] = Array.isArray(e.offset) ? e.offset : [e.offset, e.offset];
			return {
				scaledGap: a,
				offset: [s * t || 1 + a[0] / 2, c * t || 1 + a[1] / 2],
				size: o
			};
		}), i = /* @__PURE__ */ nn(() => `pattern-${t}${e.id ? `-${e.id}` : ""}`), a = /* @__PURE__ */ nn(() => e.color || e.patternColor || dS[e.variant || cS.Dots]);
		return (e, t) => (G(), K("svg", {
			class: "vue-flow__background vue-flow__container",
			style: I({
				height: `${e.height > 100 ? 100 : e.height}%`,
				width: `${e.width > 100 ? 100 : e.width}%`
			})
		}, [
			Dr(e.$slots, "pattern-container", { id: i.value }, () => [q("pattern", {
				id: i.value,
				x: B(n).x % r.value.scaledGap[0],
				y: B(n).y % r.value.scaledGap[1],
				width: r.value.scaledGap[0],
				height: r.value.scaledGap[1],
				patternTransform: `translate(-${r.value.offset[0]},-${r.value.offset[1]})`,
				patternUnits: "userSpaceOnUse"
			}, [Dr(e.$slots, "pattern", {}, () => [e.variant === B(cS).Lines ? (G(), ta(B(lS), {
				key: 0,
				size: e.lineWidth,
				color: a.value,
				dimensions: r.value.scaledGap
			}, null, 8, [
				"size",
				"color",
				"dimensions"
			])) : e.variant === B(cS).Dots ? (G(), ta(B(uS), {
				key: 1,
				color: a.value,
				radius: r.value.size / 2
			}, null, 8, ["color", "radius"])) : da("", !0), e.bgColor ? (G(), K("svg", pS, [q("rect", {
				width: "100%",
				height: "100%",
				fill: e.bgColor
			}, null, 8, mS)])) : da("", !0)])], 8, fS)]),
			q("rect", {
				x: e.x,
				y: e.y,
				width: "100%",
				height: "100%",
				fill: `url(#${i.value})`
			}, null, 8, hS),
			Dr(e.$slots, "default", { id: i.value })
		], 4));
	}
}), _S = { class: "fb-node-top" }, vS = { class: "fb-node-icon" }, yS = {
	key: 0,
	class: "fb-condition-outputs"
}, bS = /*#__PURE__*/ Xx({
	__name: "BaseNode",
	props: { id: {
		type: String,
		required: !0
	} },
	setup(e) {
		let t = e, n = nv(), r = lv(), i = /* @__PURE__ */ z(!1), a = /* @__PURE__ */ z(null), o = Y(() => n.nodes.find((e) => e.id === t.id)), s = Y(() => M_[o.value?.type] || M_.prompt), c = Y(() => o.value?.selected || n.selectedNodeId === t.id), l = Y(() => o.value?.type === "condition"), u = Y(() => {
			if (!l.value) return [];
			let e = o.value?.config?.conditions;
			return Array.isArray(e) && e.length ? e : [{ id: "condition_1" }];
		});
		dr(() => {
			document.addEventListener("click", d);
		}), mr(() => {
			document.removeEventListener("click", d);
		});
		function d(e) {
			i.value && (a.value?.contains(e.target) || f());
		}
		function f() {
			i.value = !1;
		}
		function p() {
			o.value && (n.deleteNode(o.value.id), f());
		}
		function m() {
			n.toggleNodeDisabled(t.id), f();
		}
		function h() {
			n.duplicateNode(t.id), f();
		}
		function g() {
			n.setNodeStatus(t.id, "success"), r.addLog({
				nodeId: o.value?.name || t.id,
				status: "success",
				durationMs: 0,
				output: { executedStep: !0 }
			}), f();
		}
		return (t, r) => (G(), K("div", {
			class: le(["fb-node", [
				`is-${o.value?.status || "idle"}`,
				`type-${o.value?.type}`,
				{
					"is-selected": c.value,
					"is-disabled": o.value?.disabled
				}
			]]),
			onDblclick: r[2] ||= zo((t) => B(n).inspectNode(e.id), ["stop"])
		}, [
			J(B(_g), {
				type: "target",
				position: B(X).Left
			}, null, 8, ["position"]),
			q("div", {
				ref_key: "menuRef",
				ref: a,
				class: "fb-node-menu-wrap"
			}, [q("button", {
				class: "fb-node-menu-trigger",
				type: "button",
				title: "Node actions",
				onClick: r[0] ||= zo((e) => i.value = !i.value, ["stop"])
			}, " ⋮ "), i.value ? (G(), K("div", {
				key: 0,
				class: "fb-node-menu",
				onClick: r[1] ||= zo(() => {}, ["stop"])
			}, [
				q("button", {
					type: "button",
					onClick: p
				}, [...r[3] ||= [q("span", null, "⌫", -1), la("Delete", -1)]]),
				q("button", {
					type: "button",
					onClick: m
				}, [q("span", null, L(o.value?.disabled ? "⏻" : "⊘"), 1), la(L(o.value?.disabled ? "Enable" : "Disable"), 1)]),
				q("button", {
					type: "button",
					onClick: h
				}, [...r[4] ||= [q("span", null, "⧉", -1), la("Duplicate", -1)]]),
				q("button", {
					type: "button",
					onClick: g
				}, [...r[5] ||= [q("span", null, "▶", -1), la("Execute step", -1)]])
			])) : da("", !0)], 512),
			q("div", _S, [q("span", vS, L(s.value.icon), 1), q("div", null, [q("strong", null, L(o.value?.label || s.value.label), 1), q("small", null, L(o.value?.name || e.id), 1)])]),
			l.value ? (G(), K("div", yS, [(G(!0), K(W, null, Er(u.value, (e, t) => (G(), K("div", {
				key: e.id,
				class: "fb-condition-output"
			}, [q("span", null, "Condition " + L(t + 1), 1), J(B(_g), {
				id: e.id,
				type: "source",
				position: B(X).Right,
				class: "fb-condition-handle"
			}, null, 8, ["id", "position"])]))), 128))])) : (G(), ta(B(_g), {
				key: 1,
				id: "success",
				type: "source",
				position: B(X).Right
			}, null, 8, ["position"]))
		], 34));
	}
}, [["__scopeId", "data-v-d7154503"]]), xS = {
	__name: "InputNode",
	props: { id: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => (G(), ta(bS, { id: e.id }, null, 8, ["id"]));
	}
}, SS = {
	__name: "HttpRequestNode",
	props: { id: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => (G(), ta(bS, { id: e.id }, null, 8, ["id"]));
	}
}, CS = {
	__name: "HttpResponseNode",
	props: { id: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => (G(), ta(bS, { id: e.id }, null, 8, ["id"]));
	}
}, wS = {
	__name: "RestApiNode",
	props: { id: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => (G(), ta(bS, { id: e.id }, null, 8, ["id"]));
	}
}, TS = {
	__name: "PromptNode",
	props: { id: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => (G(), ta(bS, { id: e.id }, null, 8, ["id"]));
	}
}, ES = {
	__name: "JavascriptNode",
	props: { id: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => (G(), ta(bS, { id: e.id }, null, 8, ["id"]));
	}
}, DS = {
	__name: "PostNode",
	props: { id: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => (G(), ta(bS, { id: e.id }, null, 8, ["id"]));
	}
}, OS = {
	__name: "ConditionNode",
	props: { id: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => (G(), ta(bS, { id: e.id }, null, 8, ["id"]));
	}
}, kS = /*#__PURE__*/ Xx({
	__name: "FlowCanvas",
	setup(e) {
		let t = nv(), { screenToFlowCoordinate: n, fitView: r, zoomIn: i, zoomOut: a, setViewport: o } = e_(), s = /* @__PURE__ */ z(!1), c = {
			input: Ht(xS),
			http_request: Ht(SS),
			http_response: Ht(CS),
			rest_api: Ht(wS),
			prompt: Ht(TS),
			javascript: Ht(ES),
			post: Ht(DS),
			condition: Ht(OS)
		};
		dr(() => {
			document.addEventListener("keydown", f);
		}), mr(() => {
			document.removeEventListener("keydown", f);
		}), U(() => t.nodes.length, async (e, t) => {
			s.value || t !== 0 || e === 0 || (s.value = !0, await wn(), await v(), r({ padding: .2 }));
		});
		function l({ node: e }) {
			t.selectNode(e.id);
		}
		function u({ node: e }) {
			t.inspectNode(e.id);
		}
		function d(e) {
			let r = e.dataTransfer.getData("application/x-flow-node");
			if (!r) return;
			let i = n({
				x: e.clientX,
				y: e.clientY
			});
			t.addNode(r, i);
		}
		function f(e) {
			["Backspace", "Delete"].includes(e.key) && (p(e.target) || t.deleteSelectedElements() && e.preventDefault());
		}
		function p(e) {
			let t = e?.tagName?.toLowerCase();
			return t === "input" || t === "textarea" || t === "select" || e?.isContentEditable;
		}
		function m() {
			r({ padding: .2 });
		}
		function h() {
			i();
		}
		function g() {
			a();
		}
		function _() {
			o({
				x: 0,
				y: 0,
				zoom: 1
			});
		}
		function v() {
			return new Promise((e) => {
				requestAnimationFrame(() => {
					requestAnimationFrame(e);
				});
			});
		}
		async function y() {
			t.tidyNodes(), await wn(), await v(), r({ padding: .2 });
		}
		return (e, n) => (G(), K("section", {
			class: "fb-canvas",
			onDragover: n[0] ||= zo(() => {}, ["prevent"]),
			onDrop: d
		}, [J(B(j_), {
			nodes: B(t).nodes,
			edges: B(t).edges,
			"node-types": c,
			"elements-selectable": !0,
			"select-nodes-on-drag": !0,
			"selection-key-code": !0,
			"multi-selection-key-code": ["Meta", "Control"],
			"selection-mode": "partial",
			"pan-on-drag": [1, 2],
			"delete-key-code": null,
			"min-zoom": .1,
			"max-zoom": 2,
			onNodesChange: B(t).onNodesChange,
			onEdgesChange: B(t).onEdgesChange,
			onConnect: B(t).onConnect,
			onNodeClick: l,
			onNodeDoubleClick: u
		}, {
			default: In(() => [J(B(gS), {
				"pattern-color": "#2f2f33",
				gap: 24
			})]),
			_: 1
		}, 8, [
			"nodes",
			"edges",
			"onNodesChange",
			"onEdgesChange",
			"onConnect"
		]), q("div", {
			class: "fb-canvas-controls",
			"aria-label": "Canvas controls"
		}, [
			q("button", {
				type: "button",
				title: "Zoom to fit",
				onClick: m
			}, "⛶"),
			q("button", {
				type: "button",
				title: "Zoom in",
				"aria-label": "Zoom in",
				onClick: h
			}, [...n[1] ||= [ua("<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\" data-v-ee3dde30><circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\" data-v-ee3dde30></circle><path d=\"M15.3 15.3 21 21\" data-v-ee3dde30></path><path d=\"M10.5 7.5v6\" data-v-ee3dde30></path><path d=\"M7.5 10.5h6\" data-v-ee3dde30></path></svg>", 1)]]),
			q("button", {
				type: "button",
				title: "Zoom out",
				"aria-label": "Zoom out",
				onClick: g
			}, [...n[2] ||= [q("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true"
			}, [
				q("circle", {
					cx: "10.5",
					cy: "10.5",
					r: "6.5"
				}),
				q("path", { d: "M15.3 15.3 21 21" }),
				q("path", { d: "M7.5 10.5h6" })
			], -1)]]),
			q("button", {
				type: "button",
				title: "Reset zoom",
				onClick: _
			}, "↺"),
			q("button", {
				class: "is-accent",
				type: "button",
				title: "Tidy up",
				onClick: y
			}, "⌁")
		])], 32));
	}
}, [["__scopeId", "data-v-ee3dde30"]]), AS = { class: "fb-field" }, jS = { class: "fb-field" }, MS = /*#__PURE__*/ Xx({
	__name: "InputConfig",
	props: { node: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = e, n = Y(() => t.node.config);
		return (e, t) => (G(), K("form", null, [q("div", AS, [t[3] ||= q("label", null, "Input Type", -1), H(q("select", {
			"onUpdate:modelValue": t[0] ||= (e) => n.value.format = e,
			class: "fb-select"
		}, [...t[2] ||= [q("option", { value: "json" }, "JSON", -1), q("option", { value: "text" }, "Text", -1)]], 512), [[Po, n.value.format]])]), q("div", jS, [t[4] ||= q("label", null, "Value", -1), H(q("textarea", {
			"onUpdate:modelValue": t[1] ||= (e) => n.value.value = e,
			class: "fb-textarea fb-input-value"
		}, null, 512), [[No, n.value.value]])])]));
	}
}, [["__scopeId", "data-v-37fa6ac5"]]), NS = { class: "fb-field" }, PS = { class: "fb-field" }, FS = { class: "fb-copy-label" }, IS = { class: "fb-field" }, LS = { class: "fb-field" }, RS = /*#__PURE__*/ Xx({
	__name: "HttpRequestConfig",
	props: { node: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = e, n = cv(), r = Y(() => t.node.config), i = [
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE"
		], a = Y(() => `${(n.apiBaseUrl || "").replace(/\/$/, "")}/webhooks/${n.flowId || ":workflowUuid"}`);
		return (e, t) => (G(), K("form", null, [
			q("div", NS, [t[3] ||= q("label", null, "Method", -1), H(q("select", {
				"onUpdate:modelValue": t[0] ||= (e) => r.value.method = e,
				class: "fb-select"
			}, [(G(), K(W, null, Er(i, (e) => q("option", { key: e }, L(e), 1)), 64))], 512), [[Po, r.value.method]])]),
			q("div", PS, [t[4] ||= q("label", null, "Endpoint", -1), q("div", FS, L(a.value), 1)]),
			q("div", IS, [t[6] ||= q("label", null, "Response Format", -1), H(q("select", {
				"onUpdate:modelValue": t[1] ||= (e) => r.value.responseFormat = e,
				class: "fb-select"
			}, [...t[5] ||= [q("option", { value: "json" }, "JSON", -1), q("option", { value: "text" }, "Text", -1)]], 512), [[Po, r.value.responseFormat]])]),
			q("div", LS, [t[7] ||= q("label", null, "Timeout", -1), H(q("input", {
				"onUpdate:modelValue": t[2] ||= (e) => r.value.timeout = e,
				class: "fb-input",
				type: "number",
				min: "1000"
			}, null, 512), [[
				No,
				r.value.timeout,
				void 0,
				{ number: !0 }
			]])])
		]));
	}
}, [["__scopeId", "data-v-03940f73"]]), zS = { class: "fb-field" }, BS = { class: "fb-field" }, VS = {
	__name: "HttpResponseConfig",
	props: { node: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = e, n = Y(() => t.node.config);
		return (e, t) => (G(), K("form", null, [q("div", zS, [t[2] ||= q("label", null, "Response Code", -1), H(q("input", {
			"onUpdate:modelValue": t[0] ||= (e) => n.value.statusCode = e,
			class: "fb-input",
			placeholder: "{{format_output.output.statusCode}}"
		}, null, 512), [[No, n.value.statusCode]])]), q("div", BS, [t[3] ||= q("label", null, "Response Body", -1), H(q("textarea", {
			"onUpdate:modelValue": t[1] ||= (e) => n.value.body = e,
			class: "fb-textarea",
			placeholder: "{\"message\":\"{{format_output.output.caption}}\"}"
		}, null, 512), [[No, n.value.body]])])]));
	}
}, HS = { class: "fb-field" }, US = { class: "fb-field" }, WS = { class: "fb-field" }, GS = { class: "fb-field" }, KS = { class: "fb-field" }, qS = { class: "fb-field" }, JS = { class: "fb-field" }, YS = {
	__name: "RestApiConfig",
	props: { node: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = e, n = Y(() => t.node.config), r = [
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE"
		];
		return (e, t) => (G(), K("form", null, [
			q("div", HS, [t[7] ||= q("label", null, "Method", -1), H(q("select", {
				"onUpdate:modelValue": t[0] ||= (e) => n.value.method = e,
				class: "fb-select"
			}, [(G(), K(W, null, Er(r, (e) => q("option", { key: e }, L(e), 1)), 64))], 512), [[Po, n.value.method]])]),
			q("div", US, [t[8] ||= q("label", null, "URL", -1), H(q("input", {
				"onUpdate:modelValue": t[1] ||= (e) => n.value.url = e,
				class: "fb-input"
			}, null, 512), [[No, n.value.url]])]),
			q("div", WS, [t[9] ||= q("label", null, "Headers", -1), H(q("textarea", {
				"onUpdate:modelValue": t[2] ||= (e) => n.value.headers = e,
				class: "fb-textarea",
				placeholder: "{\"Authorization\":\"Bearer ...\"}"
			}, null, 512), [[No, n.value.headers]])]),
			q("div", GS, [t[10] ||= q("label", null, "Body", -1), H(q("textarea", {
				"onUpdate:modelValue": t[3] ||= (e) => n.value.body = e,
				class: "fb-textarea"
			}, null, 512), [[No, n.value.body]])]),
			q("div", KS, [t[12] ||= q("label", null, "Auth", -1), H(q("select", {
				"onUpdate:modelValue": t[4] ||= (e) => n.value.auth = e,
				class: "fb-select"
			}, [...t[11] ||= [
				q("option", { value: "none" }, "None", -1),
				q("option", { value: "bearer" }, "Bearer Token", -1),
				q("option", { value: "api_key" }, "API Key", -1),
				q("option", { value: "basic" }, "Basic Auth", -1)
			]], 512), [[Po, n.value.auth]])]),
			q("div", qS, [t[13] ||= q("label", null, "Timeout", -1), H(q("input", {
				"onUpdate:modelValue": t[5] ||= (e) => n.value.timeout = e,
				class: "fb-input",
				type: "number",
				min: "1000"
			}, null, 512), [[
				No,
				n.value.timeout,
				void 0,
				{ number: !0 }
			]])]),
			q("div", JS, [t[14] ||= q("label", null, "Retry", -1), H(q("input", {
				"onUpdate:modelValue": t[6] ||= (e) => n.value.retry = e,
				class: "fb-input",
				type: "number",
				min: "0",
				max: "5"
			}, null, 512), [[
				No,
				n.value.retry,
				void 0,
				{ number: !0 }
			]])])
		]));
	}
}, XS = { class: "fb-field" }, ZS = { class: "fb-field" }, QS = { class: "fb-field" }, $S = { class: "fb-field" }, eC = { class: "fb-field" }, tC = { class: "fb-field" }, nC = { class: "fb-field" }, rC = {
	__name: "PromptConfig",
	props: { node: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = e, n = Y(() => t.node.config);
		return (e, t) => (G(), K("form", null, [
			q("div", XS, [t[8] ||= q("label", null, "Model", -1), H(q("select", {
				"onUpdate:modelValue": t[0] ||= (e) => n.value.model = e,
				class: "fb-select"
			}, [...t[7] ||= [ua("<option value=\"claude-sonnet\">Claude Sonnet</option><option value=\"claude-haiku\">Claude Haiku</option><option value=\"gpt-4o\">GPT-4o</option><option value=\"gpt-4o-mini\">GPT-4o-mini</option><option value=\"gemini-1.5-pro\">Gemini 1.5 Pro</option><option value=\"gemini-flash\">Gemini Flash</option><option value=\"mixtral\">Mixtral</option>", 7)]], 512), [[Po, n.value.model]])]),
			q("div", ZS, [t[9] ||= q("label", null, "System Prompt", -1), H(q("textarea", {
				"onUpdate:modelValue": t[1] ||= (e) => n.value.systemPrompt = e,
				class: "fb-textarea"
			}, null, 512), [[No, n.value.systemPrompt]])]),
			q("div", QS, [t[10] ||= q("label", null, "User Prompt", -1), H(q("textarea", {
				"onUpdate:modelValue": t[2] ||= (e) => n.value.userPrompt = e,
				class: "fb-textarea"
			}, null, 512), [[No, n.value.userPrompt]])]),
			q("div", $S, [q("label", null, "Temperature " + L(n.value.temperature), 1), H(q("input", {
				"onUpdate:modelValue": t[3] ||= (e) => n.value.temperature = e,
				type: "range",
				min: "0",
				max: "1",
				step: "0.1"
			}, null, 512), [[
				No,
				n.value.temperature,
				void 0,
				{ number: !0 }
			]])]),
			q("div", eC, [t[11] ||= q("label", null, "Max Tokens", -1), H(q("input", {
				"onUpdate:modelValue": t[4] ||= (e) => n.value.maxTokens = e,
				class: "fb-input",
				type: "number"
			}, null, 512), [[
				No,
				n.value.maxTokens,
				void 0,
				{ number: !0 }
			]])]),
			q("div", tC, [t[13] ||= q("label", null, "Output Format", -1), H(q("select", {
				"onUpdate:modelValue": t[5] ||= (e) => n.value.outputFormat = e,
				class: "fb-select"
			}, [...t[12] ||= [
				q("option", { value: "text" }, "Plain text", -1),
				q("option", { value: "json" }, "JSON", -1),
				q("option", { value: "markdown" }, "Markdown", -1)
			]], 512), [[Po, n.value.outputFormat]])]),
			q("div", nC, [t[14] ||= q("label", null, "Variants", -1), H(q("input", {
				"onUpdate:modelValue": t[6] ||= (e) => n.value.variants = e,
				class: "fb-input",
				type: "number",
				min: "1",
				max: "5"
			}, null, 512), [[
				No,
				n.value.variants,
				void 0,
				{ number: !0 }
			]])])
		]));
	}
}, iC = { class: "fb-field" }, aC = { class: "fb-field" }, oC = { class: "fb-field" }, sC = /*#__PURE__*/ Xx({
	__name: "JavascriptConfig",
	props: { node: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = e, n = Y(() => t.node.config);
		return (e, t) => (G(), K("form", null, [
			q("div", iC, [t[3] ||= q("label", null, "Code", -1), H(q("textarea", {
				"onUpdate:modelValue": t[0] ||= (e) => n.value.code = e,
				class: "fb-textarea fb-code"
			}, null, 512), [[No, n.value.code]])]),
			q("div", aC, [t[4] ||= q("label", null, "Timeout", -1), H(q("input", {
				"onUpdate:modelValue": t[1] ||= (e) => n.value.timeout = e,
				class: "fb-input",
				type: "number",
				min: "1000",
				max: "30000"
			}, null, 512), [[
				No,
				n.value.timeout,
				void 0,
				{ number: !0 }
			]])]),
			q("div", oC, [t[5] ||= q("label", null, "Memory Limit MB", -1), H(q("input", {
				"onUpdate:modelValue": t[2] ||= (e) => n.value.memoryLimit = e,
				class: "fb-input",
				type: "number",
				min: "16",
				max: "256"
			}, null, 512), [[
				No,
				n.value.memoryLimit,
				void 0,
				{ number: !0 }
			]])])
		]));
	}
}, [["__scopeId", "data-v-0b7483a3"]]), cC = { class: "fb-field" }, lC = ["value"], uC = { class: "fb-field" }, dC = { class: "fb-field" }, fC = { class: "fb-field" }, pC = { class: "fb-field" }, mC = { class: "fb-field" }, hC = {
	__name: "PostConfig",
	props: { node: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = e, n = zx(), r = Y(() => t.node.config);
		return (e, t) => (G(), K("form", null, [
			q("div", cC, [t[6] ||= q("label", null, "Accounts", -1), H(q("select", {
				"onUpdate:modelValue": t[0] ||= (e) => r.value.accounts = e,
				class: "fb-select",
				multiple: ""
			}, [(G(!0), K(W, null, Er(B(n).accounts, (e) => (G(), K("option", {
				key: e.id,
				value: e.id
			}, L(e.name) + " · " + L(e.platform), 9, lC))), 128))], 512), [[Po, r.value.accounts]])]),
			q("div", uC, [t[7] ||= q("label", null, "Caption / Text", -1), H(q("textarea", {
				"onUpdate:modelValue": t[1] ||= (e) => r.value.caption = e,
				class: "fb-textarea"
			}, null, 512), [[No, r.value.caption]])]),
			q("div", dC, [t[8] ||= q("label", null, "Media", -1), H(q("input", {
				"onUpdate:modelValue": t[2] ||= (e) => r.value.media = e,
				class: "fb-input"
			}, null, 512), [[No, r.value.media]])]),
			q("div", fC, [t[10] ||= q("label", null, "Schedule", -1), H(q("select", {
				"onUpdate:modelValue": t[3] ||= (e) => r.value.schedule = e,
				class: "fb-select"
			}, [...t[9] ||= [
				q("option", { value: "now" }, "Publish now", -1),
				q("option", { value: "datetime" }, "At specific datetime", -1),
				q("option", { value: "optimal" }, "Optimal time", -1)
			]], 512), [[Po, r.value.schedule]])]),
			q("div", pC, [t[11] ||= q("label", null, "First Comment", -1), H(q("textarea", {
				"onUpdate:modelValue": t[4] ||= (e) => r.value.firstComment = e,
				class: "fb-textarea"
			}, null, 512), [[No, r.value.firstComment]])]),
			q("div", mC, [t[13] ||= q("label", null, "Failure Behavior", -1), H(q("select", {
				"onUpdate:modelValue": t[5] ||= (e) => r.value.failureBehavior = e,
				class: "fb-select"
			}, [...t[12] ||= [
				q("option", { value: "stop" }, "Stop flow", -1),
				q("option", { value: "skip" }, "Skip platform", -1),
				q("option", { value: "retry" }, "Retry 3x", -1),
				q("option", { value: "notify" }, "Notify only", -1)
			]], 512), [[Po, r.value.failureBehavior]])])
		]));
	}
}, gC = { class: "fb-condition-config" }, _C = { class: "fb-condition-list" }, vC = { class: "fb-condition-row-header" }, yC = ["disabled", "onClick"], bC = { class: "fb-field" }, xC = ["onUpdate:modelValue"], SC = { class: "fb-condition-grid" }, CC = { class: "fb-field" }, wC = ["onUpdate:modelValue", "onChange"], TC = ["value"], EC = { class: "fb-field" }, DC = ["onUpdate:modelValue"], OC = ["value"], kC = {
	key: 0,
	class: "fb-field"
}, AC = ["onUpdate:modelValue"], jC = /*#__PURE__*/ Xx({
	__name: "ConditionConfig",
	props: { node: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = e, n = nv(), r = Y(() => t.node.config), i = [
			{
				value: "string",
				label: "String"
			},
			{
				value: "number",
				label: "Number"
			},
			{
				value: "boolean",
				label: "Boolean"
			},
			{
				value: "array",
				label: "Array"
			},
			{
				value: "object",
				label: "Object"
			}
		], a = {
			string: [
				{
					value: "equals",
					label: "equals"
				},
				{
					value: "not_equals",
					label: "does not equal"
				},
				{
					value: "contains",
					label: "contains"
				},
				{
					value: "not_contains",
					label: "does not contain"
				},
				{
					value: "starts_with",
					label: "starts with"
				},
				{
					value: "ends_with",
					label: "ends with"
				},
				{
					value: "is_empty",
					label: "is empty"
				},
				{
					value: "is_not_empty",
					label: "is not empty"
				}
			],
			number: [
				{
					value: "equals",
					label: "equals"
				},
				{
					value: "not_equals",
					label: "does not equal"
				},
				{
					value: "greater_than",
					label: "is greater than"
				},
				{
					value: "greater_equal",
					label: "is greater than or equal"
				},
				{
					value: "less_than",
					label: "is less than"
				},
				{
					value: "less_equal",
					label: "is less than or equal"
				},
				{
					value: "is_empty",
					label: "is empty"
				},
				{
					value: "is_not_empty",
					label: "is not empty"
				}
			],
			boolean: [
				{
					value: "is_true",
					label: "is true"
				},
				{
					value: "is_false",
					label: "is false"
				},
				{
					value: "equals",
					label: "equals"
				}
			],
			array: [
				{
					value: "contains",
					label: "contains"
				},
				{
					value: "is_empty",
					label: "is empty"
				},
				{
					value: "is_not_empty",
					label: "is not empty"
				}
			],
			object: [
				{
					value: "has_key",
					label: "has key"
				},
				{
					value: "is_empty",
					label: "is empty"
				},
				{
					value: "is_not_empty",
					label: "is not empty"
				}
			]
		}, o = /* @__PURE__ */ new Set([
			"is_empty",
			"is_not_empty",
			"is_true",
			"is_false"
		]);
		U(r, (e) => {
			(!Array.isArray(e.conditions) || !e.conditions.length) && (e.conditions = [f(1)]);
		}, { immediate: !0 });
		function s(e) {
			return a[e] || a.string;
		}
		function c(e) {
			let t = s(e.dataType);
			t.some((t) => t.value === e.operation) || (e.operation = t[0].value);
		}
		function l(e) {
			return !o.has(e);
		}
		function u() {
			r.value.conditions.push(f(r.value.conditions.length + 1));
		}
		function d(e) {
			r.value.conditions.length !== 1 && (n.removeSourceHandleEdges(t.node.id, r.value.conditions[e].id), r.value.conditions.splice(e, 1));
		}
		function f(e) {
			return {
				id: `condition_${Date.now()}_${e}`,
				dataType: "string",
				operation: "equals",
				left: "",
				right: ""
			};
		}
		return (e, t) => (G(), K("form", gC, [q("section", _C, [(G(!0), K(W, null, Er(r.value.conditions, (e, n) => (G(), K("article", {
			key: e.id,
			class: "fb-condition-row"
		}, [
			q("div", vC, [q("strong", null, "Condition " + L(n + 1), 1), q("button", {
				class: "fb-remove-condition",
				type: "button",
				title: "Remove condition",
				disabled: r.value.conditions.length === 1,
				onClick: (e) => d(n)
			}, " - ", 8, yC)]),
			q("div", bC, [t[0] ||= q("label", null, "Value 1", -1), H(q("input", {
				"onUpdate:modelValue": (t) => e.left = t,
				class: "fb-input",
				placeholder: "{{write_caption.meta.tokensUsed}}"
			}, null, 8, xC), [[No, e.left]])]),
			q("div", SC, [q("div", CC, [t[1] ||= q("label", null, "Type", -1), H(q("select", {
				"onUpdate:modelValue": (t) => e.dataType = t,
				class: "fb-select",
				onChange: (t) => c(e)
			}, [(G(), K(W, null, Er(i, (e) => q("option", {
				key: e.value,
				value: e.value
			}, L(e.label), 9, TC)), 64))], 40, wC), [[Po, e.dataType]])]), q("div", EC, [t[2] ||= q("label", null, "Operation", -1), H(q("select", {
				"onUpdate:modelValue": (t) => e.operation = t,
				class: "fb-select"
			}, [(G(!0), K(W, null, Er(s(e.dataType), (e) => (G(), K("option", {
				key: e.value,
				value: e.value
			}, L(e.label), 9, OC))), 128))], 8, DC), [[Po, e.operation]])])]),
			l(e.operation) ? (G(), K("div", kC, [t[3] ||= q("label", null, "Value 2", -1), H(q("input", {
				"onUpdate:modelValue": (t) => e.right = t,
				class: "fb-input",
				placeholder: "300"
			}, null, 8, AC), [[No, e.right]])])) : da("", !0)
		]))), 128))]), q("button", {
			class: "fb-add-condition",
			type: "button",
			onClick: u
		}, "Add condition")]));
	}
}, [["__scopeId", "data-v-7c3490bf"]]), MC = { class: "fb-panel fb-config" }, NC = { class: "fb-panel-header" }, PC = { class: "fb-muted" }, FC = { class: "fb-config-body" }, IC = {
	key: 0,
	class: "fb-config-inner"
}, LC = { class: "fb-field" }, RC = { class: "fb-display-value fb-id-label" }, zC = { class: "fb-field" }, BC = ["value"], VC = { class: "fb-field" }, HC = { class: "fb-display-value" }, UC = {
	key: 1,
	class: "fb-empty"
}, WC = /*#__PURE__*/ Xx({
	__name: "ConfigPanel",
	setup(e) {
		let t = nv(), n = Y(() => t.selectedNode), r = Y(() => M_[n.value?.type]?.label || n.value?.type || ""), i = Y(() => ({
			input: MS,
			http_request: RS,
			http_response: VS,
			rest_api: YS,
			prompt: rC,
			javascript: sC,
			post: hC,
			condition: jC
		})[n.value?.type] || rC);
		return (e, a) => (G(), K("aside", MC, [q("div", NC, [q("div", null, [a[1] ||= q("h2", { class: "fb-panel-title" }, "Properties", -1), q("small", PC, L(n.value ? n.value.name || n.value.id : "No node selected"), 1)])]), q("section", FC, [n.value ? (G(), K("div", IC, [
			q("div", LC, [a[2] ||= q("label", null, "Node ID", -1), q("div", RC, L(n.value.id), 1)]),
			q("div", zC, [a[3] ||= q("label", null, "Node Name", -1), q("input", {
				class: "fb-input",
				value: n.value.name || n.value.id,
				onChange: a[0] ||= (e) => B(t).renameSelectedNode(e.target.value)
			}, null, 40, BC)]),
			q("div", VC, [a[4] ||= q("label", null, "Node Type", -1), q("div", HC, L(r.value), 1)]),
			(G(), ta(Cr(i.value), { node: n.value }, null, 8, ["node"]))
		])) : (G(), K("div", UC, "Select a node to edit its settings."))])]));
	}
}, [["__scopeId", "data-v-3bf0dba8"]]), GC = { class: "fb-log-sidebar" }, KC = { class: "fb-log-sidebar-header" }, qC = ["disabled"], JC = { class: "fb-log-status" }, YC = { class: "fb-log-list" }, XC = ["onClick"], ZC = { class: "fb-log-entry-icon" }, QC = {
	key: 0,
	class: "fb-log-entry-alert"
}, $C = {
	key: 0,
	class: "fb-log-empty"
}, ew = { class: "fb-log-detail" }, tw = { class: "fb-log-detail-header" }, nw = { key: 0 }, rw = { class: "fb-log-detail-actions" }, iw = { class: "fb-log-detail-body" }, aw = {
	key: 0,
	class: "fb-log-error"
}, ow = { class: "fb-log-section-title" }, sw = {
	key: 1,
	class: "fb-log-table"
}, cw = {
	key: 2,
	class: "fb-log-json"
}, lw = {
	key: 1,
	class: "fb-log-placeholder"
}, uw = {
	__name: "RunLog",
	setup(e) {
		let t = lv(), n = /* @__PURE__ */ z(260), r = /* @__PURE__ */ z(null), i = /* @__PURE__ */ z("output"), a = null, o = Y(() => t.log.map((e, t) => ({
			...e,
			key: `${e.at}-${e.nodeId}-${t}`
		}))), s = Y(() => o.value.find((e) => e.key === r.value) || o.value[0] || null), c = Y(() => s.value ? i.value === "input" ? s.value.inputContext || s.value.input || null : s.value.output ?? s.value.error ?? null : null), l = Y(() => v(c.value)), u = Y(() => {
			let e = /* @__PURE__ */ new Set();
			return l.value.forEach((t) => Object.keys(t).forEach((t) => e.add(t))), [...e];
		}), d = Y(() => u.value.length ? l.value : []), f = Y(() => c.value === null || c.value === void 0 ? i.value === "input" ? "No input data captured." : "No output data captured." : JSON.stringify(c.value, null, 2)), p = Y(() => {
			if (!t.log.length) return "No execution yet";
			let e = t.log.find((e) => e.status === "error");
			return e ? `Error in ${e.durationMs}ms` : `${t.status} · ${t.log.length} item${t.log.length === 1 ? "" : "s"}`;
		});
		U(o, (e) => {
			if (!e.length) {
				r.value = null;
				return;
			}
			e.some((e) => e.key === r.value) || (r.value = e[0].key);
		}, { immediate: !0 }), mr(() => {
			_();
		});
		function m(e) {
			r.value = e;
		}
		function h(e) {
			a = {
				y: e.clientY,
				height: n.value
			}, window.addEventListener("mousemove", g), window.addEventListener("mouseup", _);
		}
		function g(e) {
			if (!a) return;
			let t = a.height + a.y - e.clientY, r = Math.max(320, Math.round(window.innerHeight * .72));
			n.value = Math.min(r, Math.max(170, t));
		}
		function _() {
			a = null, window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", _);
		}
		function v(e) {
			let t = y(e);
			return Array.isArray(t) && t.every(b) ? t : b(t) && Object.values(t).every((e) => !b(e) && !Array.isArray(e)) ? [t] : [];
		}
		function y(e) {
			return b(e) && "output" in e && Object.keys(e).some((e) => [
				"status",
				"meta",
				"error"
			].includes(e)) ? e.output : e;
		}
		function b(e) {
			return !!e && typeof e == "object" && !Array.isArray(e);
		}
		function x(e) {
			return e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
		}
		function S(e) {
			return {
				success: "✓",
				error: "!",
				skipped: "-",
				running: "..."
			}[e] || "i";
		}
		return (e, a) => (G(), K("section", {
			class: "fb-run-log",
			style: I({ height: `${n.value}px` })
		}, [
			q("button", {
				class: "fb-log-resize",
				type: "button",
				title: "Resize logs",
				onMousedown: zo(h, ["prevent"])
			}, null, 32),
			q("aside", GC, [
				q("div", KC, [a[3] ||= q("strong", null, "Logs", -1), q("button", {
					type: "button",
					disabled: !B(t).log.length,
					onClick: a[0] ||= (...e) => B(t).clear && B(t).clear(...e)
				}, "Clear execution", 8, qC)]),
				q("p", JC, L(B(t).statusLabel || p.value), 1),
				q("div", YC, [(G(!0), K(W, null, Er(o.value, (e) => (G(), K("button", {
					key: e.key,
					class: le(["fb-log-entry", [`is-${e.status}`, { "is-active": e.key === r.value }]]),
					type: "button",
					onClick: (t) => m(e.key)
				}, [
					q("span", ZC, L(S(e.status)), 1),
					q("span", null, [q("strong", null, L(e.nodeId), 1), q("small", null, L(e.status) + " in " + L(e.durationMs) + "ms", 1)]),
					e.status === "error" ? (G(), K("span", QC, "!")) : da("", !0)
				], 10, XC))), 128)), o.value.length ? da("", !0) : (G(), K("p", $C, "Run the flow to inspect per-node traces."))])
			]),
			q("section", ew, [q("header", tw, [q("div", null, [q("strong", null, L(s.value?.nodeId || "Execution output"), 1), s.value ? (G(), K("span", nw, L(s.value.status) + " in " + L(s.value.durationMs) + "ms ", 1)) : da("", !0)]), q("div", rw, [q("button", {
				type: "button",
				class: le({ "is-active": i.value === "input" }),
				onClick: a[1] ||= (e) => i.value = "input"
			}, " Input ", 2), q("button", {
				type: "button",
				class: le({ "is-active": i.value === "output" }),
				onClick: a[2] ||= (e) => i.value = "output"
			}, " Output ", 2)])]), q("div", iw, [s.value ? (G(), K(W, { key: 0 }, [
				s.value.errorMessage && i.value === "output" ? (G(), K("p", aw, L(s.value.errorMessage), 1)) : da("", !0),
				q("div", ow, L(i.value), 1),
				d.value.length ? (G(), K("table", sw, [q("thead", null, [q("tr", null, [(G(!0), K(W, null, Er(u.value, (e) => (G(), K("th", { key: e }, L(e), 1))), 128))])]), q("tbody", null, [(G(!0), K(W, null, Er(d.value, (e, t) => (G(), K("tr", { key: t }, [(G(!0), K(W, null, Er(u.value, (t) => (G(), K("td", { key: t }, L(x(e[t])), 1))), 128))]))), 128))])])) : (G(), K("pre", cw, L(f.value), 1))
			], 64)) : (G(), K("div", lw, [...a[4] ||= [q("strong", null, "No execution data yet", -1), q("span", null, "Run the workflow or execute a step to see input and output here.", -1)]]))])])
		], 4));
	}
}, dw = ["aria-label"], fw = { class: "fb-execution-topbar" }, pw = { class: "fb-execution-grid" }, mw = { class: "fb-data-pane" }, hw = { key: 0 }, gw = {
	key: 1,
	class: "fb-empty-data"
}, _w = { class: "fb-node-pane" }, vw = { class: "fb-node-pane-header" }, yw = { class: "fb-node-pane-icon" }, bw = { class: "fb-node-config" }, xw = { class: "fb-field" }, Sw = { class: "fb-display-value" }, Cw = { class: "fb-field" }, ww = { class: "fb-display-value" }, Tw = { class: "fb-data-pane" }, Ew = { key: 0 }, Dw = {
	key: 1,
	class: "fb-empty-data"
}, Ow = /*#__PURE__*/ Xx({
	__name: "NodeExecutionView",
	setup(e) {
		let t = nv(), n = lv(), r = Y(() => t.inspectedNode), i = Y(() => M_[r.value?.type] || M_.prompt), a = Y(() => {
			let e = r.value?.name || r.value?.id;
			return n.log.find((t) => t.nodeId === e || t.nodeId === r.value?.id);
		}), o = Y(() => ({
			input: MS,
			http_request: RS,
			http_response: VS,
			rest_api: YS,
			prompt: rC,
			javascript: sC,
			post: hC,
			condition: jC
		})[r.value?.type] || rC);
		function s(e) {
			return JSON.stringify(e, null, 2);
		}
		function c() {
			r.value && (t.setNodeStatus(r.value.id, "success"), n.addLog({
				nodeId: r.value.name || r.value.id,
				status: "success",
				durationMs: 0,
				output: {
					executedStep: !0,
					nodeId: r.value.id,
					nodeName: r.value.name || r.value.id
				}
			}));
		}
		return (e, n) => (G(), K("section", {
			class: "fb-execution-backdrop",
			onClick: n[1] ||= zo((...e) => B(t).closeNodeInspector && B(t).closeNodeInspector(...e), ["self"])
		}, [q("div", {
			class: "fb-execution-modal",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": `${r.value.label} execution details`
		}, [q("header", fw, [q("button", {
			class: "fb-back-btn",
			type: "button",
			onClick: n[0] ||= (...e) => B(t).closeNodeInspector && B(t).closeNodeInspector(...e)
		}, "← Back to canvas"), q("div", null, [q("strong", null, L(r.value.label), 1), q("span", null, L(r.value.name || r.value.id), 1)])]), q("div", pw, [
			q("section", mw, [n[3] ||= q("header", null, "Input", -1), a.value?.inputContext ? (G(), K("pre", hw, L(s(a.value.inputContext)), 1)) : (G(), K("div", gw, [...n[2] ||= [q("strong", null, "No input data yet", -1), q("span", null, "Run the flow to capture the JSON input passed into this node.", -1)]]))]),
			q("section", _w, [q("div", vw, [
				q("span", yw, L(i.value.icon), 1),
				q("div", null, [q("strong", null, L(r.value.label), 1), q("span", null, L(i.value.description), 1)]),
				q("button", {
					class: "fb-execute-step-btn",
					type: "button",
					onClick: c
				}, [...n[4] ||= [q("span", { "aria-hidden": "true" }, "⌬", -1), la(" Execute step ", -1)]])
			]), q("div", bw, [
				q("div", xw, [n[5] ||= q("label", null, "Node ID", -1), q("div", Sw, L(r.value.id), 1)]),
				q("div", Cw, [n[6] ||= q("label", null, "Node Name", -1), q("div", ww, L(r.value.name || r.value.id), 1)]),
				(G(), ta(Cr(o.value), { node: r.value }, null, 8, ["node"]))
			])]),
			q("section", Tw, [n[8] ||= q("header", null, "Output", -1), a.value?.output === void 0 ? (G(), K("div", Dw, [...n[7] ||= [q("strong", null, "No output data yet", -1), q("span", null, "Execute this node or run the flow to view the latest output.", -1)]])) : (G(), K("pre", Ew, L(s(a.value.output)), 1))])
		])], 8, dw)]));
	}
}, [["__scopeId", "data-v-629c2fd5"]]), kw = {
	class: "fb-toast-viewport",
	"aria-live": "polite",
	"aria-atomic": "false"
}, Aw = {
	class: "fb-toast-icon",
	"aria-hidden": "true"
}, jw = { class: "fb-toast-copy" }, Mw = { key: 0 }, Nw = ["onClick"], Pw = /*#__PURE__*/ Xx({
	__name: "ToastViewport",
	setup(e) {
		let t = Yx();
		function n(e) {
			return {
				success: "✓",
				error: "!",
				info: "i"
			}[e] || "i";
		}
		return (e, r) => (G(), K("div", kw, [(G(!0), K(W, null, Er(B(t).items, (e) => (G(), K("article", {
			key: e.id,
			class: le(["fb-toast", `is-${e.type}`])
		}, [
			q("span", Aw, L(n(e.type)), 1),
			q("div", jw, [q("strong", null, L(e.title), 1), e.message ? (G(), K("p", Mw, L(e.message), 1)) : da("", !0)]),
			q("button", {
				type: "button",
				title: "Dismiss",
				onClick: (n) => B(t).dismiss(e.id)
			}, "×", 8, Nw)
		], 2))), 128))]));
	}
}, [["__scopeId", "data-v-8f21b092"]]), Fw = { class: "fb-workspace" }, Iw = {
	key: 1,
	class: "fb-drawer fb-library-drawer"
}, Lw = {
	key: 2,
	class: "fb-drawer fb-properties-drawer"
}, Rw = /*#__PURE__*/ Xx({
	__name: "AppShell",
	setup(e) {
		let t = cv(), n = nv(), r = Nx(), i = Yx(), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(!1);
		dr(() => {
			u();
		});
		function s() {
			o.value = !1, a.value = !0;
		}
		function c() {
			a.value = !1, o.value = !0;
		}
		let l = Y(() => {
			let e = t.theme || {};
			return {
				"--fb-accent": e.accent,
				"--fb-font": e.font,
				"--fb-radius": e.radius
			};
		});
		async function u() {
			if (t.init(), t.flowId) try {
				let e = await r.loadFlow(t.flowId), i = e.data?.data || e.data;
				n.loadFromWorkflow(i);
			} catch (e) {
				if (e.response?.status === 404) return;
				i.show({
					type: "error",
					title: "Could not load flow",
					message: e.response?.data?.message || e.message || "The saved canvas could not be loaded."
				});
			}
		}
		return (e, t) => (G(), K("main", {
			class: "fb-shell",
			style: I(l.value)
		}, [
			J(tS),
			q("section", Fw, [
				J(kS),
				q("div", { class: "fb-canvas-launchers" }, [q("button", {
					class: "fb-launcher-btn",
					type: "button",
					title: "Add node",
					onClick: s
				}, "+")]),
				o.value ? da("", !0) : (G(), K("button", {
					key: 0,
					class: "fb-properties-tab",
					type: "button",
					onClick: c
				}, " Properties ")),
				a.value ? (G(), K("div", Iw, [J(sS), q("button", {
					class: "fb-drawer-close",
					type: "button",
					title: "Close node library",
					onClick: t[0] ||= (e) => a.value = !1
				}, "×")])) : da("", !0),
				o.value ? (G(), K("div", Lw, [J(WC), q("button", {
					class: "fb-drawer-close",
					type: "button",
					title: "Hide properties",
					onClick: t[1] ||= (e) => o.value = !1
				}, "×")])) : da("", !0)
			]),
			J(uw),
			B(n).inspectedNode ? (G(), ta(Ow, { key: 0 })) : da("", !0),
			J(Pw)
		], 4));
	}
}, [["__scopeId", "data-v-d3f3429b"]]), zw = {
	__name: "FlowBuilderApp",
	setup(e) {
		return (e, t) => (G(), ta(Rw));
	}
};
//#endregion
//#region src/embed.js
function Bw(e, t = {}) {
	let n = document.querySelector(e);
	if (!n) throw Error(`FlowBuilder: no element for "${e}"`);
	let r = Uo(zw), i = us();
	return r.use(i), cv(i).init({
		...t,
		mode: "embedded"
	}), zx(i).setAccounts(t.accounts || []), r.mount(n), {
		app: r,
		unmount: () => r.unmount()
	};
}
typeof window < "u" && (window.FlowBuilder = { mount: Bw });
//#endregion
export { Bw as mount };
