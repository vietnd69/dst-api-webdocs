---
id: damagetyperesist
title: Damagetyperesist
description: This component manages damage resistance multipliers for an entity based on various damage type tags.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
---

# Damagetyperesist

## Overview
The `Damagetyperesist` component provides functionality for entities to define and apply resistance multipliers against specific types of damage. It allows for multiple sources to contribute to a single damage type's resistance and dynamically calculates the total resistance based on the attacker's or weapon's tags, ultimately modifying incoming damage.

## Dependencies & Tags
*   **Dependencies:**
    *   `util/sourcemodifierlist`
*   **Tags:**
    This component does not add or remove tags from the `inst` it is attached to. Instead, it defines and evaluates resistance based on string `tag` identifiers (e.g., "fire", "melee") which are then checked against the `attacker` or `weapon` entities using `attacker:HasTag(k)` or `weapon:HasTag(k)`.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | `N/A` | A reference to the entity this component is attached to. |
| `tags` | `table` | `{}` | A table where keys are damage type tags (strings) and values are `SourceModifierList` instances, each managing modifiers for that specific tag. |

## Main Functions
### `AddResist(tag, src, pct, key)`
*   **Description:** Adds or updates a damage resistance modifier for a specific `tag`. If a `SourceModifierList` for the given `tag` does not exist, it is created. The `pct` value represents a multiplier applied to damage (e.g., `0.5` for 50% resistance, `1.0` for no change, `1.5` for 50% vulnerability).
*   **Parameters:**
    *   `tag` (string): The string identifier for the damage type (e.g., "fire", "cold", "melee").
    *   `src` (any): The source object or identifier granting this specific resistance modifier (e.g., an item, an aura).
    *   `pct` (number): The resistance multiplier to apply for this source.
    *   `key` (any, optional): An optional key used to differentiate multiple modifiers from the same `src`.

### `RemoveResist(tag, src, key)`
*   **Description:** Removes a specific damage resistance modifier previously added with `AddResist`. If removing a modifier causes a `SourceModifierList` for a `tag` to become empty, that list is removed from the component's `tags` table.
*   **Parameters:**
    *   `tag` (string): The string identifier for the damage type from which to remove resistance.
    *   `src` (any): The source identifier used when `AddResist` was called.
    *   `key` (any, optional): The key that was optionally provided when `AddResist` was called.

### `GetResistForTag(tag)`
*   **Description:** Retrieves the combined resistance multiplier for a single, specified damage type `tag`. If no resistance is defined for the tag, it defaults to `1` (no change).
*   **Parameters:**
    *   `tag` (string): The string identifier for the damage type.

### `GetResist(attacker, weapon)`
*   **Description:** Calculates the total damage multiplier by iterating through all defined resistance tags within this component. For each resistance tag, it checks if the `attacker` or their `weapon` possesses that tag. If a match is found, the resistance multiplier for that tag is applied (multiplied) to the total.
*   **Parameters:**
    *   `attacker` (entity, optional): The attacking entity. Can be `nil`.
    *   `weapon` (entity, optional): The weapon entity used by the attacker. Can be `nil`.

### `GetDebugString()`
*   **Description:** Generates a formatted string intended for debugging, listing all active damage resistance tags and their combined resistance multipliers.
*   **Parameters:** None.