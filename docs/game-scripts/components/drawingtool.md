---
id: drawingtool
title: Drawingtool
description: Facilitates the selection and application of drawable assets from nearby entities during a drawing action.
tags: [inventory, drawing, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 73948193
system_scope: entity
---

# Drawingtool

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DrawingTool` enables an entity (typically a tool or character) to locate a nearby drawable entity and retrieve its visual representation (image, atlas, background image, etc.) for rendering. It works in conjunction with the `inventoryitem` and `drawable` components to support dynamic visual customization. The component handles the logic of identifying a valid target within range and extracting the necessary asset identifiers for the draw operation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("drawingtool")
inst:AddComponent("inventoryitem")

inst.components.drawingtool:SetOnDrawFn(function(downer, target, image, src, atlas, bgimage, bgatlas)
    print("Drawing", image, "on", target)
end)

-- When performing the draw action:
local image, target, atlas, bgimage, bgatlas = inst.components.drawingtool:GetImageToDraw(targetEntity, inst)
if image then
    inst.components.drawingtool:Draw(targetEntity, image, src, atlas, bgimage, bgatlas)
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `drawable`  
**Tags:**  
- `TODRAW_MUST_TAGS = {"_inventoryitem"}` — Entities must have this tag to be considered.  
- `TODRAW_CANT_TAGS = {"INLIMBO", "notdrawable"}` — Entities with these tags are excluded.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ondrawfn` | function (optional) | `nil` | Callback fired when a successful draw operation completes. Signature: `fn(downer, target, image, src, atlas, bgimage, bgatlas)`. |

## Main functions
### `SetOnDrawFn(fn)`
* **Description:** Sets a custom callback function to be invoked after a successful `Draw` call.
* **Parameters:**  
  `fn` (function or `nil`) — Function to be called with parameters `(downer, target, image, src, atlas, bgimage, bgatlas)`. Set to `nil` to clear.
* **Returns:** Nothing.

### `GetImageToDraw(target, doer)`
* **Description:** Searches for a drawable entity near `target` and extracts its visual asset identifiers. Must be called before `Draw`.
* **Parameters:**  
  `target` (Entity or `nil`) — The original target entity (e.g., the user of the tool or the main interaction point).  
  `doer` (Entity) — The entity performing the action (used for context-sensitive overrides).  
* **Returns:**  
  - `image` (string or `nil`) — Image name to draw.  
  - `ent` (Entity or `nil`) — The selected drawable entity (target of drawing).  
  - `atlas` (string or `nil`) — Atlas name for the image.  
  - `bgimage` (string or `nil`) — Optional background image name.  
  - `bgatlas` (string or `nil`) — Optional background atlas name.  
* **Error states:** Returns `nil` if no suitable entity is found, or if `target` is `nil`.

### `Draw(target, image, src, atlas, bgimage, bgatlas)`
* **Description:** Applies the provided visual assets to the `target` entity using its `drawable` component. Triggers the `ondrawfn` callback if set.
* **Parameters:**  
  `target` (Entity or `nil`) — Entity to receive the drawn assets.  
  `image` (string or `nil`) — Image name.  
  `src` (string or `nil`) — Source context (not used internally, passed to `OnDrawn`).  
  `atlas` (string or `nil`) — Atlas name for the image.  
  `bgimage` (string or `nil`) — Background image name.  
  `bgatlas` (string or `nil`) — Background atlas name.  
* **Returns:** Nothing.
* **Error states:** No-op if `target` is `nil` or lacks the `drawable` component.

## Events & listeners
- **Listens to:** None (uses `inst:ListenForEvent` internally in other components).
- **Pushes:** None (draw operation is synchronous and event-driven via callbacks).
