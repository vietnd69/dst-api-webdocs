---
id: knight
title: Knight
description: A chess-themed hostile entity with multiple variants (normal, nightmare, and Yoth horseman) that engages in combat, follows leaders, and supports dynamic behavior changes based on game context.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8533aeb3
system_scope: entity
---

# Knight

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `knight` prefab is a versatile hostile entity implementation supporting multiple variants through a factory pattern. It uses components for combat, movement, health, and behavior management, and adapts its behavior based on game state (e.g., difficulty, leader alignment, or Aporkalypse context). The prefab also includes specialized logic for the Yoth variant (The Gilded Knights), which interacts with group behavior, horseman identity, and flee mechanics.

The `MakeKnight` factory function constructs the base entity, then applies variant-specific initialization callbacks (`common_postinit` and `master_postinit`). Connected components include `combat`, `follower`, `health`, `lootdropper`, `sleeper`, `locomotor`, `inspectable`, `entitytracker`, and `migrationpetsoverrider`. The knight variant logic heavily uses `clockwork_common` utilities and `RuinsRespawner` integration.

## Usage example
```lua
-- Instantiate a standard knight
local knight = Prefab("knight")
-- The factory function MakeKnight is used internally in the source.
-- For modding, create a new variant by defining custom postinit functions:
local function my_postinit(inst)
    inst:AddTag("custom_knight")
end

local myKnight = MakeKnight("my_knight", my_postinit, nil, my_assets, my_prefabs)
```

## Dependencies & tags
**Components used:**  
`combat`, `follower`, `health`, `lootdropper`, `sleeper`, `locomotor`, `inspectable`, `entitytracker`, `migrationpetsoverrider`, `named`, `unwrappable`, `updatelooper`, `embarker`, `drownable`, `acidinfusible`, `knownlocations`

**Tags:**  
Adds: `chess`, `hostile`, `knight`, `monster`, `gilded_knight`, `cavedweller`, `shadow_aligned`, `_named` (temporary, removed during master_init)  
Removes: `_named` (in YOTH master_postinit), `hostile`, `alwayshostile` (when made friendly)  
Checks: `alwayshostile`, `hostile`, `cavedweller`, `shadow_aligned`, `gilded_knight`

## Properties
No public properties are defined in the constructor. Instance state is stored as direct fields (e.g., `inst.horseman_type`, `inst.friendly`, `inst.fled`, `inst.canjoust`, `inst._playingmusic`). These are not component properties and are not part of the ECS component API.

## Main functions
### `Retarget(inst)`
* **Description:** Convenience wrapper that delegates retargeting logic to `clockwork_common.Retarget` with a fixed distance threshold (`TUNING.KNIGHT_TARGET_DIST`).
* **Parameters:** `inst` (EntityInstance) — the knight entity requesting a new target.
* **Returns:** Entity instance or `nil`, depending on the result of `clockwork_common.Retarget`.
* **Error states:** Returns `nil` if no valid targets are found.

### `MakeKnight(name, common_postinit, master_postinit, _assets, _prefabs)`
* **Description:** Factory function to create a knight prefab with variant-specific setup. Builds the entity, attaches components, sets up common behavior (e.g., combat stats, state graph, brain), and allows extensions via callbacks.
* **Parameters:**  
  - `name` (string) — prefab name (e.g., `"knight"`, `"knight_nightmare"`, `"knight_yoth"`).  
  - `common_postinit` (function?) — optional callback run before `inst.entity:SetPristine()`. Used for early-stage shared setup.  
  - `master_postinit` (function?) — optional callback run after component setup and before returning. Used for non-`mastersim`-safe logic.  
  - `_assets` (table) — list of assets.  
  - `_prefabs` (table) — list of required prefabs.
* **Returns:** Prefab instance (via `Prefab()` call).
* **Error states:** None documented. Non-fatal early exits may occur if `common_postinit` or `master_postinit` return early.

### `YOTH_SetHorsemanOfTheAporkalypse(inst, typename)`
* **Description:** Dynamically changes the knight's visual build and name based on the horseman type (CONQUEST, WAR, FAMINE, or DEATH). Clears previous build overrides and applies new ones.
* **Parameters:**  
  - `inst` (EntityInstance) — the knight entity.  
  - `typename` (string) — one of `"CONQUEST"`, `"WAR"`, `"FAMINE"`, `"DEATH"`.
* **Returns:** Nothing.
* **Error states:** No-op if `typename` matches current `inst.horseman_type`.

### `YOTH_GetStatus(inst, viewer)`
* **Description:** Returns a string status for `inspectable` based on relationship to the viewer.
* **Parameters:**  
  - `inst` (EntityInstance) — the knight.  
  - `viewer` (EntityInstance) — the inspecting entity.
* **Returns:**  
  `"FOLLOWING"` if the knight's leader is the viewer,  
  `"FOLLOWING_OTHER"` if the knight follows another entity,  
  `nil` otherwise.

### `YOTH_LootSetupFn(lootdropper)`
* **Description:** Custom loot logic for the Yoth knight. If this knight is the last surviving horseman, it drops unique loot (e.g., `yoth_knighthat`, `armor_yoth_knight`) and marks others as `fled` to prevent duplicate drops.
* **Parameters:** `lootdropper` (LootDropper component instance).
* **Returns:** Nothing.
* **Error states:** None documented.

### `YOTH_OnLootPrefabSpawned(inst, data)`
* **Description:** Event callback that wraps four `lucky_goldnugget` prefabs into a spawned `redpouch_yoth` loot item using `unwrappable:WrapItems`.
* **Parameters:**  
  - `inst` (EntityInstance) — the knight.  
  - `data` (table?) — loot drop data (expected to contain `loot` field).
* **Returns:** Nothing.

### `YOTH_OffsetFromFn(inst, x, y, z)`
* **Description:** Calculates a spawn offset for migration pets to avoid holes when the knight is hostile. Uses `FindWalkableOffset` in concentric rings.
* **Parameters:**  
  - `inst` (EntityInstance) — the knight.  
  - `x`, `y`, `z` (numbers) — world coordinates.
* **Returns:** (x, y, z) offset vector, or `(0, 0, 0)` if no valid offset found or knight is friendly.

### `YOTH_MakeFriendly(inst)`
* **Description:** Converts the Yoth knight to friendly state: removes `hostile` and `alwayshostile` tags, cancels hostile-transition tasks, and clears `OnEntityWake`/`OnEntitySleep`.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Nothing.

### `YOTH_MakeHostile(inst, fromload)`
* **Description:** Makes the Yoth knight hostile again (unless `fromload` is used in special contexts). Sets tags, configures `OnEntitySleep`/`OnEntityWake` to delete the group on sleep.
* **Parameters:**  
  - `inst` (EntityInstance).  
  - `fromload` (boolean) — whether invoked during save load; affects delay timing.
* **Returns:** Nothing.

### `YOTH_GetGroupTarget(inst)`
* **Description:** Finds a valid combat target near any knight in the Yoth group (within `TUNING.YOTH_KNIGHT_FLEE_RADIUS`) to trigger group engagement.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Valid target instance or `nil`.

### `YOTH_Retarget(inst)`
* **Description:** Priority retarget function for Yoth knights. First attempts to use a group target; otherwise falls back to `clockwork_common.Retarget` with extra filtering.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Target entity or `nil`.

### `YOTH_KeepTarget(inst, target)`
* **Description:** Determines whether to keep the current target based on group alignment, flee radius, and ally status.
* **Parameters:**  
  - `inst` (EntityInstance).  
  - `target` (EntityInstance).
* **Returns:** `true` if target should be kept, `false` otherwise.

### `YOTH_GetDamageTakenMultiplier(inst, attacker, weapon)`
* **Description:** Returns a damage multiplier based on whether the attacker is a player.
* **Parameters:**  
  - `inst` (EntityInstance).  
  - `attacker` (EntityInstance).  
  - `weapon` (Component or nil).
* **Returns:** Number — player multiplier (`TUNING.YOTH_KNIGHT_DAMAGE_TAKEN_MULT_PLAYER`) or standard multiplier (`TUNING.YOTH_KNIGHT_DAMAGE_TAKEN_MULT`).

### `YOTH_OnSave(inst, data)`
* **Description:** Saves horseman type and friendliness state for persistence.
* **Parameters:**  
  - `inst` (EntityInstance).  
  - `data` (table) — save data table to populate.
* **Returns:** Nothing.

### `YOTH_OnLoad(inst, data)`
* **Description:** Restores horseman type and hostility state upon loading.
* **Parameters:**  
  - `inst` (EntityInstance).  
  - `data` (table?) — loaded save data.
* **Returns:** Nothing.

### `YOTH_PostUpdateFacing(inst)`
* **Description:** Handles lance layer visibility (`LANCE_L` vs `LANCE_R`) based on local facing direction, synced via `inst.lanceflip` netvar.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Nothing.

### `YOTH_StartTrackingFacing(inst)` / `YOTH_StopTrackingFacing(inst)`
* **Description:** Registers or unregisters `YOTH_PostUpdateFacing` in the `updatelooper`'s post-update list.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Nothing.

### `YOTH_OnAttacked(inst, data)`
* **Description:** Event handler to detect when the knight is attacked by its leader (e.g., the Princess hat), and triggers hostile conversion if so.
* **Parameters:**  
  - `inst` (EntityInstance).  
  - `data` (table) — attack event data containing `attacker`.
* **Returns:** Nothing.

### `YOTH_PushMusic(inst)`
* **Description:** (Client-side only) Triggers music event `"knight_yoth"` when the player approaches a hostile Yoth knight.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` — shared logic via `clockwork_common.OnAttacked` and YOTH-specific `YOTH_OnAttacked`.  
  - `newcombattarget` — via `clockwork_common.OnNewCombatTarget`.  
  - `entitysleep`, `entitywake` — to register/deregister facing tracking task.  
  - `loot_prefab_spawned` — for YOTH loot wrapping logic.  
  - `ms_register_yoth_princess` (world event) — to drop target if the registered princess becomes a target.

- **Pushes:**  
  - `wrappeditem` — fired on wrapped items via `unwrappable:WrapItems`.  
  - `droppedtarget` — fired via `combat:DropTarget` when no next target exists.  
  - `triggeredevent` — client-only for `"knight_yoth"` music trigger.
