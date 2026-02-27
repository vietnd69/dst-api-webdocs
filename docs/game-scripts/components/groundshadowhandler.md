---
id: groundshadowhandler
title: Groundshadowhandler
description: Dynamically updates a ground shadow entity's position and scale based on the owner's vertical height above ground.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: d94a49fe
---

# Groundshadowhandler

## Overview
This component manages a non-networked, dynamic ground shadow entity for its owner. It keeps the shadow aligned horizontally with the owner while adjusting the shadow's size based on the owner's height above the ground (higher entities cast smaller shadows). It automatically spawns and removes the shadow when the component is attached or detached.

## Dependencies & Tags
- Requires the owner entity to have a `Transform` component (for position queries) and a `DynamicShadow` component on the shadow entity (for sizing and rendering).
- The shadow entity is assigned tags: `FX`, `CLASSIFIED`, `NOCLICK`, `NOBLOCK`, and has `SetCanSleep(false)` and `persists = false`.
- No external component dependencies are added to the owner entity.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in constructor) | The entity to which this component is attached. |
| `ground_shadow` | `Entity?` | `nil` (set in `_ctor`) | Reference to the spawned shadow entity. |
| `original_width` | `number?` | `nil` | Stored base width used for scaling. Set via `SetSize`. |
| `original_height` | `number?` | `nil` | Stored base height used for scaling. Set via `SetSize`. |

## Main Functions

### `GroundShadowHandler:SetSize(width, height)`
* **Description:** Sets the base (unscaled) dimensions of the ground shadow and directly applies them to the shadow’s `DynamicShadow` component.
* **Parameters:**
  - `width` (number): Base width of the shadow.
  - `height` (number): Base height of the shadow.

### `GroundShadowHandler:OnUpdate(dt)`
* **Description:** Called each frame while the component is active. Updates the shadow’s horizontal position to match the owner’s X/Z coordinates, and dynamically scales the shadow based on the owner’s vertical (Y) height—higher entities have smaller shadows, with scale smoothly interpolated between `MIN_SCALE` (0.3) and `MAX_SCALE` (1.0).
* **Parameters:**
  - `dt` (number): Delta time since the last frame (unused in calculation, but required by the update loop).

### `GroundShadowHandler:OnRemoveEntity()`
* **Description:** Safely removes the shadow entity if it exists and sets the reference to `nil`. Invoked automatically when the component is removed or the owner entity is destroyed.

## Events & Listeners
- `inst:StartUpdatingComponent(self)` is called in the constructor, enabling `OnUpdate(dt)` to be invoked regularly.
- No explicit event listeners (`inst:ListenForEvent`) or custom events (`inst:PushEvent`) are used.