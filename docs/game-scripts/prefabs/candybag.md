---
id: candybag
title: Candybag
description: A wearable container item that functions as a backpack with fire-sensitive locking behavior and Ashdrop mechanics.
tags: [inventory, equipment, fire, container]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c0bef33e
system_scope: inventory
---

# Candybag

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `candybag` prefab implements a wearable backpack with 8 inventory slots, featuring dynamic UI integration, equip/unequip animations, and fire-sensitive opening logic. When ignited, the container locks (preventing access), and upon burning, it empties its contents and transforms into an `ash` prefab. It is primarily used for the Krampus event, where it serves as a reward container.

## Usage example
```lua
local inst = SpawnPrefabs("candybag")
inst.Transform:SetPosition(entity.Transform:GetWorldPosition())
inst.components.container:Open(player)
-- Access slots via inst.components.container.slots
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `container`, `burnable`, `propagator`, `hauntable`, `physics`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `backpack`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foleysound` | string | `"dontstarve/movement/foley/backpack"` | Sound played during foot movement |
| `canbeopened` | boolean | `true` (overridden on ignite) | Controls whether the container can be opened (set to `false` while burning) |
| `equipslot` | `EQUIPSLOTS` | `EQUIPSLOTS.BODY` | Slot where the item is equipped |

## Main functions
### `onequip(inst, owner)`
*   **Description:** Called when the candybag is equipped. Overrides player animation symbols for visual appearance and opens the container for the wearer.
*   **Parameters:** `inst` (Entity) - the candybag instance; `owner` (Entity) - the equipped player.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Called when unequipped. Clears animation overrides and closes the container for the former owner.
*   **Parameters:** `inst` (Entity); `owner` (Entity).
*   **Returns:** Nothing.

### `onequiptomodel(inst, owner)`
*   **Description:** Called when equipped to a model (e.g., in UI preview). Closes the container to prevent unintended access.
*   **Parameters:** `inst` (Entity); `owner` (Entity).
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Executed when the candybag is fully burned. Drops all inventory contents at its position, spawns an `ash` prefab, and removes the candybag entity.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onignite(inst)`
*   **Description:** Called when the candybag starts burning. Prevents container access by setting `canbeopened = false`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onextinguish(inst)`
*   **Description:** Called when fire is extinguished. Re-enables container access by setting `canbeopened = true`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (uses callback hooks from `burnable`, `container`, and `equippable` components instead).
- **Pushes:** `onclose`, `onopen` (via `container` component when opened/closed), ` OnDestroy` (implicitly via `inst:Remove()` in `onburnt`).