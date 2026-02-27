---
id: hitcher
title: Hitcher
description: Manages the ability of an entity to be hitched to or detached from another hitchable entity, controlling hitching state, locking, and associated tags.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 66b02d8c
---

# Hitcher

## Overview
The `Hitcher` component enables an entity (typically a character or vehicle) to act as a hitcher—assigning it to be hitched to a hitchable target entity or releasing it. It tracks hitching state, locking status, and updates relevant entity tags (`hitcher`, `hitcher_locked`) accordingly.

## Dependencies & Tags
- **Component Dependencies:** None declared directly, but relies on `hitchable` component being present on hitch targets for proper `SetHitched` and `Unhitch` behavior.
- **Tags Added/Removed:**
  - Adds `hitcher` tag when `canbehitched` is `true`.
  - Removes `hitcher` tag when `canbehitched` becomes `false`.
  - Adds `hitcher_locked` tag when `locked` is `true`.
  - Removes `hitcher_locked` tag when `locked` becomes `false`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hitched` | `entity or nil` | `nil` | Reference to the entity this hitcher is currently attached to. |
| `canbehitched` | `boolean` | `true` | Controls whether the entity is eligible to be hitched (also triggers the `hitcher` tag). |
| `locked` | `boolean` | `false` | Indicates if the hitcher is locked (also triggers the `hitcher_locked` tag). |
| `hitchedfn` | `function or nil` | `nil` | Optional callback invoked when hitching occurs. |
| `unhitchfn` | `function or nil` | `nil` | Optional callback invoked when unhitching occurs. |

## Main Functions
### `GetHitched()`
* **Description:** Returns the current hitched entity reference, or `nil` if not hitched.
* **Parameters:** None.

### `SetHitched(target)`
* **Description:** Assigns this hitcher to a new target entity. Disables further hitching (`canbehitched = false`), notifies the target’s `hitchable` component (if present), and invokes the optional `hitchedfn` callback.
* **Parameters:**  
  - `target`: The entity to hitch to. Must (ideally) have a `hitchable` component.

### `Unhitch()`
* **Description:** Releases the current hitched target, restores hitching eligibility (`canbehitched = true`), notifies the target’s `hitchable` component if needed, invokes `unhitchfn` callback (if set), clears internal state, and pushes an `"unhitched"` event.
* **Parameters:** None.

### `Lock(setting)`
* **Description:** Sets the `locked` state of the hitcher. Controls whether the `hitcher_locked` tag is applied.
* **Parameters:**  
  - `setting`: `boolean` – `true` to lock, `false` to unlock.

### `OnSave()`
* **Description:** Prepares data for saving (currently returns an empty table—no state is persisted beyond default defaults).
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores saved state (currently a no-op—does not restore any persisted data).
* **Parameters:**  
  - `data`: Placeholder—unused.

## Events & Listeners
- **Listens For:**
  - `canbehitched` property change → triggers `onhitched()` handler
  - `locked` property change → triggers `onlocked()` handler  
- **Pushes Events:**
  - `"unhitched"` (during `Unhitch()`)