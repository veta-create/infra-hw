module.exports = async ({ github, context }) => {
  const fs = require('fs');
  const [owner, repo] = `${context.payload.repository.full_name}`.split('/');
  const title = `Релиз: ${(new Date()).toISOString()} автор: ${context.actor}`;

  const issuePayload = {
    owner,
    repo,
    labels: ['RELEASE']
  };

  const issues = await github.rest.issues.listForRepo({ ...issuePayload, state: 'all' });
  const issue = issues.data.find(issue => issue.title === title);

  // Если существует уже это ишью, просто обновляем его
  if (issue) {
    const update = {
      ...issuePayload,
      issue_number: issue.number,
      state: 'open',
      body: fs.readFileSync('CHANGELOG.md').toString(),
    };

    await github.rest.issues.update(update);

    return;
  } else {
    const create = {
      ...issuePayload,
      body: fs.readFileSync('CHANGELOG.md').toString(),
      title: title,
    };

    await github.rest.issues.create(create);
  }
}
