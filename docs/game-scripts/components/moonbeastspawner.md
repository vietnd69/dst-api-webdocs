---
id: moonbeastspawner
title: Moonbeastspawner
description: Manages periodic spawning and morphing of moon-based creatures (moonhounds and moonpigs) near a moonbase entity, and handles petrification of nearby ghouls.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 17233e4c
---

# Moonbeastspawner

## Overview
This component orchestrates the spawning and lifecycle management of moonbeasts (moonhounds and moonpigs) from a moonbase entity. It periodically scans the surrounding area for eligible entities (e.g., hounds, werepigs), converts them into moonbeasts via morphing, and spawns new moonbeasts at fixed intervals. It also manages the petrification of nearby ghouls/gargoyles when the moonbase is asleep.

## Dependencies & Tags
- **Components used:**
  - `health` (for dead/alive checks and killing)
  - `sleeper` (for sleeping state detection)
  - `freezable` (for frozen state detection)
  - `entitytracker` (to track moonbase association)
  - `workable` (for wall/skelly destruction during offscreen worker activity)
  - `spawnfader` (for fade-in animation on new spawns)
  - `brain` (for petrification command)
- **Tags used for filtering:**
  - `SPAWN_CANT_TAGS`: `"INLIMBO"`
  - `SPAWN_ONEOF_TAGS`: `"moonbeast"`, `"gargoyle"`, `"werepig"`, `"hound"` (commented in code but logically active)
  - `SPAWN_WALLS_ONEOF_TAGS`: `"wall"`, `"playerskeleton"`
  - `PETRIFY_MUST_TAGS`: `"moonbeast"`
  - `PETRIFY_CANT_TAGS`: `"INLIMBO"`
  - `GARGOYLE_TAGS`: `"gargoyle"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity (the moonbase). |
| `started` | `boolean` | `false` | Whether the spawner is actively running. |
| `range` | `number` | `30` | Maximum radius (in units) around the moonbase where entities can be morphed or spawned. |
| `period` | `number` | `3` | Interval in seconds between spawn/morph checks. |
| `maxspawns` | `number` | `6` | Maximum number of moonbeasts to maintain in the area. |
| `task` | `Task` | `nil` | Periodic task handle for recurring spawning logic. |
| `cc` | `table` | `nil` | Table tracking currently controlled/controlled creatures (for CC status like frozen/sleeping). |

## Main Functions

### `MoonBeastSpawner:OnRemoveFromEntity()`
* **Description:** Cleans up resources when the component is removed from its entity—specifically cancels the active periodic task if any.
* **Parameters:** None.

### `MoonBeastSpawner:ForcePetrify()`
* **Description:** Forces all moonbeasts within range to enter petrified state (via `brain:ForcePetrify()` and event `"moonpetrify"`), used when the moonbase goes to sleep.
* **Parameters:** None.

### `MoonBeastSpawner:Start()`
* **Description:** Activates the spawner by starting the periodic spawn task and reanimating any nearby gargoyle entities.
* **Parameters:** None.

### `MoonBeastSpawner:Stop()`
* **Description:** Deactivates the spawner by canceling the periodic task, clearing the `cc` table, and petrifying nearby moonbeasts if the moonbase is currently asleep.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"newstate"` on entities (via `v:ListenForEvent`) to resume morphing once they exit a "busy" state.
- **Triggers:**
  - `"detachchild"` on the source entity during morph.
  - `"moontransformed"` on the new moonbeast after transformation.
  - `"moonpetrify"` on sleeping moonbeasts during petrification.
  - `inst.components.workable:WorkedBy(v, 1)` indirectly triggers work events on walls/skeletons.