---
id: quagmire_swampigelder
title: Quagmire Swampigelder
description: Defines the prefabricated entity for the Quagmire Elder Swamp Pig, including its visual representation, collision physics, minimap icon, talker configuration, and shop tab assignment.
tags: [entity, npc, shop]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 554cb931
system_scope: entity
---

# Quagmire Swampigelder

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_swampigelder` is a prefab definition file that creates the Elder Swamp Pig NPC used in the Quagmire biome. It configures the entity’s visual assets (bank/build, animation), physics properties, minimap display, and talker component settings (e.g., font, size, offset). The prefab also sets the `prototyper` and `character` tags and assigns a specific Quagmire recipe tab (`QUAGMIRE_TRADER_ELDER`) for its shop interface.

## Usage example
This is a standard prefab file and is not instantiated directly by modders. It is referenced internally as:
```lua
-- Example internal usage by DST engine when spawning the prefab
inst = Prefab("quagmire_swampigelder", fn, assets, prefabs)
```
Modders typically do not interact with this file directly; it is loaded automatically when the Quagmire Elder Swamp Pig is spawned in the world.

## Dependencies & tags
**Components used:**  
- `transform`, `animstate`, `soundemitter`, `minimapentity`, `network` (via `entity:AddXXX()`)  
- `talker` (added via `inst:AddComponent("talker")`)  

**Tags added:**  
- `prototyper`  
- `character`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `quagmire_shoptab` | enum (`QUAGMIRE_RECIPETABS`) | `QUAGMIRE_RECIPETABS.QUAGMIRE_TRADER_ELDER` | Specifies the recipe tab ID used in the Elder Swamp Pig’s shop UI. |

## Main functions
### `fn()`
*   **Description:** Constructor function for the `quagmire_swampigelder` prefab. Initializes the entity with all necessary components, animations, physics, tags, and talker settings. Executes common setup for both client and server, with server-specific initialization via `master_postinit`.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the fully initialized entity instance.
*   **Error states:** Returns early on the client (non-master simulation) after basic setup; full initialization only completes on the master simulation.

## Events & listeners
None identified in this file.

The `talker` component’s internal listener (`OnChatterDirty`) is registered by `MakeChatter()`, but that is defined in `components/talker.lua` and not part of this prefab’s direct event wiring.
