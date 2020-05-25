import React from 'react';

import IssueFilter from './IssueFilter.jsx';
import IssueAdd from './IssueAdd.jsx';
import IssueTable from './IssueTable.jsx';
import graphQLFetch from './graphQLFetch.js';

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }

  async loadData() {
    const query = `query {
      issueList {
        id
        title
        status
        owner
        created
        effort
        due
      }
    }`;

    const data = await graphQLFetch(query);
    console.log(data);
    if (data) {
      console.log(data);
      this.setState({ issues: data.issueList });
    }
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </React.Fragment>
    );
  }
}

export default IssueList;
