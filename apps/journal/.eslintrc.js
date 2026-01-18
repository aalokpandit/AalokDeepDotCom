/**
 * ESLint config scoped to the journal app to avoid pulling the root config, which was causing a circular JSON issue.
 */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
};
