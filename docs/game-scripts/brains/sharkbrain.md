---
id: sharkbrain
title: Sharkbrain
description: Manages the AI decision-making logic for sharks, controlling movement, aggression, feeding, and boat-following behavior in Don't Starve Together.
tags: [ai, combat, entity, movement, feeding]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 92abb185
---

# Sharkbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`SharkBrain` is a brain component that implements behavior tree logic for sharks in Don't Starve Together. It governs their movement patterns, aggression, and feeding strategies—including the unique ability to follow boats on the surface of the ocean. The brain prioritizes survival behaviors (e.g., retreating from danger or staying in water) and dynamically chooses actions like wandering, chasing targets, attacking, or seeking food. It relies heavily on external components such as `combat` (for target tracking), `eater` (for food validation), `homeseeker` (for home position), `timer` (for cooldowns), and `boatphysics` (for boat velocity and follow position calculations).

## Usage example
The component is instantiated automatically by the game when a shark entity is created and is not typically added manually by modders.

```lua
-- Inside a shark prefab file (e.g., prefabs/shark.lua):
inst:AddComponent("brain")
inst.components.brain:SetBrain("sharkbrain")
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `homeseeker`, `timer`, `boatphysics`, `inventoryitem` (indirectly via `IsHeld` check).  
**Tags:** Checks for `"INLIMBO"` and `"outofreach"` tags in entity search filters; no tags are added/removed dynamically by this brain itself.

## Properties
The component does not declare any public properties in its constructor. Behavior is entirely driven by local functions and the behavior tree set up in `OnStart()`. Only internal state variables are used temporarily during behavior execution (e.g., `self.inst.targetboat`, `self.inst.foodtoeat`, `self._removefood`), which are not persistent or serialized.

## Main functions
### `OnStart()`
* **Description:** Constructs and initializes the behavior tree root node. Sets up conditional priorities for behaviors based on environment (water vs. land), proximity to threats (via `PanicTrigger`/`ElectricFencePanicTrigger`), and other game state. Behaviors such as `Wander`, `ChaseAndAttack`, `DoAction(isfoodnearby)`, and `DoAction(EatFishAction)` are included in a priority-ordered list under the `"on water"` condition. Attack behavior only triggers when the shark is *not* in water and not currently in a `"jumping"` state. The behavior tree is stored in `self.bt`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None documented. Assumes proper initialization of the base `Brain` class.

### `isOnWater(inst)`
* **Description:** Helper that determines if the entity is currently in water by checking if it has no platform (`GetCurrentPlatform` returns `nil`) and the underlying world is not solid ground.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `true` if the entity is floating on water; otherwise `false`.
* **Error states:** Uses `TheWorld.Map:IsVisualGroundAtPoint(...)`, which may behave unpredictably near cliffs or map edges.

### `GetHome(inst)`
* **Description:** Retrieves the home entity via `homeseeker.home` if the component exists.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `inst.components.homeseeker.home` if `homeseeker` is attached, otherwise `nil`.

### `GetHomePos(inst)`
* **Description:** Gets the world position of the home entity.
* **Parameters:** `inst` (Entity instance).
* **Returns:** World position vector (`Vector3`) or `nil` if no home is set.

### `GetWanderPoint(inst)`
* **Description:** If a nearby player is present (via `GetNearestPlayer(true)`), returns the player's position as a wander target; otherwise, `nil`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** World position vector (`Vector3`) or `nil`.

### `isfoodnearby(inst)`
* **Description:** Searches for edible food within `SEE_DIST` (30 units) that is floating on water (no platform and not on ground). If a valid food item is found and not already assigned, registers cleanup callbacks for `onremove` and `onpickup` events, sets `inst.foodtoeat`, and returns a `BufferedAction` for eating. Avoids targeting food that is already too close (`< 6 units`).
* **Parameters:** `inst` (Entity instance).
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if no food is found, if food is too close, or if it’s currently being held (checked via `FindEntity` and distance filtering).

### `EatFishAction(inst)`
* **Description:** Attempts to locate and target an ocean fish (`"oceanfish"` tag) in the immediate area if the shark is not already eating. Only initiates the action if no `"gobble_cooldown"` timer is active. Checks via `FindEntity` that the shark is in ocean terrain.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if a cooldown timer exists (`"gobble_cooldown"`), if no fish is found, or if the targeted fish is being held (validated via `IsHeld()` from `inventoryitem` component).

### `GetBoatFollowPosition(inst)`
* **Description:** Finds and follows the nearest boat within 20 units, using a two-step process: First checks if `inst.targetboat` is set, or attempts to find one and sets a `"targetboatdelay"` timer (10 seconds). Once a boat is identified, computes the follow offset based on its velocity (if moving fast enough) using `GetFormationOffsetNormal`, or otherwise positions the shark behind the boat at a fixed distance (`BOAT_TARGET_DISTANCE`). This function is currently commented out in the behavior tree (the `Leash` behavior line is commented).
* **Parameters:** `inst` (Entity instance).
* **Returns:** Target position vector (`Vector3`) or `nil` (if no boat is found).
* **Error states:** If `targetboat` becomes invalid during follow, may continue to reference `nil`. Relies on `BOAT_TARGET_DISTANCE` being defined elsewhere.

### `GetBoatFollowDistance(inst)`
* **Description:** Returns the acceptable follow distance threshold to the boat. Returns `0.5` if the boat is moving faster than the shark's walk speed (`SHARK_WALK_SQ`); otherwise returns `MAX_BOAT_FOLLOW_DIST`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `number` (distance threshold).
* **Error states:** `MAX_BOAT_FOLLOW_DIST` must be defined elsewhere.

### `ShouldLeashRun(inst)`
* **Description:** Returns `true` if the shark should run toward (or maintain position relative to) a boat when it is moving above the shark's walk speed.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `true` if boat velocity squared >= `SHARK_WALK_SQ`; otherwise `false`.

### `GetRunAwayTarget(inst)`
* **Description:** Returns the current combat target (e.g., the player being chased) *only if* the `"getdistance"` timer exists—likely used for flee behavior during close encounters.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `inst.components.combat.target` or `nil`.

### `removefood(inst, target)`
* **Description:** Utility to clean up event listeners and clear `inst.foodtoeat` and `inst._removefood` when a targeted food entity is removed or picked up.
* **Parameters:** `inst` (Entity instance), `target` (Entity instance).
* **Returns:** None.
* **Error states:** Safe only when `inst._removefood` is non-`nil`.

## Events & listeners
- **Listens to:** `"onremove"` and `"onpickup"` events from food entities (via `inst:ListenForEvent(...)` in `isfoodnearby`) to trigger cleanup of the food reference.
- **Pushes:** `"dobite"` event via `inst:PushEvent("dobite")` inside the `Attack` helper function (called via `DoAction(self.inst, Attack, "attack", true)`).