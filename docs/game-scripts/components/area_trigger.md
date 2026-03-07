---
id: area_trigger
title: Area Trigger
description: Applies runtime tuning overrides when the player enters specific story zones during world generation.
tags: [world, tuning, zone]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9266600b
system_scope: world
---

# Area Trigger

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AreaTrigger` is a client-side component that applies dynamic tuning overrides when the player entity enters designated story zones (areas) during world generation. It listens for the `"changearea"` event and executes custom tuning functions associated with the entered story. The component is typically attached to the player prefab to enable zone-specific rule adjustments without altering base tuning files.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("area_trigger")
inst.components.area_trigger:RegisterTriggers({
    ["deep_caves"] = {
        {"CAMERA_ZOOM_MAX", 2.5},
        {"CAMERA_ZOOM_MIN", 1.0},
    },
})
```

## Dependencies & tags
**Components used:** None directly accessed; relies on external `"tuning_override.lua"` via `require`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the entity that owns this component. |
| `stories` | table | `{}` | Maps story zone names (strings) to lists of tuning override pairs. |

## Main functions
### `RegisterTriggers(stories)`
* **Description:** Registers a mapping of story zone names to their respective tuning override instructions.
* **Parameters:** `stories` (table) — A dictionary where keys are story identifiers (e.g., `"deep_caves"`) and values are arrays of `{ tuning_key, value }` pairs.
* **Returns:** Nothing.
* **Error states:** No validation; expects valid keys from `tuning_override.lua`.

### `CheckTrigger(area)`
* **Description:** Evaluates whether the current area (passed via `"changearea"` event) has registered triggers and executes them.
* **Parameters:** `area` (table) — The area data containing at least a `story` string and optionally `story_depth`.
* **Returns:** Nothing.
* **Error states:** Silently skips if `area.story` or `area.story_depth` have no matching entry in `self.stories`.

### `DoOverride(overrides)`
* **Description:** Applies a list of tuning overrides by invoking the corresponding setter functions from `tuning_override.lua`.
* **Parameters:** `overrides` (table) — An array of `{ tuning_key, value }` pairs; each `tuning_key` must exist as a function in the loaded `tuning_override` module.
* **Returns:** Nothing.
* **Error states:** Skips silently if the `tuning_key` does not exist in `tuning_override`; does not validate value types.

## Events & listeners
- **Listens to:** `changearea` — Triggers `CheckTrigger` whenever the player enters a new area; provides the new area data as the second argument.
- **Pushes:** None.
