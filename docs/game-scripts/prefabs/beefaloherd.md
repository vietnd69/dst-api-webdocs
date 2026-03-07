---
id: beefaloherd
title: Beefaloherd
description: Manages a herd of beefalo, handling seasonal mating behavior, member aggregation, and automatic spawning of baby beefalo during mating season.
tags: [herd, ai, seasonal, spawning, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e989e761
system_scope: world
---

# Beefaloherd

> Based on game build **714004** | Last updated: 2026-03-04

## Overview
`beefaloherd` is a prefab script that creates an invisible, non-interactive entity serving as the administrative center for a group of beefalo. It coordinates seasonal mating behavior via the `mood` component, manages herd membership via the `herd` component, and handles periodic spawning of baby beefalo using the `periodicspawner` component during spring. It does not have a visual representation and exists solely to orchestrate herd dynamics.

## Usage example
This prefab is not added directly via `inst:AddComponent()` in typical modding workflows. Instead, it is spawned as a standalone entity using `SpawnPrefabs("beefaloherd")` or similar world generation systems. The component interactions occur internally within the entity defined by this script.

## Dependencies & tags
**Components used:** `herd`, `mood`, `periodicspawner`, `domesticatable`, `rideable`  
**Tags added by prefab instance:** `herd`, `NOBLOCK`, `NOCLICK`  
**Tags set for herd members:** `beefalo` or `beefalo_migratory`, depending on the `"migratory"` tag on the herd instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `migratory` | boolean (via tag) | `false` | Controls whether herd members are tagged as `beefalo_migratory` (`true`) or `beefalo` (`false`). |

## Main functions
### `spawncarrat(inst, phase)`
*   **Description:** During nighttime (`phase == "night"`), randomly assigns the `"HasCarrat"` tag to one non-baby beefalo in the herd, if no member currently has it and a random chance is met (33%).
*   **Parameters:**
    *   `inst` (Entity) - The herd entity.
    *   `phase` (string) - The current world phase (`"day"` or `"night"`).
*   **Returns:** Nothing.

### `InMood(inst)`
*   **Description:** Called when the herd enters its mating season (spring). Starts the periodic spawner and notifies all herd members by pushing the `"entermood"` event.
*   **Parameters:**
    *   `inst` (Entity) - The herd entity.
*   **Returns:** Nothing.

### `LeaveMood(inst)`
*   **Description:** Called when the mating season ends. Stops the periodic spawner, notifies all herd members with the `"leavemood"` event, and triggers a mood check for potential re-entry.
*   **Parameters:**
    *   `inst` (Entity) - The herd entity.
*   **Returns:** Nothing.

### `AddMember(inst, member)`
*   **Description:** Called when a new member joins the herd. Pushes the appropriate `"entermood"` or `"leavemood"` event to the new member depending on the current mood state.
*   **Parameters:**
    *   `inst` (Entity) - The herd entity.
    *   `member` (Entity) - The newly added beefalo member.
*   **Returns:** Nothing.

### `SpawnableParent(inst)`
*   **Description:** Scans herd members to find one that is eligible to serve as a spawning parent. A member must be *not* domesticated *and* *not* currently being ridden, unless domesticated (domesticated ones are always eligible).
*   **Parameters:**
    *   `inst` (Entity) - The herd entity.
*   **Returns:** `Entity` or `nil` — the first eligible member, or `nil` if none are found.

### `CanSpawn(inst)`
*   **Description:** Evaluates whether the herd can spawn a new baby. Checks if the herd is not full, if a valid parent exists, and if the number of herd members in range is below `TUNING.BEEFALOHERD_MAX_IN_RANGE`.
*   **Parameters:**
    *   `inst` (Entity) - The herd entity.
*   **Returns:** `boolean` — `true` if spawning is allowed, `false` otherwise.

### `OnSpawned(inst, newent)`
*   **Description:** Callback invoked when a baby beefalo is spawned. Adds the baby to the herd membership and positions it at the location of a valid spawning parent.
*   **Parameters:**
    *   `inst` (Entity) - The herd entity.
    *   `newent` (Entity) - The newly spawned baby beefalo instance.
*   **Returns:** Nothing.

### `OnInit(inst)`
*   **Description:** Runs after initialization to validate the mood state (e.g., if the world season has already changed before the component initialized).
*   **Parameters:**
    *   `inst` (Entity) - The herd entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"phasechanged"` — *only* during Year of the Creature (YOTC) event; triggers `spawncarrat` to manage carrat infection.
- **Pushes:**  
  - `"entermood"` — pushed to each herd member when the herd enters mating season.  
  - `"leavemood"` — pushed to each herd member when mating season ends or when a new member joins during off-season.

Note: All push events originate from `InMood`, `LeaveMood`, and `AddMember` internal callback functions, not directly from the herd entity itself via `PushEvent`.