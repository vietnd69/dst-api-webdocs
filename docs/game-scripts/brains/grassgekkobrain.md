---
id: grassgekkobrain
title: Grassgekkobrain
description: Implements AI behavior for the grassgekko entity, coordinating panic responses, fleeing, and wandering.
tags: [ai, locomotion, panic]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: d79b9791
system_scope: brain
---

# Grassgekkobrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Grassgekkobrain` defines the behavior tree for the grassgekko entity, a small prey animal in DST. It prioritizes panic responses to electric fences and scaring entities (e.g., players), then falls back to fleeing or wandering. It uses the `knownlocations` component to determine a target for wandering behavior (specifically, the "herd" location).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("knownlocations")
-- ... populate knownlocations with "herd" ...
inst.brain = GrassgekkoBrain(inst)
inst.brain:OnStart()
```

## Dependencies & tags
**Components used:** `knownlocations` (accessed via `inst.components.knownlocations:GetLocation("herd")`)
**Tags:** Uses the tag `"scarytoprey"` for one `RunAway` behavior; `"player"` for another. Uses `NO_TAGS` set (`{"FX", "NOCLICK", "DECOR","INLIMBO", "stump", "burnt"}`) to exclude those entities from avoidance.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes and assigns the behavior tree for the grassgekko. Sets up a priority node ordering behavior: panic triggers first, then flight from scary entities and players, and finally wandering.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Requires `inst.components.knownlocations` to be present and contain a `"herd"` location; otherwise, `GetLocation("herd")` returns `nil`, and wander behavior may malfunction.

## Events & listeners
None identified.

## Behaviors and constants
The following constants control behavior thresholds (all distances are in game units):
- `MIN_FOLLOW_DIST = 0`, `MAX_FOLLOW_DIST = 25`, `TARGET_FOLLOW_DIST = 6` — unused in current code.
- `MAX_WANDER_DIST = 8` — passed to `Wander` via `GetWanderDistFn`.
- `LEASH_RETURN_DIST = 15`, `LEASH_MAX_DIST = 30` — unused in current code.
- `AVOID_PLAYER_DIST = 7`, `AVOID_PLAYER_STOP = 12` — distance thresholds for fleeing players.
- `AVOID_DIST = 7`, `AVOID_STOP = 12` — distance thresholds for fleeing from other "scarytoprey" entities.
- `NO_TAGS` — list of tags to ignore during avoidance logic.
- `GetWanderDistFn(inst)` — returns `MAX_WANDER_DIST` (8) as a dynamic wander range.

The behavior tree root uses `PriorityNode` with these behaviors in order:
1. `BrainCommon.PanicTrigger` — immediate panic reaction (e.g., to fire).
2. `BrainCommon.ElectricFencePanicTrigger` — panic when near electrified fences.
3. `RunAway(self.inst, "scarytoprey", 7, 12, ...)` — flee from entities tagged `"scarytoprey"`.
4. `RunAway(self.inst, "player", 7, 12, nil, nil, NO_TAGS)` — flee from players, excluding entities with `NO_TAGS`.
5. `Wander(self.inst, ...)` — wander toward the `"herd"` location returned by `knownlocations:GetLocation("herd")`, up to 8 units away.
