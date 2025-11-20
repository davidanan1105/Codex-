// Minimal clip data powered editor demo
// --------------------------------------------------
// This file wires together the library, timeline, inspector, and playback
// into a single-page experience that can add clips, edit them, scrub, and
// jump via markers without any build tooling.

const PIXELS_PER_SECOND = 60;

const state = {
  assets: [
    { id: 'asset-sunset', label: 'Sunset Park', duration: 3, type: 'video' },
    { id: 'asset-city', label: 'City Drone', duration: 3, type: 'video' },
    { id: 'asset-waves', label: 'Calm Waves', duration: 3, type: 'video' },
  ],
  clips: [],
  markers: [],
  selectedClipId: null,
  activeClipId: null,
};

const elements = {
  assetList: document.getElementById('assetList'),
  track: document.getElementById('track'),
  inspectorForm: document.getElementById('inspectorForm'),
  labelInput: document.getElementById('labelInput'),
  startInput: document.getElementById('startInput'),
  durationInput: document.getElementById('durationInput'),
  textInput: document.getElementById('textInput'),
  preview: document.getElementById('preview'),
  textOverlay: document.getElementById('textOverlay'),
  scrubber: document.getElementById('scrubber'),
  timeDisplay: document.getElementById('timeDisplay'),
  playPause: document.getElementById('playPause'),
  addMarker: document.getElementById('addMarker'),
  markerList: document.getElementById('markerList'),
  addVideoBtn: document.getElementById('addVideo'),
  addTextBtn: document.getElementById('addText'),
};

// ---------- Helpers ----------
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function formatSeconds(value) {
  return `${Number(value).toFixed(1)}s`;
}

function timelineEnd() {
  return state.clips.reduce((max, clip) => Math.max(max, clip.start + clip.duration), 0);
}

function findClipById(id) {
  return state.clips.find((clip) => clip.id === id);
}

function clipAtTime(time) {
  return state.clips.find((clip) => time >= clip.start && time < clip.start + clip.duration);
}

// ---------- Rendering ----------
function renderAssets() {
  elements.assetList.innerHTML = '';
  state.assets.forEach((asset) => {
    const card = document.createElement('button');
    card.className = 'asset-card';
    card.innerHTML = `<div class="badge">${asset.type}</div><div>${asset.label}</div>`;
    card.onclick = () => addClipFromAsset(asset);
    elements.assetList.appendChild(card);
  });
}

function renderTimeline() {
  elements.track.innerHTML = '';
  const sortedClips = [...state.clips].sort((a, b) => a.start - b.start);

  if (!sortedClips.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Add clips from the library to start your sequence.';
    elements.track.appendChild(empty);
    setScrubberMax(20);
    return;
  }

  let cursor = 0;
  sortedClips.forEach((clip) => {
    const spacerWidth = Math.max(0, clip.start - cursor);
    if (spacerWidth > 0) {
      const spacer = document.createElement('div');
      spacer.className = 'spacer';
      spacer.style.width = `${spacerWidth * PIXELS_PER_SECOND}px`;
      elements.track.appendChild(spacer);
    }

    const clipEl = document.createElement('div');
    clipEl.className = `clip ${clip.type === 'textOverlay' ? 'text' : ''}`;
    if (state.selectedClipId === clip.id) clipEl.classList.add('selected');
    if (state.activeClipId === clip.id) clipEl.classList.add('active');

    clipEl.style.width = `${clip.duration * PIXELS_PER_SECOND}px`;
    clipEl.innerHTML = `
      <div class="meta">
        <strong>${clip.label}</strong>
        <span>${formatSeconds(clip.duration)}</span>
      </div>
      <div class="meta">${clip.type === 'textOverlay' ? clip.text || 'Text overlay' : 'Video clip'}</div>
    `;
    clipEl.onclick = () => selectClip(clip.id, { jumpToStart: true });
    elements.track.appendChild(clipEl);

    cursor = Math.max(cursor, clip.start + clip.duration);
  });

  setScrubberMax(cursor);
}

function renderMarkers() {
  elements.markerList.innerHTML = '';

  if (!state.markers.length) {
    const empty = document.createElement('li');
    empty.className = 'muted';
    empty.textContent = 'No markers yet.';
    elements.markerList.appendChild(empty);
    return;
  }

  state.markers.forEach((marker) => {
    const li = document.createElement('li');
    li.className = 'marker-row';

    const jumpBtn = document.createElement('button');
    jumpBtn.type = 'button';
    jumpBtn.className = 'ghost';
    jumpBtn.textContent = formatSeconds(marker.time);
    jumpBtn.onclick = () => seekTo(marker.time);

    const label = document.createElement('input');
    label.type = 'text';
    label.value = marker.label;
    label.onchange = (event) => updateMarkerLabel(marker.id, event.target.value);

    li.appendChild(jumpBtn);
    li.appendChild(label);
    elements.markerList.appendChild(li);
  });
}

function updateInspectorFromClip(clip) {
  if (!clip) return;
  elements.labelInput.value = clip.label;
  elements.startInput.value = clip.start;
  elements.durationInput.value = clip.duration;
  elements.textInput.value = clip.text || '';
  elements.textInput.disabled = clip.type !== 'textOverlay';
  elements.textInput.placeholder = clip.type === 'textOverlay' ? 'Overlay text' : 'Text not applicable';
}

// ---------- Timeline + Inspector logic ----------
function addClipFromAsset(asset) {
  const start = timelineEnd();
  const clip = {
    id: generateId('clip'),
    label: asset.label,
    start,
    duration: asset.duration ?? 3,
    type: asset.type,
    text: asset.type === 'textOverlay' ? asset.text || 'New caption' : '',
  };

  state.clips.push(clip);
  selectClip(clip.id, { jumpToStart: false });
  renderTimeline();
}

function addTextOverlay() {
  const overlayAsset = {
    id: 'asset-text',
    label: 'Text Overlay',
    duration: 3,
    type: 'textOverlay',
    text: 'Overlay title',
  };
  addClipFromAsset(overlayAsset);
}

function selectClip(id, { jumpToStart } = { jumpToStart: true }) {
  const clip = findClipById(id);
  if (!clip) return;
  state.selectedClipId = clip.id;
  state.activeClipId = clip.id;
  updateInspectorFromClip(clip);
  if (jumpToStart) seekTo(clip.start);
  renderTimeline();
}

function updateClipFromInspector(event) {
  event.preventDefault();
  const clip = findClipById(state.selectedClipId);
  if (!clip) return;

  clip.label = elements.labelInput.value.trim() || clip.label;
  clip.start = Math.max(0, Number(elements.startInput.value) || 0);
  clip.duration = Math.max(0.1, Number(elements.durationInput.value) || clip.duration);
  if (clip.type === 'textOverlay') {
    clip.text = elements.textInput.value;
  }

  state.clips.sort((a, b) => a.start - b.start);
  renderTimeline();
  // Re-sync overlay in case text changed on an active clip
  syncTime(previewCurrentTime());
}

// ---------- Playback + time syncing ----------
function setScrubberMax(totalTimeline) {
  const videoDuration = elements.preview.duration || 0;
  const maxValue = Math.max(totalTimeline, videoDuration, 15);
  elements.scrubber.max = maxValue;
}

function previewCurrentTime() {
  return Number(elements.scrubber.value);
}

function syncTime(currentTime) {
  elements.scrubber.value = currentTime;
  elements.timeDisplay.textContent = formatSeconds(currentTime);
  setActiveClipForTime(currentTime);
  updateTextOverlay(currentTime);
}

function setActiveClipForTime(currentTime) {
  const active = clipAtTime(currentTime);
  const activeId = active ? active.id : null;
  if (activeId !== state.activeClipId) {
    state.activeClipId = activeId;
    renderTimeline();
  }
}

function updateTextOverlay(currentTime) {
  const activeTextClip = state.clips.find(
    (clip) => clip.type === 'textOverlay' && currentTime >= clip.start && currentTime < clip.start + clip.duration
  );
  elements.textOverlay.textContent = activeTextClip ? activeTextClip.text : '';
}

function togglePlay() {
  if (elements.preview.paused) {
    elements.preview.play();
    elements.playPause.textContent = 'Pause';
  } else {
    elements.preview.pause();
    elements.playPause.textContent = 'Play';
  }
}

function seekTo(time) {
  elements.preview.currentTime = time;
  syncTime(time);
}

// ---------- Markers ----------
function addMarkerAtCurrentTime() {
  const time = Number(elements.preview.currentTime.toFixed(1));
  const marker = {
    id: generateId('marker'),
    time,
    label: `Marker ${state.markers.length + 1}`,
  };
  state.markers.push(marker);
  renderMarkers();
}

function updateMarkerLabel(id, label) {
  const marker = state.markers.find((item) => item.id === id);
  if (!marker) return;
  marker.label = label.trim() || marker.label;
}

// ---------- Event wiring ----------
function bindEvents() {
  elements.playPause.addEventListener('click', togglePlay);
  elements.scrubber.addEventListener('input', (event) => {
    const time = Number(event.target.value);
    elements.preview.currentTime = time;
    syncTime(time);
  });

  elements.preview.addEventListener('timeupdate', () => {
    const time = elements.preview.currentTime;
    elements.scrubber.value = time;
    syncTime(time);
  });

  elements.preview.addEventListener('loadedmetadata', () => {
    setScrubberMax(timelineEnd());
  });

  elements.addMarker.addEventListener('click', addMarkerAtCurrentTime);
  elements.inspectorForm.addEventListener('submit', updateClipFromInspector);
  elements.addVideoBtn.addEventListener('click', () => addClipFromAsset({
    id: 'asset-broll',
    label: 'B-Roll',
    duration: 3,
    type: 'video',
  }));
  elements.addTextBtn.addEventListener('click', addTextOverlay);
}

// ---------- Init ----------
function init() {
  renderAssets();
  renderTimeline();
  renderMarkers();
  bindEvents();
  syncTime(0);
}

init();
