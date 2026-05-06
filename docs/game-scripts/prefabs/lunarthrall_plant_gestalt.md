---
id: lunarthrall_plant_gestalt
title: Lunarthrall Plant Gestalt
description: Defines the lunarthrall_plant_gestalt prefab entity with AI brain, movement, and gestalt capture mechanics.
tags: [prefab, lunar, gestalt, creature, ai]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: c782d9ca
system_scope: entity
---

# Lunarthrall Plant Gestalt

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`lunarthrall_plant_gestalt` is a creature prefab representing a lunar-aligned gestalt entity. It features AI behavior through a dedicated brain, locomotion capabilities, sanity aura effects, and can be captured via the gestalt capture system. The entity is marked as planar and soulless, affecting interactions with certain game mechanics like Wortox soul hopping.

## Usage example
```lua
-- Spawn the prefab in the world
local inst = SpawnPrefab("lunarthrall_plant_gestalt")

-- Access configured components
inst.components.sanityaura.aura = TUNING.SANITYAURA_MED
inst.components.gestaltcapturable:SetLevel(2)

-- The prefab automatically sets up state graph and brain on server
-- Client-side instances skip server-only initialization
```

## Dependencies & tags
**External dependencies:**
- `prefabutil` -- prefab utility functions
- `brains/lunarthrall_plant_gestalt_brain` -- AI behavior tree for this entity

**Components used:**
- `timer` -- manages spawn timer (15 second "justspawned" timer)
- `sanityaura` -- provides sanity aura effect to nearby players
- `locomotor` -- handles movement speed and pathfinding capabilities
- `gestaltcapturable` -- enables gestalt capture mechanics with level 2 planar setting
- `knownlocations` -- tracks known locations for AI navigation

**Tags:**
- `brightmare` -- added on creation, affects nightmare creature interactions
- `NOBLOCK` -- added on creation, prevents entity from blocking movement
- `soulless` -- added on creation, prevents Wortox soul hopping to this entity
- `lunar_aligned` -- added on creation, marks entity as lunar faction
- `gestaltcapturable` -- added on creation, marks entity as capturable by gestalts

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_inspectonseen` | boolean | `true` | Enables scrapbook inspection when entity is first seen |
| `scrapbook_thingtype` | string | `"creature"` | Categorizes entity as creature in scrapbook |
| `scrapbook_adddeps` | table | `{"lunarrift_portal"}` | List of dependent prefabs for scrapbook |
| `Spawn` | function | --- | Local function assigned to instance for spawn initialization logic. |

## Main functions
### `Spawn(inst)`
* **Description:** Called when the prefab spawns. Starts a 15-second timer, applies random rotation, and transitions state graph to "spawn" state.
* **Parameters:** `inst` -- the entity instance being spawned
* **Returns:** None
* **Error states:** Errors if `inst.components.timer` is nil (timer component not added before Spawn is called) or if state graph is not set (inst.sg is nil).

### `fn()`
* **Description:** Main prefab constructor function. Creates the entity, initializes all components, sets up physics and animations, and configures server-side behavior. Returns the fully configured instance.
* **Parameters:** None
* **Returns:** Entity instance (`inst`)
* **Error states:** None -- includes `TheWorld.ismastersim` guard to prevent server-only logic from running on clients.

## Events & listeners
None identified.