---
id: worlddeciduoustreeupdater
title: Worlddeciduoustreeupdater
description: A deprecated placeholder component with no functional logic, retained only for backward compatibility with legacy mods.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 752086f2
---

# Worlddeciduoustreeupdater

## Overview
This component serves as a deprecated stub with no active behavior. It is retained in the codebase solely to prevent runtime errors in external mods that may reference it by name. It initializes an empty `update` function and holds no meaningful state or functionality.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the entity the component is attached to. |
| `update` | `function` | `function() end` | A no-op function placeholder; does nothing when called. |

## Main Functions
### `_ctor(inst)`
* **Description:** Initializes the component instance by storing the entity reference and assigning a no-op `update` function.
* **Parameters:**
  * `inst` (`Entity`): The entity being assigned to `self.inst`.

## Events & Listeners
None.