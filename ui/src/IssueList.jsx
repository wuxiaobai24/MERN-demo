import React from 'react';
import URLSearchParams from 'url-search-params';

import IssueFilter from './IssueFilter.jsx';
import IssueAdd from './IssueAdd.jsx';
import IssueTable from './IssueTable.jsx';
import IssueDetail from './IssueDetail.jsx';
import graphQLFetch from './graphQLFetch.js';
import { Route } from 'react-router-dom';

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
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) vars.status = params.get('status');

    const query = `query issueList($status: StatusType) {
      issueList(status: $status) {
        id
        title
        status
        owner
        created
        effort
        due
      }
    }`;

    const data = await graphQLFetch(query, vars);
    console.log(data);
    if (data) {
      console.log(data);
      this.setState({ issues: data.issueList });
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  render() {
    const { issue } = this.state;
    const { match } = this.props;
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
        <hr/>
        <Route path={`${match.path}/:id`} component={IssueDetail} />
      </React.Fragment>
    );
  }
}

export default IssueList;
