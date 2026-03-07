---
id: cave_network
title: Cave Network
description: Represents the cave world's networked entity and initializes world-specific components for caves gameplay.
tags: [world, caves, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 42991523
system_scope: world
---

# Cave Network

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`cave_network` is a prefab wrapper that creates and configures the cave world's networked entity. It extends `world_network` (via `MakeWorldNetwork`) and augments it with components essential to cave gameplay: `caveweather`, `quaker`, `nightmareclock`, `vault_floor_helper`, and `fumarolelocaltemperature`. It also adjusts the global world temperature via `worldtemperature:SetTemperatureMod` to reflect the caves' distinct thermal environment.

## Usage example
This prefab is automatically instantiated by the game world generation system during cave world setup and should not be manually created by modders. Its configuration is finalized via the `custom_postinit` hook provided during construction.

## Dependencies & tags
**Components used:** `caveweather`, `quaker`, `nightmareclock`, `vault_floor_helper`, `fumarolelocaltemperature`, `worldtemperature`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
This file is a prefab factory call, not a component class, and contains no exposed functions beyond the internal `custom_postinit` hook.

## Events & listeners
None identified.
