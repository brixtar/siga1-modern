# Cerebro — Schema & Rules (`AGENTS.md`)

Welcome to **Cerebro**, a personal knowledge base compiled and maintained by AI. This workspace operates on the **LLM-Wiki** pattern where the AI agent incrementally builds, updates, and cross-references knowledge instead of performing ad-hoc RAG.

---

## 📁 Repository Structure

- `raw/` - **Immutable Sources**: Store all raw files here (clipped articles, papers, session notes, PDFs, images). Never modify files in this directory.
- `wiki/` - **The Knowledge Base**: Contained markdown pages summarizing entities, concepts, syntheses, and timelines.
  - `wiki/index.md` - **Content Index**: A categorized index of all wiki pages.
  - `wiki/log.md` - **Activity Log**: Chronological log of all system changes.

---

## 🛠️ Workflows & Operations

### 1. Ingest Workflow
When a new source is added to `raw/`:
1. **Read & Analyze**: Parse the new source file thoroughly.
2. **Review with User**: Discuss key takeaways and highlights.
3. **Generate Wiki Pages**:
   - Create a dedicated summary page under `wiki/` (e.g., `wiki/summary_article_name.md`).
   - Identify affected entity or concept pages. Update or create them.
   - Insert backlinks and cross-references between the new and existing pages.
4. **Update Index**: Add the new page link and a one-line summary under its appropriate category in `wiki/index.md`.
5. **Log Action**: Append a log entry to `wiki/log.md` using the exact format:
   ```markdown
   ## [YYYY-MM-DD] ingest | Description or Title of the Source
   ```

### 2. Query Workflow
When the user asks questions or requests research:
1. **Index Search**: Check `wiki/index.md` first to locate relevant compiled pages.
2. **Drill Down**: Read the specific wiki pages and raw sources.
3. **Synthesize**: Formulate the response with clear backlinks/citations to existing wiki pages.
4. **Compile Useful Knowledge**: If a query yields a valuable comparison, connection, or synthesis, compile it into a new wiki page so it compounds in the knowledge base.

### 3. Lint (Health Check) Workflow
Periodically run a health check over the wiki pages:
1. **Broken Links**: Find markdown links pointing to non-existent pages.
2. **Contradictions**: Flag where new sources claim facts that contradict older summaries.
3. **Orphan Pages**: Identify pages that have no inbound links.
4. **Missing Concepts**: Find important terms mentioned in summaries that do not yet have their own concept page.
5. **Report & Fix**: List findings and propose updates.

---

## 📝 Page Formatting Standards

- **YAML Frontmatter**: Every wiki page (except index and log) should start with standard frontmatter metadata:
  ```yaml
  ---
  title: Page Title
  type: [summary | entity | concept | synthesis]
  tags: [relevant, tags]
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  sources:
    - "[[raw/source_filename]]"
  ---
  ```
- **Obsidian Links**: Use wiki-link format (`[[Page Name]]` or `[[Folder/Page Name]]`) for connections.
- **Tone**: Keep summaries analytical, objective, and dense with key insights.
