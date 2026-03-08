---
id: playerbadge
title: Playerbadge
description: Renders a player's avatar and background in the UI, supporting various states such as AFK, ghost, host, and mod characters.
tags: [ui, player, avatar]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 633c96e0
system_scope: ui
---

# Playerbadge

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlayerBadge` is a UI widget that displays a player's avatar and background, adapting its appearance based on the player's state (e.g., AFK, ghost, mod character) and host status. It extends `Widget` and composes child widgets like `Image` and `UIAnim` to render either a static avatar image or an animated head. The component relies on external helper functions (`GetPlayerBadgeData`, `GetSkinData`, `SetSkinsOnAnim`) and global lists (`DST_CHARACTERLIST`, `MODCHARACTERLIST`) to determine correct visuals, and uses bitflag operations on `userflags` to inspect player state.

## Usage example
```lua
local PlayerBadge = require "widgets/playerbadge"

local badge = PlayerBadge("warren", {1, 0, 0}, true, USERFLAGS.IS_AFK)
-- Optionally, update state dynamically:
badge:Set("warren", {1, 0, 0}, true, 0, "default_skin")
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isFE` | boolean | `false` | Flag indicating whether the current platform is a console (future-proofing; not currently used). |
| `ishost` | boolean | `nil` | Whether the player is the game host. Set via constructor argument and updated in `Set`. |
| `base_skin` | string? | `nil` | The current skin identifier. Updated via `Set`. |
| `prefabname` | string | `""` | The character prefab name or identifier. Updated via `Set`. |
| `is_mod_character` | boolean | `false` | Whether the character is a modded prefab. Derived in `Set`. |
| `userflags` | number | `0` | Bitflags representing player state (e.g., ghost, AFK, loading). Set via constructor and updated in `Set`. |
| `root` | Widget | (child widget) | Root container for layout. |
| `icon` | Widget | (child widget) | Container for avatar elements. |
| `headbg` | Image | (child widget) | Background image layer. |
| `head` | Image | (child widget) | Static avatar image layer. |
| `head_anim` | UIAnim | (child widget) | Animated head layer. |
| `headframe` | Image | (child widget) | Frame overlay for the avatar. |
| `loading_icon` | Image | (child widget) | Loading spinner overlay. |

## Main functions
### `Set(prefab, colour, ishost, userflags, base_skin)`
*   **Description:** Updates the badge's visual appearance based on player state and character identity. Recalculates background, avatar, and animation state, and handles loading animation visibility.
*   **Parameters:**
    *   `prefab` (string or nil) — The character prefab name (`"warren"`, `"random"`, etc.). Empty string indicates default/host.
    *   `colour` (table of numbers) — RGB(A) tint values (e.g., `{1, 1, 1, 1}`).
    *   `ishost` (boolean) — Whether the player is the host.
    *   `userflags` (number) — Bitflags indicating player state (e.g., `USERFLAGS.IS_AFK`).
    *   `base_skin` (string or nil, optional) — The skin identifier to use for mod characters.
*   **Returns:** Nothing.
*   **Error states:** None documented; gracefully falls back to default visuals if `prefab` is unrecognized.

### `IsGhost()`
*   **Description:** Returns whether the player is in ghost mode.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `IsAFK()`
*   **Description:** Returns whether the player is AFK.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `IsCharacterState1/2/3()`
*   **Description:** Returns whether the corresponding character state flag (1, 2, or 3) is set in `userflags`.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `IsLoading()`
*   **Description:** Returns whether the player is currently loading.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `GetBG()`
*   **Description:** Determines and returns the appropriate background texture name based on player state.
*   **Parameters:** None.
*   **Returns:** `string` — One of `"avatar_bg.tex"`, `"avatar_ghost_bg.tex"`, or `"avatar_bg.tex"` (redundant; logic prioritizes host/AFK/ghost).
*   **Example return values:** `"avatar_bg.tex"`, `"avatar_ghost_bg.tex"`.

### `UseAvatarImage()`
*   **Description:** Determines whether the badge should display a static image instead of an animation.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if AFK, empty `prefabname`, or host in non-hosted multiplayer; `false` otherwise.

### `GetAvatarImage()`
*   **Description:** Determines and returns the appropriate avatar image filename.
*   **Parameters:** None.
*   **Returns:** `string` — One of `"avatar_server.tex"`, `"avatar_mod.tex"`, `"avatar_afk.tex"`, or `"avatar_unknown.tex"`.
*   **Example return values:** `"avatar_server.tex"`, `"avatar_unknown.tex"`.

## Events & listeners
None identified.