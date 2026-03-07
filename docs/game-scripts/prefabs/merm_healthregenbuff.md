---
id: merm_healthregenbuff
title: Merm Healthregenbuff
description: Applies periodic health regeneration to a target entity for a fixed duration, used by merm characters and related gameplay elements.
tags: [combat, buff, merm, healing, duration]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8117e6a6
system_scope: entity
---

# Merm Healthregenbuff

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`merm_healthregenbuff` is a non-persistent, non-networked entity prefab that functions as a debuff component container to provide health regeneration to a target over time. It operates by attaching to a target entity (typically a player or NPC) and periodically adding health via the target's `health` component. The duration and tick rate are controlled by tunable constants, and the buff stops if the target dies, becomes a ghost, or the timer expires.

The prefab relies on the `debuff` and `timer` components to manage attachment lifecycle, extension behavior, and automatic expiration.

## Usage example
```lua
-- Attaches the health regen buff to a target entity (e.g., a merm character)
local buff = SpawnPrefab("merm_healthregenbuff")
if buff ~= nil and buff.components.debuff then
    buff.components.debuff:Attach(target)
end
```

## Dependencies & tags
**Components used:** `debuff`, `timer`, `health`  
**Tags added to prefab:** `CLASSIFIED`  
**Tags checked on target:** `player`, `playerghost`  
**Tags checked via component:** `debuff` (via attachment logic)

## Properties
No public properties are initialized in the constructor beyond default component behavior. The component relies on external tunables (`TUNING.MERM_HEALTHREGEN_TICK_RATE`, `TUNING.MERM_HEALTHREGEN_TICK_VALUE`, `TUNING.MERM_HEALTHREGEN_TICK_VALUE_PLAYER`, `TUNING.MERM_HEALTHREGEN_DURATION`) for configuration.

## Main functions
### `OnAttached(inst, target)`
* **Description:** Callback invoked when the debuff is attached to a target entity. Sets up the target as parent entity, resets position, starts the periodic health tick task, and registers a listener for the target’s `death` event to auto-terminate the buff.
* **Parameters:**  
  * `inst` (Entity) — the buff entity itself.  
  * `target` (Entity) — the entity receiving health regeneration.  
* **Returns:** Nothing.

### `OnTick(inst, target)`
* **Description:** Periodically called task that attempts to heal the target by applying health delta. If the target is dead, a ghost, or lacks a `health` component, the debuff stops itself.
* **Parameters:**  
  * `inst` (Entity) — the buff entity.  
  * `target` (Entity) — the entity to heal.  
* **Returns:** Nothing.
* **Error states:** No health delta is applied if `target.components.health` is missing, `health:IsDead()` returns `true`, or the target has the `playerghost` tag.

### `OnExtended(inst, target)`
* **Description:** Callback invoked when the debuff’s duration is extended (e.g., by re-applying). Resets the internal timer, cancels the existing tick task, and spawns a new one to maintain synchronization with the new duration.
* **Parameters:**  
  * `inst` (Entity) — the buff entity.  
  * `target` (Entity) — the entity receiving the buff.  
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Event handler for `timerdone` events. If the expired timer is `"merm_heal"`, stops the debuff (terminating the health regen).
* **Parameters:**  
  * `inst` (Entity) — the buff entity.  
  * `data` (table) — timer metadata, expected to contain `name`.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  * `"death"` on target entity — stops the debuff if the target dies.  
  * `"timerdone"` — stops the debuff when the `"merm_heal"` timer expires.
- **Pushes:** None — this prefab does not fire any custom events.