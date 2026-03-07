---
id: quagmire_oven
title: Quagmire Oven
description: Manages visual and networked effects for the Quagmire Oven structure, including steam and chimney fire animations synced to gameplay events.
tags: [visual, network, oven, quagmire, fx]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0934d771
system_scope: fx
---

# Quagmire Oven

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The Quagmire Oven is a structure prefab that manages visual feedback (steam and chimney fire animations) in the Quagmire biome. It consists of three linked prefabs: `quagmire_oven` (main body), `quagmire_oven_back` (backplate with no oven parts), and `quagmire_oven_item` (inventory version). It uses networked booleans and events to synchronize visual effects across clients and coordinates highlight children for interaction feedback with nearby entities like the firepit.

## Usage example
```lua
-- Typical usage is internal to the game's structure system; no direct component instantiation by mods.
-- However, to spawn the oven programmatically:
local oven = SpawnPrefab("quagmire_oven")
oven.Transform:SetPosition(x, y, z)
oven:PushEvent("quagmire_oven._steam")  -- triggers steam effect on clients
oven._chimneyfire:value(true)          -- shows chimney fire effect
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `SoundEmitter`, `Network` (via `entity:AddX()` calls)
**Tags:** Adds `FX`, `NOCLICK` to FX entities; main entity uses `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_steam` | net_event | `net_event(GUID, "quagmire_oven._steam")` | Networked event to trigger steam effects. |
| `_chimneyfire` | net_bool | `net_bool(GUID, "quagmire_oven._chimneyfire", "chimneyfiredirty")` | Networked boolean controlling chimney fire visibility. |
| `chimneyfirefx` | Entity | Created via `CreateChimneyFire()` | FX entity for chimney fire animation. |
| `OnRemoveEntity` | function | `OnRemoveEntity` | Callback to clean up highlight children on removal. |

## Main functions
### `CreateChimneyFire()`
*   **Description:** Creates and configures a non-persistent FX entity for the chimney fire animation.
*   **Parameters:** None.
*   **Returns:** `fx` (Entity) — entity with `AnimState`, `Transform`, initialized to hidden state playing `chimney_fire` looped animation.
*   **Error states:** Returns `nil` only if `CreateEntity()` fails (not documented).

### `OnBakeSteam(inst)`
*   **Description:** Spawns a transient steam FX entity at the oven's location and plays cooking sounds when triggered via network event.
*   **Parameters:** `inst` (Entity) — the oven entity invoking the function (not used beyond getting position).
*   **Returns:** Nothing.
*   **Error states:** No known edge cases; creates a standalone non-persistent FX entity.

### `AddHighlightChildren(inst, target)`
*   **Description:** Adds the oven or oven back entity to a `highlightchildren` array on a target entity (e.g., firepit) for highlighting logic.
*   **Parameters:** `inst` (Entity) — oven or oven_back entity; `target` (Entity) — parent entity (must be `firepit` for effective behavior).
*   **Returns:** Nothing.
*   **Error states:** Only processes if `target.prefab == "firepit"`.

### `OnRemoveEntity(inst)`
*   **Description:** Removes the oven and oven back (if present) from the parent's `highlightchildren` array on removal, and cleans up empty `highlightchildren`.
*   **Parameters:** `inst` (Entity) — the oven or oven_back entity being removed.
*   **Returns:** Nothing.
*   **Error states:** Safely handles missing or empty `highlightchildren` arrays.

## Events & listeners
- **Listens to:**  
  - `"quagmire_oven._steam"` — triggers steam effect on clients.  
  - `"chimneyfiredirty"` — toggles chimney fire visibility on clients.  
  - `"animover"` — on FX entity, removes itself after steam animation completes.
- **Pushes:**  
  - `OnBakeSteam` internally plays sounds but does not push events.  
  - `OnChimneyFireDirty` triggers visual update but does not push events.  
  *(Note: This prefab does not push custom events itself; it only consumes network events.)*