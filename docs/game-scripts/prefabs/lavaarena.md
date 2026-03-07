---
id: lavaarena
title: Lavaarena
description: Sets up the Lava Arena world environment, including tile physics, lighting, ambient sound, and visual effects for the seasonal battle arena mode.
tags: [world, environment, audio, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6587a6eb
system_scope: world
---

# Lavaarena

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena` is the world prefab responsible for initializing the Lava Arena seasonal mode environment. It configures tile collision, sets up dynamic wave effects for lava visuals, applies custom ambient lighting and sound (including reverb), and registers the world with the arena’s event system. It is not a component but a world-creation script that defines the arena’s structure and runtime behavior.

## Usage example
This file is not used directly as a component; instead, it is invoked by the engine via `MakeWorld(...)`. Modders register Lava Arena as a world type and the engine instantiates it during world load. Custom usage is not intended.

```lua
-- Internal engine usage — modders should not instantiate directly.
return MakeWorld("lavaarena", prefabs, assets, common_postinit, master_postinit, { "lavaarena" }, {common_preinit = common_preinit, tile_physics_init = tile_physics_init})
```

## Dependencies & tags
**Components used:** `ambientlighting`, `lavaarenamobtracker`, `wave`, `ambientsound`, `colourcube`  
**Tags:** Adds tag `"lavaarena"` to the world instance.  
**Prefabs required:** 54 prefabs listed (including portals, mobs, stages, gear, and items).

## Properties
No public properties defined.

## Main functions
### `common_preinit(inst)`
* **Description:** Runs early during world initialization. Modifies ground tile definitions to override the default falloff tile with a Lava Arena-specific variant and sets the map layer sampling style.
* **Parameters:** `inst` (TheWorld) — the world entity.
* **Returns:** Nothing.

### `tile_physics_init(inst)`
* **Description:** Adds a custom tile collision set for land/ocean limits, making lava arena tiles impassable to non-player entities.
* **Parameters:** `inst` (TheWorld) — the world entity.
* **Returns:** Nothing.

### `common_postinit(inst)`
* **Description:** Runs after the world is fully created and populated. Initializes lighting, mob tracking, wave physics (client-side only), ambient sound with lava reverb, and colour cube overrides. Registers a listener for player activation to update Friends settings.
* **Parameters:** `inst` (TheWorld) — the world entity.
* **Returns:** Nothing.

### `master_postinit(inst)`
* **Description:** Delegates server-side initialization to a shared event data module for Lava Arena.
* **Parameters:** `inst` (TheWorld) — the world entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `playeractivated` — triggers `TheNet:UpdatePlayingWithFriends()` for the local player on the client.
- **Pushes:** `overrideambientlighting(Point)` — sets override ambient light color.
- **Pushes:** `overrideambientsound` — overrides tile sound type for lava arena surfaces.
- **Pushes:** `overridecolourcube` — applies custom colour grading for the arena.

(None of the main functions fire custom events beyond those listed.)
