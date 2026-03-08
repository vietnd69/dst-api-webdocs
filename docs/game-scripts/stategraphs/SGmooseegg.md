---
id: SGmooseegg
title: Sgmooseegg
description: Manages the lifecycle and state transitions for a moose egg, including hatching into mosslings and spawning a guardian upon full hatching.
tags: [egg, hatching, guardian, npc, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 0f18a374
system_scope: entity
---

# Sgmooseegg

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmooseegg` defines the state machine for the moose egg prefab in DST. It orchestrates the visual and behavioral progression from a landed egg to full hatching, releasing multiple mosslings over time and eventually summoning a guardian when the egg completes its cycle. It integrates with the `workable`, `named`, `herd`, `entitytracker`, and `guardian` components to handle interaction, naming, spawning, and guardian logic.

## Usage example
```lua
local inst = SpawnPrefab("mooseegg")
inst:AddTag("egg")
inst:AddTag("lightningrod") -- for lightning-triggered cracking
inst.components.entitytracker:SetEntity("mother", mother_inst)
inst.sg:GoToState("land")
-- The stategraph handles subsequent transitions automatically via events and timers.
```

## Dependencies & tags
**Components used:** `workable`, `named`, `herd`, `entitytracker`, `guardian`  
**Tags:** Adds/uses `egg`, `idle`, `busy`; removes `lightningrod` during `crack`. State-specific tags are applied via `inst.sg:AddStateTag("egg")` internally.

## Properties
No public properties.

## Main functions
This file is a stategraph definition—there are no standalone public functions. The following local helper functions drive hatching behavior:

### `ReleaseMossling(inst)`
*   **Description:** Spawns a single mossling at the egg's position and adds it to the egg's herd. The mossling is directed to enter the `hatch` state immediately.
*   **Parameters:** `inst` (entity instance) — the moose egg instance.
*   **Returns:** Nothing.

### `Hatch(inst)`
*   **Description:** Initiates the spawning of multiple mosslings over time, then after all mosslings have been spawned, spawns or assigns a guardian based on the presence of the "mother" entity. If no mother is found, it triggers guardian cleanup via `OnGuardianDeath`.
*   **Parameters:** `inst` (entity instance) — the moose egg instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — used in multiple states (`land`, `hit`, `crack`, `hatch`) to transition to the next logical state after animations complete.
- **Pushes:** None directly; this is a stategraph definition, not an actor component.

> **Note:** Event handlers are commented out (e.g., lightningstrike), indicating future or legacy functionality not currently active.

