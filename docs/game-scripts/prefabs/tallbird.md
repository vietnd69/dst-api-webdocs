---
id: tallbird
title: Tallbird
description: Manages the behavior, combat, and nesting logic for the Tallbird character entity in Don't Starve Together.
tags: [combat, ai, animal, nesting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a6c966c9
system_scope: entity
---

# Tallbird

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The Tallbird prefab defines a large, aggressive animal NPC with nest-defending behavior, seasonal sleep cycles, and the ability to lay and incubate eggs via a nested `tallbirdnest` structure. It integrates with multiple components—including `combat`, `homeseeker`, `sleeper`, `eater`, `locomotor`, and `childspawner`—to support pathfinding, target selection, nesting, and lifecycle management. Its core AI logic is delegated to `SGtallbird` stategraph and `tallbirdbrain`.

## Usage example
```lua
-- Create a Tallbird instance at world position (0, 0, 0)
local inst = SpawnPrefab("tallbird")
inst.Transform:SetPosition(0, 0, 0)

-- Configure nesting and combat manually if needed
if inst:CanMakeNewHome() then
    inst.MakeNewHome(inst)
end

-- Adjust movement speed (after component is added)
inst.components.locomotor.walkspeed = 8
```

## Dependencies & tags
**Components used:** `locomotor`, `combat`, `health`, `lootdropper`, `eater`, `sleeper`, `inspectable`, `knownlocations`, `leader`, `homeseeker`, `childspawner`, `pickable`, `burnable`, `freezable`, `hauntable`  
**Tags added:** `tallbird`, `animal`, `largecreature`  
**Tags checked (in logic):** `_combat`, `_health`, `pig`, `character`, `monster`, `animal`, `werepig`, `smallbird`, `companion`, `tallbird`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_last_attacker` | `Entity` or `nil` | `nil` | Stores the most recent attacker entity for aggro tracking. |
| `_last_attacked_time` | number | `nil` | Timestamp of the last attack event (from `GetTime()`). |
| `entitysleeping` | boolean | `false` | Tracks whether the Tallbird is currently in sleep state. |
| `pending_spawn_smallbird` | boolean | `nil` | Used to coordinate hatching of a `smallbird` on wake. |
| `override_combat_fx_height` | string | `"high"` | Custom effect height for combat hit effects. |
| `scrapbook_hide` | table | `{"beakfull"}` | Animations excluded from scrapbook visuals. |

## Main functions
### `Retarget(inst)`
*   **Description:** Computes and returns a new valid combat target based on proximity and threat priority: nest defenders > pigmen > nearby characters/monsters.
*   **Parameters:** `inst` (`Entity`) — the Tallbird instance.
*   **Returns:** `Entity` or `nil` — the first valid target found by `FindEntity`, or `nil` if none exist.
*   **Error states:** Returns `nil` if `inst.components.combat:CanTarget()` fails or all candidates are dead.

### `KeepTarget(inst, target)`
*   **Description:** Determines whether the Tallbird should continue pursuing its current target based on distance from its nest.
*   **Parameters:**  
  - `inst` (`Entity`) — the Tallbird instance.  
  - `target` (`Entity`) — the current target entity.  
*   **Returns:** `boolean` — `true` if the Tallbird should keep the target (within range), `false` otherwise.

### `ShouldSleep(inst)`
*   **Description:** Predicate function for `sleeper` component to decide when to sleep (only at night with no active target).
*   **Parameters:** `inst` (`Entity`) — the Tallbird instance.  
*   **Returns:** `boolean` — `true` if the Tallbird should sleep, `false` otherwise.

### `ShouldWake(inst)`
*   **Description:** Predicate function for `sleeper` component to decide when to wake (at dawn or when a combat target appears).
*   **Parameters:** `inst` (`Entity`) — the Tallbird instance.  
*   **Returns:** `boolean` — `true` if the Tallbird should wake, `false` otherwise.

### `OnAttacked(inst, data)`
*   **Description:** Handles incoming damage by updating aggro and potentially switching combat targets. Prioritizes retaining egg-thief targets.
*   **Parameters:**  
  - `inst` (`Entity`) — the Tallbird instance.  
  - `data` (`table`) — event data containing `attacker` (the attacking entity).  
*   **Returns:** Nothing.

### `CanMakeNewHome(inst)`
*   **Description:** Checks if the Tallbird is eligible to build a new nest (must be unoccupied and on suitable terrain).
*   **Parameters:** `inst` (`Entity`) — the Tallbird instance.  
*   **Returns:** `boolean` — `true` if a new nest can be built, `false` otherwise.

### `MakeNewHome(inst)`
*   **Description:** Spawns a `tallbirdnest` prefab at the Tallbird’s current position, claims ownership, and starts nesting.
*   **Parameters:** `inst` (`Entity`) — the Tallbird instance.  
*   **Returns:** `boolean` — `true` on success, `nil` otherwise.

### `OnEntitySleep(inst, data)`
*   **Description:** Sets `entitysleeping = true` and spawns a `smallbird` if pending (during spring).
*   **Parameters:**  
  - `inst` (`Entity`) — the Tallbird instance.  
  - `data` (`table`) — event data (unused).  
*   **Returns:** Nothing.

### `OnEntityWake(inst, data)`
*   **Description:** Clears the `entitysleeping` flag upon waking.
*   **Parameters:**  
  - `inst` (`Entity`) — the Tallbird instance.  
  - `data` (`table`) — event data (unused).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers `OnAttacked` to update combat aggro.  
  - `entitysleep` — triggers `OnEntitySleep` to set sleep state and spawn `smallbird`.  
  - `entitywake` — triggers `OnEntityWake` to reset sleep state.  
- **Pushes:** None (the prefab itself does not directly fire events).