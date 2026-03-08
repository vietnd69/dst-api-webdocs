---
id: SGwilsonghost
title: Sgwilsonghost
description: Manages the state machine for Wilson's ghost form, handling transitions between idle, moving, talking, dying, and teleporting states in the Don't Starve Together game.
tags: [player, stategraph, ghost, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 5f5bd3ef
system_scope: player
---

# Sgwilsonghost

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwilsonghost` defines the complete stategraph for Wilson's ghost form in DST. It handles player input, movement states (`idle`, `run`), special actions (`haunt`, `jumpin`, `migrate`), interactions like talking (`talk`, `mime`), and death-related transitions (`dissipate`, `remoteresurrect`). The stategraph integrates with core components such as `health`, `locomotor`, `playercontroller`, and `teleporter`, ensuring correct behavior during networked gameplay (including pause prediction and replication). It uses state tags (`busy`, `idle`, `moving`, `pausepredict`) to manage interrupts and synchronization between server and client.

## Usage example
```lua
-- The stategraph is automatically associated with Wilson's ghost prefab
-- when he dies and transitions to ghost form. Modders can extend it
-- by overriding or adding states/events, but it's typically not added manually.
-- Example extension pattern (not direct usage):
local SG = require("stategraphs/SGwilsonghost")
-- Modify SG.states or SG.events before returning if creating a custom SG.
```

## Dependencies & tags
**Components used:** `health`, `locomotor`, `playercontroller`, `teleporter`  
**Tags:** State tags include `idle`, `moving`, `running`, `busy`, `talking`, `canrotate`, `pausepredict`, `nopredict`, `autopredict`, `doing`.

## Properties
No public properties.

## Main functions
This is a stategraph definition file, not a component with methods. It returns a `StateGraph` instance and does not define public functions accessible via `inst.components.X`.

## Events & listeners
- **Listens to:**
  - `locomote` — updates movement state based on `locomotor` status (`run` vs `idle`).
  - `attacked` — triggers `hit` state if not dead.
  - `ontalk` — enters `talk` or `mime` state depending on the `mime` tag.
  - `vault_teleport` — enters `vault_teleport` state.
  - `animover` — triggered on animation completion in multiple states to advance state transitions.
  - `ghostdissipated` — pushed internally upon `dissipate` animation completion.

- **Pushes:**
  - `ghostdissipated` — fired after the `dissipate` animation finishes.
  - (Note: The `death` event listener is commented out; the `ghostdissipated` event replaces it in ghost flow.)
