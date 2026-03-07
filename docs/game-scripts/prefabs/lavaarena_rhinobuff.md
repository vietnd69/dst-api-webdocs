---
id: lavaarena_rhinobuff
title: Lavaarena Rhinobuff
description: A visual effect prefab used in the Lava Arena event to provide a decorative rhinoceros-themed buff animation.
tags: [fx, decor, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3c05558d
system_scope: fx
---

# Lavaarena Rhinobuff

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_rhinobuff` is a visual effect prefab that spawns a decorative, non-interactive animation in the Lava Arena event. It serves a purely aesthetic purpose — rendering an in-world buff effect with rhinoceros-themed visuals — and does not implement gameplay logic. It uses a custom animation bank and build, and ensures it only runs server-side initialization logic when present in the master world simulation.

## Usage example
This prefab is instantiated automatically by the game during Lava Arena events and is not intended for manual creation by mods. Typical usage involves spawning it via worldgen or event logic outside this file.

```lua
-- Not applicable: this prefab is internally managed and not meant for modder instantiation.
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`  
**Tags:** Adds `DECOR`, `NOCLICK`; referenced via `event_server_data("lavaarena", "prefabs/lavaarena_rhinobuff").master_postinit(inst)`.

## Properties
No public properties

## Main functions
Not applicable (this is a static prefab definition; functionality is embedded in construction logic.)

## Events & listeners
- **Listens to:** None  
- **Pushes:** `event_server_data(...).master_postinit(inst)` is invoked if the instance is master-simulated, but no event registration or emission occurs within this file.