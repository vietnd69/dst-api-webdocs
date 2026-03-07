---
id: gestalt_cage
title: Gestalt Cage
description: Manages the gestalt cage item, including its equippable state, weapon damage, and three upgradeable filled states (1–3) that can deploy wagdrones when placed.
tags: [combat, inventory, deployment, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4dd252c8
system_scope: inventory
---

# Gestalt Cage

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`gestalt_cage.lua` defines the gestalt cage item and its associated prefabs, including the base cage, equippable swap effects, and three progressively enhanced filled states (`filled1`, `filled2`, `filled3`). The component supports equipping (with animation overrides and FX attachment), weapon damage, and deployment into wagdrones upon meeting specific world conditions (e.g., `wagboss_defeated`). It integrates with `equippable`, `weapon`, `deployable`, `placer`, `inventoryitem`, `inspectable`, `bloomer`, and `colouradder` components for visual, gameplay, and networked behavior.

## Usage example
```lua
local inst = Prefab("gestalt_cage")
inst:AddComponent("gestaltcage") -- implicitly added by the prefab constructor

-- Adjust weapon damage
inst.components.weapon:SetDamage(TUNING.GESTALT_CAGE_DAMAGE)

-- Initiate capture animation sequence for level 2 (must be called on server)
if inst.components.gestaltcage and inst.level == 2 then
    inst.StartCapture(inst)
end

-- Deploy filled cage (server-side only)
if inst.components.deployable then
    inst.components.deployable.ondeploy(inst, pt, deployer)
end
```

## Dependencies & tags
**Components used:** `inspectable`, `tradable`, `inventoryitem`, `equippable`, `weapon`, `deployable`, `placer`, `bloomer`, `colouradder`, `wagboss_tracker`, `wagpunk_arena_manager`.  
**Tags added:** `weapon`, `gestalt_cage`, `gestalt_cage_filled`, `usedeploystring`, `CLASSIFIED`, `NOCLICK`, `placer`, `irreplaceable` (level 3 only), `gestalt_cage_filled_placerindicator` (placer indicator only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `1`, `2`, or `3` | Current filled state of the cage; affects visuals, sound, and deployment behavior. |
| `replacementprefab` | string | `"wagdrone_rolling"` or `"wagdrone_flying"` | Prefab name to spawn on deployment (set per filled level). |
| `_custom_candeploy_fn` | function | `CLIENT_CanDeployGestaltCage` | Client-side check for whether placement is allowed near an indicator. |
| `StartCapture` | function | `StartCapture` (bound at runtime) | Method to begin capture animation sequence (not attached to base `gestalt_cage`). |
| `_flickertask` | task handle | `nil` | Task handle for LED flicker animation (level 1–2 only). |
| `_soundtask` | task handle | `nil` | Task handle for sound scheduling/loop management. |

## Main functions
### `StartCapture(inst)`
* **Description:** Initiates the capture animation sequence for a filled cage (levels 1–3). Plays `catch` → `success_N` → `success_N_loop`, manages sound playback, and sets facing mode.
* **Parameters:** `inst` (entity) – the filled cage instance.
* **Returns:** Nothing.
* **Error states:** No internal error handling; assumes `inst.level` is 1, 2, or 3. Resets facing model only after `onputininventory` (server-side).

### `OnDeploy(inst, pt, deployer)`
* **Description:** Server-side deployment callback. Spawns the configured `replacementprefab`, registers it with `wagpunk_arena_manager`, removes any overlapping placer indicator, and fires the `ms_wagpunk_constructrobot` event.
* **Parameters:**  
  - `inst` (entity) – filled cage being deployed.  
  - `pt` (vector) – deployment position.  
  - `deployer` (entity) – entity performing deployment (not used directly).
* **Returns:** Nothing.
* **Error states:** Silently skips `wagpunk_arena_manager` tracking if missing.

### `CLIENT_CanDeployGestaltCage(inst, pt, mouseover, deployer, rotation)`
* **Description:** Client-side predicate to enable placement UI (e.g., cursor feedback) when a `gestalt_cage_filled_placerindicator` is within `GESTALT_CAGE_FILLED_PLACEMENT_RADIUS`.
* **Parameters:** Same as `placer` deploy checks.
* **Returns:** `true` if one or more indicator entities exist in radius, otherwise `false`.

### `DoFlicker(inst, i)`
* **Description:** Recursively animates LED flicker for levels 1–2 using alternating multicolours and random delays (1–2 FRAMES or 1–3 FRAMES). Handles initial low-intensity flicker (`i=10`) then transitions to loop.
* **Parameters:**  
  - `inst` (entity) – the cage instance.  
  - `i` (number) – recursion depth counter.
* **Returns:** Nothing (schedules next task).
* **Error states:** No error handling; relies on `inst.AnimState` and `inst.level`.

### `Filled_StartSoundLoop(inst)`
* **Description:** Plays looping sound `rifts5/gestalt_cage/caught[_level]_LP`, respecting `inst.level`.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `OnCaptureLevel3AnimQueueOver(inst)`
* **Description:** Level 3–specific post-animation callback. Triggers `success_3_jiggle` + randomized loops, and a wiggle sound.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `fx_AttachToOwner(inst, owner)`
* **Description:** Attaches the `gestalt_cage_swap_fx` prefab to owner’s `swap_object` symbol, registers highlight tracking, and informs `bloomer`/`colouradder` components of child attachment.
* **Parameters:**  
  - `inst` (entity) – FX instance.  
  - `owner` (entity) – owning character/actor.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` (via `bloomer:AttachChild`, `colouradder:AttachChild`) – cleans up child registration.  
  - `onputininventory` – stops flicker/sound (levels 1–2) and clears facing model (level 3).  
  - `ondropped` – resumes flicker/sound.  
  - `wagboss_defeated` – dynamically adds `deployable` component if not yet met.  
  - `animqueueover` (level 3 only) – triggers `OnCaptureLevel3AnimQueueOver`.  
  - `onEntityReplicated` (client-only FX) – registers highlight owner.
- **Pushes:**  
  - `ms_wagpunk_constructrobot` (server) – fires once cage is deployed.