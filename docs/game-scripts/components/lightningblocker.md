---
id: lightningblocker
title: Lightningblocker
description: Manages whether an entity blocks lightning strikes based on its range, and allows custom behavior on lightning strike.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: adc04430
---

# Lightningblocker

## Overview
This component enables an entity to act as a lightning strike blocker: it dynamically applies or removes the `"lightningblocker"` tag based on a configurable blocking range squared (`block_rsq`). It also supports registering a callback to execute custom logic when a lightning strike occurs at the entity's location.

## Dependencies & Tags
- Adds/Removes the `"lightningblocker"` tag on the entity based on range condition.
- Requires `inst:AddTag` and `inst:RemoveTag` to be available on the entity instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `block_rsq` | number or nil | `0` | Squared blocking radius; if `> EPSILON`, the entity gains the `"lightningblocker"` tag. Set via `SetBlockRange()`. |
| `on_strike` | function or nil | `nil` | Optional callback invoked when `DoLightningStrike()` is called. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Ensures the `"lightningblocker"` tag is removed when the component is detached from the entity.
* **Parameters:** None (instance method).

### `SetBlockRange(newrange)`
* **Description:** Sets the blocking radius. Internally stores the *squared* value (`newrange²`) for efficient comparisons.
* **Parameters:**
  - `newrange` (number or nil): The radius (in world units); if `nil`, `block_rsq` becomes `nil`.

### `SetOnLightningStrike(fn)`
* **Description:** Registers a callback function to be executed when a lightning strike occurs at this entity’s location.
* **Parameters:**
  - `fn` (function): A function accepting `(inst, pos)` as arguments (entity instance and strike position).

### `DoLightningStrike(pos)`
* **Description:** Invokes the registered `on_strike` callback (if present), passing the entity instance and strike position.
* **Parameters:**
  - `pos` (vector3): The position where the lightning strike occurred.

## Events & Listeners
None identified — this component does not register or dispatch events using the ECS event system (`inst:ListenForEvent`, `inst:PushEvent`).