---
id: ghostlyelixirable
title: Ghostlyelixirable
description: This component tags an entity as a Ghostly Elixir item and defines its behavior when applied to another entity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: a3ca163d
---

# Ghostlyelixirable

## Overview
This component marks an entity (typically an item) as a Ghostly Elixir and provides logic for how it should be applied to another target entity—specifically, it ensures the item tag `"ghostlyelixirable"` is added on initialization and removed upon entity removal. It supports optional override behavior for the application logic via `overrideapplytotargetfn`.

## Dependencies & Tags
* Adds the `"ghostlyelixirable"` tag to the entity during construction.
* Removes the `"ghostlyelixirable"` tag when the component is removed from the entity (via `OnRemoveFromEntity`).

## Properties
No public properties are initialized in the constructor or elsewhere. The component relies solely on the `inst` reference and optional runtime-overridable function `overrideapplytotargetfn`.

## Main Functions
### `GetApplyToTarget(doer, elixir)`
* **Description:** Determines the result target entity when the Ghostly Elixir is applied. If `overrideapplytotargetfn` is set, it delegates to that function; otherwise, it returns `self.inst` (i.e., the elixir item itself) unchanged.
* **Parameters:**
  * `doer`: The entity performing the application (e.g., a player).
  * `elixir`: The Ghostly Elixir item instance (typically `self.inst`).

### `OnRemoveFromEntity()`
* **Description:** Ensures cleanup by removing the `"ghostlyelixirable"` tag from the entity when this component is detached.
* **Parameters:** None.

## Events & Listeners
None identified.