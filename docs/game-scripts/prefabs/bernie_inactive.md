---
id: bernie_inactive
title: Bernie Inactive
description: Manages the dormant state and self-decay mechanics for Bernie the Beard, including fuel consumption, reanimation logic, and equippable behavior.
tags: [inventory, equippable, decay, consumable, transform]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7205f845
system_scope: inventory
---

# Bernie Inactive

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bernie_inactive` is the dormant variant of Bernie the Beard. It functions as an equippable, fueled item that spontaneously reanimates into `bernie_active` when near eligible players. The prefab handles decay (transforming back to loot) after fuel exhaustion, tracks owner association for attack-based fuel consumption, and synchronizes skin-based visual overlays for the wielder. It integrates heavily with the `fueled`, `equippable`, `inventoryitem`, `insulator`, `lootdropper`, and `timer` components.

## Usage example
```lua
local inst = SpawnPrefab("bernie_inactive")
inst.Transform:SetPosition(0, 0, 0)
inst.components.fueled:InitializeFuelLevel(100)
inst.components.fueled:StartConsuming()
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `insulator`, `fueled`, `timer`, `lootdropper`  
**Tags:** Adds `nopunch`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_isdeadstate` | boolean or `nil` | `nil` | Indicates if Bernie is in the dead/empty-fuel state (`true`) or active (`nil`). |
| `_decaytask` | Task or `nil` | `nil` | Reference to the scheduled decay task. |
| `_activatetask` | PeriodicTask or `nil` | `nil` | Reference to the periodic reanimation check task. |
| `_lastowner` | Entity or `nil` | `nil` | Stores the last entity that equipped Bernie for event listener management. |
| `hotheaded` | function | `commonfn.hotheaded` | Helper function to check if a player is in a "hotheaded" state. |
| `isleadercrazy` | function | `commonfn.isleadercrazy` | Helper function to check if a player is the leader and in a "crazy" state. |

## Main functions
### `dodecay(inst)`
*   **Description:** Destroys `bernie_inactive`, drops loot items (`beardhair`, `beefalowool`, `silk`) and a `small_puff` FX, then removes the entity.
*   **Parameters:** `inst` (Entity) — the Bernie inactive instance.
*   **Returns:** Nothing.

### `startdecay(inst)`
*   **Description:** Schedules the `dodecay` function to execute after `TUNING.BERNIE_DECAY_TIME` seconds.
*   **Parameters:** `inst` (Entity) — the Bernie inactive instance.
*   **Returns:** Nothing.

### `stopdecay(inst)`
*   **Description:** Cancels a pending decay task if active.
*   **Parameters:** `inst` (Entity) — the Bernie inactive instance.
*   **Returns:** Nothing.

### `tryreanimate(inst)`
*   **Description:** Scans for eligible nearby players (`hotheaded` or `isleadercrazy`, within 16 units, and visible). If found, spawns a `bernie_active` instance, transfers fuel percentage to health, preserves position/rotation, and removes `bernie_inactive`.
*   **Parameters:** `inst` (Entity) — the Bernie inactive instance.
*   **Returns:** Nothing.
*   **Error states:** No-op if no eligible players are within range.

### `activate(inst)`
*   **Description:** Starts a periodic task (every 1 second) to call `tryreanimate` and attempt reanimation.
*   **Parameters:** `inst` (Entity) — the Bernie inactive instance.
*   **Returns:** Nothing.

### `deactivate(inst)`
*   **Description:** Cancels the reanimation periodic task.
*   **Parameters:** `inst` (Entity) — the Bernie inactive instance.
*   **Returns:** Nothing.

### `onfuelchange(section, oldsection, inst)`
*   **Description:** Handles transitions between fueled states (dead/alive). Updates animations, dapperness, insulation, inventory image, activates/deactivates decay/reanimation logic, and adjusts visual overlays when equipped.
*   **Parameters:**  
    - `section` (number) — current fuel section index (derived internally).  
    - `oldsection` (number) — previous fuel section index.  
    - `inst` (Entity) — the Bernie inactive instance.  
*   **Returns:** Nothing.

### `OnEquip(inst, owner)`
*   **Description:** Handles Bernie being equipped by a player: updates equippable animations, starts fuel consumption if not dead, sets skin-based item overlays, manages `onattackother` event listener for fuel consumption during attacks.
*   **Parameters:**  
    - `inst` (Entity) — the Bernie inactive instance.  
    - `owner` (Entity) — the entity equipping Bernie.  
*   **Returns:** Nothing.

### `OnUnequip(inst, owner)`
*   **Description:** Handles Bernie being unequipped: restores owner animations, stops fuel consumption, removes `onattackother` listener.
*   **Parameters:**  
    - `inst` (Entity) — the Bernie inactive instance.  
    - `owner` (Entity) — the entity unequipping Bernie.  
*   **Returns:** Nothing.

### `OnEquipToModel(inst, owner, from_ground)`
*   **Description:** Handles equipping to a model (e.g., in UI): stops fuel consumption, removes `onattackother` listener.
*   **Parameters:**  
    - `inst` (Entity) — the Bernie inactive instance.  
    - `owner` (Entity) — the entity/model.  
    - `from_ground` (boolean) — ignored in this implementation.  
*   **Returns:** Nothing.

### `bernie_swap_object_helper(owner, skin_build, symbol, guid)`
*   **Description:** Applies skin-specific animation overrides to the owner’s `AnimState` for proper visual representation of Bernie while equipped.
*   **Parameters:**  
    - `owner` (Entity) — the player entity.  
    - `skin_build` (string or `nil`) — skin build name.  
    - `symbol` (string) — animation symbol name (e.g., `"swap_bernie_dead"`).  
    - `guid` (number) — Bernie’s instance GUID.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onputininventory"` → `topocket` (stops decay and reanimation)  
  - `"ondropped"` → `toground` (triggers decay if dead, or reanimation if alive)  
  - `"onattackother"` via `inst:ListenForEvent(...)` on the owner — reduces fuel on attack (unless dead or riding)  
  - `"onentitywake"` → `onentitywake` (activates if not held, alive, and awake)  
- **Pushes:**  
  - `"equipskinneditem"` / `"unequipskinneditem"` when equipped/unequipped with a skin.  
  - `"imagechange"` (via `inventoryitem:ChangeImageName`) when image updates.  
  - `"percentusedchange"` (via `fueled` component).  
  - `"onfueldsectionchanged"` (via `fueled` component).  
  - `"loot_prefab_spawned"` (via `lootdropper:SpawnLootPrefab`).  
  - `"on_loot_dropped"` (via `lootdropper`).