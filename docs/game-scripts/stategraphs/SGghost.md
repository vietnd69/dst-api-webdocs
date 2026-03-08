---
id: SGghost
title: Sgghost
description: Manages the state transitions and behavioral logic for the Ghost character entity, including idle, attack, knockback, death, and play states.
tags: [ai, stategraph, ghost, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: e500fb98
system_scope: ai
---

# Sgghost

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGghost` is a `StateGraph` definition that controls the animation and behavior of the Ghost entity in Don't Starve Together. It defines transitions between various states such as `idle`, `hit`, `haunted`, `knockback`, `levelup`, `dissipate`, and `play`, coordinating interactions with components like `combat`, `health`, `locomotor`, `aura`, and `lootdropper`. It uses `CommonStates` helpers to add walk/run behaviors and integrates with external events (e.g., `ghostplaywithme`, `updatepetmastery`) to support pet system mechanics.

## Usage example
```lua
-- This is a stategraph, not a component; it's returned directly by the script
-- and consumed by the game engine when instantiating the ghost prefab.
-- Example usage is implicit in the engine's entity spawning logic.
-- A modder would reference or extend this SG in a custom ghost prefab:
local ghost = Prefab("my_ghost", function(inst)
    -- ... component setup ...
    inst:AddStateGraph("ghost", "SGghost")
    inst.sg = inst.statesgraph.ghost
end)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `aura`, `lootdropper`
**Tags:** Adds `idle`, `canrotate`, `canslide`, `busy`, `noattack`, `nointerrupt`, `jumping`, `playful` — conditionally via state tags. Checks `girl`, `debuffed`, `debuffed` (implicitly via `IsDead()` and `GetPercent()`).

## Properties
No public properties — this is a `StateGraph` definition, not a component with instance-level mutable state.

## Main functions
Not applicable — this file defines a `StateGraph` structure, not a class with callable methods.

## Events & listeners
- **Listens to:** `startaura`, `stopaura`, `attacked`, `knockback`, `updatepetmastery`, `death`, `start_playwithghost`, `ghostplaywithme`, `animover` (used within state event blocks).
- **Pushes:** `detachchild`, and implicitly pushes `invincibletoggle`, `locomote`, `stopaura`, `entity_droploot` via component calls (`health:SetInvincible`, `locomotor:Stop`, `aura:Enable`, `lootdropper:DropLoot`).