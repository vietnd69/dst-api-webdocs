---
id: carnivaldecor
title: Carnivaldecor
description: Manages an entity's status and value as a carnival decoration, registering it with nearby rankers.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Carnivaldecor

## Overview
This component marks an entity as a piece of carnival decoration. Its primary responsibility is to find nearby entities with a `carnivaldecorranker` component and register itself with them, contributing to a local decoration score. It automatically handles deregistering itself when the entity is removed from the world.

## Dependencies & Tags
**Dependencies:**
*   This component's logic requires other entities in the world to have the `carnivaldecorranker` component to function correctly.

**Tags:**
*   Adds the `carnivaldecor` tag to the entity upon initialization.
*   Removes the `carnivaldecor` tag when the component is removed.

## Properties
| Property | Type   | Default Value | Description                                          |
| -------- | ------ | ------------- | ---------------------------------------------------- |
| `inst`   | Entity | `self.inst`   | A reference to the entity instance holding this component. |
| `value`  | number | `1`           | The decoration score this entity provides.           |

## Main Functions
### `GetDecorValue()`
*   **Description:** Returns the decoration value of this entity.
*   **Parameters:** None.

### `OnRemoveFromEntity()`
*   **Description:** A lifecycle hook called when the component is being removed from the entity. It removes the `carnivaldecor` tag and deregisters the entity from any nearby carnival decor rankers.
*   **Parameters:** None.

### `OnRemoveEntity()`
*   **Description:** A lifecycle hook called when the entity is being removed from the world. It deregisters the entity from any nearby carnival decor rankers to ensure the score is updated correctly.
*   **Parameters:** None.