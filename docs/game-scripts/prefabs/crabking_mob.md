---
id: crabking_mob
title: Crabking Mob
description: Creates the Crab King's mob units with distinct variants (regular and knight), handling combat, movement, AI brain, and loot drop configuration.
tags: [combat, ai, boss, entity, loot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 18a233fb
system_scope: entity
---

# Crabking Mob

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `crabking_mob` prefab implements two variants of the Crab King's loyal crab soldiers: standard mobs and knight variants. It sets up core components including health, combat, locomotion, sanity aura, sleeper, and loot dropping. The prefab uses an external brain (`brains/crabking_mobbrain.lua`) and a dedicated stategraph (`SGcrabking_mob`) to manage behavior. It also defines shared loot tables and configures AI retargeting, target sharing, and aggro logic.

## Usage example
```lua
-- Example: Spawning a standard Crab King mob
local mob = Prefab("crabking_mob")()
mob.Transform:SetPosition(x, y, z)

-- Example: Spawning a Crab King knight
local knight = Prefab("crabking_mob_knight")()
knight.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `embarker`, `inspectable`, `knownlocations`, `lootdropper`, `sanityaura`, `drownable`, `locomotor`, `health`, `combat`, `sleeper`  
**Tags added:** `monster`, `hostile`, `scarytoprey`, `crab_mob`, `crabking_ally`, `lunar_aligned`, `smallcreature` (regular), `largecreature` (knight), `crab_mob_knight` (knight)

## Properties
No public properties are defined or used outside of standard component behavior.

## Main functions
This prefab does not expose direct public methods on the entity instance. Instead, it configures internal components during construction. Key behaviors are triggered via the stategraph, brain, and component callbacks.

## Events & listeners
- **Listens to:** `attacked` — triggers `inst._OnAttacked`, which sets the attacker as the target and shares aggro with nearby crab mobs.
- **Pushes:** None defined directly in this file.