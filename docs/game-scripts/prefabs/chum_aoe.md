---
id: chum_aoe
title: Chum Aoe
description: Spawns and manages a temporary chum cloud that periodically drops chum pieces and attempts to attract fish schools in ocean areas.
tags: [fishing, environment, server]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dce49493
system_scope: environment
---

# Chum Aoe

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`chum_aoe` is a server-side-only prefab component that simulates a chum cloud used to attract ocean fish. It periodically spawns `chumpiece` entities over a limited area and attempts to summon a fish school once after a delay. The cloud automatically disintegrates after `DURATION` (20 seconds), removing all associated chum pieces. It is primarily used in ocean maps and interacts with the `schoolspawner` and `edible` components. This entity exists only on the master simulation and is non-persistent.

## Usage example
This component is instantiated internally by the game and not directly added by mods. It is created as part of the `chum_aoe` prefab when a player uses the chum item (e.g., from a chummed fishing rod). Example usage pattern (not modder-facing):
```lua
local chum = SpawnPrefab("chum_aoe")
chum.Transform:SetPosition(x, y, z)
chum.components.chum_aoe:SetThrower(player)
```

## Dependencies & tags
**Components used:** `edible`, `schoolspawner`, `timer`  
**Tags:** Adds `FX`, `NOCLICK`, `chum`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `thrower` | `GEntity` or `nil` | `nil` | The entity (usually a player) that threw the chum; passed to `SpawnSchool`. |
| `_chumpieces` | `table` | `{}` | Internal map of spawned `chumpiece` entities. Used to clean up on removal. |
| `_num_chumpieces` | `number` | `0` | Current count of active chum pieces. |
| `_remaining_fish_spawn_attempts` | `number` | `FISH_SPAWN_ATTEMPTS` (5) | Remaining attempts to successfully spawn a fish school. |
| `_spawn_fish_school_task` | `task` or `nil` | `nil` | Task handle for the delayed fish school spawn attempt. |

## Main functions
### `SetThrower(thrower)`
* **Description:** Sets the `thrower` reference used when calling `schoolspawner:SpawnSchool`. This allows the fish school to be attributed to the correct source.
* **Parameters:** `thrower` (`GEntity`) — the entity that deployed the chum (typically a player).
* **Returns:** Nothing.
* **Error states:** Does not validate `thrower`; accepts `nil`.

## Events & listeners
- **Listens to:** `timerdone` — triggers disintegration of the chum cloud when the "disperse" timer completes.
- **Listens to:** `onremove` — cleans up all tracked chum pieces before the entity is fully destroyed.