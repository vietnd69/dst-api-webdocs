---
id: beeswax
title: Beeswax
description: Defines the beeswax prefab entity, including melting mechanics and inventory stacking behavior.
tags: [prefab, inventory, melting]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 110d31df
system_scope: entity
---

# Beeswax

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `beeswax` prefab script defines the spawnable beeswax entity. It configures inventory physics, stacking limits, and specific melting behavior when exposed to fire. It relies on the `wax` component for base wax functionality and manages state transitions via event listeners. The entity is marked as `meltable` and modifies its pick-up state when melting begins.

## Usage example
```lua
local inst = SpawnPrefab("beeswax")
inst.components.inventoryitem:GiveToPlayer(ThePlayer)
-- Check stack size limit
local max_stack = inst.components.stackable.maxsize
```

## Dependencies & tags
**Components used:** `inspectable`, `wax`, `inventoryitem`, `stackable`
**Tags:** Adds `meltable`, `NOCLICK`

## Properties
No public properties

## Main functions
### `StartFireMelt(inst)`
*   **Description:** Initiates the melting process by scheduling a task.
*   **Parameters:** `inst` (entity) - The beeswax entity instance.
*   **Returns:** Nothing.

### `StopFireMelt(inst)`
*   **Description:** Cancels the pending melting task if active.
*   **Parameters:** `inst` (entity) - The beeswax entity instance.
*   **Returns:** Nothing.

### `_OnFireMelt(inst, StartFireMelt, StopFireMelt)`
*   **Description:** Executes the melting logic, updating tags and animation state.
*   **Parameters:** `inst` (entity) - The beeswax entity instance, `StartFireMelt` (function), `StopFireMelt` (function).
*   **Returns:** Nothing.
*   **Error states:** Removes the entity if asleep or after animation completes.

## Events & listeners
- **Listens to:** `firemelt` - triggers melting start.
- **Listens to:** `stopfiremelt` - triggers melting cancel.
- **Listens to:** `onputininventory` - triggers melting cancel.
- **Pushes:** None identified.