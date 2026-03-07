---
id: possessedaxe
title: Possessedaxe
description: Manages the transformation and reversion logic for Lucy, a possessed axe that links to a woodcutter player and reverts to a standard axe under specific conditions.
tags: [inventory, transformation, player, combat, persistence]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5556986d
system_scope: inventory
---
# Possessedaxe

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Possessedaxe` is a component that manages the lifecycle of Lucy, a special axe that transforms when held by a valid woodcutter player (`"woodcutter"` tag). It tracks player association, handles delayed reversion upon player disconnect or death, and ensures only one Lucy exists per player. The component integrates closely with `inventory`, `inventoryitem`, `equippable`, and `finiteuses` components to manage item state during possession, dropping, and reversion.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("axe")
inst:AddComponent("possessedaxe")
inst:AddComponent("equippable")
inst:AddComponent("inventoryitem")
inst:AddComponent("finiteuses")
inst.components.possessedaxe.revert_prefab = "axe"
inst.components.possessedaxe.revert_uses = 10
inst.components.possessedaxe.revert_fx = "lucy_transform"
```

## Dependencies & tags
**Components used:** `inventory`, `inventoryitem`, `equippable`, `finiteuses`
**Tags:** Checks for `"woodcutter"` (owner), `"player"` (owner), `"usesdepleted"` (via `finiteuses`), `"equippable"` (via `equippable:IsEquipped()`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `revert_prefab` | string | `"axe"` | Prefab name to spawn on reversion. |
| `revert_uses` | number? | `nil` | Uses value to restore to the reverted item via `finiteuses:SetUses`. |
| `revert_fx` | string? | `nil` | FX prefab name to spawn during reversion. |
| `revert_time` | number | `TUNING.LUCY_REVERT_TIME` | Delay in seconds before auto-reverting after player loss. |
| `player` | Entity? | `nil` | Current linked player entity (if any). |
| `userid` | string? | `nil` | User ID of the linked player, preserved across reconnects. |
| `currentowner` | Entity? | `nil` | Current inventory item owner (e.g., player). |
| `checkownertask` | Task? | `nil` | Deferred task to validate the owner. |
| `waittask` | Task? | `nil` | Task for delayed reversion (e.g., timeout). |
| `waittotime` | number? | `nil` | Absolute game time when reversion triggers. |
| `oncontainerpickedup` | function? | `nil` | Listener callback for owner container events. |

## Main functions
### `WaitForPlayer(userid, delay)`
* **Description:** Initiates a reversion timer for the axe if ownership is lost. The axe remains associated with `userid` and will revert after `delay` seconds unless re-linked. Can be cancelled via `StopWaitingForPlayer`.
* **Parameters:** 
  - `userid` (string?) — User ID to track; `nil` clears the listener.
  - `delay` (number?) — Revert delay in seconds; defaults to `revert_time` if `nil`.
* **Returns:** Nothing.

### `StopWaitingForPlayer()`
* **Description:** Cancels the pending reversion timer and removes the `"ms_playerjoined"` event listener.
* **Parameters:** None.
* **Returns:** Nothing.

### `LinkToPlayer(player)`
* **Description:** Associates the axe with a specific player entity. Updates `player` and `userid` fields, removes old listeners, sets up new `onremove` and `"possessedaxe"` listeners on the player, and fires `"axepossessedbyplayer"` with the player entity. Reverts if the player already holds another Lucy.
* **Parameters:** 
  - `player` (Entity?) — Player entity to link; `nil` drops current association.
* **Returns:** Nothing.

### `Drop()`
* **Description:** Drops the axe from its owner's inventory if present and valid. Calls `Inventory:DropItem(self.inst, true, true)`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Revert()`
* **Description:** Spawns the `revert_prefab` (typically `"axe"`), copies over `revert_uses` (if specified), and transfers the item to the same position or inventory slot as the original. Handles equipped, held, and container-dropped cases. Optionally spawns `revert_fx`.
* **Parameters:** None.
* **Returns:** Entity — The newly spawned reverted item (or `self.inst` if reversion fails).
* **Error states:** Returns early with `self.inst` if `SpawnPrefab(revert_prefab)` fails.

### `OnSave()`
* **Description:** Serializes component state for persistence. Includes `prefab`, `uses`, `userid`, and remaining time for pending reversion.
* **Parameters:** None.
* **Returns:** table? — A table with keys `prefab`, `uses`, `userid`, and `waittimeremaining`, or `nil` if all values are `nil`/empty.

### `OnLoad(data)`
* **Description:** Restores component state after a save load. Restores `revert_prefab` and `revert_uses`, and resumes waiting for a player if needed.
* **Parameters:** 
  - `data` (table?) — Save data from `OnSave`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing current state.
* **Parameters:** None.
* **Returns:** string — A formatted string like `"held: player entity player: player entity timeout: 12.34"`.

## Events & listeners
- **Listens to:** 
  - `"onputininventory"` — Triggers `OnChangeOwner` on item placement.
  - `"ondropped"` — Triggers `OnChangeOwner` on drop.
  - `"onremove"` — Removes `onplayerremoved` callback when linked player is removed.
  - `"possessedaxe"` — Triggers `onplayerpossessedaxe` (calls `Revert`) if another Lucy is obtained.
  - `"ms_playerjoined"` — Triggers `onplayerjoined` when a player rejoins the world.

- **Pushes:** 
  - `"axerejectedowner"` — Fired when the owner is not a woodcutter.
  - `"axerejectedotheraxe"` — Fired when another possessed axe is present in the owner’s inventory.
  - `"axepossessedbyplayer"` — Fired on successful linking or clearing of the player link.
