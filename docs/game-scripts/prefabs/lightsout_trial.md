---
id: lightsout_trial
title: Lightsout Trial
description: Manages a vault torch puzzle and synchronized abyss pillar behavior for a trial encounter, including puzzle state logic, shadow hand spawning, and pillar spawn/collapse coordination.
tags: [puzzle, boss, environment, trial]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cf32acb8
system_scope: environment
---

# Lightsout Trial

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lightsout_trial` is a prefab that implements a puzzle-based trial encounter involving a 3x3 vault torch grid and abyss pillars. It manages puzzle initialization (including randomized torch configurations), puzzle state detection (solved/unsolved), shadow hand spawning to assist with broken torches, and coordinated pillar spawning/collapsing based on puzzle state. It interacts with the `vaulttorchgrid`, `abysspillargroup`, `vaulttorchgrid`, `machine`, and `walkableplatform` components.

## Usage example
This prefab is instantiated as a level element (e.g., in a room layout). The puzzle is initialized during setup via `SetupPuzzle()`; wake/sleep callbacks and save/load handlers are invoked automatically by the game engine.

```lua
local inst = SpawnPrefab("lightsout_trial")
inst.Transform:SetPosition(x, 0, z)
inst.SetupPuzzle() -- initializes torch grid and pillar spawn points
-- Later, when a torch is toggled, the built-in event listener
-- (`_ontorchtoggled`) handles the puzzle logic automatically.
```

## Dependencies & tags
**Components used:** `vaulttorchgrid`, `abysspillargroup`, `machine`, `walkableplatform`  
**Tags:** Adds `FX`, `NOCLICK` to the entity instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hand` | entity or `nil` | `nil` | Reference to the active `shadowhand` prefab spawned to help with a broken torch. |
| `handdelay` | task or `nil` | `nil` | Task handle for delayed shadow hand spawning logic. |
| `busytoggling` | boolean | `false` | Prevents recursive or concurrent puzzle state updates during torch toggles. |
| `refreshpillarstask` | task or `nil` | `nil` | Task handle for deferring pillar respawn/collapse actions. |
| `helped` | boolean | `false` | Whether the player has ever helped the broken torch (per puzzle session). |
| `solved` | boolean | `false` | Whether all torches are currently lit (puzzle solved). |

## Main functions
### `SetupPuzzle()`
*   **Description:** Resets or initializes the 3x3 torch grid, selects a random grid variation, configures stuck and non-interactable torches (via `MakeStuckOn()` and `MakeBroken()`), and sets up pillar spawn points if none exist.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `DoSpawnPillarAtXZ(inst, x, z, instant)`
*   **Description:** Spawns an `abysspillar` prefab at the specified world coordinates, optionally spawning a visual `abysspillar_fx` first unless `instant` is true.
*   **Parameters:**  
    `inst` (entity) — the lightsout_trial entity instance.  
    `x` (number) — world X position.  
    `z` (number) — world Z position.  
    `instant` (boolean) — if true, skips FX and spawns pillar directly.  
*   **Returns:** The spawned `abysspillar` entity.
*   **Error states:** May return `nil` if FX prefab fails to spawn (when `instant` is false).

### `DoCollapsePillar(inst, pillar)`
*   **Description:** Triggers the `CollapsePillar` action on a valid pillar after a random delay.
*   **Parameters:**  
    `inst` (entity) — the lightsout_trial entity instance.  
    `pillar` (entity) — the `abysspillar` entity to collapse.  
*   **Returns:** Nothing.
*   **Error states:** Only acts on pillars with a `walkableplatform` component (excludes FX).

### `RefreshPillars(inst)`
*   **Description:** Cancels any pending pillar refresh task, then respawns all pillars if the puzzle is solved, or collapses all pillars otherwise.
*   **Parameters:**  
    `inst` (entity) — the lightsout_trial entity instance.  
*   **Returns:** Nothing.

### `PickHandSpawnPoint(inst, torch)`
*   **Description:** Calculates and returns a weighted spawn point for a `shadowhand` near a broken torch, avoiding nearby players and other obstacles, using custom scoring logic.
*   **Parameters:**  
    `inst` (entity) — the lightsout_trial entity instance.  
    `torch` (entity) — the broken torch entity.  
*   **Returns:** Table `{x, z}` representing spawn coordinates, or `nil`.
*   **Error states:** Returns `nil` if no valid spawn points are identified.

### `TryHelpBrokenTorch(inst, torch)`
*   **Description:** Attempts to spawn a shadow hand to assist a broken, lit torch. Returns `true` to halt `ForEach` iteration if a hand is spawned.
*   **Parameters:**  
    `inst` (entity) — the lightsout_trial entity instance.  
    `torch` (entity) — the vault torch entity.  
*   **Returns:** `true` if a shadow hand was spawned, `false` otherwise.

### `OnHandDelayOver(inst)`
*   **Description:** Logic run after the shadow hand spawn delay; attempts to help broken torches if the puzzle is unsolved and no hand is active.
*   **Parameters:**  
    `inst` (entity) — the lightsout_trial entity instance.  
*   **Returns:** Nothing.
*   **Error states:** Recursively schedules itself with a delay if no players are nearby.

### `ToggleTorch(inst, torch)`
*   **Description:** Toggles a torch's state, handles broken torch help delays, and updates puzzle state if needed.
*   **Parameters:**  
    `inst` (entity) — the lightsout_trial entity instance.  
    `torch` (entity) — the vault torch entity.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `machineturnedon` / `machineturnedoff` — on individual torches, via `inst._ontorchtoggled`, to detect player interaction and update puzzle state.  
  `onremove` — on `shadowhand`, via `inst._onhandremoved`, to reset `hand` reference and potentially reschedule help.  
- **Pushes:**  
  `see_lightsout_shadowhand` — pushed to nearby players via `DoPlayerAnnounce`.  
  `machineturnedoff` — pushed by `machine` component during torch toggle.