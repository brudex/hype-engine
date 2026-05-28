/**
* @vue/shared v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function sr(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Te = {}, Rn = [], Pt = () => {
}, aa = () => !1, Oi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Di = (e) => e.startsWith("onUpdate:"), Xe = Object.assign, rr = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, zc = Object.prototype.hasOwnProperty, Ce = (e, t) => zc.call(e, t), ue = Array.isArray, Vn = (e) => Ro(e) === "[object Map]", ki = (e) => Ro(e) === "[object Set]", Vr = (e) => Ro(e) === "[object Date]", fe = (e) => typeof e == "function", Ve = (e) => typeof e == "string", lt = (e) => typeof e == "symbol", Me = (e) => e !== null && typeof e == "object", ua = (e) => (Me(e) || fe(e)) && fe(e.then) && fe(e.catch), ca = Object.prototype.toString, Ro = (e) => ca.call(e), Hc = (e) => Ro(e).slice(8, -1), da = (e) => Ro(e) === "[object Object]", Ri = (e) => Ve(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, uo = /* @__PURE__ */ sr(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Vi = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Fc = /-\w/g, et = Vi(
  (e) => e.replace(Fc, (t) => t.slice(1).toUpperCase())
), Lc = /\B([A-Z])/g, $n = Vi(
  (e) => e.replace(Lc, "-$1").toLowerCase()
), Bi = Vi((e) => e.charAt(0).toUpperCase() + e.slice(1)), fs = Vi(
  (e) => e ? `on${Bi(e)}` : ""
), ft = (e, t) => !Object.is(e, t), ni = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, fa = (e, t, n, o = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: o,
    value: n
  });
}, zi = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let Br;
const Hi = () => Br || (Br = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function at(e) {
  if (ue(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], i = Ve(o) ? Wc(o) : at(o);
      if (i)
        for (const s in i)
          t[s] = i[s];
    }
    return t;
  } else if (Ve(e) || Me(e))
    return e;
}
const Uc = /;(?![^(]*\))/g, Gc = /:([^]+)/, Yc = /\/\*[^]*?\*\//g;
function Wc(e) {
  const t = {};
  return e.replace(Yc, "").split(Uc).forEach((n) => {
    if (n) {
      const o = n.split(Gc);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function Kt(e) {
  let t = "";
  if (Ve(e))
    t = e;
  else if (ue(e))
    for (let n = 0; n < e.length; n++) {
      const o = Kt(e[n]);
      o && (t += o + " ");
    }
  else if (Me(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Kc = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Xc = /* @__PURE__ */ sr(Kc);
function pa(e) {
  return !!e || e === "";
}
function jc(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let o = 0; n && o < e.length; o++)
    n = Vo(e[o], t[o]);
  return n;
}
function Vo(e, t) {
  if (e === t) return !0;
  let n = Vr(e), o = Vr(t);
  if (n || o)
    return n && o ? e.getTime() === t.getTime() : !1;
  if (n = lt(e), o = lt(t), n || o)
    return e === t;
  if (n = ue(e), o = ue(t), n || o)
    return n && o ? jc(e, t) : !1;
  if (n = Me(e), o = Me(t), n || o) {
    if (!n || !o)
      return !1;
    const i = Object.keys(e).length, s = Object.keys(t).length;
    if (i !== s)
      return !1;
    for (const r in e) {
      const l = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
      if (l && !a || !l && a || !Vo(e[r], t[r]))
        return !1;
    }
  }
  return String(e) === String(t);
}
function qc(e, t) {
  return e.findIndex((n) => Vo(n, t));
}
const ha = (e) => !!(e && e.__v_isRef === !0), he = (e) => Ve(e) ? e : e == null ? "" : ue(e) || Me(e) && (e.toString === ca || !fe(e.toString)) ? ha(e) ? he(e.value) : JSON.stringify(e, ga, 2) : String(e), ga = (e, t) => ha(t) ? ga(e, t.value) : Vn(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [o, i], s) => (n[ps(o, s) + " =>"] = i, n),
    {}
  )
} : ki(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => ps(n))
} : lt(t) ? ps(t) : Me(t) && !ue(t) && !da(t) ? String(t) : t, ps = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    lt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let We;
class va {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.__v_skip = !0, this.parent = We, !t && We && (this.index = (We.scopes || (We.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = We;
      try {
        return We = this, t();
      } finally {
        We = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = We, We = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (We === this)
        We = this.prevScope;
      else {
        let t = We;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, o;
      for (n = 0, o = this.effects.length; n < o; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, o = this.cleanups.length; n < o; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, o = this.scopes.length; n < o; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Fi(e) {
  return new va(e);
}
function Li() {
  return We;
}
function co(e, t = !1) {
  We && We.cleanups.push(e);
}
let Pe;
const hs = /* @__PURE__ */ new WeakSet();
class ma {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, We && We.active && We.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, hs.has(this) && (hs.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || _a(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, zr(this), ba(this);
    const t = Pe, n = vt;
    Pe = this, vt = !0;
    try {
      return this.fn();
    } finally {
      wa(this), Pe = t, vt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        ur(t);
      this.deps = this.depsTail = void 0, zr(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? hs.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Os(this) && this.run();
  }
  get dirty() {
    return Os(this);
  }
}
let ya = 0, fo, po;
function _a(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = po, po = e;
    return;
  }
  e.next = fo, fo = e;
}
function lr() {
  ya++;
}
function ar() {
  if (--ya > 0)
    return;
  if (po) {
    let t = po;
    for (po = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; fo; ) {
    let t = fo;
    for (fo = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (o) {
          e || (e = o);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function ba(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function wa(e) {
  let t, n = e.depsTail, o = n;
  for (; o; ) {
    const i = o.prevDep;
    o.version === -1 ? (o === n && (n = i), ur(o), Zc(o)) : t = o, o.dep.activeLink = o.prevActiveLink, o.prevActiveLink = void 0, o = i;
  }
  e.deps = t, e.depsTail = n;
}
function Os(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (xa(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function xa(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === xo) || (e.globalVersion = xo, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Os(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = Pe, o = vt;
  Pe = e, vt = !0;
  try {
    ba(e);
    const i = e.fn(e._value);
    (t.version === 0 || ft(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    Pe = n, vt = o, wa(e), e.flags &= -3;
  }
}
function ur(e, t = !1) {
  const { dep: n, prevSub: o, nextSub: i } = e;
  if (o && (o.nextSub = i, e.prevSub = void 0), i && (i.prevSub = o, e.nextSub = void 0), n.subs === e && (n.subs = o, !o && n.computed)) {
    n.computed.flags &= -5;
    for (let s = n.computed.deps; s; s = s.nextDep)
      ur(s, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Zc(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let vt = !0;
const Sa = [];
function Xt() {
  Sa.push(vt), vt = !1;
}
function jt() {
  const e = Sa.pop();
  vt = e === void 0 ? !0 : e;
}
function zr(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = Pe;
    Pe = void 0;
    try {
      t();
    } finally {
      Pe = n;
    }
  }
}
let xo = 0;
class Jc {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ui {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!Pe || !vt || Pe === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Pe)
      n = this.activeLink = new Jc(Pe, this), Pe.deps ? (n.prevDep = Pe.depsTail, Pe.depsTail.nextDep = n, Pe.depsTail = n) : Pe.deps = Pe.depsTail = n, Ea(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const o = n.nextDep;
      o.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = o), n.prevDep = Pe.depsTail, n.nextDep = void 0, Pe.depsTail.nextDep = n, Pe.depsTail = n, Pe.deps === n && (Pe.deps = o);
    }
    return n;
  }
  trigger(t) {
    this.version++, xo++, this.notify(t);
  }
  notify(t) {
    lr();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      ar();
    }
  }
}
function Ea(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let o = t.deps; o; o = o.nextDep)
        Ea(o);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const ci = /* @__PURE__ */ new WeakMap(), yn = /* @__PURE__ */ Symbol(
  ""
), Ds = /* @__PURE__ */ Symbol(
  ""
), So = /* @__PURE__ */ Symbol(
  ""
);
function je(e, t, n) {
  if (vt && Pe) {
    let o = ci.get(e);
    o || ci.set(e, o = /* @__PURE__ */ new Map());
    let i = o.get(n);
    i || (o.set(n, i = new Ui()), i.map = o, i.key = n), i.track();
  }
}
function Ft(e, t, n, o, i, s) {
  const r = ci.get(e);
  if (!r) {
    xo++;
    return;
  }
  const l = (a) => {
    a && a.trigger();
  };
  if (lr(), t === "clear")
    r.forEach(l);
  else {
    const a = ue(e), u = a && Ri(n);
    if (a && n === "length") {
      const c = Number(o);
      r.forEach((d, h) => {
        (h === "length" || h === So || !lt(h) && h >= c) && l(d);
      });
    } else
      switch ((n !== void 0 || r.has(void 0)) && l(r.get(n)), u && l(r.get(So)), t) {
        case "add":
          a ? u && l(r.get("length")) : (l(r.get(yn)), Vn(e) && l(r.get(Ds)));
          break;
        case "delete":
          a || (l(r.get(yn)), Vn(e) && l(r.get(Ds)));
          break;
        case "set":
          Vn(e) && l(r.get(yn));
          break;
      }
  }
  ar();
}
function Qc(e, t) {
  const n = ci.get(e);
  return n && n.get(t);
}
function In(e) {
  const t = /* @__PURE__ */ Se(e);
  return t === e ? t : (je(t, "iterate", So), /* @__PURE__ */ st(e) ? t : t.map(yt));
}
function Gi(e) {
  return je(e = /* @__PURE__ */ Se(e), "iterate", So), e;
}
function $t(e, t) {
  return /* @__PURE__ */ qt(e) ? Gn(/* @__PURE__ */ Wt(e) ? yt(t) : t) : yt(t);
}
const ed = {
  __proto__: null,
  [Symbol.iterator]() {
    return gs(this, Symbol.iterator, (e) => $t(this, e));
  },
  concat(...e) {
    return In(this).concat(
      ...e.map((t) => ue(t) ? In(t) : t)
    );
  },
  entries() {
    return gs(this, "entries", (e) => (e[1] = $t(this, e[1]), e));
  },
  every(e, t) {
    return Vt(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Vt(
      this,
      "filter",
      e,
      t,
      (n) => n.map((o) => $t(this, o)),
      arguments
    );
  },
  find(e, t) {
    return Vt(
      this,
      "find",
      e,
      t,
      (n) => $t(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return Vt(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Vt(
      this,
      "findLast",
      e,
      t,
      (n) => $t(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return Vt(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Vt(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return vs(this, "includes", e);
  },
  indexOf(...e) {
    return vs(this, "indexOf", e);
  },
  join(e) {
    return In(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return vs(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Vt(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Qn(this, "pop");
  },
  push(...e) {
    return Qn(this, "push", e);
  },
  reduce(e, ...t) {
    return Hr(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Hr(this, "reduceRight", e, t);
  },
  shift() {
    return Qn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Vt(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Qn(this, "splice", e);
  },
  toReversed() {
    return In(this).toReversed();
  },
  toSorted(e) {
    return In(this).toSorted(e);
  },
  toSpliced(...e) {
    return In(this).toSpliced(...e);
  },
  unshift(...e) {
    return Qn(this, "unshift", e);
  },
  values() {
    return gs(this, "values", (e) => $t(this, e));
  }
};
function gs(e, t, n) {
  const o = Gi(e), i = o[t]();
  return o !== e && !/* @__PURE__ */ st(e) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.done || (s.value = n(s.value)), s;
  }), i;
}
const td = Array.prototype;
function Vt(e, t, n, o, i, s) {
  const r = Gi(e), l = r !== e && !/* @__PURE__ */ st(e), a = r[t];
  if (a !== td[t]) {
    const d = a.apply(e, s);
    return l ? yt(d) : d;
  }
  let u = n;
  r !== e && (l ? u = function(d, h) {
    return n.call(this, $t(e, d), h, e);
  } : n.length > 2 && (u = function(d, h) {
    return n.call(this, d, h, e);
  }));
  const c = a.call(r, u, o);
  return l && i ? i(c) : c;
}
function Hr(e, t, n, o) {
  const i = Gi(e), s = i !== e && !/* @__PURE__ */ st(e);
  let r = n, l = !1;
  i !== e && (s ? (l = o.length === 0, r = function(u, c, d) {
    return l && (l = !1, u = $t(e, u)), n.call(this, u, $t(e, c), d, e);
  }) : n.length > 3 && (r = function(u, c, d) {
    return n.call(this, u, c, d, e);
  }));
  const a = i[t](r, ...o);
  return l ? $t(e, a) : a;
}
function vs(e, t, n) {
  const o = /* @__PURE__ */ Se(e);
  je(o, "iterate", So);
  const i = o[t](...n);
  return (i === -1 || i === !1) && /* @__PURE__ */ Yi(n[0]) ? (n[0] = /* @__PURE__ */ Se(n[0]), o[t](...n)) : i;
}
function Qn(e, t, n = []) {
  Xt(), lr();
  const o = (/* @__PURE__ */ Se(e))[t].apply(e, n);
  return ar(), jt(), o;
}
const nd = /* @__PURE__ */ sr("__proto__,__v_isRef,__isVue"), Na = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(lt)
);
function od(e) {
  lt(e) || (e = String(e));
  const t = /* @__PURE__ */ Se(this);
  return je(t, "has", e), t.hasOwnProperty(e);
}
class Ca {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, o) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, s = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return s;
    if (n === "__v_raw")
      return o === (i ? s ? pd : Ta : s ? Ia : Ma).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(o) ? t : void 0;
    const r = ue(t);
    if (!i) {
      let a;
      if (r && (a = ed[n]))
        return a;
      if (n === "hasOwnProperty")
        return od;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Ae(t) ? t : o
    );
    if ((lt(n) ? Na.has(n) : nd(n)) || (i || je(t, "get", n), s))
      return l;
    if (/* @__PURE__ */ Ae(l)) {
      const a = r && Ri(n) ? l : l.value;
      return i && Me(a) ? /* @__PURE__ */ di(a) : a;
    }
    return Me(l) ? i ? /* @__PURE__ */ di(l) : /* @__PURE__ */ Bo(l) : l;
  }
}
class $a extends Ca {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, o, i) {
    let s = t[n];
    const r = ue(t) && Ri(n);
    if (!this._isShallow) {
      const u = /* @__PURE__ */ qt(s);
      if (!/* @__PURE__ */ st(o) && !/* @__PURE__ */ qt(o) && (s = /* @__PURE__ */ Se(s), o = /* @__PURE__ */ Se(o)), !r && /* @__PURE__ */ Ae(s) && !/* @__PURE__ */ Ae(o))
        return u || (s.value = o), !0;
    }
    const l = r ? Number(n) < t.length : Ce(t, n), a = Reflect.set(
      t,
      n,
      o,
      /* @__PURE__ */ Ae(t) ? t : i
    );
    return t === /* @__PURE__ */ Se(i) && (l ? ft(o, s) && Ft(t, "set", n, o) : Ft(t, "add", n, o)), a;
  }
  deleteProperty(t, n) {
    const o = Ce(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && o && Ft(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const o = Reflect.has(t, n);
    return (!lt(n) || !Na.has(n)) && je(t, "has", n), o;
  }
  ownKeys(t) {
    return je(
      t,
      "iterate",
      ue(t) ? "length" : yn
    ), Reflect.ownKeys(t);
  }
}
class id extends Ca {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const sd = /* @__PURE__ */ new $a(), rd = /* @__PURE__ */ new id(), ld = /* @__PURE__ */ new $a(!0);
const ks = (e) => e, Go = (e) => Reflect.getPrototypeOf(e);
function ad(e, t, n) {
  return function(...o) {
    const i = this.__v_raw, s = /* @__PURE__ */ Se(i), r = Vn(s), l = e === "entries" || e === Symbol.iterator && r, a = e === "keys" && r, u = i[e](...o), c = n ? ks : t ? Gn : yt;
    return !t && je(
      s,
      "iterate",
      a ? Ds : yn
    ), Xe(
      // inheriting all iterator properties
      Object.create(u),
      {
        // iterator protocol
        next() {
          const { value: d, done: h } = u.next();
          return h ? { value: d, done: h } : {
            value: l ? [c(d[0]), c(d[1])] : c(d),
            done: h
          };
        }
      }
    );
  };
}
function Yo(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function ud(e, t) {
  const n = {
    get(i) {
      const s = this.__v_raw, r = /* @__PURE__ */ Se(s), l = /* @__PURE__ */ Se(i);
      e || (ft(i, l) && je(r, "get", i), je(r, "get", l));
      const { has: a } = Go(r), u = t ? ks : e ? Gn : yt;
      if (a.call(r, i))
        return u(s.get(i));
      if (a.call(r, l))
        return u(s.get(l));
      s !== r && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && je(/* @__PURE__ */ Se(i), "iterate", yn), i.size;
    },
    has(i) {
      const s = this.__v_raw, r = /* @__PURE__ */ Se(s), l = /* @__PURE__ */ Se(i);
      return e || (ft(i, l) && je(r, "has", i), je(r, "has", l)), i === l ? s.has(i) : s.has(i) || s.has(l);
    },
    forEach(i, s) {
      const r = this, l = r.__v_raw, a = /* @__PURE__ */ Se(l), u = t ? ks : e ? Gn : yt;
      return !e && je(a, "iterate", yn), l.forEach((c, d) => i.call(s, u(c), u(d), r));
    }
  };
  return Xe(
    n,
    e ? {
      add: Yo("add"),
      set: Yo("set"),
      delete: Yo("delete"),
      clear: Yo("clear")
    } : {
      add(i) {
        const s = /* @__PURE__ */ Se(this), r = Go(s), l = /* @__PURE__ */ Se(i), a = !t && !/* @__PURE__ */ st(i) && !/* @__PURE__ */ qt(i) ? l : i;
        return r.has.call(s, a) || ft(i, a) && r.has.call(s, i) || ft(l, a) && r.has.call(s, l) || (s.add(a), Ft(s, "add", a, a)), this;
      },
      set(i, s) {
        !t && !/* @__PURE__ */ st(s) && !/* @__PURE__ */ qt(s) && (s = /* @__PURE__ */ Se(s));
        const r = /* @__PURE__ */ Se(this), { has: l, get: a } = Go(r);
        let u = l.call(r, i);
        u || (i = /* @__PURE__ */ Se(i), u = l.call(r, i));
        const c = a.call(r, i);
        return r.set(i, s), u ? ft(s, c) && Ft(r, "set", i, s) : Ft(r, "add", i, s), this;
      },
      delete(i) {
        const s = /* @__PURE__ */ Se(this), { has: r, get: l } = Go(s);
        let a = r.call(s, i);
        a || (i = /* @__PURE__ */ Se(i), a = r.call(s, i)), l && l.call(s, i);
        const u = s.delete(i);
        return a && Ft(s, "delete", i, void 0), u;
      },
      clear() {
        const i = /* @__PURE__ */ Se(this), s = i.size !== 0, r = i.clear();
        return s && Ft(
          i,
          "clear",
          void 0,
          void 0
        ), r;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    n[i] = ad(i, e, t);
  }), n;
}
function cr(e, t) {
  const n = ud(e, t);
  return (o, i, s) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? o : Reflect.get(
    Ce(n, i) && i in o ? n : o,
    i,
    s
  );
}
const cd = {
  get: /* @__PURE__ */ cr(!1, !1)
}, dd = {
  get: /* @__PURE__ */ cr(!1, !0)
}, fd = {
  get: /* @__PURE__ */ cr(!0, !1)
};
const Ma = /* @__PURE__ */ new WeakMap(), Ia = /* @__PURE__ */ new WeakMap(), Ta = /* @__PURE__ */ new WeakMap(), pd = /* @__PURE__ */ new WeakMap();
function hd(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function gd(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : hd(Hc(e));
}
// @__NO_SIDE_EFFECTS__
function Bo(e) {
  return /* @__PURE__ */ qt(e) ? e : dr(
    e,
    !1,
    sd,
    cd,
    Ma
  );
}
// @__NO_SIDE_EFFECTS__
function vd(e) {
  return dr(
    e,
    !1,
    ld,
    dd,
    Ia
  );
}
// @__NO_SIDE_EFFECTS__
function di(e) {
  return dr(
    e,
    !0,
    rd,
    fd,
    Ta
  );
}
function dr(e, t, n, o, i) {
  if (!Me(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = gd(e);
  if (s === 0)
    return e;
  const r = i.get(e);
  if (r)
    return r;
  const l = new Proxy(
    e,
    s === 2 ? o : n
  );
  return i.set(e, l), l;
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
  return /* @__PURE__ */ qt(e) ? /* @__PURE__ */ Wt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function st(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Yi(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function Se(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ Se(t) : e;
}
function nt(e) {
  return !Ce(e, "__v_skip") && Object.isExtensible(e) && fa(e, "__v_skip", !0), e;
}
const yt = (e) => Me(e) ? /* @__PURE__ */ Bo(e) : e, Gn = (e) => Me(e) ? /* @__PURE__ */ di(e) : e;
// @__NO_SIDE_EFFECTS__
function Ae(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function De(e) {
  return Pa(e, !1);
}
// @__NO_SIDE_EFFECTS__
function an(e) {
  return Pa(e, !0);
}
function Pa(e, t) {
  return /* @__PURE__ */ Ae(e) ? e : new md(e, t);
}
class md {
  constructor(t, n) {
    this.dep = new Ui(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ Se(t), this._value = n ? t : yt(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, o = this.__v_isShallow || /* @__PURE__ */ st(t) || /* @__PURE__ */ qt(t);
    t = o ? t : /* @__PURE__ */ Se(t), ft(t, n) && (this._rawValue = t, this._value = o ? t : yt(t), this.dep.trigger());
  }
}
function L(e) {
  return /* @__PURE__ */ Ae(e) ? e.value : e;
}
function ye(e) {
  return fe(e) ? e() : L(e);
}
const yd = {
  get: (e, t, n) => t === "__v_raw" ? e : L(Reflect.get(e, t, n)),
  set: (e, t, n, o) => {
    const i = e[t];
    return /* @__PURE__ */ Ae(i) && !/* @__PURE__ */ Ae(n) ? (i.value = n, !0) : Reflect.set(e, t, n, o);
  }
};
function Aa(e) {
  return /* @__PURE__ */ Wt(e) ? e : new Proxy(e, yd);
}
class _d {
  constructor(t) {
    this.__v_isRef = !0, this._value = void 0;
    const n = this.dep = new Ui(), { get: o, set: i } = t(n.track.bind(n), n.trigger.bind(n));
    this._get = o, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(t) {
    this._set(t);
  }
}
function bd(e) {
  return new _d(e);
}
// @__NO_SIDE_EFFECTS__
function Oa(e) {
  const t = ue(e) ? new Array(e.length) : {};
  for (const n in e)
    t[n] = Da(e, n);
  return t;
}
class wd {
  constructor(t, n, o) {
    this._object = t, this._defaultValue = o, this.__v_isRef = !0, this._value = void 0, this._key = lt(n) ? n : String(n), this._raw = /* @__PURE__ */ Se(t);
    let i = !0, s = t;
    if (!ue(t) || lt(this._key) || !Ri(this._key))
      do
        i = !/* @__PURE__ */ Yi(s) || /* @__PURE__ */ st(s);
      while (i && (s = s.__v_raw));
    this._shallow = i;
  }
  get value() {
    let t = this._object[this._key];
    return this._shallow && (t = L(t)), this._value = t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    if (this._shallow && /* @__PURE__ */ Ae(this._raw[this._key])) {
      const n = this._object[this._key];
      if (/* @__PURE__ */ Ae(n)) {
        n.value = t;
        return;
      }
    }
    this._object[this._key] = t;
  }
  get dep() {
    return Qc(this._raw, this._key);
  }
}
class xd {
  constructor(t) {
    this._getter = t, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
// @__NO_SIDE_EFFECTS__
function Oe(e, t, n) {
  return /* @__PURE__ */ Ae(e) ? e : fe(e) ? new xd(e) : Me(e) && arguments.length > 1 ? Da(e, t, n) : /* @__PURE__ */ De(e);
}
function Da(e, t, n) {
  return new wd(e, t, n);
}
class Sd {
  constructor(t, n, o) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Ui(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = xo - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = o;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Pe !== this)
      return _a(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return xa(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function Ed(e, t, n = !1) {
  let o, i;
  return fe(e) ? o = e : (o = e.get, i = e.set), new Sd(o, i, n);
}
const Wo = {}, fi = /* @__PURE__ */ new WeakMap();
let pn;
function Nd(e, t = !1, n = pn) {
  if (n) {
    let o = fi.get(n);
    o || fi.set(n, o = []), o.push(e);
  }
}
function Cd(e, t, n = Te) {
  const { immediate: o, deep: i, once: s, scheduler: r, augmentJob: l, call: a } = n, u = (C) => i ? C : /* @__PURE__ */ st(C) || i === !1 || i === 0 ? Lt(C, 1) : Lt(C);
  let c, d, h, v, N = !1, x = !1;
  if (/* @__PURE__ */ Ae(e) ? (d = () => e.value, N = /* @__PURE__ */ st(e)) : /* @__PURE__ */ Wt(e) ? (d = () => u(e), N = !0) : ue(e) ? (x = !0, N = e.some((C) => /* @__PURE__ */ Wt(C) || /* @__PURE__ */ st(C)), d = () => e.map((C) => {
    if (/* @__PURE__ */ Ae(C))
      return C.value;
    if (/* @__PURE__ */ Wt(C))
      return u(C);
    if (fe(C))
      return a ? a(C, 2) : C();
  })) : fe(e) ? t ? d = a ? () => a(e, 2) : e : d = () => {
    if (h) {
      Xt();
      try {
        h();
      } finally {
        jt();
      }
    }
    const C = pn;
    pn = c;
    try {
      return a ? a(e, 3, [v]) : e(v);
    } finally {
      pn = C;
    }
  } : d = Pt, t && i) {
    const C = d, H = i === !0 ? 1 / 0 : i;
    d = () => Lt(C(), H);
  }
  const M = Li(), E = () => {
    c.stop(), M && M.active && rr(M.effects, c);
  };
  if (s && t) {
    const C = t;
    t = (...H) => {
      C(...H), E();
    };
  }
  let T = x ? new Array(e.length).fill(Wo) : Wo;
  const S = (C) => {
    if (!(!(c.flags & 1) || !c.dirty && !C))
      if (t) {
        const H = c.run();
        if (i || N || (x ? H.some((j, K) => ft(j, T[K])) : ft(H, T))) {
          h && h();
          const j = pn;
          pn = c;
          try {
            const K = [
              H,
              // pass undefined as the old value when it's changed for the first time
              T === Wo ? void 0 : x && T[0] === Wo ? [] : T,
              v
            ];
            T = H, a ? a(t, 3, K) : (
              // @ts-expect-error
              t(...K)
            );
          } finally {
            pn = j;
          }
        }
      } else
        c.run();
  };
  return l && l(S), c = new ma(d), c.scheduler = r ? () => r(S, !1) : S, v = (C) => Nd(C, !1, c), h = c.onStop = () => {
    const C = fi.get(c);
    if (C) {
      if (a)
        a(C, 4);
      else
        for (const H of C) H();
      fi.delete(c);
    }
  }, t ? o ? S(!0) : T = c.run() : r ? r(S.bind(null, !0), !0) : c.run(), E.pause = c.pause.bind(c), E.resume = c.resume.bind(c), E.stop = E, E;
}
function Lt(e, t = 1 / 0, n) {
  if (t <= 0 || !Me(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ Ae(e))
    Lt(e.value, t, n);
  else if (ue(e))
    for (let o = 0; o < e.length; o++)
      Lt(e[o], t, n);
  else if (ki(e) || Vn(e))
    e.forEach((o) => {
      Lt(o, t, n);
    });
  else if (da(e)) {
    for (const o in e)
      Lt(e[o], t, n);
    for (const o of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, o) && Lt(e[o], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function zo(e, t, n, o) {
  try {
    return o ? e(...o) : e();
  } catch (i) {
    Wi(i, t, n);
  }
}
function Dt(e, t, n, o) {
  if (fe(e)) {
    const i = zo(e, t, n, o);
    return i && ua(i) && i.catch((s) => {
      Wi(s, t, n);
    }), i;
  }
  if (ue(e)) {
    const i = [];
    for (let s = 0; s < e.length; s++)
      i.push(Dt(e[s], t, n, o));
    return i;
  }
}
function Wi(e, t, n, o = !0) {
  const i = t ? t.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: r } = t && t.appContext.config || Te;
  if (t) {
    let l = t.parent;
    const a = t.proxy, u = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const c = l.ec;
      if (c) {
        for (let d = 0; d < c.length; d++)
          if (c[d](e, a, u) === !1)
            return;
      }
      l = l.parent;
    }
    if (s) {
      Xt(), zo(s, null, 10, [
        e,
        a,
        u
      ]), jt();
      return;
    }
  }
  $d(e, n, i, o, r);
}
function $d(e, t, n, o = !0, i = !1) {
  if (i)
    throw e;
  console.error(e);
}
const Je = [];
let Nt = -1;
const Bn = [];
let rn = null, On = 0;
const ka = /* @__PURE__ */ Promise.resolve();
let pi = null;
function rt(e) {
  const t = pi || ka;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Md(e) {
  let t = Nt + 1, n = Je.length;
  for (; t < n; ) {
    const o = t + n >>> 1, i = Je[o], s = Eo(i);
    s < e || s === e && i.flags & 2 ? t = o + 1 : n = o;
  }
  return t;
}
function fr(e) {
  if (!(e.flags & 1)) {
    const t = Eo(e), n = Je[Je.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Eo(n) ? Je.push(e) : Je.splice(Md(t), 0, e), e.flags |= 1, Ra();
  }
}
function Ra() {
  pi || (pi = ka.then(Ba));
}
function Id(e) {
  ue(e) ? Bn.push(...e) : rn && e.id === -1 ? rn.splice(On + 1, 0, e) : e.flags & 1 || (Bn.push(e), e.flags |= 1), Ra();
}
function Fr(e, t, n = Nt + 1) {
  for (; n < Je.length; n++) {
    const o = Je[n];
    if (o && o.flags & 2) {
      if (e && o.id !== e.uid)
        continue;
      Je.splice(n, 1), n--, o.flags & 4 && (o.flags &= -2), o(), o.flags & 4 || (o.flags &= -2);
    }
  }
}
function Va(e) {
  if (Bn.length) {
    const t = [...new Set(Bn)].sort(
      (n, o) => Eo(n) - Eo(o)
    );
    if (Bn.length = 0, rn) {
      rn.push(...t);
      return;
    }
    for (rn = t, On = 0; On < rn.length; On++) {
      const n = rn[On];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    rn = null, On = 0;
  }
}
const Eo = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Ba(e) {
  try {
    for (Nt = 0; Nt < Je.length; Nt++) {
      const t = Je[Nt];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), zo(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Nt < Je.length; Nt++) {
      const t = Je[Nt];
      t && (t.flags &= -2);
    }
    Nt = -1, Je.length = 0, Va(), pi = null, (Je.length || Bn.length) && Ba();
  }
}
let Ke = null, za = null;
function hi(e) {
  const t = Ke;
  return Ke = e, za = e && e.type.__scopeId || null, t;
}
function No(e, t = Ke, n) {
  if (!t || e._n)
    return e;
  const o = (...i) => {
    o._d && mi(-1);
    const s = hi(t);
    let r;
    try {
      r = e(...i);
    } finally {
      hi(s), o._d && mi(1);
    }
    return r;
  };
  return o._n = !0, o._c = !0, o._d = !0, o;
}
function _e(e, t) {
  if (Ke === null)
    return e;
  const n = Zi(Ke), o = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [s, r, l, a = Te] = t[i];
    s && (fe(s) && (s = {
      mounted: s,
      updated: s
    }), s.deep && Lt(r), o.push({
      dir: s,
      instance: n,
      value: r,
      oldValue: void 0,
      arg: l,
      modifiers: a
    }));
  }
  return e;
}
function dn(e, t, n, o) {
  const i = e.dirs, s = t && t.dirs;
  for (let r = 0; r < i.length; r++) {
    const l = i[r];
    s && (l.oldValue = s[r].value);
    let a = l.dir[o];
    a && (Xt(), Dt(a, n, 8, [
      e.el,
      l,
      e,
      t
    ]), jt());
  }
}
function Sn(e, t) {
  if (qe) {
    let n = qe.provides;
    const o = qe.parent && qe.parent.provides;
    o === n && (n = qe.provides = Object.create(o)), n[e] = t;
  }
}
function mt(e, t, n = !1) {
  const o = tn();
  if (o || _n) {
    let i = _n ? _n._context.provides : o ? o.parent == null || o.ce ? o.vnode.appContext && o.vnode.appContext.provides : o.parent.provides : void 0;
    if (i && e in i)
      return i[e];
    if (arguments.length > 1)
      return n && fe(t) ? t.call(o && o.proxy) : t;
  }
}
function Td() {
  return !!(tn() || _n);
}
const Pd = /* @__PURE__ */ Symbol.for("v-scx"), Ad = () => mt(Pd);
function be(e, t, n) {
  return Ha(e, t, n);
}
function Ha(e, t, n = Te) {
  const { immediate: o, deep: i, flush: s, once: r } = n, l = Xe({}, n), a = t && o || !t && s !== "post";
  let u;
  if ($o) {
    if (s === "sync") {
      const v = Ad();
      u = v.__watcherHandles || (v.__watcherHandles = []);
    } else if (!a) {
      const v = () => {
      };
      return v.stop = Pt, v.resume = Pt, v.pause = Pt, v;
    }
  }
  const c = qe;
  l.call = (v, N, x) => Dt(v, c, N, x);
  let d = !1;
  s === "post" ? l.scheduler = (v) => {
    tt(v, c && c.suspense);
  } : s !== "sync" && (d = !0, l.scheduler = (v, N) => {
    N ? v() : fr(v);
  }), l.augmentJob = (v) => {
    t && (v.flags |= 4), d && (v.flags |= 2, c && (v.id = c.uid, v.i = c));
  };
  const h = Cd(e, t, l);
  return $o && (u ? u.push(h) : a && h()), h;
}
function Od(e, t, n) {
  const o = this.proxy, i = Ve(e) ? e.includes(".") ? Fa(o, e) : () => o[e] : e.bind(o, o);
  let s;
  fe(t) ? s = t : (s = t.handler, n = t);
  const r = Ho(this), l = Ha(i, s.bind(o), n);
  return r(), l;
}
function Fa(e, t) {
  const n = t.split(".");
  return () => {
    let o = e;
    for (let i = 0; i < n.length && o; i++)
      o = o[n[i]];
    return o;
  };
}
const Dd = /* @__PURE__ */ Symbol("_vte"), kd = (e) => e.__isTeleport, Rd = /* @__PURE__ */ Symbol("_leaveCb");
function pr(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, pr(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function ze(e, t) {
  return fe(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Xe({ name: e.name }, t, { setup: e })
  ) : e;
}
function La(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Lr(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const gi = /* @__PURE__ */ new WeakMap();
function ho(e, t, n, o, i = !1) {
  if (ue(e)) {
    e.forEach(
      (x, M) => ho(
        x,
        t && (ue(t) ? t[M] : t),
        n,
        o,
        i
      )
    );
    return;
  }
  if (zn(o) && !i) {
    o.shapeFlag & 512 && o.type.__asyncResolved && o.component.subTree.component && ho(e, t, n, o.component.subTree);
    return;
  }
  const s = o.shapeFlag & 4 ? Zi(o.component) : o.el, r = i ? null : s, { i: l, r: a } = e, u = t && t.r, c = l.refs === Te ? l.refs = {} : l.refs, d = l.setupState, h = /* @__PURE__ */ Se(d), v = d === Te ? aa : (x) => Lr(c, x) ? !1 : Ce(h, x), N = (x, M) => !(M && Lr(c, M));
  if (u != null && u !== a) {
    if (Ur(t), Ve(u))
      c[u] = null, v(u) && (d[u] = null);
    else if (/* @__PURE__ */ Ae(u)) {
      const x = t;
      N(u, x.k) && (u.value = null), x.k && (c[x.k] = null);
    }
  }
  if (fe(a))
    zo(a, l, 12, [r, c]);
  else {
    const x = Ve(a), M = /* @__PURE__ */ Ae(a);
    if (x || M) {
      const E = () => {
        if (e.f) {
          const T = x ? v(a) ? d[a] : c[a] : N() || !e.k ? a.value : c[e.k];
          if (i)
            ue(T) && rr(T, s);
          else if (ue(T))
            T.includes(s) || T.push(s);
          else if (x)
            c[a] = [s], v(a) && (d[a] = c[a]);
          else {
            const S = [s];
            N(a, e.k) && (a.value = S), e.k && (c[e.k] = S);
          }
        } else x ? (c[a] = r, v(a) && (d[a] = r)) : M && (N(a, e.k) && (a.value = r), e.k && (c[e.k] = r));
      };
      if (r) {
        const T = () => {
          E(), gi.delete(e);
        };
        T.id = -1, gi.set(e, T), tt(T, n);
      } else
        Ur(e), E();
    }
  }
}
function Ur(e) {
  const t = gi.get(e);
  t && (t.flags |= 8, gi.delete(e));
}
Hi().requestIdleCallback;
Hi().cancelIdleCallback;
const zn = (e) => !!e.type.__asyncLoader, Ua = (e) => e.type.__isKeepAlive;
function Vd(e, t) {
  Ga(e, "a", t);
}
function Bd(e, t) {
  Ga(e, "da", t);
}
function Ga(e, t, n = qe) {
  const o = e.__wdc || (e.__wdc = () => {
    let i = n;
    for (; i; ) {
      if (i.isDeactivated)
        return;
      i = i.parent;
    }
    return e();
  });
  if (Ki(t, o, n), n) {
    let i = n.parent;
    for (; i && i.parent; )
      Ua(i.parent.vnode) && zd(o, t, n, i), i = i.parent;
  }
}
function zd(e, t, n, o) {
  const i = Ki(
    t,
    e,
    o,
    !0
    /* prepend */
  );
  hr(() => {
    rr(o[t], i);
  }, n);
}
function Ki(e, t, n = qe, o = !1) {
  if (n) {
    const i = n[e] || (n[e] = []), s = t.__weh || (t.__weh = (...r) => {
      Xt();
      const l = Ho(n), a = Dt(t, n, e, r);
      return l(), jt(), a;
    });
    return o ? i.unshift(s) : i.push(s), s;
  }
}
const en = (e) => (t, n = qe) => {
  (!$o || e === "sp") && Ki(e, (...o) => t(...o), n);
}, Ya = en("bm"), kt = en("m"), Hd = en(
  "bu"
), Fd = en("u"), Xi = en(
  "bum"
), hr = en("um"), Ld = en(
  "sp"
), Ud = en("rtg"), Gd = en("rtc");
function Yd(e, t = qe) {
  Ki("ec", e, t);
}
const Wa = "components";
function Ka(e, t) {
  return ja(Wa, e, !0, t) || e;
}
const Xa = /* @__PURE__ */ Symbol.for("v-ndc");
function gr(e) {
  return Ve(e) ? ja(Wa, e, !1) || e : e || Xa;
}
function ja(e, t, n = !0, o = !1) {
  const i = Ke || qe;
  if (i) {
    const s = i.type;
    {
      const l = Pf(
        s,
        !1
      );
      if (l && (l === t || l === et(t) || l === Bi(et(t))))
        return s;
    }
    const r = (
      // local registration
      // check instance[type] first which is resolved for options API
      Gr(i[e] || s[e], t) || // global registration
      Gr(i.appContext[e], t)
    );
    return !r && o ? s : r;
  }
}
function Gr(e, t) {
  return e && (e[t] || e[et(t)] || e[Bi(et(t))]);
}
function ct(e, t, n, o) {
  let i;
  const s = n && n[o], r = ue(e);
  if (r || Ve(e)) {
    const l = r && /* @__PURE__ */ Wt(e);
    let a = !1, u = !1;
    l && (a = !/* @__PURE__ */ st(e), u = /* @__PURE__ */ qt(e), e = Gi(e)), i = new Array(e.length);
    for (let c = 0, d = e.length; c < d; c++)
      i[c] = t(
        a ? u ? Gn(yt(e[c])) : yt(e[c]) : e[c],
        c,
        void 0,
        s && s[c]
      );
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let l = 0; l < e; l++)
      i[l] = t(l + 1, l, void 0, s && s[l]);
  } else if (Me(e))
    if (e[Symbol.iterator])
      i = Array.from(
        e,
        (l, a) => t(l, a, void 0, s && s[a])
      );
    else {
      const l = Object.keys(e);
      i = new Array(l.length);
      for (let a = 0, u = l.length; a < u; a++) {
        const c = l[a];
        i[a] = t(e[c], c, a, s && s[a]);
      }
    }
  else
    i = [];
  return n && (n[o] = i), i;
}
function At(e, t, n = {}, o, i) {
  if (Ke.ce || Ke.parent && zn(Ke.parent) && Ke.parent.ce) {
    const u = Object.keys(n).length > 0;
    return t !== "default" && (n.name = t), U(), Be(
      Ne,
      null,
      [we("slot", n, o && o())],
      u ? -2 : 64
    );
  }
  let s = e[t];
  s && s._c && (s._d = !1), U();
  const r = s && qa(s(n)), l = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  r && r.key, a = Be(
    Ne,
    {
      key: (l && !lt(l) ? l : `_${t}`) + // #7256 force differentiate fallback content from actual content
      (!r && o ? "_fb" : "")
    },
    r || (o ? o() : []),
    r && e._ === 1 ? 64 : -2
  );
  return a.scopeId && (a.slotScopeIds = [a.scopeId + "-s"]), s && s._c && (s._d = !0), a;
}
function qa(e) {
  return e.some((t) => Co(t) ? !(t.type === Zt || t.type === Ne && !qa(t.children)) : !0) ? e : null;
}
const Rs = (e) => e ? yu(e) ? Zi(e) : Rs(e.parent) : null, go = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Xe(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Rs(e.parent),
    $root: (e) => Rs(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Qa(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      fr(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = rt.bind(e.proxy)),
    $watch: (e) => Od.bind(e)
  })
), ms = (e, t) => e !== Te && !e.__isScriptSetup && Ce(e, t), Wd = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: o, data: i, props: s, accessCache: r, type: l, appContext: a } = e;
    if (t[0] !== "$") {
      const h = r[t];
      if (h !== void 0)
        switch (h) {
          case 1:
            return o[t];
          case 2:
            return i[t];
          case 4:
            return n[t];
          case 3:
            return s[t];
        }
      else {
        if (ms(o, t))
          return r[t] = 1, o[t];
        if (i !== Te && Ce(i, t))
          return r[t] = 2, i[t];
        if (Ce(s, t))
          return r[t] = 3, s[t];
        if (n !== Te && Ce(n, t))
          return r[t] = 4, n[t];
        Vs && (r[t] = 0);
      }
    }
    const u = go[t];
    let c, d;
    if (u)
      return t === "$attrs" && je(e.attrs, "get", ""), u(e);
    if (
      // css module (injected by vue-loader)
      (c = l.__cssModules) && (c = c[t])
    )
      return c;
    if (n !== Te && Ce(n, t))
      return r[t] = 4, n[t];
    if (
      // global properties
      d = a.config.globalProperties, Ce(d, t)
    )
      return d[t];
  },
  set({ _: e }, t, n) {
    const { data: o, setupState: i, ctx: s } = e;
    return ms(i, t) ? (i[t] = n, !0) : o !== Te && Ce(o, t) ? (o[t] = n, !0) : Ce(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (s[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: o, appContext: i, props: s, type: r }
  }, l) {
    let a;
    return !!(n[l] || e !== Te && l[0] !== "$" && Ce(e, l) || ms(t, l) || Ce(s, l) || Ce(o, l) || Ce(go, l) || Ce(i.config.globalProperties, l) || (a = r.__cssModules) && a[l]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : Ce(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Kd() {
  return Za().slots;
}
function Xd() {
  return Za().attrs;
}
function Za(e) {
  const t = tn();
  return t.setupContext || (t.setupContext = bu(t));
}
function Yr(e) {
  return ue(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
function jd(e, t) {
  const n = {};
  for (const o in e)
    t.includes(o) || Object.defineProperty(n, o, {
      enumerable: !0,
      get: () => e[o]
    });
  return n;
}
let Vs = !0;
function qd(e) {
  const t = Qa(e), n = e.proxy, o = e.ctx;
  Vs = !1, t.beforeCreate && Wr(t.beforeCreate, e, "bc");
  const {
    // state
    data: i,
    computed: s,
    methods: r,
    watch: l,
    provide: a,
    inject: u,
    // lifecycle
    created: c,
    beforeMount: d,
    mounted: h,
    beforeUpdate: v,
    updated: N,
    activated: x,
    deactivated: M,
    beforeDestroy: E,
    beforeUnmount: T,
    destroyed: S,
    unmounted: C,
    render: H,
    renderTracked: j,
    renderTriggered: K,
    errorCaptured: F,
    serverPrefetch: G,
    // public API
    expose: X,
    inheritAttrs: Y,
    // assets
    components: P,
    directives: oe,
    filters: $
  } = t;
  if (u && Zd(u, o, null), r)
    for (const k in r) {
      const V = r[k];
      fe(V) && (o[k] = V.bind(n));
    }
  if (i) {
    const k = i.call(n, n);
    Me(k) && (e.data = /* @__PURE__ */ Bo(k));
  }
  if (Vs = !0, s)
    for (const k in s) {
      const V = s[k], q = fe(V) ? V.bind(n, n) : fe(V.get) ? V.get.bind(n, n) : Pt, Z = !fe(V) && fe(V.set) ? V.set.bind(n) : Pt, ee = se({
        get: q,
        set: Z
      });
      Object.defineProperty(o, k, {
        enumerable: !0,
        configurable: !0,
        get: () => ee.value,
        set: (re) => ee.value = re
      });
    }
  if (l)
    for (const k in l)
      Ja(l[k], o, n, k);
  if (a) {
    const k = fe(a) ? a.call(n) : a;
    Reflect.ownKeys(k).forEach((V) => {
      Sn(V, k[V]);
    });
  }
  c && Wr(c, e, "c");
  function I(k, V) {
    ue(V) ? V.forEach((q) => k(q.bind(n))) : V && k(V.bind(n));
  }
  if (I(Ya, d), I(kt, h), I(Hd, v), I(Fd, N), I(Vd, x), I(Bd, M), I(Yd, F), I(Gd, j), I(Ud, K), I(Xi, T), I(hr, C), I(Ld, G), ue(X))
    if (X.length) {
      const k = e.exposed || (e.exposed = {});
      X.forEach((V) => {
        Object.defineProperty(k, V, {
          get: () => n[V],
          set: (q) => n[V] = q,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  H && e.render === Pt && (e.render = H), Y != null && (e.inheritAttrs = Y), P && (e.components = P), oe && (e.directives = oe), G && La(e);
}
function Zd(e, t, n = Pt) {
  ue(e) && (e = Bs(e));
  for (const o in e) {
    const i = e[o];
    let s;
    Me(i) ? "default" in i ? s = mt(
      i.from || o,
      i.default,
      !0
    ) : s = mt(i.from || o) : s = mt(i), /* @__PURE__ */ Ae(s) ? Object.defineProperty(t, o, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (r) => s.value = r
    }) : t[o] = s;
  }
}
function Wr(e, t, n) {
  Dt(
    ue(e) ? e.map((o) => o.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Ja(e, t, n, o) {
  let i = o.includes(".") ? Fa(n, o) : () => n[o];
  if (Ve(e)) {
    const s = t[e];
    fe(s) && be(i, s);
  } else if (fe(e))
    be(i, e.bind(n));
  else if (Me(e))
    if (ue(e))
      e.forEach((s) => Ja(s, t, n, o));
    else {
      const s = fe(e.handler) ? e.handler.bind(n) : t[e.handler];
      fe(s) && be(i, s, e);
    }
}
function Qa(e) {
  const t = e.type, { mixins: n, extends: o } = t, {
    mixins: i,
    optionsCache: s,
    config: { optionMergeStrategies: r }
  } = e.appContext, l = s.get(t);
  let a;
  return l ? a = l : !i.length && !n && !o ? a = t : (a = {}, i.length && i.forEach(
    (u) => vi(a, u, r, !0)
  ), vi(a, t, r)), Me(t) && s.set(t, a), a;
}
function vi(e, t, n, o = !1) {
  const { mixins: i, extends: s } = t;
  s && vi(e, s, n, !0), i && i.forEach(
    (r) => vi(e, r, n, !0)
  );
  for (const r in t)
    if (!(o && r === "expose")) {
      const l = Jd[r] || n && n[r];
      e[r] = l ? l(e[r], t[r]) : t[r];
    }
  return e;
}
const Jd = {
  data: Kr,
  props: Xr,
  emits: Xr,
  // objects
  methods: oo,
  computed: oo,
  // lifecycle
  beforeCreate: Ze,
  created: Ze,
  beforeMount: Ze,
  mounted: Ze,
  beforeUpdate: Ze,
  updated: Ze,
  beforeDestroy: Ze,
  beforeUnmount: Ze,
  destroyed: Ze,
  unmounted: Ze,
  activated: Ze,
  deactivated: Ze,
  errorCaptured: Ze,
  serverPrefetch: Ze,
  // assets
  components: oo,
  directives: oo,
  // watch
  watch: ef,
  // provide / inject
  provide: Kr,
  inject: Qd
};
function Kr(e, t) {
  return t ? e ? function() {
    return Xe(
      fe(e) ? e.call(this, this) : e,
      fe(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Qd(e, t) {
  return oo(Bs(e), Bs(t));
}
function Bs(e) {
  if (ue(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Ze(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function oo(e, t) {
  return e ? Xe(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Xr(e, t) {
  return e ? ue(e) && ue(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Xe(
    /* @__PURE__ */ Object.create(null),
    Yr(e),
    Yr(t ?? {})
  ) : t;
}
function ef(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Xe(/* @__PURE__ */ Object.create(null), e);
  for (const o in t)
    n[o] = Ze(e[o], t[o]);
  return n;
}
function eu() {
  return {
    app: null,
    config: {
      isNativeTag: aa,
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
let tf = 0;
function nf(e, t) {
  return function(o, i = null) {
    fe(o) || (o = Xe({}, o)), i != null && !Me(i) && (i = null);
    const s = eu(), r = /* @__PURE__ */ new WeakSet(), l = [];
    let a = !1;
    const u = s.app = {
      _uid: tf++,
      _component: o,
      _props: i,
      _container: null,
      _context: s,
      _instance: null,
      version: Df,
      get config() {
        return s.config;
      },
      set config(c) {
      },
      use(c, ...d) {
        return r.has(c) || (c && fe(c.install) ? (r.add(c), c.install(u, ...d)) : fe(c) && (r.add(c), c(u, ...d))), u;
      },
      mixin(c) {
        return s.mixins.includes(c) || s.mixins.push(c), u;
      },
      component(c, d) {
        return d ? (s.components[c] = d, u) : s.components[c];
      },
      directive(c, d) {
        return d ? (s.directives[c] = d, u) : s.directives[c];
      },
      mount(c, d, h) {
        if (!a) {
          const v = u._ceVNode || we(o, i);
          return v.appContext = s, h === !0 ? h = "svg" : h === !1 && (h = void 0), e(v, c, h), a = !0, u._container = c, c.__vue_app__ = u, Zi(v.component);
        }
      },
      onUnmount(c) {
        l.push(c);
      },
      unmount() {
        a && (Dt(
          l,
          u._instance,
          16
        ), e(null, u._container), delete u._container.__vue_app__);
      },
      provide(c, d) {
        return s.provides[c] = d, u;
      },
      runWithContext(c) {
        const d = _n;
        _n = u;
        try {
          return c();
        } finally {
          _n = d;
        }
      }
    };
    return u;
  };
}
let _n = null;
const of = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${et(t)}Modifiers`] || e[`${$n(t)}Modifiers`];
function sf(e, t, ...n) {
  if (e.isUnmounted) return;
  const o = e.vnode.props || Te;
  let i = n;
  const s = t.startsWith("update:"), r = s && of(o, t.slice(7));
  r && (r.trim && (i = n.map((c) => Ve(c) ? c.trim() : c)), r.number && (i = n.map(zi)));
  let l, a = o[l = fs(t)] || // also try camelCase event handler (#2249)
  o[l = fs(et(t))];
  !a && s && (a = o[l = fs($n(t))]), a && Dt(
    a,
    e,
    6,
    i
  );
  const u = o[l + "Once"];
  if (u) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, Dt(
      u,
      e,
      6,
      i
    );
  }
}
const rf = /* @__PURE__ */ new WeakMap();
function tu(e, t, n = !1) {
  const o = n ? rf : t.emitsCache, i = o.get(e);
  if (i !== void 0)
    return i;
  const s = e.emits;
  let r = {}, l = !1;
  if (!fe(e)) {
    const a = (u) => {
      const c = tu(u, t, !0);
      c && (l = !0, Xe(r, c));
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !s && !l ? (Me(e) && o.set(e, null), null) : (ue(s) ? s.forEach((a) => r[a] = null) : Xe(r, s), Me(e) && o.set(e, r), r);
}
function ji(e, t) {
  return !e || !Oi(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), Ce(e, t[0].toLowerCase() + t.slice(1)) || Ce(e, $n(t)) || Ce(e, t));
}
function jr(e) {
  const {
    type: t,
    vnode: n,
    proxy: o,
    withProxy: i,
    propsOptions: [s],
    slots: r,
    attrs: l,
    emit: a,
    render: u,
    renderCache: c,
    props: d,
    data: h,
    setupState: v,
    ctx: N,
    inheritAttrs: x
  } = e, M = hi(e);
  let E, T;
  try {
    if (n.shapeFlag & 4) {
      const C = i || o, H = C;
      E = Mt(
        u.call(
          H,
          C,
          c,
          d,
          v,
          h,
          N
        )
      ), T = l;
    } else {
      const C = t;
      E = Mt(
        C.length > 1 ? C(
          d,
          { attrs: l, slots: r, emit: a }
        ) : C(
          d,
          null
        )
      ), T = t.props ? l : lf(l);
    }
  } catch (C) {
    vo.length = 0, Wi(C, e, 1), E = we(Zt);
  }
  let S = E;
  if (T && x !== !1) {
    const C = Object.keys(T), { shapeFlag: H } = S;
    C.length && H & 7 && (s && C.some(Di) && (T = af(
      T,
      s
    )), S = Wn(S, T, !1, !0));
  }
  return n.dirs && (S = Wn(S, null, !1, !0), S.dirs = S.dirs ? S.dirs.concat(n.dirs) : n.dirs), n.transition && pr(S, n.transition), E = S, hi(M), E;
}
const lf = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || Oi(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, af = (e, t) => {
  const n = {};
  for (const o in e)
    (!Di(o) || !(o.slice(9) in t)) && (n[o] = e[o]);
  return n;
};
function uf(e, t, n) {
  const { props: o, children: i, component: s } = e, { props: r, children: l, patchFlag: a } = t, u = s.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return o ? qr(o, r, u) : !!r;
    if (a & 8) {
      const c = t.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const h = c[d];
        if (nu(r, o, h) && !ji(u, h))
          return !0;
      }
    }
  } else
    return (i || l) && (!l || !l.$stable) ? !0 : o === r ? !1 : o ? r ? qr(o, r, u) : !0 : !!r;
  return !1;
}
function qr(e, t, n) {
  const o = Object.keys(t);
  if (o.length !== Object.keys(e).length)
    return !0;
  for (let i = 0; i < o.length; i++) {
    const s = o[i];
    if (nu(t, e, s) && !ji(n, s))
      return !0;
  }
  return !1;
}
function nu(e, t, n) {
  const o = e[n], i = t[n];
  return n === "style" && Me(o) && Me(i) ? !Vo(o, i) : o !== i;
}
function cf({ vnode: e, parent: t, suspense: n }, o) {
  for (; t; ) {
    const i = t.subTree;
    if (i.suspense && i.suspense.activeBranch === e && (i.suspense.vnode.el = i.el = o, e = i), i === e)
      (e = t.vnode).el = o, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = o);
}
const ou = {}, iu = () => Object.create(ou), su = (e) => Object.getPrototypeOf(e) === ou;
function df(e, t, n, o = !1) {
  const i = {}, s = iu();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), ru(e, t, i, s);
  for (const r in e.propsOptions[0])
    r in i || (i[r] = void 0);
  n ? e.props = o ? i : /* @__PURE__ */ vd(i) : e.type.props ? e.props = i : e.props = s, e.attrs = s;
}
function ff(e, t, n, o) {
  const {
    props: i,
    attrs: s,
    vnode: { patchFlag: r }
  } = e, l = /* @__PURE__ */ Se(i), [a] = e.propsOptions;
  let u = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (o || r > 0) && !(r & 16)
  ) {
    if (r & 8) {
      const c = e.vnode.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        let h = c[d];
        if (ji(e.emitsOptions, h))
          continue;
        const v = t[h];
        if (a)
          if (Ce(s, h))
            v !== s[h] && (s[h] = v, u = !0);
          else {
            const N = et(h);
            i[N] = zs(
              a,
              l,
              N,
              v,
              e,
              !1
            );
          }
        else
          v !== s[h] && (s[h] = v, u = !0);
      }
    }
  } else {
    ru(e, t, i, s) && (u = !0);
    let c;
    for (const d in l)
      (!t || // for camelCase
      !Ce(t, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = $n(d)) === d || !Ce(t, c))) && (a ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[c] !== void 0) && (i[d] = zs(
        a,
        l,
        d,
        void 0,
        e,
        !0
      )) : delete i[d]);
    if (s !== l)
      for (const d in s)
        (!t || !Ce(t, d)) && (delete s[d], u = !0);
  }
  u && Ft(e.attrs, "set", "");
}
function ru(e, t, n, o) {
  const [i, s] = e.propsOptions;
  let r = !1, l;
  if (t)
    for (let a in t) {
      if (uo(a))
        continue;
      const u = t[a];
      let c;
      i && Ce(i, c = et(a)) ? !s || !s.includes(c) ? n[c] = u : (l || (l = {}))[c] = u : ji(e.emitsOptions, a) || (!(a in o) || u !== o[a]) && (o[a] = u, r = !0);
    }
  if (s) {
    const a = /* @__PURE__ */ Se(n), u = l || Te;
    for (let c = 0; c < s.length; c++) {
      const d = s[c];
      n[d] = zs(
        i,
        a,
        d,
        u[d],
        e,
        !Ce(u, d)
      );
    }
  }
  return r;
}
function zs(e, t, n, o, i, s) {
  const r = e[n];
  if (r != null) {
    const l = Ce(r, "default");
    if (l && o === void 0) {
      const a = r.default;
      if (r.type !== Function && !r.skipFactory && fe(a)) {
        const { propsDefaults: u } = i;
        if (n in u)
          o = u[n];
        else {
          const c = Ho(i);
          o = u[n] = a.call(
            null,
            t
          ), c();
        }
      } else
        o = a;
      i.ce && i.ce._setProp(n, o);
    }
    r[
      0
      /* shouldCast */
    ] && (s && !l ? o = !1 : r[
      1
      /* shouldCastTrue */
    ] && (o === "" || o === $n(n)) && (o = !0));
  }
  return o;
}
const pf = /* @__PURE__ */ new WeakMap();
function lu(e, t, n = !1) {
  const o = n ? pf : t.propsCache, i = o.get(e);
  if (i)
    return i;
  const s = e.props, r = {}, l = [];
  let a = !1;
  if (!fe(e)) {
    const c = (d) => {
      a = !0;
      const [h, v] = lu(d, t, !0);
      Xe(r, h), v && l.push(...v);
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  if (!s && !a)
    return Me(e) && o.set(e, Rn), Rn;
  if (ue(s))
    for (let c = 0; c < s.length; c++) {
      const d = et(s[c]);
      Zr(d) && (r[d] = Te);
    }
  else if (s)
    for (const c in s) {
      const d = et(c);
      if (Zr(d)) {
        const h = s[c], v = r[d] = ue(h) || fe(h) ? { type: h } : Xe({}, h), N = v.type;
        let x = !1, M = !0;
        if (ue(N))
          for (let E = 0; E < N.length; ++E) {
            const T = N[E], S = fe(T) && T.name;
            if (S === "Boolean") {
              x = !0;
              break;
            } else S === "String" && (M = !1);
          }
        else
          x = fe(N) && N.name === "Boolean";
        v[
          0
          /* shouldCast */
        ] = x, v[
          1
          /* shouldCastTrue */
        ] = M, (x || Ce(v, "default")) && l.push(d);
      }
    }
  const u = [r, l];
  return Me(e) && o.set(e, u), u;
}
function Zr(e) {
  return e[0] !== "$" && !uo(e);
}
const vr = (e) => e === "_" || e === "_ctx" || e === "$stable", mr = (e) => ue(e) ? e.map(Mt) : [Mt(e)], hf = (e, t, n) => {
  if (t._n)
    return t;
  const o = No((...i) => mr(t(...i)), n);
  return o._c = !1, o;
}, au = (e, t, n) => {
  const o = e._ctx;
  for (const i in e) {
    if (vr(i)) continue;
    const s = e[i];
    if (fe(s))
      t[i] = hf(i, s, o);
    else if (s != null) {
      const r = mr(s);
      t[i] = () => r;
    }
  }
}, uu = (e, t) => {
  const n = mr(t);
  e.slots.default = () => n;
}, cu = (e, t, n) => {
  for (const o in t)
    (n || !vr(o)) && (e[o] = t[o]);
}, gf = (e, t, n) => {
  const o = e.slots = iu();
  if (e.vnode.shapeFlag & 32) {
    const i = t._;
    i ? (cu(o, t, n), n && fa(o, "_", i, !0)) : au(t, o);
  } else t && uu(e, t);
}, vf = (e, t, n) => {
  const { vnode: o, slots: i } = e;
  let s = !0, r = Te;
  if (o.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? s = !1 : cu(i, t, n) : (s = !t.$stable, au(t, i)), r = t;
  } else t && (uu(e, t), r = { default: 1 });
  if (s)
    for (const l in i)
      !vr(l) && r[l] == null && delete i[l];
}, tt = wf;
function mf(e) {
  return yf(e);
}
function yf(e, t) {
  const n = Hi();
  n.__VUE__ = !0;
  const {
    insert: o,
    remove: i,
    patchProp: s,
    createElement: r,
    createText: l,
    createComment: a,
    setText: u,
    setElementText: c,
    parentNode: d,
    nextSibling: h,
    setScopeId: v = Pt,
    insertStaticContent: N
  } = e, x = (m, w, f, p = null, g = null, y = null, _ = void 0, D = null, O = !!w.dynamicChildren) => {
    if (m === w)
      return;
    m && !eo(m, w) && (p = ae(m), re(m, g, y, !0), m = null), w.patchFlag === -2 && (O = !1, w.dynamicChildren = null);
    const { type: A, ref: B, shapeFlag: R } = w;
    switch (A) {
      case qi:
        M(m, w, f, p);
        break;
      case Zt:
        E(m, w, f, p);
        break;
      case oi:
        m == null && T(w, f, p, _);
        break;
      case Ne:
        P(
          m,
          w,
          f,
          p,
          g,
          y,
          _,
          D,
          O
        );
        break;
      default:
        R & 1 ? H(
          m,
          w,
          f,
          p,
          g,
          y,
          _,
          D,
          O
        ) : R & 6 ? oe(
          m,
          w,
          f,
          p,
          g,
          y,
          _,
          D,
          O
        ) : (R & 64 || R & 128) && A.process(
          m,
          w,
          f,
          p,
          g,
          y,
          _,
          D,
          O,
          de
        );
    }
    B != null && g ? ho(B, m && m.ref, y, w || m, !w) : B == null && m && m.ref != null && ho(m.ref, null, y, m, !0);
  }, M = (m, w, f, p) => {
    if (m == null)
      o(
        w.el = l(w.children),
        f,
        p
      );
    else {
      const g = w.el = m.el;
      w.children !== m.children && u(g, w.children);
    }
  }, E = (m, w, f, p) => {
    m == null ? o(
      w.el = a(w.children || ""),
      f,
      p
    ) : w.el = m.el;
  }, T = (m, w, f, p) => {
    [m.el, m.anchor] = N(
      m.children,
      w,
      f,
      p,
      m.el,
      m.anchor
    );
  }, S = ({ el: m, anchor: w }, f, p) => {
    let g;
    for (; m && m !== w; )
      g = h(m), o(m, f, p), m = g;
    o(w, f, p);
  }, C = ({ el: m, anchor: w }) => {
    let f;
    for (; m && m !== w; )
      f = h(m), i(m), m = f;
    i(w);
  }, H = (m, w, f, p, g, y, _, D, O) => {
    if (w.type === "svg" ? _ = "svg" : w.type === "math" && (_ = "mathml"), m == null)
      j(
        w,
        f,
        p,
        g,
        y,
        _,
        D,
        O
      );
    else {
      const A = m.el && m.el._isVueCE ? m.el : null;
      try {
        A && A._beginPatch(), G(
          m,
          w,
          g,
          y,
          _,
          D,
          O
        );
      } finally {
        A && A._endPatch();
      }
    }
  }, j = (m, w, f, p, g, y, _, D) => {
    let O, A;
    const { props: B, shapeFlag: R, transition: W, dirs: J } = m;
    if (O = m.el = r(
      m.type,
      y,
      B && B.is,
      B
    ), R & 8 ? c(O, m.children) : R & 16 && F(
      m.children,
      O,
      null,
      p,
      g,
      ys(m, y),
      _,
      D
    ), J && dn(m, null, p, "created"), K(O, m, m.scopeId, _, p), B) {
      for (const ve in B)
        ve !== "value" && !uo(ve) && s(O, ve, null, B[ve], y, p);
      "value" in B && s(O, "value", null, B.value, y), (A = B.onVnodeBeforeMount) && Et(A, p, m);
    }
    J && dn(m, null, p, "beforeMount");
    const pe = _f(g, W);
    pe && W.beforeEnter(O), o(O, w, f), ((A = B && B.onVnodeMounted) || pe || J) && tt(() => {
      try {
        A && Et(A, p, m), pe && W.enter(O), J && dn(m, null, p, "mounted");
      } finally {
      }
    }, g);
  }, K = (m, w, f, p, g) => {
    if (f && v(m, f), p)
      for (let y = 0; y < p.length; y++)
        v(m, p[y]);
    if (g) {
      let y = g.subTree;
      if (w === y || hu(y.type) && (y.ssContent === w || y.ssFallback === w)) {
        const _ = g.vnode;
        K(
          m,
          _,
          _.scopeId,
          _.slotScopeIds,
          g.parent
        );
      }
    }
  }, F = (m, w, f, p, g, y, _, D, O = 0) => {
    for (let A = O; A < m.length; A++) {
      const B = m[A] = D ? Ht(m[A]) : Mt(m[A]);
      x(
        null,
        B,
        w,
        f,
        p,
        g,
        y,
        _,
        D
      );
    }
  }, G = (m, w, f, p, g, y, _) => {
    const D = w.el = m.el;
    let { patchFlag: O, dynamicChildren: A, dirs: B } = w;
    O |= m.patchFlag & 16;
    const R = m.props || Te, W = w.props || Te;
    let J;
    if (f && fn(f, !1), (J = W.onVnodeBeforeUpdate) && Et(J, f, w, m), B && dn(w, m, f, "beforeUpdate"), f && fn(f, !0), (R.innerHTML && W.innerHTML == null || R.textContent && W.textContent == null) && c(D, ""), A ? X(
      m.dynamicChildren,
      A,
      D,
      f,
      p,
      ys(w, g),
      y
    ) : _ || V(
      m,
      w,
      D,
      null,
      f,
      p,
      ys(w, g),
      y,
      !1
    ), O > 0) {
      if (O & 16)
        Y(D, R, W, f, g);
      else if (O & 2 && R.class !== W.class && s(D, "class", null, W.class, g), O & 4 && s(D, "style", R.style, W.style, g), O & 8) {
        const pe = w.dynamicProps;
        for (let ve = 0; ve < pe.length; ve++) {
          const Ie = pe[ve], He = R[Ie], Ge = W[Ie];
          (Ge !== He || Ie === "value") && s(D, Ie, He, Ge, g, f);
        }
      }
      O & 1 && m.children !== w.children && c(D, w.children);
    } else !_ && A == null && Y(D, R, W, f, g);
    ((J = W.onVnodeUpdated) || B) && tt(() => {
      J && Et(J, f, w, m), B && dn(w, m, f, "updated");
    }, p);
  }, X = (m, w, f, p, g, y, _) => {
    for (let D = 0; D < w.length; D++) {
      const O = m[D], A = w[D], B = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        O.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (O.type === Ne || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !eo(O, A) || // - In the case of a component, it could contain anything.
        O.shapeFlag & 198) ? d(O.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          f
        )
      );
      x(
        O,
        A,
        B,
        null,
        p,
        g,
        y,
        _,
        !0
      );
    }
  }, Y = (m, w, f, p, g) => {
    if (w !== f) {
      if (w !== Te)
        for (const y in w)
          !uo(y) && !(y in f) && s(
            m,
            y,
            w[y],
            null,
            g,
            p
          );
      for (const y in f) {
        if (uo(y)) continue;
        const _ = f[y], D = w[y];
        _ !== D && y !== "value" && s(m, y, D, _, g, p);
      }
      "value" in f && s(m, "value", w.value, f.value, g);
    }
  }, P = (m, w, f, p, g, y, _, D, O) => {
    const A = w.el = m ? m.el : l(""), B = w.anchor = m ? m.anchor : l("");
    let { patchFlag: R, dynamicChildren: W, slotScopeIds: J } = w;
    J && (D = D ? D.concat(J) : J), m == null ? (o(A, f, p), o(B, f, p), F(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      w.children || [],
      f,
      B,
      g,
      y,
      _,
      D,
      O
    )) : R > 0 && R & 64 && W && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    m.dynamicChildren && m.dynamicChildren.length === W.length ? (X(
      m.dynamicChildren,
      W,
      f,
      g,
      y,
      _,
      D
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (w.key != null || g && w === g.subTree) && du(
      m,
      w,
      !0
      /* shallow */
    )) : V(
      m,
      w,
      f,
      B,
      g,
      y,
      _,
      D,
      O
    );
  }, oe = (m, w, f, p, g, y, _, D, O) => {
    w.slotScopeIds = D, m == null ? w.shapeFlag & 512 ? g.ctx.activate(
      w,
      f,
      p,
      _,
      O
    ) : $(
      w,
      f,
      p,
      g,
      y,
      _,
      O
    ) : z(m, w, O);
  }, $ = (m, w, f, p, g, y, _) => {
    const D = m.component = $f(
      m,
      p,
      g
    );
    if (Ua(m) && (D.ctx.renderer = de), Mf(D, !1, _), D.asyncDep) {
      if (g && g.registerDep(D, I, _), !m.el) {
        const O = D.subTree = we(Zt);
        E(null, O, w, f), m.placeholder = O.el;
      }
    } else
      I(
        D,
        m,
        w,
        f,
        g,
        y,
        _
      );
  }, z = (m, w, f) => {
    const p = w.component = m.component;
    if (uf(m, w, f))
      if (p.asyncDep && !p.asyncResolved) {
        k(p, w, f);
        return;
      } else
        p.next = w, p.update();
    else
      w.el = m.el, p.vnode = w;
  }, I = (m, w, f, p, g, y, _) => {
    const D = () => {
      if (m.isMounted) {
        let { next: R, bu: W, u: J, parent: pe, vnode: ve } = m;
        {
          const xt = fu(m);
          if (xt) {
            R && (R.el = ve.el, k(m, R, _)), xt.asyncDep.then(() => {
              tt(() => {
                m.isUnmounted || A();
              }, g);
            });
            return;
          }
        }
        let Ie = R, He;
        fn(m, !1), R ? (R.el = ve.el, k(m, R, _)) : R = ve, W && ni(W), (He = R.props && R.props.onVnodeBeforeUpdate) && Et(He, pe, R, ve), fn(m, !0);
        const Ge = jr(m), wt = m.subTree;
        m.subTree = Ge, x(
          wt,
          Ge,
          // parent may have changed if it's in a teleport
          d(wt.el),
          // anchor may have changed if it's in a fragment
          ae(wt),
          m,
          g,
          y
        ), R.el = Ge.el, Ie === null && cf(m, Ge.el), J && tt(J, g), (He = R.props && R.props.onVnodeUpdated) && tt(
          () => Et(He, pe, R, ve),
          g
        );
      } else {
        let R;
        const { el: W, props: J } = w, { bm: pe, m: ve, parent: Ie, root: He, type: Ge } = m, wt = zn(w);
        fn(m, !1), pe && ni(pe), !wt && (R = J && J.onVnodeBeforeMount) && Et(R, Ie, w), fn(m, !0);
        {
          He.ce && He.ce._hasShadowRoot() && He.ce._injectChildStyle(
            Ge,
            m.parent ? m.parent.type : void 0
          );
          const xt = m.subTree = jr(m);
          x(
            null,
            xt,
            f,
            p,
            m,
            g,
            y
          ), w.el = xt.el;
        }
        if (ve && tt(ve, g), !wt && (R = J && J.onVnodeMounted)) {
          const xt = w;
          tt(
            () => Et(R, Ie, xt),
            g
          );
        }
        (w.shapeFlag & 256 || Ie && zn(Ie.vnode) && Ie.vnode.shapeFlag & 256) && m.a && tt(m.a, g), m.isMounted = !0, w = f = p = null;
      }
    };
    m.scope.on();
    const O = m.effect = new ma(D);
    m.scope.off();
    const A = m.update = O.run.bind(O), B = m.job = O.runIfDirty.bind(O);
    B.i = m, B.id = m.uid, O.scheduler = () => fr(B), fn(m, !0), A();
  }, k = (m, w, f) => {
    w.component = m;
    const p = m.vnode.props;
    m.vnode = w, m.next = null, ff(m, w.props, p, f), vf(m, w.children, f), Xt(), Fr(m), jt();
  }, V = (m, w, f, p, g, y, _, D, O = !1) => {
    const A = m && m.children, B = m ? m.shapeFlag : 0, R = w.children, { patchFlag: W, shapeFlag: J } = w;
    if (W > 0) {
      if (W & 128) {
        Z(
          A,
          R,
          f,
          p,
          g,
          y,
          _,
          D,
          O
        );
        return;
      } else if (W & 256) {
        q(
          A,
          R,
          f,
          p,
          g,
          y,
          _,
          D,
          O
        );
        return;
      }
    }
    J & 8 ? (B & 16 && ne(A, g, y), R !== A && c(f, R)) : B & 16 ? J & 16 ? Z(
      A,
      R,
      f,
      p,
      g,
      y,
      _,
      D,
      O
    ) : ne(A, g, y, !0) : (B & 8 && c(f, ""), J & 16 && F(
      R,
      f,
      p,
      g,
      y,
      _,
      D,
      O
    ));
  }, q = (m, w, f, p, g, y, _, D, O) => {
    m = m || Rn, w = w || Rn;
    const A = m.length, B = w.length, R = Math.min(A, B);
    let W;
    for (W = 0; W < R; W++) {
      const J = w[W] = O ? Ht(w[W]) : Mt(w[W]);
      x(
        m[W],
        J,
        f,
        null,
        g,
        y,
        _,
        D,
        O
      );
    }
    A > B ? ne(
      m,
      g,
      y,
      !0,
      !1,
      R
    ) : F(
      w,
      f,
      p,
      g,
      y,
      _,
      D,
      O,
      R
    );
  }, Z = (m, w, f, p, g, y, _, D, O) => {
    let A = 0;
    const B = w.length;
    let R = m.length - 1, W = B - 1;
    for (; A <= R && A <= W; ) {
      const J = m[A], pe = w[A] = O ? Ht(w[A]) : Mt(w[A]);
      if (eo(J, pe))
        x(
          J,
          pe,
          f,
          null,
          g,
          y,
          _,
          D,
          O
        );
      else
        break;
      A++;
    }
    for (; A <= R && A <= W; ) {
      const J = m[R], pe = w[W] = O ? Ht(w[W]) : Mt(w[W]);
      if (eo(J, pe))
        x(
          J,
          pe,
          f,
          null,
          g,
          y,
          _,
          D,
          O
        );
      else
        break;
      R--, W--;
    }
    if (A > R) {
      if (A <= W) {
        const J = W + 1, pe = J < B ? w[J].el : p;
        for (; A <= W; )
          x(
            null,
            w[A] = O ? Ht(w[A]) : Mt(w[A]),
            f,
            pe,
            g,
            y,
            _,
            D,
            O
          ), A++;
      }
    } else if (A > W)
      for (; A <= R; )
        re(m[A], g, y, !0), A++;
    else {
      const J = A, pe = A, ve = /* @__PURE__ */ new Map();
      for (A = pe; A <= W; A++) {
        const it = w[A] = O ? Ht(w[A]) : Mt(w[A]);
        it.key != null && ve.set(it.key, A);
      }
      let Ie, He = 0;
      const Ge = W - pe + 1;
      let wt = !1, xt = 0;
      const Jn = new Array(Ge);
      for (A = 0; A < Ge; A++) Jn[A] = 0;
      for (A = J; A <= R; A++) {
        const it = m[A];
        if (He >= Ge) {
          re(it, g, y, !0);
          continue;
        }
        let St;
        if (it.key != null)
          St = ve.get(it.key);
        else
          for (Ie = pe; Ie <= W; Ie++)
            if (Jn[Ie - pe] === 0 && eo(it, w[Ie])) {
              St = Ie;
              break;
            }
        St === void 0 ? re(it, g, y, !0) : (Jn[St - pe] = A + 1, St >= xt ? xt = St : wt = !0, x(
          it,
          w[St],
          f,
          null,
          g,
          y,
          _,
          D,
          O
        ), He++);
      }
      const Dr = wt ? bf(Jn) : Rn;
      for (Ie = Dr.length - 1, A = Ge - 1; A >= 0; A--) {
        const it = pe + A, St = w[it], kr = w[it + 1], Rr = it + 1 < B ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          kr.el || pu(kr)
        ) : p;
        Jn[A] === 0 ? x(
          null,
          St,
          f,
          Rr,
          g,
          y,
          _,
          D,
          O
        ) : wt && (Ie < 0 || A !== Dr[Ie] ? ee(St, f, Rr, 2) : Ie--);
      }
    }
  }, ee = (m, w, f, p, g = null) => {
    const { el: y, type: _, transition: D, children: O, shapeFlag: A } = m;
    if (A & 6) {
      ee(m.component.subTree, w, f, p);
      return;
    }
    if (A & 128) {
      m.suspense.move(w, f, p);
      return;
    }
    if (A & 64) {
      _.move(m, w, f, de);
      return;
    }
    if (_ === Ne) {
      o(y, w, f);
      for (let R = 0; R < O.length; R++)
        ee(O[R], w, f, p);
      o(m.anchor, w, f);
      return;
    }
    if (_ === oi) {
      S(m, w, f);
      return;
    }
    if (p !== 2 && A & 1 && D)
      if (p === 0)
        D.beforeEnter(y), o(y, w, f), tt(() => D.enter(y), g);
      else {
        const { leave: R, delayLeave: W, afterLeave: J } = D, pe = () => {
          m.ctx.isUnmounted ? i(y) : o(y, w, f);
        }, ve = () => {
          y._isLeaving && y[Rd](
            !0
            /* cancelled */
          ), R(y, () => {
            pe(), J && J();
          });
        };
        W ? W(y, pe, ve) : ve();
      }
    else
      o(y, w, f);
  }, re = (m, w, f, p = !1, g = !1) => {
    const {
      type: y,
      props: _,
      ref: D,
      children: O,
      dynamicChildren: A,
      shapeFlag: B,
      patchFlag: R,
      dirs: W,
      cacheIndex: J,
      memo: pe
    } = m;
    if (R === -2 && (g = !1), D != null && (Xt(), ho(D, null, f, m, !0), jt()), J != null && (w.renderCache[J] = void 0), B & 256) {
      w.ctx.deactivate(m);
      return;
    }
    const ve = B & 1 && W, Ie = !zn(m);
    let He;
    if (Ie && (He = _ && _.onVnodeBeforeUnmount) && Et(He, w, m), B & 6)
      ie(m.component, f, p);
    else {
      if (B & 128) {
        m.suspense.unmount(f, p);
        return;
      }
      ve && dn(m, null, w, "beforeUnmount"), B & 64 ? m.type.remove(
        m,
        w,
        f,
        de,
        p
      ) : A && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !A.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (y !== Ne || R > 0 && R & 64) ? ne(
        A,
        w,
        f,
        !1,
        !0
      ) : (y === Ne && R & 384 || !g && B & 16) && ne(O, w, f), p && ce(m);
    }
    const Ge = pe != null && J == null;
    (Ie && (He = _ && _.onVnodeUnmounted) || ve || Ge) && tt(() => {
      He && Et(He, w, m), ve && dn(m, null, w, "unmounted"), Ge && (m.el = null);
    }, f);
  }, ce = (m) => {
    const { type: w, el: f, anchor: p, transition: g } = m;
    if (w === Ne) {
      ge(f, p);
      return;
    }
    if (w === oi) {
      C(m);
      return;
    }
    const y = () => {
      i(f), g && !g.persisted && g.afterLeave && g.afterLeave();
    };
    if (m.shapeFlag & 1 && g && !g.persisted) {
      const { leave: _, delayLeave: D } = g, O = () => _(f, y);
      D ? D(m.el, y, O) : O();
    } else
      y();
  }, ge = (m, w) => {
    let f;
    for (; m !== w; )
      f = h(m), i(m), m = f;
    i(w);
  }, ie = (m, w, f) => {
    const { bum: p, scope: g, job: y, subTree: _, um: D, m: O, a: A } = m;
    Jr(O), Jr(A), p && ni(p), g.stop(), y && (y.flags |= 8, re(_, m, w, f)), D && tt(D, w), tt(() => {
      m.isUnmounted = !0;
    }, w);
  }, ne = (m, w, f, p = !1, g = !1, y = 0) => {
    for (let _ = y; _ < m.length; _++)
      re(m[_], w, f, p, g);
  }, ae = (m) => {
    if (m.shapeFlag & 6)
      return ae(m.component.subTree);
    if (m.shapeFlag & 128)
      return m.suspense.next();
    const w = h(m.anchor || m.el), f = w && w[Dd];
    return f ? h(f) : w;
  };
  let me = !1;
  const Ee = (m, w, f) => {
    let p;
    m == null ? w._vnode && (re(w._vnode, null, null, !0), p = w._vnode.component) : x(
      w._vnode || null,
      m,
      w,
      null,
      null,
      null,
      f
    ), w._vnode = m, me || (me = !0, Fr(p), Va(), me = !1);
  }, de = {
    p: x,
    um: re,
    m: ee,
    r: ce,
    mt: $,
    mc: F,
    pc: V,
    pbc: X,
    n: ae,
    o: e
  };
  return {
    render: Ee,
    hydrate: void 0,
    createApp: nf(Ee)
  };
}
function ys({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function fn({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function _f(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function du(e, t, n = !1) {
  const o = e.children, i = t.children;
  if (ue(o) && ue(i))
    for (let s = 0; s < o.length; s++) {
      const r = o[s];
      let l = i[s];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = i[s] = Ht(i[s]), l.el = r.el), !n && l.patchFlag !== -2 && du(r, l)), l.type === qi && (l.patchFlag === -1 && (l = i[s] = Ht(l)), l.el = r.el), l.type === Zt && !l.el && (l.el = r.el);
    }
}
function bf(e) {
  const t = e.slice(), n = [0];
  let o, i, s, r, l;
  const a = e.length;
  for (o = 0; o < a; o++) {
    const u = e[o];
    if (u !== 0) {
      if (i = n[n.length - 1], e[i] < u) {
        t[o] = i, n.push(o);
        continue;
      }
      for (s = 0, r = n.length - 1; s < r; )
        l = s + r >> 1, e[n[l]] < u ? s = l + 1 : r = l;
      u < e[n[s]] && (s > 0 && (t[o] = n[s - 1]), n[s] = o);
    }
  }
  for (s = n.length, r = n[s - 1]; s-- > 0; )
    n[s] = r, r = t[r];
  return n;
}
function fu(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : fu(t);
}
function Jr(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function pu(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? pu(t.subTree) : null;
}
const hu = (e) => e.__isSuspense;
function wf(e, t) {
  t && t.pendingBranch ? ue(e) ? t.effects.push(...e) : t.effects.push(e) : Id(e);
}
const Ne = /* @__PURE__ */ Symbol.for("v-fgt"), qi = /* @__PURE__ */ Symbol.for("v-txt"), Zt = /* @__PURE__ */ Symbol.for("v-cmt"), oi = /* @__PURE__ */ Symbol.for("v-stc"), vo = [];
let Qe = null;
function U(e = !1) {
  vo.push(Qe = e ? null : []);
}
function xf() {
  vo.pop(), Qe = vo[vo.length - 1] || null;
}
let Yn = 1;
function mi(e, t = !1) {
  Yn += e, e < 0 && Qe && t && (Qe.hasOnce = !0);
}
function gu(e) {
  return e.dynamicChildren = Yn > 0 ? Qe || Rn : null, xf(), Yn > 0 && Qe && Qe.push(e), e;
}
function te(e, t, n, o, i, s) {
  return gu(
    b(
      e,
      t,
      n,
      o,
      i,
      s,
      !0
    )
  );
}
function Be(e, t, n, o, i) {
  return gu(
    we(
      e,
      t,
      n,
      o,
      i,
      !0
    )
  );
}
function Co(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function eo(e, t) {
  return e.type === t.type && e.key === t.key;
}
const vu = ({ key: e }) => e ?? null, ii = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? Ve(e) || /* @__PURE__ */ Ae(e) || fe(e) ? { i: Ke, r: e, k: t, f: !!n } : e : null);
function b(e, t = null, n = null, o = 0, i = null, s = e === Ne ? 0 : 1, r = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && vu(t),
    ref: t && ii(t),
    scopeId: za,
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
    shapeFlag: s,
    patchFlag: o,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: Ke
  };
  return l ? (yr(a, n), s & 128 && e.normalize(a)) : n && (a.shapeFlag |= Ve(n) ? 8 : 16), Yn > 0 && // avoid a block node from tracking itself
  !r && // has current parent block
  Qe && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && Qe.push(a), a;
}
const we = Sf;
function Sf(e, t = null, n = null, o = 0, i = null, s = !1) {
  if ((!e || e === Xa) && (e = Zt), Co(e)) {
    const l = Wn(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && yr(l, n), Yn > 0 && !s && Qe && (l.shapeFlag & 6 ? Qe[Qe.indexOf(e)] = l : Qe.push(l)), l.patchFlag = -2, l;
  }
  if (Af(e) && (e = e.__vccOpts), t) {
    t = Ef(t);
    let { class: l, style: a } = t;
    l && !Ve(l) && (t.class = Kt(l)), Me(a) && (/* @__PURE__ */ Yi(a) && !ue(a) && (a = Xe({}, a)), t.style = at(a));
  }
  const r = Ve(e) ? 1 : hu(e) ? 128 : kd(e) ? 64 : Me(e) ? 4 : fe(e) ? 2 : 0;
  return b(
    e,
    t,
    n,
    o,
    i,
    r,
    s,
    !0
  );
}
function Ef(e) {
  return e ? /* @__PURE__ */ Yi(e) || su(e) ? Xe({}, e) : e : null;
}
function Wn(e, t, n = !1, o = !1) {
  const { props: i, ref: s, patchFlag: r, children: l, transition: a } = e, u = t ? _r(i || {}, t) : i, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: u,
    key: u && vu(u),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && s ? ue(s) ? s.concat(ii(t)) : [s, ii(t)] : ii(t)
    ) : s,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Ne ? r === -1 ? 16 : r | 16 : r,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Wn(e.ssContent),
    ssFallback: e.ssFallback && Wn(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return a && o && pr(
    c,
    a.clone(c)
  ), c;
}
function kn(e = " ", t = 0) {
  return we(qi, null, e, t);
}
function mu(e, t) {
  const n = we(oi, null, e);
  return n.staticCount = t, n;
}
function Le(e = "", t = !1) {
  return t ? (U(), Be(Zt, null, e)) : we(Zt, null, e);
}
function Mt(e) {
  return e == null || typeof e == "boolean" ? we(Zt) : ue(e) ? we(
    Ne,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : Co(e) ? Ht(e) : we(qi, null, String(e));
}
function Ht(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Wn(e);
}
function yr(e, t) {
  let n = 0;
  const { shapeFlag: o } = e;
  if (t == null)
    t = null;
  else if (ue(t))
    n = 16;
  else if (typeof t == "object")
    if (o & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), yr(e, i()), i._c && (i._d = !0));
      return;
    } else {
      n = 32;
      const i = t._;
      !i && !su(t) ? t._ctx = Ke : i === 3 && Ke && (Ke.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else fe(t) ? (t = { default: t, _ctx: Ke }, n = 32) : (t = String(t), o & 64 ? (n = 16, t = [kn(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function _r(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    for (const i in o)
      if (i === "class")
        t.class !== o.class && (t.class = Kt([t.class, o.class]));
      else if (i === "style")
        t.style = at([t.style, o.style]);
      else if (Oi(i)) {
        const s = t[i], r = o[i];
        r && s !== r && !(ue(s) && s.includes(r)) ? t[i] = s ? [].concat(s, r) : r : r == null && s == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Di(i) && (t[i] = r);
      } else i !== "" && (t[i] = o[i]);
  }
  return t;
}
function Et(e, t, n, o = null) {
  Dt(e, t, 7, [
    n,
    o
  ]);
}
const Nf = eu();
let Cf = 0;
function $f(e, t, n) {
  const o = e.type, i = (t ? t.appContext : e.appContext) || Nf, s = {
    uid: Cf++,
    vnode: e,
    type: o,
    parent: t,
    appContext: i,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new va(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(i.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: lu(o, i),
    emitsOptions: tu(o, i),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: Te,
    // inheritAttrs
    inheritAttrs: o.inheritAttrs,
    // state
    ctx: Te,
    data: Te,
    props: Te,
    attrs: Te,
    slots: Te,
    refs: Te,
    setupState: Te,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
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
  return s.ctx = { _: s }, s.root = t ? t.root : s, s.emit = sf.bind(null, s), e.ce && e.ce(s), s;
}
let qe = null;
const tn = () => qe || Ke;
let yi, Hs;
{
  const e = Hi(), t = (n, o) => {
    let i;
    return (i = e[n]) || (i = e[n] = []), i.push(o), (s) => {
      i.length > 1 ? i.forEach((r) => r(s)) : i[0](s);
    };
  };
  yi = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => qe = n
  ), Hs = t(
    "__VUE_SSR_SETTERS__",
    (n) => $o = n
  );
}
const Ho = (e) => {
  const t = qe;
  return yi(e), e.scope.on(), () => {
    e.scope.off(), yi(t);
  };
}, Qr = () => {
  qe && qe.scope.off(), yi(null);
};
function yu(e) {
  return e.vnode.shapeFlag & 4;
}
let $o = !1;
function Mf(e, t = !1, n = !1) {
  t && Hs(t);
  const { props: o, children: i } = e.vnode, s = yu(e);
  df(e, o, s, t), gf(e, i, n || t);
  const r = s ? If(e, t) : void 0;
  return t && Hs(!1), r;
}
function If(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Wd);
  const { setup: o } = n;
  if (o) {
    Xt();
    const i = e.setupContext = o.length > 1 ? bu(e) : null, s = Ho(e), r = zo(
      o,
      e,
      0,
      [
        e.props,
        i
      ]
    ), l = ua(r);
    if (jt(), s(), (l || e.sp) && !zn(e) && La(e), l) {
      if (r.then(Qr, Qr), t)
        return r.then((a) => {
          el(e, a);
        }).catch((a) => {
          Wi(a, e, 0);
        });
      e.asyncDep = r;
    } else
      el(e, r);
  } else
    _u(e);
}
function el(e, t, n) {
  fe(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : Me(t) && (e.setupState = Aa(t)), _u(e);
}
function _u(e, t, n) {
  const o = e.type;
  e.render || (e.render = o.render || Pt);
  {
    const i = Ho(e);
    Xt();
    try {
      qd(e);
    } finally {
      jt(), i();
    }
  }
}
const Tf = {
  get(e, t) {
    return je(e, "get", ""), e[t];
  }
};
function bu(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Tf),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Zi(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Aa(nt(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in go)
        return go[n](e);
    },
    has(t, n) {
      return n in t || n in go;
    }
  })) : e.proxy;
}
function Pf(e, t = !0) {
  return fe(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Af(e) {
  return fe(e) && "__vccOpts" in e;
}
const se = (e, t) => /* @__PURE__ */ Ed(e, t, $o);
function $e(e, t, n) {
  try {
    mi(-1);
    const o = arguments.length;
    return o === 2 ? Me(t) && !ue(t) ? Co(t) ? we(e, null, [t]) : we(e, t) : we(e, null, t) : (o > 3 ? n = Array.prototype.slice.call(arguments, 2) : o === 3 && Co(n) && (n = [n]), we(e, t, n));
  } finally {
    mi(1);
  }
}
function Of(e, t) {
  const n = e.memo;
  if (n.length != t.length)
    return !1;
  for (let o = 0; o < n.length; o++)
    if (ft(n[o], t[o]))
      return !1;
  return Yn > 0 && Qe && Qe.push(e), !0;
}
const Df = "3.5.33";
/**
* @vue/runtime-dom v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Fs;
const tl = typeof window < "u" && window.trustedTypes;
if (tl)
  try {
    Fs = /* @__PURE__ */ tl.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const wu = Fs ? (e) => Fs.createHTML(e) : (e) => e, kf = "http://www.w3.org/2000/svg", Rf = "http://www.w3.org/1998/Math/MathML", zt = typeof document < "u" ? document : null, nl = zt && /* @__PURE__ */ zt.createElement("template"), Vf = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, o) => {
    const i = t === "svg" ? zt.createElementNS(kf, e) : t === "mathml" ? zt.createElementNS(Rf, e) : n ? zt.createElement(e, { is: n }) : zt.createElement(e);
    return e === "select" && o && o.multiple != null && i.setAttribute("multiple", o.multiple), i;
  },
  createText: (e) => zt.createTextNode(e),
  createComment: (e) => zt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => zt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, o, i, s) {
    const r = n ? n.previousSibling : t.lastChild;
    if (i && (i === s || i.nextSibling))
      for (; t.insertBefore(i.cloneNode(!0), n), !(i === s || !(i = i.nextSibling)); )
        ;
    else {
      nl.innerHTML = wu(
        o === "svg" ? `<svg>${e}</svg>` : o === "mathml" ? `<math>${e}</math>` : e
      );
      const l = nl.content;
      if (o === "svg" || o === "mathml") {
        const a = l.firstChild;
        for (; a.firstChild; )
          l.appendChild(a.firstChild);
        l.removeChild(a);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      r ? r.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Bf = /* @__PURE__ */ Symbol("_vtc");
function zf(e, t, n) {
  const o = e[Bf];
  o && (t = (t ? [t, ...o] : [...o]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const ol = /* @__PURE__ */ Symbol("_vod"), Hf = /* @__PURE__ */ Symbol("_vsh"), Ff = /* @__PURE__ */ Symbol(""), Lf = /(?:^|;)\s*display\s*:/;
function Uf(e, t, n) {
  const o = e.style, i = Ve(n);
  let s = !1;
  if (n && !i) {
    if (t)
      if (Ve(t))
        for (const r of t.split(";")) {
          const l = r.slice(0, r.indexOf(":")).trim();
          n[l] == null && io(o, l, "");
        }
      else
        for (const r in t)
          n[r] == null && io(o, r, "");
    for (const r in n) {
      r === "display" && (s = !0);
      const l = n[r];
      l != null ? Yf(
        e,
        r,
        !Ve(t) && t ? t[r] : void 0,
        l
      ) || io(o, r, l) : io(o, r, "");
    }
  } else if (i) {
    if (t !== n) {
      const r = o[Ff];
      r && (n += ";" + r), o.cssText = n, s = Lf.test(n);
    }
  } else t && e.removeAttribute("style");
  ol in e && (e[ol] = s ? o.display : "", e[Hf] && (o.display = "none"));
}
const il = /\s*!important$/;
function io(e, t, n) {
  if (ue(n))
    n.forEach((o) => io(e, t, o));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const o = Gf(e, t);
    il.test(n) ? e.setProperty(
      $n(o),
      n.replace(il, ""),
      "important"
    ) : e[o] = n;
  }
}
const sl = ["Webkit", "Moz", "ms"], _s = {};
function Gf(e, t) {
  const n = _s[t];
  if (n)
    return n;
  let o = et(t);
  if (o !== "filter" && o in e)
    return _s[t] = o;
  o = Bi(o);
  for (let i = 0; i < sl.length; i++) {
    const s = sl[i] + o;
    if (s in e)
      return _s[t] = s;
  }
  return t;
}
function Yf(e, t, n, o) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && Ve(o) && n === o;
}
const rl = "http://www.w3.org/1999/xlink";
function ll(e, t, n, o, i, s = Xc(t)) {
  o && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(rl, t.slice(6, t.length)) : e.setAttributeNS(rl, t, n) : n == null || s && !pa(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    s ? "" : lt(n) ? String(n) : n
  );
}
function al(e, t, n, o, i) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? wu(n) : n);
    return;
  }
  const s = e.tagName;
  if (t === "value" && s !== "PROGRESS" && // custom elements may use _value internally
  !s.includes("-")) {
    const l = s === "OPTION" ? e.getAttribute("value") || "" : e.value, a = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (l !== a || !("_value" in e)) && (e.value = a), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let r = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean" ? n = pa(n) : n == null && l === "string" ? (n = "", r = !0) : l === "number" && (n = 0, r = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  r && e.removeAttribute(i || t);
}
function hn(e, t, n, o) {
  e.addEventListener(t, n, o);
}
function Wf(e, t, n, o) {
  e.removeEventListener(t, n, o);
}
const ul = /* @__PURE__ */ Symbol("_vei");
function Kf(e, t, n, o, i = null) {
  const s = e[ul] || (e[ul] = {}), r = s[t];
  if (o && r)
    r.value = o;
  else {
    const [l, a] = Xf(t);
    if (o) {
      const u = s[t] = Zf(
        o,
        i
      );
      hn(e, l, u, a);
    } else r && (Wf(e, l, r, a), s[t] = void 0);
  }
}
const cl = /(?:Once|Passive|Capture)$/;
function Xf(e) {
  let t;
  if (cl.test(e)) {
    t = {};
    let o;
    for (; o = e.match(cl); )
      e = e.slice(0, e.length - o[0].length), t[o[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : $n(e.slice(2)), t];
}
let bs = 0;
const jf = /* @__PURE__ */ Promise.resolve(), qf = () => bs || (jf.then(() => bs = 0), bs = Date.now());
function Zf(e, t) {
  const n = (o) => {
    if (!o._vts)
      o._vts = Date.now();
    else if (o._vts <= n.attached)
      return;
    Dt(
      Jf(o, n.value),
      t,
      5,
      [o]
    );
  };
  return n.value = e, n.attached = qf(), n;
}
function Jf(e, t) {
  if (ue(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (o) => (i) => !i._stopped && o && o(i)
    );
  } else
    return t;
}
const dl = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Qf = (e, t, n, o, i, s) => {
  const r = i === "svg";
  t === "class" ? zf(e, o, r) : t === "style" ? Uf(e, n, o) : Oi(t) ? Di(t) || Kf(e, t, n, o, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : ep(e, t, o, r)) ? (al(e, t, o), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && ll(e, t, o, r, s, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (tp(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !Ve(o))) ? al(e, et(t), o, s, t) : (t === "true-value" ? e._trueValue = o : t === "false-value" && (e._falseValue = o), ll(e, t, o, r));
};
function ep(e, t, n, o) {
  if (o)
    return !!(t === "innerHTML" || t === "textContent" || t in e && dl(t) && fe(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return dl(t) && Ve(n) ? !1 : t in e;
}
function tp(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const o = et(t);
  return Array.isArray(n) ? n.some((i) => et(i) === o) : Object.keys(n).some((i) => et(i) === o);
}
const _i = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return ue(t) ? (n) => ni(t, n) : t;
};
function np(e) {
  e.target.composing = !0;
}
function fl(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const Hn = /* @__PURE__ */ Symbol("_assign");
function pl(e, t, n) {
  return t && (e = e.trim()), n && (e = zi(e)), e;
}
const ke = {
  created(e, { modifiers: { lazy: t, trim: n, number: o } }, i) {
    e[Hn] = _i(i);
    const s = o || i.props && i.props.type === "number";
    hn(e, t ? "change" : "input", (r) => {
      r.target.composing || e[Hn](pl(e.value, n, s));
    }), (n || s) && hn(e, "change", () => {
      e.value = pl(e.value, n, s);
    }), t || (hn(e, "compositionstart", np), hn(e, "compositionend", fl), hn(e, "change", fl));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: o, trim: i, number: s } }, r) {
    if (e[Hn] = _i(r), e.composing) return;
    const l = (s || e.type === "number") && !/^0\d/.test(e.value) ? zi(e.value) : e.value, a = t ?? "";
    if (l === a)
      return;
    const u = e.getRootNode();
    (u instanceof Document || u instanceof ShadowRoot) && u.activeElement === e && e.type !== "range" && (o && t === n || i && e.value.trim() === a) || (e.value = a);
  }
}, dt = {
  // <select multiple> value need to be deep traversed
  deep: !0,
  created(e, { value: t, modifiers: { number: n } }, o) {
    const i = ki(t);
    hn(e, "change", () => {
      const s = Array.prototype.filter.call(e.options, (r) => r.selected).map(
        (r) => n ? zi(bi(r)) : bi(r)
      );
      e[Hn](
        e.multiple ? i ? new Set(s) : s : s[0]
      ), e._assigning = !0, rt(() => {
        e._assigning = !1;
      });
    }), e[Hn] = _i(o);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(e, { value: t }) {
    hl(e, t);
  },
  beforeUpdate(e, t, n) {
    e[Hn] = _i(n);
  },
  updated(e, { value: t }) {
    e._assigning || hl(e, t);
  }
};
function hl(e, t) {
  const n = e.multiple, o = ue(t);
  if (!(n && !o && !ki(t))) {
    for (let i = 0, s = e.options.length; i < s; i++) {
      const r = e.options[i], l = bi(r);
      if (n)
        if (o) {
          const a = typeof l;
          a === "string" || a === "number" ? r.selected = t.some((u) => String(u) === String(l)) : r.selected = qc(t, l) > -1;
        } else
          r.selected = t.has(l);
      else if (Vo(bi(r), t)) {
        e.selectedIndex !== i && (e.selectedIndex = i);
        return;
      }
    }
    !n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
  }
}
function bi(e) {
  return "_value" in e ? e._value : e.value;
}
const op = ["ctrl", "shift", "alt", "meta"], ip = {
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
  exact: (e, t) => op.some((n) => e[`${n}Key`] && !t.includes(n))
}, mo = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), o = t.join(".");
  return n[o] || (n[o] = ((i, ...s) => {
    for (let r = 0; r < t.length; r++) {
      const l = ip[t[r]];
      if (l && l(i, t)) return;
    }
    return e(i, ...s);
  }));
}, sp = /* @__PURE__ */ Xe({ patchProp: Qf }, Vf);
let gl;
function rp() {
  return gl || (gl = mf(sp));
}
const lp = ((...e) => {
  const t = rp().createApp(...e), { mount: n } = t;
  return t.mount = (o) => {
    const i = up(o);
    if (!i) return;
    const s = t._component;
    !fe(s) && !s.render && !s.template && (s.template = i.innerHTML), i.nodeType === 1 && (i.textContent = "");
    const r = n(i, !1, ap(i));
    return i instanceof Element && (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")), r;
  }, t;
});
function ap(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function up(e) {
  return Ve(e) ? document.querySelector(e) : e;
}
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let xu;
const Ji = (e) => xu = e, Su = (
  /* istanbul ignore next */
  Symbol()
);
function Ls(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var yo;
(function(e) {
  e.direct = "direct", e.patchObject = "patch object", e.patchFunction = "patch function";
})(yo || (yo = {}));
function cp() {
  const e = Fi(!0), t = e.run(() => /* @__PURE__ */ De({}));
  let n = [], o = [];
  const i = nt({
    install(s) {
      Ji(i), i._a = s, s.provide(Su, i), s.config.globalProperties.$pinia = i, o.forEach((r) => n.push(r)), o = [];
    },
    use(s) {
      return this._a ? n.push(s) : o.push(s), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return i;
}
const Eu = () => {
};
function vl(e, t, n, o = Eu) {
  e.push(t);
  const i = () => {
    const s = e.indexOf(t);
    s > -1 && (e.splice(s, 1), o());
  };
  return !n && Li() && co(i), i;
}
function Tn(e, ...t) {
  e.slice().forEach((n) => {
    n(...t);
  });
}
const dp = (e) => e(), ml = Symbol(), ws = Symbol();
function Us(e, t) {
  e instanceof Map && t instanceof Map ? t.forEach((n, o) => e.set(o, n)) : e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
    if (!t.hasOwnProperty(n))
      continue;
    const o = t[n], i = e[n];
    Ls(i) && Ls(o) && e.hasOwnProperty(n) && !/* @__PURE__ */ Ae(o) && !/* @__PURE__ */ Wt(o) ? e[n] = Us(i, o) : e[n] = o;
  }
  return e;
}
const fp = (
  /* istanbul ignore next */
  Symbol()
);
function pp(e) {
  return !Ls(e) || !e.hasOwnProperty(fp);
}
const { assign: on } = Object;
function hp(e) {
  return !!(/* @__PURE__ */ Ae(e) && e.effect);
}
function gp(e, t, n, o) {
  const { state: i, actions: s, getters: r } = t, l = n.state.value[e];
  let a;
  function u() {
    l || (n.state.value[e] = i ? i() : {});
    const c = /* @__PURE__ */ Oa(n.state.value[e]);
    return on(c, s, Object.keys(r || {}).reduce((d, h) => (d[h] = nt(se(() => {
      Ji(n);
      const v = n._s.get(e);
      return r[h].call(v, v);
    })), d), {}));
  }
  return a = Nu(e, u, t, n, o, !0), a;
}
function Nu(e, t, n = {}, o, i, s) {
  let r;
  const l = on({ actions: {} }, n), a = { deep: !0 };
  let u, c, d = [], h = [], v;
  const N = o.state.value[e];
  !s && !N && (o.state.value[e] = {});
  let x;
  function M(F) {
    let G;
    u = c = !1, typeof F == "function" ? (F(o.state.value[e]), G = {
      type: yo.patchFunction,
      storeId: e,
      events: v
    }) : (Us(o.state.value[e], F), G = {
      type: yo.patchObject,
      payload: F,
      storeId: e,
      events: v
    });
    const X = x = Symbol();
    rt().then(() => {
      x === X && (u = !0);
    }), c = !0, Tn(d, G, o.state.value[e]);
  }
  const E = s ? function() {
    const { state: G } = n, X = G ? G() : {};
    this.$patch((Y) => {
      on(Y, X);
    });
  } : (
    /* istanbul ignore next */
    Eu
  );
  function T() {
    r.stop(), d = [], h = [], o._s.delete(e);
  }
  const S = (F, G = "") => {
    if (ml in F)
      return F[ws] = G, F;
    const X = function() {
      Ji(o);
      const Y = Array.from(arguments), P = [], oe = [];
      function $(k) {
        P.push(k);
      }
      function z(k) {
        oe.push(k);
      }
      Tn(h, {
        args: Y,
        name: X[ws],
        store: H,
        after: $,
        onError: z
      });
      let I;
      try {
        I = F.apply(this && this.$id === e ? this : H, Y);
      } catch (k) {
        throw Tn(oe, k), k;
      }
      return I instanceof Promise ? I.then((k) => (Tn(P, k), k)).catch((k) => (Tn(oe, k), Promise.reject(k))) : (Tn(P, I), I);
    };
    return X[ml] = !0, X[ws] = G, X;
  }, C = {
    _p: o,
    // _s: scope,
    $id: e,
    $onAction: vl.bind(null, h),
    $patch: M,
    $reset: E,
    $subscribe(F, G = {}) {
      const X = vl(d, F, G.detached, () => Y()), Y = r.run(() => be(() => o.state.value[e], (P) => {
        (G.flush === "sync" ? c : u) && F({
          storeId: e,
          type: yo.direct,
          events: v
        }, P);
      }, on({}, a, G)));
      return X;
    },
    $dispose: T
  }, H = /* @__PURE__ */ Bo(C);
  o._s.set(e, H);
  const K = (o._a && o._a.runWithContext || dp)(() => o._e.run(() => (r = Fi()).run(() => t({ action: S }))));
  for (const F in K) {
    const G = K[F];
    if (/* @__PURE__ */ Ae(G) && !hp(G) || /* @__PURE__ */ Wt(G))
      s || (N && pp(G) && (/* @__PURE__ */ Ae(G) ? G.value = N[F] : Us(G, N[F])), o.state.value[e][F] = G);
    else if (typeof G == "function") {
      const X = S(G, F);
      K[F] = X, l.actions[F] = G;
    }
  }
  return on(H, K), on(/* @__PURE__ */ Se(H), K), Object.defineProperty(H, "$state", {
    get: () => o.state.value[e],
    set: (F) => {
      M((G) => {
        on(G, F);
      });
    }
  }), o._p.forEach((F) => {
    on(H, r.run(() => F({
      store: H,
      app: o._a,
      pinia: o,
      options: l
    })));
  }), N && s && n.hydrate && n.hydrate(H.$state, N), u = !0, c = !0, H;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Qi(e, t, n) {
  let o, i;
  const s = typeof t == "function";
  typeof e == "string" ? (o = e, i = s ? n : t) : (i = e, o = e.id);
  function r(l, a) {
    const u = Td();
    return l = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    l || (u ? mt(Su, null) : null), l && Ji(l), l = xu, l._s.has(o) || (s ? Nu(o, t, i, l) : gp(o, i, l)), l._s.get(o);
  }
  return r.$id = o, r;
}
function Mo(e) {
  return Li() ? (co(e), !0) : !1;
}
function Ut(e) {
  return typeof e == "function" ? e() : L(e);
}
const vp = typeof window < "u" && typeof document < "u", mp = (e) => typeof e < "u", yp = Object.prototype.toString, _p = (e) => yp.call(e) === "[object Object]", bp = () => {
};
function wp(e, t) {
  function n(...o) {
    return new Promise((i, s) => {
      Promise.resolve(e(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(i).catch(s);
    });
  }
  return n;
}
const Cu = (e) => e();
function xp(e = Cu) {
  const t = /* @__PURE__ */ De(!0);
  function n() {
    t.value = !1;
  }
  function o() {
    t.value = !0;
  }
  return { isActive: /* @__PURE__ */ di(t), pause: n, resume: o, eventFilter: (...s) => {
    t.value && e(...s);
  } };
}
function yl(e, t = !1, n = "Timeout") {
  return new Promise((o, i) => {
    setTimeout(t ? () => i(n) : o, e);
  });
}
function Sp(e, t, n = {}) {
  const {
    eventFilter: o = Cu,
    ...i
  } = n;
  return be(
    e,
    wp(
      o,
      t
    ),
    i
  );
}
function Pn(e, t, n = {}) {
  const {
    eventFilter: o,
    ...i
  } = n, { eventFilter: s, pause: r, resume: l, isActive: a } = xp(o);
  return { stop: Sp(
    e,
    t,
    {
      ...i,
      eventFilter: s
    }
  ), pause: r, resume: l, isActive: a };
}
function Ep(e, t = {}) {
  if (!/* @__PURE__ */ Ae(e))
    return /* @__PURE__ */ Oa(e);
  const n = Array.isArray(e.value) ? Array.from({ length: e.value.length }) : {};
  for (const o in e.value)
    n[o] = bd(() => ({
      get() {
        return e.value[o];
      },
      set(i) {
        var s;
        if ((s = Ut(t.replaceRef)) != null ? s : !0)
          if (Array.isArray(e.value)) {
            const l = [...e.value];
            l[o] = i, e.value = l;
          } else {
            const l = { ...e.value, [o]: i };
            Object.setPrototypeOf(l, Object.getPrototypeOf(e.value)), e.value = l;
          }
        else
          e.value[o] = i;
      }
    }));
  return n;
}
function Gs(e, t = !1) {
  function n(d, { flush: h = "sync", deep: v = !1, timeout: N, throwOnTimeout: x } = {}) {
    let M = null;
    const T = [new Promise((S) => {
      M = be(
        e,
        (C) => {
          d(C) !== t && (M == null || M(), S(C));
        },
        {
          flush: h,
          deep: v,
          immediate: !0
        }
      );
    })];
    return N != null && T.push(
      yl(N, x).then(() => Ut(e)).finally(() => M == null ? void 0 : M())
    ), Promise.race(T);
  }
  function o(d, h) {
    if (!/* @__PURE__ */ Ae(d))
      return n((C) => C === d, h);
    const { flush: v = "sync", deep: N = !1, timeout: x, throwOnTimeout: M } = h ?? {};
    let E = null;
    const S = [new Promise((C) => {
      E = be(
        [e, d],
        ([H, j]) => {
          t !== (H === j) && (E == null || E(), C(H));
        },
        {
          flush: v,
          deep: N,
          immediate: !0
        }
      );
    })];
    return x != null && S.push(
      yl(x, M).then(() => Ut(e)).finally(() => (E == null || E(), Ut(e)))
    ), Promise.race(S);
  }
  function i(d) {
    return n((h) => !!h, d);
  }
  function s(d) {
    return o(null, d);
  }
  function r(d) {
    return o(void 0, d);
  }
  function l(d) {
    return n(Number.isNaN, d);
  }
  function a(d, h) {
    return n((v) => {
      const N = Array.from(v);
      return N.includes(d) || N.includes(Ut(d));
    }, h);
  }
  function u(d) {
    return c(1, d);
  }
  function c(d = 1, h) {
    let v = -1;
    return n(() => (v += 1, v >= d), h);
  }
  return Array.isArray(Ut(e)) ? {
    toMatch: n,
    toContains: a,
    changed: u,
    changedTimes: c,
    get not() {
      return Gs(e, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: i,
    toBeNull: s,
    toBeNaN: l,
    toBeUndefined: r,
    changed: u,
    changedTimes: c,
    get not() {
      return Gs(e, !t);
    }
  };
}
function Ys(e) {
  return Gs(e);
}
function Np(e) {
  var t;
  const n = Ut(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const $u = vp ? window : void 0;
function Mu(...e) {
  let t, n, o, i;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([n, o, i] = e, t = $u) : [t, n, o, i] = e, !t)
    return bp;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const s = [], r = () => {
    s.forEach((c) => c()), s.length = 0;
  }, l = (c, d, h, v) => (c.addEventListener(d, h, v), () => c.removeEventListener(d, h, v)), a = be(
    () => [Np(t), Ut(i)],
    ([c, d]) => {
      if (r(), !c)
        return;
      const h = _p(d) ? { ...d } : d;
      s.push(
        ...n.flatMap((v) => o.map((N) => l(c, v, N, h)))
      );
    },
    { immediate: !0, flush: "post" }
  ), u = () => {
    a(), r();
  };
  return Mo(u), u;
}
function Cp(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function _l(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const {
    target: i = $u,
    eventName: s = "keydown",
    passive: r = !1,
    dedupe: l = !1
  } = o, a = Cp(t);
  return Mu(i, s, (c) => {
    c.repeat && Ut(l) || a(c) && n(c);
  }, r);
}
function $p(e) {
  return JSON.parse(JSON.stringify(e));
}
function xs(e, t, n, o = {}) {
  var i, s, r;
  const {
    clone: l = !1,
    passive: a = !1,
    eventName: u,
    deep: c = !1,
    defaultValue: d,
    shouldEmit: h
  } = o, v = tn(), N = n || (v == null ? void 0 : v.emit) || ((i = v == null ? void 0 : v.$emit) == null ? void 0 : i.bind(v)) || ((r = (s = v == null ? void 0 : v.proxy) == null ? void 0 : s.$emit) == null ? void 0 : r.bind(v == null ? void 0 : v.proxy));
  let x = u;
  t || (t = "modelValue"), x = x || `update:${t.toString()}`;
  const M = (S) => l ? typeof l == "function" ? l(S) : $p(S) : S, E = () => mp(e[t]) ? M(e[t]) : d, T = (S) => {
    h ? h(S) && N(x, S) : N(x, S);
  };
  if (a) {
    const S = E(), C = /* @__PURE__ */ De(S);
    let H = !1;
    return be(
      () => e[t],
      (j) => {
        H || (H = !0, C.value = M(j), rt(() => H = !1));
      }
    ), be(
      C,
      (j) => {
        !H && (j !== e[t] || c) && T(j);
      },
      { deep: c }
    ), C;
  } else
    return se({
      get() {
        return E();
      },
      set(S) {
        T(S);
      }
    });
}
var Mp = { value: () => {
} };
function es() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new si(n);
}
function si(e) {
  this._ = e;
}
function Ip(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
si.prototype = es.prototype = {
  constructor: si,
  on: function(e, t) {
    var n = this._, o = Ip(e + "", n), i, s = -1, r = o.length;
    if (arguments.length < 2) {
      for (; ++s < r; )
        if ((i = (e = o[s]).type) && (i = Tp(n[i], e.name)))
          return i;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++s < r; )
      if (i = (e = o[s]).type)
        n[i] = bl(n[i], e.name, t);
      else if (t == null)
        for (i in n)
          n[i] = bl(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new si(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0)
      for (var n = new Array(i), o = 0, i, s; o < i; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (s = this._[e], o = 0, i = s.length; o < i; ++o)
      s[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, s = o.length; i < s; ++i)
      o[i].value.apply(t, n);
  }
};
function Tp(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function bl(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = Mp, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Ws = "http://www.w3.org/1999/xhtml";
const wl = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Ws,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function ts(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), wl.hasOwnProperty(t) ? { space: wl[t], local: e } : e;
}
function Pp(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Ws && t.documentElement.namespaceURI === Ws ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Ap(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Iu(e) {
  var t = ts(e);
  return (t.local ? Ap : Pp)(t);
}
function Op() {
}
function br(e) {
  return e == null ? Op : function() {
    return this.querySelector(e);
  };
}
function Dp(e) {
  typeof e != "function" && (e = br(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var s = t[i], r = s.length, l = o[i] = new Array(r), a, u, c = 0; c < r; ++c)
      (a = s[c]) && (u = e.call(a, a.__data__, c, s)) && ("__data__" in a && (u.__data__ = a.__data__), l[c] = u);
  return new ut(o, this._parents);
}
function kp(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Rp() {
  return [];
}
function Tu(e) {
  return e == null ? Rp : function() {
    return this.querySelectorAll(e);
  };
}
function Vp(e) {
  return function() {
    return kp(e.apply(this, arguments));
  };
}
function Bp(e) {
  typeof e == "function" ? e = Vp(e) : e = Tu(e);
  for (var t = this._groups, n = t.length, o = [], i = [], s = 0; s < n; ++s)
    for (var r = t[s], l = r.length, a, u = 0; u < l; ++u)
      (a = r[u]) && (o.push(e.call(a, a.__data__, u, r)), i.push(a));
  return new ut(o, i);
}
function Pu(e) {
  return function() {
    return this.matches(e);
  };
}
function Au(e) {
  return function(t) {
    return t.matches(e);
  };
}
var zp = Array.prototype.find;
function Hp(e) {
  return function() {
    return zp.call(this.children, e);
  };
}
function Fp() {
  return this.firstElementChild;
}
function Lp(e) {
  return this.select(e == null ? Fp : Hp(typeof e == "function" ? e : Au(e)));
}
var Up = Array.prototype.filter;
function Gp() {
  return Array.from(this.children);
}
function Yp(e) {
  return function() {
    return Up.call(this.children, e);
  };
}
function Wp(e) {
  return this.selectAll(e == null ? Gp : Yp(typeof e == "function" ? e : Au(e)));
}
function Kp(e) {
  typeof e != "function" && (e = Pu(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var s = t[i], r = s.length, l = o[i] = [], a, u = 0; u < r; ++u)
      (a = s[u]) && e.call(a, a.__data__, u, s) && l.push(a);
  return new ut(o, this._parents);
}
function Ou(e) {
  return new Array(e.length);
}
function Xp() {
  return new ut(this._enter || this._groups.map(Ou), this._parents);
}
function wi(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
wi.prototype = {
  constructor: wi,
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
function jp(e) {
  return function() {
    return e;
  };
}
function qp(e, t, n, o, i, s) {
  for (var r = 0, l, a = t.length, u = s.length; r < u; ++r)
    (l = t[r]) ? (l.__data__ = s[r], o[r] = l) : n[r] = new wi(e, s[r]);
  for (; r < a; ++r)
    (l = t[r]) && (i[r] = l);
}
function Zp(e, t, n, o, i, s, r) {
  var l, a, u = /* @__PURE__ */ new Map(), c = t.length, d = s.length, h = new Array(c), v;
  for (l = 0; l < c; ++l)
    (a = t[l]) && (h[l] = v = r.call(a, a.__data__, l, t) + "", u.has(v) ? i[l] = a : u.set(v, a));
  for (l = 0; l < d; ++l)
    v = r.call(e, s[l], l, s) + "", (a = u.get(v)) ? (o[l] = a, a.__data__ = s[l], u.delete(v)) : n[l] = new wi(e, s[l]);
  for (l = 0; l < c; ++l)
    (a = t[l]) && u.get(h[l]) === a && (i[l] = a);
}
function Jp(e) {
  return e.__data__;
}
function Qp(e, t) {
  if (!arguments.length)
    return Array.from(this, Jp);
  var n = t ? Zp : qp, o = this._parents, i = this._groups;
  typeof e != "function" && (e = jp(e));
  for (var s = i.length, r = new Array(s), l = new Array(s), a = new Array(s), u = 0; u < s; ++u) {
    var c = o[u], d = i[u], h = d.length, v = eh(e.call(c, c && c.__data__, u, o)), N = v.length, x = l[u] = new Array(N), M = r[u] = new Array(N), E = a[u] = new Array(h);
    n(c, d, x, M, E, v, t);
    for (var T = 0, S = 0, C, H; T < N; ++T)
      if (C = x[T]) {
        for (T >= S && (S = T + 1); !(H = M[S]) && ++S < N; )
          ;
        C._next = H || null;
      }
  }
  return r = new ut(r, o), r._enter = l, r._exit = a, r;
}
function eh(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function th() {
  return new ut(this._exit || this._groups.map(Ou), this._parents);
}
function nh(e, t, n) {
  var o = this.enter(), i = this, s = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? s.remove() : n(s), o && i ? o.merge(i).order() : i;
}
function oh(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, s = o.length, r = Math.min(i, s), l = new Array(i), a = 0; a < r; ++a)
    for (var u = n[a], c = o[a], d = u.length, h = l[a] = new Array(d), v, N = 0; N < d; ++N)
      (v = u[N] || c[N]) && (h[N] = v);
  for (; a < i; ++a)
    l[a] = n[a];
  return new ut(l, this._parents);
}
function ih() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, s = o[i], r; --i >= 0; )
      (r = o[i]) && (s && r.compareDocumentPosition(s) ^ 4 && s.parentNode.insertBefore(r, s), s = r);
  return this;
}
function sh(e) {
  e || (e = rh);
  function t(d, h) {
    return d && h ? e(d.__data__, h.__data__) : !d - !h;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), s = 0; s < o; ++s) {
    for (var r = n[s], l = r.length, a = i[s] = new Array(l), u, c = 0; c < l; ++c)
      (u = r[c]) && (a[c] = u);
    a.sort(t);
  }
  return new ut(i, this._parents).order();
}
function rh(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function lh() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function ah() {
  return Array.from(this);
}
function uh() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, s = o.length; i < s; ++i) {
      var r = o[i];
      if (r)
        return r;
    }
  return null;
}
function ch() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function dh() {
  return !this.node();
}
function fh(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], s = 0, r = i.length, l; s < r; ++s)
      (l = i[s]) && e.call(l, l.__data__, s, i);
  return this;
}
function ph(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function hh(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function gh(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function vh(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function mh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function yh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function _h(e, t) {
  var n = ts(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? hh : ph : typeof t == "function" ? n.local ? yh : mh : n.local ? vh : gh)(n, t));
}
function Du(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function bh(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function wh(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function xh(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function Sh(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? bh : typeof t == "function" ? xh : wh)(e, t, n ?? "")) : Kn(this.node(), e);
}
function Kn(e, t) {
  return e.style.getPropertyValue(t) || Du(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Eh(e) {
  return function() {
    delete this[e];
  };
}
function Nh(e, t) {
  return function() {
    this[e] = t;
  };
}
function Ch(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function $h(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Eh : typeof t == "function" ? Ch : Nh)(e, t)) : this.node()[e];
}
function ku(e) {
  return e.trim().split(/^|\s+/);
}
function wr(e) {
  return e.classList || new Ru(e);
}
function Ru(e) {
  this._node = e, this._names = ku(e.getAttribute("class") || "");
}
Ru.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Vu(e, t) {
  for (var n = wr(e), o = -1, i = t.length; ++o < i; )
    n.add(t[o]);
}
function Bu(e, t) {
  for (var n = wr(e), o = -1, i = t.length; ++o < i; )
    n.remove(t[o]);
}
function Mh(e) {
  return function() {
    Vu(this, e);
  };
}
function Ih(e) {
  return function() {
    Bu(this, e);
  };
}
function Th(e, t) {
  return function() {
    (t.apply(this, arguments) ? Vu : Bu)(this, e);
  };
}
function Ph(e, t) {
  var n = ku(e + "");
  if (arguments.length < 2) {
    for (var o = wr(this.node()), i = -1, s = n.length; ++i < s; )
      if (!o.contains(n[i]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Th : t ? Mh : Ih)(n, t));
}
function Ah() {
  this.textContent = "";
}
function Oh(e) {
  return function() {
    this.textContent = e;
  };
}
function Dh(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function kh(e) {
  return arguments.length ? this.each(e == null ? Ah : (typeof e == "function" ? Dh : Oh)(e)) : this.node().textContent;
}
function Rh() {
  this.innerHTML = "";
}
function Vh(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Bh(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function zh(e) {
  return arguments.length ? this.each(e == null ? Rh : (typeof e == "function" ? Bh : Vh)(e)) : this.node().innerHTML;
}
function Hh() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Fh() {
  return this.each(Hh);
}
function Lh() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Uh() {
  return this.each(Lh);
}
function Gh(e) {
  var t = typeof e == "function" ? e : Iu(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Yh() {
  return null;
}
function Wh(e, t) {
  var n = typeof e == "function" ? e : Iu(e), o = t == null ? Yh : typeof t == "function" ? t : br(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Kh() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Xh() {
  return this.each(Kh);
}
function jh() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function qh() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Zh(e) {
  return this.select(e ? qh : jh);
}
function Jh(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Qh(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function eg(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function tg(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, s; n < i; ++n)
        s = t[n], (!e.type || s.type === e.type) && s.name === e.name ? this.removeEventListener(s.type, s.listener, s.options) : t[++o] = s;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function ng(e, t, n) {
  return function() {
    var o = this.__on, i, s = Qh(t);
    if (o) {
      for (var r = 0, l = o.length; r < l; ++r)
        if ((i = o[r]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = s, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, s, n), i = { type: e.type, name: e.name, value: t, listener: s, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function og(e, t, n) {
  var o = eg(e + ""), i, s = o.length, r;
  if (arguments.length < 2) {
    var l = this.node().__on;
    if (l) {
      for (var a = 0, u = l.length, c; a < u; ++a)
        for (i = 0, c = l[a]; i < s; ++i)
          if ((r = o[i]).type === c.type && r.name === c.name)
            return c.value;
    }
    return;
  }
  for (l = t ? ng : tg, i = 0; i < s; ++i)
    this.each(l(o[i], t, n));
  return this;
}
function zu(e, t, n) {
  var o = Du(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function ig(e, t) {
  return function() {
    return zu(this, e, t);
  };
}
function sg(e, t) {
  return function() {
    return zu(this, e, t.apply(this, arguments));
  };
}
function rg(e, t) {
  return this.each((typeof t == "function" ? sg : ig)(e, t));
}
function* lg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, s = o.length, r; i < s; ++i)
      (r = o[i]) && (yield r);
}
var Hu = [null];
function ut(e, t) {
  this._groups = e, this._parents = t;
}
function Fo() {
  return new ut([[document.documentElement]], Hu);
}
function ag() {
  return this;
}
ut.prototype = Fo.prototype = {
  constructor: ut,
  select: Dp,
  selectAll: Bp,
  selectChild: Lp,
  selectChildren: Wp,
  filter: Kp,
  data: Qp,
  enter: Xp,
  exit: th,
  join: nh,
  merge: oh,
  selection: ag,
  order: ih,
  sort: sh,
  call: lh,
  nodes: ah,
  node: uh,
  size: ch,
  empty: dh,
  each: fh,
  attr: _h,
  style: Sh,
  property: $h,
  classed: Ph,
  text: kh,
  html: zh,
  raise: Fh,
  lower: Uh,
  append: Gh,
  insert: Wh,
  remove: Xh,
  clone: Zh,
  datum: Jh,
  on: og,
  dispatch: rg,
  [Symbol.iterator]: lg
};
function pt(e) {
  return typeof e == "string" ? new ut([[document.querySelector(e)]], [document.documentElement]) : new ut([[e]], Hu);
}
function ug(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function Ct(e, t) {
  if (e = ug(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const cg = { passive: !1 }, Io = { capture: !0, passive: !1 };
function Ss(e) {
  e.stopImmediatePropagation();
}
function Fn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Fu(e) {
  var t = e.document.documentElement, n = pt(e).on("dragstart.drag", Fn, Io);
  "onselectstart" in t ? n.on("selectstart.drag", Fn, Io) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Lu(e, t) {
  var n = e.document.documentElement, o = pt(e).on("dragstart.drag", null);
  t && (o.on("click.drag", Fn, Io), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const Ko = (e) => () => e;
function Ks(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: i,
  active: s,
  x: r,
  y: l,
  dx: a,
  dy: u,
  dispatch: c
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: s, enumerable: !0, configurable: !0 },
    x: { value: r, enumerable: !0, configurable: !0 },
    y: { value: l, enumerable: !0, configurable: !0 },
    dx: { value: a, enumerable: !0, configurable: !0 },
    dy: { value: u, enumerable: !0, configurable: !0 },
    _: { value: c }
  });
}
Ks.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function dg(e) {
  return !e.ctrlKey && !e.button;
}
function fg() {
  return this.parentNode;
}
function pg(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function hg() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function gg() {
  var e = dg, t = fg, n = pg, o = hg, i = {}, s = es("start", "drag", "end"), r = 0, l, a, u, c, d = 0;
  function h(C) {
    C.on("mousedown.drag", v).filter(o).on("touchstart.drag", M).on("touchmove.drag", E, cg).on("touchend.drag touchcancel.drag", T).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function v(C, H) {
    if (!(c || !e.call(this, C, H))) {
      var j = S(this, t.call(this, C, H), C, H, "mouse");
      j && (pt(C.view).on("mousemove.drag", N, Io).on("mouseup.drag", x, Io), Fu(C.view), Ss(C), u = !1, l = C.clientX, a = C.clientY, j("start", C));
    }
  }
  function N(C) {
    if (Fn(C), !u) {
      var H = C.clientX - l, j = C.clientY - a;
      u = H * H + j * j > d;
    }
    i.mouse("drag", C);
  }
  function x(C) {
    pt(C.view).on("mousemove.drag mouseup.drag", null), Lu(C.view, u), Fn(C), i.mouse("end", C);
  }
  function M(C, H) {
    if (e.call(this, C, H)) {
      var j = C.changedTouches, K = t.call(this, C, H), F = j.length, G, X;
      for (G = 0; G < F; ++G)
        (X = S(this, K, C, H, j[G].identifier, j[G])) && (Ss(C), X("start", C, j[G]));
    }
  }
  function E(C) {
    var H = C.changedTouches, j = H.length, K, F;
    for (K = 0; K < j; ++K)
      (F = i[H[K].identifier]) && (Fn(C), F("drag", C, H[K]));
  }
  function T(C) {
    var H = C.changedTouches, j = H.length, K, F;
    for (c && clearTimeout(c), c = setTimeout(function() {
      c = null;
    }, 500), K = 0; K < j; ++K)
      (F = i[H[K].identifier]) && (Ss(C), F("end", C, H[K]));
  }
  function S(C, H, j, K, F, G) {
    var X = s.copy(), Y = Ct(G || j, H), P, oe, $;
    if (($ = n.call(C, new Ks("beforestart", {
      sourceEvent: j,
      target: h,
      identifier: F,
      active: r,
      x: Y[0],
      y: Y[1],
      dx: 0,
      dy: 0,
      dispatch: X
    }), K)) != null)
      return P = $.x - Y[0] || 0, oe = $.y - Y[1] || 0, function z(I, k, V) {
        var q = Y, Z;
        switch (I) {
          case "start":
            i[F] = z, Z = r++;
            break;
          case "end":
            delete i[F], --r;
          case "drag":
            Y = Ct(V || k, H), Z = r;
            break;
        }
        X.call(
          I,
          C,
          new Ks(I, {
            sourceEvent: k,
            subject: $,
            target: h,
            identifier: F,
            active: Z,
            x: Y[0] + P,
            y: Y[1] + oe,
            dx: Y[0] - q[0],
            dy: Y[1] - q[1],
            dispatch: X
          }),
          K
        );
      };
  }
  return h.filter = function(C) {
    return arguments.length ? (e = typeof C == "function" ? C : Ko(!!C), h) : e;
  }, h.container = function(C) {
    return arguments.length ? (t = typeof C == "function" ? C : Ko(C), h) : t;
  }, h.subject = function(C) {
    return arguments.length ? (n = typeof C == "function" ? C : Ko(C), h) : n;
  }, h.touchable = function(C) {
    return arguments.length ? (o = typeof C == "function" ? C : Ko(!!C), h) : o;
  }, h.on = function() {
    var C = s.on.apply(s, arguments);
    return C === s ? h : C;
  }, h.clickDistance = function(C) {
    return arguments.length ? (d = (C = +C) * C, h) : Math.sqrt(d);
  }, h;
}
function xr(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Uu(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function Lo() {
}
var To = 0.7, xi = 1 / To, Ln = "\\s*([+-]?\\d+)\\s*", Po = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ot = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", vg = /^#([0-9a-f]{3,8})$/, mg = new RegExp(`^rgb\\(${Ln},${Ln},${Ln}\\)$`), yg = new RegExp(`^rgb\\(${Ot},${Ot},${Ot}\\)$`), _g = new RegExp(`^rgba\\(${Ln},${Ln},${Ln},${Po}\\)$`), bg = new RegExp(`^rgba\\(${Ot},${Ot},${Ot},${Po}\\)$`), wg = new RegExp(`^hsl\\(${Po},${Ot},${Ot}\\)$`), xg = new RegExp(`^hsla\\(${Po},${Ot},${Ot},${Po}\\)$`), xl = {
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
xr(Lo, En, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Sl,
  // Deprecated! Use color.formatHex.
  formatHex: Sl,
  formatHex8: Sg,
  formatHsl: Eg,
  formatRgb: El,
  toString: El
});
function Sl() {
  return this.rgb().formatHex();
}
function Sg() {
  return this.rgb().formatHex8();
}
function Eg() {
  return Gu(this).formatHsl();
}
function El() {
  return this.rgb().formatRgb();
}
function En(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = vg.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Nl(t) : n === 3 ? new ot(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Xo(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Xo(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = mg.exec(e)) ? new ot(t[1], t[2], t[3], 1) : (t = yg.exec(e)) ? new ot(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = _g.exec(e)) ? Xo(t[1], t[2], t[3], t[4]) : (t = bg.exec(e)) ? Xo(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = wg.exec(e)) ? Ml(t[1], t[2] / 100, t[3] / 100, 1) : (t = xg.exec(e)) ? Ml(t[1], t[2] / 100, t[3] / 100, t[4]) : xl.hasOwnProperty(e) ? Nl(xl[e]) : e === "transparent" ? new ot(NaN, NaN, NaN, 0) : null;
}
function Nl(e) {
  return new ot(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Xo(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new ot(e, t, n, o);
}
function Ng(e) {
  return e instanceof Lo || (e = En(e)), e ? (e = e.rgb(), new ot(e.r, e.g, e.b, e.opacity)) : new ot();
}
function Xs(e, t, n, o) {
  return arguments.length === 1 ? Ng(e) : new ot(e, t, n, o ?? 1);
}
function ot(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
xr(ot, Xs, Uu(Lo, {
  brighter(e) {
    return e = e == null ? xi : Math.pow(xi, e), new ot(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? To : Math.pow(To, e), new ot(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new ot(bn(this.r), bn(this.g), bn(this.b), Si(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Cl,
  // Deprecated! Use color.formatHex.
  formatHex: Cl,
  formatHex8: Cg,
  formatRgb: $l,
  toString: $l
}));
function Cl() {
  return `#${mn(this.r)}${mn(this.g)}${mn(this.b)}`;
}
function Cg() {
  return `#${mn(this.r)}${mn(this.g)}${mn(this.b)}${mn((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function $l() {
  const e = Si(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${bn(this.r)}, ${bn(this.g)}, ${bn(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Si(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function bn(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function mn(e) {
  return e = bn(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Ml(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new ht(e, t, n, o);
}
function Gu(e) {
  if (e instanceof ht)
    return new ht(e.h, e.s, e.l, e.opacity);
  if (e instanceof Lo || (e = En(e)), !e)
    return new ht();
  if (e instanceof ht)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, i = Math.min(t, n, o), s = Math.max(t, n, o), r = NaN, l = s - i, a = (s + i) / 2;
  return l ? (t === s ? r = (n - o) / l + (n < o) * 6 : n === s ? r = (o - t) / l + 2 : r = (t - n) / l + 4, l /= a < 0.5 ? s + i : 2 - s - i, r *= 60) : l = a > 0 && a < 1 ? 0 : r, new ht(r, l, a, e.opacity);
}
function $g(e, t, n, o) {
  return arguments.length === 1 ? Gu(e) : new ht(e, t, n, o ?? 1);
}
function ht(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
xr(ht, $g, Uu(Lo, {
  brighter(e) {
    return e = e == null ? xi : Math.pow(xi, e), new ht(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? To : Math.pow(To, e), new ht(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new ot(
      Es(e >= 240 ? e - 240 : e + 120, i, o),
      Es(e, i, o),
      Es(e < 120 ? e + 240 : e - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new ht(Il(this.h), jo(this.s), jo(this.l), Si(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Si(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Il(this.h)}, ${jo(this.s) * 100}%, ${jo(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Il(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function jo(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Es(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Sr = (e) => () => e;
function Mg(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Ig(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function Tg(e) {
  return (e = +e) == 1 ? Yu : function(t, n) {
    return n - t ? Ig(t, n, e) : Sr(isNaN(t) ? n : t);
  };
}
function Yu(e, t) {
  var n = t - e;
  return n ? Mg(e, n) : Sr(isNaN(e) ? t : e);
}
const Ei = (function e(t) {
  var n = Tg(t);
  function o(i, s) {
    var r = n((i = Xs(i)).r, (s = Xs(s)).r), l = n(i.g, s.g), a = n(i.b, s.b), u = Yu(i.opacity, s.opacity);
    return function(c) {
      return i.r = r(c), i.g = l(c), i.b = a(c), i.opacity = u(c), i + "";
    };
  }
  return o.gamma = e, o;
})(1);
function Pg(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, o = t.slice(), i;
  return function(s) {
    for (i = 0; i < n; ++i)
      o[i] = e[i] * (1 - s) + t[i] * s;
    return o;
  };
}
function Ag(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Og(e, t) {
  var n = t ? t.length : 0, o = e ? Math.min(n, e.length) : 0, i = new Array(o), s = new Array(n), r;
  for (r = 0; r < o; ++r)
    i[r] = _o(e[r], t[r]);
  for (; r < n; ++r)
    s[r] = t[r];
  return function(l) {
    for (r = 0; r < o; ++r)
      s[r] = i[r](l);
    return s;
  };
}
function Dg(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(o) {
    return n.setTime(e * (1 - o) + t * o), n;
  };
}
function It(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function kg(e, t) {
  var n = {}, o = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = _o(e[i], t[i]) : o[i] = t[i];
  return function(s) {
    for (i in n)
      o[i] = n[i](s);
    return o;
  };
}
var js = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Ns = new RegExp(js.source, "g");
function Rg(e) {
  return function() {
    return e;
  };
}
function Vg(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Wu(e, t) {
  var n = js.lastIndex = Ns.lastIndex = 0, o, i, s, r = -1, l = [], a = [];
  for (e = e + "", t = t + ""; (o = js.exec(e)) && (i = Ns.exec(t)); )
    (s = i.index) > n && (s = t.slice(n, s), l[r] ? l[r] += s : l[++r] = s), (o = o[0]) === (i = i[0]) ? l[r] ? l[r] += i : l[++r] = i : (l[++r] = null, a.push({ i: r, x: It(o, i) })), n = Ns.lastIndex;
  return n < t.length && (s = t.slice(n), l[r] ? l[r] += s : l[++r] = s), l.length < 2 ? a[0] ? Vg(a[0].x) : Rg(t) : (t = a.length, function(u) {
    for (var c = 0, d; c < t; ++c)
      l[(d = a[c]).i] = d.x(u);
    return l.join("");
  });
}
function _o(e, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? Sr(t) : (n === "number" ? It : n === "string" ? (o = En(t)) ? (t = o, Ei) : Wu : t instanceof En ? Ei : t instanceof Date ? Dg : Ag(t) ? Pg : Array.isArray(t) ? Og : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? kg : It)(e, t);
}
var Tl = 180 / Math.PI, qs = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Ku(e, t, n, o, i, s) {
  var r, l, a;
  return (r = Math.sqrt(e * e + t * t)) && (e /= r, t /= r), (a = e * n + t * o) && (n -= e * a, o -= t * a), (l = Math.sqrt(n * n + o * o)) && (n /= l, o /= l, a /= l), e * o < t * n && (e = -e, t = -t, a = -a, r = -r), {
    translateX: i,
    translateY: s,
    rotate: Math.atan2(t, e) * Tl,
    skewX: Math.atan(a) * Tl,
    scaleX: r,
    scaleY: l
  };
}
var qo;
function Bg(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? qs : Ku(t.a, t.b, t.c, t.d, t.e, t.f);
}
function zg(e) {
  return e == null || (qo || (qo = document.createElementNS("http://www.w3.org/2000/svg", "g")), qo.setAttribute("transform", e), !(e = qo.transform.baseVal.consolidate())) ? qs : (e = e.matrix, Ku(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Xu(e, t, n, o) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function s(u, c, d, h, v, N) {
    if (u !== d || c !== h) {
      var x = v.push("translate(", null, t, null, n);
      N.push({ i: x - 4, x: It(u, d) }, { i: x - 2, x: It(c, h) });
    } else (d || h) && v.push("translate(" + d + t + h + n);
  }
  function r(u, c, d, h) {
    u !== c ? (u - c > 180 ? c += 360 : c - u > 180 && (u += 360), h.push({ i: d.push(i(d) + "rotate(", null, o) - 2, x: It(u, c) })) : c && d.push(i(d) + "rotate(" + c + o);
  }
  function l(u, c, d, h) {
    u !== c ? h.push({ i: d.push(i(d) + "skewX(", null, o) - 2, x: It(u, c) }) : c && d.push(i(d) + "skewX(" + c + o);
  }
  function a(u, c, d, h, v, N) {
    if (u !== d || c !== h) {
      var x = v.push(i(v) + "scale(", null, ",", null, ")");
      N.push({ i: x - 4, x: It(u, d) }, { i: x - 2, x: It(c, h) });
    } else (d !== 1 || h !== 1) && v.push(i(v) + "scale(" + d + "," + h + ")");
  }
  return function(u, c) {
    var d = [], h = [];
    return u = e(u), c = e(c), s(u.translateX, u.translateY, c.translateX, c.translateY, d, h), r(u.rotate, c.rotate, d, h), l(u.skewX, c.skewX, d, h), a(u.scaleX, u.scaleY, c.scaleX, c.scaleY, d, h), u = c = null, function(v) {
      for (var N = -1, x = h.length, M; ++N < x; )
        d[(M = h[N]).i] = M.x(v);
      return d.join("");
    };
  };
}
var Hg = Xu(Bg, "px, ", "px)", "deg)"), Fg = Xu(zg, ", ", ")", ")"), Lg = 1e-12;
function Pl(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Ug(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Gg(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const ri = (function e(t, n, o) {
  function i(s, r) {
    var l = s[0], a = s[1], u = s[2], c = r[0], d = r[1], h = r[2], v = c - l, N = d - a, x = v * v + N * N, M, E;
    if (x < Lg)
      E = Math.log(h / u) / t, M = function(K) {
        return [
          l + K * v,
          a + K * N,
          u * Math.exp(t * K * E)
        ];
      };
    else {
      var T = Math.sqrt(x), S = (h * h - u * u + o * x) / (2 * u * n * T), C = (h * h - u * u - o * x) / (2 * h * n * T), H = Math.log(Math.sqrt(S * S + 1) - S), j = Math.log(Math.sqrt(C * C + 1) - C);
      E = (j - H) / t, M = function(K) {
        var F = K * E, G = Pl(H), X = u / (n * T) * (G * Gg(t * F + H) - Ug(H));
        return [
          l + X * v,
          a + X * N,
          u * G / Pl(t * F + H)
        ];
      };
    }
    return M.duration = E * 1e3 * t / Math.SQRT2, M;
  }
  return i.rho = function(s) {
    var r = Math.max(1e-3, +s), l = r * r, a = l * l;
    return e(r, l, a);
  }, i;
})(Math.SQRT2, 2, 4);
var Xn = 0, so = 0, to = 0, ju = 1e3, Ni, ro, Ci = 0, Nn = 0, ns = 0, Ao = typeof performance == "object" && performance.now ? performance : Date, qu = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Er() {
  return Nn || (qu(Yg), Nn = Ao.now() + ns);
}
function Yg() {
  Nn = 0;
}
function $i() {
  this._call = this._time = this._next = null;
}
$i.prototype = Zu.prototype = {
  constructor: $i,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? Er() : +n) + (t == null ? 0 : +t), !this._next && ro !== this && (ro ? ro._next = this : Ni = this, ro = this), this._call = e, this._time = n, Zs();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Zs());
  }
};
function Zu(e, t, n) {
  var o = new $i();
  return o.restart(e, t, n), o;
}
function Wg() {
  Er(), ++Xn;
  for (var e = Ni, t; e; )
    (t = Nn - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Xn;
}
function Al() {
  Nn = (Ci = Ao.now()) + ns, Xn = so = 0;
  try {
    Wg();
  } finally {
    Xn = 0, Xg(), Nn = 0;
  }
}
function Kg() {
  var e = Ao.now(), t = e - Ci;
  t > ju && (ns -= t, Ci = e);
}
function Xg() {
  for (var e, t = Ni, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Ni = n);
  ro = e, Zs(o);
}
function Zs(e) {
  if (!Xn) {
    so && (so = clearTimeout(so));
    var t = e - Nn;
    t > 24 ? (e < 1 / 0 && (so = setTimeout(Al, e - Ao.now() - ns)), to && (to = clearInterval(to))) : (to || (Ci = Ao.now(), to = setInterval(Kg, ju)), Xn = 1, qu(Al));
  }
}
function Ol(e, t, n) {
  var o = new $i();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e(i + t);
  }, t, n), o;
}
var jg = es("start", "end", "cancel", "interrupt"), qg = [], Ju = 0, Dl = 1, Js = 2, li = 3, kl = 4, Qs = 5, ai = 6;
function os(e, t, n, o, i, s) {
  var r = e.__transition;
  if (!r)
    e.__transition = {};
  else if (n in r)
    return;
  Zg(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: jg,
    tween: qg,
    time: s.time,
    delay: s.delay,
    duration: s.duration,
    ease: s.ease,
    timer: null,
    state: Ju
  });
}
function Nr(e, t) {
  var n = _t(e, t);
  if (n.state > Ju)
    throw new Error("too late; already scheduled");
  return n;
}
function Rt(e, t) {
  var n = _t(e, t);
  if (n.state > li)
    throw new Error("too late; already running");
  return n;
}
function _t(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function Zg(e, t, n) {
  var o = e.__transition, i;
  o[t] = n, n.timer = Zu(s, 0, n.time);
  function s(u) {
    n.state = Dl, n.timer.restart(r, n.delay, n.time), n.delay <= u && r(u - n.delay);
  }
  function r(u) {
    var c, d, h, v;
    if (n.state !== Dl)
      return a();
    for (c in o)
      if (v = o[c], v.name === n.name) {
        if (v.state === li)
          return Ol(r);
        v.state === kl ? (v.state = ai, v.timer.stop(), v.on.call("interrupt", e, e.__data__, v.index, v.group), delete o[c]) : +c < t && (v.state = ai, v.timer.stop(), v.on.call("cancel", e, e.__data__, v.index, v.group), delete o[c]);
      }
    if (Ol(function() {
      n.state === li && (n.state = kl, n.timer.restart(l, n.delay, n.time), l(u));
    }), n.state = Js, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Js) {
      for (n.state = li, i = new Array(h = n.tween.length), c = 0, d = -1; c < h; ++c)
        (v = n.tween[c].value.call(e, e.__data__, n.index, n.group)) && (i[++d] = v);
      i.length = d + 1;
    }
  }
  function l(u) {
    for (var c = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(a), n.state = Qs, 1), d = -1, h = i.length; ++d < h; )
      i[d].call(e, c);
    n.state === Qs && (n.on.call("end", e, e.__data__, n.index, n.group), a());
  }
  function a() {
    n.state = ai, n.timer.stop(), delete o[t];
    for (var u in o)
      return;
    delete e.__transition;
  }
}
function ui(e, t) {
  var n = e.__transition, o, i, s = !0, r;
  if (n) {
    t = t == null ? null : t + "";
    for (r in n) {
      if ((o = n[r]).name !== t) {
        s = !1;
        continue;
      }
      i = o.state > Js && o.state < Qs, o.state = ai, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[r];
    }
    s && delete e.__transition;
  }
}
function Jg(e) {
  return this.each(function() {
    ui(this, e);
  });
}
function Qg(e, t) {
  var n, o;
  return function() {
    var i = Rt(this, e), s = i.tween;
    if (s !== n) {
      o = n = s;
      for (var r = 0, l = o.length; r < l; ++r)
        if (o[r].name === t) {
          o = o.slice(), o.splice(r, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function ev(e, t, n) {
  var o, i;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var s = Rt(this, e), r = s.tween;
    if (r !== o) {
      i = (o = r).slice();
      for (var l = { name: t, value: n }, a = 0, u = i.length; a < u; ++a)
        if (i[a].name === t) {
          i[a] = l;
          break;
        }
      a === u && i.push(l);
    }
    s.tween = i;
  };
}
function tv(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = _t(this.node(), n).tween, i = 0, s = o.length, r; i < s; ++i)
      if ((r = o[i]).name === e)
        return r.value;
    return null;
  }
  return this.each((t == null ? Qg : ev)(n, e, t));
}
function Cr(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var i = Rt(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return _t(i, o).value[t];
  };
}
function Qu(e, t) {
  var n;
  return (typeof t == "number" ? It : t instanceof En ? Ei : (n = En(t)) ? (t = n, Ei) : Wu)(e, t);
}
function nv(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function ov(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function iv(e, t, n) {
  var o, i = n + "", s;
  return function() {
    var r = this.getAttribute(e);
    return r === i ? null : r === o ? s : s = t(o = r, n);
  };
}
function sv(e, t, n) {
  var o, i = n + "", s;
  return function() {
    var r = this.getAttributeNS(e.space, e.local);
    return r === i ? null : r === o ? s : s = t(o = r, n);
  };
}
function rv(e, t, n) {
  var o, i, s;
  return function() {
    var r, l = n(this), a;
    return l == null ? void this.removeAttribute(e) : (r = this.getAttribute(e), a = l + "", r === a ? null : r === o && a === i ? s : (i = a, s = t(o = r, l)));
  };
}
function lv(e, t, n) {
  var o, i, s;
  return function() {
    var r, l = n(this), a;
    return l == null ? void this.removeAttributeNS(e.space, e.local) : (r = this.getAttributeNS(e.space, e.local), a = l + "", r === a ? null : r === o && a === i ? s : (i = a, s = t(o = r, l)));
  };
}
function av(e, t) {
  var n = ts(e), o = n === "transform" ? Fg : Qu;
  return this.attrTween(e, typeof t == "function" ? (n.local ? lv : rv)(n, o, Cr(this, "attr." + e, t)) : t == null ? (n.local ? ov : nv)(n) : (n.local ? sv : iv)(n, o, t));
}
function uv(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function cv(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function dv(e, t) {
  var n, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (n = (o = s) && cv(e, s)), n;
  }
  return i._value = t, i;
}
function fv(e, t) {
  var n, o;
  function i() {
    var s = t.apply(this, arguments);
    return s !== o && (n = (o = s) && uv(e, s)), n;
  }
  return i._value = t, i;
}
function pv(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = ts(e);
  return this.tween(n, (o.local ? dv : fv)(o, t));
}
function hv(e, t) {
  return function() {
    Nr(this, e).delay = +t.apply(this, arguments);
  };
}
function gv(e, t) {
  return t = +t, function() {
    Nr(this, e).delay = t;
  };
}
function vv(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? hv : gv)(t, e)) : _t(this.node(), t).delay;
}
function mv(e, t) {
  return function() {
    Rt(this, e).duration = +t.apply(this, arguments);
  };
}
function yv(e, t) {
  return t = +t, function() {
    Rt(this, e).duration = t;
  };
}
function _v(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? mv : yv)(t, e)) : _t(this.node(), t).duration;
}
function bv(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    Rt(this, e).ease = t;
  };
}
function wv(e) {
  var t = this._id;
  return arguments.length ? this.each(bv(t, e)) : _t(this.node(), t).ease;
}
function xv(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    Rt(this, e).ease = n;
  };
}
function Sv(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each(xv(this._id, e));
}
function Ev(e) {
  typeof e != "function" && (e = Pu(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var s = t[i], r = s.length, l = o[i] = [], a, u = 0; u < r; ++u)
      (a = s[u]) && e.call(a, a.__data__, u, s) && l.push(a);
  return new Jt(o, this._parents, this._name, this._id);
}
function Nv(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, i = n.length, s = Math.min(o, i), r = new Array(o), l = 0; l < s; ++l)
    for (var a = t[l], u = n[l], c = a.length, d = r[l] = new Array(c), h, v = 0; v < c; ++v)
      (h = a[v] || u[v]) && (d[v] = h);
  for (; l < o; ++l)
    r[l] = t[l];
  return new Jt(r, this._parents, this._name, this._id);
}
function Cv(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function $v(e, t, n) {
  var o, i, s = Cv(t) ? Nr : Rt;
  return function() {
    var r = s(this, e), l = r.on;
    l !== o && (i = (o = l).copy()).on(t, n), r.on = i;
  };
}
function Mv(e, t) {
  var n = this._id;
  return arguments.length < 2 ? _t(this.node(), n).on.on(e) : this.each($v(n, e, t));
}
function Iv(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function Tv() {
  return this.on("end.remove", Iv(this._id));
}
function Pv(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = br(e));
  for (var o = this._groups, i = o.length, s = new Array(i), r = 0; r < i; ++r)
    for (var l = o[r], a = l.length, u = s[r] = new Array(a), c, d, h = 0; h < a; ++h)
      (c = l[h]) && (d = e.call(c, c.__data__, h, l)) && ("__data__" in c && (d.__data__ = c.__data__), u[h] = d, os(u[h], t, n, h, u, _t(c, n)));
  return new Jt(s, this._parents, t, n);
}
function Av(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Tu(e));
  for (var o = this._groups, i = o.length, s = [], r = [], l = 0; l < i; ++l)
    for (var a = o[l], u = a.length, c, d = 0; d < u; ++d)
      if (c = a[d]) {
        for (var h = e.call(c, c.__data__, d, a), v, N = _t(c, n), x = 0, M = h.length; x < M; ++x)
          (v = h[x]) && os(v, t, n, x, h, N);
        s.push(h), r.push(c);
      }
  return new Jt(s, r, t, n);
}
var Ov = Fo.prototype.constructor;
function Dv() {
  return new Ov(this._groups, this._parents);
}
function kv(e, t) {
  var n, o, i;
  return function() {
    var s = Kn(this, e), r = (this.style.removeProperty(e), Kn(this, e));
    return s === r ? null : s === n && r === o ? i : i = t(n = s, o = r);
  };
}
function ec(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Rv(e, t, n) {
  var o, i = n + "", s;
  return function() {
    var r = Kn(this, e);
    return r === i ? null : r === o ? s : s = t(o = r, n);
  };
}
function Vv(e, t, n) {
  var o, i, s;
  return function() {
    var r = Kn(this, e), l = n(this), a = l + "";
    return l == null && (a = l = (this.style.removeProperty(e), Kn(this, e))), r === a ? null : r === o && a === i ? s : (i = a, s = t(o = r, l));
  };
}
function Bv(e, t) {
  var n, o, i, s = "style." + t, r = "end." + s, l;
  return function() {
    var a = Rt(this, e), u = a.on, c = a.value[s] == null ? l || (l = ec(t)) : void 0;
    (u !== n || i !== c) && (o = (n = u).copy()).on(r, i = c), a.on = o;
  };
}
function zv(e, t, n) {
  var o = (e += "") == "transform" ? Hg : Qu;
  return t == null ? this.styleTween(e, kv(e, o)).on("end.style." + e, ec(e)) : typeof t == "function" ? this.styleTween(e, Vv(e, o, Cr(this, "style." + e, t))).each(Bv(this._id, e)) : this.styleTween(e, Rv(e, o, t), n).on("end.style." + e, null);
}
function Hv(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Fv(e, t, n) {
  var o, i;
  function s() {
    var r = t.apply(this, arguments);
    return r !== i && (o = (i = r) && Hv(e, r, n)), o;
  }
  return s._value = t, s;
}
function Lv(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, Fv(e, t, n ?? ""));
}
function Uv(e) {
  return function() {
    this.textContent = e;
  };
}
function Gv(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Yv(e) {
  return this.tween("text", typeof e == "function" ? Gv(Cr(this, "text", e)) : Uv(e == null ? "" : e + ""));
}
function Wv(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Kv(e) {
  var t, n;
  function o() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && Wv(i)), t;
  }
  return o._value = e, o;
}
function Xv(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, Kv(e));
}
function jv() {
  for (var e = this._name, t = this._id, n = tc(), o = this._groups, i = o.length, s = 0; s < i; ++s)
    for (var r = o[s], l = r.length, a, u = 0; u < l; ++u)
      if (a = r[u]) {
        var c = _t(a, t);
        os(a, e, n, u, r, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new Jt(o, this._parents, e, n);
}
function qv() {
  var e, t, n = this, o = n._id, i = n.size();
  return new Promise(function(s, r) {
    var l = { value: r }, a = { value: function() {
      --i === 0 && s();
    } };
    n.each(function() {
      var u = Rt(this, o), c = u.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(l), t._.interrupt.push(l), t._.end.push(a)), u.on = t;
    }), i === 0 && s();
  });
}
var Zv = 0;
function Jt(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function tc() {
  return ++Zv;
}
var Bt = Fo.prototype;
Jt.prototype = {
  constructor: Jt,
  select: Pv,
  selectAll: Av,
  selectChild: Bt.selectChild,
  selectChildren: Bt.selectChildren,
  filter: Ev,
  merge: Nv,
  selection: Dv,
  transition: jv,
  call: Bt.call,
  nodes: Bt.nodes,
  node: Bt.node,
  size: Bt.size,
  empty: Bt.empty,
  each: Bt.each,
  on: Mv,
  attr: av,
  attrTween: pv,
  style: zv,
  styleTween: Lv,
  text: Yv,
  textTween: Xv,
  remove: Tv,
  tween: tv,
  delay: vv,
  duration: _v,
  ease: wv,
  easeVarying: Sv,
  end: qv,
  [Symbol.iterator]: Bt[Symbol.iterator]
};
function Jv(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Qv = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Jv
};
function em(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function tm(e) {
  var t, n;
  e instanceof Jt ? (t = e._id, e = e._name) : (t = tc(), (n = Qv).time = Er(), e = e == null ? null : e + "");
  for (var o = this._groups, i = o.length, s = 0; s < i; ++s)
    for (var r = o[s], l = r.length, a, u = 0; u < l; ++u)
      (a = r[u]) && os(a, e, t, u, r, n || em(a, t));
  return new Jt(o, this._parents, e, t);
}
Fo.prototype.interrupt = Jg;
Fo.prototype.transition = tm;
const Zo = (e) => () => e;
function nm(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function Gt(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Gt.prototype = {
  constructor: Gt,
  scale: function(e) {
    return e === 1 ? this : new Gt(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Gt(this.k, this.x + this.k * e, this.y + this.k * t);
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
var jn = new Gt(1, 0, 0);
Gt.prototype;
function Cs(e) {
  e.stopImmediatePropagation();
}
function no(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function om(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function im() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Rl() {
  return this.__zoom || jn;
}
function sm(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function rm() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function lm(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], s = e.invertY(t[0][1]) - n[0][1], r = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    r > s ? (s + r) / 2 : Math.min(0, s) || Math.max(0, r)
  );
}
function am() {
  var e = om, t = im, n = lm, o = sm, i = rm, s = [0, 1 / 0], r = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], l = 250, a = ri, u = es("start", "zoom", "end"), c, d, h, v = 500, N = 150, x = 0, M = 10;
  function E($) {
    $.property("__zoom", Rl).on("wheel.zoom", F, { passive: !1 }).on("mousedown.zoom", G).on("dblclick.zoom", X).filter(i).on("touchstart.zoom", Y).on("touchmove.zoom", P).on("touchend.zoom touchcancel.zoom", oe).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  E.transform = function($, z, I, k) {
    var V = $.selection ? $.selection() : $;
    V.property("__zoom", Rl), $ !== V ? H($, z, I, k) : V.interrupt().each(function() {
      j(this, arguments).event(k).start().zoom(null, typeof z == "function" ? z.apply(this, arguments) : z).end();
    });
  }, E.scaleBy = function($, z, I, k) {
    E.scaleTo($, function() {
      var V = this.__zoom.k, q = typeof z == "function" ? z.apply(this, arguments) : z;
      return V * q;
    }, I, k);
  }, E.scaleTo = function($, z, I, k) {
    E.transform($, function() {
      var V = t.apply(this, arguments), q = this.__zoom, Z = I == null ? C(V) : typeof I == "function" ? I.apply(this, arguments) : I, ee = q.invert(Z), re = typeof z == "function" ? z.apply(this, arguments) : z;
      return n(S(T(q, re), Z, ee), V, r);
    }, I, k);
  }, E.translateBy = function($, z, I, k) {
    E.transform($, function() {
      return n(this.__zoom.translate(
        typeof z == "function" ? z.apply(this, arguments) : z,
        typeof I == "function" ? I.apply(this, arguments) : I
      ), t.apply(this, arguments), r);
    }, null, k);
  }, E.translateTo = function($, z, I, k, V) {
    E.transform($, function() {
      var q = t.apply(this, arguments), Z = this.__zoom, ee = k == null ? C(q) : typeof k == "function" ? k.apply(this, arguments) : k;
      return n(jn.translate(ee[0], ee[1]).scale(Z.k).translate(
        typeof z == "function" ? -z.apply(this, arguments) : -z,
        typeof I == "function" ? -I.apply(this, arguments) : -I
      ), q, r);
    }, k, V);
  };
  function T($, z) {
    return z = Math.max(s[0], Math.min(s[1], z)), z === $.k ? $ : new Gt(z, $.x, $.y);
  }
  function S($, z, I) {
    var k = z[0] - I[0] * $.k, V = z[1] - I[1] * $.k;
    return k === $.x && V === $.y ? $ : new Gt($.k, k, V);
  }
  function C($) {
    return [(+$[0][0] + +$[1][0]) / 2, (+$[0][1] + +$[1][1]) / 2];
  }
  function H($, z, I, k) {
    $.on("start.zoom", function() {
      j(this, arguments).event(k).start();
    }).on("interrupt.zoom end.zoom", function() {
      j(this, arguments).event(k).end();
    }).tween("zoom", function() {
      var V = this, q = arguments, Z = j(V, q).event(k), ee = t.apply(V, q), re = I == null ? C(ee) : typeof I == "function" ? I.apply(V, q) : I, ce = Math.max(ee[1][0] - ee[0][0], ee[1][1] - ee[0][1]), ge = V.__zoom, ie = typeof z == "function" ? z.apply(V, q) : z, ne = a(ge.invert(re).concat(ce / ge.k), ie.invert(re).concat(ce / ie.k));
      return function(ae) {
        if (ae === 1)
          ae = ie;
        else {
          var me = ne(ae), Ee = ce / me[2];
          ae = new Gt(Ee, re[0] - me[0] * Ee, re[1] - me[1] * Ee);
        }
        Z.zoom(null, ae);
      };
    });
  }
  function j($, z, I) {
    return !I && $.__zooming || new K($, z);
  }
  function K($, z) {
    this.that = $, this.args = z, this.active = 0, this.sourceEvent = null, this.extent = t.apply($, z), this.taps = 0;
  }
  K.prototype = {
    event: function($) {
      return $ && (this.sourceEvent = $), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function($, z) {
      return this.mouse && $ !== "mouse" && (this.mouse[1] = z.invert(this.mouse[0])), this.touch0 && $ !== "touch" && (this.touch0[1] = z.invert(this.touch0[0])), this.touch1 && $ !== "touch" && (this.touch1[1] = z.invert(this.touch1[0])), this.that.__zoom = z, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function($) {
      var z = pt(this.that).datum();
      u.call(
        $,
        this.that,
        new nm($, {
          sourceEvent: this.sourceEvent,
          target: E,
          transform: this.that.__zoom,
          dispatch: u
        }),
        z
      );
    }
  };
  function F($, ...z) {
    if (!e.apply(this, arguments))
      return;
    var I = j(this, z).event($), k = this.__zoom, V = Math.max(s[0], Math.min(s[1], k.k * Math.pow(2, o.apply(this, arguments)))), q = Ct($);
    if (I.wheel)
      (I.mouse[0][0] !== q[0] || I.mouse[0][1] !== q[1]) && (I.mouse[1] = k.invert(I.mouse[0] = q)), clearTimeout(I.wheel);
    else {
      if (k.k === V)
        return;
      I.mouse = [q, k.invert(q)], ui(this), I.start();
    }
    no($), I.wheel = setTimeout(Z, N), I.zoom("mouse", n(S(T(k, V), I.mouse[0], I.mouse[1]), I.extent, r));
    function Z() {
      I.wheel = null, I.end();
    }
  }
  function G($, ...z) {
    if (h || !e.apply(this, arguments))
      return;
    var I = $.currentTarget, k = j(this, z, !0).event($), V = pt($.view).on("mousemove.zoom", re, !0).on("mouseup.zoom", ce, !0), q = Ct($, I), Z = $.clientX, ee = $.clientY;
    Fu($.view), Cs($), k.mouse = [q, this.__zoom.invert(q)], ui(this), k.start();
    function re(ge) {
      if (no(ge), !k.moved) {
        var ie = ge.clientX - Z, ne = ge.clientY - ee;
        k.moved = ie * ie + ne * ne > x;
      }
      k.event(ge).zoom("mouse", n(S(k.that.__zoom, k.mouse[0] = Ct(ge, I), k.mouse[1]), k.extent, r));
    }
    function ce(ge) {
      V.on("mousemove.zoom mouseup.zoom", null), Lu(ge.view, k.moved), no(ge), k.event(ge).end();
    }
  }
  function X($, ...z) {
    if (e.apply(this, arguments)) {
      var I = this.__zoom, k = Ct($.changedTouches ? $.changedTouches[0] : $, this), V = I.invert(k), q = I.k * ($.shiftKey ? 0.5 : 2), Z = n(S(T(I, q), k, V), t.apply(this, z), r);
      no($), l > 0 ? pt(this).transition().duration(l).call(H, Z, k, $) : pt(this).call(E.transform, Z, k, $);
    }
  }
  function Y($, ...z) {
    if (e.apply(this, arguments)) {
      var I = $.touches, k = I.length, V = j(this, z, $.changedTouches.length === k).event($), q, Z, ee, re;
      for (Cs($), Z = 0; Z < k; ++Z)
        ee = I[Z], re = Ct(ee, this), re = [re, this.__zoom.invert(re), ee.identifier], V.touch0 ? !V.touch1 && V.touch0[2] !== re[2] && (V.touch1 = re, V.taps = 0) : (V.touch0 = re, q = !0, V.taps = 1 + !!c);
      c && (c = clearTimeout(c)), q && (V.taps < 2 && (d = re[0], c = setTimeout(function() {
        c = null;
      }, v)), ui(this), V.start());
    }
  }
  function P($, ...z) {
    if (this.__zooming) {
      var I = j(this, z).event($), k = $.changedTouches, V = k.length, q, Z, ee, re;
      for (no($), q = 0; q < V; ++q)
        Z = k[q], ee = Ct(Z, this), I.touch0 && I.touch0[2] === Z.identifier ? I.touch0[0] = ee : I.touch1 && I.touch1[2] === Z.identifier && (I.touch1[0] = ee);
      if (Z = I.that.__zoom, I.touch1) {
        var ce = I.touch0[0], ge = I.touch0[1], ie = I.touch1[0], ne = I.touch1[1], ae = (ae = ie[0] - ce[0]) * ae + (ae = ie[1] - ce[1]) * ae, me = (me = ne[0] - ge[0]) * me + (me = ne[1] - ge[1]) * me;
        Z = T(Z, Math.sqrt(ae / me)), ee = [(ce[0] + ie[0]) / 2, (ce[1] + ie[1]) / 2], re = [(ge[0] + ne[0]) / 2, (ge[1] + ne[1]) / 2];
      } else if (I.touch0)
        ee = I.touch0[0], re = I.touch0[1];
      else
        return;
      I.zoom("touch", n(S(Z, ee, re), I.extent, r));
    }
  }
  function oe($, ...z) {
    if (this.__zooming) {
      var I = j(this, z).event($), k = $.changedTouches, V = k.length, q, Z;
      for (Cs($), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, v), q = 0; q < V; ++q)
        Z = k[q], I.touch0 && I.touch0[2] === Z.identifier ? delete I.touch0 : I.touch1 && I.touch1[2] === Z.identifier && delete I.touch1;
      if (I.touch1 && !I.touch0 && (I.touch0 = I.touch1, delete I.touch1), I.touch0)
        I.touch0[1] = this.__zoom.invert(I.touch0[0]);
      else if (I.end(), I.taps === 2 && (Z = Ct(Z, this), Math.hypot(d[0] - Z[0], d[1] - Z[1]) < M)) {
        var ee = pt(this).on("dblclick.zoom");
        ee && ee.apply(this, arguments);
      }
    }
  }
  return E.wheelDelta = function($) {
    return arguments.length ? (o = typeof $ == "function" ? $ : Zo(+$), E) : o;
  }, E.filter = function($) {
    return arguments.length ? (e = typeof $ == "function" ? $ : Zo(!!$), E) : e;
  }, E.touchable = function($) {
    return arguments.length ? (i = typeof $ == "function" ? $ : Zo(!!$), E) : i;
  }, E.extent = function($) {
    return arguments.length ? (t = typeof $ == "function" ? $ : Zo([[+$[0][0], +$[0][1]], [+$[1][0], +$[1][1]]]), E) : t;
  }, E.scaleExtent = function($) {
    return arguments.length ? (s[0] = +$[0], s[1] = +$[1], E) : [s[0], s[1]];
  }, E.translateExtent = function($) {
    return arguments.length ? (r[0][0] = +$[0][0], r[1][0] = +$[1][0], r[0][1] = +$[0][1], r[1][1] = +$[1][1], E) : [[r[0][0], r[0][1]], [r[1][0], r[1][1]]];
  }, E.constrain = function($) {
    return arguments.length ? (n = $, E) : n;
  }, E.duration = function($) {
    return arguments.length ? (l = +$, E) : l;
  }, E.interpolate = function($) {
    return arguments.length ? (a = $, E) : a;
  }, E.on = function() {
    var $ = u.on.apply(u, arguments);
    return $ === u ? E : $;
  }, E.clickDistance = function($) {
    return arguments.length ? (x = ($ = +$) * $, E) : Math.sqrt(x);
  }, E.tapDistance = function($) {
    return arguments.length ? (M = +$, E) : M;
  }, E;
}
var le = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(le || {}), $r = /* @__PURE__ */ ((e) => (e.Partial = "partial", e.Full = "full", e))($r || {}), gn = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(gn || {}), un = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(un || {}), er = /* @__PURE__ */ ((e) => (e.Arrow = "arrow", e.ArrowClosed = "arrowclosed", e))(er || {}), bo = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(bo || {});
const um = ["INPUT", "SELECT", "TEXTAREA"], cm = typeof document < "u" ? document : null;
function tr(e) {
  var t, n;
  const o = ((n = (t = e.composedPath) == null ? void 0 : t.call(e)) == null ? void 0 : n[0]) || e.target, i = typeof (o == null ? void 0 : o.hasAttribute) == "function" ? o.hasAttribute("contenteditable") : !1, s = typeof (o == null ? void 0 : o.closest) == "function" ? o.closest(".nokey") : null;
  return um.includes(o == null ? void 0 : o.nodeName) || i || !!s;
}
function dm(e) {
  return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
}
function Vl(e, t, n, o) {
  const i = t.replace("+", `
`).replace(`

`, `
+`).split(`
`).map((r) => r.trim().toLowerCase());
  if (i.length === 1)
    return e.toLowerCase() === t.toLowerCase();
  o || n.add(e.toLowerCase());
  const s = i.every(
    (r, l) => n.has(r) && Array.from(n.values())[l] === i[l]
  );
  return o && n.delete(e.toLowerCase()), s;
}
function fm(e, t) {
  return (n) => {
    if (!n.code && !n.key)
      return !1;
    const o = pm(n.code, e);
    return Array.isArray(e) ? e.some((i) => Vl(n[o], i, t, n.type === "keyup")) : Vl(n[o], e, t, n.type === "keyup");
  };
}
function pm(e, t) {
  return t.includes(e) ? "code" : "key";
}
function wo(e, t) {
  const n = se(() => ye(t == null ? void 0 : t.target) ?? cm), o = /* @__PURE__ */ an(ye(e) === !0);
  let i = !1;
  const s = /* @__PURE__ */ new Set();
  let r = a(ye(e));
  be(
    () => ye(e),
    (u, c) => {
      typeof c == "boolean" && typeof u != "boolean" && l(), r = a(u);
    },
    {
      immediate: !0
    }
  ), Mu(["blur", "contextmenu"], l), _l(
    (...u) => r(...u),
    (u) => {
      var c, d;
      const h = ye(t == null ? void 0 : t.actInsideInputWithModifier) ?? !0, v = ye(t == null ? void 0 : t.preventDefault) ?? !1;
      if (i = dm(u), (!i || i && !h) && tr(u))
        return;
      const x = ((d = (c = u.composedPath) == null ? void 0 : c.call(u)) == null ? void 0 : d[0]) || u.target, M = (x == null ? void 0 : x.nodeName) === "BUTTON" || (x == null ? void 0 : x.nodeName) === "A";
      !v && (i || !M) && u.preventDefault(), o.value = !0;
    },
    { eventName: "keydown", target: n }
  ), _l(
    (...u) => r(...u),
    (u) => {
      const c = ye(t == null ? void 0 : t.actInsideInputWithModifier) ?? !0;
      if (o.value) {
        if ((!i || i && !c) && tr(u))
          return;
        i = !1, o.value = !1;
      }
    },
    { eventName: "keyup", target: n }
  );
  function l() {
    i = !1, s.clear(), o.value = ye(e) === !0;
  }
  function a(u) {
    return u === null ? (l(), () => !1) : typeof u == "boolean" ? (l(), o.value = u, () => !1) : Array.isArray(u) || typeof u == "string" ? fm(u, s) : u;
  }
  return o;
}
const nc = "vue-flow__node-desc", oc = "vue-flow__edge-desc", hm = "vue-flow__aria-live", ic = ["Enter", " ", "Escape"], Un = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
function Mi(e) {
  return {
    ...e.computedPosition || { x: 0, y: 0 },
    width: e.dimensions.width || 0,
    height: e.dimensions.height || 0
  };
}
function Ii(e, t) {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}
function is(e) {
  return {
    width: e.offsetWidth,
    height: e.offsetHeight
  };
}
function Cn(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function sc(e, t) {
  return {
    x: Cn(e.x, t[0][0], t[1][0]),
    y: Cn(e.y, t[0][1], t[1][1])
  };
}
function Bl(e) {
  const t = e.getRootNode();
  return "elementFromPoint" in t ? t : window.document;
}
function Qt(e) {
  return e && typeof e == "object" && "id" in e && "source" in e && "target" in e;
}
function wn(e) {
  return e && typeof e == "object" && "id" in e && "position" in e && !Qt(e);
}
function lo(e) {
  return wn(e) && "computedPosition" in e;
}
function Jo(e) {
  return !Number.isNaN(e) && Number.isFinite(e);
}
function gm(e) {
  return Jo(e.width) && Jo(e.height) && Jo(e.x) && Jo(e.y);
}
function vm(e, t, n) {
  const o = {
    id: e.id.toString(),
    type: e.type ?? "default",
    dimensions: nt({
      width: 0,
      height: 0
    }),
    computedPosition: nt({
      z: 0,
      ...e.position
    }),
    // todo: shouldn't be defined initially, as we want to use handleBounds to check if a node was actually initialized or not
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
    data: Fe(e.data) ? e.data : {},
    events: nt(Fe(e.events) ? e.events : {})
  };
  return Object.assign(t ?? o, e, { id: e.id.toString(), parentNode: n });
}
function Mr(e, t, n) {
  var o, i;
  const s = {
    id: e.id.toString(),
    type: e.type ?? (t == null ? void 0 : t.type) ?? "default",
    source: e.source.toString(),
    target: e.target.toString(),
    sourceHandle: (o = e.sourceHandle) == null ? void 0 : o.toString(),
    targetHandle: (i = e.targetHandle) == null ? void 0 : i.toString(),
    updatable: e.updatable ?? (n == null ? void 0 : n.updatable),
    selectable: e.selectable ?? (n == null ? void 0 : n.selectable),
    focusable: e.focusable ?? (n == null ? void 0 : n.focusable),
    data: Fe(e.data) ? e.data : {},
    events: nt(Fe(e.events) ? e.events : {}),
    label: e.label ?? "",
    interactionWidth: e.interactionWidth ?? (n == null ? void 0 : n.interactionWidth),
    ...n ?? {}
  };
  return Object.assign(t ?? s, e, { id: e.id.toString() });
}
function rc(e, t, n, o) {
  const i = typeof e == "string" ? e : e.id, s = /* @__PURE__ */ new Set(), r = o === "source" ? "target" : "source";
  for (const l of n)
    l[r] === i && s.add(l[o]);
  return t.filter((l) => s.has(l.id));
}
function mm(...e) {
  if (e.length === 3) {
    const [s, r, l] = e;
    return rc(s, r, l, "target");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((s) => Qt(s) && s.source === o).map((s) => n.find((r) => wn(r) && r.id === s.target));
}
function ym(...e) {
  if (e.length === 3) {
    const [s, r, l] = e;
    return rc(s, r, l, "source");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((s) => Qt(s) && s.target === o).map((s) => n.find((r) => wn(r) && r.id === s.source));
}
function Ir({ source: e, sourceHandle: t, target: n, targetHandle: o }) {
  return `vueflow__edge-${e}${t ?? ""}-${n}${o ?? ""}`;
}
function lc(e, t) {
  return t.some(
    (n) => Qt(n) && n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)
  );
}
function _m(e, t, n) {
  if (!e.source || !e.target)
    return Zn("Can't create edge. An edge needs a source and a target."), t;
  let o;
  return Qt(e) ? o = { ...e } : o = {
    ...e,
    id: Ir(e)
  }, o = Mr(o, void 0, n), lc(o, t) || t.push(o), t;
}
function Oo({ x: e, y: t }, { x: n, y: o, zoom: i }) {
  return {
    x: e * i + n,
    y: t * i + o
  };
}
function Do({ x: e, y: t }, { x: n, y: o, zoom: i }, s = !1, r = [1, 1]) {
  const l = {
    x: (e - n) / i,
    y: (t - o) / i
  };
  return s ? ss(l, r) : l;
}
function bm(e, t) {
  return {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x2, t.x2),
    y2: Math.max(e.y2, t.y2)
  };
}
function ac({ x: e, y: t, width: n, height: o }) {
  return {
    x: e,
    y: t,
    x2: e + n,
    y2: t + o
  };
}
function wm({ x: e, y: t, x2: n, y2: o }) {
  return {
    x: e,
    y: t,
    width: n - e,
    height: o - t
  };
}
function uc(e) {
  let t = {
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
    x2: Number.NEGATIVE_INFINITY,
    y2: Number.NEGATIVE_INFINITY
  };
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    t = bm(
      t,
      ac({
        ...o.computedPosition,
        ...o.dimensions
      })
    );
  }
  return wm(t);
}
function cc(e, t, n = { x: 0, y: 0, zoom: 1 }, o = !1, i = !1) {
  const s = {
    ...Do(t, n),
    width: t.width / n.zoom,
    height: t.height / n.zoom
  }, r = [];
  for (const l of e) {
    const { dimensions: a, selectable: u = !0, hidden: c = !1 } = l, d = a.width ?? l.width ?? null, h = a.height ?? l.height ?? null;
    if (i && !u || c)
      continue;
    const v = Ii(s, Mi(l)), N = d === null || h === null, x = o && v > 0, M = (d ?? 0) * (h ?? 0);
    (N || x || v >= M || l.dragging) && r.push(l);
  }
  return r;
}
function dc(e, t) {
  const n = /* @__PURE__ */ new Set();
  if (typeof e == "string")
    n.add(e);
  else if (e.length >= 1)
    for (const o of e)
      n.add(o.id);
  return t.filter((o) => n.has(o.source) || n.has(o.target));
}
function An(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = Number.parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = Number.parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return Zn(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function xm(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = An(e, n), i = An(e, t);
    return {
      top: o,
      right: i,
      bottom: o,
      left: i,
      x: i * 2,
      y: o * 2
    };
  }
  if (typeof e == "object") {
    const o = An(e.top ?? e.y ?? 0, n), i = An(e.bottom ?? e.y ?? 0, n), s = An(e.left ?? e.x ?? 0, t), r = An(e.right ?? e.x ?? 0, t);
    return { top: o, right: r, bottom: i, left: s, x: s + r, y: o + i };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Sm(e, t, n, o, i, s) {
  const { x: r, y: l } = Oo(e, { x: t, y: n, zoom: o }), { x: a, y: u } = Oo(
    { x: e.x + e.width, y: e.y + e.height },
    {
      x: t,
      y: n,
      zoom: o
    }
  ), c = i - a, d = s - u;
  return {
    left: Math.floor(r),
    top: Math.floor(l),
    right: Math.floor(c),
    bottom: Math.floor(d)
  };
}
function zl(e, t, n, o, i, s = 0.1) {
  const r = xm(s, t, n), l = (t - r.x) / e.width, a = (n - r.y) / e.height, u = Math.min(l, a), c = Cn(u, o, i), d = e.x + e.width / 2, h = e.y + e.height / 2, v = t / 2 - d * c, N = n / 2 - h * c, x = Sm(e, v, N, c, t, n), M = {
    left: Math.min(x.left - r.left, 0),
    top: Math.min(x.top - r.top, 0),
    right: Math.min(x.right - r.right, 0),
    bottom: Math.min(x.bottom - r.bottom, 0)
  };
  return {
    x: v - M.left + M.right,
    y: N - M.top + M.bottom,
    zoom: c
  };
}
function Em(e, t) {
  return {
    x: t.x + e.x,
    y: t.y + e.y,
    z: (e.z > t.z ? e.z : t.z) + 1
  };
}
function fc(e, t) {
  if (!e.parentNode)
    return !1;
  const n = t.get(e.parentNode);
  return n ? n.selected ? !0 : fc(n, t) : !1;
}
function ko(e, t) {
  return typeof e > "u" ? "" : typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}`;
}
function Hl(e) {
  const t = e.ctrlKey && Pi() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
}
function Fl(e, t, n) {
  return e < t ? Cn(Math.abs(e - t), 1, t) / t : e > n ? -Cn(Math.abs(e - n), 1, t) / t : 0;
}
function pc(e, t, n = 15, o = 40) {
  const i = Fl(e.x, o, t.width - o) * n, s = Fl(e.y, o, t.height - o) * n;
  return [i, s];
}
function $s(e, t) {
  if (t) {
    const n = e.position.x + e.dimensions.width - t.dimensions.width, o = e.position.y + e.dimensions.height - t.dimensions.height;
    if (n > 0 || o > 0 || e.position.x < 0 || e.position.y < 0) {
      let i = {};
      if (typeof t.style == "function" ? i = { ...t.style(t) } : t.style && (i = { ...t.style }), i.width = i.width ?? `${t.dimensions.width}px`, i.height = i.height ?? `${t.dimensions.height}px`, n > 0)
        if (typeof i.width == "string") {
          const s = Number(i.width.replace("px", ""));
          i.width = `${s + n}px`;
        } else
          i.width += n;
      if (o > 0)
        if (typeof i.height == "string") {
          const s = Number(i.height.replace("px", ""));
          i.height = `${s + o}px`;
        } else
          i.height += o;
      if (e.position.x < 0) {
        const s = Math.abs(e.position.x);
        if (t.position.x = t.position.x - s, typeof i.width == "string") {
          const r = Number(i.width.replace("px", ""));
          i.width = `${r + s}px`;
        } else
          i.width += s;
        e.position.x = 0;
      }
      if (e.position.y < 0) {
        const s = Math.abs(e.position.y);
        if (t.position.y = t.position.y - s, typeof i.height == "string") {
          const r = Number(i.height.replace("px", ""));
          i.height = `${r + s}px`;
        } else
          i.height += s;
        e.position.y = 0;
      }
      t.dimensions.width = Number(i.width.toString().replace("px", "")), t.dimensions.height = Number(i.height.toString().replace("px", "")), typeof t.style == "function" ? t.style = (s) => {
        const r = t.style;
        return {
          ...r(s),
          ...i
        };
      } : t.style = {
        ...t.style,
        ...i
      };
    }
  }
}
function Ti(e, t) {
  var n, o;
  const i = e.filter((r) => r.type === "add" || r.type === "remove");
  for (const r of i)
    if (r.type === "add")
      t.findIndex((a) => a.id === r.item.id) === -1 && t.push(r.item);
    else if (r.type === "remove") {
      const l = t.findIndex((a) => a.id === r.id);
      l !== -1 && t.splice(l, 1);
    }
  const s = t.map((r) => r.id);
  for (const r of t)
    for (const l of e)
      if (l.id === r.id)
        switch (l.type) {
          case "select":
            r.selected = l.selected;
            break;
          case "position":
            if (lo(r) && (typeof l.position < "u" && (r.position = l.position), typeof l.dragging < "u" && (r.dragging = l.dragging), r.expandParent && r.parentNode)) {
              const a = t[s.indexOf(r.parentNode)];
              a && lo(a) && $s(r, a);
            }
            break;
          case "dimensions":
            if (lo(r) && (typeof l.dimensions < "u" && (r.dimensions = l.dimensions), typeof l.updateStyle < "u" && l.updateStyle && (r.style = {
              ...r.style || {},
              width: `${(n = l.dimensions) == null ? void 0 : n.width}px`,
              height: `${(o = l.dimensions) == null ? void 0 : o.height}px`
            }), typeof l.resizing < "u" && (r.resizing = l.resizing), r.expandParent && r.parentNode)) {
              const a = t[s.indexOf(r.parentNode)];
              a && lo(a) && (!!a.dimensions.width && !!a.dimensions.height ? $s(r, a) : rt(() => {
                $s(r, a);
              }));
            }
            break;
        }
  return t;
}
function Nm(e, t) {
  return Ti(e, t);
}
function Cm(e, t) {
  return Ti(e, t);
}
function sn(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Ll(e) {
  return {
    item: e,
    type: "add"
  };
}
function Ul(e) {
  return {
    id: e,
    type: "remove"
  };
}
function Gl(e, t, n, o, i) {
  return {
    id: e,
    source: t,
    target: n,
    sourceHandle: o || null,
    targetHandle: i || null,
    type: "remove"
  };
}
function ln(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const o = [];
  for (const [i, s] of e) {
    const r = t.has(i);
    !(s.selected === void 0 && !r) && s.selected !== r && (n && (s.selected = r), o.push(sn(s.id, r)));
  }
  return o;
}
const Yl = () => {
};
function Q(e) {
  const t = /* @__PURE__ */ new Set();
  let n = Yl, o = () => !1;
  const i = () => t.size > 0 || o(), s = (h) => {
    n = h;
  }, r = () => {
    n = Yl;
  }, l = (h) => {
    o = h;
  }, a = () => {
    o = () => !1;
  }, u = (h) => {
    t.delete(h);
  };
  return {
    on: (h) => {
      t.add(h);
      const v = () => u(h);
      return Mo(v), { off: v };
    },
    off: u,
    trigger: (h) => {
      const v = [n];
      return i() ? v.push(...t) : e && v.push(e), Promise.allSettled(v.map((N) => N(h)));
    },
    hasListeners: i,
    listeners: t,
    setEmitter: s,
    removeEmitter: r,
    setHasEmitListeners: l,
    removeHasEmitListeners: a
  };
}
function Wl(e, t, n) {
  let o = e;
  do {
    if (o && o.matches(t))
      return !0;
    if (o === n)
      return !1;
    o = o.parentElement;
  } while (o);
  return !1;
}
function $m(e, t, n, o) {
  var i, s;
  const r = /* @__PURE__ */ new Map();
  for (const [l, a] of e)
    (a.selected || a.id === o) && (!a.parentNode || !fc(a, e)) && (a.draggable || t && typeof a.draggable > "u") && e.get(l) && r.set(l, {
      id: a.id,
      position: a.position || { x: 0, y: 0 },
      distance: {
        x: n.x - ((i = a.computedPosition) == null ? void 0 : i.x) || 0,
        y: n.y - ((s = a.computedPosition) == null ? void 0 : s.y) || 0
      },
      from: { x: a.computedPosition.x, y: a.computedPosition.y },
      extent: a.extent,
      parentNode: a.parentNode,
      dimensions: { ...a.dimensions },
      expandParent: a.expandParent
    });
  return Array.from(r.values());
}
function Ms({
  id: e,
  dragItems: t,
  findNode: n
}) {
  const o = [];
  for (const i of t) {
    const s = n(i.id);
    s && o.push(s);
  }
  return [e ? o.find((i) => i.id === e) : o[0], o];
}
function hc(e) {
  if (Array.isArray(e))
    switch (e.length) {
      case 1:
        return [e[0], e[0], e[0], e[0]];
      case 2:
        return [e[0], e[1], e[0], e[1]];
      case 3:
        return [e[0], e[1], e[2], e[1]];
      case 4:
        return e;
      default:
        return [0, 0, 0, 0];
    }
  return [e, e, e, e];
}
function Mm(e, t, n) {
  const [o, i, s, r] = typeof e != "string" ? hc(e.padding) : [0, 0, 0, 0];
  return n && typeof n.computedPosition.x < "u" && typeof n.computedPosition.y < "u" && typeof n.dimensions.width < "u" && typeof n.dimensions.height < "u" ? [
    [n.computedPosition.x + r, n.computedPosition.y + o],
    [
      n.computedPosition.x + n.dimensions.width - i,
      n.computedPosition.y + n.dimensions.height - s
    ]
  ] : !1;
}
function Im(e, t, n, o) {
  let i = e.extent || n;
  if ((i === "parent" || !Array.isArray(i) && (i == null ? void 0 : i.range) === "parent") && !e.expandParent)
    if (e.parentNode && o && e.dimensions.width && e.dimensions.height) {
      const s = Mm(i, e, o);
      s && (i = s);
    } else
      t(new Ye(Ue.NODE_EXTENT_INVALID, e.id)), i = n;
  else if (Array.isArray(i)) {
    const s = (o == null ? void 0 : o.computedPosition.x) || 0, r = (o == null ? void 0 : o.computedPosition.y) || 0;
    i = [
      [i[0][0] + s, i[0][1] + r],
      [i[1][0] + s, i[1][1] + r]
    ];
  } else if (i !== "parent" && (i != null && i.range) && Array.isArray(i.range)) {
    const [s, r, l, a] = hc(i.padding), u = (o == null ? void 0 : o.computedPosition.x) || 0, c = (o == null ? void 0 : o.computedPosition.y) || 0;
    i = [
      [i.range[0][0] + u + a, i.range[0][1] + c + s],
      [i.range[1][0] + u - r, i.range[1][1] + c - l]
    ];
  }
  return i === "parent" ? [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ] : i;
}
function Tm({ width: e, height: t }, n) {
  return [n[0], [n[1][0] - (e || 0), n[1][1] - (t || 0)]];
}
function Tr(e, t, n, o, i) {
  const s = Tm(e.dimensions, Im(e, n, o, i)), r = sc(t, s);
  return {
    position: {
      x: r.x - ((i == null ? void 0 : i.computedPosition.x) || 0),
      y: r.y - ((i == null ? void 0 : i.computedPosition.y) || 0)
    },
    computedPosition: r
  };
}
function qn(e, t, n = le.Left, o = !1) {
  const i = ((t == null ? void 0 : t.x) ?? 0) + e.computedPosition.x, s = ((t == null ? void 0 : t.y) ?? 0) + e.computedPosition.y, { width: r, height: l } = t ?? Dm(e);
  if (o)
    return { x: i + r / 2, y: s + l / 2 };
  switch ((t == null ? void 0 : t.position) ?? n) {
    case le.Top:
      return { x: i + r / 2, y: s };
    case le.Right:
      return { x: i + r, y: s + l / 2 };
    case le.Bottom:
      return { x: i + r / 2, y: s + l };
    case le.Left:
      return { x: i, y: s + l / 2 };
  }
}
function Kl(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Pm({
  sourcePos: e,
  targetPos: t,
  sourceWidth: n,
  sourceHeight: o,
  targetWidth: i,
  targetHeight: s,
  width: r,
  height: l,
  viewport: a
}) {
  const u = {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x + n, t.x + i),
    y2: Math.max(e.y + o, t.y + s)
  };
  u.x === u.x2 && (u.x2 += 1), u.y === u.y2 && (u.y2 += 1);
  const c = ac({
    x: (0 - a.x) / a.zoom,
    y: (0 - a.y) / a.zoom,
    width: r / a.zoom,
    height: l / a.zoom
  }), d = Math.max(0, Math.min(c.x2, u.x2) - Math.max(c.x, u.x)), h = Math.max(0, Math.min(c.y2, u.y2) - Math.max(c.y, u.y));
  return Math.ceil(d * h) > 0;
}
function Am(e, t, n = !1) {
  const o = typeof e.zIndex == "number";
  let i = o ? e.zIndex : 0;
  const s = t(e.source), r = t(e.target);
  return !s || !r ? 0 : (n && (i = o ? e.zIndex : Math.max(s.computedPosition.z || 0, r.computedPosition.z || 0)), i);
}
var Ue = /* @__PURE__ */ ((e) => (e.MISSING_STYLES = "MISSING_STYLES", e.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e.NODE_INVALID = "NODE_INVALID", e.NODE_NOT_FOUND = "NODE_NOT_FOUND", e.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e.EDGE_INVALID = "EDGE_INVALID", e.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e.EDGE_ORPHANED = "EDGE_ORPHANED", e.USEVUEFLOW_OPTIONS = "USEVUEFLOW_OPTIONS", e))(Ue || {});
const Xl = {
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
  // deprecation errors
  USEVUEFLOW_OPTIONS: () => "The options parameter is deprecated and will be removed in the next major version. Please use the id parameter instead"
};
class Ye extends Error {
  constructor(t, ...n) {
    var o;
    super((o = Xl[t]) == null ? void 0 : o.call(Xl, ...n)), this.name = "VueFlowError", this.code = t, this.args = n;
  }
}
function Pr(e) {
  return "clientX" in e;
}
function Om(e) {
  return "sourceEvent" in e;
}
function Tt(e, t) {
  const n = Pr(e);
  let o, i;
  return n ? (o = e.clientX, i = e.clientY) : "touches" in e && e.touches.length > 0 ? (o = e.touches[0].clientX, i = e.touches[0].clientY) : "changedTouches" in e && e.changedTouches.length > 0 ? (o = e.changedTouches[0].clientX, i = e.changedTouches[0].clientY) : (o = 0, i = 0), {
    x: o - ((t == null ? void 0 : t.left) ?? 0),
    y: i - ((t == null ? void 0 : t.top) ?? 0)
  };
}
const Pi = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function Dm(e) {
  var t, n;
  return {
    width: ((t = e.dimensions) == null ? void 0 : t.width) ?? e.width ?? 0,
    height: ((n = e.dimensions) == null ? void 0 : n.height) ?? e.height ?? 0
  };
}
function ss(e, t = [1, 1]) {
  return {
    x: t[0] * Math.round(e.x / t[0]),
    y: t[1] * Math.round(e.y / t[1])
  };
}
const km = () => !0;
function Is(e) {
  e == null || e.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function Rm(e, t, n) {
  const o = [], i = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const s of t.values())
    Ii(i, Mi(s)) > 0 && o.push(s);
  return o;
}
const Vm = 250;
function Bm(e, t, n, o) {
  var i, s;
  let r = [], l = Number.POSITIVE_INFINITY;
  const a = Rm(e, n, t + Vm);
  for (const u of a) {
    const c = [...((i = u.handleBounds) == null ? void 0 : i.source) ?? [], ...((s = u.handleBounds) == null ? void 0 : s.target) ?? []];
    for (const d of c) {
      if (o.nodeId === d.nodeId && o.type === d.type && o.id === d.id)
        continue;
      const { x: h, y: v } = qn(u, d, d.position, !0), N = Math.sqrt((h - e.x) ** 2 + (v - e.y) ** 2);
      N > t || (N < l ? (r = [{ ...d, x: h, y: v }], l = N) : N === l && r.push({ ...d, x: h, y: v }));
    }
  }
  if (!r.length)
    return null;
  if (r.length > 1) {
    const u = o.type === "source" ? "target" : "source";
    return r.find((c) => c.type === u) ?? r[0];
  }
  return r[0];
}
function jl(e, {
  handle: t,
  connectionMode: n,
  fromNodeId: o,
  fromHandleId: i,
  fromType: s,
  doc: r,
  lib: l,
  flowId: a,
  isValidConnection: u = km
}, c, d, h, v) {
  const N = s === "target", x = t ? r.querySelector(`.${l}-flow__handle[data-id="${a}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: M, y: E } = Tt(e), T = r.elementFromPoint(M, E), S = T != null && T.classList.contains(`${l}-flow__handle`) ? T : x, C = {
    handleDomNode: S,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (S) {
    const H = gc(void 0, S), j = S.getAttribute("data-nodeid"), K = S.getAttribute("data-handleid"), F = S.classList.contains("connectable"), G = S.classList.contains("connectableend");
    if (!j || !H)
      return C;
    const X = {
      source: N ? j : o,
      sourceHandle: N ? K : i,
      target: N ? o : j,
      targetHandle: N ? i : K
    };
    C.connection = X;
    const P = F && G && (n === un.Strict ? N && H === "source" || !N && H === "target" : j !== o || K !== i);
    C.isValid = P && u(X, {
      nodes: d,
      edges: c,
      sourceNode: h(X.source),
      targetNode: h(X.target)
    }), C.toHandle = vc(j, H, K, v, n, !0);
  }
  return C;
}
function gc(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function zm(e, t) {
  let n = null;
  return t ? n = "valid" : e && !t && (n = "invalid"), n;
}
function Hm(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
function vc(e, t, n, o, i, s = !1) {
  var r, l, a;
  const u = o.get(e);
  if (!u)
    return null;
  const c = i === un.Strict ? (r = u.handleBounds) == null ? void 0 : r[t] : [...((l = u.handleBounds) == null ? void 0 : l.source) ?? [], ...((a = u.handleBounds) == null ? void 0 : a.target) ?? []], d = (n ? c == null ? void 0 : c.find((h) => h.id === n) : c == null ? void 0 : c[0]) ?? null;
  return d && s ? { ...d, ...qn(u, d, d.position, !0) } : d;
}
const nr = {
  [le.Left]: le.Right,
  [le.Right]: le.Left,
  [le.Top]: le.Bottom,
  [le.Bottom]: le.Top
}, Fm = ["production", "prod"];
function Zn(e, ...t) {
  mc() && console.warn(`[Vue Flow]: ${e}`, ...t);
}
function mc() {
  return !Fm.includes("production");
}
function ql(e, t, n, o, i) {
  const s = t.querySelectorAll(`.vue-flow__handle.${e}`);
  return s != null && s.length ? Array.from(s).map((r) => {
    const l = r.getBoundingClientRect();
    return {
      id: r.getAttribute("data-handleid"),
      type: e,
      nodeId: i,
      position: r.getAttribute("data-handlepos"),
      x: (l.left - n.left) / o,
      y: (l.top - n.top) / o,
      ...is(r)
    };
  }) : null;
}
function or(e, t, n, o, i, s = !1, r) {
  i.value = !1, e.selected ? (s || e.selected && t) && (o([e]), rt(() => {
    r.blur();
  })) : n([e]);
}
function Fe(e) {
  return typeof L(e) < "u";
}
function Lm(e, t, n, o) {
  if (!e || !e.source || !e.target)
    return n(new Ye(Ue.EDGE_INVALID, (e == null ? void 0 : e.id) ?? "[ID UNKNOWN]")), !1;
  let i;
  return Qt(e) ? i = e : i = {
    ...e,
    id: Ir(e)
  }, i = Mr(i, void 0, o), lc(i, t) ? !1 : i;
}
function Um(e, t, n, o, i) {
  if (!t.source || !t.target)
    return i(new Ye(Ue.EDGE_INVALID, e.id)), !1;
  if (!n)
    return i(new Ye(Ue.EDGE_NOT_FOUND, e.id)), !1;
  const { id: s, ...r } = e;
  return {
    ...r,
    id: o ? Ir(t) : s,
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
}
function Zl(e, t, n) {
  const o = {}, i = [];
  for (let s = 0; s < e.length; ++s) {
    const r = e[s];
    if (!wn(r)) {
      n(
        new Ye(Ue.NODE_INVALID, r == null ? void 0 : r.id) || `[ID UNKNOWN|INDEX ${s}]`
      );
      continue;
    }
    const l = vm(r, t(r.id), r.parentNode);
    r.parentNode && (o[r.parentNode] = !0), i[s] = l;
  }
  for (const s of i) {
    const r = t(s.parentNode) || i.find((l) => l.id === s.parentNode);
    s.parentNode && !r && n(new Ye(Ue.NODE_MISSING_PARENT, s.id, s.parentNode)), (s.parentNode || o[s.id]) && (o[s.id] && (s.isParent = !0), r && (r.isParent = !0));
  }
  return i;
}
function Jl(e, t, n, o, i, s) {
  let r = i;
  const l = o.get(r) || /* @__PURE__ */ new Map();
  o.set(r, l.set(n, t)), r = `${i}-${e}`;
  const a = o.get(r) || /* @__PURE__ */ new Map();
  if (o.set(r, a.set(n, t)), s) {
    r = `${i}-${e}-${s}`;
    const u = o.get(r) || /* @__PURE__ */ new Map();
    o.set(r, u.set(n, t));
  }
}
function Ts(e, t, n) {
  e.clear();
  for (const o of n) {
    const { source: i, target: s, sourceHandle: r = null, targetHandle: l = null } = o, a = { edgeId: o.id, source: i, target: s, sourceHandle: r, targetHandle: l }, u = `${i}-${r}--${s}-${l}`, c = `${s}-${l}--${i}-${r}`;
    Jl("source", a, c, e, i, r), Jl("target", a, u, e, s, l);
  }
}
function Ql(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Ps(e, t, n, o, i, s, r, l) {
  const a = [];
  for (const u of e) {
    const c = Qt(u) ? u : Lm(u, l, i, s);
    if (!c)
      continue;
    const d = n(c.source), h = n(c.target);
    if (!d || !h) {
      i(new Ye(Ue.EDGE_SOURCE_TARGET_MISSING, c.id, c.source, c.target));
      continue;
    }
    if (!d) {
      i(new Ye(Ue.EDGE_SOURCE_MISSING, c.id, c.source));
      continue;
    }
    if (!h) {
      i(new Ye(Ue.EDGE_TARGET_MISSING, c.id, c.target));
      continue;
    }
    if (t && !t(c, {
      edges: l,
      nodes: r,
      sourceNode: d,
      targetNode: h
    })) {
      i(new Ye(Ue.EDGE_INVALID, c.id));
      continue;
    }
    const v = o(c.id);
    a.push({
      ...Mr(c, v, s),
      sourceNode: d,
      targetNode: h
    });
  }
  return a;
}
const ea = Symbol("vueFlow"), yc = Symbol("nodeId"), _c = Symbol("nodeRef"), Gm = Symbol("edgeId"), Ym = Symbol("edgeRef"), rs = Symbol("slots");
function bc(e) {
  const {
    vueFlowRef: t,
    snapToGrid: n,
    snapGrid: o,
    noDragClassName: i,
    nodeLookup: s,
    nodeExtent: r,
    nodeDragThreshold: l,
    viewport: a,
    autoPanOnNodeDrag: u,
    autoPanSpeed: c,
    nodesDraggable: d,
    panBy: h,
    findNode: v,
    multiSelectionActive: N,
    nodesSelectionActive: x,
    selectNodesOnDrag: M,
    removeSelectedElements: E,
    addSelectedNodes: T,
    updateNodePositions: S,
    emits: C
  } = Re(), { onStart: H, onDrag: j, onStop: K, onClick: F, el: G, disabled: X, id: Y, selectable: P, dragHandle: oe } = e, $ = /* @__PURE__ */ an(!1);
  let z = [], I, k = null, V = { x: void 0, y: void 0 }, q = { x: 0, y: 0 }, Z = null, ee = !1, re = !1, ce = 0, ge = !1;
  const ie = Xm(), ne = ({ x: m, y: w }) => {
    V = { x: m, y: w };
    let f = !1;
    if (z = z.map((p) => {
      const g = { x: m - p.distance.x, y: w - p.distance.y }, { computedPosition: y } = Tr(
        p,
        n.value ? ss(g, o.value) : g,
        C.error,
        r.value,
        p.parentNode ? v(p.parentNode) : void 0
      );
      return f = f || p.position.x !== y.x || p.position.y !== y.y, p.position = y, p;
    }), re = re || f, !!f && (S(z, !0, !0), $.value = !0, Z)) {
      const [p, g] = Ms({
        id: Y,
        dragItems: z,
        findNode: v
      });
      j({ event: Z, node: p, nodes: g });
    }
  }, ae = () => {
    if (!k)
      return;
    const [m, w] = pc(q, k, c.value);
    if (m !== 0 || w !== 0) {
      const f = {
        x: (V.x ?? 0) - m / a.value.zoom,
        y: (V.y ?? 0) - w / a.value.zoom
      };
      h({ x: m, y: w }) && ne(f);
    }
    ce = requestAnimationFrame(ae);
  }, me = (m, w) => {
    ee = !0;
    const f = v(Y);
    !M.value && !N.value && f && (f.selected || E()), f && ye(P) && M.value && or(
      f,
      N.value,
      T,
      E,
      x,
      !1,
      w
    );
    const p = ie(m.sourceEvent);
    if (V = p, z = $m(s.value, d.value, p, Y), z.length) {
      const [g, y] = Ms({
        id: Y,
        dragItems: z,
        findNode: v
      });
      H({ event: m.sourceEvent, node: g, nodes: y });
    }
  }, Ee = (m, w) => {
    var f;
    m.sourceEvent.type === "touchmove" && m.sourceEvent.touches.length > 1 || (re = !1, l.value === 0 && me(m, w), V = ie(m.sourceEvent), k = ((f = t.value) == null ? void 0 : f.getBoundingClientRect()) || null, q = Tt(m.sourceEvent, k));
  }, de = (m, w) => {
    const f = ie(m.sourceEvent);
    if (!ge && ee && u.value && (ge = !0, ae()), !ee) {
      const p = f.xSnapped - (V.x ?? 0), g = f.ySnapped - (V.y ?? 0);
      Math.sqrt(p * p + g * g) > l.value && me(m, w);
    }
    (V.x !== f.xSnapped || V.y !== f.ySnapped) && z.length && ee && (Z = m.sourceEvent, q = Tt(m.sourceEvent, k), ne(f));
  }, xe = (m) => {
    let w = !1;
    if (!ee && !$.value && !N.value) {
      const f = m.sourceEvent, p = ie(f), g = p.xSnapped - (V.x ?? 0), y = p.ySnapped - (V.y ?? 0), _ = Math.sqrt(g * g + y * y);
      _ !== 0 && _ <= l.value && (F == null || F(f), w = !0);
    }
    if (z.length && !w) {
      re && (S(z, !1, !1), re = !1);
      const [f, p] = Ms({
        id: Y,
        dragItems: z,
        findNode: v
      });
      K({ event: m.sourceEvent, node: f, nodes: p });
    }
    z = [], $.value = !1, ge = !1, ee = !1, V = { x: void 0, y: void 0 }, cancelAnimationFrame(ce);
  };
  return be([() => ye(X), G], ([m, w], f, p) => {
    if (w) {
      const g = pt(w);
      m || (I = gg().on("start", (y) => Ee(y, w)).on("drag", (y) => de(y, w)).on("end", (y) => xe(y)).filter((y) => {
        const _ = y.target, D = ye(oe);
        return !y.button && (!i.value || !Wl(_, `.${i.value}`, w) && (!D || Wl(_, D, w)));
      }), g.call(I)), p(() => {
        g.on(".drag", null), I && (I.on("start", null), I.on("drag", null), I.on("end", null));
      });
    }
  }), $;
}
function Wm() {
  return {
    doubleClick: Q(),
    click: Q(),
    mouseEnter: Q(),
    mouseMove: Q(),
    mouseLeave: Q(),
    contextMenu: Q(),
    updateStart: Q(),
    update: Q(),
    updateEnd: Q()
  };
}
function Km(e, t) {
  const n = Wm();
  return n.doubleClick.on((o) => {
    var i, s;
    t.edgeDoubleClick(o), (s = (i = e.events) == null ? void 0 : i.doubleClick) == null || s.call(i, o);
  }), n.click.on((o) => {
    var i, s;
    t.edgeClick(o), (s = (i = e.events) == null ? void 0 : i.click) == null || s.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, s;
    t.edgeMouseEnter(o), (s = (i = e.events) == null ? void 0 : i.mouseEnter) == null || s.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, s;
    t.edgeMouseMove(o), (s = (i = e.events) == null ? void 0 : i.mouseMove) == null || s.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, s;
    t.edgeMouseLeave(o), (s = (i = e.events) == null ? void 0 : i.mouseLeave) == null || s.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, s;
    t.edgeContextMenu(o), (s = (i = e.events) == null ? void 0 : i.contextMenu) == null || s.call(i, o);
  }), n.updateStart.on((o) => {
    var i, s;
    t.edgeUpdateStart(o), (s = (i = e.events) == null ? void 0 : i.updateStart) == null || s.call(i, o);
  }), n.update.on((o) => {
    var i, s;
    t.edgeUpdate(o), (s = (i = e.events) == null ? void 0 : i.update) == null || s.call(i, o);
  }), n.updateEnd.on((o) => {
    var i, s;
    t.edgeUpdateEnd(o), (s = (i = e.events) == null ? void 0 : i.updateEnd) == null || s.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, s]) => (o.emit[i] = s.trigger, o.on[i] = s.on, o),
    { emit: {}, on: {} }
  );
}
function Xm() {
  const { viewport: e, snapGrid: t, snapToGrid: n, vueFlowRef: o } = Re();
  return (i) => {
    var s;
    const r = ((s = o.value) == null ? void 0 : s.getBoundingClientRect()) ?? { left: 0, top: 0 }, l = Om(i) ? i.sourceEvent : i, { x: a, y: u } = Tt(l, r), c = Do({ x: a, y: u }, e.value), { x: d, y: h } = n.value ? ss(c, t.value) : c;
    return {
      xSnapped: d,
      ySnapped: h,
      ...c
    };
  };
}
function Qo() {
  return !0;
}
function wc({
  handleId: e,
  nodeId: t,
  type: n,
  isValidConnection: o,
  edgeUpdaterType: i,
  onEdgeUpdate: s,
  onEdgeUpdateEnd: r
}) {
  const {
    id: l,
    vueFlowRef: a,
    connectionMode: u,
    connectionRadius: c,
    connectOnClick: d,
    connectionClickStartHandle: h,
    nodesConnectable: v,
    autoPanOnConnect: N,
    autoPanSpeed: x,
    findNode: M,
    panBy: E,
    startConnection: T,
    updateConnection: S,
    endConnection: C,
    emits: H,
    viewport: j,
    edges: K,
    nodes: F,
    isValidConnection: G,
    nodeLookup: X
  } = Re();
  let Y = null, P = !1, oe = null;
  function $(I) {
    var k;
    const V = ye(n) === "target", q = Pr(I), Z = Bl(I.target), ee = I.currentTarget;
    if (ee && (q && I.button === 0 || !q)) {
      let re = function(B) {
        f = Tt(B, xe), ne = Bm(
          Do(f, j.value, !1, [1, 1]),
          c.value,
          X.value,
          y
        ), p || (g(), p = !0);
        const R = jl(
          B,
          {
            handle: ne,
            connectionMode: u.value,
            fromNodeId: ye(t),
            fromHandleId: ye(e),
            fromType: V ? "target" : "source",
            isValidConnection: ie,
            doc: Z,
            lib: "vue",
            flowId: l,
            nodeLookup: X.value
          },
          K.value,
          F.value,
          M,
          X.value
        );
        oe = R.handleDomNode, Y = R.connection, P = Hm(!!ne, R.isValid);
        const W = {
          // from stays the same
          ...A,
          isValid: P,
          to: R.toHandle && P ? Oo({ x: R.toHandle.x, y: R.toHandle.y }, j.value) : f,
          toHandle: R.toHandle,
          toPosition: P && R.toHandle ? R.toHandle.position : nr[y.position],
          toNode: R.toHandle ? X.value.get(R.toHandle.nodeId) : null
        };
        if (P && ne && (A != null && A.toHandle) && W.toHandle && A.toHandle.type === W.toHandle.type && A.toHandle.nodeId === W.toHandle.nodeId && A.toHandle.id === W.toHandle.id && A.to.x === W.to.x && A.to.y === W.to.y)
          return;
        const J = ne ?? R.toHandle;
        if (S(
          J && P ? Oo(
            {
              x: J.x,
              y: J.y
            },
            j.value
          ) : f,
          J,
          zm(!!J, P)
        ), A = W, !ne && !P && !oe)
          return Is(w);
        Y && Y.source !== Y.target && oe && (Is(w), w = oe, oe.classList.add("connecting", "vue-flow__handle-connecting"), oe.classList.toggle("valid", !!P), oe.classList.toggle("vue-flow__handle-valid", !!P));
      }, ce = function(B) {
        "touches" in B && B.touches.length > 0 || ((ne || oe) && Y && P && (s ? s(B, Y) : H.connect(Y)), H.connectEnd(B), i && (r == null || r(B)), Is(w), cancelAnimationFrame(ae), C(B), p = !1, P = !1, Y = null, oe = null, Z.removeEventListener("mousemove", re), Z.removeEventListener("mouseup", ce), Z.removeEventListener("touchmove", re), Z.removeEventListener("touchend", ce));
      };
      const ge = M(ye(t));
      let ie = ye(o) || G.value || Qo;
      !ie && ge && (ie = (V ? ge.isValidSourcePos : ge.isValidTargetPos) || Qo);
      let ne, ae = 0;
      const { x: me, y: Ee } = Tt(I), de = gc(ye(i), ee), xe = (k = a.value) == null ? void 0 : k.getBoundingClientRect();
      if (!xe || !de)
        return;
      const m = vc(ye(t), de, ye(e), X.value, u.value);
      if (!m)
        return;
      let w, f = Tt(I, xe), p = !1;
      const g = () => {
        if (!N.value)
          return;
        const [B, R] = pc(f, xe, x.value);
        E({ x: B, y: R }), ae = requestAnimationFrame(g);
      }, y = {
        ...m,
        nodeId: ye(t),
        type: de,
        position: m.position
      }, _ = X.value.get(ye(t)), O = {
        inProgress: !0,
        isValid: null,
        from: qn(_, y, le.Left, !0),
        fromHandle: y,
        fromPosition: y.position,
        fromNode: _,
        to: f,
        toHandle: null,
        toPosition: nr[y.position],
        toNode: null
      };
      T(
        {
          nodeId: ye(t),
          id: ye(e),
          type: de,
          position: (ee == null ? void 0 : ee.getAttribute("data-handlepos")) || le.Top,
          ...f
        },
        {
          x: me - xe.left,
          y: Ee - xe.top
        }
      ), H.connectStart({ event: I, nodeId: ye(t), handleId: ye(e), handleType: de });
      let A = O;
      Z.addEventListener("mousemove", re), Z.addEventListener("mouseup", ce), Z.addEventListener("touchmove", re), Z.addEventListener("touchend", ce);
    }
  }
  function z(I) {
    var k, V;
    if (!d.value)
      return;
    const q = ye(n) === "target";
    if (!h.value) {
      H.clickConnectStart({ event: I, nodeId: ye(t), handleId: ye(e) }), T(
        {
          nodeId: ye(t),
          type: ye(n),
          id: ye(e),
          position: le.Top,
          ...Tt(I)
        },
        void 0,
        !0
      );
      return;
    }
    let Z = ye(o) || G.value || Qo;
    const ee = M(ye(t));
    if (!Z && ee && (Z = (q ? ee.isValidSourcePos : ee.isValidTargetPos) || Qo), ee && (typeof ee.connectable > "u" ? v.value : ee.connectable) === !1)
      return;
    const re = Bl(I.target), ce = jl(
      I,
      {
        handle: {
          nodeId: ye(t),
          id: ye(e),
          type: ye(n),
          position: le.Top,
          ...Tt(I)
        },
        connectionMode: u.value,
        fromNodeId: h.value.nodeId,
        fromHandleId: h.value.id ?? null,
        fromType: h.value.type,
        isValidConnection: Z,
        doc: re,
        lib: "vue",
        flowId: l,
        nodeLookup: X.value
      },
      K.value,
      F.value,
      M,
      X.value
    ), ge = ((k = ce.connection) == null ? void 0 : k.source) === ((V = ce.connection) == null ? void 0 : V.target);
    ce.isValid && ce.connection && !ge && H.connect(ce.connection), H.clickConnectEnd(I), C(I, !0);
  }
  return {
    handlePointerDown: $,
    handleClick: z
  };
}
function jm() {
  return mt(yc, "");
}
function xc(e) {
  const t = e ?? jm() ?? "", n = mt(_c, /* @__PURE__ */ De(null)), { findNode: o, edges: i, emits: s } = Re(), r = o(t);
  return r || s.error(new Ye(Ue.NODE_NOT_FOUND, t)), {
    id: t,
    nodeEl: n,
    node: r,
    parentNode: se(() => o(r.parentNode)),
    connectedEdges: se(() => dc([r], i.value))
  };
}
function qm() {
  return {
    doubleClick: Q(),
    click: Q(),
    mouseEnter: Q(),
    mouseMove: Q(),
    mouseLeave: Q(),
    contextMenu: Q(),
    dragStart: Q(),
    drag: Q(),
    dragStop: Q()
  };
}
function Zm(e, t) {
  const n = qm();
  return n.doubleClick.on((o) => {
    var i, s;
    t.nodeDoubleClick(o), (s = (i = e.events) == null ? void 0 : i.doubleClick) == null || s.call(i, o);
  }), n.click.on((o) => {
    var i, s;
    t.nodeClick(o), (s = (i = e.events) == null ? void 0 : i.click) == null || s.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, s;
    t.nodeMouseEnter(o), (s = (i = e.events) == null ? void 0 : i.mouseEnter) == null || s.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, s;
    t.nodeMouseMove(o), (s = (i = e.events) == null ? void 0 : i.mouseMove) == null || s.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, s;
    t.nodeMouseLeave(o), (s = (i = e.events) == null ? void 0 : i.mouseLeave) == null || s.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, s;
    t.nodeContextMenu(o), (s = (i = e.events) == null ? void 0 : i.contextMenu) == null || s.call(i, o);
  }), n.dragStart.on((o) => {
    var i, s;
    t.nodeDragStart(o), (s = (i = e.events) == null ? void 0 : i.dragStart) == null || s.call(i, o);
  }), n.drag.on((o) => {
    var i, s;
    t.nodeDrag(o), (s = (i = e.events) == null ? void 0 : i.drag) == null || s.call(i, o);
  }), n.dragStop.on((o) => {
    var i, s;
    t.nodeDragStop(o), (s = (i = e.events) == null ? void 0 : i.dragStop) == null || s.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, s]) => (o.emit[i] = s.trigger, o.on[i] = s.on, o),
    { emit: {}, on: {} }
  );
}
function Sc() {
  const { getSelectedNodes: e, nodeExtent: t, updateNodePositions: n, findNode: o, snapGrid: i, snapToGrid: s, nodesDraggable: r, emits: l } = Re();
  return (a, u = !1) => {
    const c = s.value ? i.value[0] : 5, d = s.value ? i.value[1] : 5, h = u ? 4 : 1, v = a.x * c * h, N = a.y * d * h, x = [];
    for (const M of e.value)
      if (M.draggable || r && typeof M.draggable > "u") {
        const E = { x: M.computedPosition.x + v, y: M.computedPosition.y + N }, { position: T } = Tr(
          M,
          E,
          l.error,
          t.value,
          M.parentNode ? o(M.parentNode) : void 0
        );
        x.push({
          id: M.id,
          position: T,
          from: M.position,
          distance: { x: a.x, y: a.y },
          dimensions: M.dimensions
        });
      }
    n(x, !0, !1);
  };
}
const ei = 0.1, Jm = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
function nn() {
  return Zn("Viewport not initialized yet."), Promise.resolve(!1);
}
const Qm = {
  zoomIn: nn,
  zoomOut: nn,
  zoomTo: nn,
  fitView: nn,
  setCenter: nn,
  fitBounds: nn,
  project: (e) => e,
  screenToFlowCoordinate: (e) => e,
  flowToScreenCoordinate: (e) => e,
  setViewport: nn,
  setTransform: nn,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  getTransform: () => ({ x: 0, y: 0, zoom: 1 }),
  viewportInitialized: !1
};
function ey(e) {
  function t(o, i) {
    return new Promise((s) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate((i == null ? void 0 : i.interpolate) === "linear" ? _o : ri).scaleBy(
        As(e.d3Selection, i == null ? void 0 : i.duration, i == null ? void 0 : i.ease, () => {
          s(!0);
        }),
        o
      ) : s(!1);
    });
  }
  function n(o, i, s, r) {
    return new Promise((l) => {
      var a;
      const { x: u, y: c } = sc({ x: -o, y: -i }, e.translateExtent), d = jn.translate(-u, -c).scale(s);
      e.d3Selection && e.d3Zoom ? (a = e.d3Zoom) == null || a.interpolate((r == null ? void 0 : r.interpolate) === "linear" ? _o : ri).transform(
        As(e.d3Selection, r == null ? void 0 : r.duration, r == null ? void 0 : r.ease, () => {
          l(!0);
        }),
        d
      ) : l(!1);
    });
  }
  return se(() => e.d3Zoom && e.d3Selection && e.dimensions.width && e.dimensions.height ? {
    viewportInitialized: !0,
    // todo: allow passing scale as option
    zoomIn: (i) => t(1.2, i),
    zoomOut: (i) => t(1 / 1.2, i),
    zoomTo: (i, s) => new Promise((r) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate((s == null ? void 0 : s.interpolate) === "linear" ? _o : ri).scaleTo(
        As(e.d3Selection, s == null ? void 0 : s.duration, s == null ? void 0 : s.ease, () => {
          r(!0);
        }),
        i
      ) : r(!1);
    }),
    setViewport: (i, s) => n(i.x, i.y, i.zoom, s),
    setTransform: (i, s) => n(i.x, i.y, i.zoom, s),
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
    fitView: (i = {
      padding: ei,
      includeHiddenNodes: !1,
      duration: 0
    }) => {
      var s, r;
      const l = [];
      for (const h of e.nodes)
        h.dimensions.width && h.dimensions.height && ((i == null ? void 0 : i.includeHiddenNodes) || !h.hidden) && (!((s = i.nodes) != null && s.length) || (r = i.nodes) != null && r.length && i.nodes.includes(h.id)) && l.push(h);
      if (!l.length)
        return Promise.resolve(!1);
      const a = uc(l), { x: u, y: c, zoom: d } = zl(
        a,
        e.dimensions.width,
        e.dimensions.height,
        i.minZoom ?? e.minZoom,
        i.maxZoom ?? e.maxZoom,
        i.padding ?? ei
      );
      return n(u, c, d, i);
    },
    setCenter: (i, s, r) => {
      const l = typeof (r == null ? void 0 : r.zoom) < "u" ? r.zoom : e.maxZoom, a = e.dimensions.width / 2 - i * l, u = e.dimensions.height / 2 - s * l;
      return n(a, u, l, r);
    },
    fitBounds: (i, s = { padding: ei }) => {
      const { x: r, y: l, zoom: a } = zl(
        i,
        e.dimensions.width,
        e.dimensions.height,
        e.minZoom,
        e.maxZoom,
        s.padding ?? ei
      );
      return n(r, l, a, s);
    },
    project: (i) => Do(i, e.viewport, e.snapToGrid, e.snapGrid),
    screenToFlowCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: s, y: r } = e.vueFlowRef.getBoundingClientRect(), l = {
          x: i.x - s,
          y: i.y - r
        };
        return Do(l, e.viewport, e.snapToGrid, e.snapGrid);
      }
      return { x: 0, y: 0 };
    },
    flowToScreenCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: s, y: r } = e.vueFlowRef.getBoundingClientRect(), l = {
          x: i.x + s,
          y: i.y + r
        };
        return Oo(l, e.viewport);
      }
      return { x: 0, y: 0 };
    }
  } : Qm);
}
function As(e, t = 0, n = Jm, o = () => {
}) {
  const i = typeof t == "number" && t > 0;
  return i || o(), i ? e.transition().duration(t).ease(n).on("end", o) : e;
}
function ty(e, t, n) {
  const o = Fi(!0);
  return o.run(() => {
    const i = () => {
      o.run(() => {
        let x, M, E = !!(n.nodes.value.length || n.edges.value.length);
        x = Pn([e.modelValue, () => {
          var T, S;
          return (S = (T = e.modelValue) == null ? void 0 : T.value) == null ? void 0 : S.length;
        }], ([T]) => {
          T && Array.isArray(T) && (M == null || M.pause(), n.setElements(T), !M && !E && T.length ? E = !0 : M == null || M.resume());
        }), M = Pn(
          [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
          ([T, S]) => {
            var C;
            (C = e.modelValue) != null && C.value && Array.isArray(e.modelValue.value) && (x == null || x.pause(), e.modelValue.value = [...T, ...S], rt(() => {
              x == null || x.resume();
            }));
          },
          { immediate: E }
        ), co(() => {
          x == null || x.stop(), M == null || M.stop();
        });
      });
    }, s = () => {
      o.run(() => {
        let x, M, E = !!n.nodes.value.length;
        x = Pn([e.nodes, () => {
          var T, S;
          return (S = (T = e.nodes) == null ? void 0 : T.value) == null ? void 0 : S.length;
        }], ([T]) => {
          T && Array.isArray(T) && (M == null || M.pause(), n.setNodes(T), !M && !E && T.length ? E = !0 : M == null || M.resume());
        }), M = Pn(
          [n.nodes, () => n.nodes.value.length],
          ([T]) => {
            var S;
            (S = e.nodes) != null && S.value && Array.isArray(e.nodes.value) && (x == null || x.pause(), e.nodes.value = [...T], rt(() => {
              x == null || x.resume();
            }));
          },
          { immediate: E }
        ), co(() => {
          x == null || x.stop(), M == null || M.stop();
        });
      });
    }, r = () => {
      o.run(() => {
        let x, M, E = !!n.edges.value.length;
        x = Pn([e.edges, () => {
          var T, S;
          return (S = (T = e.edges) == null ? void 0 : T.value) == null ? void 0 : S.length;
        }], ([T]) => {
          T && Array.isArray(T) && (M == null || M.pause(), n.setEdges(T), !M && !E && T.length ? E = !0 : M == null || M.resume());
        }), M = Pn(
          [n.edges, () => n.edges.value.length],
          ([T]) => {
            var S;
            (S = e.edges) != null && S.value && Array.isArray(e.edges.value) && (x == null || x.pause(), e.edges.value = [...T], rt(() => {
              x == null || x.resume();
            }));
          },
          { immediate: E }
        ), co(() => {
          x == null || x.stop(), M == null || M.stop();
        });
      });
    }, l = () => {
      o.run(() => {
        be(
          () => t.maxZoom,
          () => {
            t.maxZoom && Fe(t.maxZoom) && n.setMaxZoom(t.maxZoom);
          },
          {
            immediate: !0
          }
        );
      });
    }, a = () => {
      o.run(() => {
        be(
          () => t.minZoom,
          () => {
            t.minZoom && Fe(t.minZoom) && n.setMinZoom(t.minZoom);
          },
          { immediate: !0 }
        );
      });
    }, u = () => {
      o.run(() => {
        be(
          () => t.translateExtent,
          () => {
            t.translateExtent && Fe(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, c = () => {
      o.run(() => {
        be(
          () => t.nodeExtent,
          () => {
            t.nodeExtent && Fe(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, d = () => {
      o.run(() => {
        be(
          () => t.applyDefault,
          () => {
            Fe(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
          },
          {
            immediate: !0
          }
        );
      });
    }, h = () => {
      o.run(() => {
        const x = async (M) => {
          let E = M;
          typeof t.autoConnect == "function" && (E = await t.autoConnect(M)), E !== !1 && n.addEdges([E]);
        };
        be(
          () => t.autoConnect,
          () => {
            Fe(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
          },
          { immediate: !0 }
        ), be(
          n.autoConnect,
          (M, E, T) => {
            M ? n.onConnect(x) : n.hooks.value.connect.off(x), T(() => {
              n.hooks.value.connect.off(x);
            });
          },
          { immediate: !0 }
        );
      });
    }, v = () => {
      const x = [
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
      for (const M of Object.keys(t)) {
        const E = M;
        if (!x.includes(E)) {
          const T = /* @__PURE__ */ Oe(() => t[E]), S = n[E];
          /* @__PURE__ */ Ae(S) && o.run(() => {
            be(
              T,
              (C) => {
                Fe(C) && (S.value = C);
              },
              { immediate: !0 }
            );
          });
        }
      }
    };
    (() => {
      i(), s(), r(), a(), l(), u(), c(), d(), h(), v();
    })();
  }), () => o.stop();
}
function ny() {
  return {
    edgesChange: Q(),
    nodesChange: Q(),
    nodeDoubleClick: Q(),
    nodeClick: Q(),
    nodeMouseEnter: Q(),
    nodeMouseMove: Q(),
    nodeMouseLeave: Q(),
    nodeContextMenu: Q(),
    nodeDragStart: Q(),
    nodeDrag: Q(),
    nodeDragStop: Q(),
    nodesInitialized: Q(),
    miniMapNodeClick: Q(),
    miniMapNodeDoubleClick: Q(),
    miniMapNodeMouseEnter: Q(),
    miniMapNodeMouseMove: Q(),
    miniMapNodeMouseLeave: Q(),
    connect: Q(),
    connectStart: Q(),
    connectEnd: Q(),
    clickConnectStart: Q(),
    clickConnectEnd: Q(),
    paneReady: Q(),
    init: Q(),
    move: Q(),
    moveStart: Q(),
    moveEnd: Q(),
    selectionDragStart: Q(),
    selectionDrag: Q(),
    selectionDragStop: Q(),
    selectionContextMenu: Q(),
    selectionStart: Q(),
    selectionEnd: Q(),
    viewportChangeStart: Q(),
    viewportChange: Q(),
    viewportChangeEnd: Q(),
    paneScroll: Q(),
    paneClick: Q(),
    paneContextMenu: Q(),
    paneMouseEnter: Q(),
    paneMouseMove: Q(),
    paneMouseLeave: Q(),
    edgeContextMenu: Q(),
    edgeMouseEnter: Q(),
    edgeMouseMove: Q(),
    edgeMouseLeave: Q(),
    edgeDoubleClick: Q(),
    edgeClick: Q(),
    edgeUpdateStart: Q(),
    edgeUpdate: Q(),
    edgeUpdateEnd: Q(),
    updateNodeInternals: Q(),
    error: Q((e) => Zn(e.message))
  };
}
function oy(e, t) {
  const n = tn();
  Ya(() => {
    for (const [i, s] of Object.entries(t.value)) {
      const r = (l) => {
        e(i, l);
      };
      s.setEmitter(r), Mo(s.removeEmitter), s.setHasEmitListeners(() => o(i)), Mo(s.removeHasEmitListeners);
    }
  });
  function o(i) {
    var s;
    const r = iy(i);
    return !!((s = n == null ? void 0 : n.vnode.props) == null ? void 0 : s[r]);
  }
}
function iy(e) {
  const [t, ...n] = e.split(":");
  return `on${t.replace(/(?:^|-)(\w)/g, (i, s) => s.toUpperCase())}${n.length ? `:${n.join(":")}` : ""}`;
}
function Ec() {
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
    viewport: { x: 0, y: 0, zoom: 1 },
    d3Zoom: null,
    d3Selection: null,
    d3ZoomHandler: null,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ],
    nodeExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ],
    selectionMode: $r.Full,
    paneDragging: !1,
    preventScrolling: !0,
    zoomOnScroll: !0,
    zoomOnPinch: !0,
    zoomOnDoubleClick: !0,
    panOnScroll: !1,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: bo.Free,
    paneClickDistance: 0,
    panOnDrag: !0,
    edgeUpdaterRadius: 10,
    onlyRenderVisibleElements: !1,
    defaultViewport: { x: 0, y: 0, zoom: 1 },
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    defaultMarkerColor: "#b1b1b7",
    connectionLineStyle: {},
    connectionLineType: null,
    connectionLineOptions: {
      type: gn.Bezier,
      style: {}
    },
    connectionMode: un.Loose,
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectionPosition: { x: Number.NaN, y: Number.NaN },
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
    multiSelectionKeyCode: Pi() ? "Meta" : "Control",
    zoomActivationKeyCode: Pi() ? "Meta" : "Control",
    deleteKeyCode: "Backspace",
    panActivationKeyCode: "Space",
    hooks: ny(),
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
const sy = [
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
function ry(e, t, n) {
  const o = ey(e), i = (f) => {
    const p = f ?? [];
    e.hooks.updateNodeInternals.trigger(p);
  }, s = (f) => ym(f, e.nodes, e.edges), r = (f) => mm(f, e.nodes, e.edges), l = (f) => dc(f, e.edges), a = ({ id: f, type: p, nodeId: g }) => {
    var y;
    const _ = f ? `-${p}-${f}` : `-${p}`;
    return Array.from(((y = e.connectionLookup.get(`${g}${_}`)) == null ? void 0 : y.values()) ?? []);
  }, u = (f) => {
    if (f)
      return t.value.get(f);
  }, c = (f) => {
    if (f)
      return n.value.get(f);
  }, d = (f, p, g) => {
    var y, _;
    const D = [];
    for (const O of f) {
      const A = {
        id: O.id,
        type: "position",
        dragging: g,
        from: O.from
      };
      if (p && (A.position = O.position, O.parentNode)) {
        const B = u(O.parentNode);
        A.position = {
          x: A.position.x - (((y = B == null ? void 0 : B.computedPosition) == null ? void 0 : y.x) ?? 0),
          y: A.position.y - (((_ = B == null ? void 0 : B.computedPosition) == null ? void 0 : _.y) ?? 0)
        };
      }
      D.push(A);
    }
    D != null && D.length && e.hooks.nodesChange.trigger(D);
  }, h = (f) => {
    if (!e.vueFlowRef)
      return;
    const p = e.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!p)
      return;
    const g = window.getComputedStyle(p), { m22: y } = new window.DOMMatrixReadOnly(g.transform), _ = [];
    for (const D of f) {
      const O = D, A = u(O.id);
      if (A) {
        const B = is(O.nodeElement);
        if (!!(B.width && B.height && (A.dimensions.width !== B.width || A.dimensions.height !== B.height || O.forceUpdate))) {
          const W = O.nodeElement.getBoundingClientRect();
          A.dimensions = B, A.handleBounds.source = ql("source", O.nodeElement, W, y, A.id), A.handleBounds.target = ql("target", O.nodeElement, W, y, A.id), _.push({
            id: A.id,
            type: "dimensions",
            dimensions: B
          });
        }
      }
    }
    !e.fitViewOnInitDone && e.fitViewOnInit && o.value.fitView().then(() => {
      e.fitViewOnInitDone = !0;
    }), _.length && e.hooks.nodesChange.trigger(_);
  }, v = (f, p) => {
    const g = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set();
    for (const O of f)
      wn(O) ? g.add(O.id) : Qt(O) && y.add(O.id);
    const _ = ln(t.value, g, !0), D = ln(n.value, y);
    if (e.multiSelectionActive) {
      for (const O of g)
        _.push(sn(O, p));
      for (const O of y)
        D.push(sn(O, p));
    }
    _.length && e.hooks.nodesChange.trigger(_), D.length && e.hooks.edgesChange.trigger(D);
  }, N = (f) => {
    if (e.multiSelectionActive) {
      const p = f.map((g) => sn(g.id, !0));
      e.hooks.nodesChange.trigger(p);
      return;
    }
    e.hooks.nodesChange.trigger(ln(t.value, new Set(f.map((p) => p.id)), !0)), e.hooks.edgesChange.trigger(ln(n.value));
  }, x = (f) => {
    if (e.multiSelectionActive) {
      const p = f.map((g) => sn(g.id, !0));
      e.hooks.edgesChange.trigger(p);
      return;
    }
    e.hooks.edgesChange.trigger(ln(n.value, new Set(f.map((p) => p.id)))), e.hooks.nodesChange.trigger(ln(t.value, /* @__PURE__ */ new Set(), !0));
  }, M = (f) => {
    v(f, !0);
  }, E = (f) => {
    const g = (f || e.nodes).map((y) => (y.selected = !1, sn(y.id, !1)));
    e.hooks.nodesChange.trigger(g);
  }, T = (f) => {
    const g = (f || e.edges).map((y) => (y.selected = !1, sn(y.id, !1)));
    e.hooks.edgesChange.trigger(g);
  }, S = (f) => {
    if (!f || !f.length)
      return v([], !1);
    const p = f.reduce(
      (g, y) => {
        const _ = sn(y.id, !1);
        return wn(y) ? g.nodes.push(_) : g.edges.push(_), g;
      },
      { nodes: [], edges: [] }
    );
    p.nodes.length && e.hooks.nodesChange.trigger(p.nodes), p.edges.length && e.hooks.edgesChange.trigger(p.edges);
  }, C = (f) => {
    var p;
    (p = e.d3Zoom) == null || p.scaleExtent([f, e.maxZoom]), e.minZoom = f;
  }, H = (f) => {
    var p;
    (p = e.d3Zoom) == null || p.scaleExtent([e.minZoom, f]), e.maxZoom = f;
  }, j = (f) => {
    var p;
    (p = e.d3Zoom) == null || p.translateExtent(f), e.translateExtent = f;
  }, K = (f) => {
    e.nodeExtent = f, i();
  }, F = (f) => {
    var p;
    (p = e.d3Zoom) == null || p.clickDistance(f);
  }, G = (f) => {
    e.nodesDraggable = f, e.nodesConnectable = f, e.elementsSelectable = f;
  }, X = (f) => {
    const p = f instanceof Function ? f(e.nodes) : f;
    !e.initialized && !p.length || (e.nodes = Zl(p, u, e.hooks.error.trigger));
  }, Y = (f) => {
    const p = f instanceof Function ? f(e.edges) : f;
    if (!e.initialized && !p.length)
      return;
    const g = Ps(
      p,
      e.isValidConnection,
      u,
      c,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    );
    Ts(e.connectionLookup, n.value, g), e.edges = g;
  }, P = (f) => {
    const p = f instanceof Function ? f([...e.nodes, ...e.edges]) : f;
    !e.initialized && !p.length || (X(p.filter(wn)), Y(p.filter(Qt)));
  }, oe = (f) => {
    let p = f instanceof Function ? f(e.nodes) : f;
    p = Array.isArray(p) ? p : [p];
    const g = Zl(p, u, e.hooks.error.trigger), y = [];
    for (const _ of g)
      y.push(Ll(_));
    y.length && e.hooks.nodesChange.trigger(y);
  }, $ = (f) => {
    let p = f instanceof Function ? f(e.edges) : f;
    p = Array.isArray(p) ? p : [p];
    const g = Ps(
      p,
      e.isValidConnection,
      u,
      c,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    ), y = [];
    for (const _ of g)
      y.push(Ll(_));
    y.length && e.hooks.edgesChange.trigger(y);
  }, z = (f, p = !0, g = !1) => {
    const y = f instanceof Function ? f(e.nodes) : f, _ = Array.isArray(y) ? y : [y], D = [], O = [];
    function A(R) {
      const W = l(R);
      for (const J of W)
        (!Fe(J.deletable) || J.deletable) && O.push(Gl(J.id, J.source, J.target, J.sourceHandle, J.targetHandle));
    }
    function B(R) {
      const W = [];
      for (const J of e.nodes)
        J.parentNode === R && W.push(J);
      if (W.length) {
        for (const J of W)
          D.push(Ul(J.id));
        p && A(W);
        for (const J of W)
          B(J.id);
      }
    }
    for (const R of _) {
      const W = typeof R == "string" ? u(R) : R;
      W && (Fe(W.deletable) && !W.deletable || (D.push(Ul(W.id)), p && A([W]), g && B(W.id)));
    }
    O.length && e.hooks.edgesChange.trigger(O), D.length && e.hooks.nodesChange.trigger(D);
  }, I = (f) => {
    const p = f instanceof Function ? f(e.edges) : f, g = Array.isArray(p) ? p : [p], y = [];
    for (const _ of g) {
      const D = typeof _ == "string" ? c(_) : _;
      D && (Fe(D.deletable) && !D.deletable || y.push(
        Gl(
          typeof _ == "string" ? _ : _.id,
          D.source,
          D.target,
          D.sourceHandle,
          D.targetHandle
        )
      ));
    }
    e.hooks.edgesChange.trigger(y);
  }, k = (f, p, g = !0) => {
    const y = c(f.id);
    if (!y)
      return !1;
    const _ = e.edges.indexOf(y), D = Um(f, p, y, g, e.hooks.error.trigger);
    if (D) {
      const [O] = Ps(
        [D],
        e.isValidConnection,
        u,
        c,
        e.hooks.error.trigger,
        e.defaultEdgeOptions,
        e.nodes,
        e.edges
      );
      return e.edges = e.edges.map((A, B) => B === _ ? O : A), Ts(e.connectionLookup, n.value, [O]), O;
    }
    return !1;
  }, V = (f, p, g = { replace: !1 }) => {
    const y = c(f);
    if (!y)
      return;
    const _ = typeof p == "function" ? p(y) : p;
    y.data = g.replace ? _ : { ...y.data, ..._ };
  }, q = (f) => Ti(f, e.nodes), Z = (f) => {
    const p = Ti(f, e.edges);
    return Ts(e.connectionLookup, n.value, p), p;
  }, ee = (f, p, g = { replace: !1 }) => {
    const y = u(f);
    if (!y)
      return;
    const _ = typeof p == "function" ? p(y) : p;
    g.replace ? e.nodes.splice(e.nodes.indexOf(y), 1, _) : Object.assign(y, _);
  }, re = (f, p, g = { replace: !1 }) => {
    const y = u(f);
    if (!y)
      return;
    const _ = typeof p == "function" ? p(y) : p;
    y.data = g.replace ? _ : { ...y.data, ..._ };
  }, ce = (f, p, g = !1) => {
    g ? e.connectionClickStartHandle = f : e.connectionStartHandle = f, e.connectionEndHandle = null, e.connectionStatus = null, p && (e.connectionPosition = p);
  }, ge = (f, p = null, g = null) => {
    e.connectionStartHandle && (e.connectionPosition = f, e.connectionEndHandle = p, e.connectionStatus = g);
  }, ie = (f, p) => {
    e.connectionPosition = { x: Number.NaN, y: Number.NaN }, e.connectionEndHandle = null, e.connectionStatus = null, p ? e.connectionClickStartHandle = null : e.connectionStartHandle = null;
  }, ne = (f) => {
    const p = gm(f), g = p ? null : lo(f) ? f : u(f.id);
    return !p && !g ? [null, null, p] : [p ? f : Mi(g), g, p];
  }, ae = (f, p = !0, g = e.nodes) => {
    const [y, _, D] = ne(f);
    if (!y)
      return [];
    const O = [];
    for (const A of g || e.nodes) {
      if (!D && (A.id === _.id || !A.computedPosition))
        continue;
      const B = Mi(A), R = Ii(B, y);
      (p && R > 0 || R >= B.width * B.height || R >= Number(y.width) * Number(y.height)) && O.push(A);
    }
    return O;
  }, me = (f, p, g = !0) => {
    const [y] = ne(f);
    if (!y)
      return !1;
    const _ = Ii(y, p);
    return g && _ > 0 || _ >= Number(y.width) * Number(y.height);
  }, Ee = (f) => {
    const { viewport: p, dimensions: g, d3Zoom: y, d3Selection: _, translateExtent: D } = e;
    if (!y || !_ || !f.x && !f.y)
      return !1;
    const O = jn.translate(p.x + f.x, p.y + f.y).scale(p.zoom), A = [
      [0, 0],
      [g.width, g.height]
    ], B = y.constrain()(O, A, D), R = e.viewport.x !== B.x || e.viewport.y !== B.y || e.viewport.zoom !== B.k;
    return y.transform(_, B), R;
  }, de = (f) => {
    const p = f instanceof Function ? f(e) : f, g = [
      "d3Zoom",
      "d3Selection",
      "d3ZoomHandler",
      "viewportRef",
      "vueFlowRef",
      "dimensions",
      "hooks"
    ];
    Fe(p.defaultEdgeOptions) && (e.defaultEdgeOptions = p.defaultEdgeOptions);
    const y = p.modelValue || p.nodes || p.edges ? [] : void 0;
    y && (p.modelValue && y.push(...p.modelValue), p.nodes && y.push(...p.nodes), p.edges && y.push(...p.edges), P(y));
    const _ = () => {
      Fe(p.maxZoom) && H(p.maxZoom), Fe(p.minZoom) && C(p.minZoom), Fe(p.translateExtent) && j(p.translateExtent);
    };
    for (const D of Object.keys(p)) {
      const O = D, A = p[O];
      ![...sy, ...g].includes(O) && Fe(A) && (e[O] = A);
    }
    Ys(() => e.d3Zoom).not.toBeNull().then(_), e.initialized || (e.initialized = !0);
  };
  return {
    updateNodePositions: d,
    updateNodeDimensions: h,
    setElements: P,
    setNodes: X,
    setEdges: Y,
    addNodes: oe,
    addEdges: $,
    removeNodes: z,
    removeEdges: I,
    findNode: u,
    findEdge: c,
    updateEdge: k,
    updateEdgeData: V,
    updateNode: ee,
    updateNodeData: re,
    applyEdgeChanges: Z,
    applyNodeChanges: q,
    addSelectedElements: M,
    addSelectedNodes: N,
    addSelectedEdges: x,
    setMinZoom: C,
    setMaxZoom: H,
    setTranslateExtent: j,
    setNodeExtent: K,
    setPaneClickDistance: F,
    removeSelectedElements: S,
    removeSelectedNodes: E,
    removeSelectedEdges: T,
    startConnection: ce,
    updateConnection: ge,
    endConnection: ie,
    setInteractive: G,
    setState: de,
    getIntersectingNodes: ae,
    getIncomers: s,
    getOutgoers: r,
    getConnectedEdges: l,
    getHandleConnections: a,
    isNodeIntersecting: me,
    panBy: Ee,
    fitView: (f) => o.value.fitView(f),
    zoomIn: (f) => o.value.zoomIn(f),
    zoomOut: (f) => o.value.zoomOut(f),
    zoomTo: (f, p) => o.value.zoomTo(f, p),
    setViewport: (f, p) => o.value.setViewport(f, p),
    setTransform: (f, p) => o.value.setTransform(f, p),
    getViewport: () => o.value.getViewport(),
    getTransform: () => o.value.getTransform(),
    setCenter: (f, p, g) => o.value.setCenter(f, p, g),
    fitBounds: (f, p) => o.value.fitBounds(f, p),
    project: (f) => o.value.project(f),
    screenToFlowCoordinate: (f) => o.value.screenToFlowCoordinate(f),
    flowToScreenCoordinate: (f) => o.value.flowToScreenCoordinate(f),
    toObject: () => {
      const f = [], p = [];
      for (const g of e.nodes) {
        const {
          computedPosition: y,
          handleBounds: _,
          selected: D,
          dimensions: O,
          isParent: A,
          resizing: B,
          dragging: R,
          events: W,
          ...J
        } = g;
        f.push(J);
      }
      for (const g of e.edges) {
        const { selected: y, sourceNode: _, targetNode: D, events: O, ...A } = g;
        p.push(A);
      }
      return JSON.parse(
        JSON.stringify({
          nodes: f,
          edges: p,
          position: [e.viewport.x, e.viewport.y],
          zoom: e.viewport.zoom,
          viewport: e.viewport
        })
      );
    },
    fromObject: (f) => new Promise((p) => {
      const { nodes: g, edges: y, position: _, zoom: D, viewport: O } = f;
      g && X(g), y && Y(y);
      const [A, B] = O != null && O.x && (O != null && O.y) ? [O.x, O.y] : _ ?? [null, null];
      if (A && B) {
        const R = (O == null ? void 0 : O.zoom) || D || e.viewport.zoom;
        return Ys(() => o.value.viewportInitialized).toBe(!0).then(() => {
          o.value.setViewport({
            x: A,
            y: B,
            zoom: R
          }).then(() => {
            p(!0);
          });
        });
      } else
        p(!0);
    }),
    updateNodeInternals: i,
    viewportHelper: o,
    $reset: () => {
      const f = Ec();
      if (e.edges = [], e.nodes = [], e.d3Zoom && e.d3Selection) {
        const p = jn.translate(f.defaultViewport.x ?? 0, f.defaultViewport.y ?? 0).scale(Cn(f.defaultViewport.zoom ?? 1, f.minZoom, f.maxZoom)), g = e.viewportRef.getBoundingClientRect(), y = [
          [0, 0],
          [g.width, g.height]
        ], _ = e.d3Zoom.constrain()(p, y, f.translateExtent);
        e.d3Zoom.transform(e.d3Selection, _);
      }
      de(f);
    },
    $destroy: () => {
    }
  };
}
const ly = ["data-id", "data-handleid", "data-nodeid", "data-handlepos"], ay = {
  name: "Handle",
  compatConfig: { MODE: 3 }
}, xn = /* @__PURE__ */ ze({
  ...ay,
  props: {
    id: { default: null },
    type: {},
    position: { default: () => le.Top },
    isValidConnection: { type: Function },
    connectable: { type: [Boolean, Number, String, Function], default: void 0 },
    connectableStart: { type: Boolean, default: !0 },
    connectableEnd: { type: Boolean, default: !0 }
  },
  setup(e, { expose: t }) {
    const n = jd(e, ["position", "connectable", "connectableStart", "connectableEnd", "id"]), o = /* @__PURE__ */ Oe(() => n.type ?? "source"), i = /* @__PURE__ */ Oe(() => n.isValidConnection ?? null), {
      id: s,
      connectionStartHandle: r,
      connectionClickStartHandle: l,
      connectionEndHandle: a,
      vueFlowRef: u,
      nodesConnectable: c,
      noDragClassName: d,
      noPanClassName: h
    } = Re(), { id: v, node: N, nodeEl: x, connectedEdges: M } = xc(), E = /* @__PURE__ */ De(), T = /* @__PURE__ */ Oe(() => typeof e.connectableStart < "u" ? e.connectableStart : !0), S = /* @__PURE__ */ Oe(() => typeof e.connectableEnd < "u" ? e.connectableEnd : !0), C = /* @__PURE__ */ Oe(
      () => {
        var Y, P, oe, $, z, I;
        return ((Y = r.value) == null ? void 0 : Y.nodeId) === v && ((P = r.value) == null ? void 0 : P.id) === e.id && ((oe = r.value) == null ? void 0 : oe.type) === o.value || (($ = a.value) == null ? void 0 : $.nodeId) === v && ((z = a.value) == null ? void 0 : z.id) === e.id && ((I = a.value) == null ? void 0 : I.type) === o.value;
      }
    ), H = /* @__PURE__ */ Oe(
      () => {
        var Y, P, oe;
        return ((Y = l.value) == null ? void 0 : Y.nodeId) === v && ((P = l.value) == null ? void 0 : P.id) === e.id && ((oe = l.value) == null ? void 0 : oe.type) === o.value;
      }
    ), { handlePointerDown: j, handleClick: K } = wc({
      nodeId: v,
      handleId: e.id,
      isValidConnection: i,
      type: o
    }), F = se(() => typeof e.connectable == "string" && e.connectable === "single" ? !M.value.some((Y) => {
      const P = Y[`${o.value}Handle`];
      return Y[o.value] !== v ? !1 : P ? P === e.id : !0;
    }) : typeof e.connectable == "number" ? M.value.filter((Y) => {
      const P = Y[`${o.value}Handle`];
      return Y[o.value] !== v ? !1 : P ? P === e.id : !0;
    }).length < e.connectable : typeof e.connectable == "function" ? e.connectable(N, M.value) : Fe(e.connectable) ? e.connectable : c.value);
    kt(() => {
      var Y;
      if (!N.dimensions.width || !N.dimensions.height)
        return;
      const P = (Y = N.handleBounds[o.value]) == null ? void 0 : Y.find((q) => q.id === e.id);
      if (!u.value || P)
        return;
      const oe = u.value.querySelector(".vue-flow__transformationpane");
      if (!x.value || !E.value || !oe || !e.id)
        return;
      const $ = x.value.getBoundingClientRect(), z = E.value.getBoundingClientRect(), I = window.getComputedStyle(oe), { m22: k } = new window.DOMMatrixReadOnly(I.transform), V = {
        id: e.id,
        position: e.position,
        x: (z.left - $.left) / k,
        y: (z.top - $.top) / k,
        type: o.value,
        nodeId: v,
        ...is(E.value)
      };
      N.handleBounds[o.value] = [...N.handleBounds[o.value] ?? [], V];
    });
    function G(Y) {
      const P = Pr(Y);
      F.value && T.value && (P && Y.button === 0 || !P) && j(Y);
    }
    function X(Y) {
      !v || !l.value && !T.value || F.value && K(Y);
    }
    return t({
      handleClick: K,
      handlePointerDown: j,
      onClick: X,
      onPointerDown: G
    }), (Y, P) => (U(), te("div", {
      ref_key: "handle",
      ref: E,
      "data-id": `${L(s)}-${L(v)}-${e.id}-${o.value}`,
      "data-handleid": e.id,
      "data-nodeid": L(v),
      "data-handlepos": Y.position,
      class: Kt(["vue-flow__handle", [
        `vue-flow__handle-${Y.position}`,
        `vue-flow__handle-${e.id}`,
        L(d),
        L(h),
        o.value,
        {
          connectable: F.value,
          connecting: H.value,
          connectablestart: T.value,
          connectableend: S.value,
          connectionindicator: F.value && (T.value && !C.value || S.value && C.value)
        }
      ]]),
      onMousedown: G,
      onTouchstartPassive: G,
      onClick: X
    }, [
      At(Y.$slots, "default", { id: Y.id })
    ], 42, ly));
  }
}), ls = function({
  sourcePosition: e = le.Bottom,
  targetPosition: t = le.Top,
  label: n,
  connectable: o = !0,
  isValidTargetPos: i,
  isValidSourcePos: s,
  data: r
}) {
  const l = r.label ?? n;
  return [
    $e(xn, { type: "target", position: t, connectable: o, isValidConnection: i }),
    typeof l != "string" && l ? $e(l) : $e(Ne, [l]),
    $e(xn, { type: "source", position: e, connectable: o, isValidConnection: s })
  ];
};
ls.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable", "data"];
ls.inheritAttrs = !1;
ls.compatConfig = { MODE: 3 };
const uy = ls, as = function({
  targetPosition: e = le.Top,
  label: t,
  connectable: n = !0,
  isValidTargetPos: o,
  data: i
}) {
  const s = i.label ?? t;
  return [
    $e(xn, { type: "target", position: e, connectable: n, isValidConnection: o }),
    typeof s != "string" && s ? $e(s) : $e(Ne, [s])
  ];
};
as.props = ["targetPosition", "label", "isValidTargetPos", "connectable", "data"];
as.inheritAttrs = !1;
as.compatConfig = { MODE: 3 };
const cy = as, us = function({
  sourcePosition: e = le.Bottom,
  label: t,
  connectable: n = !0,
  isValidSourcePos: o,
  data: i
}) {
  const s = i.label ?? t;
  return [
    typeof s != "string" && s ? $e(s) : $e(Ne, [s]),
    $e(xn, { type: "source", position: e, connectable: n, isValidConnection: o })
  ];
};
us.props = ["sourcePosition", "label", "isValidSourcePos", "connectable", "data"];
us.inheritAttrs = !1;
us.compatConfig = { MODE: 3 };
const dy = us, fy = ["transform"], py = ["width", "height", "x", "y", "rx", "ry"], hy = ["y"], gy = {
  name: "EdgeText",
  compatConfig: { MODE: 3 }
}, vy = /* @__PURE__ */ ze({
  ...gy,
  props: {
    x: {},
    y: {},
    label: {},
    labelStyle: { default: () => ({}) },
    labelShowBg: { type: Boolean, default: !0 },
    labelBgStyle: { default: () => ({}) },
    labelBgPadding: { default: () => [2, 4] },
    labelBgBorderRadius: { default: 2 }
  },
  setup(e) {
    const t = /* @__PURE__ */ De({ x: 0, y: 0, width: 0, height: 0 }), n = /* @__PURE__ */ De(null), o = se(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
    kt(i), be([() => e.x, () => e.y, n, () => e.label], i);
    function i() {
      if (!n.value)
        return;
      const s = n.value.getBBox();
      (s.width !== t.value.width || s.height !== t.value.height) && (t.value = s);
    }
    return (s, r) => (U(), te("g", {
      transform: o.value,
      class: "vue-flow__edge-textwrapper"
    }, [
      s.labelShowBg ? (U(), te("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${t.value.width + 2 * s.labelBgPadding[0]}px`,
        height: `${t.value.height + 2 * s.labelBgPadding[1]}px`,
        x: -s.labelBgPadding[0],
        y: -s.labelBgPadding[1],
        style: at(s.labelBgStyle),
        rx: s.labelBgBorderRadius,
        ry: s.labelBgBorderRadius
      }, null, 12, py)) : Le("", !0),
      b("text", _r(s.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: t.value.height / 2,
        dy: "0.3em",
        style: s.labelStyle
      }), [
        At(s.$slots, "default", {}, () => [
          typeof s.label != "string" ? (U(), Be(gr(s.label), { key: 0 })) : (U(), te(Ne, { key: 1 }, [
            kn(he(s.label), 1)
          ], 64))
        ])
      ], 16, hy)
    ], 8, fy));
  }
}), my = ["id", "d", "marker-end", "marker-start"], yy = ["d", "stroke-width"], _y = {
  name: "BaseEdge",
  inheritAttrs: !1,
  compatConfig: { MODE: 3 }
}, cs = /* @__PURE__ */ ze({
  ..._y,
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
    const n = /* @__PURE__ */ De(null), o = /* @__PURE__ */ De(null), i = /* @__PURE__ */ De(null), s = Xd();
    return t({
      pathEl: n,
      interactionEl: o,
      labelEl: i
    }), (r, l) => (U(), te(Ne, null, [
      b("path", _r(L(s), {
        id: r.id,
        ref_key: "pathEl",
        ref: n,
        d: r.path,
        class: "vue-flow__edge-path",
        "marker-end": r.markerEnd,
        "marker-start": r.markerStart
      }), null, 16, my),
      r.interactionWidth ? (U(), te("path", {
        key: 0,
        ref_key: "interactionEl",
        ref: o,
        fill: "none",
        d: r.path,
        "stroke-width": r.interactionWidth,
        "stroke-opacity": 0,
        class: "vue-flow__edge-interaction"
      }, null, 8, yy)) : Le("", !0),
      r.label && r.labelX && r.labelY ? (U(), Be(vy, {
        key: 1,
        ref_key: "labelEl",
        ref: i,
        x: r.labelX,
        y: r.labelY,
        label: r.label,
        "label-show-bg": r.labelShowBg,
        "label-bg-style": r.labelBgStyle,
        "label-bg-padding": r.labelBgPadding,
        "label-bg-border-radius": r.labelBgBorderRadius,
        "label-style": r.labelStyle
      }, null, 8, ["x", "y", "label", "label-show-bg", "label-bg-style", "label-bg-padding", "label-bg-border-radius", "label-style"])) : Le("", !0)
    ], 64));
  }
});
function Nc({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const i = Math.abs(n - e) / 2, s = n < e ? n + i : n - i, r = Math.abs(o - t) / 2, l = o < t ? o + r : o - r;
  return [s, l, i, r];
}
function Cc({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: i,
  sourceControlY: s,
  targetControlX: r,
  targetControlY: l
}) {
  const a = e * 0.125 + i * 0.375 + r * 0.375 + n * 0.125, u = t * 0.125 + s * 0.375 + l * 0.375 + o * 0.125, c = Math.abs(a - e), d = Math.abs(u - t);
  return [a, u, c, d];
}
function ti(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function ta({ pos: e, x1: t, y1: n, x2: o, y2: i, c: s }) {
  let r, l;
  switch (e) {
    case le.Left:
      r = t - ti(t - o, s), l = n;
      break;
    case le.Right:
      r = t + ti(o - t, s), l = n;
      break;
    case le.Top:
      r = t, l = n - ti(n - i, s);
      break;
    case le.Bottom:
      r = t, l = n + ti(i - n, s);
      break;
  }
  return [r, l];
}
function $c(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = le.Bottom,
    targetX: i,
    targetY: s,
    targetPosition: r = le.Top,
    curvature: l = 0.25
  } = e, [a, u] = ta({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: s,
    c: l
  }), [c, d] = ta({
    pos: r,
    x1: i,
    y1: s,
    x2: t,
    y2: n,
    c: l
  }), [h, v, N, x] = Cc({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: s,
    sourceControlX: a,
    sourceControlY: u,
    targetControlX: c,
    targetControlY: d
  });
  return [
    `M${t},${n} C${a},${u} ${c},${d} ${i},${s}`,
    h,
    v,
    N,
    x
  ];
}
function na({ pos: e, x1: t, y1: n, x2: o, y2: i }) {
  let s, r;
  switch (e) {
    case le.Left:
    case le.Right:
      s = 0.5 * (t + o), r = n;
      break;
    case le.Top:
    case le.Bottom:
      s = t, r = 0.5 * (n + i);
      break;
  }
  return [s, r];
}
function Mc(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = le.Bottom,
    targetX: i,
    targetY: s,
    targetPosition: r = le.Top
  } = e, [l, a] = na({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: s
  }), [u, c] = na({
    pos: r,
    x1: i,
    y1: s,
    x2: t,
    y2: n
  }), [d, h, v, N] = Cc({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: s,
    sourceControlX: l,
    sourceControlY: a,
    targetControlX: u,
    targetControlY: c
  });
  return [
    `M${t},${n} C${l},${a} ${u},${c} ${i},${s}`,
    d,
    h,
    v,
    N
  ];
}
const oa = {
  [le.Left]: { x: -1, y: 0 },
  [le.Right]: { x: 1, y: 0 },
  [le.Top]: { x: 0, y: -1 },
  [le.Bottom]: { x: 0, y: 1 }
};
function by({
  source: e,
  sourcePosition: t = le.Bottom,
  target: n
}) {
  return t === le.Left || t === le.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}
function ia(e, t) {
  return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function wy({
  source: e,
  sourcePosition: t = le.Bottom,
  target: n,
  targetPosition: o = le.Top,
  center: i,
  offset: s
}) {
  const r = oa[t], l = oa[o], a = { x: e.x + r.x * s, y: e.y + r.y * s }, u = { x: n.x + l.x * s, y: n.y + l.y * s }, c = by({
    source: a,
    sourcePosition: t,
    target: u
  }), d = c.x !== 0 ? "x" : "y", h = c[d];
  let v, N, x;
  const M = { x: 0, y: 0 }, E = { x: 0, y: 0 }, [T, S, C, H] = Nc({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (r[d] * l[d] === -1) {
    N = i.x ?? T, x = i.y ?? S;
    const K = [
      { x: N, y: a.y },
      { x: N, y: u.y }
    ], F = [
      { x: a.x, y: x },
      { x: u.x, y: x }
    ];
    r[d] === h ? v = d === "x" ? K : F : v = d === "x" ? F : K;
  } else {
    const K = [{ x: a.x, y: u.y }], F = [{ x: u.x, y: a.y }];
    if (d === "x" ? v = r.x === h ? F : K : v = r.y === h ? K : F, t === o) {
      const oe = Math.abs(e[d] - n[d]);
      if (oe <= s) {
        const $ = Math.min(s - 1, s - oe);
        r[d] === h ? M[d] = (a[d] > e[d] ? -1 : 1) * $ : E[d] = (u[d] > n[d] ? -1 : 1) * $;
      }
    }
    if (t !== o) {
      const oe = d === "x" ? "y" : "x", $ = r[d] === l[oe], z = a[oe] > u[oe], I = a[oe] < u[oe];
      (r[d] === 1 && (!$ && z || $ && I) || r[d] !== 1 && (!$ && I || $ && z)) && (v = d === "x" ? K : F);
    }
    const G = { x: a.x + M.x, y: a.y + M.y }, X = { x: u.x + E.x, y: u.y + E.y }, Y = Math.max(Math.abs(G.x - v[0].x), Math.abs(X.x - v[0].x)), P = Math.max(Math.abs(G.y - v[0].y), Math.abs(X.y - v[0].y));
    Y >= P ? (N = (G.x + X.x) / 2, x = v[0].y) : (N = v[0].x, x = (G.y + X.y) / 2);
  }
  return [[
    e,
    { x: a.x + M.x, y: a.y + M.y },
    ...v,
    { x: u.x + E.x, y: u.y + E.y },
    n
  ], N, x, C, H];
}
function xy(e, t, n, o) {
  const i = Math.min(ia(e, t) / 2, ia(t, n) / 2, o), { x: s, y: r } = t;
  if (e.x === s && s === n.x || e.y === r && r === n.y)
    return `L${s} ${r}`;
  if (e.y === r) {
    const u = e.x < n.x ? -1 : 1, c = e.y < n.y ? 1 : -1;
    return `L ${s + i * u},${r}Q ${s},${r} ${s},${r + i * c}`;
  }
  const l = e.x < n.x ? 1 : -1, a = e.y < n.y ? -1 : 1;
  return `L ${s},${r + i * a}Q ${s},${r} ${s + i * l},${r}`;
}
function ir(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = le.Bottom,
    targetX: i,
    targetY: s,
    targetPosition: r = le.Top,
    borderRadius: l = 5,
    centerX: a,
    centerY: u,
    offset: c = 20
  } = e, [d, h, v, N, x] = wy({
    source: { x: t, y: n },
    sourcePosition: o,
    target: { x: i, y: s },
    targetPosition: r,
    center: { x: a, y: u },
    offset: c
  });
  return [d.reduce((E, T, S) => {
    let C;
    return S > 0 && S < d.length - 1 ? C = xy(d[S - 1], T, d[S + 1], l) : C = `${S === 0 ? "M" : "L"}${T.x} ${T.y}`, E += C, E;
  }, ""), h, v, N, x];
}
function Sy(e) {
  const { sourceX: t, sourceY: n, targetX: o, targetY: i } = e, [s, r, l, a] = Nc({
    sourceX: t,
    sourceY: n,
    targetX: o,
    targetY: i
  });
  return [`M ${t},${n}L ${o},${i}`, s, r, l, a];
}
const Ey = /* @__PURE__ */ ze({
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
      const [n, o, i] = Sy(e);
      return $e(cs, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Ny = Ey, Cy = /* @__PURE__ */ ze({
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
      const [n, o, i] = ir({
        ...e,
        sourcePosition: e.sourcePosition ?? le.Bottom,
        targetPosition: e.targetPosition ?? le.Top
      });
      return $e(cs, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Ic = Cy, $y = /* @__PURE__ */ ze({
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
    return () => $e(Ic, { ...e, ...t, borderRadius: 0 });
  }
}), My = $y, Iy = /* @__PURE__ */ ze({
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
      const [n, o, i] = $c({
        ...e,
        sourcePosition: e.sourcePosition ?? le.Bottom,
        targetPosition: e.targetPosition ?? le.Top
      });
      return $e(cs, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Ty = Iy, Py = /* @__PURE__ */ ze({
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
      const [n, o, i] = Mc({
        ...e,
        sourcePosition: e.sourcePosition ?? le.Bottom,
        targetPosition: e.targetPosition ?? le.Top
      });
      return $e(cs, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Ay = Py, Oy = {
  input: dy,
  default: uy,
  output: cy
}, Dy = {
  default: Ty,
  straight: Ny,
  step: My,
  smoothstep: Ic,
  simplebezier: Ay
};
function ky(e, t, n) {
  const o = se(() => (x) => t.value.get(x)), i = se(() => (x) => n.value.get(x)), s = se(() => {
    const x = {
      ...Dy,
      ...e.edgeTypes
    }, M = Object.keys(x);
    for (const E of e.edges)
      E.type && !M.includes(E.type) && (x[E.type] = E.type);
    return x;
  }), r = se(() => {
    const x = {
      ...Oy,
      ...e.nodeTypes
    }, M = Object.keys(x);
    for (const E of e.nodes)
      E.type && !M.includes(E.type) && (x[E.type] = E.type);
    return x;
  }), l = se(() => e.onlyRenderVisibleElements ? cc(
    e.nodes,
    {
      x: 0,
      y: 0,
      width: e.dimensions.width,
      height: e.dimensions.height
    },
    e.viewport,
    !0
  ) : e.nodes), a = se(() => {
    if (e.onlyRenderVisibleElements) {
      const x = [];
      for (const M of e.edges) {
        const E = t.value.get(M.source), T = t.value.get(M.target);
        Pm({
          sourcePos: E.computedPosition || { x: 0, y: 0 },
          targetPos: T.computedPosition || { x: 0, y: 0 },
          sourceWidth: E.dimensions.width,
          sourceHeight: E.dimensions.height,
          targetWidth: T.dimensions.width,
          targetHeight: T.dimensions.height,
          width: e.dimensions.width,
          height: e.dimensions.height,
          viewport: e.viewport
        }) && x.push(M);
      }
      return x;
    }
    return e.edges;
  }), u = se(() => [...l.value, ...a.value]), c = se(() => {
    const x = [];
    for (const M of e.nodes)
      M.selected && x.push(M);
    return x;
  }), d = se(() => {
    const x = [];
    for (const M of e.edges)
      M.selected && x.push(M);
    return x;
  }), h = se(() => [
    ...c.value,
    ...d.value
  ]), v = se(() => {
    const x = [];
    for (const M of e.nodes)
      M.dimensions.width && M.dimensions.height && M.handleBounds !== void 0 && x.push(M);
    return x;
  }), N = se(
    () => l.value.length > 0 && v.value.length === l.value.length
  );
  return {
    getNode: o,
    getEdge: i,
    getElements: u,
    getEdgeTypes: s,
    getNodeTypes: r,
    getEdges: a,
    getNodes: l,
    getSelectedElements: h,
    getSelectedNodes: c,
    getSelectedEdges: d,
    getNodesInitialized: v,
    areNodesInitialized: N
  };
}
class vn {
  constructor() {
    this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    var t;
    const n = (t = tn()) == null ? void 0 : t.appContext.app, o = (n == null ? void 0 : n.config.globalProperties.$vueFlowStorage) ?? vn.instance;
    return vn.instance = o ?? new vn(), n && (n.config.globalProperties.$vueFlowStorage = vn.instance), vn.instance;
  }
  set(t, n) {
    return this.flows.set(t, n);
  }
  get(t) {
    return this.flows.get(t);
  }
  remove(t) {
    return this.flows.delete(t);
  }
  create(t, n) {
    const o = Ec(), i = /* @__PURE__ */ Bo(o), s = {};
    for (const [h, v] of Object.entries(i.hooks)) {
      const N = `on${h.charAt(0).toUpperCase() + h.slice(1)}`;
      s[N] = v.on;
    }
    const r = {};
    for (const [h, v] of Object.entries(i.hooks))
      r[h] = v.trigger;
    const l = se(() => {
      const h = /* @__PURE__ */ new Map();
      for (const v of i.nodes)
        h.set(v.id, v);
      return h;
    }), a = se(() => {
      const h = /* @__PURE__ */ new Map();
      for (const v of i.edges)
        h.set(v.id, v);
      return h;
    }), u = ky(i, l, a), c = ry(i, l, a);
    c.setState({ ...i, ...n });
    const d = {
      ...s,
      ...u,
      ...c,
      ...Ep(i),
      nodeLookup: l,
      edgeLookup: a,
      emits: r,
      id: t,
      vueFlowVersion: "1.48.2",
      $destroy: () => {
        this.remove(t);
      }
    };
    return this.set(t, d), d;
  }
  getId() {
    return `vue-flow-${this.currentId++}`;
  }
}
function Re(e) {
  const t = vn.getInstance(), n = Li(), o = typeof e == "object", i = o ? e : { id: e }, s = i.id, r = s ?? (n == null ? void 0 : n.vueFlowId);
  let l;
  if (n) {
    const a = mt(ea, null);
    typeof a < "u" && a !== null && (!r || a.id === r) && (l = a);
  }
  if (l || r && (l = t.get(r)), !l || r && l.id !== r) {
    const a = s ?? t.getId(), u = t.create(a, i);
    l = u, (n ?? Fi(!0)).run(() => {
      be(
        u.applyDefault,
        (d, h, v) => {
          const N = (M) => {
            u.applyNodeChanges(M);
          }, x = (M) => {
            u.applyEdgeChanges(M);
          };
          d ? (u.onNodesChange(N), u.onEdgesChange(x)) : (u.hooks.value.nodesChange.off(N), u.hooks.value.edgesChange.off(x)), v(() => {
            u.hooks.value.nodesChange.off(N), u.hooks.value.edgesChange.off(x);
          });
        },
        { immediate: !0 }
      ), Mo(() => {
        if (l) {
          const d = t.get(l.id);
          d ? d.$destroy() : Zn(`No store instance found for id ${l.id} in storage.`);
        }
      });
    });
  } else
    o && l.setState(i);
  if (n && (Sn(ea, l), n.vueFlowId = l.id), o) {
    const a = tn();
    (a == null ? void 0 : a.type.name) !== "VueFlow" && l.emits.error(new Ye(Ue.USEVUEFLOW_OPTIONS));
  }
  return l;
}
function Ry(e) {
  const { emits: t, dimensions: n } = Re();
  let o;
  kt(() => {
    const i = () => {
      var s, r;
      if (!e.value || !(((r = (s = e.value).checkVisibility) == null ? void 0 : r.call(s)) ?? !0))
        return;
      const l = is(e.value);
      (l.width === 0 || l.height === 0) && t.error(new Ye(Ue.MISSING_VIEWPORT_DIMENSIONS)), n.value = { width: l.width || 500, height: l.height || 500 };
    };
    i(), window.addEventListener("resize", i), e.value && (o = new ResizeObserver(() => i()), o.observe(e.value)), Xi(() => {
      window.removeEventListener("resize", i), o && e.value && o.unobserve(e.value);
    });
  });
}
const Vy = {
  name: "UserSelection",
  compatConfig: { MODE: 3 }
}, By = /* @__PURE__ */ ze({
  ...Vy,
  props: {
    userSelectionRect: {}
  },
  setup(e) {
    return (t, n) => (U(), te("div", {
      class: "vue-flow__selection vue-flow__container",
      style: at({
        width: `${t.userSelectionRect.width}px`,
        height: `${t.userSelectionRect.height}px`,
        transform: `translate(${t.userSelectionRect.x}px, ${t.userSelectionRect.y}px)`
      })
    }, null, 4));
  }
}), zy = ["tabIndex"], Hy = {
  name: "NodesSelection",
  compatConfig: { MODE: 3 }
}, Fy = /* @__PURE__ */ ze({
  ...Hy,
  setup(e) {
    const { emits: t, viewport: n, getSelectedNodes: o, noPanClassName: i, disableKeyboardA11y: s, userSelectionActive: r } = Re(), l = Sc(), a = /* @__PURE__ */ De(null), u = bc({
      el: a,
      onStart(N) {
        t.selectionDragStart(N), t.nodeDragStart(N);
      },
      onDrag(N) {
        t.selectionDrag(N), t.nodeDrag(N);
      },
      onStop(N) {
        t.selectionDragStop(N), t.nodeDragStop(N);
      }
    });
    kt(() => {
      var N;
      s.value || (N = a.value) == null || N.focus({ preventScroll: !0 });
    });
    const c = se(() => uc(o.value)), d = se(() => ({
      width: `${c.value.width}px`,
      height: `${c.value.height}px`,
      top: `${c.value.y}px`,
      left: `${c.value.x}px`
    }));
    function h(N) {
      t.selectionContextMenu({ event: N, nodes: o.value });
    }
    function v(N) {
      s.value || Un[N.key] && (N.preventDefault(), l(
        {
          x: Un[N.key].x,
          y: Un[N.key].y
        },
        N.shiftKey
      ));
    }
    return (N, x) => !L(r) && c.value.width && c.value.height ? (U(), te("div", {
      key: 0,
      class: Kt(["vue-flow__nodesselection vue-flow__container", L(i)]),
      style: at({ transform: `translate(${L(n).x}px,${L(n).y}px) scale(${L(n).zoom})` })
    }, [
      b("div", {
        ref_key: "el",
        ref: a,
        class: Kt([{ dragging: L(u) }, "vue-flow__nodesselection-rect"]),
        style: at(d.value),
        tabIndex: L(s) ? void 0 : -1,
        onContextmenu: h,
        onKeydown: v
      }, null, 46, zy)
    ], 6)) : Le("", !0);
  }
});
function Ly(e, t) {
  return {
    x: e.clientX - t.left,
    y: e.clientY - t.top
  };
}
const Uy = {
  name: "Pane",
  compatConfig: { MODE: 3 }
}, Gy = /* @__PURE__ */ ze({
  ...Uy,
  props: {
    isSelecting: { type: Boolean },
    selectionKeyPressed: { type: Boolean }
  },
  setup(e) {
    const {
      vueFlowRef: t,
      nodes: n,
      viewport: o,
      emits: i,
      userSelectionActive: s,
      removeSelectedElements: r,
      userSelectionRect: l,
      elementsSelectable: a,
      nodesSelectionActive: u,
      getSelectedEdges: c,
      getSelectedNodes: d,
      removeNodes: h,
      removeEdges: v,
      selectionMode: N,
      deleteKeyCode: x,
      multiSelectionKeyCode: M,
      multiSelectionActive: E,
      edgeLookup: T,
      nodeLookup: S,
      connectionLookup: C,
      defaultEdgeOptions: H,
      connectionStartHandle: j,
      panOnDrag: K
    } = Re(), F = /* @__PURE__ */ an(null), G = /* @__PURE__ */ an(/* @__PURE__ */ new Set()), X = /* @__PURE__ */ an(/* @__PURE__ */ new Set()), Y = /* @__PURE__ */ an(null), P = /* @__PURE__ */ Oe(() => a.value && (e.isSelecting || s.value)), oe = /* @__PURE__ */ Oe(() => j.value !== null);
    let $ = !1, z = !1;
    const I = wo(x, { actInsideInputWithModifier: !1 }), k = wo(M);
    be(I, (ie) => {
      ie && (h(d.value), v(c.value), u.value = !1);
    }), be(k, (ie) => {
      E.value = ie;
    });
    function V(ie, ne) {
      return (ae) => {
        ae.target === ne && (ie == null || ie(ae));
      };
    }
    function q(ie) {
      if ($ || oe.value) {
        $ = !1;
        return;
      }
      i.paneClick(ie), r(), u.value = !1;
    }
    function Z(ie) {
      var ne;
      if (Array.isArray(K.value) && ((ne = K.value) != null && ne.includes(2))) {
        ie.preventDefault();
        return;
      }
      i.paneContextMenu(ie);
    }
    function ee(ie) {
      i.paneScroll(ie);
    }
    function re(ie) {
      var ne, ae, me;
      if (Y.value = ((ne = t.value) == null ? void 0 : ne.getBoundingClientRect()) ?? null, !a.value || !e.isSelecting || ie.button !== 0 || ie.target !== F.value || !Y.value)
        return;
      (me = (ae = ie.target) == null ? void 0 : ae.setPointerCapture) == null || me.call(ae, ie.pointerId);
      const { x: Ee, y: de } = Ly(ie, Y.value);
      z = !0, $ = !1, r(), l.value = {
        width: 0,
        height: 0,
        startX: Ee,
        startY: de,
        x: Ee,
        y: de
      }, i.selectionStart(ie);
    }
    function ce(ie) {
      var ne;
      if (!Y.value || !l.value)
        return;
      $ = !0;
      const { x: ae, y: me } = Tt(ie, Y.value), { startX: Ee = 0, startY: de = 0 } = l.value, xe = {
        startX: Ee,
        startY: de,
        x: ae < Ee ? ae : Ee,
        y: me < de ? me : de,
        width: Math.abs(ae - Ee),
        height: Math.abs(me - de)
      }, m = G.value, w = X.value;
      G.value = new Set(
        cc(n.value, xe, o.value, N.value === $r.Partial, !0).map(
          (p) => p.id
        )
      ), X.value = /* @__PURE__ */ new Set();
      const f = ((ne = H.value) == null ? void 0 : ne.selectable) ?? !0;
      for (const p of G.value) {
        const g = C.value.get(p);
        if (g)
          for (const { edgeId: y } of g.values()) {
            const _ = T.value.get(y);
            _ && (_.selectable ?? f) && X.value.add(y);
          }
      }
      if (!Ql(m, G.value)) {
        const p = ln(S.value, G.value, !0);
        i.nodesChange(p);
      }
      if (!Ql(w, X.value)) {
        const p = ln(T.value, X.value);
        i.edgesChange(p);
      }
      l.value = xe, s.value = !0, u.value = !1;
    }
    function ge(ie) {
      var ne;
      ie.button !== 0 || !z || ((ne = ie.target) == null || ne.releasePointerCapture(ie.pointerId), !s.value && l.value && ie.target === F.value && q(ie), s.value = !1, l.value = null, u.value = G.value.size > 0, i.selectionEnd(ie), e.selectionKeyPressed && ($ = !1), z = !1);
    }
    return (ie, ne) => (U(), te("div", {
      ref_key: "container",
      ref: F,
      class: Kt(["vue-flow__pane vue-flow__container", { selection: ie.isSelecting }]),
      onClick: ne[0] || (ne[0] = (ae) => P.value ? void 0 : V(q, F.value)(ae)),
      onContextmenu: ne[1] || (ne[1] = (ae) => V(Z, F.value)(ae)),
      onWheelPassive: ne[2] || (ne[2] = (ae) => V(ee, F.value)(ae)),
      onPointerenter: ne[3] || (ne[3] = (ae) => P.value ? void 0 : L(i).paneMouseEnter(ae)),
      onPointerdown: ne[4] || (ne[4] = (ae) => P.value ? re(ae) : L(i).paneMouseMove(ae)),
      onPointermove: ne[5] || (ne[5] = (ae) => P.value ? ce(ae) : L(i).paneMouseMove(ae)),
      onPointerup: ne[6] || (ne[6] = (ae) => P.value ? ge(ae) : void 0),
      onPointerleave: ne[7] || (ne[7] = (ae) => L(i).paneMouseLeave(ae))
    }, [
      At(ie.$slots, "default"),
      L(s) && L(l) ? (U(), Be(By, {
        key: 0,
        "user-selection-rect": L(l)
      }, null, 8, ["user-selection-rect"])) : Le("", !0),
      L(u) && L(d).length ? (U(), Be(Fy, { key: 1 })) : Le("", !0)
    ], 34));
  }
}), Yy = {
  name: "Transform",
  compatConfig: { MODE: 3 }
}, Wy = /* @__PURE__ */ ze({
  ...Yy,
  setup(e) {
    const { viewport: t, fitViewOnInit: n, fitViewOnInitDone: o } = Re(), i = se(() => n.value ? !o.value : !1), s = se(() => `translate(${t.value.x}px,${t.value.y}px) scale(${t.value.zoom})`);
    return (r, l) => (U(), te("div", {
      class: "vue-flow__transformationpane vue-flow__container",
      style: at({ transform: s.value, opacity: i.value ? 0 : void 0 })
    }, [
      At(r.$slots, "default")
    ], 4));
  }
}), Ky = {
  name: "Viewport",
  compatConfig: { MODE: 3 }
}, Xy = /* @__PURE__ */ ze({
  ...Ky,
  setup(e) {
    const {
      minZoom: t,
      maxZoom: n,
      defaultViewport: o,
      translateExtent: i,
      zoomActivationKeyCode: s,
      selectionKeyCode: r,
      panActivationKeyCode: l,
      panOnScroll: a,
      panOnScrollMode: u,
      panOnScrollSpeed: c,
      panOnDrag: d,
      zoomOnDoubleClick: h,
      zoomOnPinch: v,
      zoomOnScroll: N,
      preventScrolling: x,
      noWheelClassName: M,
      noPanClassName: E,
      emits: T,
      connectionStartHandle: S,
      userSelectionActive: C,
      paneDragging: H,
      d3Zoom: j,
      d3Selection: K,
      d3ZoomHandler: F,
      viewport: G,
      viewportRef: X,
      paneClickDistance: Y
    } = Re();
    Ry(X);
    const P = /* @__PURE__ */ an(!1), oe = /* @__PURE__ */ an(!1);
    let $ = null, z = !1, I = 0, k = {
      x: 0,
      y: 0,
      zoom: 0
    };
    const V = wo(l), q = wo(r), Z = wo(s), ee = /* @__PURE__ */ Oe(
      () => (!q.value || q.value && r.value === !0) && (V.value || d.value)
    ), re = /* @__PURE__ */ Oe(() => V.value || a.value), ce = /* @__PURE__ */ Oe(() => r.value === !0 && ee.value !== !0), ge = /* @__PURE__ */ Oe(
      () => q.value && r.value !== !0 || C.value || ce.value
    ), ie = /* @__PURE__ */ Oe(() => S.value !== null);
    kt(() => {
      if (!X.value) {
        Zn("Viewport element is missing");
        return;
      }
      const de = X.value, xe = de.getBoundingClientRect(), m = am().clickDistance(Y.value).scaleExtent([t.value, n.value]).translateExtent(i.value), w = pt(de).call(m), f = w.on("wheel.zoom"), p = jn.translate(o.value.x ?? 0, o.value.y ?? 0).scale(Cn(o.value.zoom ?? 1, t.value, n.value)), g = [
        [0, 0],
        [xe.width, xe.height]
      ], y = m.constrain()(p, g, i.value);
      m.transform(w, y), m.wheelDelta(Hl), j.value = m, K.value = w, F.value = f, G.value = { x: y.x, y: y.y, zoom: y.k }, m.on("start", (_) => {
        var D;
        if (!_.sourceEvent)
          return null;
        I = _.sourceEvent.button, P.value = !0;
        const O = me(_.transform);
        ((D = _.sourceEvent) == null ? void 0 : D.type) === "mousedown" && (H.value = !0), k = O, T.viewportChangeStart(O), T.moveStart({ event: _, flowTransform: O });
      }), m.on("end", (_) => {
        if (!_.sourceEvent)
          return null;
        if (P.value = !1, H.value = !1, ne(ee.value, I ?? 0) && !z && T.paneContextMenu(_.sourceEvent), z = !1, ae(k, _.transform)) {
          const D = me(_.transform);
          k = D, T.viewportChangeEnd(D), T.moveEnd({ event: _, flowTransform: D });
        }
      }), m.filter((_) => {
        var D;
        const O = Z.value || N.value, A = v.value && _.ctrlKey, B = _.button, R = _.type === "wheel";
        if (B === 1 && _.type === "mousedown" && (Ee(_, "vue-flow__node") || Ee(_, "vue-flow__edge")))
          return !0;
        if (!ee.value && !O && !re.value && !h.value && !v.value || C.value || ie.value && !R || !h.value && _.type === "dblclick" || Ee(_, M.value) && R || Ee(_, E.value) && (!R || re.value && R && !Z.value) || !v.value && _.ctrlKey && R || !O && !re.value && !A && R)
          return !1;
        if (!v && _.type === "touchstart" && ((D = _.touches) == null ? void 0 : D.length) > 1)
          return _.preventDefault(), !1;
        if (!ee.value && (_.type === "mousedown" || _.type === "touchstart") || ce.value && Array.isArray(d.value) && d.value.includes(0) && B === 0 || Array.isArray(d.value) && !d.value.includes(B) && (_.type === "mousedown" || _.type === "touchstart"))
          return !1;
        const W = Array.isArray(d.value) && d.value.includes(B) || r.value === !0 && Array.isArray(d.value) && !d.value.includes(0) || !B || B <= 1;
        return (!_.ctrlKey || V.value || R) && W;
      }), be(
        [C, ee],
        () => {
          C.value && !P.value ? m.on("zoom", null) : C.value || m.on("zoom", (_) => {
            G.value = { x: _.transform.x, y: _.transform.y, zoom: _.transform.k };
            const D = me(_.transform);
            z = ne(ee.value, I ?? 0), T.viewportChange(D), T.move({ event: _, flowTransform: D });
          });
        },
        { immediate: !0 }
      ), be(
        [C, re, u, Z, v, x, M],
        () => {
          re.value && !Z.value && !C.value ? w.on(
            "wheel.zoom",
            (_) => {
              if (Ee(_, M.value))
                return !1;
              const D = Z.value || N.value, O = v.value && _.ctrlKey;
              if (!(!x.value || re.value || D || O))
                return !1;
              _.preventDefault(), _.stopImmediatePropagation();
              const B = w.property("__zoom").k || 1, R = Pi();
              if (!V.value && _.ctrlKey && v.value && R) {
                const Ie = Ct(_), He = Hl(_), Ge = B * 2 ** He;
                m.scaleTo(w, Ge, Ie, _);
                return;
              }
              const W = _.deltaMode === 1 ? 20 : 1;
              let J = u.value === bo.Vertical ? 0 : _.deltaX * W, pe = u.value === bo.Horizontal ? 0 : _.deltaY * W;
              !R && _.shiftKey && u.value !== bo.Vertical && !J && pe && (J = pe, pe = 0), m.translateBy(
                w,
                -(J / B) * c.value,
                -(pe / B) * c.value
              );
              const ve = me(w.property("__zoom"));
              $ && clearTimeout($), oe.value ? (T.move({ event: _, flowTransform: ve }), T.viewportChange(ve), $ = setTimeout(() => {
                T.moveEnd({ event: _, flowTransform: ve }), T.viewportChangeEnd(ve), oe.value = !1;
              }, 150)) : (oe.value = !0, T.moveStart({ event: _, flowTransform: ve }), T.viewportChangeStart(ve));
            },
            { passive: !1 }
          ) : typeof f < "u" && w.on(
            "wheel.zoom",
            function(_, D) {
              const O = !x.value && _.type === "wheel" && !_.ctrlKey, A = Z.value || N.value, B = v.value && _.ctrlKey;
              if (!A && !a.value && !B && _.type === "wheel" || O || Ee(_, M.value))
                return null;
              _.preventDefault(), f.call(this, _, D);
            },
            { passive: !1 }
          );
        },
        { immediate: !0 }
      );
    });
    function ne(de, xe) {
      return xe === 2 && Array.isArray(de) && de.includes(2);
    }
    function ae(de, xe) {
      return de.x !== xe.x && !Number.isNaN(xe.x) || de.y !== xe.y && !Number.isNaN(xe.y) || de.zoom !== xe.k && !Number.isNaN(xe.k);
    }
    function me(de) {
      return {
        x: de.x,
        y: de.y,
        zoom: de.k
      };
    }
    function Ee(de, xe) {
      return de.target.closest(`.${xe}`);
    }
    return (de, xe) => (U(), te("div", {
      ref_key: "viewportRef",
      ref: X,
      class: "vue-flow__viewport vue-flow__container"
    }, [
      we(Gy, {
        "is-selecting": ge.value,
        "selection-key-pressed": L(q),
        class: Kt({
          connecting: ie.value,
          dragging: L(H),
          draggable: L(d) === !0 || Array.isArray(L(d)) && L(d).includes(0)
        })
      }, {
        default: No(() => [
          we(Wy, null, {
            default: No(() => [
              At(de.$slots, "default")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["is-selecting", "selection-key-pressed", "class"])
    ], 512));
  }
}), jy = ["id"], qy = ["id"], Zy = ["id"], Jy = {
  name: "A11yDescriptions",
  compatConfig: { MODE: 3 }
}, Qy = /* @__PURE__ */ ze({
  ...Jy,
  setup(e) {
    const { id: t, disableKeyboardA11y: n, ariaLiveMessage: o } = Re();
    return (i, s) => (U(), te(Ne, null, [
      b("div", {
        id: `${L(nc)}-${L(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select a node. " + he(L(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, jy),
      b("div", {
        id: `${L(oc)}-${L(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, qy),
      L(n) ? Le("", !0) : (U(), te("div", {
        key: 0,
        id: `${L(hm)}-${L(t)}`,
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: { position: "absolute", width: "1px", height: "1px", margin: "-1px", border: "0", padding: "0", overflow: "hidden", clip: "rect(0px, 0px, 0px, 0px)", "clip-path": "inset(100%)" }
      }, he(L(o)), 9, Zy))
    ], 64));
  }
});
function e0() {
  const e = Re();
  be(
    () => e.viewportHelper.value.viewportInitialized,
    (t) => {
      t && setTimeout(() => {
        e.emits.init(e), e.emits.paneReady(e);
      }, 1);
    }
  );
}
function t0(e, t, n) {
  return n === le.Left ? e - t : n === le.Right ? e + t : e;
}
function n0(e, t, n) {
  return n === le.Top ? e - t : n === le.Bottom ? e + t : e;
}
const Ar = function({
  radius: e = 10,
  centerX: t = 0,
  centerY: n = 0,
  position: o = le.Top,
  type: i
}) {
  return $e("circle", {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${i}`,
    cx: t0(t, e, o),
    cy: n0(n, e, o),
    r: e,
    stroke: "transparent",
    fill: "transparent"
  });
};
Ar.props = ["radius", "centerX", "centerY", "position", "type"];
Ar.compatConfig = { MODE: 3 };
const sa = Ar, o0 = /* @__PURE__ */ ze({
  name: "Edge",
  compatConfig: { MODE: 3 },
  props: ["id"],
  setup(e) {
    const {
      id: t,
      addSelectedEdges: n,
      connectionMode: o,
      edgeUpdaterRadius: i,
      emits: s,
      nodesSelectionActive: r,
      noPanClassName: l,
      getEdgeTypes: a,
      removeSelectedEdges: u,
      findEdge: c,
      findNode: d,
      isValidConnection: h,
      multiSelectionActive: v,
      disableKeyboardA11y: N,
      elementsSelectable: x,
      edgesUpdatable: M,
      edgesFocusable: E,
      hooks: T
    } = Re(), S = se(() => c(e.id)), { emit: C, on: H } = Km(S.value, s), j = mt(rs), K = tn(), F = /* @__PURE__ */ De(!1), G = /* @__PURE__ */ De(!1), X = /* @__PURE__ */ De(""), Y = /* @__PURE__ */ De(null), P = /* @__PURE__ */ De("source"), oe = /* @__PURE__ */ De(null), $ = /* @__PURE__ */ Oe(
      () => typeof S.value.selectable > "u" ? x.value : S.value.selectable
    ), z = /* @__PURE__ */ Oe(() => typeof S.value.updatable > "u" ? M.value : S.value.updatable), I = /* @__PURE__ */ Oe(() => typeof S.value.focusable > "u" ? E.value : S.value.focusable);
    Sn(Gm, e.id), Sn(Ym, oe);
    const k = se(() => S.value.class instanceof Function ? S.value.class(S.value) : S.value.class), V = se(() => S.value.style instanceof Function ? S.value.style(S.value) : S.value.style), q = se(() => {
      const p = S.value.type || "default", g = j == null ? void 0 : j[`edge-${p}`];
      if (g)
        return g;
      let y = S.value.template ?? a.value[p];
      if (typeof y == "string" && K) {
        const _ = Object.keys(K.appContext.components);
        _ && _.includes(p) && (y = Ka(p, !1));
      }
      return y && typeof y != "string" ? y : (s.error(new Ye(Ue.EDGE_TYPE_MISSING, y)), !1);
    }), { handlePointerDown: Z } = wc({
      nodeId: X,
      handleId: Y,
      type: P,
      isValidConnection: h,
      edgeUpdaterType: P,
      onEdgeUpdate: ce,
      onEdgeUpdateEnd: ge
    });
    return () => {
      const p = d(S.value.source), g = d(S.value.target), y = "pathOptions" in S.value ? S.value.pathOptions : {};
      if (!p && !g)
        return s.error(new Ye(Ue.EDGE_SOURCE_TARGET_MISSING, S.value.id, S.value.source, S.value.target)), null;
      if (!p)
        return s.error(new Ye(Ue.EDGE_SOURCE_MISSING, S.value.id, S.value.source)), null;
      if (!g)
        return s.error(new Ye(Ue.EDGE_TARGET_MISSING, S.value.id, S.value.target)), null;
      if (!S.value || S.value.hidden || p.hidden || g.hidden)
        return null;
      let _;
      o.value === un.Strict ? _ = p.handleBounds.source : _ = [...p.handleBounds.source || [], ...p.handleBounds.target || []];
      const D = Kl(_, S.value.sourceHandle);
      let O;
      o.value === un.Strict ? O = g.handleBounds.target : O = [...g.handleBounds.target || [], ...g.handleBounds.source || []];
      const A = Kl(O, S.value.targetHandle), B = (D == null ? void 0 : D.position) || le.Bottom, R = (A == null ? void 0 : A.position) || le.Top, { x: W, y: J } = qn(p, D, B), { x: pe, y: ve } = qn(g, A, R);
      return S.value.sourceX = W, S.value.sourceY = J, S.value.targetX = pe, S.value.targetY = ve, $e(
        "g",
        {
          ref: oe,
          key: e.id,
          "data-id": e.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${q.value === !1 ? "default" : S.value.type || "default"}`,
            l.value,
            k.value,
            {
              updating: F.value,
              selected: S.value.selected,
              animated: S.value.animated,
              inactive: !$.value && !T.value.edgeClick.hasListeners()
            }
          ],
          tabIndex: I.value ? 0 : void 0,
          "aria-label": S.value.ariaLabel === null ? void 0 : S.value.ariaLabel ?? `Edge from ${S.value.source} to ${S.value.target}`,
          "aria-describedby": I.value ? `${oc}-${t}` : void 0,
          "aria-roledescription": "edge",
          role: I.value ? "group" : "img",
          ...S.value.domAttributes,
          onClick: ne,
          onContextmenu: ae,
          onDblclick: me,
          onMouseenter: Ee,
          onMousemove: de,
          onMouseleave: xe,
          onKeyDown: I.value ? f : void 0
        },
        [
          G.value ? null : $e(q.value === !1 ? a.value.default : q.value, {
            id: e.id,
            sourceNode: p,
            targetNode: g,
            source: S.value.source,
            target: S.value.target,
            type: S.value.type,
            updatable: z.value,
            selected: S.value.selected,
            animated: S.value.animated,
            label: S.value.label,
            labelStyle: S.value.labelStyle,
            labelShowBg: S.value.labelShowBg,
            labelBgStyle: S.value.labelBgStyle,
            labelBgPadding: S.value.labelBgPadding,
            labelBgBorderRadius: S.value.labelBgBorderRadius,
            data: S.value.data,
            events: { ...S.value.events, ...H },
            style: V.value,
            markerStart: `url('#${ko(S.value.markerStart, t)}')`,
            markerEnd: `url('#${ko(S.value.markerEnd, t)}')`,
            sourcePosition: B,
            targetPosition: R,
            sourceX: W,
            sourceY: J,
            targetX: pe,
            targetY: ve,
            sourceHandleId: S.value.sourceHandle,
            targetHandleId: S.value.targetHandle,
            interactionWidth: S.value.interactionWidth,
            ...y
          }),
          [
            z.value === "source" || z.value === !0 ? [
              $e(
                "g",
                {
                  onMousedown: m,
                  onMouseenter: ee,
                  onMouseout: re
                },
                $e(sa, {
                  position: B,
                  centerX: W,
                  centerY: J,
                  radius: i.value,
                  type: "source",
                  "data-type": "source"
                })
              )
            ] : null,
            z.value === "target" || z.value === !0 ? [
              $e(
                "g",
                {
                  onMousedown: w,
                  onMouseenter: ee,
                  onMouseout: re
                },
                $e(sa, {
                  position: R,
                  centerX: pe,
                  centerY: ve,
                  radius: i.value,
                  type: "target",
                  "data-type": "target"
                })
              )
            ] : null
          ]
        ]
      );
    };
    function ee() {
      F.value = !0;
    }
    function re() {
      F.value = !1;
    }
    function ce(p, g) {
      C.update({ event: p, edge: S.value, connection: g });
    }
    function ge(p) {
      C.updateEnd({ event: p, edge: S.value }), G.value = !1;
    }
    function ie(p, g) {
      p.button === 0 && (G.value = !0, X.value = g ? S.value.target : S.value.source, Y.value = (g ? S.value.targetHandle : S.value.sourceHandle) ?? null, P.value = g ? "target" : "source", C.updateStart({ event: p, edge: S.value }), Z(p));
    }
    function ne(p) {
      var g;
      const y = { event: p, edge: S.value };
      $.value && (r.value = !1, S.value.selected && v.value ? (u([S.value]), (g = oe.value) == null || g.blur()) : n([S.value])), C.click(y);
    }
    function ae(p) {
      C.contextMenu({ event: p, edge: S.value });
    }
    function me(p) {
      C.doubleClick({ event: p, edge: S.value });
    }
    function Ee(p) {
      C.mouseEnter({ event: p, edge: S.value });
    }
    function de(p) {
      C.mouseMove({ event: p, edge: S.value });
    }
    function xe(p) {
      C.mouseLeave({ event: p, edge: S.value });
    }
    function m(p) {
      ie(p, !0);
    }
    function w(p) {
      ie(p, !1);
    }
    function f(p) {
      var g;
      !N.value && ic.includes(p.key) && $.value && (p.key === "Escape" ? ((g = oe.value) == null || g.blur(), u([c(e.id)])) : n([c(e.id)]));
    }
  }
}), i0 = o0, s0 = /* @__PURE__ */ ze({
  name: "ConnectionLine",
  compatConfig: { MODE: 3 },
  setup() {
    var e;
    const {
      id: t,
      connectionMode: n,
      connectionStartHandle: o,
      connectionEndHandle: i,
      connectionPosition: s,
      connectionLineType: r,
      connectionLineStyle: l,
      connectionLineOptions: a,
      connectionStatus: u,
      viewport: c,
      findNode: d
    } = Re(), h = (e = mt(rs)) == null ? void 0 : e["connection-line"], v = se(() => {
      var T;
      return d((T = o.value) == null ? void 0 : T.nodeId);
    }), N = se(() => {
      var T;
      return d((T = i.value) == null ? void 0 : T.nodeId) ?? null;
    }), x = se(() => ({
      x: (s.value.x - c.value.x) / c.value.zoom,
      y: (s.value.y - c.value.y) / c.value.zoom
    })), M = se(
      () => a.value.markerStart ? `url(#${ko(a.value.markerStart, t)})` : ""
    ), E = se(
      () => a.value.markerEnd ? `url(#${ko(a.value.markerEnd, t)})` : ""
    );
    return () => {
      var T, S, C;
      if (!v.value || !o.value)
        return null;
      const H = o.value.id, j = o.value.type, K = v.value.handleBounds;
      let F = (K == null ? void 0 : K[j]) ?? [];
      if (n.value === un.Loose) {
        const V = (K == null ? void 0 : K[j === "source" ? "target" : "source"]) ?? [];
        F = [...F, ...V];
      }
      if (!F)
        return null;
      const G = (H ? F.find((V) => V.id === H) : F[0]) ?? null, X = (G == null ? void 0 : G.position) ?? le.Top, { x: Y, y: P } = qn(v.value, G, X);
      let oe = null;
      N.value && (n.value === un.Strict ? oe = ((T = N.value.handleBounds[j === "source" ? "target" : "source"]) == null ? void 0 : T.find(
        (V) => {
          var q;
          return V.id === ((q = i.value) == null ? void 0 : q.id);
        }
      )) || null : oe = ((S = [...N.value.handleBounds.source ?? [], ...N.value.handleBounds.target ?? []]) == null ? void 0 : S.find(
        (V) => {
          var q;
          return V.id === ((q = i.value) == null ? void 0 : q.id);
        }
      )) || null);
      const $ = ((C = i.value) == null ? void 0 : C.position) ?? (X ? nr[X] : null);
      if (!X || !$)
        return null;
      const z = r.value ?? a.value.type ?? gn.Bezier;
      let I = "";
      const k = {
        sourceX: Y,
        sourceY: P,
        sourcePosition: X,
        targetX: x.value.x,
        targetY: x.value.y,
        targetPosition: $
      };
      return z === gn.Bezier ? [I] = $c(k) : z === gn.Step ? [I] = ir({
        ...k,
        borderRadius: 0
      }) : z === gn.SmoothStep ? [I] = ir(k) : z === gn.SimpleBezier ? [I] = Mc(k) : I = `M${Y},${P} ${x.value.x},${x.value.y}`, $e(
        "svg",
        { class: "vue-flow__edges vue-flow__connectionline vue-flow__container" },
        $e(
          "g",
          { class: "vue-flow__connection" },
          h ? $e(h, {
            sourceX: Y,
            sourceY: P,
            sourcePosition: X,
            targetX: x.value.x,
            targetY: x.value.y,
            targetPosition: $,
            sourceNode: v.value,
            sourceHandle: G,
            targetNode: N.value,
            targetHandle: oe,
            markerEnd: E.value,
            markerStart: M.value,
            connectionStatus: u.value
          }) : $e("path", {
            d: I,
            class: [a.value.class, u.value, "vue-flow__connection-path"],
            style: {
              ...l.value,
              ...a.value.style
            },
            "marker-end": E.value,
            "marker-start": M.value
          })
        )
      );
    };
  }
}), r0 = s0, l0 = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], a0 = {
  name: "MarkerType",
  compatConfig: { MODE: 3 }
}, u0 = /* @__PURE__ */ ze({
  ...a0,
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
    return (t, n) => (U(), te("marker", {
      id: t.id,
      class: "vue-flow__arrowhead",
      viewBox: "-10 -10 20 20",
      refX: "0",
      refY: "0",
      markerWidth: `${t.width}`,
      markerHeight: `${t.height}`,
      markerUnits: t.markerUnits,
      orient: t.orient
    }, [
      t.type === L(er).ArrowClosed ? (U(), te("polyline", {
        key: 0,
        style: at({
          stroke: t.color,
          fill: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 4)) : Le("", !0),
      t.type === L(er).Arrow ? (U(), te("polyline", {
        key: 1,
        style: at({
          stroke: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 4)) : Le("", !0)
    ], 8, l0));
  }
}), c0 = {
  class: "vue-flow__marker vue-flow__container",
  "aria-hidden": "true"
}, d0 = {
  name: "MarkerDefinitions",
  compatConfig: { MODE: 3 }
}, f0 = /* @__PURE__ */ ze({
  ...d0,
  setup(e) {
    const { id: t, edges: n, connectionLineOptions: o, defaultMarkerColor: i } = Re(), s = se(() => {
      const r = /* @__PURE__ */ new Set(), l = [], a = (u) => {
        if (u) {
          const c = ko(u, t);
          r.has(c) || (typeof u == "object" ? l.push({ ...u, id: c, color: u.color || i.value }) : l.push({ id: c, color: i.value, type: u }), r.add(c));
        }
      };
      for (const u of [o.value.markerEnd, o.value.markerStart])
        a(u);
      for (const u of n.value)
        for (const c of [u.markerStart, u.markerEnd])
          a(c);
      return l.sort((u, c) => u.id.localeCompare(c.id));
    });
    return (r, l) => (U(), te("svg", c0, [
      b("defs", null, [
        (U(!0), te(Ne, null, ct(s.value, (a) => (U(), Be(u0, {
          id: a.id,
          key: a.id,
          type: a.type,
          color: a.color,
          width: a.width,
          height: a.height,
          markerUnits: a.markerUnits,
          "stroke-width": a.strokeWidth,
          orient: a.orient
        }, null, 8, ["id", "type", "color", "width", "height", "markerUnits", "stroke-width", "orient"]))), 128))
      ])
    ]));
  }
}), p0 = {
  name: "Edges",
  compatConfig: { MODE: 3 }
}, h0 = /* @__PURE__ */ ze({
  ...p0,
  setup(e) {
    const { findNode: t, getEdges: n, elevateEdgesOnSelect: o } = Re();
    return (i, s) => (U(), te(Ne, null, [
      we(f0),
      (U(!0), te(Ne, null, ct(L(n), (r) => (U(), te("svg", {
        key: r.id,
        class: "vue-flow__edges vue-flow__container",
        style: at({ zIndex: L(Am)(r, L(t), L(o)) })
      }, [
        we(L(i0), {
          id: r.id
        }, null, 8, ["id"])
      ], 4))), 128)),
      we(L(r0))
    ], 64));
  }
}), g0 = /* @__PURE__ */ ze({
  name: "Node",
  compatConfig: { MODE: 3 },
  props: ["id", "resizeObserver"],
  setup(e) {
    const {
      id: t,
      noPanClassName: n,
      selectNodesOnDrag: o,
      nodesSelectionActive: i,
      multiSelectionActive: s,
      emits: r,
      removeSelectedNodes: l,
      addSelectedNodes: a,
      updateNodeDimensions: u,
      onUpdateNodeInternals: c,
      getNodeTypes: d,
      nodeExtent: h,
      elevateNodesOnSelect: v,
      disableKeyboardA11y: N,
      ariaLiveMessage: x,
      snapToGrid: M,
      snapGrid: E,
      nodeDragThreshold: T,
      nodesDraggable: S,
      elementsSelectable: C,
      nodesConnectable: H,
      nodesFocusable: j,
      hooks: K
    } = Re(), F = /* @__PURE__ */ De(null);
    Sn(_c, F), Sn(yc, e.id);
    const G = mt(rs), X = tn(), Y = Sc(), { node: P, parentNode: oe } = xc(e.id), { emit: $, on: z } = Zm(P, r), I = /* @__PURE__ */ Oe(() => typeof P.draggable > "u" ? S.value : P.draggable), k = /* @__PURE__ */ Oe(() => typeof P.selectable > "u" ? C.value : P.selectable), V = /* @__PURE__ */ Oe(() => typeof P.connectable > "u" ? H.value : P.connectable), q = /* @__PURE__ */ Oe(() => typeof P.focusable > "u" ? j.value : P.focusable), Z = se(
      () => k.value || I.value || K.value.nodeClick.hasListeners() || K.value.nodeDoubleClick.hasListeners() || K.value.nodeMouseEnter.hasListeners() || K.value.nodeMouseMove.hasListeners() || K.value.nodeMouseLeave.hasListeners()
    ), ee = /* @__PURE__ */ Oe(() => !!P.dimensions.width && !!P.dimensions.height), re = se(() => {
      const g = P.type || "default", y = G == null ? void 0 : G[`node-${g}`];
      if (y)
        return y;
      let _ = P.template || d.value[g];
      if (typeof _ == "string" && X) {
        const D = Object.keys(X.appContext.components);
        D && D.includes(g) && (_ = Ka(g, !1));
      }
      return _ && typeof _ != "string" ? _ : (r.error(new Ye(Ue.NODE_TYPE_MISSING, _)), !1);
    }), ce = bc({
      id: e.id,
      el: F,
      disabled: () => !I.value,
      selectable: k,
      dragHandle: () => P.dragHandle,
      onStart(g) {
        $.dragStart(g);
      },
      onDrag(g) {
        $.drag(g);
      },
      onStop(g) {
        $.dragStop(g);
      },
      onClick(g) {
        f(g);
      }
    }), ge = se(() => P.class instanceof Function ? P.class(P) : P.class), ie = se(() => {
      const g = (P.style instanceof Function ? P.style(P) : P.style) || {}, y = P.width instanceof Function ? P.width(P) : P.width, _ = P.height instanceof Function ? P.height(P) : P.height;
      return !g.width && y && (g.width = typeof y == "string" ? y : `${y}px`), !g.height && _ && (g.height = typeof _ == "string" ? _ : `${_}px`), g;
    }), ne = /* @__PURE__ */ Oe(() => Number(P.zIndex ?? ie.value.zIndex ?? 0));
    return c((g) => {
      (g.includes(e.id) || !g.length) && me();
    }), kt(() => {
      be(
        () => P.hidden,
        (g = !1, y, _) => {
          !g && F.value && (e.resizeObserver.observe(F.value), _(() => {
            F.value && e.resizeObserver.unobserve(F.value);
          }));
        },
        { immediate: !0, flush: "post" }
      );
    }), be([() => P.type, () => P.sourcePosition, () => P.targetPosition], () => {
      rt(() => {
        u([{ id: e.id, nodeElement: F.value, forceUpdate: !0 }]);
      });
    }), be(
      [
        () => P.position.x,
        () => P.position.y,
        () => {
          var g;
          return (g = oe.value) == null ? void 0 : g.computedPosition.x;
        },
        () => {
          var g;
          return (g = oe.value) == null ? void 0 : g.computedPosition.y;
        },
        () => {
          var g;
          return (g = oe.value) == null ? void 0 : g.computedPosition.z;
        },
        ne,
        () => P.selected,
        () => P.dimensions.height,
        () => P.dimensions.width,
        () => {
          var g;
          return (g = oe.value) == null ? void 0 : g.dimensions.height;
        },
        () => {
          var g;
          return (g = oe.value) == null ? void 0 : g.dimensions.width;
        }
      ],
      ([g, y, _, D, O, A]) => {
        const B = {
          x: g,
          y,
          z: A + (v.value && P.selected ? 1e3 : 0)
        };
        typeof _ < "u" && typeof D < "u" ? P.computedPosition = Em({ x: _, y: D, z: O }, B) : P.computedPosition = B;
      },
      { flush: "post", immediate: !0 }
    ), be([() => P.extent, h], ([g, y], [_, D]) => {
      (g !== _ || y !== D) && ae();
    }), P.extent === "parent" || typeof P.extent == "object" && "range" in P.extent && P.extent.range === "parent" ? Ys(() => ee).toBe(!0).then(ae) : ae(), () => P.hidden ? null : $e(
      "div",
      {
        ref: F,
        "data-id": P.id,
        class: [
          "vue-flow__node",
          `vue-flow__node-${re.value === !1 ? "default" : P.type || "default"}`,
          {
            [n.value]: I.value,
            dragging: ce == null ? void 0 : ce.value,
            draggable: I.value,
            selected: P.selected,
            selectable: k.value,
            parent: P.isParent
          },
          ge.value
        ],
        style: {
          visibility: ee.value ? "visible" : "hidden",
          zIndex: P.computedPosition.z ?? ne.value,
          transform: `translate(${P.computedPosition.x}px,${P.computedPosition.y}px)`,
          pointerEvents: Z.value ? "all" : "none",
          ...ie.value
        },
        tabIndex: q.value ? 0 : void 0,
        role: q.value ? "group" : void 0,
        "aria-describedby": N.value ? void 0 : `${nc}-${t}`,
        "aria-label": P.ariaLabel,
        "aria-roledescription": "node",
        ...P.domAttributes,
        onMouseenter: Ee,
        onMousemove: de,
        onMouseleave: xe,
        onContextmenu: m,
        onClick: f,
        onDblclick: w,
        onKeydown: p
      },
      [
        $e(re.value === !1 ? d.value.default : re.value, {
          id: P.id,
          type: P.type,
          data: P.data,
          events: { ...P.events, ...z },
          selected: P.selected,
          resizing: P.resizing,
          dragging: ce.value,
          connectable: V.value,
          position: P.computedPosition,
          dimensions: P.dimensions,
          isValidTargetPos: P.isValidTargetPos,
          isValidSourcePos: P.isValidSourcePos,
          parent: P.parentNode,
          parentNodeId: P.parentNode,
          zIndex: P.computedPosition.z ?? ne.value,
          targetPosition: P.targetPosition,
          sourcePosition: P.sourcePosition,
          label: P.label,
          dragHandle: P.dragHandle,
          onUpdateNodeInternals: me
        })
      ]
    );
    function ae() {
      const g = P.computedPosition, { computedPosition: y, position: _ } = Tr(
        P,
        M.value ? ss(g, E.value) : g,
        r.error,
        h.value,
        oe.value
      );
      (P.computedPosition.x !== y.x || P.computedPosition.y !== y.y) && (P.computedPosition = { ...P.computedPosition, ...y }), (P.position.x !== _.x || P.position.y !== _.y) && (P.position = _);
    }
    function me() {
      F.value && u([{ id: e.id, nodeElement: F.value, forceUpdate: !0 }]);
    }
    function Ee(g) {
      ce != null && ce.value || $.mouseEnter({ event: g, node: P });
    }
    function de(g) {
      ce != null && ce.value || $.mouseMove({ event: g, node: P });
    }
    function xe(g) {
      ce != null && ce.value || $.mouseLeave({ event: g, node: P });
    }
    function m(g) {
      return $.contextMenu({ event: g, node: P });
    }
    function w(g) {
      return $.doubleClick({ event: g, node: P });
    }
    function f(g) {
      k.value && (!o.value || !I.value || T.value > 0) && or(
        P,
        s.value,
        a,
        l,
        i,
        !1,
        F.value
      ), $.click({ event: g, node: P });
    }
    function p(g) {
      if (!(tr(g) || N.value))
        if (ic.includes(g.key) && k.value) {
          const y = g.key === "Escape";
          or(
            P,
            s.value,
            a,
            l,
            i,
            y,
            F.value
          );
        } else I.value && P.selected && Un[g.key] && (g.preventDefault(), x.value = `Moved selected node ${g.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~P.position.x}, y: ${~~P.position.y}`, Y(
          {
            x: Un[g.key].x,
            y: Un[g.key].y
          },
          g.shiftKey
        ));
    }
  }
}), v0 = g0;
function m0(e = { includeHiddenNodes: !1 }) {
  const { nodes: t } = Re();
  return se(() => {
    if (t.value.length === 0)
      return !1;
    for (const n of t.value)
      if ((e.includeHiddenNodes || !n.hidden) && ((n == null ? void 0 : n.handleBounds) === void 0 || n.dimensions.width === 0 || n.dimensions.height === 0))
        return !1;
    return !0;
  });
}
const y0 = { class: "vue-flow__nodes vue-flow__container" }, _0 = {
  name: "Nodes",
  compatConfig: { MODE: 3 }
}, b0 = /* @__PURE__ */ ze({
  ..._0,
  setup(e) {
    const { getNodes: t, updateNodeDimensions: n, emits: o } = Re(), i = m0(), s = /* @__PURE__ */ De();
    return be(
      i,
      (r) => {
        r && rt(() => {
          o.nodesInitialized(t.value);
        });
      },
      { immediate: !0 }
    ), kt(() => {
      s.value = new ResizeObserver((r) => {
        const l = r.map((a) => ({
          id: a.target.getAttribute("data-id"),
          nodeElement: a.target,
          forceUpdate: !0
        }));
        rt(() => n(l));
      });
    }), Xi(() => {
      var r;
      return (r = s.value) == null ? void 0 : r.disconnect();
    }), (r, l) => (U(), te("div", y0, [
      s.value ? (U(!0), te(Ne, { key: 0 }, ct(L(t), (a, u, c, d) => {
        const h = [a.id];
        if (d && d.key === a.id && Of(d, h))
          return d;
        const v = (U(), Be(L(v0), {
          id: a.id,
          key: a.id,
          "resize-observer": s.value
        }, null, 8, ["id", "resize-observer"]));
        return v.memo = h, v;
      }, l, 0), 128)) : Le("", !0)
    ]));
  }
});
function w0() {
  const { emits: e } = Re();
  kt(() => {
    if (mc()) {
      const t = document.querySelector(".vue-flow__pane");
      t && window.getComputedStyle(t).zIndex !== "1" && e.error(new Ye(Ue.MISSING_STYLES));
    }
  });
}
const x0 = /* @__PURE__ */ b("div", { class: "vue-flow__edge-labels" }, null, -1), S0 = {
  name: "VueFlow",
  compatConfig: { MODE: 3 }
}, E0 = /* @__PURE__ */ ze({
  ...S0,
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
    isValidConnection: { type: [Function, null], default: void 0 },
    deleteKeyCode: { default: void 0 },
    selectionKeyCode: { type: [Boolean, null], default: void 0 },
    multiSelectionKeyCode: { default: void 0 },
    zoomActivationKeyCode: { default: void 0 },
    panActivationKeyCode: { default: void 0 },
    snapToGrid: { type: Boolean, default: void 0 },
    snapGrid: {},
    onlyRenderVisibleElements: { type: Boolean, default: void 0 },
    edgesUpdatable: { type: [Boolean, String], default: void 0 },
    nodesDraggable: { type: Boolean, default: void 0 },
    nodesConnectable: { type: Boolean, default: void 0 },
    nodeDragThreshold: {},
    elementsSelectable: { type: Boolean, default: void 0 },
    selectNodesOnDrag: { type: Boolean, default: void 0 },
    panOnDrag: { type: [Boolean, Array], default: void 0 },
    minZoom: {},
    maxZoom: {},
    defaultViewport: {},
    translateExtent: {},
    nodeExtent: {},
    defaultMarkerColor: {},
    zoomOnScroll: { type: Boolean, default: void 0 },
    zoomOnPinch: { type: Boolean, default: void 0 },
    panOnScroll: { type: Boolean, default: void 0 },
    panOnScrollSpeed: {},
    panOnScrollMode: {},
    paneClickDistance: {},
    zoomOnDoubleClick: { type: Boolean, default: void 0 },
    preventScrolling: { type: Boolean, default: void 0 },
    selectionMode: {},
    edgeUpdaterRadius: {},
    fitViewOnInit: { type: Boolean, default: void 0 },
    connectOnClick: { type: Boolean, default: void 0 },
    applyDefault: { type: Boolean, default: void 0 },
    autoConnect: { type: [Boolean, Function], default: void 0 },
    noDragClassName: {},
    noWheelClassName: {},
    noPanClassName: {},
    defaultEdgeOptions: {},
    elevateEdgesOnSelect: { type: Boolean, default: void 0 },
    elevateNodesOnSelect: { type: Boolean, default: void 0 },
    disableKeyboardA11y: { type: Boolean, default: void 0 },
    edgesFocusable: { type: Boolean, default: void 0 },
    nodesFocusable: { type: Boolean, default: void 0 },
    autoPanOnConnect: { type: Boolean, default: void 0 },
    autoPanOnNodeDrag: { type: Boolean, default: void 0 },
    autoPanSpeed: {}
  },
  emits: ["nodesChange", "edgesChange", "nodesInitialized", "paneReady", "init", "updateNodeInternals", "error", "connect", "connectStart", "connectEnd", "clickConnectStart", "clickConnectEnd", "moveStart", "move", "moveEnd", "selectionDragStart", "selectionDrag", "selectionDragStop", "selectionContextMenu", "selectionStart", "selectionEnd", "viewportChangeStart", "viewportChange", "viewportChangeEnd", "paneScroll", "paneClick", "paneContextMenu", "paneMouseEnter", "paneMouseMove", "paneMouseLeave", "edgeUpdate", "edgeContextMenu", "edgeMouseEnter", "edgeMouseMove", "edgeMouseLeave", "edgeDoubleClick", "edgeClick", "edgeUpdateStart", "edgeUpdateEnd", "nodeContextMenu", "nodeMouseEnter", "nodeMouseMove", "nodeMouseLeave", "nodeDoubleClick", "nodeClick", "nodeDragStart", "nodeDrag", "nodeDragStop", "miniMapNodeClick", "miniMapNodeDoubleClick", "miniMapNodeMouseEnter", "miniMapNodeMouseMove", "miniMapNodeMouseLeave", "update:modelValue", "update:nodes", "update:edges"],
  setup(e, { expose: t, emit: n }) {
    const o = e, i = Kd(), s = xs(o, "modelValue", n), r = xs(o, "nodes", n), l = xs(o, "edges", n), a = Re(o), u = ty({ modelValue: s, nodes: r, edges: l }, o, a);
    return oy(n, a.hooks), e0(), w0(), Sn(rs, i), hr(u), t(a), (c, d) => (U(), te("div", {
      ref: L(a).vueFlowRef,
      class: "vue-flow"
    }, [
      we(Xy, null, {
        default: No(() => [
          we(h0),
          x0,
          we(b0),
          At(c.$slots, "zoom-pane")
        ]),
        _: 3
      }),
      At(c.$slots, "default"),
      we(Qy)
    ], 512));
  }
}), gt = {
  input: {
    label: "Input",
    icon: "IN",
    description: "Provide a JSON or text payload to downstream nodes.",
    workflowType: "input",
    outputs: {
      success: {
        schema: {
          value: "any",
          format: "string"
        }
      },
      error: {}
    },
    config: {
      format: "json",
      value: `{
  "topic": "Summer Drops",
  "audience": "founders"
}`
    }
  },
  http_request: {
    label: "HTTP Request",
    icon: "HTTP",
    description: "Call an API and pass the response body downstream.",
    workflowType: "http_request",
    outputs: {
      success: {
        schema: {
          body: "any"
        }
      },
      error: {
        schema: {
          message: "string",
          statusCode: "number"
        }
      }
    },
    config: {
      url: "https://api.example.com/data",
      method: "GET",
      headers: "",
      body: "",
      responseFormat: "json",
      timeout: 1e4
    }
  },
  rest_api: {
    label: "REST",
    icon: "REST",
    description: "Fetch external data through the host bridge.",
    workflowType: "rest",
    outputs: {
      success: {
        schema: {
          topics: "array",
          items: "array"
        }
      },
      error: {
        schema: {
          message: "string",
          statusCode: "number"
        }
      }
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
      success: {
        schema: {
          text: "string",
          variants: "array"
        }
      },
      error: {}
    },
    config: {
      model: "gpt-4o-mini",
      systemPrompt: "You are a sharp social media strategist.",
      userPrompt: "Write a concise post about {{fetch_trends.output.topics[0].name}}.",
      temperature: 0.7,
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
      success: {
        schema: {
          caption: "string",
          hashtags: "string"
        }
      },
      error: {}
    },
    config: {
      code: `async function run(inputs) {
  return inputs;
}`,
      timeout: 5e3,
      memoryLimit: 64
    }
  },
  post: {
    label: "Publish",
    icon: "POST",
    description: "Dry-run or publish through Mixpost services.",
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
    config: {
      conditions: [
        {
          id: "condition_1",
          label: "Condition 1",
          dataType: "number",
          operation: "less_than",
          left: "{{write_caption.meta.tokensUsed}}",
          right: "300"
        }
      ]
    }
  }
};
function ao(e, t = 1, n = { x: 120, y: 120 }) {
  const o = gt[e];
  return {
    id: N0(e, t),
    type: e,
    label: o.label,
    position: n,
    status: "idle",
    disabled: !1,
    warning: "",
    config: structuredClone(o.config)
  };
}
function N0(e, t) {
  const n = {
    input: "input_data",
    http_request: "http_request",
    rest_api: "fetch_trends",
    prompt: "write_caption",
    javascript: "format_output",
    post: "publish_post",
    condition: "check_length"
  }[e];
  return t === 1 ? n : `${n}_${t}`;
}
function C0(e) {
  return {
    id: e.id,
    name: e.name,
    version: e.version || "1.0.0",
    trigger: {
      id: "trigger_1",
      type: e.trigger || "manual",
      name: "Manual Trigger",
      config: {},
      outputSchema: {
        body: "object"
      }
    },
    nodes: e.nodes.map($0),
    edges: e.edges.map(M0)
  };
}
function $0(e) {
  const t = gt[e.type] || {};
  return {
    id: e.id,
    type: t.workflowType || e.type,
    name: e.label || t.label || e.id,
    position: e.position,
    disabled: !!e.disabled,
    config: I0(e),
    outputs: e.type === "condition" ? T0(e) : structuredClone(t.outputs || { success: {}, error: {} })
  };
}
function M0(e) {
  return {
    from: e.source,
    fromOutput: e.sourceHandle || "success",
    to: e.target
  };
}
function I0(e) {
  return e.type !== "condition" ? structuredClone(e.config || {}) : {
    conditions: (e.config.conditions || []).map((t, n) => ({
      id: t.id || `condition_${n + 1}`,
      label: t.label || `Condition ${n + 1}`,
      expression: t.expression || P0(t),
      dataType: t.dataType,
      operation: t.operation,
      left: t.left,
      right: t.right
    }))
  };
}
function T0(e) {
  return (e.config.conditions || []).reduce((t, n, o) => {
    const i = n.id || `condition_${o + 1}`;
    return t[i] = {
      schema: {
        matched: "boolean",
        conditionId: "string"
      }
    }, t;
  }, {});
}
function P0(e) {
  const t = e.left || "", n = e.right || "", o = {
    equals: "===",
    not_equals: "!==",
    greater_than: ">",
    greater_equal: ">=",
    less_than: "<",
    less_equal: "<="
  }[e.operation];
  return o ? `${t} ${o} ${n}` : e.operation === "is_empty" ? `!${t}` : e.operation === "is_not_empty" ? `!!${t}` : e.operation === "is_true" ? `${t} === true` : e.operation === "is_false" ? `${t} === false` : e.operation === "contains" ? `${t}.includes(${n})` : e.operation === "not_contains" ? `!${t}.includes(${n})` : `${t}`;
}
const A0 = [
  ao("rest_api", 1, { x: 80, y: 90 }),
  ao("prompt", 1, { x: 340, y: 90 }),
  ao("javascript", 1, { x: 600, y: 90 }),
  ao("post", 1, { x: 860, y: 90 })
], O0 = [
  { id: "fetch_trends-write_caption", source: "fetch_trends", target: "write_caption", sourceHandle: "success", animated: !0 },
  { id: "write_caption-format_output", source: "write_caption", target: "format_output", sourceHandle: "success", animated: !0 },
  { id: "format_output-publish_post", source: "format_output", target: "publish_post", sourceHandle: "success", animated: !0 }
], cn = /* @__PURE__ */ Qi("flow", {
  state: () => ({
    id: "draft-flow",
    name: "Daily Social Pulse",
    trigger: "manual",
    scheduleCron: null,
    isActive: !0,
    nodes: A0,
    edges: O0,
    selectedNodeId: "write_caption",
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
    flowPayload(e) {
      return C0({
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
      this.nodes = Cm(e, this.nodes);
    },
    onEdgesChange(e) {
      this.edges = Nm(e, this.edges);
    },
    onConnect(e) {
      const t = e.sourceHandle ? `-${e.sourceHandle}` : "";
      this.edges = _m(
        { ...e, id: `${e.source}${t}-${e.target}`, animated: !0 },
        this.edges
      );
    },
    removeSourceHandleEdges(e, t) {
      this.edges = this.edges.filter((n) => n.source !== e || n.sourceHandle !== t);
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
      const n = this.nodes.filter((i) => i.type === e).length + 1, o = ao(e, n, t || { x: 160 + n * 40, y: 120 + n * 40 });
      for (; this.nodes.some((i) => i.id === o.id); )
        o.id = `${o.id}_${Math.floor(Math.random() * 1e3)}`;
      this.nodes.push(o), this.selectedNodeId = o.id;
    },
    duplicateNode(e) {
      const t = this.nodes.find((i) => i.id === e);
      if (!t) return;
      const n = this.nodes.filter((i) => i.type === t.type).length + 1, o = {
        ...structuredClone(t),
        id: `${t.id}_${n}`,
        position: {
          x: t.position.x + 40,
          y: t.position.y + 40
        },
        status: "idle",
        warning: ""
      };
      for (; this.nodes.some((i) => i.id === o.id); )
        o.id = `${t.id}_${Math.floor(Math.random() * 1e3)}`;
      this.nodes.push(o), this.selectedNodeId = o.id;
    },
    deleteNode(e) {
      var t;
      this.nodes = this.nodes.filter((n) => n.id !== e), this.edges = this.edges.filter((n) => n.source !== e && n.target !== e), this.inspectedNodeId === e && (this.inspectedNodeId = null), this.selectedNodeId === e && (this.selectedNodeId = ((t = this.nodes[0]) == null ? void 0 : t.id) || null);
    },
    toggleNodeDisabled(e) {
      const t = this.nodes.find((n) => n.id === e);
      t && (t.disabled = !t.disabled, t.status = t.disabled ? "skipped" : "idle");
    },
    tidyNodes() {
      this.nodes = this.nodes.map((e, t) => ({
        ...e,
        position: {
          x: 80 + t % 4 * 280,
          y: 90 + Math.floor(t / 4) * 220
        }
      }));
    },
    updateSelectedConfig(e) {
      const t = this.selectedNode;
      t && (t.config = { ...t.config, ...e });
    },
    renameSelectedNode(e) {
      const t = this.selectedNode;
      if (!t || !e || t.id === e) return;
      const n = t.id;
      t.id = e, this.selectedNodeId = e, this.edges = this.edges.map((i) => ({
        ...i,
        id: i.id.replace(n, e),
        source: i.source === n ? e : i.source,
        target: i.target === n ? e : i.target
      }));
      const o = new RegExp(`\\{\\{${n}\\.`, "g");
      this.nodes.forEach((i) => {
        Object.entries(i.config).forEach(([s, r]) => {
          typeof r == "string" && (i.config[s] = r.replace(o, `{{${e}.`));
        });
      });
    },
    setNodeStatus(e, t, n = "") {
      const o = this.nodes.find((i) => i.id === e);
      o && (o.status = t, o.warning = n);
    }
  }
}), ds = /* @__PURE__ */ Qi("config", {
  state: () => ({
    mode: "standalone",
    apiBaseUrl: "/api/flow-builder",
    flowId: null,
    enabledNodes: ["input", "http_request", "rest_api", "prompt", "javascript", "post", "condition"],
    theme: {}
  }),
  actions: {
    init(e = {}) {
      this.mode = e.mode || this.mode, this.apiBaseUrl = e.apiBaseUrl || this.apiBaseUrl, this.flowId = e.flowId || null, this.enabledNodes = e.enabledNodes || this.enabledNodes, this.theme = e.theme || {};
    }
  }
}), Uo = /* @__PURE__ */ Qi("run", {
  state: () => ({
    status: "idle",
    mode: "test",
    context: {
      trigger: {
        status: "success",
        output: {
          body: { productId: "demo-launch", platform: "x" }
        },
        meta: {
          triggeredAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        error: null
      }
    },
    log: []
  }),
  actions: {
    start(e) {
      this.mode = e, this.status = "running", this.context = {
        trigger: {
          status: "success",
          output: {
            body: { productId: "demo-launch", platform: "x" }
          },
          meta: {
            triggeredAt: (/* @__PURE__ */ new Date()).toISOString()
          },
          error: null
        }
      }, this.log = [];
    },
    addLog(e) {
      this.log.unshift({
        at: (/* @__PURE__ */ new Date()).toISOString(),
        ...e
      });
    },
    setNodeOutput(e, t) {
      this.context[e] = t;
    },
    finish(e = "success") {
      this.status = e;
    }
  }
});
function D0(e, t) {
  const n = new Set(e.map((l) => l.id)), o = new Map(e.map((l) => [l.id, 0])), i = new Map(e.map((l) => [l.id, []]));
  t.forEach((l) => {
    !n.has(l.source) || !n.has(l.target) || (o.set(l.target, o.get(l.target) + 1), i.get(l.source).push(l.target));
  });
  const s = e.filter((l) => o.get(l.id) === 0).map((l) => l.id), r = [];
  for (; s.length; ) {
    const l = s.shift();
    r.push(l), i.get(l).forEach((a) => {
      o.set(a, o.get(a) - 1), o.get(a) === 0 && s.push(a);
    });
  }
  if (r.length !== e.length)
    throw new Error("Flow contains a cycle");
  return r.map((l) => e.find((a) => a.id === l));
}
function k0(e, t) {
  return t ? t.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean).reduce((n, o) => n == null ? void 0 : n[o], e) : e;
}
function R0(e) {
  return e == null ? e : JSON.parse(JSON.stringify(e));
}
function V0(e) {
  return e == null ? "" : typeof e == "string" ? e : JSON.stringify(e);
}
function Dn(e, t) {
  return typeof e != "string" ? e : e.replace(/\{\{([^}]+)\}\}/g, (n, o) => {
    const i = k0(t, o.trim());
    return i !== void 0 ? V0(i) : "";
  });
}
const Or = /* @__PURE__ */ Qi("accounts", {
  state: () => ({
    accounts: []
  }),
  actions: {
    setAccounts(e) {
      this.accounts = e;
    }
  }
});
function B0() {
  const e = cn(), t = Uo(), n = Or();
  async function o(i = "test") {
    t.start(i), e.nodes.forEach((r) => e.setNodeStatus(r.id, "idle"));
    let s = "success";
    try {
      const r = D0(e.nodes, e.edges);
      for (const l of r) {
        const a = (/* @__PURE__ */ new Date()).toISOString(), u = performance.now();
        if (l.disabled) {
          const c = (/* @__PURE__ */ new Date()).toISOString(), d = {
            status: "skipped",
            output: null,
            meta: { startedAt: a, finishedAt: c, durationMs: 0 },
            error: null
          };
          e.setNodeStatus(l.id, "skipped"), t.setNodeOutput(l.id, d), t.addLog({
            nodeId: l.id,
            status: "skipped",
            durationMs: 0,
            output: d
          });
          continue;
        }
        e.setNodeStatus(l.id, "running");
        try {
          const c = R0(t.context), d = await z0(l, c, i, n.accounts), h = (/* @__PURE__ */ new Date()).toISOString(), v = Math.round(performance.now() - u), N = {
            status: "success",
            output: d.output,
            ...d.selectedOutput ? { selectedOutput: d.selectedOutput } : {},
            meta: {
              startedAt: a,
              finishedAt: h,
              durationMs: v,
              ...d.meta || {}
            },
            error: null
          };
          t.setNodeOutput(l.id, N), e.setNodeStatus(l.id, "success"), t.addLog({
            nodeId: l.id,
            status: "success",
            durationMs: v,
            inputContext: c,
            output: N
          });
        } catch (c) {
          const d = (/* @__PURE__ */ new Date()).toISOString(), h = Math.round(performance.now() - u), v = {
            status: "error",
            output: null,
            meta: { startedAt: a, finishedAt: d, durationMs: h },
            error: {
              message: c.message
            }
          };
          s = "failed", t.setNodeOutput(l.id, v), e.setNodeStatus(l.id, "error", c.message), t.addLog({
            nodeId: l.id,
            status: "error",
            durationMs: h,
            output: v,
            errorMessage: c.message
          });
          break;
        }
      }
    } catch (r) {
      s = "failed", t.addLog({ nodeId: "flow", status: "error", durationMs: 0, errorMessage: r.message });
    }
    t.finish(s);
  }
  return { execute: o };
}
async function z0(e, t, n, o) {
  var s, r;
  const i = e.config;
  if (e.type === "input")
    return {
      output: {
        value: H0(i.value, i.format),
        format: i.format
      }
    };
  if (e.type === "http_request") {
    const l = Dn(i.url, t), a = Dn(i.body || "", t);
    return {
      output: i.responseFormat === "json" ? {
        ok: !0,
        url: l,
        method: i.method,
        requestBody: Tc(a)
      } : `Mock response from ${i.method} ${l}`,
      meta: {
        statusCode: 200,
        headers: { "content-type": i.responseFormat === "json" ? "application/json" : "text/plain" }
      }
    };
  }
  if (e.type === "rest_api") {
    const l = "Summer Drops";
    return {
      output: {
        source: Dn(i.url, t),
        topics: [{ name: l, score: 97 }],
        items: [{ title: `${l} trend report`, engagement: "high" }]
      },
      meta: {
        statusCode: 200,
        headers: { "content-type": "application/json" }
      }
    };
  }
  if (e.type === "prompt") {
    const a = `Fresh angle: ${Dn(i.userPrompt, t).replace(/\s+/g, " ").trim()} Keep it crisp, visual, and ready for every channel. #Launch #SocialOps`, u = Array.from({ length: Number(i.variants || 1) }, (c, d) => `${a} Variant ${d + 1}`);
    return {
      output: {
        text: a,
        variants: u
      },
      meta: {
        tokensUsed: Math.max(60, Math.round(a.length / 4)),
        model: i.model
      }
    };
  }
  if (e.type === "javascript") {
    const l = performance.now(), a = ((r = (s = t.write_caption) == null ? void 0 : s.output) == null ? void 0 : r.text) || "";
    return {
      output: {
        caption: a.split("#")[0].trim() || "Draft caption ready.",
        hashtags: "#Launch #SocialOps",
        charCount: a.length
      },
      meta: {
        executionMs: Math.round(performance.now() - l)
      }
    };
  }
  if (e.type === "condition") {
    const l = Array.isArray(i.conditions) ? i.conditions.map((u) => F0(u, t)) : [], a = l.find((u) => u.matched);
    return {
      selectedOutput: (a == null ? void 0 : a.id) || null,
      output: a ? { matched: !0, conditionId: a.id } : { matched: !1, conditionId: null },
      meta: { matchedConditions: l }
    };
  }
  if (e.type === "post") {
    const l = Dn(i.caption, t), a = o.filter((c) => {
      var d;
      return (d = i.accounts) == null ? void 0 : d.includes(c.id);
    }), u = a.length ? a : o.slice(0, 2);
    return {
      output: {
        published: n !== "test",
        dryRun: n === "test",
        previewUrl: null,
        results: u.map((c, d) => ({
          platform: c.platform,
          accountId: c.id,
          status: n === "test" ? "dry_run" : "published",
          url: n === "test" ? null : `https://social.example/${c.platform}/posts/${Date.now()}-${d}`,
          caption: l
        })),
        failedPlatforms: []
      }
    };
  }
  throw new Error(`Unsupported node type: ${e.type}`);
}
function H0(e, t) {
  return t !== "json" ? e || "" : Tc(e || "{}");
}
function Tc(e) {
  if (typeof e != "string") return e;
  if (!e.trim()) return null;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function F0(e, t) {
  const n = ra(e.left, t, e.dataType), o = ra(e.right, t, e.dataType), i = L0(n, o, e);
  return {
    id: e.id,
    dataType: e.dataType,
    operation: e.operation,
    left: n,
    right: o,
    matched: i
  };
}
function ra(e, t, n) {
  const o = Dn(e ?? "", t);
  if (n === "number") return o === "" ? null : Number(o);
  if (n === "boolean") return o === !0 || o === "true" || o === "1";
  if (n === "array" || n === "object")
    try {
      return typeof o == "string" ? JSON.parse(o) : o;
    } catch {
      return o;
    }
  return String(o ?? "");
}
function L0(e, t, n) {
  const o = n.operation;
  if (o === "is_empty") return la(e);
  if (o === "is_not_empty") return !la(e);
  if (o === "is_true") return e === !0;
  if (o === "is_false") return e === !1;
  if (o === "equals") return e === t;
  if (o === "not_equals") return e !== t;
  if (n.dataType === "number") {
    if (Number.isNaN(e) || Number.isNaN(t)) return !1;
    if (o === "greater_than") return e > t;
    if (o === "greater_equal") return e >= t;
    if (o === "less_than") return e < t;
    if (o === "less_equal") return e <= t;
  }
  if (n.dataType === "string") {
    if (o === "contains") return e.includes(t);
    if (o === "not_contains") return !e.includes(t);
    if (o === "starts_with") return e.startsWith(t);
    if (o === "ends_with") return e.endsWith(t);
  }
  if (n.dataType === "array") {
    const i = Array.isArray(e) ? e : [];
    if (o === "contains") return i.includes(t);
  }
  return n.dataType === "object" && o === "has_key" ? e && typeof e == "object" && Object.hasOwn(e, t) : !1;
}
function la(e) {
  return e == null || e === "" ? !0 : Array.isArray(e) ? e.length === 0 : typeof e == "object" ? Object.keys(e).length === 0 : !1;
}
const bt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, i] of t)
    n[o] = i;
  return n;
}, U0 = { class: "fb-toolbar" }, G0 = { class: "fb-title-block" }, Y0 = { class: "fb-toolbar-actions" }, W0 = {
  __name: "FlowToolbar",
  setup(e) {
    const t = cn(), n = ds(), o = Uo(), { execute: i } = B0();
    function s() {
      o.addLog({
        nodeId: "flow",
        status: "success",
        durationMs: 0,
        output: { saved: !0, flow: t.flowPayload }
      });
    }
    return (r, l) => (U(), te("header", U0, [
      b("div", G0, [
        _e(b("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (a) => L(t).name = a),
          class: "fb-flow-name",
          "aria-label": "Flow name"
        }, null, 512), [
          [ke, L(t).name]
        ]),
        b("span", null, he(L(n).mode) + " · " + he(L(t).nodes.length) + " nodes · " + he(L(t).edges.length) + " edges", 1)
      ]),
      b("div", Y0, [
        b("button", {
          class: "fb-btn",
          type: "button",
          title: "Test run",
          onClick: l[1] || (l[1] = (a) => L(i)("test"))
        }, "Test"),
        b("button", {
          class: "fb-btn fb-btn-primary",
          type: "button",
          title: "Live run",
          onClick: l[2] || (l[2] = (a) => L(i)("live"))
        }, "Run"),
        b("button", {
          class: "fb-btn fb-btn-cta",
          type: "button",
          title: "Save flow",
          onClick: s
        }, "Save")
      ])
    ]));
  }
}, K0 = /* @__PURE__ */ bt(W0, [["__scopeId", "data-v-7c2e06b6"]]), X0 = { class: "fb-panel fb-library" }, j0 = { class: "fb-library-list" }, q0 = ["onDragstart"], Z0 = {
  __name: "NodeLibrary",
  setup(e) {
    const t = ds(), n = se(() => t.enabledNodes.filter((i) => gt[i]));
    function o(i, s) {
      i.dataTransfer.effectAllowed = "copy", i.dataTransfer.setData("application/x-flow-node", s);
    }
    return (i, s) => (U(), te("aside", X0, [
      s[0] || (s[0] = b("div", { class: "fb-panel-header" }, [
        b("div", null, [
          b("h2", { class: "fb-panel-title" }, "Node Library"),
          b("small", { class: "fb-muted" }, "Add a building block")
        ])
      ], -1)),
      b("div", j0, [
        (U(!0), te(Ne, null, ct(n.value, (r) => (U(), te("button", {
          key: r,
          class: "fb-library-item",
          type: "button",
          draggable: "true",
          onDragstart: (l) => o(l, r)
        }, [
          b("span", null, he(L(gt)[r].icon), 1),
          b("strong", null, he(L(gt)[r].label), 1),
          b("small", null, he(L(gt)[r].description), 1)
        ], 40, q0))), 128))
      ])
    ]));
  }
}, J0 = /* @__PURE__ */ bt(Z0, [["__scopeId", "data-v-5f48a140"]]);
var Yt = /* @__PURE__ */ ((e) => (e.Lines = "lines", e.Dots = "dots", e))(Yt || {});
const Pc = function({ dimensions: e, size: t, color: n }) {
  return $e("path", {
    stroke: n,
    "stroke-width": t,
    d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`
  });
}, Ac = function({ radius: e, color: t }) {
  return $e("circle", { cx: e, cy: e, r: e, fill: t });
};
Yt.Lines + "", Yt.Dots + "";
const Q0 = {
  [Yt.Dots]: "#81818a",
  [Yt.Lines]: "#eee"
}, e_ = ["id", "x", "y", "width", "height", "patternTransform"], t_ = {
  key: 2,
  height: "100",
  width: "100"
}, n_ = ["fill"], o_ = ["x", "y", "fill"], i_ = {
  name: "Background",
  compatConfig: { MODE: 3 }
}, s_ = /* @__PURE__ */ ze({
  ...i_,
  props: {
    id: {},
    variant: { default: () => Yt.Dots },
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
    const { id: t, viewport: n } = Re(), o = se(() => {
      const r = n.value.zoom, [l, a] = Array.isArray(e.gap) ? e.gap : [e.gap, e.gap], u = [l * r || 1, a * r || 1], c = e.size * r, [d, h] = Array.isArray(e.offset) ? e.offset : [e.offset, e.offset], v = [d * r || 1 + u[0] / 2, h * r || 1 + u[1] / 2];
      return {
        scaledGap: u,
        offset: v,
        size: c
      };
    }), i = /* @__PURE__ */ Oe(() => `pattern-${t}${e.id ? `-${e.id}` : ""}`), s = /* @__PURE__ */ Oe(() => e.color || e.patternColor || Q0[e.variant || Yt.Dots]);
    return (r, l) => (U(), te("svg", {
      class: "vue-flow__background vue-flow__container",
      style: at({
        height: `${r.height > 100 ? 100 : r.height}%`,
        width: `${r.width > 100 ? 100 : r.width}%`
      })
    }, [
      At(r.$slots, "pattern-container", { id: i.value }, () => [
        b("pattern", {
          id: i.value,
          x: L(n).x % o.value.scaledGap[0],
          y: L(n).y % o.value.scaledGap[1],
          width: o.value.scaledGap[0],
          height: o.value.scaledGap[1],
          patternTransform: `translate(-${o.value.offset[0]},-${o.value.offset[1]})`,
          patternUnits: "userSpaceOnUse"
        }, [
          At(r.$slots, "pattern", {}, () => [
            r.variant === L(Yt).Lines ? (U(), Be(L(Pc), {
              key: 0,
              size: r.lineWidth,
              color: s.value,
              dimensions: o.value.scaledGap
            }, null, 8, ["size", "color", "dimensions"])) : r.variant === L(Yt).Dots ? (U(), Be(L(Ac), {
              key: 1,
              color: s.value,
              radius: o.value.size / 2
            }, null, 8, ["color", "radius"])) : Le("", !0),
            r.bgColor ? (U(), te("svg", t_, [
              b("rect", {
                width: "100%",
                height: "100%",
                fill: r.bgColor
              }, null, 8, n_)
            ])) : Le("", !0)
          ])
        ], 8, e_)
      ]),
      b("rect", {
        x: r.x,
        y: r.y,
        width: "100%",
        height: "100%",
        fill: `url(#${i.value})`
      }, null, 8, o_),
      At(r.$slots, "default", { id: i.value })
    ], 4));
  }
}), r_ = { class: "fb-node-top" }, l_ = { class: "fb-node-icon" }, a_ = {
  key: 0,
  class: "fb-condition-outputs"
}, u_ = {
  __name: "BaseNode",
  props: {
    id: {
      type: String,
      required: !0
    }
  },
  setup(e) {
    const t = e, n = cn(), o = Uo(), i = /* @__PURE__ */ De(!1), s = /* @__PURE__ */ De(null), r = se(() => n.nodes.find((E) => E.id === t.id)), l = se(() => {
      var E;
      return gt[(E = r.value) == null ? void 0 : E.type] || gt.prompt;
    }), a = se(() => n.selectedNodeId === t.id), u = se(() => {
      var E;
      return ((E = r.value) == null ? void 0 : E.type) === "condition";
    }), c = se(() => {
      var T, S;
      if (!u.value) return [];
      const E = (S = (T = r.value) == null ? void 0 : T.config) == null ? void 0 : S.conditions;
      return Array.isArray(E) && E.length ? E : [{ id: "condition_1" }];
    });
    kt(() => {
      document.addEventListener("click", d);
    }), Xi(() => {
      document.removeEventListener("click", d);
    });
    function d(E) {
      var T;
      i.value && ((T = s.value) != null && T.contains(E.target) || h());
    }
    function h() {
      i.value = !1;
    }
    function v() {
      r.value && (window.confirm(`Delete "${r.value.id}" and its connected edges?`) && n.deleteNode(r.value.id), h());
    }
    function N() {
      n.toggleNodeDisabled(t.id), h();
    }
    function x() {
      n.duplicateNode(t.id), h();
    }
    function M() {
      n.setNodeStatus(t.id, "success"), o.addLog({
        nodeId: t.id,
        status: "success",
        durationMs: 0,
        output: { executedStep: !0 }
      }), h();
    }
    return (E, T) => {
      var S, C, H, j, K, F;
      return U(), te("div", {
        class: Kt(["fb-node", [
          `is-${((S = r.value) == null ? void 0 : S.status) || "idle"}`,
          `type-${(C = r.value) == null ? void 0 : C.type}`,
          { "is-selected": a.value, "is-disabled": (H = r.value) == null ? void 0 : H.disabled }
        ]]),
        onDblclick: T[2] || (T[2] = mo((G) => L(n).inspectNode(e.id), ["stop"]))
      }, [
        we(L(xn), {
          type: "target",
          position: L(le).Left
        }, null, 8, ["position"]),
        b("div", {
          ref_key: "menuRef",
          ref: s,
          class: "fb-node-menu-wrap"
        }, [
          b("button", {
            class: "fb-node-menu-trigger",
            type: "button",
            title: "Node actions",
            onClick: T[0] || (T[0] = mo((G) => i.value = !i.value, ["stop"]))
          }, " ⋮ "),
          i.value ? (U(), te("div", {
            key: 0,
            class: "fb-node-menu",
            onClick: T[1] || (T[1] = mo(() => {
            }, ["stop"]))
          }, [
            b("button", {
              type: "button",
              onClick: v
            }, [...T[3] || (T[3] = [
              b("span", null, "⌫", -1),
              kn("Delete", -1)
            ])]),
            b("button", {
              type: "button",
              onClick: N
            }, [
              b("span", null, he((j = r.value) != null && j.disabled ? "⏻" : "⊘"), 1),
              kn(he((K = r.value) != null && K.disabled ? "Enable" : "Disable"), 1)
            ]),
            b("button", {
              type: "button",
              onClick: x
            }, [...T[4] || (T[4] = [
              b("span", null, "⧉", -1),
              kn("Duplicate", -1)
            ])]),
            b("button", {
              type: "button",
              onClick: M
            }, [...T[5] || (T[5] = [
              b("span", null, "▶", -1),
              kn("Execute step", -1)
            ])])
          ])) : Le("", !0)
        ], 512),
        b("div", r_, [
          b("span", l_, he(l.value.icon), 1),
          b("div", null, [
            b("strong", null, he(((F = r.value) == null ? void 0 : F.label) || l.value.label), 1),
            b("small", null, he(e.id), 1)
          ])
        ]),
        u.value ? (U(), te("div", a_, [
          (U(!0), te(Ne, null, ct(c.value, (G, X) => (U(), te("div", {
            key: G.id,
            class: "fb-condition-output"
          }, [
            b("span", null, "Condition " + he(X + 1), 1),
            we(L(xn), {
              id: G.id,
              type: "source",
              position: L(le).Right,
              class: "fb-condition-handle"
            }, null, 8, ["id", "position"])
          ]))), 128))
        ])) : (U(), Be(L(xn), {
          key: 1,
          id: "success",
          type: "source",
          position: L(le).Right
        }, null, 8, ["position"]))
      ], 34);
    };
  }
}, Mn = /* @__PURE__ */ bt(u_, [["__scopeId", "data-v-91d1f803"]]), c_ = {
  __name: "InputNode",
  props: { id: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (U(), Be(Mn, { id: e.id }, null, 8, ["id"]));
  }
}, d_ = {
  __name: "HttpRequestNode",
  props: { id: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (U(), Be(Mn, { id: e.id }, null, 8, ["id"]));
  }
}, f_ = {
  __name: "RestApiNode",
  props: { id: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (U(), Be(Mn, { id: e.id }, null, 8, ["id"]));
  }
}, p_ = {
  __name: "PromptNode",
  props: { id: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (U(), Be(Mn, { id: e.id }, null, 8, ["id"]));
  }
}, h_ = {
  __name: "JavascriptNode",
  props: { id: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (U(), Be(Mn, { id: e.id }, null, 8, ["id"]));
  }
}, g_ = {
  __name: "PostNode",
  props: { id: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (U(), Be(Mn, { id: e.id }, null, 8, ["id"]));
  }
}, v_ = {
  __name: "ConditionNode",
  props: { id: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (U(), Be(Mn, { id: e.id }, null, 8, ["id"]));
  }
}, m_ = {
  __name: "FlowCanvas",
  setup(e) {
    const t = cn(), { screenToFlowCoordinate: n, fitView: o, zoomIn: i, zoomOut: s, setViewport: r } = Re(), l = {
      input: nt(c_),
      http_request: nt(d_),
      rest_api: nt(f_),
      prompt: nt(p_),
      javascript: nt(h_),
      post: nt(g_),
      condition: nt(v_)
    };
    function a({ node: M }) {
      t.selectNode(M.id);
    }
    function u({ node: M }) {
      t.inspectNode(M.id);
    }
    function c(M) {
      const E = M.dataTransfer.getData("application/x-flow-node");
      if (!E) return;
      const T = n({
        x: M.clientX,
        y: M.clientY
      });
      t.addNode(E, T);
    }
    function d() {
      o({ padding: 0.2 });
    }
    function h() {
      i();
    }
    function v() {
      s();
    }
    function N() {
      r({ x: 0, y: 0, zoom: 1 });
    }
    async function x() {
      t.tidyNodes(), await rt(), o({ padding: 0.2 });
    }
    return (M, E) => (U(), te("section", {
      class: "fb-canvas",
      onDragover: E[0] || (E[0] = mo(() => {
      }, ["prevent"])),
      onDrop: c
    }, [
      we(L(E0), {
        nodes: L(t).nodes,
        edges: L(t).edges,
        "node-types": l,
        "fit-view-on-init": "",
        "min-zoom": 0.1,
        "max-zoom": 2,
        onNodesChange: L(t).onNodesChange,
        onEdgesChange: L(t).onEdgesChange,
        onConnect: L(t).onConnect,
        onNodeClick: a,
        onNodeDoubleClick: u
      }, {
        default: No(() => [
          we(L(s_), {
            "pattern-color": "#2f2f33",
            gap: 24
          })
        ]),
        _: 1
      }, 8, ["nodes", "edges", "onNodesChange", "onEdgesChange", "onConnect"]),
      b("div", {
        class: "fb-canvas-controls",
        "aria-label": "Canvas controls"
      }, [
        b("button", {
          type: "button",
          title: "Zoom to fit",
          onClick: d
        }, "⛶"),
        b("button", {
          type: "button",
          title: "Zoom in",
          "aria-label": "Zoom in",
          onClick: h
        }, [...E[1] || (E[1] = [
          mu('<svg viewBox="0 0 24 24" aria-hidden="true" data-v-40d5c044><circle cx="10.5" cy="10.5" r="6.5" data-v-40d5c044></circle><path d="M15.3 15.3 21 21" data-v-40d5c044></path><path d="M10.5 7.5v6" data-v-40d5c044></path><path d="M7.5 10.5h6" data-v-40d5c044></path></svg>', 1)
        ])]),
        b("button", {
          type: "button",
          title: "Zoom out",
          "aria-label": "Zoom out",
          onClick: v
        }, [...E[2] || (E[2] = [
          b("svg", {
            viewBox: "0 0 24 24",
            "aria-hidden": "true"
          }, [
            b("circle", {
              cx: "10.5",
              cy: "10.5",
              r: "6.5"
            }),
            b("path", { d: "M15.3 15.3 21 21" }),
            b("path", { d: "M7.5 10.5h6" })
          ], -1)
        ])]),
        b("button", {
          type: "button",
          title: "Reset zoom",
          onClick: N
        }, "↺"),
        b("button", {
          class: "is-accent",
          type: "button",
          title: "Tidy up",
          onClick: x
        }, "⌁")
      ])
    ], 32));
  }
}, y_ = /* @__PURE__ */ bt(m_, [["__scopeId", "data-v-40d5c044"]]), __ = { class: "fb-field" }, b_ = { class: "fb-field" }, w_ = {
  __name: "InputConfig",
  props: { node: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = se(() => t.node.config);
    return (o, i) => (U(), te("form", null, [
      b("div", __, [
        i[3] || (i[3] = b("label", null, "Input Type", -1)),
        _e(b("select", {
          "onUpdate:modelValue": i[0] || (i[0] = (s) => n.value.format = s),
          class: "fb-select"
        }, [...i[2] || (i[2] = [
          b("option", { value: "json" }, "JSON", -1),
          b("option", { value: "text" }, "Text", -1)
        ])], 512), [
          [dt, n.value.format]
        ])
      ]),
      b("div", b_, [
        i[4] || (i[4] = b("label", null, "Value", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": i[1] || (i[1] = (s) => n.value.value = s),
          class: "fb-textarea fb-input-value"
        }, null, 512), [
          [ke, n.value.value]
        ])
      ])
    ]));
  }
}, Oc = /* @__PURE__ */ bt(w_, [["__scopeId", "data-v-37fa6ac5"]]), x_ = { class: "fb-field" }, S_ = { class: "fb-field" }, E_ = { class: "fb-field" }, N_ = { class: "fb-field" }, C_ = { class: "fb-field" }, $_ = { class: "fb-field" }, Dc = {
  __name: "HttpRequestConfig",
  props: { node: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = se(() => t.node.config), o = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    return (i, s) => (U(), te("form", null, [
      b("div", x_, [
        s[6] || (s[6] = b("label", null, "Method", -1)),
        _e(b("select", {
          "onUpdate:modelValue": s[0] || (s[0] = (r) => n.value.method = r),
          class: "fb-select"
        }, [
          (U(), te(Ne, null, ct(o, (r) => b("option", { key: r }, he(r), 1)), 64))
        ], 512), [
          [dt, n.value.method]
        ])
      ]),
      b("div", S_, [
        s[7] || (s[7] = b("label", null, "URL", -1)),
        _e(b("input", {
          "onUpdate:modelValue": s[1] || (s[1] = (r) => n.value.url = r),
          class: "fb-input",
          placeholder: "https://api.example.com/data"
        }, null, 512), [
          [ke, n.value.url]
        ])
      ]),
      b("div", E_, [
        s[8] || (s[8] = b("label", null, "Headers", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": s[2] || (s[2] = (r) => n.value.headers = r),
          class: "fb-textarea",
          placeholder: '{"Authorization":"Bearer token"}'
        }, null, 512), [
          [ke, n.value.headers]
        ])
      ]),
      b("div", N_, [
        s[9] || (s[9] = b("label", null, "Body", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": s[3] || (s[3] = (r) => n.value.body = r),
          class: "fb-textarea",
          placeholder: '{"query":"{{input_data.output.value.topic}}"}'
        }, null, 512), [
          [ke, n.value.body]
        ])
      ]),
      b("div", C_, [
        s[11] || (s[11] = b("label", null, "Response Format", -1)),
        _e(b("select", {
          "onUpdate:modelValue": s[4] || (s[4] = (r) => n.value.responseFormat = r),
          class: "fb-select"
        }, [...s[10] || (s[10] = [
          b("option", { value: "json" }, "JSON", -1),
          b("option", { value: "text" }, "Text", -1)
        ])], 512), [
          [dt, n.value.responseFormat]
        ])
      ]),
      b("div", $_, [
        s[12] || (s[12] = b("label", null, "Timeout", -1)),
        _e(b("input", {
          "onUpdate:modelValue": s[5] || (s[5] = (r) => n.value.timeout = r),
          class: "fb-input",
          type: "number",
          min: "1000"
        }, null, 512), [
          [
            ke,
            n.value.timeout,
            void 0,
            { number: !0 }
          ]
        ])
      ])
    ]));
  }
}, M_ = { class: "fb-field" }, I_ = { class: "fb-field" }, T_ = { class: "fb-field" }, P_ = { class: "fb-field" }, A_ = { class: "fb-field" }, O_ = { class: "fb-field" }, D_ = { class: "fb-field" }, kc = {
  __name: "RestApiConfig",
  props: { node: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = se(() => t.node.config), o = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    return (i, s) => (U(), te("form", null, [
      b("div", M_, [
        s[7] || (s[7] = b("label", null, "Method", -1)),
        _e(b("select", {
          "onUpdate:modelValue": s[0] || (s[0] = (r) => n.value.method = r),
          class: "fb-select"
        }, [
          (U(), te(Ne, null, ct(o, (r) => b("option", { key: r }, he(r), 1)), 64))
        ], 512), [
          [dt, n.value.method]
        ])
      ]),
      b("div", I_, [
        s[8] || (s[8] = b("label", null, "URL", -1)),
        _e(b("input", {
          "onUpdate:modelValue": s[1] || (s[1] = (r) => n.value.url = r),
          class: "fb-input"
        }, null, 512), [
          [ke, n.value.url]
        ])
      ]),
      b("div", T_, [
        s[9] || (s[9] = b("label", null, "Headers", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": s[2] || (s[2] = (r) => n.value.headers = r),
          class: "fb-textarea",
          placeholder: '{"Authorization":"Bearer ..."}'
        }, null, 512), [
          [ke, n.value.headers]
        ])
      ]),
      b("div", P_, [
        s[10] || (s[10] = b("label", null, "Body", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": s[3] || (s[3] = (r) => n.value.body = r),
          class: "fb-textarea"
        }, null, 512), [
          [ke, n.value.body]
        ])
      ]),
      b("div", A_, [
        s[12] || (s[12] = b("label", null, "Auth", -1)),
        _e(b("select", {
          "onUpdate:modelValue": s[4] || (s[4] = (r) => n.value.auth = r),
          class: "fb-select"
        }, [...s[11] || (s[11] = [
          b("option", { value: "none" }, "None", -1),
          b("option", { value: "bearer" }, "Bearer Token", -1),
          b("option", { value: "api_key" }, "API Key", -1),
          b("option", { value: "basic" }, "Basic Auth", -1)
        ])], 512), [
          [dt, n.value.auth]
        ])
      ]),
      b("div", O_, [
        s[13] || (s[13] = b("label", null, "Timeout", -1)),
        _e(b("input", {
          "onUpdate:modelValue": s[5] || (s[5] = (r) => n.value.timeout = r),
          class: "fb-input",
          type: "number",
          min: "1000"
        }, null, 512), [
          [
            ke,
            n.value.timeout,
            void 0,
            { number: !0 }
          ]
        ])
      ]),
      b("div", D_, [
        s[14] || (s[14] = b("label", null, "Retry", -1)),
        _e(b("input", {
          "onUpdate:modelValue": s[6] || (s[6] = (r) => n.value.retry = r),
          class: "fb-input",
          type: "number",
          min: "0",
          max: "5"
        }, null, 512), [
          [
            ke,
            n.value.retry,
            void 0,
            { number: !0 }
          ]
        ])
      ])
    ]));
  }
}, k_ = { class: "fb-field" }, R_ = { class: "fb-field" }, V_ = { class: "fb-field" }, B_ = { class: "fb-field" }, z_ = { class: "fb-field" }, H_ = { class: "fb-field" }, F_ = { class: "fb-field" }, Ai = {
  __name: "PromptConfig",
  props: { node: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = se(() => t.node.config);
    return (o, i) => (U(), te("form", null, [
      b("div", k_, [
        i[8] || (i[8] = b("label", null, "Model", -1)),
        _e(b("select", {
          "onUpdate:modelValue": i[0] || (i[0] = (s) => n.value.model = s),
          class: "fb-select"
        }, [...i[7] || (i[7] = [
          mu('<option value="claude-sonnet">Claude Sonnet</option><option value="claude-haiku">Claude Haiku</option><option value="gpt-4o">GPT-4o</option><option value="gpt-4o-mini">GPT-4o-mini</option><option value="gemini-1.5-pro">Gemini 1.5 Pro</option><option value="gemini-flash">Gemini Flash</option><option value="mixtral">Mixtral</option>', 7)
        ])], 512), [
          [dt, n.value.model]
        ])
      ]),
      b("div", R_, [
        i[9] || (i[9] = b("label", null, "System Prompt", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": i[1] || (i[1] = (s) => n.value.systemPrompt = s),
          class: "fb-textarea"
        }, null, 512), [
          [ke, n.value.systemPrompt]
        ])
      ]),
      b("div", V_, [
        i[10] || (i[10] = b("label", null, "User Prompt", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": i[2] || (i[2] = (s) => n.value.userPrompt = s),
          class: "fb-textarea"
        }, null, 512), [
          [ke, n.value.userPrompt]
        ])
      ]),
      b("div", B_, [
        b("label", null, "Temperature " + he(n.value.temperature), 1),
        _e(b("input", {
          "onUpdate:modelValue": i[3] || (i[3] = (s) => n.value.temperature = s),
          type: "range",
          min: "0",
          max: "1",
          step: "0.1"
        }, null, 512), [
          [
            ke,
            n.value.temperature,
            void 0,
            { number: !0 }
          ]
        ])
      ]),
      b("div", z_, [
        i[11] || (i[11] = b("label", null, "Max Tokens", -1)),
        _e(b("input", {
          "onUpdate:modelValue": i[4] || (i[4] = (s) => n.value.maxTokens = s),
          class: "fb-input",
          type: "number"
        }, null, 512), [
          [
            ke,
            n.value.maxTokens,
            void 0,
            { number: !0 }
          ]
        ])
      ]),
      b("div", H_, [
        i[13] || (i[13] = b("label", null, "Output Format", -1)),
        _e(b("select", {
          "onUpdate:modelValue": i[5] || (i[5] = (s) => n.value.outputFormat = s),
          class: "fb-select"
        }, [...i[12] || (i[12] = [
          b("option", { value: "text" }, "Plain text", -1),
          b("option", { value: "json" }, "JSON", -1),
          b("option", { value: "markdown" }, "Markdown", -1)
        ])], 512), [
          [dt, n.value.outputFormat]
        ])
      ]),
      b("div", F_, [
        i[14] || (i[14] = b("label", null, "Variants", -1)),
        _e(b("input", {
          "onUpdate:modelValue": i[6] || (i[6] = (s) => n.value.variants = s),
          class: "fb-input",
          type: "number",
          min: "1",
          max: "5"
        }, null, 512), [
          [
            ke,
            n.value.variants,
            void 0,
            { number: !0 }
          ]
        ])
      ])
    ]));
  }
}, L_ = { class: "fb-field" }, U_ = { class: "fb-field" }, G_ = { class: "fb-field" }, Y_ = {
  __name: "JavascriptConfig",
  props: { node: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = se(() => t.node.config);
    return (o, i) => (U(), te("form", null, [
      b("div", L_, [
        i[3] || (i[3] = b("label", null, "Code", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": i[0] || (i[0] = (s) => n.value.code = s),
          class: "fb-textarea fb-code"
        }, null, 512), [
          [ke, n.value.code]
        ])
      ]),
      b("div", U_, [
        i[4] || (i[4] = b("label", null, "Timeout", -1)),
        _e(b("input", {
          "onUpdate:modelValue": i[1] || (i[1] = (s) => n.value.timeout = s),
          class: "fb-input",
          type: "number",
          min: "1000",
          max: "30000"
        }, null, 512), [
          [
            ke,
            n.value.timeout,
            void 0,
            { number: !0 }
          ]
        ])
      ]),
      b("div", G_, [
        i[5] || (i[5] = b("label", null, "Memory Limit MB", -1)),
        _e(b("input", {
          "onUpdate:modelValue": i[2] || (i[2] = (s) => n.value.memoryLimit = s),
          class: "fb-input",
          type: "number",
          min: "16",
          max: "256"
        }, null, 512), [
          [
            ke,
            n.value.memoryLimit,
            void 0,
            { number: !0 }
          ]
        ])
      ])
    ]));
  }
}, Rc = /* @__PURE__ */ bt(Y_, [["__scopeId", "data-v-0b7483a3"]]), W_ = { class: "fb-field" }, K_ = ["value"], X_ = { class: "fb-field" }, j_ = { class: "fb-field" }, q_ = { class: "fb-field" }, Z_ = { class: "fb-field" }, J_ = { class: "fb-field" }, Vc = {
  __name: "PostConfig",
  props: { node: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Or(), o = se(() => t.node.config);
    return (i, s) => (U(), te("form", null, [
      b("div", W_, [
        s[6] || (s[6] = b("label", null, "Accounts", -1)),
        _e(b("select", {
          "onUpdate:modelValue": s[0] || (s[0] = (r) => o.value.accounts = r),
          class: "fb-select",
          multiple: ""
        }, [
          (U(!0), te(Ne, null, ct(L(n).accounts, (r) => (U(), te("option", {
            key: r.id,
            value: r.id
          }, he(r.name) + " · " + he(r.platform), 9, K_))), 128))
        ], 512), [
          [dt, o.value.accounts]
        ])
      ]),
      b("div", X_, [
        s[7] || (s[7] = b("label", null, "Caption / Text", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": s[1] || (s[1] = (r) => o.value.caption = r),
          class: "fb-textarea"
        }, null, 512), [
          [ke, o.value.caption]
        ])
      ]),
      b("div", j_, [
        s[8] || (s[8] = b("label", null, "Media", -1)),
        _e(b("input", {
          "onUpdate:modelValue": s[2] || (s[2] = (r) => o.value.media = r),
          class: "fb-input"
        }, null, 512), [
          [ke, o.value.media]
        ])
      ]),
      b("div", q_, [
        s[10] || (s[10] = b("label", null, "Schedule", -1)),
        _e(b("select", {
          "onUpdate:modelValue": s[3] || (s[3] = (r) => o.value.schedule = r),
          class: "fb-select"
        }, [...s[9] || (s[9] = [
          b("option", { value: "now" }, "Publish now", -1),
          b("option", { value: "datetime" }, "At specific datetime", -1),
          b("option", { value: "optimal" }, "Optimal time", -1)
        ])], 512), [
          [dt, o.value.schedule]
        ])
      ]),
      b("div", Z_, [
        s[11] || (s[11] = b("label", null, "First Comment", -1)),
        _e(b("textarea", {
          "onUpdate:modelValue": s[4] || (s[4] = (r) => o.value.firstComment = r),
          class: "fb-textarea"
        }, null, 512), [
          [ke, o.value.firstComment]
        ])
      ]),
      b("div", J_, [
        s[13] || (s[13] = b("label", null, "Failure Behavior", -1)),
        _e(b("select", {
          "onUpdate:modelValue": s[5] || (s[5] = (r) => o.value.failureBehavior = r),
          class: "fb-select"
        }, [...s[12] || (s[12] = [
          b("option", { value: "stop" }, "Stop flow", -1),
          b("option", { value: "skip" }, "Skip platform", -1),
          b("option", { value: "retry" }, "Retry 3x", -1),
          b("option", { value: "notify" }, "Notify only", -1)
        ])], 512), [
          [dt, o.value.failureBehavior]
        ])
      ])
    ]));
  }
}, Q_ = { class: "fb-condition-config" }, eb = { class: "fb-condition-list" }, tb = { class: "fb-condition-row-header" }, nb = ["disabled", "onClick"], ob = { class: "fb-field" }, ib = ["onUpdate:modelValue"], sb = { class: "fb-condition-grid" }, rb = { class: "fb-field" }, lb = ["onUpdate:modelValue", "onChange"], ab = ["value"], ub = { class: "fb-field" }, cb = ["onUpdate:modelValue"], db = ["value"], fb = {
  key: 0,
  class: "fb-field"
}, pb = ["onUpdate:modelValue"], hb = {
  __name: "ConditionConfig",
  props: { node: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = cn(), o = se(() => t.node.config), i = [
      { value: "string", label: "String" },
      { value: "number", label: "Number" },
      { value: "boolean", label: "Boolean" },
      { value: "array", label: "Array" },
      { value: "object", label: "Object" }
    ], s = {
      string: [
        { value: "equals", label: "equals" },
        { value: "not_equals", label: "does not equal" },
        { value: "contains", label: "contains" },
        { value: "not_contains", label: "does not contain" },
        { value: "starts_with", label: "starts with" },
        { value: "ends_with", label: "ends with" },
        { value: "is_empty", label: "is empty" },
        { value: "is_not_empty", label: "is not empty" }
      ],
      number: [
        { value: "equals", label: "equals" },
        { value: "not_equals", label: "does not equal" },
        { value: "greater_than", label: "is greater than" },
        { value: "greater_equal", label: "is greater than or equal" },
        { value: "less_than", label: "is less than" },
        { value: "less_equal", label: "is less than or equal" },
        { value: "is_empty", label: "is empty" },
        { value: "is_not_empty", label: "is not empty" }
      ],
      boolean: [
        { value: "is_true", label: "is true" },
        { value: "is_false", label: "is false" },
        { value: "equals", label: "equals" }
      ],
      array: [
        { value: "contains", label: "contains" },
        { value: "is_empty", label: "is empty" },
        { value: "is_not_empty", label: "is not empty" }
      ],
      object: [
        { value: "has_key", label: "has key" },
        { value: "is_empty", label: "is empty" },
        { value: "is_not_empty", label: "is not empty" }
      ]
    }, r = /* @__PURE__ */ new Set(["is_empty", "is_not_empty", "is_true", "is_false"]);
    be(
      o,
      (v) => {
        (!Array.isArray(v.conditions) || !v.conditions.length) && (v.conditions = [h(1)]);
      },
      { immediate: !0 }
    );
    function l(v) {
      return s[v] || s.string;
    }
    function a(v) {
      const N = l(v.dataType);
      N.some((x) => x.value === v.operation) || (v.operation = N[0].value);
    }
    function u(v) {
      return !r.has(v);
    }
    function c() {
      o.value.conditions.push(h(o.value.conditions.length + 1));
    }
    function d(v) {
      o.value.conditions.length !== 1 && (n.removeSourceHandleEdges(t.node.id, o.value.conditions[v].id), o.value.conditions.splice(v, 1));
    }
    function h(v) {
      return {
        id: `condition_${Date.now()}_${v}`,
        dataType: "string",
        operation: "equals",
        left: "",
        right: ""
      };
    }
    return (v, N) => (U(), te("form", Q_, [
      b("section", eb, [
        (U(!0), te(Ne, null, ct(o.value.conditions, (x, M) => (U(), te("article", {
          key: x.id,
          class: "fb-condition-row"
        }, [
          b("div", tb, [
            b("strong", null, "Condition " + he(M + 1), 1),
            b("button", {
              class: "fb-remove-condition",
              type: "button",
              title: "Remove condition",
              disabled: o.value.conditions.length === 1,
              onClick: (E) => d(M)
            }, " - ", 8, nb)
          ]),
          b("div", ob, [
            N[0] || (N[0] = b("label", null, "Value 1", -1)),
            _e(b("input", {
              "onUpdate:modelValue": (E) => x.left = E,
              class: "fb-input",
              placeholder: "{{write_caption.meta.tokensUsed}}"
            }, null, 8, ib), [
              [ke, x.left]
            ])
          ]),
          b("div", sb, [
            b("div", rb, [
              N[1] || (N[1] = b("label", null, "Type", -1)),
              _e(b("select", {
                "onUpdate:modelValue": (E) => x.dataType = E,
                class: "fb-select",
                onChange: (E) => a(x)
              }, [
                (U(), te(Ne, null, ct(i, (E) => b("option", {
                  key: E.value,
                  value: E.value
                }, he(E.label), 9, ab)), 64))
              ], 40, lb), [
                [dt, x.dataType]
              ])
            ]),
            b("div", ub, [
              N[2] || (N[2] = b("label", null, "Operation", -1)),
              _e(b("select", {
                "onUpdate:modelValue": (E) => x.operation = E,
                class: "fb-select"
              }, [
                (U(!0), te(Ne, null, ct(l(x.dataType), (E) => (U(), te("option", {
                  key: E.value,
                  value: E.value
                }, he(E.label), 9, db))), 128))
              ], 8, cb), [
                [dt, x.operation]
              ])
            ])
          ]),
          u(x.operation) ? (U(), te("div", fb, [
            N[3] || (N[3] = b("label", null, "Value 2", -1)),
            _e(b("input", {
              "onUpdate:modelValue": (E) => x.right = E,
              class: "fb-input",
              placeholder: "300"
            }, null, 8, pb), [
              [ke, x.right]
            ])
          ])) : Le("", !0)
        ]))), 128))
      ]),
      b("button", {
        class: "fb-add-condition",
        type: "button",
        onClick: c
      }, "Add condition")
    ]));
  }
}, Bc = /* @__PURE__ */ bt(hb, [["__scopeId", "data-v-7c3490bf"]]), gb = { class: "fb-panel fb-config" }, vb = { class: "fb-panel-header" }, mb = { class: "fb-muted" }, yb = { class: "fb-config-body" }, _b = {
  key: 0,
  class: "fb-config-inner"
}, bb = { class: "fb-field" }, wb = ["value"], xb = { class: "fb-field" }, Sb = { class: "fb-display-value" }, Eb = {
  key: 1,
  class: "fb-empty"
}, Nb = {
  __name: "ConfigPanel",
  setup(e) {
    const t = cn(), n = se(() => t.selectedNode), o = se(() => {
      var s, r, l;
      return ((r = gt[(s = n.value) == null ? void 0 : s.type]) == null ? void 0 : r.label) || ((l = n.value) == null ? void 0 : l.type) || "";
    }), i = se(() => {
      var s;
      return {
        input: Oc,
        http_request: Dc,
        rest_api: kc,
        prompt: Ai,
        javascript: Rc,
        post: Vc,
        condition: Bc
      }[(s = n.value) == null ? void 0 : s.type] || Ai;
    });
    return (s, r) => (U(), te("aside", gb, [
      b("div", vb, [
        b("div", null, [
          r[1] || (r[1] = b("h2", { class: "fb-panel-title" }, "Properties", -1)),
          b("small", mb, he(n.value ? n.value.id : "No node selected"), 1)
        ])
      ]),
      b("section", yb, [
        n.value ? (U(), te("div", _b, [
          b("div", bb, [
            r[2] || (r[2] = b("label", null, "Node ID", -1)),
            b("input", {
              class: "fb-input",
              value: n.value.id,
              onChange: r[0] || (r[0] = (l) => L(t).renameSelectedNode(l.target.value))
            }, null, 40, wb)
          ]),
          b("div", xb, [
            r[3] || (r[3] = b("label", null, "Node Type", -1)),
            b("div", Sb, he(o.value), 1)
          ]),
          (U(), Be(gr(i.value), { node: n.value }, null, 8, ["node"]))
        ])) : (U(), te("div", Eb, "Select a node to edit its settings."))
      ])
    ]));
  }
}, Cb = /* @__PURE__ */ bt(Nb, [["__scopeId", "data-v-be60b55e"]]), $b = { class: "fb-run-log" }, Mb = { class: "fb-run-summary" }, Ib = { class: "fb-log-items" }, Tb = { key: 0 }, Pb = {
  key: 0,
  class: "fb-muted"
}, Ab = {
  __name: "RunLog",
  setup(e) {
    const t = Uo();
    return (n, o) => (U(), te("section", $b, [
      b("div", Mb, [
        o[0] || (o[0] = b("strong", null, "Run Log", -1)),
        b("span", null, he(L(t).status) + " · " + he(L(t).log.length) + " entries", 1)
      ]),
      b("div", Ib, [
        (U(!0), te(Ne, null, ct(L(t).log.slice(0, 4), (i) => (U(), te("article", {
          key: `${i.at}-${i.nodeId}`,
          class: "fb-log-item"
        }, [
          b("strong", null, he(i.nodeId), 1),
          b("span", null, he(i.status) + " · " + he(i.durationMs) + "ms", 1),
          i.errorMessage ? (U(), te("code", Tb, he(i.errorMessage), 1)) : Le("", !0)
        ]))), 128)),
        L(t).log.length ? Le("", !0) : (U(), te("p", Pb, "Run the flow to inspect per-node traces."))
      ])
    ]));
  }
}, Ob = /* @__PURE__ */ bt(Ab, [["__scopeId", "data-v-b26175e6"]]), Db = ["aria-label"], kb = { class: "fb-execution-topbar" }, Rb = { class: "fb-execution-grid" }, Vb = { class: "fb-data-pane" }, Bb = { key: 0 }, zb = {
  key: 1,
  class: "fb-empty-data"
}, Hb = { class: "fb-node-pane" }, Fb = { class: "fb-node-pane-header" }, Lb = { class: "fb-node-pane-icon" }, Ub = { class: "fb-node-config" }, Gb = { class: "fb-field" }, Yb = { class: "fb-display-value" }, Wb = { class: "fb-data-pane" }, Kb = { key: 0 }, Xb = {
  key: 1,
  class: "fb-empty-data"
}, jb = {
  __name: "NodeExecutionView",
  setup(e) {
    const t = cn(), n = Uo(), o = se(() => t.inspectedNode), i = se(() => {
      var a;
      return gt[(a = o.value) == null ? void 0 : a.type] || gt.prompt;
    }), s = se(() => n.log.find((a) => {
      var u;
      return a.nodeId === ((u = o.value) == null ? void 0 : u.id);
    })), r = se(() => {
      var a;
      return {
        input: Oc,
        http_request: Dc,
        rest_api: kc,
        prompt: Ai,
        javascript: Rc,
        post: Vc,
        condition: Bc
      }[(a = o.value) == null ? void 0 : a.type] || Ai;
    });
    function l(a) {
      return JSON.stringify(a, null, 2);
    }
    return (a, u) => {
      var c, d;
      return U(), te("section", {
        class: "fb-execution-backdrop",
        onClick: u[1] || (u[1] = mo((...h) => L(t).closeNodeInspector && L(t).closeNodeInspector(...h), ["self"]))
      }, [
        b("div", {
          class: "fb-execution-modal",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${o.value.label} execution details`
        }, [
          b("header", kb, [
            b("button", {
              class: "fb-back-btn",
              type: "button",
              onClick: u[0] || (u[0] = (...h) => L(t).closeNodeInspector && L(t).closeNodeInspector(...h))
            }, "← Back to canvas"),
            b("div", null, [
              b("strong", null, he(o.value.label), 1),
              b("span", null, he(o.value.id), 1)
            ])
          ]),
          b("div", Rb, [
            b("section", Vb, [
              u[3] || (u[3] = b("header", null, "Input", -1)),
              (c = s.value) != null && c.inputContext ? (U(), te("pre", Bb, he(l(s.value.inputContext)), 1)) : (U(), te("div", zb, [...u[2] || (u[2] = [
                b("strong", null, "No input data yet", -1),
                b("span", null, "Run the flow to capture the JSON input passed into this node.", -1)
              ])]))
            ]),
            b("section", Hb, [
              b("div", Fb, [
                b("span", Lb, he(i.value.icon), 1),
                b("div", null, [
                  b("strong", null, he(o.value.label), 1),
                  b("span", null, he(i.value.description), 1)
                ])
              ]),
              b("div", Ub, [
                b("div", Gb, [
                  u[4] || (u[4] = b("label", null, "Node ID", -1)),
                  b("div", Yb, he(o.value.id), 1)
                ]),
                (U(), Be(gr(r.value), { node: o.value }, null, 8, ["node"]))
              ])
            ]),
            b("section", Wb, [
              u[6] || (u[6] = b("header", null, "Output", -1)),
              ((d = s.value) == null ? void 0 : d.output) !== void 0 ? (U(), te("pre", Kb, he(l(s.value.output)), 1)) : (U(), te("div", Xb, [...u[5] || (u[5] = [
                b("strong", null, "No output data yet", -1),
                b("span", null, "Execute this node or run the flow to view the latest output.", -1)
              ])]))
            ])
          ])
        ], 8, Db)
      ]);
    };
  }
}, qb = /* @__PURE__ */ bt(jb, [["__scopeId", "data-v-aa21142a"]]), Zb = { class: "fb-workspace" }, Jb = {
  key: 1,
  class: "fb-drawer fb-library-drawer"
}, Qb = {
  key: 2,
  class: "fb-drawer fb-properties-drawer"
}, ew = {
  __name: "AppShell",
  setup(e) {
    const t = ds(), n = cn(), o = /* @__PURE__ */ De(!1), i = /* @__PURE__ */ De(!1);
    function s() {
      i.value = !1, o.value = !0;
    }
    function r() {
      o.value = !1, i.value = !0;
    }
    const l = se(() => {
      const a = t.theme || {};
      return {
        "--fb-accent": a.accent,
        "--fb-font": a.font,
        "--fb-radius": a.radius
      };
    });
    return (a, u) => (U(), te("main", {
      class: "fb-shell",
      style: at(l.value)
    }, [
      we(K0),
      b("section", Zb, [
        we(y_),
        b("div", { class: "fb-canvas-launchers" }, [
          b("button", {
            class: "fb-launcher-btn",
            type: "button",
            title: "Add node",
            onClick: s
          }, "+")
        ]),
        i.value ? Le("", !0) : (U(), te("button", {
          key: 0,
          class: "fb-properties-tab",
          type: "button",
          onClick: r
        }, " Properties ")),
        o.value ? (U(), te("div", Jb, [
          we(J0),
          b("button", {
            class: "fb-drawer-close",
            type: "button",
            title: "Close node library",
            onClick: u[0] || (u[0] = (c) => o.value = !1)
          }, "×")
        ])) : Le("", !0),
        i.value ? (U(), te("div", Qb, [
          we(Cb),
          b("button", {
            class: "fb-drawer-close",
            type: "button",
            title: "Hide properties",
            onClick: u[1] || (u[1] = (c) => i.value = !1)
          }, "×")
        ])) : Le("", !0)
      ]),
      we(Ob),
      L(n).inspectedNode ? (U(), Be(qb, { key: 0 })) : Le("", !0)
    ], 4));
  }
}, tw = /* @__PURE__ */ bt(ew, [["__scopeId", "data-v-7074bbcc"]]), nw = {
  __name: "FlowBuilderApp",
  setup(e) {
    return (t, n) => (U(), Be(tw));
  }
};
function ow(e, t = {}) {
  const n = document.querySelector(e);
  if (!n)
    throw new Error(`FlowBuilder: no element for "${e}"`);
  const o = lp(nw), i = cp();
  return o.use(i), ds(i).init({ ...t, mode: "embedded" }), Or(i).setAccounts(t.accounts || []), o.mount(n), {
    app: o,
    unmount: () => o.unmount()
  };
}
typeof window < "u" && (window.FlowBuilder = { mount: ow });
export {
  ow as mount
};
