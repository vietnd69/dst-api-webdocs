---
id: driedsalticon
title: Driedsalticon
description: Manages the visibility and overlay image of a dried salt icon on an inventory item in DST's UI and world representation.
tags: [inventory, ui, overlay]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 11d13fe3
system_scope: inventory
---

# Driedsalticon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DriedSaltIcon` controls whether a dried salt visual overlay appears on an inventory item (e.g., dried beefalo, dried meat). It integrates with the `inventoryitem` component to dynamically update the item’s inventory image when the overlay is toggled. The component uses a networked boolean (`showicon`) to synchronize state across the client and server. Master sim (server) logic triggers image updates via `inventoryitem:ChangeImageName`, while clients listen for the `showicondirty` event to update visuals locally.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("driedsalticon")

-- Show dried salt overlay
inst.components.driedsalticon:ShowSaltIcon()

-- Hide dried salt overlay
inst.components.driedsalticon:HideSaltIcon()

-- Optionally override default icon handling
inst.components.driedsalticon:OverrideShowIconFn(function(item)
    item.inv_image_bg = { image = "custom_salt.tex" }
    item.inv_image_bg.atlas = GetInventoryItemAtlas(item.inv_image_bg.image)
end)
```

## Dependencies & tags
**Components used:** `inventoryitem` (via `ChangeImageName`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component belongs to. |
| `ismastersim` | boolean | — | `true` on the server, `false` on clients. |
| `showiconfn` | function \| `nil` | `nil` | Custom function to execute when showing the icon. |
| `hideiconfn` | function \| `nil` | `nil` | Custom function to execute when hiding the icon. |
| `showicon` | `net_bool` | — | Networked boolean controlling icon visibility. |
| `collects` | boolean | `false` | Server-only flag indicating if the item collects salt (settable via `SetCollectsOnDried`). |

## Main functions
### `OverrideShowIconFn(fn)`
*   **Description:** Sets a custom function to be called when the salt icon is shown, overriding the default image setup logic.
*   **Parameters:** `fn` (function) — A callback accepting `inst` as its only argument. Receives the entity instance.
*   **Returns:** Nothing.

### `OverrideHideIconFn(fn)`
*   **Description:** Sets a custom function to be called when the salt icon is hidden, overriding the default cleanup logic.
*   **Parameters:** `fn` (function) — A callback accepting `inst` as its only argument.
*   **Returns:** Nothing.

### `SetCollectsOnDried(collects)`
*   **Description:** Sets the `collects` flag on the server, likely used to track whether salt collection behavior is active.
*   **Parameters:** `collects` (boolean) — Whether the item collects salt.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect on the client.

### `ShowSaltIcon()`
*   **Description:** Sets the `showicon` state to `true` on the server, triggering an immediate visual update via `OnShowIconDirty`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early on clients or if the icon is already visible.

### `HideSaltIcon()`
*   **Description:** Sets the `showicon` state to `false` on the server, triggering removal of the salt icon.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early on clients or if the icon is already hidden.

## Events & listeners
- **Listens to:** `showicondirty` — Triggered by changes to the `showicon` net_bool; invokes `OnShowIconDirty` to update visuals.
- **Pushes:** `imagechange` — Pushed on clients when updating the inventory image (if not master sim).
