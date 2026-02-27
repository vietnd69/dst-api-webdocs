---
id: heavyobstaclephysics
title: Heavyobstaclephysics
description: Manages the physics behavior of heavy obstacles—including dynamic radius adjustment, state transitions (ITEM, OBSTACLE, FALLING), and responsiveness to character proximity and interaction events.

sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 83c8c121
---

# Heavyobstaclephysics

## Overview
This component governs the physics state and collision behavior of heavy in-world obstacles (e.g., boulders, large rocks) by dynamically adjusting their physical radius based on nearby character proximity, transitioning between states (ITEM, OBSTACLE, FALLING), and responding to gameplay events such as being held, dropped, pushed, or falling. It ensures obstacles behave as static colliders when idle, shrink to allow passage when characters are nearby, and revert to solid obstacles when not in use—while maintaining compatibility with gravity and physics interactions.

## Dependencies & Tags
- **Required Components:**
  - `Physics`
  - `Transform`
- **Event Listeners:** The component registers callbacks for:
  - `"onputininventory"` → changes to `ITEM` state
  - `"ondropped"` → changes to `OBSTACLE` state
  - `"startfalling"` / `"stopfalling"` (optional via `AddFallingStates()`) → enters/exits `FALLING` state
  - `"startpushing"` / `"stoppushing"` (optional via `AddPushingStates()`) → temporarily enters `ITEM` state while being pushed
- **Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxradius` | `number` | `nil` | Maximum radius (capsule width) used when obstacle is fully solid. Set via `SetRadius(radius)`. |
| `currentradius` | `number` | `nil` | Current active radius; dynamically adjusted (0 to `maxradius`) based on nearby characters. |
| `physicsstate` | `number` (`PHYSICS_STATE`) | `nil` | Numeric state constant: `1=ITEM`, `2=OBSTACLE`, `3=FALLING`. |
| `issmall` | `boolean` | `nil` | If `true`, obstacle uses `SMALLOBSTACLES` group and collision mask; set via `MakeSmallObstacle()`. |
| `task` | `Task` | `nil` | Periodic task used to update obstacle radius during `OBSTACLE` state. |
| `ischaracterpassthrough` | `boolean` | `nil` | Tracks whether characters currently pass through the obstacle (used to toggle collision once). |
| `onphysicsstatechangedfn` | `function` | `nil` | Callback fired when `physicsstate` changes. Arguments: `(inst, stateName)`. |
| `onchangetoitemfn` | `function` | `nil` | Callback fired when transitioning to `ITEM` state. Argument: `(inst)`. |
| `onchangetoobstaclefn` | `function` | `nil` | Callback fired when transitioning to `OBSTACLE` state. Argument: `(inst)`. |
| `onstartfallingfn` | `function` | `nil` | Callback fired when falling begins. Argument: `(inst)`. |
| `onstopfallingfn` | `function` | `nil` | Callback fired when falling ends. Argument: `(inst)`. |
| `onstartpushingfn` | `function` | `nil` | Callback fired when pushing begins. Argument: `(inst)`. |
| `onstoppushingfn` | `function` | `nil` | Callback fired when pushing ends. Argument: `(inst)`. |
| `deprecated_floating_exploit` | `boolean` | `nil` | Internal flag used to preserve legacy floating behavior (for backward compatibility only). |

## Main Functions

### `SetCurrentRadius(self, radius)`
* **Description:** Updates the obstacle's physical capsule radius and applies it to the `Physics` component. Only acts if the new radius differs from the current one.
* **Parameters:**
  * `radius` (number): Desired radius (0 to `maxradius`).

### `SetPhysicsState(self, state)`
* **Description:** Updates the internal `physicsstate` and triggers the `onphysicsstatechangedfn` callback (if set) with the human-readable state name.
* **Parameters:**
  * `state` (number): Numeric state (`PHYSICS_STATE.ITEM`, `OBSTACLE`, or `FALLING`).

### `ChangeToItem(inst)`
* **Description:** Transitions the obstacle to `ITEM` state (static, pickable). Sets radius to `maxradius`, mass to `1`, collision group to `ITEMS`, and collision mask to `WORLD`, `OBSTACLES`, `SMALLOBSTACLES`.
* **Parameters:**
  * `inst` (Entity): The entity instance.

### `OnUpdateObstacleSize(inst, self)`
* **Description:** Periodically computes the smallest distance to any nearby character (excluding ghosts/flying/non-locomotors) and shrinks the obstacle’s radius accordingly. If the radius becomes `maxradius`, cancels the periodic task. Also manages character passthrough collision toggling.
* **Parameters:**
  * `inst` (Entity): The obstacle entity.
  * `self` (HeavyObstaclePhysics): Component instance.

### `OnChangeToObstacle(inst, self)`
* **Description:** Asynchronously transitions the obstacle to `OBSTACLE` state (static, solid). Sets mass to `0`, configures collision group/mask based on `issmall`, and starts a periodic radius-update task.
* **Parameters:**
  * `inst` (Entity): The obstacle entity.
  * `self` (HeavyObstaclePhysics): Component instance.

### `ChangeToObstacle(inst)`
* **Description:** Public wrapper that schedules `OnChangeToObstacle` with a 0.5s delay (to prevent race conditions). Cancels any pending radius-update task first.
* **Parameters:**
  * `inst` (Entity): The obstacle entity.

### `OnStartFalling(inst)`
* **Description:** Transitions the obstacle to `FALLING` state. Resets radius to `maxradius`, sets mass to `1`, and clears the collision mask so it can fall through obstacles.
* **Parameters:**
  * `inst` (Entity): The obstacle entity.

### `OnStopFalling(inst)`
* **Description:** Handles transition from `FALLING` to `OBSTACLE` state upon landing. Triggers `onstopfallingfn` callback and calls `OnChangeToObstacle`.
* **Parameters:**
  * `inst` (Entity): The obstacle entity.

### `OnStartPushing(inst)`
* **Description:** Temporarily switches the obstacle to `ITEM` state (e.g., when player pushes it with a tool).
* **Parameters:**
  * `inst` (Entity): The obstacle entity.

### `OnStopPushing(inst)`
* **Description:** Returns the obstacle to `OBSTACLE` state after pushing ends—*unless* it is currently held in an inventory.
* **Parameters:**
  * `inst` (Entity): The obstacle entity.

### `HeavyObstaclePhysics:OnEntityWake()`
* **Description:** On entity wake, checks if the obstacle is floating above ground without being held. If so, forces it to fall (`ForceDropPhysics`).
* **Parameters:** None.

### `HeavyObstaclePhysics:SetRadius(radius)`
* **Description:** Initializes `maxradius`, sets initial state to `OBSTACLE`, and registers callbacks for `"onputininventory"` and `"ondropped"`.
* **Parameters:**
  * `radius` (number): Maximum capsule radius.

### `HeavyObstaclePhysics:MakeSmallObstacle()`
* **Description:** Marks the obstacle as small, affecting its collision group/mask (`SMALLOBSTACLES` instead of `OBSTACLES`).
* **Parameters:** None.

### `HeavyObstaclePhysics:AddFallingStates()`
* **Description:** Registers callbacks for `"startfalling"` and `"stopfalling"` events.
* **Parameters:** None.

### `HeavyObstaclePhysics:AddPushingStates()`
* **Description:** Registers callbacks for `"startpushing"` and `"stoppushing"` events.
* **Parameters:** None.

### `HeavyObstaclePhysics:ForceDropPhysics()`
* **Description:** Immediately transitions through `ITEM` → `OBSTACLE` to trigger falling physics (e.g., for spawns). Used when obstacles need to "wake up" and fall instantly.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"onputininventory"` → triggers `ChangeToItem`
  - `"ondropped"` → triggers `ChangeToObstacle`
  - `"startfalling"` → triggers `OnStartFalling` (added via `AddFallingStates`)
  - `"stopfalling"` → triggers `OnStopFalling` (added via `AddFallingStates`)
  - `"startpushing"` → triggers `OnStartPushing` (added via `AddPushingStates`)
  - `"stoppushing"` → triggers `OnStopPushing` (added via `AddPushingStates`)
- **Pushes no events.**