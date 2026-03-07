---
id: yotc_carrat_race_checkpoint
title: Yotc Carrat Race Checkpoint
description: Manages the behavior and visual state of a checkpoint used in the Carrat Race minigame, including light toggling, racer detection, and interaction callbacks.
tags: [minigame, checkpoint, lighting, interaction]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d5dcefc6
system_scope: world
---

# Yotc Carrat Race Checkpoint

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotc_carrat_race_checkpoint` prefab represents a functional checkpoint in the Carrat Race minigame. It provides visual feedback via animated and lit lanterns, responds to racer events, supports hammering interactions, and manages its own state transitions (e.g., `taken`, `is_on`). It integrates with the `lootdropper`, `workable`, and `inspectable` components and relies on shared logic from `yotc_carrat_race_common`.

## Usage example
```lua
local checkpoint = SpawnPrefab("yotc_carrat_race_checkpoint")
checkpoint.Transform:SetPosition(x, y, z)

-- Event for when a racer reaches the checkpoint
checkpoint:PushEvent("yotc_racer_at_checkpoint", { racer = racer_entity })
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`, `light`, `animstate`, `soundemitter`, `minimapentity`, `transform`, `network`  
**Tags added:** `structure`, `yotc_racecheckpoint`

## Properties
No public properties are defined or externally exposed in the constructor. Internal state is stored as `inst.is_on` and `inst.taken` on the instance.

## Main functions
### `ToggleLights(inst, turn_on, pushanim, setcolor)`
*   **Description:** Toggles the checkpoint's light state and plays the corresponding animation (`idle_on` or `idle_off`).
*   **Parameters:**
    *   `inst` (entity) — The checkpoint entity.
    *   `turn_on` (boolean) — Whether to turn the light on.
    *   `pushanim` (boolean) — If `true`, pushes animation onto the stack; otherwise, plays immediately.
    *   `setcolor` (ignored) — Parameter retained for compatibility; unused in current implementation.
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Triggered when the checkpoint is placed/builds. Plays the "place" animation and sound.
*   **Parameters:**
    *   `inst` (entity) — The checkpoint entity.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Called when the checkpoint is fully hammered (work complete). Drops loot and destroys the checkpoint.
*   **Parameters:**
    *   `inst` (entity) — The checkpoint entity.
    *   `worker` (entity) — The entity performing the hammering.
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Handles partial hammering (work callback). Plays a hit animation and re-asserts current light state.
*   **Parameters:**
    *   `inst` (entity) — The checkpoint entity.
*   **Returns:** Nothing.
*   **Error states:** Skips animation if the checkpoint is burnt, currently placing, or already `_active`.

### `OnRacerAtCheckpoint(inst, data)`
*   **Description:** Handles `yotc_racer_at_checkpoint` events. Marks the checkpoint as taken, activates lights, and updates visual appearance with the racer's color.
*   **Parameters:**
    *   `inst` (entity) — The checkpoint entity.
    *   `data` (table) — Contains `data.racer`, the entity passing the checkpoint.
*   **Returns:** Nothing.

### `ResetLights(inst)`
*   **Description:** Resets the checkpoint state after the race ends. Clears color overrides and returns to default (`idle_off`) state.
*   **Parameters:**
    *   `inst` (entity) — The checkpoint entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onbuilt` — Calls `onbuilt(inst)` when placed.
  - `yotc_racer_at_checkpoint` — Calls `OnRacerAtCheckpoint(inst, data)` when a racer reaches the checkpoint.
  - `yotc_race_over` — Calls `ResetLights(inst)` when the race concludes.
- **Pushes:** None.