interface ConnectedAccount {
  platform: string;
  status?: string;
}

export const getMissingPlatforms = (
  selectedPlatforms: string[],
  connectedAccounts: ConnectedAccount[]
): string[] => {
  const connectedPlatforms = new Set(
    connectedAccounts
      .filter((account) => account.status === undefined || account.status === "connected")
      .map((account) => account.platform)
  );

  return selectedPlatforms.filter(
    (platform) => !connectedPlatforms.has(platform)
  );
};

