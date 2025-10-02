var QFChat = (function (fe) {
  "use strict";
  const pn = "appsettings.json";
  let pe = null;
  async function Be() {
    if (pe) return pe;
    const e = await fetch(pn, { cache: "no-store" });
    if (!e.ok) throw new Error(`config http error: ${e.status}`);
    return (pe = await e.json()), pe;
  }
  async function mn() {
    const e = await Be(),
      t = new URL(location.href).searchParams.get("api");
    if (t) return t;
    if (!e.apiUrl) throw new Error("appsettings.json: missing 'apiUrl'.");
    return String(e.apiUrl);
  }
  async function hn() {
    const e = await Be(),
      t = String(e.journeyCommandPrefix || "/select-journey-");
    return (e.journeys || [])
      .map((r) =>
        r.id && !r.command && !r.value
          ? {
              label: r.label,
              value: `${t}${r.id}`,
              defaultLng: r.defaultLng || r.defaultLanguage || "en",
            }
          : {
              label: r.label,
              value: r.command || r.value,
              defaultLng: r.defaultLng || r.defaultLanguage || "en",
            }
      )
      .filter((r) => r.label && r.value);
  }
  async function yn() {
    const e = await Be(),
      t = (n, r = []) =>
        new Set((Array.isArray(n) ? n : r).map((s) => String(s).toLowerCase()));
    return {
      restart: t(e.commands?.restart, ["/restart"]),
      end: t(e.commands?.end, ["/endjourney"]),
      cancel: t(e.commands?.cancel, ["/cancelapp"]),
      skip: t(e.commands?.skip, ["/skip"]),
      loadMore: t(e.commands?.loadMore, ["/loadmore"]),
      freeText: t(e.commands?.freeText, []),
    };
  }
  function st(e, t) {
    return function () {
      return e.apply(t, arguments);
    };
  }
  const { toString: gn } = Object.prototype,
    { getPrototypeOf: ve } = Object,
    { iterator: me, toStringTag: ot } = Symbol,
    he = ((e) => (t) => {
      const n = gn.call(t);
      return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
    })(Object.create(null)),
    v = (e) => ((e = e.toLowerCase()), (t) => he(t) === e),
    ye = (e) => (t) => typeof t === e,
    { isArray: Y } = Array,
    ee = ye("undefined");
  function te(e) {
    return (
      e !== null &&
      !ee(e) &&
      e.constructor !== null &&
      !ee(e.constructor) &&
      O(e.constructor.isBuffer) &&
      e.constructor.isBuffer(e)
    );
  }
  const it = v("ArrayBuffer");
  function bn(e) {
    let t;
    return (
      typeof ArrayBuffer < "u" && ArrayBuffer.isView
        ? (t = ArrayBuffer.isView(e))
        : (t = e && e.buffer && it(e.buffer)),
      t
    );
  }
  const wn = ye("string"),
    O = ye("function"),
    at = ye("number"),
    ne = (e) => e !== null && typeof e == "object",
    Sn = (e) => e === !0 || e === !1,
    ge = (e) => {
      if (he(e) !== "object") return !1;
      const t = ve(e);
      return (
        (t === null ||
          t === Object.prototype ||
          Object.getPrototypeOf(t) === null) &&
        !(ot in e) &&
        !(me in e)
      );
    },
    En = (e) => {
      if (!ne(e) || te(e)) return !1;
      try {
        return (
          Object.keys(e).length === 0 &&
          Object.getPrototypeOf(e) === Object.prototype
        );
      } catch {
        return !1;
      }
    },
    xn = v("Date"),
    An = v("File"),
    Rn = v("Blob"),
    Cn = v("FileList"),
    Tn = (e) => ne(e) && O(e.pipe),
    kn = (e) => {
      let t;
      return (
        e &&
        ((typeof FormData == "function" && e instanceof FormData) ||
          (O(e.append) &&
            ((t = he(e)) === "formdata" ||
              (t === "object" &&
                O(e.toString) &&
                e.toString() === "[object FormData]"))))
      );
    },
    On = v("URLSearchParams"),
    [Ln, Nn, Bn, vn] = ["ReadableStream", "Request", "Response", "Headers"].map(
      v
    ),
    _n = (e) =>
      e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function re(e, t, { allOwnKeys: n = !1 } = {}) {
    if (e === null || typeof e > "u") return;
    let r, s;
    if ((typeof e != "object" && (e = [e]), Y(e)))
      for (r = 0, s = e.length; r < s; r++) t.call(null, e[r], r, e);
    else {
      if (te(e)) return;
      const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
        i = o.length;
      let c;
      for (r = 0; r < i; r++) (c = o[r]), t.call(null, e[c], c, e);
    }
  }
  function ct(e, t) {
    if (te(e)) return null;
    t = t.toLowerCase();
    const n = Object.keys(e);
    let r = n.length,
      s;
    for (; r-- > 0; ) if (((s = n[r]), t === s.toLowerCase())) return s;
    return null;
  }
  const z =
      typeof globalThis < "u"
        ? globalThis
        : typeof self < "u"
        ? self
        : typeof window < "u"
        ? window
        : global,
    lt = (e) => !ee(e) && e !== z;
  function _e() {
    const { caseless: e } = (lt(this) && this) || {},
      t = {},
      n = (r, s) => {
        const o = (e && ct(t, s)) || s;
        ge(t[o]) && ge(r)
          ? (t[o] = _e(t[o], r))
          : ge(r)
          ? (t[o] = _e({}, r))
          : Y(r)
          ? (t[o] = r.slice())
          : (t[o] = r);
      };
    for (let r = 0, s = arguments.length; r < s; r++)
      arguments[r] && re(arguments[r], n);
    return t;
  }
  const Pn = (e, t, n, { allOwnKeys: r } = {}) => (
      re(
        t,
        (s, o) => {
          n && O(s) ? (e[o] = st(s, n)) : (e[o] = s);
        },
        { allOwnKeys: r }
      ),
      e
    ),
    Un = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
    In = (e, t, n, r) => {
      (e.prototype = Object.create(t.prototype, r)),
        (e.prototype.constructor = e),
        Object.defineProperty(e, "super", { value: t.prototype }),
        n && Object.assign(e.prototype, n);
    },
    Fn = (e, t, n, r) => {
      let s, o, i;
      const c = {};
      if (((t = t || {}), e == null)) return t;
      do {
        for (s = Object.getOwnPropertyNames(e), o = s.length; o-- > 0; )
          (i = s[o]),
            (!r || r(i, e, t)) && !c[i] && ((t[i] = e[i]), (c[i] = !0));
        e = n !== !1 && ve(e);
      } while (e && (!n || n(e, t)) && e !== Object.prototype);
      return t;
    },
    jn = (e, t, n) => {
      (e = String(e)),
        (n === void 0 || n > e.length) && (n = e.length),
        (n -= t.length);
      const r = e.indexOf(t, n);
      return r !== -1 && r === n;
    },
    Dn = (e) => {
      if (!e) return null;
      if (Y(e)) return e;
      let t = e.length;
      if (!at(t)) return null;
      const n = new Array(t);
      for (; t-- > 0; ) n[t] = e[t];
      return n;
    },
    Mn = (
      (e) => (t) =>
        e && t instanceof e
    )(typeof Uint8Array < "u" && ve(Uint8Array)),
    qn = (e, t) => {
      const r = (e && e[me]).call(e);
      let s;
      for (; (s = r.next()) && !s.done; ) {
        const o = s.value;
        t.call(e, o[0], o[1]);
      }
    },
    $n = (e, t) => {
      let n;
      const r = [];
      for (; (n = e.exec(t)) !== null; ) r.push(n);
      return r;
    },
    Hn = v("HTMLFormElement"),
    zn = (e) =>
      e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, r, s) {
        return r.toUpperCase() + s;
      }),
    ut = (
      ({ hasOwnProperty: e }) =>
      (t, n) =>
        e.call(t, n)
    )(Object.prototype),
    Jn = v("RegExp"),
    dt = (e, t) => {
      const n = Object.getOwnPropertyDescriptors(e),
        r = {};
      re(n, (s, o) => {
        let i;
        (i = t(s, o, e)) !== !1 && (r[o] = i || s);
      }),
        Object.defineProperties(e, r);
    },
    Vn = (e) => {
      dt(e, (t, n) => {
        if (O(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
          return !1;
        const r = e[n];
        if (O(r)) {
          if (((t.enumerable = !1), "writable" in t)) {
            t.writable = !1;
            return;
          }
          t.set ||
            (t.set = () => {
              throw Error("Can not rewrite read-only method '" + n + "'");
            });
        }
      });
    },
    Wn = (e, t) => {
      const n = {},
        r = (s) => {
          s.forEach((o) => {
            n[o] = !0;
          });
        };
      return Y(e) ? r(e) : r(String(e).split(t)), n;
    },
    Kn = () => {},
    Xn = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t);
  function Yn(e) {
    return !!(e && O(e.append) && e[ot] === "FormData" && e[me]);
  }
  const Gn = (e) => {
      const t = new Array(10),
        n = (r, s) => {
          if (ne(r)) {
            if (t.indexOf(r) >= 0) return;
            if (te(r)) return r;
            if (!("toJSON" in r)) {
              t[s] = r;
              const o = Y(r) ? [] : {};
              return (
                re(r, (i, c) => {
                  const f = n(i, s + 1);
                  !ee(f) && (o[c] = f);
                }),
                (t[s] = void 0),
                o
              );
            }
          }
          return r;
        };
      return n(e, 0);
    },
    Qn = v("AsyncFunction"),
    Zn = (e) => e && (ne(e) || O(e)) && O(e.then) && O(e.catch),
    ft = ((e, t) =>
      e
        ? setImmediate
        : t
        ? ((n, r) => (
            z.addEventListener(
              "message",
              ({ source: s, data: o }) => {
                s === z && o === n && r.length && r.shift()();
              },
              !1
            ),
            (s) => {
              r.push(s), z.postMessage(n, "*");
            }
          ))(`axios@${Math.random()}`, [])
        : (n) => setTimeout(n))(
      typeof setImmediate == "function",
      O(z.postMessage)
    ),
    er =
      typeof queueMicrotask < "u"
        ? queueMicrotask.bind(z)
        : (typeof process < "u" && process.nextTick) || ft,
    a = {
      isArray: Y,
      isArrayBuffer: it,
      isBuffer: te,
      isFormData: kn,
      isArrayBufferView: bn,
      isString: wn,
      isNumber: at,
      isBoolean: Sn,
      isObject: ne,
      isPlainObject: ge,
      isEmptyObject: En,
      isReadableStream: Ln,
      isRequest: Nn,
      isResponse: Bn,
      isHeaders: vn,
      isUndefined: ee,
      isDate: xn,
      isFile: An,
      isBlob: Rn,
      isRegExp: Jn,
      isFunction: O,
      isStream: Tn,
      isURLSearchParams: On,
      isTypedArray: Mn,
      isFileList: Cn,
      forEach: re,
      merge: _e,
      extend: Pn,
      trim: _n,
      stripBOM: Un,
      inherits: In,
      toFlatObject: Fn,
      kindOf: he,
      kindOfTest: v,
      endsWith: jn,
      toArray: Dn,
      forEachEntry: qn,
      matchAll: $n,
      isHTMLForm: Hn,
      hasOwnProperty: ut,
      hasOwnProp: ut,
      reduceDescriptors: dt,
      freezeMethods: Vn,
      toObjectSet: Wn,
      toCamelCase: zn,
      noop: Kn,
      toFiniteNumber: Xn,
      findKey: ct,
      global: z,
      isContextDefined: lt,
      isSpecCompliantForm: Yn,
      toJSONObject: Gn,
      isAsyncFn: Qn,
      isThenable: Zn,
      setImmediate: ft,
      asap: er,
      isIterable: (e) => e != null && O(e[me]),
    };
  function y(e, t, n, r, s) {
    Error.call(this),
      Error.captureStackTrace
        ? Error.captureStackTrace(this, this.constructor)
        : (this.stack = new Error().stack),
      (this.message = e),
      (this.name = "AxiosError"),
      t && (this.code = t),
      n && (this.config = n),
      r && (this.request = r),
      s && ((this.response = s), (this.status = s.status ? s.status : null));
  }
  a.inherits(y, Error, {
    toJSON: function () {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: a.toJSONObject(this.config),
        code: this.code,
        status: this.status,
      };
    },
  });
  const pt = y.prototype,
    mt = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL",
  ].forEach((e) => {
    mt[e] = { value: e };
  }),
    Object.defineProperties(y, mt),
    Object.defineProperty(pt, "isAxiosError", { value: !0 }),
    (y.from = (e, t, n, r, s, o) => {
      const i = Object.create(pt);
      return (
        a.toFlatObject(
          e,
          i,
          function (f) {
            return f !== Error.prototype;
          },
          (c) => c !== "isAxiosError"
        ),
        y.call(i, e.message, t, n, r, s),
        (i.cause = e),
        (i.name = e.name),
        o && Object.assign(i, o),
        i
      );
    });
  const ht = null;
  function Pe(e) {
    return a.isPlainObject(e) || a.isArray(e);
  }
  function yt(e) {
    return a.endsWith(e, "[]") ? e.slice(0, -2) : e;
  }
  function gt(e, t, n) {
    return e
      ? e
          .concat(t)
          .map(function (s, o) {
            return (s = yt(s)), !n && o ? "[" + s + "]" : s;
          })
          .join(n ? "." : "")
      : t;
  }
  function tr(e) {
    return a.isArray(e) && !e.some(Pe);
  }
  const nr = a.toFlatObject(a, {}, null, function (t) {
    return /^is[A-Z]/.test(t);
  });
  function be(e, t, n) {
    if (!a.isObject(e)) throw new TypeError("target must be an object");
    (t = t || new (ht || FormData)()),
      (n = a.toFlatObject(
        n,
        { metaTokens: !0, dots: !1, indexes: !1 },
        !1,
        function (g, h) {
          return !a.isUndefined(h[g]);
        }
      ));
    const r = n.metaTokens,
      s = n.visitor || u,
      o = n.dots,
      i = n.indexes,
      f = (n.Blob || (typeof Blob < "u" && Blob)) && a.isSpecCompliantForm(t);
    if (!a.isFunction(s)) throw new TypeError("visitor must be a function");
    function d(m) {
      if (m === null) return "";
      if (a.isDate(m)) return m.toISOString();
      if (a.isBoolean(m)) return m.toString();
      if (!f && a.isBlob(m))
        throw new y("Blob is not supported. Use a Buffer instead.");
      return a.isArrayBuffer(m) || a.isTypedArray(m)
        ? f && typeof Blob == "function"
          ? new Blob([m])
          : Buffer.from(m)
        : m;
    }
    function u(m, g, h) {
      let x = m;
      if (m && !h && typeof m == "object") {
        if (a.endsWith(g, "{}"))
          (g = r ? g : g.slice(0, -2)), (m = JSON.stringify(m));
        else if (
          (a.isArray(m) && tr(m)) ||
          ((a.isFileList(m) || a.endsWith(g, "[]")) && (x = a.toArray(m)))
        )
          return (
            (g = yt(g)),
            x.forEach(function (R, M) {
              !(a.isUndefined(R) || R === null) &&
                t.append(
                  i === !0 ? gt([g], M, o) : i === null ? g : g + "[]",
                  d(R)
                );
            }),
            !1
          );
      }
      return Pe(m) ? !0 : (t.append(gt(h, g, o), d(m)), !1);
    }
    const p = [],
      b = Object.assign(nr, {
        defaultVisitor: u,
        convertValue: d,
        isVisitable: Pe,
      });
    function S(m, g) {
      if (!a.isUndefined(m)) {
        if (p.indexOf(m) !== -1)
          throw Error("Circular reference detected in " + g.join("."));
        p.push(m),
          a.forEach(m, function (x, A) {
            (!(a.isUndefined(x) || x === null) &&
              s.call(t, x, a.isString(A) ? A.trim() : A, g, b)) === !0 &&
              S(x, g ? g.concat(A) : [A]);
          }),
          p.pop();
      }
    }
    if (!a.isObject(e)) throw new TypeError("data must be an object");
    return S(e), t;
  }
  function bt(e) {
    const t = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0",
    };
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (r) {
      return t[r];
    });
  }
  function Ue(e, t) {
    (this._pairs = []), e && be(e, this, t);
  }
  const wt = Ue.prototype;
  (wt.append = function (t, n) {
    this._pairs.push([t, n]);
  }),
    (wt.toString = function (t) {
      const n = t
        ? function (r) {
            return t.call(this, r, bt);
          }
        : bt;
      return this._pairs
        .map(function (s) {
          return n(s[0]) + "=" + n(s[1]);
        }, "")
        .join("&");
    });
  function rr(e) {
    return encodeURIComponent(e)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+")
      .replace(/%5B/gi, "[")
      .replace(/%5D/gi, "]");
  }
  function St(e, t, n) {
    if (!t) return e;
    const r = (n && n.encode) || rr;
    a.isFunction(n) && (n = { serialize: n });
    const s = n && n.serialize;
    let o;
    if (
      (s
        ? (o = s(t, n))
        : (o = a.isURLSearchParams(t)
            ? t.toString()
            : new Ue(t, n).toString(r)),
      o)
    ) {
      const i = e.indexOf("#");
      i !== -1 && (e = e.slice(0, i)),
        (e += (e.indexOf("?") === -1 ? "?" : "&") + o);
    }
    return e;
  }
  class Et {
    constructor() {
      this.handlers = [];
    }
    use(t, n, r) {
      return (
        this.handlers.push({
          fulfilled: t,
          rejected: n,
          synchronous: r ? r.synchronous : !1,
          runWhen: r ? r.runWhen : null,
        }),
        this.handlers.length - 1
      );
    }
    eject(t) {
      this.handlers[t] && (this.handlers[t] = null);
    }
    clear() {
      this.handlers && (this.handlers = []);
    }
    forEach(t) {
      a.forEach(this.handlers, function (r) {
        r !== null && t(r);
      });
    }
  }
  const xt = {
      silentJSONParsing: !0,
      forcedJSONParsing: !0,
      clarifyTimeoutError: !1,
    },
    sr = {
      isBrowser: !0,
      classes: {
        URLSearchParams: typeof URLSearchParams < "u" ? URLSearchParams : Ue,
        FormData: typeof FormData < "u" ? FormData : null,
        Blob: typeof Blob < "u" ? Blob : null,
      },
      protocols: ["http", "https", "file", "blob", "url", "data"],
    },
    Ie = typeof window < "u" && typeof document < "u",
    Fe = (typeof navigator == "object" && navigator) || void 0,
    or =
      Ie &&
      (!Fe || ["ReactNative", "NativeScript", "NS"].indexOf(Fe.product) < 0),
    ir =
      typeof WorkerGlobalScope < "u" &&
      self instanceof WorkerGlobalScope &&
      typeof self.importScripts == "function",
    ar = (Ie && window.location.href) || "http://localhost",
    k = {
      ...Object.freeze(
        Object.defineProperty(
          {
            __proto__: null,
            hasBrowserEnv: Ie,
            hasStandardBrowserEnv: or,
            hasStandardBrowserWebWorkerEnv: ir,
            navigator: Fe,
            origin: ar,
          },
          Symbol.toStringTag,
          { value: "Module" }
        )
      ),
      ...sr,
    };
  function cr(e, t) {
    return be(e, new k.classes.URLSearchParams(), {
      visitor: function (n, r, s, o) {
        return k.isNode && a.isBuffer(n)
          ? (this.append(r, n.toString("base64")), !1)
          : o.defaultVisitor.apply(this, arguments);
      },
      ...t,
    });
  }
  function lr(e) {
    return a
      .matchAll(/\w+|\[(\w*)]/g, e)
      .map((t) => (t[0] === "[]" ? "" : t[1] || t[0]));
  }
  function ur(e) {
    const t = {},
      n = Object.keys(e);
    let r;
    const s = n.length;
    let o;
    for (r = 0; r < s; r++) (o = n[r]), (t[o] = e[o]);
    return t;
  }
  function At(e) {
    function t(n, r, s, o) {
      let i = n[o++];
      if (i === "__proto__") return !0;
      const c = Number.isFinite(+i),
        f = o >= n.length;
      return (
        (i = !i && a.isArray(s) ? s.length : i),
        f
          ? (a.hasOwnProp(s, i) ? (s[i] = [s[i], r]) : (s[i] = r), !c)
          : ((!s[i] || !a.isObject(s[i])) && (s[i] = []),
            t(n, r, s[i], o) && a.isArray(s[i]) && (s[i] = ur(s[i])),
            !c)
      );
    }
    if (a.isFormData(e) && a.isFunction(e.entries)) {
      const n = {};
      return (
        a.forEachEntry(e, (r, s) => {
          t(lr(r), s, n, 0);
        }),
        n
      );
    }
    return null;
  }
  function dr(e, t, n) {
    if (a.isString(e))
      try {
        return (t || JSON.parse)(e), a.trim(e);
      } catch (r) {
        if (r.name !== "SyntaxError") throw r;
      }
    return (n || JSON.stringify)(e);
  }
  const se = {
    transitional: xt,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [
      function (t, n) {
        const r = n.getContentType() || "",
          s = r.indexOf("application/json") > -1,
          o = a.isObject(t);
        if ((o && a.isHTMLForm(t) && (t = new FormData(t)), a.isFormData(t)))
          return s ? JSON.stringify(At(t)) : t;
        if (
          a.isArrayBuffer(t) ||
          a.isBuffer(t) ||
          a.isStream(t) ||
          a.isFile(t) ||
          a.isBlob(t) ||
          a.isReadableStream(t)
        )
          return t;
        if (a.isArrayBufferView(t)) return t.buffer;
        if (a.isURLSearchParams(t))
          return (
            n.setContentType(
              "application/x-www-form-urlencoded;charset=utf-8",
              !1
            ),
            t.toString()
          );
        let c;
        if (o) {
          if (r.indexOf("application/x-www-form-urlencoded") > -1)
            return cr(t, this.formSerializer).toString();
          if ((c = a.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
            const f = this.env && this.env.FormData;
            return be(
              c ? { "files[]": t } : t,
              f && new f(),
              this.formSerializer
            );
          }
        }
        return o || s ? (n.setContentType("application/json", !1), dr(t)) : t;
      },
    ],
    transformResponse: [
      function (t) {
        const n = this.transitional || se.transitional,
          r = n && n.forcedJSONParsing,
          s = this.responseType === "json";
        if (a.isResponse(t) || a.isReadableStream(t)) return t;
        if (t && a.isString(t) && ((r && !this.responseType) || s)) {
          const i = !(n && n.silentJSONParsing) && s;
          try {
            return JSON.parse(t);
          } catch (c) {
            if (i)
              throw c.name === "SyntaxError"
                ? y.from(c, y.ERR_BAD_RESPONSE, this, null, this.response)
                : c;
          }
        }
        return t;
      },
    ],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: { FormData: k.classes.FormData, Blob: k.classes.Blob },
    validateStatus: function (t) {
      return t >= 200 && t < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": void 0,
      },
    },
  };
  a.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
    se.headers[e] = {};
  });
  const fr = a.toObjectSet([
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
      "user-agent",
    ]),
    pr = (e) => {
      const t = {};
      let n, r, s;
      return (
        e &&
          e
            .split(
              `
`
            )
            .forEach(function (i) {
              (s = i.indexOf(":")),
                (n = i.substring(0, s).trim().toLowerCase()),
                (r = i.substring(s + 1).trim()),
                !(!n || (t[n] && fr[n])) &&
                  (n === "set-cookie"
                    ? t[n]
                      ? t[n].push(r)
                      : (t[n] = [r])
                    : (t[n] = t[n] ? t[n] + ", " + r : r));
            }),
        t
      );
    },
    Rt = Symbol("internals");
  function oe(e) {
    return e && String(e).trim().toLowerCase();
  }
  function we(e) {
    return e === !1 || e == null ? e : a.isArray(e) ? e.map(we) : String(e);
  }
  function mr(e) {
    const t = Object.create(null),
      n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let r;
    for (; (r = n.exec(e)); ) t[r[1]] = r[2];
    return t;
  }
  const hr = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
  function je(e, t, n, r, s) {
    if (a.isFunction(r)) return r.call(this, t, n);
    if ((s && (t = n), !!a.isString(t))) {
      if (a.isString(r)) return t.indexOf(r) !== -1;
      if (a.isRegExp(r)) return r.test(t);
    }
  }
  function yr(e) {
    return e
      .trim()
      .toLowerCase()
      .replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
  }
  function gr(e, t) {
    const n = a.toCamelCase(" " + t);
    ["get", "set", "has"].forEach((r) => {
      Object.defineProperty(e, r + n, {
        value: function (s, o, i) {
          return this[r].call(this, t, s, o, i);
        },
        configurable: !0,
      });
    });
  }
  let L = class {
    constructor(t) {
      t && this.set(t);
    }
    set(t, n, r) {
      const s = this;
      function o(c, f, d) {
        const u = oe(f);
        if (!u) throw new Error("header name must be a non-empty string");
        const p = a.findKey(s, u);
        (!p || s[p] === void 0 || d === !0 || (d === void 0 && s[p] !== !1)) &&
          (s[p || f] = we(c));
      }
      const i = (c, f) => a.forEach(c, (d, u) => o(d, u, f));
      if (a.isPlainObject(t) || t instanceof this.constructor) i(t, n);
      else if (a.isString(t) && (t = t.trim()) && !hr(t)) i(pr(t), n);
      else if (a.isObject(t) && a.isIterable(t)) {
        let c = {},
          f,
          d;
        for (const u of t) {
          if (!a.isArray(u))
            throw TypeError("Object iterator must return a key-value pair");
          c[(d = u[0])] = (f = c[d])
            ? a.isArray(f)
              ? [...f, u[1]]
              : [f, u[1]]
            : u[1];
        }
        i(c, n);
      } else t != null && o(n, t, r);
      return this;
    }
    get(t, n) {
      if (((t = oe(t)), t)) {
        const r = a.findKey(this, t);
        if (r) {
          const s = this[r];
          if (!n) return s;
          if (n === !0) return mr(s);
          if (a.isFunction(n)) return n.call(this, s, r);
          if (a.isRegExp(n)) return n.exec(s);
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(t, n) {
      if (((t = oe(t)), t)) {
        const r = a.findKey(this, t);
        return !!(r && this[r] !== void 0 && (!n || je(this, this[r], r, n)));
      }
      return !1;
    }
    delete(t, n) {
      const r = this;
      let s = !1;
      function o(i) {
        if (((i = oe(i)), i)) {
          const c = a.findKey(r, i);
          c && (!n || je(r, r[c], c, n)) && (delete r[c], (s = !0));
        }
      }
      return a.isArray(t) ? t.forEach(o) : o(t), s;
    }
    clear(t) {
      const n = Object.keys(this);
      let r = n.length,
        s = !1;
      for (; r--; ) {
        const o = n[r];
        (!t || je(this, this[o], o, t, !0)) && (delete this[o], (s = !0));
      }
      return s;
    }
    normalize(t) {
      const n = this,
        r = {};
      return (
        a.forEach(this, (s, o) => {
          const i = a.findKey(r, o);
          if (i) {
            (n[i] = we(s)), delete n[o];
            return;
          }
          const c = t ? yr(o) : String(o).trim();
          c !== o && delete n[o], (n[c] = we(s)), (r[c] = !0);
        }),
        this
      );
    }
    concat(...t) {
      return this.constructor.concat(this, ...t);
    }
    toJSON(t) {
      const n = Object.create(null);
      return (
        a.forEach(this, (r, s) => {
          r != null &&
            r !== !1 &&
            (n[s] = t && a.isArray(r) ? r.join(", ") : r);
        }),
        n
      );
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(t) {
      return t instanceof this ? t : new this(t);
    }
    static concat(t, ...n) {
      const r = new this(t);
      return n.forEach((s) => r.set(s)), r;
    }
    static accessor(t) {
      const r = (this[Rt] = this[Rt] = { accessors: {} }).accessors,
        s = this.prototype;
      function o(i) {
        const c = oe(i);
        r[c] || (gr(s, i), (r[c] = !0));
      }
      return a.isArray(t) ? t.forEach(o) : o(t), this;
    }
  };
  L.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization",
  ]),
    a.reduceDescriptors(L.prototype, ({ value: e }, t) => {
      let n = t[0].toUpperCase() + t.slice(1);
      return {
        get: () => e,
        set(r) {
          this[n] = r;
        },
      };
    }),
    a.freezeMethods(L);
  function De(e, t) {
    const n = this || se,
      r = t || n,
      s = L.from(r.headers);
    let o = r.data;
    return (
      a.forEach(e, function (c) {
        o = c.call(n, o, s.normalize(), t ? t.status : void 0);
      }),
      s.normalize(),
      o
    );
  }
  function Ct(e) {
    return !!(e && e.__CANCEL__);
  }
  function G(e, t, n) {
    y.call(this, e ?? "canceled", y.ERR_CANCELED, t, n),
      (this.name = "CanceledError");
  }
  a.inherits(G, y, { __CANCEL__: !0 });
  function Tt(e, t, n) {
    const r = n.config.validateStatus;
    !n.status || !r || r(n.status)
      ? e(n)
      : t(
          new y(
            "Request failed with status code " + n.status,
            [y.ERR_BAD_REQUEST, y.ERR_BAD_RESPONSE][
              Math.floor(n.status / 100) - 4
            ],
            n.config,
            n.request,
            n
          )
        );
  }
  function br(e) {
    const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
    return (t && t[1]) || "";
  }
  function wr(e, t) {
    e = e || 10;
    const n = new Array(e),
      r = new Array(e);
    let s = 0,
      o = 0,
      i;
    return (
      (t = t !== void 0 ? t : 1e3),
      function (f) {
        const d = Date.now(),
          u = r[o];
        i || (i = d), (n[s] = f), (r[s] = d);
        let p = o,
          b = 0;
        for (; p !== s; ) (b += n[p++]), (p = p % e);
        if (((s = (s + 1) % e), s === o && (o = (o + 1) % e), d - i < t))
          return;
        const S = u && d - u;
        return S ? Math.round((b * 1e3) / S) : void 0;
      }
    );
  }
  function Sr(e, t) {
    let n = 0,
      r = 1e3 / t,
      s,
      o;
    const i = (d, u = Date.now()) => {
      (n = u), (s = null), o && (clearTimeout(o), (o = null)), e(...d);
    };
    return [
      (...d) => {
        const u = Date.now(),
          p = u - n;
        p >= r
          ? i(d, u)
          : ((s = d),
            o ||
              (o = setTimeout(() => {
                (o = null), i(s);
              }, r - p)));
      },
      () => s && i(s),
    ];
  }
  const Se = (e, t, n = 3) => {
      let r = 0;
      const s = wr(50, 250);
      return Sr((o) => {
        const i = o.loaded,
          c = o.lengthComputable ? o.total : void 0,
          f = i - r,
          d = s(f),
          u = i <= c;
        r = i;
        const p = {
          loaded: i,
          total: c,
          progress: c ? i / c : void 0,
          bytes: f,
          rate: d || void 0,
          estimated: d && c && u ? (c - i) / d : void 0,
          event: o,
          lengthComputable: c != null,
          [t ? "download" : "upload"]: !0,
        };
        e(p);
      }, n);
    },
    kt = (e, t) => {
      const n = e != null;
      return [(r) => t[0]({ lengthComputable: n, total: e, loaded: r }), t[1]];
    },
    Ot =
      (e) =>
      (...t) =>
        a.asap(() => e(...t)),
    Er = k.hasStandardBrowserEnv
      ? ((e, t) => (n) => (
          (n = new URL(n, k.origin)),
          e.protocol === n.protocol &&
            e.host === n.host &&
            (t || e.port === n.port)
        ))(
          new URL(k.origin),
          k.navigator && /(msie|trident)/i.test(k.navigator.userAgent)
        )
      : () => !0,
    xr = k.hasStandardBrowserEnv
      ? {
          write(e, t, n, r, s, o) {
            const i = [e + "=" + encodeURIComponent(t)];
            a.isNumber(n) && i.push("expires=" + new Date(n).toGMTString()),
              a.isString(r) && i.push("path=" + r),
              a.isString(s) && i.push("domain=" + s),
              o === !0 && i.push("secure"),
              (document.cookie = i.join("; "));
          },
          read(e) {
            const t = document.cookie.match(
              new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
            );
            return t ? decodeURIComponent(t[3]) : null;
          },
          remove(e) {
            this.write(e, "", Date.now() - 864e5);
          },
        }
      : {
          write() {},
          read() {
            return null;
          },
          remove() {},
        };
  function Ar(e) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
  }
  function Rr(e, t) {
    return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
  }
  function Lt(e, t, n) {
    let r = !Ar(t);
    return e && (r || n == !1) ? Rr(e, t) : t;
  }
  const Nt = (e) => (e instanceof L ? { ...e } : e);
  function J(e, t) {
    t = t || {};
    const n = {};
    function r(d, u, p, b) {
      return a.isPlainObject(d) && a.isPlainObject(u)
        ? a.merge.call({ caseless: b }, d, u)
        : a.isPlainObject(u)
        ? a.merge({}, u)
        : a.isArray(u)
        ? u.slice()
        : u;
    }
    function s(d, u, p, b) {
      if (a.isUndefined(u)) {
        if (!a.isUndefined(d)) return r(void 0, d, p, b);
      } else return r(d, u, p, b);
    }
    function o(d, u) {
      if (!a.isUndefined(u)) return r(void 0, u);
    }
    function i(d, u) {
      if (a.isUndefined(u)) {
        if (!a.isUndefined(d)) return r(void 0, d);
      } else return r(void 0, u);
    }
    function c(d, u, p) {
      if (p in t) return r(d, u);
      if (p in e) return r(void 0, d);
    }
    const f = {
      url: o,
      method: o,
      data: o,
      baseURL: i,
      transformRequest: i,
      transformResponse: i,
      paramsSerializer: i,
      timeout: i,
      timeoutMessage: i,
      withCredentials: i,
      withXSRFToken: i,
      adapter: i,
      responseType: i,
      xsrfCookieName: i,
      xsrfHeaderName: i,
      onUploadProgress: i,
      onDownloadProgress: i,
      decompress: i,
      maxContentLength: i,
      maxBodyLength: i,
      beforeRedirect: i,
      transport: i,
      httpAgent: i,
      httpsAgent: i,
      cancelToken: i,
      socketPath: i,
      responseEncoding: i,
      validateStatus: c,
      headers: (d, u, p) => s(Nt(d), Nt(u), p, !0),
    };
    return (
      a.forEach(Object.keys({ ...e, ...t }), function (u) {
        const p = f[u] || s,
          b = p(e[u], t[u], u);
        (a.isUndefined(b) && p !== c) || (n[u] = b);
      }),
      n
    );
  }
  const Bt = (e) => {
      const t = J({}, e);
      let {
        data: n,
        withXSRFToken: r,
        xsrfHeaderName: s,
        xsrfCookieName: o,
        headers: i,
        auth: c,
      } = t;
      (t.headers = i = L.from(i)),
        (t.url = St(
          Lt(t.baseURL, t.url, t.allowAbsoluteUrls),
          e.params,
          e.paramsSerializer
        )),
        c &&
          i.set(
            "Authorization",
            "Basic " +
              btoa(
                (c.username || "") +
                  ":" +
                  (c.password ? unescape(encodeURIComponent(c.password)) : "")
              )
          );
      let f;
      if (a.isFormData(n)) {
        if (k.hasStandardBrowserEnv || k.hasStandardBrowserWebWorkerEnv)
          i.setContentType(void 0);
        else if ((f = i.getContentType()) !== !1) {
          const [d, ...u] = f
            ? f
                .split(";")
                .map((p) => p.trim())
                .filter(Boolean)
            : [];
          i.setContentType([d || "multipart/form-data", ...u].join("; "));
        }
      }
      if (
        k.hasStandardBrowserEnv &&
        (r && a.isFunction(r) && (r = r(t)), r || (r !== !1 && Er(t.url)))
      ) {
        const d = s && o && xr.read(o);
        d && i.set(s, d);
      }
      return t;
    },
    Cr =
      typeof XMLHttpRequest < "u" &&
      function (e) {
        return new Promise(function (n, r) {
          const s = Bt(e);
          let o = s.data;
          const i = L.from(s.headers).normalize();
          let {
              responseType: c,
              onUploadProgress: f,
              onDownloadProgress: d,
            } = s,
            u,
            p,
            b,
            S,
            m;
          function g() {
            S && S(),
              m && m(),
              s.cancelToken && s.cancelToken.unsubscribe(u),
              s.signal && s.signal.removeEventListener("abort", u);
          }
          let h = new XMLHttpRequest();
          h.open(s.method.toUpperCase(), s.url, !0), (h.timeout = s.timeout);
          function x() {
            if (!h) return;
            const R = L.from(
                "getAllResponseHeaders" in h && h.getAllResponseHeaders()
              ),
              N = {
                data:
                  !c || c === "text" || c === "json"
                    ? h.responseText
                    : h.response,
                status: h.status,
                statusText: h.statusText,
                headers: R,
                config: e,
                request: h,
              };
            Tt(
              function (X) {
                n(X), g();
              },
              function (X) {
                r(X), g();
              },
              N
            ),
              (h = null);
          }
          "onloadend" in h
            ? (h.onloadend = x)
            : (h.onreadystatechange = function () {
                !h ||
                  h.readyState !== 4 ||
                  (h.status === 0 &&
                    !(h.responseURL && h.responseURL.indexOf("file:") === 0)) ||
                  setTimeout(x);
              }),
            (h.onabort = function () {
              h &&
                (r(new y("Request aborted", y.ECONNABORTED, e, h)), (h = null));
            }),
            (h.onerror = function () {
              r(new y("Network Error", y.ERR_NETWORK, e, h)), (h = null);
            }),
            (h.ontimeout = function () {
              let M = s.timeout
                ? "timeout of " + s.timeout + "ms exceeded"
                : "timeout exceeded";
              const N = s.transitional || xt;
              s.timeoutErrorMessage && (M = s.timeoutErrorMessage),
                r(
                  new y(
                    M,
                    N.clarifyTimeoutError ? y.ETIMEDOUT : y.ECONNABORTED,
                    e,
                    h
                  )
                ),
                (h = null);
            }),
            o === void 0 && i.setContentType(null),
            "setRequestHeader" in h &&
              a.forEach(i.toJSON(), function (M, N) {
                h.setRequestHeader(N, M);
              }),
            a.isUndefined(s.withCredentials) ||
              (h.withCredentials = !!s.withCredentials),
            c && c !== "json" && (h.responseType = s.responseType),
            d && (([b, m] = Se(d, !0)), h.addEventListener("progress", b)),
            f &&
              h.upload &&
              (([p, S] = Se(f)),
              h.upload.addEventListener("progress", p),
              h.upload.addEventListener("loadend", S)),
            (s.cancelToken || s.signal) &&
              ((u = (R) => {
                h &&
                  (r(!R || R.type ? new G(null, e, h) : R),
                  h.abort(),
                  (h = null));
              }),
              s.cancelToken && s.cancelToken.subscribe(u),
              s.signal &&
                (s.signal.aborted
                  ? u()
                  : s.signal.addEventListener("abort", u)));
          const A = br(s.url);
          if (A && k.protocols.indexOf(A) === -1) {
            r(new y("Unsupported protocol " + A + ":", y.ERR_BAD_REQUEST, e));
            return;
          }
          h.send(o || null);
        });
      },
    Tr = (e, t) => {
      const { length: n } = (e = e ? e.filter(Boolean) : []);
      if (t || n) {
        let r = new AbortController(),
          s;
        const o = function (d) {
          if (!s) {
            (s = !0), c();
            const u = d instanceof Error ? d : this.reason;
            r.abort(
              u instanceof y ? u : new G(u instanceof Error ? u.message : u)
            );
          }
        };
        let i =
          t &&
          setTimeout(() => {
            (i = null), o(new y(`timeout ${t} of ms exceeded`, y.ETIMEDOUT));
          }, t);
        const c = () => {
          e &&
            (i && clearTimeout(i),
            (i = null),
            e.forEach((d) => {
              d.unsubscribe
                ? d.unsubscribe(o)
                : d.removeEventListener("abort", o);
            }),
            (e = null));
        };
        e.forEach((d) => d.addEventListener("abort", o));
        const { signal: f } = r;
        return (f.unsubscribe = () => a.asap(c)), f;
      }
    },
    kr = function* (e, t) {
      let n = e.byteLength;
      if (!t || n < t) {
        yield e;
        return;
      }
      let r = 0,
        s;
      for (; r < n; ) (s = r + t), yield e.slice(r, s), (r = s);
    },
    Or = async function* (e, t) {
      for await (const n of Lr(e)) yield* kr(n, t);
    },
    Lr = async function* (e) {
      if (e[Symbol.asyncIterator]) {
        yield* e;
        return;
      }
      const t = e.getReader();
      try {
        for (;;) {
          const { done: n, value: r } = await t.read();
          if (n) break;
          yield r;
        }
      } finally {
        await t.cancel();
      }
    },
    vt = (e, t, n, r) => {
      const s = Or(e, t);
      let o = 0,
        i,
        c = (f) => {
          i || ((i = !0), r && r(f));
        };
      return new ReadableStream(
        {
          async pull(f) {
            try {
              const { done: d, value: u } = await s.next();
              if (d) {
                c(), f.close();
                return;
              }
              let p = u.byteLength;
              if (n) {
                let b = (o += p);
                n(b);
              }
              f.enqueue(new Uint8Array(u));
            } catch (d) {
              throw (c(d), d);
            }
          },
          cancel(f) {
            return c(f), s.return();
          },
        },
        { highWaterMark: 2 }
      );
    },
    Ee =
      typeof fetch == "function" &&
      typeof Request == "function" &&
      typeof Response == "function",
    _t = Ee && typeof ReadableStream == "function",
    Nr =
      Ee &&
      (typeof TextEncoder == "function"
        ? (
            (e) => (t) =>
              e.encode(t)
          )(new TextEncoder())
        : async (e) => new Uint8Array(await new Response(e).arrayBuffer())),
    Pt = (e, ...t) => {
      try {
        return !!e(...t);
      } catch {
        return !1;
      }
    },
    Br =
      _t &&
      Pt(() => {
        let e = !1;
        const t = new Request(k.origin, {
          body: new ReadableStream(),
          method: "POST",
          get duplex() {
            return (e = !0), "half";
          },
        }).headers.has("Content-Type");
        return e && !t;
      }),
    Ut = 64 * 1024,
    Me = _t && Pt(() => a.isReadableStream(new Response("").body)),
    xe = { stream: Me && ((e) => e.body) };
  Ee &&
    ((e) => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
        !xe[t] &&
          (xe[t] = a.isFunction(e[t])
            ? (n) => n[t]()
            : (n, r) => {
                throw new y(
                  `Response type '${t}' is not supported`,
                  y.ERR_NOT_SUPPORT,
                  r
                );
              });
      });
    })(new Response());
  const vr = async (e) => {
      if (e == null) return 0;
      if (a.isBlob(e)) return e.size;
      if (a.isSpecCompliantForm(e))
        return (
          await new Request(k.origin, { method: "POST", body: e }).arrayBuffer()
        ).byteLength;
      if (a.isArrayBufferView(e) || a.isArrayBuffer(e)) return e.byteLength;
      if ((a.isURLSearchParams(e) && (e = e + ""), a.isString(e)))
        return (await Nr(e)).byteLength;
    },
    _r = async (e, t) => {
      const n = a.toFiniteNumber(e.getContentLength());
      return n ?? vr(t);
    },
    qe = {
      http: ht,
      xhr: Cr,
      fetch:
        Ee &&
        (async (e) => {
          let {
            url: t,
            method: n,
            data: r,
            signal: s,
            cancelToken: o,
            timeout: i,
            onDownloadProgress: c,
            onUploadProgress: f,
            responseType: d,
            headers: u,
            withCredentials: p = "same-origin",
            fetchOptions: b,
          } = Bt(e);
          d = d ? (d + "").toLowerCase() : "text";
          let S = Tr([s, o && o.toAbortSignal()], i),
            m;
          const g =
            S &&
            S.unsubscribe &&
            (() => {
              S.unsubscribe();
            });
          let h;
          try {
            if (
              f &&
              Br &&
              n !== "get" &&
              n !== "head" &&
              (h = await _r(u, r)) !== 0
            ) {
              let N = new Request(t, {
                  method: "POST",
                  body: r,
                  duplex: "half",
                }),
                H;
              if (
                (a.isFormData(r) &&
                  (H = N.headers.get("content-type")) &&
                  u.setContentType(H),
                N.body)
              ) {
                const [X, Ne] = kt(h, Se(Ot(f)));
                r = vt(N.body, Ut, X, Ne);
              }
            }
            a.isString(p) || (p = p ? "include" : "omit");
            const x = "credentials" in Request.prototype;
            m = new Request(t, {
              ...b,
              signal: S,
              method: n.toUpperCase(),
              headers: u.normalize().toJSON(),
              body: r,
              duplex: "half",
              credentials: x ? p : void 0,
            });
            let A = await fetch(m, b);
            const R = Me && (d === "stream" || d === "response");
            if (Me && (c || (R && g))) {
              const N = {};
              ["status", "statusText", "headers"].forEach((dn) => {
                N[dn] = A[dn];
              });
              const H = a.toFiniteNumber(A.headers.get("content-length")),
                [X, Ne] = (c && kt(H, Se(Ot(c), !0))) || [];
              A = new Response(
                vt(A.body, Ut, X, () => {
                  Ne && Ne(), g && g();
                }),
                N
              );
            }
            d = d || "text";
            let M = await xe[a.findKey(xe, d) || "text"](A, e);
            return (
              !R && g && g(),
              await new Promise((N, H) => {
                Tt(N, H, {
                  data: M,
                  headers: L.from(A.headers),
                  status: A.status,
                  statusText: A.statusText,
                  config: e,
                  request: m,
                });
              })
            );
          } catch (x) {
            throw (
              (g && g(),
              x &&
              x.name === "TypeError" &&
              /Load failed|fetch/i.test(x.message)
                ? Object.assign(new y("Network Error", y.ERR_NETWORK, e, m), {
                    cause: x.cause || x,
                  })
                : y.from(x, x && x.code, e, m))
            );
          }
        }),
    };
  a.forEach(qe, (e, t) => {
    if (e) {
      try {
        Object.defineProperty(e, "name", { value: t });
      } catch {}
      Object.defineProperty(e, "adapterName", { value: t });
    }
  });
  const It = (e) => `- ${e}`,
    Pr = (e) => a.isFunction(e) || e === null || e === !1,
    Ft = {
      getAdapter: (e) => {
        e = a.isArray(e) ? e : [e];
        const { length: t } = e;
        let n, r;
        const s = {};
        for (let o = 0; o < t; o++) {
          n = e[o];
          let i;
          if (
            ((r = n),
            !Pr(n) && ((r = qe[(i = String(n)).toLowerCase()]), r === void 0))
          )
            throw new y(`Unknown adapter '${i}'`);
          if (r) break;
          s[i || "#" + o] = r;
        }
        if (!r) {
          const o = Object.entries(s).map(
            ([c, f]) =>
              `adapter ${c} ` +
              (f === !1
                ? "is not supported by the environment"
                : "is not available in the build")
          );
          let i = t
            ? o.length > 1
              ? `since :
` +
                o.map(It).join(`
`)
              : " " + It(o[0])
            : "as no adapter specified";
          throw new y(
            "There is no suitable adapter to dispatch the request " + i,
            "ERR_NOT_SUPPORT"
          );
        }
        return r;
      },
      adapters: qe,
    };
  function $e(e) {
    if (
      (e.cancelToken && e.cancelToken.throwIfRequested(),
      e.signal && e.signal.aborted)
    )
      throw new G(null, e);
  }
  function jt(e) {
    return (
      $e(e),
      (e.headers = L.from(e.headers)),
      (e.data = De.call(e, e.transformRequest)),
      ["post", "put", "patch"].indexOf(e.method) !== -1 &&
        e.headers.setContentType("application/x-www-form-urlencoded", !1),
      Ft.getAdapter(e.adapter || se.adapter)(e).then(
        function (r) {
          return (
            $e(e),
            (r.data = De.call(e, e.transformResponse, r)),
            (r.headers = L.from(r.headers)),
            r
          );
        },
        function (r) {
          return (
            Ct(r) ||
              ($e(e),
              r &&
                r.response &&
                ((r.response.data = De.call(
                  e,
                  e.transformResponse,
                  r.response
                )),
                (r.response.headers = L.from(r.response.headers)))),
            Promise.reject(r)
          );
        }
      )
    );
  }
  const Dt = "1.11.0",
    Ae = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(
    (e, t) => {
      Ae[e] = function (r) {
        return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
      };
    }
  );
  const Mt = {};
  (Ae.transitional = function (t, n, r) {
    function s(o, i) {
      return (
        "[Axios v" +
        Dt +
        "] Transitional option '" +
        o +
        "'" +
        i +
        (r ? ". " + r : "")
      );
    }
    return (o, i, c) => {
      if (t === !1)
        throw new y(
          s(i, " has been removed" + (n ? " in " + n : "")),
          y.ERR_DEPRECATED
        );
      return (
        n &&
          !Mt[i] &&
          ((Mt[i] = !0),
          console.warn(
            s(
              i,
              " has been deprecated since v" +
                n +
                " and will be removed in the near future"
            )
          )),
        t ? t(o, i, c) : !0
      );
    };
  }),
    (Ae.spelling = function (t) {
      return (n, r) => (
        console.warn(`${r} is likely a misspelling of ${t}`), !0
      );
    });
  function Ur(e, t, n) {
    if (typeof e != "object")
      throw new y("options must be an object", y.ERR_BAD_OPTION_VALUE);
    const r = Object.keys(e);
    let s = r.length;
    for (; s-- > 0; ) {
      const o = r[s],
        i = t[o];
      if (i) {
        const c = e[o],
          f = c === void 0 || i(c, o, e);
        if (f !== !0)
          throw new y("option " + o + " must be " + f, y.ERR_BAD_OPTION_VALUE);
        continue;
      }
      if (n !== !0) throw new y("Unknown option " + o, y.ERR_BAD_OPTION);
    }
  }
  const Re = { assertOptions: Ur, validators: Ae },
    F = Re.validators;
  let V = class {
    constructor(t) {
      (this.defaults = t || {}),
        (this.interceptors = { request: new Et(), response: new Et() });
    }
    async request(t, n) {
      try {
        return await this._request(t, n);
      } catch (r) {
        if (r instanceof Error) {
          let s = {};
          Error.captureStackTrace
            ? Error.captureStackTrace(s)
            : (s = new Error());
          const o = s.stack ? s.stack.replace(/^.+\n/, "") : "";
          try {
            r.stack
              ? o &&
                !String(r.stack).endsWith(o.replace(/^.+\n.+\n/, "")) &&
                (r.stack +=
                  `
` + o)
              : (r.stack = o);
          } catch {}
        }
        throw r;
      }
    }
    _request(t, n) {
      typeof t == "string" ? ((n = n || {}), (n.url = t)) : (n = t || {}),
        (n = J(this.defaults, n));
      const { transitional: r, paramsSerializer: s, headers: o } = n;
      r !== void 0 &&
        Re.assertOptions(
          r,
          {
            silentJSONParsing: F.transitional(F.boolean),
            forcedJSONParsing: F.transitional(F.boolean),
            clarifyTimeoutError: F.transitional(F.boolean),
          },
          !1
        ),
        s != null &&
          (a.isFunction(s)
            ? (n.paramsSerializer = { serialize: s })
            : Re.assertOptions(
                s,
                { encode: F.function, serialize: F.function },
                !0
              )),
        n.allowAbsoluteUrls !== void 0 ||
          (this.defaults.allowAbsoluteUrls !== void 0
            ? (n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
            : (n.allowAbsoluteUrls = !0)),
        Re.assertOptions(
          n,
          {
            baseUrl: F.spelling("baseURL"),
            withXsrfToken: F.spelling("withXSRFToken"),
          },
          !0
        ),
        (n.method = (n.method || this.defaults.method || "get").toLowerCase());
      let i = o && a.merge(o.common, o[n.method]);
      o &&
        a.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          (m) => {
            delete o[m];
          }
        ),
        (n.headers = L.concat(i, o));
      const c = [];
      let f = !0;
      this.interceptors.request.forEach(function (g) {
        (typeof g.runWhen == "function" && g.runWhen(n) === !1) ||
          ((f = f && g.synchronous), c.unshift(g.fulfilled, g.rejected));
      });
      const d = [];
      this.interceptors.response.forEach(function (g) {
        d.push(g.fulfilled, g.rejected);
      });
      let u,
        p = 0,
        b;
      if (!f) {
        const m = [jt.bind(this), void 0];
        for (
          m.unshift(...c), m.push(...d), b = m.length, u = Promise.resolve(n);
          p < b;

        )
          u = u.then(m[p++], m[p++]);
        return u;
      }
      b = c.length;
      let S = n;
      for (p = 0; p < b; ) {
        const m = c[p++],
          g = c[p++];
        try {
          S = m(S);
        } catch (h) {
          g.call(this, h);
          break;
        }
      }
      try {
        u = jt.call(this, S);
      } catch (m) {
        return Promise.reject(m);
      }
      for (p = 0, b = d.length; p < b; ) u = u.then(d[p++], d[p++]);
      return u;
    }
    getUri(t) {
      t = J(this.defaults, t);
      const n = Lt(t.baseURL, t.url, t.allowAbsoluteUrls);
      return St(n, t.params, t.paramsSerializer);
    }
  };
  a.forEach(["delete", "get", "head", "options"], function (t) {
    V.prototype[t] = function (n, r) {
      return this.request(
        J(r || {}, { method: t, url: n, data: (r || {}).data })
      );
    };
  }),
    a.forEach(["post", "put", "patch"], function (t) {
      function n(r) {
        return function (o, i, c) {
          return this.request(
            J(c || {}, {
              method: t,
              headers: r ? { "Content-Type": "multipart/form-data" } : {},
              url: o,
              data: i,
            })
          );
        };
      }
      (V.prototype[t] = n()), (V.prototype[t + "Form"] = n(!0));
    });
  let Ir = class fn {
    constructor(t) {
      if (typeof t != "function")
        throw new TypeError("executor must be a function.");
      let n;
      this.promise = new Promise(function (o) {
        n = o;
      });
      const r = this;
      this.promise.then((s) => {
        if (!r._listeners) return;
        let o = r._listeners.length;
        for (; o-- > 0; ) r._listeners[o](s);
        r._listeners = null;
      }),
        (this.promise.then = (s) => {
          let o;
          const i = new Promise((c) => {
            r.subscribe(c), (o = c);
          }).then(s);
          return (
            (i.cancel = function () {
              r.unsubscribe(o);
            }),
            i
          );
        }),
        t(function (o, i, c) {
          r.reason || ((r.reason = new G(o, i, c)), n(r.reason));
        });
    }
    throwIfRequested() {
      if (this.reason) throw this.reason;
    }
    subscribe(t) {
      if (this.reason) {
        t(this.reason);
        return;
      }
      this._listeners ? this._listeners.push(t) : (this._listeners = [t]);
    }
    unsubscribe(t) {
      if (!this._listeners) return;
      const n = this._listeners.indexOf(t);
      n !== -1 && this._listeners.splice(n, 1);
    }
    toAbortSignal() {
      const t = new AbortController(),
        n = (r) => {
          t.abort(r);
        };
      return (
        this.subscribe(n),
        (t.signal.unsubscribe = () => this.unsubscribe(n)),
        t.signal
      );
    }
    static source() {
      let t;
      return {
        token: new fn(function (s) {
          t = s;
        }),
        cancel: t,
      };
    }
  };
  function Fr(e) {
    return function (n) {
      return e.apply(null, n);
    };
  }
  function jr(e) {
    return a.isObject(e) && e.isAxiosError === !0;
  }
  const He = {
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
  };
  Object.entries(He).forEach(([e, t]) => {
    He[t] = e;
  });
  function qt(e) {
    const t = new V(e),
      n = st(V.prototype.request, t);
    return (
      a.extend(n, V.prototype, t, { allOwnKeys: !0 }),
      a.extend(n, t, null, { allOwnKeys: !0 }),
      (n.create = function (s) {
        return qt(J(e, s));
      }),
      n
    );
  }
  const E = qt(se);
  (E.Axios = V),
    (E.CanceledError = G),
    (E.CancelToken = Ir),
    (E.isCancel = Ct),
    (E.VERSION = Dt),
    (E.toFormData = be),
    (E.AxiosError = y),
    (E.Cancel = E.CanceledError),
    (E.all = function (t) {
      return Promise.all(t);
    }),
    (E.spread = Fr),
    (E.isAxiosError = jr),
    (E.mergeConfig = J),
    (E.AxiosHeaders = L),
    (E.formToJSON = (e) => At(a.isHTMLForm(e) ? new FormData(e) : e)),
    (E.getAdapter = Ft.getAdapter),
    (E.HttpStatusCode = He),
    (E.default = E);
  const {
    Axios: Hs,
    AxiosError: zs,
    CanceledError: Js,
    isCancel: Vs,
    CancelToken: Ws,
    VERSION: Ks,
    all: Xs,
    Cancel: Ys,
    isAxiosError: Gs,
    spread: Qs,
    toFormData: Zs,
    AxiosHeaders: eo,
    HttpStatusCode: to,
    formToJSON: no,
    getAdapter: ro,
    mergeConfig: so,
  } = E;
  function Dr() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
      const t = (Math.random() * 16) | 0;
      return (e === "x" ? t : (t & 3) | 8).toString(16);
    });
  }
  const $t = [
    "journey",
    "customer identification",
    "service type",
    "service",
    "location",
    "question",
    "details",
    "date",
    "time",
    "set appointment",
    "success",
  ];
  function Mr() {
    const e = (
        navigator.language ||
        navigator.userLanguage ||
        "en"
      ).toLowerCase(),
      [t] = e.split("-");
    return t || "en";
  }
  let Ht =
    localStorage.getItem("sessionId") || (crypto?.randomUUID?.() ?? Dr());
  localStorage.setItem("sessionId", Ht);
  const l = {
    isAuthPhase: !0,
    lastScreenWasAuthLike: !1,
    currentStepName: "",
    lngCode: Mr(),
    backLockedUntilRestart: !1,
    chipsLocked: !1,
    availableDates: [],
    datesShown: 0,
    JOURNEYS: [],
    journeyChosen: null,
    pendingId: "",
    atInitialAuthScreen: !1,
    availableSteps: new Set(),
    journeyOrder: [],
    selection: {
      id: "",
      serviceType: "",
      service: "",
      location: "",
      date: "",
      time: "",
    },
    commands: {
      restart: new Set(),
      end: new Set(),
      cancel: new Set(),
      skip: new Set(),
      loadMore: new Set(),
    },
  };
  function qr() {
    (l.selection.serviceType = ""),
      (l.selection.service = ""),
      (l.selection.location = ""),
      (l.selection.date = ""),
      (l.selection.time = "");
  }
  function zt() {
    (l.availableSteps = new Set()),
      (l.journeyOrder = []),
      (l.availableDates = []),
      (l.datesShown = 0);
  }
  function $r() {
    Object.assign(l.selection, {
      id: "",
      serviceType: "",
      service: "",
      location: "",
      date: "",
      time: "",
    });
  }
  function Jt() {
    l.backLockedUntilRestart = !0;
  }
  function ze() {
    l.backLockedUntilRestart = !1;
  }
  function Vt() {
    l.chipsLocked = !0;
  }
  function Wt() {
    l.chipsLocked = !1;
  }
  function Kt() {
    $r(),
      zt(),
      (l.journeyChosen = null),
      (l.pendingId = ""),
      (l.currentStepName = ""),
      ze(),
      Wt();
  }
  function oo() {
    Kt(), (l.selection.id = "");
  }
  function io(e = []) {
    if (!Array.isArray(e) || e.length === 0) return 0;
    const t = e.findIndex((n) => !n?.stepAnswer);
    return t === -1 ? e.length - 1 : t;
  }
  function Hr() {
    return l.backLockedUntilRestart ? !1 : !!l.journeyChosen;
  }
  let Xt = "./locales",
    ie = !0;
  function ao(e) {
    typeof e == "string" && e.trim() && (Xt = e.replace(/\/+$/, ""));
  }
  function co(e) {
    ie = !!e;
  }
  const _ = Object.create(null);
  let P = zr(),
    B = "en";
  function Q(e) {
    const t = String(e || "en")
      .toLowerCase()
      .split("-")[0]
      .trim();
    return t === "iw" ? "he" : t === "ua" ? "uk" : t || "en";
  }
  function zr() {
    try {
      const e =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        "en";
      return Q(e);
    } catch {
      return "en";
    }
  }
  async function ae(e) {
    const t = Q(e);
    if (_[t]) return _[t];
    try {
      const n = await fetch(`${Xt}/chatbot.${t}.json`, { cache: "no-store" });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      const r = await n.json();
      return (_[t] = r), r;
    } catch (n) {
      return (
        ie &&
          console.warn(
            `[localization] Missing language file "${t}" (${n.message}).`
          ),
        (_[t] = {}),
        _[t]
      );
    }
  }
  function Z(e, t) {
    return String(t || "")
      .split(".")
      .reduce((n, r) => (n && r in n ? n[r] : void 0), e);
  }
  function Je(e) {
    try {
      const t = Q(e),
        n =
          (Intl?.Locale && new Intl.Locale(t).textInfo?.direction) ||
          (["ar", "fa", "he", "ur"].includes(t) ? "rtl" : "ltr");
      document.documentElement.dir = n || "ltr";
    } catch {
      document.documentElement.dir = "ltr";
    }
  }
  async function Yt(e) {
    e && (P = Q(e));
    const t = [ae("en"), ae(P)];
    B && B !== "en" && B !== P && t.push(ae(B)),
      await Promise.all(t),
      Je(P || B || "en");
  }
  function Ce() {
    return P;
  }
  function Jr(e) {
    (P = Q(e)), Je(P);
  }
  async function Vr(e) {
    (B = Q(e || "en")), await ae(B), Je(P || B);
  }
  async function Wr(e) {
    await ae(e);
  }
  function C(e) {
    let t;
    return (
      (t = Z(_[P] || {}, e)),
      t !== void 0
        ? t
        : ((t = Z(_[B] || {}, e)),
          t !== void 0
            ? (ie &&
                console.warn(
                  `[localization] Missing "${e}" for "${P}", used journey default "${B}".`
                ),
              t)
            : ((t = Z(_.en || {}, e)),
              t !== void 0
                ? (ie &&
                    console.warn(
                      `[localization] Missing "${e}" for "${P}" and "${B}", used "en".`
                    ),
                  t)
                : (ie &&
                    console.warn(
                      `[localization] Missing key "${e}" in all languages.`
                    ),
                  e)))
    );
  }
  function Kr(e, t) {
    const n = String(t || "en")
      .toLowerCase()
      .split("-")[0];
    let r = Z(_[n] || {}, e);
    return r !== void 0 ||
      ((r = Z(_[B] || {}, e)), r !== void 0) ||
      ((r = Z(_.en || {}, e)), r !== void 0)
      ? r
      : e;
  }
  const Xr = 25e3;
  function Yr(e) {
    if (e == null) throw new Error("Empty response");
    return Array.isArray(e) ? e[0] : e;
  }
  async function j(e, t = !1, n = {}) {
    const r = await mn(),
      s = [{ SessionId: Ht, Message: e, ClearCache: !!t, LngCode: Ce() }],
      o = n.signal ? null : new AbortController(),
      i = n.signal || o?.signal;
    try {
      const c = await E.post(r, s, {
        timeout: n.timeout ?? Xr,
        signal: i,
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": Ce(),
        },
      });
      return Yr(c?.data);
    } catch (c) {
      if (E.isCancel(c) || c?.code === "ECONNABORTED")
        throw new Error("Network timeout");
      const f = c?.response?.status,
        d =
          typeof c?.response?.data == "string"
            ? c.response.data
            : c?.response?.statusText || "";
      throw f
        ? new Error(`Network error (${f})${d ? ` — ${d}` : ""}`)
        : new Error(c?.message || "Network error");
    }
  }
  function lo() {
    return { controller: new AbortController() };
  }
  const q = (e) =>
    String(e || "")
      .toLowerCase()
      .trim();
  let ce = { lang: null, steps: {}, hereRegex: null, ignoreSet: new Set() };
  function Ve() {
    const e = Ce();
    if (ce.lang === e && ce.hereRegex) return ce;
    const t = C("aliases.steps"),
      n = C("aliases.here"),
      r = C("aliases.ignore"),
      s = {
        "customer identification": [
          "customer identification",
          "customer authentication",
          "new customer",
        ],
        "service type": ["service type", "service types"],
        service: ["service", "services", "select service"],
        location: ["location"],
        details: ["details"],
        date: ["date"],
        time: ["time"],
        "set appointment": ["set appointment", "book appointment"],
        success: ["success"],
      },
      o = {},
      i = typeof t == "object" && t ? t : {};
    for (const S of Object.keys(s)) {
      const m = Array.isArray(i[S]) ? i[S] : [];
      o[S] = [...new Set([...(m || []), ...s[S]])];
    }
    const f = `^(${(Array.isArray(n) && n.length
        ? n
        : ["you are here", "вы здесь", "ви тут", "אתה כאן", "את כאן", "אתם כאן"]
      )
        .map((S) => S.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})\\s*:\\s*`,
      d = new RegExp(f, "i"),
      u = ["cancelling option", "опция отмены"],
      p = Array.isArray(r) ? r : [],
      b = new Set([...u.map(q), ...p.map(q)]);
    return (ce = { lang: e, steps: o, hereRegex: d, ignoreSet: b }), ce;
  }
  function U(e) {
    const { steps: t, hereRegex: n } = Ve(),
      r = q(String(e || "").replace(n, ""));
    if (!r) return "";
    for (const [s, o] of Object.entries(t))
      if (o.some((i) => r.includes(q(i)))) return s;
    return r;
  }
  function We(e) {
    const t = U(e),
      r = (Array.isArray(l.journeyOrder) ? l.journeyOrder : []).indexOf(t);
    if (r !== -1) return r;
    const s = $t.indexOf(t);
    return s === -1 ? 999 : 500 + s;
  }
  function Ke(e) {
    const { hereRegex: t } = Ve(),
      n = e?.journeyMap || [],
      r = n.find((o) => t.test(o?.stepName || ""));
    if (r) return U(r.stepName);
    for (const o of n) {
      const i = U(o.stepName || "");
      if (i) return i;
    }
    const s = (e?.options || []).map((o) => o.optionName || o);
    return s.some((o) => /^\d{2}\/\d{2}\/\d{4}$/.test(o))
      ? "date"
      : s.some((o) => /^\d{1,2}:\d{2}$/.test(o))
      ? "time"
      : q(e?.message || "").includes("services -")
      ? "service"
      : null;
  }
  function Gr(e) {
    const { hereRegex: t, ignoreSet: n } = Ve();
    l.availableSteps || (l.availableSteps = new Set()),
      Array.isArray(l.journeyOrder) || (l.journeyOrder = []);
    const s = (e?.journeyMap || [])
      .map((o) =>
        String(o.stepName || "")
          .replace(t, "")
          .trim()
      )
      .filter((o) => !n.has(q(o)))
      .map(U)
      .filter((o) => o);
    for (const o of s)
      l.availableSteps.add(o),
        l.journeyOrder.includes(o) || l.journeyOrder.push(o);
  }
  function Qr(e) {
    return Ke(e) === "customer identification";
  }
  function Zr(e) {
    return Ke(e) === "success";
  }
  function Gt(e) {
    const n = String(e || "")
        .replace(/<ol[\s\S]*?<\/ol>/gi, "")
        .replace(/<ul[\s\S]*?<\/ul>/gi, "")
        .replace(
          /<br\s*\/?>/gi,
          `
`
        ),
      r = document.createElement("div");
    return (
      (r.innerHTML = n),
      (r.textContent || r.innerText || "")
        .replace(/\r/g, "")
        .replace(
          /\n{3,}/g,
          `

`
        )
        .trim()
    );
  }
  function es(e) {
    e && (e.scrollTop = e.scrollHeight);
  }
  function ts(e, t) {
    if (!e || !t) return;
    const n = Array.isArray(e.journeyMap) ? e.journeyMap : [];
    for (const { stepName: r, stepAnswer: s } of n)
      if (s)
        switch (U(r)) {
          case "service type":
            t.serviceType = s;
            break;
          case "service":
            t.service = s;
            break;
          case "location":
            t.location = s;
            break;
          case "date":
            t.date = s;
            break;
          case "time":
            t.time = s;
            break;
        }
  }
  let Te = { lang: null, enterIdPhrases: [] };
  function ns() {
    const e = Ce();
    if (Te.lang === e) return Te;
    let t = C("detect.auth.enterId");
    return (
      (!Array.isArray(t) || t.length === 0) &&
        (t = [
          "enter your id",
          "please enter your id",
          "id must hold digits only",
        ]),
      (Te = { lang: e, enterIdPhrases: t.filter(Boolean) }),
      Te
    );
  }
  function Xe(e) {
    if (Qr(e)) return !0;
    if (!(!Array.isArray(e?.options) || e.options.length === 0)) return !1;
    const n = q(Gt(e?.message || "")),
      { enterIdPhrases: r } = ns();
    return r.some((s) => n.includes(q(s)));
  }
  function uo(e) {
    return (Array.isArray(e?.options) ? e.options : []).some((n) => {
      const r = n?.optionValue ?? n,
        s = n?.optionName ?? n;
      return Zt(l.commands.skip, r, s) || Zt(l.commands.freeText, r, s);
    });
  }
  const Qt = (e) =>
      String(e || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim(),
    Zt = (e, ...t) => {
      if (!e) return !1;
      for (const n of t) {
        const r = Qt(n);
        if (!r) continue;
        const s = r.split(/[|,;]+/).map((o) => o.trim());
        for (const o of e) {
          const i = Qt(o);
          if (r === i || r.includes(i) || s.includes(i)) return !0;
        }
      }
      return !1;
    };
  function fo(e) {
    return String(e ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  const w = {
    toggleButton: document.getElementById("chat-toggle"),
    chatWidget: document.getElementById("chat-widget"),
    chatHeader: document.getElementById("chat-header"),
    chatBody: document.getElementById("chat-body"),
    chatInput: document.getElementById("chat-input"),
    sendButton: document.getElementById("chat-send"),
    backButton: document.getElementById("chat-back"),
    closeButton: document.getElementById("chat-close"),
    inputArea: document.getElementById("chat-input-area"),
  };
  function rs() {
    w.backButton && (w.backButton.textContent = C("ui.back")),
      w.sendButton && (w.sendButton.textContent = C("ui.send"));
  }
  const D = document.createElement("div");
  (D.id = "summary-bar"), (D.style.display = "none");
  const T = document.createElement("div");
  (T.id = "content-area"), ss(), w.chatBody.appendChild(T);
  function ss() {
    !D.isConnected &&
      w.chatWidget &&
      w.chatBody &&
      w.chatWidget.insertBefore(D, w.chatBody);
  }
  function le(e, { replace: t = !1 } = {}) {
    Ge();
    const n = de();
    t && (n.innerHTML = "");
    const r = document.createElement("div");
    (r.className = "bubble bot"),
      (r.innerHTML = String(e ?? "")),
      n.appendChild(r),
      $();
  }
  function po() {
    le(C("msg.localAuth"), { replace: !0 });
  }
  function en(e, t) {
    Ge();
    const n = document.createElement("div");
    (n.className = "options-list"),
      e.forEach((r) => {
        const s = r.optionName || r,
          o = r.optionValue || s,
          i = document.createElement("button");
        (i.className =
          "option-btn" + (o === "/goBack" ? " option-btn-back" : "")),
          (i.textContent = Gt(s)),
          (i.onclick = () => t(o, s)),
          n.appendChild(i);
      }),
      T.appendChild(n);
  }
  function os() {
    let e = T.querySelector("#date-list");
    if (!e) {
      const t = document.createElement("div");
      T.appendChild(t),
        (e = document.createElement("div")),
        (e.id = "date-list"),
        (e.className = "date-list"),
        T.appendChild(e);
    }
    return e;
  }
  function is(e) {
    let t = T.querySelector("#load-more-btn");
    t ||
      ((t = document.createElement("button")),
      (t.id = "load-more-btn"),
      (t.className = "load-more"),
      (t.textContent = C("ui.loadMore")),
      (t.onclick = e),
      T.appendChild(t));
  }
  function as() {
    const e = T.querySelector("#load-more-btn");
    e && e.remove();
  }
  function ke(e) {
    w.backButton.style.display = e ? "inline-block" : "none";
  }
  function ue(e) {
    w.inputArea.style.display = e ? "flex" : "none";
  }
  function Oe() {
    document
      .querySelectorAll(".option-btn, .date-btn, .load-more")
      .forEach((e) => {
        (e.disabled = !0), e.classList.add("disabled");
      });
  }
  function $() {
    es(w.chatBody);
  }
  let mo = null,
    tn = !1;
  function cs() {
    if (tn) return;
    const e = document.createElement("style");
    (e.textContent = `
@keyframes cm-spin { to { transform: rotate(360deg) } }
#cm-loader {
  display:flex; align-items:center; justify-content:center;
  gap:12px; padding:24px; min-height:120px;
}
#cm-loader .spinner {
  width:28px; height:28px; border-radius:50%;
  border:3px solid rgba(0,0,0,.2); border-top-color: rgba(67, 38, 121, 0.9);
  animation: cm-spin 1s linear infinite;
}`),
      document.head.appendChild(e),
      (tn = !0);
  }
  let nn = !1;
  function ls() {
    if (nn) return;
    const e = document.createElement("style");
    (e.textContent = `
#content-area .bubble.skeleton{
  align-self:flex-start;
  background:#f5f6f8;
  border-radius:16px; border-top-left-radius:6px;
  
  padding:8px 10px;
  width:clamp(260px, 78%, 700px);
  box-shadow:0 1px 2px rgba(0,0,0,.06);
}

.bubble.skeleton .sk-row{
  position:relative;
  height:8px;               
  margin:4px 0;             
  border-radius:6px;
  background:#cfd6e3;       
  overflow:hidden;
}


.bubble.skeleton .w100{width:100%}
.bubble.skeleton .w95 {width:95% }   
.bubble.skeleton .w90 {width:90% }
.bubble.skeleton .w80 {width:80% }
.bubble.skeleton .w70 {width:70% }
.bubble.skeleton .w60 {width:60% }
.bubble.skeleton .w50 {width:50% }


#content-area .bubble.skeleton .sk-row:nth-child(n+5){ display:none; }


.bubble.skeleton .sk-row::after{
  content:"";
  position:absolute; inset:0;
  transform:translateX(-100%);
  background:linear-gradient(90deg,
    rgba(255,255,255,0) 0%,
    rgba(238,241,245,.95) 45%,
    rgba(255,255,255,0) 90%
  );
  animation:sk-shine 1.05s linear infinite;
}
@keyframes sk-shine{
  0%{transform:translateX(-100%)} 100%{transform:translateX(100%)}
}
`),
      document.head.appendChild(e),
      (nn = !0);
  }
  let rn = !1;
  function us() {
    if (rn) return;
    const e = document.createElement("style");
    (e.textContent = `
#content-area .bubble.pending{
  align-self:flex-start;
  background:#f5f6f8; color:#0f2747;
  border-radius:16px; border-top-left-radius:6px;
  padding:8px 12px; max-width: clamp(180px, 50%, 360px);
  box-shadow:0 1px 2px rgba(0,0,0,.06);
  display:inline-flex; align-items:center; gap:8px;
  font-size:14px; opacity:.85;
}
.pending .dots{ display:inline-flex; gap:4px; }
.pending .dot{
  width:6px; height:6px; border-radius:50%;
  background:rgba(15,39,71,.55);
  opacity:.35; animation: cm-typing 1.1s infinite;
}
.pending .dot:nth-child(2){ animation-delay:.15s }
.pending .dot:nth-child(3){ animation-delay:.30s }
@keyframes cm-typing{ 0%,60%,100%{transform:translateY(0);opacity:.35} 30%{transform:translateY(-2px);opacity:.95} }
`),
      document.head.appendChild(e),
      (rn = !0);
  }
  let I = null;
  function Ye(e = "") {
    if ((us(), I && I.isConnected)) return I;
    const t = de();
    return (
      (I = document.createElement("div")),
      (I.className = "bubble pending"),
      (I.innerHTML = `
    <span class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
    <span>${
      e || (typeof C == "function" && C("ui.loading")) || "Loading…"
    }</span>
  `),
      t.appendChild(I),
      $(),
      I
    );
  }
  function sn() {
    I && (I.remove(), (I = null));
  }
  function ds(e) {
    cs(), Ge();
    const t = document.createElement("div");
    t.id = "cm-loader";
    const n = document.createElement("div");
    n.className = "spinner";
    const r = document.createElement("div");
    (r.textContent =
      e || (typeof C == "function" && C("ui.loading")) || "Loading…"),
      t.appendChild(n),
      t.appendChild(r),
      T.appendChild(t);
  }
  function fs() {
    const e = T.querySelector("#cm-loader");
    e && e.remove();
  }
  function de() {
    let e = T.querySelector(".msg__text");
    return (
      e ||
        ((T.innerHTML = ""),
        (e = document.createElement("div")),
        (e.className = "msg__text"),
        T.appendChild(e)),
      e
    );
  }
  function ps() {
    ls();
    const e = de(),
      t = ["w100", "w95", "w80", "w60"],
      n = document.createElement("div");
    return (
      (n.className = "bubble skeleton"),
      n.setAttribute("data-skel", "1"),
      t.forEach((r) => {
        const s = document.createElement("div");
        (s.className = `sk-row ${r}`), n.appendChild(s);
      }),
      e.appendChild(n),
      $(),
      n
    );
  }
  function ms(e, t) {
    return !t || !t.isConnected
      ? !1
      : ((t.className = "bubble bot"),
        (t.innerHTML = String(e ?? "")),
        t.removeAttribute("data-skel"),
        $(),
        !0);
  }
  function hs(e) {
    e && e.isConnected && e.remove();
  }
  function Ge() {
    T.querySelectorAll(
      ".options-list, #date-list, #load-more-btn, #cm-loader"
    ).forEach((e) => e.remove());
  }
  function ys(e) {
    const t = de(),
      n = document.createElement("div");
    (n.className = "bubble user"),
      (n.textContent = String(e ?? "")),
      t.appendChild(n),
      $();
  }
  function Qe(e) {
    const t = de(),
      n = document.createElement("div");
    (n.className = "bubble bot"),
      (n.innerHTML = String(e ?? "")),
      t.appendChild(n),
      $();
  }
  const on = 14,
    gs = 3,
    bs = 2;
  async function ws(e) {
    const t = U(e),
      n = We(t);
    if (n === -1) return !1;
    let r = on,
      s = 0;
    for (; r-- > 0; ) {
      const o = We(l.currentStepName || "");
      if (o !== -1 && o <= n) return !0;
      let i;
      try {
        i = await j("/goBack", !1);
      } catch {
        break;
      }
      if ((await K(i), We(l.currentStepName || "") >= o)) {
        if (++s >= bs) break;
      } else s = 0;
    }
    return !1;
  }
  const Ss = { service: "service type", "service type": "location" };
  async function an(e) {
    let t = U(e);
    for (let n = 0; n < gs && t; n++) {
      if (await ws(t)) return;
      t = Ss[t];
    }
  }
  async function Le(e) {
    const t = U(e);
    if (!t) return;
    let n = on;
    for (; n-- > 0 && U(l.currentStepName) !== t; ) {
      let r;
      try {
        r = await j("/goBack", !1);
      } catch {
        break;
      }
      await K(r);
    }
  }
  const Ze = (e) =>
      String(e || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim(),
    W = (e, ...t) => {
      for (const n of t) {
        const r = Ze(n);
        if (!r) continue;
        const s = r.split(/[|,;]+/).map((o) => o.trim());
        for (const o of e)
          if (r === o || r.includes(o) || s.includes(o)) return !0;
      }
      return !1;
    };
  function Es() {
    Kt(), ue(!1), ke(!1), et(), rt();
  }
  async function xs() {
    try {
      (l.JOURNEYS = await hn()), (l.commands = await yn());
    } catch (e) {
      console.error("Failed to load configuration:", e), (l.JOURNEYS = []);
    }
    ze(),
      (l.journeyChosen = null),
      (l.pendingId = ""),
      ue(!0),
      ke(!1),
      rt(),
      ze(),
      Wt(),
      et();
  }
  async function As() {
    await Yt(), rs(), Rs(), xs();
  }
  function Rs() {
    w.toggleButton.addEventListener("click", () => {
      w.chatWidget.classList.add("open"),
        (w.toggleButton.style.display = "none");
    }),
      w.closeButton.addEventListener("click", (e) => {
        e.stopPropagation(),
          w.chatWidget.classList.remove("open"),
          (w.toggleButton.style.display = "block");
      }),
      w.sendButton.addEventListener("click", cn),
      w.chatInput.addEventListener("keydown", (e) => {
        e.key === "Enter" && (e.preventDefault(), cn());
      }),
      w.backButton.addEventListener("click", Cs);
  }
  async function Cs(e) {
    if ((e?.preventDefault?.(), !l.backLockedUntilRestart)) {
      Oe(), Ye(C("ui.loading") || "Loading…");
      try {
        const t = await j("/goBack", !1);
        await K(t);
      } catch (t) {
        sn(), le(String(t?.message || "Back failed"));
      }
    }
  }
  async function cn(e) {
    e?.preventDefault?.();
    const t = w.chatInput.value.trim();
    if (!t) return;
    ys(t), (w.chatInput.value = "");
    let n = null;
    const r = setTimeout(() => {
      n = ps();
    }, 200);
    try {
      const s = await j(t, !1);
      clearTimeout(r),
        n ? ms(s.message, n) : Qe(s.message),
        await K(s, { skipMessage: !0 });
    } catch {
      clearTimeout(r), n && hs(n), Qe("…connection error, please try again.");
    }
  }
  function et() {
    if ((le(""), (T.innerHTML = ""), !l.JOURNEYS.length)) {
      le("No journeys configured. Please add them to appsettings.json.");
      return;
    }
    en(
      l.JOURNEYS.map((e) => ({ optionName: e.label, optionValue: e.value })),
      () => {}
    ),
      T.querySelectorAll(".option-btn").forEach((e, t) => {
        const n = l.JOURNEYS[t];
        e.onclick = () => Ts(n);
      });
  }
  async function Ts(e) {
    l.journeyChosen = e;
    const t = e.defaultLng || "en";
    await Vr(t), await Wr(t), qr(), zt(), Oe();
    const n = Kr("ui.loading", t);
    ds(n);
    try {
      const r = await j(e.value, !0);
      await K(r), await _s(r);
    } catch (r) {
      (l.journeyChosen = null), ue(!0), ke(!1), nt(r.message);
    } finally {
      fs();
    }
  }
  async function tt(e, t) {
    if (W(l.commands.restart, e, t)) {
      Es();
      return;
    }
    if (W(l.commands.end, e, t)) {
      Jt(), Vt(), ue(!1);
      return;
    }
    if ((W(l.commands.cancel, e, t) && Oe(), e === "/goBack")) {
      await Os();
      return;
    }
    const n = l.currentStepName;
    try {
      const r = await j(e, !1);
      ks(n, t), await K(r);
    } catch (r) {
      nt(r.message);
    }
  }
  function ks(e, t) {
    if (!e || !t) return;
    switch (U(e)) {
      case "customer identification":
        (l.selection.id = t), (l.pendingId = "");
        break;
      case "service type":
        l.selection.serviceType = t;
        break;
      case "service":
        l.selection.service = t;
        break;
      case "location":
        l.selection.location = t;
        break;
      case "date":
        l.selection.date = t;
        break;
      case "time":
        l.selection.time = t;
        break;
      default:
        l.lastScreenWasAuthLike &&
          /^\d+$/.test(String(t)) &&
          ((l.selection.id = t), (l.pendingId = ""));
        break;
    }
  }
  async function Os() {
    Oe();
    try {
      const e = await j("/goBack", !1);
      await K(e);
    } catch (e) {
      nt(e.message);
    }
  }
  function Ls(e) {
    if (Zr(e)) return !0;
    const t = Array.isArray(e?.options) ? e.options : [];
    return !t.length ||
      !t.some((s) =>
        W(l.commands.restart, s?.optionValue ?? s, s?.optionName ?? s)
      )
      ? !1
      : !t.some((s) => {
          const o = s?.optionValue ?? s,
            i = s?.optionName ?? s;
          return !(
            W(l.commands.restart, o, i) ||
            W(l.commands.cancel, o, i) ||
            Ze(o) === "/goback" ||
            Ze(i) === "/goback"
          );
        });
  }
  async function K(e, t = {}) {
    sn();
    const { skipMessage: n = !1 } = t;
    (l.currentStepName = Ke(e) || l.currentStepName || ""),
      Gr(e),
      ts(e, l.selection);
    const r = Xe(e),
      s = Ls(e);
    ue(!s),
      (l.lastScreenWasAuthLike = r),
      r &&
        l.pendingId &&
        w.chatInput &&
        !w.chatInput.value &&
        (w.chatInput.value = l.pendingId),
      s && (Jt(), Vt());
    const o = e.journeyMap || [],
      i = Hr(o) && !s;
    ke(i), Ns(l.currentStepName), rt(), n || le(e.message);
    const c = Array.isArray(e.options) ? e.options : [],
      f = (p) => /^\d{2}\/\d{2}\/\d{4}$/.test(p.optionName || p),
      d = c.filter(f),
      u = c.filter(
        (p) => !W(l.commands.end, p?.optionValue ?? p, p?.optionName ?? p)
      );
    d.length
      ? (await Bs(c), (l.datesShown = 0), ln())
      : u.length && en(u, (p, b) => tt(p, b)),
      $();
  }
  function nt(e) {
    const t = e?.message ? String(e.message) : String(e || "Unknown error");
    Qe(t), $();
  }
  function Ns(e) {
    if (!e || l.availableSteps.size === 0) return;
    l.availableSteps.has("service type") || (l.selection.serviceType = ""),
      l.availableSteps.has("service") || (l.selection.service = ""),
      l.availableSteps.has("location") || (l.selection.location = ""),
      l.availableSteps.has("date") || (l.selection.date = ""),
      l.availableSteps.has("time") || (l.selection.time = "");
    const t = $t.filter((o) => l.availableSteps.has(o)),
      n = U(e),
      r = t.indexOf(n);
    if (r === -1) return;
    const s = {
      id: "customer identification",
      serviceType: "service type",
      service: "service",
      location: "location",
      date: "date",
      time: "time",
    };
    for (const [o, i] of Object.entries(s)) {
      const c = t.indexOf(i);
      c !== -1 && c >= r && (l.selection[o] = "");
    }
  }
  function rt() {
    const e = l.selection;
    if (
      !(
        !!l.journeyChosen?.label ||
        e.id ||
        e.serviceType ||
        e.service ||
        e.location ||
        e.date ||
        e.time
      )
    ) {
      (D.style.display = "none"), (D.innerHTML = "");
      return;
    }
    (D.style.display = "block"), (D.innerHTML = "");
    const n = document.createElement("div");
    n.className = "summary-card";
    const r = document.createElement("div");
    (r.className = "summary-title"),
      (r.textContent = C("chipsTitle") || "Your selection"),
      n.appendChild(r);
    const s = document.createElement("div");
    s.className = "summary-chips";
    const o = (i, c, f, d) => {
      if (!c) return;
      const u = document.createElement("button");
      (u.className = "chip"),
        (u.title = C("chipChange") || "Change"),
        (u.textContent = `${C(`chips.${i}`)}: ${c}`),
        l.backLockedUntilRestart || l.chipsLocked
          ? ((u.disabled = !0), u.classList.add("disabled"))
          : (u.onclick = d
              ? () => {
                  Ye(), d();
                }
              : () => {
                  Ye(), Le(f);
                }),
        s.appendChild(u);
    };
    o("id", e.id, "Customer Identification"),
      l.journeyChosen?.label &&
        o("journey", l.journeyChosen.label, null, () => {
          l.backLockedUntilRestart || et();
        }),
      o("serviceType", e.serviceType, "Service Type", () => an("Service Type")),
      o("service", e.service, "Service", () => an("Service")),
      o("location", e.location, "Location", () => Le("Location")),
      o("date", e.date, "Date", () => Le("Date")),
      o("time", e.time, "Time", () => Le("Time")),
      n.appendChild(s),
      D.appendChild(n);
  }
  async function Bs(e) {
    let t = e;
    for (l.availableDates = []; ; ) {
      l.availableDates.push(
        ...t
          .map((s) => s.optionName || s)
          .filter((s) => /^\d{2}\/\d{2}\/\d{4}$/.test(s))
      );
      const n = t.find((s) => {
        const o = String(s.optionValue ?? s).toLowerCase();
        if (l.commands.loadMore.has(o)) return !0;
        const i = String(s.optionName || s).toLowerCase(),
          c = String(C("ui.loadMore") || "").toLowerCase();
        return c && i === c;
      });
      if (!n) break;
      t = (await j(n.optionValue || n.optionName, !1)).options || [];
    }
  }
  function ln() {
    const e = os(),
      t = Math.min(l.datesShown + 9, l.availableDates.length);
    for (let n = l.datesShown; n < t; n++) {
      const r = l.availableDates[n],
        s = document.createElement("button");
      (s.className = "date-btn"),
        (s.textContent = r),
        (s.onclick = () => tt(r, r)),
        e.appendChild(s);
    }
    (l.datesShown = t),
      l.datesShown < l.availableDates.length ? is(() => ln()) : as();
  }
  function vs(e) {
    const t = Array.isArray(e?.options) && e.options.length > 0;
    return Xe(e) && !t;
  }
  async function _s(e) {
    const t = l.pendingId || "";
    t &&
      (Xe(e) && w.chatInput && (w.chatInput.value = t),
      vs(e) && (await tt(t, t)));
  }
  const un = Yt || void 0;
  async function Ps(e = {}) {
    const t = e.hostId || "chat-widget";
    let n = document.getElementById(t);
    n ||
      ((n = document.createElement("div")),
      (n.id = t),
      (n.style.cssText = "width:360px;height:520px;border:1px solid #ddd;"),
      document.body.appendChild(n));
    const r = n,
      s = e.lng || "en";
    return (
      typeof un == "function" && (await un(s)),
      l && (l.lngCode = s),
      Jr?.(s),
      As?.({ root: r, ...e })
    );
  }
  function Us(...e) {
    return j(...e);
  }
  return (
    (fe.SendMessage = Us),
    (fe.init = Ps),
    Object.defineProperty(fe, Symbol.toStringTag, { value: "Module" }),
    fe
  );
})({});
