// import type { Level, StreamEntry } from 'pino';
// // eslint-disable-next-line no-duplicate-imports
// import { pino } from 'pino';

// const levels = {
//   emerg: 80,
//   alert: 70,
//   crit: 60,
//   error: 50,
//   warn: 40,
//   notice: 30,
//   info: 20,
//   debug: 10,
// };

// const fileStreams: StreamEntry[] = Object.keys(levels).map(level => ({
//   level: level as Level,
//   stream: pino.destination({
//     dest: `./logs/app-${level}.log`,
//     mkdir: true,
//   }),
// }));

// const stdoutStreams: StreamEntry[] = Object.keys(levels).map(level => ({
//   level: level as Level,
//   stream: process.stdout,
// }));

// const logger = pino(
//   {
//     customLevels: levels,
//   },
//   pino.multistream([...fileStreams, ...stdoutStreams], {
//     levels,
//     dedupe: true,
//   }),
// );

// export default logger;
