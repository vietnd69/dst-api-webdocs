---
id: monkeyisland_retrofitsmall_02
title: Monkeyisland Retrofitsmall 02
description: Static map layout configuration for a monkey island area in DST, defining background tiles, objects, and structural elements via Tiled JSON.
tags: [map, static, environment, level, prefabs]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: f6063b54
system_scope: environment
---

# Monkeyisland Retrofitsmall 02

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static map layout definition in Tiled JSON format for a monkey island area in Don't Starve Together. It specifies background tile layers (e.g., ground textures) and multiple object groups containing interactive and decorative entities such as pirate boats, flag poles, cannons, dock elements, monkey structures, and portal debris. It does not implement a component in the ECS sense — rather, it is a data structure loaded by the world generation system to spawn entities and place visual geometry during world creation.

## Usage example
This file is not intended to be instantiated or used directly in mod code. It is consumed by DST's world generation loader when the monkey island map layout is required.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties are defined at the component level, as this file is not a component. It returns a plain Lua table conforming to the Tiled map format.

## Main functions
Not applicable.  

## Events & listeners
Not applicable.