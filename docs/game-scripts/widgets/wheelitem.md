---
id: wheelitem
title: Wheelitem
description: Provides factory functions for generating UI wheel item configurations for emotes and chat commands.
tags: [ui, emote, chat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 1f00c569
system_scope: ui
---

# Wheelitem

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WheelItem` is a utility module that provides factory functions to construct configuration tables for items in the in-game command wheel. These configurations include labels, help text, execution callbacks, and visual assets. It is used to dynamically populate wheel menus for emotes (per-character) and text chat actions (console platforms only). The module does not represent an ECS component or entity — it is a stateless Lua module that returns a table of functions.

## Usage example
```lua
local WheelItem = require "widgets/wheelitem"

-- Create an emote item for the player's character
local wave_item = WheelItem.EmoteItem("wave", ThePlayer.prefab)

-- For console, create a chat item
local say_item = WheelItem.TextChatItem(false, "say.tex")
```

## Dependencies & tags
**Components used:** None (no ECS components used)
**Tags:** None identified

## Properties
No public properties

## Main functions
### `EmoteItem(emote, character)`
*   **Description:** Generates a configuration table for an emote entry in the command wheel. Includes localized label, help text, execution callback (which runs the emote command and awards the "party_time" achievement), and asset references for the wheel icon.
*   **Parameters:**
    *   `emote` (string) — lowercase emote identifier (e.g., `"wave"`, `"cheer"`), used to look up strings and assets.
    *   `character` (string) — prefab name of the character, used to select the correct character-specific emote atlas/texture.
*   **Returns:** table — with fields `label` (string), `helptext` (string), `execute` (function), `atlas` (string), `normal` (string).
*   **Error states:** If the emote key is missing in `STRINGS.UI.EMOTES`, the help text may fall back to the help prefix with no label text.

### `TextChatItem(whisper, image)`
*   **Description:** (Console only) Generates a configuration table for a text chat item (either "Say" or "Whisper") in the command wheel. When executed, it opens the system virtual keyboard and, upon submission, sends the text via `TheNet:Say`.
*   **Parameters:**
    *   `whisper` (boolean) — if `true`, the item uses the "Whisper" label; otherwise, "Say".
    *   `image` (string) — texture filename for the wheel icon (e.g., `"say.tex"`).
*   **Returns:** table — with fields `label` (string), `execute` (function), `atlas` (string), `normal` (string).
*   **Error states:** Only available when `IsConsole()` returns `true`. If called on non-console platforms, `WheelItem.TextChatItem` will be `nil`.

## Events & listeners
None identified