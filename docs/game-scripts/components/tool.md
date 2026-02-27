---
id: tool
title: Tool
description: Manages tool-specific behavior including action capabilities, effectiveness, and breakage notification when usage drops to zero.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 598d2919
---

# Tool

## Overview
The `Tool` component provides core tool functionality for entities in the Entity Component System. It enables an entity to declare which actions it can perform and with what effectiveness, manages a "tough work" capability, and automatically triggers a `"toolbroke"` event on its owner when its usage percentage reaches zero—unless the entity is rechargeable.

## Dependencies & Tags
- **Component Dependencies:** Relies on `inventoryitem` and optionally `rechargeable` being present on the same entity.
- **Tags Added:**
  - `"tool"`: Added unconditionally on construction.
  - `"ACTIONID_tool"`: Added per action type when `SetAction` is called (e.g., `"chop_tool"`).
- **Tags Removed:** All `"tool"` and `"ACTIONID_tool"` tags are removed when the component is removed from the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `actions` | `table` | `{}` | Maps action objects to their numeric effectiveness values (default: `1`). |
| `tough` | `boolean?` | `false` | Indicates whether the tool can perform tough work; controlled via `EnableToughWork` and queried via `CanDoToughWork`. |

*Note:* No explicit `_ctor` is defined beyond the `Class` wrapper. All properties are initialized directly in the constructor function.

## Main Functions

### `EnableToughWork(tough)`
* **Description:** Enables or disables the tool’s ability to perform tough work.
* **Parameters:**
  - `tough` (`boolean`): If `true`, the tool is marked as capable of tough work. If `false` or omitted, tough work is disabled.

### `CanDoToughWork()`
* **Description:** Returns whether the tool is currently enabled for tough work.
* **Returns:** `boolean` — `true` if `tough == true`, otherwise `false`.

### `GetEffectiveness(action)`
* **Description:** Retrieves the effectiveness value for a given action.
* **Parameters:**
  - `action` (`string` or `action object`): The action to query.
* **Returns:** `number` — Effectiveness value if the action is registered, otherwise `0`.

### `SetAction(action, effectiveness)`
* **Description:** Registers an action and its effectiveness with this tool, and adds the corresponding `_tool` tag.
* **Parameters:**
  - `action` (`string` or `action object`): The action to register; must be a valid entry in `TOOLACTIONS`.
  - `effectiveness` (`number?`): Optional effectiveness value (default: `1`).
* **Throws:** `assert` error if `action.id` is not a valid `TOOLACTIONS` key.

### `CanDoAction(action)`
* **Description:** Checks whether the tool supports a given action.
* **Parameters:**
  - `action` (`string` or `action object`): The action to check.
* **Returns:** `boolean` — `true` if the action is registered in `self.actions`, otherwise `false`.

### `OnRemoveFromEntity()`
* **Description:** Cleanup handler invoked when the component is removed from the entity. Removes all event listeners and tags associated with the tool.

## Events & Listeners
- **Listens to:**
  - `"percentusedchange"`: Triggers `PercentChanged` when the entity’s usage percentage changes.
- **Triggers:**
  - `"toolbroke"`: Pushed on the tool’s owner when usage reaches `0%`, provided the tool is not rechargeable and has an owner with an `inventoryitem` component.

*Note:* The `PercentChanged` function is a local event handler, not a method of the `Tool` class.