---
id: deerclops_mutated_fx
title: Deerclops Mutated Fx
description: Creates and manages client-side visual and audio effects for Deerclops' mutated ice abilities (ping, impact, aura, and spikefire).
tags: [fx, boss, ice, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 01b5fffd
system_scope: fx
---

# Deerclops Mutated Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`deerclops_mutated_fx.lua` defines four reusable client-side prefabs that render visual and sound effects for Deerclops' mutated ice attacks: `deerclops_icelance_ping_fx`, `deerclops_impact_circle_fx`, `deerclops_aura_circle_fx`, and `deerclops_spikefire_fx`. These prefabs are not persistent and are only spawned on the client (never on dedicated servers), using transform, animation, and sound components for localized feedback. The prefabs interact with game systems primarily via external component calls (`burnable`, `freezable`, `temperature`, `grogginess`) during active phases of the ice circle effects.

## Usage example
```lua
-- Spawn a ping effect at world position (x, y, z)
local fx = SpawnPrefab("deerclops_icelance_ping_fx")
if fx ~= nil then
	fx.Transform:SetPosition(x, y, z)
	fx:Spawn()
	fx.KillFX()
end

-- Spawn an aura effect and start its growth
local fx = SpawnPrefab("deerclops_aura_circle_fx")
if fx ~= nil then
	fx.Transform:SetPosition(x, y, z)
	fx:Spawn()
	if fx.GrowFX ~= nil then
		fx.GrowFX()
	end
end
```

## Dependencies & tags
**Components used:** `updatelooper`, `transform`, `animstate`, `soundemitter`, `network`, `follower` (only for spikefire)
**Tags:** `FX`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `disc` | Entity or nil | `nil` | Internal ping-ring entity (only for `pingfx`), parented to the main instance. |
| `fade` | `net_tinybyte` | `0` (init) | Remote property (0=in, 1=hold, 2=out) for ping effect fade state. Synced via network. |
| `radius` | number | `ICE_CIRCLE_RADIUS` (5.5) | Current radius of the ice-circle effect (only for `impactfn` and `aurafn`). |
| `freezelimit` | number | `0.7` | Multiplier used to scale coldness added to frozen targets (only for `impactfn` and `aurafn`). |
| `dopostupdate` | boolean or nil | `nil` | Flag to delay first post-update frame sync for impact explosion (only for `impactfn`). |

## Main functions
### `ping_OnUpdateDisc(inst)`
* **Description:** Drives fade-in/fade-out animation of the ping disc by adjusting alpha and applying quadratic easing to the animation tint.
* **Parameters:** `inst` (Entity) — The ping disc entity instance.
* **Returns:** Nothing.
* **Error states:** Does nothing if `delta` is zero or `alpha` reaches `0` or `1`.

### `pingfn()`
* **Description:** Constructs the `deerclops_icelance_ping_fx` prefab. Creates a parent entity with a child disc (only on non-dedicated clients), sets up fade state via network sync, and registers listeners to handle pre/active/post animations and early termination.
* **Parameters:** None.
* **Returns:** Entity — The ready-to-spawn prefab instance with `KillFX` method attached on the master simulation.

### `impact_OnPostUpdateExplosion(inst)`
* **Description:** Synchronizes the impact explosion animation frame with its parent after the parent animation completes. Removes the `updatelooper` post-update listener once done.
* **Parameters:** `inst` (Entity) — The impact explosion FX entity.
* **Returns:** Nothing.

### `impactfn()`
* **Description:** Constructs the `deerclops_impact_circle_fx` prefab. Spawns an impact explosion child entity, sets up a periodic update loop to freeze and damage targets in range, and schedules self-removal after 2 seconds.
* **Parameters:** None.
* **Returns:** Entity — The effect instance with `radius`, `freezelimit`, and `KillFX` method (only on master simulation).

### `OnUpdateIceCircle(inst)`
* **Description:** Called every frame on master simulation during active ice-circle effects. Iterates over nearby entities and applies coldness, extinguishes fires, lowers temperature, and adds grogginess according to tunings and resistance.
* **Parameters:** `inst` (Entity) — The ice-circle FX entity.
* **Returns:** Nothing.
* **Error states:** Skips dead or invalid entities; ignores entities with excluded tags.

### `aurafn()`
* **Description:** Constructs the `deerclops_aura_circle_fx` prefab. Similar to `impactfn` but with sound loop, randomized rotation, and `GrowFX`/`KillFX` methods for slower onset and removal.
* **Parameters:** None.
* **Returns:** Entity — The effect instance with `GrowFX` and `KillFX` methods, `radius`, and `freezelimit`.

### `spikefirefn()`
* **Description:** Constructs the `deerclops_spikefire_fx` prefab. Creates a fire effect entity that loops a fire animation and auto-removes on animation end.
* **Parameters:** None.
* **Returns:** Entity — The effect instance with `KillFX` method (only on master simulation).

### `impact_KillFX(inst)`
* **Description:** Stops the ice-circle effect early by playing a post-animation and registering immediate removal on animation end.
* **Parameters:** `inst` (Entity) — The impact/aura FX entity.
* **Returns:** Nothing.

### `aura_KillFX(inst, quick)`
* **Description:** Handles early termination of the aura effect. If `quick` is true, delegates to `impact_KillFX`; otherwise, removes the update loop and performs an erosion fade-out.
* **Parameters:** `inst` (Entity), `quick` (boolean).
* **Returns:** Nothing.

### `spikefire_KillFX(inst)`
* **Description:** Triggers the `post_med_fast` animation on spikefire FX to begin fade-out and schedules removal on animation end.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `aura_GrowFX(inst)`
* **Description:** Initializes the aura's growth sequence: starts at small scale, plays `pre` animation, plays looping sound, and waits for `animover` before full effect.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"fadedirty"` — on non-mastersim, triggers fade state updates for ping effect (`ping_OnFadeDirty`).  
  - `"animqueueover"` — on mastersim, transitions ping from pre to active animation (`ping_OnAnimQueueOver`).  
  - `"animover"` — triggers removal for impact explosion and aura end (`impactfn`, `aurafn`).  
  - `"death"` — `pingfn` removes this callback during `KillFX` to prevent retrigger.
- **Pushes:**  
  - None directly (effects are visual/audio-only; damage/processing happens via component interactions in `OnUpdateIceCircle`).