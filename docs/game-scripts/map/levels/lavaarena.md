---
id: lavaarena
title: Lavaarena
description: Registers the Lava Arena game mode as a preset level with fixed world generation settings.
tags: [world, level, preset]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: b4997f06
system_scope: world
---

# Lavaarena

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines and registers the Lava Arena game mode using three registration functions: `AddLevel`, `AddWorldGenLevel`, and `AddSettingsPreset`. It associates the level with the `lavaarena` prefab (used for its layout), sets version and override constraints for world generation features, and provides localized UI strings for name and description. The component does not implement an ECS component; it is a worldgen-level configuration script.

## Usage example
This file is automatically loaded by the game during initialization and does not require manual instantiation. However, modders can reference its registration when building upon or overriding level presets:
```lua
-- Example: querying registered levels (not from this file)
local lavaarena_level = LEVELS.LAVAARENA
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties  

## Main functions
This file contains only top-level registration calls and no standalone functions.

## Events & listeners
No events or listeners defined.
