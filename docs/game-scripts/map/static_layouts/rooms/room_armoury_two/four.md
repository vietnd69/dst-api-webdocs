---
id: four
title: Four
description: Defines the static layout data for the Armory Two room's "four" variant, specifying tile configuration and object placements.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ffef0eac
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static map layout for a specific variant ("four") of the Armory Two room in Don't Starve Together. It specifies the background tile grid (`BG_TILES` layer), object placements (`FG_OBJECTS` layer), and metadata such as dimensions and tileset references. This is a data-only file used by the world generation system to procedurally construct gameplay rooms; it contains no Lua logic, components, or behavior code.

## Usage example
This file is not intended for direct usage by modders. It is automatically loaded and processed by the map generation system when the Armory Two room layout is selected. Typical workflow involves using Tiled to edit `.json` layouts and then converting them to Lua format for use in DST.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a plain data table conforming to the Tiled JSON export format (adapted to Lua syntax). All fields are static map configuration values, not component instance properties.

## Main functions
None identified.

## Events & listeners
None identified.