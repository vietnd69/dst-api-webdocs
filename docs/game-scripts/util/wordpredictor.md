---
id: wordpredictor
title: Wordpredictor
description: Manages word prediction for text input by scanning dictionaries and returning matching completions based on user-typed prefixes.
tags: [text, input, ui, util]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: util
source_hash: e4b11926
system_scope: ui
---

# Wordpredictor

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WordPredictor` is a utility component that provides intelligent word completion for text input fields. It maintains one or more dictionaries of candidate words and scans the current input text (relative to the cursor position) to find matching completions. The component identifies predictive prefixes using customizable delimiters (e.g., `:` or `/`), supports configurable word-minimum lengths, and optionally ignores surrounding punctuation or whitespace. It does not handle rendering or key events itself but is intended to be consumed by UI text-input systems.

## Usage example
```lua
local predictor = require("util/wordpredictor").WordPredictor

local dict = {
    delim = ":",
    num_chars = 2,
    words = { "hello", "help", "hello_world", "health", "hero" },
    postfix = "",
}

local comp = WordPredictor()
comp:AddDictionary(dict)
comp:RefreshPredictions("Type :hel to ", 10)

local new_text, new_cursor_pos = comp:Apply(1)
-- new_text = "Type help to ", new_cursor_pos = 13
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prediction` | table or `nil` | `nil` | Stores the current prediction result, including `start_pos`, `matches`, and `dictionary`. |
| `text` | string | `""` | Cached copy of the last input text passed to `RefreshPredictions`. |
| `dictionaries` | table | `{}` | List of loaded dictionaries, each expected to have `delim`, optional `words`, optional `num_chars`, and optional `postfix`. |
| `cursor_pos` | number or `nil` | `nil` | Cached cursor position used during prediction lookup. Set by `RefreshPredictions`. |

## Main functions
### `AddDictionary(dictionary)`
* **Description:** Registers a dictionary for word prediction. Accepts incomplete dictionary definitions and provides sensible defaults.
* **Parameters:** `dictionary` (table) - Dictionary definition containing:
  * `delim` (string, required) — prefix delimiter (e.g., `:`).
  * `words` (table, optional) — list of candidate words.
  * `num_chars` (number, optional, default `2`) — minimum number of characters after the delimiter to trigger prediction.
  * `postfix` (string, optional, default `""`) — suffix appended after replacement (e.g., `"` for quote-bounded words).
  * `GetDisplayString` (function, optional) — function to format a word for display (default wraps with `delim` and `postfix`).
* **Returns:** Nothing.

### `RefreshPredictions(text, cursor_pos)`
* **Description:** Computes a new prediction based on the current text and cursor position. Scans backwards from the cursor to find a predictive prefix match in all registered dictionaries.
* **Parameters:** 
  * `text` (string) — full input string.
  * `cursor_pos` (number) — 1-based cursor position.
* **Returns:** Nothing. The result is stored in `self.prediction`.

### `Apply(prediction_index)`
* **Description:** Replaces the predictive word at the identified position with the selected completion and returns the updated text and cursor position.
* **Parameters:** `prediction_index` (number, optional, default `1`) — 1-based index of the desired completion from `prediction.matches`.
* **Returns:** 
  * `new_text` (string or `nil`) — text with the replacement applied, preserving trailing suffixes and non-alphanumeric boundaries.
  * `new_cursor_pos` (number or `nil`) — new 1-based cursor position at the end of the inserted word.
* **Error states:** Returns `(nil, nil)` if no active prediction exists.

### `Clear()`
* **Description:** Resets internal prediction state without affecting dictionaries or other configuration.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDisplayInfo(prediction_index)`
* **Description:** Returns a formatted display string for the predicted word at the given index, using the dictionary’s `GetDisplayString` function (or default).
* **Parameters:** `prediction_index` (number) — 1-based index of the desired completion.
* **Returns:** `text` (string) — formatted display string, or empty string if `prediction_index` is out of range or no prediction exists.

## Events & listeners
None identified