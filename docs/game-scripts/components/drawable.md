---
id: drawable
title: Drawable
description: Manages the visual appearance of an entity by storing and synchronizing image, atlas, and background assets for rendering in the UI or world.
tags: [visuals, rendering, ui]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 86aeee1e
system_scope: ui
---

# Drawable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Drawable` component tracks the visual representation of an entity — specifically, the image, atlas, background image, and background atlas used for rendering. It is typically attached to prefabs that need to be visually represented in menus, minimaps, or UI elements (e.g., character avatars, held items). The component also manages the `"drawable"` tag on the entity and supports serialization for save/load.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("drawable")
inst.components.drawable:SetCanDraw(true)
inst.components.drawable:OnDrawn("avatar_howard", "images/avatar.xml", nil, nil)
if inst.components.drawable:CanDraw() then
    print("Entity is drawable")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds or removes `"drawable"` tag on `self.inst` based on `candraw` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `candraw` | boolean | `true` | Controls whether the entity should be considered drawable (and hold the `"drawable"` tag). |
| `imagename` | string \| nil | `nil` | Name of the primary image asset (e.g., `"avatar_howard"`). |
| `atlasname` | string \| nil | `nil` | Path to the image’s atlas XML file (e.g., `"images/avatar.xml"`). |
| `bgimagename` | string \| nil | `nil` | Name of the background image asset, if any. |
| `bgatlasname` | string \| nil | `nil` | Path to the background image’s atlas XML file. |
| `ondrawnfn` | function \| nil | `nil` | Optional callback invoked when image/atlas properties change. |

## Main functions
### `SetCanDraw(candraw)`
* **Description:** Sets whether the entity should be drawable. Automatically adds or removes the `"drawable"` tag.
* **Parameters:** `candraw` (boolean) — whether the entity is allowed to be rendered as a drawable.
* **Returns:** Nothing.

### `CanDraw()`
* **Description:** Returns the current draw permission status.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `candraw` is set, `false` otherwise.

### `SetOnDrawnFn(fn)`
* **Description:** Registers a callback function to be invoked when image or atlas values change.
* **Parameters:** `fn` (function) — a function with signature `fn(inst, imagename, imagesource, atlasname, bgimagename, bgatlasname)`.
* **Returns:** Nothing.

### `OnDrawn(imagename, imagesource, atlasname, bgimagename, bgatlasname)`
* **Description:** Updates the drawable’s image and atlas properties; triggers the `ondrawnfn` callback only if any value has changed.
* **Parameters:**
  - `imagename` (string \| "") — primary image name; empty string treated as `nil`.
  - `imagesource` (any) — currently unused; pass `nil`.
  - `atlasname` (string \| "") — primary atlas path; empty string treated as `nil`.
  - `bgimagename` (string \| "") — background image name; empty string treated as `nil`.
  - `bgatlasname` (string \| "") — background atlas path; empty string treated as `nil`.
* **Returns:** Nothing.

### `GetImage()`
* **Description:** Returns the currently stored primary image name.
* **Parameters:** None.
* **Returns:** `string \| nil` — the `imagename` property.

### `GetAtlas()`
* **Description:** Returns the currently stored primary atlas path.
* **Parameters:** None.
* **Returns:** `string \| nil` — the `atlasname` property.

### `GetBGImage()`
* **Description:** Returns the currently stored background image name.
* **Parameters:** None.
* **Returns:** `string \| nil` — the `bgimagename` property.

### `GetBGAtlas()`
* **Description:** Returns the currently stored background atlas path.
* **Parameters:** None.
* **Returns:** `string \| nil` — the `bgatlasname` property.

### `OnSave()`
* **Description:** Returns a serializable table with image/atlas data for save game compatibility.
* **Parameters:** None.
* **Returns:** `table \| nil` — a table with keys `image`, `atlas`, `bgimage`, `bgatlas` (only non-`nil` values are included), or `nil` if no image data is set.

### `OnLoad(data)`
* **Description:** Restores image and atlas data from a saved table. Triggers `OnDrawn` internally.
* **Parameters:** `data` (table) — must contain at least `data.image` to be meaningful; may include `data.atlas`, `data.bgimage`, `data.bgatlas`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `candraw` — handled by the `oncandraw` callback to toggle the `"drawable"` tag.
- **Pushes:** None identified.
