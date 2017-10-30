# mjml-migrate

## Purpose

Makes a template following the MJML 3 syntax compatible with MJML 4.

## Installation

`npm install`

## Usage

`migrate <input> <output>`

## What happens

* `mj-container` is removed and its attributes are passed to `mj-body`
* Unitless values are converted to `px`
* `mj-social`'s syntax is replaced with the v4 syntax
* Unsupported tags (defined in `unavailableTags` in `config.js`) are removed 
