---
id: drawingtool
title: Drawingtool
description: This component enables an entity to identify an item's visual data and apply it to a target entity for display.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 73948193
---

# Drawingtool

## Overview
The `DrawingTool` component provides functionality for an entity to "draw" or display the image of another item (the "source") onto a target entity. It handles the logic for finding a suitable source item, extracting its visual information (image, atlas, background image), and then instructing the target entity's `drawable` component to display this information. This component is typically used for items like signs or frames that display other items.

## Dependencies & Tags
This component relies on other components being present on the target or source entities:
*   **Target Entity:** Requires the `drawable` component to actually display the image.
*   **Source Entity:**
    *   Requires the `inventoryitem` component to retrieve `imagename` and `atlasname`.
    *   May have `drawimageoverride` and `drawatlasoverride` functions/values to customize its displayed image.
    *   May have `inv_image_bg` table for background image details.

The global helper function `FindEntityToDraw` which is used by this component, filters entities based on the following tags:
*   **Must include:** `_inventoryitem`
*   **Cannot include:** `INLIMBO`, `notdrawable`

## Properties
| Property     | Type       | Default Value | Description                                                    |
| :----------- | :--------- | :------------ | :------------------------------------------------------------- |
| `self.inst`  | `Entity`   | `inst`        | The entity instance this component is attached to.             |
| `ondrawfn`   | `function` | `nil`         | An optional callback function to be invoked when drawing occurs. |

## Main Functions
### `SetOnDrawFn(fn)`
*   **Description:** Sets a callback function that will be executed after the drawing operation is completed by the target entity.
*   **Parameters:**
    *   `fn`: (`function`) The function to call, which will receive `(tool_inst, target, image, src, atlas, bgimage, bgatlas)` as arguments.

### `GetImageToDraw(target, doer)`
*   **Description:** Identifies a suitable entity to draw based on a given target and retrieves its visual assets (image, atlas, background image). This function leverages the global `FindEntityToDraw` to find a source entity.
*   **Parameters:**
    *   `target`: (`Entity`) The primary target entity, often the one being interacted with.
    *   `doer`: (`Entity`) The entity performing the action (e.g., the player).
*   **Returns:** `image`, `src_entity`, `atlas`, `bgimage`, `bgatlas`.
    *   `image`: (`string`) The name of the image to draw (e.g., "inventory/imagename.tex").
    *   `src_entity`: (`Entity`) The actual entity from which the image data was sourced.
    *   `atlas`: (`string`) The atlas path for `image`.
    *   `bgimage`: (`string`) The name of a background image to draw (if any).
    *   `bgatlas`: (`string`) The atlas path for `bgimage`.

### `Draw(target, image, src, atlas, bgimage, bgatlas)`
*   **Description:** Instructs the `drawable` component of the `target` entity to display the provided image information. If an `ondrawfn` is set, it is invoked after the `drawable` component handles the drawing.
*   **Parameters:**
    *   `target`: (`Entity`) The entity whose `drawable` component will perform the drawing.
    *   `image`: (`string`) The image filename (e.g., "item.tex").
    *   `src`: (`Entity`) The source entity from which the image was obtained.
    *   `atlas`: (`string`, optional) The atlas path for the image.
    *   `bgimage`: (`string`, optional) The background image filename.
    *   `bgatlas`: (`string`, optional) The atlas path for the background image.