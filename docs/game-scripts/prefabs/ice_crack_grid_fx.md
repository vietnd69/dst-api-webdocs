---
id: ice_crack_grid_fx
title: Ice Crack Grid Fx
description: Renders a background visual effect of a cracked ice tile grid using an animated prefab.
tags: [environment, fx, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dc4df831
system_scope: fx
---

# Ice Crack Grid Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`ice_crack_grid_fx` is a visual effect (FX) prefab that displays an animated crack pattern on an ice tile grid. It uses a single animation bank (`gridplacer`) with randomly selected left/right crack animations. The entity is non-interactive, non-blocking, and persists only on the client side—removed immediately on the master simulation. This prefab is intended for decorative environmental rendering, typically used during ice-related events or terrain transitions.

## Usage example
This prefab is instantiated internally by the game engine and is not designed for direct modder instantiation. Example usage would be via map generation or event triggers that spawn the prefab at world coordinates.

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `NOCLICK`, `NOBLOCK`, `FX`, and `ice_crack_fx`.

## Properties
No public properties.

## Main functions
### `fn()`
* **Description:** Constructor function that creates and configures the entity. It sets up transform, animation state, and network components, assigns orientation and layer for background rendering, selects a random crack animation, and applies tags. It also ensures the entity does not persist on the master simulation.
* **Parameters:** None (called as a no-argument function).
* **Returns:** `inst` (Entity) — the fully constructed entity.
* **Error states:** Returns early on non-master clients (`TheWorld.ismastersim == false`) with a non-persistent instance.

## Events & listeners
None identified.