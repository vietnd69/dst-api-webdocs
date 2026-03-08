---
id: SGanchor
title: Sganchor
description: Manages the state machine for an anchor entity’s tethered state transitions (raising/lowering) and visual/animation synchronization based on water depth.
tags: [anchor, boat, animation, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 95cbddda
system_scope: entity
---

# Sganchor

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGanchor` is a `StateGraph` that defines all animation-driven states for an anchor entity (e.g., raising, lowering, or maintaining a tethered state). It coordinates with the `anchor` component to control whether the anchor is physically lowering/raising, and dynamically selects animation clips based on `raiseunits` depth thresholds defined in `TUNING.ANCHOR_DEPTH_TIMES`. The state graph is responsible for animating transitions, playing anchor-specific sounds (e.g., `down`, `up`, `mooring` loop), and invoking `SetIsAnchorLowered` to update physics drag on the associated boat.

## Usage example
This stategraph is not directly instantiated by modders; it is automatically assigned to anchor prefabs (e.g., `prefabs/anchor.lua`) via `inst:AddStateGraph("anchor", "SGanchor")`.

A typical internal flow (simplified):
```lua
-- Anchor entity transitions to "lowering" state when told to lower
inst.sg:GoToState("lowering")
-- The SG will detect current depth via `inst.components.anchor.raiseunits`
-- and select appropriate animation/timeline events accordingly.
```

## Dependencies & tags
**Components used:**  
- `anchor` — accessed via `inst.components.anchor` to query `raiseunits`, `is_anchor_transitioning`, and `boat`; calls `SetIsAnchorLowered`.

**Tags:**  
- None explicitly added/removed by this stategraph.

## Properties
No public properties are defined or initialized in this file. State memory is stored in `inst.sg.statemem` (e.g., `depth`, `keepmooring`), and anchor-specific data resides in the `anchor` component.

## Main functions
This is a `StateGraph` definition file — it returns a constructed `StateGraph` object and does not expose public methods. Functions defined within are local callbacks used as `onenter`, `onupdate`, or event handlers for specific states.

### `anchor_lowered(inst)`
* **Description:** Helper function called when the anchor enters or completes a lowered state. Invokes `SetIsAnchorLowered(true)` on the `anchor` component to apply drag to the boat.
* **Parameters:** `inst` (Entity) — the anchor entity instance.
* **Returns:** Nothing.
* **Error states:** Assumes `inst.components.anchor` exists; guarded in comments but currently uncommented.

### `anchor_raised(inst)`
* **Description:** Helper function called when the anchor enters or completes a raised state. Invokes `SetIsAnchorLowered(false)` on the `anchor` component to remove drag from the boat.
* **Parameters:** `inst` (Entity) — the anchor entity instance.
* **Returns:** Nothing.
* **Error states:** Same as `anchor_lowered`.

## Events & listeners
- **Listens to (via `EventHandler` in states):**
  - `lowering_anchor` — triggers transition to `lowering` or `lowering_land`.
  - `raising_anchor` — triggers transition to `raising` or `raising_land`.
  - `workinghit` — triggers anchor-specific hit animations (e.g., `tethered_hit_low`, `untethered_hit`).
  - `animover`, `animqueueover` — used to auto-transition after animations complete.

- **Pushes:**  
  This file does not push any events; it only reacts to externally triggered events.

