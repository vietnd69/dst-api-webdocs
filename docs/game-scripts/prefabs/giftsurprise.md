---
id: giftsurprise
title: Giftsurprise
description: A passive entity that holds a reference to a creature prefab and triggers its spawn and targeting behavior upon unwrapping.
tags: [item, unwrapping, combat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 77443acb
system_scope: entity
---

# Giftsurprise

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`giftsurprise` is a lightweight entity that acts as a wrapped-item placeholder for spawning creatures (e.g., hounds) when unpacked from a gift. It relies on the `unwrappable` and `inventoryitem` components to manage its lifecycle—remaining unpickupable while wrapped, and spawning/activating a creature upon unwrapping. It does not represent a playable item itself but serves as a runtime constructor for dynamic loot/spawn effects.

## Usage example
```lua
-- Wrap a gift with a surprise hound and fillers
local gift = SpawnPrefab("gift")
gift.components.unwrappable:WrapItems({
    SpawnPrefab("giftsurprise"):SetCreatureSurprise("hound"),
    SpawnPrefab("giftsurprise"),
    SpawnPrefab("giftsurprise"),
    SpawnPrefab("giftsurprise"),
})
```

## Dependencies & tags
**Components used:** `inventoryitem`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `creature` | string or `nil` | `nil` | Prefab name of the creature to spawn on unwrap. Must be set via `SetCreatureSurprise`. |

## Main functions
### `SetCreatureSurprise(prefab)`
* **Description:** Configures the creature prefab to spawn upon unwrapping. Attaches event handlers for `wrappeditem` and `unwrappeditem` and disables automatic pickup.
* **Parameters:** `prefab` (string) — The name of the prefab to spawn (e.g., `"hound"`).
* **Returns:** `inst` — The entity instance, allowing method chaining.
* **Error states:** Does nothing if `prefab` is `nil`; no validation is performed.

## Events & listeners
- **Listens to:**
  - `wrappeditem` — Triggers visual jiggle on the gift container.
  - `unwrappeditem` — Spawns the configured creature, plays its `surprise_spawn` state (if available), and suggests it as a combat target to the unwrapping actor (if combat-capable).
- **Pushes:** None directly.