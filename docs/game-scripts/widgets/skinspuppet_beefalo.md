---
id: skinspuppet_beefalo
title: Skinspuppet Beefalo
description: A UI widget that renders a preview of a beefalo's skin configuration using animation state and build overrides.
tags: [ui, preview, skin]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: e5f9eb1e
system_scope: ui
---

# Skinspuppet Beefalo

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SkinsPuppet` is a specialized UI widget derived from `Button` that provides a visual preview of a beefalo skin configuration. It renders a small animated beefalo character using `UIAnim`, updating its animation bank, build, and skin symbols based on input parameters. It is primarily used in UI contexts where players configure or preview beefalo cosmetic skins (e.g., in character loadouts or skin selector screens). The component internally uses the `skinner_beefalo` component and syncs with the global `SetBeefaloSkinsOnAnim` function.

## Usage example
```lua
local puppet = CreateWidget("skinspuppet_beefalo")
puppet:AddShadow()
puppet:SetSkins(
    "beefalo",
    "beefalo_none",
    {
        beef_body = "default",
        beef_horn = "none",
        beef_feet = "default",
        beef_tail = "default",
        beef_head = "default"
    }
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `button` (via inheritance from `Button`)  
**External references:** `UIAnim`, `Image`, `Button`, `Widget`, `skinner_beefalo`, `SetBeefaloSkinsOnAnim`, `FACE_SWAP_SYMBOLS`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anim` | `UIAnim` | created in constructor | Child animation widget used for rendering the beefalo. |
| `animstate` | AnimState | `self.anim:GetAnimState()` | Animation state controller for the beefalo. |
| `currentanimbank` | string | `"beefalo"` | Current animation bank set on the `AnimState`. |
| `current_idle_anim` | string | `"idle_loop"` | Current idle animation name. |
| `default_build` | string | `"beefalo_build"` | Default build name used for the animation model. |
| `last_skins` | table | `{}` | Stores the last skin configuration applied (used for quick updates). |
| `shadow` | Image? | `nil` (added via `AddShadow()`) | Optional shadow image added via `AddShadow()`. |

## Main functions
### `AddShadow()`
*   **Description:** Adds a static shadow image as a child widget to the puppet, positioned below it and scaled down for visual depth.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetSkins(prefabname, base_item, clothing_names, skip_change_emote, inst)`
*   **Description:** Updates the puppet's visual representation to match the specified skin configuration. Applies build override, clothing skin symbols (e.g., `beef_body`, `beef_horn`), and facial feature overrides (if `inst` is provided and valid). Also updates internal tracking of last-used skin data.
*   **Parameters:**
    *   `prefabname` (string) – The prefab name (e.g., `"beefalo"`).
    *   `base_item` (string or nil) – Optional custom build override; if `nil`, defaults to `prefabname .. "_none"`.
    *   `clothing_names` (table) – Table of skin names with keys `beef_body`, `beef_horn`, `beef_feet`, `beef_tail`, `beef_head`.
    *   `skip_change_emote` (any) – Not used in current implementation.
    *   `inst` (Entity or nil) – Optional source entity; if valid, facial skin overrides (e.g., `beefalo_nose`) are synced via `GetSymbolOverride`.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; assumes valid inputs and `inst` correctness.

## Events & listeners
None identified.