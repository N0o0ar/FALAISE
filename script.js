const iframe = document.getElementById('vimeo-player');
const player = new Vimeo.Player(iframe);

const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressPreview = document.getElementById('progress-preview');
const controls = document.getElementById('controls');
const videoContainer = document.getElementById('video-container');
const fullscreenBtn = document.getElementById('fullscreen-btn'); // Sélectionne le bouton plein écran

let inactivityTimeout;
let isControlsVisible = true;

// URLs des images play, pause et plein écran
const playImageUrl = 'images/bouton.png';
const pauseImageUrl = 'images/pause.png';
const fullScreenImageUrl = 'images/full.png'; // Icône plein écran
const unFullScreenImageUrl = 'images/unfull.png'; // Icône quitter plein écran

// Fonction pour afficher les contrôles
function showControls() {
  if (!isControlsVisible) {
    controls.style.opacity = 1;
    controls.style.pointerEvents = 'auto';
    isControlsVisible = true;
  }
  resetInactivityTimeout(); // Réinitialiser l'inactivité lorsque les contrôles sont affichés
}

// Fonction pour cacher les contrôles
function hideControls() {
  if (isControlsVisible) {
    controls.style.opacity = 0;
    controls.style.pointerEvents = 'none';
    isControlsVisible = false;
  }
}

// Réinitialise le délai d'inactivité
function resetInactivityTimeout() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    player.getPaused().then(paused => {
      if (!paused) {
        hideControls(); // Cacher les contrôles si la vidéo joue et il n'y a pas d'interaction
      }
    });
  }, 2000); // 2 secondes d'inactivité
}

// Toggle play/pause
playBtn.addEventListener('click', () => {
  player.getPaused().then(paused => {
    if (paused) {
      player.play().then(() => {
        playBtn.style.backgroundImage = `url(${pauseImageUrl})`; // Affiche le bouton pause
        resetInactivityTimeout(); // Masquer les contrôles après avoir démarré la vidéo
      });
    } else {
      player.pause().then(() => {
        playBtn.style.backgroundImage = `url(${playImageUrl})`; // Affiche le bouton play
        showControls(); // Afficher les contrôles lorsqu'on met en pause
      });
    }
  });
});

// Mise à jour de la barre de progression en temps réel
player.on('timeupdate', function(data) {
  const progress = (data.seconds / data.duration) * 100;
  progressFill.style.width = progress + '%';
});

// Permet de cliquer sur la barre de progression pour avancer/reculer dans la vidéo
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  player.getDuration().then(duration => {
    const newTime = (offsetX / progressBar.offsetWidth) * duration;
    player.setCurrentTime(newTime);
  });
});

// Affichage de la barre de prévisualisation lors du survol
progressBar.addEventListener('mousemove', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const previewWidth = (offsetX / progressBar.offsetWidth) * 100;
  progressPreview.style.width = previewWidth + '%';
});

progressBar.addEventListener('mouseleave', () => {
  progressPreview.style.width = '0%'; // Cache la prévisualisation lorsque la souris quitte la barre
});

// Gérer le bouton plein écran pour changer l'icône
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen(); // Activer le plein écran
    fullscreenBtn.style.backgroundImage = `url(${unFullScreenImageUrl})`; // Change l'icône en quitter plein écran
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); // Quitter le plein écran
      fullscreenBtn.style.backgroundImage = `url(${fullScreenImageUrl})`; // Remet l'icône en plein écran
    }
  }
}

// Gère le changement d'état du plein écran (ESC ou autres événements)
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    fullscreenBtn.style.backgroundImage = `url(${fullScreenImageUrl})`; // Remet l'icône si on quitte le plein écran
  }
});

// Écoute du clic sur le bouton plein écran
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Affichage des contrôles au démarrage
showControls();

// Code pour le bouton processus créatif (inchangé)
const processusCreatifBtn = document.getElementById('processus-creatif-btn');

// Fonction pour afficher le bouton "Processus créatif"
function showProcessusCreatifBtn() {
  processusCreatifBtn.style.opacity = 1;
  processusCreatifBtn.style.pointerEvents = 'auto';
}

// Fonction pour cacher le bouton "Processus créatif"
function hideProcessusCreatifBtn() {
  processusCreatifBtn.style.opacity = 0;
  processusCreatifBtn.style.pointerEvents = 'none';
}

// Réinitialise le délai d'inactivité pour le bouton "Processus créatif"
function resetInactivityTimeoutForProcessusBtn() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    player.getPaused().then(paused => {
      if (!paused) {
        hideControls(); // Cacher les contrôles si la vidéo joue et il n'y a pas d'interaction
        hideProcessusCreatifBtn(); // Cacher le bouton "Processus créatif"
      }
    });
  }, 2000); // 2 secondes d'inactivité
}

// Affichage des contrôles et du bouton "Processus créatif" au démarrage
showControls();
showProcessusCreatifBtn();

// Réinitialisation des événements sur le mouvement de souris
document.addEventListener('mousemove', () => {
  showControls();
  showProcessusCreatifBtn();
  resetInactivityTimeoutForProcessusBtn();
});

// Redirection vers la page "Processus créatif"
processusCreatifBtn.addEventListener('click', () => {
  window.location.href = 'processus.html'; // Redirige vers la page processus
});
