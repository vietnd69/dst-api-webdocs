---
id: SGcarnivalgame_puckdrop_station
title: Sgcarnivalgame Puckdrop Station
description: Defines the state machine and timeline logic for the Puck Drop carnival minigame station in DST.
tags: [minigame, carnival, animation, physics]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2a682029
system_scope: minigame
---

# Sgcarnivalgame Puckdrop Station

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcarnivalgame_puckdrop_station` is a stategraph that controls the visual and behavioral flow of the Puck Drop minigame station. It manages animations for doors, ball drops, and reward spawning, while coordinating sound effects and score calculation via interactions with the `minigame` component. The stategraph uses a timeline-based system to schedule sound and score events during gameplay phases.

## Usage example
This stategraph is applied automatically to the minigame station entity (e.g., `carnivalgame_puckdrop_station`) at spawn and does not require manual initialization by modders.

## Dependencies & tags
**Components used:** `minigame`
**Tags:** `"off"` — applied in states `"idle_off"` and `"turn_off"`.

## Properties
No public properties are defined in this stategraph. State persistence relies on `inst.sg.mem` (state memory) and instance-specific variables like `_current_door`.

## Main functions
This file defines only the stategraph constructor and helper functions used to populate states; it does not expose callable methods. Public APIs for interacting with this component are accessed via the parent `minigame` component or the stategraph system.

## Events & listeners
- **Listens to:**
  - `animover` — transitions from `place` or `drop_ball` states to subsequent states after animation completion.
  - `animqueueover` — transitions from `cycle_doors` and `turn_off` states after animation queue completes.
- **Pushes:**
  - `FlagGameComplete()` — called on the entity (`inst`) when a gameplay state finishes and the minigame is active (via `inst.components.minigame:GetIsPlaying()`).