---
id: language
title: Language
description: Initializes and configures the game's localization system by selecting the appropriate language locale and loading translation files.
tags: [localization, network, dedicated-server]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: language
system_scope: network
source_hash: ec498c16
---

# Language

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This script is responsible for initializing the game's localization infrastructure during startup. It determines the appropriate locale for the current context (dedicated server, client, console, Steam, or Rail platform), sets it as the active locale via `LOC.SetCurrentLocale`, and loads the corresponding `.po` translation file into `LanguageTranslator`. It does not define a component or attach to entities; it is a top-level configuration script executed early in the game initialization sequence.

## Usage example
This script is not used as a component. It is executed automatically at game startup and does not require manual instantiation.

## Dependencies & tags
**Components used:** None (this script operates at a pre-component level).
**Tags:** None identified.

## Properties
No properties are defined — this is a module-scope script, not a class with instance properties.

## Main functions
### `GetCurrentLocale()`
* **Description:** Determines and returns the appropriate locale object based on the runtime environment (dedicated server vs. client) and platform (Steam, console, Rail).
* **Parameters:** None.
* **Returns:** A locale object (or `nil` if none could be resolved), as returned by `LOC.GetLocale` or `LOC.GetLocaleByCode`.
* **Error states:** Returns `nil` if the underlying `LOC` APIs fail to resolve a locale (e.g., invalid language ID or missing translation file).

### `LanguageTranslator:UseLongestLocs(bool)`
* **Description:** Configures the translator to either use only the current locale or merge all available locales for fallback. In this script, it is invoked once during initialization with `false`.
* **Parameters:**
  * `bool` (`boolean`): If `true`, enables longest-locale merging (useful for testing all translations). If `false`, only loads the active locale.
* **Returns:** None.

### `LanguageTranslator:LoadPOFile(filepath, locale_code)`
* **Description:** Loads a gettext-style `.po` translation file from disk into the active `LanguageTranslator` instance.
* **Parameters:**
  * `filepath` (`string`): Absolute or relative path to the `.po` file.
  * `locale_code` (`string`): ISO language code (e.g., `"zh"`, `"en"`) associated with the file.
* **Returns:** None.
* **Error states:** May silently fail if the file is missing or malformed; no explicit error handling is present in this script.

### `LOC.GetLocaleByCode(code)`
* **Description:** Retrieves the locale object corresponding to a given language code.
* **Parameters:**
  * `code` (`string`): Language code (e.g., `"en"`, `"zh"`).
* **Returns:** Locale object or `nil` if the code is invalid or unsupported.
* **Error states:** Returns `nil` if the code does not map to a known locale.

### `LOC.GetLocale([id])`
* **Description:** Retrieves the current or specified locale object. If called without arguments, returns the current active locale.
* **Parameters:**
  * `id` (`number`, optional): Locale identifier (e.g., `LANGUAGE.CHINESE_S_RAIL`). If omitted, uses the current locale.
* **Returns:** Locale object or `nil` if no locale is set or `id` is invalid.
* **Error states:** Returns `nil` if no locale exists for the requested identifier.

### `LOC.GetLocaleCode(id)`
* **Description:** Returns the ISO language code associated with a locale identifier.
* **Parameters:**
  * `id` (`number`): Locale identifier (e.g., `LANGUAGE.CHINESE_S_RAIL`).
* **Returns:** Locale code string (e.g., `"zh"`) or `nil` if the identifier is invalid.
* **Error states:** Returns `nil` for unrecognized locale identifiers.

### `LOC.GetStringFile(id)`
* **Description:** Returns the file path to the translation string file for a given locale identifier.
* **Parameters:**
  * `id` (`number`): Locale identifier.
* **Returns:** File path string or `nil` if no file is registered for the locale.
* **Error states:** Returns `nil` if the locale has no associated string file.

### `LOC.GetLanguages()`
* **Description:** Returns a list of all supported locale identifiers.
* **Parameters:** None.
* **Returns:** Table of numeric locale identifiers.
* **Error states:** Never fails; returns an empty table if no locales are registered (unlikely in practice).

## Events & listeners
None. This script performs initialization tasks and does not register or emit events.