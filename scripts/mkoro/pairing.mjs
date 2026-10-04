/** Re-pairing proves the saved identity; display names never identify a computer. */
export async function pairCompanion({ api, options, pairingToken, capabilities, previous }) {
  api.token = undefined;
  const reconnect = previous ? { workerId: previous.workerId, token: previous.token } : undefined;
  const result = await api.post('pair', {
    pairingToken,
    name: options.name,
    capabilities,
    ...(reconnect ? { reconnect } : {}),
  });
  if (
    typeof result?.token !== 'string' ||
    !result.token ||
    typeof result.workerId !== 'string' ||
    !result.workerId
  )
    throw new Error('Inscope returned invalid pairing credentials.');
  if (previous && result.workerId !== previous.workerId)
    throw new Error(
      'Inscope did not preserve the saved connection identity. The local state was not replaced.',
    );
  return {
    version: 1,
    server: options.server,
    workspace: options.workspace,
    workerId: result.workerId,
    token: result.token,
    sessions: previous?.sessions ?? {},
    pollIntervalMs: result.pollIntervalMs,
  };
}
