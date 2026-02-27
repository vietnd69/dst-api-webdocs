---
id: papereraser
title: Papereraser
description: This component enables an entity to erase paper-based items by delegating the erasure logic to the target's ErasablePaper component.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: bd2bb01c
---

# Papereraser

## Overview
The Papereraser component allows an entity (typically a tool like the Paper Eraser) to interact with erasable paper items. It attaches the `"papereraser"` tag to the entity and provides a `DoErase` method that invokes the `ErasablePaper` component’s erasure logic on a target paper item. It ensures proper tag cleanup when removed from an entity.

## Dependencies & Tags
**Tags:** Adds `"papereraser"` tag on construction; removes it on removal via `OnRemoveFromEntity`.  
**Component Dependencies:** Relies on the target entity having the `erasablepaper` component for erasure to succeed.

## Properties
No public properties are explicitly declared or initialized in the constructor or elsewhere. All initialization logic is minimal and tag-based.

## Main Functions
### `DoErase(paper, doer)`
* **Description:** Attempts to erase the given `paper` item using this eraser’s capability. Returns `true` if the erasure succeeds (i.e., the underlying `erasablepaper:DoErase` call returns a non-nil result), otherwise `false`.
* **Parameters:**  
  - `paper`: The entity representing the paper item to erase. Must have an `erasablepaper` component.  
  - `doer`: The entity performing the erasure (typically the player).

## Events & Listeners
None identified.