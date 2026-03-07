---
id: smashables
title: Smashables
description: Defines reusable prefabs for ruins-related smashable objects (e.g., relics, rubble, chairs) with repair, health, loot, and shadeling-spawning behavior.
tags: [relics, ruins, combat, repair, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e0f57d10
system_scope: world
---

# Smashables

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`smashables.lua` defines a system for creating and managing smashable ruins-related prefabs—specifically relics (intact structures) and rubble (damaged or broken states). These prefabs support dynamic transitions between states based on health damage and repair progress. It uses core components (`combat`, `health`, `lootdropper`, `repairable`, `sittable`, `inspectable`) and interacts with the `ruinsshadelingspawner` component. This file is not a component itself, but rather a **prefab factory** that produces multiple unique prefabs using a shared `makefn` constructor function.

## Usage example
```lua
-- Example of adding a smashable relic to a map (internal usage, not typical modder API):
local relic = Prefab("ruins_vase", ...)  -- Created internally via `makefn`
relic:AddTag("smashable")
relic:AddComponent("health")
relic.components.health:SetMaxHealth(100)
-- Direct modder usage is typically via prefabs defined here (e.g., "ruins_vase", "ruins_rubble_table")
```

## Dependencies & tags
**Components used:**  
`combat`, `health`, `lootdropper`, `repairable`, `sittable`, `inspectable`, `ruinsshadelingspawner` (via world component), `sanity` (via `doer` component), `network` (`net_bool`), `miniMapEntity`, `animstate`, `soundemitter`, `transform`

**Tags added/checked:**  
Adds `cavedweller`, `smashable`, `object`, `stone` or `clay`, `noauradamage`, `electricdamageimmune`, `structure`, `limited_chair`, `uncomfortable_chair` (conditionally on chair state).  
Checks `repairable_stone` in `displaynamefn`, and `"ruinsrelic_"..inst._recipename` in `SCANNABLE_RECIPENAME`.

## Properties
No public properties are defined as instance fields in the constructor—state is encapsulated in component properties and local flags (e.g., `inst.rubble`, `inst._isrubble`, `inst._recipename`). `inst.rubble` is used as a legacy boolean flag for compatibility.

## Main functions
### `OnHit(inst)`
*   **Description:** Plays a hit animation on the entity if it is animated; triggers "repair" animation for rubble and transitions back to "broken", or "hit" for intact objects followed by "idle".
*   **Parameters:** `inst` (entity instance) — the smashable object.
*   **Returns:** Nothing.
*   **Error states:** Only intended for animated objects (`if inst.animated`). No explicit error handling.

### `OnDeath(inst)`
*   **Description:** Handles entity destruction—spawns a "collapse_small" FX, drops loot via `lootdropper`, and removes the entity.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `OnHealthDelta(inst, oldpct, newpct)`
*   **Description:** Monitors health percentage; if the entity drops below 50% health and is not yet rubble, it triggers a transition to the rubble state via `SetIsRubble` and `MakeRubble`.
*   **Parameters:** `inst` (entity instance), `oldpct` (number), `newpct` (number) — previous and current health percentages.
*   **Returns:** Nothing.

### `MakeRelic(inst)`
*   **Description:** Converts a rubble entity back into a relic (e.g., during repair): removes `repairable`, sets `inspectable.nameoverride` to `"relic"`, plays idle animation, and conditionally adds chair-related components/tags if `inst.chair` is true.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `MakeRubble(inst)`
*   **Description:** Converts an intact relic into rubble: adds `repairable` component with `repairmaterial = MATERIALS.STONE` and sets `onrepaired = OnRepaired`, sets nameoverride to `"ruins_rubble"`, plays "broken" animation, and removes chair components/tags.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `OnRepaired(inst, doer)`
*   **Description:** Triggered after repair; grants tiny sanity restore if fully repaired, updates sound and animation, and transitions back to relic state if currently rubble.
*   **Parameters:** `inst` (entity instance), `doer` (entity performing repair).
*   **Returns:** Nothing.

### `Chair_TrySpawnShadeling(inst)`
*   **Description:** Requests the world's `ruinsshadelingspawner` component to spawn a shadeling on this chair if conditions are met.
*   **Parameters:** `inst` (entity instance, typically a chair).
*   **Returns:** Nothing.

### `Chair_OnEntityWake(inst)` / `Chair_OnEntitySleep(inst)`
*   **Description:** Manages a one-shot task to spawn shadelings when the chair wakes/sleeps to ensure proper persistence across world chunks.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `SetIsRubble(inst, isrubble)`
*   **Description:** Updates the `rubble` state and `inst._isrubble` networked boolean, and updates `SCANNABLE_RECIPENAME` based on state.
*   **Parameters:** `inst` (entity instance), `isrubble` (boolean).
*   **Returns:** Nothing.

### `OnSave(inst, data)` / `OnPreLoad(inst, data)`
*   **Description:** Save/load hooks to persist `rubble` state and `maxhealth` across saves/load.
*   **Parameters:** `inst` (entity instance), `data` (table for save or loaded data).
*   **Returns:** Nothing.

### `MakeRubble` / `MakeRelic` / `OnIsRubbleDirty` / `KeepTargetFn`
*   **Description:** See above individual functions.

## Events & listeners
- **Listens to:**  
  - `"death"` — triggers `OnDeath`.  
  - `"isrubbledirty"` — triggers `OnIsRubbleDirty` (client-side only).  
  - `"onremove"` (via `Chair_OnEntitySleep`) — cancels shadeling tasks.  
- **Pushes:**  
  - `"entity_droploot"` — via `lootdropper:DropLoot()`.  
  - `"sanitydelta"` — indirectly via `sanity:DoDelta`.