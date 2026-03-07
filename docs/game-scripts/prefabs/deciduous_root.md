---
id: deciduous_root
title: Deciduous Root
description: A temporary projectiled plant-based AoE weapon used by the deciduous monster in the DST campaign, with area damage, directional movement, and animation-based combat logic.
tags: [combat, projectile, boss, environment, AoE]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 60350320
system_scope: environment
---

# Deciduous Root

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`deciduous_root` is a temporary entity prefabricated for use as an AoE weapon deployed by the deciduous monster boss. It is instantiated with physics, anim state, sound, and combat components, and moves linearly toward a designated position using an `inQuad` easing function. Once in position, it triggers an area attack and self-destructs. It has no persistent state and exists only for a short gameplay window.

## Usage example
This entity is not typically instantiated manually by modders — it is spawned internally by the deciduous monster during boss combat. However, a minimal instantiation example for testing is:

```lua
local root = Prefab("deciduous_root", fn)
local inst = SpawnPrefab("deciduous_root")
if inst and inst.components.combat then
    -- Set target before attack phase
    inst:PushEvent("givetarget", {
        owner = some_entity,
        target = some_target,
        targetangle = 0,
        targetpos = Vector3(10, 0, 10),
    })
end
```

## Dependencies & tags
**Components used:** `combat`, `transform`, `animstate`, `soundemitter`, `physics`, `network`  
**Tags added:** `birchnutroot`, `notarget`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` or `nil` | `nil` | The entity that spawned the root (set via `givetarget` event). |
| `target` | `Entity` or `nil` | `nil` | The targeted entity (set via `givetarget` event). |
| `targetangle` | number or `nil` | `nil` | Direction angle (radians) toward which the root moves. |
| `targetpos` | `Vector3` or `nil` | `nil` | Destination position (set via `givetarget` event). |
| `origin` | `Vector3` or `nil` | `nil` | Starting position (computed during movement setup). |
| `vector` | `Vector3` or `nil` | `nil` | Displacement vector (computed during movement setup). |
| `dist_to_cover` | number or `nil` | `nil` | Euclidean distance between start and target position. |
| `step` | number | `0` | Internal counter tracking animation progress (0–29). |
| `movetask` | `Task` or `nil` | `nil` | Periodic task responsible for motion interpolation. |

## Main functions
### `GiveTarget(inst, data)`
*   **Description:** Initializes directional movement and sets up the root’s targeting data. Must be called via the `"givetarget"` event. Triggers a linear interpolation movement over 29 frames toward the target position.
*   **Parameters:** `data` (table) - an object containing optional keys: `owner`, `target`, `targetangle`, `targetpos`.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `data` is `nil` or if `targetpos` is missing while `targetangle` is present (prevents incomplete setup). Movement task cancels automatically after 29 frames.

### `IsValidAOETarget(guy, inst)`
*   **Description:** Predicate used by the combat component to filter valid area-of-effect targets. Excludes birchnut-related prefabs to prevent friendly fire.
*   **Parameters:** `guy` (Entity), `inst` (Entity) — unused in logic but passed as context.
*   **Returns:** `true` if `guy` lacks `birchnutroot`, `birchnut`, and `birchnutdrake` tags; otherwise `false`.

## Events & listeners
- **Listens to:** `givetarget` — triggers `GiveTarget(inst, data)`.
- **Listens to:** `animqueueover` — calls `inst.Remove()` to destroy the entity after animation completes.
- **Pushes:** None (does not fire custom events).

:::note
All combat logic (damage and area-of-effect processing) is handled through the `combat` component API (`SetAreaDamage`, `SetDefaultDamage`, `DoAttack`). This entity does not override combat behavior directly — it simply triggers attacks via scheduled tasks aligned with animation timing.
:::