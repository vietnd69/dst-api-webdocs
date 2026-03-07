---
id: lavaarena_center
title: Lavaarena Center
description: A hidden, non-visual entity that acts as a server-side registration point for the Lava Arena event, used to coordinate arena setup and state.
tags: [boss, event, world]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fa02fed5
system_scope: world
---

# Lavaarena Center

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_center` is a hidden, client-excluded entity used exclusively on the master simulation (server) to register and signal the presence of the Lava Arena center during event setup. It carries the `CLASSIFIED` tag and is never rendered in the world. Its sole purpose is to broadcast its existence via the `ms_register_lavaarenacenter` event to other systems (e.g., arena controllers or logic handlers) that the arena center is active and ready.

## Usage example
This prefab is not intended for manual instantiation by modders. It is automatically created and managed by the game's Lava Arena worldgen or event logic:
```lua
-- Internal game usage (do not replicate manually)
-- The game creates this prefab automatically during lava arena initialization.
-- Modders should listen for "ms_register_lavaarenacenter" instead.
```

## Dependencies & tags
**Components used:** `transform`, `network`  
**Tags:** Adds `CLASSIFIED`

## Properties
No public properties.

## Main functions
Not applicable — this is a Prefab factory function, not a Component. It does not define any custom methods.

## Events & listeners
- **Pushes:** `ms_register_lavaarenacenter` — fired once on the master server after the entity is created, passing the entity instance (`inst`) as the event data. Used to notify systems that the lava arena center has been established.