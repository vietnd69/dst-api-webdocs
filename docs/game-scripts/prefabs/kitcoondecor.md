---
id: kitcoondecor
title: Kitcoondecor
description: Creates festive decoration prefabs for DST that function as cat toys, activatable structures, and hammerable objects, with burn and loot-drop behavior.
tags: [decoration, cattoy, activatable, hammerable, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d5a1fabe
system_scope: entity
---

# Kitcoondecor

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`kitcoondecor.lua` is a factory script that defines reusable prefabs for decorative items such as festive trees and ornaments. These prefabs combine multiple components: `cattoy` (for interactive play), `activatable` (for player activation via standing action), `workable` (for hammering to harvest), `lootdropper`, and `burnable`. The component functions primarily as a prefab generator and sets up behavior callbacks for these components. It supports seasonal event integration (e.g., Winter's Feast) through loot, and persists burn state via `OnSave`/`OnLoad`.

## Usage example
```lua
-- Automatically invoked by the game when loading this prefab definition.
-- Creates prefabs: kitcoondecor1, kitcoondecor1_kit, kitcoondecor1_kit_placer, etc.
-- Modders can reuse the MakeKitcoonDecor helper to create custom variants:
MakeKitcoonDecor("my_custom_decor", false, 2)
```

## Dependencies & tags
**Components used:** `cattoy`, `workable`, `activatable`, `lootdropper`, `inspectable`, `burnable`, `propagator`, `hauntable`, `snowcovered`.  
**Tags added:** `structure`, `no_hideandseek`, `cattoy` or `cattoyairborne` (depending on `airborne_toy` flag).  
**Tags checked/removed:** `burnt` (during burn handling), and conditionally removed `cattoy` and `activatable` when burnt.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sounds[<prefab>].place` | string | `"yotc_.../place"` | Sound filename for placement animation. |
| `sounds[<prefab>].play{1,2,3}` | string | `"yotc_.../play<#>"` | Sound filenames for play animations. |
| `inst.num_play_states` | number | `3` (for decor1), `2` (for decor2) | Number of distinct play animations to randomly select. |

## Main functions
### `MakeKitcoonDecor(name, airborne_toy, num_play_states)`
* **Description:** Factory function that constructs three prefabs per call: the decoration entity, its deployable kit item, and its placer. Initializes all required components and behavior hooks.
* **Parameters:**  
  - `name` (string) - Base prefab name (e.g., `"kitcoondecor1"`).  
  - `airborne_toy` (boolean) - If true, adds `cattoyairborne` tag; otherwise adds `cattoy`.  
  - `num_play_states` (number) - Number of play animations supported (determines `play_1`, `play_2`, etc.).  
* **Returns:** Nothing (side effect: adds prefabs to the global `decor_prefabs` table).
* **Error states:** No explicit error handling; assumes valid inputs and asset paths.

## Events & listeners
- **Listens to:**  
  - `onbuilt` - Triggers `onbuilt` callback (plays placement animation and sound).  
- **Pushes:** None directly; relies on component-level events (`entity_droploot`, `burnt`, etc.).  

## Components & Callbacks Summary
| Component | Callback/Property | Function |
|-----------|-------------------|----------|
| `cattoy` | `SetOnPlay` | `on_cattoy_play` (anim + sound + return `true`) |
| `activatable` | `OnActivate` | `on_cattoy_activate` (sets inactive, calls `on_cattoy_play`) |
| `workable` | `SetOnWorkCallback` | `on_hammered` (plays `"hit"` anim) |
| `workable` | `SetOnFinishCallback` | `on_finished_hammering` (drops loot, spawns FX, removes entity) |
| `inspectable` | `getstatus` | `get_inspectable_status` (returns `"BURNT"` if applicable) |
| `burnable` | `SetOnBurntFn` | `OnBurnt` (calls `DefaultBurntStructureFn`, removes `cattoy` and `activatable` components) |
| `lootdropper` | `DropLoot` | Uses default logic, with `WINTERS_FEAST` ornament support via `TUNING.WINTERS_FEAST_TREE_DECOR_LOOT` |