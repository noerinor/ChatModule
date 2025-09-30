(function (p, I) {
  typeof exports == "object" && typeof module < "u"
    ? I(exports)
    : typeof define == "function" && define.amd
    ? define(["exports"], I)
    : ((p = typeof globalThis < "u" ? globalThis : p || self),
      I((p.QFChat = {})));
})(this, function (p) {
  "use strict";
  function I() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
      const t = (Math.random() * 16) | 0;
      return (e === "x" ? t : (t & 3) | 8).toString(16);
    });
  }
  const oe = [
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
  function xe() {
    const e = (
        navigator.language ||
        navigator.userLanguage ||
        "en"
      ).toLowerCase(),
      [t] = e.split("-");
    return t || "en";
  }
  let ie = localStorage.getItem("sessionId") || (crypto?.randomUUID?.() ?? I());
  localStorage.setItem("sessionId", ie);
  const o = {
    isAuthPhase: !0,
    lastScreenWasAuthLike: !1,
    currentStepName: "",
    lngCode: xe(),
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
  function ke() {
    (o.selection.serviceType = ""),
      (o.selection.service = ""),
      (o.selection.location = ""),
      (o.selection.date = ""),
      (o.selection.time = "");
  }
  function re() {
    (o.availableSteps = new Set()),
      (o.journeyOrder = []),
      (o.availableDates = []),
      (o.datesShown = 0);
  }
  function ve() {
    Object.assign(o.selection, {
      id: "",
      serviceType: "",
      service: "",
      location: "",
      date: "",
      time: "",
    });
  }
  function se() {
    o.backLockedUntilRestart = !0;
  }
  function H() {
    o.backLockedUntilRestart = !1;
  }
  function ce() {
    o.chipsLocked = !0;
  }
  function le() {
    o.chipsLocked = !1;
  }
  function Ce() {
    ve(),
      re(),
      (o.journeyChosen = null),
      (o.pendingId = ""),
      (o.currentStepName = ""),
      H(),
      le();
  }
  function Le() {
    return o.backLockedUntilRestart ? !1 : !!o.journeyChosen;
  }
  let Ae = "./locales";
  const g = Object.create(null);
  let h = Be(),
    m = "en";
  function A(e) {
    const t = String(e || "en")
      .toLowerCase()
      .split("-")[0]
      .trim();
    return t === "iw" ? "he" : t === "ua" ? "uk" : t || "en";
  }
  function Be() {
    try {
      const e =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        "en";
      return A(e);
    } catch {
      return "en";
    }
  }
  async function N(e) {
    const t = A(e);
    if (g[t]) return g[t];
    try {
      const n = await fetch(`${Ae}/chatbot.${t}.json`, { cache: "no-store" });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      const a = await n.json();
      return (g[t] = a), a;
    } catch (n) {
      return (
        console.warn(
          `[localization] Missing language file "${t}" (${n.message}).`
        ),
        (g[t] = {}),
        g[t]
      );
    }
  }
  function B(e, t) {
    return String(t || "")
      .split(".")
      .reduce((n, a) => (n && a in n ? n[a] : void 0), e);
  }
  function F(e) {
    try {
      const t = A(e),
        n =
          (Intl?.Locale && new Intl.Locale(t).textInfo?.direction) ||
          (["ar", "fa", "he", "ur"].includes(t) ? "rtl" : "ltr");
      document.documentElement.dir = n || "ltr";
    } catch {
      document.documentElement.dir = "ltr";
    }
  }
  async function de(e) {
    e && (h = A(e));
    const t = [N("en"), N(h)];
    m && m !== "en" && m !== h && t.push(N(m)),
      await Promise.all(t),
      F(h || m || "en");
  }
  function J() {
    return h;
  }
  function Ee(e) {
    (h = A(e)), F(h);
  }
  async function Ie(e) {
    (m = A(e)), await N(m), F(h || m);
  }
  async function Ne(e) {
    await N(e);
  }
  function u(e) {
    let t;
    return (
      (t = B(g[h] || {}, e)),
      t !== void 0
        ? t
        : ((t = B(g[m] || {}, e)),
          t !== void 0
            ? (console.warn(
                `[localization] Missing "${e}" for "${h}", used journey default "${m}".`
              ),
              t)
            : ((t = B(g.en || {}, e)),
              t !== void 0
                ? (console.warn(
                    `[localization] Missing "${e}" for "${h}" and "${m}", used "en".`
                  ),
                  t)
                : (console.warn(
                    `[localization] Missing key "${e}" in all languages.`
                  ),
                  e)))
    );
  }
  function Te(e, t) {
    const n = String(t).toLowerCase().split("-")[0];
    let a = B(g[n] || {}, e);
    return a !== void 0 ||
      ((a = B(g[m] || {}, e)), a !== void 0) ||
      ((a = B(g.en || {}, e)), a !== void 0)
      ? a
      : e;
  }
  const S = (e) =>
    String(e || "")
      .toLowerCase()
      .trim();
  let T = { lang: null, steps: {}, hereRegex: null, ignoreSet: new Set() };
  function q() {
    const e = J();
    if (T.lang === e && T.hereRegex) return T;
    const t = u("aliases.steps"),
      n = u("aliases.here"),
      a = u("aliases.ignore"),
      i = {
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
      r = {},
      s = typeof t == "object" && t ? t : {};
    for (const E of Object.keys(i)) {
      const It = Array.isArray(s[E]) ? s[E] : [];
      r[E] = [...new Set([...(It || []), ...i[E]])];
    }
    const O = `^(${(Array.isArray(n) && n.length
        ? n
        : ["you are here", "вы здесь", "ви тут", "אתה כאן", "את כאן", "אתם כאן"]
      )
        .map((E) => E.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})\\s*:\\s*`,
      L = new RegExp(O, "i"),
      l = ["cancelling option", "опция отмены"],
      ae = Array.isArray(a) ? a : [],
      Et = new Set([...l.map(S), ...ae.map(S)]);
    return (T = { lang: e, steps: r, hereRegex: L, ignoreSet: Et }), T;
  }
  function b(e) {
    const { steps: t, hereRegex: n } = q(),
      a = S(String(e || "").replace(n, ""));
    if (!a) return "";
    for (const [i, r] of Object.entries(t))
      if (r.some((s) => a.includes(S(s)))) return i;
    return a;
  }
  function z(e) {
    const t = b(e),
      a = (Array.isArray(o.journeyOrder) ? o.journeyOrder : []).indexOf(t);
    if (a !== -1) return a;
    const i = oe.indexOf(t);
    return i === -1 ? 999 : 500 + i;
  }
  function W(e) {
    const { hereRegex: t } = q(),
      n = e?.journeyMap || [],
      a = n.find((r) => t.test(r?.stepName || ""));
    if (a) return b(a.stepName);
    for (const r of n) {
      const s = b(r.stepName || "");
      if (s) return s;
    }
    const i = (e?.options || []).map((r) => r.optionName || r);
    return i.some((r) => /^\d{2}\/\d{2}\/\d{4}$/.test(r))
      ? "date"
      : i.some((r) => /^\d{1,2}:\d{2}$/.test(r))
      ? "time"
      : S(e?.message || "").includes("services -")
      ? "service"
      : null;
  }
  function je(e) {
    const { hereRegex: t, ignoreSet: n } = q();
    o.availableSteps || (o.availableSteps = new Set()),
      Array.isArray(o.journeyOrder) || (o.journeyOrder = []);
    const i = (e?.journeyMap || [])
      .map((r) =>
        String(r.stepName || "")
          .replace(t, "")
          .trim()
      )
      .filter((r) => !n.has(S(r)))
      .map(b)
      .filter((r) => r);
    for (const r of i)
      o.availableSteps.add(r),
        o.journeyOrder.includes(r) || o.journeyOrder.push(r);
  }
  function Me(e) {
    return W(e) === "customer identification";
  }
  function Oe(e) {
    return W(e) === "success";
  }
  function ue(e) {
    const n = String(e || "")
        .replace(/<ol[\s\S]*?<\/ol>/gi, "")
        .replace(/<ul[\s\S]*?<\/ul>/gi, "")
        .replace(
          /<br\s*\/?>/gi,
          `
`
        ),
      a = document.createElement("div");
    return (
      (a.innerHTML = n),
      (a.textContent || a.innerText || "")
        .replace(/\r/g, "")
        .replace(
          /\n{3,}/g,
          `

`
        )
        .trim()
    );
  }
  function Ue(e) {
    e && (e.scrollTop = e.scrollHeight);
  }
  function $e(e, t) {
    if (!e || !t) return;
    const n = Array.isArray(e.journeyMap) ? e.journeyMap : [];
    for (const { stepName: a, stepAnswer: i } of n)
      if (i)
        switch (b(a)) {
          case "service type":
            t.serviceType = i;
            break;
          case "service":
            t.service = i;
            break;
          case "location":
            t.location = i;
            break;
          case "date":
            t.date = i;
            break;
          case "time":
            t.time = i;
            break;
        }
  }
  let U = { lang: null, enterIdPhrases: [] };
  function Re() {
    const e = J();
    if (U.lang === e) return U;
    let t = u("detect.auth.enterId");
    return (
      (!Array.isArray(t) || t.length === 0) &&
        (t = [
          "enter your id",
          "please enter your id",
          "id must hold digits only",
        ]),
      (U = { lang: e, enterIdPhrases: t.filter(Boolean) }),
      U
    );
  }
  function Y(e) {
    if (Me(e)) return !0;
    if (!(!Array.isArray(e?.options) || e.options.length === 0)) return !1;
    const n = S(ue(e?.message || "")),
      { enterIdPhrases: a } = Re();
    return a.some((i) => n.includes(S(i)));
  }
  const c = {
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
  function _e() {
    c.backButton && (c.backButton.textContent = u("ui.back")),
      c.sendButton && (c.sendButton.textContent = u("ui.send"));
  }
  const w = document.createElement("div");
  (w.id = "summary-bar"), (w.style.display = "none");
  const d = document.createElement("div");
  (d.id = "content-area"), De(), c.chatBody.appendChild(d);
  function De() {
    !w.isConnected &&
      c.chatWidget &&
      c.chatBody &&
      c.chatWidget.insertBefore(w, c.chatBody);
  }
  function $(e, { replace: t = !1 } = {}) {
    X();
    const n = M();
    t && (n.innerHTML = "");
    const a = document.createElement("div");
    (a.className = "bubble bot"),
      (a.innerHTML = String(e ?? "")),
      n.appendChild(a),
      x();
  }
  function fe(e, t) {
    X();
    const n = document.createElement("div");
    (n.className = "options-list"),
      e.forEach((a) => {
        const i = a.optionName || a,
          r = a.optionValue || i,
          s = document.createElement("button");
        (s.className =
          "option-btn" + (r === "/goBack" ? " option-btn-back" : "")),
          (s.textContent = ue(i)),
          (s.onclick = () => t(r, i)),
          n.appendChild(s);
      }),
      d.appendChild(n);
  }
  function Pe() {
    let e = d.querySelector("#date-list");
    if (!e) {
      const t = document.createElement("div");
      d.appendChild(t),
        (e = document.createElement("div")),
        (e.id = "date-list"),
        (e.className = "date-list"),
        d.appendChild(e);
    }
    return e;
  }
  function He(e) {
    let t = d.querySelector("#load-more-btn");
    t ||
      ((t = document.createElement("button")),
      (t.id = "load-more-btn"),
      (t.className = "load-more"),
      (t.textContent = u("ui.loadMore")),
      (t.onclick = e),
      d.appendChild(t));
  }
  function Fe() {
    const e = d.querySelector("#load-more-btn");
    e && e.remove();
  }
  function R(e) {
    c.backButton.style.display = e ? "inline-block" : "none";
  }
  function j(e) {
    c.inputArea.style.display = e ? "flex" : "none";
  }
  function _() {
    document
      .querySelectorAll(".option-btn, .date-btn, .load-more")
      .forEach((e) => {
        (e.disabled = !0), e.classList.add("disabled");
      });
  }
  function x() {
    Ue(c.chatBody);
  }
  let pe = !1;
  function Je() {
    if (pe) return;
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
      (pe = !0);
  }
  let me = !1;
  function qe() {
    if (me) return;
    const e = document.createElement("style");
    (e.textContent = `
#content-area .bubble.skeleton{
  align-self:flex-start;
  background:#f5f6f8;
  border-radius:16px; border-top-left-radius:6px;
  /* компактные паддинги — один источник правды */
  padding:8px 10px;
  width:clamp(260px, 78%, 700px);
  box-shadow:0 1px 2px rgba(0,0,0,.06);
}

.bubble.skeleton .sk-row{
  position:relative;
  height:8px;               /* ниже строка */
  margin:4px 0;             /* меньше отступ */
  border-radius:6px;
  background:#cfd6e3;       /* контраст */
  overflow:hidden;
}

/* ширины строк */
.bubble.skeleton .w100{width:100%}
.bubble.skeleton .w95 {width:95% }   /* ← ДОБАВЛЕНО */
.bubble.skeleton .w90 {width:90% }
.bubble.skeleton .w80 {width:80% }
.bubble.skeleton .w70 {width:70% }
.bubble.skeleton .w60 {width:60% }
.bubble.skeleton .w50 {width:50% }

/* скрыть всё после 4-й строки — компактная высота */
#content-area .bubble.skeleton .sk-row:nth-child(n+5){ display:none; }

/* шимер */
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
      (me = !0);
  }
  let ge = !1;
  function ze() {
    if (ge) return;
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
      (ge = !0);
  }
  let y = null;
  function V(e = "") {
    if ((ze(), y && y.isConnected)) return y;
    const t = M();
    return (
      (y = document.createElement("div")),
      (y.className = "bubble pending"),
      (y.innerHTML = `
    <span class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
    <span>${
      e || (typeof u == "function" && u("ui.loading")) || "Loading…"
    }</span>
  `),
      t.appendChild(y),
      x(),
      y
    );
  }
  function he() {
    y && (y.remove(), (y = null));
  }
  function We(e) {
    Je(), X();
    const t = document.createElement("div");
    t.id = "cm-loader";
    const n = document.createElement("div");
    n.className = "spinner";
    const a = document.createElement("div");
    (a.textContent =
      e || (typeof u == "function" && u("ui.loading")) || "Loading…"),
      t.appendChild(n),
      t.appendChild(a),
      d.appendChild(t);
  }
  function Ye() {
    const e = d.querySelector("#cm-loader");
    e && e.remove();
  }
  function M() {
    let e = d.querySelector(".msg__text");
    return (
      e ||
        ((d.innerHTML = ""),
        (e = document.createElement("div")),
        (e.className = "msg__text"),
        d.appendChild(e)),
      e
    );
  }
  function Ve() {
    qe();
    const e = M(),
      t = ["w100", "w95", "w80", "w60"],
      n = document.createElement("div");
    return (
      (n.className = "bubble skeleton"),
      n.setAttribute("data-skel", "1"),
      t.forEach((a) => {
        const i = document.createElement("div");
        (i.className = `sk-row ${a}`), n.appendChild(i);
      }),
      e.appendChild(n),
      x(),
      n
    );
  }
  function Xe(e, t) {
    return !t || !t.isConnected
      ? !1
      : ((t.className = "bubble bot"),
        (t.innerHTML = String(e ?? "")),
        t.removeAttribute("data-skel"),
        x(),
        !0);
  }
  function Ke(e) {
    e && e.isConnected && e.remove();
  }
  function X() {
    d.querySelectorAll(
      ".options-list, #date-list, #load-more-btn, #cm-loader"
    ).forEach((e) => e.remove());
  }
  function Ge(e) {
    const t = M(),
      n = document.createElement("div");
    (n.className = "bubble user"),
      (n.textContent = String(e ?? "")),
      t.appendChild(n),
      x();
  }
  function K(e) {
    const t = M(),
      n = document.createElement("div");
    (n.className = "bubble bot"),
      (n.innerHTML = String(e ?? "")),
      t.appendChild(n),
      x();
  }
  const Qe = "appsettings.json";
  let D = null;
  async function G() {
    if (D) return D;
    const e = await fetch(Qe, { cache: "no-store" });
    if (!e.ok) throw new Error(`config http error: ${e.status}`);
    return (D = await e.json()), D;
  }
  async function Ze() {
    const e = await G(),
      t = new URL(location.href).searchParams.get("api");
    if (t) return t;
    if (!e.apiUrl) throw new Error("appsettings.json: missing 'apiUrl'.");
    return String(e.apiUrl);
  }
  async function et() {
    const e = await G(),
      t = String(e.journeyCommandPrefix || "/select-journey-");
    return (e.journeys || [])
      .map((a) =>
        a.id && !a.command && !a.value
          ? {
              label: a.label,
              value: `${t}${a.id}`,
              defaultLng: a.defaultLng || a.defaultLanguage || "en",
            }
          : {
              label: a.label,
              value: a.command || a.value,
              defaultLng: a.defaultLng || a.defaultLanguage || "en",
            }
      )
      .filter((a) => a.label && a.value);
  }
  async function tt() {
    const e = await G(),
      t = (n, a = []) =>
        new Set((Array.isArray(n) ? n : a).map((i) => String(i).toLowerCase()));
    return {
      restart: t(e.commands?.restart, ["/restart"]),
      end: t(e.commands?.end, ["/endjourney"]),
      cancel: t(e.commands?.cancel, ["/cancelapp"]),
      skip: t(e.commands?.skip, ["/skip"]),
      loadMore: t(e.commands?.loadMore, ["/loadmore"]),
      freeText: t(e.commands?.freeText, []),
    };
  }
  const nt = 25e3;
  async function k(e, t) {
    const n = await Ze(),
      a = new AbortController(),
      i = setTimeout(() => a.abort(), nt);
    try {
      const r = await fetch(n, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { SessionId: ie, Message: e, ClearCache: !!t, LngCode: J() },
        ]),
        signal: a.signal,
      });
      if (!r.ok) {
        const f = await r.text().catch(() => "");
        throw new Error(`Network error (${r.status})${f ? ` — ${f}` : ""}`);
      }
      const s = await r.json().catch(() => null);
      if (s == null) throw new Error("Empty response");
      return Array.isArray(s) ? s[0] : s;
    } catch (r) {
      throw r.name === "AbortError" ? new Error("Network timeout") : r;
    } finally {
      clearTimeout(i);
    }
  }
  const be = 14,
    at = 3,
    ot = 2;
  async function it(e) {
    const t = b(e),
      n = z(t);
    if (n === -1) return !1;
    let a = be,
      i = 0;
    for (; a-- > 0; ) {
      const r = z(o.currentStepName || "");
      if (r !== -1 && r <= n) return !0;
      let s;
      try {
        s = await k("/goBack", !1);
      } catch {
        break;
      }
      if ((await C(s), z(o.currentStepName || "") >= r)) {
        if (++i >= ot) break;
      } else i = 0;
    }
    return !1;
  }
  const rt = { service: "service type", "service type": "location" };
  async function ye(e) {
    let t = b(e);
    for (let n = 0; n < at && t; n++) {
      if (await it(t)) return;
      t = rt[t];
    }
  }
  async function P(e) {
    const t = b(e);
    if (!t) return;
    let n = be;
    for (; n-- > 0 && b(o.currentStepName) !== t; ) {
      let a;
      try {
        a = await k("/goBack", !1);
      } catch {
        break;
      }
      await C(a);
    }
  }
  const Q = (e) =>
      String(e || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim(),
    v = (e, ...t) => {
      for (const n of t) {
        const a = Q(n);
        if (!a) continue;
        const i = a.split(/[|,;]+/).map((r) => r.trim());
        for (const r of e)
          if (a === r || a.includes(r) || i.includes(r)) return !0;
      }
      return !1;
    };
  function st() {
    Ce(), j(!1), R(!1), Z(), ne();
  }
  async function ct() {
    await de(), _e(), lt(), ut();
  }
  function lt() {
    c.toggleButton.addEventListener("click", () => {
      c.chatWidget.classList.add("open"),
        (c.toggleButton.style.display = "none");
    }),
      c.closeButton.addEventListener("click", (e) => {
        e.stopPropagation(),
          c.chatWidget.classList.remove("open"),
          (c.toggleButton.style.display = "block");
      }),
      c.sendButton.addEventListener("click", we),
      c.chatInput.addEventListener("keydown", (e) => {
        e.key === "Enter" && (e.preventDefault(), we());
      }),
      c.backButton.addEventListener("click", dt);
  }
  async function dt(e) {
    if ((e?.preventDefault?.(), !o.backLockedUntilRestart)) {
      _(), V(u("ui.loading") || "Loading…");
      try {
        const t = await k("/goBack", !1);
        await C(t);
      } catch (t) {
        he(), $(String(t?.message || "Back failed"));
      }
    }
  }
  async function ut() {
    try {
      (o.JOURNEYS = await et()), (o.commands = await tt());
    } catch (e) {
      console.error("Failed to load configuration:", e), (o.JOURNEYS = []);
    }
    H(),
      (o.journeyChosen = null),
      (o.pendingId = ""),
      j(!0),
      R(!1),
      ne(),
      H(),
      le(),
      Z();
  }
  async function we(e) {
    e?.preventDefault?.();
    const t = c.chatInput.value.trim();
    if (!t) return;
    Ge(t), (c.chatInput.value = "");
    let n = null;
    const a = setTimeout(() => {
      n = Ve();
    }, 200);
    try {
      const i = await k(t, !1);
      clearTimeout(a),
        n ? Xe(i.message, n) : K(i.message),
        await C(i, { skipMessage: !0 });
    } catch {
      clearTimeout(a), n && Ke(n), K("…connection error, please try again.");
    }
  }
  function Z() {
    if (($(""), (d.innerHTML = ""), !o.JOURNEYS.length)) {
      $("No journeys configured. Please add them to appsettings.json.");
      return;
    }
    fe(
      o.JOURNEYS.map((e) => ({ optionName: e.label, optionValue: e.value })),
      () => {}
    ),
      d.querySelectorAll(".option-btn").forEach((e, t) => {
        const n = o.JOURNEYS[t];
        e.onclick = () => ft(n);
      });
  }
  async function ft(e) {
    o.journeyChosen = e;
    const t = e.defaultLng || "en";
    await Ie(t), await Ne(t), ke(), re(), _();
    const n = Te("ui.loading", t);
    We(n);
    try {
      const a = await k(e.value, !0);
      await C(a), await wt(a);
    } catch (a) {
      (o.journeyChosen = null), j(!0), R(!1), te(a.message);
    } finally {
      Ye();
    }
  }
  async function ee(e, t) {
    if (v(o.commands.restart, e, t)) {
      st();
      return;
    }
    if (v(o.commands.end, e, t)) {
      se(), ce(), j(!1);
      return;
    }
    if ((v(o.commands.cancel, e, t) && _(), e === "/goBack")) {
      await mt();
      return;
    }
    const n = o.currentStepName;
    try {
      const a = await k(e, !1);
      pt(n, t), await C(a);
    } catch (a) {
      te(a.message);
    }
  }
  function pt(e, t) {
    if (!e || !t) return;
    switch (b(e)) {
      case "customer identification":
        (o.selection.id = t), (o.pendingId = "");
        break;
      case "service type":
        o.selection.serviceType = t;
        break;
      case "service":
        o.selection.service = t;
        break;
      case "location":
        o.selection.location = t;
        break;
      case "date":
        o.selection.date = t;
        break;
      case "time":
        o.selection.time = t;
        break;
      default:
        o.lastScreenWasAuthLike &&
          /^\d+$/.test(String(t)) &&
          ((o.selection.id = t), (o.pendingId = ""));
        break;
    }
  }
  async function mt() {
    _();
    try {
      const e = await k("/goBack", !1);
      await C(e);
    } catch (e) {
      te(e.message);
    }
  }
  function gt(e) {
    if (Oe(e)) return !0;
    const t = Array.isArray(e?.options) ? e.options : [];
    return !t.length ||
      !t.some((i) =>
        v(o.commands.restart, i?.optionValue ?? i, i?.optionName ?? i)
      )
      ? !1
      : !t.some((i) => {
          const r = i?.optionValue ?? i,
            s = i?.optionName ?? i;
          return !(
            v(o.commands.restart, r, s) ||
            v(o.commands.cancel, r, s) ||
            Q(r) === "/goback" ||
            Q(s) === "/goback"
          );
        });
  }
  async function C(e, t = {}) {
    he();
    const { skipMessage: n = !1 } = t;
    (o.currentStepName = W(e) || o.currentStepName || ""),
      je(e),
      $e(e, o.selection);
    const a = Y(e),
      i = gt(e);
    j(!i),
      (o.lastScreenWasAuthLike = a),
      a &&
        o.pendingId &&
        c.chatInput &&
        !c.chatInput.value &&
        (c.chatInput.value = o.pendingId),
      i && (se(), ce()),
      e.journeyMap;
    const r = Le() && !i;
    R(r), ht(o.currentStepName), ne(), n || $(e.message);
    const s = Array.isArray(e.options) ? e.options : [],
      f = (l) => /^\d{2}\/\d{2}\/\d{4}$/.test(l.optionName || l),
      O = s.filter(f),
      L = s.filter(
        (l) => !v(o.commands.end, l?.optionValue ?? l, l?.optionName ?? l)
      );
    O.length
      ? (await bt(s), (o.datesShown = 0), Se())
      : L.length && fe(L, (l, ae) => ee(l, ae)),
      x();
  }
  function te(e) {
    const t = e?.message ? String(e.message) : String(e || "Unknown error");
    K(t), x();
  }
  function ht(e) {
    if (!e || o.availableSteps.size === 0) return;
    o.availableSteps.has("service type") || (o.selection.serviceType = ""),
      o.availableSteps.has("service") || (o.selection.service = ""),
      o.availableSteps.has("location") || (o.selection.location = ""),
      o.availableSteps.has("date") || (o.selection.date = ""),
      o.availableSteps.has("time") || (o.selection.time = "");
    const t = oe.filter((r) => o.availableSteps.has(r)),
      n = b(e),
      a = t.indexOf(n);
    if (a === -1) return;
    const i = {
      id: "customer identification",
      serviceType: "service type",
      service: "service",
      location: "location",
      date: "date",
      time: "time",
    };
    for (const [r, s] of Object.entries(i)) {
      const f = t.indexOf(s);
      f !== -1 && f >= a && (o.selection[r] = "");
    }
  }
  function ne() {
    const e = o.selection;
    if (
      !(
        !!o.journeyChosen?.label ||
        e.id ||
        e.serviceType ||
        e.service ||
        e.location ||
        e.date ||
        e.time
      )
    ) {
      (w.style.display = "none"), (w.innerHTML = "");
      return;
    }
    (w.style.display = "block"), (w.innerHTML = "");
    const n = document.createElement("div");
    n.className = "summary-card";
    const a = document.createElement("div");
    (a.className = "summary-title"),
      (a.textContent = u("chipsTitle") || "Your selection"),
      n.appendChild(a);
    const i = document.createElement("div");
    i.className = "summary-chips";
    const r = (s, f, O, L) => {
      if (!f) return;
      const l = document.createElement("button");
      (l.className = "chip"),
        (l.title = u("chipChange") || "Change"),
        (l.textContent = `${u(`chips.${s}`)}: ${f}`),
        o.backLockedUntilRestart || o.chipsLocked
          ? ((l.disabled = !0), l.classList.add("disabled"))
          : (l.onclick = L
              ? () => {
                  V(), L();
                }
              : () => {
                  V(), P(O);
                }),
        i.appendChild(l);
    };
    r("id", e.id, "Customer Identification"),
      o.journeyChosen?.label &&
        r("journey", o.journeyChosen.label, null, () => {
          o.backLockedUntilRestart || Z();
        }),
      r("serviceType", e.serviceType, "Service Type", () => ye("Service Type")),
      r("service", e.service, "Service", () => ye("Service")),
      r("location", e.location, "Location", () => P("Location")),
      r("date", e.date, "Date", () => P("Date")),
      r("time", e.time, "Time", () => P("Time")),
      n.appendChild(i),
      w.appendChild(n);
  }
  async function bt(e) {
    let t = e;
    for (o.availableDates = []; ; ) {
      o.availableDates.push(
        ...t
          .map((i) => i.optionName || i)
          .filter((i) => /^\d{2}\/\d{2}\/\d{4}$/.test(i))
      );
      const n = t.find((i) => {
        const r = String(i.optionValue ?? i).toLowerCase();
        if (o.commands.loadMore.has(r)) return !0;
        const s = String(i.optionName || i).toLowerCase(),
          f = String(u("ui.loadMore") || "").toLowerCase();
        return f && s === f;
      });
      if (!n) break;
      t = (await k(n.optionValue || n.optionName, !1)).options || [];
    }
  }
  function Se() {
    const e = Pe(),
      t = Math.min(o.datesShown + 9, o.availableDates.length);
    for (let n = o.datesShown; n < t; n++) {
      const a = o.availableDates[n],
        i = document.createElement("button");
      (i.className = "date-btn"),
        (i.textContent = a),
        (i.onclick = () => ee(a, a)),
        e.appendChild(i);
    }
    (o.datesShown = t),
      o.datesShown < o.availableDates.length ? He(() => Se()) : Fe();
  }
  function yt(e) {
    const t = Array.isArray(e?.options) && e.options.length > 0;
    return Y(e) && !t;
  }
  async function wt(e) {
    const t = o.pendingId || "";
    t &&
      (Y(e) && c.chatInput && (c.chatInput.value = t),
      yt(e) && (await ee(t, t)));
  }
  function St(e = {}) {
    const t = e.hostId || "chat-widget";
    let n = document.getElementById(t);
    n ||
      ((n = document.createElement("div")),
      (n.id = t),
      (n.style.cssText = "width:360px;height:520px;border:1px solid #ddd;"),
      document.body.appendChild(n)),
      de?.(e.lng || "en"),
      (o.lngCode = e.lng || "en"),
      ct?.({ ...e });
  }
  function xt() {}
  function kt(e, t) {}
  function vt() {}
  function Ct(...e) {}
  function Lt(...e) {}
  function At(e) {
    return Ee?.(e);
  }
  function Bt() {
    return {};
  }
  (p.SendMessage = Lt),
    (p.destroy = xt),
    (p.getSnapshot = Bt),
    (p.init = St),
    (p.mount = kt),
    (p.render = Ct),
    (p.setLang = At),
    (p.unmount = vt),
    Object.defineProperty(p, Symbol.toStringTag, { value: "Module" });
});
