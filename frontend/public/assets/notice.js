/* notice.js — modais de confirmação/aviso para o painel (IdecanConfirm / IdecanNotice).
 * Fornece window.IdecanConfirm(message, opts) -> Promise<boolean>
 *      e window.IdecanNotice(message, opts) -> Promise<void>
 * opts: { title, okLabel, cancelLabel }
 */
(function () {
  if (window.IdecanConfirm && window.IdecanNotice) return;

  var STYLE_ID = 'idecan-notice-styles';
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = ''
      + '.idn-backdrop{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;'
      + 'background:rgba(20,16,40,.55);backdrop-filter:blur(4px);opacity:0;transition:opacity .18s ease;padding:20px;}'
      + '.idn-backdrop.idn-show{opacity:1;}'
      + '.idn-card{width:100%;max-width:440px;background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(30,20,70,.35);'
      + 'padding:26px 26px 22px;transform:translateY(10px) scale(.98);transition:transform .18s ease;font-family:inherit;}'
      + '.idn-backdrop.idn-show .idn-card{transform:translateY(0) scale(1);}'
      + '.idn-title{font-size:18px;font-weight:700;color:#1c1340;margin:0 0 8px;}'
      + '.idn-msg{font-size:14px;line-height:1.55;color:#4a4466;margin:0 0 22px;white-space:pre-line;}'
      + '.idn-actions{display:flex;gap:10px;justify-content:flex-end;}'
      + '.idn-btn{border:0;cursor:pointer;font-size:14px;font-weight:600;padding:10px 18px;border-radius:10px;transition:filter .15s ease,background .15s ease;}'
      + '.idn-btn:hover{filter:brightness(.95);}'
      + '.idn-btn-cancel{background:#eee9f7;color:#4a4466;}'
      + '.idn-btn-ok{background:#7c3aed;color:#fff;}'
      + '.idn-btn-danger{background:#e11d48;color:#fff;}';
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = css;
    document.head.appendChild(st);
  }

  function buildModal(message, opts, withCancel) {
    opts = opts || {};
    injectStyles();
    var back = document.createElement('div');
    back.className = 'idn-backdrop';

    var card = document.createElement('div');
    card.className = 'idn-card';

    var title = document.createElement('h3');
    title.className = 'idn-title';
    title.textContent = opts.title || (withCancel ? 'Confirmar ação' : 'Aviso');

    var msg = document.createElement('p');
    msg.className = 'idn-msg';
    msg.textContent = message || '';

    var actions = document.createElement('div');
    actions.className = 'idn-actions';

    card.appendChild(title);
    card.appendChild(msg);
    card.appendChild(actions);
    back.appendChild(card);

    return { back: back, actions: actions };
  }

  function open(back) {
    document.body.appendChild(back);
    requestAnimationFrame(function () { back.classList.add('idn-show'); });
  }

  function close(back) {
    back.classList.remove('idn-show');
    setTimeout(function () { if (back.parentNode) back.parentNode.removeChild(back); }, 200);
  }

  window.IdecanConfirm = function (message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var m = buildModal(message, opts, true);

      var cancelBtn = document.createElement('button');
      cancelBtn.className = 'idn-btn idn-btn-cancel';
      cancelBtn.textContent = opts.cancelLabel || 'Cancelar';

      var okBtn = document.createElement('button');
      okBtn.className = 'idn-btn ' + (opts.danger === false ? 'idn-btn-ok' : 'idn-btn-danger');
      okBtn.textContent = opts.okLabel || 'Confirmar';

      m.actions.appendChild(cancelBtn);
      m.actions.appendChild(okBtn);

      function done(val) { close(m.back); resolve(val); }
      cancelBtn.addEventListener('click', function () { done(false); });
      okBtn.addEventListener('click', function () { done(true); });
      m.back.addEventListener('click', function (e) { if (e.target === m.back) done(false); });

      open(m.back);
      okBtn.focus();
    });
  };

  window.IdecanNotice = function (message, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var m = buildModal(message, opts, false);

      var okBtn = document.createElement('button');
      okBtn.className = 'idn-btn idn-btn-ok';
      okBtn.textContent = opts.okLabel || 'OK';

      m.actions.appendChild(okBtn);

      function done() { close(m.back); resolve(); }
      okBtn.addEventListener('click', done);
      m.back.addEventListener('click', function (e) { if (e.target === m.back) done(); });

      open(m.back);
      okBtn.focus();
    });
  };
})();
