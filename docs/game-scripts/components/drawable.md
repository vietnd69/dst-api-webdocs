---
id: drawable
title: Drawable
description: Manages an entity's visual representation and its ability to be drawn within the game world.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Drawable

## Overview
This component controls whether an entity is considered "drawable" in the game and manages the visual assets (image and atlas) associated with its main and background sprites. It provides functions to set and retrieve the drawing state and the currently displayed image/atlas, allowing other systems to query and update an entity's visual appearance.

## Dependencies & Tags
This script does not explicitly add other components.
*   **Tags Added:** `drawable` (when `candraw` is true)
*   **Tags Removed:** `drawable` (when `candraw` is false or component is removed)

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `candraw` | `boolean` | `true` | Determines if the entity should have the "drawable" tag and therefore potentially be rendered. |
| `imagename` | `string` or `nil` | `nil` | The current name of the main image resource being displayed. |
| `atlasname` | `string` or `nil` | `nil` | The current name of the main atlas resource being used. |
| `bgimagename` | `string` or `nil` | `nil` | The current name of the background image resource being displayed. |
| `bgatlasname` | `string` or `nil` | `nil` | The current name of the background atlas resource being used. |
| `ondrawnfn` | `function` or `nil` | `nil` | A callback function executed when the drawable's image or atlas changes. It receives `(inst, imagename, imagesource, atlasname, bgimagename, bgatlasname)` as arguments. |

## Main Functions
### `Drawable:OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from its entity. It ensures the "drawable" tag is removed to prevent rendering issues.
*   **Parameters:** None.

### `Drawable:SetCanDraw(candraw)`
*   **Description:** Sets the drawing state of the entity. If `candraw` is true, the "drawable" tag is added; otherwise, it's removed.
*   **Parameters:**
    *   `candraw` (`boolean`): True to allow drawing, false to prevent it.

### `Drawable:CanDraw()`
*   **Description:** Returns the current drawing state of the entity.
*   **Parameters:** None.

### `Drawable:SetOnDrawnFn(fn)`
*   **Description:** Sets a callback function that will be executed whenever the drawable's image or atlas resources are updated.
*   **Parameters:**
    *   `fn` (`function`): The function to call. It receives the entity instance and all image/atlas parameters (`inst, imagename, imagesource, atlasname, bgimagename, bgatlasname`).

### `Drawable:OnDrawn(imagename, imagesource, atlasname, bgimagename, bgatlasname)`
*   **Description:** Updates the main and background image/atlas resources. If the new resources differ from the current ones, the `ondrawnfn` callback is triggered. Empty strings are treated as `nil` for image/atlas names.
*   **Parameters:**
    *   `imagename` (`string` or `nil`): The new name of the main image.
    *   `imagesource` (`string` or `nil`): An optional source identifier for the image (unused internally by this component).
    *   `atlasname` (`string` or `nil`): The new name of the main atlas.
    *   `bgimagename` (`string` or `nil`): The new name of the background image.
    *   `bgatlasname` (`string` or `nil`): The new name of the background atlas.

### `Drawable:GetImage()`
*   **Description:** Returns the current main image name.
*   **Parameters:** None.

### `Drawable:GetAtlas()`
*   **Description:** Returns the current main atlas name.
*   **Parameters:** None.

### `Drawable:GetBGImage()`
*   **Description:** Returns the current background image name.
*   **Parameters:** None.

### `Drawable:GetBGAtlas()`
*   **Description:** Returns the current background atlas name.
*   **Parameters:** None.

### `Drawable:OnSave()`
*   **Description:** Serializes the current `imagename`, `atlasname`, `bgimagename`, and `bgatlasname` if `imagename` is not `nil`. This is used for saving the entity's visual state.
*   **Parameters:** None.

### `Drawable:OnLoad(data)`
*   **Description:** Deserializes and applies saved image and atlas data. If `data.image` is present, it calls `OnDrawn` to update the visual assets.
*   **Parameters:**
    *   `data` (`table`): A table containing saved image and atlas information, typically from `OnSave()`.