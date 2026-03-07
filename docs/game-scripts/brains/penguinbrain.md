---
id: penguinbrain
title: Penguinbrain
description: AI brain governing penguin behavior including egg laying, retrieval, foraging, fleeing from predators, and group migration.
tags: [ai, animal, egg, aggression, migration]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 8961a5be
---

# Penguinbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `penguinbrain` component defines the decision-making logic for penguin entities in Don't Starve Together. It is a Behavior Tree-based AI that orchestrates complex autonomous behaviors including egg-laying, egg protection (retrieval and guarding), predator evasion, food foraging, leader following, and migration toward designated locations such as the rookery. The brain integrates with multiple components such as `combat`, `eater`, `inventory`, `knownlocations`, `sleeper`, and `teamattacker` to respond dynamically to game state changes including time of day, season, temperature, and nearby threats or allies.

## Usage example

The `penguinbrain` is typically attached to an entity (e.g., a penguin prefab) during prefabrication. Below is a minimal example of how the brain component is added and used internally by the game engine:

```lua
inst:AddBrain("brains/penguinbrain")

-- Example of setting up required properties externally (in the prefab definition):
inst.eggprefab = "penguin_egg"
inst.nesting = true
inst.eggsLayed = 0
```

The brain is then automatically executed via its Behavior Tree root (`self.bt`) in the entity's State Graph, with behaviors triggered by state changes and event signals.

## Dependencies & tags

**Components used:**
- `combat` (reads `target`)
- `eater` (`CanEat`)
- `follower` (`GetLeader`)
- `inventory` (`DropEverything`, `GetItemInSlot`, `IsFull`)
- `inventoryitem` (`IsHeld`, `IsHeldBy`, `canbepickedup`, `nobounce`)
- `knownlocations` (`ForgetLocation`, `GetLocation`, `RememberLocation`)
- `perishable` (`IsSpoiled`)
- `sleeper` (`IsAsleep`)
- `teamattacker` (`teamleader`)

**Tags:**
- `scarytoprey` — checked to identify predators that cause penguins to flee.
- `mutated_penguin` — excludes mutated penguins from being scared of standard predators and from scaring each other.
- `penguin_egg` — used to identify and prioritize eggs for retrieval and protection.
- `outofreach` — excluded from item searches.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `eggprefab` | `string` | — | Prefab name of the egg this penguin lays and protects. |
| `eggsLayed` | `number` | `0` | Tracks how many eggs this penguin has laid in its lifetime. |
| `layingEgg` | `boolean` | `false` | Flag indicating if the penguin is currently in the process of laying. |
| `nextDropTime` | `number` | `0` | Unix timestamp when the penguin may next drop an egg. |
| `nextPickupTime` | `number` | `0` | Unix timestamp when the penguin may next pick up an egg. |
| `nesting` | `boolean` | — | If `true`, enables egg-laying; otherwise, disables egg-laying season. |
| `myEgg` | `EntityInst` | `nil` | Reference to the egg this penguin is guarding or retrieving. |
| `laidEgg` | `boolean` | `false` | Historical flag tracking whether the penguin has laid an egg. |
| `bt` | `BT` | `nil` | Behavior Tree instance constructed in `OnStart()`. |

## Main functions

### `PenguinBrain:OnStart()`
* **Description:** Initializes and assigns the Behavior Tree (`self.bt`) for this penguin brain. The tree is built with prioritized nodes covering flight states, panic triggers, egg-related actions, combat, migration, and wandering.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None; assumes required components and prefabs are properly attached.

### `FindScaryPredator(inst, radius)`
* **Description:** Locates the closest entity with the `scarytoprey` tag within the given radius. For mutated penguins, it excludes other mutated penguins to prevent mutual fear.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity performing the search.
  - `radius`: `number` — Search radius.
* **Returns:** `EntityInst` or `nil` — The nearest predator, if found.
* **Error states:** Returns `nil` if no predator found or `inst` is invalid.

### `AtRookery(inst)`
* **Description:** Determines if the penguin is near its designated rookery (within `100` distance squared).
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `boolean` — `true` if within range of the rookery, otherwise `false`.
* **Error states:** Returns `false` if no rookery location is stored in `knownlocations`.

### `HasEgg(inst)`
* **Description:** Checks if the penguin currently holds an egg in slot `1` of its inventory.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `boolean` — `true` if an egg is held, otherwise `false`.
* **Error states:** Returns `false` if `inst` lacks an `inventory` component.

### `CheckMyEgg(inst)`
* **Description:** Validates and updates the penguin's stored reference to its egg (`inst.myEgg`). Handles egg pickup by others, spoilage, or invalid state. Remembers the egg's location if valid.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `EntityInst` or `nil` — The valid egg if tracked, otherwise `nil`.
* **Error states:** Returns `nil` if egg is invalid, held by another entity, spoiled, or off valid ground.

### `PrepareForNight(inst)`
* **Description:** Determines if the penguin should prepare for night based on time of day or current sleep state.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `boolean` — `true` if it is currently night, approaching dusk, or the penguin is asleep.
* **Error states:** None.

### `FindItems(inst, radius, fn, tags)`
* **Description:** Scans for entities within a radius that match optional criteria. Filters out `outofreach` entities and ensures visibility.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
  - `radius`: `number` — Search radius.
  - `fn`: `function(item: EntityInst) -> boolean?` — Optional predicate to further filter candidates.
  - `tags`: `table` — Tags to include in search (e.g., `nil` or `{"penguin_egg"}`).
* **Returns:** `table` of `EntityInst` — List of matching entities.
* **Error states:** Returns empty list if `inst` is invalid or `TheSim:FindEntities` fails.

### `StealAction(inst)`
* **Description:** Attempts to pick up the penguin's own egg if a predator is approaching it, or if a valid egg is in range and threatened.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `BufferedAction?` — Action to execute (`PICKUP`) or `nil`.
* **Error states:** Returns `nil` if inventory is full or no egg is threatened.

### `EatFoodAction(inst)`
* **Description:** Searches for and attempts to eat suitable food items (excluding rotten egg variants and newly spawned items).
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `BufferedAction?` — Action to execute (`EAT`) or `nil`.
* **Error states:** Returns `nil` if `busy`, leader exists, or no valid food found.

### `LayEggAction(inst)`
* **Description:** Initiates egg-laying behavior (drops current inventory if full, or spawns a new egg) if conditions permit (not busy, not too cold, not at night).
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `nil`.
* **Error states:** Early exit if laying is locked (`layingEgg`), cooling is too extreme, or predator is nearby.

### `PickUpEggAction(inst)`
* **Description:** Attempts to retrieve the penguin's egg during night or winter (to prevent freezing) if not already holding one.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `BufferedAction?` — Action to execute (`PICKUP`) or `nil`.
* **Error states:** Returns `nil` if inventory full or cooldown hasn’t elapsed.

### `GetWanderDistFn(inst)`
* **Description:** Returns the maximum wandering distance based on whether winter or night is active, or if the penguin is close to its egg.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `number` — Wander radius (`2` near egg, `WANDER_DIST_NIGHT`/`WANDER_DIST_DAY` otherwise).

### `ShouldRunAway(inst, hunter)`
* **Description:** Determines if the penguin should flee from the given predator (`hunter`) based on its own team status and predator state.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
  - `hunter`: `EntityInst` — The potential predator.
* **Returns:** `boolean` — `true` if penguin should flee.
* **Error states:** Returns `false` if penguin has a leader issuing `ATTACK` or `HOLD` orders, or if the predator is a mutated penguin.

### `ShouldAttack(inst)`
* **Description:** Determines if the penguin should currently engage combat with its assigned target.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `boolean` — `true` if target exists and is within `MAX_CHASE_DIST` (`15`).
* **Error states:** None.

### `HerdAtRookery(inst)`
* **Description:** Checks if the rookery and herd locations exist and are close enough (`<102` distance squared) to consider the penguin part of a herd.
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `boolean` — `true` if both locations are valid and within range.

### `FlyAway(inst)`
* **Description:** Pushes the `"flyaway"` event to signal the state graph should handle flight (e.g., migration out of the current area).
* **Parameters:**
  - `inst`: `EntityInst` — The penguin entity.
* **Returns:** `nil`.

## Events & listeners

- **Listens to:**
  - `"gohome"` — Triggers `FlyAway` behavior when fired on the entity.

- **Pushes:**
  - `"flyaway"` — Emitted when `FlyAway()` is called to initiate migration behavior in the state graph.