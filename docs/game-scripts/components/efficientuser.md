---
id: efficientuser
title: Efficientuser
description: This component manages and applies efficiency multipliers to specific actions, allowing different game mechanics to modify action costs or effects.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: b479acab
---

# Efficientuser

## Overview
The `Efficientuser` component provides a flexible system for applying multiplicative modifiers (often representing efficiency bonuses or penalties) to various actions performed by an entity. It allows multiple game mechanics (sources) to contribute different multipliers to the same action, with the component automatically combining them into a single effective multiplier. This is useful for systems like crafting speed, resource gathering yield, or action costs that can be modified by buffs, equipment, or environmental factors.

## Dependencies & Tags
This component relies on `util/sourcemodifierlist.lua` to manage multiple modifiers from different sources for each action.
None identified.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | `nil` | A reference to the entity that this component is attached to. |
| `actions` | `table` | `{}` | A table mapping action names (strings) to `SourceModifierList` instances, each managing multipliers for a specific action. |

## Main Functions
### `GetMultiplier(action)`
*   **Description:** Retrieves the combined effective multiplier for a specified action. If no multipliers are set for the action, it returns a default value of `1`.
*   **Parameters:**
    *   `action` (`string`): The name of the action for which to get the multiplier.

### `AddMultiplier(action, multiplier, source)`
*   **Description:** Adds or updates a multiplier for a specific action, originating from a designated source. If an entry for the action does not yet exist, it will be created. This allows different game elements (e.g., a specific tool, a character buff) to independently contribute to an action's efficiency.
*   **Parameters:**
    *   `action` (`string`): The name of the action to modify.
    *   `multiplier` (`number`): The multiplier value to apply (e.g., `0.5` for 50% efficiency, `1.2` for 120% efficiency).
    *   `source` (`any`): An identifier for the source applying the multiplier (e.g., an `Entity` reference, a `string` name for a buff).

### `RemoveMultiplier(action, source)`
*   **Description:** Removes a specific multiplier from a given source for a particular action. If the action or source does not have an active multiplier, nothing happens.
*   **Parameters:**
    *   `action` (`string`): The name of the action from which to remove the multiplier.
    *   `source` (`any`): The identifier for the source whose multiplier should be removed.