---
id: shadowthrall_parasite
title: Shadowthrall Parasite
description: Spawns a flying hostile monster entity that grants parasite-related abilities upon death, including mask-equipped revival and health restoration for the host.
tags: [combat, ai, boss, monster, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0e684501
system_scope: entity
---

# Shadowthrall Parasite

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowthrall_parasite` is a boss-levelprefab that defines a flying, hostile monster entity with AI behavior (`SGshadowthrall_parasite` state graph) and a dedicated brain (`shadowthrall_parasite_brain`). It interacts with multiple core systems: it possesses combat capabilities, grants a speed-based locomotion profile, applies a medium negative sanity aura, and includes networking support. Upon death, it triggers a special death callback that gives the player-hosted parasite mask, restores full health, and switches the host to a revive state. Local effects (e.g., hair FX and sounds) are excluded on dedicated servers.

## Usage example
```lua
-- Spawn the main parasite entity
local parasite = SpawnPrefab("shadowthrall_parasite")
parasite.Transform:SetPosition(x, y, z)

-- Spawn the FX-only variant (used for brief visual sequences)
local fx = SpawnPrefab("shadowthrall_parasite_fx")
fx.Transform:SetPosition(x, y, z)
fx.AnimState:PlayAnimation("atk") -- triggers its death behavior
```

## Dependencies & tags
**Components used:** `colouraddersync`, `sanityaura`, `locomotor`, `health`, `combat`, `planarentity`, `colouradder`, `knownlocations`, `entitytracker`, `inspectable`  
**Tags added:** `monster`, `hostile`, `scarytoprey`, `shadowthrall`, `shadow_aligned`, `flying`, `FX`, `NOCLICK`

## Properties
No public properties are initialized in the constructor; all configuration is done via component setters.

## Main functions
*Not applicable* — This file defines prefabs (`fn` and `fxfn`), not reusable component classes. The core logic resides in state graphs and brains.

## Events & listeners
- **Listens to:** `animover` (on `shadowthrall_parasite_fx` only) — triggers `fx_onanimover`, which attempts to equip a parasite mask on the host, restores full health, and transitions the host to `"parasite_revive"` state.
- **Pushes:** None (no `inst:PushEvent` calls are present).