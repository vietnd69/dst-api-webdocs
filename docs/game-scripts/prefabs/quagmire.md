---
id: quagmire
title: Quagmire
description: Registers and configures the Quagmire game mode world, including prefabs, assets, recipes, and gameplay systems.
tags: [world, quagmire, crafting, network, events]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fc86cfed
system_scope: world
---

# Quagmire

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire.lua` is the world registration file for the Quagmire game mode. It defines all prefabs and assets required for the mode, initializes world-level components (e.g., ambient lighting, wave rendering, colour cube overrides), and sets up the custom recipe system (including trader recipes, classified prefabs, and stage-specific items). It extends the base `Map` component to add custom tile collision and registers the world with the recipe book system.

## Usage example
This file is loaded automatically by the game when the Quagmire world type is selected. It is not intended for manual instantiation.

## Dependencies & tags
**Components used:** `Map`, `ambientlighting`, `ambientsound`, `colourcube`, `WaveComponent`  
**Tags:** Adds `quagmire` tag via `MakeWorld` (not directly visible in code, inferred from `MakeWorld` call)

## Properties
No public properties.

## Main functions
### `common_preinit(inst)`
* **Description:** Runs during world pre-initialization before most prefabs are loaded. Registers the Quagmire-specific map extension (`quagmire_map`) and prepares tile physics.
* **Parameters:** `inst` (Entity) — the world entity instance.
* **Returns:** Nothing.

### `tile_physics_init(inst)`
* **Description:** Configures tile collision behavior for the Quagmire world, specifically setting up ocean/land limits for map navigation and pathfinding.
* **Parameters:** `inst` (Entity) — the world entity instance.
* **Returns:** Nothing.

### `common_postinit(inst)`
* **Description:** Runs after the world entity is created. Performs the following:
  - Adds and configures client-only components (`WaveComponent`, `AmbientSound`, `ColourCube`) when not on a dedicated server.
  - Registers world-specific ambient lighting override.
  - Unlocks and replaces the default recipe book with the Quagmire recipe set via `RemoveAllRecipes()` and `Recipe()` calls.
  - Registers all Quagmire-specific recipes across traders: Goat Mum, Goat Kid, Merm, Merm2, and Elder.
  - Subscribes to `playeractivated` to sync playing-with-friends status.
* **Parameters:** `inst` (Entity) — the world entity instance.
* **Returns:** Nothing.

### `master_postinit(inst)`
* **Description:** Delegates server-side (master) initialization to a shared event server handler.
* **Parameters:** `inst` (Entity) — the world entity instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `playeractivated` — triggers `TheNet:UpdatePlayingWithFriends()` on client when the local player activates.
- **Pushes:** `overrideambientlighting(Point)` — sets the world ambient light color.
- **Pushes:** `overridecolourcube(string)` — sets the active colour cube texture.
