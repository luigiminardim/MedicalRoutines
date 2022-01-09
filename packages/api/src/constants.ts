function getEnv(envKey: string): string {
  const envValue = process.env[envKey];
  if (envValue === undefined) {
    throw new Error(`Could't find enviroment variable: ${envKey}`);
  } else {
    return envValue;
  }
}

export const NOTION_TOKEN = getEnv("NOTION_TOKEN");

export const AWS_ACCESS_KEY_ID = getEnv("APP_AWS_ACCESS_KEY_ID");
export const AWS_SECRET_ACESS_KEY = getEnv("APP_AWS_SECRET_ACESS_KEY");
