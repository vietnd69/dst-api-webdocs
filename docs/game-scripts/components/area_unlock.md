---
id: area_unlock
title: Area Unlock
description: Tracks and manages story unlock progression for map areas based on player exploration events.
tags: [map, progression, story]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 440db58a
system_scope: world
---

# Area Unlock

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AreaUnlock` is a client-side component that tracks which story-based map areas have been unlocked by the player. It listens for the `changearea` event—triggered when the player transitions between map areas—and updates internal state when a new story area is discovered. It does not modify gameplay mechanics directly but provides data for UI or logic systems that depend on progression status.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("area_unlock")
inst.components.area_unlock:RegisterStory("cave_01")
inst.components.area_unlock:RegisterStory("cave_02")
-- Later, when player enters a new area:
inst.components.area_unlock:CheckUnlock({ story = "cave_01" })
-- Get all unlocked stories:
local unlocked = inst.components.area_unlock:GetUnlocked()  -- e.g., {"cave_01"}
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stories` | table | `{}` | Dictionary mapping story names (string) to unlock status (boolean). `false` = locked, `true` = unlocked. |

## Main functions
### `CheckUnlock(area)`
*   **Description:** Checks whether the given area's story should be unlocked. If the story exists in `stories` and is currently locked (`false`), it marks the story as unlocked (`true`).
*   **Parameters:**  
  `area` (table) — a table containing at least a `story` key (string) identifying the story/area to check.
*   **Returns:** Nothing.
*   **Error states:** No-op if `area.story` does not exist in `self.stories` or if it is already unlocked.

### `RegisterStory(story)`
*   **Description:** Registers a new story identifier to be tracked, initializing its unlock state as locked (`false`).
*   **Parameters:**  
  `story` (string) — unique identifier for the story/area (e.g., `"cave_01"`, `"ruins"`).
*   **Returns:** Nothing.
*   **Error states:** Overwrites any existing entry if called multiple times with the same `story`.

### `GetUnlocked()`
*   **Description:** Returns a list of all story names that have been unlocked (`true`).
*   **Parameters:** None.
*   **Returns:**  
  `unlocked` (table of string) — an array of story identifiers that are unlocked. Empty if none are unlocked.
*   **Error states:** Returns an empty table if no stories are registered or none have been unlocked.

## Events & listeners
- **Listens to:** `changearea` — triggers `CheckUnlock(area)` with the new area data.
- **Pushes:** None identified
