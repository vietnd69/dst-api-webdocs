---
id: deerclops_laser
title: Deerclops Laser
description: Acts as a temporary combat projectile entity that deals damage,摧毁s workables, and interacts with freeze and temperature states upon impact.
tags: [combat, fx, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e7052238
system_scope: combat
---

# Deerclops Laser

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `deerclops_laser` prefab is a short-lived projectile entity used exclusively by Deerclops to fire damaging beams at targets. It is not a reusable component but a spawnable prefab instance with built-in combat logic. When triggered, it calculates a radius around its position and applies damage, destroys workables, picks pickables (with optional launch), and triggers freeze thawing or temperature correction on affected entities. It supports both "full" and "empty" variants—the latter lacks visual FX but retains core logic.

## Usage example
```lua
-- Spawn the laser at a position, configure trigger, and fire
local laser = SpawnPrefab("deerclops_laser")
laser.Transform:SetPosition(x, 0, z)
laser.caster = inst -- Assign the shooter for proper combat context
laser.Trigger(0) -- Fire immediately (delay = 0)
```

## Dependencies & tags
**Components used:** `combat`
**Tags added:** `notarget`, `hostile`
**Tags checked for damage filtering:** `playerghost`, `INLIMBO`, `DECOR`, `_combat`, `pickable`, `NPC_workable`, `CHOP_workable`, `HAMMER_workable`, `MINE_workable`, `DIG_workable`, `locomotor`, `_inventoryitem`
**Prefabs spawned:** `deerclops_laserscorch`, `deerclops_lasertrail`, `deerclops_laserhit`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `caster` | entity or `nil` | `nil` | The entity responsible for firing the laser; used for attack origin and combat context. |
| `task` | task or `nil` | `nil` | Internal task handle used to delay or cancel laser activation. |

## Main functions
### `Trigger(delay, targets, skiptoss)`
*   **Description:** Cancels any existing activation task and schedules a laser impact after `delay` seconds; if `delay` is ≤ 0, triggers immediately. Aggregates and forwards collision data for batch processing.
*   **Parameters:**
    *   `delay` (number) — Seconds to wait before processing impact. If ≤ 0, fires instantly.
    *   `targets` (table) — Optional accumulator table for tracked targets (used for deduplication).
    *   `skiptoss` (table) — Optional accumulator table for items that should not be launched.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls within the laser prefab).
- **Pushes:** None directly (it relies on component events like `picked`, `combat` attacks, and internal `unfreeze` events on victims, but does not fire its own events).

> **Note:** While the laser prefab does not emit events, the prefabs it spawns (`deerclops_laserhit`) do listen for entity removal (`OnRemoveHit`) to restore `colouradder`/`bloomer` state.