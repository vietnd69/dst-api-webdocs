---
id: books_lavaarena
title: Books Lavaarena
description: Creates and configures the Lava Arena-specific spell books (fossil and elemental) with AOE targeting, reticule visuals, and associated prefabs.
tags: [combat, targeting, boss, spell, lavaarena]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e682eea7
system_scope: world
---

# Books Lavaarena

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`books_lavaarena.lua` defines two prefabs—`book_fossil` and `book_elemental`—used as consumable spell items in the Lava Arena event. Each book is configured with AOE targeting support via the `aoetargeting` component and a custom reticule system for visual feedback during item use. The prefabs include animations, sound emitters, and network sync. This file uses a factory pattern (`MakeBook`) to reduce duplication and initializes the reticule behavior globally via `ReticuleTargetFn`.

## Usage example
```lua
-- Within a server-side postinit or event setup
inst:AddComponent("aoetargeting")
inst.components.aoetargeting:SetAllowRiding(false)
inst.components.aoetargeting.reticule.reticuleprefab = "reticuleaoe"
inst.components.aoetargeting.reticule.pingprefab = "reticuleaoeping"
inst.components.aoetargeting.reticule.targetfn = ReticuleTargetFn
inst.components.aoetargeting.reticule.validcolour = { 1, .75, 0, 1 }
inst.components.aoetargeting.reticule.invalidcolour = { .5, 0, 0, 1 }
inst.components.aoetargeting.reticule.ease = true
inst.components.aoetargeting.reticule.mouseenabled = true
```

## Dependencies & tags
**Components used:** `aoetargeting`, `transform`, `animstate`, `soundemitter`, `network`, `inventory`, `weapon`, `rechargeable`  
**Tags:** Adds `book`, `weapon`, `rechargeable` to the entity.  
**Prefabs referenced:** `lavaarena_fossilizing`, `lavaarena_elemental`, `reticuleaoe`, `reticuleaoeping`, `reticuleaoecctarget`, `reticuleaoesummon`, `reticuleaoesummonping`, `reticuleaoesummontarget` (loaded as child assets)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prefabs_fossil` | table of strings | `{"lavaarena_fossilizing", "reticuleaoe", ...}` | List of prefabs required by the fossil book. |
| `prefabs_elemental` | table of strings | `{"lavaarena_elemental", "reticuleaoesummon", ...}` | List of prefabs required by the elemental book. |
| `ReticuleTargetFn` | function | See source | Calculates a valid target position for the reticule in world space. |
| `MakeBook(booktype, reticule, prefabs)` | function | See source | Factory function returning a `Prefab` definition for a book. |

## Main functions
### `ReticuleTargetFn()`
* **Description:** Computes the ground position for the reticule by casting a ray from the player forward up to 7 units. Returns the first passable, unblocked point.
* **Parameters:** None.
* **Returns:** `Vector3` — the calculated world position; defaults to origin `Vector3(0,0,0)` if no valid point found.
* **Error states:** Returns `Vector3(0,0,0)` if all points in the cast are blocked (e.g., by terrain or structures).

### `MakeBook(booktype, reticule, prefabs)`
* **Description:** Builds and returns a Prefab definition for a book type (e.g., `"fossil"` or `"elemental"`), attaching components, animations, tags, and configuring the `aoetargeting` component’s reticule.
* **Parameters:**  
  `booktype` (string) — base name for the book (`"fossil"` or `"elemental"`); used in asset paths.  
  `reticule` (string) — root name for the reticule prefab (e.g., `"reticuleaoe"`).  
  `prefabs` (table of strings) — list of additional prefabs required for the book’s functionality.
* **Returns:** `Prefab` — a fully configured prefab instance.
* **Error states:** None identified; assumes all assets and prefabs exist.

## Events & listeners
- **Listens to:** Server-side: `event_server_data("lavaarena", "prefabs/books_lavaarena")[booktype.."_postinit"](inst)` — a server-only hook used to call a customizable post-init function (not defined in this file).  
- **Pushes:** None.

## Notes
- The `aoetargeting` component’s `reticule` subtable is configured in-place via the returned `Prefab`’s `fn()` closure.
- The `reticule.validcolour` and `reticule.invalidcolour` sets RGBA color arrays used for feedback (valid target = orange-ish; invalid = dark red).
- `SetAllowRiding(false)` ensures the reticule cannot be placed on entities with the `riding` tag.
- Client-side (`TheWorld.ismastersim == false`) returns early with minimal setup, relying on server replication for full state.