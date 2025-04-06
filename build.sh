#!/bin/bash

# Set environment variables to disable TypeScript and ESLint checks
export NEXT_DISABLE_ESLINT=1
export NEXT_DISABLE_TYPECHECK=1
export SKIP_ESLINT_CHECK=true
export SKIP_TYPE_CHECK=true

# Run the build with checks disabled
npx next build --no-lint
