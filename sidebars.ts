import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {type: 'doc', id: 'index', label: 'Overview'},
    {
      type: 'category',
      label: 'iOS SDK',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/ios/installation', label: 'Installation'},
        {type: 'doc', id: 'sdk/ios/configuration', label: 'Configuration'},
        {type: 'doc', id: 'sdk/ios/swiftui', label: 'SwiftUI'},
        {type: 'doc', id: 'sdk/ios/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/ios/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/ios/logs', label: 'Console logs'},
        {
      type: 'category',
      label: 'Privacy',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/ios/privacy/overview', label: 'Overview'},
        {type: 'doc', id: 'sdk/ios/privacy/video', label: 'Video'},
        {type: 'doc', id: 'sdk/ios/privacy/logs', label: 'Console logs'},
        {type: 'doc', id: 'sdk/ios/privacy/network', label: 'Network'},
        {type: 'doc', id: 'sdk/ios/privacy/report', label: 'Report'},
        {type: 'doc', id: 'sdk/ios/privacy/cleanup', label: 'Cleanup'}
      ],
    },
        {type: 'doc', id: 'sdk/ios/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/ios/appearance', label: 'Appearance'},
        {type: 'doc', id: 'sdk/ios/lifecycle', label: 'Lifecycle events'},
        {type: 'doc', id: 'sdk/ios/symbolication', label: 'Crash symbolication'},
        {
          type: 'category',
          label: 'Builds',
          collapsed: true,
          items: [
            {type: 'doc', id: 'sdk/ios/builds/overview', label: 'Overview'},
            {type: 'doc', id: 'sdk/ios/builds/timings', label: 'Timings'},
            {type: 'doc', id: 'sdk/ios/builds/dependencies', label: 'Dependencies'},
            {type: 'doc', id: 'sdk/ios/builds/vulnerabilities', label: 'Vulnerabilities'},
            {type: 'doc', id: 'sdk/ios/build-size-analysis', label: 'Size analysis'},
          ],
        },
        {type: 'doc', id: 'sdk/ios/app-kills', label: 'Kill detection'},
        {type: 'doc', id: 'sdk/ios/release-notes', label: 'Release notes'},
        {type: 'doc', id: 'sdk/ios/faq', label: 'FAQ'}
      ],
    },
    {
      type: 'category',
      label: 'Android SDK',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/android/installation', label: 'Installation'},
        {type: 'doc', id: 'sdk/android/maven-installation', label: 'Maven Installation'},
        {type: 'doc', id: 'sdk/android/configuration', label: 'Configuration'},
        {type: 'doc', id: 'sdk/android/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/android/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/android/network', label: 'Network events'},
        {type: 'doc', id: 'sdk/android/logs', label: 'Console logs'},
        {
      type: 'category',
      label: 'Privacy',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/android/privacy/overview', label: 'Overview'},
        {type: 'doc', id: 'sdk/android/privacy/video', label: 'Video'},
        {type: 'doc', id: 'sdk/android/privacy/logs', label: 'Console logs'},
        {type: 'doc', id: 'sdk/android/privacy/network', label: 'Network'},
        {type: 'doc', id: 'sdk/android/privacy/report', label: 'Report'},
        {type: 'doc', id: 'sdk/android/privacy/cleanup', label: 'Cleanup'}
      ],
    },
        {type: 'doc', id: 'sdk/android/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/android/appearance', label: 'Appearance'},
        {type: 'doc', id: 'sdk/android/lifecycle', label: 'Lifecycle events'},
        {type: 'doc', id: 'sdk/android/crashes', label: 'Crash reports'},
        {type: 'doc', id: 'sdk/android/gradle-plugin', label: 'Gradle plugin'},
        {type: 'doc', id: 'sdk/android/gradle-plugin-releases', label: 'Gradle plugin releases'},
        {type: 'doc', id: 'sdk/android/release-notes', label: 'Release notes'},
        {type: 'doc', id: 'sdk/android/faq', label: 'FAQ'}
      ],
    },
    {
      type: 'category',
      label: 'Android SDK 7.x (Beta)',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Installation',
          collapsed: true,
          items: [
            {type: 'doc', id: 'sdk/android/v7/installation', label: 'Gradle plugin (recommended)'},
            {type: 'doc', id: 'sdk/android/v7/maven-installation', label: 'Maven / direct dependency'},
            {type: 'doc', id: 'sdk/android/v7/multi-process', label: 'Multi-process apps'},
          ],
        },
        {type: 'doc', id: 'sdk/android/v7/migration', label: 'Migrating from 6.x'},
        {
          type: 'category',
          label: 'Configuration',
          collapsed: true,
          items: [
            {type: 'doc', id: 'sdk/android/v7/configuration/overview', label: 'Core SDK options'},
            {type: 'doc', id: 'sdk/android/v7/configuration/ndk', label: 'NDK extension'},
            {type: 'doc', id: 'sdk/android/v7/configuration/leak', label: 'Leak extension'},
          ],
        },
        {type: 'doc', id: 'sdk/android/v7/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/android/v7/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/android/v7/network', label: 'Network events'},
        {type: 'doc', id: 'sdk/android/v7/logs', label: 'Console logs'},
        {
          type: 'category',
          label: 'Privacy',
          collapsed: true,
          items: [
            {type: 'doc', id: 'sdk/android/v7/privacy/overview', label: 'Overview'},
            {type: 'doc', id: 'sdk/android/v7/privacy/video', label: 'Video'},
            {type: 'doc', id: 'sdk/android/v7/privacy/logs', label: 'Console logs'},
            {type: 'doc', id: 'sdk/android/v7/privacy/network', label: 'Network'},
            {type: 'doc', id: 'sdk/android/v7/privacy/breadcrumbs', label: 'Breadcrumbs'},
            {type: 'doc', id: 'sdk/android/v7/privacy/report', label: 'Report'},
            {type: 'doc', id: 'sdk/android/v7/privacy/cleanup', label: 'Cleanup'}
          ],
        },
        {type: 'doc', id: 'sdk/android/v7/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/android/v7/appearance', label: 'Appearance'},
        {type: 'doc', id: 'sdk/android/v7/lifecycle', label: 'Lifecycle events'},
        {
          type: 'category',
          label: 'Issue detection',
          collapsed: true,
          items: [
            {type: 'doc', id: 'sdk/android/v7/issue-detection/overview', label: 'Overview'},
            {type: 'doc', id: 'sdk/android/v7/issue-detection/crashes', label: 'Crashes'},
            {type: 'doc', id: 'sdk/android/v7/issue-detection/native-crashes', label: 'Native crashes (NDK)'},
            {type: 'doc', id: 'sdk/android/v7/issue-detection/hangs', label: 'Hangs'},
            {type: 'doc', id: 'sdk/android/v7/issue-detection/exits', label: 'Abnormal exits'},
            {type: 'doc', id: 'sdk/android/v7/issue-detection/main-thread-misuse', label: 'Main-thread misuse'},
            {type: 'doc', id: 'sdk/android/v7/issue-detection/http-errors', label: 'HTTP errors'},
            {type: 'doc', id: 'sdk/android/v7/issue-detection/anomaly', label: 'Anomaly'},
            {type: 'doc', id: 'sdk/android/v7/issue-detection/frustration', label: 'Frustration'},
            {type: 'doc', id: 'sdk/android/v7/issue-detection/leaks', label: 'Memory & thread leaks'},
          ],
        },
        {type: 'doc', id: 'sdk/android/v7/performance', label: 'Performance monitoring'},
        {
          type: 'category',
          label: 'Extensibility',
          collapsed: true,
          items: [
            {type: 'doc', id: 'sdk/android/v7/extensibility/overview', label: 'Overview'},
            {type: 'doc', id: 'sdk/android/v7/extensibility/bugsee-extensions', label: 'Bugsee extensions'},
            {type: 'doc', id: 'sdk/android/v7/extensibility/custom-extensions', label: 'Custom extensions'},
          ],
        },
        {type: 'doc', id: 'sdk/android/v7/gradle-plugin', label: 'Gradle plugin'},
        {
          type: 'category',
          label: 'Builds',
          collapsed: true,
          items: [
            {type: 'doc', id: 'sdk/android/v7/builds/overview', label: 'Overview'},
            {type: 'doc', id: 'sdk/android/v7/builds/timings', label: 'Timings'},
            {type: 'doc', id: 'sdk/android/v7/builds/dependencies', label: 'Dependencies'},
            {type: 'doc', id: 'sdk/android/v7/builds/vulnerabilities', label: 'Vulnerabilities'},
            {type: 'doc', id: 'sdk/android/v7/build-size-analysis', label: 'Size analysis'},
          ],
        },
        {type: 'doc', id: 'sdk/android/v7/startup-overhead', label: 'App launch overhead'},
        {type: 'doc', id: 'sdk/android/v7/release-notes', label: 'Release notes'},
        {type: 'doc', id: 'sdk/android/v7/faq', label: 'FAQ'}
      ],
    },
    {
      type: 'category',
      label: 'Cordova SDK',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/cordova/installation', label: 'Installation'},
        {type: 'doc', id: 'sdk/cordova/configuration', label: 'Configuration'},
        {type: 'doc', id: 'sdk/cordova/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/cordova/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/cordova/logs', label: 'Console logs'},
        {
      type: 'category',
      label: 'Privacy',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/cordova/privacy/overview', label: 'Overview'},
        {type: 'doc', id: 'sdk/cordova/privacy/video', label: 'Video'},
        {type: 'doc', id: 'sdk/cordova/privacy/network', label: 'Network'},
        {type: 'doc', id: 'sdk/cordova/privacy/logs', label: 'Console logs'}
      ],
    },
        {type: 'doc', id: 'sdk/cordova/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/cordova/release-notes', label: 'Release notes'}
      ],
    },
    {
      type: 'category',
      label: 'React Native SDK',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/react_native/installation', label: 'Installation'},
        {type: 'doc', id: 'sdk/react_native/configuration', label: 'Configuration'},
        {type: 'doc', id: 'sdk/react_native/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/react_native/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/react_native/logs', label: 'Console logs'},
        {
      type: 'category',
      label: 'Privacy',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/react_native/privacy/overview', label: 'Overview'},
        {type: 'doc', id: 'sdk/react_native/privacy/video', label: 'Video'},
        {type: 'doc', id: 'sdk/react_native/privacy/network', label: 'Network'},
        {type: 'doc', id: 'sdk/react_native/privacy/logs', label: 'Console logs'}
      ],
    },
        {type: 'doc', id: 'sdk/react_native/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/react_native/network', label: 'Network capture'},
        {type: 'doc', id: 'sdk/react_native/lifecycle', label: 'Lifecycle events'},
        {type: 'doc', id: 'sdk/react_native/crashes', label: 'Crash reports'},
        {type: 'doc', id: 'sdk/react_native/errorboundary', label: 'Error boundary'},
        {type: 'doc', id: 'sdk/react_native/release-notes', label: 'Release notes'}
      ],
    },
    {
      type: 'category',
      label: 'Unity SDK',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/unity/installation', label: 'Installation'},
        {type: 'doc', id: 'sdk/unity/configuration', label: 'Configuration'},
        {type: 'doc', id: 'sdk/unity/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/unity/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/unity/logs', label: 'Console logs'},
        {
      type: 'category',
      label: 'Privacy',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/unity/privacy/overview', label: 'Overview'},
        {type: 'doc', id: 'sdk/unity/privacy/video', label: 'Video'},
        {type: 'doc', id: 'sdk/unity/privacy/logs', label: 'Console logs'},
        {type: 'doc', id: 'sdk/unity/privacy/network', label: 'Network'}
      ],
    },
        {type: 'doc', id: 'sdk/unity/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/unity/appearance', label: 'Appearance'},
        {type: 'doc', id: 'sdk/unity/crashes', label: 'Crash reports'},
        {type: 'doc', id: 'sdk/unity/lifecycle', label: 'Lifecycle events'},
        {type: 'doc', id: 'sdk/unity/release-notes', label: 'Release notes'},
        {type: 'doc', id: 'sdk/unity/versions', label: 'Versions'}
      ],
    },
    {
      type: 'category',
      label: '.NET SDK',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/dotnet/installation', label: 'Installation'},
        {type: 'doc', id: 'sdk/dotnet/configuration', label: 'Configuration'},
        {type: 'doc', id: 'sdk/dotnet/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/dotnet/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/dotnet/logs', label: 'Console logs'},
        {
      type: 'category',
      label: 'Privacy',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/dotnet/privacy/overview', label: 'Overview'},
        {type: 'doc', id: 'sdk/dotnet/privacy/video', label: 'Video'},
        {type: 'doc', id: 'sdk/dotnet/privacy/logs', label: 'Console logs'},
        {type: 'doc', id: 'sdk/dotnet/privacy/network', label: 'Network'},
        {type: 'doc', id: 'sdk/dotnet/privacy/cleanup', label: 'Cleanup'}
      ],
    },
        {type: 'doc', id: 'sdk/dotnet/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/dotnet/appearance', label: 'Appearance'},
        {type: 'doc', id: 'sdk/dotnet/network', label: 'Network capture'},
        {type: 'doc', id: 'sdk/dotnet/lifecycle', label: 'Lifecycle events'},
        {type: 'doc', id: 'sdk/dotnet/symbolication', label: 'Crash symbolication'},
        {type: 'doc', id: 'sdk/dotnet/release-notes', label: 'Release notes'}
      ],
    },
    {
      type: 'category',
      label: 'Flutter SDK',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/flutter/installation', label: 'Installation'},
        {type: 'doc', id: 'sdk/flutter/configuration', label: 'Configuration'},
        {type: 'doc', id: 'sdk/flutter/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/flutter/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/flutter/logs', label: 'Console logs'},
        {
      type: 'category',
      label: 'Privacy',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/flutter/privacy/overview', label: 'Overview'},
        {type: 'doc', id: 'sdk/flutter/privacy/video', label: 'Video'},
        {type: 'doc', id: 'sdk/flutter/privacy/logs', label: 'Console logs'},
        {type: 'doc', id: 'sdk/flutter/privacy/network', label: 'Network'}
      ],
    },
        {type: 'doc', id: 'sdk/flutter/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/flutter/appearance', label: 'Appearance'},
        {type: 'doc', id: 'sdk/flutter/network', label: 'Network capture'},
        {type: 'doc', id: 'sdk/flutter/lifecycle', label: 'Lifecycle events'},
        {type: 'doc', id: 'sdk/flutter/symbolication', label: 'Crash symbolication'},
        {type: 'doc', id: 'sdk/flutter/release-notes', label: 'Release notes'}
      ],
    },
    {
      type: 'category',
      label: 'KMP SDK (Beta)',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/kmp/installation', label: 'Installation'},
        {type: 'doc', id: 'sdk/kmp/configuration', label: 'Configuration'},
        {type: 'doc', id: 'sdk/kmp/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/kmp/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/kmp/logs', label: 'Console logs'},
        {
      type: 'category',
      label: 'Privacy',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/kmp/privacy/overview', label: 'Overview'},
        {type: 'doc', id: 'sdk/kmp/privacy/video', label: 'Video'},
        {type: 'doc', id: 'sdk/kmp/privacy/logs', label: 'Console logs'},
        {type: 'doc', id: 'sdk/kmp/privacy/network', label: 'Network'}
      ],
    },
        {type: 'doc', id: 'sdk/kmp/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/kmp/appearance', label: 'Appearance'},
        {type: 'doc', id: 'sdk/kmp/network', label: 'Network capture'},
        {type: 'doc', id: 'sdk/kmp/lifecycle', label: 'Lifecycle events'},
        {type: 'doc', id: 'sdk/kmp/debug-symbols', label: 'Debug symbols'},
        {type: 'doc', id: 'sdk/kmp/release-notes', label: 'Release notes'}
      ],
    },
    {
      type: 'category',
      label: 'Xamarin SDK (Deprecated)',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/xamarin/installation', label: 'Installation'},
        {type: 'doc', id: 'sdk/xamarin/configuration', label: 'Configuration'},
        {type: 'doc', id: 'sdk/xamarin/manual', label: 'Manual invocation'},
        {type: 'doc', id: 'sdk/xamarin/custom', label: 'Custom data'},
        {type: 'doc', id: 'sdk/xamarin/logs', label: 'Console logs'},
        {
      type: 'category',
      label: 'Privacy',
      collapsed: true,
      items: [
        {type: 'doc', id: 'sdk/xamarin/privacy/overview', label: 'Overview'},
        {type: 'doc', id: 'sdk/xamarin/privacy/video', label: 'Video'},
        {type: 'doc', id: 'sdk/xamarin/privacy/logs', label: 'Console logs'},
        {type: 'doc', id: 'sdk/xamarin/privacy/network', label: 'Network'}
      ],
    },
        {type: 'doc', id: 'sdk/xamarin/feedback', label: 'Feedback'},
        {type: 'doc', id: 'sdk/xamarin/appearance', label: 'Appearance'},
        {type: 'doc', id: 'sdk/xamarin/network', label: 'Network capture'},
        {type: 'doc', id: 'sdk/xamarin/lifecycle', label: 'Lifecycle events'},
        {type: 'doc', id: 'sdk/xamarin/symbolication', label: 'Crash symbolication'},
        {type: 'doc', id: 'sdk/xamarin/release-notes', label: 'Release notes'}
      ],
    },
    {
      type: 'category',
      label: 'Dashboard',
      collapsed: true,
      items: [
        {type: 'doc', id: 'dashboard/search', label: 'Search'},
        {
      type: 'category',
      label: 'Accounts',
      collapsed: true,
      items: [
        {type: 'doc', id: 'dashboard/accounts/2fa', label: '2FA'},
        {
      type: 'category',
      label: 'SSO',
      collapsed: true,
      items: [
        {type: 'doc', id: 'dashboard/accounts/sso/index', label: 'Overview'},
        {
      type: 'category',
      label: 'Instructions',
      collapsed: true,
      items: [
        {type: 'doc', id: 'dashboard/accounts/sso/instructions/config-aws', label: 'SSO in AWS'},
        {type: 'doc', id: 'dashboard/accounts/sso/instructions/config-azure', label: 'SSO in Azure'},
        {type: 'doc', id: 'dashboard/accounts/sso/instructions/config-gsuite', label: 'SSO in Google Workspace'},
        {type: 'doc', id: 'dashboard/accounts/sso/instructions/config-jumpcloud', label: 'SSO in JumpCloud'}
      ],
    }
      ],
    }
      ],
    }
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      collapsed: true,
      items: [
        {type: 'doc', id: 'integrations/index', label: 'Overview'},
        {type: 'doc', id: 'integrations/auth', label: 'Authentication'},
        {type: 'doc', id: 'integrations/configuration', label: 'Configuration'},
        {
      type: 'category',
      label: 'Providers',
      collapsed: true,
      items: [
        {type: 'doc', id: 'integrations/providers/aha/index', label: 'Aha'},
        {type: 'doc', id: 'integrations/providers/asana/index', label: 'Asana'},
        {type: 'doc', id: 'integrations/providers/azure_devops/index', label: 'Azure DevOps'},
        {type: 'doc', id: 'integrations/providers/basecamp/index', label: 'Basecamp'},
        {type: 'doc', id: 'integrations/providers/bitbucket/index', label: 'Bitbucket'},
        {type: 'doc', id: 'integrations/providers/bugherd/index', label: 'BugHerd'},
        {type: 'doc', id: 'integrations/providers/bugzilla/index', label: 'Bugzilla'},
        {type: 'doc', id: 'integrations/providers/clickup/index', label: 'ClickUp'},
        {type: 'doc', id: 'integrations/providers/datadog/index', label: 'Datadog'},
        {type: 'doc', id: 'integrations/providers/freshdesk/index', label: 'Freshdesk'},
        {type: 'doc', id: 'integrations/providers/github/index', label: 'GitHub'},
        {type: 'doc', id: 'integrations/providers/gitlab/index', label: 'GitLab'},

        {type: 'doc', id: 'integrations/providers/hubspot/index', label: 'Hubspot'},
        {type: 'doc', id: 'integrations/providers/itop/index', label: 'iTop'},
        {type: 'doc', id: 'integrations/providers/jira/index', label: 'Jira'},
        {type: 'doc', id: 'integrations/providers/linear/index', label: 'Linear'},
        {type: 'doc', id: 'integrations/providers/mantisbt/index', label: 'Mantis'},
        {type: 'doc', id: 'integrations/providers/monday/index', label: 'Monday'},
        {type: 'doc', id: 'integrations/providers/microsoft_teams/index', label: 'Microsoft Teams'},
        {type: 'doc', id: 'integrations/providers/notion/index', label: 'Notion'},
        {type: 'doc', id: 'integrations/providers/odoo/index', label: 'Odoo'},
        {type: 'doc', id: 'integrations/providers/pivotal/index', label: 'Pivotal Tracker'},
        {type: 'doc', id: 'integrations/providers/redmine/index', label: 'Redmine'},
        {type: 'doc', id: 'integrations/providers/shortcut/index', label: 'Shortcut'},
        {type: 'doc', id: 'integrations/providers/slack/index', label: 'Slack'},
        {type: 'doc', id: 'integrations/providers/splunk/index', label: 'Splunk'},
        {type: 'doc', id: 'integrations/providers/targetprocess/index', label: 'TargetProcess'},
        {type: 'doc', id: 'integrations/providers/teamwork_projects/index', label: 'Teamwork Projects'},
        {type: 'doc', id: 'integrations/providers/trello/index', label: 'Trello'},
        {type: 'doc', id: 'integrations/providers/vsts/index', label: 'VSTS'},
        {type: 'doc', id: 'integrations/providers/wrike/index', label: 'Wrike'},
        {type: 'doc', id: 'integrations/providers/youtrack/index', label: 'YouTrack'},
        {type: 'doc', id: 'integrations/providers/zendesk/index', label: 'Zendesk'},
        {type: 'doc', id: 'integrations/providers/zoho_desk/index', label: 'Zoho Desk'},
        {type: 'doc', id: 'integrations/providers/zoho_projects/index', label: 'Zoho Projects'}
      ],
    },
        {
      type: 'category',
      label: 'Custom recipes',
      collapsed: true,
      items: [
        {type: 'doc', id: 'integrations/recipes/recipes', label: 'Overview'},
        {type: 'doc', id: 'integrations/recipes/recipes_issues', label: 'Issue-based'},
        {type: 'doc', id: 'integrations/recipes/recipes_notifications', label: 'Event-based'},
        {type: 'doc', id: 'integrations/recipes/testing', label: 'Testing recipes'}
      ],
    }
      ],
    },
    {
      type: 'category',
      label: 'Webhooks',
      collapsed: true,
      items: [
        {type: 'doc', id: 'webhooks/index', label: 'Overview'},
        {type: 'doc', id: 'webhooks/configuration', label: 'Configuration'},
        {type: 'doc', id: 'webhooks/events', label: 'Events'}
      ],
    },
    {
      type: 'category',
      label: 'Bugsee CLI',
      collapsed: true,
      items: [
        {type: 'doc', id: 'cli/index', label: 'Overview'},
        {type: 'doc', id: 'cli/installation', label: 'Installation'},
        {type: 'doc', id: 'cli/configuration', label: 'Configuration'},
        {type: 'doc', id: 'cli/debug-files', label: 'Debug information files'},
        {type: 'doc', id: 'cli/sourcemaps', label: 'Source maps'},
        {type: 'doc', id: 'cli/builds', label: 'Builds & artefacts'},
        {type: 'doc', id: 'cli/xcode', label: 'iOS build publishing'},
        {type: 'doc', id: 'cli/metadata', label: 'Build metadata resolvers'},
        {type: 'doc', id: 'cli/update', label: 'Updating the CLI'},
        {type: 'doc', id: 'cli/exit-codes', label: 'Exit codes & telemetry'},
        {type: 'doc', id: 'cli/commands', label: 'Command reference'},
      ],
    },
    {
      type: 'category',
      label: 'Tools',
      collapsed: true,
      items: [
        {type: 'doc', id: 'tools/sourcemaps', label: 'Source maps'}
      ],
    },
    {
      type: 'category',
      label: 'Bugsee for AI',
      collapsed: true,
      items: [
        {type: 'doc', id: 'ai/index', label: 'Overview'},
        {
          type: 'category',
          label: 'Plugins',
          collapsed: true,
          items: [
            {type: 'doc', id: 'ai/plugins/index', label: 'Overview'},
            {type: 'doc', id: 'ai/plugins/claude-code', label: 'Claude Code'},
            {type: 'doc', id: 'ai/plugins/codex', label: 'Codex'},
            {type: 'doc', id: 'ai/plugins/other-agents', label: 'Other agents'},
          ],
        },
        {type: 'doc', id: 'ai/agent-skills/index', label: 'Agent Skills'},
        {
          type: 'category',
          label: 'MCP',
          collapsed: true,
          items: [
            {type: 'doc', id: 'mcp/index', label: 'Overview'},
            {type: 'doc', id: 'mcp/configuration', label: 'Configuration'},
            {type: 'doc', id: 'mcp/usage', label: 'Usage'},
            {type: 'doc', id: 'mcp/security', label: 'Security'},
          ],
        },
      ],
    }
  ],
};

export default sidebars;
