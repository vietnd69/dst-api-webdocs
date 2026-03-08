---
id: SGshadowtentacle
title: Sgshadowtentacle
description: Defines the state machine and animation logic for the Shadow Tentacle entity, handling idle, taunt, attack, and death states with combat-triggered transitions.
tags: [ai, combat, animation, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 0dbe24d8
system_scope: entity
---

# Sgshadowtentacle

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadowtentacle` is the stategraph responsible for governing the behavior and animation flow of the Shadow Tentacle entity. It defines sequential states (`idle`, `taunt`, `attack_pre`, `attack`, `attack_post`, `death`) that control movement, attack timing, and death reaction. The stategraph integrates with the `combat` component to respond to combat events like `newcombattarget` and coordinate attacks via custom `DoAttack` logic, which also forwards aggro to the tentacle's owner under specific conditions.

## Usage example
```lua
-- The stategraph is automatically applied when a Shadow Tentacle entity is created.
-- As a stategraph definition, it is not instantiated directly in mod code.
-- However, modders may extend or override it by:
-- 1. Creating a new stategraph with the same name.
-- 2. Using 'override' scripts in modmain.lua if necessary.
-- Example of listening for its events in a prefab's logic:
inst:ListenForEvent("death", function(inst) print("Tentacle died!") end)
```

## Dependencies & tags
**Components used:** `combat`
**Tags added:** `idle`, `invisible`, `taunting`, `attack`, `busy`
**Tags checked:** None explicitly — tags are used with `HasStateTag` internally.

## Properties
No public properties

## Main functions
### `DoAttack(inst)`
* **Description:** Performs an attack action using the `combat` component and conditionally redirects the target’s attention from the tentacle back to the tentacle’s owner. This function is scheduled via `FrameEvent` during the `attack` state.
* **Parameters:** `inst` (entity) — the Shadow Tentacle instance.
* **Returns:** Nothing.
* **Error states:** May have no effect if `inst.components.combat.target` is `nil`, or if owner/target components are missing.

## Events & listeners
- **Listens to:**
  - `death` — triggers transition to the `death` state.
  - `newcombattarget` — if currently idle, transitions to `taunt` state.
  - `animover` — triggers transitions to `attack_post` (in `taunt` state) or entity removal (in `death` state).
  - `animqueueover` — triggers transition from `attack` to `attack_post`.
- **Pushes:** None directly — events are handled internally by state transitions.