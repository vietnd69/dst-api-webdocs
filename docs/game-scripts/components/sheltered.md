---
id: sheltered
title: Sheltered
description: Determines whether the entity (typically a player) is protected from rain and environmental exposure based on nearby sheltering structures or canopy coverage.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 85fad591
---

# Sheltered

## Overview
This component tracks whether the entity is *sheltered* (i.e., not exposed to rain or excessive heat) by evaluating its surroundings—specifically, checking for nearby entities tagged as `shelter` or, for players, for canopy trees. It manages internal state (`sheltered`, `presheltered`, and `sheltered_level`) and triggers relevant gameplay events and UI updates via replication.

## Dependencies & Tags
- **Tags used for detection:**
  - Must-have: `"shelter"`
  - Cannot-have (exclusions): `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`, `"stump"`, `"burnt"`
- **Component/replica interactions:**
  - `inst.replica.sheltered` (used to send RPCs: `StartSheltered()`/`StopSheltered()`)
  - `inst.components.rainimmunity` (checked in announce logic)
  - `inst.components.talker` (used to announce shelter entry, if conditions met)
  - `TheWorld.state.israining` (world rain state)
  - `GetLocalTemperature()` (temperature check for heat-based announcement condition)
- **Tuning values used:** `TUNING.WATERPROOFNESS_SMALLMED`, `TUNING.OVERHEAT_TEMP`, `TUNING.TOTAL_DAY_TIME`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stoptime` | `number?` | `GetTime()` at creation | Stores the time when sheltered detection is paused (e.g., when stopped); `nil` indicates active state. |
| `presheltered` | `boolean` | `false` | Tracks whether the entity has *entered* shelter but not yet fully registered (i.e., pre-transition). Used for one-time start-up logic. |
| `sheltered` | `boolean` | `false` | True when the entity is confirmed to be sheltered. |
| `announcecooldown` | `number` | `0` | Cooldown timer (in seconds) before the entity can speak the shelter announcement again. |
| `sheltered_level` | `number` | `1` | Shelter quality level: `1` = ground-level shelter (e.g., under a roof); `2` = under canopy trees. |
| `mounted` | `boolean` | `false` | Whether the entity is riding a mount; disables low-level shelter if true. |
| `waterproofness` | `number` | `TUNING.WATERPROOFNESS_SMALLMED` | Fixed value indicating inherent waterproofing (not updated during runtime). |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Called when the component is removed from its entity. Ensures sheltered state is cleanly cleared.
* **Parameters:** None.

### `Start()`
* **Description:** Initializes or resumes active shelter detection. Recalculates the announce cooldown based on previously stopped time and starts component updates.
* **Parameters:** None.

### `Stop()`
* **Description:** Pauses active shelter detection. Saves current time as `stoptime`, stops updates, and explicitly sets sheltered state to false.
* **Parameters:** None.

### `SetSheltered(issheltered, level)`
* **Description:** Updates the internal sheltered state and synchronizes with the network via replica. Handles transitions between sheltered and exposed states, triggers events, and optionally announces the change via speech (only once per full day if cooldown allows).
* **Parameters:**
  - `issheltered` (`boolean`): Whether the entity is currently sheltered.
  - `level` (`number`): Shelter quality level (typically `1` or `2`). If `level < 2` and `mounted` is true, forces `issheltered = false`.

### `OnUpdate(dt)`
* **Description:** Called every frame while the component is active. Re-evaluates shelter status by:
  1. Checking if the entity is under canopy trees (player-only, sets `level = 2`).
  2. If not, counting nearby entities with the `"shelter"` tag (and no exclusion tags) using `TheSim:CountEntities()`.
  Then calls `SetSheltered()` with the new status and level.
* **Parameters:**
  - `dt` (`number`): Delta time (seconds since last frame), used to decrement `announcecooldown`.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string indicating whether the component is started/stopped and its current sheltered/presheltered states.
* **Parameters:** None.

## Events & Listeners
- **Listens for:** None (component does not register event listeners directly).
- **Pushes events:**
  - `"sheltered"`: Triggered *once* when transition to sheltered state occurs (i.e., from `presheltered → sheltered`). Payload: `{ sheltered = true, level = self.sheltered_level }`.
  - Also sends RPC events via `inst.replica.sheltered:StartSheltered()` / `StopSheltered()`, though these are internal replication details.