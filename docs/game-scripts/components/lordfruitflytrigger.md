---
id: lordfruitflytrigger
title: Lordfruitflytrigger
description: Monitors entities within a range to activate or deactivate fruit fly spawners when they enter or remain inside the trigger zone.
tags: [environment, entity, trigger]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a7929100
system_scope: environment
---

# Lordfruitflytrigger

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LordFruitFlyTrigger` is an environment-trigger component that periodically scans for entities with the `fruitflyspawner` tag within a specified radius. When such an entity enters the trigger area, it calls the entity's `_activatefn` function (typically used to activate the spawner). When the entity leaves or has been outside the range for some time, it is de-activated. The component automatically starts when attached to an entity if the `farming_manager` component exists in the world, and responds to death/resurrection events to pause or resume scanning.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lordfruitflytrigger")
-- Optional: adjust range before start
inst.components.lordfruitflytrigger.trigger_range = 20
-- The component starts automatically if farming_manager is present
```

## Dependencies & tags
**Components used:** `farming_manager` (checked for existence at initialization)  
**Tags:** Adds `lordfruitflytrigger` to the owning entity; expects entities within range to have `fruitflyspawner` tag and implement `_activatefn(entity, trigger)`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trigger_range` | number | `15` | Radius in game units around the owner entity to search for fruit fly spawners. |
| `findentitiesfn` | function | `findentities` (local) | Custom search function used to find entities. Typically returns entities matching `FRUITFLYSPAWNER_MUST_TAGS` within range. |
| `updating` | boolean | `false` | Whether the component is currently active and being updated every frame. |
| `overlapping` | table | `{}` | Map of entity instances currently overlapping or recently overlapping the trigger area. Used to track activation state. |

## Main functions
### `StartUpdating()`
*   **Description:** Begins periodic `OnUpdate` calls for this component. Automatically called during initialization (if `farming_manager` is present) and resurrection.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if already updating.

### `StopUpdating()`
*   **Description:** Stops periodic `OnUpdate` calls. Automatically called on death or manually to disable the trigger.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if not currently updating.

### `OnUpdate()`
*   **Description:** Core logic called each frame while updating. Clears stale entries in `overlapping`, finds new entities in range, and activates them if newly entered or previously active. Deactivates entities that have not been seen recently.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Assumes each entity found has a callable `_activatefn(ent, trigger)` method.

## Events & listeners
- **Listens to:** `death` – stops updating when the owner dies.  
- **Listens to:** `respawnfromghost` – restarts updating when the owner respawns.  
- **Listens to:** `ms_fruitflytimerfinished` – clears the `overlapping` table (via `ontimerfinished`).  
- **Pushes:** None.

## Additional notes
- The component does not manage spawner lifecycles directly — it only invokes `_activatefn` on matched entities.
- On removal from an entity (`OnRemoveFromEntity`), all event listeners and tags are properly cleaned up.
- The component does not require explicit activation — it starts automatically if `TheWorld.components.farming_manager` exists at init time.
