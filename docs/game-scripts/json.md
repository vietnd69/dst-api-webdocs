---
id: json
title: Json
description: Provides JSON encoding and decoding functionality for serializing and deserializing Lua data structures to and from JSON strings.
tags: [serialization, network, util]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: db2ce1e6
system_scope: network
---

# Json

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `json` module provides utility functions for converting Lua data structures to JSON strings (`encode`, `encode_compliant`) and parsing JSON strings back into Lua objects (`decode`). It supports standard JSON-compatible types: `string`, `number`, `boolean`, `nil`, `table`, and `json.null`. The module is primarily used for configuration, save data, and inter-process communication. Note: `encode` produces non-standard JSON (e.g., single quotes are escaped), suitable for internal DST use only; `encode_compliant` produces valid JSON for external services.

## Usage example
```lua
local data = { name = "Wendy", active = true, scores = { 100, nil, 200 } }
local json_str = json.encode(data)
local decoded = json.decode(json_str)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `encode(v)`
* **Description:** Encodes a Lua value into a JSON string using DST's internal (non-standard) encoding rules. For strings, single quotes are escaped, which violates the JSON spec but is used for legacy compatibility within DST. Not safe for external APIs or services.
* **Parameters:** `v` (any) - The Lua value to encode (supported types: `string`, `number`, `boolean`, `nil`, `table`, `json.null`).
* **Returns:** `string` — The JSON-encoded string.
* **Error states:** Raises an assertion error if `v` is an unsupported type (e.g., `function`, `thread`, `userdata`).

### `encode_compliant(v)`
* **Description:** Encodes a Lua value into a fully standards-compliant JSON string (double quotes only, no single-quote escaping). Intended for sending data to external systems (e.g., web APIs), but the game cannot decode such strings. Never use for saving/loading in DST.
* **Parameters:** `v` (any) - The Lua value to encode (supported types: `string`, `number`, `boolean`, `nil`, `table`, `json.null`).
* **Returns:** `string` — The JSON-encoded string compliant with RFC 8259.
* **Error states:** Raises an assertion error if `v` is an unsupported type.

### `decode(s, startPos)`
* **Description:** Parses a JSON string and reconstructs the original Lua data structure. Supports comments (`/* ... */`), whitespace skipping, and `null` values in arrays via `nil`.
* **Parameters:**
  * `s` (string) — The JSON string to decode.
  * `startPos` (number, optional) — Starting index in `s` to begin decoding (defaults to 1).
* **Returns:**
  * `object` — The decoded Lua value (`table`, `string`, `number`, `boolean`, or `nil`).
  * `number` — The position in `s` of the first character after the decoded JSON fragment.
* **Error states:** Raises assertion errors for malformed JSON (e.g., unterminated arrays/objects, invalid constants, unexpected end-of-string).

### `null()`
* **Description:** Returns a sentinel function used to represent JSON `null` values in Lua tables (since Lua `nil` is not a valid table value). Required to encode/decode arrays or objects containing `null`.
* **Parameters:** None.
* **Returns:** `function` — A unique function instance used as the `json.null` marker.
* **Usage:** Set `t.key = json.null` to preserve `null` in JSON encoding.

## Events & listeners
None identified