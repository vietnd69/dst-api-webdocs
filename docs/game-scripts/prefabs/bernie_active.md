---
id: bernie_active
title: Bernie Active
description: Defines the active state prefab for Bernie, the animated teddy bear companion.
tags: [companion, prefab, ai]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: unknown
system_scope: entity
---

# Bernie Active

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`bernie_active` is the prefab definition for Bernie when he is in his active, mobile state. It initializes physics, animations, AI behavior, and combat capabilities required for the companion to interact with the world. The script handles state transitions, allowing Bernie to transform into an inactive doll or a giant enraged version via custom instance methods. Server-side logic ensures health, timer, and inventory interactions are synchronized correctly while client-side entities remain pristine for network optimization.

## Usage example
```lua
-- Spawn an active Bernie entity
local bernie = SpawnPrefab("bernie_active")

-- Access custom transformation methods attached to the instance
if bernie.GoBig then
    -- Transform Bernie into his big form, linked to a leader player
    bernie:GoBig(player)
end

-- Check if Bernie is currently marked as a companion
if bernie:HasTag("companion") then
    -- Apply companion-specific logic
end
```

## Dependencies & tags
**Components used:** `health`, `inspectable`, `locomotor`, `combat`, `timer`, `inventoryitem`, `hauntable`.
**Entity components:** `Transform`, `AnimState`, `SoundEmitter`, `DynamicShadow`, `MiniMapEntity`, `Network`.
**Tags:** Adds `smallcreature`, `companion`, `soulless`.
**External scripts:** `prefabs/bernie_common`, `brains/berniebrain`.
**Dependent prefabs:** `bernie_inactive`, `bernie_big`.

## Properties
No public properties

## Main functions
### `GoInactive()`
*   **Description:** Transforms the active Bernie into an inactive doll prefab (`bernie_inactive`). Transfers current health percentage to the inactive form's fuel percentage and preserves transform data.
*   **Parameters:** None.
*   **Returns:** The new inactive entity instance, or `nil` if spawn fails.
*   **Error states:** Returns `nil` if the inactive prefab fails to spawn. Removes the original instance upon success.

### `GoBig(leader)`
*   **Description:** Transforms the active Bernie into a giant enraged prefab (`bernie_big`). Links the new entity to a specific leader player and transfers health percentage.
*   **Parameters:** `leader` (entity) - The player entity to associate as the leader.
*   **Returns:** The new big entity instance, or `nil` if spawn fails.
*   **Error states:** Returns early if the leader already has a big bernie tracked in `leader.bigbernies`. Removes the original instance upon success.

### `OnEntitySleep()`
*   **Description:** Engine callback triggered when the entity goes to sleep. Schedules a task to transform Bernie to inactive state if a sleep task is pending.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `_sleeptask` is nil.

### `OnEntityWake()`
*   **Description:** Engine callback triggered when the entity wakes up. Cancels any pending sleep transformation task.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `_sleeptask` is nil.

## Events & listeners
- **Listens to:** Engine lifecycle callbacks `OnEntitySleep` and `OnEntityWake`.
- **Pushes:** None identified.
- **Callbacks:** Registers `onpickup` and `onputininventory` functions via the `inventoryitem` component to handle transformation when picked up by players.