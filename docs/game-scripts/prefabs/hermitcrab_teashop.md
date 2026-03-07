---
id: hermitcrab_teashop
title: Hermitcrab Teashop
description: Acts as a dynamic crafting station for Hermit Crab tea recipes, activated only when the Hermit Crab enters its area and updated based on pearl decoration score.
tags: [crafting, ai, environment, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7fd3e590
system_scope: crafting
---

# Hermitcrab Teashop

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hermitcrab_teashop` is a specialized environment structure that serves as a crafting station for Hermit Crab tea recipes. It dynamically enables or disables its prototyper functionality depending on whether the Hermit Crab is nearby and present in its area. The available recipes change based on the pearl decoration score of the Hermit Crab’s current house. It interacts with the `hermitcrab_relocation_manager`, `craftingstation`, `playerprox`, `workable`, `burnable`, `hauntable`, and `inspectable` components to manage state, interactions, and gameplay events.

## Usage example
```lua
-- Spawn the tea shop and activate its prototyper if Hermit Crab is present
local tea_shop = SpawnPrefab("hermitcrab_teashop")
tea_shop:OnHermitCrabEnter({ hermitcrab = my_hermitcrab })

-- Later, when Hermit Crab leaves or structure is removed
tea_shop:OnHermitCrabLeave({ instant = false })
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `workable`, `playerprox`, `hauntable`, `craftingstation`, `burnable`, `lightpostpartner`, `prototyper`  
**Tags:** Adds `structure`, `FX` (for front part only), `abandoned` (conditionally), `burnt` (conditionally)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hermitcrab` | entity or `nil` | `nil` | Reference to the Hermit Crab entity currently associated with this shop. |
| `front` | entity | `nil` | The front visual part of the structure (spawned on master only). |
| `highlightchildren` | table of entities | `{inst.front}` | List of children entities to highlight (used for rendering). |
| `_hermitcrab` | `net_entity` proxy | — | Network-replicated reference to the Hermit Crab entity. |
| `_old_hermitcrab` | entity or `nil` | `nil` | Cached copy of the previous Hermit Crab for cleanup. |
| `abandoning_task` | task or `nil` | `nil` | Delayed task to transition to "abandoned" state. |
| `abandoning_task` | task or `nil` | `nil` | Task for delayed FX/sound triggers when player leaves area. |

## Main functions
### `MakePrototyper(inst)`
* **Description:** Initializes or reinitializes the `prototyper` component, sets up its callbacks, and refreshes the available tea recipes based on pearl decoration score. Should be called when the Hermit Crab enters the shop.
* **Parameters:** `inst` (entity) — the tea shop entity instance.
* **Returns:** Nothing.
* **Error states:** Does nothing if `prototyper` component already exists.

### `UpdateRecipes(inst)`
* **Description:** Resets known crafting items and populates them based on current pearl decoration score. Tea recipe variants are selected from the `TEA_RECIPES` list, appending `_1`, `_2`, or `_3` based on tier (1–3).
* **Parameters:** `inst` (entity) — the tea shop entity instance.
* **Returns:** Nothing.

### `OnTurnOnForDoer(inst, doer)`
* **Description:** Starts a periodic task that pushes Hermit music events every 10 seconds while the prototyper is active and the doer has `_hermit_music` component.
* **Parameters:**  
  `inst` (entity) — the tea shop instance.  
  `doer` (entity) — the player or entity interacting with the prototyper.
* **Returns:** Nothing.

### `OnPlayerNear(inst)`
* **Description:** Triggered when a player enters proximity (`playerprox` near distance = `5`). If the tea shop is not burnt/abandoned and the Hermit Crab is present and nearby in pathfinding terms, it registers the shop as an active tea shop in the Hermit Crab’s brain. Otherwise, it stores teleport target in `tea_shop_teleport`.
* **Parameters:** `inst` (entity) — the tea shop instance.
* **Returns:** Nothing.

### `OnPlayerFar(inst)`
* **Description:** Triggered when a player moves out of far proximity (`playerprox` far distance = `6`). Removes the shop from Hermit Crab’s active tea shop list and clears the teleport memory.
* **Parameters:** `inst` (entity) — the tea shop instance.
* **Returns:** Nothing. Pushes `"hermitcrab_left"` event.

### `GetStatus(inst)`
* **Description:** Returns the current state string for UI display (`"BREWING"` or `"ACTIVE"`), used by `inspectable`.
* **Parameters:** `inst` (entity) — the tea shop instance.
* **Returns:**  
  `"BREWING"` — if stategraph has `brewing` state tag.  
  `"ACTIVE"` — if Hermit Crab is currently inside the shop.  
  `nil` — otherwise.

### `OnHammered(inst, worker)`
* **Description:** Handles destruction of the tea shop. Drops loot and spawns a collapse FX (`collapse_big`). Then removes the entity.
* **Parameters:**  
  `inst` (entity) — the tea shop instance.  
  `worker` (entity) — the entity performing the hammer action.
* **Returns:** Nothing.

### `OnIgnite(inst, data)`
* **Description:** Handles tea shop ignition. Notifies the Hermit Crab with a chatter line depending on whether a player caused the fire. Pushes `"hermitcrab_left"` event and removes Hermit Crab reference.
* **Parameters:**  
  `inst` (entity) — the tea shop instance.  
  `data` (table or `nil`) — event payload; expected to contain `doer` or `source`.
* **Returns:** Nothing.

### `HasHermitCrab(inst)`
* **Description:** Helper to check if the tea shop currently has an associated Hermit Crab entity.
* **Parameters:** `inst` (entity) — the tea shop instance.
* **Returns:** Boolean — `true` if `inst.hermitcrab` is non-`nil`, else `false`.

## Events & listeners
- **Listens to:**
  - `"hermitcrab_entered"` — triggers `OnHermitCrabEnter`
  - `"hermitcrab_left"` — triggers `OnHermitCrabLeave`
  - `"onremove"` — triggers `OnRemove`
  - `"onignite"` — triggers `OnIgnite`
  - `"onhermitcrabdirty"` — triggers `OnHermitCrabDirty` (client-side only)
  - `"pearldecorationscore_updatescore"` — triggers `UpdateRecipes` via bridge (listens on `TheWorld`)
  - `"isday"` — watched via `WatchWorldState`, triggers `OnIsDay`
- **Pushes:**
  - `"hermitcrab_startbrewing"` — with `{ product = recipe.product }`
  - `"hermitcrab_left"` — with `{ instant = true/false }`
  - `"leave_teashop"` (via `PushEventImmediate`)
  - `"entity_droploot"` — via `lootdropper:DropLoot`
  - `"onhermitcrabdirty"` — triggers dirty handling for network sync