---
id: cookpot
title: Cookpot
description: Manages cooking state, interactions, and loot generation for the Crock Pot structure in DST.
tags: [crafting, container, stewer, loot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e3fcfb8f
system_scope: crafting
---

# Cookpot

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `cookpot` prefab implements the Crock Pot structure, which allows players to prepare complex dishes using the stewer component. It integrates multiple systems: cooking state management (`stewer`), item storage (`container`), player interaction (`workable`), fire/fire-extinguishing behavior (`burnable`), and loot generation upon destruction (`lootdropper`). The prefab handles cooking animations, sound feedback, and integration with the inspects UI and scrapbook. It supports two variants: the standard `cookpot` and the `archive_cookpot` (used in the archive/modded worldgen).

## Usage example
```lua
local cookpot = SpawnPrefab("cookpot")
cookpot.Transform:SetPosition(x, y, z)

-- Start cooking (requires ingredients first)
cookpot.components.container:GiveItem(SpawnPrefab("meat"))
cookpot.components.container:GiveItem(SpawnPrefab("egg"))
cookpot.components.stewer:StartCooking("meatball_stew")
```

## Dependencies & tags
**Components used:** `burnable`, `container`, `hauntable`, `inspectable`, `lootdropper`, `stewer`, `workable`, `light`, `soundemitter`, `animstate`, `minimapentity`, `transform`, `network`  
**Tags added:** `structure`, `stewer`  
**Tags checked:** `burnt`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.Light:Enable(false)` | boolean | `false` | Initial light state (disabled). |
| `inst.Light:SetRadius(.6)` | number | `0.6` | Light radius in world units. |
| `inst.Light:SetIntensity(.5)` | number | `0.5` | Light intensity (brightness). |
| `inst.Light:SetColour(...)` | color | `(235/255,62/255,12/255)` | Warm orange light color. |
| `inst.scrapbook_specialinfo` | string | `"CROCKPOT"` | Category label shown in scrapbook. |
| `inst.scrapbook_speechstatus` | string | `"EMPTY"` | Dynamic status displayed in scrapbook (see `getstatus`). |
| `inst.entity:SetPristine()` | boolean | `true` | Ensures network synchronization is based on pristine state. |
| `inst.components.container.skipclosesnd` | boolean | `true` | Suppress default close sound; custom handled. |
| `inst.components.container.skipopensnd` | boolean | `true` | Suppress default open sound; custom handled. |
| `inst.components.hauntable.hauntvalue` | number | `TUNING.HAUNT_TINY` | Haunt value for ghost interactions. |

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Handles the player hitting (hammering) the cookpot. If burning, extinguishes fire; if cooking/done, immediately harvests product; drops all container contents and loot; spawns a debris effect; and removes the cookpot entity.
*   **Parameters:** `inst` (Entity) - the cookpot instance; `worker` (Entity) - the hammering player/entity.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Plays appropriate animation and sound feedback when the cookpot is hit during interaction (e.g., clicking it with hands). Cycle depends on cooking state: cooking (`hit_cooking`), done (`hit_full`), or empty (`hit_empty`). Closes container if open.
*   **Parameters:** `inst` (Entity) - the cookpot instance; `worker` (Entity) - the interacting player/entity.
*   **Returns:** Nothing.

### `startcookfn(inst)`
*   **Description:** Callback triggered when cooking starts. Plays looping `cooking_loop` animation, kills previous sounds, starts rattle sound, and enables the cookpot light.
*   **Parameters:** `inst` (Entity) - the cookpot instance.
*   **Returns:** Nothing.

### `donecookfn(inst)`
*   **Description:** Callback triggered when cooking finishes. Plays post-animation, transitions to `idle_full`, shows product symbol via `ShowProduct`, stops rattle sound, plays finish sound, and disables light.
*   **Parameters:** `inst` (Entity) - the cookpot instance.
*   **Returns:** Nothing.

### `continuedonefn(inst)`
*   **Description:** Callback triggered after a cookpot that is done is re-opened. Restores `idle_full` animation and updates product symbol.
*   **Parameters:** `inst` (Entity) - the cookpot instance.
*   **Returns:** Nothing.

### `SetProductSymbol(inst, product, overridebuild)`
*   **Description:** Configures the visual representation of the cooked product using override symbols and pot-level indicators (low/mid/high). Reads `recipe.potlevel` and `recipe.overridebuild` from `cooking.lua`.
*   **Parameters:** `inst` (Entity) - the cookpot instance; `product` (string) - product prefab name; `overridebuild` (string?) - optional override animation build.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns a human-readable status string for UI (e.g., scrapbook, inspections). Evaluates state in order of precedence: `BURNT`, `DONE`, `EMPTY`, `COOKING_LONG` (>15s remaining), or `COOKING_SHORT`.
*   **Parameters:** `inst` (Entity) - the cookpot instance.
*   **Returns:** `string` - one of `"BURNT"`, `"DONE"`, `"EMPTY"`, `"COOKING_LONG"`, `"COOKING_SHORT"`.

## Events & listeners
- **Listens to:** `onbuilt` - triggers `onbuilt` callback to play place animation and craft sound.
- **Pushes:** `onextinguish`, `onclose`, `onopen` (via nested components like `burnable` and `container`).
- **Saved/loaded:** `onsave` stores `burnt` state; `onload` restores burnt state by invoking `burnable.onburnt`; `onloadpostpass` restores container contents (`data.additems`).