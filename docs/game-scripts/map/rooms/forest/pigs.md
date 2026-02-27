---
id: pigs
title: Pigs
description: Defines forest biome room templates for pig settlements, including pig houses, shrines, and villages, with randomized contents and conditional decor based on special events.
tags: [world, rooms, procedural, event]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: ecde8594
---

# Pigs

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This file defines seven distinct room templates for pig settlements in the forest biome. Each room (`PigTown`, `PigVillage`, `PigKingdom`, `PigCity`, `PigCamp`, `PigShrine`, and `Pondopolis`) specifies placement rules for static layouts (e.g., `PigTown`, `Farmplot`, `MaxPigShrine`) and dynamic prefabs (e.g., `pighouse`, `pond`, `mermhead`, `pumpkin_lantern`). Room placement is probabilistic and supports conditional content—most notably, `pumpkin_lantern` and `HalloweenPumpkins` are added only during the `HALLOWED_NIGHTS` event via `IsSpecialEventActive()`.

The rooms are registered using `AddRoom()` and contribute to the world generation system by populating the forest with pig-related structures and decor, influencing pig AI behavior and world aesthetics.

## Usage example

This file is not intended to be instantiated or used directly by modders. It defines room templates for internal use by the world generation system.

To reference these rooms in worldgen code (e.g., in `tasksets/forest.lua`), you may use their names as keys (e.g., `"PigTown"`, `"PigCity"`). Example of how such a room might be referenced in a taskset (not part of this file):

```lua
task = {
    name = "build_pig_village",
    rooms = { "PigVillage" },
    required = { "townhall" },
},
```

## Dependencies & tags

**Components used:** None identified.

**Tags:** `Town` (applied to all pig rooms except `PigShrine` and `Pondopolis`).

## Properties

No properties are defined in this file. The configuration is entirely declarative via `AddRoom()` calls.

## Main functions

This file does not define any functions. All configuration is done through top-level `AddRoom()` calls with inline tables.

## Events & listeners

This file does not define any event listeners or push any events.

---