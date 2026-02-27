---
id: toggleableitem
title: Toggleableitem
description: Provides a basic toggle state and callback mechanism for items that can be turned on or off.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 967dd1e3
---

# Toggleableitem

## Overview
This component implements a simple on/off toggle state for an entity—typically used for handheld items like lanterns or tools—and optionally invokes a user-defined callback function when the state changes.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity the component is attached to. |
| `onusefn` | `function?` | `nil` | Optional callback function invoked when the item is toggled; signature: `function(inst, is_on)`. |
| `onstopusefn` | `function?` | `nil` | Reserved placeholder; not initialized or used in the current implementation. |
| `on` | `boolean` | `false` | Current toggle state (`true` = on, `false` = off). |
| `stopuseevents` | `table?` | `nil` | Reserved placeholder; not initialized or used in the current implementation. |

## Main Functions

### `SetOnToggleFn(fn)`
* **Description:** Assigns a callback function to be executed whenever `ToggleItem()` is called. The callback receives the entity instance and the new toggle state.
* **Parameters:**  
  - `fn` (`function?`): A function to call on toggle, with signature `function(inst, is_on)`.

### `CanInteract(doer)`
* **Description:** Determines whether the given entity (`doer`) can interact with this item. Currently always returns `true`, indicating unrestricted access.
* **Parameters:**  
  - `doer` (`Entity`): The entity attempting interaction.

### `ToggleItem()`
* **Description:** Inverts the current toggle state (`on`), and if `onusefn` is set, invokes it with the entity and new state as arguments.
* **Parameters:** None.

## Events & Listeners
None.