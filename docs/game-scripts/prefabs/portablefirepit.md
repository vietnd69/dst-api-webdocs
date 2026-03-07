---
id: portablefirepit
title: Portablefirepit
description: Manages the portable firepit item and its deployed state, handling fuel consumption, ignition, dismantling, and charcoal production logic.
tags: [fire, fuel, crafting, inventory, crafting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 209cf611
system_scope: entity
---

# Portablefirepit

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`portablefirepit` is a prefab definition that creates both a deployable item (`portablefirepit_item`) and its placed structure counterpart (`portablefirepit`). It combines fuel management, burnable state, cooking, and loot-dropping behaviors to implement Walter’s portable firepit. The component relies heavily on `fueled`, `burnable`, `deployable`, and `hauntable` systems to manage state transitions (ignition, fuel depletion, charcoal queuing), deployment animation, and hauntable interactions.

## Usage example
```lua
local inst = CreateEntity()
-- deployable item setup
inst:AddComponent("deployable")
inst.components.deployable.restrictedtag = "portable_campfire_user"
inst.components.deployable.ondeploy = ondeploy
inst.fuel = 100
```

## Dependencies & tags
**Components used:** `burnable`, `fueled`, `deployable`, `portablestructure`, `hauntable`, `inspectable`, `workable`, `lootdropper`, `cooker`, `storytellingprop`, `inventoryitem`, `physics`
**Tags:** Adds `campfire`, `structure`, `wildfireprotected`, `portable_campfire`, `cooker`, `storytellingprop`, `NOCLICK` (during deployment), `portableitem`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `queued_charcoal` | boolean or nil | `nil` | Indicates if charcoal is ready to be dropped on next fuel burnout. |
| `deploytask` | Task or nil | `nil` | Delayed task managing the transition from deployed state to functional firepit. |

## Main functions
### `ChangeToItem(inst)`
*   **Description:** Converts the placed portable firepit back into a deployable item, spawns charcoal if `queued_charcoal` is true and fuel section is 1 or below, and removes the entity.
*   **Parameters:** `inst` (Entity) — the firepit instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `onpostdeploy(inst, fuel)`
*   **Description:** Finalizes firepit deployment after a short delay, restores fuel percentage, and removes the `NOCLICK` tag.
*   **Parameters:**  
    * `inst` (Entity) — the deployed firepit instance.  
    * `fuel` (number) — fuel percentage to restore (may exceed `1.0` if caller provides extra).
*   **Returns:** Nothing.
*   **Error states:** Fuel capped to `1.0` via `math.min`.

### `onhit(inst, worker)`
*   **Description:** Handles hammering of the firepit before it is fully deployed; cancels the deployment task and restores fuel to caller.
*   **Parameters:**  
    * `inst` (Entity) — the firepit instance.  
    * `worker` (Entity) — the entity performing the work.
*   **Returns:** Nothing.

### `onextinguish(inst)`
*   **Description:** Resets fuel level to `0` when fire is extinguished.
*   **Parameters:** `inst` (Entity) — the firepit instance.
*   **Returns:** Nothing.

### `ontakefuel(inst)`
*   **Description:** Plays the fuel-add sound effect when fuel is added.
*   **Parameters:** `inst` (Entity) — the firepit instance.
*   **Returns:** Nothing.

### `updatefuelrate(inst)`
*   **Description:** Dynamically adjusts fuel consumption rate based on rain and skill modifiers (e.g., Walter's rain rate multiplier).
*   **Parameters:** `inst` (Entity) — the firepit instance.
*   **Returns:** Nothing.

### `onupdatefueled(inst)`
*   **Description:** Called whenever fuel is updated; refreshes burn effect level and fuel consumption rate.
*   **Parameters:** `inst` (Entity) — the firepit instance.
*   **Returns:** Nothing.

### `onfuelchange(newsection, oldsection, inst, doer)`
*   **Description:** Handles transitions between fuel sections (0–3). Extinguishes on section 0, ignites if not burning on section ≥1, queues charcoal on section 3, and updates burn effect level.
*   **Parameters:**  
    * `newsection` (number) — current fuel section (0–3).  
    * `oldsection` (number) — previous fuel section.  
    * `inst` (Entity) — the firepit instance.  
    * `doer` (Entity or nil) — entity adding/removing fuel.
*   **Returns:** Nothing.

### `getstatus(inst, viewer)`
*   **Description:** Returns localized status string for inspectable component (`"OUT"`, `"EMBERS"`, `"NORMAL"`), with special handling for Walter’s storyteller hint.
*   **Parameters:**  
    * `inst` (Entity) — the firepit instance.  
    * `viewer` (Entity) — entity inspecting the firepit.
*   **Returns:** String status string.

### `OnHaunt(inst, haunter)`
*   **Description:** Implements hauntable logic; with `HAUNT_CHANCE_RARE`, restores `MED_FUEL` and sets haunt value.
*   **Parameters:**  
    * `inst` (Entity) — the firepit instance.  
    * `haunter` (Entity) — the haunting entity.
*   **Returns:** `true` on successful haunt, `false` otherwise.

### `OnInit(inst)`
*   **Description:** Ensures burn effects are correctly attached after load/creation.
*   **Parameters:** `inst` (Entity) — the firepit instance.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves `queued_charcoal` flag to world state.
*   **Parameters:**  
    * `inst` (Entity) — the firepit instance.  
    * `data` (table) — table to populate with persisted data.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores `queued_charcoal` flag from world state.
*   **Parameters:**  
    * `inst` (Entity) — the firepit instance.  
    * `data` (table) — persisted data from save.
*   **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
*   **Description:** Called when the item is deployed. Spawns the placed `portablefirepit`, starts deployment animation, sets delayed post-deploy task, and removes the item.
*   **Parameters:**  
    * `inst` (Entity) — the deployable item (`portablefirepit_item`).  
    * `pt` (Vector3) — deployment position.  
    * `deployer` (Entity) — the deploying entity.
*   **Returns:** Nothing.

### `item_OnSave(inst, data)`
*   **Description:** Saves remaining fuel percentage for the deployable item.
*   **Parameters:**  
    * `inst` (Entity) — the item instance.  
    * `data` (table) — table to populate with persisted data.
*   **Returns:** Nothing.

### `item_OnLoad(inst, data)`
*   **Description:** Restores fuel percentage from saved data.
*   **Parameters:**  
    * `inst` (Entity) — the item instance.  
    * `data` (table) — persisted data from save.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onextinguish` — resets fuel to zero.
- **Pushes:** None directly; relies on component events (`fueled.onfueldsectionchanged`, `burnable.onignite`, `burnable.onextinguish`, etc.) for propagation.