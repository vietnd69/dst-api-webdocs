---
id: area_trigger
title: Area Trigger
description: Manages area-based trigger events that apply tuning overrides when players enter specific story zones.
tags: [world, events, tuning]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: 9266600b
system_scope: world
---

# Area Trigger

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`AreaTrigger` is a component that monitors area change events and applies tuning overrides when entities enter specific story zones or depth levels. It maintains a registry of story-based triggers and automatically executes override functions when the associated area conditions are met. This component is typically used in conjunction with world generation and story progression systems to dynamically adjust game tuning parameters based on player location.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("areatrigger")

local stories = {
    ["cave_story"] = {{"tuning_value", new_value}},
    ["depth_5"] = {{"difficulty_scale", 1.5}}
}

inst.components.areatrigger:RegisterTriggers(stories)
inst:PushEvent("changearea", {story = "cave_story"})
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance that owns this component. |
| `stories` | table | `{}` | Registry of story-based triggers mapping story names to override arrays. |

## Main functions
### `DoOverride(overrides)`
*   **Description:** Applies tuning overrides by iterating through the provided override array and executing the corresponding tuning functions from `tuning_override.lua`.
*   **Parameters:** `overrides` (table) - Array of override entries where each entry contains `[1]` as the tuning key name and `[2]` as the value to pass.
*   **Returns:** Nothing.
*   **Error states:** Skips overrides where the tuning key does not exist in `tuning_override.lua`.

### `CheckTrigger(area)`
*   **Description:** Checks if the current area or area depth has registered triggers and applies any matching overrides. Called automatically when a `changearea` event fires.
*   **Parameters:** `area` (table) - Area data table containing `story` and optionally `story_depth` fields.
*   **Returns:** Nothing.
*   **Error states:** Returns early if no matching story or story_depth triggers are registered.

### `RegisterTriggers(stories)`
*   **Description:** Registers a table of story-based triggers that will be checked when area change events occur.
*   **Parameters:** `stories` (table) - Table mapping story names or depth identifiers to arrays of override entries.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `changearea` - Triggers `CheckTrigger` when the area changes, passing the area data table.
- **Pushes:** None identified.