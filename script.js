const popup = document.getElementById('popup');
const pinName = document.getElementById('pinName');
const pinImage = document.getElementById('pinImage');

let images = [];
let currentIndex = 0;

function attachPopupEvents(pin) {
  pin.addEventListener('click', (event) => {
    event.stopPropagation();
    const pinRect = pin.getBoundingClientRect();
    popup.style.left = pinRect.left + 'px';
    popup.style.top = pinRect.top + 'px';
    popup.style.display = 'flex';

    pinName.textContent = pin.dataset.name;
    images = pin.dataset.images.split(',');
    currentIndex = 0;
    pinImage.src = images[currentIndex];
  });
}

function nextImage() {
  if (images.length > 0) {
    currentIndex = (currentIndex + 1) % images.length;
    pinImage.src = images[currentIndex];
  }
}

function prevImage() {
  if (images.length > 0) {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    pinImage.src = images[currentIndex];
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.map-pin').forEach(pin => {
    attachPopupEvents(pin);
  });
});

document.addEventListener('click', () => {
  popup.style.display = 'none';
});

popup.addEventListener('click', (e) => {
  e.stopPropagation();
});

function highlightPin(type) {
  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.classList.remove('highlighted');
  });
  const pin = Array.from(document.querySelectorAll('.map-pin'))
    .find(p => p.dataset.name?.toLowerCase().includes(type.toLowerCase()));
  if (pin) {
    pin.classList.add('highlighted');
    setTimeout(() => pin.classList.remove('highlighted'), 2000);
  } else {
    alert(type + ' is not placed on the map.');
  }
}

const mapInner = document.getElementById('mapInner');
let scale = 0.5;
let pos = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };

function updateTransform() {
  mapInner.style.transform = `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
}

document.querySelector('.map-viewport').addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomAmount = 0.1;
  const direction = e.deltaY > 0 ? -1 : 1;
  scale = Math.min(Math.max(scale + direction * zoomAmount, 0.1), 3);
  updateTransform();
});

mapInner.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStart.x = e.clientX - pos.x;
  dragStart.y = e.clientY - pos.y;
  mapInner.classList.add('grabbing');
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  mapInner.classList.remove('grabbing');
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    pos.x = e.clientX - dragStart.x;
    pos.y = e.clientY - dragStart.y;
    updateTransform();
  }
});
let lastDistance = 0;

document.querySelector('.map-viewport').addEventListener('touchmove', (e) => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (lastDistance !== 0) {
      const delta = distance - lastDistance;
      const zoomAmount = delta * 0.005; // adjust speed here
      scale = Math.min(Math.max(scale + zoomAmount, 0.2), 3);
      updateTransform();
    }
    lastDistance = distance;
  }
}, { passive: false });

document.querySelector('.map-viewport').addEventListener('touchend', () => {
  lastDistance = 0;
});
let touchStart = { x: 0, y: 0 };

document.querySelector('.map-viewport').addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    isDragging = true;
    dragStart.x = touch.clientX - pos.x;
    dragStart.y = touch.clientY - pos.y;
    mapInner.classList.add('grabbing');
  }
}, { passive: false });

document.querySelector('.map-viewport').addEventListener('touchmove', (e) => {
  if (e.touches.length === 1 && isDragging) {
    e.preventDefault();
    const touch = e.touches[0];
    pos.x = touch.clientX - dragStart.x;
    pos.y = touch.clientY - dragStart.y;
    updateTransform();
  }
}, { passive: false });

document.querySelector('.map-viewport').addEventListener('touchend', (e) => {
  if (e.touches.length === 0) {
    isDragging = false;
    mapInner.classList.remove('grabbing');
  }
});
function checkOrientation() {
  const warning = document.getElementById('orientationWarning');
  if (window.innerWidth < window.innerHeight) {
    warning.style.display = 'flex';
  } else {
    warning.style.display = 'none';
  }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// Run on page load
checkOrientation();
function startWalking() {
  const walker = document.getElementById('walker');
  
  let currentTop = 200;
  let currentLeft = 600;

  const maxTop = 1500;
  const maxLeft = 1500;

  const speedTop = 2.2;  // pixels pababa
  const speedLeft = 5.0; // pixels pakakanan

  function move() {
    if (currentTop < maxTop && currentLeft < maxLeft) {
      currentTop += speedTop;
      currentLeft += speedLeft;
    } else {
      // Reset to starting position
      currentTop = 200;
      currentLeft = 600;
    }

    walker.style.top = currentTop + 'px';
    walker.style.left = currentLeft + 'px';

    requestAnimationFrame(move);
  }

  move();
}

startWalking();




