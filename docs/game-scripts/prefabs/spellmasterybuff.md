---
id: spellmasterybuff
title: Spellmasterybuff
description: Creates and manages FX visual prefabs for the Spell Mastery mechanic in the Lava Arena event, including anchor, orb, and orb container entities.
tags: [fx, lavaarena, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 87bfb27c
system_scope: fx
---

# Spellmasterybuff

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spellmasterybuff` is a prefab definition file that instantiates three related FX entities used exclusively in the Lava Arena event: `spellmasterybuff` (the anchor), `spellmasteryorb` (individual orbs), and `spellmasteryorbs` (the orb container). These prefabs provide visual feedback for the Spell Mastery mechanic by displaying animated arcane orbs. The component logic is delegated to external server-side event hooks (`buff_postinit`, `orbs_postinit`) registered via `event_server_data`.

## Usage example
This file does not define a component, but rather defines prefabs. Typical usage involves instantiation via `SpawnPrefab` in the context of the Lava Arena event:
```lua
local buff = SpawnPrefab("spellmasterybuff")
local orb = SpawnPrefab("spellmasteryorb")
local orb_container = SpawnPrefab("spellmasteryorbs")
```

## Dependencies & tags
**Components used:** None directly — uses entity subsystems via `inst.entity:Add*()`. Relies on external event callbacks: `event_server_data("lavaarena", "prefabs/spellmasterybuff").buff_postinit` and `event_server_data("lavaarena", "prefabs/spellmasterybuff").orbs_postinit`.
**Tags:** Adds `"FX"` and `"NOCLICK"` to all prefabs; `spellmasteryorbs` additionally adds `"FX"` only.

## Properties
No public properties defined — this is a prefab definition file, not a component.

## Main functions
This file contains only prefab constructor functions (`fn`, `orbfn`, `orbsfn`), not component-style methods.

## Events & listeners
- **Listens to:** None (prefab constructors do not register listeners).
- **Pushes:** None — relies on `event_server_data` hooks for server-side initialization.
