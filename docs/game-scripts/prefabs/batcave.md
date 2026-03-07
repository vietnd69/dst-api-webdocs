---
id: batcave
title: Batcave
description: A boss-stage facility that spawns bats over time and reacts to player proximity and day/night cycles.
tags: [boss, spawn, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: baac938e
system_scope: environment
---

# Batcave

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`batcave` is a world entity that functions as a boss staging ground or encounter area, dynamically spawning `bat` prefabs over time. It leverages the `childspawner` component to manage internal bat reserves and regeneration, and integrates with `playerprox` to trigger aggressive spawning behavior when players approach. Its spawning logic is also governed by the game’s cave day/night cycle via `WorldSettings_ChildSpawner_*` utilities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("childspawner")
inst:AddComponent("playerprox")
-- (Assume additional setup for transforms, anims, etc.)
inst.components.childspawner:SetMaxChildren(20)
inst.components.childspawner:SetSpawnPeriod(2)
inst.components.childspawner:SetRegenPeriod(6)
inst.components.childspawner:SetOnAddChildFn(myOnAddChildFn)
inst.components.childspawner:SetSpawnedFn(myOnSpawnFn)
inst.components.playerprox:SetDist(6, 40)
inst.components.playerprox:SetOnPlayerNear(myOnPlayerNearFn)
```

## Dependencies & tags
**Components used:** `childspawner`, `playerprox`, `inspectable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animstate` | AnimState instance | — | Controls animation playback; sets build/bank to `"batcave"`, plays `"idle"` by default. |
| `soundemitter` | SoundEmitter instance | — | Manages audio effects: warning, spawn, explosion, and taunt sounds. |
| `MiniMapEntity` | MiniMapEntity instance | — | Sets minimap icon to `"batcave.png"`. |

## Main functions
### `OnPreLoad(inst, data)`
* **Description:** Called during world load to apply world-settings overrides for spawn and regen periods (via `WorldSettings_ChildSpawner_*` utilities), and to initialize internal child count if batcave spawning is globally disabled.
* **Parameters:**  
  `inst` (Entity) — the batcave entity instance.  
  `data` (table) — serialized world state data.  
* **Returns:** Nothing.

### `ReturnChildren(inst)`
* **Description:** Called to return all spawned bats back to the batcave by invoking `homeseeker:GoHome()` and pushing a `"gohome"` event on each child. Used during shutdown or reset logic.
* **Parameters:**  
  `inst` (Entity) — the batcave entity instance.  
* **Returns:** Nothing.

### `onnear(inst)`
* **Description:** Triggered when a player enters the near zone (radius ≤ 6). If the spawner's internal child count is full (`childreninside == maxchildren`), forces up to 10 immediate bat spawns, plays an explosion sound and bat taunt sound to signal aggression.
* **Parameters:**  
  `inst` (Entity) — the batcave entity instance.  
* **Returns:** Nothing.
* **Error states:** Max 10 iterations per trigger to prevent runaway spawning.

### `onaddchild(inst, count)`
* **Description:** Callback triggered when a bat is added to the internal pool. If the internal count reaches `maxchildren`, plays the `"eyes"` animation and a warning sound.
* **Parameters:**  
  `inst` (Entity) — the batcave entity instance.  
  `count` (number) — number of children added (not used directly).  
* **Returns:** Nothing.

### `onspawnchild(inst, child)`
* **Description:** Callback triggered after a bat is spawned. Plays `"idle"` animation and replaces warning sound with a bat spawn sound.
* **Parameters:**  
  `inst` (Entity) — the batcave entity instance.  
  `child` (Entity) — the spawned bat entity.  
* **Returns:** Nothing.

### `OnEntityWake(inst)`
* **Description:** Called when the world enters wake mode (e.g., caves wake after sleep). Triggers warning animation and sound if full.
* **Parameters:**  
  `inst` (Entity) — the batcave entity instance.  
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** Called when the world goes to sleep. Stops all batcave warning sounds.
* **Parameters:**  
  `inst` (Entity) — the batcave entity instance.  
* **Returns:** Nothing.

### `onisday(inst, isday)`
* **Description:** Watches world state changes for `iscaveday`. Stops spawning during day, resumes at night.
* **Parameters:**  
  `inst` (Entity) — the batcave entity instance.  
  `isday` (boolean) — true if currently daytime in the caves.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `iscaveday` — triggers `onisday` callback when cave time-of-day changes.
- **Pushes:** `"gohome"` — pushed on spawned bats via `ReturnChildren`.
- **Pushes:** `"panic"` — pushed on newly spawned bats with a `0`-time delay (via `DoTaskInTime`).
