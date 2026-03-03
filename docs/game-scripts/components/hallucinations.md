---
id: hallucinations
title: Hallucinations
description: Manages the spawning and tracking of hallucination entities based on player sanity, time of day, and environment lighting.
tags: [sanity, environment, fx]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 59fa2c90
system_scope: environment
---

# Hallucinations

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `hallucinations` component controls the procedural spawning of three types of hallucination prefabs (`creepyeyes`, `shadowwatcher`, `shadowskittish`) on the player entity. It reacts to player sanity levels, whether it is currently night, and environmental lighting conditions. It operates as a passive sidekick to the player, monitoring sanity and time-of-day events, and spawning appropriate hallucinations only when conditions are conducive (e.g., low sanity and darkness). It tracks spawned entities and ensures only a limited number of each type exist concurrently.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hallucinations")
-- Automatically activates upon `playeractivated` events and is managed by the game.
-- Debug string is available for inspection:
print(inst.components.hallucinations:GetDebugString())
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`. Relies on `TheSim`, `SpawnPrefab`, `FindEntity`, and world state (`isnight`, `isfullmoon`) APIs. Uses `_player.replica.sanity` to read sanity values.
**Tags:** Adds and removes `fire` and `_equippable` from candidate entities during `shadowwatcher` searching.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `inst` (passed in constructor) | Reference to the entity that owns this component (typically the player entity). |

No other public properties are exposed.

## Main functions
### `GetDebugString()`
* **Description:** Returns a human-readable debug string listing the current spawn count of each hallucination type.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"2 creepyeyes, 1 shadowwatcher, 4 shadowskittish"`, or `nil` if no hallucinations are active.
* **Error states:** None. Safe to call at any time.

## Events & listeners
- **Listens to:**  
  - `playeractivated` — triggers `OnPlayerActivated` when a new player becomes active, setting up world-state watches and starting hallucinations.  
  - `playerdeactivated` — triggers `OnPlayerDeactivated` to shut down and cancel tasks when the player deactivates.  
  - `nightvision` — triggers `OnIsNight` when the player’s night vision state changes (e.g., via lantern or helmet).  
- **Pushes:** None.

## Constants
The component defines `HALLUCINATION_TYPES`, a table with three entries:

| Name | `interval` | `variance` | `initial_variance` | `nightonly` |
|------|------------|------------|--------------------|-------------|
| `creepyeyes` | `5` | `2.5` | `20` | `true` |
| `shadowwatcher` | `30` | `15` | `10` | `true` |
| `shadowskittish` | `10` | `5` | `20` | `false` |

Each type uses its `interval`, `variance`, and `initial_variance` to schedule spawning via `DoTaskInTime`. `nightonly` determines whether spawning only occurs at night.
