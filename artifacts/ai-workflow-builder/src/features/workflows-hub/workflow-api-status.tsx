import type { WorkflowBlock } from '@/shared/workflow-engine/local-fiscal-workflow';
export function ApiDataStatus({ blocks, recorded = false }: { blocks: WorkflowBlock[]; recorded?: boolean }) {
  const sources = blocks.filter(block => ['currency_rate', 'http_json'].includes(String(block.config.sourceKind)) || ['source.currency_rate', 'source.http_json'].includes(String(block.config.toolId)));
  if (!sources.length) return null;
  return <section aria-label={recorded ? 'API data used in this run' : 'API data for next run'} className="space-y-2 rounded border p-3 text-sm">
    <h3 className="font-semibold">{recorded ? 'API data used in this run' : 'API data for next run'}</h3>
    <p>Run uses the saved response; it does not fetch again. To refresh, open the source in Build, create a new source version if locked, fetch, then save the workflow.</p>
    {sources.map(block => {
      const config = block.config;
      const meta = (config.responseMeta ?? {}) as Record<string, unknown>;
      const fetchedAt = config.rateFetchedAt ?? meta.fetchedAt;
      const sameCurrency = typeof config.documentCurrency === 'string' && typeof config.reportingCurrency === 'string' && config.documentCurrency.toUpperCase() === config.reportingCurrency.toUpperCase();
      const override = typeof config.overrideRate === 'number' && Number.isFinite(config.overrideRate);
      const hasResponse = typeof config.liveRate === 'number' || Array.isArray(config.fetchedRows) && config.fetchedRows.length > 0;
      return <div key={block.id} className="border-t pt-2"><strong>{block.label}</strong><p>{sameCurrency ? 'Same currency: uses a rate of 1; no override or API conversion is applied.' : override ? `Manual override active: ${config.overrideRate}. The fetched rate is not used.` : hasResponse ? 'Using saved API response.' : config.useSampleData === true ? 'Using explicitly enabled example data.' : 'No saved API response. Fetch data before calculation.'}</p><p>Fetched: {fetchedAt ? new Date(String(fetchedAt)).toLocaleString() : 'Not recorded'}</p></div>;
    })}
  </section>;
}
