(function (O) {
  typeof define == "function" && define.amd ? define(O) : O();
})(function () {
  "use strict";
  const O = "appsettings.json";
  let j = null;
  async function H() {
    if (j) return j;
    const e = await fetch(O, { cache: "no-store" });
    if (!e.ok) throw new Error(`config http error: ${e.status}`);
    return (j = await e.json()), j;
  }
  async function Le() {
    const e = await H(),
      t = new URL(location.href).searchParams.get("api");
    if (t) return t;
    if (!e.apiUrl) throw new Error("appsettings.json: missing 'apiUrl'.");
    return String(e.apiUrl);
  }
  async function Ae() {
    const e = await H(),
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
  async function Ee() {
    const e = await H(),
      t = (a, n = []) =>
        new Set((Array.isArray(a) ? a : n).map((i) => String(i).toLowerCase()));
    return {
      restart: t(e.commands?.restart, ["/restart"]),
      end: t(e.commands?.end, ["/endjourney"]),
      cancel: t(e.commands?.cancel, ["/cancelapp"]),
      skip: t(e.commands?.skip, ["/skip"]),
      loadMore: t(e.commands?.loadMore, ["/loadmore"]),
      freeText: t(e.commands?.freeText, []),
    };
  }
  function Be() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
      const t = (Math.random() * 16) | 0;
      return (e === "x" ? t : (t & 3) | 8).toString(16);
    });
  }
  const F = [
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
  function le() {
    const e = (
        navigator.language ||
        navigator.userLanguage ||
        "en"
      ).toLowerCase(),
      [t] = e.split("-");
    return t || "en";
  }
  let J = localStorage.getItem("sessionId") || (crypto?.randomUUID?.() ?? Be());
  localStorage.setItem("sessionId", J);
  const o = {
    isAuthPhase: !0,
    lastScreenWasAuthLike: !1,
    currentStepName: "",
    lngCode: le(),
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
  function de() {
    (o.selection.serviceType = ""),
      (o.selection.service = ""),
      (o.selection.location = ""),
      (o.selection.date = ""),
      (o.selection.time = "");
  }
  function q() {
    (o.availableSteps = new Set()),
      (o.journeyOrder = []),
      (o.availableDates = []),
      (o.datesShown = 0);
  }
  function ue() {
    Object.assign(o.selection, {
      id: "",
      serviceType: "",
      service: "",
      location: "",
      date: "",
      time: "",
    });
  }
  function z() {
    o.backLockedUntilRestart = !0;
  }
  function _() {
    o.backLockedUntilRestart = !1;
  }
  function W() {
    o.chipsLocked = !0;
  }
  function Y() {
    o.chipsLocked = !1;
  }
  function V() {
    ue(),
      q(),
      (o.journeyChosen = null),
      (o.pendingId = ""),
      (o.currentStepName = ""),
      _(),
      Y();
  }
  function Ne() {
    V(), (o.selection.id = "");
  }
  function Ie(e = []) {
    if (!Array.isArray(e) || e.length === 0) return 0;
    const t = e.findIndex((a) => !a?.stepAnswer);
    return t === -1 ? e.length - 1 : t;
  }
  function fe() {
    return o.backLockedUntilRestart ? !1 : !!o.journeyChosen;
  }
  const Te = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        STEP_ORDER: F,
        detectLngCode: le,
        getCurrentStepIndex: Ie,
        hardResetForNewBooking: V,
        lockBackUntilRestart: z,
        lockChipsUntilRestart: W,
        resetAllForRestart: Ne,
        resetAllSelections: ue,
        resetDynamicSteps: q,
        resetJourneySelections: de,
        sessionId: J,
        shouldShowBack: fe,
        state: o,
        unlockBack: _,
        unlockChips: Y,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
  let Oe = "./locales";
  const m = Object.create(null);
  let y = je(),
    p = "en";
  function M(e) {
    const t = String(e || "en")
      .toLowerCase()
      .split("-")[0]
      .trim();
    return t === "iw" ? "he" : t === "ua" ? "uk" : t || "en";
  }
  function je() {
    try {
      const e =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        "en";
      return M(e);
    } catch {
      return "en";
    }
  }
  async function E(e) {
    const t = M(e);
    if (m[t]) return m[t];
    try {
      const a = await fetch(`${Oe}/chatbot.${t}.json`, { cache: "no-store" });
      if (!a.ok) throw new Error(`HTTP ${a.status}`);
      const n = await a.json();
      return (m[t] = n), n;
    } catch (a) {
      return (
        console.warn(
          `[localization] Missing language file "${t}" (${a.message}).`
        ),
        (m[t] = {}),
        m[t]
      );
    }
  }
  function L(e, t) {
    return String(t || "")
      .split(".")
      .reduce((a, n) => (a && n in a ? a[n] : void 0), e);
  }
  function pe(e) {
    try {
      const t = M(e),
        a =
          (Intl?.Locale && new Intl.Locale(t).textInfo?.direction) ||
          (["ar", "fa", "he", "ur"].includes(t) ? "rtl" : "ltr");
      document.documentElement.dir = a || "ltr";
    } catch {
      document.documentElement.dir = "ltr";
    }
  }
  async function _e(e) {
    const t = [E("en"), E(y)];
    p && p !== "en" && p !== y && t.push(E(p)),
      await Promise.all(t),
      pe(y || p || "en");
  }
  function X() {
    return y;
  }
  async function Me(e) {
    (p = M(e)), await E(p), pe(y || p);
  }
  async function Ue(e) {
    await E(e);
  }
  function u(e) {
    let t;
    return (
      (t = L(m[y] || {}, e)),
      t !== void 0
        ? t
        : ((t = L(m[p] || {}, e)),
          t !== void 0
            ? (console.warn(
                `[localization] Missing "${e}" for "${y}", used journey default "${p}".`
              ),
              t)
            : ((t = L(m.en || {}, e)),
              t !== void 0
                ? (console.warn(
                    `[localization] Missing "${e}" for "${y}" and "${p}", used "en".`
                  ),
                  t)
                : (console.warn(
                    `[localization] Missing key "${e}" in all languages.`
                  ),
                  e)))
    );
  }
  function Re(e, t) {
    const a = String(t).toLowerCase().split("-")[0];
    let n = L(m[a] || {}, e);
    return n !== void 0 ||
      ((n = L(m[p] || {}, e)), n !== void 0) ||
      ((n = L(m.en || {}, e)), n !== void 0)
      ? n
      : e;
  }
  const $e = 25e3;
  async function w(e, t) {
    const a = await Le(),
      n = new AbortController(),
      i = setTimeout(() => n.abort(), $e);
    try {
      const r = await fetch(a, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { SessionId: J, Message: e, ClearCache: !!t, LngCode: X() },
        ]),
        signal: n.signal,
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
  const S = (e) =>
    String(e || "")
      .toLowerCase()
      .trim();
  let B = { lang: null, steps: {}, hereRegex: null, ignoreSet: new Set() };
  function K() {
    const e = X();
    if (B.lang === e && B.hereRegex) return B;
    const t = u("aliases.steps"),
      a = u("aliases.here"),
      n = u("aliases.ignore"),
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
    for (const A of Object.keys(i)) {
      const Et = Array.isArray(s[A]) ? s[A] : [];
      r[A] = [...new Set([...(Et || []), ...i[A]])];
    }
    const T = `^(${(Array.isArray(a) && a.length
        ? a
        : ["you are here", "вы здесь", "ви тут", "אתה כאן", "את כאן", "אתם כאן"]
      )
        .map((A) => A.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})\\s*:\\s*`,
      C = new RegExp(T, "i"),
      l = ["cancelling option", "опция отмены"],
      ce = Array.isArray(n) ? n : [],
      At = new Set([...l.map(S), ...ce.map(S)]);
    return (B = { lang: e, steps: r, hereRegex: C, ignoreSet: At }), B;
  }
  function g(e) {
    const { steps: t, hereRegex: a } = K(),
      n = S(String(e || "").replace(a, ""));
    if (!n) return "";
    for (const [i, r] of Object.entries(t))
      if (r.some((s) => n.includes(S(s)))) return i;
    return n;
  }
  function G(e) {
    const t = g(e),
      n = (Array.isArray(o.journeyOrder) ? o.journeyOrder : []).indexOf(t);
    if (n !== -1) return n;
    const i = F.indexOf(t);
    return i === -1 ? 999 : 500 + i;
  }
  function Q(e) {
    const { hereRegex: t } = K(),
      a = e?.journeyMap || [],
      n = a.find((r) => t.test(r?.stepName || ""));
    if (n) return g(n.stepName);
    for (const r of a) {
      const s = g(r.stepName || "");
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
  function Pe(e) {
    const { hereRegex: t, ignoreSet: a } = K();
    o.availableSteps || (o.availableSteps = new Set()),
      Array.isArray(o.journeyOrder) || (o.journeyOrder = []);
    const i = (e?.journeyMap || [])
      .map((r) =>
        String(r.stepName || "")
          .replace(t, "")
          .trim()
      )
      .filter((r) => !a.has(S(r)))
      .map(g)
      .filter((r) => r);
    for (const r of i)
      o.availableSteps.add(r),
        o.journeyOrder.includes(r) || o.journeyOrder.push(r);
  }
  function De(e) {
    return Q(e) === "customer identification";
  }
  function He(e) {
    return Q(e) === "success";
  }
  function me(e) {
    const a = String(e || "")
        .replace(/<ol[\s\S]*?<\/ol>/gi, "")
        .replace(/<ul[\s\S]*?<\/ul>/gi, "")
        .replace(
          /<br\s*\/?>/gi,
          `
`
        ),
      n = document.createElement("div");
    return (
      (n.innerHTML = a),
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
  function Fe(e) {
    e && (e.scrollTop = e.scrollHeight);
  }
  function Je(e, t) {
    if (!e || !t) return;
    const a = Array.isArray(e.journeyMap) ? e.journeyMap : [];
    for (const { stepName: n, stepAnswer: i } of a)
      if (i)
        switch (g(n)) {
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
  function qe() {
    const e = X();
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
  function Z(e) {
    if (De(e)) return !0;
    if (!(!Array.isArray(e?.options) || e.options.length === 0)) return !1;
    const a = S(me(e?.message || "")),
      { enterIdPhrases: n } = qe();
    return n.some((i) => a.includes(S(i)));
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
  function ze() {
    c.backButton && (c.backButton.textContent = u("ui.back")),
      c.sendButton && (c.sendButton.textContent = u("ui.send"));
  }
  const b = document.createElement("div");
  (b.id = "summary-bar"), (b.style.display = "none");
  const d = document.createElement("div");
  (d.id = "content-area"), We(), c.chatBody.appendChild(d);
  function We() {
    !b.isConnected &&
      c.chatWidget &&
      c.chatBody &&
      c.chatWidget.insertBefore(b, c.chatBody);
  }
  function R(e, { replace: t = !1 } = {}) {
    te();
    const a = I();
    t && (a.innerHTML = "");
    const n = document.createElement("div");
    (n.className = "bubble bot"),
      (n.innerHTML = String(e ?? "")),
      a.appendChild(n),
      x();
  }
  function ge(e, t) {
    te();
    const a = document.createElement("div");
    (a.className = "options-list"),
      e.forEach((n) => {
        const i = n.optionName || n,
          r = n.optionValue || i,
          s = document.createElement("button");
        (s.className =
          "option-btn" + (r === "/goBack" ? " option-btn-back" : "")),
          (s.textContent = me(i)),
          (s.onclick = () => t(r, i)),
          a.appendChild(s);
      }),
      d.appendChild(a);
  }
  function Ye() {
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
  function Ve(e) {
    let t = d.querySelector("#load-more-btn");
    t ||
      ((t = document.createElement("button")),
      (t.id = "load-more-btn"),
      (t.className = "load-more"),
      (t.textContent = u("ui.loadMore")),
      (t.onclick = e),
      d.appendChild(t));
  }
  function Xe() {
    const e = d.querySelector("#load-more-btn");
    e && e.remove();
  }
  function $(e) {
    c.backButton.style.display = e ? "inline-block" : "none";
  }
  function N(e) {
    c.inputArea.style.display = e ? "flex" : "none";
  }
  function P() {
    document
      .querySelectorAll(".option-btn, .date-btn, .load-more")
      .forEach((e) => {
        (e.disabled = !0), e.classList.add("disabled");
      });
  }
  function x() {
    Fe(c.chatBody);
  }
  let he = !1;
  function Ke() {
    if (he) return;
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
      (he = !0);
  }
  let be = !1;
  function Ge() {
    if (be) return;
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
      (be = !0);
  }
  let ye = !1;
  function Qe() {
    if (ye) return;
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
      (ye = !0);
  }
  let h = null;
  function ee(e = "") {
    if ((Qe(), h && h.isConnected)) return h;
    const t = I();
    return (
      (h = document.createElement("div")),
      (h.className = "bubble pending"),
      (h.innerHTML = `
    <span class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
    <span>${
      e || (typeof u == "function" && u("ui.loading")) || "Loading…"
    }</span>
  `),
      t.appendChild(h),
      x(),
      h
    );
  }
  function we() {
    h && (h.remove(), (h = null));
  }
  function Ze(e) {
    Ke(), te();
    const t = document.createElement("div");
    t.id = "cm-loader";
    const a = document.createElement("div");
    a.className = "spinner";
    const n = document.createElement("div");
    (n.textContent =
      e || (typeof u == "function" && u("ui.loading")) || "Loading…"),
      t.appendChild(a),
      t.appendChild(n),
      d.appendChild(t);
  }
  function et() {
    const e = d.querySelector("#cm-loader");
    e && e.remove();
  }
  function I() {
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
  function tt() {
    Ge();
    const e = I(),
      t = ["w100", "w95", "w80", "w60"],
      a = document.createElement("div");
    return (
      (a.className = "bubble skeleton"),
      a.setAttribute("data-skel", "1"),
      t.forEach((n) => {
        const i = document.createElement("div");
        (i.className = `sk-row ${n}`), a.appendChild(i);
      }),
      e.appendChild(a),
      x(),
      a
    );
  }
  function nt(e, t) {
    return !t || !t.isConnected
      ? !1
      : ((t.className = "bubble bot"),
        (t.innerHTML = String(e ?? "")),
        t.removeAttribute("data-skel"),
        x(),
        !0);
  }
  function at(e) {
    e && e.isConnected && e.remove();
  }
  function te() {
    d.querySelectorAll(
      ".options-list, #date-list, #load-more-btn, #cm-loader"
    ).forEach((e) => e.remove());
  }
  function ot(e) {
    const t = I(),
      a = document.createElement("div");
    (a.className = "bubble user"),
      (a.textContent = String(e ?? "")),
      t.appendChild(a),
      x();
  }
  function ne(e) {
    const t = I(),
      a = document.createElement("div");
    (a.className = "bubble bot"),
      (a.innerHTML = String(e ?? "")),
      t.appendChild(a),
      x();
  }
  const Se = 14,
    it = 3,
    rt = 2;
  async function st(e) {
    const t = g(e),
      a = G(t);
    if (a === -1) return !1;
    let n = Se,
      i = 0;
    for (; n-- > 0; ) {
      const r = G(o.currentStepName || "");
      if (r !== -1 && r <= a) return !0;
      let s;
      try {
        s = await w("/goBack", !1);
      } catch {
        break;
      }
      if ((await k(s), G(o.currentStepName || "") >= r)) {
        if (++i >= rt) break;
      } else i = 0;
    }
    return !1;
  }
  const ct = { service: "service type", "service type": "location" };
  async function xe(e) {
    let t = g(e);
    for (let a = 0; a < it && t; a++) {
      if (await st(t)) return;
      t = ct[t];
    }
  }
  async function D(e) {
    const t = g(e);
    if (!t) return;
    let a = Se;
    for (; a-- > 0 && g(o.currentStepName) !== t; ) {
      let n;
      try {
        n = await w("/goBack", !1);
      } catch {
        break;
      }
      await k(n);
    }
  }
  const ae = (e) =>
      String(e || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim(),
    v = (e, ...t) => {
      for (const a of t) {
        const n = ae(a);
        if (!n) continue;
        const i = n.split(/[|,;]+/).map((r) => r.trim());
        for (const r of e)
          if (n === r || n.includes(r) || i.includes(r)) return !0;
      }
      return !1;
    };
  function lt() {
    V(), N(!1), $(!1), oe(), se();
  }
  async function ke() {
    await _e(), ze(), dt(), ft();
  }
  function dt() {
    c.toggleButton.addEventListener("click", () => {
      c.chatWidget.classList.add("open"),
        (c.toggleButton.style.display = "none");
    }),
      c.closeButton.addEventListener("click", (e) => {
        e.stopPropagation(),
          c.chatWidget.classList.remove("open"),
          (c.toggleButton.style.display = "block");
      }),
      c.sendButton.addEventListener("click", ve),
      c.chatInput.addEventListener("keydown", (e) => {
        e.key === "Enter" && (e.preventDefault(), ve());
      }),
      c.backButton.addEventListener("click", ut);
  }
  async function ut(e) {
    if ((e?.preventDefault?.(), !o.backLockedUntilRestart)) {
      P(), ee(u("ui.loading") || "Loading…");
      try {
        const t = await w("/goBack", !1);
        await k(t);
      } catch (t) {
        we(), R(String(t?.message || "Back failed"));
      }
    }
  }
  async function ft() {
    try {
      (o.JOURNEYS = await Ae()), (o.commands = await Ee());
    } catch (e) {
      console.error("Failed to load configuration:", e), (o.JOURNEYS = []);
    }
    _(),
      (o.journeyChosen = null),
      (o.pendingId = ""),
      N(!0),
      $(!1),
      se(),
      _(),
      Y(),
      oe();
  }
  async function ve(e) {
    e?.preventDefault?.();
    const t = c.chatInput.value.trim();
    if (!t) return;
    ot(t), (c.chatInput.value = "");
    let a = null;
    const n = setTimeout(() => {
      a = tt();
    }, 200);
    try {
      const i = await w(t, !1);
      clearTimeout(n),
        a ? nt(i.message, a) : ne(i.message),
        await k(i, { skipMessage: !0 });
    } catch {
      clearTimeout(n), a && at(a), ne("…connection error, please try again.");
    }
  }
  function oe() {
    if ((R(""), (d.innerHTML = ""), !o.JOURNEYS.length)) {
      R("No journeys configured. Please add them to appsettings.json.");
      return;
    }
    ge(
      o.JOURNEYS.map((e) => ({ optionName: e.label, optionValue: e.value })),
      () => {}
    ),
      d.querySelectorAll(".option-btn").forEach((e, t) => {
        const a = o.JOURNEYS[t];
        e.onclick = () => pt(a);
      });
  }
  async function pt(e) {
    o.journeyChosen = e;
    const t = e.defaultLng || "en";
    await Me(t), await Ue(t), de(), q(), P();
    const a = Re("ui.loading", t);
    Ze(a);
    try {
      const n = await w(e.value, !0);
      await k(n), await St(n);
    } catch (n) {
      (o.journeyChosen = null), N(!0), $(!1), re(n.message);
    } finally {
      et();
    }
  }
  async function ie(e, t) {
    if (v(o.commands.restart, e, t)) {
      lt();
      return;
    }
    if (v(o.commands.end, e, t)) {
      z(), W(), N(!1);
      return;
    }
    if ((v(o.commands.cancel, e, t) && P(), e === "/goBack")) {
      await gt();
      return;
    }
    const a = o.currentStepName;
    try {
      const n = await w(e, !1);
      mt(a, t), await k(n);
    } catch (n) {
      re(n.message);
    }
  }
  function mt(e, t) {
    if (!e || !t) return;
    switch (g(e)) {
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
  async function gt() {
    P();
    try {
      const e = await w("/goBack", !1);
      await k(e);
    } catch (e) {
      re(e.message);
    }
  }
  function ht(e) {
    if (He(e)) return !0;
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
            ae(r) === "/goback" ||
            ae(s) === "/goback"
          );
        });
  }
  async function k(e, t = {}) {
    we();
    const { skipMessage: a = !1 } = t;
    (o.currentStepName = Q(e) || o.currentStepName || ""),
      Pe(e),
      Je(e, o.selection);
    const n = Z(e),
      i = ht(e);
    N(!i),
      (o.lastScreenWasAuthLike = n),
      n &&
        o.pendingId &&
        c.chatInput &&
        !c.chatInput.value &&
        (c.chatInput.value = o.pendingId),
      i && (z(), W()),
      e.journeyMap;
    const r = fe() && !i;
    $(r), bt(o.currentStepName), se(), a || R(e.message);
    const s = Array.isArray(e.options) ? e.options : [],
      f = (l) => /^\d{2}\/\d{2}\/\d{4}$/.test(l.optionName || l),
      T = s.filter(f),
      C = s.filter(
        (l) => !v(o.commands.end, l?.optionValue ?? l, l?.optionName ?? l)
      );
    T.length
      ? (await yt(s), (o.datesShown = 0), Ce())
      : C.length && ge(C, (l, ce) => ie(l, ce)),
      x();
  }
  function re(e) {
    const t = e?.message ? String(e.message) : String(e || "Unknown error");
    ne(t), x();
  }
  function bt(e) {
    if (!e || o.availableSteps.size === 0) return;
    o.availableSteps.has("service type") || (o.selection.serviceType = ""),
      o.availableSteps.has("service") || (o.selection.service = ""),
      o.availableSteps.has("location") || (o.selection.location = ""),
      o.availableSteps.has("date") || (o.selection.date = ""),
      o.availableSteps.has("time") || (o.selection.time = "");
    const t = F.filter((r) => o.availableSteps.has(r)),
      a = g(e),
      n = t.indexOf(a);
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
      const f = t.indexOf(s);
      f !== -1 && f >= n && (o.selection[r] = "");
    }
  }
  function se() {
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
      (b.style.display = "none"), (b.innerHTML = "");
      return;
    }
    (b.style.display = "block"), (b.innerHTML = "");
    const a = document.createElement("div");
    a.className = "summary-card";
    const n = document.createElement("div");
    (n.className = "summary-title"),
      (n.textContent = u("chipsTitle") || "Your selection"),
      a.appendChild(n);
    const i = document.createElement("div");
    i.className = "summary-chips";
    const r = (s, f, T, C) => {
      if (!f) return;
      const l = document.createElement("button");
      (l.className = "chip"),
        (l.title = u("chipChange") || "Change"),
        (l.textContent = `${u(`chips.${s}`)}: ${f}`),
        o.backLockedUntilRestart || o.chipsLocked
          ? ((l.disabled = !0), l.classList.add("disabled"))
          : (l.onclick = C
              ? () => {
                  ee(), C();
                }
              : () => {
                  ee(), D(T);
                }),
        i.appendChild(l);
    };
    r("id", e.id, "Customer Identification"),
      o.journeyChosen?.label &&
        r("journey", o.journeyChosen.label, null, () => {
          o.backLockedUntilRestart || oe();
        }),
      r("serviceType", e.serviceType, "Service Type", () => xe("Service Type")),
      r("service", e.service, "Service", () => xe("Service")),
      r("location", e.location, "Location", () => D("Location")),
      r("date", e.date, "Date", () => D("Date")),
      r("time", e.time, "Time", () => D("Time")),
      a.appendChild(i),
      b.appendChild(a);
  }
  async function yt(e) {
    let t = e;
    for (o.availableDates = []; ; ) {
      o.availableDates.push(
        ...t
          .map((i) => i.optionName || i)
          .filter((i) => /^\d{2}\/\d{2}\/\d{4}$/.test(i))
      );
      const a = t.find((i) => {
        const r = String(i.optionValue ?? i).toLowerCase();
        if (o.commands.loadMore.has(r)) return !0;
        const s = String(i.optionName || i).toLowerCase(),
          f = String(u("ui.loadMore") || "").toLowerCase();
        return f && s === f;
      });
      if (!a) break;
      t = (await w(a.optionValue || a.optionName, !1)).options || [];
    }
  }
  function Ce() {
    const e = Ye(),
      t = Math.min(o.datesShown + 9, o.availableDates.length);
    for (let a = o.datesShown; a < t; a++) {
      const n = o.availableDates[a],
        i = document.createElement("button");
      (i.className = "date-btn"),
        (i.textContent = n),
        (i.onclick = () => ie(n, n)),
        e.appendChild(i);
    }
    (o.datesShown = t),
      o.datesShown < o.availableDates.length ? Ve(() => Ce()) : Xe();
  }
  function wt(e) {
    const t = Array.isArray(e?.options) && e.options.length > 0;
    return Z(e) && !t;
  }
  async function St(e) {
    const t = o.pendingId || "";
    t &&
      (Z(e) && c.chatInput && (c.chatInput.value = t),
      wt(e) && (await ie(t, t)));
  }
  const xt = Object.freeze(
    Object.defineProperty(
      { __proto__: null, init: ke, renderScreen: k },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
  async function kt({ root: e, lang: t, config: a, options: n }) {
    return (
      ke?.(), { destroy() {}, send: void 0, setLang(i) {}, getState: void 0 }
    );
  }
  customElements.define(
    "qf-chat",
    class extends HTMLElement {
      constructor() {
        super(), (this._shadow = this.attachShadow({ mode: "open" }));
        const e = document.createElement("style");
        e.textContent =
          ":host{display:block;contain:content}.root{width:100%;height:100%}";
        const t = document.createElement("div");
        (t.className = "root"),
          this._shadow.append(e, t),
          (this._root = t),
          (this._api = null);
      }
      async connectedCallback() {
        if (this._api) return;
        const e = await Lt(this),
          t = vt(this),
          a = Ct(this);
        (this._api = await kt({
          root: this._root,
          lang: t,
          config: e,
          options: a,
        })),
          this.dispatchEvent(
            new CustomEvent("qf-chat:ready", {
              detail: { lang: t, config: e },
              bubbles: !0,
            })
          );
      }
      disconnectedCallback() {
        try {
          this._api?.destroy?.();
        } finally {
          this._api = null;
        }
      }
    }
  );
  function vt(e) {
    return (
      e.getAttribute("lang") ||
      document.documentElement.getAttribute("lang") ||
      navigator.language ||
      "en"
    );
  }
  function Ct(e) {
    try {
      return JSON.parse(e.getAttribute("options") || "{}");
    } catch {
      return {};
    }
  }
  async function Lt(e) {
    const t = Array.from(e.childNodes).find(
      (n) => n.nodeName === "SCRIPT" && n.type === "application/json"
    );
    if (t)
      try {
        return JSON.parse(t.textContent || "{}");
      } catch {}
    const a = e.getAttribute("config-url");
    if (a) {
      const n = await fetch(a, { cache: "no-cache", credentials: "omit" });
      if (!n.ok) throw new Error(`config ${n.status}`);
      return n.json();
    }
    return window.QFCHAT_CONFIG || {};
  }
});
