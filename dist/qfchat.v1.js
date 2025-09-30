(function (f, I) {
  typeof exports == "object" && typeof module < "u"
    ? I(exports)
    : typeof define == "function" && define.amd
    ? define(["exports"], I)
    : ((f = typeof globalThis < "u" ? globalThis : f || self),
      I((f.QFChat = {})));
})(this, function (f) {
  "use strict";
  function I() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
      const t = (Math.random() * 16) | 0;
      return (e === "x" ? t : (t & 3) | 8).toString(16);
    });
  }
  const ae = [
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
  const a = {
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
  function Se() {
    (a.selection.serviceType = ""),
      (a.selection.service = ""),
      (a.selection.location = ""),
      (a.selection.date = ""),
      (a.selection.time = "");
  }
  function re() {
    (a.availableSteps = new Set()),
      (a.journeyOrder = []),
      (a.availableDates = []),
      (a.datesShown = 0);
  }
  function ve() {
    Object.assign(a.selection, {
      id: "",
      serviceType: "",
      service: "",
      location: "",
      date: "",
      time: "",
    });
  }
  function se() {
    a.backLockedUntilRestart = !0;
  }
  function H() {
    a.backLockedUntilRestart = !1;
  }
  function ce() {
    a.chipsLocked = !0;
  }
  function le() {
    a.chipsLocked = !1;
  }
  function ke() {
    ve(),
      re(),
      (a.journeyChosen = null),
      (a.pendingId = ""),
      (a.currentStepName = ""),
      H(),
      le();
  }
  function Ce() {
    return a.backLockedUntilRestart ? !1 : !!a.journeyChosen;
  }
  let Le = "./locales";
  const g = Object.create(null);
  let w = Ae(),
    m = "en";
  function N(e) {
    const t = String(e || "en")
      .toLowerCase()
      .split("-")[0]
      .trim();
    return t === "iw" ? "he" : t === "ua" ? "uk" : t || "en";
  }
  function Ae() {
    try {
      const e =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        "en";
      return N(e);
    } catch {
      return "en";
    }
  }
  async function T(e) {
    const t = N(e);
    if (g[t]) return g[t];
    try {
      const o = await fetch(`${Le}/chatbot.${t}.json`, { cache: "no-store" });
      if (!o.ok) throw new Error(`HTTP ${o.status}`);
      const n = await o.json();
      return (g[t] = n), n;
    } catch (o) {
      return (
        console.warn(
          `[localization] Missing language file "${t}" (${o.message}).`
        ),
        (g[t] = {}),
        g[t]
      );
    }
  }
  function E(e, t) {
    return String(t || "")
      .split(".")
      .reduce((o, n) => (o && n in o ? o[n] : void 0), e);
  }
  function q(e) {
    try {
      const t = N(e),
        o =
          (Intl?.Locale && new Intl.Locale(t).textInfo?.direction) ||
          (["ar", "fa", "he", "ur"].includes(t) ? "rtl" : "ltr");
      document.documentElement.dir = o || "ltr";
    } catch {
      document.documentElement.dir = "ltr";
    }
  }
  async function Ee(e) {
    const t = [T("en"), T(w)];
    m && m !== "en" && m !== w && t.push(T(m)),
      await Promise.all(t),
      q(w || m || "en");
  }
  function F() {
    return w;
  }
  function Be(e) {
    (w = N(e)), q(w);
  }
  async function Ie(e) {
    (m = N(e)), await T(m), q(w || m);
  }
  async function Ne(e) {
    await T(e);
  }
  function p(e) {
    let t;
    return (
      (t = E(g[w] || {}, e)),
      t !== void 0
        ? t
        : ((t = E(g[m] || {}, e)),
          t !== void 0
            ? (console.warn(
                `[localization] Missing "${e}" for "${w}", used journey default "${m}".`
              ),
              t)
            : ((t = E(g.en || {}, e)),
              t !== void 0
                ? (console.warn(
                    `[localization] Missing "${e}" for "${w}" and "${m}", used "en".`
                  ),
                  t)
                : (console.warn(
                    `[localization] Missing key "${e}" in all languages.`
                  ),
                  e)))
    );
  }
  function Te(e, t) {
    const o = String(t).toLowerCase().split("-")[0];
    let n = E(g[o] || {}, e);
    return n !== void 0 ||
      ((n = E(g[m] || {}, e)), n !== void 0) ||
      ((n = E(g.en || {}, e)), n !== void 0)
      ? n
      : e;
  }
  const v = (e) =>
    String(e || "")
      .toLowerCase()
      .trim();
  let j = { lang: null, steps: {}, hereRegex: null, ignoreSet: new Set() };
  function J() {
    const e = F();
    if (j.lang === e && j.hereRegex) return j;
    const t = p("aliases.steps"),
      o = p("aliases.here"),
      n = p("aliases.ignore"),
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
    for (const B of Object.keys(i)) {
      const Nt = Array.isArray(s[B]) ? s[B] : [];
      r[B] = [...new Set([...(Nt || []), ...i[B]])];
    }
    const S = `^(${(Array.isArray(o) && o.length
        ? o
        : ["you are here", "вы здесь", "ви тут", "אתה כאן", "את כאן", "אתם כאן"]
      )
        .map((B) => B.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})\\s*:\\s*`,
      y = new RegExp(S, "i"),
      d = ["cancelling option", "опция отмены"],
      oe = Array.isArray(n) ? n : [],
      It = new Set([...d.map(v), ...oe.map(v)]);
    return (j = { lang: e, steps: r, hereRegex: y, ignoreSet: It }), j;
  }
  function h(e) {
    const { steps: t, hereRegex: o } = J(),
      n = v(String(e || "").replace(o, ""));
    if (!n) return "";
    for (const [i, r] of Object.entries(t))
      if (r.some((s) => n.includes(v(s)))) return i;
    return n;
  }
  function z(e) {
    const t = h(e),
      n = (Array.isArray(a.journeyOrder) ? a.journeyOrder : []).indexOf(t);
    if (n !== -1) return n;
    const i = ae.indexOf(t);
    return i === -1 ? 999 : 500 + i;
  }
  function W(e) {
    const { hereRegex: t } = J(),
      o = e?.journeyMap || [],
      n = o.find((r) => t.test(r?.stepName || ""));
    if (n) return h(n.stepName);
    for (const r of o) {
      const s = h(r.stepName || "");
      if (s) return s;
    }
    const i = (e?.options || []).map((r) => r.optionName || r);
    return i.some((r) => /^\d{2}\/\d{2}\/\d{4}$/.test(r))
      ? "date"
      : i.some((r) => /^\d{1,2}:\d{2}$/.test(r))
      ? "time"
      : v(e?.message || "").includes("services -")
      ? "service"
      : null;
  }
  function je(e) {
    const { hereRegex: t, ignoreSet: o } = J();
    a.availableSteps || (a.availableSteps = new Set()),
      Array.isArray(a.journeyOrder) || (a.journeyOrder = []);
    const i = (e?.journeyMap || [])
      .map((r) =>
        String(r.stepName || "")
          .replace(t, "")
          .trim()
      )
      .filter((r) => !o.has(v(r)))
      .map(h)
      .filter((r) => r);
    for (const r of i)
      a.availableSteps.add(r),
        a.journeyOrder.includes(r) || a.journeyOrder.push(r);
  }
  function Me(e) {
    return W(e) === "customer identification";
  }
  function Oe(e) {
    return W(e) === "success";
  }
  function de(e) {
    const o = String(e || "")
        .replace(/<ol[\s\S]*?<\/ol>/gi, "")
        .replace(/<ul[\s\S]*?<\/ul>/gi, "")
        .replace(
          /<br\s*\/?>/gi,
          `
`
        ),
      n = document.createElement("div");
    return (
      (n.innerHTML = o),
      (n.textContent || n.innerText || "")
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
  function Re(e, t) {
    if (!e || !t) return;
    const o = Array.isArray(e.journeyMap) ? e.journeyMap : [];
    for (const { stepName: n, stepAnswer: i } of o)
      if (i)
        switch (h(n)) {
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
  function $e() {
    const e = F();
    if (U.lang === e) return U;
    let t = p("detect.auth.enterId");
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
    const o = v(de(e?.message || "")),
      { enterIdPhrases: n } = $e();
    return n.some((i) => o.includes(v(i)));
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
    c.backButton && (c.backButton.textContent = p("ui.back")),
      c.sendButton && (c.sendButton.textContent = p("ui.send"));
  }
  const x = document.createElement("div");
  (x.id = "summary-bar"), (x.style.display = "none");
  const u = document.createElement("div");
  (u.id = "content-area"), De(), c.chatBody.appendChild(u);
  function De() {
    !x.isConnected &&
      c.chatWidget &&
      c.chatBody &&
      c.chatWidget.insertBefore(x, c.chatBody);
  }
  function R(e, { replace: t = !1 } = {}) {
    X();
    const o = O();
    t && (o.innerHTML = "");
    const n = document.createElement("div");
    (n.className = "bubble bot"),
      (n.innerHTML = String(e ?? "")),
      o.appendChild(n),
      k();
  }
  function ue(e, t) {
    X();
    const o = document.createElement("div");
    (o.className = "options-list"),
      e.forEach((n) => {
        const i = n.optionName || n,
          r = n.optionValue || i,
          s = document.createElement("button");
        (s.className =
          "option-btn" + (r === "/goBack" ? " option-btn-back" : "")),
          (s.textContent = de(i)),
          (s.onclick = () => t(r, i)),
          o.appendChild(s);
      }),
      u.appendChild(o);
  }
  function Pe() {
    let e = u.querySelector("#date-list");
    if (!e) {
      const t = document.createElement("div");
      u.appendChild(t),
        (e = document.createElement("div")),
        (e.id = "date-list"),
        (e.className = "date-list"),
        u.appendChild(e);
    }
    return e;
  }
  function He(e) {
    let t = u.querySelector("#load-more-btn");
    t ||
      ((t = document.createElement("button")),
      (t.id = "load-more-btn"),
      (t.className = "load-more"),
      (t.textContent = p("ui.loadMore")),
      (t.onclick = e),
      u.appendChild(t));
  }
  function qe() {
    const e = u.querySelector("#load-more-btn");
    e && e.remove();
  }
  function $(e) {
    c.backButton.style.display = e ? "inline-block" : "none";
  }
  function M(e) {
    c.inputArea.style.display = e ? "flex" : "none";
  }
  function _() {
    document
      .querySelectorAll(".option-btn, .date-btn, .load-more")
      .forEach((e) => {
        (e.disabled = !0), e.classList.add("disabled");
      });
  }
  function k() {
    Ue(c.chatBody);
  }
  let pe = !1;
  function Fe() {
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
  let fe = !1;
  function Je() {
    if (fe) return;
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
      (fe = !0);
  }
  let me = !1;
  function ze() {
    if (me) return;
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
      (me = !0);
  }
  let b = null;
  function V(e = "") {
    if ((ze(), b && b.isConnected)) return b;
    const t = O();
    return (
      (b = document.createElement("div")),
      (b.className = "bubble pending"),
      (b.innerHTML = `
    <span class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
    <span>${
      e || (typeof p == "function" && p("ui.loading")) || "Loading…"
    }</span>
  `),
      t.appendChild(b),
      k(),
      b
    );
  }
  function ge() {
    b && (b.remove(), (b = null));
  }
  function We(e) {
    Fe(), X();
    const t = document.createElement("div");
    t.id = "cm-loader";
    const o = document.createElement("div");
    o.className = "spinner";
    const n = document.createElement("div");
    (n.textContent =
      e || (typeof p == "function" && p("ui.loading")) || "Loading…"),
      t.appendChild(o),
      t.appendChild(n),
      u.appendChild(t);
  }
  function Ye() {
    const e = u.querySelector("#cm-loader");
    e && e.remove();
  }
  function O() {
    let e = u.querySelector(".msg__text");
    return (
      e ||
        ((u.innerHTML = ""),
        (e = document.createElement("div")),
        (e.className = "msg__text"),
        u.appendChild(e)),
      e
    );
  }
  function Ve() {
    Je();
    const e = O(),
      t = ["w100", "w95", "w80", "w60"],
      o = document.createElement("div");
    return (
      (o.className = "bubble skeleton"),
      o.setAttribute("data-skel", "1"),
      t.forEach((n) => {
        const i = document.createElement("div");
        (i.className = `sk-row ${n}`), o.appendChild(i);
      }),
      e.appendChild(o),
      k(),
      o
    );
  }
  function Xe(e, t) {
    return !t || !t.isConnected
      ? !1
      : ((t.className = "bubble bot"),
        (t.innerHTML = String(e ?? "")),
        t.removeAttribute("data-skel"),
        k(),
        !0);
  }
  function Ke(e) {
    e && e.isConnected && e.remove();
  }
  function X() {
    u.querySelectorAll(
      ".options-list, #date-list, #load-more-btn, #cm-loader"
    ).forEach((e) => e.remove());
  }
  function Ge(e) {
    const t = O(),
      o = document.createElement("div");
    (o.className = "bubble user"),
      (o.textContent = String(e ?? "")),
      t.appendChild(o),
      k();
  }
  function K(e) {
    const t = O(),
      o = document.createElement("div");
    (o.className = "bubble bot"),
      (o.innerHTML = String(e ?? "")),
      t.appendChild(o),
      k();
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
      .map((n) =>
        n.id && !n.command && !n.value
          ? {
              label: n.label,
              value: `${t}${n.id}`,
              defaultLng: n.defaultLng || n.defaultLanguage || "en",
            }
          : {
              label: n.label,
              value: n.command || n.value,
              defaultLng: n.defaultLng || n.defaultLanguage || "en",
            }
      )
      .filter((n) => n.label && n.value);
  }
  async function tt() {
    const e = await G(),
      t = (o, n = []) =>
        new Set((Array.isArray(o) ? o : n).map((i) => String(i).toLowerCase()));
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
  async function C(e, t) {
    const o = await Ze(),
      n = new AbortController(),
      i = setTimeout(() => n.abort(), nt);
    try {
      const r = await fetch(o, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { SessionId: ie, Message: e, ClearCache: !!t, LngCode: F() },
        ]),
        signal: n.signal,
      });
      if (!r.ok) {
        const l = await r.text().catch(() => "");
        throw new Error(`Network error (${r.status})${l ? ` — ${l}` : ""}`);
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
  const he = 14,
    ot = 3,
    at = 2;
  async function it(e) {
    const t = h(e),
      o = z(t);
    if (o === -1) return !1;
    let n = he,
      i = 0;
    for (; n-- > 0; ) {
      const r = z(a.currentStepName || "");
      if (r !== -1 && r <= o) return !0;
      let s;
      try {
        s = await C("/goBack", !1);
      } catch {
        break;
      }
      if ((await A(s), z(a.currentStepName || "") >= r)) {
        if (++i >= at) break;
      } else i = 0;
    }
    return !1;
  }
  const rt = { service: "service type", "service type": "location" };
  async function be(e) {
    let t = h(e);
    for (let o = 0; o < ot && t; o++) {
      if (await it(t)) return;
      t = rt[t];
    }
  }
  async function P(e) {
    const t = h(e);
    if (!t) return;
    let o = he;
    for (; o-- > 0 && h(a.currentStepName) !== t; ) {
      let n;
      try {
        n = await C("/goBack", !1);
      } catch {
        break;
      }
      await A(n);
    }
  }
  const Q = (e) =>
      String(e || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim(),
    L = (e, ...t) => {
      for (const o of t) {
        const n = Q(o);
        if (!n) continue;
        const i = n.split(/[|,;]+/).map((r) => r.trim());
        for (const r of e)
          if (n === r || n.includes(r) || i.includes(r)) return !0;
      }
      return !1;
    };
  function st() {
    ke(), M(!1), $(!1), Z(), ne();
  }
  async function ct() {
    await Ee(), _e(), lt(), ut();
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
      c.sendButton.addEventListener("click", ye),
      c.chatInput.addEventListener("keydown", (e) => {
        e.key === "Enter" && (e.preventDefault(), ye());
      }),
      c.backButton.addEventListener("click", dt);
  }
  async function dt(e) {
    if ((e?.preventDefault?.(), !a.backLockedUntilRestart)) {
      _(), V(p("ui.loading") || "Loading…");
      try {
        const t = await C("/goBack", !1);
        await A(t);
      } catch (t) {
        ge(), R(String(t?.message || "Back failed"));
      }
    }
  }
  async function ut() {
    try {
      (a.JOURNEYS = await et()), (a.commands = await tt());
    } catch (e) {
      console.error("Failed to load configuration:", e), (a.JOURNEYS = []);
    }
    H(),
      (a.journeyChosen = null),
      (a.pendingId = ""),
      M(!0),
      $(!1),
      ne(),
      H(),
      le(),
      Z();
  }
  async function ye(e) {
    e?.preventDefault?.();
    const t = c.chatInput.value.trim();
    if (!t) return;
    Ge(t), (c.chatInput.value = "");
    let o = null;
    const n = setTimeout(() => {
      o = Ve();
    }, 200);
    try {
      const i = await C(t, !1);
      clearTimeout(n),
        o ? Xe(i.message, o) : K(i.message),
        await A(i, { skipMessage: !0 });
    } catch {
      clearTimeout(n), o && Ke(o), K("…connection error, please try again.");
    }
  }
  function Z() {
    if ((R(""), (u.innerHTML = ""), !a.JOURNEYS.length)) {
      R("No journeys configured. Please add them to appsettings.json.");
      return;
    }
    ue(
      a.JOURNEYS.map((e) => ({ optionName: e.label, optionValue: e.value })),
      () => {}
    ),
      u.querySelectorAll(".option-btn").forEach((e, t) => {
        const o = a.JOURNEYS[t];
        e.onclick = () => pt(o);
      });
  }
  async function pt(e) {
    a.journeyChosen = e;
    const t = e.defaultLng || "en";
    await Ie(t), await Ne(t), Se(), re(), _();
    const o = Te("ui.loading", t);
    We(o);
    try {
      const n = await C(e.value, !0);
      await A(n), await wt(n);
    } catch (n) {
      (a.journeyChosen = null), M(!0), $(!1), te(n.message);
    } finally {
      Ye();
    }
  }
  async function ee(e, t) {
    if (L(a.commands.restart, e, t)) {
      st();
      return;
    }
    if (L(a.commands.end, e, t)) {
      se(), ce(), M(!1);
      return;
    }
    if ((L(a.commands.cancel, e, t) && _(), e === "/goBack")) {
      await mt();
      return;
    }
    const o = a.currentStepName;
    try {
      const n = await C(e, !1);
      ft(o, t), await A(n);
    } catch (n) {
      te(n.message);
    }
  }
  function ft(e, t) {
    if (!e || !t) return;
    switch (h(e)) {
      case "customer identification":
        (a.selection.id = t), (a.pendingId = "");
        break;
      case "service type":
        a.selection.serviceType = t;
        break;
      case "service":
        a.selection.service = t;
        break;
      case "location":
        a.selection.location = t;
        break;
      case "date":
        a.selection.date = t;
        break;
      case "time":
        a.selection.time = t;
        break;
      default:
        a.lastScreenWasAuthLike &&
          /^\d+$/.test(String(t)) &&
          ((a.selection.id = t), (a.pendingId = ""));
        break;
    }
  }
  async function mt() {
    _();
    try {
      const e = await C("/goBack", !1);
      await A(e);
    } catch (e) {
      te(e.message);
    }
  }
  function gt(e) {
    if (Oe(e)) return !0;
    const t = Array.isArray(e?.options) ? e.options : [];
    return !t.length ||
      !t.some((i) =>
        L(a.commands.restart, i?.optionValue ?? i, i?.optionName ?? i)
      )
      ? !1
      : !t.some((i) => {
          const r = i?.optionValue ?? i,
            s = i?.optionName ?? i;
          return !(
            L(a.commands.restart, r, s) ||
            L(a.commands.cancel, r, s) ||
            Q(r) === "/goback" ||
            Q(s) === "/goback"
          );
        });
  }
  async function A(e, t = {}) {
    ge();
    const { skipMessage: o = !1 } = t;
    (a.currentStepName = W(e) || a.currentStepName || ""),
      je(e),
      Re(e, a.selection);
    const n = Y(e),
      i = gt(e);
    M(!i),
      (a.lastScreenWasAuthLike = n),
      n &&
        a.pendingId &&
        c.chatInput &&
        !c.chatInput.value &&
        (c.chatInput.value = a.pendingId),
      i && (se(), ce()),
      e.journeyMap;
    const r = Ce() && !i;
    $(r), ht(a.currentStepName), ne(), o || R(e.message);
    const s = Array.isArray(e.options) ? e.options : [],
      l = (d) => /^\d{2}\/\d{2}\/\d{4}$/.test(d.optionName || d),
      S = s.filter(l),
      y = s.filter(
        (d) => !L(a.commands.end, d?.optionValue ?? d, d?.optionName ?? d)
      );
    S.length
      ? (await bt(s), (a.datesShown = 0), we())
      : y.length && ue(y, (d, oe) => ee(d, oe)),
      k();
  }
  function te(e) {
    const t = e?.message ? String(e.message) : String(e || "Unknown error");
    K(t), k();
  }
  function ht(e) {
    if (!e || a.availableSteps.size === 0) return;
    a.availableSteps.has("service type") || (a.selection.serviceType = ""),
      a.availableSteps.has("service") || (a.selection.service = ""),
      a.availableSteps.has("location") || (a.selection.location = ""),
      a.availableSteps.has("date") || (a.selection.date = ""),
      a.availableSteps.has("time") || (a.selection.time = "");
    const t = ae.filter((r) => a.availableSteps.has(r)),
      o = h(e),
      n = t.indexOf(o);
    if (n === -1) return;
    const i = {
      id: "customer identification",
      serviceType: "service type",
      service: "service",
      location: "location",
      date: "date",
      time: "time",
    };
    for (const [r, s] of Object.entries(i)) {
      const l = t.indexOf(s);
      l !== -1 && l >= n && (a.selection[r] = "");
    }
  }
  function ne() {
    const e = a.selection;
    if (
      !(
        !!a.journeyChosen?.label ||
        e.id ||
        e.serviceType ||
        e.service ||
        e.location ||
        e.date ||
        e.time
      )
    ) {
      (x.style.display = "none"), (x.innerHTML = "");
      return;
    }
    (x.style.display = "block"), (x.innerHTML = "");
    const o = document.createElement("div");
    o.className = "summary-card";
    const n = document.createElement("div");
    (n.className = "summary-title"),
      (n.textContent = p("chipsTitle") || "Your selection"),
      o.appendChild(n);
    const i = document.createElement("div");
    i.className = "summary-chips";
    const r = (s, l, S, y) => {
      if (!l) return;
      const d = document.createElement("button");
      (d.className = "chip"),
        (d.title = p("chipChange") || "Change"),
        (d.textContent = `${p(`chips.${s}`)}: ${l}`),
        a.backLockedUntilRestart || a.chipsLocked
          ? ((d.disabled = !0), d.classList.add("disabled"))
          : (d.onclick = y
              ? () => {
                  V(), y();
                }
              : () => {
                  V(), P(S);
                }),
        i.appendChild(d);
    };
    r("id", e.id, "Customer Identification"),
      a.journeyChosen?.label &&
        r("journey", a.journeyChosen.label, null, () => {
          a.backLockedUntilRestart || Z();
        }),
      r("serviceType", e.serviceType, "Service Type", () => be("Service Type")),
      r("service", e.service, "Service", () => be("Service")),
      r("location", e.location, "Location", () => P("Location")),
      r("date", e.date, "Date", () => P("Date")),
      r("time", e.time, "Time", () => P("Time")),
      o.appendChild(i),
      x.appendChild(o);
  }
  async function bt(e) {
    let t = e;
    for (a.availableDates = []; ; ) {
      a.availableDates.push(
        ...t
          .map((i) => i.optionName || i)
          .filter((i) => /^\d{2}\/\d{2}\/\d{4}$/.test(i))
      );
      const o = t.find((i) => {
        const r = String(i.optionValue ?? i).toLowerCase();
        if (a.commands.loadMore.has(r)) return !0;
        const s = String(i.optionName || i).toLowerCase(),
          l = String(p("ui.loadMore") || "").toLowerCase();
        return l && s === l;
      });
      if (!o) break;
      t = (await C(o.optionValue || o.optionName, !1)).options || [];
    }
  }
  function we() {
    const e = Pe(),
      t = Math.min(a.datesShown + 9, a.availableDates.length);
    for (let o = a.datesShown; o < t; o++) {
      const n = a.availableDates[o],
        i = document.createElement("button");
      (i.className = "date-btn"),
        (i.textContent = n),
        (i.onclick = () => ee(n, n)),
        e.appendChild(i);
    }
    (a.datesShown = t),
      a.datesShown < a.availableDates.length ? He(() => we()) : qe();
  }
  function yt(e) {
    const t = Array.isArray(e?.options) && e.options.length > 0;
    return Y(e) && !t;
  }
  async function wt(e) {
    const t = a.pendingId || "";
    t &&
      (Y(e) && c.chatInput && (c.chatInput.value = t),
      yt(e) && (await ee(t, t)));
  }
  function xt(e) {
    const t = document.createElement("style");
    t.textContent = `
    :host { all: initial; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; }
    #wrap { display:grid; grid-template-rows:auto 1fr auto; width:100%; height:100%; }
    #head { padding:8px 12px; border-bottom:1px solid #e5e7eb; font-weight:600; }
    #body { padding:12px; display:flex; flex-direction:column; gap:8px; overflow:auto; }
    #form { display:flex; gap:8px; padding:8px; border-top:1px solid #e5e7eb; }
    #msg { flex:1 1 auto; padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; }
    button { padding:8px 12px; border:1px solid #d1d5db; background:#111827; color:#fff; border-radius:6px; cursor:pointer; }
    .bubble { max-width:80%; padding:8px 10px; border-radius:10px; }
    .bubble.user { align-self:flex-end; background:#e5f2ff; }
    .bubble.bot  { align-self:flex-start; background:#f3f4f6; }
  `;
    const o = document.createElement("div");
    (o.id = "wrap"),
      (o.innerHTML = `
    <div id="head">Chat</div>
    <div id="body"></div>
    <form id="form" autocomplete="off">
      <input id="msg" type="text" placeholder="Напиши сообщение..." />
      <button type="submit">Send</button>
    </form>
  `),
      e.append(t, o);
    const n = e.querySelector("#body"),
      i = e.querySelector("#form"),
      r = e.querySelector("#msg");
    i.addEventListener("submit", (s) => {
      s.preventDefault();
      const l = r.value.trim();
      if (!l) return;
      const S = document.createElement("div");
      (S.className = "bubble user"), (S.textContent = l), n.appendChild(S);
      const y = document.createElement("div");
      (y.className = "bubble bot"),
        (y.textContent = "Принял: " + l),
        n.appendChild(y),
        (n.scrollTop = n.scrollHeight),
        (r.value = ""),
        r.focus();
    });
  }
  function St(e = {}) {
    const t = e.hostId || "chat-widget";
    let o = document.getElementById(t);
    o ||
      ((o = document.createElement("div")),
      (o.id = t),
      (o.style.cssText = "width:360px;height:520px;border:1px solid #ddd;"),
      document.body.appendChild(o)),
      xt(o),
      ct?.({ ...e });
  }
  function vt() {}
  function kt(e, t) {}
  function Ct() {}
  function Lt(...e) {}
  function At(...e) {}
  function Et(e) {
    return Be?.(e);
  }
  function Bt() {
    return {};
  }
  (f.SendMessage = At),
    (f.destroy = vt),
    (f.getSnapshot = Bt),
    (f.init = St),
    (f.mount = kt),
    (f.render = Lt),
    (f.setLang = Et),
    (f.unmount = Ct),
    Object.defineProperty(f, Symbol.toStringTag, { value: "Module" });
});
