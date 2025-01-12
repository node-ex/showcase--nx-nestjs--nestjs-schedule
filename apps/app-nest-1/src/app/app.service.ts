import { Injectable, Logger } from '@nestjs/common';
import {
  Cron,
  CronExpression,
  Interval,
  SchedulerRegistry,
  Timeout,
} from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  // */10 * * * * * -> every 10th second
  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'greetOnCron',
  })
  greetOnCron() {
    const job = this.schedulerRegistry.getCronJob('greetOnCron');
    this.logger.log(
      'Hello from cron job, next run: ' + (job.nextDate().toISO() ?? ''),
    );
  }

  @Interval('greetOnInterval', 11 * 1000)
  greetOnInterval() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const interval: NodeJS.Timer =
      // `getInterval` has the same return type as `setInterval`
      this.schedulerRegistry.getInterval('greetOnInterval');
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
    this.logger.log('Hello from interval job with ID: ' + interval);
  }

  @Timeout('greetOnTimeout', 12 * 1000)
  greetOnTimeout() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const timeout: NodeJS.Timeout =
      // `getTimeout` has the same return type as `setTimeout`
      this.schedulerRegistry.getTimeout('greetOnTimeout');
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
    this.logger.log('Hello from timeout job with ID: ' + timeout);
  }

  createDynamicCronJob() {
    const job = new CronJob('*/15 * * * * *', () => {
      this.logger.warn('Hello from dynamic cron job');
    });

    this.schedulerRegistry.addCronJob('createDynamicCronJob', job);
    job.start();

    this.logger.warn(`dynamic cron job added for each minute at 15 seconds!`);
  }
}
