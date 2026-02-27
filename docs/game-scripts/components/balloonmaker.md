---
id: balloonmaker
title: Balloonmaker
description: Enables an entity to spawn balloon prefabs at a specified location.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: 63d03a91
---

# Balloonmaker

## Overview
The Balloonmaker component provides a simple interface for an entity to create and spawn "balloon" prefabs into the game world at a specific set of coordinates.

## Dependencies & Tags
None identified.

## Properties

| Property | Type   | Default Value | Description                               |
|----------|--------|---------------|-------------------------------------------|
| `inst`   | `Entity` | `nil`           | A reference to the entity instance this component is attached to. |

## Main Functions
### `MakeBalloon(x, y, z)`
* **Description:** Spawns a new "balloon" prefab into the world and sets its position.
* **Parameters:**
    * `x` (number): The X-coordinate for the balloon's spawn location.
    * `y` (number): The Y-coordinate for the balloon's spawn location.
    * `z` (number): The Z-coordinate for the balloon's spawn location.