---
id: lavaarena_boarrior
title: Lavaarena Boarrior
description: Aprefab definition for the Lava Arena boss enemy Boarrior, defining its visual, physical, and network properties.
tags: [boss, combat, environment, ai]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7aa32995
system_scope: entity
---

# Lavaarena Boarrior

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_boarrior` defines the prefab for the Boarrior, a boss-level enemy encountered in the Lava Arena event. It sets up essential rendering, physics, and network components (transform, anim state, sound emitter, dynamic shadow, and network replication), applies appropriate tags for gameplay classification, and registers itself with the `lavaarenamobtracker` component if present. This prefab is not a component itself but a full entity definition used to spawn the boss mob.

## Usage example
The prefab is instantiated automatically by the game during Lava Arena events when spawning the Boarrior boss. Modders typically do not instantiate it directly, but may reference it in task definitions or event scripts:
```lua
-- Example of spawning via task system or worldgen (not direct instantiation)
TheWorld:SpawnPrefab("boarrior")
```

## Dependencies & tags
**Components used:** None directly accessed (relies on built-in engine components `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`). Uses `TheWorld.components.lavaarenamobtracker:StartTracking(inst)` if the tracker exists.
**Tags:** Adds `LA_mob`, `monster`, `hostile`, `largecreature`, `epic`, and `fossilizable`.

## Properties
No public properties defined. All configuration is handled via entity setup in the constructor (`fn()`).

## Main functions
Not applicable — this is a prefab definition file, not a component with methods.

## Events & listeners
- **Listens to:** None directly in this file.
- **Pushes:** None directly in this file.

> Note: This prefab delegates post-initialization to `event_server_data("lavaarena", "prefabs/lavaarena_boarrior").master_postinit(inst)` on the server side, which may define additional behavior (events, components, logic) — but that logic resides elsewhere and is not included in this file.