---
id: lavaarena_blooms
title: Lavaarena Blooms
description: Defines and registers the prefabs for Lava Arena healing flower visual effects, including bloom variations, a heal buff entity, and a sleep debuff entity used during the Lava Arena event.
tags: [event, fx, lavaarena]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dc702051
system_scope: fx
---

# Lavaarena Blooms

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines and returns the prefabs required for the Lava Arena event's visual bloom effects and associated status effects. It creates six visual bloom variations (each with unique animations), a heal buff entity that triggers health regeneration on its parent, and a sleep debuff entity. All prefabs are marked as non-physical (`SetPristine`) and include network support for multiplayer sync.

The file interacts with server-side event hooks (`event_server_data`) to delegate post-initialization logic (e.g., `bloom_postinit`, `healbuff_postinit`, `createhealblooms`, `createsleepdebuff`), but does not define or depend on any other components or prefabs inline — the actual behaviors are implemented externally.

## Usage example
This file does not define a reusable component; it returns prefab definitions for immediate registration. Typical usage is internal to DST's event system, e.g.:
```lua
-- In event initialization (e.g. lavaarena.lua):
local lavaarena_blooms = require "prefabs/lavaarena_blooms"
-- Prefabs are returned and registered by the engine
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`, `lavaarena_bloom`, and `CLASSIFIED` depending on the prefab instance.

## Properties
No public properties.

## Main functions
Not applicable (this file defines prefabs, not a component with methods).

## Events & listeners
- **Pushes:** `starthealthregen` — fired on the parent entity when a `lavaarena_bloomhealbuff` instance is created and processed on the master simulation.
