---
id: locomotor
title: Locomotor
description: The Locomotor component controls movement, pathfinding, and locomotion behavior for entities in the game.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 4eb22e46
---

# Locomotor

## Overview
The Locomotor component manages movement direction, speed, pathfinding, and locomotion actions—including walking, running, platform hopping, and destination-based movement—for entities in the Entity Component System. It integrates with physics, state graphs, and pathfinding systems, and includes robust support for both server-authoritative and client-predicted movement.

## Dependencies & Tags
- **Component Tags Added/Removed:**
  - `locomotor`: Added on the entity during initialization (server only).
  - `turfrunner_<tile>`: Dynamically added/removed per ground tile type where the entity gains speed boosts (server only).
- **ListenForEvent("onremove", ...):**  
  To clean up external speed multiplier sources when sources are removed.
- **Related Components:**  
  Uses `physics`, `health`, `rider`, `inventory`, `inventoryitem`, `player_classified`, `embarker`, `amphibiouscreature`, `drownable`, `saddler`, `mightiness`, `walkableplatform`, `platformhopdelay`, `route`, `replica.rider`, `replica.inventory`, `replica.inventoryitem`, `replica.combat`, `replica.player_classified`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owner entity. |
| `ismastersim` | `boolean` | — | True if running on server, false on client. |
| `dest` | `Dest` or `nil` | `nil` | Current destination (entity, point, or buffered action). |
| `atdestfn` | `function` or `nil` | `nil` | Callback invoked when reaching the destination. |
| `bufferedaction` | `BufferedAction` or `nil` | `nil` | Associated buffered action (e.g., action after arriving). |
| `arrive_dist` | `number` | `ARRIVE_STEP` (0.15) | Distance threshold to consider destination reached. |
| `walkspeed` | `number` | `TUNING.WILSON_WALK_SPEED` (4) | Base walking speed. |
| `runspeed` | `number` | `TUNING.WILSON_RUN_SPEED` (6) | Base running speed. |
| `throttle` | `number` | `1` | Global speed multiplier applied to all locomotion. |
| `slowmultiplier` | `number` | `0.6` | Speed reduction factor when on creep. |
| `fastmultiplier` | `number` | `1.3` | Speed increase factor for road/creep/faster tiles. |
| `movestarttime` | `number` | `-1` | Timestamp of movement start. |
| `movestoptime` | `number` | `-1` | Timestamp of last movement stop. |
| `groundspeedmultiplier` | `number` | `1.0` | Current ground-based speed multiplier (e.g., creep, tile type). |
| `enablegroundspeedmultiplier` | `boolean` | `true` | Enables/disables dynamic ground speed adjustments. |
| `isrunning` | `boolean` | `false` | True when entity is in running state. |
| `_externalspeedmultipliers` | `table` | `{}` | Internal table of speed multipliers by source. |
| `externalspeedmultiplier` | `number` | `1` | Product of all external speed multipliers. |
| `externalvelocityvectorx` | `number` | `0` | X component of external velocity vector. |
| `externalvelocityvectorz` | `number` | `0` | Z component of external velocity vector. |
| `wasoncreep` | `boolean` | `false` | Tracks whether the entity was on creep in the last update. |
| `triggerscreep` | `boolean` | `true` | Whether stepping on creep triggers creep-related logic. |
| `fasteronroad` | `boolean` | — | Whether the entity moves faster on roads. |
| `fasteroncreep` | `boolean` | — | Whether the entity moves faster on creep (if enabled). |
| `faster_on_tiles` | `table` | `{}` | Map of ground tile IDs to boolean indicating speed boost. |
| `is_prediction_enabled` | `boolean` | — | Prediction mode flag (usage inferred, not explicitly set). |
| `hop_distance` | `number` | `TUNING.DEFAULT_LOCOMOTOR_HOP_DISTANCE` | Distance to scan for hop targets. |
| `hopping` | `boolean` | `false` | True while currently in a hop animation/state. |
| `allow_platform_hopping` | `boolean` or `nil` | `nil` | Enables platform hopping mechanics. |
| `last_platform_visited` | `string` or `Platform` or `nil` | `INVALID_PLATFORM_ID` | Tracks last visited platform to prevent back-and-forth hopped loops. |
| `pathcaps` | `table` or `nil` | `nil` | Pathfinding caps (e.g., `allowocean`, `ignoreLand`). |
| `wantstomoveforward` | `boolean` | `false` | True if entity is trying to move forward. |
| `wantstorun` | `boolean` | `false` | True if entity wants to run. |
| `predictmovestarttime` | `number` or `nil` | `nil` | Predicted movement start time (client-only). |
| `predictexternalspeedmultiplier` | `SourceModifierList` or `nil` | `nil` | Predicted external speed multiplier list (client-only). |

## Main Functions

### `LocoMotor:GoToEntity(target, bufferedaction, run)`
Sets the destination to an entity, calculates arrival distance, and initiates pathfinding or direct drive movement.

* **Description:**  
  Begins movement toward a target entity. Computes arrival distance using physics radii, buffered action overrides, and minimum distance requirements. Starts pathfinding if direct drive is disabled, or begins movement directly if enabled.
* **Parameters:**
  - `target` (`Entity`): Target entity to move toward.
  - `bufferedaction` (`BufferedAction` or `nil`): Optional action to trigger upon arrival.
  - `run` (`boolean`): Whether to run (true) or walk (false).

### `LocoMotor:GoToPoint(pt, bufferedaction, run, overridedest)`
Sets the destination to a point in world space and initiates movement or pathfinding.

* **Description:**  
  Initiates movement to a specific point. Similar to `GoToEntity`, but uses a raw 3D point instead of an entity. Supports overridedest for advanced network controller use.
* **Parameters:**
  - `pt` (`Vector3` or `nil`): Target point.
  - `bufferedaction` (`BufferedAction` or `nil`): Optional action to trigger upon arrival.
  - `run` (`boolean`): Whether to run (true) or walk (false).
  - `overridedest` (`Dest` or `nil`): Optional pre-constructed destination override.

### `LocoMotor:PushAction(bufferedaction, run, try_instant)`
 Processes and commits a buffered action—e.g., walking to an item or using a structure—by calculating destination, pathfinding, and eventual action trigger.

* **Description:**  
  Validates and begins execution of a buffered action. Handles special cases such as LOOKAT, CASTAOE, inventory items in pocket dimensions, and instant actions. Sends to server on clients.
* **Parameters:**
  - `bufferedaction` (`BufferedAction` or `nil`): The action to execute.
  - `run` (`boolean`): Whether to run toward the destination.
  - `try_instant` (`boolean`): Reserved flag (unused in this implementation).

### `LocoMotor:PreviewAction(bufferedaction, run, try_instant)`
 Previews a buffered action without committing it—typically used on the client to show intended movement or animation.

* **Description:**  
  Validates and visualizes a buffered action, primarily used on the client for prediction. Does *not* modify state on the server. Handles LOOKAT, CASTAOE, and movement preview.
* **Parameters:**
  - `bufferedaction` (`BufferedAction` or `nil`): Action to preview.
  - `run` (`boolean`): Whether to run toward destination.
  - `try_instant` (`boolean`): Reserved flag.

### `LocoMotor:WalkForward(direct)`
 Initiates walking in the current direction.

* **Description:**  
  Sets entity to walking state, applies walk speed, and starts updating the component.
* **Parameters:**
  - `direct` (`boolean`, optional): If true, explicitly sets `wantstomoveforward = true`.

### `LocoMotor:RunForward(direct)`
 Initiates running in the current direction.

* **Description:**  
  Sets entity to running state, applies run speed, and starts updating the component.
* **Parameters:**
  - `direct` (`boolean`, optional): If true, explicitly sets `wantstomoveforward = true`.

### `LocoMotor:WalkInDirection(direction, should_run)`
 Moves in a specified direction without a fixed destination.

* **Description:**  
  Resets pathfinding, sets movement direction, and begins walking or running. Used for free movement controls.
* **Parameters:**
  - `direction` (`number`): Rotation angle (in degrees) for movement direction.
  - `should_run` (`boolean`): Whether to run.

### `LocoMotor:RunInDirection(direction, throttle)`
 Moves in a specified direction with configurable throttle.

* **Description:**  
  Similar to `WalkInDirection`, but runs and allows overriding speed via `throttle`.
* **Parameters:**
  - `direction` (`number`): Movement direction in degrees.
  - `throttle` (`number`, optional): Global speed multiplier (default: 1).

### `LocoMotor:FindPath()`
 Submits a pathfinding request to the Pathfinder system.

* **Description:**  
  Checks if line-of-sight exists between entity and destination; if not, submits a pathfinding request. Prevents duplicate searches for same destination tile. Respects `pathcaps`.
* **Parameters:**  
  None.

### `LocoMotor:SetExternalSpeedMultiplier(source, key, m)`
 Sets or updates an external speed multiplier source.

* **Description:**  
  Records a speed multiplier from a named source/key, computes and updates the aggregate multiplier. Handles source removal via event listener.
* **Parameters:**
  - `source` (`any`): Unique source identifier (e.g., `"status_effect"`).
  - `key` (`string` or `nil`): Sub-key for the multiplier.
  - `m` (`number`): Multiplier value. If `nil` or `1`, the multiplier is removed.

### `LocoMotor:RecalculateExternalSpeedMultiplier(sources)`
 Computes the aggregate product of all active external speed multipliers.

* **Description:**  
  Internal utility used to maintain `externalspeedmultiplier` from `sources`.
* **Parameters:**
  - `sources` (`table`): Map of `{ source = { multipliers = { key = value } } }`.

### `LocoMotor:GetWalkSpeed() / GetRunSpeed()`
 Returns effective walking/running speed based on all multipliers.

* **Description:**  
  Applies speed multipliers (ground, external, throttle, inventory, rider/mount, etc.) to base speed.
* **Parameters:**  
  None.

### `LocoMotor:UpdateGroundSpeedMultiplier()`
 Recalculates ground-based speed multiplier based on location (creep, road, tile type).

* **Description:**  
  Checks if current position is on creep, road, faster tile, or other terrain. Applies slow/fast multipliers and triggers creep-related events.
* **Parameters:**  
  None.

### `LocoMotor:ScanForPlatformInDir(...)`
 Scans forward direction for valid hop targets across platforms.

* **Description:**  
  Checks discrete points along a direction vector for valid hop destinations, respecting platform limits, hop delays, and obstacle detection. Used for platform hopping logic.
* **Parameters:**  
  Standard inputs include platform reference, map, origin, direction vector, scan steps, and step size.

### `LocoMotor:OnUpdate(dt, arrive_check_only)`
 Core update loop—handles movement, destination arrival, path following, platform hopping, and creep logic.

* **Description:**  
  Drives all movement logic per frame: checks for destination reach, follows path, adjusts facing, applies speed, handles platform hopping and drowning checks.
* **Parameters:**
  - `dt` (`number`): Delta time since last update.
  - `arrive_check_only` (`boolean`): If true, only checks for destination arrival and returns early.

## Events & Listeners
- Listens for:
  - `"onremove"` (on source removal): To clean up external speed multiplier sources.
  - `"onremove"` (on entity removal): On component removal from entity (via `OnRemoveFromEntity`).
  - `"onreachdestination"`: Pushed internally when destination is reached.
  - `"walkoncreep"` / `"walkoffcreep"`: Pushed when entering/exiting creep zones.
  - `"startstrafing"` / `"stopstrafing"`: Pushed when strafing state changes.
  - `"locomote"`: Pushed when movement state changes (start/stop/run/walk).
  - `"bufferedcastaoe"`: Pushed when buffered AOE action begins.
  - `"actionfailed"`: Pushed when a buffered action fails validation.

- Triggers (via `inst:PushEvent`):
  - `"onreachdestination"`: On arriving at destination.
  - `"walkoncreep"` / `"walkoffcreep"`: On creeps.
  - `"startstrafing"` / `"stopstrafing"`: On strafing state changes.
  - `"locomote"`: On movement start/stop.
  - `"onhop"`: Before platform or water hopping.
  - `"bufferedcastaoe"`: On buffered AOE action initiation.
  - `"actionfailed"`: When buffered action validation fails.