---
id: torch_pigking
title: Torch Pigking
description: Defines a static map layout used to place Torch Pig King related entities in the world, including the Pig King and three Pig Torches.
tags: [map, layout, boss, event]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 0f633225
system_scope: world
---
# Torch Pigking

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a Tiled map layout (`torch_pigking.lua`) used to configure the spatial arrangement of entities for the Torch Pig King encounter in DST. It contains a 32x32 tile background layer (`BG_TILES`) and an object group (`FG_OBJECTS`) that specifies where the `pigking` boss entity and three `pigtorch` entities are placed in the world using tile coordinates (scaled to 16x16 tiles). This is not a gameplay component but a static layout definition consumed by the world generation or event systems to instantiate the boss arena.

## Usage example
This layout is not directly instantiated in mod code. Instead, it is loaded and used internally by the world generation system, typically referenced in task sets or worldgen overrides to populate the boss arena during world creation or event initialization.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties defined — this file is a pure data structure (a Tiled JSON-like export), not a component.

## Main functions
No functional methods defined — this file returns a table literal with map configuration data.

## Events & listeners
Not applicable
