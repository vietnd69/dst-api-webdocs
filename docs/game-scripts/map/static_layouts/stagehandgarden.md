---
id: stagehandgarden
title: Stagehandgarden
description: A static map layout definition for the Stagehand Garden area, containing background tile data and placement metadata for in-world objects like the Stagehand and rose flowers.
tags: [map, static_layout, worldgen]
sidebar_position: 1
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 5d6cb8c5
system_scope: world
---
# Stagehandgarden

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition (`.lua` file in `map/static_layouts/`) that describes the layout of the Stagehand Garden area. It is not an ECS component, but rather a Tiled Map Editor export (JSON format via Lua syntax) that defines map geometry, tilesets, and object positions used during world generation. It specifies background tiles (`BG_TILES`) and foreground object placements (`FG_OBJECTS`) such as the `stagehand` entity and several `flower_rose` entities.

## Usage example
Static layouts like this one are not added directly to entities by modders. They are referenced by world generation tasksets (e.g., in `map/tasksets/`) to populate specific rooms or areas. Modders cannot instantiate or call methods on this file directly.

## Dependencies & tags
None identified.

## Properties
No public properties.

## Main functions
No public functions.

## Events & listeners
None identified.
