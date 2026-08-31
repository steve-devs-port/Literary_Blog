
// rail

const progressRail = document.getElementById('progress-rail');

function updateProgressRail() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressRail) progressRail.style.width = pct + '%';
}

window.addEventListener('scroll', updateProgressRail, { passive: true });
updateProgressRail();

//scroll highlights
const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function setActiveNav() {
  const scrollPos = window.scrollY + 140;
  let currentId = sections[0] && sections[0].id;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();



navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setTimeout(() => {
      const active = document.querySelector('nav a.is-active');


      if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 400);
  });
});




const revealTargets = document.querySelectorAll('.container:has(h1), .work-item, .highlight-box, .timeline-highlight, .team-card');
revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}


document.querySelectorAll('.photo-frame img, .work-cover img').forEach((img) => {
  img.addEventListener('error', () => {
    const frame = img.closest('.photo-frame, .work-cover');
    if (frame) frame.classList.add('is-empty');
  }, { once: true });
});


const eggOverlay = document.getElementById('easter-egg');
const eggTitle = eggOverlay ? eggOverlay.querySelector('.easter-egg-title') : null;
const eggText = eggOverlay ? eggOverlay.querySelector('.easter-egg-text') : null;
let eggHideTimer;

function showEasterEgg(title, text) {
  if (!eggOverlay || !eggTitle || !eggText) return;
  eggTitle.textContent = title;
  eggText.textContent = text;
  eggOverlay.classList.add('is-shown');
  eggOverlay.setAttribute('aria-hidden', 'false');
  clearTimeout(eggHideTimer);
  eggHideTimer = setTimeout(hideEasterEgg, 6000);
}

function hideEasterEgg() {
  if (!eggOverlay) return;
  eggOverlay.classList.remove('is-shown');
  eggOverlay.setAttribute('aria-hidden', 'true');
}

if (eggOverlay) {
  eggOverlay.addEventListener('click', hideEasterEgg);
}


const footerMark = document.querySelector('footer');
let markClicks = 0;
let markClickTimer;
if (footerMark) {
  footerMark.addEventListener('click', () => {
    markClicks += 1;
    clearTimeout(markClickTimer);
    markClickTimer = setTimeout(() => { markClicks = 0; }, 900);
    if (markClicks === 3) {
      markClicks = 0;
      showEasterEgg(
        '\u2014 30 \u2014',
        'Old wire reporters typed "30" at the bottom of a story to tell the editor it was finished \u2014 a newsroom sign-off Romulo would have used himself.'
      );
    }
  });
}


const secretWord = 'manila';
const keyBuffer = [];
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const key = e.key.toLowerCase();
  if (key.length !== 1) return;
  keyBuffer.push(key);
  if (keyBuffer.length > secretWord.length) keyBuffer.shift();
  if (keyBuffer.join('') === secretWord) {
    showEasterEgg(
      'Manila, 1901',
      'Where the story begins \u2014 Carlos P. Romulo was born in this city, the dateline that opens every dispatch in this file.'
    );
    keyBuffer.length = 0;
  }
});


const heroFigure = document.querySelector('.hero-figure');
const wireTicker = document.getElementById('wire-ticker');
const wireTickerText = wireTicker ? wireTicker.querySelector('.wire-ticker-text') : null;
const WIRE_MESSAGES = [
  'WIRE SERVICE \u2014 DISPATCH RECEIVED. THE FOURTH SESSION IS NOW IN ORDER.',
  'WIRE SERVICE \u2014 CORRESPONDENT SPOTTED READING THE FINE PRINT. WELL DONE.',
  'WIRE SERVICE \u2014 FILE STATUS: THOROUGH. EDITOR APPROVES.',
];
let heroClicks = 0;
let heroClickTimer;
let tickerTypeTimer;
let tickerHideTimer;

function runWireTicker() {
  if (!wireTicker || !wireTickerText) return;
  clearTimeout(tickerTypeTimer);
  clearTimeout(tickerHideTimer);
  const message = WIRE_MESSAGES[Math.floor(Math.random() * WIRE_MESSAGES.length)];
  wireTickerText.textContent = '';
  wireTicker.classList.add('is-shown');

  let i = 0;
  function typeNext() {
    wireTickerText.textContent = message.slice(0, i);
    i += 1;
    if (i <= message.length) {
      tickerTypeTimer = setTimeout(typeNext, 26);
    } else {
      tickerHideTimer = setTimeout(() => wireTicker.classList.remove('is-shown'), 2600);
    }
  }
  typeNext();
}

if (heroFigure) {
  heroFigure.style.cursor = 'pointer';
  heroFigure.addEventListener('click', () => {
    heroClicks += 1;
    clearTimeout(heroClickTimer);
    heroClickTimer = setTimeout(() => { heroClicks = 0; }, 900);
    if (heroClicks === 5) {
      heroClicks = 0;
      runWireTicker();
    }
  });
}


const stampWords = ['ON RECORD', 'VERIFIED', 'FILED'];
document.querySelectorAll('.container:has(h1) h1').forEach((h1) => {
  h1.style.cursor = 'default';
  h1.addEventListener('dblclick', (e) => {
    const stamp = document.createElement('span');
    stamp.className = 'ink-stamp';
    stamp.textContent = stampWords[Math.floor(Math.random() * stampWords.length)];
    stamp.style.left = e.clientX + 'px';
    stamp.style.top = e.clientY + 'px';
    document.body.appendChild(stamp);
    stamp.addEventListener('animationend', () => stamp.remove());
  });
});


document.querySelectorAll('.timeline-highlight').forEach((box) => {
  box.addEventListener('dblclick', () => {
    if (box.classList.contains('is-declassifying')) return;
    box.classList.add('is-declassifying');

    const bar = document.createElement('div');
    bar.className = 'redaction-bar';
    bar.textContent = 'CLASSIFIED';
    box.appendChild(bar);
    requestAnimationFrame(() => bar.classList.add('is-in'));

    const stamp = document.createElement('div');
    stamp.className = 'declass-stamp';
    stamp.textContent = 'DECLASSIFIED';
    box.appendChild(stamp);

    const note = document.createElement('p');
    note.className = 'declass-note';
    note.textContent = box.dataset.declass
      || 'Filed away, now on the record — see the Timeline section for the full sequence.';
    box.appendChild(note);

    setTimeout(() => bar.classList.add('is-out'), 900);
    setTimeout(() => stamp.classList.add('is-in'), 1050);
    setTimeout(() => note.classList.add('is-in'), 1250);

    setTimeout(() => bar.remove(), 1550);
    setTimeout(() => stamp.classList.remove('is-in'), 4200);
    setTimeout(() => note.classList.remove('is-in'), 4400);
    setTimeout(() => {
      stamp.remove();
      note.remove();
      box.classList.remove('is-declassifying');
    }, 5000);
  });
});





const pumpkinStem = document.getElementById('pumpkin-stem');
const eggPumpkin = document.getElementById('egg-pumpkin');
const eggChase = document.getElementById('egg-chase');
const eggChaseImg = document.getElementById('egg-chase-img');
const eggChaseFallback = document.getElementById('egg-chase-fallback');
const eggVoiceA1 = document.getElementById('egg-voice-a1');
const eggVoiceA2 = document.getElementById('egg-voice-a2');
const eggVoiceA3 = document.getElementById('egg-voice-a3');
const eggVoiceA4 = document.getElementById('egg-voice-a4');
let chaseRunning = false;
let chaseTimers = [];




const SPEAKI_FRAMES = {
  peek: {
    src: 'S2.png',
    alt: 'Speaki peeking around the edge of the screen',
    label: 'SPEAKI \u2014 PEEKING OUT',
  },
  surprised: {
    src: 'S3.png',
    alt: 'Speaki startled, spotting the pumpkin',
    label: 'SPEAKI \u2014 SURPRISED',
  },
  reaction: {
    src: 'S.png',
    alt: 'Speaki reacting as the pumpkin rolls away, then giving chase',
    label: 'SPEAKI \u2014 REACTION',
  },
};

function setSpeakiFrame(name) {
  const frame = SPEAKI_FRAMES[name];
  if (!frame || !eggChaseImg) return;
  eggChase.classList.remove('is-empty');
  eggChaseImg.src = frame.src;
  eggChaseImg.alt = frame.alt;
  if (eggChaseFallback) {
    eggChaseFallback.innerHTML = frame.label + '<br><span>' + frame.src + '</span>';
  }
}

function setPumpkinStage(stage) {
  if (eggPumpkin) eggPumpkin.className = 'egg-pumpkin' + (stage ? ' stage-' + stage : '');
}

function setChaseStage(stage) {
  if (eggChase) eggChase.className = 'egg-chase' + (stage ? ' stage-' + stage : '');
}

function playSafe(audioEl) {
  if (!audioEl) return;
  try { audioEl.currentTime = 0; } catch (err) { /* not seekable yet — fine, play() still fires */ }
  audioEl.play().catch(() => {});
}

function clearChaseTimers() {
  chaseTimers.forEach(clearTimeout);
  chaseTimers = [];
}

if (pumpkinStem && eggPumpkin && eggChase && eggChaseImg) {
  eggChaseImg.addEventListener('error', () => {
    eggChase.classList.add('is-empty');
  });
  const pumpkinImg = eggPumpkin.querySelector('img');
  if (pumpkinImg) {
    pumpkinImg.addEventListener('error', () => {
      eggPumpkin.classList.add('is-empty');
    });
  }

  pumpkinStem.addEventListener('click', () => {
    if (chaseRunning) return;
    chaseRunning = true;
    clearChaseTimers();


    setPumpkinStage('');
    setChaseStage('');
    setSpeakiFrame('peek');




    chaseTimers.push(setTimeout(() => setPumpkinStage('land'), 20));

 
    chaseTimers.push(setTimeout(() => {
      setChaseStage('peek');
      playSafe(eggVoiceA1);
    }, 1500));




    chaseTimers.push(setTimeout(() => {
      setSpeakiFrame('surprised');
      setChaseStage('surprised');
      playSafe(eggVoiceA2);
    }, 5500));

   
    chaseTimers.push(setTimeout(() => setPumpkinStage('flee'), 5800));

   
    chaseTimers.push(setTimeout(() => {
      setSpeakiFrame('reaction');
      setChaseStage('crying');
      playSafe(eggVoiceA3);
    }, 8500));



    chaseTimers.push(setTimeout(() => {
      setChaseStage('chase');
      setPumpkinStage('run');
      playSafe(eggVoiceA4);
    }, 10500));

    
    chaseTimers.push(setTimeout(() => {
      setPumpkinStage('');
      setChaseStage('');
      chaseRunning = false;
    }, 12500));
  });
}




const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const musicLabel = musicToggle ? musicToggle.querySelector('.music-label') : null;

if (musicToggle && bgMusic) {
  bgMusic.volume = 0.35;

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {
        if (musicLabel) musicLabel.textContent = 'Add lofi-background.mp3 to assets/audio';
      });
    } else {
      bgMusic.pause();
    }
  });

  bgMusic.addEventListener('play', () => {
    musicToggle.classList.add('is-playing');
    if (musicLabel) musicLabel.textContent = 'Pause ambience';
    musicToggle.setAttribute('aria-pressed', 'true');
  });

  bgMusic.addEventListener('pause', () => {
    musicToggle.classList.remove('is-playing');
    if (musicLabel) musicLabel.textContent = 'Enjoy some tunes while you read...';
    musicToggle.setAttribute('aria-pressed', 'false');
  });
}
