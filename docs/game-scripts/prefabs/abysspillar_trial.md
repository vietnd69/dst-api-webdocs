---
id: abysspillar_trial
title: Abysspillar Trial
description: Manages the puzzle mechanics for the Abysspillar Trial, including pillar grid generation, player interaction, minion spawning, and puzzle state transitions.
tags: [puzzle, entity, world, boss]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a5de7287
system_scope: world
---

# Abysspillar Trial

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `abysspillar_trial` prefab implements a dynamic puzzle mechanism in the DST Abyss mode. It manages a grid-based platform system where players navigate through collapsing pillars to complete the trial. The component initializes a pillar grid using configurable geometry, tracks player movement across pillars, spawns and controls AI minions to assist or challenge the player, and handles activation via lever-pulling interactions. It relies heavily on the `abysspillargroup` component for pillar lifecycle management, `activatable` for interaction handling, and `entitytracker` for managing minion instances.

## Usage example
```lua
local trial = SpawnPrefab("abysspillar_trial")
trial.Transform:SetPosition(x, 0, z)
-- Optional: Set spawn point explicitly
trial:SetSpawnXZ(x, z)
-- Optional: Assign minion prefabs
trial:SetMinion(left_minion_prefab, true)
trial:SetMinion(right_minion_prefab, false)
```

## Dependencies & tags
**Components used:** `abysspillargroup`, `activatable`, `entitytracker`, `inspectable`, `locomotor`, `embarker`, `walkableplatform`  
**Tags:** None identified (no tags are added, removed, or checked via `inst:AddTag` / `inst:HasTag`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawnx`, `spawnz` | number or `nil` | `nil` | Explicit world coordinates for spawning the trial grid. If `nil`, defaults to tile center near the entity. |
| `x0`, `z0` | number or `nil` | `nil` | World-space origin coordinates for the pillar grid. Computed at runtime based on orientation. |
| `dirx`, `dirz` | -1, 0, or 1 | `nil` | Direction vector (grid row/column axis mapping) for the trial layout. Valid only if both are defined and non-zero in combination. |
| `grid` | table | `{}` | Maps grid IDs (`"row,col"`) to pillar entities. Used to map world positions to grid coordinates and vice versa. |
| `minions` | table | `{}` | List of `PuzzlePiece` wrappers for tracked minions participating in the puzzle. |
| `players` | table or `nil` | `nil` | Tracks players currently in range (for early collision detection and behavior). |
| `contestant` | `PuzzlePiece` or `nil` | `nil` | The player currently navigating the puzzle; used for state tracking and minion coordination. |
| `keepsamepuzzle` | boolean or `nil` | `nil` | Flag indicating that the next grid should reuse the current layout instead of regenerating. |
| `randomspawndelay` | boolean or `nil` | `nil` | Flag used during grid generation to control animation timing delays for entrance/exit pillars. |
| `collapsequeue` | table or `nil` | `nil` | Temporary queue used during puzzle resolution to batch pillar collapse operations. |

## Main functions
### `SetMinion(minion, leftminion)`
*   **Description:** Registers a minion entity as either the left or right guide/minion for the trial. Required for minion interaction during puzzle resolution.
*   **Parameters:** 
    *   `minion` (entity instance) - The minion prefab instance.
    *   `leftminion` (boolean) - If `true`, registers as left minion; otherwise right minion.
*   **Returns:** Nothing.

### `SetSpawnXZ(x, z)`
*   **Description:** Sets the explicit world spawn coordinates for the trial grid. Overrides automatic detection.
*   **Parameters:** 
    *   `x` (number) - World X coordinate.
    *   `z` (number) - World Z coordinate.
*   **Returns:** Nothing.

### `_onplayeroccupiedpillar(pillar, player)`
*   **Description:** Event callback fired when a player steps onto a pillar. Initiates the puzzle by spawning minions if the player starts at the entrance (`row == 0`) and the grid is not yet populated.
*   **Parameters:** 
    *   `pillar` (entity instance) - The pillar the player has occupied.
    *   `player` (entity instance) - The player entity.
*   **Returns:** Nothing.

### `_onplayervacatedpillar(pillar, player)`
*   **Description:** Event callback fired when a player leaves a pillar. Used to compute player turns (direction changes) and trigger minion movement when the player hops to an adjacent pillar.
*   **Parameters:** 
    *   `pillar` (entity instance) - The pillar the player vacated.
    *   `player` (entity instance) - The player entity.
*   **Returns:** Nothing.

### `_onremoveminion(ent)`
*   **Description:** Event callback for minion removal. Handles cleanup of the `minions` list and respawns the minion at its default off-pillar if removed during active gameplay.
*   **Parameters:** 
    *   `ent` (entity instance) - The removed minion entity.
*   **Returns:** Nothing.

### `GetActivateVerb(inst, doer)`
*   **Description:** Returns the interaction verb displayed for this entity. Always returns `"PULL"`.
*   **Parameters:** 
    *   `inst` (entity instance) - The trial instance.
    *   `doer` (entity instance) - The entity performing the action.
*   **Returns:** `"PULL"` (string).

### `OnActivate(inst, doer)`
*   **Description:** Triggered when a player pulls the lever. Initiates the puzzle collapse sequence: collapses all pillars, plays animation and sound, handles minion deactivation, and schedules the next puzzle phase (respawn or new grid).
*   **Parameters:** 
    *   `inst` (entity instance) - The trial instance.
    *   `doer` (entity instance) - The player entity.
*   **Returns:** Nothing.

### `OnAddPillar(inst, pillar)`
*   **Description:** Callback registered with `abysspillargroup`. Adds a pillar to the grid, updates grid tracking, and listens for occupancy events on that pillar.
*   **Parameters:** 
    *   `inst` (entity instance) - The trial instance.
    *   `pillar` (entity instance) - The newly added pillar.
*   **Returns:** Nothing.

### `OnRemovePillar(inst, pillar)`
*   **Description:** Callback registered with `abysspillargroup`. Removes a pillar from the grid and cleans up occupancy event listeners.
*   **Parameters:** 
    *   `inst` (entity instance) - The trial instance.
    *   `pillar` (entity instance) - The removed pillar.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `abysspillar_playeroccupied` - fired by a pillar when a player steps onto it; triggers puzzle start logic.
  - `abysspillar_playervacated` - fired by a pillar when a player leaves it; used to track player direction and minion movement.
  - `onremove` - on player or minion entities; handles cleanup during removal.
  - `ms_playerjoined`, `ms_playerleft` - system events; manages the `players` table and event listeners for new/exiting players.
  - `onhop` - on player entities; detects early hopping into the puzzle to pre-spawn minions.
- **Pushes:** None identified.

## Data serialization
- **OnSave(inst, data):** Saves `spawnx`, `spawnz`, `x0`, `z0`, `dirx`, `dirz`, and `keepsamepuzzle` to the save data table for world persistence.
- **OnLoad(inst, data, ents):** Restores saved grid orientation and state; sets `keepsamepuzzle` if the grid was intact at save time.