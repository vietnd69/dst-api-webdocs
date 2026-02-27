---
id: boatrace_spectator_dragonlingbrain
title: Boatrace Spectator Dragonlingbrain
description: Implements AI behavior for a spectator dragonling during the boat race event, making it follow and face the boat race indicator entity.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 3d5713c5
---

# Boatrace Spectator Dragonlingbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the behavior tree for a spectator dragonling entity during the Boat Race event. Its primary responsibility is to make the dragonling follow and face the "indicator" entity (the moving boat or race marker) while avoiding interfering with flight-related states. It inherits from `Brain` and constructs a priority-based behavior tree that executes `Follow` and `FaceEntity` actions concurrently, using tunable distance parameters. The component relies on the `EntityTracker` component to locate the indicator entity by name.

## Dependencies & Tags
- **Components used:**
  - `entitytracker`: Used to retrieve the "indicator" entity via `GetEntity`.
  - `behaviours/follow`: Provides the `Follow` behavior function.
  - `behaviours/wander`: Listed in file require but not used in this brain.
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (inherited) | The entity instance the brain is attached to. |
| `UPDATE_RATE` | `number` | `0.25` | Time interval (in seconds) between behavior tree updates. |

## Main Functions

### `BoatraceSpectatorDragonlingBrain:OnStart()`
* **Description:** Initializes the behavior tree for the dragonling. Sets up a priority node that blocks behavior updates while the entity is flying (`flight` state tag), and otherwise runs two concurrent behaviors: `Follow` (to chase the indicator entity) and `FaceEntity` (to orient toward it). Called automatically when the state graph transitions to the brain's active state.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners
None.

## Implementation Notes
- The `SpectatingBoatrace` helper function uses `inst.components.entitytracker:GetEntity("indicator")` to resolve the target entity. If the "indicator" entity is not tracked, this will return `nil`, potentially causing the follow behavior to fail gracefully.
- The behavior tree uses `FailIfSuccessDecorator` with a `ConditionWaitNode` to suspend updates when the entity is in a flying state. This ensures the dragonling does not attempt to move or reorient while in flight.
- Distance parameters for `Follow` are sourced from `TUNING.BOATRACE_SPECTATOR_TARGET_DISTANCE`, `TUNING.BOATRACE_SPECTATOR_MAX_DISTANCE` (used twice — for start and max separation), and are expected to be defined in the game's tunable constants.