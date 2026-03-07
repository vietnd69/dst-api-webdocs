---
id: tentacle_pillar
title: Tentacle Pillar
description: Manages the lifecycle, combat behavior, arm deployment, and teleporter link synchronization of the Marsh Tentacle Boss in DST.
tags: [boss, combat, teleporter, entity, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 19c8c79b
system_scope: world
---

# Tentacle Pillar

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`tentacle_pillar` implements the main boss entity for the Marsh Tentacle encounter. It coordinates arm spawning, health states, teleporter synchronization with its linked hole, and transformation to/from a retracted hole state. It uses the `health`, `combat`, `playerprox`, `lootdropper`, and `teleporter` components, and includes custom logic for emergent behaviors, player-triggered attacks, and world-state changes via map tile and set piece handling (especially for the `tentacle_pillar_atrium` variant).

## Usage example
This entity is spawned automatically during world generation and not directly instantiated by mods. However, a modder may reference or extend its behavior:

```lua
-- Example: spawning a tentacle pillar programmatically (advanced use only)
local pillar = SpawnPrefab("tentacle_pillar")
pillar.Transform:SetPosition(x, 0, z)

-- Example: triggering emergence programmatically
pillar.components.health:SetMaxHealth(TUNING.TENTACLE_PILLAR_HEALTH)
pillar:OnEmerge()

-- Example: overtaking to switch to hole mode
local hole = pillar:Overtake()
```

## Dependencies & tags
**Components used:** `health`, `playerprox`, `lootdropper`, `combat`, `inspectable`, `teleporter`, `hauntable` (via `AddHauntableCustomReaction`), and `burnable`/`fueled` (via loot logic, not directly added here but referenced by `lootdropper`).
**Tags added:** `cavedweller`, `tentacle_pillar`, `wet`, `NPCcanaggro`.
**Tags checked:** `notarget`, `player`, `burnt`, `structure`, `hive`, `monster`, `animal`, `creaturecorpse`, `debuffed`, `hiding`, `INLIMBO`, `irreplaceable`, `event_trigger`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `numArms` | number | `0` | Count of active tentacle arms currently spawned. |
| `arms` | table | `{}` | Map of active `tentacle_pillar_arm` entities (as keys). |
| `overtaken` | boolean or `nil` | `nil` | True if this pillar was overtaken (e.g., by a player teleporter action). |
| `overtakenhole` | entity or `nil` | `nil` | Reference to the hole prefab spawned during overtaken retraction. |
| `spawnLocal` | boolean or `nil` | `nil` | Flag set when spawning arms locally (e.g., after a player attack). |
| `overtaken` in linked hole | boolean | `nil` | Indicates whether the linked `tentacle_pillar_hole` is in an overtaken state. |
| `_tpqueue` | table or `nil` | `nil` | Queue of pending teleporter activations during overtaken state transition. |

## Main functions
### `OnEmerge(inst)`
*   **Description:** Triggers the boss’s emergence from the ground. Makes the entity invincible, plays an animation and sound, shakes cameras, adds `notarget` tag, and schedules a callback when the animation completes to remove invincibility and tag.
*   **Parameters:** `inst` (entity) — the tentacle pillar instance.
*   **Returns:** Nothing.
*   **Error states:** Has no effect if the entity is already dead (`IsDead()`).

### `OnDeath(inst)`
*   **Description:** Handles the boss’s death sequence: retracts all arms, drops loot if not overtaken, and transforms the pillar into its linked hole (unless overtaken, in which case it retracts the linked pillar/hole too). Plays death animation/sound and schedules `SwapToHole`.
*   **Parameters:** `inst` (entity) — the tentacle pillar instance.
*   **Returns:** Nothing.
*   **Error states:** If `inst.overtaken` is true, skips loot and omits linking logic.

### `Overtake(inst)`
*   **Description:** Forces immediate retraction of the pillar and transforms it into a `tentacle_pillar_hole` while preserving teleporter links. Prevents entry while overtaken.
*   **Parameters:** `inst` (entity) — the tentacle pillar instance.
*   **Returns:** `inst.overtakenhole` (entity) — the newly created hole or existing one, if any.
*   **Error states:** May return `nil` if no hole has been created yet.

### `SwapToHole(inst)`
*   **Description:** Transforms the pillar entity into a `tentacle_pillar_hole`, preserves or nullifies teleporter links, and applies overtaken flags appropriately.
*   **Parameters:** `inst` (entity) — the tentacle pillar instance.
*   **Returns:** Nothing.
*   **Error states:** Linked pillars/holes must match expected prefabs; otherwise, state may be inconsistent.

### `SpawnArms(inst, attacker)`
*   **Description:** Spawns up to `TUNING.TENTACLE_PILLAR_ARMS` tentacle arms around the pillar in a circular layout. If `attacker` is provided, shifts spawning toward the attacker. Calls `KillArms` first if arm cap is exceeded.
*   **Parameters:** `inst` (entity) — the pillar instance; `attacker` (entity or `nil`) — optional entity that triggered spawning.
*   **Returns:** Nothing.
*   **Error states:** Returns early if arm cap (`TUNING.TENTACLE_PILLAR_ARMS_TOTAL`) is reached.

### `DoRetract(inst, overtake)`
*   **Description:** Immediately kills the pillar, sets `overtaken` flag, and removes invincibility.
*   **Parameters:** `inst` (entity); `overtake` (boolean) — whether this retraction is due to an overtaken teleport.
*   **Returns:** Nothing.
*   **Error states:** Has no effect if already dead.

### `OnActivateByOvertake(inst, source, doer)`
*   **Description:** Queues teleporter activations that occurred while the pillar was overtaken (i.e., switching to hole mid-activation).
*   **Parameters:** `inst` (entity); `source` (entity); `doer` (entity).
*   **Returns:** Nothing. Appends `{ t, doer, source }` to `inst._tpqueue` if present.

### `OnLoadPostPass(inst)`
*   **Description:** Called after loading to resolve link state with the paired teleporter. Ensures overtaken pillars/holes are correctly retracted or enabled based on `overtaken` flags.
*   **Parameters:** `inst` (entity) — the pillar or hole instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `death` (`OnDeath`)  
  - `onremove`, `death` (via `inst.arms[arm]` tracking; calls `_onstoptrackingarm`)  
  - `animover` (`OnEmergeOver`, then later `SwapToHole`)  
  - `entitysleep` (`SwapToHole`)  
- **Pushes:** None directly (only delegates via event callbacks and component behavior).
