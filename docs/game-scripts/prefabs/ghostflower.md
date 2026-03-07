---
id: ghostflower
title: Ghostflower
description: A reusable inventory item prefab that spawns ambient ghostly FX when active and grows into its full form on the ground.
tags: [item, fx, inventory]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 88fc02c0
system_scope: inventory
---

# Ghostflower

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`ghostflower` is a reusable item prefab that functions as an ambient visual effect generator. When placed on the ground (via `ondropped` event), it begins periodically spawning one of two spirit FX prefabs at its location. The item is designed to be consumed/replaced each time it drops (via `DelayedGrow`), ensuring only one instance exists per use. It is intended for decorative or ritualistic purposes in the game world.

## Usage example
```lua
local inst = SpawnPrefab("ghostflower")
inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM  -- default already set
inst.DelayedGrow(inst)  -- triggers the full grow sequence for a new instance
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`, `inventoryitem`, `inspectable`, `stackable`
**Tags:** Adds `ghostflower`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `DelayedGrow` | function | `nil` initially | Public reference to the growth initialization function; assigned on master client. |

## Main functions
### `DelayedGrow(inst)`
* **Description:** Hides the item, waits a short random delay (0.25–0.5s), then triggers `DoGrow`. Used to reset and re-initialize the item’s growth animation sequence.
* **Parameters:** `inst` (Entity) — the ghostflower entity instance.
* **Returns:** Nothing.

### `DoGrow(inst)`
* **Description:** Shows the item, plays the "grow" animation once, then loops the "idle" animation.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `toground(inst)`
* **Description:** Sets idle animation to a random frame, starts periodic FX spawning (via `dofx`), and schedules the first `dofx` call after a delay of 3–9 seconds.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `dofx(inst)`
* **Description:** Spawns a random spirit FX prefab (`ghostflower_spirit1_fx` or `ghostflower_spirit2_fx`) at the ghostflower’s world position. Schedules itself to run again after a delay of 3–9 seconds, unless the item is in limbo.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ondropped` — triggers `toground(inst)` when the item is dropped in the world.
- **Pushes:** None identified.