---
id: shadow_pillar
title: Shadow Pillar
description: Manages the lifecycle, visual FX, and timer-based behavior of shadow pillar entities that immobilize and deal damage to targets over time.
tags: [combat, fx, boss, timer, target]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d10c2417
system_scope: fx
---

# Shadow Pillar

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadow_pillar` prefab and its companion prefabs (`shadow_pillar_target`, `shadow_pillar_base_fx`, `shadow_pillar_spell`) implement a multi-stage visual and gameplay effect used in the game to immobilize and pressure targets (typically players or bosses). The system involves:
- A `shadow_pillar` entity: visual FX component that animates and emits warnings before vanishing.
- A `shadow_pillar_target` entity: hidden entity that roots the target and monitors attacker interactions to reduce the pillar's lifetime.
- A `shadow_pillar_spell` entity: spawner that locates valid targets in an area and initiates pillar creation.
The component relies heavily on the `timer`, `entitytracker`, `rooted`, `health`, and `combat` components for synchronization and logic.

## Usage example
```lua
-- Spawning a shadow pillar around a target at position (x, y, z)
local target = GetPlayer() -- or any valid entity with `locomotor` tag
local x, y, z = target.Transform:GetWorldPosition()
local spell = SpawnPrefab("shadow_pillar_spell")
spell.Transform:SetPosition(x, y, z)
spell.caster = GetPlayer() -- required for PVP checks
spell.item = weapon_item -- optional weapon reference for attack event
```

## Dependencies & tags
**Components used:** `entitytracker`, `timer`, `rooted`, `health`, `combat`, `follower`
**Tags added:** `NOCLICK`, `shadow_pillar`, `ignorewalkableplatforms`, `ignorewalkableplatformdrowning`, `FX`, `CLASSIFIED`, `locomotor` (for spell target filtering)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | number | `1` | Animation variation index (1–6) for `shadow_pillar` visual rendering. |
| `flipped` | boolean | `false` | Mirrors the pillar animation horizontally. |
| `base` | prefab instance | `nil` | Reference to the `shadow_pillar_base_fx` entity parented to the pillar. |
| `persists` | boolean | `false` | Controls save/restore behavior for `shadow_pillar`; set to `false` on deactivation. |

## Main functions
### `SetTarget(target, hasplatform)`
*   **Description:** Assigns a target entity to the pillar, subscribes to target-related events (`dispell_shadow_pillars`, `death`, `onremove`, `remove_shadow_pillars`, `reduce_shadow_pillars_time`), and configures walkable platform interaction.
*   **Parameters:** `target` (Entity instance) - entity to immobilize; `hasplatform` (boolean) - whether the target is on a platform (e.g., boat).
*   **Returns:** Nothing.
*   **Error states:** Cleans up event listeners on previous target before assigning a new one.

### `SetDelay(delay)`
*   **Description:** Sets or resets the initial delay timer before the pillar activates. Used during spawn and save/load to synchronize timing.
*   **Parameters:** `delay` (number) - delay duration in seconds.
*   **Returns:** Nothing.

### `OnSave(data)`
*   **Description:** Captures pillar state (variation, flip orientation, platform status) for serialization.
*   **Parameters:** `data` (table) - output table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores pillar state on load, including animation frame and timer re-initialization. Validates timer existence to detect corrupted save data.
*   **Parameters:** `inst` (Entity instance) - current instance; `data` (table) - loaded data.
*   **Returns:** Nothing.
*   **Error states:** Removes the entity if timer data is invalid.

### `OnLoadPostPass(inst, ents, data)`
*   **Description:** Completes post-load setup: reattaches target event listeners and applies platform tag if needed.
*   **Parameters:** `inst` (Entity instance); `ents` (table of entities); `data` (table).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` (internal handler `Pillar_OnTimerDone`), `onsink` (dispell pillar), `dispell_shadow_pillars`, `death`, `onremove`, `remove_shadow_pillars`, `reduce_shadow_pillars_time`, `animover` (on pillar deactivation).
- **Pushes:** `attacked` (on spell completion), `remove_shadow_pillars` (on pillar removal or target movement).
- **Targets listen to (via `shadow_pillar_target`):** `attacked`, `blocked` (for timer reduction), `newstate` (for flight detection), `teleported`, `enterlimbo`, `death`, `onremove`.