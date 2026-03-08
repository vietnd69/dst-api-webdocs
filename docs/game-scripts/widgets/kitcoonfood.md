---
id: kitcoonfood
title: Kitcoonfood
description: A UI widget representing a clickable food bag for the Kitcoon pet, which initiates feeding actions when interacted with.
tags: [ui, pet, interaction]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 26ae6cb1
system_scope: ui
---

# Kitcoonfood

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Kitcoonfood` is a UI widget that provides an interactive visual representation of the Kitcoon's food supply. It displays a floating animation of the food item and responds to user input (typically Accept control or click) to queue and execute feeding actions via the associated `kit` object. It extends the base `Widget` class and integrates with DST's UI animation and sound systems.

## Usage example
```lua
local kitcoonfood = KitcoonFood(kit)
-- The widget is typically added as a child to another UI container
parent:AddChild(kitcoonfood)
-- Interaction happens automatically upon user input; no manual method calls required
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `kit` | object | — | Reference to the Kitcoon component or object that owns this food bag; provides `TryQueueEat()`, `Eat()` methods. |
| `anim` | UIAnim | — | Child widget that displays the animated food asset. |
| `animstate` | AnimState | — | Controls animation state (bank, build, playback, effects) for the food animation. |
| `onclick` | function | — | Callback triggered on user acceptance input to attempt feeding. |

## Main functions
### `OnGainFocus()`
*   **Description:** Handles focus gain events, delegating to the base widget class. Typically called when the UI receives focus (e.g., menu activation).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles control input events. Checks for the `CONTROL_ACCEPT` input (e.g., Enter, A button) when the key is released (`down == false`) and triggers the feeding action.
*   **Parameters:**  
    `control` (string) — The control identifier (e.g., `"ACCEPT"`).  
    `down` (boolean) — Whether the control key is currently pressed (`true`) or released (`false`).
*   **Returns:** `true` if the base widget handled the control, otherwise proceeds to check `CONTROL_ACCEPT`.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls found).  
- **Pushes:** None (no `inst:PushEvent` calls found).