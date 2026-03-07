---
id: pocketwatch
title: Pocketwatch
description: Provides spell-casting functionality for pocketwatch items, enabling healing, resurrection, recall, and warp effects via shared core logic and component interactions.
tags: [inventory, teleport, resurrect, healing]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 702b3d06
system_scope: inventory
---

# Pocketwatch

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pocketwatch` system provides prefabs with spell-casting behavior across four distinct variants: `pocketwatch_heal`, `pocketwatch_revive`, `pocketwatch_warp`, and `pocketwatch_recall`. It uses a shared common module (`pocketwatch_common.lua`) and integrates with components such as `rechargeable`, `recallmark`, `positionalwarp`, `health`, `oldager`, `hauntable`, `lootdropper`, `inventoryitem`, and `trader`. Each variant implements unique cast logic while reusing the underlying casting framework defined in `PocketWatchCommon.common_fn`.

## Usage example
```lua
local inst = SpawnPrefab("pocketwatch_heal")
if inst.components.rechargeable:GetCharge() == 0 then
    -- Cannot cast until recharged
else
    local success, reason = inst.components.pocketwatch:CastSpell(player, player)
end
```

## Dependencies & tags
**Components used:** `rechargeable`, `recallmark`, `positionalwarp`, `health`, `oldager`, `hauntable`, `lootdropper`, `inventoryitem`, `rider`, `talker`, `builder`, `trader`.  
**Tags added:** `pocketwatch_heal`, `pocketwatch_revive`, `pocketwatch_warp`, `pocketwatch_recall`, `pocketwatch_mountedcast`, `pocketwatch_warp_casting`, `pocketwatch_warp`, `gemsocket`, `recall_unmarked`, `pocketwatchcaster`, `playerskeleton`.  
**Tags checked:** `playerghost`, `reviving`, `ignoretalking`, `ignoretalking`, `pocketwatchcaster`, `structure`.

## Properties
No public properties are directly defined in the `pocketwatch` prefabs beyond what is exposed by the components.

## Main functions
### `PocketWatchCommon.common_fn`
*   **Description:** Shared factory function that initializes the core pocketwatch behavior and attaches required components (`rechargeable`, `recallmark`, `inventoryitem`, etc.) to the instance.
*   **Parameters:** `baseprefab` (string), `build` (string), `dospellfn` (function), `is_rechargeable` (boolean), `tags` (table of strings). The `dospellfn` is the variant-specific cast logic.
*   **Returns:** The configured `inst`.
*   **Error states:** None.

### `PocketWatchCommon.MakeRecallMarkable`
*   **Description:** Attaches `recallmark` component behavior and sets up serialization for recall position data.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `Heal_DoCastSpell(inst, doer)`
*   **Description:** Heals the caster and stops time-based damage; plays associated FX and resets cooldown.
*   **Parameters:** `doer` (Entity) — the entity casting the spell.
*   **Returns:** `true` on success; nothing on failure.
*   **Error states:** Returns nothing if `doer` has no `health` component or is dead.

### `Revive_DoCastSpell(inst, doer, target)`
*   **Description:** Initiates respawn from ghost state for a targeted player. May transfer a reviver prefab if across shards.
*   **Parameters:** `target` (Entity) — must be a valid `playerghost` not already `reviving`.
*   **Returns:** `true` on success; `false, "REVIVE_FAILED"` otherwise.
*   **Error states:** Returns `false` if target does not meet `Revive_CanTarget` conditions or watch is inactive.

### `Revive_CanTarget(inst, doer, target)`
*   **Description:** Client-side predicate to determine if a target is eligible for revival.
*   **Parameters:** `target` (Entity) — candidate to revive.
*   **Returns:** `true` if `target` is a `playerghost` and not `reviving`; otherwise `false`.

### `Recall_DoCastSpell(inst, doer, target, pos)`
*   **Description:** Either marks a position or warps the caster to a previously marked position using `recallmark`.
*   **Parameters:** `doer` (Entity) — the caster.
*   **Returns:** `true` on mark/cast success; `false, reason` on failure (e.g., `SHARD_UNAVAILABLE`, `WARP_NO_POINTS_LEFT`).

### `Warp_DoCastSpell(inst, doer)`
*   **Description:** Warps the caster to the last saved position stored in `positionalwarp`.
*   **Parameters:** `doer` (Entity).
*   **Returns:** `true` on warp success; `false, reason` (`NO_TELEPORT_ZONE`, `WARP_NO_POINTS_LEFT`) otherwise.

### `Revive_OnHaunt(inst, haunter)`
*   **Description:** Handles haunt event; if the haunter is a `pocketwatchcaster`, attempts to revive self and drops broken tool; otherwise launches away.
*   **Parameters:** `haunter` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `activateresurrection` — triggers resurrection cleanup (removes player skeleton and drops loot).  
  - `onputininventory`, `onownerputininventory`, `ondropped`, `onownerdropped`, `onremove` — for `pocketwatch_warp` to show/hide marker.  
- **Pushes:**  
  - `respawnfromghost` — signals intent to respawn the ghost player.  
  - `show_warp_marker`, `hide_warp_marker` — notify client to display or hide warp marker.