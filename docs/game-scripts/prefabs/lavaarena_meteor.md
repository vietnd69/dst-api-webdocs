---
id: lavaarena_meteor
title: Lavaarena Meteor
description: A visual FX prefab for the meteor impact effect in the Lava Arena event, responsible for rendering and initializing the primary meteor projectile and its associated splash sub-effects.
tags: [fx, event, visual, lavaarena]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ba2946dd
system_scope: fx
---

# Lavaarena Meteor

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_meteor` is a prefab definition for the meteor projectile used in the Lava Arena event. It creates a visual FX entity with a dedicated crash animation, bloom shader, and networked state. It also defines and registers four related prefabs: the main meteor, its splash FX, splash projection (base), and splash hit. The component is non-functional beyond visual initialization — it performs no physics, collision, or gameplay logic; all gameplay behavior is handled externally via post-initialization callbacks (`meteor_postinit`, `splash_postinit`, `splashhit_postinit`).

## Usage example
This prefab is instantiated internally by the game during the Lava Arena event and should not be manually spawned by mods. Typical internal usage (not public API):
```lua
-- Automatically loaded and spawned via event logic
TheWorld:PushEvent("ms_makefoe", { prefabs = { "lavaarena_meteor" } })
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX`, `NOCLICK`, `notarget` to all spawned entities.

## Properties
No public properties are defined or used.

## Main functions
Not applicable — this is a static prefab definition, not a component.

## Events & listeners
- **Pushes:** None directly.
- **Internally invokes (via server-side callbacks):**
  - `event_server_data("lavaarena", "prefabs/lavaarena_meteor").meteor_postinit(inst)` for the main meteor.
  - `event_server_data("lavaarena", "prefabs/lavaarena_meteor").splash_postinit(inst)` for splash FX.
  - `event_server_data("lavaarena", "prefabs/lavaarena_meteor").splashhit_postinit(inst)` for splash hit FX.
  These callbacks are defined in external event code (e.g., `scenarios/lavaarena.lua` or related event scripts) and are not part of this file.