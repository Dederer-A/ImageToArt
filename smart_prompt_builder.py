import os
import re
import shlex
import subprocess

# Default mandatory files and directories (from the Core Documents section of your index)
CORE_FILES = [
    "AGENTS.md",
    "ai/AI_PHILOSOPHY.md",
    "ai/AI_INDEX.md",
    "ai/CODING_STANDARDS.md",
    "ai/GIT_WORKFLOW.md",
]

# List of paths and directories to exclude from the src/ tree view
EXCLUDED_TREE_PATHS = [
    "src/components/ui",
]


def clean_path(path_str):
  """Cleans up paths dragged from Finder or VSCode, removing surrounding

  quotes, trailing escape spaces, and resolving relative paths.
  """
  path_str = path_str.strip("'\"")
  path_str = path_str.strip()

  if os.path.isabs(path_str):
    try:
      path_str = os.path.relpath(path_str, os.getcwd())
    except ValueError:
      pass

  return path_str


def parse_user_entries(raw_input):
  """Parses user input securely, correctly handling dragged-in paths

  wrapped in single or double quotes, and space/comma separation.
  """
  if not raw_input.strip():
    return []

  try:
    normalized_input = raw_input.replace(",", " ")
    tokens = shlex.split(normalized_input)
  except ValueError:
    tokens = re.split(r"[,;\s]+", raw_input)

  cleaned_entries = [clean_path(token) for token in tokens if token.strip()]
  return cleaned_entries


def copy_to_clipboard(text):
  """Copies text to clipboard using pyperclip if available,

  otherwise falls back to native OS commands (like pbcopy on macOS).
  """
  try:
    import pyperclip

    pyperclip.copy(text)
    return True
  except ImportError:
    pass

  if os.name == "posix" and os.uname().sysname == "Darwin":
    try:
      process = subprocess.Popen(
          "pbcopy", env={"LANG": "en_US.UTF-8"}, stdin=subprocess.PIPE
      )
      process.communicate(text.encode("utf-8"))
      return True
    except Exception as e:
      print(f"[Warning] Failed to use pbcopy fallback: {e}")

  return False


def resolve_path_to_files(path_entry):
  """If the entry is a directory, recursively collect all files inside it.

  If it's a file, return it as a single-item list.
  Supports wildcards like docs/30-decisions/* as well.
  """
  collected_files = set()

  if "*" in path_entry:
    base_dir = path_entry.split("*")[0]
    if os.path.exists(base_dir):
      for root, _, filenames in os.walk(base_dir):
        for file in filenames:
          collected_files.add(os.path.join(root, file))
  elif os.path.isdir(path_entry):
    for root, _, filenames in os.walk(path_entry):
      for file in filenames:
        collected_files.add(os.path.join(root, file))
  elif os.path.isfile(path_entry):
    collected_files.add(path_entry)

  return list(collected_files)


def parse_ai_index(index_path="ai/AI_INDEX.md"):
  """Parses AI_INDEX.md and extracts conditional workflow blocks."""
  if not os.path.exists(index_path):
    print(f"Warning: {index_path} not found.")
    return []

  with open(index_path, "r", encoding="utf-8") as f:
    content = f.read()

  rules = []
  pattern = r"If you (.*?):\s*Read:\s*((?:\s+-?\s*[\w\./\-\*]+)+)"
  matches = re.findall(pattern, content, re.IGNORECASE)

  for condition, files_block in matches:
    files = [
        line.strip().lstrip("- ")
        for line in files_block.split("\n")
        if line.strip()
    ]
    rules.append({"condition": condition.lower(), "files": files})

  return rules


def select_dynamic_files(task_description, rules):
  """Matches the task description against condition keywords from the index."""
  task_lower = task_description.lower()
  selected_files = set()
  matched_conditions = []

  for rule in rules:
    cond = rule["condition"]
    keywords = [w for w in re.findall(r"\w+", cond) if len(w) > 3]

    match_count = sum(1 for kw in keywords if kw in task_lower)
    if match_count >= 2 or cond in task_lower:
      matched_conditions.append(rule["condition"])
      for f in rule["files"]:
        resolved = resolve_path_to_files(f)
        selected_files.update(resolved)

  return list(selected_files), matched_conditions


def generate_directory_tree(start_dir="src"):
  """Generates a text-based tree representation of a directory."""
  if not os.path.exists(start_dir):
    return f"Directory '{start_dir}' not found."

  tree_lines = []
  ignore_names = {"__pycache__", "node_modules", ".git", "dist", ".vite"}
  normalized_exclusions = {os.path.normpath(p) for p in EXCLUDED_TREE_PATHS}

  def walk(current_dir, current_prefix):
    try:
      items = sorted(os.listdir(current_dir))
    except PermissionError:
      return

    valid_items = []
    for item in items:
      if item.startswith(".") or item in ignore_names:
        continue

      path = os.path.join(current_dir, item)
      if os.path.normpath(path) in normalized_exclusions:
        continue

      valid_items.append((item, path))

    for index, (item, path) in enumerate(valid_items):
      is_last = index == len(valid_items) - 1
      connector = "└── " if is_last else "├── "
      tree_lines.append(f"{current_prefix}{connector}{item}")

      if os.path.isdir(path):
        extension = "    " if is_last else "│   "
        walk(path, current_prefix + extension)

  tree_lines.append(start_dir + "/")
  walk(start_dir, "")
  return "\n".join(tree_lines)


def generate_targeted_prompt(
    task_description, dynamic_files, matched_conditions, manual_entries
):
  """Generates a structured prompt optimized for LLM token prefix caching.

  Static documentation goes first, dynamic task files and context go last.
  """
  output = []
  lang_map = {
      "py": "python",
      "md": "markdown",
      "json": "json",
      "ts": "typescript",
      "js": "javascript",
      "vue": "vue",
      "html": "html",
      "css": "css",
  }

  # --- 1. STATIC PREFIX (High Caching Efficiency) ---
  # Core project files in a strict, deterministic order
  core_files_resolved = []
  for core_entry in CORE_FILES:
    resolved = resolve_path_to_files(core_entry)
    core_files_resolved.extend(resolved)

  # Deduplicate while preserving the original order of CORE_FILES
  seen = set()
  unique_core_files = [
      f for f in core_files_resolved if not (f in seen or seen.add(f))
  ]

  output.append("# Core Project Documentation & Standards\n\n---\n")
  for file_path in unique_core_files:
    if os.path.exists(file_path) and os.path.isfile(file_path):
      output.append(f"## File: `{file_path}`\n")
      ext = os.path.splitext(file_path)[1].lstrip(".")
      lang = lang_map.get(ext, "")
      output.append(f"```{lang}")
      try:
        with open(file_path, "r", encoding="utf-8") as f:
          output.append(f.read())
      except Exception as e:
        output.append(f"# Error reading file: {e}")
      output.append("```\n\n")
    else:
      print(f"[Warning] Core path not found or is a directory: {file_path}")

  # Project structure tree (static for the repository state)
  output.append("## Project Structure (`src/`)\n")
  output.append("```text\n")
  output.append(generate_directory_tree("src"))
  output.append("\n```\n\n---\n")

  # --- 2. DYNAMIC CONTEXT (Task-Specific Files) ---
  task_files_to_load = set()
  task_files_to_load.update(dynamic_files)
  for entry in manual_entries:
    if entry:
      task_files_to_load.update(resolve_path_to_files(entry))

  # Exclude core files from dynamic list to prevent duplication
  task_files_to_load = task_files_to_load - set(unique_core_files)

  print("\n[Final set of task-specific files included]")
  for f in sorted(task_files_to_load):
    print(f"  - {f}")
  print("-" * 40)

  if task_files_to_load:
    output.append("# Task-Specific Context Files\n\n---\n")
    for file_path in sorted(task_files_to_load):
      if os.path.exists(file_path) and os.path.isfile(file_path):
        output.append(f"## File: `{file_path}`\n")
        ext = os.path.splitext(file_path)[1].lstrip(".")
        lang = lang_map.get(ext, "")
        output.append(f"```{lang}")
        try:
          with open(file_path, "r", encoding="utf-8") as f:
            output.append(f.read())
        except Exception as e:
          output.append(f"# Error reading file: {e}")
        output.append("```\n\n")
      else:
        print(f"[Warning] Path not found or is a directory skipping: {file_path}")

  # --- 3. TASK CONTEXT & INSTRUCTIONS (At the very end) ---
  output.append("# Task Context\n")
  if matched_conditions:
    output.append(f"**Matched Workflows:** {', '.join(matched_conditions)}\n")
  output.append(f"**Task:** {task_description}\n")

  return "\n".join(output)


if __name__ == "__main__":
  print("--- Smart Prompt Builder via AI_INDEX ---")
  user_task = input(
      "What task are you going to work on? (e.g., 'modify image engine'): "
  )

  if not user_task.strip():
    print("Task description cannot be empty.")
    exit()

  # Step 1: Parse and analyze AI_INDEX immediately after task entry
  rules = parse_ai_index("ai/AI_INDEX.md")
  dynamic_files, matched_conditions = select_dynamic_files(user_task, rules)

  print("\n[AI_INDEX Analysis]")
  if matched_conditions:
    print("  Found matching workflow sections:")
    for cond in matched_conditions:
      print(f"    - If you {cond}")
  else:
    print(
        "  No matching conditional workflows found in ai/AI_INDEX.md for this"
        " task."
    )

  # Step 2: Ask for additional files or directories
  additional_input = input(
      "\nAdditional files or directories separated by comma or space (leave"
      " empty if none): "
  )
  manual_entries = parse_user_entries(additional_input)

  # Step 3: Generate prompt and copy
  prompt_text = generate_targeted_prompt(
      user_task, dynamic_files, matched_conditions, manual_entries
  )

  # Calculate statistics
  prompt_bytes = prompt_text.encode("utf-8")
  size_kb = len(prompt_bytes) / 1024
  approx_tokens = len(prompt_text) // 4

  success = copy_to_clipboard(prompt_text)

  print("\n[Prompt Statistics]")
  print(f"  - Size: {size_kb:.2f} KB")
  print(f"  - Estimated tokens: ~{approx_tokens}")

  if success:
    print(
        "\n[Done] The tailored minimum context has been copied to your"
        " clipboard."
    )
  else:
    print(
        "\n[Error] Could not copy to clipboard. Neither pyperclip nor pbcopy"
        " was successful."
    )