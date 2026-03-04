---
id: quagmire
title: Quagmire
description: Registers Quagmire as a custom game level preset with predefined world generation overrides and versioning.
tags: [world, level, preset, configuration]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: c4a0ca86
---

# Quagmire

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This script defines and registers the `QUAGMIRE` level preset for Don't Starve Together. It uses `AddLevel`, `AddWorldGenLevel`, and `AddSettingsPreset` to configure the Quagmire world type with specific gameplay overrides and metadata, including versioning, localization strings, and rule exclusions for certain world generation features (e.g., boons, touchstones, traps, POI, protected areas, disease delay, petrification, and wildfires). It does not define a traditional ECS component; instead, it serves as a world generation configuration manifest consumed by the level setup system.

## Usage example
This file is automatically loaded during game initialization to register the Quagmire level preset. It does not need manual instantiation. Modders may extend it by defining new overrides or presets for custom world types using the same `AddLevel`, `AddWorldGenLevel`, and `AddSettingsPreset` APIs.

## Dependencies & tags
**Components used:** None — this script does not interact with entity components.  
**Tags:** None — no tags are applied or checked.

## Properties
This file does not define any persistent properties or instance variables. All configuration is provided inline via function arguments.

## Main functions
### `AddLevel(level_type, config)`
* **Description:** Registers a basic level preset entry for Quagmire. Used for UI and internal level listing. Version 4 includes all overrides defined in the config.
* **Parameters:**
  * `level_type`: Enum `LEVELTYPE.QUAGMIRE` — identifies the level type.
  * `config`: Table — contains `id`, `name`, `desc`, `location`, `version`, `overrides`, and `background_node_range`.
* **Returns:** None — registers the preset internally.
* **Error states:** None documented. Misconfigurations (e.g., invalid `location`) may cause fallback to defaults or silent failure.

### `AddWorldGenLevel(level_type, config)`
* **Description:** Registers a world generation–specific level preset for Quagmire. Contains settings used during world tilemap and worldgen task generation. Version 4 includes a reduced set of overrides compared to `AddLevel`.
* **Parameters:**
  * `level_type`: Enum `LEVELTYPE.QUAGMIRE`.
  * `config`: Table — identical structure to `AddLevel`, but omits `disease_delay`, `petrification`, and `wildfires` overrides.
* **Returns:** None — registers the preset internally.
* **Error states:** None documented.

### `AddSettingsPreset(level_type, config)`
* **Description:** Registers a settings preset that can be selected directly from the world creation UI. Contains minimal overrides focused on Quagmire-specific gameplay (e.g., disabling disease delay, petrification, and wildfires). Version 1.
* **Parameters:**
  * `level_type`: Enum `LEVELTYPE.QUAGMIRE`.
  * `config`: Table — same structure, with overrides limited to `disease_delay`, `petrification`, and `wildfires`.
* **Returns:** None — registers the preset internally.
* **Error states:** None documented.

## Events & listeners
None — this file performs static registration at load time and does not define or interact with events.