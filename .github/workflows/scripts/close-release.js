module.exports = async ({ github, context }) => {
  const [owner, repo] = '${{ github.repository }}'.split('/');
  const base = 'stable';
  const head = 'release-${{ github.ref_name }}';
  const issue_number = ${{ needs.issue.outputs.issue_number }};
  const prBody = 'This is a pull request for release. Closes #' + issue_number;
  const title = `Release ${head} by ${{ github.actor }}`;
  const pr = { owner, repo, base, head, body: prBody, title };

  const pulls = await github.rest.pulls.list({ owner, repo, state: 'open', head: `${owner}:${head}` });
  const existingPr = pulls.data.find(p => p.title === title);

  if (existingPr) {
    const update = { owner, repo, pull_number: existingPr.number, body: prBody };
    await github.rest.pulls.update(update);
  } else {
    await github.rest.pulls.create({ ...pr });
  }
}
