---
id: SGfishingnetvisualizer
title: Sgfishingnetvisualizer
description: Manages the visual state machine for the fishing net, coordinating animation and movement during casting, opening, retrieving, and final pickup phases.
tags: [fishing, visual, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 909a0dcf
system_scope: entity
---

# Sgfishingnetvisualizer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGfishingnetvisualizer` is a stategraph that defines the visual behavior of the fishing net entity during its use cycle. It orchestrates the animation flow (`casting` → `opening` → `retrieving` → `final_pickup`) and delegates movement and entity-handling logic to the `fishingnetvisualizer` component. This stategraph does not contain gameplay logic itself but serves as the animation controller and event broker for the fishing net’s visual simulation.

## Usage example
This stategraph is not instantiated directly by modders. Instead, it is assigned to a fishing net entity’s `StateGraph` component, typically via the prefab definition:
```lua
inst:AddStateGraph("fishingnetvisualizer")
inst.sg:GoToState("casting")
```
The `fishingnetvisualizer` component (attached to the same entity) handles the associated logic (e.g., collecting entities, computing trajectories).

## Dependencies & tags
**Components used:** `fishingnetvisualizer`
**Tags:** None identified.

## Properties
No public properties are defined or accessed directly in this stategraph.

## Main functions
Stategraphs do not expose functional methods in the same way components do. The `states` table defines the behavior of each state:

### State: `"casting"`
* **Description:** The initial phase where the net is thrown. Plays "throw_pre" followed by an infinite "throw_loop" animation. Updates motion via the `fishingnetvisualizer` component.
* **Events:** Listens to `"play_throw_pst"` (plays "throw_pst" animation once) and `"begin_opening"` (transitions to `"opening"` state).
* **Update:** Calls `fishingnetvisualizer:UpdateWhenMovingToTarget(dt)`.

### State: `"opening"`
* **Description:** Net opens to capture entities. Spawns a "fishingnetvisualizerfx" at the net’s location. Calls `BeginOpening()` to populate the captured entities list.
* **Events:** Listens to `"animover"` (transitions to `"retrieving"` state).
* **Update:** Calls `fishingnetvisualizer:UpdateWhenOpening(dt)` to move captured entities toward the net.

### State: `"retrieving"`
* **Description:** Net and captured entities are pulled toward the thrower. Calls `BeginRetrieving()` and orients the net toward the thrower, then plays the "pull_loop" animation.
* **Events:** Listens to `"begin_final_pickup"` (transitions to `"final_pickup"`).
* **Update:** Calls `fishingnetvisualizer:UpdateWhenRetrieving(dt)`.

### State: `"final_pickup"`
* **Description:** Final phase where captured entities are dropped and the net entity is removed. Calls `BeginFinalPickup()` and ends the interaction.
* **Events:** None.
* **Update:** None.

## Events & listeners
- **Listens to:** `"play_throw_pst"`, `"begin_opening"`, `"animover"`, `"begin_final_pickup"` — all internal events triggered by the `fishingnetvisualizer` component or animation lifecycle.
- **Pushes:** None.