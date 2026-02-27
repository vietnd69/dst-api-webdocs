---
id: birdattractor
title: Birdattractor
description: Provides a modifiable set of parameters to influence the attraction and spawning of birds near an entity.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: environment
source_hash: 6abbd345
---

# Birdattractor

## Overview
This component provides an entity with a set of modifiable parameters that influence bird spawning behavior in its vicinity. It uses a `SourceModifierList` to aggregate values for the maximum number of birds, and the minimum/maximum spawn delay. Other game systems can then read these calculated values to control how birds are spawned near the entity.

## Dependencies & Tags
None identified.

## Properties

| Property        | Type                | Default Value                                  | Description                                                                                                                              |
| --------------- | ------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `spawnmodifier` | `SourceModifierList` | `SourceModifierList(inst, 0, additive)` | A modifier list that aggregates changes to bird spawning parameters. It uses the keys "maxbirds", "mindelay", and "maxdelay" to calculate final values. |

## Main Functions
### `GetDebugString()`
* **Description:** Constructs a formatted string displaying the current calculated values for "maxbirds", "mindelay", and "maxdelay" from the `spawnmodifier` property. This is primarily used for debugging purposes.
* **Parameters:** This function takes no parameters.