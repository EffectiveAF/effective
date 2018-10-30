# Breaking Changes

1. 2018.10.30: Username regex
  - Old: '^[a-z][a-z0-9._-]{0,45}$'
  - New: '^[a-z][a-z0-9\-]{0,44}[a-z0-9]$'
    - Cannot contain '.' or '_', must be 2+ chars, not just 1
