---
id: groundcreep
title: Groundcreep
description: Enables serialization and deserialization of a ground creep object attached to an entity, primarily for world persistence across sessions.
tags: [serialization, world, persistence]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: b491de89
system_scope: world
---

# Groundcreep

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Groundcreep` is a minimal component designed to support saving and loading of a ground creep state attached to an entity. It does not manage the ground creep logic itself but delegates serialization responsibilities to an attached `GroundCreep` object on the entity (i.e., `inst.GroundCreep`). This ensures clean separation between game logic and persistence concerns, avoiding ad-hoc serialization code elsewhere in the codebase. It also listens for the `playeractivated` event to trigger fast-forwarding of the creep state when a player loads into the world.

## Usage example
```lua
local inst = CreateEntity()
-- An entity with a pre-initialized inst.GroundCreep object is required
inst:AddComponent("groundcreep")
-- On save/load, the component automatically calls inst.GroundCreep:GetAsString() and SetFromString()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `playeractivated` event; relies on `inst.GroundCreep` object being present.

## Properties
No public properties

## Main functions
### `OnSave()`
*   **Description:** Serializes the attached ground creep object by calling its `GetAsString()` method. Only active on the master simulation.
*   **Parameters:** None.
*   **Returns:** String — the serialized representation of the ground creep state.
*   **Error states:** Returns `nil` if `inst.GroundCreep` is missing or `GetAsString()` fails.

### `OnLoad(data)`
*   **Description:** Deserializes the ground creep state by passing `data` to the attached object's `SetFromString()` method. Only active on the master simulation.
*   **Parameters:** `data` (string) — the serialized ground creep state previously returned by `OnSave()`.
*   **Returns:** Nothing.
*   **Error states:** May silently fail or cause runtime errors if `inst.GroundCreep` is missing or `SetFromString()` encounters invalid data.

## Events & listeners
- **Listens to:** `playeractivated` — triggers `FastForward()` on the attached ground creep object via `inst.GroundCreep:FastForward()`.
- **Pushes:** None.
