---
id: tallbirdbrain
title: Tallbirdbrain
description: Controls the AI behavior of the Tallbird, implementing tasks such as nest defense, egg laying, homing, and threat response using a behavior tree.
tags: [ai, npc, bird, boss, combat]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: faf3e852
---

# Tallbirdbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `TallbirdBrain` component defines the behavior tree for the Tallbird entity in DST. It orchestrates high-priority responses (e.g., threat detection, panic triggers), state-dependent actions (e.g., returning home at night, laying eggs), and navigation behaviors (e.g., wandering, defending the nest). It interacts closely with the `homeseeker`, `health`, and `knownlocations` components to manage movement, combat, and environmental memory. As a subclass of `Brain`, it is attached to an entity and driven by a `BT` (Behavior Tree) root node that prioritizes actions dynamically during runtime.

## Usage example
```lua
local TallbirdBrain = require("brains/tallbirdbrain")
local inst = Entity()
inst:AddBrain("tallbirdbrain", TallbirdBrain)
inst:ListenForEvent("makenewnest", function()
    -- Custom logic when the Tallbird starts making a new nest
end)
```

## Dependencies & tags
**Components used:**
- `health` — used to check if a target is dead (`:IsDead()`), and implied presence via `target.components.health`.
- `homeseeker` — used to determine if a home exists (`:HasHome()`), retrieve the home instance (`home`), and access `home.readytolay` and `home.components.pickable`.
- `knownlocations` — used to remember and retrieve the "home" location via `:RememberLocation()` and `:GetLocation()`.

**Tags:**
- `tallbird` — added implicitly via `THREAT_CANT_TAGS` to exclude other Tallbirds from being targeted as threats.
- `notarget` — used in threat filtering to ignore non-targetable entities.
- `character`, `animal` — used in `THREAT_ONEOF_TAGS` to prioritize these entity types as threats.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this brain controls. |
| `bt` | `BehaviorTree` | `nil` (assigned in `OnStart`) | The behavior tree instance used for decision-making. |

No public properties are exposed directly by the constructor.

## Main functions

### `TallbirdBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree root node, which includes priority-based nodes for panic, threat defense, nesting, egg laying, and wandering. This is called automatically when the brain is attached and activated.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** May fail if required components (`homeseeker`, `knownlocations`, `health`) are missing or misconfigured, though error handling is not explicitly present.

### `TallbirdBrain:OnInitializationComplete()`
* **Description:** Records the Tallbird’s current world position as the "home" location using `knownlocations:RememberLocation()`. This ensures the entity has a known home point early in its lifecycle.
* **Parameters:** None.
* **Returns:** `nil`.

### `GoHomeAction(inst)`
* **Description:** Constructs and returns a `BufferedAction` to move toward the Tallbird’s home if one exists and is not burning. Used as a fallback action to return home at night or when needed.
* **Parameters:** `inst` — the entity instance (Tallbird).
* **Returns:** `BufferedAction` or `nil` if no valid home exists or it is burning.
* **Error states:** Returns `nil` if `homeseeker` is missing, `HasHome()` is `false`, or the home is burning.

### `DefendHomeAction(inst)`
* **Description:** Returns a `BufferedAction` to walk toward the home and defend it when a threat is detected near the nest.
* **Parameters:** `inst` — the entity instance (Tallbird).
* **Returns:** `BufferedAction` or `nil` if no valid home exists or it is burning.
* **Error states:** Same as `GoHomeAction`.

### `LayEggAction(inst)`
* **Description:** Returns a `BufferedAction` to lay an egg at the home if `home.readytolay` is true.
* **Parameters:** `inst` — the entity instance (Tallbird).
* **Returns:** `BufferedAction` or `nil` if any condition fails (no home, home not valid, or not ready to lay).
* **Error states:** Returns `nil` if `homeseeker` is missing, `HasHome()` is `false`, or `home.readytolay` is `false`.

### `IsNestEmpty(inst)`
* **Description:** Checks whether the Tallbird’s nest is empty (i.e., the pickable component exists and `CanBePicked()` returns `false`, meaning the egg is not collectible yet).
* **Parameters:** `inst` — the entity instance (Tallbird).
* **Returns:** `boolean`.
* **Error states:** Returns `false` if `homeseeker`, `pickable`, or their checks fail.

### `GetNearbyThreatFn(inst)`
* **Description:** Returns a nearby threat entity (e.g., a character or animal) within `START_FACE_DIST` (6 units), excluding entities tagged with `tallbird` or `notarget`.
* **Parameters:** `inst` — the entity instance (Tallbird or its home).
* **Returns:** `Entity` or `nil`.
* **Error states:** Returns `nil` if no matching entity is found.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Checks whether the Tallbird should maintain face orientation toward the given target, based on distance and health status.
* **Parameters:**  
  - `inst` — the Tallbird entity.  
  - `target` — the potential threat/target entity.  
* **Returns:** `boolean` (`true` if the target is alive, valid, and within `KEEP_FACE_DIST`).
* **Error states:** Returns `false` if `target` is dead (`IsDead()`), missing `health` component, or too far.

### `CanMakeNewNest(inst)`
* **Description:** Determines whether the Tallbird can initiate nest construction: requires no existing home, ability to build a new one (`:CanMakeNewHome()`), and not being in a "busy" state.
* **Parameters:** `inst` — the entity instance (Tallbird).
* **Returns:** `boolean`.
* **Error states:** Returns `false` if any condition fails.

## Events & listeners
- **Listens to:** None explicitly defined in this file. Event subscriptions (e.g., for `"makenewnest"`) must be handled externally (e.g., on the entity before or after adding this brain).
- **Pushes:**  
  - `"makenewnest"` — fired inside the behavior tree when `CanMakeNewNest(self.inst)` becomes true, triggering nest construction logic.