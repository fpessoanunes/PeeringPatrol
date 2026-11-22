// Main menu: pitch, keys, mode toggle, phase list with locks, endless entry with bests.
(function (PP) {
  'use strict';
  const h = PP.views.h;

  // o: { saved, phases, emptyPhases, onStart(phaseId), onMode(mode) }
  function render(o) {
    const mode = o.saved.settings.mode;
    const unlocked = new Set(o.saved.unlocked);
    const teaching = o.phases.filter((p) => p.goal_zaps !== null);
    const endless = o.phases.find((p) => p.goal_zaps === null);
    const empty = new Set(o.emptyPhases);

    const modeBtn = (m, label, desc) => h('button', {
      class: 'mode-btn', type: 'button', 'aria-pressed': mode === m ? 'true' : 'false',
      onclick: () => o.onMode(m)
    }, [label, h('span', { class: 'keyhint', text: ' ' + desc })]);

    const phaseBtn = (p, title, meta) => {
      const locked = !unlocked.has(p.id);
      return h('li', {}, h('button', {
        class: 'phase-btn', type: 'button', disabled: locked ? true : null,
        'aria-label': title + (locked ? ', locked' : ''), onclick: () => o.onStart(p.id)
      }, [h('span', { class: 'pt', text: title }), h('span', { class: 'pm', text: locked ? 'Locked' : meta(p) })]));
    };

    const best = o.saved.best[mode];
    const list = h('ul', { class: 'phase-list' }, teaching.map((p) => phaseBtn(p, 'Phase ' + p.id + ' · ' + p.title,
      (q) => (empty.has(q.id) ? 'Under review' : 'Start shift here'))));
    const endlessList = endless ? h('ul', { class: 'phase-list' }, [phaseBtn(endless, 'Endless shift',
      () => 'Best ' + best.shiftScore.toLocaleString('en-US') + ' pts · ' + best.endlessCorrectZaps + ' endless zaps')]) : null;

    return PP.views.screens.show({
      kicker: 'IX NOC · NIGHT SHIFT', h1: 'PEERING PATROL', wide: true,
      body: [
        h('p', { text: 'You are on the NOC shift at an Internet Exchange. Members keep leaking packets that do not belong on the shared peering LAN. Zap them before they flood everyone, and let legitimate peering traffic through. Every decision is explained.' }),
        h('h3', { role: 'heading', 'aria-level': '2', text: 'How to play' }),
        h('div', { class: 'keys' }, [
          h('kbd', { text: 'Click' }), h('span', { text: 'zap the packet under the reticle' }),
          h('kbd', { text: 'Tab' }), h('span', { text: 'lock the next packet (Shift+Tab: previous)' }),
          h('kbd', { text: 'Space' }), h('span', { text: 'zap the locked packet' }),
          h('kbd', { text: 'L' }), h('span', { text: 'let the waiting packet through (practice mode)' }),
          h('kbd', { text: 'F' }), h('span', { text: 'open the shift log with every explanation' }),
          h('kbd', { text: 'P' }), h('span', { text: 'pause · M: sound on/off' })
        ]),
        h('p', { text: 'Clear a phase with 10 correct zaps and at least 80% accuracy. Zapping legitimate traffic costs more than a leak. Integrity carries over through the whole shift.' }),
        h('h3', { role: 'heading', 'aria-level': '2', text: 'Mode' }),
        h('div', { class: 'mode-row' }, [
          modeBtn('arcade', 'Arcade', 'real time'),
          modeBtn('practice', 'Practice', 'every packet waits for you')
        ]),
        h('h3', { role: 'heading', 'aria-level': '2', text: 'Start a shift at' }),
        list,
        endlessList ? h('h3', { role: 'heading', 'aria-level': '2', text: 'Recall test' }) : null,
        endlessList
      ]
    });
  }

  PP.views.menu = { render };
})(globalThis.PP);
