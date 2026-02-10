import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),
  route(':assignmentId', 'routes/assignment.tsx'),
  route('blanks', 'routes/blanks.tsx'),
  route('test', 'routes/test.tsx'),
  route('terms', 'routes/terms.tsx'),
  route('privacy', 'routes/privacy.tsx'),
  route('help', 'routes/help.tsx'),
  route('help/delete-account', 'routes/help/delete-account.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
