---
id: wagdrone_flying
title: Wagdrone Flying
description: Spawnable flying mech entity with targeting marker effects, hackable loot drops, and stategraph-driven animation states.
tags: [prefab, mech, entity, flying]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: ab6966de
system_scope: entity
---

# Wagdrone Flying

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wagdrone_flying.lua` registers a spawnable flying mech entity. The prefab's `fn()` constructor builds the physics body, attaches client-side components (updatelooper for post-update rendering), and sets up network replication via netvars. On the master simulation, it attaches gameplay components (inspectable, locomotor) and the stategraph. The targeting marker system uses a separate FX entity that syncs animation frames with the parent wagdrone. The prefab is referenced by its name `"wagdrone_flying"` and instantiated with `SpawnPrefab("wagdrone_flying")`.

## Usage example
```lua
-- Spawn at world origin:
local inst = SpawnPrefab("wagdrone_flying")
inst.Transform:SetPosition(0, 0, 0)

-- Reference assets at load time:
local assets = {
    Asset("ANIM", "anim/wagdrone_flying.zip"),
    Asset("ANIM", "anim/wagdrone_projectile.zip"),
    Asset("SCRIPT", "scripts/prefabs/wagdrone_common.lua"),
}

-- Control targeting marker visibility:
inst.ShowTargeting(true, false)  -- show marker
inst.ShowTargeting(true, true)   -- commit (scale up + fade)
inst.ShowTargeting(false)        -- cancel/hide
```

## Dependencies & tags
**External dependencies:**
- `easing` -- easing functions for fade-out animations on targeting FX cancellation
- `prefabs/wagdrone_common` -- shared wagdrone logic (MakeHackable, PreventTeleportFromArena, ChangeToLoot, HackableLoadPostPass)
- `TUNING.WAGDRONE_FLYING_DAMAGE` -- base damage value for scrapbook display
- `TUNING.WAGDRONE_FLYING_RUNSPEED` -- run speed applied to locomotor component

**Components used:**
- `updatelooper` -- client-side post-update for targeting FX position sync and flicker animation
- `inspectable` -- provides GetStatus for player inspection (DAMAGED, INACTIVE states)
- `locomotor` -- movement control with directdrive bypass for pathfinding
- `workable` -- checked in GetStatus to determine DAMAGED state (added externally via WagdroneCommon)

**Tags:**
- `can_offset_sort_pos` -- enables custom sort position offset for rendering
- `mech` -- identifies entity as mechanical
- `electricdamageimmune` -- immune to electric damage
- `soulless` -- no soul-related interactions
- `lunar_aligned` -- aligned with lunar faction
- `wagdrone` -- wagdrone family identifier
- `FX` -- added to targeting marker entity (not main prefab)
- `NOCLICK` -- added to targeting marker entity (not main prefab)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of Asset entries: 2 ANIM files (wagdrone_flying, wagdrone_projectile), 1 SCRIPT file (wagdrone_common). |
| `prefabs` | table | `{...}` | Dependent prefab names: wagdrone_projectile_fx, wagdrone_parts, gears, transistor, wagpunk_bits. |
| `targeting` | net_tinybyte | --- | Dirty event: `targetingdirty`. Values: 0=cancel/hide, 1=commit (scale+fade), 2=show. Synced to clients. |
| `targetingfx` | entity | `nil` | Reference to the targeting marker FX entity. Created when targeting state becomes 2. |
| `scrapbook_damage` | number | `TUNING.WAGDRONE_FLYING_DAMAGE * TUNING.ELECTRIC_DAMAGE_MULT` | (master only) Dry damage value for scrapbook display, excludes electric immunity multiplier. |

## Main functions
### `fn()`
*   **Description:** Prefab constructor. Creates the entity, builds flying physics, attaches AnimState/SoundEmitter/Light/Network components, sets default animation (off_idle), adds tags, and initializes netvars. On client, adds updatelooper for post-update rendering. On master, attaches gameplay components (inspectable, locomotor), sets stategraph, and exposes public methods. Returns `inst` for framework to branch into master-only initialization.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** None — runs on every host (client and server).

### `ShowTargeting(inst, show, commit)`
*   **Description:** Controls the targeting marker visibility and animation state. Sets the `targeting` netvar which triggers `OnTargetingDirty` on clients. State 2 shows the marker, state 1 commits (plays marker_pst animation with fade), state 0 cancels (quick fade out). Only updates netvar if the new state differs from current value.
*   **Parameters:**
    - `inst` -- wagdrone entity instance
    - `show` -- boolean to show/hide marker (false hides, true shows)
    - `commit` -- boolean to commit the targeting action (triggers scale-up + fade animation)
*   **Returns:** None
*   **Error states:** None — guards against redundant state changes via value comparison.

### `GetStatus(inst, viewer)`
*   **Description:** Returns inspection status string for the inspectable component. Checks workable component first (DAMAGED), then stategraph off tag (INACTIVE), otherwise returns nil for default status.
*   **Parameters:**
    - `inst` -- wagdrone entity instance
    - `viewer` -- player entity viewing the inspection (unused in logic)
*   **Returns:** String `"DAMAGED"`, `"INACTIVE"`, or `nil`
*   **Error states:** None — all component/tag checks are safe.

### `OnSave(inst, data)`
*   **Description:** Saves entity state for world persistence. Records whether the wagdrone is active (not in off state) and whether it has been converted to loot (workable component present).
*   **Parameters:**
    - `inst` -- wagdrone entity instance
    - `data` -- table to populate with save data
*   **Returns:** None (modifies data table in place)
*   **Error states:** None — all state checks are safe.

### `OnLoad(inst, data, ents)`
*   **Description:** Restores entity state from saved data. If `data.on` is true, transitions to idle state. If entity is in off state and has non-zero Y position, teleports to ground level. If `data.isloot` is true, converts to loot form via WagdroneCommon.ChangeToLoot.
*   **Parameters:**
    - `inst` -- wagdrone entity instance
    - `data` -- saved data table from OnSave
    - `ents` -- entity reference table for resolving saved GUIDs (unused here)
*   **Returns:** None
*   **Error states:** None — all state checks and transformations are guarded.

### `PostUpdate(inst)`
*   **Description:** Client-side post-update callback registered with updatelooper. Adjusts animation sort order based on world Y position to ensure proper rendering depth relative to terrain.
*   **Parameters:** `inst` -- wagdrone entity instance
*   **Returns:** None
*   **Error states:** None — Transform and AnimState are guaranteed to exist.

### `OnTargetingDirty(inst)` (local)
*   **Description:** Client-only dirty event handler for `targetingdirty` netvar change. Creates or destroys the targeting FX entity based on targeting state (2=show, 1=commit, 0=cancel). Handles animation sync, sound playback, and cleanup tasks.
*   **Parameters:** `inst` -- wagdrone entity instance (accessed via fx.parent reference)
*   **Returns:** None
*   **Error states:** None — all FX creation/destruction paths are guarded.

### `CreateTargetingFx()` (local)
*   **Description:** Creates the targeting marker FX entity. Sets up transform, anim state, sound emitter, and updatelooper components. Plays marker_pre then marker_loop animations. Configures rendering layer, sort order, and initial color. Returns FX entity attached to parent wagdrone.
*   **Parameters:** None
*   **Returns:** FX entity instance
*   **Error states:** None — all component additions are guaranteed to succeed.

### `Target_OnUpdateFlicker(fx, dt)` (local)
*   **Description:** Update callback for targeting FX flicker animation. Cycles through 5 flicker states, adjusting mult colour alpha at states 0 and 2 for pulsing effect.
*   **Parameters:**
    - `fx` -- targeting FX entity
    - `dt` -- delta time since last update
*   **Returns:** None
*   **Error states:** None — dt check prevents division issues.

### `Target_SyncMarkerAnim(inst, fx)` (local)
*   **Description:** Synchronizes targeting FX animation frame with parent wagdrone's attack pre-animation. Returns true if sync succeeded, false if parent is not in atk_pre animation.
*   **Parameters:**
    - `inst` -- parent wagdrone entity
    - `fx` -- targeting FX entity
*   **Returns:** boolean -- true if synced, false if parent not in atk_pre
*   **Error states:** None — animation state queries are safe.

### `Target_OnPostUpdate(fx)` (local)
*   **Description:** Post-update callback for targeting FX position sync. Sets FX position to match parent's X/Z but inverted Y (for ground projection). If syncanim flag is set, attempts to sync animation frame with parent.
*   **Parameters:** `fx` -- targeting FX entity
*   **Returns:** None
*   **Error states:** None — parent Transform is guaranteed to exist.

### `Target_OnUpdateCancel(fx, dt)` (local)
*   **Description:** Update callback for targeting FX cancellation fade-out. Uses easing.outQuad to interpolate alpha from 1 to 0 over 0.2 seconds, then removes the FX entity.
*   **Parameters:**
    - `fx` -- targeting FX entity
    - `dt` -- delta time since last update
*   **Returns:** None
*   **Error states:** None — easing function and removal are safe.

## Events & listeners
- **Listens to (client only):** `targetingdirty` -- triggers OnTargetingDirty when targeting netvar changes; creates/destroys targeting FX entity
- **Listens to (FX entity):** `animover` -- triggers fx.Remove after marker_pst animation completes on commit state
- **Pushes:** None identified