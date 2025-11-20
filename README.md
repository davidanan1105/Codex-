# Codex-

This repository now includes a runnable CapCut-style web demo alongside the design blueprint.

## What's here
- `capcut_design.md`: Product and UX blueprint for a CapCut-style editor.
- `index.html`, `style.css`, `script.js`: A static front-end prototype with timeline, preview, text overlays, and markers.

## How to run
The demo is a static page. From the repo root, start a simple server and open the URL in your browser:

```bash
python -m http.server 8000
```

Then navigate to [http://localhost:8000](http://localhost:8000) to interact with the editor UI. Use the **Add B-Roll Clip** and
**Add Text Overlay** buttons to populate the timeline and adjust properties in the Inspector.

## 目前 Demo 已实现的功能

- 可用功能：
  - Library/Quick adds 会追加带 start/duration 的 clip，并在时间线中渲染。
  - 点击时间线 clip 会跳到对应播放时间、自动填充 Inspector，并高亮当前播放位置所属的 clip。
  - Inspector 中的 label/start/duration/text 可编辑（对文本覆盖启用），Update 后立即更新 UI。
  - Text Overlay clip 在播放时会显示到预览上方，并与时间线同步高亮。
  - Add Marker 会在当前时间创建标记，列表中可编辑 label，点击可跳转到对应时间。

- 暂未实现/占位：
  - Import/Export 按钮仅为示意，未接入真实文件管线。
  - 仅支持单轨简单时间线；高级特效、转场、波形等仍为后续扩展空间。
