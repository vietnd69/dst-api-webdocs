---
id: security_pulse_cage
title: Security Pulse Cage
description: Represents a two-state interactive cage prefab that accepts a power point to transition from empty to full (activated) state.
tags: [combat, interactive, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b8930804
system_scope: environment
---

# Security Pulse Cage

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `security_pulse_cage` prefabs (empty and full states) represent an interactive environment object used in Grotto-level maps. The empty version (`security_pulse_cage`) waits to receive a tagged `power_point` entity (via the `possess` event). Upon successful possession, it transforms into the active full state (`security_pulse_cage_full`), which emits light, plays looping sound, and animates periodically. The component itself is not a separately instantiated component—it is embedded within the prefab creation functions. This documentation describes the behavior implemented directly in `security_pulse_cage.lua`.

## Usage example
```lua
-- The prefabs are registered as instances and loaded by the worldgen system.
-- A typical usage occurs when a power point is possessed by the cage:
local cage = SpawnPrefab("security_pulse_cage")
-- Later, a power point entity (with tag "power_point") possesses it:
cage:PushEvent("possess", { possesser = power_point_entity })
-- This triggers transformation to "security_pulse_cage_full", if the possessor is valid.
```

## Dependencies & tags
**Components used:** None (prefab functions use core engine APIs like `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeHauntableLaunch`, and direct `inst:AddComponent(...)` calls internally).
**Tags:** Adds `security_powerpoint` to empty cage entity.

## Properties
No public properties.

## Main functions
Not applicable (this file defines prefab creation functions only; no reusable component class is exposed.)

## Events & listeners
- **Listens to:**  
  - `possess` — handled by the `EmptyCageFn` instance; triggers `OnPossess` to replace the empty cage with the full variant if the possessor has tag `"power_point"`.  
  - `exitlimbo` — handled by the `FullCageFn` instance; triggers `OnEntityWake` to resume sound and animation tasks.  
  - `enterlimbo` — handled by the `FullCageFn` instance; triggers `OnEntitySleep` to stop sound and cancel animation tasks.

- **Pushes:** None directly (relies on internal engine event dispatching for `possess` and limbo transitions).
