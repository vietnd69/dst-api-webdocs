---
id: shadowrift_portal
title: Shadowrift Portal
description: Manages the lifecycle, stage progression, and environmental effects of the Shadow Rift portal entity, including miasma generation, spawner configuration, and visual/sound transitions between stages.
tags: [combat, environment, boss, world, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 39295a77
system_scope: environment
---

# Shadowrift Portal

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadowrift_portal` prefab represents a dynamic, multi-stage environmental hazard in DST. It starts small and harmless but grows over time through three progressive stages, increasing its physical radius, damaging output, and miasma generation. It uses the `groundpounder`, `childspawner`, and `timer` components to orchestrate stage transitions, enemy spawning, and world-altering effects like camera shake and ground impact. The portal is non-interactive (`notarget`) and blocks movement (`birdblocker`), and it automatically closes and removes itself after a set duration.

## Usage example
```lua
-- The prefab is automatically instantiated via level/worldgen logic (not manual instantiation).
-- Typical usage involves interacting with its exposed methods:
local portal = TheWorld:FindLaPrefabs("shadowrift_portal")[1]
if portal and portal.components then
    -- Force portal to advance to next stage
    portal:TryStageUp()
    -- Manually trigger miasma creation
    portal:CreateMiasma()
end
```

## Dependencies & tags
**Components used:**  
- `combat` – sets groundpound damage  
- `groundpounder` – executes ring-based impacts (size scales with stage)  
- `timer` – manages stage-up intervals, miasma seeding, portal closing  
- `childspawner` – spawns `fused_shadeling` enemies at fixed rates per stage  
- `inspectable` – allows investigation via inventory  
- `riftthralltype` – affinity assignment for Shadow-aligned thralls  

**Tags added/used:**  
- `birdblocker` – blocks flying creatures  
- `ignorewalkableplatforms` – ignores platforms for pathing  
- `notarget` – immune to mob targeting  
- `scarytoprey` – causes prey to flee  
- `shadow_aligned` – immune to own groundpound damage  
- `shadowrift_portal` – identifies portal for world logic  
- `FX`, `NOCLICK`, `NOBLOCK` (for the particle FX child prefab)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_stage` | number | `1` | Current portal stage (1–`TUNING.RIFT_SHADOW1_MAXSTAGE`), tracked only on server. |
| `_closing` | boolean | `false` | Flag set when portal is closing; prevents further stage-ups. |
| `_fx` | Entity | `nil` | Reference to the particle effect child prefab (`shadowrift_portal_fx`). |
| `highlightchildren` | table | `{_fx}` | Child entities highlighted when hovered (for minimap/picking). |
| `icon_max` | boolean | `false` | Whether the portal has reached max stage and uses `_max` minimap icon. |

## Main functions
### `TryStageUp()`
* **Description:** Advances the portal to the next stage if not closed or at max stage. Updates physics, groundpound radius, animations, ambient sound intensity, and triggers camera shake. May schedule another stage-up or stop the timer if at max stage.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Silently returns if `inst._closing` is true.

### `CreateMiasma(initial)`
* **Description:** Spawns one or eight `miasma_cloud` entities using the `miasmamanager` component in `TheWorld`. If `initial` is `true`, creates a square pattern around the portal; otherwise, places a single miasma at a random radius.
* **Parameters:** `initial` (boolean, optional) – whether this is the initial seed miasma placement.
* **Returns:** Nothing.

### `ConfigureShadelingSpawn(stage)`
* **Description:** Updates the `childspawner` component's spawn parameters (`REGEN_TIME`, `RELEASE_TIME`, `MAX_CHILDREN`) based on the provided stage (or current `_stage`).
* **Parameters:** `stage` (number, optional) – stage index to fetch tuning values for.
* **Returns:** Nothing.

### `SetMaxMinimapStatus()`
* **Description:** Updates the minimap icon to the `_max` variant and sets `icon_max = true`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnStageFx()`
* **Description:** Spawns and positions a `statue_transition` FX entity centered on the portal, scaling with the current stage (`_stage * 0.5`).
* **Parameters:** None.
* **Returns:** Entity – the spawned `statue_transition` FX entity.

### `ClosePortal()`
* **Description:** Initiates the portal's closing animation, plays the `portal_disappear` sound, triggers FX disappearance, and schedules removal after the animation length.
* **Parameters:** None.
* **Returns:** Nothing.

### `Initialize()`
* **Description:** Performs first-time setup after the portal wakes: plays stage-1 FX, spawns initial miasma, sets groundpounder radius, performs two groundpounds (for debris/item pushing), and triggers camera shake.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `timerdone` – handled by `OnTimerDone`, triggers stage-up, miasma spawn, removal, or initialization based on timer name.  
  - `onremove` – handled by `OnPortalRemoved` (currently no action beyond comment).  
- **Pushes:**  
  - `ms_shadowrift_maxsize` – fired when portal reaches max stage (for world-wide event updates).