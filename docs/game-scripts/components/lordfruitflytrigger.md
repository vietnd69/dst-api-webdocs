---
id: lordfruitflytrigger
title: Lordfruitflytrigger
description: Triggers activation logic on nearby fruit fly spawners within range when active, and manages its update state in response to death and respawn events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: a7929100
---

# Lordfruitflytrigger

## Overview
This component monitors a radius around its entity for entities tagged with `"fruitflyspawner"`. It maintains a list of overlapping spawners and invokes their `_activatefn` callback when first detected. The component automatically starts updating when added to an entity (if the world's `farming_manager` exists) and responds to death/respawn events by pausing or resuming its updates.

## Dependencies & Tags
- Adds the `"lordfruitflytrigger"` tag to its entity.
- Requires `TheWorld.components.farming_manager` to be present to begin updating (checked at construction).
- Listens for events `"ms_fruitflytimerfinished"`, `"death"`, and `"respawnfromghost"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trigger_range` | number | `15` | Radius (in units) around the entity within which fruit fly spawners are detected. |
| `findentitiesfn` | function | `findentities` | Function used to query entities in range; defaults to a closure calling `TheSim:FindEntities` with tags `{"fruitflyspawner"}`. |
| `updating` | boolean | `false` | Tracks whether the component is actively updating. Set to `true` on initialization (if farming_manager exists). |
| `overlapping` | table | `{}` | Table tracking overlapping fruit fly spawners; keys are entity references, values are `true` (active) or `false` (just left range). |
| `inst` | Entity | `self`'s entity | Reference to the entity this component is attached to. |

## Main Functions
### `OnUpdate()`
* **Description:** Called each frame while updating. Clears stale overlap entries, then scans for nearby spawners. For each new spawner, invokes its `_activatefn`; for previously seen ones, refreshes their active status.
* **Parameters:** None (uses internal `overlapping`, `findentitiesfn`, and `trigger_range`).

### `StartUpdating()`
* **Description:** Begins periodic `OnUpdate()` calls if not already active. Calls `inst:StartUpdatingComponent(self)` internally.
* **Parameters:** None.

### `StopUpdating()`
* **Description:** Halts `OnUpdate()` calls if currently active. Calls `inst:StopUpdatingComponent(self)` internally.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleanup logic invoked when the component is removed. Removes the `"lordfruitflytrigger"` tag and detaches all event listeners.
* **Parameters:** None.

## Events & Listeners
- Listens for `"ms_fruitflytimerfinished"` on `TheWorld` and calls `ontimerfinished(self)` (which clears the `overlapping` table).
- Listens for `"death"` on `inst` and calls `ondeath(inst)` (which stops updating).
- Listens for `"respawnfromghost"` on `inst` and calls `onresurrect(inst)` (which starts updating again).
- Pushes no events itself.