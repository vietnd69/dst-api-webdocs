---
id: spellbook
title: Spellbook
description: Manages the spell wheel UI and spell execution logic for entities capable of casting spells.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: ui
source_hash: 0312bbd5
---

# Spellbook

## Overview
The `Spellbook` component enables an entity (typically a player) to manage and execute spells via the spell wheel interface. It handles spell selection, validation rules (e.g., tag requirements, usage permissions), UI configuration (radius, background data), and callback hooks for opening/closing the wheel or executing spells. It integrates with the client-side HUD to render the spell wheel and coordinates with the server for spellcasting logic via stategraph actions or custom functions.

## Dependencies & Tags
- **Events listened for:** `"openspellwheel"`, `"closespellwheel"`  
- **Tags used:** Entity tag (custom, set via `SetRequiredTag`)  
- **Component interactions:** Relies on `user.HUD`, `user.components.playercontroller` (if present), and `user:HasTag()`  
- **No explicit component additions/removals on `inst`**

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the entity this component belongs to. |
| `tag` | `string?` | `nil` | Required tag a user must have to use this spellbook. |
| `items` | `table?` | `nil` | List/array of spell definitions (each spell typically contains `id`, `name`, `onselect`, etc.). |
| `bgdata` | `table?` | `nil` | Background rendering data passed to the spell wheel HUD. |
| `radius` | `number` | `175` | Radius (in pixels) of the spell wheel. |
| `focus_radius` | `number` | `178` | Radius used for hover/focus detection on wheel items. |
| `spell_id` | `number?` | `nil` | ID of the currently selected spell. |
| `spellname` | `string?` | `nil` | Display name of the selected spell. |
| `spellaction` | `string?` | `nil` | Action name used in stategraph for client-server spellcasting. |
| `spellfn` | `function?` | `nil` | Custom server-side spellcasting function (`fn(inst, user) -> bool`). |
| `onopenfn` | `function?` | `nil` | Callback when the spell wheel opens (`fn(inst)`). |
| `onclosefn` | `function?` | `nil` | Callback when the spell wheel closes (`fn(inst)`). |
| `canusefn` | `function?` | `nil` | Custom permission check function (`fn(inst, user) -> bool`). |
| `shouldopenfn` | `function?` | `nil` | Function to determine if the wheel *should* open (e.g., during UI previews). |
| `opensound` | `string?` | `nil` | Sound event to play on wheel opening. |
| `closesound` | `string?` | `nil` | Sound event to play on wheel closing. |
| `executesound` | `string?` | `nil` | Sound event to play on spell execution. |
| `closeonexecute` | `boolean` | `true` | Whether the spell wheel should close automatically after spell execution. |

## Main Functions

### `SetRequiredTag(tag)`
* **Description:** Sets the required tag a user must possess to be allowed to use this spellbook.
* **Parameters:**  
  - `tag` (`string`): Tag name required for access.

### `SetRadius(radius)`
* **Description:** Sets the visual radius (in pixels) of the spell wheel.
* **Parameters:**  
  - `radius` (`number`): Radius value.

### `SetFocusRadius(radius)`
* **Description:** Sets the radius used for hover/focus detection of spell items on the wheel.
* **Parameters:**  
  - `radius` (`number`): Focus detection radius.

### `SetBgData(bgdata)`
* **Description:** Configures background rendering data for the spell wheel UI.
* **Parameters:**  
  - `bgdata` (`table`): Arbitrary data structure for UI background configuration.

### `SetItems(items)`
* **Description:** Assigns the list of spells available in the spellbook.
* **Parameters:**  
  - `items` (`table`): Array of spell definitions.

### `SetOnOpenFn(fn)`
* **Description:** Registers a callback invoked when the spell wheel opens.
* **Parameters:**  
  - `fn` (`function(inst)`): Function executed on opening.

### `SetOnCloseFn(fn)`
* **Description:** Registers a callback invoked when the spell wheel closes.
* **Parameters:**  
  - `fn` (`function(inst)`): Function executed on closing.

### `SetCanUseFn(fn)`
* **Description:** Registers a custom permission check function (beyond tag checks).
* **Parameters:**  
  - `fn` (`function(inst, user) -> bool`): Returns `true` if the user may use the spellbook.

### `SetShouldOpenFn(fn)`
* **Description:** Registers a function to determine whether the spell wheel *should* open (e.g., to block opening during UI previews).
* **Parameters:**  
  - `fn` (`function(inst, user) -> bool`): Returns `true` if opening is allowed.

### `ShouldOpen(user)`
* **Description:** Returns whether the spell wheel should be opened for the given user, based on `shouldopenfn`.
* **Parameters:**  
  - `user` (`Entity`): The intended user of the spellbook.

### `CanBeUsedBy(user)`
* **Description:** Checks if the user meets *all* requirements (tag, custom function, item list) to use the spellbook.
* **Parameters:**  
  - `user` (`Entity`): The candidate user.

### `OpenSpellBook(user)`
* **Description:** Triggers the spell wheel UI on the user’s HUD with the configured settings.
* **Parameters:**  
  - `user` (`Entity`): The user opening the wheel.

### `SelectSpell(id)`
* **Description:** Sets the currently selected spell by ID and invokes its `onselect` callback if present.
* **Parameters:**  
  - `id` (`number`): Index/ID of the spell to select.  
  - **Returns:** `boolean` — `true` if the spell was successfully selected.

### `GetSelectedSpell()`
* **Description:** Returns the ID of the currently selected spell.
* **Returns:** `number?` — The selected spell’s ID, or `nil`.

### `SetSpellName(name)`
* **Description:** Sets the display name for the currently selected spell.
* **Parameters:**  
  - `name` (`string`): Spell name.

### `SetSpellAction(action)`
* **Description:** Sets the stategraph action name used to trigger the spell (client/server sync).
* **Parameters:**  
  - `action` (`string`): Action string (e.g., `"CAST_SPELLBOOK"`).

### `GetSpellAction()`
* **Description:** Returns the configured stategraph action name.
* **Returns:** `string?` — The action name, or `nil`.

### `SetSpellFn(fn)`
* **Description:** Assigns a custom server-side function to execute when the spell is cast via stategraph.
* **Parameters:**  
  - `fn` (`function(inst, user) -> bool`): Returns `true` if casting succeeded.

### `HasSpellFn()`
* **Description:** Checks if a custom spell function is configured.
* **Returns:** `boolean` — `true` if `spellfn` is non-`nil`.

### `CastSpell(user)`
* **Description:** Executes the custom spell function (if present) or returns `false`.
* **Parameters:**  
  - `user` (`Entity`): The user casting the spell.  
  - **Returns:** `boolean` — Result of the spell execution (or `false` if no function is set).

## Events & Listeners
- **Listens for `"openspellwheel"`** → Calls `OnOpenSpellWheel`, which invokes `onopenfn` if defined.
- **Listens for `"closespellwheel"`** → Calls `OnCloseSpellWheel`, which invokes `onclosefn` if defined.