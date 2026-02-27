---
id: possessedaxe
title: Possessedaxe
description: This component manages the transformation, ownership validation, and player linking logic for Lucy the possessed axe, including its reversion to a standard axe when conditions are no longer met.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 5556986d
---

# Possessedaxe

## Overview
The `possessedaxe` component implements the behavior of Lucy—a special axe that transforms under specific conditions (e.g., wielded by a Woodie character). It validates ownership (must be a "woodcutter"), prevents multiple Lucy axes per player, links the axe to the player for persistence across world reloads or death, and handles reversion to a standard axe when the conditions are no longer satisfied.

## Dependencies & Tags
**Component dependencies:**
- `inventoryitem` — used to retrieve owner and container information.
- `inventory` — used to check equipped items and drop items.
- `equippable` — used to determine if the item is equipped during reversion.
- `finiteuses` — used to preserve uses during reversion.

**Tags handled:**
- `woodcutter` — required for the axe to remain possessed.
- `player` — checked to determine whether to link to a player.

**Events listened to (on `inst`):**
- `"onputininventory"`
- `"ondropped"`
- `"onremove"` (on linked player)
- `"possessedaxe"` (on linked player)
- `"ms_playerjoined"` (on `TheWorld`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `revert_prefab` | `string` | `"axe"` | Prefab name to spawn when reverting (e.g., after timeout or invalid owner). |
| `revert_uses` | `number?` | `nil` | Number of uses to transfer to the reverted axe (if applicable). |
| `revert_fx` | `string?` | `nil` | FX prefab name to spawn during reversion (optional). |
| `revert_time` | `number` | `TUNING.LUCY_REVERT_TIME` | Default timeout duration (seconds) before reverting if the player is missing. |
| `transform_fx` | `string?` | `nil` | FX prefab to use during transformation (currently unused). |
| `player` | `Entity?` | `nil` | Reference to the linked player entity (may be `nil` if not currently possessed or dead). |
| `userid` | `string?` | `nil` | Persistent user ID used to re-link after disconnects or world reloads. |
| `currentowner` | `Entity?` | `nil` | Current inventory container owner (grandowner of `inventoryitem`). |
| `oncontainerpickedup` | `function?` | `nil` | Callback for `"onputininventory"` event on the container. |
| `checkownertask` | `Task?` | `nil` | Delayed task to re-check owner validity after item movement. |
| `waittask` | `Task?` | `nil` | Timer task for waiting before reverting if the player is unreachable. |
| `waittotime` | `number?` | `nil` | Absolute game time when the wait task should trigger reversion. |

## Main Functions

### `WaitForPlayer(userid, delay)`
* **Description:** Sets up a timeout to wait for a specific player (by `userid`) to reappear (e.g., after disconnection or death). If the player does not rejoin within `delay` seconds (defaulting to `revert_time`), the axe reverts. Also manages `"ms_playerjoined"` event listener.
* **Parameters:**
  - `userid` (`string?`): User ID of the player to wait for. If `nil`, the wait is cancelled and `"ms_playerjoined"` listener is removed.
  - `delay` (`number?`): Time in seconds to wait before reverting. Defaults to `revert_time` if omitted.

### `StopWaitingForPlayer()`
* **Description:** Cancels the current wait timer and cleans up the `"ms_playerjoined"` event listener if active. Resets `userid` to `nil`.

### `LinkToPlayer(player)`
* **Description:** Associates the axe with a player. Removes old event bindings (if any), sets `player` and `userid`, and establishes `"onremove"` and `"possessedaxe"` listeners on the player. If `player` is `nil`, clears the link and pushes `"axepossessedbyplayer"` event with `nil`.

### `Drop()`
* **Description:** Drops the item from the current owner’s inventory (if possible), forcing it into the world. Called when the axe is rejected due to invalid ownership or duplicate possession.

### `Revert()`
* **Description:** Transforms the axe back into its base form (`revert_prefab`, usually `"axe"`), preserving uses and optionally spawning FX. Handles removal of the possessed axe and placement of the new one in the correct location (world, inventory slot, or equipped slot). Returns the new axe instance.

### `OnSave()`
* **Description:** Returns a table of essential persistent state (prefab, uses, userid, and remaining wait time) for saving the component across sessions. Returns `nil` if no data needs saving.

### `OnLoad(data)`
* **Description:** Restores state after loading from save data. If needed, resumes waiting for the player (e.g., after a reload while disconnected) using `WaitForPlayer`.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string summarizing the current state: current owner, linked player, and remaining timeout (seconds).

## Events & Listeners
- **Listens for `"onputininventory"`** — triggers `OnChangeOwner`.
- **Listens for `"ondropped"`** — triggers `OnChangeOwner`.
- **Listens for `"ms_playerjoined"` on `TheWorld`** — triggers `onplayerjoined` when a player joins to attempt re-linking.
- **Listens for `"onremove"` on linked player** — triggers `onplayerremoved`.
- **Listens for `"possessedaxe"` on linked player** — triggers `onplayerpossessedaxe`.

- **Pushes events:**
  - `"axerejectedowner"` — when the owner no longer meets the `"woodcutter"` requirement.
  - `"axerejectedotheraxe"` — when the player already has a possessed axe.
  - `"axepossessedbyplayer"` — when the axe becomes linked to a player (or cleared when unlinked).