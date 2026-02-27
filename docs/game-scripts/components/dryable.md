---
id: dryable
title: Dryable
description: Manages an entity's ability to be dried, defining its dried product and visual representation.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: ceb17ce1
---

# Dryable

## Overview
This component equips an entity with the functionality to be dried, typically on a drying rack. It allows specification of the resulting item (the `product`), the time required for drying (`drytime`), and defines the visual assets (build file) for both its undried and dried states. Entities with this component receive the "dryable" tag.

## Dependencies & Tags
*   This component adds the `dryable` tag to the entity upon initialization.
*   It removes the `dryable` tag when the component is removed from the entity.
*   None identified.

## Properties
| Property          | Type    | Default Value | Description                                                                                             |
| :---------------- | :------ | :------------ | :------------------------------------------------------------------------------------------------------ |
| `product`         | `string` | `nil`         | The prefab name of the item that will be created once this entity has fully dried.                      |
| `drytime`         | `number` | `nil`         | The duration, in seconds, required for the entity to complete its drying process.                       |
| `buildfile`       | `string` | `nil`         | The KLAX build file name (e.g., "meat_dry_build") used for the entity's visual appearance when undried. |
| `dried_buildfile` | `string` | `nil`         | The KLAX build file name used for the entity's visual appearance once it has dried. If not set, `buildfile` is used as a fallback. |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** This function is called automatically when the `dryable` component is removed from its parent entity. It ensures that the `dryable` tag is also removed from the entity.
*   **Parameters:** None

### `SetProduct(product)`
*   **Description:** Sets the prefab name of the item that results from drying.
*   **Parameters:**
    *   `product`: (`string`) The prefab name of the dried item.

### `SetDryTime(time)`
*   **Description:** Sets the time, in seconds, for the drying process to complete.
*   **Parameters:**
    *   `time`: (`number`) The drying duration in seconds.

### `SetBuildFile(buildfile)`
*   **Description:** Sets the KLAX build file used for the entity's appearance when it is in its undried state.
*   **Parameters:**
    *   `buildfile`: (`string`) The name of the KLAX build file.

### `SetDriedBuildFile(dried_buildfile)`
*   **Description:** Sets the KLAX build file used for the entity's appearance once it has dried.
*   **Parameters:**
    *   `dried_buildfile`: (`string`) The name of the KLAX build file for the dried state.

### `GetDriedBuildFile()`
*   **Description:** Retrieves the KLAX build file designated for the entity's dried state. If `dried_buildfile` was not explicitly set, it defaults to using the `buildfile`.
*   **Parameters:** None