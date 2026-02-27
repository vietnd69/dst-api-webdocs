---
id: carnivalgamefeedable
title: Carnivalgamefeedable
description: Enables an entity to be a target for feeding interactions within the context of a carnival game.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: e77130db
---

# Carnivalgamefeedable

## Overview
This component allows an entity to be "fed" by a player as part of a carnival game. It manages the entity's feedable state by adding or removing a specific tag and provides a customizable callback function to define the outcome of the feeding action.

## Dependencies & Tags
**Tags**
*   `carnivalgame_canfeed`: Added to the entity when the component is `enabled`, marking it as a valid target for feeding. Removed when disabled.

## Properties

| Property | Type     | Default Value | Description                                                                                                      |
|----------|----------|---------------|------------------------------------------------------------------------------------------------------------------|
| `enabled`  | `boolean`  | `false`         | Controls whether the entity can be fed. When set to `true`, it adds the `carnivalgame_canfeed` tag.          |
| `OnFeed`   | `function` | `nil`           | A callback function executed when `DoFeed` is called. It defines the specific result of the feeding action. |

## Main Functions
### `DoFeed(doer, item)`
* **Description:** Executes the `OnFeed` callback function if it has been assigned. This function is typically called by an interactor to process the feeding event. It returns the result of the callback, or `false` if no callback is set.
* **Parameters:**
    *   `doer`: The entity performing the feeding action.
    *   `item`: The item being fed to the entity.