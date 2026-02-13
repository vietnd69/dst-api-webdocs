---
id: area_trigger
title: Area Trigger
description: Applies configured tuning overrides when the world changes to specific story areas or depth values.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# area_trigger

## Overview
The `area_trigger` component provides a mechanism for an entity to dynamically adjust game tuning settings based on the current game area or "story" identifier. It listens for the global `"changearea"` event and, if configured, applies a set of predefined tuning overrides associated with the new area's story or its depth. This allows for context-sensitive modifications to game mechanics, such as altering spawn rates, damage multipliers, or other game parameters when players enter specific regions or progress through narrative stages.

## Dependencies & Tags
**Dependencies:**
*   Relies on the global event system for the `"changearea"` event to be pushed.
*   Requires the `tuning_override` Lua module to perform actual tuning adjustments.

**Tags:** None identified.

## Properties
| Property  | Type    | Default Value | Description                                                    |
| :-------- | :------ | :------------ | :------------------------------------------------------------- |
| `inst`    | `Entity` | (provided in ctor) | A reference to the entity this component is attached to.      |
| `stories` | `table` | `{}`          | A table mapping area story identifiers (strings for `area.story` or numbers for `area.story_depth`) to lists of tuning overrides. |

## Main Functions

### `AreaTrigger:DoOverride(overrides)`
*   **Description:** Applies a list of tuning overrides. It iterates through the provided `overrides` table, where each override is expected to be a table containing a key (corresponding to a function name in the `tuning_override` module) and a value (the argument for that function). It then calls the corresponding `tuning_override` function with the specified value.
*   **Parameters:**
    *   `overrides`: `table` - A list of override definitions. Each element should be a table `[key, value]` where `key` is a string matching a function name in the `tuning_override` module and `value` is the argument for that function.

### `AreaTrigger:CheckTrigger(area)`
*   **Description:** This function is invoked when the game area changes (typically via the `"changearea"` event). It inspects the provided `area` table for `story` and `story_depth` fields. If either of these matches a key registered in `self.stories`, the associated list of tuning overrides is passed to `AreaTrigger:DoOverride` to be applied.
*   **Parameters:**
    *   `area`: `table` - An object representing the new game area. Expected to contain a `story` (string) field and optionally a `story_depth` (number) field.

### `AreaTrigger:RegisterTriggers(stories)`
*   **Description:** Sets the internal table of story-based tuning overrides for this component. This is the primary method used to configure which specific area stories or story depths should trigger particular tuning adjustments. The component will then use this mapping when `"changearea"` events occur.
*   **Parameters:**
    *   `stories`: `table` - A table where keys are story identifiers (strings for `area.story` or numbers for `area.story_depth`) and values are tables of tuning override definitions (in the format expected by `AreaTrigger:DoOverride`).

## Events & Listeners
*   **Listens For:**
    *   `"changearea"`: This event is typically pushed when the player or game state transitions to a new distinct game area. When received, it triggers the component's `AreaTrigger:CheckTrigger` method, passing the new area's data.