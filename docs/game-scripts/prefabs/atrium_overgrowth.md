---
id: atrium_overgrowth
title: Atrium Overgrowth
description: A static environmental prop that displays incremental lore lines when examined by players wearing ancient_reader gear, while granting a large sanity aura penalty and saving/loading story progression state.
tags: [lore, environment, sanity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7bd3031d
system_scope: environment
---

# Atrium Overgrowth

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `atrium_overgrowth` prefab represents a static, immobile environmental object placed in the Atrium area (likely the Ruins or Grotto zones) that serves as a lore delivery mechanism. It displays one of five pre-defined story lines sequentially when inspected by a player wearing an item tagged with `"ancient_reader"`. It also acts as a sanity sink, applying a large negative sanity aura, and supports persistent story state across saves. This prefab is built using core entity components including `transform`, `animstate`, `soundemitter`, `minimapentity`, and `network`, with additional behavior injected via the `inspectable` and `sanityaura` components.

## Usage example
```lua
-- Instantiate an Atrium Overgrowth entity (typically handled by worldgen)
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddMiniMapEntity()
inst.entity:AddNetwork()

inst:AddTag("ancient_text")
inst.AnimState:SetBuild("atrium_overgrowth")
inst.AnimState:PlayAnimation("idle")

-- Attach inspectable and sanity aura components
inst:AddComponent("inspectable")
inst:AddComponent("sanityaura")
inst.components.sanityaura.aura = -TUNING.SANITYAURA_SUPERHUGE

-- Assign custom inspect handlers for story progression
inst.components.inspectable.getstatus = function(inst) ... end
inst.components.inspectable.descriptionfn = function(inst, viewer) ... end
```

## Dependencies & tags
**Components used:**  
- `sanityaura` (sets `aura` property)  
- `inspectable` (overrides `getstatus` and `descriptionfn` handlers)  

**Tags:**  
- Adds `"ancient_text"` to the entity.  
- Checks `"ancient_reader"` on the inspecting viewer’s inventory (via `EquipHasTag`).  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `storyprogress` | number | `nil` (initially) | Current story line number (1 to `NUM_STORY_LINES`). Persisted across saves. |
| `animstate` (via `AnimState`) | read-only | `nil` | Provides animation state for the overlay’s visual representation. |
| `minimapicon` (via `MiniMapEntity`) | read-only | `nil` | Set to `"atrium_overgrowth.png"` for minimap display. |

## Main functions
### `rune_AdvanceStory(inst)`
* **Description:** Internal helper that advances the global `_storyprogress` counter and assigns it to `inst.storyprogress`. Ensures sequential cycling through story lines.
* **Parameters:** `inst` (entity) — the overgrowth instance being inspected.
* **Returns:** Nothing.
* **Error states:** Uses modulo arithmetic to wrap `1..NUM_STORY_LINES` if `inst.storyprogress` is `nil`, otherwise increments it.

### `rune_getstatus(inst)`
* **Description:** Implements `inspectable.getstatus`. Advances the story line and returns `nil` (indicating no short status line is displayed).
* **Parameters:** `inst` (entity).
* **Returns:** `nil`.

### `rune_getdescription(inst, viewer)`
* **Description:** Implements `inspectable.descriptionfn`. Returns a localized story line string if the viewer has an item tagged `"ancient_reader"`. Advances the story on successful inspection.
* **Parameters:**  
  - `inst` (entity) — the overgrowth instance.  
  - `viewer` (entity) — the inspecting player character.  
* **Returns:** A localized string key such as `STRINGS.ATRIUM_OVERGROWTH.LINE_3`, or `nil` if viewer lacks `"ancient_reader"` or story lines are exhausted.
* **Error states:** No active error handling; relies on `STRINGS.ATRIUM_OVERGROWTH` table being populated.

### `rune_onsave(inst, data)`
* **Description:** Saves current story state for persistence.
* **Parameters:**  
  - `inst` (entity) — the overgrowth instance.  
  - `data` (table) — the save data table passed by `TheSim:Save()`.  
* **Returns:** Nothing.

### `rune_onload(inst, data)`
* **Description:** Restores saved story state on load; ensures global `_storyprogress` is at least as high as the loaded value.
* **Parameters:**  
  - `inst` (entity) — the overgrowth instance.  
  - `data` (table) — the loaded save data.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly (uses object callbacks like `inst.OnSave`, `inst.OnLoad`).
- **Pushes:** None.

## Special considerations
- **Network sync:** `entity:AddNetwork()` is used for persistence, but the component itself is not designed for frequent real-time replication. Only master simulation runs the `inspectable` and `sanityaura` component logic.
- **Story state:** A shared global `_storyprogress` is used across *all* overgrowth instances to ensure sequential progression of the narrative, rather than per-instance tracking.
- **Deprecated alternative:** A second prefab, `atrium_idol`, is also registered but explicitly marked as deprecated in this file. Modders should use `atrium_overgrowth`.