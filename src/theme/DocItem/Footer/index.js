import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

const ISSUES_NEW_URL = 'https://github.com/bugsee/docs/issues/new';

function ReportIssueLink() {
  const {metadata} = useDoc();
  const {siteConfig} = useDocusaurusContext();

  const pageTitle = metadata.title || 'Documentation';
  const pageUrl = `${siteConfig.url}${metadata.permalink || ''}`;

  const body =
    `Page: ${pageUrl}\n\n` +
    'Describe the typo, error, or unclear/outdated content:\n\n';
  const href =
    `${ISSUES_NEW_URL}?title=${encodeURIComponent(`Docs issue: ${pageTitle}`)}` +
    `&body=${encodeURIComponent(body)}`;

  return (
    <div className={styles.reportIssue}>
      Found an issue, typo, or wrong statement on this page?{' '}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.reportIssueLink}>
        Report it now &rarr;
      </a>
    </div>
  );
}

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <ReportIssueLink />
    </>
  );
}
