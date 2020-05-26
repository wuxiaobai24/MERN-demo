import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';

const IssueRow = withRouter(({ issue, location: { search } }) => {
  const selectLocation = { pathname: `/issues/${issue.id}`, search };
  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.created.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : ' '}</td>
      <td>{issue.title}</td>
      <td>
        <Link to={`/edit/${issue.id}`}>Edit</Link>
        {' | '}
        <NavLink to={selectLocation}>Select</NavLink>
      </td>
    </tr>
  );
});

function IssueTable(props) {
  const issueRow = props.issues.map((issue) => (
    <IssueRow key={issue.id} issue={issue} />
  ));
  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{issueRow}</tbody>
    </table>
  );
}

export default IssueTable;
