---
id: pollinator
title: Pollinator
description: Manages flower collection and planting behavior for entities capable of pollinating and reproducing flora.
tags: [flora, reproduction, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0b798f36
system_scope: world
---

# Pollinator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Pollinator` enables an entity to collect flowers from the environment, store them internally, and eventually plant new flowers at its current location once a collection threshold is met. It is designed to support in-game flora reproduction mechanics and interacts primarily with entities tagged `flower`. The component also ensures flower placement respects density limits and ground validity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pollinator")
-- After setup, an entity with this component can:
inst.components.pollinator:Pollinate(flower_entity)
if inst.components.pollinator:HasCollectedEnough() and inst:IsOnValidGround() then
    inst.components.pollinator:CreateFlower()
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `pollinator` to the entity; checks `flower` on target entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flowers` | table | `{}` | List of collected flower entities (prefab references not stored directly). |
| `distance` | number | `5` | Search radius (in units) used for flower density checks. |
| `maxdensity` | number | `4` | Maximum number of flowers allowed within `distance` before planting is blocked. |
| `collectcount` | number | `5` | Minimum number of flowers required before planting is allowed. |
| `target` | entity or `nil` | `nil` | Current pollination target; cleared on successful pollination. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up the component by removing the `pollinator` tag from the entity when the component is removed.
* **Parameters:** None.
* **Returns:** Nothing.

### `Pollinate(flower)`
* **Description:** Attempts to add a flower to the internal collection. Only succeeds if the flower passes `CanPollinate`.
* **Parameters:** `flower` (entity) — the flower entity to collect.
* **Returns:** Nothing.
* **Error states:** Silently ignores `nil` flowers or flowers already in `flowers`.

### `CanPollinate(flower)`
* **Description:** Checks whether a flower is eligible for collection.
* **Parameters:** `flower` (entity or `nil`) — candidate flower entity.
* **Returns:** `true` if `flower` is non-`nil`, has tag `flower`, and is not already in `flowers`; otherwise `false`.

### `HasCollectedEnough()`
* **Description:** Verifies if enough flowers have been collected to trigger planting.
* **Parameters:** None.
* **Returns:** `true` if the number of collected flowers exceeds `collectcount`; otherwise `false`.

### `CreateFlower()`
* **Description:** Spawns a new flower at the pollinator’s position if:
  - Enough flowers have been collected (`HasCollectedEnough()` returns `true`), and
  - The entity is on valid ground (`IsOnValidGround()` returns `true`).
  *Note:* Flowers are copied from a randomly selected previously collected flower.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if density check fails or ground is invalid; also resets `flowers` table regardless.

### `CheckFlowerDensity()`
* **Description:** Determines whether planting a new flower would exceed the allowed local density.
* **Parameters:** None.
* **Returns:** `true` if the number of nearby entities (within `distance`) that lack *all* of the excluded tags (`FX`, `NOBLOCK`, `INLIMBO`, `DECOR`) is less than `maxdensity`; otherwise `false`.

### `GetDebugString()`
* **Description:** Returns a debug-ready string summarizing current state.
* **Parameters:** None.
* **Returns:** String in format `"flowers: X, cancreate: Y"` where `X` is the count of collected flowers and `Y` is `"true"` or `"false"` based on `HasCollectedEnough()`.

## Events & listeners
None identified
