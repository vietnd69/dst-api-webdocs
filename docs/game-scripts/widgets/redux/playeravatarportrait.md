---
id: playeravatarportrait
title: Playeravatarportrait
description: Renders a player's avatar in the UI, including portrait background, character puppet, badge, rank badge, and player name.
tags: [ui, avatar, player, skin]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 33ee0c65
system_scope: ui
---

# Playeravatarportrait

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlayerAvatarPortrait` is a UI widget that visually represents a player's character selection and metadata in the lobby and related screens. It composes several child widgets—including `PlayerBadge`, `Puppet`, and `RankBadge`—to display the player's selected skin, rank, and name. The component adapts its rendering based on whether the player is in online or offline mode, and it supports displaying empty slots or random selections. Internally, it wraps `Puppet` functionality to mirror animation and skin updates when used in contexts like player listing.

## Usage example
```lua
local avatar = PlayerAvatarPortrait()
avatar:SetPosition(0, 0)
avatar:UpdatePlayerListing("Walter", Color(1, 0.5, 0.2), "walter", "default", {})
avatar:HideHoverText()
avatar:AlwaysHideRankBadge()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags; this is a UI widget, not an entity component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `badge` | `PlayerBadge` | `nil` | Badge widget (e.g., "random", placeholder) shown when no puppet is active. |
| `puppet_root` | `Widget` | `nil` | Container widget holding puppet, frame, and rank badge. |
| `frame` | `Widget` | `nil` | Container widget for the portrait background image. |
| `puppet` | `Puppet` | `nil` | Character puppet used to render the player's skin, clothing, and animations. |
| `rank` | `RankBadge` | `nil` | Badge widget displaying player rank and profile flair. |
| `playername` | `Text` | `nil` | Text widget displaying the player's name. |
| `should_show_rank_badge` | boolean | `true` | Controls whether the rank badge is shown. May be overridden by mode checks. |
| `show_hover_text` | boolean | `true` | Toggles whether hover text (e.g., item names) is enabled on the portrait. |
| `lobbycharacter` | string or nil | `nil` | Stores the current `prefab` name when a valid character is selected. |

## Main functions
### `SetBackground(item_key)`
*   **Description:** Sets the portrait background texture and (optionally) hover text based on the provided skin/item key.  
*   **Parameters:** `item_key` (string or nil) — ID of the skin or item to use for the portrait background.  
*   **Returns:** Nothing.  
*   **Error states:** If `item_key` is not a valid item ID (`IsItemId(item_key)` is false) or `show_hover_text` is false, no hover text is set.

### `SetRank(profileflair, rank)`
*   **Description:** Configures the rank badge with flair and rank data, and shows or hides it depending on mode and configuration.  
*   **Parameters:**  
  &nbsp;&nbsp;`profileflair` (string or nil) — ID of the selected profile flair. May be `nil`.  
  &nbsp;&nbsp;`rank` (number or nil) — Player's rank value. May be `nil` or invalid.  
*   **Returns:** Nothing.  
*   **Error states:** None documented; `nil` values are handled internally by `RankBadge`.

### `ClearBackground()`
*   **Description:** Resets the background texture to the default and clears any hover text.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `SetEmpty()`
*   **Description:** Renders the avatar as an empty slot (e.g., in a lobby for unassigned players).  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `UpdatePlayerListing(player_name, colour, prefab, base_skin, clothing, playerportrait, profileflair, rank)`
*   **Description:** Populates the avatar with data for a player slot: name, colour, character, skin, clothing, portrait, flair, and rank.  
*   **Parameters:**  
  &nbsp;&nbsp;`player_name` (string) — Player's display name.  
  &nbsp;&nbsp;`colour` (Color or nil) — Text colour for the player name. Falls back to `DEFAULT_PLAYER_COLOUR`.  
  &nbsp;&nbsp;`prefab` (string) — Character prefab name (`""`, `"random"`, or a valid prefab ID).  
  &nbsp;&nbsp;`base_skin` (string) — Base skin ID for the character.  
  &nbsp;&nbsp;`clothing` (table of strings) — List of clothing item IDs.  
  &nbsp;&nbsp;`playerportrait` (string or nil) — Skin/item ID for the portrait background.  
  &nbsp;&nbsp;`profileflair` (string or nil) — Profile flair ID. May be `nil`.  
  &nbsp;&nbsp;`rank` (number or nil) — Player rank. May be `nil`.  
*   **Returns:** Nothing.

### `HideVanityItems()`
*   **Description:** Hides the rank badge and portrait background frame.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `HideHoverText()`
*   **Description:** Disables hover text display for the portrait background.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `AlwaysHideRankBadge()`
*   **Description:** Permanently hides the rank badge and disables future auto-showing (even if mode changes).  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `DoNotAnimate()`
*   **Description:** Pauses puppet animation and disables idle emote updates.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `SetSkins(prefabname, base_skin, clothing_names)`
*   **Description:** Adapter method to allow `PlayerAvatarPortrait` to operate like a `Puppet` (e.g., for skin switching). Internally calls `UpdatePlayerListing` with minimal args.  
*   **Parameters:**  
  &nbsp;&nbsp;`prefabname` (string) — Character prefab name.  
  &nbsp;&nbsp;`base_skin` (string) — Base skin ID.  
  &nbsp;&nbsp;`clothing_names` (table of strings) — Clothing item IDs.  
*   **Returns:** Nothing.

### `EmoteUpdate(dt)`
*   **Description:** Adapter method that forwards the emote update delta to the underlying puppet.  
*   **Parameters:** `dt` (number) — Time delta in seconds.  
*   **Returns:** Nothing.

## Events & listeners
None identified.