'use strict';
const film = document.querySelector('#welcome-film');
const status = document.querySelector('#film-status');

if (film && status) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let autoplayBlocked = false;

  function showStatus(message) {
    status.textContent = message;
    status.hidden = !message;
  }

  async function playFilm() {
    film.hidden = false;
    film.muted = true;
    try {
      await film.play();
      if (motion.matches || document.hidden) {
        film.pause();
        return;
      }
      showStatus('');
    } catch {
      autoplayBlocked = true;
      film.autoplay = false;
      film.pause();
      film.hidden = true;
      showStatus('The still image is shown because automatic playback is unavailable.');
    }
  }

  function applyMotionPreference() {
    document.documentElement.dataset.reducedMotion = String(motion.matches);
    film.autoplay = !motion.matches && !autoplayBlocked;
    if (motion.matches) {
      film.pause();
      film.hidden = true;
      showStatus('The still image is shown for your reduced-motion preference.');
    } else if (!document.hidden && !autoplayBlocked) {
      void playFilm();
    }
  }

  film.addEventListener('error', () => {
    autoplayBlocked = true;
    film.autoplay = false;
    film.pause();
    film.hidden = true;
    showStatus('The film could not load. Its still image is shown instead.');
  });
  motion.addEventListener('change', applyMotionPreference);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      film.pause();
    } else {
      applyMotionPreference();
    }
  });
  applyMotionPreference();
}
