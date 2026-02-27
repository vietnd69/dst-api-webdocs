---
id: wax
title: Wax
description: Manages whether an entity functions as a wax spray by toggling the "waxspray" tag.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8fc10d1c
---

# Wax

## Overview
This component tracks and controls whether an entity behaves as a wax spray. It maintains an `is_spray` state and ensures the entity's "waxspray" tag is correctly added or removed based on that state.

## Dependencies & Tags
- **Tags used:**  
  - Adds `"waxspray"` tag when `is_spray` is `true`.  
  - Removes `"waxspray"` tag when `is_spray` is `false`.  
- **No external component dependencies** are explicitly declared or inferred.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_spray` | `boolean` | `false` | Indicates whether the entity is currently acting as a wax spray. |

## Main Functions
### `Wax:SetIsSpray()`
* **Description:** Sets the `is_spray` state to `true`, which triggers addition of the `"waxspray"` tag to the entity.
* **Parameters:** None.

### `Wax:GetIsSpray()`
* **Description:** Returns the current value of the `is_spray` flag.
* **Parameters:** None.

### `OnIsSprayFn(self, is_spray)`
* **Description:** Internal callback used when `is_spray` is set (via metatable assignment); updates the entity's `"waxspray"` tag accordingly.
* **Parameters:**  
  - `self`: The `Wax` component instance.  
  - `is_spray`: Boolean indicating the desired spray state.

## Events & Listeners
None.