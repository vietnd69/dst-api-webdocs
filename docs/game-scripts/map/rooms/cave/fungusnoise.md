---
id: fungusnoise
title: Fungusnoise
description: Defines procedural room templates for fungal cave environments, specifying spawn rules for mushtrees, mushrooms, flowers, and slurpers with distribution probabilities.
tags: [world, procedural_generation, map, cave, room]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 02f13c44
---

# Fungusnoise

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines two procedural room templates—`FungusNoiseForest` and `FungusNoiseMeadow`—used in cave world generation. These rooms add visual and ecological variation to fungal cave biomes by placing mushtrees, mushrooms, flowers, and rarely, slurpers, according to weighted distribution probabilities. The rooms are registered with `AddRoom`, part of the world generation system, and are not Entity Component System components. They specify tile type, colour overlay, tags, and internal entity distribution logic.

## Usage example
This file does not define a reusable component for direct instantiation; instead, it declares room templates consumed by the map generator. Modders may extend it by adding new rooms with custom `distributeprefabs` tables or adjust existing ones for balance tuning.

## Dependencies & tags
**Components used:** None (no component interactions).
**Tags:** `Hutch_Fishbowl` (applied to both room definitions, likely for gameplay or rendering restrictions such as visibility occlusion or special rules in specific levels).

## Properties
This file does not define a component class and thus contains no properties in the ECS sense. It defines room configuration objects passed to `AddRoom`.

## Main functions
This file does not define any functional methods. It calls `AddRoom` twice to register two room templates.

## Events & listeners
This file does not define any event listeners or event pushes.