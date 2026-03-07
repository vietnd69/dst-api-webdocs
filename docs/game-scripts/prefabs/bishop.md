---
id: bishop
title: Bishop
description: Handles the behavior, combat, and visual effects for the Bishop chesspiece enemy in DST, including both normal and nightmare variants.
tags: [combat, boss, fx, ai]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 445588df
system_scope: entity
---

# Bishop

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The Bishop prefab defines a hostile chesspiece monster with ranged attack capabilities and associated visual effects (FX). It is implemented via three related entities: the main `bishop` entity, the `bishop_nightmare` variant, and the `bishop_targeting_fx` reticule FX. The component attaches multiple standard ECS components (combat, health, locomotor, sleeper, lootdropper) and custom logic for targeting, FX management, and network synchronization. It uses the `bishopbrain` AI and shared utilities from `clockwork_common` and `RuinsRespawner`.

## Usage example
```lua
-- Create a normal Bishop
local bishop = Prefab("bishop", ...)

-- Access combat properties
bishop.components.combat:SetDefaultDamage(25)
bishop.components.combat:SetRange(5, 7)

-- Trigger visual FX for a shot at position
bishop.StartShotFx({x = 10, y = 0, z = -5})

-- Set distance for targeting reticule
bishop.targetingfx.SetDistFromBishop(bishop.targetingfx, 8)
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `health`, `inspectable`, `knownlocations`, `locomotor`, `embarker`, `drownable`, `lootdropper`, `sleeper`, `acidinfusible` (nightmare only), `updatelooper`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`, `light`.  
**Tags:** Adds `bishop`, `chess`, `hostile`, `monster`, `cavedweller` (nightmare only), `shadow_aligned` (nightmare only), `FX`, `NOCLICK` (for FX entities).

## Properties
No public properties are initialized or exposed outside the component logic. All state is managed internally or via component fields.

## Main functions
### `StartShotFx(inst, pos)`
*   **Description:** Initializes the visual FX trail for a Bishop's ranged attack by starting the shot FX tracking and setting the target coordinates.
*   **Parameters:** `inst` (entity) — the Bishop entity; `pos` (table) — `{x, y, z}` target position.
*   **Returns:** Nothing.
*   **Error states:** Only runs non-dedicated server logic on the client; dedicated servers skip the FX startup.

### `OnRemoveEntity(inst)`
*   **Description:** Cleanup function called when the Bishop entity is removed — destroys the targeting FX and any active shot FX segments.
*   **Parameters:** `inst` (entity) — the Bishop entity.
*   **Returns:** Nothing.

### `SetDistFromBishop(inst, dist)`
*   **Description:** Updates the distance metric used by the targeting reticule to adjust light and position. Triggers repositioning of the FX tail if needed.
*   **Parameters:** `inst` (entity) — the targeting FX instance; `dist` (number) — current distance from the Bishop.
*   **Returns:** Nothing.

### `KillFx(inst)`
*   **Description:** Terminates the targeting reticule FX by resetting distance, playing the "reticule_pst" animation, and scheduling removal on animation end.
*   **Parameters:** `inst` (entity) — the targeting FX instance.
*   **Returns:** Nothing.

### `CreateShotSegFx(frame, scale)`
*   **Description:** Factory function to create a single FX segment of the attack trail. Returns a lightweight non-persistent FX entity.
*   **Parameters:** `frame` (number) — animation frame index; `scale` (number) — local scale factor.
*   **Returns:** FX entity with `animstate`, `transform`, and "FX", "NOCLICK" tags.

### `UpdateShotFx(inst)`
*   **Description:** Post-update function that positions and manages shot FX segments during the attack animation ("atk2_pst"), updating position, alpha, and count dynamically.
*   **Parameters:** `inst` (entity) — the Bishop entity.
*   **Returns:** Nothing.

### `OnShowShotDirty(inst)`
*   **Description:** Reacts to network sync events for the shot effect, starting or stopping the shot FX update loop.
*   **Parameters:** `inst` (entity) — the Bishop entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `showshotdirty` — updates shot FX tracking; `attacked` — triggers `clockwork_common.OnAttacked`; `newcombattarget` — triggers `clockwork_common.OnNewCombatTarget`; `animover` (FX only) — removes FX after animation completes; `distdirty` (FX only) — updates reticule positioning.
- **Pushes:** None directly; relies on event callbacks in shared scripts.