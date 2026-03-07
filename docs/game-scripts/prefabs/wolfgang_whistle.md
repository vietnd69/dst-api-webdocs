---
id: wolfgang_whistle
title: Wolfgang Whistle
description: A playable whistle item that triggers coaching behavior in Wolfgang when blown, with state-dependent announcements and interaction with the coach and mightiness components.
tags: [audio, item, coach]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b198269c
system_scope: inventory
---

# Wolfgang Whistle

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wolfgang_whistle` is a consumable item prefab used by Wolfgang to toggle his coaching state and issue localized announcements. When played, it evaluates Wolfgang’s current mightiness state (wimpy, normal, mighty) and coordinates with the `coach` and `mightiness` components to enable/disable coaching and speak appropriate announcements. It acts as a conduit between player behavior and coaching system triggers.

## Usage example
```lua
local whistle = Prefab("wolfgang_whistle", fn, assets)
-- The prefab is automatically instantiated and configured by the game's prefab system.
-- Typical use occurs when Wolfgang uses the item in his inventory:
-- The game calls the `OnPlayed` callback (defined in this file), which:
--   1. Checks Wolfgang's mightiness and coaching state
--   2. Enables or disables coaching via `coach:Enable()` / `coach:Disable()`
--   3. Plays an announcement after the whistle animation progresses sufficiently
```

## Dependencies & tags
**Components used:** `coach`, `mightiness`, `talker`, `tool`, `instrument`, `inventoryitem`, `inspectable`, `tradable`  
**Tags added:** `cattoy`, `whistle`, `coach_whistle`, `tool`

## Properties
No public properties — the component logic resides in global helper functions (`DoAnnounce`, `OnPlayed`) and the prefab `fn` constructor.

## Main functions
### `DoAnnounce(doer, str)`
*   **Description:** Safely triggers speech for `doer` using their talker component, if available.
*   **Parameters:**  
    - `doer` (Entity) — the entity attempting to speak.  
    - `str` (string) — localization key for the announcement message (e.g., `"ANNOUNCE_WOLFGANG_BEGIN_COACHING"`).  
*   **Returns:** Nothing.
*   **Error states:** Returns early if `doer.components.talker` is missing.

### `OnPlayed(inst, doer)`
*   **Description:** Callback invoked when the whistle is played (typically by Wolfgang). Evaluates current state and toggles coaching behavior or announces status-specific phrases.
*   **Parameters:**  
    - `inst` (Entity) — the whistle instance (unused in this function).  
    - `doer` (Entity) — the entity playing the whistle (expected to be Wolfgang with relevant components and tags).  
*   **Returns:** Nothing.
*   **Error states:** No-op if `doer` lacks `coach` or `mightiness` components, or lacks the `"wolfgang_coach"` tag.

## Events & listeners
- **Listens to:** None — uses direct function callbacks (`SetOnPlayedFn`) instead of event listeners.  
- **Pushes:** None — no custom events are fired by this prefab.