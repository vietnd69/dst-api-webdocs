---
id: damagetypebonus
title: Damagetypebonus
description: This component manages and applies bonus damage multipliers based on the tags of a target entity.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
source_hash: 312f5585
---

# Damagetypebonus

## Overview
The `Damagetypebonus` component allows an entity to apply multiplicative damage bonuses against targets that possess specific tags. It uses `SourceModifierList` internally to manage multiple sources of bonuses for each tag, ensuring they are correctly combined. This enables complex damage modification rules, such as a weapon dealing extra damage to "monster" type enemies.

## Dependencies & Tags
*   **Dependencies:** None identified.
*   **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | `nil` | The entity this component is attached to. |
| `tags` | `table` | `{}` | A table mapping damage type tags (string) to `SourceModifierList` instances, which manage the actual percentage bonuses for that tag. |

## Main Functions
### `AddBonus(tag, src, pct, key)`
*   **Description:** Adds or updates a damage bonus for a specific tag. If no bonus list exists for the given tag, one is created. The `SourceModifierList` ensures that multiple sources for the same bonus type are handled correctly.
*   **Parameters:**
    *   `tag` (string): The tag to which this bonus applies (e.g., "monster", "shadow").
    *   `src` (any): The source of the bonus (e.g., the item providing the bonus). Used by `SourceModifierList` for tracking.
    *   `pct` (number): The percentage bonus as a multiplier (e.g., 1.25 for +25% damage).
    *   `key` (any, optional): An optional key used by `SourceModifierList` to differentiate multiple modifiers from the same source.

### `RemoveBonus(tag, src, key)`
*   **Description:** Removes a previously added damage bonus. If removing the bonus leaves the `SourceModifierList` for that tag empty, the list itself is removed from the component.
*   **Parameters:**
    *   `tag` (string): The tag associated with the bonus to remove.
    *   `src` (any): The source that added the bonus.
    *   `key` (any, optional): The optional key used when the bonus was added.

### `GetBonus(target)`
*   **Description:** Calculates the total multiplicative damage bonus to be applied against a given `target` entity. It iterates through all configured bonus tags and checks if the target has that tag.
*   **Parameters:**
    *   `target` (`Entity`): The entity being targeted, whose tags will be checked against the component's configured bonuses.
*   **Returns:** `number` - The total damage multiplier. Returns `1` if no target is provided or if the target has no matching tags for any bonuses.

### `GetDebugString()`
*   **Description:** Generates a formatted string representing the current state of all damage bonuses, useful for debugging purposes.
*   **Parameters:** None.
*   **Returns:** `string` - A string containing each tag and its combined bonus multiplier, or `nil` if no bonuses are configured.