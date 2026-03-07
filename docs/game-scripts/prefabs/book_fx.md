---
id: book_fx
title: Book Fx
description: Generates reusable prefab prefabs for book-related visual effect entities used in spellcasting animations.
tags: [fx, animation, visual, spell, reusable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 210f3760
system_scope: fx
---

# Book Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`book_fx` is a factory function used to generate reusable Prefab definitions for visual effect entities associated with book-based spellcasting (e.g., Wickerbottom or Waxwell magic). Each generated prefab creates a short-lived, non-persistent FX entity with appropriate animation states, sound feedback, and orientation (four-faced or six-faced). These entities are typically spawned transiently during gameplay to visualize spell casting or book interactions.

## Usage example
```lua
-- Example usage within a spellcast action (conceptual)
local book_fx_prefab = prefabs.book_fx
local inst = SpawnPrefab(book_fx_prefab)
if inst ~= nil then
    inst.Transform:SetPos(x, y, z)
    -- Animation and tint are pre-configured in the prefab definition
end
```

## Dependencies & tags
**Components used:** None identified (only engine-provided components: `transform`, `animstate`, `network`).
**Tags:** Adds the `FX` tag. No other tags are used or modified.

## Properties
No public properties are defined on the factory function or the resulting prefabs.

## Main functions
### `MakeBookFX(name, bankandbuild, anim, failanim, tint, ismount)`
*   **Description:** Factory function that returns a Prefab definition for a book FX entity. It configures animation bank/build, active animation, optional failure animation, color tint, and facing mode (four- or six-faced).
*   **Parameters:**
    *   `name` (string) – Unique name of the prefab.
    *   `bankandbuild` (string) – Base name for the animation bank and build (e.g., `"book_fx_wicker"`).
    *   `anim` (string) – Animation name to play on spawn.
    *   `failanim` (string or `nil`) – Optional failure animation to play in response to the `"fail_fx"` event.
    *   `tint` (table) – RGBA color table passed to `SetMultColour`; expected as `{r, g, b, a}`.
    *   `ismount` (boolean) – If `true`, entity uses six-faced orientation; otherwise, four-faced.
*   **Returns:** Prefab – A ready-to-spawn prefab definition.
*   **Error states:** None documented; assumes valid arguments. Passes `nil` for `failanim` if no failure animation is needed.

## Events & listeners
- **Listens to:** `fail_fx` – triggers failure animation and optional sound playback (only if `failanim` is specified).  
- **Listens to:** `animover` – triggers `inst.Remove()` when the animation completes (effectively auto-deleting the entity).  
- **Pushes:** No events are fired by this component.
