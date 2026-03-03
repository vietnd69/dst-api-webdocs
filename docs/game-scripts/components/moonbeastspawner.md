---
id: moonbeastspawner
title: Moonbeastspawner
description: Manages periodic spawning of moonbeasts (moonhounds and moonpigs) near the Moon Base entity and handles petrification of nearby ghouls when active.
tags: [boss, world, spawn, transformation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 17233e4c
system_scope: world
---

# Moonbeastspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Moonbeastspawner` is a component attached to the Moon Base prefab that controls the spawning of moonbeasts (moonhounds and moonpigs) within a configurable radius over time. It also manages the transformation of nearby hounds, werepigs, and gargoyles into their moon forms, and can petrify nearby gargoyles when the Moon Base is asleep. The component interacts with multiple systems including entity tracking, health, sleeper, freezable, and workable components to handle state changes on affected entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moonbeastspawner")
inst.components.moonbeastspawner.range = 30
inst.components.moonbeastspawner.period = 3
inst.components.moonbeastspawner.maxspawns = 6
inst.components.moonbeastspawner:Start()
-- Later
inst.components.moonbeastspawner:Stop()
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `freezable`, `health`, `sleeper`, `spawnfader`, `workable`  
**Tags:** Adds `moonbeast`, `gargoyle`, `werepig`, `hound`, `clay`, `INLIMBO`, `wall`, `playerskeleton`; checks `INLIMBO`, `moonbeast`, `gargoyle`, `clay`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the component is attached to (Moon Base). |
| `started` | boolean | `false` | Whether the spawner is currently active. |
| `range` | number | `30` | Maximum radius (in world units) around the Moon Base where entities are affected and spawns occur. |
| `period` | number | `3` | Interval in seconds between spawn cycles. |
| `maxspawns` | number | `6` | Maximum number of moonbeasts to spawn per cycle. |
| `task` | `Task` | `nil` | Periodic task handle used to schedule spawning. |
| `cc` | table | `nil` | Map of entities currently "controlled" (e.g., sleeping, frozen) during off-screen cycles. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up the periodic spawn task when the component is removed from its entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ForcePetrify()`
*   **Description:** Forces all moonbeasts (and sometimes other creatures) within `range` to immediately enter petrified state, bypassing normal petrification delay.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Start()`
*   **Description:** Begins the periodic spawning process. Also reanimates nearby gargoyle entities.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `started` is already `true`.

### `Stop()`
*   **Description:** Stops the periodic spawning task and clears internal state. If the Moon Base is currently asleep, it immediately triggers petrification of nearby entities.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `started` is already `false`.

## Events & listeners
- **Listens to:** `onremove` (on the owner entity) — cancels the spawn task in `OnRemoveFromEntity`.
- **Pushes:** `detachchild`, `moontransformed`, `onwakeup`, `onthaw`, `moonpetrify`, `newstate` (via delegate setup on entities).
- **Uses:** Internal delegation via `v:DoTaskInTime(0, MorphMoonBeast, inst)` and `v:ListenForEvent("newstate", ...)` for lazy morphing of busy entities.
