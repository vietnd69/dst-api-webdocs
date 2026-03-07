---
id: lavaarena_boaron
title: Lavaarena Boaron
description: A hostile minion entity used in the Lava Arena event, registered with the LavaArenaMobTracker for lifecycle monitoring.
tags: [event, boss, mob, lavaarena, hostile]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2b9f848d
system_scope: entity
---

# Lavaarena Boaron

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_boaron` is a prefab definition for a hostile minion entity deployed during the Lava Arena event in Don't Starve Together. It is visually represented using the `boaron` animation bank and supports a "fossilized" alternate appearance via override builds. When spawned in the world, it automatically registers itself with the `lavaarenamobtracker` component to ensure it is tracked for event progression (e.g., mob count, win conditions). The entity is pristined early to enable client-side prediction and is finalized on the master sim via `master_postinit`.

## Usage example
This is a prefab definition, not a reusable component, and is instantiated by the game during event spawning. Modders typically interact with it via event logic or by spawning it programmatically:
```lua
-- Example: Spawn a boaron in the world (requires master sim context)
local boaron = SpawnPrefab("boaron")
if boaron ~= nil then
    boaron.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** None directly added or accessed via `inst.components.X` in this file. Relies on engine defaults (`transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`).  
**Tags:** Adds `"LA_mob"`, `"monster"`, `"hostile"`, `"minion"`, and `"fossilizable"` to the entity.

## Properties
No public properties defined in the constructor.

## Main functions
No public functions defined. This is a simple prefab factory function (`fn`) used solely to configure and return a pre-initialized entity instance.

## Events & listeners
- **Listens to:** None directly defined in this file. However, via `TheWorld.components.lavaarenamobtracker:StartTracking(inst)`, the world's `lavaarenamobtracker` component internally registers an `"onremove"` event listener for this entity (as per the connected code in `lavaarenamobtracker.lua`).  
- **Pushes:** None directly in this file.

> Note: This prefab does not define custom logic beyond initialization. Additional behavior (e.g., AI, combat, death responses) is expected to be implemented in `stategraphs`, `behaviours`, or via `master_postinit` (see `event_server_data("lavaarena", "prefabs/lavaarena_boaron").master_postinit(inst)`).