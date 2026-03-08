---
id: SGhermitcrab_teashop
title: Sghermitcrab Teashop
description: Defines the state machine for a hermit crab–operated teashop building, handling idle, hit, and placement animation states.
tags: [stategraph, entity, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 81c9dc94
system_scope: entity
---

# Sghermitcrab Teashop

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGhermitcrab_teashop` stategraph defines the behavioral states and event handlers for the hermit crab–operated teashop building entity in DST. It manages transitions between `idle`, `hit`, and `place` states based on gameplay events such as construction completion (`onbuilt`) and player interaction (`worked`). It also coordinates with the associated hermit crab's stategraph by triggering a `hit_teashop` state on the crab when the teashop is struck.

## Usage example
```lua
-- Typically instantiated automatically as part of the teashop prefab.
-- Example of interaction:
inst.replica.sg:SetState("hit", { damage = 1 }) -- rarely called manually; usually driven by server-side logic
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `burnt`, `abandoned`, `busy`, `idle`, `hit`.

## Properties
No public properties

## Main functions
Not applicable — this file defines a `StateGraph`, not a component class with methods.

## Events & listeners
- **Listens to:**
  - `onbuilt` → transitions to `"place"` state.
  - `worked` → transitions to `"hit"` state (unless burnt or busy).
  - `animover` (inside `"hit"` and `"place"` states) → transitions to `"idle"` state.
- **Pushes:** None — this stategraph does not fire custom events.