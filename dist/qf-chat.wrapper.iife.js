(function () {
  "use strict";
  (() => {
    if (customElements.get("qf-chat")) return;
    const i = new Set(["he", "ar", "fa", "ur"]),
      a = "v1.3";
    class c extends HTMLElement {
      connectedCallback() {
        const n = this.getAttribute("lng") || "en",
          o = this.getAttribute("api") || "",
          d = this.getAttribute("title") || "Chat";
        (document.documentElement.lang = n),
          (document.documentElement.dir = i.has(n) ? "rtl" : "ltr");
        const t = document.createElement("div");
        (t.id = "chat-container"),
          Object.assign(t.style, {
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: "2147483647",
          }),
          (t.innerHTML = `
        <button id="chat-toggle" class="chat-toggle" aria-label="Open chat">Book Appointment</button>
        <div id="chat-widget">
          <div id="chat-header">
            <span style="flex:1;font-weight:bold">${d}</span>
            <button id="chat-close" class="chat-close" aria-label="Close chat">×</button>
          </div>
          <div id="chat-body"></div>
          <div id="chat-back-area"><button id="chat-back" style="display:none">Back</button></div>
          <div id="chat-input-area">
            <input id="chat-input" type="text" placeholder="Enter your ID…" />
            <button id="chat-send">Send</button>
          </div>
        </div>`),
          this.replaceChildren(t);
        const e = document.createElement("script");
        (e.src = `https://cdn.jsdelivr.net/gh/noerinor/ChatModule@${a}/dist/qfchat.v1.iife.js`),
          (e.onload = () =>
            window.QFChat?.init
              ? window.QFChat.init({ hostId: "chat-widget", lng: n, api: o })
              : console.error("[qf-chat] QFChat.init не найден")),
          (e.onerror = () =>
            console.error("[qf-chat] не загрузился qfchat.v1.iife.js")),
          document.head.appendChild(e);
      }
    }
    customElements.define("qf-chat", c);
  })();
})();
