// import { LoggerOptions, format, transports } from "winston";
//
// export class LoggerConfig {
//   private readonly options: LoggerOptions;
//
//   constructor() {
//     this.options = {
//       exitOnError: false,
//       format: format.combine(format.colorize(), format.timestamp(), format.printf(msg => {
//         return `${msg} [${msg.level}] - ${msg.message}`;
//       })),
//       transports: [new transports.Console({ level: "debug" })], // alert > error > warning > notice > info > debug
//     };
//   }
//
//   public console(): object {
//     return this.options;
//   }
// }
