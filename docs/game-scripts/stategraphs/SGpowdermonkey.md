---
id: SGpowdermonkey
title: Sgpowdermonkey
description: State graph controlling the behavior and animations of the Powder Monkey character, including combat, rowing, taunting, diving, and corpse handling.
tags: [character, ai, stategraph, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 50fabcb0
system_scope: entity
---

# Sgpowdermonkey

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGpowdermonkey` is a state graph that defines the animation-driven behavior of the Powder Monkey character in Don't Starve Together. It manages transitions between states such as idle, action, combat, rowing, taunting, diving, and death, integrating closely with components like `combat`, `crewmember`, `inventory`, `locomotor`, `talker`, and `drownable`. It also handles special animations and logic for victory conditions, diving into water (including drowning), and corpse generation. This state graph is typically associated with the `powdermonkey` prefab and is instantiated by the DST state graph system.

## Usage example
```lua
-- This state graph is automatically used by the Powder Monkey character prefab.
-- It is not manually instantiated in mods; instead, modders interact with it
-- by listening to its events or modifying its state definitions via hooks.

-- Example: Listen for victory event to add custom behavior
inst:ListenForEvent("victory", function(inst, data)
    -- Custom logic when the powder monkey achieves victory
end)
```

## Dependencies & tags
**Components used:** `boatcannon`, `boatcrew`, `combat`, `crewmember`, `drownable`, `health`, `inventory`, `locomotor`, `talker`, `timer`  
**Tags:** `idle`, `canrotate`, `busy`, `action`, `caninterrupt`, `nomorph`, `drowning` (via state tags)

## Properties
No public properties defined at this level. All state-specific data is stored in `inst.sg.statemem`.

## Main functions
No standalone functions are exported or used directly. Functions are defined in local scope for internal state logic and used as callbacks.

## Events & listeners
- **Listens to:**
  - `victory` → transitions to `"victory"` state
  - `cheer` → transitions to `"taunt"` state
  - `onsink` → checks drowning condition and removes the entity if drowning occurs
  - Standard common state events: `locomote`, `freeze`, `electrocute`, `attacked`, `attack`, `death`, `hop`, `sink`, `fallinvoid`, `sleep`, `animover`, `animqueueover`
  - `corpsechomped` (via `CommonHandlers.OnCorpseChomped()`)

- **Pushes:**
  - `victory`, `cheer`, `onsink` (triggered externally, but handled internally)
  - Events from `CommonStates`: `onstatechange`, `sleepexit`, and others defined in `commonstates.lua` (e.g., `locomote`, `attack`, `death`, `corpsechomped`)