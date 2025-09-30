(function () {
  "use strict";
  const Ae = "appsettings.json";
  let $ = null;
  async function H() {
    if ($) return $;
    const e = await fetch(Ae, { cache: "no-store" });
    if (!e.ok) throw new Error(`config http error: ${e.status}`);
    return ($ = await e.json()), $;
  }
  async function Be() {
    const e = await H(),
      t = new URL(location.href).searchParams.get("api");
    if (t) return t;
    if (!e.apiUrl) throw new Error("appsettings.json: missing 'apiUrl'.");
    return String(e.apiUrl);
  }
  async function Ee() {
    const e = await H(),
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
  async function Ie() {
    const e = await H(),
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
  function Ne() {
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
  function Te() {
    const e = (
        navigator.language ||
        navigator.userLanguage ||
        "en"
      ).toLowerCase(),
      [t] = e.split("-");
    return t || "en";
  }
  let ie =
    localStorage.getItem("sessionId") || (crypto?.randomUUID?.() ?? Ne());
  localStorage.setItem("sessionId", ie);
  const o = {
    isAuthPhase: !0,
    lastScreenWasAuthLike: !1,
    currentStepName: "",
    lngCode: Te(),
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
  function je() {
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
  function Oe() {
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
  function F() {
    o.backLockedUntilRestart = !1;
  }
  function ce() {
    o.chipsLocked = !0;
  }
  function le() {
    o.chipsLocked = !1;
  }
  function de() {
    Oe(),
      re(),
      (o.journeyChosen = null),
      (o.pendingId = ""),
      (o.currentStepName = ""),
      F(),
      le();
  }
  function Ct() {
    de(), (o.selection.id = "");
  }
  function Lt(e = []) {
    if (!Array.isArray(e) || e.length === 0) return 0;
    const t = e.findIndex((n) => !n?.stepAnswer);
    return t === -1 ? e.length - 1 : t;
  }
  function Me() {
    return o.backLockedUntilRestart ? !1 : !!o.journeyChosen;
  }
  let ue = "./locales",
    I = !0;
  function At(e) {
    typeof e == "string" && e.trim() && (ue = e.replace(/\/+$/, ""));
  }
  function Bt(e) {
    I = !!e;
  }
  const m = Object.create(null);
  let g = Ue(),
    f = "en";
  function L(e) {
    const t = String(e || "en")
      .toLowerCase()
      .split("-")[0]
      .trim();
    return t === "iw" ? "he" : t === "ua" ? "uk" : t || "en";
  }
  function Ue() {
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
  async function N(e) {
    const t = L(e);
    if (m[t]) return m[t];
    try {
      const n = await fetch(`${ue}/chatbot.${t}.json`, { cache: "no-store" });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      const a = await n.json();
      return (m[t] = a), a;
    } catch (n) {
      return (
        I &&
          console.warn(
            `[localization] Missing language file "${t}" (${n.message}).`
          ),
        (m[t] = {}),
        m[t]
      );
    }
  }
  function A(e, t) {
    return String(t || "")
      .split(".")
      .reduce((n, a) => (n && a in n ? n[a] : void 0), e);
  }
  function q(e) {
    try {
      const t = L(e),
        n =
          (Intl?.Locale && new Intl.Locale(t).textInfo?.direction) ||
          (["ar", "fa", "he", "ur"].includes(t) ? "rtl" : "ltr");
      document.documentElement.dir = n || "ltr";
    } catch {
      document.documentElement.dir = "ltr";
    }
  }
  async function fe(e) {
    e && (g = L(e));
    const t = [N("en"), N(g)];
    f && f !== "en" && f !== g && t.push(N(f)),
      await Promise.all(t),
      q(g || f || "en");
  }
  function J() {
    return g;
  }
  function $e(e) {
    (g = L(e)), q(g);
  }
  async function Re(e) {
    (f = L(e || "en")), await N(f), q(g || f);
  }
  async function _e(e) {
    await N(e);
  }
  function l(e) {
    let t;
    return (
      (t = A(m[g] || {}, e)),
      t !== void 0
        ? t
        : ((t = A(m[f] || {}, e)),
          t !== void 0
            ? (I &&
                console.warn(
                  `[localization] Missing "${e}" for "${g}", used journey default "${f}".`
                ),
              t)
            : ((t = A(m.en || {}, e)),
              t !== void 0
                ? (I &&
                    console.warn(
                      `[localization] Missing "${e}" for "${g}" and "${f}", used "en".`
                    ),
                  t)
                : (I &&
                    console.warn(
                      `[localization] Missing key "${e}" in all languages.`
                    ),
                  e)))
    );
  }
  function De(e, t) {
    const n = String(t || "en")
      .toLowerCase()
      .split("-")[0];
    let a = A(m[n] || {}, e);
    return a !== void 0 ||
      ((a = A(m[f] || {}, e)), a !== void 0) ||
      ((a = A(m.en || {}, e)), a !== void 0)
      ? a
      : e;
  }
  const Pe = 25e3;
  async function S(e, t) {
    const n = await Be(),
      a = new AbortController(),
      i = setTimeout(() => a.abort(), Pe);
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
        const u = await r.text().catch(() => "");
        throw new Error(`Network error (${r.status})${u ? ` — ${u}` : ""}`);
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
  const x = (e) =>
    String(e || "")
      .toLowerCase()
      .trim();
  let T = { lang: null, steps: {}, hereRegex: null, ignoreSet: new Set() };
  function z() {
    const e = J();
    if (T.lang === e && T.hereRegex) return T;
    const t = l("aliases.steps"),
      n = l("aliases.here"),
      a = l("aliases.ignore"),
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
      const vt = Array.isArray(s[E]) ? s[E] : [];
      r[E] = [...new Set([...(vt || []), ...i[E]])];
    }
    const U = `^(${(Array.isArray(n) && n.length
        ? n
        : ["you are here", "вы здесь", "ви тут", "אתה כאן", "את כאן", "אתם כאן"]
      )
        .map((E) => E.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})\\s*:\\s*`,
      B = new RegExp(U, "i"),
      p = ["cancelling option", "опция отмены"],
      y = Array.isArray(a) ? a : [],
      ae = new Set([...p.map(x), ...y.map(x)]);
    return (T = { lang: e, steps: r, hereRegex: B, ignoreSet: ae }), T;
  }
  function h(e) {
    const { steps: t, hereRegex: n } = z(),
      a = x(String(e || "").replace(n, ""));
    if (!a) return "";
    for (const [i, r] of Object.entries(t))
      if (r.some((s) => a.includes(x(s)))) return i;
    return a;
  }
  function V(e) {
    const t = h(e),
      a = (Array.isArray(o.journeyOrder) ? o.journeyOrder : []).indexOf(t);
    if (a !== -1) return a;
    const i = oe.indexOf(t);
    return i === -1 ? 999 : 500 + i;
  }
  function W(e) {
    const { hereRegex: t } = z(),
      n = e?.journeyMap || [],
      a = n.find((r) => t.test(r?.stepName || ""));
    if (a) return h(a.stepName);
    for (const r of n) {
      const s = h(r.stepName || "");
      if (s) return s;
    }
    const i = (e?.options || []).map((r) => r.optionName || r);
    return i.some((r) => /^\d{2}\/\d{2}\/\d{4}$/.test(r))
      ? "date"
      : i.some((r) => /^\d{1,2}:\d{2}$/.test(r))
      ? "time"
      : x(e?.message || "").includes("services -")
      ? "service"
      : null;
  }
  function He(e) {
    const { hereRegex: t, ignoreSet: n } = z();
    o.availableSteps || (o.availableSteps = new Set()),
      Array.isArray(o.journeyOrder) || (o.journeyOrder = []);
    const i = (e?.journeyMap || [])
      .map((r) =>
        String(r.stepName || "")
          .replace(t, "")
          .trim()
      )
      .filter((r) => !n.has(x(r)))
      .map(h)
      .filter((r) => r);
    for (const r of i)
      o.availableSteps.add(r),
        o.journeyOrder.includes(r) || o.journeyOrder.push(r);
  }
  function Fe(e) {
    return W(e) === "customer identification";
  }
  function qe(e) {
    return W(e) === "success";
  }
  function pe(e) {
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
  function Je(e) {
    e && (e.scrollTop = e.scrollHeight);
  }
  function ze(e, t) {
    if (!e || !t) return;
    const n = Array.isArray(e.journeyMap) ? e.journeyMap : [];
    for (const { stepName: a, stepAnswer: i } of n)
      if (i)
        switch (h(a)) {
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
  let R = { lang: null, enterIdPhrases: [] };
  function Ve() {
    const e = J();
    if (R.lang === e) return R;
    let t = l("detect.auth.enterId");
    return (
      (!Array.isArray(t) || t.length === 0) &&
        (t = [
          "enter your id",
          "please enter your id",
          "id must hold digits only",
        ]),
      (R = { lang: e, enterIdPhrases: t.filter(Boolean) }),
      R
    );
  }
  function Y(e) {
    if (Fe(e)) return !0;
    if (!(!Array.isArray(e?.options) || e.options.length === 0)) return !1;
    const n = x(pe(e?.message || "")),
      { enterIdPhrases: a } = Ve();
    return a.some((i) => n.includes(x(i)));
  }
  function Et(e) {
    return (Array.isArray(e?.options) ? e.options : []).some((n) => {
      const a = n?.optionValue ?? n,
        i = n?.optionName ?? n;
      return ge(o.commands.skip, a, i) || ge(o.commands.freeText, a, i);
    });
  }
  const me = (e) =>
      String(e || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim(),
    ge = (e, ...t) => {
      if (!e) return !1;
      for (const n of t) {
        const a = me(n);
        if (!a) continue;
        const i = a.split(/[|,;]+/).map((r) => r.trim());
        for (const r of e) {
          const s = me(r);
          if (a === s || a.includes(s) || i.includes(s)) return !0;
        }
      }
      return !1;
    };
  function It(e) {
    return String(e ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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
  function We() {
    c.backButton && (c.backButton.textContent = l("ui.back")),
      c.sendButton && (c.sendButton.textContent = l("ui.send"));
  }
  const w = document.createElement("div");
  (w.id = "summary-bar"), (w.style.display = "none");
  const d = document.createElement("div");
  (d.id = "content-area"), Ye(), c.chatBody.appendChild(d);
  function Ye() {
    !w.isConnected &&
      c.chatWidget &&
      c.chatBody &&
      c.chatWidget.insertBefore(w, c.chatBody);
  }
  function j(e, { replace: t = !1 } = {}) {
    K();
    const n = M();
    t && (n.innerHTML = "");
    const a = document.createElement("div");
    (a.className = "bubble bot"),
      (a.innerHTML = String(e ?? "")),
      n.appendChild(a),
      k();
  }
  function Nt() {
    j(l("msg.localAuth"), { replace: !0 });
  }
  function he(e, t) {
    K();
    const n = document.createElement("div");
    (n.className = "options-list"),
      e.forEach((a) => {
        const i = a.optionName || a,
          r = a.optionValue || i,
          s = document.createElement("button");
        (s.className =
          "option-btn" + (r === "/goBack" ? " option-btn-back" : "")),
          (s.textContent = pe(i)),
          (s.onclick = () => t(r, i)),
          n.appendChild(s);
      }),
      d.appendChild(n);
  }
  function Xe() {
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
  function Ke(e) {
    let t = d.querySelector("#load-more-btn");
    t ||
      ((t = document.createElement("button")),
      (t.id = "load-more-btn"),
      (t.className = "load-more"),
      (t.textContent = l("ui.loadMore")),
      (t.onclick = e),
      d.appendChild(t));
  }
  function Ge() {
    const e = d.querySelector("#load-more-btn");
    e && e.remove();
  }
  function _(e) {
    c.backButton.style.display = e ? "inline-block" : "none";
  }
  function O(e) {
    c.inputArea.style.display = e ? "flex" : "none";
  }
  function D() {
    document
      .querySelectorAll(".option-btn, .date-btn, .load-more")
      .forEach((e) => {
        (e.disabled = !0), e.classList.add("disabled");
      });
  }
  function k() {
    Je(c.chatBody);
  }
  let Tt = null,
    be = !1;
  function Qe() {
    if (be) return;
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
      (be = !0);
  }
  let ye = !1;
  function Ze() {
    if (ye) return;
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
      (ye = !0);
  }
  let we = !1;
  function et() {
    if (we) return;
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
      (we = !0);
  }
  let b = null;
  function X(e = "") {
    if ((et(), b && b.isConnected)) return b;
    const t = M();
    return (
      (b = document.createElement("div")),
      (b.className = "bubble pending"),
      (b.innerHTML = `
    <span class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
    <span>${
      e || (typeof l == "function" && l("ui.loading")) || "Loading…"
    }</span>
  `),
      t.appendChild(b),
      k(),
      b
    );
  }
  function Se() {
    b && (b.remove(), (b = null));
  }
  function tt(e) {
    Qe(), K();
    const t = document.createElement("div");
    t.id = "cm-loader";
    const n = document.createElement("div");
    n.className = "spinner";
    const a = document.createElement("div");
    (a.textContent =
      e || (typeof l == "function" && l("ui.loading")) || "Loading…"),
      t.appendChild(n),
      t.appendChild(a),
      d.appendChild(t);
  }
  function nt() {
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
  function at() {
    Ze();
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
      k(),
      n
    );
  }
  function ot(e, t) {
    return !t || !t.isConnected
      ? !1
      : ((t.className = "bubble bot"),
        (t.innerHTML = String(e ?? "")),
        t.removeAttribute("data-skel"),
        k(),
        !0);
  }
  function it(e) {
    e && e.isConnected && e.remove();
  }
  function K() {
    d.querySelectorAll(
      ".options-list, #date-list, #load-more-btn, #cm-loader"
    ).forEach((e) => e.remove());
  }
  function rt(e) {
    const t = M(),
      n = document.createElement("div");
    (n.className = "bubble user"),
      (n.textContent = String(e ?? "")),
      t.appendChild(n),
      k();
  }
  function G(e) {
    const t = M(),
      n = document.createElement("div");
    (n.className = "bubble bot"),
      (n.innerHTML = String(e ?? "")),
      t.appendChild(n),
      k();
  }
  const xe = 14,
    st = 3,
    ct = 2;
  async function lt(e) {
    const t = h(e),
      n = V(t);
    if (n === -1) return !1;
    let a = xe,
      i = 0;
    for (; a-- > 0; ) {
      const r = V(o.currentStepName || "");
      if (r !== -1 && r <= n) return !0;
      let s;
      try {
        s = await S("/goBack", !1);
      } catch {
        break;
      }
      if ((await C(s), V(o.currentStepName || "") >= r)) {
        if (++i >= ct) break;
      } else i = 0;
    }
    return !1;
  }
  const dt = { service: "service type", "service type": "location" };
  async function ke(e) {
    let t = h(e);
    for (let n = 0; n < st && t; n++) {
      if (await lt(t)) return;
      t = dt[t];
    }
  }
  async function P(e) {
    const t = h(e);
    if (!t) return;
    let n = xe;
    for (; n-- > 0 && h(o.currentStepName) !== t; ) {
      let a;
      try {
        a = await S("/goBack", !1);
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
  function ut() {
    de(), O(!1), _(!1), Z(), ne();
  }
  async function ve() {
    await fe(), We(), ft(), mt();
  }
  function ft() {
    c.toggleButton.addEventListener("click", () => {
      c.chatWidget.classList.add("open"),
        (c.toggleButton.style.display = "none");
    }),
      c.closeButton.addEventListener("click", (e) => {
        e.stopPropagation(),
          c.chatWidget.classList.remove("open"),
          (c.toggleButton.style.display = "block");
      }),
      c.sendButton.addEventListener("click", Ce),
      c.chatInput.addEventListener("keydown", (e) => {
        e.key === "Enter" && (e.preventDefault(), Ce());
      }),
      c.backButton.addEventListener("click", pt);
  }
  async function pt(e) {
    if ((e?.preventDefault?.(), !o.backLockedUntilRestart)) {
      D(), X(l("ui.loading") || "Loading…");
      try {
        const t = await S("/goBack", !1);
        await C(t);
      } catch (t) {
        Se(), j(String(t?.message || "Back failed"));
      }
    }
  }
  async function mt() {
    try {
      (o.JOURNEYS = await Ee()), (o.commands = await Ie());
    } catch (e) {
      console.error("Failed to load configuration:", e), (o.JOURNEYS = []);
    }
    F(),
      (o.journeyChosen = null),
      (o.pendingId = ""),
      O(!0),
      _(!1),
      ne(),
      F(),
      le(),
      Z();
  }
  async function Ce(e) {
    e?.preventDefault?.();
    const t = c.chatInput.value.trim();
    if (!t) return;
    rt(t), (c.chatInput.value = "");
    let n = null;
    const a = setTimeout(() => {
      n = at();
    }, 200);
    try {
      const i = await S(t, !1);
      clearTimeout(a),
        n ? ot(i.message, n) : G(i.message),
        await C(i, { skipMessage: !0 });
    } catch {
      clearTimeout(a), n && it(n), G("…connection error, please try again.");
    }
  }
  function Z() {
    if ((j(""), (d.innerHTML = ""), !o.JOURNEYS.length)) {
      j("No journeys configured. Please add them to appsettings.json.");
      return;
    }
    he(
      o.JOURNEYS.map((e) => ({ optionName: e.label, optionValue: e.value })),
      () => {}
    ),
      d.querySelectorAll(".option-btn").forEach((e, t) => {
        const n = o.JOURNEYS[t];
        e.onclick = () => gt(n);
      });
  }
  async function gt(e) {
    o.journeyChosen = e;
    const t = e.defaultLng || "en";
    await Re(t), await _e(t), je(), re(), D();
    const n = De("ui.loading", t);
    tt(n);
    try {
      const a = await S(e.value, !0);
      await C(a), await kt(a);
    } catch (a) {
      (o.journeyChosen = null), O(!0), _(!1), te(a.message);
    } finally {
      nt();
    }
  }
  async function ee(e, t) {
    if (v(o.commands.restart, e, t)) {
      ut();
      return;
    }
    if (v(o.commands.end, e, t)) {
      se(), ce(), O(!1);
      return;
    }
    if ((v(o.commands.cancel, e, t) && D(), e === "/goBack")) {
      await bt();
      return;
    }
    const n = o.currentStepName;
    try {
      const a = await S(e, !1);
      ht(n, t), await C(a);
    } catch (a) {
      te(a.message);
    }
  }
  function ht(e, t) {
    if (!e || !t) return;
    switch (h(e)) {
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
  async function bt() {
    D();
    try {
      const e = await S("/goBack", !1);
      await C(e);
    } catch (e) {
      te(e.message);
    }
  }
  function yt(e) {
    if (qe(e)) return !0;
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
    Se();
    const { skipMessage: n = !1 } = t;
    (o.currentStepName = W(e) || o.currentStepName || ""),
      He(e),
      ze(e, o.selection);
    const a = Y(e),
      i = yt(e);
    O(!i),
      (o.lastScreenWasAuthLike = a),
      a &&
        o.pendingId &&
        c.chatInput &&
        !c.chatInput.value &&
        (c.chatInput.value = o.pendingId),
      i && (se(), ce());
    const r = e.journeyMap || [],
      s = Me(r) && !i;
    _(s), wt(o.currentStepName), ne(), n || j(e.message);
    const u = Array.isArray(e.options) ? e.options : [],
      U = (y) => /^\d{2}\/\d{2}\/\d{4}$/.test(y.optionName || y),
      B = u.filter(U),
      p = u.filter(
        (y) => !v(o.commands.end, y?.optionValue ?? y, y?.optionName ?? y)
      );
    B.length
      ? (await St(u), (o.datesShown = 0), Le())
      : p.length && he(p, (y, ae) => ee(y, ae)),
      k();
  }
  function te(e) {
    const t = e?.message ? String(e.message) : String(e || "Unknown error");
    G(t), k();
  }
  function wt(e) {
    if (!e || o.availableSteps.size === 0) return;
    o.availableSteps.has("service type") || (o.selection.serviceType = ""),
      o.availableSteps.has("service") || (o.selection.service = ""),
      o.availableSteps.has("location") || (o.selection.location = ""),
      o.availableSteps.has("date") || (o.selection.date = ""),
      o.availableSteps.has("time") || (o.selection.time = "");
    const t = oe.filter((r) => o.availableSteps.has(r)),
      n = h(e),
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
      const u = t.indexOf(s);
      u !== -1 && u >= a && (o.selection[r] = "");
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
      (a.textContent = l("chipsTitle") || "Your selection"),
      n.appendChild(a);
    const i = document.createElement("div");
    i.className = "summary-chips";
    const r = (s, u, U, B) => {
      if (!u) return;
      const p = document.createElement("button");
      (p.className = "chip"),
        (p.title = l("chipChange") || "Change"),
        (p.textContent = `${l(`chips.${s}`)}: ${u}`),
        o.backLockedUntilRestart || o.chipsLocked
          ? ((p.disabled = !0), p.classList.add("disabled"))
          : (p.onclick = B
              ? () => {
                  X(), B();
                }
              : () => {
                  X(), P(U);
                }),
        i.appendChild(p);
    };
    r("id", e.id, "Customer Identification"),
      o.journeyChosen?.label &&
        r("journey", o.journeyChosen.label, null, () => {
          o.backLockedUntilRestart || Z();
        }),
      r("serviceType", e.serviceType, "Service Type", () => ke("Service Type")),
      r("service", e.service, "Service", () => ke("Service")),
      r("location", e.location, "Location", () => P("Location")),
      r("date", e.date, "Date", () => P("Date")),
      r("time", e.time, "Time", () => P("Time")),
      n.appendChild(i),
      w.appendChild(n);
  }
  async function St(e) {
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
          u = String(l("ui.loadMore") || "").toLowerCase();
        return u && s === u;
      });
      if (!n) break;
      t = (await S(n.optionValue || n.optionName, !1)).options || [];
    }
  }
  function Le() {
    const e = Xe(),
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
      o.datesShown < o.availableDates.length ? Ke(() => Le()) : Ge();
  }
  function xt(e) {
    const t = Array.isArray(e?.options) && e.options.length > 0;
    return Y(e) && !t;
  }
  async function kt(e) {
    const t = o.pendingId || "";
    t &&
      (Y(e) && c.chatInput && (c.chatInput.value = t),
      xt(e) && (await ee(t, t)));
  }
  ve();
  function jt(e = {}) {
    const t = e.hostId || "chat-widget";
    let n = document.getElementById(t);
    n ||
      ((n = document.createElement("div")),
      (n.id = t),
      (n.style.cssText = "width:360px;height:520px;border:1px solid #ddd;"),
      document.body.appendChild(n));
    const a = n;
    fe?.(e.lng || "en"), (o.lngCode = e.lng || "en"), ve?.({ root: a, ...e });
  }
  function Ot() {}
  function Mt(e, t) {}
  function Ut() {}
  function $t(...e) {}
  function Rt(...e) {}
  function _t(e) {
    return $e?.(e);
  }
  function Dt() {
    return {};
  }
})();
