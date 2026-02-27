---
id: yotb_skinunlocker
title: Yotb Skinunlocker
description: A minimal utility component that stores and retrieves a selected skin identifier for an entity.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 281c2e54
---

# Yotb Skinunlocker

## Overview
This component serves as a simple data holder for skin selection state. It is designed to be attached to an entity (typically a player or character) to persist and provide access to a chosen skin identifier. It does not enforce validation, handle network synchronization, or directly apply visual changes—those responsibilities are expected to be handled externally.

## Dependencies & Tags
None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `skin` | `string?` | `nil` | Stores the identifier for the currently selected skin. `nil` indicates no skin has been set. |

## Main Functions

### `SetSkin(skin)`
* **Description:** Sets the stored skin identifier.
* **Parameters:**  
  `skin` (`string`): A string identifier representing the desired skin (e.g., a mod's skin key or asset path).

### `GetSkin()`
* **Description:** Returns the currently stored skin identifier.  
* **Parameters:** None.  
* **Returns:** `string?` — The stored skin identifier, or `nil` if no skin is set.

## Events & Listeners
None.