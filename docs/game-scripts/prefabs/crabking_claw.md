---
id: crabking_claw
title: Crabking Claw
description: Handles the crab king's claw entity as a combat-capable, ocean-bound minion with autonomous behavior and shadow linkage.
tags: [combat, ai, boss, ocean, minion]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 461a782e
system_scope: entity
---

# Crabking Claw

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `crabking_claw` prefab implements a boss minion for the Crab King, functioning as a mobile, ocean-restricted combatant. It uses a custom brain (`SGcrabkingclaw` state graph) and integrates with multiple components to handle physics, movement, targeting, and loot. It spawns a linked shadow entity and features a custom teleportation override that ensures it only reappears in swimmable ocean areas.

## Usage example
```lua
-- The crabking_claw is instantiated automatically during the Crab King fight.
-- To spawn manually in a mod:
local claw = SpawnPrefab("crabking_claw")
if claw then
    claw.Transform:SetPosition(x, y, z)
    claw.crabking = some_crabking_entity
end
```

## Dependencies & tags
**Components used:** `boatdrag`, `locomotor`, `health`, `combat`, `lootdropper`, `inspectable`, `timer`, `knownlocations`, `entitytracker`, `teleportedoverride`  
**Tags added:** `ignorewalkableplatforms`, `animal`, `scarytoprey`, `hostile`, `crabking_claw`, `crabking_ally`, `soulless`, `lunar_aligned`  
**Tags checked:** `INLIMBO`, `playerghost`, `character`, `monster`, `_combat`

## Properties
No public properties are exposed directly by this prefab. Entity state is managed via components and internal callbacks (`OnSave`, `OnLoadPostPass`).

## Main functions
Not applicable.

## Events & listeners
- **Listens to:**  
  - `"death"` → triggers `OnDead`, which removes the linked shadow entity.  
  - `"onremove"` → triggers `OnRemove`, which also removes the shadow entity.
