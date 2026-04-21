/* MotorPerú · Agente Andrea — Widget IIFE v1.0 */
(function(){
  'use strict';
  if (window.__mpAgentLoaded) return;
  window.__mpAgentLoaded = true;

  var DEFAULTS = {
    n8nBase: 'https://n8n-jcg4epwgyztosnmbxghhwvdv.34.133.34.116.sslip.io',
    chatPath: '/webhook/demo-motorperu-chat',
    citasPath: '/webhook/demo-motorperu-citas',
    leadsPath: null,
    timeoutMs: 45000,
    maxRetries: 2,
    brandName: 'MotorPerú',
    agentName: 'Andrea',
    welcomeMessage: '¡Hola! Soy Andrea de MotorPerú 👋 Te ayudo a encontrar el auto ideal para ti — cuota, modelo y prueba de manejo. ¿Qué buscas hoy?',
    primary: '#C8102E',
    primaryDark: '#9b0c24',
    accent: '#0a2540'
  };
  var cfg = Object.assign({}, DEFAULTS, window.motorPeruConfig || {});

  // ---- Session ----
  var SID_KEY = 'mp_sid';
  var sid = sessionStorage.getItem(SID_KEY);
  if (!sid) { sid = 'web_' + Math.random().toString(36).slice(2,10) + '_' + Date.now(); sessionStorage.setItem(SID_KEY, sid); }

  // ---- Utils ----
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]);}); }
  function md(s){
    var t = esc(s);
    t = t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    t = t.replace(/\*(.+?)\*/g,'<em>$1</em>');
    t = t.replace(/`([^`]+)`/g,'<code>$1</code>');
    t = t.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    t = t.replace(/\n/g,'<br>');
    return t;
  }
  function strip(s){ return String(s||'').replace(/\{\{[^}]+\}\}/g,'').replace(/\[[a-z_]+\]/gi,''); }

  // ---- Styles ----
  var css = `
  .mp-root{position:fixed;bottom:20px;right:20px;z-index:999999;font-family:'Inter',system-ui,-apple-system,sans-serif;color:#0E1116}
  .mp-fab{width:64px;height:64px;border-radius:50%;background:${cfg.primary};color:#fff;border:none;cursor:pointer;box-shadow:0 8px 24px rgba(200,16,46,.35);display:grid;place-items:center;font-size:28px;transition:transform .2s}
  .mp-fab:hover{transform:scale(1.08);background:${cfg.primaryDark}}
  .mp-fab.open{background:${cfg.accent}}
  .mp-badge{position:absolute;top:-4px;right:-4px;background:#fff;color:${cfg.primary};border-radius:999px;padding:2px 7px;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.15);animation:mp-pulse 2s infinite}
  @keyframes mp-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
  .mp-panel{position:absolute;bottom:80px;right:0;width:380px;max-width:calc(100vw - 40px);height:640px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.22);display:none;flex-direction:column;overflow:hidden;border:1px solid #e5e7eb;box-sizing:border-box}
  .mp-panel *{box-sizing:border-box}
  .mp-panel.open{display:flex;animation:mp-slide .25s ease-out}
  @keyframes mp-slide{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .mp-head{background:linear-gradient(135deg,${cfg.primary},${cfg.primaryDark});color:#fff;padding:18px 20px;display:flex;align-items:center;gap:12px}
  .mp-avatar{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.22);display:grid;place-items:center;font-weight:700;font-size:17px;flex-shrink:0}
  .mp-head-title{font-weight:700;font-size:15px;line-height:1.2}
  .mp-head-sub{font-size:12px;opacity:.85;display:flex;align-items:center;gap:6px;margin-top:2px}
  .mp-dot{width:8px;height:8px;border-radius:50%;background:#6ee7a7;box-shadow:0 0 8px #6ee7a7}
  .mp-close{margin-left:auto;background:transparent;color:#fff;border:none;font-size:22px;cursor:pointer;opacity:.85;padding:4px 8px}
  .mp-close:hover{opacity:1}
  .mp-msgs{flex:1;overflow-y:auto;padding:18px;background:#f6f7f9;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
  .mp-row{display:flex;gap:8px;max-width:88%;width:fit-content}
  .mp-row.user{margin-left:auto;flex-direction:row-reverse}
  .mp-row.bot:has(.mp-lead){max-width:100%;width:100%}
  .mp-row.bot:has(.mp-lead) .mp-bubble{padding:0;border:none;background:transparent;width:100%}
  .mp-bubble{padding:11px 14px;border-radius:14px;font-size:14px;line-height:1.5;word-wrap:break-word}
  .mp-row.bot .mp-bubble{background:#fff;color:#0E1116;border:1px solid #e5e7eb;border-bottom-left-radius:4px}
  .mp-row.user .mp-bubble{background:${cfg.primary};color:#fff;border-bottom-right-radius:4px}
  .mp-bubble img{max-width:1.2em !important;max-height:1.2em !important;display:inline-block !important;vertical-align:text-bottom !important}
  .mp-bubble a{color:${cfg.primary};text-decoration:underline}
  .mp-row.user .mp-bubble a{color:#fff}
  .mp-bubble table{border-collapse:collapse;font-size:13px;margin:8px 0;width:100%}
  .mp-bubble th,.mp-bubble td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left}
  .mp-bubble th{background:#f6f7f9;font-weight:600}
  .mp-typing{display:flex;gap:4px;padding:12px 14px}
  .mp-typing span{width:7px;height:7px;border-radius:50%;background:#9ca3af;animation:mp-bounce 1.4s infinite}
  .mp-typing span:nth-child(2){animation-delay:.2s} .mp-typing span:nth-child(3){animation-delay:.4s}
  @keyframes mp-bounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-6px);opacity:1}}
  .mp-chips{display:flex;gap:6px;flex-wrap:wrap;padding:0 18px 6px}
  .mp-chip{background:#fff;border:1px solid #e5e7eb;color:#0E1116;padding:7px 12px;border-radius:999px;font-size:12px;cursor:pointer;font-weight:500;transition:all .15s}
  .mp-chip:hover{background:${cfg.primary};color:#fff;border-color:${cfg.primary}}
  .mp-input{display:flex;padding:12px;gap:8px;border-top:1px solid #e5e7eb;background:#fff}
  .mp-ta{flex:1;border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;font:14px 'Inter',sans-serif;resize:none;outline:none;max-height:80px;min-height:40px}
  .mp-ta:focus{border-color:${cfg.primary}}
  .mp-send{background:${cfg.primary};color:#fff;border:none;border-radius:10px;padding:0 16px;cursor:pointer;font-weight:600;font-size:14px}
  .mp-send:hover{background:${cfg.primaryDark}}
  .mp-send:disabled{opacity:.5;cursor:not-allowed}
  .mp-foot{text-align:center;padding:6px;font-size:11px;color:#9ca3af;background:#fff;border-top:1px solid #f3f4f6}
  .mp-foot a{color:${cfg.primary};text-decoration:none}
  .mp-lead{background:linear-gradient(135deg,${cfg.accent},#143b66);color:#fff;border-radius:12px;padding:14px;margin:6px 0;max-width:100%;overflow:hidden}
  .mp-lead h4{margin:0 0 6px;font-size:15px}
  .mp-lead p{margin:0 0 10px;font-size:13px;opacity:.9}
  .mp-lead input{width:100%;padding:9px 11px;border:none;border-radius:8px;margin-bottom:8px;font:14px 'Inter',sans-serif;outline:none;box-sizing:border-box}
  .mp-lead button{width:100%;background:${cfg.primary};color:#fff;border:none;padding:11px;border-radius:8px;font-weight:600;cursor:pointer;font-size:14px}
  .mp-lead button:hover{background:${cfg.primaryDark}}
  .mp-sede-list{display:flex;flex-direction:column;gap:6px;margin-bottom:4px}
  .mp-sede{display:flex !important;flex-direction:column;align-items:flex-start;text-align:left;background:rgba(255,255,255,.1) !important;color:#fff !important;padding:10px 12px !important;border:1px solid rgba(255,255,255,.2);border-radius:8px;cursor:pointer;transition:background .15s;width:100%;margin:0}
  .mp-sede:hover{background:${cfg.primary} !important}
  .mp-sede strong{font-size:14px;font-weight:700;display:block}
  .mp-sede span{font-size:12px;opacity:.8;display:block;margin-top:2px}
  .mp-day-tabs{display:flex;gap:4px;overflow-x:auto;margin-bottom:10px;padding-bottom:4px}
  .mp-day-tab{flex:0 0 auto;background:rgba(255,255,255,.1) !important;color:#fff !important;padding:7px 10px !important;border:1px solid rgba(255,255,255,.2) !important;border-radius:6px !important;font-size:12px !important;cursor:pointer;font-weight:500 !important;white-space:nowrap}
  .mp-day-tab.active{background:${cfg.primary} !important;border-color:${cfg.primary} !important}
  .mp-slot-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:4px;width:100%}
  .mp-slot{background:rgba(255,255,255,.12) !important;color:#fff !important;padding:9px 2px !important;border:1px solid rgba(255,255,255,.2) !important;border-radius:6px !important;font-size:12px !important;cursor:pointer;font-weight:600 !important;transition:all .15s;margin:0 !important;width:100% !important;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mp-slot:hover:not(.blocked){background:${cfg.primary} !important;border-color:${cfg.primary} !important}
  .mp-slot.sel{background:${cfg.primary} !important;border-color:#fff !important;box-shadow:0 0 0 2px rgba(255,255,255,.4)}
  .mp-slot.blocked{background:rgba(255,255,255,.04) !important;color:rgba(255,255,255,.3) !important;text-decoration:line-through;cursor:not-allowed;border-color:rgba(255,255,255,.08) !important}
  @media(max-width:480px){.mp-panel{position:fixed;bottom:88px;right:10px;left:10px;width:auto;max-width:none;height:auto;max-height:calc(100vh - 110px)}}
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---- DOM ----
  var root = document.createElement('div'); root.className = 'mp-root';
  root.innerHTML = `
    <div class="mp-panel" role="dialog" aria-label="Chat Andrea">
      <div class="mp-head">
        <div class="mp-avatar">A</div>
        <div>
          <div class="mp-head-title">Andrea · ${esc(cfg.brandName)}</div>
          <div class="mp-head-sub"><span class="mp-dot"></span>En línea ahora</div>
        </div>
        <button class="mp-close" aria-label="Cerrar">×</button>
      </div>
      <div class="mp-msgs" aria-live="polite"></div>
      <div class="mp-chips"></div>
      <div class="mp-input">
        <textarea class="mp-ta" rows="1" placeholder="Escribe tu mensaje…" aria-label="Mensaje"></textarea>
        <button class="mp-send" aria-label="Enviar">Enviar</button>
      </div>
      <div class="mp-foot">🔒 Demo · Powered by <a href="https://ijvagency.com" target="_blank" rel="noopener">IJV Agency</a></div>
    </div>
    <button class="mp-fab" aria-label="Abrir chat">💬<span class="mp-badge">1</span></button>
  `;
  document.body.appendChild(root);

  var $panel = root.querySelector('.mp-panel');
  var $fab = root.querySelector('.mp-fab');
  var $badge = root.querySelector('.mp-badge');
  var $close = root.querySelector('.mp-close');
  var $msgs = root.querySelector('.mp-msgs');
  var $chips = root.querySelector('.mp-chips');
  var $ta = root.querySelector('.mp-ta');
  var $send = root.querySelector('.mp-send');

  var opened = false;
  var busy = false;
  var leadShown = false;

  function scrollBottom(){
    $msgs.scrollTop = $msgs.scrollHeight;
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(function(){ $msgs.scrollTop = $msgs.scrollHeight; });
  }

  function addRow(role, html){
    var row = document.createElement('div'); row.className = 'mp-row '+role;
    row.innerHTML = '<div class="mp-bubble">'+html+'</div>';
    $msgs.appendChild(row);
    scrollBottom();
    return row;
  }
  function showTyping(){
    var row = document.createElement('div'); row.className='mp-row bot mp-typing-row';
    row.innerHTML = '<div class="mp-bubble mp-typing"><span></span><span></span><span></span></div>';
    $msgs.appendChild(row); scrollBottom(); return row;
  }

  function setChips(items){
    $chips.innerHTML = '';
    items.forEach(function(txt){
      var c = document.createElement('button'); c.className='mp-chip'; c.textContent = txt;
      c.onclick = function(){ send(txt); };
      $chips.appendChild(c);
    });
  }

  function detectHandoff(text){
    var re = /\b(asesor|contactar|equipo|agenda|agendar|prueba de manejo|cotizaci[oó]n formal|ll[aá]manme|contacto humano|visitar|visita|cita)\b/i;
    return re.test(text);
  }

  // ---- Agendador interno ----
  var SEDES = [
    { id:'surco',     name:'Surco',     addr:'Av. Javier Prado 4200' },
    { id:'sanisidro', name:'San Isidro', addr:'Av. Ejército 980' },
    { id:'arequipa',  name:'Arequipa',  addr:'Av. Bolognesi 520' },
    { id:'trujillo',  name:'Trujillo',  addr:'Av. España 1800' }
  ];
  var SLOTS = ['09:00','10:30','12:00','14:00','15:30','17:00','18:30'];
  var MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  var DAYS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  function buildDays(){
    var out = [], d = new Date();
    d.setDate(d.getDate()+1); // desde mañana
    for (var i=0;i<5;i++){
      var dd = new Date(d); dd.setDate(d.getDate()+i);
      if (dd.getDay() === 0) { i--; d.setDate(d.getDate()+1); continue; } // skip domingos
      out.push({ date: dd, label: DAYS[dd.getDay()]+' '+dd.getDate()+' '+MONTHS[dd.getMonth()] });
    }
    return out;
  }
  // Seed determinista por sede+día para que "ocupados" se vean estables
  function isBlocked(sedeId, dayIdx, slotIdx){
    var h = 0, key = sedeId+'-'+dayIdx+'-'+slotIdx;
    for (var k=0;k<key.length;k++) h = (h*31 + key.charCodeAt(k)) >>> 0;
    return (h % 10) < 4; // ~40% bloqueados
  }

  function showLeadForm(){
    if (leadShown) return;
    leadShown = true;
    var state = { name:'', phone:'', email:'', interest:'', sede:null, day:null, slot:null };
    var row = document.createElement('div'); row.className='mp-row bot';
    row.innerHTML = '<div class="mp-lead" id="mp-sched"></div>';
    $msgs.appendChild(row); scrollBottom();
    var box = row.querySelector('#mp-sched');

    function renderStep1(){
      box.innerHTML =
        '<h4>📋 Paso 1 de 3 — Tus datos</h4>' +
        '<p>Para que el asesor te llegue con contexto antes de la cita.</p>' +
        '<input type="text" id="f-name" value="'+esc(state.name)+'" placeholder="Nombre completo" />' +
        '<input type="tel" id="f-phone" value="'+esc(state.phone)+'" placeholder="Celular" />' +
        '<input type="email" id="f-email" value="'+esc(state.email)+'" placeholder="Correo electrónico" />' +
        '<input type="text" id="f-int" value="'+esc(state.interest)+'" placeholder="Modelo de interés (opcional)" />' +
        '<button id="f-next">Continuar →</button>';
      box.querySelector('#f-next').onclick = function(){
        var n = box.querySelector('#f-name').value.trim();
        var p = box.querySelector('#f-phone').value.trim();
        var e = box.querySelector('#f-email').value.trim();
        if (!n || !p || !e){ alert('Ingresa nombre, celular y correo'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){ alert('Correo inválido'); return; }
        state.name = n; state.phone = p; state.email = e; state.interest = box.querySelector('#f-int').value.trim();
        renderStep2();
      };
    }

    function renderStep2(){
      var html = '<h4>📍 Paso 2 de 3 — Elige sede</h4><p>Dónde te queda más cómoda la prueba de manejo.</p><div class="mp-sede-list">';
      SEDES.forEach(function(s){
        html += '<button class="mp-sede" data-id="'+s.id+'"><strong>'+s.name+'</strong><span>'+s.addr+'</span></button>';
      });
      html += '</div><button id="f-back1" style="background:transparent;border:1px solid rgba(255,255,255,.3);margin-top:8px">← Atrás</button>';
      box.innerHTML = html;
      box.querySelectorAll('.mp-sede').forEach(function(b){
        b.onclick = function(){ state.sede = SEDES.find(function(x){return x.id===b.dataset.id;}); renderStep3(); };
      });
      box.querySelector('#f-back1').onclick = renderStep1;
      scrollBottom();
    }

    function renderStep3(){
      var days = buildDays();
      state.day = state.day || 0;
      var html = '<h4>🕒 Paso 3 de 3 — Elige horario</h4>' +
        '<p style="margin-bottom:10px">Sede: <strong>'+esc(state.sede.name)+'</strong></p>' +
        '<div class="mp-day-tabs">';
      days.forEach(function(d,i){
        html += '<button class="mp-day-tab'+(i===state.day?' active':'')+'" data-i="'+i+'">'+esc(d.label)+'</button>';
      });
      html += '</div><div class="mp-slot-grid">';
      SLOTS.forEach(function(s,i){
        var blocked = isBlocked(state.sede.id, state.day, i);
        html += '<button class="mp-slot'+(blocked?' blocked':'')+(state.slot===i?' sel':'')+'" '+(blocked?'disabled':'')+' data-i="'+i+'">'+esc(s)+(blocked?' ✕':'')+'</button>';
      });
      html += '</div>' +
        '<div style="display:flex;gap:6px;margin-top:12px">' +
          '<button id="f-back2" style="flex:0 0 auto;background:transparent;border:1px solid rgba(255,255,255,.3)">← Atrás</button>' +
          '<button id="f-confirm" style="flex:1" '+(state.slot===null?'disabled style="flex:1;opacity:.5"':'')+'>Confirmar cita</button>' +
        '</div>';
      box.innerHTML = html;
      box.querySelectorAll('.mp-day-tab').forEach(function(b){
        b.onclick = function(){ state.day = parseInt(b.dataset.i,10); state.slot = null; renderStep3(); };
      });
      box.querySelectorAll('.mp-slot').forEach(function(b){
        b.onclick = function(){ if (b.disabled) return; state.slot = parseInt(b.dataset.i,10); renderStep3(); };
      });
      box.querySelector('#f-back2').onclick = renderStep2;
      var conf = box.querySelector('#f-confirm');
      if (state.slot === null) { conf.disabled = true; conf.style.opacity='.5'; conf.style.cursor='not-allowed'; }
      conf.onclick = function(){
        if (state.slot === null) return;
        var d = days[state.day], slot = SLOTS[state.slot];
        conf.disabled = true; conf.textContent = 'Confirmando…';
        fetch(cfg.n8nBase + cfg.citasPath, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            nombre: state.name,
            telefono: state.phone,
            email: state.email,
            modelo: state.interest,
            sede: state.sede.name + ' — ' + state.sede.addr,
            fecha: d.label,
            hora: slot,
            sessionId: sid
          })
        }).catch(function(){}).finally(function(){
          box.innerHTML =
            '<h4>✅ ¡Cita confirmada!</h4>' +
            '<p style="margin:0 0 10px">'+esc(state.name.split(' ')[0])+', tu prueba de manejo quedó agendada:</p>' +
            '<div style="background:rgba(255,255,255,.15);border-radius:10px;padding:12px;font-size:14px;line-height:1.6">' +
              '📍 <strong>'+esc(state.sede.name)+'</strong> · '+esc(state.sede.addr)+'<br>' +
              '📅 <strong>'+esc(d.label)+'</strong> · '+esc(slot)+' hrs<br>' +
              '✉️ Confirmación a '+esc(state.email)+
            '</div>' +
            '<p style="margin:10px 0 0;font-size:12px;opacity:.85">Te llegará un recordatorio por correo 2h antes. ¿Necesitas cambiar algo? Escríbenos a <a href="mailto:ventas@motorperu.com.pe" style="color:#fff;text-decoration:underline">ventas@motorperu.com.pe</a>.</p>';
          scrollBottom();
        });
      };
      scrollBottom();
    }

    renderStep1();
  }

  function openPanel(){
    opened = true;
    $panel.classList.add('open');
    $fab.classList.add('open');
    $fab.textContent = '×';
    $badge && ($badge.style.display='none');
    if (!$msgs.children.length){
      addRow('bot', md(cfg.welcomeMessage));
      setChips(['Quiero un auto económico', 'SUV familiar', 'Simular cuota', 'Prueba de manejo']);
    }
  }
  function closePanel(){
    opened = false;
    $panel.classList.remove('open');
    $fab.classList.remove('open');
    $fab.innerHTML = '💬<span class="mp-badge">1</span>';
    $badge = root.querySelector('.mp-badge');
  }

  $fab.onclick = function(){ opened ? closePanel() : openPanel(); };
  $close.onclick = closePanel;

  async function callAgent(message){
    var ctrl = new AbortController();
    var to = setTimeout(function(){ ctrl.abort(); }, cfg.timeoutMs);
    try {
      var res = await fetch(cfg.n8nBase + cfg.chatPath, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: message, sessionId: sid, channel: 'web' }),
        signal: ctrl.signal
      });
      clearTimeout(to);
      var data = await res.json();
      return data.output || data.reply || data.message || '';
    } catch(e){ clearTimeout(to); throw e; }
  }

  async function send(text){
    text = (text || $ta.value).trim();
    if (!text || busy) return;
    busy = true; $send.disabled = true;
    $ta.value=''; $chips.innerHTML='';
    addRow('user', esc(text));
    var typing = showTyping();
    try {
      var reply = await callAgent(text);
      typing.remove();
      reply = strip(reply) || 'Disculpa, no pude procesar tu mensaje. ¿Podrías reformularlo?';
      addRow('bot', md(reply));
      if (detectHandoff(text) || detectHandoff(reply)) setTimeout(showLeadForm, 400);
    } catch(e){
      typing.remove();
      addRow('bot', md('⚠️ Hubo un problema de conexión. Intenta de nuevo o escríbenos al WhatsApp +51 999 888 777.'));
    } finally {
      busy = false; $send.disabled = false; $ta.focus();
    }
  }

  $send.onclick = function(){ send(); };
  $ta.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); send(); }
  });
  $ta.addEventListener('input', function(){ $ta.style.height='auto'; $ta.style.height = Math.min($ta.scrollHeight, 80)+'px'; });

})();
