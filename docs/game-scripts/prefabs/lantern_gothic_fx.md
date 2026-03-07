---
id: lantern_gothic_fx
title: Lantern Gothic Fx
description: Creates and manages visual particle effects (glowing embers) for the Gothic Lantern item when held or placed on the ground.
tags: [fx, visual, lantern, particle]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3487486d
system_scope: fx
---

# Lantern Gothic Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lantern_gothic_fx` is a prefabs script that defines two distinct FX entities: one for when the Gothic Lantern is held (`lantern_gothic_fx_held`) and one for when it is placed on the ground (`lantern_gothic_fx_ground`). These FX entities generate animated glowing ember particles using dynamic animations and handle behavior such as movement detection and animation state transitions. They are non-persistent, non-networked visual-only entities used solely for rendering effects.

## Usage example
This component is instantiated automatically by the game when the Gothic Lantern (not shown here) spawns or changes states. As a prefab factory, it is not manually added to entities but is referenced via prefab names:

```lua
-- Example internal usage in lantern logic (not part of this file)
if held then
    local fx = SpawnPrefab("lantern_gothic_fx_held")
    fx.entity:SetParent(lantern_entity.entity)
else
    local fx = SpawnPrefab("lantern_gothic_fx_ground")
    fx.Transform:SetPosition(lantern_entity.Transform:GetWorldPosition())
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX` tag to spawned FX entities.

## Properties
No public properties. All internal state is held in local variables or instance fields without formal getter/setter exposure.

## Main functions
### `heldfn()`
*   **Description:** Factory function that constructs and configures the held FX entity. Spawns a series of glowing ember particles at timed intervals using `DoTaskInTime` and starts a periodic movement check.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — The configured FX entity for held state.
*   **Error states:** Does nothing on dedicated servers (`TheNet:IsDedicated()` returns `true`); only client-side logic executes.

### `groundfn()`
*   **Description:** Factory function that constructs and configures the ground FX entity. Plays initial "pre" animation, loops "glow_loop", and supports kill/abort via `KillFX`.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — The configured FX entity for ground state.
*   **Error states:** During world population (`POPULATING` is true), initializes animation frame randomly to avoid visual sync issues.

### `CreateGlowEmber(glowemitter, variation, step)`
*   **Description:** Creates and configures a single glowing ember entity. Attaches to the parent lantern (`glowemitter`), sets animation based on variation, and begins tracking movement.
*   **Parameters:**  
    `glowemitter` (entity) — The parent lantern entity emitting the ember.  
    `variation` (number) — Index from `1` to `7` selecting animation variant.  
    `step` (number) — Movement step identifier passed to `IsMovingStep`.
*   **Returns:** `inst` (entity) — The created ember FX entity.
*   **Error states:** None documented.

### `KillFX(inst)`
*   **Description:** Helper function used by ground FX to cleanly terminate itself — either by removing immediately (if just spawned) or marking for removal.
*   **Parameters:**  
    `inst` (entity) — The FX entity to kill.
*   **Returns:** Nothing.

### `OnGlowAnimOver(inst)`
*   **Description:** Callback invoked when a held FX ember’s animation finishes. Handles visibility based on movement status, syncs position to parent, and restarts animation.
*   **Parameters:**  
    `inst` (entity) — The FX entity whose animation just ended.
*   **Returns:** Nothing.
*   **Error states:** Removes the entity if the parent emitter (`glowemitter`) is invalid.

### `OnGroundAnimOver(inst)`
*   **Description:** Callback invoked when the ground FX animation finishes. Handles looping or transition to "glow_pst" based on kill flag.
*   **Parameters:**  
    `inst` (entity) — The FX entity whose animation just ended.
*   **Returns:** Nothing.

### `CheckMoving(inst)`
*   **Description:** Periodically checks whether the FX entity (held mode) is moving relative to its parent and updates `ismoving` flag.
*   **Parameters:**  
    `inst` (entity) — The FX entity being checked.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` — Used on both held and ground FX embers to trigger animation completion logic (`OnGlowAnimOver` or `OnGroundAnimOver`).  
- **Pushes:** None.