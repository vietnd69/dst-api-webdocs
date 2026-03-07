---
id: penguin
title: Penguin
description: An animal entity with combat, herding, and team-based behavior that spawns from the Penguin Spawner and interacts with hunger, inventory, and moon mutation systems.
tags: [animal, combat, team, inventory, mutation]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d04e8147
system_scope: entity
---

# Penguin

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `penguin` prefab defines two entities: the standard penguin and its mutated variant. It manages core animal behaviors including combat retargeting, team formation via `teamattacker` and `teamleader`, hunger management, egg storage in an inventory, and seasonal lifecycle (auto-removal in late winter). It integrates with the `penguinspawner` system for colony tracking, supports moon mutation via `halloweenmoonmutable`, and persists colony membership across saves. The component functions as a game entity definition, not a reusable component, initializing many core systems in its constructor.

## Usage example
While this file defines prefabs (not reusable components), a modder would typically instantiate one via:
```lua
-- Spawn a standard penguin
local penguin = SpawnPrefab("penguin")

-- Spawn a mutated penguin
local mutated = SpawnPrefab("mutated_penguin")

-- Access properties set during initialization
penguin.colonyNum = 5
penguin.eggsLayed = 0
penguin.eggprefab = "bird_egg"
```

## Dependencies & tags
**Components used:** `combat`, `health`, `hunger`, `lootdropper`, `homeseeker`, `knownlocations`, `herdmember`, `teamattacker`, `eater`, `sleeper`, `inspectable`, `inventory`, `halloweenmoonmutable`, `locomotor`.

**Tags:** `penguin`, `animal`, `smallcreature`, `herdmember`, `scarytoprey` (mutated only), `lunar_aligned` (mutated only), `mutated_penguin` (mutated only), `soulless` (mutated only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `colonyNum` | number? | `nil` | The colony ID this penguin belongs to; restored on load via `penguinspawner`. |
| `eggsLayed` | number | `0` | Counter of eggs laid by this penguin. |
| `eggprefab` | string | `"bird_egg"` or `"rottenegg"` | Prefab name for eggs laid; defaults to standard egg, changed to rotten egg in mutated form. |
| `nesting` | boolean | `false` | Set by `OnEnterMood`/`OnLeaveMood`; indicates if the penguin is in nesting mood. |
| `spawn_lunar_mutated_tuning` | string | `"SPAWN_MOON_PENGULLS"` | Key used for lunar mutation event configuration. |

## Main functions
### `Retarget(inst)`
*   **Description:** Attempts to find a new valid target when the penguin is starving; may trigger team formation if no team exists. Only used in the pristine penguin's combat component.
*   **Parameters:** `inst` (Entity) - the penguin instance.
*   **Returns:** `nil` if not starving, otherwise potentially returns the new target. May trigger `MakeTeam`.
*   **Error states:** Returns early with `nil` if `hunger:IsStarving()` is false.

### `MutatedRetarget(inst)`
*   **Description:** Similar to `Retarget` but used by the mutated penguin; has a wider scan radius (4 vs. 3) and different target tags. Also triggers team formation.
*   **Parameters:** `inst` (Entity) - the mutated penguin instance.
*   **Returns:** `nil` or the new target; may trigger `MakeTeam`.
*   **Error states:** None beyond target-finding failure.

### `MakeTeam(inst, attacker)`
*   **Description:** Spawns a `teamleader` prefab and configures it with the penguin as the first teammate, setting team properties like attack interval, size, and type.
*   **Parameters:** `inst` (Entity) - the penguin initiating the team; `attacker` (Entity) - the threat being responded to.
*   **Returns:** Nothing (side effects only).
*   **Error states:** None; always spawns and configures the team leader.

### `OnAttacked(inst, data)`
*   **Description:** Event handler called when the penguin is attacked; attempts to form a team if needed and shares the attacker with nearby penguins if the team is active.
*   **Parameters:** `inst` (Entity) - the penguin; `data` (table) - combat event data containing `attacker`.
*   **Returns:** Nothing.
*   **Error states:** Returns early if no `teamattacker` component exists.

### `GetStatus(inst)`
*   **Description:** Human-readable status string for `inspectable` component; reports `STARVING` or `HUNGRY` based on hunger percentage.
*   **Parameters:** `inst` (Entity) - the penguin instance.
*   **Returns:** `"STARVING"` or `"HUNGRY"` or `nil`.
*   **Error states:** Returns `nil` if hunger is normal (>=50% full).

### `SaveCorpseData(inst, corpse)`
*   **Description:** Returns colony membership data to serialize on corpse creation; used to preserve colony assignment.
*   **Parameters:** `inst` (Entity) - the penguin; `corpse` (Entity) - the corpse being saved.
*   **Returns:** `{ colonyNum = number }` or `nil`.
*   **Error states:** Returns `nil` if `colonyNum` is not set.

### `LoadCorpseData(inst, corpse)`
*   **Description:** Loads colony membership from corpse data and registers with the `penguinspawner`.
*   **Parameters:** `inst` (Entity) - the penguin (usually the spawned corpse); `corpse` (Entity) - the source corpse.
*   **Returns:** Nothing (side effects only).
*   **Error states:** Does nothing if no `colonyNum` is present in `corpse.corpsedata`.

## Events & listeners
- **Listens to:** `entermood` - calls `OnEnterMood`, sets `nesting = true`.
- **Listens to:** `leavemood` - calls `OnLeaveMood`, sets `nesting = false`.
- **Listens to:** `onignite` - calls `OnIgnite`, cooks eggs in inventory.
- **Listens to:** `attacked` - calls `OnAttacked`, initiates team formation and target sharing.
- **Pushes:** None directly (events are handled by other components, not fired by this file's logic).
