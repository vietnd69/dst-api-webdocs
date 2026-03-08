---
id: emoji
title: Emoji
description: Provides a dictionary of allowed emoji items for the local user's chat word prediction system.
tags: [network, ui, chat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: util
source_hash: 083de4e0
system_scope: network
---

# Emoji

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This utility module exposes a single function, `GetWordPredictionDictionary`, which returns a structured dictionary of emoji items that the current user is allowed to use in chat. It determines ownership via `TheInventory:CheckOwnership` or `TheInventory:CheckClientOwnership`, and maps emoji item types to their display strings for use in chat input autocomplete (e.g., typing `:smile:` yields ` :smile:`). It is used by the chat UI to power emoji predictions.

## Usage example
```lua
local emoji_dict = require "util/emoji"
local prediction_data = emoji_dict.GetWordPredictionDictionary()

-- prediction_data.words: list of allowed emoji input names (e.g., {"smile", "heart"})
-- prediction_data.GetDisplayString("smile"): returns " :smile:"
```

## Dependencies & tags
**Components used:** `TheInventory`, `TheNet`, `TheWorld`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `GetWordPredictionDictionary()`
* **Description:** Returns a table containing a list of emoji names the user owns, plus metadata and a helper function to generate display strings for chat autocomplete.
* **Parameters:** None.
* **Returns:** Table with the following fields:
  - `words`: Array of strings — emoji input names (e.g., `"smile"`, `"thumbsup"`) the user owns.
  - `delim`: String — prefix delimiter for display, always `":"`.
  - `postfix`: String — suffix delimiter for display, always `":"`.
  - `GetDisplayString(word)`: Function — takes an emoji input name and returns a formatted string like `" :smile:"`.
* **Error states:** Returns empty `words` and empty `GetDisplayString` output if ownership check fails (e.g., not on the master simulation or invalid user ID).

## Events & listeners
None identified.