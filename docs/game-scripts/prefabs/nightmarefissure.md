---
id: nightmarefissure
title: Nightmarefissure
description: A dynamic world entity that changes visual state, spawns shadow thralls, and responds to nightmare phase transitions.
tags: [world, environment, boss]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0dbf8e02
system_scope: environment
---

# Nightmarefissure

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nightmarefissure` is a prefab factory that creates dynamic environmental entities used in DST's nightmare events (e.g., Ruins nightmare fights, Grottowar). It manages lighting, animations, and child spawner behavior across multiple phases (calm, warn, wild, dawn, controlled). The fissure responds to the world's `nightmarephase` state, spawns `nightmarebeak`, `crawlingnightmare`, or `ruinsnightmare` entities via `childspawner`, and optionally supports dreadstone mining mechanics via `workable` and `lootdropper`. It integrates with `shadowthrallmanager` for boss event coordination and ensures proper persistence and network sync.

## Usage example
```lua
-- The prefab is not instantiated directly; it is returned by the factory function.
-- Example usage is in-level creation via PrefabManager or level scripts.
local fissure = SpawnPrefab("fissure")
fissure.MakeTempFissure(fissure) -- Forces immediate transition to calm state and marks as temporary
```

## Dependencies & tags
**Components used:**  
- `childspawner` – manages spawning and regenerating child entities  
- `lootdropper` – spawns dreadstone on mined fissures (only for fissure types in `AllowShadowThralls`)  
- `workable` – enables dreadstone mining (only for fissure types in `AllowShadowThralls`)  
- `inspectable` – conditionally added to display "Dreadstone Stack" name when minerals are present  
- `health`, `combat`, `knownlocations` – used conditionally during `killchildren()` or in Grottowar variant  

**Tags:**  
- Adds `okayforarena` to prevent interference with arena combat logic.

## Properties
No public properties are exposed in this script; all internal state is stored in instance fields (`inst._*`) and component-owned variables.

## Main functions
The following functions are callable on the fissure instance (`inst`) or registered as callbacks:

### `inst.MakeTempFissure()`
*   **Description:** Marks the fissure as temporary (`inst.temp = true`), forces it into the `calm` state, and prepares it for auto-removal after animations complete. Used for one-time event transitions.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None.

### `inst.OnNightmarePhaseChanged(phase, instant)`
*   **Description:** Triggers a state transition (`calm`, `warn`, `wild`, `dawn`, or `controlled`) based on the world's `nightmarephase`. Handles delays, controlled fissure overrides, and temp fissure resets.
*   **Parameters:**  
    - `phase` (string) – Target phase name.  
    - `instant` (boolean) – If true, animations and light changes occur immediately; otherwise, a random delay up to `2` seconds is applied.
*   **Returns:** Nothing.

### `inst:MakeTempFissure()`
*   **Description:** Idempotent entry point for marking a fissure as temporary and transitioning to `calm` state.

### `OnFissureMinedFinished(inst, worker)`
*   **Description:** Called by the `workable` component after dreadstone mining completes. Removes the `inspectable` component, resets names/symbols, spawns three `dreadstone` items, plays a sound, and notifies the `shadowthrallmanager`.
*   **Parameters:**  
    - `inst` – fissure instance.  
    - `worker` – entity that performed the mining (unused).
*   **Returns:** Nothing.

### `OnReleasedFromControl(inst)`
*   **Description:** Exits the `controlled` state (e.g., end of boss phase). Restores default visuals and light, initiates a 7-frame transition animation, and cleans up components. If mining is possible, it prepares for dreadstone regrowth.

### `inst.OnEntitySleep()` / `inst.OnEntityWake()`
*   **Description:** Manage sound looping and fissure registration with `shadowthrallmanager` during world sleep/wake cycles.

## Events & listeners
- **Listens to:**  
  - `"lightdirty"` (client) – triggers light updates (`OnLightDirty`).  
  - `"animover"` (client) – detects when the `idle_open_rift` animation finishes in `controlled` state.  
  - `"animqueueover"` (client) – used to trigger `ErodeAway` on temporary fissures after transition.  
- **Pushes:** None directly; relies on component events (`lootdropper`/`workable` callbacks).

### State functions (`states[phase]`)
Each state (`calm`, `warn`, `wild`, `dawn`, `controlled`) configures physics, light radius, animation sequence, sound, and child spawner behavior:
- `calm`: Closes fissure, kills children, radius `0`.
- `warn`: Low-intensity light (`radius 2`), prepares for spawning.
- `wild`: Full-intensity light (`radius 5`), starts spawning children.
- `dawn`: Intermediate light (`radius 2`), mimics wild but transitions out.
- `controlled`: Fixed light (`radius 3`, orange tint), unique animation (`idle_open_rift`), disables child spawning, and prevents dreadstone regrowth (`_nofissurechildren`).

### Utility functions
- `fade_to(inst, rad, instant)` – Animates light radius transitions with frame-based interpolation.
- `OnUpdateLight(inst, dframes)` – Called periodically to advance light animation frames and update radius.
- `spawnchildren(inst)` / `killchildren(inst)` – Start/stop child spawner and reset children.
- `GetRareChildFn(inst, isemergency, target)` – Chooses between `ruinsnightmare` or `nightmarebeak` based on rift status and tuning.