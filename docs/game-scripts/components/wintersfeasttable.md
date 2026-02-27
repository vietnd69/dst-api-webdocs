---
id: wintersfeasttable
title: Wintersfeasttable
description: This component manages the festive dining functionality of the Wintersfeast Table, tracking whether it is ready for feasting, handling active feasters, and managing food depletion logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: e75d21c0
---

# Wintersfeasttable

## Overview
This component provides the core logic for the Wintersfeast Table entity, enabling or disabling its readiness for feasting (via the `"readyforfeast"` tag), tracking players currently feasting (`current_feasters`), and handling food consumption events (depletion and exhaustion). It integrates with the entity’s inventory to access the food item placed on it.

## Dependencies & Tags
- Adds the `"wintersfeasttable"` tag on construction.
- Adds/removes the `"readyforfeast"` tag dynamically based on the `canfeast` state.
- Relies on the entity having an `inventory` component to access the food item in slot 1.
- Relies on the food item having a `finiteuses` component for usage tracking.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set via constructor) | Reference to the entity this component is attached to. |
| `current_feasters` | `table (set)` | `{}` | Map of player entities currently feasting at the table; keys are entity references. |
| `canfeast` | `boolean` | `false` | Whether the table is currently enabled for feasting (controls the `"readyforfeast"` tag). |
| `ondepletefoodfn` | `function` | `nil` | Optional callback triggered when food is consumed *but not yet exhausted*. |
| `onfinishfoodfn` | `function` | `nil` | Optional callback triggered when food is fully exhausted. |

*Note:* The commented-out `feaster` property is no longer active.

## Main Functions

### `GetDebugString()`
* **Description:** Returns a debug-friendly string summarizing the current state of the table, including a placeholder for the feaster (deprecated), the item on the shelf, and remaining uses of that item.
* **Parameters:** None.

### `OnRemoveFromEntity()`
* **Description:** Cleans up the component upon removal: disables feasting, and removes the `"wintersfeasttable"` tag from the entity.
* **Parameters:** None.

### `CancelFeasting()`
* **Description:** Immediately ends all ongoing feasting sessions by sending `"feastinterrupted"` events to all tracked feasters and clearing the `current_feasters` list.
* **Parameters:** None.

### `DepleteFood(feasters)`
* **Description:** Consumes one use of the food item currently on the table (from inventory slot 1). Triggers either `ondepletefoodfn` (if uses remain) or `onfinishfoodfn` (if exhausted). Note: The `feasters` argument is unused in the implementation.
* **Parameters:**  
  `feasters` — Present in signature but ignored.

## Events & Listeners
- Listens to the `canfeast` setter: triggers `oncanfeast(self)` when the `canfeast` property is assigned, which manages the `"readyforfeast"` tag and calls `CancelFeasting()` when `canfeast` becomes `false`.
- Does *not* actively listen for external events (e.g., from players). Event dispatch is limited to `CancelFeasting()` pushing `"feastinterrupted"`.

*Note:* The commented-out `feaster` setter logic is no longer active; only `canfeast` is a live setter.