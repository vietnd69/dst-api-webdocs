---
id: strings_pretranslated
title: Strings Pretranslated
description: Provides localized language names, titles, and body text for the language selection UI in Don't Starve Together.
tags: [localization, ui, language]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 1f13f843
system_scope: ui
---

# Strings Pretranslated

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file defines pretranslated language strings used in the language selection dialog within the game's UI. It is separate from `strings.lua` to avoid UTF-8 encoding issues in certain text editors. It populates `STRINGS.PRETRANSLATED` with language display names, dialog titles, and body text for a set of supported languages (including English, European and Latin American variants of Spanish, French, German, etc.). The content is used solely for user-facing text and does not interact with the ECS, components, or runtime game logic.

## Usage example
```lua
-- Accessing pretranslated strings in UI code (example)
local lang = STRINGS.PRETRANSLATED.LANGUAGES[THEMUSIC.current_language_id]
local yes = STRINGS.PRETRANSLATED.LANGUAGES_YES[THEMUSIC.current_language_id]
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `STRINGS.PRETRANSLATED.LANGUAGES` | table | `nil` | Map of language ID constants to display names (e.g., `"English"`, `"Français (French)"`). |
| `STRINGS.PRETRANSLATED.LANGUAGES_TITLE` | table | `nil` | Map of language ID constants to dialog title text (e.g., `"Translation Option"`). |
| `STRINGS.PRETRANSLATED.LANGUAGES_BODY` | table | `nil` | Map of language ID constants to dialog body text (e.g., `"Your interface language is set to English..."`). |
| `STRINGS.PRETRANSLATED.LANGUAGES_YES` | table | `nil` | Map of language ID constants to the word `"Yes"` in that language. |
| `STRINGS.PRETRANSLATED.LANGUAGES_NO` | table | `nil` | Map of language ID constants to the word `"No"` in that language. |

## Main functions
This file contains no functions. It only defines static string tables under `STRINGS.PRETRANSLATED`.

## Events & listeners
Not applicable.

