---
id: mast
title: Mast
description: Manages sail deployment and retraction logic for a boat mast, including force/velocity calculation, animation control, and interaction with rudder and boat physics.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ece6fe9e
---

# Mast

## Overview
The `Mast` component handles sail state (raised/lowered), transition animation, and physics interaction for a boat's mast entity. It calculates sail force and max velocity based on sail position, manages furlers (players manually unfurling/furling the sail), synchronizes animation state, and integrates with the boat’s physics system and rudder orientation.

## Dependencies & Tags
- **Components used:**
  - Relies on `self.inst:GetCurrentPlatform()` to acquire the parent boat entity.
  - Adds/removes tags: `"saillowered"`, `"sailraised"`, `"sail_transitioning"`, `"rotatableobject"`.
  - Creates and manages a `"rudder"` component (`self.rudder`) via `SpawnPrefab("rudder")`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity this component is attached to (the mast). |
| `is_sail_raised` | `boolean` | `false` | Whether the sail is fully raised (lowered relative to water flow in inverted mode). |
| `inverted` | `boolean` | `false` | If `true`, sail direction is inverted (e.g., tail/south sail orientation). |
| `sail_force` | `number` | `TUNING.BOAT.MAST.BASIC.SAIL_FORCE` | Base force applied to the boat when sail is deployed. |
| `has_speed` | `boolean` | `false` | Reserved; not actively used in code. |
| `boat` | `Entity?` | `nil` | Reference to the parent boat entity. |
| `rudder` | `Entity?` | `nil` | Reference to the rudder entity bound to this mast. |
| `max_velocity` | `number` | `TUNING.BOAT.MAST.BASIC.MAX_VELOCITY` | Maximum boat velocity (scaled by sail deployment). |
| `rudder_turn_drag` | `number` | `TUNING.BOAT.MAST.BASIC.RUDDER_TURN_DRAG` | Drag factor applied when turning. |
| `furlunits_max` | `number` | `4.5` | Total furl units required to fully unfurl the sail manually. |
| `furlunits` | `number` | `self.furlunits_max` | Current furl units (0 = fully unfurled, `furlunits_max` = fully furled). |
| `autounfurlunits` | `number` | `8` | Rate at which the sail automatically unfurls when no furlers are active. |
| `furlers` | `table` | `{}` | Map of player entities → their furling strength contributing to unfurling. |
| `sink_fx` | `string?` | `nil` | Optional prefab name for mast-sinking fx (set externally). |
| `boat_death` | `boolean?` | `nil` | Flag indicating the mast is sinking due to boat death. |

## Main Functions

### `SetReveseDeploy(set)`
* **Description:** Instantly sets the sail state and inverts its behavior (`inverted` flag). Used for alternate sail orientations.
* **Parameters:**  
  `set` (`boolean`) — `true` to set sail as lowered/inverted (deployed opposite), `false` to reset.

### `SetSailForce(set)`
* **Description:** Updates the base sail force value.
* **Parameters:**  
  `set` (`number`) — New sail force scalar.

### `CalcSailForce()`
* **Description:** Returns the current effective sail force based on sail deployment state and furl units.
* **Parameters:** None.

### `CalcMaxVelocity()`
* **Description:** Returns the current effective max boat velocity based on sail deployment state and furl units.
* **Parameters:** None.

### `SetVelocityMod(set)`
* **Description:** Sets the `max_velocity_mod` property (note: not used in current logic).
* **Parameters:**  
  `set` (`number`) — Velocity modifier.

### `SetBoat(boat)`
* **Description:** Attaches/detaches the mast from a boat entity. Adds/removes physics listener callbacks and manages the `"rotatableobject"` tag.
* **Parameters:**  
  `boat` (`Entity?`) — The boat entity to bind; `nil` to detach.

### `SetRudder(obj)`
* **Description:** Binds a rudder entity to this mast and sets it as a child of the mast.
* **Parameters:**  
  `obj` (`Entity`) — The rudder entity.

### `OnDeath()`
* **Description:** Handles mast behavior upon boat death: marks `boat_death`, stops movement sounds, and detaches from the boat.
* **Parameters:** None.

### `AddSailFurler(doer, strength)`
* **Description:** Registers a player attempting to unfurl the sail, starts sail-transition mode, and plays the unfurl sound.
* **Parameters:**  
  `doer` (`Entity`) — The player/entity adding effort.  
  `strength` (`number`) — Player’s contribution to unfurling rate.

### `RemoveSailFurler(doer)`
* **Description:** Removes a player’s effort from unfurling and sends a `"stopfurling"` event to them.
* **Parameters:**  
  `doer` (`Entity`) — The player/entity to remove.

### `GetCurrentFurlUnits()`
* **Description:** Computes total current unfurling effort from active players (only if animating "pull_small_loop" or early in "pull_big_loop").
* **Parameters:** None.

### `UnfurlSail()`
* **Description:** Starts unfurling animation (lowering sail), sets transition state, and plays sound.
* **Parameters:** None.

### `SailFurled()`
* **Description:** Finishes furled (raised) state: resets furl units, ends transition, updates animations, and notifies all furlers to stop.
* **Parameters:** None.

### `SailUnfurled()`
* **Description:** Finishes unfurled (lowered) state: resets furl units, updates animations for "fully unfurled".
* **Parameters:** None.

### `CloseSail()`
* **Description:** Instantly snaps sail to the "inactive" state (furled if normal, unfurled if inverted).
* **Parameters:** None.

### `GetFurled0to1()`
* **Description:** Returns a 0.0–1.0 value representing how furled the sail is (1.0 = fully furled, 0.0 = fully unfurled).
* **Parameters:** None.

### `SetRudderDirection(rudder_direction_x, rudder_direction_z)`
* **Description:** Rotates the mast to face the rudder’s direction vector (relative to mast’s world position).
* **Parameters:**  
  `rudder_direction_x` (`number`) — X component of rudder direction.  
  `rudder_direction_z` (`number`) — Z component of rudder direction.

### `OnUpdate(dt)`
* **Description:** Updates sail furling/unfurling progress during transitions, adjusting `furlunits`, triggering completion callbacks, and syncing animation.
* **Parameters:**  
  `dt` (`number`) — Time elapsed since last frame.

## Events & Listeners
- **Listens for events:**
  - `"onremove"` on boat (`self.OnBoatRemoved`).
  - `"death"` on boat (`self.OnBoatDeath`).
  - `"is_sail_raised"` → triggers `on_is_sail_raised`.
  - `"is_sail_transitioning"` → triggers `on_is_sail_transitioning`.
- **Triggers events:**
  - `"stopfurling"` on a furler entity when removed via `RemoveSailFurler`.
  - Uses `self.inst:PushEvent("...")` implicitly via `doer:PushEvent(...)`.