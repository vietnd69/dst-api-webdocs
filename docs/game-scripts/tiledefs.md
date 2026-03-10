---
id: tiledefs
title: Tiledefs
description: Registers all game tile definitions—including land, ocean, impassable, and noise types—with associated visual, audio, and physical properties via the TileManager.
tags: [world, terrain, rendering, audio]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 29965568
system_scope: world
---

# Tiledefs

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file defines and registers every tile type used in Don't Starve Together's world generation, including land, ocean, impassable, and noise tiles. It uses the `TileManager` module to associate each tile with a unique name, range category, ground metadata (e.g., `GROUND.IMPASSABLE`), and rendering/audio properties such as sound sets (`runsound`, `walksound`), color palettes, wave tinting, noise textures, and special flags (`hard`, `cannotbedug`, `nogroundoverlays`). Tile definitions are applied in render order and are partitioned into four logical ranges: `LAND`, `NOISE`, `OCEAN`, and `IMPASSABLE`.

## Usage example
This file does not provide a public API for runtime use; it is a static configuration module that runs at startup to register tile definitions.

## Dependencies & tags
**Components used:** `tilemanager`
**Tags:** None identified.

## Properties
No public properties. The file defines only module-level constants and performs configuration-time registrations.

## Main functions
No standalone public functions. All functionality is delegated to `TileManager.AddTile(...)` and `TileManager.RegisterTileRange(...)` calls.

## Events & listeners
Not applicable.