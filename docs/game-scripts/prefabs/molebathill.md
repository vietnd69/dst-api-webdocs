---
id: molebathill
title: Molebathill
description: A burrowing molebat habitat that drops random loot when dug up and awakens nearby sleeping bats.
tags: [loot, environment, bat, trigger]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e33ee827
system_scope: environment
---

# Molebathill

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`molebathill` is a static environmental prefab representing a molebat burrow mound. It functions as a loot source that can be excavated using the `DIG` action, at which point it drops randomized loot and alerts nearby sleeping bats. It is not a component itself but a complete prefab definition that attaches and configures several components (`lootdropper`, `workable`, `inspectable`, `hauntable`) to provide interactive gameplay behavior. The prefab is typically used as a background environmental element that supports world interaction and creature behavior.

## Usage example
```lua
-- Create a molebathill instance at position (0, 0, 0)
local inst = SpawnPrefab("molebathill")
inst.Transform:SetPosition(0, 0, 0)

-- Trigger excavation manually (e.g., in custom logic)
inst.components.workable:DoWork(inst, TheWorld.playeronlies[1])

-- The `dig_up` callback is invoked automatically by workable on finish,
-- which drops loot and wakes bats within range.
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`, `hauntable`, `animstate`, `transform`, `network`  
**Tags added:** `molebathill`, `NOCLICK` (when being sucked up during animation)  
**Tags checked:** `_combat`, `bat` (as must tags), `DECOR`, `FX`, `INLIMBO`, `noattack`, `notarget` (as cant tags)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `"idle"` | Animation used in scrapbook/character book previews. |
| `persists` | boolean | `true` | Controls whether the entity persists across world reloads; set to `false` during "sucked up" state. |

## Main functions
### `dig_up(inst, digger)`
*   **Description:** Called when the workable component finishes being dug. Drops loot via `lootdropper`, then finds and awakens nearby sleeping bats within `BAT_AGGRO_DISTANCE` (5 units), setting them to target the digger if valid. Removes the molebathill entity afterward.
*   **Parameters:**
    *   `inst` (entity) – The molebathill instance.
    *   `digger` (entity) – The entity that performed the digging action.
*   **Returns:** Nothing.
*   **Error states:** None; assumes bat components exist for waking/aggro logic.

### `on_sucked_up(inst)`
*   **Description:** Handles the `suckedup` event (e.g., from a vacuum). Disables further interaction, plays "suck" animation, and schedules entity removal upon animation completion.
*   **Parameters:** `inst` (entity) – The molebathill instance.
*   **Returns:** Nothing.

### `AdoptChild(inst, child)`
*   **Description:** Sets up tracking and home location memory for a child molebat entity when it occupies the burrow.
*   **Parameters:**
    *   `inst` (entity) – The molebathill instance.
    *   `child` (entity) – The child molebat entity to adopt.
*   **Returns:** Nothing.
*   **Calls:** `EntityTracker:TrackEntity("burrow", child)` and `KnownLocations:RememberLocation("home", ...)` on the child.

### `on_molebat_travelled_here(molebat)`
*   **Description:** Callback invoked when a molebat returns to this burrow. Causes the molebat to nap (enter sleep state).
*   **Parameters:** `molebat` (entity) – The returning molebat.
*   **Returns:** Nothing.
*   **Calls:** `molebat:Nap()`.

## Events & listeners
- **Listens to:** `suckedup` – triggers cleanup and removal when the burrow is sucked up.
- **Pushes:** None (does not fire custom events; relies on component events like `onwakeup` indirectly).