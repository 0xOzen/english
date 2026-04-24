import { spawn } from 'node:child_process';

const commands = [
  ['npm', ['run', 'dev:api']],
  ['npm', ['run', 'dev:web']],
];

const children = commands.map(([command, args]) =>
  spawn(command, args, {
    stdio: 'inherit',
    shell: true,
  }),
);

function shutdown(signal = 'SIGTERM') {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

for (const child of children) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      shutdown();
      process.exit(code);
    }
  });
}

process.on('SIGINT', () => {
  shutdown('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
  process.exit(0);
});
