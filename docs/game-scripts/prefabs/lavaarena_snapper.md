---
id: lavaarena_snapper
title: Lavaarena Snapper
description: A hostile enemy prefab used in the Lava Arena event that supports being fossilized and integrates with the Lava Arena mob tracker system.
tags: [combat, boss, event, fossilizable, monster]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7842a424
system_scope: entity
---

# Lavaarena Snapper

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_snapper` is a prefab definition for a hostile enemy entity used in the Lava Arena event. It provides the core entity structure (animation, physics, sound, network, and shadow), assigns required tags for gameplay classification, and registers with the `lavaarenamobtracker` component to be tracked during the event. It also defines a separate FX prefab (`goo_spit_fx`) for visual effects.

The main entity supports the `fossilizable` gameplay mechanic by adding the `fossilizable` tag, indicating it can be turned into a fossil (likely via interaction with a fossilizer). It uses `event_server_data` hooks to allow modded or event-specific post-initialization logic on the server side.

## Usage example
This is a prefab definition — it is not typically used directly by modders but instantiated via the engine's prefab system. However, a modder may reference or extend its behavior in an `event_postinit` hook or via `prefabs/lavaarena_snapper.lua` overrides.

Example of how it integrates with the mob tracker (internal to prefab init):
```lua
if TheWorld.components.lavaarenamobtracker ~= nil then
    TheWorld.components.lavaarenamobtracker:StartTracking(inst)
end
```

## Dependencies & tags
**Components used:**  
- `lavaarenamobtracker` — `StartTracking(inst)` called on world component if present.

**Tags added:**  
- `LA_mob` — marks it as a Lava Arena mob.  
- `monster` — standard monster classification.  
- `hostile` — indicates it is hostile to players.  
- `fossilizable` — marks it as a candidate for fossilization mechanics.  

## Properties
No public properties are defined in this prefab constructor. All state is managed via component attachments and event hooks.

## Main functions
Not applicable — this is a prefab factory function, not a component with instance methods.

## Events & listeners
- **Listens to:** `lavaarenamobtracker` integration — calls `StartTracking(inst)` on the world's `lavaarenamobtracker` component during initialization.
- **Pushes:** None directly; relies on `event_server_data(...).snapper_postinit(inst)` to invoke custom server-side initialization logic (moddable hook).