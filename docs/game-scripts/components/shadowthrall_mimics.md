---
id: shadowthrall_mimics
title: Shadowthrall Mimics
description: Manages spontaneous spawning of item mimics for the Shadowthrall boss during Cavenights when shadow rifts are active.
tags: [boss, entity, spawn, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 0f527ebb
system_scope: world
---

# Shadowthrall Mimics

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`shadowthrall_mimics` is a world-scoped component responsible for managing mimic spawning behavior during the Shadowthrall encounter. It triggers random mimic spawns near active players when shadow rifts are present and it is a Cavenight, up to a cap defined by `TUNING.ITEMMIMIC_CAP`. It coordinates with the ` riftspawner` component to detect shadow-affinity rifts and monitors player activity to schedule and cancel spawn attempts.

This component exists only on the master simulation (`ismastersim`) and operates via periodic tasks per player. It relies heavily on `itemmimic_data` to determine valid mimic targets and integrates with the game’s event system for player and rift lifecycle events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shadowthrall_mimics")

-- Optional: trigger an immediate spawn attempt for a specific player
inst.components.shadowthrall_mimics:Debug_PlayerSpawns(player)

-- Optional: manually spawn a mimic for a specific item
inst.components.shadowthrall_mimics:SpawnMimicFor(some_item)

-- Check if mimic spawning is currently enabled
if inst.components.shadowthrall_mimics:IsEnabled() then
    print("Shadowthrall mimics are active!")
end
```

## Dependencies & tags
**Components used:** `riftspawner`  
**Tags:** Checks tags from `itemmimic_data.MUST_TAGS` and `itemmimic_data.CANT_TAGS` when evaluating mimic targets; adds `mimic` via the `itemmimic` component on spawned mimics.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | — | Reference to the entity owning this component (the Shadowthrall boss instance). |

## Main functions
### `IsTargetMimicable(target)`
* **Description:** Checks whether the given target entity is eligible to be mimicked, based on required and forbidden tags.
* **Parameters:** `target` (`GEntity`) — the entity to evaluate.
* **Returns:** `boolean` — `true` if the target has all required tags and none of the forbidden tags; otherwise `false`.

### `SpawnMimicFor(item)`
* **Description:** Attempts to spawn a new mimic as a copy of the given item, at a nearby valid location.
* **Parameters:** `item` (`GEntity`) — the entity to mimic.
* **Returns:** `boolean` — `true` if spawning succeeded; `false` otherwise (e.g., target not mimicable, no walkable space found).
* **Error states:** Early return with `false` if `item` already has an `itemmimic` component or if walkable offset cannot be found.

### `IsEnabled()`
* **Description:** Returns whether mimic spawning is currently enabled (i.e., when shadow rifts are active and it is a Cavenight).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if shadow rift modifiers are active.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing current mimic count and status.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"ShadowThrall Mimics: 2/6; ENABLED"`.

### `Debug_PlayerSpawns(player)`
* **Description:** Immediately schedules a mimic spawn attempt for the specified player, bypassing normal periodic task timing.
* **Parameters:** `player` (`GEntity`) — the player to trigger a spawn check for.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `ms_playerjoined` — adds a new player and starts/updates spawn attempts if needed.
  - `ms_playerleft` — removes a player and cancels their spawn task.
  - `ms_riftaddedtopool` — activates mimic spawning when a shadow-affinity rift is added.
  - `ms_riftremovedfrompool` — deactivates mimic spawning when the last shadow rift is removed.
  - `iscavenight` (world state) — monitors for changes to Cavenight state.
- **Pushes:** None.
