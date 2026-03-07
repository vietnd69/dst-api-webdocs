---
id: portabletent
title: Portabletent
description: Manages a deployable, reusable sleeping structure that provides temperature regulation, health restoration, and drying functionality for players.
tags: [sleeping, temperature, portablestructure, reusability]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 442c3643
system_scope: entity
---

# Portabletent

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `portabletent` component implements a reusable sleeping shelter that supports gameplay mechanics such as temperature normalization, health/hunger recovery during sleep, wetness drying, and finite-usage tracking. It integrates with the `sleepingbag`, `finiteuses`, `workable`, `burnable`, and `portablestructure` components to enable disassembly, hammering, burning, and drying interactions. Two distinct prefabs are created: the placed structure (`portabletent`) and its inventory form (`portabletent_item`), which uses the `deployable` component to spawn the structure.

## Usage example
```lua
-- Deploying a portable tent from inventory
local tent_item = SpawnPrefab("portabletent_item")
tent_item.components.finiteuses:SetUses(5) -- Set initial uses
tent_item.components.deployable.ondeploy(tent_item, target_position, player)

-- Inside placed tent logic (master only)
inst:AddComponent("sleepingbag")
inst.components.sleepingbag.onsleep = OnSleep
inst.components.sleepingbag.onwake = OnWake
inst.components.finiteuses:Use() -- Consume one use on wake-up
```

## Dependencies & tags
**Components used:** `burnable`, `deployable`, `finiteuses`, `hauntable`, `lootdropper`, `portablestructure`, `sleepingbag`, `temperature`, `workable`, `inspectable`, `inventoryitem`

**Tags:** `tent`, `portabletent`, `structure`, `NOCLICK` (added to item form), `portableitem` (inventory form), `burnt` (conditionally), `usesdepleted` (conditionally added via `finiteuses`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sleep_anim` | string | `"sleep_loop"` | Animation name played while sleeping; enables sound loop during sleep. |
| `sleep_tasks` | table | `nil` | Stores periodic tasks for sleep-loop sound; cleared on wake or destruction. |
| `is_cooling` | boolean | inferred from `TUNING.SLEEP_TARGET_TEMP_TENT` | Determines whether tent cools or warms the sleeper based on ambient temperature. |

## Main functions
### `ChangeToItem(inst)`
*   **Description:** Converts the placed tent structure into its inventory item form (`portabletent_item`), removing structure-specific components and playing a closing animation.
*   **Parameters:** `inst` (Entity) - the tent entity to convert.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnAnimOver(inst)`
*   **Description:** Handles the end of the "disassemble" animation by replacing the entity with `portabletent_item` and preserving current uses.
*   **Parameters:** `inst` (Entity) - the tent entity.
*   **Returns:** Nothing.

### `OnHammered(inst)`
*   **Description:** Handles hammering the tent — extinguishes fire if burning; if burnt, destroys and drops burnt loot; otherwise converts to item form.
*   **Parameters:** `inst` (Entity) - the tent entity.
*   **Returns:** Nothing.

### `OnHit(inst)`
*   **Description:** Reacts to non-lethal hits by playing "hit" animation and waking any sleeper.
*   **Parameters:** `inst` (Entity) - the tent entity.
*   **Returns:** Nothing.

### `OnSleep(inst, sleeper)`
*   **Description:** Triggered when a player begins sleeping in the tent. Sets up the sleep animation, sound loop, and listens for `onignite` events.
*   **Parameters:** 
  - `inst` (Entity) - the tent entity.
  - `sleeper` (Entity) - the player entering the tent.
*   **Returns:** Nothing.

### `OnWake(inst, sleeper, nostatechange)`
*   **Description:** Triggered when the player wakes up. Cancels the `onignite` listener, stops sleep animation and sound, and consumes one use.
*   **Parameters:** 
  - `inst` (Entity) - the tent entity.
  - `sleeper` (Entity) - the player waking up.
  - `nostatechange` (boolean) - if true, skip state graph transition.
*   **Returns:** Nothing.

### `TemperatureTick(inst, sleeper)`
*   **Description:** Regulates the sleeper's temperature toward `TUNING.SLEEP_TARGET_TEMP_TENT` each tick while sleeping.
*   **Parameters:** 
  - `inst` (Entity) - the tent entity.
  - `sleeper` (Entity) - the sleeping player.
*   **Returns:** Nothing.

### `OnFinished(inst)`
*   **Description:** Handles final use expiration: stops sound, plays "destroy" animation, marks tent for removal, and disables persistence.
*   **Parameters:** `inst` (Entity) - the tent entity.
*   **Returns:** Nothing.

### `OnDismantle(inst)`
*   **Description:** Called when the tent is dismantled (e.g., via dismantle tool); converts to item form.
*   **Parameters:** `inst` (Entity) - the tent entity.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Handles tent becoming burnt: calls `DefaultBurntStructureFn`, removes physics colliders, and removes `portablestructure` component.
*   **Parameters:** `inst` (Entity) - the tent entity.
*   **Returns:** Nothing.

### `OnDeploy(inst, pt, deployer)`
*   **Description:** Inventory-item-specific callback to spawn and place the structure at `pt` upon deployment.
*   **Parameters:** 
  - `inst` (Entity) - the inventory item (`portabletent_item`).
  - `pt` (Vector3) - world position to deploy.
  - `deployer` (Entity) - player deploying the item.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` - triggers `OnAnimOver` to finalize disassembly/item conversion.
- **Pushes:** `onextinguish`, `startfreezing`, `stopfreezing`, `startoverheating`, `stopoverheating`, `temperaturedelta`, `percentusedchange` (via subcomponents), `entity_droploot`.
