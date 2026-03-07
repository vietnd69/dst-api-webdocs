---
id: decor_pictureframe
title: Decor Pictureframe
description: A decorative furniture item that can display a drawn image, supporting dynamic texture updates and state persistence.
tags: [furniture, decoration, drawing, inventory]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e9ee7a55
system_scope: inventory
---

# Decor Pictureframe

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `decor_pictureframe` prefab represents a wall-mounted picture frame that can display a drawn image. It integrates with the `drawable`, `inventoryitem`, and `burnable` components to manage display state, visual representation, and fire interaction. When an image is drawn on the frame, it overrides its in-game texture and dynamically updates its display name and inventory icon. The frame supports saving/loading of the drawn image name and responds to state changes such as burning or extinguishing.

## Usage example
```lua
local frame = SpawnPrefab("decor_pictureframe")
frame.Transform:SetPosition(x, y, z)
frame.components.drawable:Draw(image_name, source_prefab)
```

## Dependencies & tags
**Components used:** `drawable`, `furnituredecor`, `inspectable`, `inventoryitem`, `burnable`, `hauntable`, `smallpropagator`  
**Tags:** Adds `drawable` and `furnituredecor`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_imagename` | `net_string` | `""` | Networked string storing the name of the currently drawn item (e.g., `"wood"`). Updated via `SetImageNameAndIcon()`. |
| `displaynamefn` | function | `item_frame_displaynamefn` | Callback used to compute the display name based on the drawn image. |
| `RefreshImage` | function | `RefreshImage` | Public function to manually refresh the inventory icon; used by `prefabskin.lua`. |

## Main functions
### `SetImageNameAndIcon(inst, name)`
*   **Description:** Updates the internal `_imagename` value and triggers updates to the display name override, inventory icon, and animation symbol overrides. Called internally on draw/clear and save/load.
*   **Parameters:** `name` (string) – Name of the drawn item (e.g., `"wood"`), or `""` to clear the image.
*   **Returns:** Nothing.

### `RefreshImage(inst)`
*   **Description:** Refreshes the inventory item’s `imagename` property to reflect the current drawing state. Ensures the inventory icon matches the animated display state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `item_frame_ondrawn(inst, image, src, atlas, bgimage, bgatlas)`
*   **Description:** Callback set on the `drawable` component. Handles visual updates when an image is drawn or cleared: sets/resets animation symbol overrides (`SWAP_SIGN`, `SWAP_SIGN_BG`), toggles draw state (`candraw`), and updates display metadata.
*   **Parameters:**
    *   `image` (string? or table?) – Name of the drawn image or `nil` when cleared.
    *   `src` (Entity or nil) – The source entity that provided the drawn image, used for its `drawnameoverride` or display name.
    *   `atlas`, `bgatlas` (string?) – Optional custom atlas paths.
    *   `bgimage` (string? or nil) – Optional background image name.
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Provides the current status string for use in the inspection UI. Returns `"UNDRAWN"` if no image is currently displayed; otherwise returns `nil`.
*   **Parameters:** None.
*   **Returns:** `"UNDRAWN"` (string) if undrawn, or `nil`.

## Events & listeners
- **Listens to:** `imagenamedirty` (client-side only) – triggers `OnImageNameDirty()` to update `drawnameoverride` on non-master simulations.
- **Pushes:** None directly; relies on `inventoryitem:ChangeImageName()` which fires `imagechange`.