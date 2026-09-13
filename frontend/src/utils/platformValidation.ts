interface ConnectedAccount {
  platform: string;
  status?: string;
}

export interface PostMedia {
  file?: File | null;
  url?: string | null;
  type?: string | null;
}

export interface PlatformValidationResult {
  isValid: boolean;
  missingPlatforms: string[];
  errorMessage?: string;
  errorType?: "platform" | "account" | "media";
}

export const validatePostForPlatforms = (
  selectedPlatforms: string[],
  connectedAccounts: ConnectedAccount[],
  media?: PostMedia
): PlatformValidationResult => {
  if (selectedPlatforms.length === 0) {
    return {
      isValid: false,
      missingPlatforms: [],
      errorType: "platform",
      errorMessage: "Please select at least one platform before scheduling.",
    };
  }

  const connectedPlatforms = new Set(
    connectedAccounts
      .filter(
        (account) =>
          account.status === undefined || account.status === "connected"
      )
      .map((account) => account.platform)
  );

  const missingPlatforms = selectedPlatforms.filter(
    (platform) => !connectedPlatforms.has(platform)
  );

  if (missingPlatforms.length > 0) {
    return {
      isValid: false,
      missingPlatforms,
      errorType: "account",
    };
  }

  if (selectedPlatforms.includes("instagram")) {
    const hasImageFile = Boolean(
      media?.file && media.file.type.startsWith("image/")
    );

    const hasGeneratedImage =
      Boolean(media?.url) && media?.type === "image";

    const hasVideo =
      Boolean(media?.file && media.file.type.startsWith("video/")) ||
      media?.type === "video";

    if (hasVideo) {
      return {
        isValid: false,
        missingPlatforms: [],
        errorType: "media",
        errorMessage:
          "Instagram image posts require an image. Please upload an image instead.",
      };
    }

    if (!hasImageFile && !hasGeneratedImage) {
      return {
        isValid: false,
        missingPlatforms: [],
        errorType: "media",
        errorMessage:
          "Instagram requires an image for this post. Please upload an image before scheduling.",
      };
    }
  }

  return {
    isValid: true,
    missingPlatforms: [],
  };
};