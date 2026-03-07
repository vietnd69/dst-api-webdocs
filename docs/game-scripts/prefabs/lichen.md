---
id: lichen
title: Lichen
description: A harvestable environmental asset that regrows over time and drops `cutlichen` when picked.
tags: [environment, resource, regen]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a0e5d70e
system_scope: environment
---

# Lichen

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lichen` prefab represents a static, regrowable environmental resource found on the surface. It is implemented as a `Prefab` using standard DST animation and sound infrastructure, and relies on the `pickable` component to define harvest behavior, regrowth timing, and visual feedback during interaction. It integrates with additional systems such as lighting/fire propagation, winter durability, and haunting mechanics.

## Usage example
```lua
--Typical spawn in a room or map generation task
local lichen = SpawnPrefab("lichen")
lichen.Transform:SetPosition(x, y, z)
--The `pickable` component is automatically configured on spawn via its prefab
```

## Dependencies & tags
**Components used:** `pickable`, `inspectable`
**Tags:** Adds `lichen`

## Properties
No public properties are defined or used in the constructor beyond those inherited or set via `pickable` configuration (e.g., `pickable.picksound`, `pickable.onpickedfn`). All relevant properties are assigned directly to `inst.components.pickable` during construction.

## Main functions
This file defines only internal callback functions used by the `pickable` component. These are passed as function references during `pickable:SetUp(...)` initialization.

### `onpickedfn(inst)`
* **Description:** Called when the lichen is successfully harvested. Plays a pickup sound and switches to the "picking" → "picked" animation sequence.
* **Parameters:** `inst` (Entity) — the lichen entity instance.
* **Returns:** Nothing.

### `onregenfn(inst)`
* **Description:** Called when the lichen regrows after being depleted. Triggers the "grow" animation, then loops "idle".
* **Parameters:** `inst` (Entity) — the lichen entity instance.
* **Returns:** Nothing.

### `makeemptyfn(inst)`
* **Description:** Called to reset visual state to empty (e.g., after harvesting). Sets the animation to "picked".
* **Parameters:** `inst` (Entity) — the lichen entity instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly.
- **Pushes:** None explicitly. Events such as `onpicked`, `onregen`, and `onempty` are handled internally by the `pickable` component using the above callbacks.