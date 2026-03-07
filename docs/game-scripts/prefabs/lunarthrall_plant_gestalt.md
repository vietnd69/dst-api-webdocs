---
id: lunarthrall_plant_gestalt
title: Lunarthrall Plant Gestalt
description: Prefab definition for the Lunarthrall Plant Gestalt entity, a mobile lunar-aligned creature that spawns in the Ruins and affects sanity.
tags: [lunar, creature, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 572dbbf4
system_scope: entity
---

# Lunarthrall Plant Gestalt

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunarthrall_plant_gestalt` is the prefab constructor function that defines the Lunarthrall Plant Gestalt entity — a boss-like lunar-aligned creature appearing in the Ruins. It is built using core ECS components including `animstate`, `soundemitter`, `physics`, `sanityaura`, and `locomotor`. It integrates with the `SGlunarthrall_plant_gestalt` stategraph and a custom brain (`lunarthrall_plant_gestalt_brain`). The entity is tagged for gameplay behavior (`brightmare`, `NOBLOCK`, `soulless`, `lunar_aligned`) and features a 15-second post-spawn timer that initiates its `spawn` state.

## Usage example
This prefab is instantiated internally by the world generation system and does not require direct instantiation by mods. However, a typical usage pattern when referencing its components might look like:
```lua
-- Assume `gestalt` is an existing instance of lunarthrall_plant_gestalt
if gestalt:HasTag("lunar_aligned") then
    gestalt.components.locomotor.walkspeed = 5
    gestalt.components.sanityaura.aura = TUNING.SANITYAURA_LARGE
end
```

## Dependencies & tags
**Components used:** `timer`, `sanityaura`, `locomotor`, `knownlocations`, `animstate`, `soundemitter`, `transform`, `physics`, `network`  
**Tags:** Adds `brightmare`, `NOBLOCK`, `soulless`, `lunar_aligned`  
**External prefabs referenced:** `lunarrift_portal` (scrapbook dependency)

## Properties
No public properties are initialized or exposed in this prefab file itself. All configuration is performed via component setters in the constructor (`fn`) and stategraph/brain.

## Main functions
### `Spawn(inst)`
* **Description:** Initialization callback invoked when the entity is placed into the world. Starts a 15-second timer, sets a random rotation, and transitions the entity to the `"spawn"` state via its stategraph.
* **Parameters:** `inst` (Entity) — The entity instance being spawned.
* **Returns:** Nothing.
* **Error states:** None — assumes the entity has a valid `timer` and `stategraph` component.

## Events & listeners
None identified. The prefab does not define event listeners or fire custom events directly.
