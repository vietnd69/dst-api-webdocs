---
id: SGshadowheart_infused
title: Sgshadowheart Infused
description: Defines the state machine for the infused Shadowheart entity, handling movement (hopping), stun/trap states, and interaction with locomotion and inventory systems.
tags: [ai, locomotion, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 3e088b0a
system_scope: ai
---

# Sgshadowheart_infused

> Based on game build **7140014** | Last updated: 2026-03-08

## Overview
`SGshadowheart_infused` implements the state machine for the infused Shadowheart boss entity. It manages core mobility states — particularly the `hop` motion sequence — and integrates with the `locomotor` component for movement control and the `inventoryitem` component to control pick-up behavior during stunned or trapped conditions. The state graph inherits from common idle and hop-post states via `CommonStates` utilities and includes handlers for sinking, falling into void, and external triggers like trapping.

## Usage example
This state graph is constructed and returned by the module and is not manually instantiated. It is registered and used internally by the game when the `shadowheart_infused` prefab is spawned:

```lua
-- Internal usage — do not call directly
return StateGraph("shadowheart_infused", states, events, "idle")
```

The entity using this stategraph will transition through states like `"idle"` → `"hop"` → `"hop_pst"` based on locomotor input, or `"idle"` → `"stunned"` when `trapped` or timeout occurs.

## Dependencies & tags
**Components used:**  
- `locomotor` (calls `StopMoving`, `WalkForward`, `WantsToMoveForward`)  
- `inventoryitem` (reads/writes `canbepickedup` property)  
- `Physics` (via `inst.Physics:Stop()`)  
- `AnimState` (for animation playback)  
- `SoundEmitter` (for hop sound)

**Tags:**  
- States add `moving`, `canrotate`, `busy`, `stunned`, `trapped`.  
- No tags are added/removed at the instance level beyond those managed by state tags.

## Properties
No public properties. This module defines a `StateGraph` and returns it; it does not expose instance variables or mutable state.

## Main functions
This module defines only internal callback functions used within the state definitions. No publicly exposed methods.

### `hop_animover(inst)`
* **Description:** Handles animation-over events during the `"hop"` state to determine the next state (`"hop_pst"` or `"hop"` again depending on `end_hop` flag).  
* **Parameters:** `inst` (Entity) — the instance whose state graph triggered the event.  
* **Returns:** Nothing. Directly calls `inst.sg:GoToState(...)` to transition state.  
* **Error states:** None identified; transitions always succeed if valid state names exist.

## Events & listeners
- **Listens to:**  
  - `CommonHandlers.OnSink()` — triggers sink/washashore handling.  
  - `CommonHandlers.OnFallInVoid()` — triggers sink/washashore handling.  
  - `locomote` — monitors movement intent vs. current state, toggles `"hop"` transitions.  
  - `trapped` — forces transition to `"trapped"` state.  
  - `animover` (within `"hop"` state only) — routes to `hop_animover` callback.

- **Pushes:**  
  - This stategraph itself does not push custom events. It responds to and forwards events internally.