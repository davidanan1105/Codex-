# CapCut-Style Video Editor Design

## Product Goal
Deliver a fast, friendly, cross-platform video editor that lowers the barrier to polished short-form content while still supporting pro-grade workflows.

## Target Users
- **Creators & social teams:** quick edits, templates, trending effects.
- **Vloggers & educators:** narration, subtitles, multi-track assembly.
- **Prosumers:** color, audio mixing, keyframes, precise trimming.

## Core Principles
1. **Speed to publish:** frictionless import, presets for export, background rendering.
2. **Clarity:** clean hierarchy, consistent iconography, contextual helpers.
3. **Confidence:** granular undo/redo, autosave, version history.
4. **Delight:** smooth animations, responsive scrubbing, live previews.

## Information Architecture
- **Top bar:** project name, cloud sync status, undo/redo, export, account.
- **Left rail:** media bin, stock assets, text, stickers, transitions, effects.
- **Center canvas:** viewer with overlays (safe guides, snapping hints) and mode toggles (fit/fill, background blur).
- **Bottom timeline:** stacked tracks (video, overlay, audio, captions, FX) with collapsible height and ripple trim.
- **Right inspector:** contextual properties for selected clip (transform, speed, audio, color, effects, captions).

## Key Flows
### Project creation
- New project wizard (canvas size, fps, background), template gallery, or recent projects.
- Cloud projects auto-sync; offline edits queued.

### Import & organization
- Drag-and-drop from desktop, device camera roll, cloud drives.
- Smart folders (Favorites, Used, Unused), search by label/people/object (ML tags), bulk relink.

### Editing & timeline
- Ripple/roll/slip/slide trims with visual diff for in/out frames.
- Snapping to markers, beats, captions, and clip edges.
- Magnetic timeline option; gap removal; selective ripple per track.
- Multi-select with lasso/shift-click; grouping; nested sequences.
- Speed ramp editor with bezier handles; reverse; time remapping presets.
- Keyframes for transform/opacity/effects; on-canvas controls for scale/position/rotation.
- Track locks, mutes, solos; role colors (dialogue, SFX, music, B-roll).
- Markers with comments/mentions; review mode to approve changes.

### Audio
- Waveform scrubbing; beat detection; auto-ducking against dialogue.
- Voice isolation, noise reduction, loudness normalization.
- Parametric EQ presets; reverb/echo library; pitch shift with formant control.
- Transcript-based editing: delete text to cut media; search & replace words.

### Text & captions
- Auto-captions with multilingual support; style presets; animated text behaviors.
- Subtitle editor with spellcheck, timing nudge, and translation track.
- Kinetic typography templates; 3D text; stroke/shadow/gradient controls.

### Effects & compositing
- Blend modes, LUTs, curves, HSL; selective color mask; vignette; glow.
- Green/blue screen keying; rotoscope/matting with feather; background blur.
- Motion tracking for stickers/text/effects; planar tracker for screen replacements.
- Transition library with favorites; adjustable easing; preview-on-hover.

### Assets & templates
- Stock media hub (music, stickers, overlays, Lottie animations, SFX) with licensing filter.
- Template browser with category filters (social/ads/education), A/B performance notes, replaceable drop zones.
- Presets for export (TikTok, Reels, Shorts, 16:9 YouTube) and custom profile save.

### Collaboration & review
- Shared projects with roles (editor, reviewer, viewer); per-timeline-clip comments.
- Live cursors when co-editing; edit locks on active clips; change history with diff.
- Review links with timecoded comments; approval status per revision.

### Delivery
- Export queue with background rendering; cloud export; upload to social accounts.
- Deliverables: video, audio-only, GIF, image sequence, EDL/AAF/AAF XML.
- Quality controls: bitrate modes (target/constant), VBR/CBR, hardware acceleration, color management (Rec.709/2020, HDR10/HLG), audio stem exports.

## Interactions & Microcopy
- Hover states show shortcuts; tooltips with GIF demos for advanced tools.
- Scrub jog via scroll/shift-scroll; JKL playback; K = pause, double-tap = play head to marker.
- Smooth zoom/pan on timeline with two-finger/scroll + modifier; snap zoom to clip.
- Status toasts for background tasks (rendering, uploads, sync).

## Visual System
- **Palette:** dark UI (#0f1115) with accent highlights (#00e0b8) and neutrals for hierarchy.
- **Typography:** clean sans (Inter/Roboto); small caps for rail labels; monospace for timecode.
- **Iconography:** thin-stroke, filled on active; consistent grid.
- **Depth:** layer blur/shadows for floating panels; subtle glass for inspector.
- **Feedback:** elastic easing on drag; micro haptics (mobile); glow on active playhead.

## Accessibility
- WCAG AA contrast; scalable UI density; caption + transcript for all audio.
- Keyboard coverage for all actions; shortcut remapper; screen-reader labels and focus order.
- Color-blind-safe indicators (shape + color); vibration alternatives.

## Performance & Reliability
- Incremental rendering; proxy/resolution switching; smart cache invalidation.
- GPU-accelerated effects; background prefetch of next clips; low-latency audio playback.
- Crash recovery with snapshots; autosave interval; conflict resolution on sync.

## Settings & Customization
- Layout presets (Beginner, Creator, Pro); detachable panels; dual-monitor mode.
- Custom workspaces per task (Captions, Color, Audio Mix, Effects).
- Preference sync across devices; project templates with default tracks/effects.

## Growth & Monetization
- Free core with watermark-free exports up to a threshold; premium for advanced FX, collaboration, and cloud storage.
- Discovery tab with trending templates/effects; learn tab with short lessons; spotlight for community remixes.

## Success Metrics
- Time-to-first-export; export success rate; retention by cohort; template adoption; co-edit session frequency; NPS and CSAT after review cycles.

## Launch Readiness Checklist
- Onboarding tutorial + sample project.
- Stabilize key flows: import, trim, captions, export.
- Offline support and sync conflict handling.
- Analytics and privacy controls.
- Support surface: crash reports, feedback widget, help center links.
