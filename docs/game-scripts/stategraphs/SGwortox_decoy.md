---
id: SGwortox_decoy
title: Sgwortox Decoy
description: Manages the state machine and lifecycle of a Wortox soul decoy, including idle behavior, death transitions, explosion, and fizzle effects.
tags: [combat, fx, state-machine]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: caac3373
system_scope: entity
---

# Sgwortox Decoy

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwortox_decoy` is a `StateGraph` definition for the Wortox decoy entity, handling its behavioral states from idle through death, explosion, or fizzle. It coordinates animation playback, timer expiration, and interaction with the `colouradder` and `health` components to manage visual effects and entity removal. The stategraph is used by `wortox_decoy` prefabs spawned during Wortox's soul decoy skill.

## Usage example
```lua
local decoy = SpawnPrefab("wortox_decoy")
decoy.decoyexplodes = true
decoy.decoyexpired = false
decoy.sg:GoToState("idle", { deathtime = GetTime() + TUNING.SKILLS.WORTOX.SOULDECOY_DURATION })
```

## Dependencies & tags
**Components used:** `colouradder`, `health`
**Tags:** Adds `"idle"` (in idle state), `"busy"` (in death, explosion, and fizzle states).

## Properties
No public properties — this is a `StateGraph` definition, not a component instance. Internal state is managed via `inst.sg.statemem`.

## Main functions
Not applicable — this file defines a `StateGraph` table, not a class with methods. State logic is implemented via `onenter`, `onupdate`, and timeline callbacks within state definitions.

## Events & listeners
- **Listens to:** `death` - transitions the decoy to the `"death"` state via the registered `EventHandler`.
- **Pushes:** None (does not fire custom events).
