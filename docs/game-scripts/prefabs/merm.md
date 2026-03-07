---
id: merm
title: Merm
description: Manages core gameplay behaviors for Merm characters, including combat AI, loyalty mechanics, transformation states (shadow/lunar), and royal upgrades.
tags: [combat, ai, npc, transformation]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1650486e
system_scope: entity
---

# Merm

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `merm` prefabs implement the core behavior and lifecycle for Merm NPCs in DST, including regular Merms, Merm Guards, Shadow Merms, and Lunar Merms. It handles combat targeting, loyalty systems (via the `follower` component), royal status effects (via `mermkingmanager`), special alignment-based mutations (lunar/shadow), and home-finding mechanics. Key interactions include trading (via `trader`), inventory management (via `inventory`), and dynamic state transitions when leaders change or conditions like health threshold are met.

## Usage example
```lua
-- Example: Hire a Merm and add loyalty time
local merm = SpawnPrefab("merm")
merm.Transform:SetPosition(inst.Transform:GetWorldPosition())
merm:AddTag("playermerm") -- Allow interaction by the current player

-- Feed the merm to gain loyalty
local food = SpawnPrefab("cave_banana")
merm.components.trader:AcceptItem(food, inst)

-- Check loyalty status
local loyalty_percent = merm.components.follower:GetLoyaltyPercent()
```

## Dependencies & tags
**Components used:** `eater`, `sleeper`, `named`, `health`, `combat`, `lootdropper`, `inventory`, `follower`, `mermcandidate`, `timer`, `trader`, `talker`, `locomotor`, `embarker`, `drownable`, `foodaffinity`, `planardamage`, `skilltreeupdater`, `debuffable`, `childspawner`, `entitytracker`, `equippable`, `edible`, `homeseeker`, `leader`

**Tags added/used:** `character`, `merm`, `wet`, `merm_npc`, `_named`, `mermguard`, `guard`, `shadowminion`, `shadow_aligned`, `lunarminion`, `lunar_aligned`, `NPC_contestant`

## Properties
No public properties are exposed at the prefab level.

## Main functions
### `dohiremerms(inst, giver, item)`
*   **Description:** Handles the core hiring logic when a valid item is given to a Merm. It sets maximum loyalty time, adds loyalty based on food value, updates royal bonuses (if a King is present), and may hire additional nearby Merms if the initial hire succeeds.
*   **Parameters:**  
    `inst` (Entity) - The Merm instance receiving the item.  
    `giver` (Entity) - The entity giving the item (typically a player).  
    `item` (Entity) - The item being offered (typically food or a fish).
*   **Returns:** Nothing.
*   **Error states:** No explicit error returns; logic checks are made internally to prevent double-hiring and ensures the target is not a Merm King candidate.

### `UpdateDamageAndHealth(inst)`
*   **Description:** Dynamically recalculates and applies the Merm's damage and health based on world state (e.g., presence of a Merm King) and minion type (regular, guard, lunar).
*   **Parameters:**  
    `inst` (Entity) - The Merm instance to update.
*   **Returns:** Nothing.

### `RoyalUpgrade(inst)`
*   **Description:** Increases the Merm's scale and updates combat parameters when a Merm King is present in the world.
*   **Parameters:**  
    `inst` (Entity) - The Merm instance to upgrade.
*   **Returns:** Nothing.
*   **Error states:** Early exit if the Merm is dead.

### `RoyalDowngrade(inst)`
*   **Description:** Reverts Merm scale and combat stats when the Merm King is no longer present.
*   **Parameters:**  
    `inst` (Entity) - The Merm instance to downgrade.
*   **Returns:** Nothing.
*   **Error states:** Early exit if the Merm is dead.

### `RoyalGuardUpgrade(inst)`
*   **Description:** For Merm Guards only. Upgrades the guard's build animation and scale to reflect royal status.
*   **Parameters:**  
    `inst` (Entity) - The Merm Guard instance to upgrade.
*   **Returns:** Nothing.
*   **Error states:** Early exit if the Merm Guard is dead.

### `RoyalGuardDowngrade(inst)`
*   **Description:** For Merm Guards only. Downgrades the guard's build animation and scale when the Merm King is absent.
*   **Parameters:**  
    `inst` (Entity) - The Merm Guard instance to downgrade.
*   **Returns:** Nothing.
*   **Error states:** Early exit if the Merm Guard is dead.

### `DoLunarMutation(inst)`
*   **Description:** Transforms a standard Merm into a Lunar Merm, transferring health, inventory, and loyalty state. Used when a Lunar Merm consumes Moon Glass.
*   **Parameters:**  
    `inst` (Entity) - The base Merm to mutate.
*   **Returns:** `lunarmerm` (Entity) - The newly spawned Lunar Merm prefab instance.
*   **Error states:** If `inst` is dead, returns `nil` without mutation.

### `DoLunarRevert(inst)`
*   **Description:** Reverts a Lunar Merm back to its base form (or Merm Guard variant) upon losing its leader.
*   **Parameters:**  
    `inst` (Entity) - The Lunar Merm to revert.
*   **Returns:** `merm` (Entity) - The newly spawned base Merm instance.
*   **Error states:** If `inst` is dead or already reverting, returns `nil`.

### `spawn_shadow_merm(inst)`
*   **Description:** Spawns a Shadow Merm when a Shadow-aligned character kills a Merm while the "Shadow Allegiance" skill is active.
*   **Parameters:**  
    `inst` (Entity) - The Merm that just died.
*   **Returns:** Nothing.

### `TestForLunarMutation(inst, item)`
*   **Description:** Checks if a given item is Moon Glass and triggers Lunar Mutation if so.
*   **Parameters:**  
    `inst` (Entity) - The Merm instance.  
    `item` (Entity) - The item being processed.
*   **Returns:** Nothing.

### `GetOtherMerms(inst, radius, maxcount, giver)`
*   **Description:** Finds up to `maxcount` nearby Merms, prioritizing those with low/no loyalty. Used to hire multiple Merms simultaneously when feeding one.
*   **Parameters:**  
    `inst` (Entity) - The reference Merm (usually the one being fed).  
    `radius` (number) - Search radius.  
    `maxcount` (number) - Maximum number of Merms to return.  
    `giver` (Entity) - The entity giving the item, used for alignment checks.
*   **Returns:** `merms_valid` (table of Entities) - Sorted list of eligible Merms.

## Events & listeners
- **Listens to:**  
  `attacked`, `attackdodged`, `suggest_tree_target`, `entitysleep`, `entitywake`, `loseloyalty`, `stopfollowing`, `gainloyalty`, `startfollowing`, `droppedtarget`, `newcombattarget`, `itemget`, `unequip`, `equip`, `timerdone`, `onmermkingcreated_anywhere`, `onmermkingdestroyed_anywhere`, `onattackother`, `oneat`, `planarbuffeddirty`, `loseloyalty` (shadow-specific).  
- **Pushes:**  
  `cheer`, `disapproval`, `makefriend`, `mutated`, `demutated`, `detachchild`, `shadowmerm_spawn`, `onmermkingcreated`, `onmermkingdestroyed`, `onwakeup`, `dropitem`.