---
id: SGboat
title: Sgboat
description: Controls the life cycle and visual/audio behavior of a boat entity during construction, idle, damage, and sinking phases in Don't Starve Together.
tags: [boat, lifecycle, destruction, audio]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: f7d3f2c6
system_scope: entity
---

# Sgboat

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboat` is a stategraph that manages the animation, sound, and state transitions for a boat entity across its operational lifecycle: placement, idle, damage warning (ready_to_snap), cracking/snapping, and final sinking (popping). It integrates with the `health` and `walkableplatform` components to respond to damage and notify entities on the boat during sinking. The stategraph is named `"boat"` and defaults to the `"idle"` state.

## Usage example
```lua
-- Typically attached to a boat prefab during its prefabs definition
inst:AddTag("boat")
inst:AddComponent("health")
inst:AddComponent("walkableplatform")
inst.sg = StateGraph("boat", states, events, "idle")
-- Custom stategraph setup is handled internally by DST's prefab system
```

## Dependencies & tags
**Components used:** `health`, `walkableplatform`  
**Tags:** Adds the `"popping"` tag during the `"popping"` state (via `tags = {"popping"}` in state definition). No other tags are added or removed.

## Properties
No public properties are declared in the source code.

## Main functions
This stategraph does not define any standalone functions—only state definitions and callbacks.

## Events & listeners
- **Listens to:**
  - `animover` (in `"place"` and `"snapping"` states) – transitions the state upon animation completion.
  - `death` (in `"idle"` state) – transitions to `"ready_to_snap"` when the boat is destroyed.
- **Pushes:**
  - None directly.
- **Indirect events triggered on other entities:**
  - Calls `ent:PushEvent("abandon_ship")` on all entities in `walkableplatform:GetEntitiesOnPlatform()` during `"ready_to_snap"` entry.
  - Calls `k:PushEvent("onpresink")` on all players in `walkableplatform:GetPlayersOnPlatform()` during `"snapping"` entry.