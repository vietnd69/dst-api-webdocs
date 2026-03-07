---
id: abigailforcefield
title: Abigailforcefield
description: Applies a forcefield effect to an entity, granting absorption and the forcefield tag, typically as a visual and gameplay feedback from Abigail's abilities.
tags: [combat, buff, visual, abigail]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6de73f53
system_scope: entity
---

# Abigailforcefield

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `abigailforcefield` prefab (and its variants) creates a temporary visual and gameplay effect entity that functions as a debuff component attached to a target entity. It applies the `forcefield` tag and modifies the target's `health` component's `externalabsorbmodifiers` to grant damage absorption, based on the `TUNING.ABIGAIL_FORCEFIELD_ABSORPTION` value. The effect is self-contained and non-persistent, automatically cleaned up when detached or expired.

This prefab is instantiated by Abigail-related logic (e.g., when she uses her shield ability) and is not intended to be added directly to a player or mob — instead, it is spawned as a child entity and attached to the target via the `debuff` component.

## Usage example
```lua
-- Typically instantiated internally via prefabs returned by the module
-- Example of attaching it manually via debuff (not typical usage):
local target = TheEnt
local forcefield = Prefab("abigailforcefield", function() return fn("shield") end, assets)
inst = forcefield()
inst.components.debuff:AddTo(target)
```

## Dependencies & tags
**Components used:** `debuff`, `health`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `"forcefield"` to the target on attachment; removes it on detachment.

## Properties
No public properties exposed for direct modification by external code.

## Main functions
This prefab is constructed via factory functions (`MakeBuffFx`) and returned as prefabs; it is not meant to be manually constructed or modified externally.

The internal function `fn(anim)` is the core constructor:
### `fn(anim)`
* **Description:** Creates and configures the forcefield entity. It sets up animation, sound, network sync, and attaches the `debuff` component with custom attach/detach handlers.
* **Parameters:** `anim` (string) — the animation name to play (e.g., `"shield"`, `"shield_buff"`, `"shield_retaliation"`).
* **Returns:** `inst` — the fully configured entity instance.
* **Error states:** Returns early on non-master clients (i.e., returns a client-side-only entity with `entity:SetPristine()` and no `debuff` component).

### `buff_OnAttached(inst, target)`
* **Description:** Callback triggered when the debuff is attached to a target. Sets up the visual, adds the `forcefield` tag, registers absorption with the target’s `health` component, and sets this entity as a child of the target. Listens for the target’s `"death"` event to auto-remove the effect.
* **Parameters:**  
  * `inst` (Entity) — the forcefield entity itself.  
  * `target` (Entity) — the entity being shielded.  
* **Returns:** Nothing.
* **Error states:** Gracefully checks for `health` component presence before modifying modifiers.

### `buff_OnDetached(inst, target)`
* **Description:** Callback triggered on debuff removal. Removes the `forcefield` tag from the target and destroys the forcefield entity.
* **Parameters:**  
  * `inst` (Entity) — the forcefield entity.  
  * `target` (Entity?) — the entity previously shielded (may be `nil` or invalid).  
* **Returns:** Nothing.
* **Error states:** Validates target validity before removing tag to prevent errors.

### `expire(inst)`
* **Description:** Event handler for `"animover"`. Stops the debuff when the animation completes.
* **Parameters:** `inst` (Entity) — the forcefield entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  * `"animover"` (on `inst`) — triggers `expire()`, which stops the debuff.  
  * `"death"` (on `target`) — triggers `inst.components.debuff:Stop()` to detach and clean up.  
- **Pushes:** None.
