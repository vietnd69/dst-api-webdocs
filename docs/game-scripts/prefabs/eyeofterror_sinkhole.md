---
id: eyeofterror_sinkhole
title: Eyeofterror Sinkhole
description: Creates a collapsible sinkhole prefab that triggers ground collapse, damages nearby objects, and ejects items when activated.
tags: [environment, world, combat, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6dd03c48
system_scope: environment
---

# Eyeofterror Sinkhole

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `eyeofterror_sinkhole` is a prefab factory function that generates collapsible environmental hazards used by bosses (e.g., Eye of Terror, Daywalker, Bearger). When the sinkhole receives a `docollapse` event, it triggers ground collapse: disabling uneven ground, playing particle and sound effects, damaging or destroying nearby workable entities (e.g., structures, walls), picking nearby flora, and launching inventory items within range. After collapsing, it schedules a 20-second repair timer during which it disables itself and sets `persists = false`, ultimately removing the entity.

The sinkhole logic is shared across three variants via the `MakeSinkhole` factory, differing in radius, scale, `maxwork` (if `true`, objects are fully destroyed rather than partially worked), and `toughworker` tag.

## Usage example
```lua
-- Create a standard Eye of Terror sinkhole
local sinkhole = SpawnPrefab("eyeofterror_sinkhole")

-- Manually trigger collapse (typically done by boss AI)
sinkhole:PushEvent("docollapse")

-- Internally, after collapsing, it sets up a 'repair' timer and removes itself
```

## Dependencies & tags
**Components used:** `timer`, `unevenground`

**Tags added:**
- `antlion_sinkhole`
- `antlion_sinkhole_blocker`
- `NOCLICK`
- `toughworker` *(only for Daywalker and Bearger variants)*

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `radius` | number | (constructor argument) | Radius for entity detection and camera shake. |
| `scale` | number | (constructor argument) | Visual scale applied to the sinkhole and spawned FX. |
| `maxwork` | boolean | (constructor argument) | If `true`, workable entities are fully destroyed instead of partially worked. |
| `persists` | boolean | `true` initially | Set to `false` during repair phase to avoid persistence. |

## Main functions
### `DoCollapse(inst)`
* **Description:** Triggers the collapse sequence: disables uneven ground, spawns particle and sound effects, damages workable entities and picks nearby flora, launches inventory items.
* **Parameters:** `inst` (entity) — the sinkhole instance.
* **Returns:** Nothing.
* **Error states:** None; assumes `inst.radius`, `inst.scale`, and `inst.maxwork` are defined.

### `OnTimerDone(inst, data)`
* **Description:** Handles completion of the repair timer. Ends collapse state, disables uneven ground, sets `persists = false`, and calls `ErodeAway(inst)` to remove the entity.
* **Parameters:** 
  - `inst` (entity) — the sinkhole instance.
  - `data` (table) — timer metadata; only triggers if `data.name == "repair"`.
* **Returns:** Nothing.

### `SmallLaunch(entity, inst, speed)`
* **Description:** Applies velocity to a lightweight entity (e.g., loot) to toss it away from the sinkhole's center.
* **Parameters:** 
  - `entity` (entity) — the entity to toss.
  - `inst` (entity) — the sinkhole (used for position origin).
  - `speed` (number) — base speed multiplier.
* **Returns:** Nothing.

### `OnLoad(inst)`
* **Description:** Restores `unevenground` to active state if the repair timer exists on deserialization.
* **Parameters:** `inst` (entity) — the sinkhole instance.
* **Returns:** Nothing.

### `OnLoadPostPass(inst)`
* **Description:** Safeguards against malformed saves: removes sinkholes that should persist but have no repair timer (indicating premature spawn or corruption).
* **Parameters:** `inst` (entity) — the sinkhole instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `docollapse` — triggers `DoCollapse(inst)`.
  - `timerdone` — triggers `OnTimerDone(inst, data)`.
- **Pushes:** None (events are internal and handled via listeners).

