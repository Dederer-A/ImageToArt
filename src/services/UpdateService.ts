import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

export const CURRENT_APP_VERSION = 1;
const LATEST_VERSION_URL = 'https://imagetoart.example.com/latest_version.json';
const LOCAL_VERSION_FILENAME = 'latest_version.json';

const DEV_MODE = false; // Set to true to force-test the update modal in development

const MOCK_UPDATE_INFO: VersionInfo = {
  version: 999,
  updates: [
    'Dev mode forced update test',
    'Amazing new features for testing modals',
    'Improved UI styling and performance',
  ],
};

export interface VersionInfo {
  version: number;
  updates: string[];
}

export class UpdateService {
  static async checkAndShowUpdate(onUpdateAvailable: (info: VersionInfo) => void): Promise<void> {
    if (DEV_MODE) {
      onUpdateAvailable(MOCK_UPDATE_INFO);
      return;
    }

    try {
      const response = await fetch(LATEST_VERSION_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch latest version: ${response.statusText}`);
      }
      const remoteData = (await response.json()) as VersionInfo;

      let localData: VersionInfo | null = null;
      try {
        const fileResult = await Filesystem.readFile({
          path: LOCAL_VERSION_FILENAME,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });
        if (typeof fileResult.data === 'string') {
          localData = JSON.parse(fileResult.data) as VersionInfo;
        }
      } catch {
        localData = null;
      }

      if (!localData) {
        await Filesystem.writeFile({
          path: LOCAL_VERSION_FILENAME,
          directory: Directory.Data,
          data: JSON.stringify(remoteData, null, 2),
          encoding: Encoding.UTF8,
          recursive: true,
        });
        return;
      }

      if (remoteData.version <= CURRENT_APP_VERSION) {
        return;
      }

      if (remoteData.version > localData.version) {
        await Filesystem.writeFile({
          path: LOCAL_VERSION_FILENAME,
          directory: Directory.Data,
          data: JSON.stringify(remoteData, null, 2),
          encoding: Encoding.UTF8,
          recursive: true,
        });

        onUpdateAvailable(remoteData);
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  }
}
