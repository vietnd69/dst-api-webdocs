---
id: lava_pond
title: Lava Pond
description: A large environmental hazard that emits heat, ignites nearby flammable objects on contact, propagates fire, and triggers music events when engaged by the Dragonfly boss.
tags: [environment, fire, sound, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f44e8915
system_scope: environment
---

# Lava Pond

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lava_pond` prefab represents a dangerous, glowing lava pool entity in the game world. It acts as a passive environmental hazard, emitting high heat, igniting entities that collide with it (if they lack fuel), and propagating fire to adjacent flammable objects. It also integrates with the Dragonfly boss fight by playing ambient music when the boss is engaged, and includes rocks placed around its perimeter as decorative elements. The component logic resides in the prefab definition itself rather than a standalone component class.

## Usage example
This is a static world prefab, not a component added manually. However, modders may reference its behavior when creating similar entities:
```lua
-- Example: Creating a custom heat-emitting hazard with fire propagation
local inst = CreateEntity()
inst:AddComponent("heater")
inst.components.heater.heat = 500
inst:AddComponent("propagator")
inst.components.propagator.propagaterange = 5
inst.components.propagator.damagerange = 5
inst.components.propagator.damages = true
inst.components.propagator:StartSpreading()
```

## Dependencies & tags
**Components used:** `inspectable`, `heater`, `propagator`, `cooker`, `hauntable`, `burnable` (referenced externally), `fueled` (referenced externally), `transform`, `animstate`, `soundemitter`, `light`, `minimapentity`, `network`  
**Tags added:** `lava`, `antlion_sinkhole_blocker`, `birdblocker`, `cooker`  
**Tags checked externally:** `fireimmune` (via `burnable.lua`), `controlled_burner` (via `burnable.lua`)

## Properties
No public instance properties are defined directly on the `lava_pond` entity. Internal state is managed through component fields:
- `inst.components.heater.heat = 500` (number)
- `inst.components.propagator.propagaterange = 5` (number)
- `inst.components.propagator.damagerange = 5` (number)
- `inst.components.propagator.damages = true` (boolean)
- `inst._isengaged:value()` (net_bool, tracks Dragonfly engagement state)
- `inst._playingmusic` (boolean)
- `inst.rocks` (table or nil, stores rock positions for persistence)

## Main functions
### `makerock(rocktype)`
* **Description:** Factory function that returns a Prefab definition for decorative scorched rocks placed around the lava pond. Handles animation setup and hauntable component initialization.
* **Parameters:** `rocktype` (string or number) — suffix identifier (empty string for first rock, or numbers "2"–"7").
* **Returns:** Prefab — a reusable prefab definition object.
* **Error states:** None.

### `SpawnRocks(inst)`
* **Description:** Spawns 2–4 randomly positioned scorched rocks around the lava pond, parented to it. Called once on init and on reload from save.
* **Parameters:** `inst` (entity) — the lava pond instance.
* **Returns:** Nothing.
* **Error states:** Skips rock creation if rock type or offset is invalid.

### `OnCollide(inst, other)`
* **Description:** Collision callback that ignites colliding entities if they are flammable and non-fueled (e.g., players, creatures, but not campfires).
* **Parameters:**  
  `inst` (entity) — the lava pond instance.  
  `other` (entity) — the colliding entity.
* **Returns:** Nothing.
* **Error states:** Only ignites if `other.components.burnable` exists and `other.components.fueled` is `nil`; does nothing for invalid or fire-immune entities.

### `PushMusic(inst)`
* **Description:** Handles Dragonfly boss-related ambient music streaming for nearby players.
* **Parameters:** `inst` (entity) — the lava pond instance.
* **Returns:** Nothing.
* **Error states:** Does nothing on dedicated servers or if `ThePlayer` is `nil`.

### `OnIsEngagedDirty(inst)`
* **Description:** Ensures music task is started/stopped when Dragonfly engagement state changes. Runs only on clients.
* **Parameters:** `inst` (entity) — the lava pond instance.
* **Returns:** Nothing.
* **Error states:** Does nothing on dedicated servers.

### `OnDragonflyEngaged(inst, data)`
* **Description:** Updates internal engagement state when Dragonfly boss state changes.
* **Parameters:**  
  `inst` (entity) — the lava pond instance.  
  `data` (table) — event payload with `engaged` (boolean) and `dragonfly` (entity or `nil`) fields.
* **Returns:** Nothing.
* **Error states:** None.

### `OnSave(inst, data)`
* **Description:** Saves rock positions to world save data.
* **Parameters:**  
  `inst` (entity) — the lava pond instance.  
  `data` (table) — save data table to populate.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores rock positions and restarts rock spawning task on world load.
* **Parameters:**  
  `inst` (entity) — the lava pond instance.  
  `data` (table) — loaded save data.
* **Returns:** Nothing.
* **Error states:** Only acts if save data contains rocks and task was not already running.

## Events & listeners
- **Listens to:** `dragonflyengaged` — triggers engagement state update and music handling.  
- **Pushes:** `ms_registerlavapond` — registers itself with the world for Dragonfly boss logic.  
- **Collision callbacks:** `physics collision` — fires `OnCollide` on entity contact.  
- **Net events:** `isengageddirty` — client-side listener for engagement state changes (via `net_bool`).