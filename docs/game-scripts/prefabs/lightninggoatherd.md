---
id: lightninggoatherd
title: Lightninggoatherd
description: A spawner entity that maintains a herd of lightning goats and periodically generates new members during mating season.
tags: [herd, spawner, lightinggoat, boss, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 28a1bb86
system_scope: world
---

# Lightninggoatherd

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lightninggoatherd` is a non-networked entity prefab that acts as a herd manager and periodic spawner for `lightninggoat` prefabs. It combines the `herd` and `periodicspawner` components to enforce a maximum herd size (`TUNING.LIGHTNINGGOATHERD_MAX_SIZE`), auto-generate new lightning goats at defined intervals, and self-remove when the herd becomes empty. It is tagged `herd`, `NOBLOCK`, and `NOCLICK`, indicating its role as a passive environmental entity used for herd management and spawner control.

## Usage example
```lua
-- This prefab is typically added to the world via worldgen or prefabs spawning it.
-- Example of direct instantiation and configuration:
local inst = Prefab("lightninggoatherd", fn, nil, prefabs)()
inst.components.herd:SetMaxSize(10)
inst.components.periodicspawner:SetRandomTimes(1800, 300) -- 30±5 minute intervals
```

## Dependencies & tags
**Components used:** `herd`, `periodicspawner`  
**Tags added:** `herd`, `NOBLOCK`, `NOCLICK`  
**Tags checked:** `lightninggoat` (via herd member tag)  
**Tags used in search:** `herdmember`, `lightninggoat` (via `inst.components.herd.membersearchtags`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.herd` | Herd component instance | `nil` → initialized in constructor | Manages the collection and lifecycle of herd members. |
| `inst.components.periodicspawner` | PeriodicSpawner component instance | `nil` → initialized in constructor | Controls timed spawning of new `lightninggoat` entities. |

## Main functions
### `fn()`
*   **Description:** The prefab constructor function that builds and initializes a `lightninggoatherd` entity. Sets up herd limits, spawner timing, and event hooks.
*   **Parameters:** None.
*   **Returns:** `inst` (The fully initialized entity instance).
*   **Error states:** None—assumes valid tuning values and component availability.

## Events & listeners
- **Listens to:** None (explicit listeners are set up inside `herd` and `periodicspawner` components via callbacks).
- **Pushes:** None directly; relies on component behavior (`herd.onempty`, `periodicspawner.onspawn`) to trigger side effects like `inst.Remove` or `herd:AddMember`.