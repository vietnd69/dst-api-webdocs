---
id: caveins
title: Caveins
description: Manages cave-in events triggered by sinkholes, including debris spawning, camera shake, and player warnings in the caves.
tags: [environment, cave, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: af60a26b
system_scope: environment
---

# Caveins

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Caveins` is a server-only component responsible for tracking and responding to sinkhole-induced cave-in events in the Caves. It listens for `secondary_sinkholesupdate` events to update internal tracking of affected player positions, triggers local miniquake effects, spawns debris, shakes cameras, and notifies players via speech when a cave-in is imminent. This component is strictly server-side (`TheWorld.ismastersim`), with no client-side presence.

The component interacts with the `talker` component to emit player-specific announcements and leverages `TheWorld:PushEvent("ms_miniquake", ...)` to initiate localized ground effects.

## Usage example
This component is not manually added by modders — it is instantiated internally when a cave-in capable entity (e.g., Antlion Sinkhole manager) is created. Example usage is not applicable for modding.

## Dependencies & tags
**Components used:** `talker` (via `player.components.talker:Say(...)`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance to which this component is attached. |

**Private state (not exposed publicly):**
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_targets` | `table` | `{}` | Tracks active sinkhole targets by player `userhash`. Each entry contains `player`, `pos`, `warncd`, and `warned` fields. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Called each frame while there are active targets. Updates target positions for tracking players and decrements warning cooldowns.
*   **Parameters:** `dt` (number) — Delta time since last frame.
*   **Returns:** Nothing.
*   **Error states:** None. Silently skips invalid players.

### `OnSave()`
*   **Description:** Serializes active target positions for world save. Includes only the `(x, z)` coordinates of each target.
*   **Parameters:** None.
*   **Returns:** `nil` or `{ targets = { { x = number, z = number }, ... } }`.

### `OnLoad(data)`
*   **Description:** Restores cave-in state after world load. Fires immediate miniquake effects for each saved target position.
*   **Parameters:** `data` (table) — Save data containing `data.targets`.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a multi-line string listing all active targets and their positions for debugging.
*   **Parameters:** None.
*   **Returns:** `string?` — Debug output like `"[PlayerGabe] @(10.20,-5.70)"` or `nil` if no targets.

## Events & listeners
- **Listens to:** `secondary_sinkholesupdate` — Fired by the sinkhole system to deliver updated target player data (hash-based).
- **Pushes:** None. Relies on external systems (`ms_miniquake` via `TheWorld`) for effects.

> **Note:** All logic is executed on the master server (`ismastersim == true`). This component is not present on clients.
