import { test, expect } from './workflow-audit-isolation';

for (const conflict of [false, true]) {
  test(
    conflict
      ? 'replacement rejects a draft changed after file selection'
      : 'single-workflow replacement preserves identity, saved versions, sessions, runs and unrelated workflows',
    async ({ page }) => {
      const ready = page.waitForResponse(
        (response) =>
          response.url().endsWith('/api/workflow-library') && response.request().method() === 'GET',
      );
      await page.goto('/');
      await ready;
      await expect(page.getByRole('button', { name: 'New chat', exact: true }).first()).toBeVisible(
        { timeout: 60000 },
      );
      const fixture = await page.evaluate(
        async (path) => {
          const { installReplacementFixture } = await import(path);
          return installReplacementFixture();
        },
        '/@fs/' + process.cwd().replaceAll('\\', '/') + '/e2e/workflow-replacement-fixture.ts',
      );
      const before = await page.evaluate(() => window.readReplacementLibrary());
      expect(before[fixture.targetId].runs).toHaveLength(1);
      expect(before[fixture.targetId].sessions).toHaveLength(1);
      const section = page.getByRole('region', { name: 'Replace selected workflow', exact: true });
      await section
        .getByLabel('Replacement workflow backup', { exact: true })
        .setInputFiles({
          name: 'replacement.json',
          mimeType: 'application/json',
          buffer: Buffer.from(fixture.backup),
        });
      await expect(section).toContainText('Replacement: Replacement worksheet');
      if (conflict) await page.evaluate(() => window.editReplacementDraft());
      await section
        .getByRole('button', { name: 'Replace workflow & save version', exact: true })
        .click();
      await expect(section.getByRole('status')).toContainText(
        conflict ? 'draft changed' : 'Replacement version created',
      );
      const after = await page.evaluate(() => window.readReplacementLibrary());
      expect(Object.keys(after).sort()).toEqual(Object.keys(before).sort());
      expect(after[fixture.sentinelId]).toEqual(before[fixture.sentinelId]);
      const target = after[fixture.targetId];
      const original = before[fixture.targetId];
      expect(target.id).toBe(original.id);
      expect(target.templateId).toBe(original.templateId);
      expect(target.sessions).toEqual(original.sessions);
      expect(target.runs).toEqual(original.runs);
      expect(target.versions[0]).toEqual(original.versions[0]);
      if (conflict) {
        expect(target.versions).toEqual(original.versions);
        expect(target.draft.name).toBe('Changed while choosing replacement');
      } else {
        expect(target.draft.id).toBe(original.id);
        expect(target.draft.name).toBe('Replacement worksheet');
        expect(target.versions.map((version) => version.number)).toEqual([1, 2, 3]);
        expect(target.versions[1].definition).toEqual(original.draft);
        expect(target.versions[2].definition).toEqual(target.draft);
        expect(target.runs[0].version).toBe(1);
        expect(target.sessions[0].version).toBe(1);
      }
    },
  );
}
