---
id: armor_carrotlure
title: Armor Carrotlure
description: An equippable armor item that periodically attracts and extends loyalty of rabbit followers within range of its owner, who must be a leader.
tags: [inventory, equipment, follower, rabbit]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d19c0d1b
system_scope: inventory
---

# Armor Carrotlure

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`armor_carrotlure` is a prefabricated equippable item (specifically body armor) that functions as a rabbit lure. When equipped by a player, it periodically scans for nearby rabbits (entities tagged `regular_bunnyman`) within range and adds them as followers if the leader’s follower cap has not been reached. It also periodically grants loyalty time to already-following rabbits. The lure is perishable and can be repaired with carrot material.

The component logic is embedded directly in the prefab’s `fn()` constructor, and no standalone `Component` class is defined. All behavior is executed via periodic tasks when equipped.

## Usage example
```lua
-- The armor lure is instantiated as a prefab and used by the game’s inventory/equipping system.
-- Modders typically interact with it indirectly through its owner’s leader/follower system.
local lure = SpawnPrefab("armor_carrotlure")
lure.components.inventoryitem:SetOwner(some_player)
some_player.components.inventoryitem:GiveItem(lure)
some_player:PushEvent("equip", { item = lure, slot = EQUIPSLOTS.BODY })
```

## Dependencies & tags
**Components used:** `inventoryitem`, `equippable`, `perishable`, `repairable`, `leader`, `inspectable`  
**Tags added:** `show_spoilage`, `hidesmeats`, `item` (via `MakeInventoryPhysics`), `body` (via `EQUIPSLOTS.BODY`)  
**Tags checked:** `regular_bunnyman`, `player`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `UPDATE_TICK_RATE` | number | `1` | Interval (in seconds) between lure effect updates. |
| `LURE_TAG` | string | `"regular_bunnyman"` | Tag used to identify valid rabbit followers. |
| `CARROTLURE_MUST_TAGS` | table | `{LURE_TAG}` | Tag filter for entity search. |
| `inst.carrotluretask` | DoTaskHandle or `nil` | `nil` | Handle to the periodic task that runs `UpdateLure`. |
| `inst.foleysound` | string | `"dontstarve/movement/foley/cactus_armor"` | Sound played during movement while equipped. |
| `FLOAT_SCALE` | table | `{.9, .9, .9}` | Scale factor for floating animation when waterborne. |

## Main functions
### `UpdateLure(inst)`
* **Description:** Called periodically while the lure is equipped. Attempts to attract new rabbit followers (up to `TUNING.ARMOR_CARROTLURE_MAXFOLLOWERS`) from within `TUNING.ARMOR_CARROTLURE_RANGE`, and grants 3 seconds of loyalty to each existing follower. Only executes if the owner exists and has a `leader` component.
* **Parameters:** `inst` (Entity) — the lure item instance.
* **Returns:** Nothing.
* **Error states:** No-op if `owner` is `nil`, `owner.components.leader` is missing, or no valid free rabbits are found in range.

### `EnableLure(inst)`
* **Description:** Starts the periodic `UpdateLure` task (if not already running), replacing any existing task.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `DisableLure(inst)`
* **Description:** Cancels the periodic `UpdateLure` task, stopping lure effects (e.g., when unequipped or perished).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `onequip(inst, owner)`
* **Description:** Called when the item is equipped by the owner. Sets up animation overrides (including skin support), and starts the lure’s effect loop via `EnableLure`.
* **Parameters:** `inst` (Entity), `owner` (Entity) — the player equipping the item.
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Called when unequipped. Clears animation overrides, stops lure updates via `DisableLure`, and notifies the owner of skin removal.
* **Parameters:** `inst` (Entity), `owner` (Entity).
* **Returns:** Nothing.

### `onequiptomodel(inst, owner)`
* **Description:** Called when the item is equipped for 3D model preview (e.g., in the loadout screen). Stops lure updates since model previews are not active in-game.
* **Parameters:** `inst` (Entity), `owner` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (no `inst:ListenForEvent` in `armor_carrotlure.lua`).
- **Pushes:** None directly (no `inst:PushEvent` in `armor_carrotlure.lua`), though `onequip` and `onunequip` push `equipskinneditem`/`unequipskinneditem` to the *owner*.