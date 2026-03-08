---
id: SGcatcoon
title: Sgcatcoon
description: Manages state transitions and animation logic for the Catcoon entity, including walking, idling, hairball vomiting, pouncing attacks, and rain-triggered homing behavior.
tags: [locomotion, combat, animation, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: fca0ed8b
system_scope: ai
---

# Sgcatcoon

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcatcoon` is the state graph controlling the behavior and animations of the Catcoon entity. It defines states for movement (`idle`, `walk_*`), interaction (`gohome`, `hairball`, `pawground`), combat (`pounceattack`, `pounceplay`, `attack`), and event responses (e.g., raining triggers `gohome_raining`). It integrates closely with the `combat`, `locomotor`, `health`, and `follower` components to handle attacks, movement, and interaction with leaders/gifts.

## Usage example
This state graph is automatically applied to the Catcoon prefab during entity creation. Modders typically do not instantiate it directly but may extend or override states using `CommonStates` helper functions.

```lua
-- Example: Modder adds a custom state after Catcoon is constructed
inst:ListenForEvent("hairball", function(inst) print("Catcoon is about to vomit!") end, inst)
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`, `health`, `follower`, `inventoryitem`, `weighable`, `unwrappable`  
**Tags:** `idle`, `canrotate`, `moving`, `busy`, `hairball`, `jumping`, `attack`

## Properties
No public properties are initialized directly in this file. State memory (e.g., `inst.target`, `inst.numretches`, `inst.hairballfollowup`) is stored on `inst` as instance variables.

## Main functions
### `State{name = "gohome_raining", ...}`
*   **Description:** Initiates a rain-specific homing animation sequence. Stops physics and plays taunt animations.
*   **Parameters:** None (state constructor).
*   **Returns:** Nothing (part of state definition).

### `State{name = "hairball", ...}`
*   **Description:** Manages the hairball vomiting sequence: spawns the vomit item, adjusts its position/orientation, applies leader overrides, and optionally picks it back up.
*   **Parameters:** None (state constructor).
*   **Returns:** Nothing (part of state definition).
*   **Error states:** Vomit spawning can fail silently if `inst:PickRandomGift(...)` returns `nil`.

### `State{name = "pounceattack", ...}`
*   **Description:** Handles a jumping melee attack. Applies motor velocity override, triggers combat `DoAttack`, and conditionally plays `hiss` post-attack if target is a `smallcreature`.
*   **Parameters:** Accepts `target` passed to state via `GoToState("pounceattack", target)`.
*   **Returns:** Nothing (part of state definition).

### `State{name = "pounceplay", ...}`
*   **Description:** Handles a non-lethal pounce interaction (e.g., with toys or birds). May trigger a successful attack depending on target tags, distance, and chance.
*   **Parameters:** Accepts `target` passed to state.
*   **Returns:** Nothing (part of state definition).
*   **Error states:** Attack success depends on RNG and distance checks; may complete without `DoAttack` if thresholds aren't met.

## Events & listeners
- **Listens to:** `doattack`, `animover`, `animqueueover`, `animqueueover`, `death`, `freeze`, `electrocute`, `attacked`, `sleep`, `locomote`, `hop`, `sink`, `fallinvoid`, `corpsechomped`, and common handlers from `commonstates.lua`.
- **Pushes:** Events via `inst:PushEvent("wrappeditem", ...)`, `threatnear`, and internal state transitions via `sg:GoToState(...)`.