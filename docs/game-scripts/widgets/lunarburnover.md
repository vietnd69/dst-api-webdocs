---
id: lunarburnover
title: Lunarburnover
description: Renders and manages the visual and audio effects for the lunar burn debuff on the owner entity, including layered intensity levels and supernova events.
tags: [ui, fx, audio, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: e9156673
system_scope: fx
---

# Lunarburnover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Lunarburnover` is a UI widget component that visually and audibly represents the lunar burn debuff applied to an entity (typically the player or boss). It manages animation layers (`lvl0`, `lvl1`, `lvl2`, `supernova_hit`, `supernova_miss`) based on the current lunar burn flags and controls ambient and event-driven sound effects (e.g., `lunarburn_hit`, `lunarburn_supernova`) via the global sound mixer. It reacts to `startlunarburn` and `stoplunarburn` events and persists state via event listeners on removal.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("health")
inst:AddComponent("lunarburnover")
-- Trigger lunar burn via the event system:
inst:PushEvent("startlunarburn", WagBossUtil.LunarBurnFlags.GENERIC | WagBossUtil.LunarBurnFlags.NEAR_SUPERNOVA)
-- Turn off later:
inst:PushEvent("stoplunarburn")
```

## Dependencies & tags
**Components used:** `health` (via `owner.replica.health:GetLunarBurnFlags()`), `soundemitter` (via `TheFocalPoint.SoundEmitter`), `mixer` (via `TheMixer`), `focalpoint` (via `TheFocalPoint`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Inst` | — | The entity that owns this widget and experiences the lunar burn. |
| `alpha` | number | `0` | Current opacity of the animation overlay. |
| `targetalpha` | number | `0` | Target opacity for smooth fade transitions. |
| `flags` | number | `LunarBurnFlags.ALL` | Bitmask of active lunar burn flags. |
| `supernovamix` | boolean | `false` | Whether the supernova mixer mix is currently active. |
| `supernovasoundlevel` | number | `0` | Current supernova intensity: `0` = off, `1` = blocked (miss), `2` = hit. |
| `supernovaparam` | number? | `nil` | Current mixer parameter value for supernova (0.05 or 0.35). |
| `supernovatargetparam` | number? | `nil` | Target mixer parameter value for smooth parameter transition. |

## Main functions
### `TurnOn(flags)`
* **Description:** Activates the lunar burn visual and audio effects based on the provided flags. Updates animation layers and starts sound loops depending on whether `GENERIC`, `NEAR_SUPERNOVA`, or `SUPERNOVA` flags are present.
* **Parameters:** `flags` (number) — bitmask of `WagBossUtil.LunarBurnFlags` constants.
* **Returns:** Nothing.
* **Error states:** No explicit error states; silently avoids redundant updates.

### `TurnOff()`
* **Description:** Deactivates the lunar burn effects. Stops `lunarburn_hit` sound, plays a fade-out sound, kills supernova sound if active, and begins fading out the overlay.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetSupernovaSoundLevel(level)`
* **Description:** Configures the supernova sound intensity and associated mixer parameter (`blocked`). Levels `0`, `1`, and `2` correspond to off, blocked (miss), and hit states respectively. Triggers a parameter transition on change.
* **Parameters:** `level` (number) — must be `0`, `1`, or `2`.
* **Returns:** Nothing.

### `SetSupernovaMix(enable)`
* **Description:** Controls the supernova mixer mix state by pushing or popping the `"supernova"` mix via `TheMixer`.
* **Parameters:** `enable` (boolean) — `true` to push, `false` to pop.
* **Returns:** Nothing.

### `CheckStopUpdating()`
* **Description:** Stops the update loop if both alpha and supernova parameter have reached their targets.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Interpolates `alpha` and `supernovaparam` toward their targets over time (`dt`), updating the animation color and sound mixer parameter each frame until stable.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `startlunarburn` — triggers `TurnOn(flags)` with new flags.  
  - `stoplunarburn` — triggers `TurnOff()`.  
  - `onremove` — cleans up supernova sounds and mixer state.
- **Pushes:** None.