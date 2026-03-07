---
id: stalker_shield
title: Stalker Shield
description: Creates a visual effect entity that repels nearby creatures and deals damage to them upon activation.
tags: [fx, combat, repel, visual, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: be45a2de
system_scope: fx
---

# Stalker Shield

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `stalker_shield` is a prefab that spawns as a transient visual effect (`FX` tag) during stalker attacks. It briefly repels eligible creatures within a 3-unit radius, dealing `10` damage to non-player, combat-capable entities and triggering a `repelled` event on players. It self-destructs shortly after creation and does not persist across sessions. The shield uses physics overrides to push creatures away in a repulsion wave before cleaning up all movement overrides.

## Usage example
```lua
-- The stalker_shield prefabs are typically instantiated internally by stalker AI or animations.
-- Modders do not usually create this prefab manually; instead, it is referenced as part of stalker attacks.
-- To test repel behavior in a mod:
local shield = Prefab("stalker_shield", nil, nil, { "stalker_shield1", "stalker_shield2", "stalker_shield3", "stalker_shield4", "stalker_shield" })
-- The actual instance is spawned via TheSim:SpawnPrefab("stalker_shield" .. tostring(math.random(4)))
-- or via the generic "stalker_shield" (which randomly picks 1–4).
```

## Dependencies & tags
**Components used:** `health` (via `IsDead()`), `combat` (via `GetAttacked()`), `physics` (via `SetMotorVelOverride`, `ClearMotorVelOverride`, `Stop`)
**Tags:** Adds `FX`; checks against `locomotor`, `fossil`, `shadow`, `playerghost`, `INLIMBO`, `player`

## Properties
No public properties

## Main functions
Not applicable (this is a prefab factory, not a component)

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove()` when the animation completes.
- **Pushes:** `repelled` — fired on player entities that are repelled, with `{ repeller = inst, radius = 3 }` as event data.