(function () {
  "use strict";
  (() => {
    if (customElements.get("qf-chat")) return;
    const e = new Set(["he", "ar", "fa", "ur"]);
    class t extends HTMLElement {
      async connectedCallback() {
        const n = this.getAttribute("lng") || "en",
          i = this.getAttribute("api") || "",
          r = this.getAttribute("title") || "Chat";
        (document.documentElement.lang = n),
          (document.documentElement.dir = e.has(n) ? "rtl" : "ltr");
        const s = document.createElement("div");
        (s.id = "chat-container"),
          Object.assign(s.style, {
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: "2147483647",
          }),
          (s.innerHTML = `
        <button id="chat-toggle" class="chat-toggle" aria-label="Open chat">Book Appointment</button>
        <div id="chat-widget">
          <div id="chat-header">
            <span style="flex:1;font-weight:bold">${r}</span>
            <button id="chat-close" class="chat-close" aria-label="Close chat">×</button>
          </div>
          <div id="chat-body"></div>
          <div id="chat-back-area"><button id="chat-back" style="display:none">Back</button></div>
          <div id="chat-input-area">
            <input id="chat-input" type="text" placeholder="Enter your ID…" />
            <button id="chat-send">Send</button>
          </div>
        </div>`),
          this.replaceChildren(s);
        try {
          await (
            await Promise.resolve().then(() => Et)
          ).init?.({ hostId: "chat-widget", lng: n, api: i });
        } catch (d) {
          console.error("[qf-chat] standalone import failed:", d);
        }
      }
    }
    customElements.define("qf-chat", t);
  })();
  function we() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
      const t = (Math.random() * 16) | 0;
      return (e === "x" ? t : (t & 3) | 8).toString(16);
    });
  }
  const ne = [
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
  function Se() {
    const e = (
        navigator.language ||
        navigator.userLanguage ||
        "en"
      ).toLowerCase(),
      [t] = e.split("-");
    return t || "en";
  }
  let ae =
    localStorage.getItem("sessionId") || (crypto?.randomUUID?.() ?? we());
  localStorage.setItem("sessionId", ae);
  const o = {
    isAuthPhase: !0,
    lastScreenWasAuthLike: !1,
    currentStepName: "",
    lngCode: Se(),
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
  function xe() {
    (o.selection.serviceType = ""),
      (o.selection.service = ""),
      (o.selection.location = ""),
      (o.selection.date = ""),
      (o.selection.time = "");
  }
  function oe() {
    (o.availableSteps = new Set()),
      (o.journeyOrder = []),
      (o.availableDates = []),
      (o.datesShown = 0);
  }
  function ke() {
    Object.assign(o.selection, {
      id: "",
      serviceType: "",
      service: "",
      location: "",
      date: "",
      time: "",
    });
  }
  function ie() {
    o.backLockedUntilRestart = !0;
  }
  function D() {
    o.backLockedUntilRestart = !1;
  }
  function re() {
    o.chipsLocked = !0;
  }
  function se() {
    o.chipsLocked = !1;
  }
  function ve() {
    ke(),
      oe(),
      (o.journeyChosen = null),
      (o.pendingId = ""),
      (o.currentStepName = ""),
      D(),
      se();
  }
  function Ce() {
    return o.backLockedUntilRestart ? !1 : !!o.journeyChosen;
  }
  let Le = "./locales";
  const m = Object.create(null);
  let h = Ae(),
    f = "en";
  function L(e) {
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
      return L(e);
    } catch {
      return "en";
    }
  }
  async function B(e) {
    const t = L(e);
    if (m[t]) return m[t];
    try {
      const a = await fetch(`${Le}/chatbot.${t}.json`, { cache: "no-store" });
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
  function A(e, t) {
    return String(t || "")
      .split(".")
      .reduce((a, n) => (a && n in a ? a[n] : void 0), e);
  }
  function P(e) {
    try {
      const t = L(e),
        a =
          (Intl?.Locale && new Intl.Locale(t).textInfo?.direction) ||
          (["ar", "fa", "he", "ur"].includes(t) ? "rtl" : "ltr");
      document.documentElement.dir = a || "ltr";
    } catch {
      document.documentElement.dir = "ltr";
    }
  }
  async function ce(e) {
    e && (h = L(e));
    const t = [B("en"), B(h)];
    f && f !== "en" && f !== h && t.push(B(f)),
      await Promise.all(t),
      P(h || f || "en");
  }
  function H() {
    return h;
  }
  function Ee(e) {
    (h = L(e)), P(h);
  }
  async function Be(e) {
    (f = L(e)), await B(f), P(h || f);
  }
  async function Ie(e) {
    await B(e);
  }
  function p(e) {
    let t;
    return (
      (t = A(m[h] || {}, e)),
      t !== void 0
        ? t
        : ((t = A(m[f] || {}, e)),
          t !== void 0
            ? (console.warn(
                `[localization] Missing "${e}" for "${h}", used journey default "${f}".`
              ),
              t)
            : ((t = A(m.en || {}, e)),
              t !== void 0
                ? (console.warn(
                    `[localization] Missing "${e}" for "${h}" and "${f}", used "en".`
                  ),
                  t)
                : (console.warn(
                    `[localization] Missing key "${e}" in all languages.`
                  ),
                  e)))
    );
  }
  function Ne(e, t) {
    const a = String(t).toLowerCase().split("-")[0];
    let n = A(m[a] || {}, e);
    return n !== void 0 ||
      ((n = A(m[f] || {}, e)), n !== void 0) ||
      ((n = A(m.en || {}, e)), n !== void 0)
      ? n
      : e;
  }
  const w = (e) =>
    String(e || "")
      .toLowerCase()
      .trim();
  let I = { lang: null, steps: {}, hereRegex: null, ignoreSet: new Set() };
  function F() {
    const e = H();
    if (I.lang === e && I.hereRegex) return I;
    const t = p("aliases.steps"),
      a = p("aliases.here"),
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
    for (const E of Object.keys(i)) {
      const It = Array.isArray(s[E]) ? s[E] : [];
      r[E] = [...new Set([...(It || []), ...i[E]])];
    }
    const j = `^(${(Array.isArray(a) && a.length
        ? a
        : ["you are here", "вы здесь", "ви тут", "אתה כאן", "את כאן", "אתם כאן"]
      )
        .map((E) => E.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})\\s*:\\s*`,
      C = new RegExp(j, "i"),
      l = ["cancelling option", "опция отмены"],
      te = Array.isArray(n) ? n : [],
      Bt = new Set([...l.map(w), ...te.map(w)]);
    return (I = { lang: e, steps: r, hereRegex: C, ignoreSet: Bt }), I;
  }
  function g(e) {
    const { steps: t, hereRegex: a } = F(),
      n = w(String(e || "").replace(a, ""));
    if (!n) return "";
    for (const [i, r] of Object.entries(t))
      if (r.some((s) => n.includes(w(s)))) return i;
    return n;
  }
  function q(e) {
    const t = g(e),
      n = (Array.isArray(o.journeyOrder) ? o.journeyOrder : []).indexOf(t);
    if (n !== -1) return n;
    const i = ne.indexOf(t);
    return i === -1 ? 999 : 500 + i;
  }
  function J(e) {
    const { hereRegex: t } = F(),
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
      : w(e?.message || "").includes("services -")
      ? "service"
      : null;
  }
  function Te(e) {
    const { hereRegex: t, ignoreSet: a } = F();
    o.availableSteps || (o.availableSteps = new Set()),
      Array.isArray(o.journeyOrder) || (o.journeyOrder = []);
    const i = (e?.journeyMap || [])
      .map((r) =>
        String(r.stepName || "")
          .replace(t, "")
          .trim()
      )
      .filter((r) => !a.has(w(r)))
      .map(g)
      .filter((r) => r);
    for (const r of i)
      o.availableSteps.add(r),
        o.journeyOrder.includes(r) || o.journeyOrder.push(r);
  }
  function je(e) {
    return J(e) === "customer identification";
  }
  function Me(e) {
    return J(e) === "success";
  }
  function le(e) {
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
  function Oe(e) {
    e && (e.scrollTop = e.scrollHeight);
  }
  function Ue(e, t) {
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
  let M = { lang: null, enterIdPhrases: [] };
  function $e() {
    const e = H();
    if (M.lang === e) return M;
    let t = p("detect.auth.enterId");
    return (
      (!Array.isArray(t) || t.length === 0) &&
        (t = [
          "enter your id",
          "please enter your id",
          "id must hold digits only",
        ]),
      (M = { lang: e, enterIdPhrases: t.filter(Boolean) }),
      M
    );
  }
  function z(e) {
    if (je(e)) return !0;
    if (!(!Array.isArray(e?.options) || e.options.length === 0)) return !1;
    const a = w(le(e?.message || "")),
      { enterIdPhrases: n } = $e();
    return n.some((i) => a.includes(w(i)));
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
  const y = document.createElement("div");
  (y.id = "summary-bar"), (y.style.display = "none");
  const u = document.createElement("div");
  (u.id = "content-area"), Re(), c.chatBody.appendChild(u);
  function Re() {
    !y.isConnected &&
      c.chatWidget &&
      c.chatBody &&
      c.chatWidget.insertBefore(y, c.chatBody);
  }
  function O(e, { replace: t = !1 } = {}) {
    Y();
    const a = T();
    t && (a.innerHTML = "");
    const n = document.createElement("div");
    (n.className = "bubble bot"),
      (n.innerHTML = String(e ?? "")),
      a.appendChild(n),
      S();
  }
  function de(e, t) {
    Y();
    const a = document.createElement("div");
    (a.className = "options-list"),
      e.forEach((n) => {
        const i = n.optionName || n,
          r = n.optionValue || i,
          s = document.createElement("button");
        (s.className =
          "option-btn" + (r === "/goBack" ? " option-btn-back" : "")),
          (s.textContent = le(i)),
          (s.onclick = () => t(r, i)),
          a.appendChild(s);
      }),
      u.appendChild(a);
  }
  function De() {
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
  function Pe(e) {
    let t = u.querySelector("#load-more-btn");
    t ||
      ((t = document.createElement("button")),
      (t.id = "load-more-btn"),
      (t.className = "load-more"),
      (t.textContent = p("ui.loadMore")),
      (t.onclick = e),
      u.appendChild(t));
  }
  function He() {
    const e = u.querySelector("#load-more-btn");
    e && e.remove();
  }
  function U(e) {
    c.backButton.style.display = e ? "inline-block" : "none";
  }
  function N(e) {
    c.inputArea.style.display = e ? "flex" : "none";
  }
  function $() {
    document
      .querySelectorAll(".option-btn, .date-btn, .load-more")
      .forEach((e) => {
        (e.disabled = !0), e.classList.add("disabled");
      });
  }
  function S() {
    Oe(c.chatBody);
  }
  let ue = !1;
  function Fe() {
    if (ue) return;
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
      (ue = !0);
  }
  let pe = !1;
  function qe() {
    if (pe) return;
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
      (pe = !0);
  }
  let fe = !1;
  function Je() {
    if (fe) return;
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
      (fe = !0);
  }
  let b = null;
  function W(e = "") {
    if ((Je(), b && b.isConnected)) return b;
    const t = T();
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
      S(),
      b
    );
  }
  function me() {
    b && (b.remove(), (b = null));
  }
  function ze(e) {
    Fe(), Y();
    const t = document.createElement("div");
    t.id = "cm-loader";
    const a = document.createElement("div");
    a.className = "spinner";
    const n = document.createElement("div");
    (n.textContent =
      e || (typeof p == "function" && p("ui.loading")) || "Loading…"),
      t.appendChild(a),
      t.appendChild(n),
      u.appendChild(t);
  }
  function We() {
    const e = u.querySelector("#cm-loader");
    e && e.remove();
  }
  function T() {
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
  function Ye() {
    qe();
    const e = T(),
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
      S(),
      a
    );
  }
  function Ve(e, t) {
    return !t || !t.isConnected
      ? !1
      : ((t.className = "bubble bot"),
        (t.innerHTML = String(e ?? "")),
        t.removeAttribute("data-skel"),
        S(),
        !0);
  }
  function Xe(e) {
    e && e.isConnected && e.remove();
  }
  function Y() {
    u.querySelectorAll(
      ".options-list, #date-list, #load-more-btn, #cm-loader"
    ).forEach((e) => e.remove());
  }
  function Ke(e) {
    const t = T(),
      a = document.createElement("div");
    (a.className = "bubble user"),
      (a.textContent = String(e ?? "")),
      t.appendChild(a),
      S();
  }
  function V(e) {
    const t = T(),
      a = document.createElement("div");
    (a.className = "bubble bot"),
      (a.innerHTML = String(e ?? "")),
      t.appendChild(a),
      S();
  }
  const Qe = "appsettings.json";
  let _ = null;
  async function X() {
    if (_) return _;
    const e = await fetch(Qe, { cache: "no-store" });
    if (!e.ok) throw new Error(`config http error: ${e.status}`);
    return (_ = await e.json()), _;
  }
  async function Ge() {
    const e = await X(),
      t = new URL(location.href).searchParams.get("api");
    if (t) return t;
    if (!e.apiUrl) throw new Error("appsettings.json: missing 'apiUrl'.");
    return String(e.apiUrl);
  }
  async function Ze() {
    const e = await X(),
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
  async function et() {
    const e = await X(),
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
  const tt = 25e3;
  async function x(e, t) {
    const a = await Ge(),
      n = new AbortController(),
      i = setTimeout(() => n.abort(), tt);
    try {
      const r = await fetch(a, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { SessionId: ae, Message: e, ClearCache: !!t, LngCode: H() },
        ]),
        signal: n.signal,
      });
      if (!r.ok) {
        const d = await r.text().catch(() => "");
        throw new Error(`Network error (${r.status})${d ? ` — ${d}` : ""}`);
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
    nt = 3,
    at = 2;
  async function ot(e) {
    const t = g(e),
      a = q(t);
    if (a === -1) return !1;
    let n = he,
      i = 0;
    for (; n-- > 0; ) {
      const r = q(o.currentStepName || "");
      if (r !== -1 && r <= a) return !0;
      let s;
      try {
        s = await x("/goBack", !1);
      } catch {
        break;
      }
      if ((await v(s), q(o.currentStepName || "") >= r)) {
        if (++i >= at) break;
      } else i = 0;
    }
    return !1;
  }
  const it = { service: "service type", "service type": "location" };
  async function ge(e) {
    let t = g(e);
    for (let a = 0; a < nt && t; a++) {
      if (await ot(t)) return;
      t = it[t];
    }
  }
  async function R(e) {
    const t = g(e);
    if (!t) return;
    let a = he;
    for (; a-- > 0 && g(o.currentStepName) !== t; ) {
      let n;
      try {
        n = await x("/goBack", !1);
      } catch {
        break;
      }
      await v(n);
    }
  }
  const K = (e) =>
      String(e || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim(),
    k = (e, ...t) => {
      for (const a of t) {
        const n = K(a);
        if (!n) continue;
        const i = n.split(/[|,;]+/).map((r) => r.trim());
        for (const r of e)
          if (n === r || n.includes(r) || i.includes(r)) return !0;
      }
      return !1;
    };
  function rt() {
    ve(), N(!1), U(!1), Q(), ee();
  }
  async function st() {
    await ce(), _e(), ct(), dt();
  }
  function ct() {
    c.toggleButton.addEventListener("click", () => {
      c.chatWidget.classList.add("open"),
        (c.toggleButton.style.display = "none");
    }),
      c.closeButton.addEventListener("click", (e) => {
        e.stopPropagation(),
          c.chatWidget.classList.remove("open"),
          (c.toggleButton.style.display = "block");
      }),
      c.sendButton.addEventListener("click", be),
      c.chatInput.addEventListener("keydown", (e) => {
        e.key === "Enter" && (e.preventDefault(), be());
      }),
      c.backButton.addEventListener("click", lt);
  }
  async function lt(e) {
    if ((e?.preventDefault?.(), !o.backLockedUntilRestart)) {
      $(), W(p("ui.loading") || "Loading…");
      try {
        const t = await x("/goBack", !1);
        await v(t);
      } catch (t) {
        me(), O(String(t?.message || "Back failed"));
      }
    }
  }
  async function dt() {
    try {
      (o.JOURNEYS = await Ze()), (o.commands = await et());
    } catch (e) {
      console.error("Failed to load configuration:", e), (o.JOURNEYS = []);
    }
    D(),
      (o.journeyChosen = null),
      (o.pendingId = ""),
      N(!0),
      U(!1),
      ee(),
      D(),
      se(),
      Q();
  }
  async function be(e) {
    e?.preventDefault?.();
    const t = c.chatInput.value.trim();
    if (!t) return;
    Ke(t), (c.chatInput.value = "");
    let a = null;
    const n = setTimeout(() => {
      a = Ye();
    }, 200);
    try {
      const i = await x(t, !1);
      clearTimeout(n),
        a ? Ve(i.message, a) : V(i.message),
        await v(i, { skipMessage: !0 });
    } catch {
      clearTimeout(n), a && Xe(a), V("…connection error, please try again.");
    }
  }
  function Q() {
    if ((O(""), (u.innerHTML = ""), !o.JOURNEYS.length)) {
      O("No journeys configured. Please add them to appsettings.json.");
      return;
    }
    de(
      o.JOURNEYS.map((e) => ({ optionName: e.label, optionValue: e.value })),
      () => {}
    ),
      u.querySelectorAll(".option-btn").forEach((e, t) => {
        const a = o.JOURNEYS[t];
        e.onclick = () => ut(a);
      });
  }
  async function ut(e) {
    o.journeyChosen = e;
    const t = e.defaultLng || "en";
    await Be(t), await Ie(t), xe(), oe(), $();
    const a = Ne("ui.loading", t);
    ze(a);
    try {
      const n = await x(e.value, !0);
      await v(n), await yt(n);
    } catch (n) {
      (o.journeyChosen = null), N(!0), U(!1), Z(n.message);
    } finally {
      We();
    }
  }
  async function G(e, t) {
    if (k(o.commands.restart, e, t)) {
      rt();
      return;
    }
    if (k(o.commands.end, e, t)) {
      ie(), re(), N(!1);
      return;
    }
    if ((k(o.commands.cancel, e, t) && $(), e === "/goBack")) {
      await ft();
      return;
    }
    const a = o.currentStepName;
    try {
      const n = await x(e, !1);
      pt(a, t), await v(n);
    } catch (n) {
      Z(n.message);
    }
  }
  function pt(e, t) {
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
  async function ft() {
    $();
    try {
      const e = await x("/goBack", !1);
      await v(e);
    } catch (e) {
      Z(e.message);
    }
  }
  function mt(e) {
    if (Me(e)) return !0;
    const t = Array.isArray(e?.options) ? e.options : [];
    return !t.length ||
      !t.some((i) =>
        k(o.commands.restart, i?.optionValue ?? i, i?.optionName ?? i)
      )
      ? !1
      : !t.some((i) => {
          const r = i?.optionValue ?? i,
            s = i?.optionName ?? i;
          return !(
            k(o.commands.restart, r, s) ||
            k(o.commands.cancel, r, s) ||
            K(r) === "/goback" ||
            K(s) === "/goback"
          );
        });
  }
  async function v(e, t = {}) {
    me();
    const { skipMessage: a = !1 } = t;
    (o.currentStepName = J(e) || o.currentStepName || ""),
      Te(e),
      Ue(e, o.selection);
    const n = z(e),
      i = mt(e);
    N(!i),
      (o.lastScreenWasAuthLike = n),
      n &&
        o.pendingId &&
        c.chatInput &&
        !c.chatInput.value &&
        (c.chatInput.value = o.pendingId),
      i && (ie(), re()),
      e.journeyMap;
    const r = Ce() && !i;
    U(r), ht(o.currentStepName), ee(), a || O(e.message);
    const s = Array.isArray(e.options) ? e.options : [],
      d = (l) => /^\d{2}\/\d{2}\/\d{4}$/.test(l.optionName || l),
      j = s.filter(d),
      C = s.filter(
        (l) => !k(o.commands.end, l?.optionValue ?? l, l?.optionName ?? l)
      );
    j.length
      ? (await gt(s), (o.datesShown = 0), ye())
      : C.length && de(C, (l, te) => G(l, te)),
      S();
  }
  function Z(e) {
    const t = e?.message ? String(e.message) : String(e || "Unknown error");
    V(t), S();
  }
  function ht(e) {
    if (!e || o.availableSteps.size === 0) return;
    o.availableSteps.has("service type") || (o.selection.serviceType = ""),
      o.availableSteps.has("service") || (o.selection.service = ""),
      o.availableSteps.has("location") || (o.selection.location = ""),
      o.availableSteps.has("date") || (o.selection.date = ""),
      o.availableSteps.has("time") || (o.selection.time = "");
    const t = ne.filter((r) => o.availableSteps.has(r)),
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
      const d = t.indexOf(s);
      d !== -1 && d >= n && (o.selection[r] = "");
    }
  }
  function ee() {
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
      (y.style.display = "none"), (y.innerHTML = "");
      return;
    }
    (y.style.display = "block"), (y.innerHTML = "");
    const a = document.createElement("div");
    a.className = "summary-card";
    const n = document.createElement("div");
    (n.className = "summary-title"),
      (n.textContent = p("chipsTitle") || "Your selection"),
      a.appendChild(n);
    const i = document.createElement("div");
    i.className = "summary-chips";
    const r = (s, d, j, C) => {
      if (!d) return;
      const l = document.createElement("button");
      (l.className = "chip"),
        (l.title = p("chipChange") || "Change"),
        (l.textContent = `${p(`chips.${s}`)}: ${d}`),
        o.backLockedUntilRestart || o.chipsLocked
          ? ((l.disabled = !0), l.classList.add("disabled"))
          : (l.onclick = C
              ? () => {
                  W(), C();
                }
              : () => {
                  W(), R(j);
                }),
        i.appendChild(l);
    };
    r("id", e.id, "Customer Identification"),
      o.journeyChosen?.label &&
        r("journey", o.journeyChosen.label, null, () => {
          o.backLockedUntilRestart || Q();
        }),
      r("serviceType", e.serviceType, "Service Type", () => ge("Service Type")),
      r("service", e.service, "Service", () => ge("Service")),
      r("location", e.location, "Location", () => R("Location")),
      r("date", e.date, "Date", () => R("Date")),
      r("time", e.time, "Time", () => R("Time")),
      a.appendChild(i),
      y.appendChild(a);
  }
  async function gt(e) {
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
          d = String(p("ui.loadMore") || "").toLowerCase();
        return d && s === d;
      });
      if (!a) break;
      t = (await x(a.optionValue || a.optionName, !1)).options || [];
    }
  }
  function ye() {
    const e = De(),
      t = Math.min(o.datesShown + 9, o.availableDates.length);
    for (let a = o.datesShown; a < t; a++) {
      const n = o.availableDates[a],
        i = document.createElement("button");
      (i.className = "date-btn"),
        (i.textContent = n),
        (i.onclick = () => G(n, n)),
        e.appendChild(i);
    }
    (o.datesShown = t),
      o.datesShown < o.availableDates.length ? Pe(() => ye()) : He();
  }
  function bt(e) {
    const t = Array.isArray(e?.options) && e.options.length > 0;
    return z(e) && !t;
  }
  async function yt(e) {
    const t = o.pendingId || "";
    t &&
      (z(e) && c.chatInput && (c.chatInput.value = t),
      bt(e) && (await G(t, t)));
  }
  function wt(e = {}) {
    const t = e.hostId || "chat-widget";
    let a = document.getElementById(t);
    a ||
      ((a = document.createElement("div")),
      (a.id = t),
      (a.style.cssText = "width:360px;height:520px;border:1px solid #ddd;"),
      document.body.appendChild(a)),
      ce?.(e.lng || "en"),
      (o.lngCode = e.lng || "en"),
      st?.({ ...e });
  }
  function St() {}
  function xt(e, t) {}
  function kt() {}
  function vt(...e) {}
  function Ct(...e) {}
  function Lt(e) {
    return Ee?.(e);
  }
  function At() {
    return {};
  }
  const Et = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        SendMessage: Ct,
        destroy: St,
        getSnapshot: At,
        init: wt,
        mount: xt,
        render: vt,
        setLang: Lt,
        unmount: kt,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
})();
