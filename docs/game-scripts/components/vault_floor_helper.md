---
id: vault_floor_helper
title: Vault Floor Helper
description: Tracks the active position and state of a vault arena floor region, enabling point-in-room checks for client-side collision and rendering.
tags: [arena, vault, map]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cb3ba120
system_scope: map
---
# Vault Floor Helper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`vault_floor_helper` is a network-synchronized component that stores the origin and active state of the vault arena floor region in the world. It is used to determine whether a given world point lies within the vault's floor boundaries, primarily to prevent player entities from falling into the abyss during arena phases. The component delegates the actual point-in-room queries to `Map:IsPointInVaultRoom`, which consumes the stored origin and flags.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("vault_floor_helper")

-- When the vault arena is activated and positioned:
local marker = CreateEntity()
marker.Transform:SetPosition(x, y, z)
inst.components.vault_floor_helper:TryToSetMarker(marker)

-- Later, elsewhere in code (e.g., Map or physics):
if TheWorld.Map:IsPointInVaultRoom(x, y, z) then
    -- Entity is safely within the vault floor region
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `vault_active` | `net_bool` | `false` | Networked flag indicating whether the vault floor region is currently active. |
| `vault_origin_x` | `net_float` | `0` | Networked X coordinate (world space) of the vault center origin. |
| `vault_origin_z` | `net_float` | `0` | Networked Z coordinate (world space) of the vault center origin. |
| `marker` | entity or `nil` | `nil` | Internal reference to the marker entity used to set the vault origin; used for cleanup. |

## Main functions
### `IsPointInVaultRoom_Internal(x, y, z)`
*   **Description:** Internal helper used by `Map:IsPointInVaultRoom` to check if a point lies within the vault floor region. The region is defined as the union of three overlapping rectangles: a wide horizontal bar, a tall vertical bar, and a central square — matching the `vault_vault` static layout geometry. *Do not call directly*; use `Map:IsPointInVaultRoom`.
*   **Parameters:**
    *   `x` (number) — world X coordinate.
    *   `y` (number) — world Y coordinate (unused in the check).
    *   `z` (number) — world Z coordinate.
*   **Returns:** `true` if the point lies inside any of the three overlapping rectangles, otherwise `false`.
*   **Error states:** Returns `false` immediately if `vault_active:value()` is `false`.

### `TryToSetMarker(inst)`
*   **Description:** Sets or updates the vault origin from an existing marker entity's world position. If another marker is already assigned, the new marker is removed (cleanup logic). Used during arena setup or world load.
*   **Parameters:** `inst` (entity) — the marker entity whose position defines the vault origin.
*   **Returns:** Nothing.
*   **Error states:** Returns early (with no effect) if `self.marker` is already equal to `inst`. If `self.marker` already exists, the new `inst` is immediately destroyed.

## Events & listeners
- **Listens to:** `onremove` — registered on the marker entity; clears the marker reference and deactivates the vault state (`vault_active`, `vault_origin_x`, `vault_origin_z` are reset).
- **Pushes:** None.
