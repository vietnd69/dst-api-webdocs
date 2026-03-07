---
id: birdattractor
title: Birdattractor
description: Stores and calculates spawn limits and timing modifiers for bird-related world entities via a additive source modifier list.
tags: [world, spawn, modifier, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6abbd345
system_scope: environment
---

# Birdattractor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BirdAttractor` is a lightweight component designed to track and compute modifiers that influence how birds (such as Butterflies, Pigs, or other bird-like creatures) are spawned in the world. It uses a `SourceModifierList` to manage additive modifiers keyed by `"maxbirds"`, `"mindelay"`, and `"maxdelay"`. It is typically attached to entities that act as environmental attractors (e.g., structures, terrain features) influencing bird population or spawn timing in their vicinity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("birdattractor")
-- Example: boost max birds by +2 from a nearby beacon
inst.components.birdattractor.spawnmodifier:ApplyModifier("maxbirds", 2, "beacon")
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance that owns this component. |
| `spawnmodifier` | `SourceModifierList` | Initialized with `0` and `additive` mode | Holds additive modifiers for spawn parameters: `"maxbirds"`, `"mindelay"`, `"maxdelay"`. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a formatted string containing the current computed modifier values for `"maxbirds"`, `"mindelay"`, and `"maxdelay"`. Used for debugging and debugging UI.
* **Parameters:** None.
* **Returns:** `string` — Example: `"maxbirds:3, mindelay:10, maxdelay:30"`.
* **Error states:** Returns `nil` if `CalculateModifierFromKey()` fails for any key (though unlikely, due to default value `0` in `SourceModifierList`).

## Events & listeners
None identified.
