---
id: deathloothandler
title: Deathloothandler
description: This component stores and manages an entity's potential death loot and its associated level for persistence.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 4d253328
---

# Deathloothandler

## Overview
This component is responsible for storing and managing data related to an entity's potential loot drop upon death, along with an associated "level" value. It handles the persistence of this data through save and load operations, but does not directly execute the dropping of items. Its primary role is to hold the relevant information for other systems to utilize when an entity perishes.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `level` | `number` | `0` | An integer value often used to indicate the 'tier' or 'difficulty' associated with the entity's loot. |
| `loot` | `table` | `{}` | A list of prefab strings representing the items this entity might drop as loot. |

## Main Functions
### `StoreLoot(prefabs)`
*   **Description:** Adds a list of prefab strings to the component's internal loot table. These prefabs represent items that could potentially be dropped by the entity.
*   **Parameters:**
    *   `prefabs` (`table` of strings): A table containing prefab names to be added to the loot list.

### `GetLoot()`
*   **Description:** Returns the current list of prefab strings stored as this entity's potential loot.
*   **Parameters:** None.

### `SetLevel(num)`
*   **Description:** Sets the component's internal level value. This level can be used to categorize or scale the loot.
*   **Parameters:**
    *   `num` (`number`): The new level to set.

### `GetLevel()`
*   **Description:** Returns the current level value associated with the loot.
*   **Parameters:** None.

### `OnSave()`
*   **Description:** Prepares the component's data for saving. It returns a table containing the `level` and `loot` data only if the `level` is greater than 0, ensuring that the component's state is persisted only when it holds meaningful data. It also includes `add_component_if_missing` for proper loading.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Restores the component's `level` and `loot` data from saved game data. If `data` is nil or specific keys are missing, it defaults `level` to 0 and `loot` to an empty table.
*   **Parameters:**
    *   `data` (`table`): A table containing the saved `level` and `loot` values.