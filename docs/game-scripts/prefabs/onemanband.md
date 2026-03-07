---
id: onemanband
title: Onemanband
description: Manages the One Man Band inventory item, which attracts followers, enhances dapperness, and supports haunt mechanics in DST.
tags: [inventory, follower, haunt, music]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5a0abb34
system_scope: inventory
---

# Onemanband

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `onemanband` prefab implements the One Man Band inventory item functionality. When equipped, it periodically attracts compatible followers (`pig`, `merm`, `farm_plant`) within range, adds loyalty time to existing followers, and provides a dapperness penalty that scales with follower count minus pet count. It also supports haunt mechanics: when haunted, it becomes active without requiring equipping, attracting only `pig` followers and triggering sound effects. Fuel consumption is managed via the `fueled` component and stops on unequip or depletion.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("band")
inst:AddComponent("onemanband")  -- This is the Prefab, not a raw component; the fn() returns a full entity.
-- In practice, prefabs are instantiated via `TheWorld:SpawnPrefab("onemanband")` or similar.
```

## Dependencies & tags
**Components used:** `inventoryitem`, `fueled`, `equippable`, `shadowlevel`, `leader`, `hauntable`, `farmplanttendable`, `follower`, `petleash`, `leader`, `skilltreeupdater`, `mermkingmanager`, `sanity` (commented out in haunt logic).  
**Tags added:** `band`, `shadowlevel`.  
**Tags checked:** `pig`, `merm`, `mermguard`, `mermdisguise`, `werepig`, `player`, `lunarminion`, `shadowminion`, `farm_plant`.

## Properties
No public properties are exposed or initialized in the constructor.

## Main functions
### `band_update(inst)`
*   **Description:** Core periodic update function called every `banddt` (1 second) while active. It identifies nearby followers, adds them to the leader (owner or the band itself when haunted), tend farm plants, and grants loyalty time to valid followers.
*   **Parameters:** `inst` (Entity) — the One Man Band entity instance.
*   **Returns:** Nothing.
*   **Error states:** Safely handles missing components (e.g., `owner.components.leader`) and capped follower counts (`< 10`). For haunted mode, uses `inst.components.leader` instead of the owner’s leader.

### `band_enable(inst)`
*   **Description:** Starts the periodic task that runs `band_update` every second.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `band_disable(inst)`
*   **Description:** Stops the periodic `band_update` task. Commented-out code suggests cleanup of followers on disable (not active in current code).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `band_perish(inst)`
*   **Description:** Called when fuel depletes. Disables the band and removes the entity entirely.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onequip(inst, owner)`
*   **Description:** Equip handler — sets animation override, starts fuel consumption, and enables the periodic update.
*   **Parameters:** `inst` (Entity), `owner` (Entity or nil).
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Unequip handler — clears animation override, stops fuel consumption, and disables the periodic update.
*   **Parameters:** `inst` (Entity), `owner` (Entity or nil).
*   **Returns:** Nothing.

### `onequiptomodel(inst, owner)`
*   **Description:** Called when the item is in a model (e.g., placed in a container); stops fuel consumption and disables the update.
*   **Parameters:** `inst` (Entity), `owner` (Entity or nil).
*   **Returns:** Nothing.

### `CalcDapperness(inst, owner)`
*   **Description:** Computes the dapperness penalty for the owner based on follower count and pet count.
*   **Parameters:** `inst` (Entity), `owner` (Entity).
*   **Returns:** Number — the dapperness delta (always non-positive).
*   **Formula:** `-TUNING.DAPPERNESS_SMALL - max(0, numfollowers - numpets) * TUNING.SANITYAURA_SMALL`.

### `is_merm_valid(owner, merm)`
*   **Description:** Checks if a merm follower is valid for attraction/loyalty under Wurt’s skill tree.
*   **Parameters:** `owner` (Entity), `merm` (Entity).
*   **Returns:** `true` if the merm is a generic merm or a lunar/shadow minion whose respective skill is activated.
*   **Error states:** Returns `false` for lunar/shadow minions if `skilltreeupdater` is missing or skill not activated.

### `OnHaunt(inst)`
*   **Description:** Haunt trigger — acts like `onequip`, starts periodic sound effects via `haunt_foley_delayed`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` (required by `hauntable` to apply haunt effects).
*   **Error states:** None.

### `OnUnHaunt(inst)`
*   **Description:** Unhaunt trigger — acts like `onunequip` and cancels the sound effect task.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly (though `inst:ListenForEvent("onremove", ...)` is commented out).
- **Pushes:** None directly; relies on components (`fueled`, `equippable`, `hauntable`) to push events as needed.
