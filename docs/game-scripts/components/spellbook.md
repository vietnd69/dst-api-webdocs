---
id: spellbook
title: Spellbook
description: Manages the spell wheel UI and spell execution logic for player entities, including item lists, sound effects, and conditional access rules.
tags: [ui, inventory, player, spell]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0312bbd5
system_scope: ui
---

# Spellbook

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Spellbook` is a client-side UI component that controls the display, selection, and execution of spells via the spell wheel interface. It stores configuration such as spell items, visual layout parameters, sound effects, and access restrictions, and integrates with the HUD and player controller to handle opening, closing, and casting spells. It does not implement network logic directly but relies on the client-server architecture of DST (e.g., `playercontroller:CancelAOETargeting()` is called client-side when opening the wheel).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("spellbook")
inst.components.spellbook:SetItems({
    { id = "fireball", name = "Fireball", onselect = ... },
    { id = "heal",     name = "Heal",     onselect = ... },
})
inst.components.spellbook:SetRadius(180)
inst.components.spellbook:OpenSpellBook(player_inst)
```

## Dependencies & tags
**Components used:** `playercontroller` (via `user.components.playercontroller:CancelAOETargeting()` in `OpenSpellBook`)  
**Tags:** Checks `user:HasTag(self.tag)` if `self.tag` is set (no tags are added or removed).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | The entity instance the component is attached to. |
| `tag` | `string` or `nil` | `nil` | Required tag the user must have to use this spellbook. |
| `items` | `table` or `nil` | `nil` | Array of spell item definitions (each with `id`, `name`, optional `onselect`). |
| `bgdata` | `table` or `nil` | `nil` | Background data passed to the spell wheel HUD. |
| `radius` | number | `175` | Radius (in pixels) of the spell wheel. |
| `focus_radius` | number | `178` | Radius for highlight/focus effect on the wheel. |
| `spell_id` | `number` or `nil` | `nil` | ID (1-based index) of the currently selected spell. |
| `spellname` | `string` or `nil` | `nil` | Human-readable name of the currently selected spell. |
| `spellaction` | any | `nil` | Action string for client-server spell execution (used with `CAST_SPELLBOOK` stategraph action). |
| `spellfn` | function or `nil` | `nil` | Server-side function `(self.inst, user) => boolean` for spell logic. |
| `onopenfn` | function or `nil` | `nil` | Callback invoked when the spell wheel is opened. |
| `onclosefn` | function or `nil` | `nil` | Callback invoked when the spell wheel is closed. |
| `canusefn` | function or `nil` | `nil` | Custom access condition: `(self.inst, user) => boolean`. |
| `shouldopenfn` | function or `nil` | `nil` | Silent block condition: `(self.inst, user) => boolean` (`false` blocks opening). |
| `opensound` | `string` or `nil` | `nil` | Sound event for opening the wheel. *(Not used in current implementation.)* |
| `closesound` | `string` or `nil` | `nil` | Sound event for closing the wheel. *(Not used in current implementation.)* |
| `executesound` | `string` or `nil` | `nil` | Sound event for spell execution. *(Not used in current implementation.)* |
| `closeonexecute` | boolean | `true` | Whether the wheel closes automatically after spell execution. *(Not used in current implementation.)* |

## Main functions
### `SetRequiredTag(tag)`
*   **Description:** Sets the tag that a user entity must possess to be allowed to use this spellbook.
*   **Parameters:** `tag` (string) — The tag to require.
*   **Returns:** Nothing.

### `SetRadius(radius)`
*   **Description:** Configures the visual radius of the spell wheel UI.
*   **Parameters:** `radius` (number) — Radius in pixels.
*   **Returns:** Nothing.

### `SetFocusRadius(radius)`
*   **Description:** Configures the radius used to highlight the currently focused spell on the wheel.
*   **Parameters:** `radius` (number) — Focus radius in pixels.
*   **Returns:** Nothing.

### `SetBgData(bgdata)`
*   **Description:** Sets background rendering data for the spell wheel UI.
*   **Parameters:** `bgdata` (table) — Arbitrary table passed to the HUD for background configuration.
*   **Returns:** Nothing.

### `SetItems(items)`
*   **Description:** Defines the list of spells available in the wheel.
*   **Parameters:** `items` (table) — Array of spell definitions. Each entry may contain `id`, `name`, and `onselect` (a callback `(inst) => nil`).
*   **Returns:** Nothing.

### `SetOnOpenFn(fn)`
*   **Description:** Assigns a callback function executed when the spell wheel opens.
*   **Parameters:** `fn` (function) — Function taking `(inst)` as argument.
*   **Returns:** Nothing.

### `SetOnCloseFn(fn)`
*   **Description:** Assigns a callback function executed when the spell wheel closes.
*   **Parameters:** `fn` (function) — Function taking `(inst)` as argument.
*   **Returns:** Nothing.

### `SetCanUseFn(fn)`
*   **Description:** Sets a custom access-check callback in addition to tag and ownership checks.
*   **Parameters:** `fn` (function) — Function `(inst, user) => boolean` returning `true` if the user may use the spellbook.
*   **Returns:** Nothing.

### `SetShouldOpenFn(fn)`
*   **Description:** Sets a silent-block callback to programmatically prevent the wheel from opening (e.g., during cinematics or previews).
*   **Parameters:** `fn` (function) — Function `(inst, user) => boolean`. Return `false` to suppress opening; `true` or `nil` allows it.
*   **Returns:** Nothing.

### `ShouldOpen(user)`
*   **Description:** Evaluates whether the spell wheel *should* be opened for a given user, respecting `shouldopenfn`.
*   **Parameters:** `user` (`Entity`) — The entity attempting to open the wheel.
*   **Returns:** `true` if opening is allowed, otherwise `false`.

### `CanBeUsedBy(user)`
*   **Description:** Checks if a user can use this spellbook based on tag, custom use rules, item availability, and ownership.
*   **Parameters:** `user` (`Entity`) — The entity attempting to use the spellbook.
*   **Returns:** `true` if all conditions pass (`tag` check, `canusefn`, non-empty `items`, same instance if player-owned); otherwise `false`.

### `OpenSpellBook(user)`
*   **Description:** Opens the spell wheel UI for the specified user, cancelling any active AOE targeting first.
*   **Parameters:** `user` (`Entity`) — The entity that will see and interact with the wheel.
*   **Returns:** Nothing.
*   **Error states:** No-op if `user.HUD` or `user.components.playercontroller` is `nil`.

### `SelectSpell(id)`
*   **Description:** Records a spell selection by ID and invokes its `onselect` callback if defined.
*   **Parameters:** `id` (number) — 1-based index into the `items` array.
*   **Returns:** `true` if the ID is valid and selection succeeded; `false` if `items[id]` is `nil`.
*   **Error states:** No-op if `items[id]` is `nil`.

### `GetSelectedSpell()`
*   **Description:** Returns the ID of the currently selected spell.
*   **Parameters:** None.
*   **Returns:** `number` or `nil` — The selected spell ID, or `nil` if none selected.

### `SetSpellName(name)`
*   **Description:** Sets the human-readable name for the currently selected spell.
*   **Parameters:** `name` (string) — Display name of the spell.
*   **Returns:** Nothing.

### `GetSpellName()`
*   **Description:** Returns the stored name for the currently selected spell.
*   **Parameters:** None.
*   **Returns:** `string` or `nil`.

### `SetSpellAction(action)`
*   **Description:** Sets a client-server action string (e.g., `"CAST_SPELLBOOK"`) for direct spell execution via actions.
*   **Parameters:** `action` (any) — Action identifier used in `push`/`recv` logic.
*   **Returns:** Nothing.

### `GetSpellAction()`
*   **Description:** Returns the stored action string.
*   **Parameters:** None.
*   **Returns:** `any` or `nil`.

### `SetSpellFn(fn)`
*   **Description:** Assigns a server-only function to execute when the spell is cast via the `CAST_SPELLBOOK` stategraph action.
*   **Parameters:** `fn` (function) — Function `(self.inst, user) => boolean` returning `true` on success.
*   **Returns:** Nothing.

### `HasSpellFn()`
*   **Description:** Checks whether a server-side spell execution function is set.
*   **Parameters:** None.
*   **Returns:** `true` if `spellfn` is non-`nil`; otherwise `false`.

### `CastSpell(user)`
*   **Description:** Invokes the server-side spell function if one is defined.
*   **Parameters:** `user` (`Entity`) — The entity casting the spell.
*   **Returns:** `boolean` — Result of `spellfn`; `false` if no function is defined.
*   **Error states:** Always returns `false` if `spellfn` is `nil`.

## Events & listeners
- **Listens to:** `openspellwheel` — Triggers `OnOpenSpellWheel`, which calls `onopenfn` if set.
- **Listens to:** `closespellwheel` — Triggers `OnCloseSpellWheel`, which calls `onclosefn` if set.
- **Pushes:** None.
