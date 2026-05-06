---
id: compostwrap
title: Compostwrap
description: Defines the compostwrap fertilizer item and its associated healing buff prefab for player application.
tags: [fertilizer, healing, inventory, wormwood]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 6a13a6c0
system_scope: inventory
---

# Compostwrap

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
The `compostwrap` prefab defines a stackable fertilizer item that players can use to enrich farmable soil. When applied to a player (typically Wormwood), it spawns a hidden `compostheal_buff` entity that attaches as a debuff and provides health regeneration over time. The item can be burned, used as fuel, and spawns visual fly effects when dropped on the ground.

## Usage example
```lua
-- Spawn a compostwrap item
local compostwrap = SpawnPrefab("compostwrap")

-- The item can be deployed on farmable soil using the deployable component
-- The healing buff is applied automatically when used on a player
-- via the debuff component attachment system
```

## Dependencies & tags
**External dependencies:**
- `prefabs/fertilizer_nutrient_defs.lua` -- provides FERTILIZER_DEFS for nutrient values

**Components used:**
- `stackable` -- enables stacking up to TUNING.STACK_SIZE_SMALLITEM
- `inspectable` -- allows players to inspect the item
- `inventoryitem` -- handles drop and inventory pickup callbacks
- `fertilizerresearchable` -- enables research tracking for fertilizer type
- `fertilizer` -- defines nutrient values and soil/withered cycle counts
- `fuel` -- allows item to be used as fuel with TUNING.LARGE_FUEL value
- `smotherer` -- enables fire extinguishing capability
- `burnable` -- allows item to be burned with TUNING.MED_BURNTIME
- `debuff` -- (compostheal_buff) manages attachment and detachment from target
- `timer` -- (compostheal_buff) tracks regeneration duration

**Tags:**
- `fertilizer` -- marks item as fertilizer type
- `slowfertilize` -- enables player self-fertilize healing action
- `fertilizerresearchable` -- marks item as researchable for fertilizer knowledge
- `CLASSIFIED` -- (compostheal_buff) hides entity from normal visibility

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
### `fn()`
* **Description:** Constructor function for the compostwrap prefab. Creates the entity, attaches all components, and configures fertilizer, fuel, and burnable behavior. Returns the entity instance.
* **Parameters:** None
* **Returns:** Entity instance for the compostwrap prefab.
* **Error states:** None

### `OnBurn(inst)`
* **Description:** Callback fired when the compostwrap is ignited. Calls DefaultBurnFn, removes spawned flies if present, or cancels the initialization task if flies haven't spawned yet.
* **Parameters:** `inst` -- the compostwrap entity instance
* **Returns:** None
* **Error states:** None

### `FuelTaken(inst, taker)`
* **Description:** Callback fired when the compostwrap is taken as fuel. Spawns a poopcloud visual effect at the taker's position (or their fire effect position if available).
* **Parameters:**
  - `inst` -- the compostwrap entity instance
  - `taker` -- the entity taking the fuel
* **Returns:** None
* **Error states:** None

### `OnDropped(inst)`
* **Description:** Callback fired when the compostwrap is dropped from inventory. Spawns child flies entity if not already present and cancels any pending initialization task.
* **Parameters:** `inst` -- the compostwrap entity instance
* **Returns:** None
* **Error states:** None

### `OnPutInInventory(inst)`
* **Description:** Callback fired when the compostwrap is placed into inventory. Removes spawned flies entity and cancels any pending initialization task.
* **Parameters:** `inst` -- the compostwrap entity instance
* **Returns:** None
* **Error states:** None

### `OnInit(inst)`
* **Description:** Initialization function called after a short delay to spawn flies. Delays spawning since the item is most likely being crafted directly into player inventory.
* **Parameters:** `inst` -- the compostwrap entity instance
* **Returns:** None
* **Error states:** None

### `GetFertilizerKey(inst)`
* **Description:** Returns the fertilizer key for research tracking. Used by the fertilizerresearchable component.
* **Parameters:** `inst` -- the compostwrap entity instance
* **Returns:** String prefab name for fertilizer identification.
* **Error states:** None

### `fertilizerresearchfn(inst)`
* **Description:** Research function wrapper that calls GetFertilizerKey. Assigned to the fertilizerresearchable component.
* **Parameters:** `inst` -- the compostwrap entity instance
* **Returns:** String fertilizer key from GetFertilizerKey.
* **Error states:** None

### `buff_fn()`
* **Description:** Constructor function for the compostheal_buff prefab. Creates a hidden, non-persisted entity that manages healing over time via the debuff system. Only functions on master sim (server).
* **Parameters:** None
* **Returns:** Entity instance for the compostheal_buff prefab.
* **Error states:** None -- client instances are scheduled for immediate removal.

### `OnTick(inst, target)`
* **Description:** Periodic callback that applies health delta to the target. Checks if target has health and sanity components and is not dead or a player ghost. Stops the debuff if conditions are not met.
* **Parameters:**
  - `inst` -- the compostheal_buff entity instance
  - `target` -- the entity receiving healing
* **Returns:** None
* **Error states:** None

### `OnAttached(inst, target, followsymbol, followoffset, data)`
* **Description:** Callback fired when the debuff attaches to a target. Sets parent entity, resets position, starts periodic healing task, and initializes the regeneration timer. Listens for target death to stop debuff.
* **Parameters:**
  - `inst` -- the compostheal_buff entity instance
  - `target` -- the entity receiving the debuff
  - `followsymbol` -- animation symbol to follow (unused)
  - `followoffset` -- position offset (unused)
  - `data` -- attachment data containing duration
* **Returns:** None
* **Error states:** None

### `OnTimerDone(inst, data)`
* **Description:** Callback fired when the regeneration timer completes. Stops the debuff if the timer name is "regenover".
* **Parameters:**
  - `inst` -- the compostheal_buff entity instance
  - `data` -- timer data containing timer name
* **Returns:** None
* **Error states:** None

### `OnExtended(inst, target, followsymbol, followoffset, data)`
* **Description:** Callback fired when the debuff duration is extended. Updates the timer if the new duration is longer than time remaining, or starts a new timer if none exists.
* **Parameters:**
  - `inst` -- the compostheal_buff entity instance
  - `target` -- the entity receiving the debuff
  - `followsymbol` -- animation symbol to follow (unused)
  - `followoffset` -- position offset (unused)
  - `data` -- extension data containing duration
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `death` (on target) -- stops debuff when target dies
- **Listens to:** `timerdone` -- handles timer completion for regeneration
- **Pushes:** None identified