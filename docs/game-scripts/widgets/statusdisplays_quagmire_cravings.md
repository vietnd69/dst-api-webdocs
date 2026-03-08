---
id: statusdisplays_quagmire_cravings
title: Statusdisplays Quagmire Cravings
description: Renders and animates the Quagmire hangriness status UI including bars, mouth animations, and screen shake/sound feedback.
tags: [ui, quagmire, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 08b510b0
system_scope: ui
---

# Statusdisplays Quagmire Cravings

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CravingsStatus` is a UI widget that visually represents the Quagmire hangriness mechanic — a boss status bar used during encounters with the Quagmire Guardian. It displays the current hangriness level via animated bars, mouth visuals, and lighting effects, and responds to gameplay events (e.g., matching, rumbling) by playing animations, triggering screen shake, and playing sound effects. It depends entirely on the server-side `quagmire_hangriness` component for state via the replicated `TheWorld.net` object.

## Usage example
```lua
-- Typically added automatically to the HUD system; not manually instantiated.
-- Example internal usage within the game:
local cravings_widget = CravingsStatus(player)
CravingsStatus.SetLevel(cravings_widget, 3) -- visually update to level 3
```

## Dependencies & tags
**Components used:** `quagmire_hangriness` (via `TheWorld.net.components.quagmire_hangriness`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity (usually the player) whose HUD owns this widget. |
| `bar`, `bar2`, `frame`, `fx`, `mouth` | UIAnim | `nil` | UI animation components for visual elements (progress bars, level FX, mouth). |
| `level` | number | `1` | Current hangriness level (`1`–`3`). |
| `nextlevel` | number or `nil` | `nil` | Pending level change request pending animation completion. |
| `mouthlevel` | number | `1` | Current mouth animation level (derived as `max(1, level - 1)`). |
| `nextmouthlevel` | number or `nil` | `nil` | Pending mouth animation level change. |
| `nextmouthanim` | table or `nil` | `nil` | Queue of mouth animations to play (e.g., `{"eat", "happy"}`). |
| `meter` | number | `0` | Smoothed meter value (0–1), clamped from hangriness percentage. |
| `blink` | number | `0` | Blink transition state (positive = brightening, negative = dimming, 0 = stable). |

## Main functions
### `SetMeter(percent)`
* **Description:** Updates the meter's visual progress using `percent` (0–1). Internally smoothed via weighted average in `OnUpdate`.
* **Parameters:** `percent` (number) – normalized hangriness meter value (1 – `GetPercent()`).
* **Returns:** Nothing.

### `SetLevel(level)`
* **Description:** Initiates a visual level change (0–3). Plays transition animations (`_pre`/`_pst`) and triggers screen shake for level increases.
* **Parameters:** `level` (number) – target hangriness level (1–3).
* **Returns:** Nothing.
* **Error states:** If `level == self.level` and no transition is playing, clears `nextlevel`. Skips flicker by avoiding animation override if currently in a non-transition animation.

### `SetMouth(mouthlevel)`
* **Description:** Requests a change to the mouth animation level (based on hangriness level).
* **Parameters:** `mouthlevel` (number) – target mouth level (derived as `max(1, level - 1)`).
* **Returns:** Nothing.

### `Blink(val)`
* **Description:** Initiates a blink fade transition (bright or dark) for the FX/bars by adjusting `blink` and calling `UpdateBlinkLight`/`UpdateBlinkDark`.
* **Parameters:** `val` (number) – direction/magnitude of blink: `>0` brightens, `<0` dims, `0` stabilizes.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called each frame to update animations, blink fade, meter smoothing, and sync UI to `quagmire_hangriness` state. Skipped when server is paused.
* **Parameters:** `dt` (number) – delta time in seconds.
* **Returns:** Nothing.
* **Error states:** Returns early if `TheNet:IsServerPaused()` is `true`.

### `ShakeScreen(level)`
* **Description:** Triggers a camera shake with intensity scaled by `level`.
* **Parameters:** `level` (number) – hangriness level at time of event (`1`, `2`, or `3`).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` on `self.fx.inst` – triggers level change animations (`_pre`, `_pst`) when current FX animation completes.  
  - `animover` on `self.mouth.inst` – queues and plays next mouth animation (`eat`, `happy`, `angry`, etc.) or transitions idle states.  
  - `quagmirehangrinessrumbled` on `TheWorld` – triggers `snarl` or `spin` mouth animation on rumble events.  
  - `quagmirehangrinessmatched` on `TheWorld` – triggers `eat`, sound, blink, and shake events on a match.  
- **Pushes:** None identified.