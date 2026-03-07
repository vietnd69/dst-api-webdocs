---
id: powdermonkey
title: Powdermonkey
description: Implements the Powder Monkey character entity with combat, inventory, and crew member behaviors in Don't Starve Together.
tags: [entity, combat, inventory, ai, crew]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 70686fea
system_scope: entity
---

# Powdermonkey

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`powdermonkey.lua` defines the `powder_monkey` prefab — a hostile monkey character used in the game's multiplayer scenarios (especially in海战-based levels). It combines combat, inventory management, crew member integration, and special AI behaviors like target retargeting, speech_override, and personal item persistence. It integrates tightly with `combat`, `inventory`, `locomotor`, `sleeper`, `embarker`, `eater`, and `talker` components. The entity is not a player character but functions as an AI-driven agent with assigned roles (e.g., aboard a ship as a powder monkey).

## Usage example
```lua
local inst = SpawnPrefab("powder_monkey")
inst.Transform:SetPosition(x, y, z)
inst.components.combat:SetTarget(some_target)
inst.components.inventory:GiveItem(SpawnPrefab("poop"))
```

## Dependencies & tags
**Components used:** `inventory`, `combat`, `locomotor`, `health`, `lootdropper`, `eater`, `sleeper`, `embarker`, `drownable`, `areaaware`, `timer`, `inspectable`, `thief`, `bloomer`, `knownlocations`, `talker`.  
**Tags added:** `character`, `monkey`, `hostile`, `scarytoprey`, `pirate`.  
**Tags checked/removed:** `personal_possession`, `wonkey`, `monkey` (for retargeting logic).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `task` | `Task` | `nil` | Timer task used to forget target after ~60 seconds of inaction. |
| `tinkertarget` | `Entity` | `nil` | Reference to a boat component's tinker target (used for crew interaction). |
| `cannon` | `Entity` | `nil` | Reference to a cannon entity this monkey operates. |
| `scrapbook_overridedata` | `table` | `{{...}}` | Scrapbook override data for swapping outfits (`cutless`, `hat_monkey_small`). |
| `speech_override_fn` | `function` | `speech_override_fn` | Function to dynamically override speech strings based on player state. |

## Main functions
### `ClearTinkerTarget(inst)`
* **Description:** Removes this monkey from the `boatcrew` component's tinker targets list and nullifies `inst.tinkertarget`.
* **Parameters:** `inst` (Entity) — the monkey instance.
* **Returns:** Nothing.
* **Error states:** Silently does nothing if `tinkertarget` is `nil`.

### `OnAttacked(inst, data)`
* **Description:** Reacts to an attack on the monkey by setting the attacker as combat target, canceling existing forget-target tasks, and encouraging nearby monkeys to join in by suggesting the same target.
* **Parameters:**  
  `inst` (Entity) — the monkey instance.  
  `data` (table) — event data containing `attacker` (Entity).  
* **Returns:** Nothing.
* **Error states:** Skips non-monkey or combat-less entities in radius.

### `retargetfn(inst)`
* **Description:** Hardcoded retarget function that always returns `nil`, meaning the monkey does not actively seek new targets beyond initial aggression.
* **Parameters:** `inst` (Entity) — unused.
* **Returns:** `nil`.

### `shouldKeepTarget(inst, target)`
* **Description:** Determines whether the monkey should retain its current target; allows retention if it’s on a boat (crew member) or if the target is valid per combat rules.
* **Parameters:**  
  `inst` (Entity) — the monkey instance.  
  `target` (Entity) — the candidate target.  
* **Returns:** `boolean`.

### `oneat(inst)`
* **Description:** Called when the monkey eats food; awards one poop stack if current poop stack size is less than 3.
* **Parameters:** `inst` (Entity) — the monkey instance.
* **Returns:** Nothing.

### `OnPickup(inst, data)`
* **Description:** Handles special logic on pickup of a head-slot item: waits one frame before equipping it (to allow `GiveItem` to complete).
* **Parameters:**  
  `inst` (Entity) — the monkey instance.  
  `data` (table) — event data with `item` (Entity).  
* **Returns:** Nothing.

### `OnDropItem(inst, data)`
* **Description:** Removes the `personal_possession` tag from an item when dropped.
* **Parameters:**  
  `inst` (Entity) — the monkey instance.  
  `data` (table) — event data with `item` (Entity).  
* **Returns:** Nothing.

### `OnDeath(inst, data)`
* **Description:** Drops a `cursed_monkey_token` loot item when the monkey dies.
* **Parameters:**  
  `inst` (Entity) — the monkey instance.  
  `data` (table) — death event data (unused).  
* **Returns:** Nothing.

### `OnGotItem(inst, data)`
* **Description:** Triggers a victory event when the monkey acquires a cave banana (raw or cooked).
* **Parameters:**  
  `inst` (Entity) — the monkey instance.  
  `data` (table) — event data with `item` (Entity).  
* **Returns:** Nothing.

### `speech_override_fn(inst, speech)`
* **Description:** Overrides speech strings for the monkey based on whether `ThePlayer` exists and lacks the `wonkey` tag.
* **Parameters:**  
  `inst` (Entity) — unused.  
  `speech` (string) — original speech key.  
* **Returns:** Modified speech key (string) or original.

### `battlecry(combatcmp, target)`
* **Description:** Dynamically selects a battle cry based on target type and inventory contents.
* **Parameters:**  
  `combatcmp` (Combat) — combat component instance.  
  `target` (Entity or `nil`) — the target entity.  
* **Returns:** Two values: speech string key (`string`) and index (`number`).

### `onremove(inst)`
* **Description:** Cleans up state when the monkey is removed: clears cannon operator reference and calls `ClearTinkerTarget`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes personal items (marked with `personal_possession`) from inventory slots and equipped slots into `data.personal_item` and `data.personal_equip`.
* **Parameters:**  
  `inst` (Entity).  
  `data` (table) — output table for persistence.  
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores `personal_possession` tags on items after loading.
* **Parameters:**  
  `inst` (Entity).  
  `data` (table) — saved data.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` (`onremove`) — cleanup handler.  
  - `onpickupitem` (`OnPickup`) — handles headgear equipping.  
  - `dropitem` (`OnDropItem`) — removes `personal_possession` tag.  
  - `attacked` (`OnAttacked`) — triggers combat response and monkey synergy.  
  - `death` (`OnDeath`) — drops loot.  
  - `itemget` (`OnGotItem`) — checks for victory condition.  
  - `ms_seamlesscharacterspawned` (`onmonkeychange`) — drops current combat target if a new player spawns.  
- **Pushes:** None defined directly in this file.
