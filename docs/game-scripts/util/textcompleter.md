---
id: textcompleter
title: Textcompleter
description: Manages text completion and suggestion behavior for console-style input, supporting both Lua code autocompletion and word-suggestion modes.
tags: [input, ui, util]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: util
source_hash: acc57087
system_scope: ui
---

# Textcompleter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TextCompleter` is a utility component that handles text completion and suggestion logic for input fields—most notably, console-style text entry. It supports two distinct modes:  
- **Lua completion (`is_completing_lua = true`)**: Attempts to autocomplete Lua code by analyzing the current input string and inspecting global or object member tables.  
- **Word suggestion mode (`is_completing_lua = false`)**: Suggests predefined words based on user-typed prefixes and delimiters.  

The component does not own the input field directly; instead, it consumes an external `input_textedit` widget (e.g., a `Text`-based input field) and interacts with it via its API (e.g., `SetString`, `GetString`). It also manages UI widgets used to render suggestion candidates.

## Usage example
```lua
local TextCompleter = require "util/textcompleter"

-- Create widgets for suggestions
local suggest_widgets = TextCompleter.CreateDefaultSuggestionWidgets(widget_root, 24, 8)

-- Create a text input field and history array
local input_field = MyTextInputWidget()
local history = {}

-- Instantiate the completer in Lua-completion mode
local completer = TextCompleter(suggest_widgets, input_field, history, true)

-- Configure suggestion data (for word-suggestion mode)
-- completer:SetSuggestionData({ prefixes = { "item_", "tool_" }, words = { "item_apple", "tool_hammer" }, delimiters = { "'" } })

-- In the owner's OnRawKey handler:
completer:UpdateSuggestions(isKeyDown, key)
if key == KEY_TAB then
    completer:PerformCompletion()
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Does not manipulate entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `suggest_text_widgets` | array of `Text` widgets | `nil` | UI widgets used to display suggestions (one per line). |
| `console_edit` | `Text` widget | `nil` | The input field widget this completer operates on. |
| `is_completing_lua` | boolean | `nil` | Whether Lua autocompletion mode is enabled. |
| `history` | array of strings | `nil` | Reference to external history array; owned by caller. |
| `suggestion_prefixes` | array of strings | `{}` | Triggers that activate word suggestions (e.g., `"'"`, `"item_"`). |
| `suggestion_words` | array of strings | `{}` | Candidate words to suggest. |
| `suggestion_delimiters` | array of strings | `{}` | Delimiters surrounding suggestions (e.g., `'`, `"`, `(`). |
| `suggesting` | boolean | `false` | Whether suggestions are currently active. |
| `highlight_idx` | number (1-indexed) | `nil` | Index of the currently highlighted suggestion. |
| `suggest_replace` | string | `""` | Partial input segment to be replaced by the selected suggestion. |
| `history_idx` | number | `nil` | Current index in history navigation. |
| `luacompletePrefix` | string | `nil` | Prefix used for Lua autocompletion (e.g., `"Get"` in `TheSim:Get`). |
| `luacompleteObjName` | string | `""` | Base object name (e.g., `"TheSim"`). |
| `luacompleteObj` | table | `nil` | Table whose keys are used for Lua autocompletion. |
| `luacompleteOffset` | number | `-1` | Index offset into candidate list for cycling through matches. |

## Main functions
### `TextCompleter.CreateDefaultSuggestionWidgets(widget_root, suggestion_label_height, max_suggestions)`
*   **Description:** A static helper to construct an array of `Text` widgets suitable for displaying suggestions. Provides default positioning and alignment.
*   **Parameters:**  
    `widget_root` (Widget) — Parent widget to attach suggestion labels.  
    `suggestion_label_height` (number) — Height of each suggestion label region.  
    `max_suggestions` (number) — Maximum number of suggestion labels to create.  
*   **Returns:** `array of Text widgets`.

### `SetSuggestionData(suggestion_data)`
*   **Description:** Configures the word-suggestion behavior by setting prefixes, candidate words, and delimiters. Validates delimiters to avoid Lua magic characters.
*   **Parameters:**  
    `suggestion_data` (table) — Table with keys `prefixes` (array), `words` (array), `delimiters` (array).  
*   **Returns:** Nothing.

### `ClearState()`
*   **Description:** Resets both Lua-completion and word-suggestion state, clearing internal caches and UI feedback.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PerformCompletion()`
*   **Description:** Triggers completion logic based on current mode (Lua or word-suggestion). Executes `_SuggestComplete` or `_LuaComplete` depending on `suggesting` and `is_completing_lua`.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if a suggestion was applied, `false` otherwise.

### `OnRawKey(key, down)`
*   **Description:** Handles keypresses relevant to completion (e.g., `KEY_TAB`, `KEY_UP`, `KEY_DOWN`). Updates history navigation or suggestion highlighting. Clears state on any non-special key.
*   **Parameters:**  
    `key` (number) — `KEY_*` constant (e.g., `KEY_TAB`).  
    `down` (boolean) — `true` if key is pressed down, `false` if released.  
*   **Returns:** `boolean` — `true` if the key event was consumed (e.g., navigation), `false` otherwise.

### `UpdateSuggestions(down, key)`
*   **Description:** Must be called during input updates. Analyzes the current text to determine if word-suggestions should be triggered and displayed.
*   **Parameters:**  
    `down` (boolean) — `true` when a key is pressed.  
    `key` (number) — `KEY_*` constant. Exits early for special keys (`ENTER`, `TAB`, `UP`, `DOWN`).  
*   **Returns:** Nothing.

### `:PerformCompletion()`
*   **Description:** Invoked on `KEY_TAB`. Performs completion via suggestion or Lua mode.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `:DebugDraw_AddSection(dbui, panel)`
*   **Description:** Adds debug UI sections for inspecting current completion state (Lua completion and word suggestion). Used for diagnostics.
*   **Parameters:**  
    `dbui` (DbgUI) — Debug UI instance.  
    `panel` (DbgUI panel) — Panel used to append tables (e.g., `suggestion_prefixes`, `suggestion_words`).  
*   **Returns:** Nothing.

## Events & listeners
Not applicable. `TextCompleter` does not listen for or emit game events. It is event-driven by external input (`OnRawKey`, `UpdateSuggestions`) and caller-initiated completion.