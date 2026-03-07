---
id: electrocute_fx
title: Electrocute Fx
description: Manages visual and audio effects for electrocution events, including flash/flicker lighting, forked lightning propagation to nearby targets, and synchronization with target entity behavior.
tags: [combat, fx, network]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 60ef5fe1
system_scope: fx
---

# Electrocute Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`electrocute_fx` is a prefab used to render temporary visual and audio effects when a target is electrocuted. It handles animations, sound playback, screen flash effects (via the `colouradder` component), and the propagation of electricity to nearby valid targets (forking). The effect is attached as a child entity to the electrocuted target and is designed for use in both single-player and multiplayer (client-server) environments.

## Usage example
```lua
local fx = SpawnPrefab("electrocute_fx")
fx:SetFxTarget(target, 1.5, {
    attackdata = {
        attacker = player,
        damage = 20
    }
})
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`, `colouradder` (added dynamically on target), `updatelooper`
**Tags:** Adds `FX`, `NOCLICK` to the fx instance. Does not modify tags on target.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `Entity` or `nil` | `nil` | Reference to the entity being electrocuted. Set via `SetFxTarget`. |
| `duration` | number | `TUNING.ELECTROCUTE_DEFAULT_DURATION` | How long the main electrocution effect runs (seconds). |
| `size` | string | `"small"` | One of `"tiny"`, `"small"`, `"med"`, `"large"` — determines animation variant and sound. |
| `height` | number | `0` | Vertical offset used for animation positioning. |
| `flash` | number | `0` | Remaining duration of the colour flash (used for `colouradder`). |
| `blink` | number | `math.random(4)` | Blink phase counter (1–4) for flicker effect. |

## Main functions
### `SetFxTarget(target, duration, data)`
* **Description:** Attaches the effect to a target entity, starts animation and sound, initiates the flash effect, and triggers target forking if attack data is provided.
* **Parameters:**
  * `target` (`Entity`) — The entity to electrocute and attach to.
  * `duration` (`number`, optional) — Override the default electrocution duration.
  * `data` (`table`, optional) — Attack metadata; if present with `attackdata`, triggers fork logic.
* **Returns:** Nothing.

### `CancelFlash()`
* **Description:** Immediately ends the screen flash effect by clearing the `flash` timer and removing the `OnUpdate` callback.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartFork(inst, target, x, y, z, r, data)`
* **Description:** Schedules the forking process to spawn arc FX and propagate electrocution to nearby valid targets. Called internally by `SetFxTarget`.
* **Parameters:**
  * `inst` — The electrocute_fx instance.
  * `target` — Original target entity.
  * `x`, `y`, `z` — Position for fork origin.
  * `r` — Radius offset.
  * `data` — Attack data table.
* **Returns:** Nothing.

### `DoFork(inst, target, x, y, z, r, data)`
* **Description:** Performs the actual fork logic: scans nearby entities, filters via tags and conditionals (e.g., immunity, limbo, pvp rules), spawns `shock_arc_fx` between target and each valid forked target, and pushes the `"electrocute"` event.
* **Parameters:**
  * Same as `StartFork`.
* **Returns:** Nothing.

### `OnUpdate(inst, dt)`
* **Description:** Called each frame during the flash period to update `colouradder` with a flickering alpha value; terminates when flash expires.
* **Parameters:**
  * `inst` — The electrocute_fx instance.
  * `dt` — Delta time in seconds.
* **Returns:** Nothing.

### `OnAnimOver(inst)`
* **Description:** Handles the post-animation (`_pst`) after the main effect completes; removes the fx entity if animation is done or unconditionally plays `_pst` if target was unset.
* **Parameters:**
  * `inst` — The electrocute_fx instance.
* **Returns:** Nothing.

### `PlayPst(inst)`
* **Description:** Plays the post-animation (`_pst`) for the effect.
* **Parameters:**
  * `inst` — The electrocute_fx instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"animover"` — Triggers `OnAnimOver`.
- **Pushes:** `"electrocute"` — Pushed on each forked target via `v:PushEventImmediate("electrocute", data)`.

> **Note:** The function `StartElectrocuteForkOnTarget(target, data)` is exported as a global for backward compatibility, allowing legacy systems to manually trigger fork logic on a target. It calls `StartFork` internally.

