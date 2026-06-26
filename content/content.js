/* AO3 Comment Editor — content script */

const ALLOWED_TAGS = [
  "a","abbr","acronym","address","b","big","blockquote","br",
  "caption","center","cite","code","col","colgroup","dd","del",
  "details","dfn","div","dl","dt","em","figcaption","figure",
  "h1","h2","h3","h4","h5","h6","hr","i","img","ins","kbd",
  "li","ol","p","pre","q","ruby","rt","rp","s","samp","small",
  "span","strike","strong","sub","summary","sup","table","tbody",
  "td","tfoot","th","thead","tr","tt","u","ul","var",
];

const ALLOWED_ATTR = [
  "align","alt","axis","class","dir","height","href","name",
  "src","title","width",
];

function sanitize(html) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR, KEEP_CONTENT: true });
}

// Track injected textareas so we don't double-inject
const injected = new WeakSet();
let editorCounter = 0;

function injectEditor(textarea) {
  if (injected.has(textarea)) return;
  injected.add(textarea);

  // --- build wrapper ---
  const wrapper = document.createElement("div");
  wrapper.className = "ao3ce-wrapper";

  // toggle bar (mirrors AO3's author edit buttons)
  const toggleBar = document.createElement("div");
  toggleBar.className = "ao3ce-toggle";

  const richBtn = document.createElement("button");
  richBtn.type = "button";
  richBtn.textContent = "Rich";
  richBtn.className = "ao3ce-btn ao3ce-btn--active";

  const plainBtn = document.createElement("button");
  plainBtn.type = "button";
  plainBtn.textContent = "Plain";
  plainBtn.className = "ao3ce-btn";

  toggleBar.append(richBtn, plainBtn);

  // Trix needs a hidden <input> as its backing store
  const inputId = `ao3ce-input-${++editorCounter}`;
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.id = inputId;

  // trix-editor element
  const editorEl = document.createElement("trix-editor");
  editorEl.setAttribute("input", inputId);
  editorEl.className = "ao3ce-editor";

  wrapper.append(toggleBar, hiddenInput, editorEl);
  textarea.parentNode.insertBefore(wrapper, textarea);

  // hide original textarea
  textarea.style.display = "none";

  // seed from textarea if it already has content (e.g. edit mode)
  if (textarea.value.trim()) {
    // loadHTML must run after the editor is connected/ready
    editorEl.addEventListener("trix-initialize", () => {
      editorEl.editor.loadHTML(textarea.value);
    }, { once: true });
  }

  // sync Trix → textarea on every change
  editorEl.addEventListener("trix-change", () => {
    textarea.value = sanitize(hiddenInput.value);
  });

  // Rich / Plain toggle
  richBtn.addEventListener("click", () => {
    richBtn.classList.add("ao3ce-btn--active");
    plainBtn.classList.remove("ao3ce-btn--active");
    editorEl.editor.loadHTML(textarea.value);
    wrapper.querySelectorAll("trix-toolbar, trix-editor").forEach(el => el.style.display = "");
    textarea.style.display = "none";
  });

  plainBtn.addEventListener("click", () => {
    plainBtn.classList.add("ao3ce-btn--active");
    richBtn.classList.remove("ao3ce-btn--active");
    textarea.value = sanitize(hiddenInput.value);
    wrapper.querySelectorAll("trix-toolbar, trix-editor").forEach(el => el.style.display = "none");
    textarea.style.display = "";
  });
}

function scanAndInject() {
  document.querySelectorAll("textarea[id^='comment_content_for']").forEach(injectEditor);
}

// Initial scan
scanAndInject();

// Watch for dynamically injected reply forms
const observer = new MutationObserver(() => scanAndInject());
observer.observe(document.body, { childList: true, subtree: true });
