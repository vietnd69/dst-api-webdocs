---
id: SGmoonstormstatic
title: Sgmoonstormstatic
description: A stategraph for moonstorm static capturables that manages idle and moving states based on locomotor input and capture events.
tags: [locomotion, state, event]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 527918fe
system_scope: locomotion
---

# Sgmoonstormstatic

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmoonstormstatic` is a stategraph that controls the locomotion behavior of moonstorm static capturable entities. It toggles between `moving` and `idle` states based on whether the entity is requested to move forward and whether it has been explicitly targeted for capture (via `moonstormstaticcapturable_targeted`). It relies on the `locomotor` component to execute movement and stop actions. The stategraph ensures smooth transitions and prevents conflicting movement commands during capture events.

## Usage example
This stategraph is automatically applied to specific prefabs by the game engine during moonstorm events. Modders typically do not instantiate it directly; instead, it is referenced by name `"moonstormstatic"` in `StateGraph` definitions for capturable entities. To extend its behavior, one would override or extend the parent stategraph and inject custom states or event handlers.

## Dependencies & tags
**Components used:** `locomotor` (uses `WalkForward`, `Stop`, and `WantsToMoveForward`)
**Tags:** Adds `moving` and `canrotate` in `moving` state; adds `idle` and `canrotate` in `idle` state.

## Properties
No public properties.

## Main functions
Not applicable. This is a `StateGraph` definition, not a component with methods.

## Events & listeners
- **Listens to:**  
  - `locomote` — triggered when locomotion state changes (via `locomotor:Stop`/`WalkForward`). Checks for mismatch between current `moving` tag and locomotor's `wantstomoveforward` flag. If mismatched, either enters `moving` or returns to `idle`.  
  - `moonstormstaticcapturable_targeted` — sets `inst.sg.mem.holdstill = true` and forces transition to `idle` if currently moving.  
  - `moonstormstaticcapturable_untargeted` — clears `inst.sg.mem.holdstill`.  
- **Pushes:** None. (This stategraph only responds to events.)