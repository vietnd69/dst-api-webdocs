---
id: skeleton_lightfarmer
title: Skeleton Lightfarmer
description: Defines a static layout for a skeleton farmer decoration in the game world, containing background tiles and object placements.
tags: [environment, decoration, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 319e31f7
system_scope: environment
---

# Skeleton Lightfarmer

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a Tiled map data structure used as a static layout in Don't Starve Together. It specifies a 12×12 grid background layer with all-zero tile data (indicating empty space) and a foreground object group (`FG_OBJECTS`) containing decorative props including a skeleton, lantern, pitchfork, and several variants of cave flowers. These layouts are typically used to populate scenes with static scenery during world generation or event placement.

## Usage example
This file is not a moddable component and is not intended for direct instantiation or manipulation by mods. It is loaded by the engine as a static layout asset and applied during world generation (e.g., as part of room or event layouts). Modders should reference the `map` system and `static_layouts` folder structure for modifying or extending such layouts.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — this file is a pure data definition and does not implement an ECS component.

## Main functions
Not applicable — this is a data-only module returning a static Lua table conforming to the Tiled JSON-compatible format used internally.

## Events & listeners
Not applicable — no event handling is performed in this file.