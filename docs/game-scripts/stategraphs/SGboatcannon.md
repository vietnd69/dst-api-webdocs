---
id: SGboatcannon
title: Sgboatcannon
description: Manages animation states and events for a boat cannon entity based on its ammo status and actions.
tags: [combat, animation, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: c6569c7c
system_scope: entity
---

# Sgboatcannon

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboatcannon` is a StateGraph that controls the visual and behavioral states of a boat cannon entity in Don't Starve Together. It transitions between `idle`, `load`, `shoot`, `place`, and `hit` states, synchronizing animation playback, sound effects, and state-dependent side effects (e.g., toggling visual flaps) with component interactions via the `boatcannon` component. This graph does not implement logic itself but acts as a visual coordinator, responding to state-driven events and delegating actual cannon functionality (like shooting or ammo loading) to the attached `BoatCannon` component.

## Usage example
This StateGraph is automatically assigned to boat cannon prefabs by the engine and is not added manually. It is instantiated and driven by the StateMachine system when the entity enters states such as loading or shooting:
```lua
-- Internal engine usage — not typically called by modders
local inst = CreateEntity()
inst:AddStateGraph("boatcannon")
-- Transitions are triggered externally by setting inst.sg:GoToState("load") or similar
```

## Dependencies & tags
**Components used:** `boatcannon` (accessed via `inst.components.boatcannon:IsAmmoLoaded()` and `inst.components.boatcannon:Shoot()`)
**Tags:** The state graph defines and uses internal tags (`"idle"`, `"busy"`, `"shooting"`) assigned to states. No entity tags are added or removed.

## Properties
No public properties are defined in this StateGraph.

## Main functions
This file is a StateGraph definition, not a component class. It does not define public methods. Its structure is entirely declarative (`states`, `events`).

## Events & listeners
- **Listens to:**
  - `ammoloaded` — triggers `OnAmmoLoaded`, which hides "cannon_flap_up" and shows "cannon_flap_down".
  - `ammounloaded` — triggers `OnAmmoUnloaded`, which hides "cannon_flap_down" and shows "cannon_flap_up".
  - `loadedammo` and `unloadedammo` — overridden (no-op event handlers) to prevent default processing; actual state changes are handled via `RefreshAmmoState` on state exit.
- **Pushes:** None directly. State transitions and visual updates occur internally via state transitions (`inst.sg:GoToState(...)`) and side effects.