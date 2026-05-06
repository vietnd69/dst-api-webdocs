---
id: corpse_gestalt
title: Corpse Gestalt
description: Defines the corpse gestalt prefab, a lunar-aligned entity that can be captured and tracked.
tags: [lunar, enemy, capture, prefab]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 9edf5868
system_scope: entity
---

# Corpse Gestalt

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`corpse_gestalt` is a lunar-aligned enemy prefab that spawns from lunar rifts and can be captured by players. It features entity tracking capabilities to follow targets, sanity aura effects, and locomotion configured for both walking and running speeds. The prefab uses a custom state graph and behavior brain for AI control, and integrates with the gestalt capture system for player interaction.

## Usage example
```lua
-- Spawn the corpse gestalt prefab
local gestalt = SpawnPrefab("corpse_gestalt")

-- Note: Spawn() and SetTarget() are only available on master simulation
if TheWorld.ismastersim then
    -- Set a target for the gestalt to track
    local player = ThePlayer
    gestalt:SetTarget(player)

    -- Trigger spawn animation
    gestalt:Spawn()
end

-- Access components for customization
gestalt.components.sanityaura.aura = TUNING.SANITYAURA_HIGH
gestalt.components.gestaltcapturable:SetLevel(3)
```

## Dependencies & tags
**External dependencies:**
- `prefabutil` -- prefab helper utilities
- `brains/corpse_gestalt_brain` -- behavior tree for AI control
- `prefabs/rift_portal_defs` -- lunar rift affinity constants

**Components used:**
- `entitytracker` -- tracks target entity via TrackEntity/ForgetEntity
- `sanityaura` -- provides sanity aura effect (TUNING.SANITYAURA_MED)
- `locomotor` -- handles movement speeds and pathfinding caps
- `gestaltcapturable` -- enables capture mechanics with level and planar settings
- `knownlocations` -- tracks known locations for navigation

**Tags:**
- `brightmare` -- added on creation
- `NOBLOCK` -- added on creation, prevents blocking
- `soulless` -- added on creation, prevents wortox soul extraction
- `lunar_aligned` -- added on creation, indicates lunar affinity
- `gestaltcapturable` -- added on creation, marks as capturable

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
### `Spawn()`
* **Description:** Initializes the gestalt with random rotation and triggers the spawn animation state. Called after the prefab is instantiated to begin its lifecycle.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `inst.sg` is nil when calling `GoToState()` — stategraph must be assigned before calling Spawn.

### `SetTarget(target)`
* **Description:** Assigns a target entity for the gestalt to track. If target is valid, tracks it via entitytracker and teleports the gestalt from a lunar rift or near the target position. If target is nil or invalid, forgets the tracked entity.
* **Parameters:** `target` -- entity instance to track, or nil to clear target
* **Returns:** None
* **Error states:** None


## Events & listeners
None identified.