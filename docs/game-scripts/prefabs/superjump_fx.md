---
id: superjump_fx
title: Superjump Fx
description: Spawns a visual and sound effect at a specified location to simulate the landing of a superjump, and optionally spawns associated debris.
tags: [fx, visual, sound]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 00ba2517
system_scope: fx
---

# Superjump Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`superjump_fx` is a lightweight FX prefab that renders a short-lived animation and plays a sound to visually represent the impact of a superjump landing. It is automatically spawned by other systems (e.g., character superjump logic) and positioned at a target location via its `SetTarget` method. A companion `superjump_debris` prefab is also defined to render debris particles at the same location.

## Usage example
```lua
local fx = SpawnPrefab("superjump_fx")
fx:SetTarget(target_entity, 2.5)  -- Position FX 2.5 units in front of the target
-- No further action needed: the FX is self-cleaning
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X` (only entity system subsystems: `Transform`, `AnimState`, `SoundEmitter`, `Network` are added).
**Tags:** Adds `FX` and `NOCLICK`.

## Properties
No public properties.

## Main functions
### `SetTarget(target, distance)`
* **Description:** Positions the FX entity at a calculated location relative to a target entity (using its world position and rotation), optionally offset by a given distance, and spawns a matching `superjump_debris` prefab. If called multiple times, cancels and re-runs the initial `OnInit` sound effect.
* **Parameters:**
  - `target` (entity) — The entity whose position and rotation serve as the basis for placement.
  - `distance` (number?, optional) — Offset distance (in world units) forward relative to the target's facing direction. If `nil`, no offset is applied.
* **Returns:** Nothing.
* **Error states:** No explicit failure modes; offsets rely on valid transforms.

## Events & listeners
- **Listens to:** `animover` — Calls `inst.Remove` to self-destruct when the animation completes.
- **Pushes:** None.