---
id: pumpkin_carving
title: Pumpkin Carving
description: Static map layout data for a pumpkin carving-themed level in Don't Starve Together.
tags: [map, level_design, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 2b0543cf
system_scope: world
---

# Pumpkin Carving

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout for a themed area (likely used in seasonal or event-based content) in Don't Starve Together. It is a JSON-compatible Tiled map representation (`orientation = "orthogonal"`) containing background tile layers and foreground object placements. It does not implement an ECS component — rather, it is a declarative map data structure used during world generation or level loading to position entities like `pumpkincarver`, `skeleton`, and `farm_plant_pumpkin` with specified properties.

## Usage example
This file is not intended for direct component usage in gameplay code. Instead, it is consumed by DST's map loading and world generation systems. A typical usage would occur internally when loading a specific level or scenario (e.g., for the "magic_pumpkin" scenario), where the engine parses this layout and spawns corresponding prefabs at the indicated coordinates.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file is a data-only module returning a table.

## Main functions
Not applicable — this file defines no functions; it returns static map data.

## Events & listeners
Not applicable — this file has no events or listeners.