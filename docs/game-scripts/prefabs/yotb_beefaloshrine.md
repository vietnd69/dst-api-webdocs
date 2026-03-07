---
id: yotb_beefaloshrine
title: Yotb Beefaloshrine
description: Manages the interactive shrine structure for the Yotb mod, handling offering placement, trading, burning state, and dynamic prize changes during contests.
tags: [trading, structure, burning, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e1cb709d
system_scope: entity
---

# Yotb Beefaloshrine

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotb_beefaloshrine` is a custom structure that serves as a trading and offering point for Beefalo-related mechanics. It transitions between three core states: `EMPTY` (accepts beefalo wool via the `trader` component), `OFFERED` (holds an item, enables prototyping), and `BURNT` (inactive, yields charcoal). It integrates with `workable`, `burnable`, `lootdropper`, `hauntable`, and `prototyper` components. State transitions are triggered by player actions (hammering, offering), environmental events (ignition, extinguishing), and contest events (`yotb_contestenabled`, `yotb_contestfinished`) which dynamically toggle an idol visual.

## Usage example
```lua
local inst = SpawnPrefab("yotb_beefaloshrine")
inst.Transform:SetPosition(x, y, z)

-- Offer a beefalo wool item to enable prototyping
local item = SpawnPrefab("beefalowool")
inst.components.yotb_beefaloshrine.SetOffering ~= nil and inst.components.yotb_beefaloshrine:SetOffering(item) or nil

-- Trigger state change to EMPTY (re-enables trading after hammering or burning)
inst:PushEvent("ondeconstructstructure")
```

## Dependencies & tags
**Components used:** `burnable`, `hauntable`, `inspectable`, `lootdropper`, `prototyper`, `trader`, `workable`, `yotb_stagemanager` (via `TheWorld`).
**Tags:** Adds `structure`, `beefaloshrine`, `prototyper`; checks `burnt`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offering` | `Entity` or `nil` | `nil` | Reference to the item currently placed as an offering. |

## Main functions
### `SetOffering(inst, offering, loading)`
*   **Description:** Installs a new offering item on the shrine, hides the offering in the world, makes the shrine a `prototyper`, and triggers animations. If an offering already exists, it is first dropped.
*   **Parameters:** `offering` (Entity) - the item to place; `loading` (boolean) - if true, suppresses animation and sound cues (used during load).
*   **Returns:** Nothing.
*   **Error states:** Returns early if `offering == inst.offering`.

### `MakeEmpty(inst)`
*   **Description:** Clears the current offering, removes the `prototyper` component, and re-adds the `trader` component to restore the "accept beefalo wool" functionality.
*   **Parameters:** `inst` (Entity) - the shrine entity.
*   **Returns:** Nothing.

### `DropOffering(inst, worker)`
*   **Description:** Removes and returns the current offering to the scene (flinging it if `worker` is provided, otherwise dropping it normally), hides the offering visual, and updates animation state.
*   **Parameters:** `worker` (Entity or `nil`) - optional actor who performed the drop (e.g., hammering); used to fling the offering toward them.
*   **Returns:** Nothing.

### `PrizeChange(inst)`
*   **Description:** Controls visibility of the `idol2` animation layer based on whether a Yotb contest is active or enabled.
*   **Parameters:** `inst` (Entity) - the shrine entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on the `offering` entity) — triggers `MakeEmpty`; `ondeconstructstructure` — calls `DropOffering`; `yotb_contestenabled`, `yotb_contestfinished` — calls `PrizeChange`; `onbuilt` — calls `onbuilt`.
- **Pushes:** None. (Relies on base component events like `onextinguish`, `onburnt`, etc.)