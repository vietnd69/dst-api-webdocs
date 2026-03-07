---
id: minigame_spectator
title: Minigame Spectator
description: Attaches an entity as a passive spectator to a minigame, automatically removing itself when the minigame ends or is deactivated.
tags: [minigame, spectator, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b0d4298d
system_scope: entity
---

# Minigame Spectator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MinigameSpectator` is an entity component that allows an entity to observe a minigame passively. When attached, it subscribes to the minigame's lifecycle events (`onremove` and `ms_minigamedeactivated`) and automatically unloads itself upon minigame termination. Additionally, if the entity is in combat and targeting a player, it drops the current target when watching begins—presumably to prevent aggression during minigame participation.

This component does not manage gameplay logic itself; it solely handles the entity’s *spectator state* relative to a minigame instance.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("minigame_spectator")
inst.components.minigame_spectator:SetWatchingMinigame(some_minigame_prefab)
-- Once the minigame ends or is removed, the component cleans itself up
```

## Dependencies & tags
**Components used:** `combat` (for dropping targets during `SetWatchingMinigame`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `minigame` | `Entity` or `nil` | `nil` | Reference to the minigame entity being watched; set via `SetWatchingMinigame`. |

## Main functions
### `SetWatchingMinigame(minigame)`
* **Description:** Begins observation of the specified minigame. Registers listeners to clean up the component when the minigame ends. Also drops any combat target if the entity was attacking a player.
* **Parameters:** `minigame` (`Entity`) — the minigame entity to watch.
* **Returns:** Nothing.
* **Error states:** No-op if `minigame` is `nil` or already assigned.

### `GetMinigame()`
* **Description:** Returns the currently watched minigame instance.
* **Parameters:** None.
* **Returns:** `Entity` or `nil` — the minigame reference, or `nil` if none is set.

### `GetDebugString()`
* **Description:** Provides a debug-friendly string representation of the component’s state.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"Is Watching: <minigame>"` (uses `tostring(minigame)`).

### `OnRemoveFromEntity()`
* **Description:** Cleanup callback invoked when the component is removed from its entity. Unsubscribes from minigame events to avoid dangling callbacks.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` (from minigame) — triggers automatic component removal.  
  - `ms_minigamedeactivated` (from minigame) — triggers automatic component removal.  
- **Pushes:** None.
