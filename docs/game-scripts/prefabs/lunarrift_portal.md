---
id: lunarrift_portal
title: Lunarrift Portal
description: Manages a stage-progressing rift portal that transforms terrain, spawns lunar enemies and crystals, and triggers ground-pound events during growth phases.
tags: [ rift, boss, terrain, spawn, combat ]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f54c587e
system_scope: world
---

# Lunarrift Portal

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `lunarrift_portal` is a specialized world entity that drives progression in the Lunar Rift event. It starts at stage 1 and automatically advances through increasing stages up to a maximum defined by `RIFT_LUNAR1_MAXSTAGE`. As it grows, it terraforms the surrounding terrain into `RIFT_MOON` tiles, spawns lunar crystals and lunar grazer entities, updates lighting/shadow visuals, and triggers a ground-pound effect on stage transition. It maintains state including stage number, crystal tracking, and a terraforming proxy component, and integrates with the global rift system via `rift_portal_defs`.

## Usage example
```lua
-- The portal prefab is instantiated automatically by the rift spawner system.
-- Modders should not manually spawn it; instead, modify its behavior by overriding rift definitions.
-- Example of accessing portal properties from an event handler:
if event == "ms_lunarrift_maxsize" then
    local portal = data  -- data is the portal instance
    print("Portal reached max stage:", portal._stage)
end
```

## Dependencies & tags
**Components used:** `combat`, `groundpounder`, `inspectable`, `riftthralltype`, `timer`  
**Tags added:** `birdblocker`, `ignorewalkableplatforms`, `notarget`, `NOBLOCK`, `scarytoprey`, `lunarrift_portal`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_stage` | number | `1` | Current stage of the portal (1-based, max determined by `TUNING.RIFT_LUNAR1_MAXSTAGE`). |
| `_crystals` | table | `{}` | Dictionary mapping crystal entity instances to `true`, used to track spawned crystals and ensure cleanup. |
| `_terraformer` | entity or nil | `nil` | Reference to the spawned `rift_terraformer` proxy entity used to schedule terrain changes. |
| `shadow` | entity or nil | `nil` | Shadow effect entity attached to the portal. |
| `icon_max` | boolean | `false` | Indicates whether the portal is at max stage and uses the max-stage minimap icon. |
| `_finished` | boolean | `false` | Set to `true` when the portal has reached its end state and will vanish. |

## Main functions
### `TryStageUp(force_finish_terraforming)`
*   **Description:** Initiates the transition to the next stage by hiding the current animation, starting a stagedelay timer, and scheduling stage-up logic.
*   **Parameters:** `force_finish_terraforming` (boolean) – If `true`, schedules forced completion of pending terraforming tasks to avoid leaving terrain in inconsistent state during shutdown.
*   **Returns:** Nothing.

### `do_stage_up()`
*   **Description:** Performs the actual stage transition logic: updates visual animations, ambient sound intensity, shadow scale, and light radius; triggers a ground-pound effect; schedules next stage or finishes; and spawns new crystals/grazers.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TrackCrystal(crystal)`
*   **Description:** Registers a crystal entity to the portal's tracking table and sets up a listener to remove it from the table when the crystal is removed.
*   **Parameters:** `crystal` (entity) – The crystal entity instance to track.
*   **Returns:** Nothing.

### `ForceFinishTerraforming()`
*   **Description:** Forces completion of any pending terraforming tasks and immediately activates pre-spawned hidden grazers, used during shutdown or time-sensitive events.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` – Handles timed progression events (stage-up, crystal spawns, initialization).  
- **Listens to:** `onremove` – Triggers cleanup of terraformer and crystal entities, and reverts terrain.  
- **Listens to:** `finish_rift` – Initiates portal vanishing sequence and final cleanup.  
- **Pushes:** `ms_lunarrift_maxsize` – Broadcast when the portal reaches maximum stage.  
- **Pushes:** `ms_lunarportal_removed` – Broadcast when portal removal begins (pre-vanish cleanup).
