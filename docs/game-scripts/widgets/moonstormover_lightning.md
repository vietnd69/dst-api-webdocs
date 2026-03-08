---
id: moonstormover_lightning
title: Moonstormover Lightning
description: Displays animated lightning effects during Moonstorms, triggered periodically based on a countdown timer.
tags: [ui, fx, storm]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 31feb443
system_scope: ui
---

# Moonstormover Lightning

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MoonstormOver_Lightning` is a UI widget responsible for rendering lightning visual and audio effects during Moonstorms. It is instantiated with an owner entity (typically the HUD or a screen controller) and listens for `stormlevel` events to activate/deactivate. When active, it schedules random lightning strikes via a countdown timer, playing randomized animations and sound effects with positional offset.

## Usage example
```lua
-- Typically used internally by the Moonstorm HUD system.
-- Example instantiation (not usually called directly by modders):
local lightning = MoonstormOver_Lightning(owner, dustlayer)
-- The component automatically listens for "stormlevel" events on `owner`
-- and activates/deactivates based on storm intensity.
```

## Dependencies & tags
**Components used:** None (uses `UIAnim`, `Widget`, and global systems `TheNet`, `TheFocalPoint.SoundEmitter`)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity?` | `nil` | The entity that owns this widget (used for listening to `stormlevel` events). |
| `lightning` | `UIAnim` | — | The child UIAnim widget that renders the lightning animation. |
| `active` | boolean | `false` | Whether the lightning effect is currently scheduled to fire. |
| `next_time` | number | `math.random()*20` | Seconds remaining until the next lightning strike (client-side timer). |
| `minscale` | number | `0.9` | Minimum supported scale (hardcoded for art constraints). |
| `maxscale` | number | `1.20625` | Maximum scale (derived from camera range `[15, 50]`, default 30). |

## Main functions
### `Activate(level)`
*   **Description:** Activates or deactivates the lightning effect based on storm intensity. If `level > 0` and currently inactive, starts the update loop. If `level <= 0` and active, stops the update loop.
*   **Parameters:** `level` (number) — Current Moonstorm intensity level. Positive values activate the effect.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Handles the periodic countdown and rendering of lightning strikes. Runs every frame while active. Decrements `next_time` each frame; when it reaches `0`, plays a randomized animation, emits sound, and schedules the next strike.
*   **Parameters:** `dt` (number) — Delta time in seconds since the last frame.
*   **Returns:** Nothing.
*   **Error states:** Exits early if `TheNet:IsServerPaused()` returns `true`.

## Events & listeners
- **Listens to:** `stormlevel` (on `owner`) — triggers `Activate(level)` when storm level changes.
- **Pushes:** None.