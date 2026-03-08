---
id: video
title: Video
description: Renders a video widget on an entity by interfacing with the VideoWidget component and its underlying video playback system.
tags: [ui, video, rendering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a58ae37c
system_scope: ui
---

# Video

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Video` is a UI widget that wraps the `VideoWidget` component to enable video playback in the game's UI system. It extends `Widget` and integrates with the entity's `VideoWidget` to manage rendering, playback control, sizing, positioning, and visual effects like tinting. It is typically used for cinematics, menus, or in-world video overlays.

## Usage example
```lua
local video = CreateWidget("Video")
video:Load("videos/intro_video")
video:SetSize(512, 288)
video:SetVRegPoint("CENTRE")
video:SetHRegPoint("CENTRE")
video:Play()
```

## Dependencies & tags
**Components used:** `VideoWidget`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | `"Video"` | Widget name inherited from `Widget`. |
| `tint` | table (optional) | `nil` | Stores the last-set RGBA tint values (`{r, g, b, a}`). |

## Main functions
### `SetSize(w, h)`
* **Description:** Sets the width and height of the video widget. Accepts either two numeric arguments or a table with two elements (`{w, h}`).
* **Parameters:** `w` (number or table) — width, or table of `{width, height}`; `h` (number) — height, ignored if `w` is a table.
* **Returns:** Nothing.

### `GetSize()`
* **Description:** Retrieves the current width and height of the video widget.
* **Parameters:** None.
* **Returns:** `w` (number), `h` (number) — current width and height.

### `ScaleToSize(w, h)`
* **Description:** Scales the widget so that it fits exactly within the given dimensions, preserving aspect ratio.
* **Parameters:** `w` (number) — target width; `h` (number) — target height.
* **Returns:** Nothing.

### `SetTint(r, g, b, a)`
* **Description:** Applies a color tint to the video using red, green, blue, and alpha components. Updates internal `self.tint` cache.
* **Parameters:** `r` (number, 0–1), `g` (number, 0–1), `b` (number, 0–1), `a` (number, 0–1) — RGBA values.
* **Returns:** Nothing.

### `SetVRegPoint(anchor)`
* **Description:** Sets the vertical registration point (vertical anchor) for alignment/positioning.
* **Parameters:** `anchor` (string) — anchor name (e.g., `"TOP"`, `"CENTRE"`, `"BOTTOM"`).
* **Returns:** Nothing.

### `SetHRegPoint(anchor)`
* **Description:** Sets the horizontal registration point (horizontal anchor) for alignment/positioning.
* **Parameters:** `anchor` (string) — anchor name (e.g., `"LEFT"`, `"CENTRE"`, `"RIGHT"`).
* **Returns:** Nothing.

### `Load(filename)`
* **Description:** Loads a video file from the specified path.
* **Parameters:** `filename` (string) — relative path to the video resource.
* **Returns:** Result of `VideoWidget:Load(filename)` (typically boolean or engine-specific status).

### `Play()`
* **Description:** Starts or resumes video playback.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsDone()`
* **Description:** Checks whether video playback has completed.
* **Parameters:** None.
* **Returns:** `true` if playback is finished, `false` otherwise.

### `Pause()`
* **Description:** Pauses video playback at the current frame.
* **Parameters:** None.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Stops video playback entirely and resets to the first frame.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
