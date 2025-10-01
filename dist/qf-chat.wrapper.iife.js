(function () {
  "use strict";
  (() => {
    class c extends HTMLElement {
      connectedCallback() {
        const a = this.getAttribute("lng") || "en",
          d = this.getAttribute("api") || "",
          i = this.getAttribute("src") || "/dist/qf-chat.iife.js",
          s = this.getAttribute("css") || "/dist/qfchat.v1.css",
          n = document.createElement("link");
        (n.rel = "stylesheet"), (n.href = s), document.head.appendChild(n), o();
        const e = document.createElement("script");
        (e.src = i),
          (e.onload = () =>
            window.QFChat?.init?.({ hostId: "chat-widget", lng: a, api: d })),
          (e.onerror = () => console.error("[qf-chat] не загрузился", i)),
          document.head.appendChild(e);
      }
    }
    function o() {
      if (document.getElementById("chat-body")) return;
      const t = document.createElement("div");
      (t.id = "chat-container"),
        (t.style.cssText =
          "position:fixed;bottom:24px;right:24px;z-index:1000"),
        (t.innerHTML = `
      <button id="chat-toggle" class="chat-toggle" aria-label="Open chat">Book Appointment</button>
      <div id="chat-widget">
        <div id="chat-header">
          <span style="flex:1;font-weight:bold">Book Appointment</span>
          <button id="chat-close" class="chat-close" aria-label="Close chat">×</button>
        </div>
        <div id="chat-body"></div>
        <div id="chat-back-area"><button id="chat-back" style="display:none">Back</button></div>
        <div id="chat-input-area">
          <input id="chat-input" type="text" placeholder="Enter your ID…"/>
          <button id="chat-send">Send</button>
        </div>
      </div>
    `),
        document.body.appendChild(t);
    }
    customElements.define("qf-chat", c);
  })();
})();
