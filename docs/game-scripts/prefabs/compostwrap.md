---
id: compostwrap
title: Compostwrap
description: A reusable item that applies slow fertilizer effect and provides minor health regeneration when equipped as a debuff on living targets.
tags: [fertilizer, healing, debuff]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 937bdd7c
system_scope: inventory
---

# Compostwrap

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `compostwrap` prefab represents both an inventory item and a self-contained debuff effect. As an item, it functions as a small-stackable fertilizer with fuel properties and smothering behavior. When applied (e.g., via player interaction), it spawns a non-networked `compostheal_buff` entity that attaches to a target and periodically restores health while applying a slow-fertilize effect. The item and its associated debuff interact with multiple core systems: inventory, fertilizer, fuel, burnable, smotherer, and debuff components.

## Usage example
```lua
-- Spawn a compostwrap item in world
local item = SpawnPrefab("compostwrap")

-- When placed in a player's inventory, the OnPutInInventory callback removes spawned flies
-- When dropped, OnDropped spawns flies and cancels the initial delay task

-- If applied as a debuff (e.g., via player action), the compostheal_buff entity is spawned and attached
-- It heals the target over time and stops when the target dies or the timer expires
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `fertilizerresearchable`, `fertilizer`, `fuel`, `smotherer`, `burnable`, `debuff`, `timer`
**Tags:** Adds `"heal_fertilize"`, `"slowfertilize"`, `"fertilizerresearchable"`, and `"CLASSIFIED"` (on the buff entity); checks `"playerghost"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inittask` | task (optional) | `nil` | Delayed task handle used to defer fly spawning until after creation. |
| `flies` | entity (optional) | `nil` | Child entity spawned to simulate natural fly behavior while unequipped. |
| `task` | task (optional) | `nil` | Periodic task used by the buff entity to apply heal ticks. |

## Main functions
### `GetFertilizerKey(inst)`
* **Description:** Returns the prefab name of the instance, used as a lookup key for fertilizer research.
* **Parameters:** `inst` (entity) — the compostwrap instance.
* **Returns:** `string` — the value of `inst.prefab`.
* **Error states:** None.

### `fertilizerresearchfn(inst)`
* **Description:** Callback used by the `fertilizerresearchable` component to determine the research key.
* **Parameters:** `inst` (entity) — the compostwrap instance.
* **Returns:** `string` — the result of `inst:GetFertilizerKey()`.

### `FuelTaken(inst, taker)`
* **Description:** Executed when the compostwrap is used as fuel. Spawns a `"poopcloud"` at the taker's position or burning flame position.
* **Parameters:**  
  `inst` (entity) — the compostwrap instance being consumed.  
  `taker` (entity) — the entity burning the fuel.
* **Returns:** Nothing.

### `OnBurn(inst)`
* **Description:** Executed upon ignition. Cleans up associated effects (flies or init task) and triggers default burn behavior.
* **Parameters:** `inst` (entity) — the compostwrap instance.
* **Returns:** Nothing.

### `OnDropped(inst)`
* **Description:** Called when dropped from inventory. Ensures flies are spawned and initial task is canceled.
* **Parameters:** `inst` (entity) — the compostwrap instance.
* **Returns:** Nothing.

### `OnPutInInventory(inst)`
* **Description:** Called when placed in an inventory. Removes spawned flies and cancels the init task.
* **Parameters:** `inst` (entity) — the compostwrap instance.
* **Returns:** Nothing.

### `OnInit(inst)`
* **Description:** Initializes fly spawning; runs once with a short delay (0s task) after creation.
* **Parameters:** `inst` (entity) — the compostwrap instance.
* **Returns:** Nothing.

### `OnAttached(inst, target, followsymbol, followoffset, data)`
* **Description:** Called when the `compostheal_buff` is attached to a target. Sets up periodic health regeneration and timer.
* **Parameters:**  
  `inst` (entity) — the buff instance.  
  `target` (entity) — the entity receiving the buff.  
  `followsymbol`, `followoffset` — visual attachment data (unused).  
  `data` (table?, optional) — contains `duration` in seconds.
* **Returns:** Nothing.

### `OnExtended(inst, target, followsymbol, followoffset, data)`
* **Description:** Called when the buff duration is extended. Updates the `"regenover"` timer if the new duration exceeds the remaining time.
* **Parameters:**  
  `inst` (entity) — the buff instance.  
  `target` (entity) — the buffed entity.  
  `followsymbol`, `followoffset` — unused.  
  `data` (table?, optional) — contains `duration` in seconds.
* **Returns:** Nothing.

### `OnTick(inst, target)`
* **Description:** Periodic tick function that applies health regeneration to the target. Stops the debuff if target is dead or a ghost.
* **Parameters:**  
  `inst` (entity) — the buff instance.  
  `target` (entity) — the entity receiving health.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Handles timer expiration for `"regenover"`, stopping the debuff.
* **Parameters:**  
  `inst` (entity) — the buff instance.  
  `data` (table) — event data, must contain `name == "regenover"`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `"death"` (on target entity) — triggers debuff removal.  
  `"timerdone"` (on buff entity) — triggers debuff removal via `OnTimerDone`.
- **Pushes:**  
  None directly (events are dispatched via component hooks like `healthdelta` for heal effect).
