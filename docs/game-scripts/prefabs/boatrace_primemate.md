---
id: boatrace_primemate
title: Boatrace Primemate
description: Controls the AI and behavior of the Boatrace Prime Mate character, including checkpoint targeting, leak repair during sleep, and buoy generation for players.
tags: [ai, locomotion, boatrace, entity, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: abb93730
system_scope: ai
---

# Boatrace Primemate

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `boatrace_primemate` prefab implements the logic for the Boatrace Prime Mate, a non-player character used in competitive boat races. It handles navigation toward race checkpoints, automatic leak repair while asleep, and periodic buoy deployment to assist players. As a character prefab, it integrates deeply with the `crewmember`, `inventory`, `entitytracker`, and `walkableplatform` components to act autonomously within the race context. It is not persisted across sessions (`persists = false`) and runs entirely on the master simulation.

## Usage example
The prefab is instantiated automatically during race events via `SpawnPrefab("boatrace_primemate")`. Developers typically do not need to manually construct it, but can interact with its components once spawned:

```lua
local prime_mate = SpawnPrefab("boatrace_primemate")
prime_mate.Transform:SetPosition(x, y, z)
prime_mate:AddTag("racer")

-- Trigger a checkpoint update (simulated)
prime_mate:PushEvent("command")

-- Ensure it’s marked offscreen to test sleep/wake behavior
prime_mate:SetOffscreen(true)
```

## Dependencies & tags
**Components used:**
- `drownable` — prevents drowning in water.
- `entitytracker` — tracks the active checkpoint indicator.
- `inspectable` — enables inspection UI.
- `inventory` — stores items (e.g., buoys); disables drop on death.
- `knownlocations` — supports location tracking.
- `locomotor` — governs movement speed and pathing.
- `talker` — manages voice lines and speech bubbles.

**Tags added:** `character`, `monkey`, `nomagic`, `pirate`, `racer`, `scarytoprey`

## Properties
No public properties are defined or exposed directly by this prefab. Internally, it uses:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_sleep_row_task` | Task or `nil` | `nil` | References the periodic repair task created during offscreen sleep. |
| `_on_checkpoint_found` | function | (defined in `fn`) | Callback triggered when the checkpoint indicator is found. |

## Main functions
### `initialize(inst)`
*   **Description:** Initializes the Prime Mate at spawn by equipping a dragon head hat (`dragonheadhat`) and discarding it after use. Called once shortly after creation.
*   **Parameters:** `inst` (Entity) — the Prime Mate entity instance.
*   **Returns:** Nothing.

### `boat_command_update(inst)`
*   **Description:** Periodically finds and sets the current race checkpoint as the crew target. If the path to the checkpoint is blocked (not over water), selects a random alternative checkpoint from the indicator. May also spawn and give a buoy item to the inventory for player assistance.
*   **Parameters:** `inst` (Entity) — the Prime Mate entity instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if no `crewmember` component, no `current_platform`, no `boatracecrew` component, or no `indicator` entity is found. Repair is attempted only if leaks are detected.

### `sleep_ai_update(inst)`
*   **Description:** Runs while the entity is offscreen (asleep). First searches all entities on the current platform for leaks and repairs them using `treegrowthsolution`. If no leaks are found, performs rowing toward the active target if one exists.
*   **Parameters:** `inst` (Entity) — the Prime Mate entity instance.
*   **Returns:** Nothing.

### `path_is_blocked(inst, target)`
*   **Description:** Determines whether the straight-line path between the Prime Mate and a target point crosses non-ocean terrain (e.g., land), indicating a blocked path.
*   **Parameters:**
    *   `inst` (Entity) — the Prime Mate entity instance (used for position sampling).
    *   `target` (Entity) — the target entity (e.g., checkpoint indicator).
*   **Returns:** `true` if the path intersects non-ocean terrain, `false` otherwise.

## Events & listeners
- **Listens to:**
  - `"checkpoint_found"` — fired by the checkpoint indicator entity; triggers a `"cheer"` event.
  - `"onremove"` — on the buoy deploykit to clear `._spawner` reference.
- **Pushes:**
  - `"cheer"` — when a checkpoint is located and tracked.
  - `"command"` — after updating the race crew’s target.
  - `"rowed"` — indirectly via `crewmember:Row()` (not directly called by this prefab, but the action is part of `sleep_ai_update`).
