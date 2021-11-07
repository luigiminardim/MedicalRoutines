function getEnv(envKey: string): string {
  const envValue = process.env[envKey];
  if (envValue === undefined) {
    throw new Error(`Could't find enviroment variable: ${envKey}`);
  } else {
    return envValue;
  }
}

export const NOTION_TOKEN = getEnv("NOTION_TOKEN");
