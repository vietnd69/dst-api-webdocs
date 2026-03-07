---
id: sheltered
title: Sheltered
description: Tracks whether an entity is under cover (e.g., from trees or structures) and manages shelter state transitions, including communication and networking.
tags: [weather, environment, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 85fad591
system_scope: environment
---

# Sheltered

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Sheltered` component monitors whether an entity is located under a sheltered environment (such as under a tree canopy or near a遮蔽结构) and maintains internal state (`presheltered`, `sheltered`) to track transitions. It integrates with the `rainimmunity` and `talker` components to trigger dialogue and weather-related behavior when sheltered status changes. This component is player-specific and updates its state periodically based on spatial entity counting or per-entity canopy tracking.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sheltered")

-- Manually set sheltered state for testing (typically handled by OnUpdate)
inst.components.sheltered:SetSheltered(true, 2)
```

## Dependencies & tags
**Components used:** `rainimmunity`, `talker`
**Tags:** Checks for `shelter` (must-have) and `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `stump`, `burnt` (prohibited) during entity-counting.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stoptime` | number? | `nil` | Timestamp when component was stopped (used to preserve cooldowns across pauses). |
| `presheltered` | boolean | `false` | Whether the entity *entered* a sheltered zone in the previous update. |
| `sheltered` | boolean | `false` | Whether the entity is currently *fully* sheltered. |
| `announcecooldown` | number | `0` | Timer (in seconds) preventing repeated shelter announcements. |
| `sheltered_level` | number | `1` | Shelter intensity level: `1` = partial (e.g., small trees), `2` = full (e.g., dense canopy). |
| `mounted` | boolean | `false` | Whether the entity is riding a mount; full shelter is disabled if true. |
| `waterproofness` | number | `TUNING.WATERPROOFNESS_SMALLMED` | Rain protection value used elsewhere (not modified by this component). |

## Main functions
### `SetSheltered(issheltered, level)`
*   **Description:** Updates the sheltered state and triggers events/network updates. Also announces shelter entry/exit via `talker:Say` under specific conditions (e.g., raining or overheating), respecting cooldown.
*   **Parameters:**  
  `issheltered` (boolean) – Whether the entity is sheltered.  
  `level` (number) – Shelter level (`1` = basic, `2` = dense canopy).  
*   **Returns:** Nothing.
*   **Error states:**  
  - If `mounted` is `true` and `level < 2`, `issheltered` is forced to `false`.  
  -Announcement is suppressed if `announcecooldown > 0`, or if `TheWorld.state.israining` is false and temperature is below overheating threshold.

### `Start()`
*   **Description:** Resumes component updates, recalculating remaining `announcecooldown` from paused time and starting periodic updates.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Stop()`
*   **Description:** Pauses component updates, freezing `stoptime` to preserve cooldowns across game pauses/stops, and clears shelter state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Runs periodically (when started) to re-evaluate shelter status based on world position or per-entity canopy data, then calls `SetSheltered`.
*   **Parameters:** `dt` (number) – Time delta since last update.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string for UI/logs showing component state and running status.
*   **Parameters:** None.
*   **Returns:** `string` – e.g., `"STARTED, sheltered: true, presheltered: true"`.

### `OnRemoveFromEntity()`
*   **Description:** Safely clears shelter state when the component is removed from the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (explicit event registration is not performed).
- **Pushes:** `sheltered` – Fired with payload `{ sheltered=true/false, level=number }` when `sheltered` transitions from `false` → `true` or `true` → `false`.
- **Replica sync:** Uses `self.inst.replica.sheltered:StartSheltered()` / `:StopSheltered()` to synchronize state across clients.
