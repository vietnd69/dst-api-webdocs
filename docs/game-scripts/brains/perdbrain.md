---
id: perdbrain
title: Perdbrain
description: Controls AI behavior for the Perd character, handling movement, food consumption, berry picking, shrine seeking, and home returning.
tags: [ai, character, combat, inventory, environment]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 5c51ba59
---

# Perdbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `PerdBrain` component defines the behavior tree for the Perd character in Don't Starve Together. As a specialized AI brain, it orchestrates high-level decision-making processes including seeking food, picking berries, returning to a home base (typically a bush), and participating in special events by seeking and loitering near Perd shrines. It leverages the Behavior Tree (BT) system and integrates closely with components like `inventory`, `eater`, `pickable`, `burnable`, and `homeseeker` to determine valid targets and actions. The brain responds to environmental conditions (e.g., day/night, fire hazards, proximity to threats) to drive dynamic and context-aware behavior.

## Usage example

The component is instantiated automatically for Perd entities and registered via the brain system—there is no direct manual instantiation in mod code. However, an example of enabling shrine seeking and verifying behavior follows:

```lua
-- Assuming `perd` is an entity instance with PerdBrain attached
perd.seekshrine = true
perd.components.homeseeker.home = some_bush_inst

-- The brain will now prioritize shrine-seeking behavior when active
perd:PushEvent("startbrain")
```

## Dependencies & tags

**Components used:**
- `burnable` (`IsBurning`)
- `eater` (`CanEat`)
- `homeseeker` (`home` property)
- `inventory` (`FindItem`)
- `inventoryitem` (`owner` property)
- `pickable` (`CanBePicked`, `product` property)

**Tags:**
- Internal tag groups used for entity filtering: `bush`, `edible_veggie`, `edible_meat`, `edible_fish`, `edible_insects`, `edible_fungi` (via `FOODTYPE` constants), `scarytoprey`, `perdshrine`, `burnt`, `fire`, `pickable`, `INLIMBO`, `outofreach`.

## Properties

| Property | Type | Default Value | Description |
|---------|------|---------------|-------------|
| `inst.seekshrine` | boolean | `false` | Controls whether the brain prioritizes seeking and loitering near Perd shrines. |
| `inst._shrine` | entity or `nil` | `nil` | Cached reference to the nearest valid Perd shrine (only populated when `seekshrine` is `true` and a shrine is found). |
| `inst._lastshrinewandertime` | number or `nil` | `nil` | Timestamp of the last shrine-related wander; used to calculate loiter duration. |
| `inst._shrine` (local in `FindShrine`) | entity or `nil` | `nil` | Internal cache used by `FindShrine` to avoid repeated entity searches. |

## Main functions

### `FindNearestBush(inst)`
* **Description:** Scans the environment for the nearest bush within `SEE_BUSH_DIST` that can be picked (i.e., is not burnt, is visible, and `CanBePicked` returns `true`). Falls back to returning the home bush (`homeseeker.home`) if no functional bush is found.
* **Parameters:** `inst` — the entity instance for which to find a bush (typically the Perd).
* **Returns:** A valid bush entity or `nil` if no suitable bush is found and no home is set.
* **Error states:** May return a bush that *cannot* be picked if no fully functional bush is found and `homeseeker.home` is valid.

### `HomePos(inst)`
* **Description:** Helper that returns the position of the nearest or preferred bush (via `FindNearestBush`) for homing behavior.
* **Parameters:** `inst` — the entity instance.
* **Returns:** A `Vector3` position or `nil` if no home bush can be determined.
* **Error states:** Returns `nil` if `FindNearestBush` returns `nil`.

### `GoHomeAction(inst)`
* **Description:** Constructs a buffered "Go Home" action targeting the nearest bush if available.
* **Parameters:** `inst` — the entity instance.
* **Returns:** A `BufferedAction` or `nil` if no bush is found.
* **Error states:** Returns `nil` if `FindNearestBush` fails to locate a target.

### `EatFoodAction(inst, checksafety)`
* **Description:** Attempts to locate and return an action to eat edible food. First checks inventory for edible items; if none are found, searches the world for food. Optionally validates safety (checks for `scarytoprey` and water/invalid ground).
* **Parameters:**
  - `inst` — the entity instance.
  - `checksafety` (boolean) — if `true`, ensures no scary entities are within `SEE_PLAYER_DIST` and that food is on valid ground.
* **Returns:** A `BufferedAction` for eating or `nil` if no edible food is found or safety conditions fail.
* **Error states:** Returns `nil` if `inst.components.inventory` or `inst.components.eater` are missing, no suitable food is found, or safety checks fail.

### `EatFoodWhenSafe(inst)`
* **Description:** Calls `EatFoodAction(inst, true)` to return an eat action only when safety is confirmed.
* **Parameters:** `inst` — the entity instance.
* **Returns:** A `BufferedAction` or `nil`.

### `EatFoodAnytime(inst)`
* **Description:** Calls `EatFoodAction(inst, false)` to return an eat action regardless of nearby threats.
* **Parameters:** `inst` — the entity instance.
* **Returns:** A `BufferedAction` or `nil`.

### `PickBerriesAction(inst)`
* **Description:** Locates a nearby berry-producing bush (via `HasBerry`) and returns an action to pick berries, *only if* no `scarytoprey` entities are nearby.
* **Parameters:** `inst` — the entity instance.
* **Returns:** A `BufferedAction` for picking or `nil` if no valid bush is found or safety conditions fail.
* **Error states:** Returns `nil` if `FindEntity` returns no matches or `GetClosestInstWithTag` finds a threat.

### `FindShrine(inst)`
* **Description:** Locates and caches a valid Perd shrine within `SEE_SHRINE_DIST`, skipping burnt or burning shrines. Resets the shrine cache if `seekshrine` is `false`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** A shrine entity or `nil`.
* **Error states:** Returns `nil` if no valid shrine is found, `seekshrine` is `false`, or the cached shrine is invalid/burnt/out-of-range.

### `ShrinePos(inst)`
* **Description:** Returns the world position of the cached shrine.
* **Parameters:** `inst` — the entity instance.
* **Returns:** A `Vector3` position (assumes shrine is valid).
* **Error states:** May throw an error if `inst._shrine` is `nil` at call time.

### `ShrineWanderPos(inst)`
* **Description:** Calculates a wander point at a safe distance (`MIN_SHRINE_WANDER_DIST`) from the shrine center for loitering behavior.
* **Parameters:** `inst` — the entity instance.
* **Returns:** A `Vector3` position.
* **Error states:** May produce undefined behavior if shrine position is invalid.

### `ShouldLoiter(inst)`
* **Description:** Determines whether Perd should loiter near the shrine based on elapsed time since last wander and randomization.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true` if loitering should occur, `false` otherwise.
* **Error states:** May incorrectly return `true` during initial shrine approach if `inst._lastshrinewandertime` is unset.

### `OnStart()`
* **Description:** Initializes the Perd behavior tree root node with priority-ordered subtrees handling: panic, night homing, shrine seeking (if enabled), safe eating, escaping threats, berry picking, and general wandering.
* **Parameters:** None.
* **Returns:** None. Sets `self.bt` to a `BT` instance with a `PriorityNode` root.
* **Error states:** Behavior may stall if required actions return `nil` without proper fallbacks.

## Events & listeners

This component does not register event listeners via `inst:ListenForEvent`. It integrates with the brain system via `OnStart`, which is called when the brain is activated. Events like `"panic"`, `"beattacked"`, or `"onupdate"` are handled internally by the behavior tree nodes (e.g., `BrainCommon.PanicTrigger`, `RunAway`, `WhileNode`) rather than explicit listeners.

---