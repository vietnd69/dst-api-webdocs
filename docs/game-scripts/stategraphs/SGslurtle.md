---
id: SGslurtle
title: Sgslurtle
description: Manages state transitions and behavior logic for the Slurtle creature, including movement, combat, eating, shielding, and salt-induced dissolution death.
tags: [ai, combat, locomotion, death, environment]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2a70c7ac
system_scope: entity
---

# Sgslurtle

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGslurtle` StateGraph defines the complete behavior tree for the Slurtle entity in DST. It handles all major life-cycle states—including idle, movement, taunting, eating, aggressive stealing, shielding, and the unique salt-dissolving death sequence—by coordinating interactions with the `health`, `combat`, `inventory`, and `locomotor` components. The stategraph integrates with `CommonStates` utilities to inherit standard walk, combat, frozen, and electrocute state behavior while implementing custom logic for the Slurtle's molting/shielding and salt-vulnerability mechanics.

## Usage example
```lua
-- The Slurtle prefab (e.g., "slurtle") automatically loads this stategraph
-- via its definition (not shown here); no manual instantiation is required.
-- Example: When a player uses salt on a Slurtle, the health component
-- triggers a "salt" damage cause, leading to the salt_death_pre state.
```

## Dependencies & tags
**Components used:** `health`, `combat`, `inventory`, `locomotor`
**Tags:** Adds `shell` when in `shield` state; uses `busy`, `hiding`, `dissolving`, `idle`, `dead`, `attack` as internal state tags.

## Properties
No public properties defined in the StateGraph constructor. State memory is stored in `inst.sg.mem`, notably `dissolving` (boolean) during salt-death sequences.

## Main functions
Not applicable — this is a StateGraph definition file, not a component class with public methods.

## Events & listeners
- **Listens to:**  
  `entershield` – transitions to `shield` state if not dead.  
  `exitshield` – transitions to `shield_end` state if not dead.  
  `death` – handles multiple death paths (`corpse`, `salt_death_pst`, `death`) based on state and data.  
  `animover`, `animqueueover`, `attacked`, and other common animation events via `EventHandler`.  
  Standard locomotion, freeze, electrocute, attack, and attacked events via `CommonHandlers`.  

- **Pushes:**  
  Standard events triggered by state transitions and animations (e.g., `dropitem` via `inventory:DropItem`, `healthdelta` via `health:DoDelta`). The stategraph itself does not directly fire custom events but relies on component events.