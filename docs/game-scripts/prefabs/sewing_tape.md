---
id: sewing_tape
title: Sewing Tape
description: A stackable inventory item used for repairing boats via the sewing system, providing a fixed amount of repair value.
tags: [crafting, inventory, boat, repair]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b7bb65c5
system_scope: inventory
---

# Sewing Tape

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sewing_tape` is a consumable inventory item that serves as a reusable repair tool for boats. When used via the sewing UI, it applies a fixed repair amount to a boat and triggers a repair event on the user. It leverages the `boatpatch`, `stackable`, and `sewing` components to integrate into the game’s crafting and repair systems. It is tagged as both `tape` and `boat_patch` for identification and interaction filtering.

## Usage example
```lua
local tape = SpawnPrefab("sewing_tape")
tape.components.stackable:SetSize(5)  -- stack up to 5
tape.components.sewing: SewOn(tape, boat_inst, player_inst)
-- The `onsewn` callback fires, and `player_inst` receives a "repair" event
```

## Dependencies & tags
**Components used:** `boatpatch`, `stackable`, `sewing`, `inspectable`, `inventoryitem`, `hauntable_launch`  
**Tags:** Adds `tape`, `boat_patch`; no dynamic tag modifications occur.

## Properties
No public properties are defined directly in the constructor. Property customization occurs via component assignments (e.g., `inst.components.boatpatch.patch_type = "tape"`).

## Main functions
Not applicable — this is a prefab, not a component. All behavior is handled by attached components (`boatpatch`, `sewing`, etc.).

## Events & listeners
- **Listens to:** None directly in this file.  
- **Pushes:** None directly in this file.  
  - However, via `inst.components.sewing.onsewn = onsewn`, when `SewOn` is called on the `sewing` component, it triggers the `onsewn` callback, which internally calls `doer:PushEvent("repair")`.
- **Note:** The `onsewn` callback (defined in this file) triggers a `"repair"` event on the entity performing the sewing (`doer`), but this event is not registered or handled within this file itself.