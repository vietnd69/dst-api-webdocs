---
id: loc
title: Loc
description: Provides locale and language management functionality for localization, including language selection, string file loading, and text scaling.
tags: [language, localization, ui, network]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: language
system_scope: ui
source_hash: aa7d6dd9
---
# Loc

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `loc` module is a singleton that manages language and localization configuration across the game. It is responsible for maintaining the active locale, loading the appropriate translation files (`.po` files), determining text scaling factors per language, and exposing utility functions for language detection and selection. This module supports multiple platforms (Steam, console) and handles locale-specific settings such as EULA filename selection and character name image suffixes.

It does not attach to entities via components but is used globally as a standalone module (`LOCALE`) by UI and network systems to coordinate language changes and layout adjustments.

## Usage example

```lua
-- Set the current locale to French
LOCALE.SwapLanguage(LANGUAGE.FRENCH)

-- Query current language
local current_lang = LOCALE.GetLanguage() -- returns LANGUAGE.FRENCH

-- Get localized string file path
local string_file = LOCALE.GetStringFile(current_lang)

-- Retrieve text scaling for layout adjustments
local scale = LOCALE.GetTextScale() -- returns 1.0 for French

-- Check if localization is active
if LOCALE.IsLocalized() then
    print("Current locale is not English")
end
```

## Dependencies & tags
**Components used:** None — this is a standalone module, not an Entity Component System component.

**Tags:** None — no entity tags are modified or accessed.

## Properties
No public properties are stored or exposed as variables; all state is encapsulated within the `LOCALE` table (e.g., `LOCALE.CurrentLocale`).

## Main functions

### `LOCALE.GetLocaleByCode(lang_code)`
* **Description:** Finds and returns the locale entry matching a given language code (e.g., `"fr"`, `"zh"`).
* **Parameters:**
  - `lang_code`: `string?` — the short language code to search for.
* **Returns:** `table?` — the matching locale table from `localizations`, or `nil` if no match.
* **Error states:** Returns `nil` if `lang_code` is `nil`.

### `LOCALE.SetCurrentLocale(locale)`
* **Description:** Sets the active locale to the provided locale table.
* **Parameters:**
  - `locale`: `table?` — a locale entry from the `localizations` list (e.g., result of `GetLocale()`).
* **Returns:** None.
* **Error states:** No validation is performed; passing an invalid or malformed table may cause downstream errors.

### `LOCALE.GetLanguages()`
* **Description:** Returns a list of supported language IDs available for selection, filtered by platform (Steam or console).
* **Parameters:** None.
* **Returns:** `table` — array of `LANGUAGE.*` IDs (e.g., `{ LANGUAGE.ENGLISH, LANGUAGE.FRENCH }`).
* **Error states:** None.

### `LOCALE.GetLocale(lang_id)`
* **Description:** Finds the locale entry matching a given language ID (e.g., `LANGUAGE.CHINESE_S`), or returns the current locale if `lang_id` is `nil`.
* **Parameters:**
  - `lang_id`: `number?` — a `LANGUAGE.*` constant; if `nil`, returns `LOCALE.CurrentLocale`.
* **Returns:** `table?` — the matching locale table, or `nil` if no match.
* **Error states:** Returns `nil` if `lang_id` is `nil` and `LOCALE.CurrentLocale` is `nil`.

### `LOCALE.GetLocaleCode(lang_id)`
* **Description:** Returns the internal short code (e.g., `"fr"`, `"ko"`) for a given language ID or the current locale.
* **Parameters:**
  - `lang_id`: `number?` — a `LANGUAGE.*` constant; defaults to current locale if `nil`.
* **Returns:** `string` — the locale code; defaults to `"en"` if no locale found.
* **Error states:** None.

### `LOCALE.GetLanguage()`
* **Description:** Returns the language ID (`LANGUAGE.*`) of the currently active locale, or `LANGUAGE.ENGLISH` as fallback.
* **Parameters:** None.
* **Returns:** `number` — the active language ID constant.
* **Error states:** None.

### `LOCALE.IsLocalized()`
* **Description:** Checks whether a non-default (i.e., non-English) locale is currently active.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `LOCALE.CurrentLocale` is not `nil`, otherwise `false`.
* **Error states:** None.

### `LOCALE.GetStringFile(lang_id)`
* **Description:** Returns the full path to the `.po` file for the given language ID (or current locale).
* **Parameters:**
  - `lang_id`: `number?` — a `LANGUAGE.*` constant; defaults to current locale if `nil`.
* **Returns:** `string?` — full path string (e.g., `"scripts/languages/french.po"`), or `nil` if no locale found.
* **Error states:** Returns `nil` if `LOCALE.GetLocale(lang_id)` returns `nil`.

### `LOCALE.GetEulaFilename()`
* **Description:** Returns the full path to the EULA text file, chosen based on platform (e.g., Xbox vs PC).
* **Parameters:** None.
* **Returns:** `string` — e.g., `"scripts/languages/eula_english_p.txt"` or `"data/scripts/languages/eula_english_x.txt"`.
* **Error states:** None.

### `LOCALE.SwapLanguage(lang_id)`
* **Description:** Loads the translation file for the specified language and updates all localized strings via `LanguageTranslator` and `STRINGS`.
* **Parameters:**
  - `lang_id`: `number` — a `LANGUAGE.*` constant (must be supported).
* **Returns:** None.
* **Error states:** If the language ID is unsupported, the locale is not set and no translation is loaded. Does not throw an error — silently ignores invalid IDs.

### `LOCALE.GetTextScale()`
* **Description:** Returns the text scaling factor for the current locale, used to adjust layout spacing or font sizes.
* **Parameters:** None.
* **Returns:** `number` — scaling factor (e.g., `1.0`, `0.85`, or `0.8`).
* **Error states:** Returns `1.0` if no current locale is set.

### `LOCALE.RefreshServerLocale()`
* **Description:** (Server only) Updates the server’s locale from the current settings and applies the corresponding language translation. Should only be called from a dedicated server context.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** On clients, prints `"You probably shouldn't be calling this on clients..."`. On dedicated servers, prints an error if the locale could not be set (e.g., switching back to English is unsupported).

### `LOCALE.GetShouldTextFit()`
* **Description:** Determines whether per-word text shrinking (for long strings) should be enabled for the current locale.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if shrinking is enabled; defaults to `true` if no locale is active.
* **Error states:** None.

### `LOCALE.GetNamesImageSuffix()`
* **Description:** Returns a suffix to append to player/character names image filenames, based on the current locale (e.g., `"_cn"` for Chinese).
* **Parameters:** None.
* **Returns:** `string` — `"_cn"` for Simplified/Traditional Chinese or `""` for other locales.
* **Error states:** None.

## Events & listeners
This module has no events or listeners — it is stateful but not event-driven.
