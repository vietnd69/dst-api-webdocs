---
id: monsterwarningsounds
title: Monsterwarningsounds
description: Generates and spawns client-side warning sound effects for major monsters (e.g., Deerclops, Bearger, Krampus) at varying distances based on their attack proximity.
tags: [audio, boss, fx, monster, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2d9b6940
system_scope: audio
---

# Monsterwarningsounds

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`monsterwarningsounds` is a prefab generator script that defines and creates prefabs for warning sound effects triggered by key boss or seasonal monsters during their approach. These prefabs are non-durable, client-local entities that emit sounds when monsters are within or near their spawn detection radius. The component uses a table-driven approach (`monster_params`) to configure sound paths and distance thresholds per monster and level, and leverages the `easing.lua` module to smoothly fade sound volume based on player proximity.

## Usage example
The prefabs defined here are typically instantiated automatically by monster spawners (e.g., `deerclopsspawner.lua`) when a monster enters a specific warning range:
```lua
-- Example: Spawning the Deerclops warning sound level 3
local warning_inst = Prefab("deerclopswarning_lvl3", makewarning(monster_params.deerclops, 3))
-- The actual entity creation is handled by the game's spawner logic using `inst:PushEvent("warning_start", { level = 3 })`
-- which triggers spawning via the prefab system, not direct manual instantiation in mod code.
```

## Dependencies & tags
**Components used:** `net_byte` (networked byte property via `net_byte` macro), `Transform`, `SoundEmitter`, `Network`
**Tags:** Adds `FX` tag to spawned warning entities.

## Properties
No public properties are defined on the component itself. The script is a module returning prefabs, and the generated prefabs hold only private, transient state (`_params`, `_level`, `_rand`) used during sound playback.

## Main functions
### `PlayWarningSound(proxy, sound, range, theta, radius)`
*   **Description:** Spawns a temporary, non-networked entity to emit a warning sound at a relative position around the `proxy` (usually the monster). Sound volume fades out smoothly as the player moves away beyond the monster's effective range using `easing.inQuad`.
*   **Parameters:**
    - `proxy` (entity instance) - The monster entity serving as reference for sound position.
    - `sound` (string) - Path to the sound file (e.g., `"dontstarve/creatures/deerclops/distant"`).
    - `range` (number) - Monster's warning spawn distance threshold.
    - `theta` (number) - Azimuth angle in radians for sound placement.
    - `radius` (number) - Base radial distance for sound placement; adjusted for fading if player is out of range.
*   **Returns:** Nothing.
*   **Error states:** Sound placement relies on `TheFocalPoint` (player camera target); if `TheFocalPoint` is invalid, behavior is undefined. No error handling is implemented in this function.

### `OnRandDirty(inst)`
*   **Description:** Event handler that initiates playback of the warning sound when the `_rand` networked value becomes available (i.e., after replication). Ensures proper entity positioning before sound emission by scheduling playback with a 0-delay task.
*   **Parameters:** `inst` (entity instance) - The warning entity that received a `"randdirty"` event.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `inst._params`, `inst._level`, or `inst._rand:value()` is `nil` or non-positive.

### `makewarning(params, level)`
*   **Description:** Factory function that returns a prefab constructor function for a specific monster warning level. Creates an entity with networked randomization for sound azimuth, adds relevant tags, and sets persistence and master/client behavior appropriately.
*   **Parameters:**
    - `params` (table) - Monster parameter table (e.g., `monster_params.deerclops`) containing `range` and `levels`.
    - `level` (number) - Index into `params.levels` specifying which warning level to use.
*   **Returns:** A function that, when called, creates and returns a new warning entity instance.
*   **Error states:** None documented. Dedicated servers skip FX entity creation; warnings are non-persistent and removed after 1 second on the master simulation.

## Events & listeners
- **Listens to:** `randdirty` - fired on the client when the `_rand` networked byte value is updated; triggers `OnRandDirty`.
- **Pushes:** No events are explicitly pushed by this component.