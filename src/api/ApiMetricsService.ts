import { AppContextFactory } from '../AppContextFactory';
import { AppFactory } from '../AppFactory';
import { DefaultConfiguration } from './DefaultConfiguration';
import { TeamMetricsRequest } from '../Types';

export class ApiMetricsService {
  public static async metricsForRequest(
    teamMetricsRequest: TeamMetricsRequest
  ): Promise<void> {
    try {
      console.log(`teamMetricsRequest: ${JSON.stringify(teamMetricsRequest)}`);
      const configurationDescriptors = await ApiMetricsService.createConfigurationDescriptorsForRequest(
        teamMetricsRequest,
        ApiMetricsService.yesterday()
      );
      console.log(
        `created configurations: ${JSON.stringify(configurationDescriptors)}`
      );
      for (const configurationDescriptor of configurationDescriptors) {
        await this.collectMetrics(
          configurationDescriptor.serviceName,
          configurationDescriptor.config,
          configurationDescriptor.shouldUpdateEntries
        );
      }
      console.log('Done!');
    } catch (error) {
      console.error(error);
    }
  }

  private static yesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  static async createConfigurationDescriptorsForRequest(
    teamMetricsRequest: TeamMetricsRequest,
    defaultReferenceDate = new Date()
  ): Promise<any[]> {
    if (teamMetricsRequest['config']) {
      return [{ ...teamMetricsRequest }];
    }
    if (teamMetricsRequest['teamName']) {
      return DefaultConfiguration.of(teamMetricsRequest, defaultReferenceDate);
    }

    throw Error(
      `Unable to create configuration for request ${JSON.stringify(
        teamMetricsRequest
      )}`
    );
  }

  private static async collectMetrics(
    serviceName: string,
    config: any,
    shouldUpdateEntries: boolean
  ) {
    const appContext = AppContextFactory.appContextForService(
      serviceName,
      config
    );

    const metricsService = AppFactory.metricsService(
      appContext,
      shouldUpdateEntries
    );
    return metricsService.start({
      collectorConfigs: appContext.collectorConfigs
    });
  }
}
