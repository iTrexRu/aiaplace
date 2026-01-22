<?php
// Facont landing entrypoint.
// Kept as PHP so we can include a plain HTML file and keep URLs relative.
// This matches the current deployment strategy: deploy only `facont/**` to docroot.
include __DIR__ . '/landing.html';
