---
id: archive_worldgen
title: Archive Worldgen
description: This module initializes and adjusts entities for the Ancient Archive worldgen pass, specifically populating lockbox dispensers with predefined products in a cyclic order.
tags: [worldgen, archive, map, layout, item]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 622b02ab
---

# Archive Worldgen

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This module is a world-generation utility used to prepare entity data for the Ancient Archive level layout. It performs a single worldgen pass by populating lockbox dispensers with product assignments (`archive_resonator_item`, `refined_dust`, or `turfcraftingstation`) in round-robin order. It does not define an Entity Component System component — instead, it is a standalone procedural helper invoked during map initialization. The module is self-contained, with no runtime component dependencies or entity interactions beyond modifying entity `data` fields.

## Usage example

The module is used internally during world generation as follows:

```lua
-- Assuming 'entities' is a map of prefab name to entity definition tables,
-- and 'add_entity_fn' is a callback used to spawn entities:
local entities = SomeWorldGenPass(...)
entities = AncientArchivePass(entities, 16, 16, world, add_entity_fn)
```

The function `AncientArchivePass` modifies entity data in-place to assign product IDs.

## Dependencies & tags
**Components used:** None.  
**Tags:** None identified.

## Properties
No persistent state or properties are stored. This module uses only local module-level variables (`entities`, `WIDTH`, `HEIGHT`) that are overwritten on each call to `AncientArchiveInit`.

## Main functions

### `AncientArchiveInit(ents, map_width, map_height)`
* **Description:** Initializes module-level state with the entity map and map dimensions. Called at the start of `AncientArchivePass`.
* **Parameters:**
  * `ents` (`table`): A map of prefab names to lists of entity definitions (e.g., `{ ["archive_lockbox_dispencer"] = { {data = ...}, ... } }`).
  * `map_width` (`number`): Width of the current map (not used in current logic).
  * `map_height` (`number`): Height of the current map (not used in current logic).
* **Returns:** `nil`.  
* **Error states:** None — assumes `ents` contains `archive_lockbox_dispencer` and optionally `archive_lockbox_dispencer_temp` keys.

### `AncientArchivePass(entities, map_width, map_height, world, add_entity_fn)`
* **Description:** Main entry point for the archive worldgen pass. Assigns cyclic product IDs to lockbox dispensers, ensuring exactly three dispensers are populated. If fewer than three are provided, it transfers and reassigns additional dispensers from a temporary pool (`archive_lockbox_dispencer_temp`), then removes that pool from the entity map.
* **Parameters:**
  * `entities` (`table`): Mutable entity map (as passed to `AncientArchiveInit`).
  * `map_width` (`number`): Map width (unused in logic).
  * `map_height` (`number`): Map height (unused in logic).
  * `world` (`table`): World object (unused in logic).
  * `add_entity_fn` (`function`): Entity-spawning callback (unused in logic).
* **Returns:** `entities` (`table`), now modified in-place with product assignments and with `archive_lockbox_dispencer_temp` removed.  
* **Error states:** If `entities["archive_lockbox_dispencer_temp"]` is missing or empty when needed, no dispensor is added (silently fails to fill required 3).

## Events & listeners
None. This module performs synchronous, one-time data transformation and does not register or emit events.

---