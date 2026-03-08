---
id: fireover
title: Fireover
description: Manages the visual and audio overlay effect for fire damage on the player character, including alpha transitions and sound feedback.
tags: [fx, player, visual, ui, audio]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 7499cf38
system_scope: fx
---

# Fireover

> Based on game build **7140014** | Last updated: 2026-03-08

## Overview
`FireOver` is a UI widget component that displays and animates a fire overlay on the player when they take fire damage. It handles alpha fading via cubic easing, dynamic brightness modulation (for low vs. normal fire intensity), and plays context-sensitive sound effects via `TheFocalPoint.SoundEmitter`. It listens to player-specific events (`startfiredamage`, `stopfiredamage`, `changefiredamage`, `onremove`) to control its visibility and state.

## Usage example
```lua
-- Typically added automatically to the player's UI by the game.
-- Manual instantiation is not expected in standard mod use.
local owner = ThePlayer
local fireover = FireOver(owner)
fireover:TurnOn(true)  -- low fire intensity
fireover:TurnOff()     -- end fire effect
```

## Dependencies & tags
**Components used:** None (`FireOver` is a UI widget, not a core component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | — | The player entity that owns this fire effect. |
| `anim` | `UIAnim` | `nil` | The animation widget showing the fire graphic. |
| `targetalpha` | number | `0` | The target alpha value for fading (0 = hidden, 1 = fully visible). |
| `startalpha` | number | `0` | Starting alpha value for the current easing transition. |
| `alpha` | number | `0` | Current alpha value used for rendering. |
| `alphamult` | number | `1` | Multiplier for alpha, adjusted during transitions between low/normal fire intensity. |
| `alphamultdir` | number | `0` | Direction of `alphamult` change: `1` (increasing), `-1` (decreasing), `0` (steady). |
| `ease_time` | number | `0.4` | Duration in seconds for alpha easing transitions. |
| `t` | number | `0` | Accumulated time elapsed since the current transition started. |

## Main functions
### `TurnOn(low)`
*   **Description:** Activates the fire overlay with full or reduced brightness depending on `low`. Plays sound effects and initiates an easing-based fade-in.
*   **Parameters:** `low` (boolean or `nil`) – if truthy, sets `alphamult` to `ALPHAMULT_LOW` (0.25) and adjusts sounds accordingly.
*   **Returns:** Nothing.

### `TurnOff()`
*   **Description:** Starts the fade-out sequence (easing from full alpha to 0), stops the `burning` sound, and schedules UI hiding when alpha reaches 0.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnChangeLevel(low)`
*   **Description:** Modulates `alphamult` in response to a fire intensity change while the effect is active. Adjusts brightness toward low or full intensity, and plays a brief transition sound.
*   **Parameters:** `low` (boolean or `nil`) – if truthy, fades toward low brightness; otherwise, fades toward full brightness.
*   **Returns:** Nothing.
*   **Error states:** No-op if no `burning` sound is currently playing.

### `OnUpdate(dt)`
*   **Description:** Called per-frame (when not paused) to update alpha via cubic easing, adjust `alphamult`, and update the rendered color's alpha channel.
*   **Parameters:** `dt` (number) – delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Early return if the game is paused (`TheNet:IsServerPaused()`). Hides and stops updating when `alpha <= 0`.

## Events & listeners
- **Listens to:**
  - `startfiredamage` – triggers `TurnOn`, passes optional `data.low` flag.
  - `stopfiredamage` – triggers `TurnOff`.
  - `changefiredamage` – triggers `OnChangeLevel`, passes optional `data.low` flag.
  - `onremove` – triggers `TurnOff` to clean up when the widget is removed.
- **Pushes:** None.