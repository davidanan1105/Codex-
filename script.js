const assets = [
  {
    id: 'clip-1',
    label: 'Sunset Park',
    duration: 5,
    type: 'video',
  },
  {
    id: 'clip-2',
    label: 'City Drone',
    duration: 6,
    type: 'video',
  },
  {
    id: 'clip-3',
    label: 'Calm Waves',
    duration: 4,
    type: 'video',
  },
];

const timeline = [];
let selectedId = null;
let markers = [];

const assetList = document.getElementById('assetList');
const track = document.getElementById('track');
const inspectorForm = document.getElementById('inspectorForm');
const labelInput = document.getElementById('labelInput');
const startInput = document.getElementById('startInput');
const durationInput = document.getElementById('durationInput');
const textInput = document.getElementById('textInput');
const preview = document.getElementById('preview');
const textOverlay = document.getElementById('textOverlay');
const scrubber = document.getElementById('scrubber');
const timeDisplay = document.getElementById('timeDisplay');
const playPause = document.getElementById('playPause');
const addMarker = document.getElementById('addMarker');
const markerList = document.getElementById('markerList');

function renderAssets() {
  assetList.innerHTML = '';
  assets.forEach((asset) => {
    const card = document.createElement('button');
    card.className = 'asset-card';
    card.innerHTML = `<div class="badge">${asset.type}</div><div>${asset.label}</div>`;
    card.onclick = () => addClip(asset);
    assetList.appendChild(card);
  });
}

function addClip(asset) {
  const start = timeline.reduce((acc, item) => acc + item.duration, 0);
  const clip = {
    id: `${asset.id}-${Date.now()}`,
    label: asset.label,
    duration: asset.duration,
    start,
    type: asset.type,
    text: asset.type === 'text' ? 'Your overlay' : '',
  };
  timeline.push(clip);
  selectClip(clip.id);
  renderTimeline();
}

function addTextOverlay() {
  const start = timeline.reduce((acc, item) => acc + item.duration, 0);
  const clip = {
    id: `text-${Date.now()}`,
    label: 'Title',
    duration: 3,
    start,
    type: 'text',
    text: 'New caption',
  };
  timeline.push(clip);
  selectClip(clip.id);
  renderTimeline();
}

function renderTimeline() {
  track.innerHTML = '';
  if (!timeline.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Drop clips here to start building your edit.';
    track.appendChild(empty);
  }

  timeline.forEach((clip) => {
    const el = document.createElement('div');
    el.className = `clip ${clip.type === 'text' ? 'text' : ''} ${
      clip.id === selectedId ? 'selected' : ''
    }`;
    el.style.flexBasis = `${clip.duration * 30}px`;
    el.innerHTML = `
      <div class="meta">
        <strong>${clip.label}</strong>
        <span>${clip.duration.toFixed(1)}s</span>
      </div>
      <div class="meta">${clip.type === 'text' ? clip.text : 'Video'}</div>
    `;
    el.onclick = () => selectClip(clip.id);
    track.appendChild(el);
  });

  const totalDuration = timeline.reduce((acc, clip) => acc + clip.duration, 0) || 20;
  scrubber.max = totalDuration;
}

function selectClip(id) {
  selectedId = id;
  const clip = timeline.find((item) => item.id === id);
  if (!clip) return;
  labelInput.value = clip.label;
  startInput.value = clip.start;
  durationInput.value = clip.duration;
  textInput.value = clip.text || '';
  renderTimeline();
}

function updateClip(event) {
  event.preventDefault();
  const clip = timeline.find((item) => item.id === selectedId);
  if (!clip) return;
  clip.label = labelInput.value || clip.label;
  clip.start = Math.max(0, parseFloat(startInput.value) || 0);
  clip.duration = Math.max(0.5, parseFloat(durationInput.value) || clip.duration);
  clip.text = textInput.value;
  renderTimeline();
}

function syncPreview() {
  const current = parseFloat(scrubber.value);
  timeDisplay.textContent = `${current.toFixed(1)}s`;
  const activeText = timeline.find(
    (clip) => clip.type === 'text' && current >= clip.start && current <= clip.start + clip.duration
  );
  textOverlay.textContent = activeText ? activeText.text : '';
}

function togglePlay() {
  if (preview.paused) {
    preview.play();
    playPause.textContent = 'Pause';
  } else {
    preview.pause();
    playPause.textContent = 'Play';
  }
}

function addTimelineMarker() {
  const time = parseFloat(scrubber.value).toFixed(1);
  markers.push(time);
  renderMarkers();
}

function renderMarkers() {
  markerList.innerHTML = '';
  markers.forEach((time) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${time}s</span><span class="badge">Marker</span>`;
    markerList.appendChild(li);
  });
}

preview.addEventListener('timeupdate', () => {
  scrubber.value = preview.currentTime;
  syncPreview();
});

preview.addEventListener('loadedmetadata', () => {
  scrubber.max = preview.duration || 20;
});

scrubber.addEventListener('input', () => {
  preview.currentTime = scrubber.value;
  syncPreview();
});

playPause.addEventListener('click', togglePlay);
addMarker.addEventListener('click', addTimelineMarker);
inspectorForm.addEventListener('submit', updateClip);

// Quick add buttons
const addVideoBtn = document.getElementById('addVideo');
const addTextBtn = document.getElementById('addText');
addVideoBtn.addEventListener('click', () => addClip(assets[0]));
addTextBtn.addEventListener('click', addTextOverlay);

renderAssets();
renderTimeline();
renderMarkers();
