---
id: fertilizable
title: Fertilizable
description: Adds support for applying fertilizer to an entity by invoking a registered callback function.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f5a4d40f
---

# Fertilizable

## Overview
This component provides a minimal interface for entities that can be fertilized: it stores an optional callback function (`onfertlizedfn`) and exposes a `Fertilize()` method that invokes this callback when called, passing the entity instance and the fertilizer used.

## Dependencies & Tags
None identified.

## Properties
No public properties are initialized or used in a meaningful way. The only non-commented assignment is the commented-out line `--self.onfertlizedfn = nil`, indicating the callback is intended to be set externally (not initialized by this component). The `Fertilize()` method checks for existence of `self.onfertlizedfn`, but the component itself does not set or manage it.

## Main Functions

### `Fertilize(fertilizer)`
* **Description:** Attempts to trigger the fertilization callback (`onfertlizedfn`) if one has been registered. Returns the result of the callback invocation or `nil` if no callback is set.
* **Parameters:**
  - `fertilizer`: The entity or item used as fertilizer (passed as the second argument to the callback).

## Events & Listeners
None.