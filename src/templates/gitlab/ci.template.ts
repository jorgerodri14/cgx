import { injectable, inject } from 'inversify';
import { GenerateFile, DefaultTemplate } from '../default/default.template';
import { GitlabPath } from '../../models/path';

@injectable()
export class CITemplate implements GenerateFile {
    private fileName = 'example-ci.yml';
    private hasPath = true;
    private pathOfFile = GitlabPath.CI;

    constructor(@inject('DefaultTemplate') private defaultTemplate: DefaultTemplate) {}

    public generateFile(): void {
        this.defaultTemplate.generateFile(this.fileName, this.fileContent(), this.hasPath, this.pathOfFile);
    }

    private fileContent(): string {
        return `image: "dev.gitlab.org:5005/gitlab/gitlab-build-images:ruby-2.6.3-golang-1.11-git-2.21-chrome-73.0-node-10.x-yarn-1.12-postgresql-9.6-graphicsmagick-1.3.29"

variables:
    MYSQL_ALLOW_EMPTY_PASSWORD: "1"
    RAILS_ENV: "test"
    NODE_ENV: "test"
    SIMPLECOV: "true"
    GIT_DEPTH: "20"
    GIT_SUBMODULE_STRATEGY: "none"
    GET_SOURCES_ATTEMPTS: "3"
    KNAPSACK_RSPEC_SUITE_REPORT_PATH: knapsack/{{ CI_PROJECT_NAME }}/rspec_report-master.json
    FLAKY_RSPEC_SUITE_REPORT_PATH: rspec_flaky/report-suite.json
    BUILD_ASSETS_IMAGE: "false"

before_script:
    - date
    - source scripts/utils.sh
    - source scripts/prepare_build.sh
    - date

after_script:
    - date

stages:
    - build
    - prepare
    - merge
    - test
    - review
    - qa
    - post-test
    - pages
    - post-cleanup

include:
    - local: .gitlab/ci/global.gitlab-ci.yml
    - local: .gitlab/ci/cng.gitlab-ci.yml
    - local: .gitlab/ci/docs.gitlab-ci.yml
    - local: .gitlab/ci/frontend.gitlab-ci.yml
    - local: .gitlab/ci/pages.gitlab-ci.yml
    - local: .gitlab/ci/qa.gitlab-ci.yml
    - local: .gitlab/ci/reports.gitlab-ci.yml
    - local: .gitlab/ci/rails.gitlab-ci.yml
    - local: .gitlab/ci/review.gitlab-ci.yml
    - local: .gitlab/ci/setup.gitlab-ci.yml
    - local: .gitlab/ci/test-metadata.gitlab-ci.yml
    - local: .gitlab/ci/yaml.gitlab-ci.yml
        `;
     }
}





