---
id: shadowhand
title: Shadowhand
description: A temporary shadow creature component that moves toward a target fire source to extinguish it, retracts when the player gets too close, and dissipates when the fire is extinguished or the distance limit is exceeded.
tags: [combat, ai, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b4fb29c7
system_scope: entity
---

# Shadowhand

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowhand.lua` defines a prefab component system for the Shadowhand creature, a temporary entity that moves toward a designated fire source to extinguish it. It integrates with multiple components: `locomotor` for movement, `sanityaura` to affect nearby player sanity, `playerprox` to detect player presence (triggering retreat/regroup behavior), and `knownlocations` to track the initial position (for distance-based dissipation). The component also manages a linked `shadowhand_arm` child entity for visual and action targeting. It is non-persistent and removed automatically when its task completes or conditions change.

## Usage example
```lua
local hand = SpawnPrefab("shadowhand")
hand.Transform:SetPosition(somewhere)
hand:SetTargetFire(target_fire, ACTIONS.EXTINGUISH)
```

## Dependencies & tags
**Components used:** `locomotor`, `sanityaura`, `playerprox`, `knownlocations`, `stretcher` (on `shadowhand_arm`), `highlightchild` (on `shadowhand_arm`), `soundemitter`, `animstate`, `transform`, `network`, `lightwatcher`.  
**Tags:** Adds `shadowhand`, `ignorewalkableplatforms` to the main entity; adds `NOCLICK`, `FX` to the arm.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fire` | `GObj?` | `nil` | Reference to the fire target (e.g., torch, campfire). |
| `arm` | `GObj?` | `nil` | The child arm prefab instance. |
| `task` | `Task?` | `nil` | Current delayed task (e.g., movement triggers, delay before action). |
| `dissipating` | `boolean?` | `nil` | Whether the hand is currently dissipating (prevents re-triggering). |
| `overrideaction` | `Action?` | `nil` | Override action (e.g., `ACTIONS.EXTINGUISH` or `ACTIONS.TURNOFF`). |
| `dissipatefn` | `function?` | `nil` | Cached function used for event listeners related to fire removal. |

## Main functions
### `SetTargetFire(fire, overrideaction)`
*   **Description:** Assigns a target fire and initializes the shadowhand's behavior. Spawns the arm, registers position tracking, player proximity listeners, and fire-related event callbacks. Begins the creeping movement loop.
*   **Parameters:** `fire` (`GObj?`) — the fire entity to extinguish; `overrideaction` (`Action?`) — custom action to use (e.g., `ACTIONS.EXTINGUISH` or `ACTIONS.TURNOFF`).
*   **Returns:** Nothing.
*   **Error states:** No effect if `fire == nil`, `inst.fire` is already set, or `inst.dissipating` is `true`.

### `ConsumeFire(inst, fire)`
*   **Description:** Initiates the consumption sequence after the arm reaches and selects the fire. Schedules a delayed retraction and plays animations.
*   **Parameters:** `inst` (`GObj`) — the shadowhand instance; `fire` (`GObj?`) — the fire entity (if `nil`, no action is taken).
*   **Returns:** Nothing.

### `Dissipate(inst)`
*   **Description:** Immediately terminates all behavior, kills sounds, stops movement, removes the `playerprox` component, cancels tasks, and schedules the entity for removal once animations complete.
*   **Parameters:** `inst` (`GObj`) — the shadowhand instance.
*   **Returns:** Nothing.

### `Retreat(inst)`
*   **Description:** Triggers retreat animation and movement back to the arm when a player enters the near zone.
*   **Parameters:** `inst` (`GObj`) — the shadowhand instance.
*   **Returns:** Nothing.

### `Regroup(inst)`
*   **Description:** Returns the shadowhand to idle posture and restarts creeping behavior after a player moves out of the near zone.
*   **Parameters:** `inst` (`GObj`) — the shadowhand instance.
*   **Returns:** Nothing.

### `FireDistanceTest(inst)`
*   **Description:** Periodically checks if the target fire has moved too far from the shadowhand's origin point (based on `MAX_ARM_DISTANCE_SQ`). If so, triggers `Dissipate`.
*   **Parameters:** `inst` (`GObj`) — the shadowhand instance.
*   **Returns:** Nothing.

### `HandleAction(inst, data)`
*   **Description:** Callback when the shadowhand's arm completes an action. Triggers `ConsumeFire` for extinguish/turnoff actions or `Dissipate` for `GOHOME`.
*   **Parameters:** `inst` (`GObj`) — the shadowhand instance; `data` (`table`) — event data containing `action` with `action`, `target`, and `arrive` fields.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `enterlight` (on arm), `onextinguish` (on fire), `machineturnedoff` (on fire, conditional), `onremove` (on fire), `startaction` (on hand), `animover` (for removal after animations), `startday` (world state).
- **Pushes:** None (no events are directly pushed by this component).