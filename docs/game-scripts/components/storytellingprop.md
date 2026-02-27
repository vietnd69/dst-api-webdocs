---
id: storytellingprop
title: Storytellingprop
description: A lightweight component that marks an entity as a storytelling prop by managing the 'storytellingprop' tag for world interaction filtering.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: fb2fb904
---

# Storytellingprop

## Overview
This component ensures that entities intended for narrative or environmental storytelling purposes are consistently tagged with `"storytellingprop"` upon instantiation and ensures the tag is removed when the component is detached. It serves as a lightweight annotation mechanism within the Entity Component System, enabling systems like AI or physics filters to identify and handle such props differently (e.g., ignoring them during pathfinding or interaction logic).

## Dependencies & Tags
- **Tag Added:** `"storytellingprop"` on construction.
- **Tag Removed:** `"storytellingprop"` on component removal (via `OnRemoveFromEntity`).
- No other components are added or referenced.

## Properties
No public properties are explicitly initialized. The component only stores a reference to the owning entity instance (`self.inst`).

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up by removing the `"storytellingprop"` tag from the entity when the component is removed, ensuring tag consistency across the entity lifecycle.
* **Parameters:** None.

## Events & Listeners
None.