import { JenkinsCollectorsService } from './JenkinsCollectorsService';
import { JenkinsJob, JenkinsService } from '../Types';
import { JenkinsCollectorConfig } from './Types';

function testJenkinsJob(): JenkinsJob {
  return {
    name: 'jenkins job',
    branch: 'master',
    builds: [
      {
        timestamp: new Date('2018-12-06'),
        result: 'SUCCESS',
        durationInMs: 2000,
        causedBy: 'someone',
        revision: 'someVersion',
        revisionDescription: 'some description',
        buildNumber: '50',
        url: 'someUrl',
      },
    ],
  };
}

describe('JenkinsCollectorsService', () => {
  const jenkinsService: JenkinsService = {
    findData: (
      orgName: string,
      projectName: string,
      since: Date
    ): Promise<JenkinsJob> => Promise.resolve(testJenkinsJob()),
  };

  const jenkinsCollectorsService: JenkinsCollectorsService = new JenkinsCollectorsService(
    jenkinsService
  );

  it('should fetch jenkinsMetrics', async () => {
    const jiraCollectorConfig: JenkinsCollectorConfig = new JenkinsCollectorConfig(
      {
        orgName: 'orgName',
        teamName: 'someTeamName',
        projectName: 'projectName',
        since: '2018-11-20',
        until: '2020-11-20',
      }
    );

    const data = await jenkinsCollectorsService.fetch(jiraCollectorConfig);
    expect(data).toMatchSnapshot();
  });
});
