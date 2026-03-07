---
id: grotto_pool_moonglass
title: Grotto Pool Moonglass
description: Creates a mineable rock prefab that drops moonglass when worked and regrows over time during cave full moons.
tags: [mining, regrowth, environment, grotto]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 99ca2679
system_scope: environment
---

# Grotto Pool Moonglass

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`grotto_pool_moonglass` defines three mineable moonglass rock prefabs (`grotto_moonglass_1`, `grotto_moonglass_3`, `grotto_moonglass_4`) found in the Grotto. When mined, each rock enters a mined state and regrows to full durability during a cave full moon with a configurable probability. It relies on the `workable` component for mining logic and the `lootdropper` component to handle loot generation and physics.

## Usage example
```lua
-- Instantiate one of the moonglass prefabs
local moonglass = SpawnPrefab("grotto_moonglass_1")
moonglass.Transform:SetPosition(entity:GetPosition())

-- The component automatically handles mining, loot, and regrowth
-- No manual setup required beyond spawning the prefab.
```

## Dependencies & tags
**Components used:** `workable`, `lootdropper`  
**Tags added:** `moonglass`  
**Tags conditionally added/removed:** `NOCLICK` (added when mined, removed when full)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_anim` | string | `nil` | Stores the base animation name for reference during state transitions. |

## Main functions
### `set_full(inst)`
*   **Description:** Resets the moonglass rock to its full, playable state (collidable and clickable), restores full workability, and plays the full animation.
*   **Parameters:** `inst` (EntityInstance) — the moonglass entity to reset.
*   **Returns:** Nothing.

### `set_mined(inst)`
*   **Description:** Places the moonglass rock into its mined state (non-collidable and non-clickable), plays the mined animation, and begins watching for cave full moon events to trigger regrowth.
*   **Parameters:** `inst` (EntityInstance) — the moonglass entity to mine.
*   **Returns:** Nothing.

### `on_mined(inst, worker, workleft)`
*   **Description:** Called when mining completes (`workleft <= 0`). Spawns a break FX, drops loot (via `lootdropper`), and transitions the entity to the mined state.
*   **Parameters:**  
  - `inst` (EntityInstance) — the moonglass entity.  
  - `worker` (EntityInstance? or nil) — the entity that performed the mining, or `nil` if mined automatically (e.g., by event).  
  - `workleft` (number) — remaining work to be done; triggers full processing only when `<= 0`.  
*   **Returns:** Nothing.

### `OnCaveFullMoon(inst, fullmoon)`
*   **Description:** Event callback triggered when a cave full moon occurs. With probability `TUNING.GROTTO_MOONGLASS_REGROW_CHANCE`, regrows the moonglass rock to full state and stops watching for further full moons.
*   **Parameters:**  
  - `inst` (EntityInstance) — the moonglass entity.  
  - `fullmoon` (boolean) — state of the cave full moon (unused; assumed `true` at call time).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `iscavefullmoon` — triggers regrowth attempt via `OnCaveFullMoon` if regrowth chance passes.  
- **Pushes:**  
  - None.
