---
id: quagmire_portal
title: Quagmire Portal
description: A non-interactive environmental decoration prefab that renders the Quagmire portal structure and manages its camera focus behavior.
tags: [environment, decoration, camera]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e1444f87
system_scope: environment
---

# Quagmire Portal

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_portal` prefab is a non-simulating environmental decoration that visually represents the portal structure in the Quagmire biome. It includes associated FX prefabs (`quagmire_portal_activefx`, `quagmire_portal_bubblefx`, and player-drip variants) and manages optional camera focus behavior via the `focalpoint` component. It does not possess game logic simulation on dedicated servers and is intended purely for visual presentation.

## Usage example
This prefab is instantiated internally by the game engine during world generation and is not typically added directly by mods.

```lua
-- Standard instantiation occurs via Prefab() system; example of focus usage:
inst:PushEvent("camerafocusdirty")  -- Triggers camera focus update if _camerafocus is true
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`, `focalpoint` (via `TheFocalPoint.components.focalpoint`)
**Tags:** `groundhole`, `blocker`, `DECOR`, `NOCLICK`, `scarytoprey`, `birdblocker`
**Prefabs referenced:** `quagmire_portal_activefx`, `quagmire_portal_bubblefx`, `quagmire_portal_player_fx`, `quagmire_portal_playerdrip_fx`, `quagmire_portal_player_splash_fx`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_camerafocus` | `net_bool` | `false` | Networked boolean indicating whether the portal should be a camera focus source. |

## Main functions
### `OnCameraFocusDirty(inst)`
* **Description:** Callback triggered when the `_camerafocus` value changes; registers or deregisters this entity as a camera focus source with the `focalpoint` component.
* **Parameters:** `inst` (Entity) — the portal instance whose focus state changed.
* **Returns:** Nothing.
* **Error states:** Uses `nil` as the focus target (defaults to `source` in `StartFocusSource`).

## Events & listeners
- **Listens to:** `camerafocusdirty` — fired when `_camerafocus` changes; triggers `OnCameraFocusDirty`.
- **Pushes:** None directly (relies on external systems like `focalpoint` for side effects).

## Additional notes
- The `CreateDropShadow` function constructs a separate non-networked decoration entity with build `quagmire_portal_base` for client-side visual depth; it is excluded on dedicated servers.
- The portal prefab is marked as non-persistent (`persists = false`) for the active and bubble FX prefabs, and `entity:SetPristine()` is used to ensure initial state consistency across clients.
- Player FX prefabs (`quagmire_portal_player_fx`, etc.) are declared in `prefabs` but not instantiated in this file — likely created at runtime elsewhere (e.g., during player entry/exit logic).