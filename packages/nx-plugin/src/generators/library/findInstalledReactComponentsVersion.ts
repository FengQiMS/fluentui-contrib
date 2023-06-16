import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { parse } from 'semver';

const exec = promisify(execCb);

export async function findInstalledReactComponentsVersion() {
  const { stdout } = await exec(
    `yarn list --pattern @fluentui/react-components --json --depth=0`
  );
  const rawEntries = stdout.split('\n');
  const entries = rawEntries.map((entry) => {
    try {
      return JSON.parse(entry);
    } catch {
      return {} as unknown;
    }
  });
  const entry = entries.find((entry) => {
    if (entry.data?.trees?.[0]?.name.includes('@fluentui/react-components')) {
      return true;
    }
  });

  if (!entry) {
    throw new Error(
      'Could not find installed @fluentui/react-components version in lockfile, please report this issue'
    );
  }

  const version = entry.data.trees[0].name.split('@')[2];
  if (parse(version)) {
    return version;
  }

  throw new Error(
    'Could not find installed @fluentui/react-components version in lockfile, please report this issue'
  );
}
