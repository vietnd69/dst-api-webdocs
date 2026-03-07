---
id: smallbird
title: Smallbird
description: Manages the lifecycle, behavior, and growth progression of small birds (including their teenage and adult tallbird forms) as companions with combat, eating, sleeping, and follower mechanics.
tags: [ai, growth, combat, follower]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 46c00b95
system_scope: entity
---

# Smallbird

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`smallbird.lua` defines the prefabs `smallbird` and `teenbird`, representing the juvenile and teenage stages of the tallbird lifecycle. It coordinates core gameplay systems—health, hunger, combat, follower leadership, sleeping behavior, and growth—through numerous components. Small birds start as passive companions, evolve into aggressive "teenbirds" upon maturation, and finally transform into adult tallbirds. Growth is time-based and can be triggered programmatically or by in-game progression (e.g., seasonal effects via `SetUpSpringSmallBird` events).

## Usage example
```lua
-- Create a small bird at a given position
local bird = SpawnPrefab("smallbird")
bird.Transform:SetPosition(x, y, z)

-- Make it follow a player
bird.components.follower:SetLeader(player)

-- Trigger premature maturation to teenbird
bird.components.growable:SetStage(2)

-- Wake the bird if asleep
if bird.components.sleeper then
    bird.components.sleeper:WakeUp()
end
```

## Dependencies & tags
**Components used:**  
`hunger`, `health`, `combat`, `inspectable`, `locomotor`, `follower`, `eater`, `sleeper`, `trader`, `lootdropper`, `growable`

**Tags added/checked:**  
Adds: `animal`, `companion`, `character`, `smallbird`, `notraptrigger`, `trader`, `smallcreature` (smallbird only), `teenbird` (teenbird only)  
Checks: `player`, `monster`, `smallbird`, `tallbird`, `debuffed`, `debuffed`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `userfunctions.FollowLeader` | function | See source | Publicly accessible function to initiate following behavior. |
| `userfunctions.GetPeepChance` | function | See source | Publicly accessible function returning probability of vocalization based on hunger. |
| `userfunctions.SpawnTeen` | function | See source | Publicly accessible function to programmatically evolve smallbird to teenbird. |
| `userfunctions.SpawnAdult` | function | See source | Publicly accessible function to programmatically evolve teenbird to adult tallbird. |
| `sg` | StateGraph | N/A | Stategraph used for AI behavior (`SGsmallbird` or `SGtallbird`). |
| `leader` | Entity or `nil` | `nil` | Internal reference to leader used during growth transitions (e.g., spring birds). |

## Main functions
### `SetTeen(inst)`
*   **Description:** Programmatically triggers the transition from `smallbird` to `teenbird` by advancing growth stage and initiating the `"growup"` state.
*   **Parameters:** `inst` (Entity) — The smallbird entity to transform.
*   **Returns:** Nothing.

### `SpawnTeen(inst)`
*   **Description:** Spawns a new `teenbird` prefab at the current position, copies the follower relationship from the smallbird, and removes the original entity.
*   **Parameters:** `inst` (Entity) — The smallbird entity being replaced.
*   **Returns:** Nothing.

### `SetAdult(inst)`
*   **Description:** Programmatically triggers the transition from `teenbird` to adult `tallbird` by advancing growth stage and initiating the `"growup"` state.
*   **Parameters:** `inst` (Entity) — The teenbird entity to transform.
*   **Returns:** Nothing.

### `SpawnAdult(inst)`
*   **Description:** Spawns a new `tallbird` prefab at the current position, applies an attack cooldown, sets the state to `"idle"`, and removes the teenbird entity.
*   **Parameters:** `inst` (Entity) — The teenbird entity being replaced.
*   **Returns:** Nothing.

### `GetPeepChance(inst)`
*   **Description:** Returns the probability (0.0–1.0) that the bird vocalizes ("peeps") at a given moment, based on hunger level (starving birds peep more frequently).
*   **Parameters:** `inst` (Entity) — The bird entity.
*   **Returns:** number — Probability of vocalization.

### `GetSmallGrowTime(inst)`
*   **Description:** Returns the fixed time (in seconds) required for a `smallbird` to mature to `teenbird`.
*   **Parameters:** `inst` (Entity) — Unused; present for signature compatibility with growth stages.
*   **Returns:** number — Growth time in seconds (from `TUNING.SMALLBIRD_GROW_TIME`).

### `GetTallGrowTime(inst)`
*   **Description:** Returns the fixed time (in seconds) required for a `teenbird` to mature to adult `tallbird`.
*   **Parameters:** `inst` (Entity) — Unused; present for signature compatibility with growth stages.
*   **Returns:** number — Growth time in seconds (from `TUNING.TEENBIRD_GROW_TIME`).

### `ShouldAcceptItem(inst, item)`
*   **Description:** Determines whether the bird will accept an item dropped or given by a player (e.g., via trader interaction). Only accepts edible food if hunger is below 90%.
*   **Parameters:**  
    `inst` (Entity) — The bird entity.  
    `item` (Entity) — The item being offered.
*   **Returns:** boolean — `true` if item is edible and the bird is not satiated.

### `OnGetItemFromPlayer(inst, giver, item)`
*   **Description:** Called when the bird accepts and consumes an item from a player. Wakes the bird up and attempts to eat the item, healing health and clearing combat targets if the giver was the current target.
*   **Parameters:**  
    `inst` (Entity) — The bird entity.  
    `giver` (Entity) — The player who gave the item.  
    `item` (Entity) — The item consumed.
*   **Returns:** Nothing.

### `OnEat(inst, food)`
*   **Description:** Heals health upon eating: 100% for smallbirds, 33% for teenbirds. Also clears combat targets for teenbirds.
*   **Parameters:**  
    `inst` (Entity) — The eater entity.  
    `food` (Entity) — The food consumed.
*   **Returns:** Nothing.

### `SetTeenAttackDefault(inst)`
*   **Description:** Configures `teenbird` to use full-power attacks (removes `"peck_attack"` tag and sets high damage and moderate attack speed).
*   **Parameters:** `inst` (Entity) — The teenbird entity.
*   **Returns:** Nothing.

### `SetTeenAttackPeck(inst)`
*   **Description:** Configures `teenbird` to use weaker peck attacks (adds `"peck_attack"` tag and sets lower damage but faster attack speed).
*   **Parameters:** `inst` (Entity) — The teenbird entity.
*   **Returns:** Nothing.

### `OnNewTarget(inst, data)`
*   **Description:** Callback triggered when the `teenbird` gains a new combat target. Adjusts attack mode: uses "peck" if the target is its leader (player), otherwise uses default attack.
*   **Parameters:**  
    `inst` (Entity) — The teenbird entity.  
    `data` (table) — Event data containing `target`.
*   **Returns:** Nothing.

### `OnAttacked(inst, data)`
*   **Description:** Handles responses to being attacked: if the attacker is its leader, switches to full attack mode; suggest targeting the attacker and share aggro with nearby `smallbird` followers.
*   **Parameters:**  
    `inst` (Entity) — The bird entity.  
    `data` (table) — Event data containing `attacker`.
*   **Returns:** Nothing.

### `SetUpSpringSmallBird(inst, data)`
*   **Description:** Special handler for spring events that initializes a `smallbird` as a spring-specific companion attached to a `tallbird`.
*   **Parameters:**  
    `inst` (Entity) — The smallbird instance.  
    `data` (table) — Contains `smallbird` and `tallbird` references.
*   **Returns:** Nothing.

### `StartSpringSmallBird(inst, leader)`
*   **Description:** Configures a spring smallbird: sets non-seasonal hunger behavior, positions it with its leader, and starts the `"hatch"` state.
*   **Parameters:**  
    `inst` (Entity) — The spring smallbird.  
    `leader` (Entity) — The tallbird leader.
*   **Returns:** Nothing.

### `SetSpringBirdState(inst)`
*   **Description:** Removes the `"companion"` tag and disables hunger-based health damage for spring birds.
*   **Parameters:** `inst` (Entity) — The bird entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` — Triggers `OnAttacked` to handle combat response and sharing.  
  `healthdelta` — Triggers `OnHealthDelta` to manage leader detachment during starvation.  
  `newcombattarget` — Triggers `OnNewTarget` to adjust teenbird combat style.  
  `SetUpSpringSmallBird` — Triggers `SetUpSpringSmallBird` for seasonal initialization.

- **Pushes:**  
  No events are explicitly pushed by this component's methods.