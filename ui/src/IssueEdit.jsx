import React from 'react';

export default function IssueEdit({ match }) {
  const { id } = match.params;
  return <h2>{`This is a placeholder for edit issue ${id}`}</h2>;
}
