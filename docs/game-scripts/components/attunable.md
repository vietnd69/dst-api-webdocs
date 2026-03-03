---
id: attunable
title: Attunable
description: Manages attunement relationships between an entity and players, supporting online/offline tracking and networked persistence.
tags: [network, persistence, player]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d9a497e2
system_scope: network
---

# Attunable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Attunable` enables an entity to track which players are "attuned" to it — meaning they have formed a persistent gameplay link (e.g., to a Resurrector or remoteresurrector). It maintains two collections: `attuned_players` (currently online) and `attuned_userids` (offline), enabling persistence across sessions and proper cleanup on player logout. It integrates with the `attuner` component on players to enforce attunement constraints and supports optional callback hooks for attunement cost, linking, and unlinking.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("attunable")
inst.components.attunable:SetAttunableTag("resurrection_device")
inst.components.attunable:SetOnAttuneCostFn(function(inst, player)
    return player.components.inventory:HasItem("ghost pearl"), "needs ghost pearl"
end)
inst.components.attunable:SetOnLinkFn(function(inst, player) print(player.name.." linked") end)
inst:PushEvent("attune_target")
```

## Dependencies & tags
**Components used:** `attuner` (checked on player), `attunable_classified` (internal prefab used for tracking)  
**Tags:** Adds `ATTUNABLE_ID_`..GUID tag to the entity; optionally applies `attunable_tag` to the internal classified prefab.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Owner entity for this component. |
| `attuned_players` | table | `{}` | Map of player → classified prefab for currently online attuned players. |
| `attuned_userids` | table | `{}` | Map of `userid` (string) → `true` for offline attuned players. |
| `attunable_tag` | string or `nil` | `nil` | Tag used to group attunements (e.g., only one attunement per group allowed). |
| `onattunecostfn` | function or `nil` | `nil` | Callback `(inst, player) → success, reason` to check attunement cost. |
| `onlinkfn` | function or `nil` | `nil` | Callback `(inst, player, isloading)` fired after successful link. |
| `onunlinkfn` | function or `nil` | `nil` | Callback `(inst, player, isloading)` fired after unlink. |

## Main functions
### `OnRemoveEntity()`
* **Description:** Cleans up all attunement state, removes the entity's attunement tag, and unattunes any players before removal. Also removes the event listener for `ms_playerjoined`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `GetAttunableTag()`
* **Description:** Returns the current attunement group tag assigned to this entity.
* **Parameters:** None.
* **Returns:** string or `nil`.

### `SetAttunableTag(tag)`
* **Description:** Sets the attunement group tag. Used to enforce "one attunement per group" logic via `attuner`.
* **Parameters:** `tag` (string) – group identifier (e.g., `"resurrection_device"`).
* **Returns:** Nothing.

### `SetOnAttuneCostFn(fn)`
* **Description:** Registers a function to be called before linking a player; typically used to consume resources.
* **Parameters:** `fn` (function) – signature `(inst, player) → success (boolean), reason (string?)`.
* **Returns:** Nothing.

### `SetOnLinkFn(fn)`
* **Description:** Registers a function called after a player successfully attunes (links).
* **Parameters:** `fn` (function) – signature `(inst, player, isloading)`.
* **Returns:** Nothing.

### `SetOnUnlinkFn(fn)`
* **Description:** Registers a function called after a player is unlinked (unattuned).
* **Parameters:** `fn` (function) – signature `(inst, player, isloading)`.
* **Returns:** Nothing.

### `IsAttuned(player)`
* **Description:** Checks if a specific player is currently attuned to this entity.
* **Parameters:** `player` (`Entity` with `userid`) – the player to check.
* **Returns:** boolean – `true` if player is in `attuned_players`.

### `CanAttune(player)`
* **Description:** Validates if the player is allowed to attune: non-empty userid, has `attuner` component, and is not already attuned.
* **Parameters:** `player` (`Entity`) – the candidate player.
* **Returns:** boolean – `true` if attunement is possible.

### `LinkToPlayer(player, isloading)`
* **Description:** Attempts to link a player to this entity. If `isloading` is `true`, cost callbacks are skipped (for persistence).
* **Parameters:**  
  `player` (`Entity`) – the player to link.  
  `isloading` (boolean) – whether the link is due to world load (skips cost checks).
* **Returns:** `true` on success; `false, reason` on failure (if cost callback fails).
* **Error states:** Returns `false` if `CanAttune(player)` fails or cost callback returns `false`.

### `UnlinkFromPlayer(player, isloading)`
* **Description:** Unattunes a player and removes their tracking. No-op if not attuned.
* **Parameters:**  
  `player` (`Entity`) – the player to unlink.  
  `isloading` (boolean, optional) – passed to unlink callback.
* **Returns:** Nothing.
* **Error states:** Returns early with no effect if player is not attuned.

### `OnSave()`
* **Description:** Prepares attunement state for world save. Returns serialized data with list of linked userids.
* **Parameters:** None.
* **Returns:** `{ links = { "userid1", "userid2", ... } }` if any links exist, otherwise `nil`.

### `OnLoad(data)`
* **Description:** Restores attunement state from save data. Links currently-online players, records offline ones.
* **Parameters:** `data` (table or `nil`) – the save data from `OnSave()`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted string listing attuned online players and offline userids for debugging.
* **Parameters:** None.
* **Returns:** string – multiline debug output.

## Events & listeners
- **Listens to:**
  - `ms_playerjoined` (on `TheWorld`) – triggers re-attunement for previously offline players.
  - `onremove` (on each `attuned player`) – removes offline tracking entry.
  - `attuned` (on each `attuned player`) – detects when the player attunes to another same-tag entity and triggers unlink.
- **Pushes:**
  - None directly; players push `attuned` events which this component reacts to internally.
